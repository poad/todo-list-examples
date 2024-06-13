import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origin from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as deployment from "aws-cdk-lib/aws-s3-deployment";

export interface Config extends cdk.StackProps {
  stackName: string;
  bucketName: string;
  cloudfront: {
    comment: string;
  };
}

interface CloudfrontCdnTemplateStackProps extends Config {
  environment?: string;
}

export class CloudfrontCdnTemplateStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CloudfrontCdnTemplateStackProps,
  ) {
    super(scope, id, props);

    const {
      stackName,
      bucketName,
      cloudfront: { comment },
    } = props;

    const s3bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      accessControl: s3.BucketAccessControl.PRIVATE,
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      websiteIndexDocument: 'index.html',
    });

		const deployRole = new iam.Role(this, "DeployWebsiteRole", {
			roleName: `${stackName}-deploy-role`,
			assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
			inlinePolicies: {
				"s3-policy": new iam.PolicyDocument({
					statements: [
						new iam.PolicyStatement({
							effect: iam.Effect.ALLOW,
							actions: ["s3:*"],
							resources: [`${s3bucket.bucketArn}/`, `${s3bucket.bucketArn}/*`],
						}),
					],
				}),
			},
		});

    const cf = new cloudfront.Distribution(this, 'CloudFront', {
      comment,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origin.S3Origin(s3bucket, {originId: 'origin1'}),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy:
        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

		new deployment.BucketDeployment(this, "DeployWebsite", {
			sources: [deployment.Source.asset(`${process.cwd()}/../dist`)],
			destinationBucket: s3bucket,
			destinationKeyPrefix: "/",
			exclude: [".DS_Store", "*/.DS_Store"],
			prune: true,
			retainOnDelete: false,
			role: deployRole,
		});

    new cdk.CfnOutput(this, 'AccessURLOutput', {
      value: `https://${cf.distributionDomainName}`,
    });
  }
}
