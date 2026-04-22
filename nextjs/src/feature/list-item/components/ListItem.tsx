import { ListItemState } from '../type';

type ListItemProps = ListItemState & {
  id: string;
  onChange?: (id: string, newValue: boolean) => void;
};

export function ListItem(props: ListItemProps) {
  return (
    <div key={`${props.id}-item-container`}>
      <label key={`${props.id}-label`} className="w-20 hover:cursor-grab">
        <input
          key={`${props.id}-input`}
          type="checkbox"
          {...props}
          onChange={(e) => {
            props.onChange?.(props.id, e.target.checked);
          }}
          className="mr-2"
        />
        {props.label}
      </label>
    </div>
  );
}

export default ListItem;
