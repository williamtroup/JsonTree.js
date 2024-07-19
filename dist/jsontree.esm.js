var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var init_enum = __esm({
    "src/ts/data/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/data/is.ts"() {
        "use strict";
        init_enum();
        (e => {
            function t(e) {
                return e !== null && e !== void 0 && e.toString() !== "";
            }
            e.defined = t;
            function n(e) {
                return t(e) && typeof e === "object";
            }
            e.definedObject = n;
            function r(e) {
                return t(e) && typeof e === "boolean";
            }
            e.definedBoolean = r;
            function o(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = o;
            function i(e) {
                return t(e) && typeof e === "function";
            }
            e.definedFunction = i;
            function l(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = l;
            function a(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = a;
            function s(e) {
                return n(e) && e instanceof Date;
            }
            e.definedDate = s;
            function u(e) {
                return t(e) && typeof e === "number" && e % 1 !== 0;
            }
            e.definedDecimal = u;
            function f(e, t = 1) {
                return !a(e) || e.length < t;
            }
            e.invalidOptionArray = f;
            function c(e) {
                let t = e.length >= 2 && e.length <= 7;
                if (t && e[0] === "#") {
                    t = isNaN(+e.substring(1, e.length - 1));
                }
                return t;
            }
            e.hexColor = c;
        })(Is || (Is = {}));
    }
});

var Default;

var init_default = __esm({
    "src/ts/data/default.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getDefaultAnyString = t;
            function n(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getDefaultString = n;
            function r(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getDefaultBoolean = r;
            function o(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getDefaultNumber = o;
            function i(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getDefaultFunction = i;
            function l(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getDefaultArray = l;
            function a(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getDefaultObject = a;
            function s(e, t) {
                let n = t;
                if (Is.definedString(e)) {
                    const r = e.toString().split(" ");
                    if (r.length === 0) {
                        e = t;
                    } else {
                        n = r;
                    }
                } else {
                    n = l(e, t);
                }
                return n;
            }
            e.getDefaultStringOrArray = s;
            function u(e, t) {
                var n;
                const r = new RegExp("^-?\\d+(?:.\\d{0," + (t || -1) + "})?");
                return ((n = e.toString().match(r)) == null ? void 0 : n[0]) || "";
            }
            e.getFixedDecimalPlacesValue = u;
        })(Default || (Default = {}));
    }
});

var DomElement;

var init_dom = __esm({
    "src/ts/dom/dom.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t, n = "", r = null) {
                const o = t.toLowerCase();
                const i = o === "text";
                let l = i ? document.createTextNode("") : document.createElement(o);
                if (Is.defined(n)) {
                    l.className = n;
                }
                if (Is.defined(r)) {
                    e.insertBefore(l, r);
                } else {
                    e.appendChild(l);
                }
                return l;
            }
            e.create = t;
            function n(e, n, r, o, i = null) {
                const l = t(e, n, r, i);
                l.innerHTML = o;
                return l;
            }
            e.createWithHTML = n;
            function r(e, t) {
                e.classList.add(t);
            }
            e.addClass = r;
        })(DomElement || (DomElement = {}));
    }
});

var Str;

var init_str = __esm({
    "src/ts/data/str.ts"() {
        "use strict";
        init_enum();
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
                let r = n;
                if (n.length < t) {
                    const e = t - n.length + 1;
                    r = Array(e).join("0") + n;
                }
                return r;
            }
            e.padNumber = n;
        })(Str || (Str = {}));
    }
});

var DateTime;

