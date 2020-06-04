(window["dndplugin_bundle_jsonpfunction"] = window["dndplugin_bundle_jsonpfunction"] || []).push([[0],{

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderApp = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

var _app = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const renderApp = ({
  notifications,
  http
}, {
  navigation
}, {
  appBasePath,
  element
}) => {
  _reactDom.default.render(_react.default.createElement(_app.DndpluginApp, {
    basename: appBasePath,
    notifications: notifications,
    http: http,
    navigation: navigation
  }), element);

  return () => _reactDom.default.unmountComponentAtNode(element);
};

exports.renderApp = renderApp;

/***/ }),

/***/ "./public/components/actions_panel.js":
/*!********************************************!*\
  !*** ./public/components/actions_panel.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsPanel = ActionsPanel;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _eui = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");

var _drag_and_drop = __webpack_require__(/*! ./drag_and_drop */ "./public/components/drag_and_drop.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const repeatableForm = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_drag_and_drop.DragAndDrop, null), _react.default.createElement(_eui.EuiForm, null, _react.default.createElement(_eui.EuiFlexGroup, null, _react.default.createElement(_eui.EuiFlexItem, null, _react.default.createElement(_eui.EuiFormRow, {
  label: "Username"
}, _react.default.createElement(_eui.EuiFieldText, {
  icon: "user",
  placeholder: "John"
}))), _react.default.createElement(_eui.EuiFlexItem, null, _react.default.createElement(_eui.EuiFormRow, {
  label: "Password",
  helpText: "Must include one number and one symbol"
}, _react.default.createElement(_eui.EuiFieldPassword, {
  icon: "lock"
})))), _react.default.createElement(_eui.EuiSpacer, {
  size: "m"
}), _react.default.createElement(_eui.EuiFormRow, {
  label: "Body"
}, _react.default.createElement(_eui.EuiTextArea, {
  placeholder: "I am a textarea, put some content in me!"
}))));

const buttonContent = _react.default.createElement("div", null, _react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "s",
  alignItems: "center",
  responsive: false
}, _react.default.createElement(_eui.EuiFlexItem, {
  grow: false
}, _react.default.createElement(_eui.EuiIcon, {
  type: "logoWebhook",
  size: "m"
})), _react.default.createElement(_eui.EuiFlexItem, null, _react.default.createElement(_eui.EuiTitle, {
  size: "s",
  className: "euiAccordionForm__title"
}, _react.default.createElement("h3", null, "Webhook")))), _react.default.createElement(_eui.EuiText, {
  size: "s"
}, _react.default.createElement("p", null, _react.default.createElement(_eui.EuiTextColor, {
  color: "subdued"
}, "Will send a POST request to www.example.com/some/path/"))));

const extraAction = _react.default.createElement(_eui.EuiButtonIcon, {
  iconType: "cross",
  color: "danger",
  className: "euiAccordionForm__extraAction",
  "aria-label": "Delete"
});

function ActionsPanel() {
  return _react.default.createElement("div", null, _react.default.createElement(_eui.EuiTitle, {
    size: "s"
  }, _react.default.createElement("h3", null, "I am a complicated, highly styled, repeatable form!")), _react.default.createElement(_eui.EuiSpacer, {
    size: "l"
  }), _react.default.createElement(_eui.EuiAccordion, {
    id: "accordionForm1",
    className: "euiAccordionForm",
    buttonClassName: "euiAccordionForm__button",
    buttonContent: buttonContent,
    extraAction: extraAction,
    paddingSize: "l"
  }, repeatableForm), _react.default.createElement(_eui.EuiAccordion, {
    id: "accordionForm2",
    className: "euiAccordionForm",
    buttonClassName: "euiAccordionForm__button",
    buttonContent: buttonContent,
    extraAction: extraAction,
    paddingSize: "l"
  }, repeatableForm));
}

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DndpluginApp = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _i18n = __webpack_require__(/*! @kbn/i18n */ "@kbn/i18n");

var _react2 = __webpack_require__(/*! @kbn/i18n/react */ "@kbn/i18n/react");

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _eui = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");

var _actions_panel = __webpack_require__(/*! ./actions_panel */ "./public/components/actions_panel.js");

var _drag_and_drop = __webpack_require__(/*! ./drag_and_drop */ "./public/components/drag_and_drop.js");

