"use strict";

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function o(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = o;
    function r(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = r;
    function a(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = a;
    function i(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = i;
    function l(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = l;
    function s(e) {
        return n(e) && e instanceof Date;
    }
    e.definedDate = s;
    function u(e) {
        return t(e) && typeof e === "number" && e % 1 !== 0;
    }
    e.definedDecimal = u;
    function c(e, t = 1) {
        return !l(e) || e.length < t;
    }
    e.invalidOptionArray = c;
})(Is || (Is = {}));

var Data;

(e => {
    let t;
    (e => {
        function t() {
            const e = [];
            for (let t = 0; t < 32; t++) {
                if (t === 8 || t === 12 || t === 16 || t === 20) {
                    e.push("-");
                }
                const n = Math.floor(Math.random() * 16).toString(16);
                e.push(n);
            }
            return e.join("");
        }
        e.newGuid = t;
        function n(e, t = 1) {
            const n = e.toString();
            let o = n;
            if (n.length < t) {
                const e = t - n.length + 1;
                o = Array(e).join("0") + n;
            }
            return o;
        }
        e.padNumber = n;
    })(t = e.String || (e.String = {}));
    function n(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getDefaultAnyString = n;
    function o(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = o;
    function r(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = r;
    function a(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = a;
    function i(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = i;
    function l(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = l;
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = s;
    function u(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split(" ");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = l(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = u;
})(Data || (Data = {}));

var DomElement;

(e => {
    function t(e, t, n = "", o = null) {
        const r = t.toLowerCase();
        const a = r === "text";
        let i = a ? document.createTextNode("") : document.createElement(r);
        if (Is.defined(n)) {
            i.className = n;
        }
        if (Is.defined(o)) {
            e.insertBefore(i, o);
        } else {
            e.appendChild(i);
        }
        return i;
    }
    e.create = t;
    function n(e, n, o, r, a = null) {
        const i = t(e, n, o, a);
        i.innerHTML = r;
        return i;
    }
    e.createWithHTML = n;
    function o(e, t) {
        e.classList.add(t);
    }
    e.addClass = o;
})(DomElement || (DomElement = {}));

var DateTime;

(e => {
    function t(e) {
        return e.getDay() - 1 < 0 ? 6 : e.getDay() - 1;
    }
    e.getWeekdayNumber = t;
    function n(e, t) {
        let n = e.thText;
        if (t === 31 || t === 21 || t === 1) {
            n = e.stText;
        } else if (t === 22 || t === 2) {
            n = e.ndText;
        } else if (t === 23 || t === 3) {
            n = e.rdText;
        }
        return n;
    }
    e.getDayOrdinal = n;
    function o(e, o, r) {
        let a = r;
        const i = t(o);
        a = a.replace("{hh}", Data.String.padNumber(o.getHours(), 2));
        a = a.replace("{h}", o.getHours().toString());
        a = a.replace("{MM}", Data.String.padNumber(o.getMinutes(), 2));
        a = a.replace("{M}", o.getMinutes().toString());
        a = a.replace("{ss}", Data.String.padNumber(o.getSeconds(), 2));
        a = a.replace("{s}", o.getSeconds().toString());
        a = a.replace("{dddd}", e.dayNames[i]);
        a = a.replace("{ddd}", e.dayNamesAbbreviated[i]);
        a = a.replace("{dd}", Data.String.padNumber(o.getDate()));
        a = a.replace("{d}", o.getDate().toString());
        a = a.replace("{o}", n(e, o.getDate()));
        a = a.replace("{mmmm}", e.monthNames[o.getMonth()]);
        a = a.replace("{mmm}", e.monthNamesAbbreviated[o.getMonth()]);
        a = a.replace("{mm}", Data.String.padNumber(o.getMonth() + 1));
        a = a.replace("{m}", (o.getMonth() + 1).toString());
        a = a.replace("{yyyy}", o.getFullYear().toString());
        a = a.replace("{yyy}", o.getFullYear().toString().substring(1));
        a = a.replace("{yy}", o.getFullYear().toString().substring(2));
        a = a.replace("{y}", Number.parseInt(o.getFullYear().toString().substring(2)).toString());
        return a;
    }
    e.getCustomFormattedDateText = o;
})(DateTime || (DateTime = {}));

var Constants;

(e => {
    e.JSONTREE_JS_ATTRIBUTE_NAME = "data-jsontree-js";
})(Constants || (Constants = {}));

(() => {
    let _configuration = {};
    let _elements_Data = {};
    function render() {
        const e = _configuration.domElementTypes;
        const t = e.length;
        for (let n = 0; n < t; n++) {
            const t = document.getElementsByTagName(e[n]);
            const o = [].slice.call(t);
            const r = o.length;
            for (let e = 0; e < r; e++) {
                if (!renderElement(o[e])) {
                    break;
                }
            }
        }
    }
    function renderElement(e) {
        let t = true;
        if (Is.defined(e) && e.hasAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME)) {
            const n = e.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
            if (Is.definedString(n)) {
                const o = getObjectFromString(n);
                if (o.parsed && Is.definedObject(o.object)) {
                    renderControl(renderBindingOptions(o.object, e));
                } else {
                    if (!_configuration.safeMode) {
                        console.error(_configuration.attributeNotValidErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                        t = false;
                    }
                }
            } else {
                if (!_configuration.safeMode) {
                    console.error(_configuration.attributeNotSetErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                    t = false;
                }
            }
        }
        return t;
    }
    function renderBindingOptions(e, t) {
        const n = buildAttributeOptions(e);
        n._currentView = {};
        n._currentView.element = t;
        return n;
    }
    function renderControl(e) {
        fireCustomTriggerEvent(e.events.onBeforeRender, e._currentView.element);
        if (!Is.definedString(e._currentView.element.id)) {
            e._currentView.element.id = Data.String.newGuid();
        }
        e._currentView.element.className = "json-tree-js";
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (!_elements_Data.hasOwnProperty(e._currentView.element.id)) {
            _elements_Data[e._currentView.element.id] = {};
            _elements_Data[e._currentView.element.id].options = e;
            _elements_Data[e._currentView.element.id].data = e.data;
            delete e.data;
        }
        renderControlContainer(e);
        fireCustomTriggerEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function renderControlContainer(e) {
        const t = _elements_Data[e._currentView.element.id].data;
        e._currentView.element.innerHTML = "";
        renderControlTitleBar(e);
        if (Is.definedObject(t) && !Is.definedArray(t)) {
            renderObject(e._currentView.element, e, t);
        } else if (Is.definedArray(t)) {
            renderArray(e._currentView.element, e, t);
        }
    }
    function renderControlTitleBar(e) {
        if (e.title.show || e.title.showTreeControls || e.title.showCopyButton) {
            const t = DomElement.create(e._currentView.element, "div", "title-bar");
            const n = DomElement.create(t, "div", "controls");
            if (e.title.show) {
                DomElement.createWithHTML(t, "div", "title", e.title.text, n);
            }
            if (e.title.showCopyButton) {
                const t = DomElement.createWithHTML(n, "button", "copy-all", _configuration.copyAllButtonText);
                t.onclick = function() {
                    const t = JSON.stringify(_elements_Data[e._currentView.element.id].data);
                    navigator.clipboard.writeText(t);
                    fireCustomTriggerEvent(e.events.onCopyAll, t);
                };
            }
            if (e.title.showTreeControls) {
                const t = DomElement.createWithHTML(n, "button", "openAll", _configuration.openAllButtonText);
                const o = DomElement.createWithHTML(n, "button", "closeAll", _configuration.closeAllButtonText);
                t.onclick = function() {
                    openAllNodes(e);
                };
                o.onclick = function() {
                    closeAllNodes(e);
                };
            }
        }
    }
    function openAllNodes(e) {
        e.showAllAsClosed = false;
        renderControlContainer(e);
        fireCustomTriggerEvent(e.events.onOpenAll, e._currentView.element);
    }
    function closeAllNodes(e) {
        e.showAllAsClosed = true;
        renderControlContainer(e);
        fireCustomTriggerEvent(e.events.onCloseAll, e._currentView.element);
    }
    function renderObject(e, t, n) {
        const o = DomElement.create(e, "div", "object-type-title");
        const r = DomElement.create(e, "div", "object-type-contents");
        const a = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
        const i = renderObjectValues(a, r, t, n);
        DomElement.createWithHTML(o, "span", t.showValueColors ? "object" : "", _configuration.objectText);
        if (t.showCounts && i > 0) {
            DomElement.createWithHTML(o, "span", t.showValueColors ? "object count" : "count", "{" + i + "}");
        }
    }
    function renderArray(e, t, n) {
        const o = DomElement.create(e, "div", "object-type-title");
        const r = DomElement.create(e, "div", "object-type-contents");
        const a = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
        DomElement.createWithHTML(o, "span", t.showValueColors ? "array" : "", _configuration.arrayText);
        renderArrayValues(a, r, t, n);
        if (t.showCounts) {
            DomElement.createWithHTML(o, "span", t.showValueColors ? "array count" : "count", "[" + n.length + "]");
        }
    }
    function renderObjectValues(e, t, n, o) {
        let r = 0;
        let a = [];
        for (let e in o) {
            if (o.hasOwnProperty(e)) {
                a.push(e);
            }
        }
        if (n.sortPropertyNames) {
            a = a.sort();
            if (!n.sortPropertyNamesInAlphabeticalOrder) {
                a = a.reverse();
            }
        }
        const i = a.length;
        for (let e = 0; e < i; e++) {
            const l = a[e];
            if (o.hasOwnProperty(l)) {
                renderValue(t, n, l, o[l], e === i - 1);
                r++;
            }
        }
        addArrowEvent(n, e, t);
        return r;
    }
    function renderArrayValues(e, t, n, o) {
        const r = o.length;
        if (!n.reverseArrayValues) {
            for (let e = 0; e < r; e++) {
                renderValue(t, n, getIndexName(n, e, r), o[e], e === r - 1);
            }
        } else {
            for (let e = r; e--; ) {
                renderValue(t, n, getIndexName(n, e, r), o[e], e === 0);
            }
        }
        addArrowEvent(n, e, t);
    }
    function renderValue(e, t, n, o, r) {
        const a = DomElement.create(e, "div", "object-type-value");
        const i = t.showArrowToggles ? DomElement.create(a, "div", "no-arrow") : null;
        let l = null;
        let s = null;
        let u = false;
        let c = null;
        let f = true;
        DomElement.createWithHTML(a, "span", "title", n);
        DomElement.createWithHTML(a, "span", "split", ":");
        if (!Is.defined(o)) {
            if (!t.ignore.nullValues) {
                l = t.showValueColors ? "null" : "";
                s = DomElement.createWithHTML(a, "span", l, "null");
                f = false;
                if (Is.definedFunction(t.events.onNullRender)) {
                    fireCustomTriggerEvent(t.events.onNullRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedFunction(o)) {
            if (!t.ignore.functionValues) {
                l = t.showValueColors ? "function" : "";
                s = DomElement.createWithHTML(a, "span", l, getFunctionName(o));
                c = "function";
                if (Is.definedFunction(t.events.onFunctionRender)) {
                    fireCustomTriggerEvent(t.events.onFunctionRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedBoolean(o)) {
            if (!t.ignore.booleanValues) {
                l = t.showValueColors ? "boolean" : "";
                s = DomElement.createWithHTML(a, "span", l, o);
                c = "boolean";
                if (Is.definedFunction(t.events.onBooleanRender)) {
                    fireCustomTriggerEvent(t.events.onBooleanRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedDecimal(o)) {
            if (!t.ignore.decimalValues) {
                const e = getFixedValue(o, t.maximumDecimalPlaces);
                l = t.showValueColors ? "decimal" : "";
                s = DomElement.createWithHTML(a, "span", l, e);
                c = "decimal";
                if (Is.definedFunction(t.events.onDecimalRender)) {
                    fireCustomTriggerEvent(t.events.onDecimalRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedNumber(o)) {
            if (!t.ignore.numberValues) {
                l = t.showValueColors ? "number" : "";
                s = DomElement.createWithHTML(a, "span", l, o);
                c = "number";
                if (Is.definedFunction(t.events.onNumberRender)) {
                    fireCustomTriggerEvent(t.events.onNumberRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedString(o)) {
            if (!t.ignore.stringValues) {
                let e = null;
                if (t.showStringHexColors && isHexColor(o)) {
                    e = o;
                } else {
                    if (t.maximumStringLength > 0 && o.length > t.maximumStringLength) {
                        o = o.substring(0, t.maximumStringLength) + _configuration.ellipsisText;
                    }
                }
                const n = t.showStringQuotes ? '"' + o + '"' : o;
                l = t.showValueColors ? "string" : "";
                s = DomElement.createWithHTML(a, "span", l, n);
                c = "string";
                if (Is.definedString(e)) {
                    s.style.color = e;
                }
                if (Is.definedFunction(t.events.onStringRender)) {
                    fireCustomTriggerEvent(t.events.onStringRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedDate(o)) {
            if (!t.ignore.dateValues) {
                l = t.showValueColors ? "date" : "";
                s = DomElement.createWithHTML(a, "span", l, DateTime.getCustomFormattedDateText(_configuration, o, t.dateTimeFormat));
                c = "date";
                if (Is.definedFunction(t.events.onDateRender)) {
                    fireCustomTriggerEvent(t.events.onDateRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedObject(o) && !Is.definedArray(o)) {
            if (!t.ignore.objectValues) {
                const e = DomElement.create(a, "span", t.showValueColors ? "object" : "");
                const n = DomElement.create(a, "div", "object-type-contents");
                const l = renderObjectValues(i, n, t, o);
                DomElement.createWithHTML(e, "span", "title", _configuration.objectText);
                if (t.showCounts && l > 0) {
                    DomElement.createWithHTML(e, "span", "count", "{" + l + "}");
                }
                createComma(t, e, r);
                c = "object";
            } else {
                u = true;
            }
        } else if (Is.definedArray(o)) {
            if (!t.ignore.arrayValues) {
                const e = DomElement.create(a, "span", t.showValueColors ? "array" : "");
                const n = DomElement.create(a, "div", "object-type-contents");
                DomElement.createWithHTML(e, "span", "title", _configuration.arrayText);
                if (t.showCounts) {
                    DomElement.createWithHTML(e, "span", "count", "[" + o.length + "]");
                }
                createComma(t, e, r);
                renderArrayValues(i, n, t, o);
                c = "array";
            } else {
                u = true;
            }
        } else {
            if (!t.ignore.unknownValues) {
                l = t.showValueColors ? "unknown" : "";
                s = DomElement.createWithHTML(a, "span", l, o.toString());
                c = "unknown";
                if (Is.definedFunction(t.events.onUnknownRender)) {
                    fireCustomTriggerEvent(t.events.onUnknownRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        }
        if (u) {
            e.removeChild(a);
        } else {
            if (Is.defined(s)) {
                addValueClickEvent(t, s, o, c, f);
            }
        }
    }
    function addValueClickEvent(e, t, n, o, r) {
        if (r && Is.definedFunction(e.events.onValueClick)) {
            t.onclick = function() {
                fireCustomTriggerEvent(e.events.onValueClick, n, o);
            };
        } else {
            DomElement.addClass(t, "no-hover");
        }
    }
    function addArrowEvent(e, t, n) {
        if (Is.defined(t)) {
            t.onclick = function() {
                if (t.className === "down-arrow") {
                    n.style.display = "none";
                    t.className = "right-arrow";
                } else {
                    n.style.display = "block";
                    t.className = "down-arrow";
                }
            };
            if (e.showAllAsClosed) {
                n.style.display = "none";
                t.className = "right-arrow";
            } else {
                t.className = "down-arrow";
            }
        }
    }
    function getFunctionName(e) {
        let t;
        const n = e.toString().split("(");
        const o = n[0].split(" ");
        if (o.length === 2) {
            t = o[1];
        } else {
            t = o[0];
        }
        t += "()";
        return t;
    }
    function createComma(e, t, n) {
        if (e.showCommas && !n) {
            DomElement.createWithHTML(t, "span", "comma", ",");
        }
    }
    function getIndexName(e, t, n) {
        let o = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
        if (!e.addArrayIndexPadding) {
            o = Data.String.padNumber(parseInt(o), n.toString().length);
        }
        return o;
    }
    function getFixedValue(e, t) {
        var n;
        const o = new RegExp("^-?\\d+(?:.\\d{0," + (t || -1) + "})?");
        return ((n = e.toString().match(o)) == null ? void 0 : n[0]) || "";
    }
    function isHexColor(e) {
        let t = e.length >= 2 && e.length <= 7;
        if (t && e[0] === "#") {
            t = isNaN(+e.substring(1, e.length - 1));
        }
        return t;
    }
    function buildAttributeOptions(e) {
        let t = Data.getDefaultObject(e, {});
        t.data = Data.getDefaultObject(t.data, null);
        t.showCounts = Data.getDefaultBoolean(t.showCounts, true);
        t.useZeroIndexingForArrays = Data.getDefaultBoolean(t.useZeroIndexingForArrays, true);
        t.dateTimeFormat = Data.getDefaultString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
        t.showArrowToggles = Data.getDefaultBoolean(t.showArrowToggles, true);
        t.showStringQuotes = Data.getDefaultBoolean(t.showStringQuotes, true);
        t.showAllAsClosed = Data.getDefaultBoolean(t.showAllAsClosed, false);
        t.sortPropertyNames = Data.getDefaultBoolean(t.sortPropertyNames, true);
        t.sortPropertyNamesInAlphabeticalOrder = Data.getDefaultBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
        t.showCommas = Data.getDefaultBoolean(t.showCommas, false);
        t.reverseArrayValues = Data.getDefaultBoolean(t.reverseArrayValues, false);
        t.addArrayIndexPadding = Data.getDefaultBoolean(t.addArrayIndexPadding, false);
        t.showValueColors = Data.getDefaultBoolean(t.showValueColors, true);
        t.maximumDecimalPlaces = Data.getDefaultNumber(t.maximumDecimalPlaces, 2);
        t.maximumStringLength = Data.getDefaultNumber(t.maximumStringLength, 0);
        t.showStringHexColors = Data.getDefaultBoolean(t.showStringHexColors, false);
        t = buildAttributeOptionTitle(t);
        t = buildAttributeOptionIgnore(t);
        t = buildAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildAttributeOptionTitle(e) {
        e.title = Data.getDefaultObject(e.title, {});
        e.title.text = Data.getDefaultString(e.title.text, "JsonTree.js");
        e.title.show = Data.getDefaultBoolean(e.title.show, true);
        e.title.showTreeControls = Data.getDefaultBoolean(e.title.showTreeControls, true);
        e.title.showCopyButton = Data.getDefaultBoolean(e.title.showCopyButton, false);
        return e;
    }
    function buildAttributeOptionIgnore(e) {
        e.ignore = Data.getDefaultObject(e.ignore, {});
        e.ignore.nullValues = Data.getDefaultBoolean(e.ignore.nullValues, false);
        e.ignore.functionValues = Data.getDefaultBoolean(e.ignore.functionValues, false);
        e.ignore.unknownValues = Data.getDefaultBoolean(e.ignore.unknownValues, false);
        e.ignore.booleanValues = Data.getDefaultBoolean(e.ignore.booleanValues, false);
        e.ignore.decimalValues = Data.getDefaultBoolean(e.ignore.decimalValues, false);
        e.ignore.numberValues = Data.getDefaultBoolean(e.ignore.numberValues, false);
        e.ignore.stringValues = Data.getDefaultBoolean(e.ignore.stringValues, false);
        e.ignore.dateValues = Data.getDefaultBoolean(e.ignore.dateValues, false);
        e.ignore.objectValues = Data.getDefaultBoolean(e.ignore.objectValues, false);
        e.ignore.arrayValues = Data.getDefaultBoolean(e.ignore.arrayValues, false);
        return e;
    }
    function buildAttributeOptionCustomTriggers(e) {
        e.events = Data.getDefaultObject(e.events, {});
        e.events.onBeforeRender = Data.getDefaultFunction(e.events.onBeforeRender, null);
        e.events.onRenderComplete = Data.getDefaultFunction(e.events.onRenderComplete, null);
        e.events.onValueClick = Data.getDefaultFunction(e.events.onValueClick, null);
        e.events.onRefresh = Data.getDefaultFunction(e.events.onRefresh, null);
        e.events.onCopyAll = Data.getDefaultFunction(e.events.onCopyAll, null);
        e.events.onOpenAll = Data.getDefaultFunction(e.events.onOpenAll, null);
        e.events.onCloseAll = Data.getDefaultFunction(e.events.onCloseAll, null);
        e.events.onDestroy = Data.getDefaultFunction(e.events.onDestroy, null);
        e.events.onBooleanRender = Data.getDefaultFunction(e.events.onBooleanRender, null);
        e.events.onDecimalRender = Data.getDefaultFunction(e.events.onDecimalRender, null);
        e.events.onNumberRender = Data.getDefaultFunction(e.events.onNumberRender, null);
        e.events.onStringRender = Data.getDefaultFunction(e.events.onStringRender, null);
        e.events.onDateRender = Data.getDefaultFunction(e.events.onDateRender, null);
        e.events.onFunctionRender = Data.getDefaultFunction(e.events.onFunctionRender, null);
        e.events.onNullRender = Data.getDefaultFunction(e.events.onNullRender, null);
        e.events.onUnknownRender = Data.getDefaultFunction(e.events.onUnknownRender, null);
        return e;
    }
    function fireCustomTriggerEvent(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    function getObjectFromString(objectString) {
        const result = {
            parsed: true,
            object: null
        };
        try {
            if (Is.definedString(objectString)) {
                result.object = JSON.parse(objectString);
            }
        } catch (e1) {
            try {
                result.object = eval("(" + objectString + ")");
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!_configuration.safeMode) {
                    console.error(_configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    function destroyElement(e) {
        e._currentView.element.innerHTML = "";
        e._currentView.element.className = "";
        fireCustomTriggerEvent(e.events.onDestroy, e._currentView.element);
    }
    function buildDefaultConfiguration(e = null) {
        _configuration = Data.getDefaultObject(e, {});
        _configuration.safeMode = Data.getDefaultBoolean(_configuration.safeMode, true);
        _configuration.domElementTypes = Data.getDefaultStringOrArray(_configuration.domElementTypes, [ "*" ]);
        buildDefaultConfigurationStrings();
    }
    function buildDefaultConfigurationStrings() {
        _configuration.objectText = Data.getDefaultAnyString(_configuration.objectText, "object");
        _configuration.arrayText = Data.getDefaultAnyString(_configuration.arrayText, "array");
        _configuration.closeAllButtonText = Data.getDefaultAnyString(_configuration.closeAllButtonText, "Close All");
        _configuration.openAllButtonText = Data.getDefaultAnyString(_configuration.openAllButtonText, "Open All");
        _configuration.copyAllButtonText = Data.getDefaultAnyString(_configuration.copyAllButtonText, "Copy All");
        _configuration.objectErrorText = Data.getDefaultAnyString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
        _configuration.attributeNotValidErrorText = Data.getDefaultAnyString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
        _configuration.attributeNotSetErrorText = Data.getDefaultAnyString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
        _configuration.stText = Data.getDefaultAnyString(_configuration.stText, "st");
        _configuration.ndText = Data.getDefaultAnyString(_configuration.ndText, "nd");
        _configuration.rdText = Data.getDefaultAnyString(_configuration.rdText, "rd");
        _configuration.thText = Data.getDefaultAnyString(_configuration.thText, "th");
        _configuration.ellipsisText = Data.getDefaultAnyString(_configuration.ellipsisText, "...");
        if (Is.invalidOptionArray(_configuration.dayNames, 7)) {
            _configuration.dayNames = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
        }
        if (Is.invalidOptionArray(_configuration.dayNamesAbbreviated, 7)) {
            _configuration.dayNamesAbbreviated = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
        }
        if (Is.invalidOptionArray(_configuration.monthNames, 12)) {
            _configuration.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        }
        if (Is.invalidOptionArray(_configuration.monthNamesAbbreviated, 12)) {
            _configuration.monthNamesAbbreviated = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        }
    }
    const _public = {
        refresh: function(e) {
            if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                const t = _elements_Data[e].options;
                renderControlContainer(t);
                fireCustomTriggerEvent(t.events.onRefresh, t._currentView.element);
            }
            return _public;
        },
        refreshAll: function() {
            for (let e in _elements_Data) {
                if (_elements_Data.hasOwnProperty(e)) {
                    const t = _elements_Data[e].options;
                    renderControlContainer(t);
                    fireCustomTriggerEvent(t.events.onRefresh, t._currentView.element);
                }
            }
            return _public;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                renderControl(renderBindingOptions(t, e));
            }
            return _public;
        },
        renderAll: function() {
            render();
            return _public;
        },
        openAll: function(e) {
            if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                openAllNodes(_elements_Data[e].options);
            }
            return _public;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                closeAllNodes(_elements_Data[e].options);
            }
            return _public;
        },
        destroy: function(e) {
            if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                destroyElement(_elements_Data[e].options);
                delete _elements_Data[e];
            }
            return _public;
        },
        destroyAll: function() {
            for (let e in _elements_Data) {
                if (_elements_Data.hasOwnProperty(e)) {
                    destroyElement(_elements_Data[e].options);
                }
            }
            _elements_Data = {};
            return _public;
        },
        setConfiguration: function(e) {
            if (Is.definedObject(e)) {
                let t = false;
                const n = _configuration;
                for (let o in e) {
                    if (e.hasOwnProperty(o) && _configuration.hasOwnProperty(o) && n[o] !== e[o]) {
                        n[o] = e[o];
                        t = true;
                    }
                }
                if (t) {
                    buildDefaultConfiguration(n);
                }
            }
            return _public;
        },
        getIds: function() {
            const e = [];
            for (let t in _elements_Data) {
                if (_elements_Data.hasOwnProperty(t)) {
                    e.push(t);
                }
            }
            return e;
        },
        getVersion: function() {
            return "2.0.0";
        }
    };
    (() => {
        buildDefaultConfiguration();
        document.addEventListener("DOMContentLoaded", (function() {
            render();
        }));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = _public;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map