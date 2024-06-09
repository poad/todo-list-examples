#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {
  CloudfrontCdnTemplateStack,
} from '../lib/cloudfront-cdn-template-stack';

const app = new cdk.App();

const env = app.node.tryGetContext('env');
const config = env
  ? app.node.tryGetContext(env)
  : app.node.tryGetContext('default');

const stack = new CloudfrontCdnTemplateStack(app, config.stackName, {
  ...config,
  stackName: config.stackName,
  environment: env,
  env: {
    account: app.account,
    region: app.region,
  },
});

if (config.tags && config.tags.length > 0) {
  config.tags.array.forEach(
    ({ name, value }: { name: string; value: string }) => {
      cdk.Tags.of(stack).add(name, value);
    },
  );
}
