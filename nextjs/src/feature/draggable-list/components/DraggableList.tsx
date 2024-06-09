import { useCallback } from 'react';
import { DraggableItem } from './DraggableItem';
import { Item } from '@/feature/list-item/type';

type ItemViewParams<T> = {
  item: Item<T>;
  index: number;
};

export function DraggableList<T>({
  items,
  children,
  onChange,
}: {
  items: Item<T>[];
  children: (params: ItemViewParams<T>) => JSX.Element;
  onChange?: (dragIndex: number, hoverIndex: number) => void;
}) {
  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    onChange?.(dragIndex, hoverIndex);
  }, []);

  return (
    <>
      {items.map((item: { id: string; value: T }, index: number) => {
        return (
          <DraggableItem
            key={`draggable-item-${item.id}`}
            index={index}
            id={item.id}
            moveCard={moveItem}
          >
            <>{children({ item, index })}</>
          </DraggableItem>
        );
      })}
    </>
  );
}

export default DraggableList;