var init_datetime = __esm({
    "src/ts/data/datetime.ts"() {
        "use strict";
        init_str();
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
            function r(e, r, o) {
                let i = o;
                const l = t(r);
                i = i.replace("{hh}", Str.padNumber(r.getHours(), 2));
                i = i.replace("{h}", r.getHours().toString());
                i = i.replace("{MM}", Str.padNumber(r.getMinutes(), 2));
                i = i.replace("{M}", r.getMinutes().toString());
                i = i.replace("{ss}", Str.padNumber(r.getSeconds(), 2));
                i = i.replace("{s}", r.getSeconds().toString());
                i = i.replace("{dddd}", e.dayNames[l]);
                i = i.replace("{ddd}", e.dayNamesAbbreviated[l]);
                i = i.replace("{dd}", Str.padNumber(r.getDate()));
                i = i.replace("{d}", r.getDate().toString());
                i = i.replace("{o}", n(e, r.getDate()));
                i = i.replace("{mmmm}", e.monthNames[r.getMonth()]);
                i = i.replace("{mmm}", e.monthNamesAbbreviated[r.getMonth()]);
                i = i.replace("{mm}", Str.padNumber(r.getMonth() + 1));
                i = i.replace("{m}", (r.getMonth() + 1).toString());
                i = i.replace("{yyyy}", r.getFullYear().toString());
                i = i.replace("{yyy}", r.getFullYear().toString().substring(1));
                i = i.replace("{yy}", r.getFullYear().toString().substring(2));
                i = i.replace("{y}", Number.parseInt(r.getFullYear().toString().substring(2)).toString());
                return i;
            }
            e.getCustomFormattedDateText = r;
        })(DateTime || (DateTime = {}));
    }
});

var Constants;

var init_constant = __esm({
    "src/ts/constant.ts"() {
        "use strict";
        (e => {
            e.JSONTREE_JS_ATTRIBUTE_NAME = "data-jsontree-js";
        })(Constants || (Constants = {}));
    }
});

