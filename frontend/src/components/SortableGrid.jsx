import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Individual sortable item wrapper
function SortableItem({ id, children, style }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    ...style,
  };

  return (
    <div ref={setNodeRef} style={dragStyle} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// Main SortableGrid component
// items: array of objects with at least an _id or id field
// renderItem: function(item, index) => React element
// onReorder: function(newItems) => void
// gridStyle: optional grid container style
export default function SortableGrid({ items, renderItem, onReorder, gridStyle, className }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Generate stable IDs
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
        <div className={className} style={gridStyle}>
          {items.map((item, index) => {
            const id = item._id || item.id || `item-${index}`;
            return (
              <SortableItem key={id} id={id}>
                {renderItem(item, index)}
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Simple vertical list sortable (for rows like info rows, fee rows)
export function SortableList({ items, renderItem, onReorder, className, style }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const itemIds = items.map((item, i) => item._id || item.id || `row-${i}`);

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
        <div className={className} style={style}>
          {items.map((item, index) => {
            const id = item._id || item.id || `row-${index}`;
            return (
              <SortableItem key={id} id={id}>
                {renderItem(item, index)}
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Drag handle component - put this inside your rendered items
export function DragHandle({ style }) {
  return (
    <span
      style={{
        cursor: 'grab',
        color: '#aaa',
        fontSize: '16px',
        padding: '4px',
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
      title="Drag to reorder"
    >
      ⠿
    </span>
  );
}
