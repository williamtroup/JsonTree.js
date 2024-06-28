/**
 * JsonTree.js
 *
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 *
 * @file        jsontree.js
 * @version     v1.1.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
	addClass, createComma,
	createElement, createElementWithHTML,
	getCustomFormattedDateTimeText,
	getDefaultAnyString,
	getDefaultBoolean,
	getDefaultFunction,
	getDefaultNumber,
	getDefaultObject,
	getDefaultString, getDefaultStringOrArray, getFixedValue, getFunctionName, getIndexName,
	getObjectFromString,
	isDefined, isDefinedArray, isDefinedBoolean, isDefinedDate,
	isDefinedDecimal,
	isDefinedFunction, isDefinedNumber, isDefinedObject,
	isDefinedString, isHexColor,
	isInvalidOptionArray, newGuid, padNumber,
} from "./helpers";

import { BindingOptions, Configuration, PublicApi, STRING } from "./types";
import { ATTRIBUTE_NAME_OPTION } from "./constants";


let _configuration: Configuration = {} as Configuration;

// TODO: not sure why are we storing `data` twice
let _elements_Data: Record<string, { options: BindingOptions, data: BindingOptions['data'] }> = {};


/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Rendering
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function render() {
	const  tagTypes = _configuration.domElementTypes,
		tagTypesLength = tagTypes.length;

	for (let tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
		const domElements = document.getElementsByTagName(tagTypes[tagTypeIndex]),
			elements = [].slice.call(domElements),
			elementsLength = elements.length;

		for (let elementIndex = 0; elementIndex < elementsLength; elementIndex++) {
			if (!renderElement(elements[elementIndex])) {
				break;
			}
		}
	}
}

function renderElement(element: HTMLElement) {
	var result = true;

	if (isDefined(element) && element.hasAttribute(ATTRIBUTE_NAME_OPTION)) {
		var bindingOptionsData = element.getAttribute(ATTRIBUTE_NAME_OPTION);

		if (isDefinedString(bindingOptionsData)) {
			var bindingOptions = getObjectFromString(bindingOptionsData, _configuration);

			if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
				renderControl(renderBindingOptions(bindingOptions.result, element));

			} else {
				if (!_configuration.safeMode) {
					console.error(_configuration.attributeNotValidErrorText.replace("{{attribute_name}}", ATTRIBUTE_NAME_OPTION));
					result = false;
				}
			}

		} else {
			if (!_configuration.safeMode) {
				console.error(_configuration.attributeNotSetErrorText.replace("{{attribute_name}}", ATTRIBUTE_NAME_OPTION));
				result = false;
			}
		}
	}

	return result;
}

function renderBindingOptions(data: Partial<BindingOptions>, element: HTMLElement) {
	const bindingOptions = buildAttributeOptions(data);
	bindingOptions.currentView = {
		element: element,
	};

	return bindingOptions;
}

function renderControl(bindingOptions: BindingOptions) {
	fireCustomTrigger(bindingOptions.events.onBeforeRender);

	if (!isDefinedString(bindingOptions.currentView.element.id)) {
		bindingOptions.currentView.element.id = newGuid();
	}

	bindingOptions.currentView.element.className = "json-tree-js";
	bindingOptions.currentView.element.removeAttribute(ATTRIBUTE_NAME_OPTION);

	if (!_elements_Data.hasOwnProperty(bindingOptions.currentView.element.id)) {
		_elements_Data[bindingOptions.currentView.element.id] = {
			options: bindingOptions,
			data: bindingOptions.data,
		};

		 bindingOptions.data = null ;
	}

	renderControlContainer(bindingOptions);
	fireCustomTrigger(bindingOptions.events.onRenderComplete);
}

function renderControlContainer(bindingOptions: BindingOptions) {
	var data = _elements_Data[bindingOptions.currentView.element.id].data;

	bindingOptions.currentView.element.innerHTML = STRING.empty;

	renderControlTitleBar(bindingOptions);

	if (isDefinedObject(data) && !isDefinedArray(data)) {
		renderObject(bindingOptions.currentView.element, bindingOptions, data);
	} else if (isDefinedArray(data)) {
		renderArray(bindingOptions.currentView.element, bindingOptions, data);
	}
}


/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Render:  Title Bar
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function renderControlTitleBar(bindingOptions: BindingOptions) {
	if (bindingOptions.title.show || bindingOptions.title.showTreeControls || bindingOptions.title.showCopyButton) {
		var titleBar = createElement(bindingOptions.currentView.element, "div", "title-bar"),
			controls = createElement(titleBar, "div", "controls");

		if (bindingOptions.title.show) {
			createElementWithHTML(titleBar, "div", "title", bindingOptions.title.text, controls);
		}

		if (bindingOptions.title.showCopyButton) {
			var copy = createElementWithHTML(controls, "button", "copy-all", _configuration.copyAllButtonText);

			copy.onclick = function() {
				var copyData = JSON.stringify(_elements_Data[bindingOptions.currentView.element.id].data);

				navigator.clipboard.writeText(copyData);

				fireCustomTrigger(bindingOptions.events.onCopyAll);
			};
		}

		if (bindingOptions.title.showTreeControls) {
			var openAll = createElementWithHTML(controls, "button", "openAll", _configuration.openAllButtonText),
				closeAll = createElementWithHTML(controls, "button", "closeAll", _configuration.closeAllButtonText);

			openAll.onclick = function() {
				openAllNodes(bindingOptions);
			};

			closeAll.onclick = function() {
				closeAllNodes(bindingOptions);
			};
		}
	}
}

function openAllNodes(bindingOptions: BindingOptions) {
	bindingOptions.showAllAsClosed = false;

	renderControlContainer(bindingOptions);
	fireCustomTrigger(bindingOptions.events.onOpenAll);
}

function closeAllNodes(bindingOptions: BindingOptions) {
	bindingOptions.showAllAsClosed = true;

	renderControlContainer(bindingOptions);
	fireCustomTrigger(bindingOptions.events.onCloseAll);
}


/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Render:  Tree
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function renderObject(container: HTMLElement, bindingOptions: BindingOptions, data: Object) {
	var objectTypeTitle = createElement(container, "div", "object-type-title"),
		objectTypeContents = createElement(container, "div", "object-type-contents"),
		arrow = bindingOptions.showArrowToggles ? createElement(objectTypeTitle, "div", "down-arrow") : null,
		propertyCount = renderObjectValues(arrow, objectTypeContents, bindingOptions, data);

	createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "object" : STRING.empty, _configuration.objectText);

	if (bindingOptions.showCounts && propertyCount > 0) {
		createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", "{" + propertyCount + "}");
	}
}

function renderArray(container: HTMLElement, bindingOptions: BindingOptions, data: any[]) {
	var objectTypeTitle = createElement(container, "div", "object-type-title"),
		objectTypeContents = createElement(container, "div", "object-type-contents"),
		arrow = bindingOptions.showArrowToggles ? createElement(objectTypeTitle, "div", "down-arrow") : null;

	createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "array" : STRING.empty, _configuration.arrayText);

	renderArrayValues(arrow, objectTypeContents, bindingOptions, data);

	if (bindingOptions.showCounts) {
		createElementWithHTML(objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", "[" + data.length + "]");
	}
}

function renderObjectValues(arrow: HTMLElement | null , objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: Record<string, any >) {
	var propertyCount = 0,
		properties = [];

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

function renderArrayValues(arrow: HTMLElement | null , objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any[]) {
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

function renderValue(container: HTMLElement, bindingOptions: BindingOptions, name: string , value: unknown, isLastItem: boolean) {
	var objectTypeValue = createElement(container, "div", "object-type-value"),
		arrow = bindingOptions.showArrowToggles ? createElement(objectTypeValue, "div", "no-arrow") : null,
		valueClass = null,
		valueElement = null,
		ignored = false,
		addClickEvent = true;

	createElementWithHTML(objectTypeValue, "span", "title", name);
	createElementWithHTML(objectTypeValue, "span", "split", ":");

	if (!isDefined(value)) {
		if (!bindingOptions.ignore.nullValues) {
			valueClass = bindingOptions.showValueColors ? "null" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, "null");
			addClickEvent = false;

			if (isDefinedFunction(bindingOptions.events.onNullRender)) {
				fireCustomTrigger(bindingOptions.events.onNullRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedFunction(value)) {
		if (!bindingOptions.ignore.functionValues) {
			valueClass = bindingOptions.showValueColors ? "function" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, getFunctionName(value));

			if (isDefinedFunction(bindingOptions.events.onFunctionRender)) {
				fireCustomTrigger(bindingOptions.events.onFunctionRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedBoolean(value)) {
		if (!bindingOptions.ignore.booleanValues) {
			valueClass = bindingOptions.showValueColors ? "boolean" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, value);

			if (isDefinedFunction(bindingOptions.events.onBooleanRender)) {
				fireCustomTrigger(bindingOptions.events.onBooleanRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedDecimal(value)) {
		if (!bindingOptions.ignore.decimalValues) {
			var newValue = getFixedValue(value, bindingOptions.maximumDecimalPlaces);

			valueClass = bindingOptions.showValueColors ? "decimal" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, newValue);

			if (isDefinedFunction(bindingOptions.events.onDecimalRender)) {
				fireCustomTrigger(bindingOptions.events.onDecimalRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedNumber(value)) {
		if (!bindingOptions.ignore.numberValues) {
			valueClass = bindingOptions.showValueColors ? "number" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, value);

			if (isDefinedFunction(bindingOptions.events.onNumberRender)) {
				fireCustomTrigger(bindingOptions.events.onNumberRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedString(value)) {
		if (!bindingOptions.ignore.stringValues) {
			var color = null;

			if (bindingOptions.showStringHexColors && isHexColor(value)) {
				color = value;

			} else {
				if (bindingOptions.maximumStringLength > 0 && value.length > bindingOptions.maximumStringLength) {
					value = value.substring(0, bindingOptions.maximumStringLength) + _configuration.ellipsisText
				}
			}

			const  newStringValue: string  = (bindingOptions.showStringQuotes ? "\"" + value + "\"" : value) as string

			valueClass = bindingOptions.showValueColors ? "string" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, newStringValue);
			if (isDefinedString(color)) {
				valueElement.style.color = color;
			}

			if (isDefinedFunction(bindingOptions.events.onStringRender)) {
				fireCustomTrigger(bindingOptions.events.onStringRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedDate(value)) {
		if (!bindingOptions.ignore.dateValues) {
			valueClass = bindingOptions.showValueColors ? "date" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, getCustomFormattedDateTimeText(value, bindingOptions.dateTimeFormat, _configuration));

			if (isDefinedFunction(bindingOptions.events.onDateRender)) {
				fireCustomTrigger(bindingOptions.events.onDateRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}

	} else if (isDefinedObject(value) && !isDefinedArray(value)) {
		if (!bindingOptions.ignore.objectValues) {
			var objectTitle = createElement(objectTypeValue, "span", bindingOptions.showValueColors ? "object" : STRING.empty),
				objectTypeContents = createElement(objectTypeValue, "div", "object-type-contents"),
				propertyCount = renderObjectValues(arrow, objectTypeContents, bindingOptions, value);

			createElementWithHTML(objectTitle, "span", "title", _configuration.objectText);

			if (bindingOptions.showCounts && propertyCount > 0) {
				createElementWithHTML(objectTitle, "span", "count", "{" + propertyCount + "}");
			}

			createComma(bindingOptions, objectTitle, isLastItem);


		} else {
			ignored = true;
		}


	} else if (isDefinedArray(value)) {
		if (!bindingOptions.ignore.arrayValues) {
			var arrayTitle = createElement(objectTypeValue, "span", bindingOptions.showValueColors ? "array" : STRING.empty),
				arrayTypeContents = createElement(objectTypeValue, "div", "object-type-contents");

			createElementWithHTML(arrayTitle, "span", "title", _configuration.arrayText);

			if (bindingOptions.showCounts) {
				createElementWithHTML(arrayTitle, "span", "count", "[" + value.length + "]");
			}

			createComma(bindingOptions, arrayTitle, isLastItem);
			renderArrayValues(arrow, arrayTypeContents, bindingOptions, value);


		} else {
			ignored = true;
		}

	} else {
		if (!bindingOptions.ignore.unknownValues) {
			valueClass = bindingOptions.showValueColors ? "unknown" : STRING.empty;
			valueElement = createElementWithHTML(objectTypeValue, "span", valueClass, String(value));

			if (isDefinedFunction(bindingOptions.events.onUnknownRender)) {
				fireCustomTrigger(bindingOptions.events.onUnknownRender);
			}

			createComma(bindingOptions, objectTypeValue, isLastItem);

		} else {
			ignored = true;
		}
	}

	if (ignored) {
		container.removeChild(objectTypeValue);

	} else {
		if (valueElement) {
			addValueClickEvent(bindingOptions, valueElement, addClickEvent);
		}
	}
}

function addValueClickEvent(bindingOptions: BindingOptions, valueElement: HTMLElement, addClickEvent: boolean) {
	if (addClickEvent && isDefinedFunction(bindingOptions.events.onValueClick)) {
		valueElement.onclick = function() {
			fireCustomTrigger(bindingOptions.events.onValueClick);
		};

	} else {
		addClass(valueElement, "no-hover");
	}
}

function addArrowEvent(bindingOptions: BindingOptions, arrow: HTMLElement | null , objectTypeContents:HTMLElement ) {
	if (arrow) {
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


/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Triggering Custom Events
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function fireCustomTrigger(triggerFunction: Function | null ) {
	if (isDefinedFunction(triggerFunction)) {
		triggerFunction.apply(null, [].slice.call(arguments, 1));
	}
}

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Options
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function buildAttributeOptions(newOptions: Partial<BindingOptions>) {
	const options = getDefaultObject(newOptions, {}) as BindingOptions;
	options.data = getDefaultObject(options.data, null);
	options.showCounts = getDefaultBoolean(options.showCounts, true);
	options.useZeroIndexingForArrays = getDefaultBoolean(options.useZeroIndexingForArrays, true);
	options.dateTimeFormat = getDefaultString(options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
	options.showArrowToggles = getDefaultBoolean(options.showArrowToggles, true);
	options.showStringQuotes = getDefaultBoolean(options.showStringQuotes, true);
	options.showAllAsClosed = getDefaultBoolean(options.showAllAsClosed, false);
	options.sortPropertyNames = getDefaultBoolean(options.sortPropertyNames, true);
	options.sortPropertyNamesInAlphabeticalOrder = getDefaultBoolean(options.sortPropertyNamesInAlphabeticalOrder, true);
	options.showCommas = getDefaultBoolean(options.showCommas, false);
	options.reverseArrayValues = getDefaultBoolean(options.reverseArrayValues, false);
	options.addArrayIndexPadding = getDefaultBoolean(options.addArrayIndexPadding, false);
	options.showValueColors = getDefaultBoolean(options.showValueColors, true);
	options.maximumDecimalPlaces = getDefaultNumber(options.maximumDecimalPlaces, 2);
	options.maximumStringLength = getDefaultNumber(options.maximumStringLength, 0);
	options.showStringHexColors = getDefaultBoolean(options.showStringHexColors, false);

	buildAttributeOptionTitle(options);
	buildAttributeOptionIgnore(options);
	buildAttributeOptionCustomTriggers(options);

	return options;
}

function buildAttributeOptionTitle(options: BindingOptions) {
	options.title = getDefaultObject(options.title, {});
	options.title.text = getDefaultString(options.title.text, "JsonTree.js");
	options.title.show = getDefaultBoolean(options.title.show, true);
	options.title.showTreeControls = getDefaultBoolean(options.title.showTreeControls, true);
	options.title.showCopyButton = getDefaultBoolean(options.title.showCopyButton, false);
}

function buildAttributeOptionIgnore(options: BindingOptions) {
	options.ignore = getDefaultObject(options.ignore, {});
	options.ignore.nullValues = getDefaultBoolean(options.ignore.nullValues, false);
	options.ignore.functionValues = getDefaultBoolean(options.ignore.functionValues, false);
	options.ignore.unknownValues = getDefaultBoolean(options.ignore.unknownValues, false);
	options.ignore.booleanValues = getDefaultBoolean(options.ignore.booleanValues, false);
	options.ignore.decimalValues = getDefaultBoolean(options.ignore.decimalValues, false);
	options.ignore.numberValues = getDefaultBoolean(options.ignore.numberValues, false);
	options.ignore.stringValues = getDefaultBoolean(options.ignore.stringValues, false);
	options.ignore.dateValues = getDefaultBoolean(options.ignore.dateValues, false);
	options.ignore.objectValues = getDefaultBoolean(options.ignore.objectValues, false);
	options.ignore.arrayValues = getDefaultBoolean(options.ignore.arrayValues, false);
}

function buildAttributeOptionCustomTriggers(options: BindingOptions) {
	options.events = getDefaultObject(options.events, {});
	options.events.onBeforeRender = getDefaultFunction(options.events.onBeforeRender, null);
	options.events.onRenderComplete = getDefaultFunction(options.events.onRenderComplete, null);
	options.events.onValueClick = getDefaultFunction(options.events.onValueClick, null);
	options.events.onRefresh = getDefaultFunction(options.events.onRefresh, null);
	options.events.onCopyAll = getDefaultFunction(options.events.onCopyAll, null);
	options.events.onOpenAll = getDefaultFunction(options.events.onOpenAll, null);
	options.events.onCloseAll = getDefaultFunction(options.events.onCloseAll, null);
	options.events.onDestroy = getDefaultFunction(options.events.onDestroy, null);
	options.events.onBooleanRender = getDefaultFunction(options.events.onBooleanRender, null);
	options.events.onDecimalRender = getDefaultFunction(options.events.onDecimalRender, null);
	options.events.onNumberRender = getDefaultFunction(options.events.onNumberRender, null);
	options.events.onStringRender = getDefaultFunction(options.events.onStringRender, null);
	options.events.onDateRender = getDefaultFunction(options.events.onDateRender, null);
	options.events.onFunctionRender = getDefaultFunction(options.events.onFunctionRender, null);
	options.events.onNullRender = getDefaultFunction(options.events.onNullRender, null);
	options.events.onUnknownRender = getDefaultFunction(options.events.onUnknownRender, null);

	return options;
}

function buildDefaultConfiguration(newConfiguration?: Configuration) {
	_configuration = !isDefinedObject(newConfiguration) ? {} as Configuration : newConfiguration;
	_configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
	_configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["*"]);

	_configuration.objectText = getDefaultAnyString(_configuration.objectText, "object");
	_configuration.arrayText = getDefaultAnyString(_configuration.arrayText, "array");
	_configuration.closeAllButtonText = getDefaultAnyString(_configuration.closeAllButtonText, "Close All");
	_configuration.openAllButtonText = getDefaultAnyString(_configuration.openAllButtonText, "Open All");
	_configuration.copyAllButtonText = getDefaultAnyString(_configuration.copyAllButtonText, "Copy All");
	_configuration.objectErrorText = getDefaultAnyString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
	_configuration.attributeNotValidErrorText = getDefaultAnyString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
	_configuration.attributeNotSetErrorText = getDefaultAnyString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
	_configuration.stText = getDefaultAnyString(_configuration.stText, "st");
	_configuration.ndText = getDefaultAnyString(_configuration.ndText, "nd");
	_configuration.rdText = getDefaultAnyString(_configuration.rdText, "rd");
	_configuration.thText = getDefaultAnyString(_configuration.thText, "th");
	_configuration.ellipsisText = getDefaultAnyString(_configuration.ellipsisText, "...");

	if (isInvalidOptionArray(_configuration.dayNames, 7)) {
		_configuration.dayNames = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
	}

	if (isInvalidOptionArray(_configuration.dayNamesAbbreviated, 7)) {
		_configuration.dayNamesAbbreviated = [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun",
		];
	}

	if (isInvalidOptionArray(_configuration.monthNames, 12)) {
		_configuration.monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
	}

	if (isInvalidOptionArray(_configuration.monthNamesAbbreviated, 12)) {
		_configuration.monthNamesAbbreviated = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
	}
}



/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Public Functions:  Manage Instances
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

const _public: PublicApi = {
	refresh(elementId) {
		if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
			var bindingOptions = _elements_Data[elementId].options;

			renderControlContainer(bindingOptions);
			fireCustomTrigger(bindingOptions.events.onRefresh);
		}

		return _public;
	},
	refreshAll() {
		for (var elementId in _elements_Data) {
			if (_elements_Data.hasOwnProperty(elementId)) {
				var bindingOptions = _elements_Data[elementId].options;

				renderControlContainer(bindingOptions);
				fireCustomTrigger(bindingOptions.events.onRefresh);
			}
		}

		return _public;
	},


	render(element, options) {
		if (isDefinedObject(element) && isDefinedObject(options)) {
			renderControl(renderBindingOptions(options, element));
		}

		return _public;
	},
	renderAll() {
		render();

		return _public;
	},
	openAll(elementId) {
		if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
			openAllNodes(_elements_Data[elementId].options);
		}

		return _public;
	},
	closeAll(elementId) {
		if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
			closeAllNodes(_elements_Data[elementId].options);
		}

		return _public;
	},
	destroyAll() {
		for (var elementId in _elements_Data) {
			if (_elements_Data.hasOwnProperty(elementId)) {
				this.destroyElement(_elements_Data[elementId].options);
			}
		}

		_elements_Data = {};

		return _public;
	},
	destroy(elementId) {
		if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
			this.destroyElement(_elements_Data[elementId].options);

			delete _elements_Data[elementId];
		}

		return _public;
	},
	destroyElement(bindingOptions) {
		bindingOptions.currentView.element.innerHTML = STRING.empty;
		bindingOptions.currentView.element.className = STRING.empty;

		fireCustomTrigger(bindingOptions.events.onDestroy);
	},


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public Functions:  Configuration
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */


	setConfiguration(newConfiguration: Partial<Configuration>): PublicApi {
		for (let propertyName in newConfiguration) {
			if (newConfiguration.hasOwnProperty(propertyName)) {
				// @ts-expect-error
				_configuration[propertyName] = newConfiguration[propertyName];
			}
		}

		buildDefaultConfiguration(_configuration);

		return _public;
	},
	getIds() {
		var result = [];

		for (var elementId in _elements_Data) {
			if (_elements_Data.hasOwnProperty(elementId)) {
				result.push(elementId);
			}
		}

		return result;
	},
	getVersion() {
		return "1.1.2";
	},
};

window.$jsontree = _public;

document.addEventListener( "DOMContentLoaded", function() {
	buildDefaultConfiguration()
	render();
} );





