/*! JsonTree.js v0.8.0 | (c) Bunoon 2024 | MIT License */
(function() {
  var _parameter_Document = null, _parameter_Window = null, _parameter_Navigator = null, _parameter_Math = null, _parameter_JSON = null, _public = {}, _configuration = {}, _elements_Type = {}, _elements_Data = {}, _string = {empty:"", space:" "}, _attribute_Name_Options = "data-jsontree-options";
  function render() {
    var tagTypes = _configuration.domElementTypes, tagTypesLength = tagTypes.length;
    for (var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]), elements = [].slice.call(domElements), elementsLength = elements.length;
      for (var elementIndex = 0; elementIndex < elementsLength; elementIndex++) {
        if (!renderElement(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function renderElement(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          renderControl(renderBindingOptions(bindingOptions.result, element));
        } else {
          if (!_configuration.safeMode) {
            console.error(_configuration.attributeNotValidErrorText.replace("{{attribute_name}}", _attribute_Name_Options));
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error(_configuration.attributeNotSetErrorText.replace("{{attribute_name}}", _attribute_Name_Options));
          result = false;
        }
      }
    }
    return result;
  }
  function renderBindingOptions(data, element) {
    var bindingOptions = buildAttributeOptions(data);
    bindingOptions.currentView = {};
    bindingOptions.currentView.element = element;
    return bindingOptions;
  }
  function renderControl(bindingOptions) {
    fireCustomTrigger(bindingOptions.onBeforeRender, bindingOptions.element);
    if (!isDefinedString(bindingOptions.currentView.element.id)) {
      bindingOptions.currentView.element.id = newGuid();
    }
    bindingOptions.currentView.element.className = "json-tree-js";
    bindingOptions.currentView.element.removeAttribute(_attribute_Name_Options);
    if (!_elements_Data.hasOwnProperty(bindingOptions.currentView.element.id)) {
      _elements_Data[bindingOptions.currentView.element.id] = {};
      _elements_Data[bindingOptions.currentView.element.id].options = bindingOptions;
      _elements_Data[bindingOptions.currentView.element.id].data = bindingOptions.data;
      delete bindingOptions.data;
    }
    renderControlContainer(bindingOptions);
    fireCustomTrigger(bindingOptions.onRenderComplete, bindingOptions.currentView.element);
  }
  function renderControlContainer(bindingOptions) {
    var data = _elements_Data[bindingOptions.currentView.element.id].data;
    bindingOptions.currentView.element.innerHTML = _string.empty;
    renderControlTitleBar(bindingOptions);
    if (isDefinedObject(data) && !isDefinedArray(data)) {
      renderObject(bindingOptions.currentView.element, bindingOptions, data);
    } else if (isDefinedArray(data)) {
      renderArray(bindingOptions.currentView.element, bindingOptions, data);
    }
  }
  function renderControlTitleBar(bindingOptions) {
    if (bindingOptions.showTitle || bindingOptions.showTitleTreeControls || bindingOptions.showTitleCopyButton) {
      var titleBar = createElement(bindingOptions.currentView.element, "div", "title-bar"), controls = createElement(titleBar, "div", "controls");
      if (bindingOptions.showTitle) {
        createElementWithHTML(titleBar, "div", "title", bindingOptions.titleText, controls);
      }
      if (bindingOptions.showTitleCopyButton) {
        var copy = createElementWithHTML(controls, "button", "copy-all", _configuration.copyAllButtonText);
        copy.onclick = function() {
          var copyData = _parameter_JSON.stringify(_elements_Data[bindingOptions.currentView.element.id].data);
          _parameter_Navigator.clipboard.writeText(copyData);
          fireCustomTrigger(bindingOptions.onCopyAll, copyData);
        };
      }
      if (bindingOptions.showTitleTreeControls) {
        var openAll = createElementWithHTML(controls, "button", "openAll", _configuration.openAllButtonText), closeAll = createElementWithHTML(controls, "button", "closeAll", _configuration.closeAllButtonText);
        openAll.onclick = function() {
          openAllNodes(bindingOptions);
        };
        closeAll.onclick = function() {
          closeAllNodes(bindingOptions);
        };
      }
    }
  }
  function openAllNodes(bindingOptions) {
    bindingOptions.showAllAsClosed = false;
    renderControlContainer(bindingOptions);
    fireCustomTrigger(bindingOptions.onOpenAll, bindingOptions.currentView.element);
  }
  function closeAllNodes(bindingOptions) {
    bindingOptions.showAllAsClosed = true;
    renderControlContainer(bindingOptions);
    fireCustomTrigger(bindingOptions.onCloseAll, bindingOptions.currentView.element);
  }
  function renderObject(container, bindingOptions, data) {
    var objectTypeTitle = createElement(container, "div", "object-type-title"), objectTypeContents = createElement(container, "div", "object-type-contents"), arrow = bindingOptions.showArrowToggles ? createElement(objectTypeTitle, "div", "down-arrow") : null, propertyCount = renderObjectValues(arrow, objectTypeContents, bindingOptions, data);
    createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "object" : _string.empty, _configuration.objectText);
    if (bindingOptions.showCounts && propertyCount > 0) {
      createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", "{" + propertyCount + "}");
    }
  }
  function renderArray(container, bindingOptions, data) {
    var objectTypeTitle = createElement(container, "div", "object-type-title"), objectTypeContents = createElement(container, "div", "object-type-contents"), arrow = bindingOptions.showArrowToggles ? createElement(objectTypeTitle, "div", "down-arrow") : null;
    createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "array" : _string.empty, _configuration.arrayText);
    renderArrayValues(arrow, objectTypeContents, bindingOptions, data);
    if (bindingOptions.showCounts) {
      createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", "[" + data.length + "]");
    }
  }
  function renderObjectValues(arrow, objectTypeContents, bindingOptions, data) {
    var propertyCount = 0, properties = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        properties.push(key);
      }
    }
    if (bindingOptions.sortPropertyNames) {
      properties = properties.sort();
      if (!bindingOptions.sortPropertyNamesInAlphabeticalOrder) {
        properties = properties.reverse();
      }
    }
    var propertiesLength = properties.length;
    for (var propertyIndex = 0; propertyIndex < propertiesLength; propertyIndex++) {
      var propertyName = properties[propertyIndex];
      if (data.hasOwnProperty(propertyName)) {
        renderValue(objectTypeContents, bindingOptions, propertyName, data[propertyName], propertyIndex === propertiesLength - 1);
        propertyCount++;
      }
    }
    addArrowEvent(bindingOptions, arrow, objectTypeContents);
    return propertyCount;
  }
  function renderArrayValues(arrow, objectTypeContents, bindingOptions, data) {
    var dataLength = data.length;
    if (!bindingOptions.reverseArrayValues) {
      for (var dataIndex1 = 0; dataIndex1 < dataLength; dataIndex1++) {
        renderValue(objectTypeContents, bindingOptions, getIndexName(bindingOptions, dataIndex1, dataLength), data[dataIndex1], dataIndex1 === dataLength - 1);
      }
    } else {
      for (var dataIndex2 = dataLength; dataIndex2--;) {
        renderValue(objectTypeContents, bindingOptions, getIndexName(bindingOptions, dataIndex2, dataLength), data[dataIndex2], dataIndex2 === 0);
      }
    }
    addArrowEvent(bindingOptions, arrow, objectTypeContents);
  }
  function renderValue(container, bindingOptions, name, value, isLastItem) {
    var objectTypeValue = createElement(container, "div", "object-type-value"), arrow = bindingOptions.showArrowToggles ? createElement(objectTypeValue, "div", "no-arrow") : null, valueClass = null, valueElement = null, ignored = false;
    createElementWithHTML(objectTypeValue, "span", "title", name);
    createElementWithHTML(objectTypeValue, "span", "split", ":");
    if (!isDefined(value)) {
      if (!bindingOptions.ignoreNullValues) {
        valueClass = bindingOptions.showValueColors ? "null" : _string.empty;
        valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, "null");
        if (isDefinedFunction(bindingOptions.onNullRender)) {
          fireCustomTrigger(bindingOptions.onNullRender, valueElement);
        }
        createComma(bindingOptions, objectTypeValue, isLastItem);
      } else {
        ignored = true;
      }
    } else if (isDefinedFunction(value)) {
      if (!bindingOptions.ignoreFunctionValues) {
        valueClass = bindingOptions.showValueColors ? "function" : _string.empty;
        valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, getFunctionName(value));
        if (isDefinedFunction(bindingOptions.onFunctionRender)) {
          fireCustomTrigger(bindingOptions.onFunctionRender, valueElement);
        }
        createComma(bindingOptions, objectTypeValue, isLastItem);
      } else {
        ignored = true;
      }
    } else if (isDefinedBoolean(value)) {
      valueClass = bindingOptions.showValueColors ? "boolean" : _string.empty;
      valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, value);
      if (isDefinedFunction(bindingOptions.onBooleanRender)) {
        fireCustomTrigger(bindingOptions.onBooleanRender, valueElement);
      }
      createComma(bindingOptions, objectTypeValue, isLastItem);
    } else if (isDefinedDecimal(value)) {
      var newValue = getFixedValue(value, bindingOptions.maximumDecimalPlaces);
      valueClass = bindingOptions.showValueColors ? "decimal" : _string.empty;
      valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, newValue);
      if (isDefinedFunction(bindingOptions.onDecimalRender)) {
        fireCustomTrigger(bindingOptions.onDecimalRender, valueElement);
      }
      createComma(bindingOptions, objectTypeValue, isLastItem);
    } else if (isDefinedNumber(value)) {
      valueClass = bindingOptions.showValueColors ? "number" : _string.empty;
      valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, value);
      if (isDefinedFunction(bindingOptions.onNumberRender)) {
        fireCustomTrigger(bindingOptions.onNumberRender, valueElement);
      }
      createComma(bindingOptions, objectTypeValue, isLastItem);
    } else if (isDefinedString(value)) {
      var newStringValue = bindingOptions.showStringQuotes ? '"' + value + '"' : value;
      valueClass = bindingOptions.showValueColors ? "string" : _string.empty;
      valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, newStringValue);
      if (isDefinedFunction(bindingOptions.onStringRender)) {
        fireCustomTrigger(bindingOptions.onStringRender, valueElement);
      }
      createComma(bindingOptions, objectTypeValue, isLastItem);
    } else if (isDefinedDate(value)) {
      valueClass = bindingOptions.showValueColors ? "date" : _string.empty;
      valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, getCustomFormattedDateTimeText(value, bindingOptions.dateTimeFormat));
      if (isDefinedFunction(bindingOptions.onDateRender)) {
        fireCustomTrigger(bindingOptions.onDateRender, valueElement);
      }
      createComma(bindingOptions, objectTypeValue, isLastItem);
    } else if (isDefinedObject(value) && !isDefinedArray(value)) {
      var objectTitle = createElement(objectTypeValue, "span", bindingOptions.showValueColors ? "object" : _string.empty), objectTypeContents = createElement(objectTypeValue, "div", "object-type-contents"), propertyCount = renderObjectValues(arrow, objectTypeContents, bindingOptions, value);
      createElementWithHTML(objectTitle, "span", "title", _configuration.objectText);
      if (bindingOptions.showCounts && propertyCount > 0) {
        createElementWithHTML(objectTitle, "span", "count", "{" + propertyCount + "}");
      }
      createComma(bindingOptions, objectTitle, isLastItem);
    } else if (isDefinedArray(value)) {
      var arrayTitle = createElement(objectTypeValue, "span", bindingOptions.showValueColors ? "array" : _string.empty), arrayTypeContents = createElement(objectTypeValue, "div", "object-type-contents");
      createElementWithHTML(arrayTitle, "span", "title", _configuration.arrayText);
      if (bindingOptions.showCounts) {
        createElementWithHTML(arrayTitle, "span", "count", "[" + value.length + "]");
      }
      createComma(bindingOptions, arrayTitle, isLastItem);
      renderArrayValues(arrow, arrayTypeContents, bindingOptions, value);
    } else {
      if (!bindingOptions.ignoreUnknownValues) {
        valueClass = bindingOptions.showValueColors ? "unknown" : _string.empty;
        valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, value.toString());
        if (isDefinedFunction(bindingOptions.onUnknownRender)) {
          fireCustomTrigger(bindingOptions.onUnknownRender, valueElement);
        }
        createComma(bindingOptions, objectTypeValue, isLastItem);
      } else {
        ignored = true;
      }
    }
    if (ignored) {
      container.removeChild(objectTypeValue);
    } else {
      if (isDefined(valueElement)) {
        addValueClickEvent(bindingOptions, valueElement, value);
      }
    }
  }
  function addValueClickEvent(bindingOptions, valueElement, value) {
    if (isDefinedFunction(bindingOptions.onValueClick)) {
      valueElement.onclick = function() {
        fireCustomTrigger(bindingOptions.onValueClick, value);
      };
    } else {
      addClass(valueElement, "no-hover");
    }
  }
  function addArrowEvent(bindingOptions, arrow, objectTypeContents) {
    if (isDefined(arrow)) {
      arrow.onclick = function() {
        if (arrow.className === "down-arrow") {
          objectTypeContents.style.display = "none";
          arrow.className = "right-arrow";
        } else {
          objectTypeContents.style.display = "block";
          arrow.className = "down-arrow";
        }
      };
      if (bindingOptions.showAllAsClosed) {
        objectTypeContents.style.display = "none";
        arrow.className = "right-arrow";
      } else {
        arrow.className = "down-arrow";
      }
    }
  }
  function getFunctionName(value) {
    var result, valueParts = value.toString().split("("), valueNameParts = valueParts[0].split(_string.space);
    if (valueNameParts.length === 2) {
      result = valueNameParts[1];
    } else {
      result = valueNameParts[0];
    }
    result += "()";
    return result;
  }
  function createComma(bindingOptions, objectTypeValue, isLastItem) {
    if (bindingOptions.showCommas && !isLastItem) {
      createElementWithHTML(objectTypeValue, "span", "comma", ",");
    }
  }
  function getIndexName(bindingOptions, index, largestValue) {
    var result = bindingOptions.useZeroIndexingForArrays ? index.toString() : (index + 1).toString();
    if (!bindingOptions.addArrayIndexPadding) {
      result = padNumber(result, largestValue.toString().length);
    }
    return result;
  }
  function getFixedValue(number, length) {
    var regExp = new RegExp("^-?\\d+(?:.\\d{0," + (length || -1) + "})?");
    return number.toString().match(regExp)[0];
  }
  function buildAttributeOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options.data = getDefaultObject(options.data, null);
    options.showCounts = getDefaultBoolean(options.showCounts, true);
    options.useZeroIndexingForArrays = getDefaultBoolean(options.useZeroIndexingForArrays, true);
    options.dateTimeFormat = getDefaultString(options.dateTimeFormat, "{dd}/{mm}/{yyyy} {hh}:{MM}:{ss}");
    options.showArrowToggles = getDefaultBoolean(options.showArrowToggles, true);
    options.showStringQuotes = getDefaultBoolean(options.showStringQuotes, true);
    options.showTitle = getDefaultBoolean(options.showTitle, true);
    options.showTitleTreeControls = getDefaultBoolean(options.showTitleTreeControls, true);
    options.showAllAsClosed = getDefaultBoolean(options.showAllAsClosed, false);
    options.sortPropertyNames = getDefaultBoolean(options.sortPropertyNames, true);
    options.sortPropertyNamesInAlphabeticalOrder = getDefaultBoolean(options.sortPropertyNamesInAlphabeticalOrder, true);
    options.showCommas = getDefaultBoolean(options.showCommas, false);
    options.ignoreNullValues = getDefaultBoolean(options.ignoreNullValues, false);
    options.ignoreFunctionValues = getDefaultBoolean(options.ignoreFunctionValues, false);
    options.reverseArrayValues = getDefaultBoolean(options.reverseArrayValues, false);
    options.addArrayIndexPadding = getDefaultBoolean(options.addArrayIndexPadding, false);
    options.showTitleCopyButton = getDefaultBoolean(options.showTitleCopyButton, false);
    options.showValueColors = getDefaultBoolean(options.showValueColors, true);
    options.maximumDecimalPlaces = getDefaultNumber(options.maximumDecimalPlaces, 2);
    options.ignoreUnknownValues = getDefaultBoolean(options.ignoreUnknownValues, false);
    options = buildAttributeOptionStrings(options);
    options = buildAttributeOptionCustomTriggers(options);
    return options;
  }
  function buildAttributeOptionStrings(options) {
    options.titleText = getDefaultString(options.titleText, "JsonTree.js");
    return options;
  }
  function buildAttributeOptionCustomTriggers(options) {
    options.onBeforeRender = getDefaultFunction(options.onBeforeRender, null);
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    options.onValueClick = getDefaultFunction(options.onValueClick, null);
    options.onRefresh = getDefaultFunction(options.onRefresh, null);
    options.onCopyAll = getDefaultFunction(options.onCopyAll, null);
    options.onOpenAll = getDefaultFunction(options.onOpenAll, null);
    options.onCloseAll = getDefaultFunction(options.onCloseAll, null);
    options.onDestroy = getDefaultFunction(options.onDestroy, null);
    options.onBooleanRender = getDefaultFunction(options.onBooleanRender, null);
    options.onDecimalRender = getDefaultFunction(options.onDecimalRender, null);
    options.onNumberRender = getDefaultFunction(options.onNumberRender, null);
    options.onStringRender = getDefaultFunction(options.onStringRender, null);
    options.onDateRender = getDefaultFunction(options.onDateRender, null);
    options.onFunctionRender = getDefaultFunction(options.onFunctionRender, null);
    options.onNullRender = getDefaultFunction(options.onNullRender, null);
    options.onUnknownRender = getDefaultFunction(options.onUnknownRender, null);
    return options;
  }
  function createElement(container, type, className, beforeNode) {
    var result = null, nodeType = type.toLowerCase(), isText = nodeType === "text";
    if (!_elements_Type.hasOwnProperty(nodeType)) {
      _elements_Type[nodeType] = isText ? _parameter_Document.createTextNode(_string.empty) : _parameter_Document.createElement(nodeType);
    }
    result = _elements_Type[nodeType].cloneNode(false);
    if (isDefined(className)) {
      result.className = className;
    }
    if (isDefined(beforeNode)) {
      container.insertBefore(result, beforeNode);
    } else {
      container.appendChild(result);
    }
    return result;
  }
  function createElementWithHTML(container, type, className, html, beforeNode) {
    var element = createElement(container, type, className, beforeNode);
    element.innerHTML = html;
    return element;
  }
  function addClass(element, className) {
    element.className += _string.space + className;
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function isDefinedDate(object) {
    return isDefinedObject(object) && object instanceof Date;
  }
  function isDefinedDecimal(object) {
    return isDefined(object) && typeof object === "number" && object % 1 !== 0;
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultObject(value, defaultValue) {
    return isDefinedObject(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true, result = null;
    try {
      if (isDefinedString(objectString)) {
        result = _parameter_JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        if (!_configuration.safeMode) {
          console.error(_configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e2.message));
          parsed = false;
        }
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function newGuid() {
    var result = [];
    for (var charIndex = 0; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = _parameter_Math.floor(_parameter_Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function padNumber(number, length) {
    length = isDefined(length) ? length : 1;
    var numberString = number.toString(), numberResult = numberString;
    if (numberString.length < length) {
      var arrayLength = length - numberString.length + 1;
      numberResult = Array(arrayLength).join("0") + numberString;
    }
    return numberResult;
  }
  function getCustomFormattedDateTimeText(date, dateFormat) {
    var result = dateFormat;
    result = result.replace("{hh}", padNumber(date.getHours(), 2));
    result = result.replace("{h}", date.getHours());
    result = result.replace("{MM}", padNumber(date.getMinutes(), 2));
    result = result.replace("{M}", date.getMinutes());
    result = result.replace("{ss}", padNumber(date.getSeconds(), 2));
    result = result.replace("{s}", date.getSeconds());
    result = result.replace("{dd}", padNumber(date.getDate(), 2));
    result = result.replace("{d}", date.getDate());
    result = result.replace("{mm}", padNumber(date.getMonth() + 1, 2));
    result = result.replace("{m}", date.getMonth() + 1);
    result = result.replace("{yyyy}", date.getFullYear());
    result = result.replace("{yyy}", date.getFullYear().toString().substring(1));
    result = result.replace("{yy}", date.getFullYear().toString().substring(2));
    result = result.replace("{y}", parseInt(date.getFullYear().toString().substring(2)).toString());
    return result;
  }
  _public.refresh = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      var bindingOptions = _elements_Data[elementId].options;
      renderControlContainer(bindingOptions);
      fireCustomTrigger(bindingOptions.onRefresh, bindingOptions.currentView.element);
    }
    return _public;
  };
  _public.refreshAll = function() {
    for (var elementId in _elements_Data) {
      if (_elements_Data.hasOwnProperty(elementId)) {
        var bindingOptions = _elements_Data[elementId].options;
        renderControlContainer(bindingOptions);
        fireCustomTrigger(bindingOptions.onRefresh, bindingOptions.currentView.element);
      }
    }
    return _public;
  };
  _public.render = function(element, options) {
    if (isDefinedObject(element) && isDefinedObject(options)) {
      renderControl(renderBindingOptions(options, element));
    }
    return _public;
  };
  _public.renderAll = function() {
    render();
    return _public;
  };
  _public.openAll = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      openAllNodes(_elements_Data[elementId].options);
    }
    return _public;
  };
  _public.closeAll = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      closeAllNodes(_elements_Data[elementId].options);
    }
    return _public;
  };
  _public.destroyAll = function() {
    for (var elementId in _elements_Data) {
      if (_elements_Data.hasOwnProperty(elementId)) {
        destroyElement(_elements_Data[elementId].options);
      }
    }
    _elements_Data = {};
    return _public;
  };
  _public.destroy = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      destroyElement(_elements_Data[elementId].options);
      delete _elements_Data[elementId];
    }
    return _public;
  };
  function destroyElement(bindingOptions) {
    bindingOptions.currentView.element.innerHTML = _string.empty;
    bindingOptions.currentView.element.className = _string.empty;
    fireCustomTrigger(bindingOptions.onDestroy, bindingOptions.currentView.element);
  }
  _public.setConfiguration = function(newConfiguration) {
    for (var propertyName in newConfiguration) {
      if (newConfiguration.hasOwnProperty(propertyName)) {
        _configuration[propertyName] = newConfiguration[propertyName];
      }
    }
    buildDefaultConfiguration(_configuration);
    return _public;
  };
  function buildDefaultConfiguration(newConfiguration) {
    _configuration = !isDefinedObject(newConfiguration) ? {} : newConfiguration;
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["*"]);
    buildDefaultConfigurationStrings();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.objectText = getDefaultString(_configuration.objectText, "object");
    _configuration.arrayText = getDefaultString(_configuration.arrayText, "array");
    _configuration.closeAllButtonText = getDefaultString(_configuration.closeAllButtonText, "Close All");
    _configuration.openAllButtonText = getDefaultString(_configuration.openAllButtonText, "Open All");
    _configuration.copyAllButtonText = getDefaultString(_configuration.copyAllButtonText, "Copy All");
    _configuration.objectErrorText = getDefaultString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
    _configuration.attributeNotValidErrorText = getDefaultString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
    _configuration.attributeNotSetErrorText = getDefaultString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
  }
  _public.getIds = function() {
    var result = [];
    for (var elementId in _elements_Data) {
      if (_elements_Data.hasOwnProperty(elementId)) {
        result.push(elementId);
      }
    }
    return result;
  };
  _public.getVersion = function() {
    return "0.8.0";
  };
  (function(documentObject, windowObject, navigatorObject, mathObject, jsonObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_Navigator = navigatorObject;
    _parameter_Math = mathObject;
    _parameter_JSON = jsonObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$jsontree)) {
      _parameter_Window.$jsontree = _public;
    }
  })(document, window, navigator, Math, JSON);
})();