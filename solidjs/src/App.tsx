import { createSignal, For } from 'solid-js';

type Item = {
  id: string;
  label: string;
  value: string;
  checked: boolean;
};

const Sortable = (props: {
  item: Item;
  active: boolean;
  onChecked: (newValue: boolean) => void;
  onDragStart: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
  onDragEnd: () => void;
}) => (
  <div
    draggable="true"
    onDragStart={props.onDragStart}
    onDragOver={props.onDragOver}
    onDrop={props.onDrop}
    onDragEnd={props.onDragEnd}
    class={[
      'sortable m-2',
      {
        'opacity-25': props.active,
        'transition-transform': props.active,
      },
    ]}
  >
    <div class="border border-dotted rounded border-slate-500 w-24 mx-auto hover:cursor-grab">
      <label class="p-1 w-20 hover:cursor-grab">
        <input
          type="checkbox"
          checked={props.item.checked}
          value={props.item.value}
          onChange={(event) => props.onChecked(event.target.checked)}
          class="mx-2"
        />
        {props.item.label}
      </label>
    </div>
  </div>
);

export const App = () => {
  const [items, setItems] = createSignal<Item[]>([
    { id: '1', label: 'Item1', value: 'aaa', checked: false },
    { id: '2', label: 'Item2', value: 'bbb', checked: false },
    { id: '3', label: 'Item3', value: 'ccc', checked: false },
  ]);
  const [activeItem, setActiveItem] = createSignal<string | null>(null);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: DragEvent, targetId: string) => {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData('text/plain') || activeItem();
    if (draggedId === null || draggedId === targetId) {
      setActiveItem(null);
      return;
    }

    const currentItems = items();
    const fromIndex = currentItems.findIndex((item) => item.id === draggedId);
    const toIndex = currentItems.findIndex((item) => item.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1) {
      const updatedItems = currentItems.slice();
      updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
      setItems(updatedItems);
    }
    setActiveItem(null);
  };

  const handleChecked = (id: string, newValue: boolean): void => {
    const currentItems = items();
    const targetIndex = currentItems.findIndex((item) => item.id === id);
    if (targetIndex !== -1) {
      const updatedItems = currentItems.slice();
      updatedItems[targetIndex] = {
        ...updatedItems[targetIndex],
        checked: newValue,
      };
      setItems(updatedItems);
    }
  };

  return (
    <div class="w-full content-center justify-center text-center mt-4">
      <div class="column self-stretch">
        <For each={items()}>
          {(item) => (
            <Sortable
              item={item}
              active={activeItem() === item.id}
              onChecked={(newValue) => handleChecked(item.id, newValue)}
              onDragStart={(event) => {
                event.dataTransfer?.setData('text/plain', item.id);
                if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
                setActiveItem(item.id);
              }}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, item.id)}
              onDragEnd={() => setActiveItem(null)}
            />
          )}
        </For>
      </div>
    </div>
  );
};
