export type ListItemState = {
  name: string;
  label: string;
  checked: boolean,

};

export interface Item<T> {
  id: string;
  value: T;
};
