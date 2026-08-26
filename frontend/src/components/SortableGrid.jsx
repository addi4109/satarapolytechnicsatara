import { useState, useCallback, useRef } from 'react';

/**
 * SortableGrid — Simple drag-and-drop reordering.
 * Renders items inside the parent grid container.
 */
export default function SortableGrid({ items, renderItem, onReorder }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const handleDragStart = useCallback((e) => {
    const idx = e.currentTarget.dataset.sortIndex;
    if (idx === undefined) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx);
    setDragIdx(Number(idx));
    setTimeout(() => {
      e.currentTarget.style.opacity = '0.4';
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '1';
    setDragIdx(null);
    setOverIdx(null);
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIdx(idx);
  }, []);

  const handleDrop = useCallback((e, dropIdx) => {
    e.preventDefault();
    const fromIdx = Number(e.dataTransfer.getData('text/plain'));
    if (fromIdx === dropIdx || isNaN(fromIdx)) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(dropIdx, 0, moved);
    onReorder(newItems);
    setDragIdx(null);
    setOverIdx(null);
  }, [items, onReorder]);

  return (
    <>
      {items.map((item, index) => {
        const id = item._id || item.id || `item-${index}`;
        return (
          <div
            key={id}
            data-sort-index={index}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragLeave={() => setOverIdx(null)}
            style={{
              position: 'relative',
              opacity: dragIdx === index ? 0.4 : 1,
              outline: overIdx === index && dragIdx !== null && dragIdx !== index ? '2px dashed #c8963e' : 'none',
              outlineOffset: '-2px',
              transition: 'outline 0.15s',
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </>
  );
}

/**
 * DragHandle — A grip icon ⠿ that enables dragging of the parent card.
 * 
 * Uses onMouseDown to temporarily make the grandparent div draggable
 * before the native drag event fires.
 */
export function DragHandle({ style, className }) {
  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    // Walk up to find the div with data-sort-index
    let el = e.target.parentElement;
    while (el && el.dataset.sortIndex === undefined) {
      el = el.parentElement;
    }
    if (!el) return;

    // Make it draggable
    el.draggable = true;

    // Remove draggable when drag ends or mouse is released
    const cleanup = () => {
      el.draggable = false;
      document.removeEventListener('mouseup', cleanup);
      document.removeEventListener('dragend', cleanup);
    };
    document.addEventListener('mouseup', cleanup);
    el.addEventListener('dragend', cleanup, { once: true });
  }, []);

  return (
    <span
      className={className || 'sortable-drag-handle'}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        cursor: 'grab',
        color: '#999',
        fontSize: '18px',
        padding: '4px 6px',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        touchAction: 'none',
        lineHeight: 1,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '4px',
        zIndex: 10,
        border: '1px solid #e0e0e0',
        ...style,
      }}
      title="Drag to reorder"
      onClick={(e) => e.stopPropagation()}
    >
      ⠿
    </span>
  );
}
