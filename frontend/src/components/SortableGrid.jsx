import { createContext, useContext } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DragHandleContext = createContext(null);

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DragHandleContext.Provider value={{ listeners, attributes }}>
        {children}
      </DragHandleContext.Provider>
    </div>
  );
}

// Renders sortable items inside a parent container
// The parent div should have the grid/flex layout
export default function SortableGrid({ items, renderItem, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const itemIds = items.map((item, i) => item._id || item.id || `item-${i}`);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(active.id);
    const newIndex = itemIds.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    onReorder(newItems);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        {items.map((item, index) => {
          const id = item._id || item.id || `item-${index}`;
          return (
            <SortableItem key={id} id={id}>
              {renderItem(item, index)}
            </SortableItem>
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

// Drag handle - always visible with grip icon
export function DragHandle({ style, className }) {
  const ctx = useContext(DragHandleContext);
  if (!ctx) return null;

  return (
    <span
      {...ctx.listeners}
      {...ctx.attributes}
      className={className}
      style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        cursor: 'grab',
        color: '#999',
        fontSize: '18px',
        padding: '4px 6px',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        touchAction: 'none',
        lineHeight: 1,
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '4px',
        zIndex: 10,
        ...style,
      }}
      title="Drag to reorder"
      onClick={(e) => e.stopPropagation()}
    >
      ⠿
    </span>
  );
}