var _common = __webpack_require__(/*! ../../common */ "./common/index.ts");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const DndpluginApp = ({
  basename,
  notifications,
  http,
  navigation
}) => {
  // Use React hooks to manage state.
  const [timestamp, setTimestamp] = (0, _react.useState)();

  const onClickHandler = () => {
    // Use the core http service to make a response to the server API.
    http.get('/api/dndplugin/example').then(res => {
      setTimestamp(res.time); // Use the core notifications service to display a success message.

      notifications.toasts.addSuccess(_i18n.i18n.translate('dndplugin.dataUpdated', {
        defaultMessage: 'Data updated'
      }));
    });
  }; // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.


  return _react.default.createElement(_reactRouterDom.BrowserRouter, {
    basename: basename
  }, _react.default.createElement(_react2.I18nProvider, null, _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(navigation.ui.TopNavMenu, {
    appName: _common.PLUGIN_ID,
    showSearchBar: true
  }), _react.default.createElement(_eui.EuiPage, {
    restrictWidth: "1000px"
  }, _react.default.createElement(_eui.EuiPageBody, null, _react.default.createElement(_eui.EuiPageHeader, null, _react.default.createElement(_eui.EuiTitle, {
    size: "l"
  }, _react.default.createElement("h1", null, _react.default.createElement(_react2.FormattedMessage, {
    id: "dndplugin.helloWorldText",
    defaultMessage: "{name}",
    values: {
      name: _common.PLUGIN_NAME
    }
  })))), _react.default.createElement(_eui.EuiPageContent, null, _react.default.createElement(_eui.EuiPageContentHeader, null, _react.default.createElement(_eui.EuiTitle, null, _react.default.createElement("h2", null, _react.default.createElement(_react2.FormattedMessage, {
    id: "dndplugin.congratulationsTitle",
    defaultMessage: "Congratulations, you have successfully created a new Kibana Plugin!"
  })))), _react.default.createElement(_eui.EuiPageContentBody, null, _react.default.createElement(_eui.EuiText, null, _react.default.createElement("p", null, _react.default.createElement(_react2.FormattedMessage, {
    id: "dndplugin.content",
    defaultMessage: "Look through the generated code and check out the plugin development documentation."
  })), _react.default.createElement(_eui.EuiHorizontalRule, null), _react.default.createElement("p", null, _react.default.createElement(_react2.FormattedMessage, {
    id: "dndplugin.timestampText",
    defaultMessage: "Last timestamp: {time}",
    values: {
      time: timestamp ? timestamp : 'Unknown'
    }
  })), _react.default.createElement(_eui.EuiButton, {
    type: "primary",
    size: "s",
    onClick: onClickHandler
  }, _react.default.createElement(_react2.FormattedMessage, {
    id: "dndplugin.buttonText",
    defaultMessage: "Get data"
  }))), _react.default.createElement(_eui.EuiSpacer, null), _react.default.createElement(_drag_and_drop.DragAndDrop, null), _react.default.createElement(_eui.EuiSpacer, null), _react.default.createElement(_drag_and_drop.DragAndDrop, null), _react.default.createElement(_eui.EuiSpacer, null), _react.default.createElement(_actions_panel.ActionsPanel, null))))))));
};

exports.DndpluginApp = DndpluginApp;

/***/ }),

/***/ "./public/components/drag_and_drop.js":
/*!********************************************!*\
  !*** ./public/components/drag_and_drop.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragAndDrop = DragAndDrop;

var _eui = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _v = _interopRequireDefault(__webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* eslint-disable @kbn/eslint/require-license-header */
function DragAndDrop() {
  const [list, setList] = (0, _react.useState)([{
    content: 'One',
    id: (0, _v.default)()
  }, {
    content: 'Two',
    id: (0, _v.default)()
  }, {
    content: 'Three',
    id: (0, _v.default)()
  }]);

  const onDragEnd = ({
    source,
    destination
  }) => {
    if (source && destination) {
      const items = (0, _eui.euiDragDropReorder)(list, source.index, destination.index);
      setList(items);
    }
  }; // return ReactDOM.createPortal(
  //   <EuiDragDropContext onDragEnd={onDragEnd}>
  //     <EuiDroppable droppableId="DROPPABLE_AREA" spacing="m" withPanel>
  //       {list.map(({ content, id }, idx) => (
  //         <EuiDraggable spacing="m" key={id} index={idx} draggableId={id}>
  //           {(provided, state) => (
  //             <EuiPanel hasShadow={state.isDragging}>
  //               {content}
  //               {state.isDragging && ' ✨'}
  //             </EuiPanel>
  //           )}
  //         </EuiDraggable>
  //       ))}
  //     </EuiDroppable>
  //   </EuiDragDropContext>,
  //   document.createElement('div')
  // );
  // return (
  //   <EuiDragDropContext onDragEnd={onDragEnd}>
  //     <EuiDroppable droppableId="DROPPABLE_AREA" spacing="m" withPanel>
  //       {list.map(({ content, id }, idx) => (
  //         <EuiDraggable spacing="m" key={id} index={idx} draggableId={id}>
  //           {(provided, state) => (
  //             <EuiPanel hasShadow={state.isDragging}>
  //               {content}
  //               {state.isDragging && ' ✨'}
  //             </EuiPanel>
  //           )}
  //         </EuiDraggable>
  //       ))}
  //     </EuiDroppable>
  //   </EuiDragDropContext>
  // );


  return _react.default.createElement("div", {
    style: {
      overflowX: 'hidden'
    }
  }, _react.default.createElement(_eui.EuiDragDropContext, {
    onDragEnd: onDragEnd
  }, _react.default.createElement(_eui.EuiDroppable, {
    droppableId: "DROPPABLE_AREA",
    spacing: "m",
    withPanel: true
  }, list.map(({
    content,
    id
  }, idx) => _react.default.createElement(_eui.EuiDraggable, {
    spacing: "m",
    key: id,
    index: idx,
    draggableId: id,
    style: {
      zIndex: 2147483647
    }
  }, (provided, state) => _react.default.createElement(_eui.EuiPanel, {
    hasShadow: state.isDragging
  }, content, state.isDragging && ' ✨'))))));
}
/*
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
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
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(10),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);

    this.setState({
      items,
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
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
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export { DragAndDrop };
*/

/***/ })

}]);
//# sourceMappingURL=0.plugin.js.map