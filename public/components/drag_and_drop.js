/* eslint-disable @kbn/eslint/require-license-header */

import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid from 'uuid/v4';
import { EuiAccordion, EuiButton, EuiPanel, EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui';

const _dragEl = document.getElementById('globalBannerList');

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: uuid(),
    content: (
      <EuiAccordion
      id="accordionExtra"
      buttonContent={`Click to open ${k}`}
      extraAction={<EuiButton size="s">Extra action!</EuiButton>}
      paddingSize="l"
      >
        <div>{`item ${k}`}</div>
      </EuiAccordion>
    )
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 2;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#bfdcd9' : '#ffffff',
  padding: grid,
  width: '100%',
});

export function DraggableItem({ provided, item }) {
  return (
    <EuiPanel>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <div {...provided.dragHandleProps}>
            <EuiIcon type="grab" />
          </div>
        </EuiFlexItem>
        <EuiFlexItem>{item.content}</EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}

export function DragAndDrop() {
  const [items, setItems] = useState(getItems(10));

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
 
    setItems(reorder(
      items,
      result.source.index,
      result.destination.index
    ));
  }

  function openPortal(style, element) {
    if (style.position === 'fixed') {
      return ReactDOM.createPortal(element, _dragEl);
    }
    return element;
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <EuiPanel paddingSize="none">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => {
                      return (
                        openPortal(provided.draggableProps.style, (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <DraggableItem provided={provided} item={item} />
                          </div>
                        ))
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </EuiPanel>
    </div>
  );
}