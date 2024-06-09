import { ListItemState } from '../type';

type ListItemProps = ListItemState & {
  id: string;
  onChange?: (id: string, newValue: boolean) => void;
};

export function ListItem(props: ListItemProps) {

  return (
    <div key={`${props.id}-item-container`}>
      <input
        type="checkbox"
        {...props}
        onChange={(e) => {
          props.onChange?.(props.id, e.target.checked);
        }}
        key={`${props.id}-input`}
      />
      <label key={`${props.id}-label`} htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
}

export default ListItem;