var require_jsontree = __commonJS({
    "src/jsontree.ts"(exports, module) {
        init_default();
        init_is();
        init_dom();
        init_enum();
        init_datetime();
        init_constant();
        init_str();
        (() => {
            let _configuration = {};
            let _elements_Data = {};
            function render() {
                const e = _configuration.domElementTypes;
                const t = e.length;
                for (let n = 0; n < t; n++) {
                    const t = document.getElementsByTagName(e[n]);
                    const r = [].slice.call(t);
                    const o = r.length;
                    for (let e = 0; e < o; e++) {
                        if (!renderElement(r[e])) {
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
                        const r = getObjectFromString(n);
                        if (r.parsed && Is.definedObject(r.object)) {
                            renderControl(renderBindingOptions(r.object, e));
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
                    e._currentView.element.id = Str.newGuid();
                }
                e._currentView.element.className = "json-tree-js";
                e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
                if (!_elements_Data.hasOwnProperty(e._currentView.element.id)) {
                    _elements_Data[e._currentView.element.id] = e;
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
                        t.onclick = () => {
                            const t = JSON.stringify(_elements_Data[e._currentView.element.id].data);
                            navigator.clipboard.writeText(t);
                            fireCustomTriggerEvent(e.events.onCopyAll, t);
                        };
                    }
                    if (e.title.showTreeControls) {
                        const t = DomElement.createWithHTML(n, "button", "openAll", _configuration.openAllButtonText);
                        const r = DomElement.createWithHTML(n, "button", "closeAll", _configuration.closeAllButtonText);
                        t.onclick = () => {
                            openAllNodes(e);
                        };
                        r.onclick = () => {
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
                const r = DomElement.create(e, "div", "object-type-title");
                const o = DomElement.create(e, "div", "object-type-contents");
                const i = t.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
                const l = renderObjectValues(i, o, t, n);
                DomElement.createWithHTML(r, "span", t.showValueColors ? "object" : "", _configuration.objectText);
                if (t.showCounts && l > 0) {
                    DomElement.createWithHTML(r, "span", t.showValueColors ? "object count" : "count", "{" + l + "}");
                }
            }
            function renderArray(e, t, n) {
                const r = DomElement.create(e, "div", "object-type-title");
                const o = DomElement.create(e, "div", "object-type-contents");
                const i = t.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
                DomElement.createWithHTML(r, "span", t.showValueColors ? "array" : "", _configuration.arrayText);
                renderArrayValues(i, o, t, n);
                if (t.showCounts) {
                    DomElement.createWithHTML(r, "span", t.showValueColors ? "array count" : "count", "[" + n.length + "]");
                }
            }
            function renderObjectValues(e, t, n, r) {
                let o = 0;
                let i = [];
                for (let e in r) {
                    if (r.hasOwnProperty(e)) {
                        i.push(e);
                    }
                }
                if (n.sortPropertyNames) {
                    i = i.sort();
                    if (!n.sortPropertyNamesInAlphabeticalOrder) {
                        i = i.reverse();
                    }
                }
                const l = i.length;
                for (let e = 0; e < l; e++) {
                    const a = i[e];
                    if (r.hasOwnProperty(a)) {
                        renderValue(t, n, a, r[a], e === l - 1);
                        o++;
                    }
                }
                addArrowEvent(n, e, t);
                return o;
            }
            function renderArrayValues(e, t, n, r) {
                const o = r.length;
                if (!n.reverseArrayValues) {
                    for (let e = 0; e < o; e++) {
                        renderValue(t, n, getIndexName(n, e, o), r[e], e === o - 1);
                    }
                } else {
                    for (let e = o; e--; ) {
                        renderValue(t, n, getIndexName(n, e, o), r[e], e === 0);
                    }
                }
                addArrowEvent(n, e, t);
            }
            function renderValue(e, t, n, r, o) {
                const i = DomElement.create(e, "div", "object-type-value");
                const l = t.showArrowToggles ? DomElement.create(i, "div", "no-arrow") : null;
                let a = null;
                let s = null;
                let u = false;
                let f = null;
                let c = true;
                DomElement.createWithHTML(i, "span", "title", n);
                DomElement.createWithHTML(i, "span", "split", ":");
                if (!Is.defined(r)) {
                    if (!t.ignore.nullValues) {
                        a = t.showValueColors ? "null" : "";
                        s = DomElement.createWithHTML(i, "span", a, "null");
                        c = false;
                        if (Is.definedFunction(t.events.onNullRender)) {
                            fireCustomTriggerEvent(t.events.onNullRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedFunction(r)) {
                    if (!t.ignore.functionValues) {
                        a = t.showValueColors ? "function" : "";
                        s = DomElement.createWithHTML(i, "span", a, getFunctionName(r));
                        f = "function";
                        if (Is.definedFunction(t.events.onFunctionRender)) {
                            fireCustomTriggerEvent(t.events.onFunctionRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedBoolean(r)) {
                    if (!t.ignore.booleanValues) {
                        a = t.showValueColors ? "boolean" : "";
                        s = DomElement.createWithHTML(i, "span", a, r);
                        f = "boolean";
                        if (Is.definedFunction(t.events.onBooleanRender)) {
                            fireCustomTriggerEvent(t.events.onBooleanRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedDecimal(r)) {
                    if (!t.ignore.decimalValues) {
                        const e = Default.getFixedDecimalPlacesValue(r, t.maximumDecimalPlaces);
                        a = t.showValueColors ? "decimal" : "";
                        s = DomElement.createWithHTML(i, "span", a, e);
                        f = "decimal";
                        if (Is.definedFunction(t.events.onDecimalRender)) {
                            fireCustomTriggerEvent(t.events.onDecimalRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedNumber(r)) {
                    if (!t.ignore.numberValues) {
                        a = t.showValueColors ? "number" : "";
                        s = DomElement.createWithHTML(i, "span", a, r);
                        f = "number";
                        if (Is.definedFunction(t.events.onNumberRender)) {
                            fireCustomTriggerEvent(t.events.onNumberRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedString(r)) {
                    if (!t.ignore.stringValues) {
                        let e = null;
                        if (t.showValueColors && t.showStringHexColors && Is.hexColor(r)) {
                            e = r;
                        } else {
                            if (t.maximumStringLength > 0 && r.length > t.maximumStringLength) {
                                r = r.substring(0, t.maximumStringLength) + _configuration.ellipsisText;
                            }
                        }
                        const n = t.showStringQuotes ? '"' + r + '"' : r;
                        a = t.showValueColors ? "string" : "";
                        s = DomElement.createWithHTML(i, "span", a, n);
                        f = "string";
                        if (Is.definedString(e)) {
                            s.style.color = e;
                        }
                        if (Is.definedFunction(t.events.onStringRender)) {
                            fireCustomTriggerEvent(t.events.onStringRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedDate(r)) {
                    if (!t.ignore.dateValues) {
                        a = t.showValueColors ? "date" : "";
                        s = DomElement.createWithHTML(i, "span", a, DateTime.getCustomFormattedDateText(_configuration, r, t.dateTimeFormat));
                        f = "date";
                        if (Is.definedFunction(t.events.onDateRender)) {
                            fireCustomTriggerEvent(t.events.onDateRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedObject(r) && !Is.definedArray(r)) {
                    if (!t.ignore.objectValues) {
                        const e = DomElement.create(i, "span", t.showValueColors ? "object" : "");
                        const n = DomElement.create(i, "div", "object-type-contents");
                        const a = renderObjectValues(l, n, t, r);
                        DomElement.createWithHTML(e, "span", "title", _configuration.objectText);
                        if (t.showCounts && a > 0) {
                            DomElement.createWithHTML(e, "span", "count", "{" + a + "}");
                        }
                        createComma(t, e, o);
                        f = "object";
                    } else {
                        u = true;
                    }
                } else if (Is.definedArray(r)) {
                    if (!t.ignore.arrayValues) {
                        const e = DomElement.create(i, "span", t.showValueColors ? "array" : "");
                        const n = DomElement.create(i, "div", "object-type-contents");
                        DomElement.createWithHTML(e, "span", "title", _configuration.arrayText);
                        if (t.showCounts) {
                            DomElement.createWithHTML(e, "span", "count", "[" + r.length + "]");
                        }
                        createComma(t, e, o);
                        renderArrayValues(l, n, t, r);
                        f = "array";
                    } else {
                        u = true;
                    }
                } else {
                    if (!t.ignore.unknownValues) {
                        a = t.showValueColors ? "unknown" : "";
                        s = DomElement.createWithHTML(i, "span", a, r.toString());
                        f = "unknown";
                        if (Is.definedFunction(t.events.onUnknownRender)) {
                            fireCustomTriggerEvent(t.events.onUnknownRender, s);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                }
                if (u) {
                    e.removeChild(i);
                } else {
                    if (Is.defined(s)) {
                        addValueClickEvent(t, s, r, f, c);
                    }
                }
            }
            function addValueClickEvent(e, t, n, r, o) {
                if (o && Is.definedFunction(e.events.onValueClick)) {
                    t.onclick = () => {
                        fireCustomTriggerEvent(e.events.onValueClick, n, r);
                    };
                } else {
                    DomElement.addClass(t, "no-hover");
                }
            }
            function addArrowEvent(e, t, n) {
                if (Is.defined(t)) {
                    t.onclick = () => {
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
                const r = n[0].split(" ");
                if (r.length === 2) {
                    t = r[1];
                } else {
                    t = r[0];
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
                let r = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
                if (!e.addArrayIndexPadding) {
                    r = Str.padNumber(parseInt(r), n.toString().length);
                }
                return r;
            }
            function buildAttributeOptions(e) {
                let t = Default.getDefaultObject(e, {});
                t.data = Default.getDefaultObject(t.data, null);
                t.showCounts = Default.getDefaultBoolean(t.showCounts, true);
                t.useZeroIndexingForArrays = Default.getDefaultBoolean(t.useZeroIndexingForArrays, true);
                t.dateTimeFormat = Default.getDefaultString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
                t.showArrowToggles = Default.getDefaultBoolean(t.showArrowToggles, true);
                t.showStringQuotes = Default.getDefaultBoolean(t.showStringQuotes, true);
                t.showAllAsClosed = Default.getDefaultBoolean(t.showAllAsClosed, false);
                t.sortPropertyNames = Default.getDefaultBoolean(t.sortPropertyNames, true);
                t.sortPropertyNamesInAlphabeticalOrder = Default.getDefaultBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
                t.showCommas = Default.getDefaultBoolean(t.showCommas, false);
                t.reverseArrayValues = Default.getDefaultBoolean(t.reverseArrayValues, false);
                t.addArrayIndexPadding = Default.getDefaultBoolean(t.addArrayIndexPadding, false);
                t.showValueColors = Default.getDefaultBoolean(t.showValueColors, true);
                t.maximumDecimalPlaces = Default.getDefaultNumber(t.maximumDecimalPlaces, 2);
                t.maximumStringLength = Default.getDefaultNumber(t.maximumStringLength, 0);
                t.showStringHexColors = Default.getDefaultBoolean(t.showStringHexColors, false);
                t = buildAttributeOptionTitle(t);
                t = buildAttributeOptionIgnore(t);
                t = buildAttributeOptionCustomTriggers(t);
                return t;
            }
            function buildAttributeOptionTitle(e) {
                e.title = Default.getDefaultObject(e.title, {});
                e.title.text = Default.getDefaultString(e.title.text, "JsonTree.js");
                e.title.show = Default.getDefaultBoolean(e.title.show, true);
                e.title.showTreeControls = Default.getDefaultBoolean(e.title.showTreeControls, true);
                e.title.showCopyButton = Default.getDefaultBoolean(e.title.showCopyButton, false);
                return e;
            }
            function buildAttributeOptionIgnore(e) {
                e.ignore = Default.getDefaultObject(e.ignore, {});
                e.ignore.nullValues = Default.getDefaultBoolean(e.ignore.nullValues, false);
                e.ignore.functionValues = Default.getDefaultBoolean(e.ignore.functionValues, false);
                e.ignore.unknownValues = Default.getDefaultBoolean(e.ignore.unknownValues, false);
                e.ignore.booleanValues = Default.getDefaultBoolean(e.ignore.booleanValues, false);
                e.ignore.decimalValues = Default.getDefaultBoolean(e.ignore.decimalValues, false);
                e.ignore.numberValues = Default.getDefaultBoolean(e.ignore.numberValues, false);
                e.ignore.stringValues = Default.getDefaultBoolean(e.ignore.stringValues, false);
                e.ignore.dateValues = Default.getDefaultBoolean(e.ignore.dateValues, false);
                e.ignore.objectValues = Default.getDefaultBoolean(e.ignore.objectValues, false);
                e.ignore.arrayValues = Default.getDefaultBoolean(e.ignore.arrayValues, false);
                return e;
            }
            function buildAttributeOptionCustomTriggers(e) {
                e.events = Default.getDefaultObject(e.events, {});
                e.events.onBeforeRender = Default.getDefaultFunction(e.events.onBeforeRender, null);
                e.events.onRenderComplete = Default.getDefaultFunction(e.events.onRenderComplete, null);
                e.events.onValueClick = Default.getDefaultFunction(e.events.onValueClick, null);
                e.events.onRefresh = Default.getDefaultFunction(e.events.onRefresh, null);
                e.events.onCopyAll = Default.getDefaultFunction(e.events.onCopyAll, null);
                e.events.onOpenAll = Default.getDefaultFunction(e.events.onOpenAll, null);
                e.events.onCloseAll = Default.getDefaultFunction(e.events.onCloseAll, null);
                e.events.onDestroy = Default.getDefaultFunction(e.events.onDestroy, null);
                e.events.onBooleanRender = Default.getDefaultFunction(e.events.onBooleanRender, null);
                e.events.onDecimalRender = Default.getDefaultFunction(e.events.onDecimalRender, null);
                e.events.onNumberRender = Default.getDefaultFunction(e.events.onNumberRender, null);
                e.events.onStringRender = Default.getDefaultFunction(e.events.onStringRender, null);
                e.events.onDateRender = Default.getDefaultFunction(e.events.onDateRender, null);
                e.events.onFunctionRender = Default.getDefaultFunction(e.events.onFunctionRender, null);
                e.events.onNullRender = Default.getDefaultFunction(e.events.onNullRender, null);
                e.events.onUnknownRender = Default.getDefaultFunction(e.events.onUnknownRender, null);
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
                _configuration = Default.getDefaultObject(e, {});
                _configuration.safeMode = Default.getDefaultBoolean(_configuration.safeMode, true);
                _configuration.domElementTypes = Default.getDefaultStringOrArray(_configuration.domElementTypes, [ "*" ]);
                buildDefaultConfigurationStrings();
            }
            function buildDefaultConfigurationStrings() {
                _configuration.objectText = Default.getDefaultAnyString(_configuration.objectText, "object");
                _configuration.arrayText = Default.getDefaultAnyString(_configuration.arrayText, "array");
                _configuration.closeAllButtonText = Default.getDefaultAnyString(_configuration.closeAllButtonText, "Close All");
                _configuration.openAllButtonText = Default.getDefaultAnyString(_configuration.openAllButtonText, "Open All");
                _configuration.copyAllButtonText = Default.getDefaultAnyString(_configuration.copyAllButtonText, "Copy All");
                _configuration.objectErrorText = Default.getDefaultAnyString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                _configuration.attributeNotValidErrorText = Default.getDefaultAnyString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
                _configuration.attributeNotSetErrorText = Default.getDefaultAnyString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
                _configuration.stText = Default.getDefaultAnyString(_configuration.stText, "st");
                _configuration.ndText = Default.getDefaultAnyString(_configuration.ndText, "nd");
                _configuration.rdText = Default.getDefaultAnyString(_configuration.rdText, "rd");
                _configuration.thText = Default.getDefaultAnyString(_configuration.thText, "th");
                _configuration.ellipsisText = Default.getDefaultAnyString(_configuration.ellipsisText, "...");
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
                        const t = _elements_Data[e];
                        renderControlContainer(t);
                        fireCustomTriggerEvent(t.events.onRefresh, t._currentView.element);
                    }
                    return _public;
                },
                refreshAll: function() {
                    for (let e in _elements_Data) {
                        if (_elements_Data.hasOwnProperty(e)) {
                            const t = _elements_Data[e];
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
                        openAllNodes(_elements_Data[e]);
                    }
                    return _public;
                },
                closeAll: function(e) {
                    if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                        closeAllNodes(_elements_Data[e]);
                    }
                    return _public;
                },
                destroy: function(e) {
                    if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                        destroyElement(_elements_Data[e]);
                        delete _elements_Data[e];
                    }
                    return _public;
                },
                destroyAll: function() {
                    for (let e in _elements_Data) {
                        if (_elements_Data.hasOwnProperty(e)) {
                            destroyElement(_elements_Data[e]);
                        }
                    }
                    _elements_Data = {};
                    return _public;
                },
                setConfiguration: function(e) {
                    if (Is.definedObject(e)) {
                        let t = false;
                        const n = _configuration;
                        for (let r in e) {
                            if (e.hasOwnProperty(r) && _configuration.hasOwnProperty(r) && n[r] !== e[r]) {
                                n[r] = e[r];
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
                    return "2.0.1";
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
        })();
    }
});

export default require_jsontree();//# sourceMappingURL=jsontree.esm.js.map