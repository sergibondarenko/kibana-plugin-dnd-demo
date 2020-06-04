/* eslint-disable @kbn/eslint/require-license-header */
import {
  euiDragDropReorder,
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
  EuiPanel,
} from '@elastic/eui';
import React, { useState } from 'react';
import uuid from 'uuid/v4';

export function DragAndDrop() {
  const [list, setList] = useState([
    {
      content: 'One',
      id: uuid(),
    },
    {
      content: 'Two',
      id: uuid(),
    },
    {
      content: 'Three',
      id: uuid(),
    },
  ]);

  const onDragEnd = ({ source, destination }) => {
    if (source && destination) {
      const items = euiDragDropReorder(list, source.index, destination.index);

      setList(items);
    }
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      <EuiDragDropContext onDragEnd={onDragEnd}>
        <EuiDroppable droppableId="DROPPABLE_AREA" spacing="m" withPanel>
          {list.map(({ content, id }, idx) => (
            <EuiDraggable
              spacing="m"
              key={id}
              index={idx}
              draggableId={id}
              style={{ zIndex: 2147483647 }}
            >
              {(provided, state) => (
                <EuiPanel hasShadow={state.isDragging}>
                  {content}
                  {state.isDragging && ' ✨'}
                </EuiPanel>
              )}
            </EuiDraggable>
          ))}
        </EuiDroppable>
      </EuiDragDropContext>
    </div>
  );
}