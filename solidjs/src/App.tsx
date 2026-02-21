import { Id, useDragDropContext } from '@thisbeyond/solid-dnd';
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  type DragEvent,
  type DragEventHandler,
} from '@thisbeyond/solid-dnd';
import { createSignal, For } from 'solid-js';

const Sortable = (props: {
  id: Id;
  label: string;
  value: string;
  checked: boolean;
  onChecked?: (newValue: boolean) => void },
) => {
  const sortable = createSortable(props.id, {
    label: props.label,
    value: props.value,
    checked: props.checked,
  });
  const [state] = useDragDropContext() ?? [];
  return (
    <div
      use:sortable
      class="sortable m-2"
      classList={{
        'opacity-25': sortable.isActiveDraggable,
        'transition-transform': !!state?.active.draggable,
      }}
    >
      <div class='border border-dotted rounded border-slate-500 w-24 mx-auto hover:cursor-grab'>
        <label class="p-1 w-20 hover:cursor-grab">
          <input
            type="checkbox"
            checked={props.checked}
            value={props.value}
            onChange={(event) => props.onChecked?.(event.target.checked)}
            class="mx-2"
          />
          {props.label}
        </label>
      </div>
    </div>
  );
};

export const App = () => {
  const [items, setItems] = createSignal([{
    id: '1',
    label: 'Item1',
    value: 'aaa',
    checked: false,
  },
  {
    id: '2',
    label: 'Item2',
    value: 'bbb',
    checked: false,
  },
  {
    id: '3',
    label: 'Item3',
    value: 'ccc',
    checked: false,
  }]);
  const [activeItem, setActiveItem] = createSignal<Id | null>(null);

  const onDragStart = ({ draggable }: DragEvent) => setActiveItem(draggable.id);

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = items();
      const fromIndex = currentItems.findIndex((item) => item.id === draggable.id.toString());
      const toIndex = currentItems.findIndex((item) => item.id === droppable.id.toString());
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setItems(updatedItems);
      }
    }
  };

  const handleChecked = (id: Id, newValue: boolean): void => {
    const currentItems = items();
    const targetIndex = currentItems.findIndex((i) => i.id === id);
    if (targetIndex != -1) {
      const updateItem = {
        ...currentItems[targetIndex],
        checked: newValue,
      };
      const updatedItems = currentItems.slice();
      updatedItems.splice(targetIndex, 1, updateItem);
      setItems(updatedItems);
    }
  };

  return (
    <div class="w-full content-center justify-center text-center mt-4">
      <DragDropProvider
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <div class="column self-stretch">
          <SortableProvider ids={items().map((item) => item.id)}>
            <For each={items()}>
              {(item) => <Sortable
                id={item.id}
                label={item.label}
                value={item.value}
                checked={item.checked}
                onChecked={(newValue) => handleChecked(item.id, newValue)}
              />}
            </For>
          </SortableProvider>
        </div>
        <DragOverlay>
          <div class="bg-secondary text-white font-bold rounded-lg shadow p-4">{activeItem()}</div>
        </DragOverlay>
      </DragDropProvider>
      {/* <ul>
        <For each={items()}>{(item) => <li>{item.value} - {`${item.checked}`}</li>}</For>
      </ul> */}
    </div>
  );
};
