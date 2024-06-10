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

const Sortable = (props: { item: Id; }) => {
  const sortable = createSortable(props.item);
  const [state] = useDragDropContext() ?? [];
  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        'opacity-25': sortable.isActiveDraggable,
        'transition-transform': !!state?.active.draggable,
      }}
    >
      {props.item}
    </div>
  );
};

export const App = () => {
  const [items, setItems] = createSignal(['1', '2', '3']);
  const [activeItem, setActiveItem] = createSignal<Id | null>(null);
  const ids = () => items();

  const onDragStart = ({ draggable }: DragEvent) => setActiveItem(draggable.id);

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.indexOf(draggable.id.toString());
      const toIndex = currentItems.indexOf(droppable.id.toString());
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setItems(updatedItems);
      }
    }
  };

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <div class="column self-stretch">
        <SortableProvider ids={ids()}>
          <For each={items()}>{(item) => <Sortable item={item} />}</For>
        </SortableProvider>
      </div>
      <DragOverlay>
        <div class="bg-secondary text-white font-bold rounded-lg shadow p-4">{activeItem()}</div>
      </DragOverlay>
    </DragDropProvider>
  );
};
