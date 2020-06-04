/* eslint-disable @kbn/eslint/require-license-header */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid from 'uuid/v4';
import { EuiAccordion, EuiButton, EuiPanel, EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui';

// const _dragEl = document.getElementById('searchguarDraggable');
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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // background: '#ffffff',

  // styles we need to apply on draggables
  ...draggableStyle
});

function getPanelStyle(isDragging) {
  return {
    marginBottom: isDragging ? '0px' : '10px',
  };
}

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#bfdcd9' : '#ffffff',
  padding: grid,
  width: '100%',
});

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(10)
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  openPortal(style, element) {
    if (style.position === 'fixed') {
      return ReactDOM.createPortal(
        element,
        _dragEl,
      );
    }
    return element;
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div style={{ overflowX: 'hidden' }}>
        <EuiPanel paddingSize="none">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => {
                        return (
                          this.openPortal(provided.draggableProps.style, (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <EuiPanel style={getPanelStyle(snapshot.isDragging)}>
                                <EuiFlexGroup>
                                  <EuiFlexItem grow={false}>
                                    <div {...provided.dragHandleProps}>
                                      <EuiIcon type="grab" />
                                    </div>
                                  </EuiFlexItem>
                                  <EuiFlexItem>{item.content}</EuiFlexItem>
                                </EuiFlexGroup>
                              </EuiPanel>
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
}

export { DragAndDrop };
