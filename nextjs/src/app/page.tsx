'use client';

import ListItem from '@/feature/list-item/components';
import { Item, ListItemState } from '@/feature/list-item/type';
import DraggableList from '@/feature/draggable-list/components';
import update from 'immutability-helper';
import { useState } from 'react';

const list = [
  {
    id: '1',
    value: {
      name: 'item1',
      label: 'Item1',
      checked: false,
    },
  },
  {
    id: '2',
    value: {
      name: 'item2',
      label: 'Item2',
      checked: false,
    },
  },
  {
    id: '3',
    value: {
      name: 'item3',
      label: 'Item3',
      checked: false,
    },
  },
  {
    id: '4',
    value: {
      name: 'item4',
      label: 'Item4',
      checked: false,
    },
  },
];

export default function Home() {
  const [items, setItems] = useState(list);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <DraggableList<ListItemState>
          items={items}
          onChange={(dragIndex: number, hoverIndex: number) => {
            setItems((prevItems: Item<ListItemState>[]) =>
              update(prevItems, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, prevItems[dragIndex]],
                ],
              }),
            );
          }}
        >
          {({ item }) => (
            <ListItem
              id={item.id}
              {...item.value}
              onChange={(id, newValue) => {
                const index = items.findIndex((it) => it.id === id);
                if (index != -1) {
                  setItems((prevItems: Item<ListItemState>[]) => {
                    const prevItem = prevItems[index];
                    const newItem = {
                      ...prevItem,
                      value: {
                        ...prevItem.value,
                        checked: newValue,
                      },
                    };

                    const dest = update(prevItems, {
                      $splice: [
                        [index, 1],
                        [index, 0, newItem],
                      ],
                    });

                    return dest;
                  });
                }
              }}
            />
          )}
        </DraggableList>
      </form>
      {/* <ul>
        {items.map((item, index,) => (
          <li key={`debug-${index}`}>
            {index}: {item.value.name}: {`${item.value.checked}`}
          </li>
        ),)}
      </ul> */}
    </main>
  );
}
