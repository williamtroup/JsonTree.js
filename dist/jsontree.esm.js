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
            function d(e) {
                let t = e.length >= 2 && e.length <= 7;
                if (t && e[0] === "#") {
                    t = isNaN(+e.substring(1, e.length - 1));
                }
                return t;
            }
            e.hexColor = d;
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
            e.getAnyString = t;
            function n(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getString = n;
            function r(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getBoolean = r;
            function o(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getNumber = o;
            function a(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getFunction = a;
            function i(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getArray = i;
            function l(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getObject = l;
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
                    n = i(e, t);
                }
                return n;
            }
            e.getStringOrArray = s;
            function u(e, t) {
                var n;
                const r = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
                return ((n = e.toString().match(r)) == null ? void 0 : n[0]) || "";
            }
            e.getFixedDecimalPlacesValue = u;
            function c(e) {
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
            e.getFunctionName = c;
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
                const a = o === "text";
                let i = a ? document.createTextNode("") : document.createElement(o);
                if (Is.defined(n)) {
                    i.className = n;
                }
                if (Is.defined(r)) {
                    e.insertBefore(i, r);
                } else {
                    e.appendChild(i);
                }
                return i;
            }
            e.create = t;
            function n(e, n, r, o, a = null) {
                const i = t(e, n, r, a);
                i.innerHTML = o;
                return i;
            }
            e.createWithHTML = n;
            function r(e, t) {
                e.classList.add(t);
            }
            e.addClass = r;
            function o(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            e.cancelBubble = o;
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
                let n = e.text.thText;
                if (t === 31 || t === 21 || t === 1) {
                    n = e.text.stText;
                } else if (t === 22 || t === 2) {
                    n = e.text.ndText;
                } else if (t === 23 || t === 3) {
                    n = e.text.rdText;
                }
                return n;
            }
            e.getDayOrdinal = n;
            function r(e, r, o) {
                let a = o;
                const i = t(r);
                a = a.replace("{hh}", Str.padNumber(r.getHours(), 2));
                a = a.replace("{h}", r.getHours().toString());
                a = a.replace("{MM}", Str.padNumber(r.getMinutes(), 2));
                a = a.replace("{M}", r.getMinutes().toString());
                a = a.replace("{ss}", Str.padNumber(r.getSeconds(), 2));
                a = a.replace("{s}", r.getSeconds().toString());
                a = a.replace("{dddd}", e.text.dayNames[i]);
                a = a.replace("{ddd}", e.text.dayNamesAbbreviated[i]);
                a = a.replace("{dd}", Str.padNumber(r.getDate()));
                a = a.replace("{d}", r.getDate().toString());
                a = a.replace("{o}", n(e, r.getDate()));
                a = a.replace("{mmmm}", e.text.monthNames[r.getMonth()]);
                a = a.replace("{mmm}", e.text.monthNamesAbbreviated[r.getMonth()]);
                a = a.replace("{mm}", Str.padNumber(r.getMonth() + 1));
                a = a.replace("{m}", (r.getMonth() + 1).toString());
                a = a.replace("{yyyy}", r.getFullYear().toString());
                a = a.replace("{yyy}", r.getFullYear().toString().substring(1));
                a = a.replace("{yy}", r.getFullYear().toString().substring(2));
                a = a.replace("{y}", Number.parseInt(r.getFullYear().toString().substring(2)).toString());
                return a;
            }
            e.getCustomFormattedDateText = r;
            function o(e) {
                return !isNaN(+new Date(e));
            }
            e.isDateValid = o;
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

var Binding;

var init_binding = __esm({
    "src/ts/options/binding.ts"() {
        "use strict";
        init_default();
        (e => {
            let t;
            (t => {
                function n(t, n) {
                    const r = e.Options.get(t);
                    r._currentView = {};
                    r._currentView.element = n;
                    r._currentView.dataArrayCurrentIndex = 0;
                    return r;
                }
                t.getForNewInstance = n;
                function r(e) {
                    let t = Default.getObject(e, {});
                    t.data = Default.getObject(t.data, null);
                    t.showCounts = Default.getBoolean(t.showCounts, true);
                    t.useZeroIndexingForArrays = Default.getBoolean(t.useZeroIndexingForArrays, true);
                    t.dateTimeFormat = Default.getString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
                    t.showArrowToggles = Default.getBoolean(t.showArrowToggles, true);
                    t.showStringQuotes = Default.getBoolean(t.showStringQuotes, true);
                    t.showAllAsClosed = Default.getBoolean(t.showAllAsClosed, false);
                    t.sortPropertyNames = Default.getBoolean(t.sortPropertyNames, true);
                    t.sortPropertyNamesInAlphabeticalOrder = Default.getBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
                    t.showCommas = Default.getBoolean(t.showCommas, false);
                    t.reverseArrayValues = Default.getBoolean(t.reverseArrayValues, false);
                    t.addArrayIndexPadding = Default.getBoolean(t.addArrayIndexPadding, false);
                    t.showValueColors = Default.getBoolean(t.showValueColors, true);
                    t.maximumDecimalPlaces = Default.getNumber(t.maximumDecimalPlaces, 2);
                    t.maximumStringLength = Default.getNumber(t.maximumStringLength, 0);
                    t.showStringHexColors = Default.getBoolean(t.showStringHexColors, false);
                    t.showArrayItemsAsSeparateObjects = Default.getBoolean(t.showArrayItemsAsSeparateObjects, false);
                    t.copyOnlyCurrentPage = Default.getBoolean(t.copyOnlyCurrentPage, false);
                    t.fileDroppingEnabled = Default.getBoolean(t.fileDroppingEnabled, true);
                    t.parseStringsToDates = Default.getBoolean(t.parseStringsToDates, false);
                    t = o(t);
                    t = a(t);
                    t = i(t);
                    return t;
                }
                t.get = r;
                function o(e) {
                    e.title = Default.getObject(e.title, {});
                    e.title.text = Default.getString(e.title.text, "JsonTree.js");
                    e.title.show = Default.getBoolean(e.title.show, true);
                    e.title.showTreeControls = Default.getBoolean(e.title.showTreeControls, true);
                    e.title.showCopyButton = Default.getBoolean(e.title.showCopyButton, true);
                    return e;
                }
                function a(e) {
                    e.ignore = Default.getObject(e.ignore, {});
                    e.ignore.nullValues = Default.getBoolean(e.ignore.nullValues, false);
                    e.ignore.functionValues = Default.getBoolean(e.ignore.functionValues, false);
                    e.ignore.unknownValues = Default.getBoolean(e.ignore.unknownValues, false);
                    e.ignore.booleanValues = Default.getBoolean(e.ignore.booleanValues, false);
                    e.ignore.decimalValues = Default.getBoolean(e.ignore.decimalValues, false);
                    e.ignore.numberValues = Default.getBoolean(e.ignore.numberValues, false);
                    e.ignore.stringValues = Default.getBoolean(e.ignore.stringValues, false);
                    e.ignore.dateValues = Default.getBoolean(e.ignore.dateValues, false);
                    e.ignore.objectValues = Default.getBoolean(e.ignore.objectValues, false);
                    e.ignore.arrayValues = Default.getBoolean(e.ignore.arrayValues, false);
                    return e;
                }
                function i(e) {
                    e.events = Default.getObject(e.events, {});
                    e.events.onBeforeRender = Default.getFunction(e.events.onBeforeRender, null);
                    e.events.onRenderComplete = Default.getFunction(e.events.onRenderComplete, null);
                    e.events.onValueClick = Default.getFunction(e.events.onValueClick, null);
                    e.events.onRefresh = Default.getFunction(e.events.onRefresh, null);
                    e.events.onCopyAll = Default.getFunction(e.events.onCopyAll, null);
                    e.events.onOpenAll = Default.getFunction(e.events.onOpenAll, null);
                    e.events.onCloseAll = Default.getFunction(e.events.onCloseAll, null);
                    e.events.onDestroy = Default.getFunction(e.events.onDestroy, null);
                    e.events.onBooleanRender = Default.getFunction(e.events.onBooleanRender, null);
                    e.events.onDecimalRender = Default.getFunction(e.events.onDecimalRender, null);
                    e.events.onNumberRender = Default.getFunction(e.events.onNumberRender, null);
                    e.events.onStringRender = Default.getFunction(e.events.onStringRender, null);
                    e.events.onDateRender = Default.getFunction(e.events.onDateRender, null);
                    e.events.onFunctionRender = Default.getFunction(e.events.onFunctionRender, null);
                    e.events.onNullRender = Default.getFunction(e.events.onNullRender, null);
                    e.events.onUnknownRender = Default.getFunction(e.events.onUnknownRender, null);
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Binding || (Binding = {}));
    }
});

var Config;

var init_config = __esm({
    "src/ts/options/config.ts"() {
        "use strict";
        init_default();
        init_is();
        (e => {
            let t;
            (e => {
                function t(e = null) {
                    let t = Default.getObject(e, {});
                    t.safeMode = Default.getBoolean(t.safeMode, true);
                    t.domElementTypes = Default.getStringOrArray(t.domElementTypes, [ "*" ]);
                    t = n(t);
                    return t;
                }
                e.get = t;
                function n(e) {
                    e.text = Default.getObject(e.text, {});
                    e.text.objectText = Default.getAnyString(e.text.objectText, "object");
                    e.text.arrayText = Default.getAnyString(e.text.arrayText, "array");
                    e.text.closeAllButtonText = Default.getAnyString(e.text.closeAllButtonText, "Close All");
                    e.text.openAllButtonText = Default.getAnyString(e.text.openAllButtonText, "Open All");
                    e.text.copyAllButtonText = Default.getAnyString(e.text.copyAllButtonText, "Copy All");
                    e.text.objectErrorText = Default.getAnyString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                    e.text.attributeNotValidErrorText = Default.getAnyString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
                    e.text.attributeNotSetErrorText = Default.getAnyString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
                    e.text.stText = Default.getAnyString(e.text.stText, "st");
                    e.text.ndText = Default.getAnyString(e.text.ndText, "nd");
                    e.text.rdText = Default.getAnyString(e.text.rdText, "rd");
                    e.text.thText = Default.getAnyString(e.text.thText, "th");
                    e.text.ellipsisText = Default.getAnyString(e.text.ellipsisText, "...");
                    e.text.closeAllButtonSymbolText = Default.getAnyString(e.text.closeAllButtonSymbolText, "↑");
                    e.text.openAllButtonSymbolText = Default.getAnyString(e.text.openAllButtonSymbolText, "↓");
                    e.text.copyAllButtonSymbolText = Default.getAnyString(e.text.copyAllButtonSymbolText, "❐");
                    e.text.backButtonText = Default.getAnyString(e.text.backButtonText, "Back");
                    e.text.nextButtonText = Default.getAnyString(e.text.nextButtonText, "Next");
                    e.text.backButtonSymbolText = Default.getAnyString(e.text.backButtonSymbolText, "←");
                    e.text.nextButtonSymbolText = Default.getAnyString(e.text.nextButtonSymbolText, "→");
                    if (Is.invalidOptionArray(e.text.dayNames, 7)) {
                        e.text.dayNames = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
                    }
                    if (Is.invalidOptionArray(e.text.dayNamesAbbreviated, 7)) {
                        e.text.dayNamesAbbreviated = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
                    }
                    if (Is.invalidOptionArray(e.text.monthNames, 12)) {
                        e.text.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                    }
                    if (Is.invalidOptionArray(e.text.monthNamesAbbreviated, 12)) {
                        e.text.monthNamesAbbreviated = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                    }
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Config || (Config = {}));
    }
});

var Trigger;

var init_trigger = __esm({
    "src/ts/area/trigger.ts"() {
        "use strict";
        init_is();
        (e => {
            function t(e, ...t) {
                let n = null;
                if (Is.definedFunction(e)) {
                    n = e.apply(null, [].slice.call(t, 0));
                }
                return n;
            }
            e.customEvent = t;
        })(Trigger || (Trigger = {}));
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
        init_binding();
        init_config();
        init_trigger();
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
                            renderControl(Binding.Options.getForNewInstance(r.object, e));
                        } else {
                            if (!_configuration.safeMode) {
                                console.error(_configuration.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                                t = false;
                            }
                        }
                    } else {
                        if (!_configuration.safeMode) {
                            console.error(_configuration.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                            t = false;
                        }
                    }
                }
                return t;
            }
            function renderControl(e) {
                Trigger.customEvent(e.events.onBeforeRender, e._currentView.element);
                if (!Is.definedString(e._currentView.element.id)) {
                    e._currentView.element.id = Str.newGuid();
                }
                e._currentView.element.className = "json-tree-js";
                e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
                if (!_elements_Data.hasOwnProperty(e._currentView.element.id)) {
                    _elements_Data[e._currentView.element.id] = e;
                }
                renderControlContainer(e);
                Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
            }
            function renderControlContainer(e) {
                let t = _elements_Data[e._currentView.element.id].data;
                e._currentView.element.innerHTML = "";
                renderControlTitleBar(e, t);
                const n = DomElement.create(e._currentView.element, "div", "contents");
                makeAreaDroppable(n, e);
                if (e.showArrayItemsAsSeparateObjects) {
                    t = t[e._currentView.dataArrayCurrentIndex];
                }
                if (Is.definedObject(t) && !Is.definedArray(t)) {
                    renderObject(n, e, t, true);
                } else if (Is.definedArray(t)) {
                    renderArray(n, e, t);
                }
            }
            function renderControlTitleBar(e, t) {
                if (e.title.show || e.title.showTreeControls || e.title.showCopyButton) {
                    const n = DomElement.create(e._currentView.element, "div", "title-bar");
                    const r = DomElement.create(n, "div", "controls");
                    if (e.title.show) {
                        DomElement.createWithHTML(n, "div", "title", e.title.text, r);
                    }
                    if (e.title.showCopyButton) {
                        const n = DomElement.createWithHTML(r, "button", "copy-all", _configuration.text.copyAllButtonSymbolText);
                        n.title = _configuration.text.copyAllButtonText;
                        n.onclick = () => {
                            let n = null;
                            if (e.copyOnlyCurrentPage && e.showArrayItemsAsSeparateObjects) {
                                n = JSON.stringify(t[e._currentView.dataArrayCurrentIndex], null, 2);
                            } else {
                                n = JSON.stringify(t, null, 2);
                            }
                            navigator.clipboard.writeText(n);
                            Trigger.customEvent(e.events.onCopyAll, n);
                        };
                    }
                    if (e.title.showTreeControls) {
                        const t = DomElement.createWithHTML(r, "button", "openAll", _configuration.text.openAllButtonSymbolText);
                        t.title = _configuration.text.openAllButtonText;
                        const n = DomElement.createWithHTML(r, "button", "closeAll", _configuration.text.closeAllButtonSymbolText);
                        n.title = _configuration.text.closeAllButtonText;
                        t.onclick = () => {
                            openAllNodes(e);
                        };
                        n.onclick = () => {
                            closeAllNodes(e);
                        };
                    }
                    if (e.showArrayItemsAsSeparateObjects && Is.definedArray(t) && t.length > 1) {
                        const n = DomElement.createWithHTML(r, "button", "back", _configuration.text.backButtonSymbolText);
                        n.title = _configuration.text.backButtonText;
                        if (e._currentView.dataArrayCurrentIndex > 0) {
                            n.onclick = () => {
                                e._currentView.dataArrayCurrentIndex--;
                                renderControlContainer(e);
                                Trigger.customEvent(e.events.onBackPage, e._currentView.element);
                            };
                        } else {
                            n.disabled = true;
                        }
                        const o = DomElement.createWithHTML(r, "button", "next", _configuration.text.nextButtonSymbolText);
                        o.title = _configuration.text.nextButtonText;
                        if (e._currentView.dataArrayCurrentIndex < t.length - 1) {
                            o.onclick = () => {
                                e._currentView.dataArrayCurrentIndex++;
                                renderControlContainer(e);
                                Trigger.customEvent(e.events.onNextPage, e._currentView.element);
                            };
                        } else {
                            o.disabled = true;
                        }
                    } else {
                        e.showArrayItemsAsSeparateObjects = false;
                    }
                }
            }
            function openAllNodes(e) {
                e.showAllAsClosed = false;
                renderControlContainer(e);
                Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
            }
            function closeAllNodes(e) {
                e.showAllAsClosed = true;
                renderControlContainer(e);
                Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
            }
            function renderObject(e, t, n, r = false) {
                const o = DomElement.create(e, "div", "object-type-title");
                const a = DomElement.create(e, "div", "object-type-contents");
                const i = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
                const l = renderObjectValues(i, a, t, n);
                const s = DomElement.createWithHTML(o, "span", t.showValueColors ? "object" : "", _configuration.text.objectText);
                if (r && t.showArrayItemsAsSeparateObjects) {
                    let e = t.useZeroIndexingForArrays ? t._currentView.dataArrayCurrentIndex.toString() : (t._currentView.dataArrayCurrentIndex + 1).toString();
                    DomElement.createWithHTML(o, "span", t.showValueColors ? "object data-array-index" : "data-array-index", `[${e}]:`, s);
                }
                if (t.showCounts && l > 0) {
                    DomElement.createWithHTML(o, "span", t.showValueColors ? "object count" : "count", `{${l}}`);
                }
            }
            function renderArray(e, t, n) {
                const r = DomElement.create(e, "div", "object-type-title");
                const o = DomElement.create(e, "div", "object-type-contents");
                const a = t.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
                DomElement.createWithHTML(r, "span", t.showValueColors ? "array" : "", _configuration.text.arrayText);
                renderArrayValues(a, o, t, n);
                if (t.showCounts) {
                    DomElement.createWithHTML(r, "span", t.showValueColors ? "array count" : "count", `[${n.length}]`);
                }
            }
            function renderObjectValues(e, t, n, r) {
                let o = 0;
                let a = [];
                for (let e in r) {
                    if (r.hasOwnProperty(e)) {
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
                    if (r.hasOwnProperty(l)) {
                        renderValue(t, n, l, r[l], e === i - 1);
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
                const a = DomElement.create(e, "div", "object-type-value");
                const i = t.showArrowToggles ? DomElement.create(a, "div", "no-arrow") : null;
                let l = null;
                let s = null;
                let u = false;
                let c = null;
                let d = true;
                DomElement.createWithHTML(a, "span", "title", n);
                DomElement.createWithHTML(a, "span", "split", ":");
                if (!Is.defined(r)) {
                    if (!t.ignore.nullValues) {
                        l = t.showValueColors ? "null" : "";
                        s = DomElement.createWithHTML(a, "span", l, "null");
                        d = false;
                        if (Is.definedFunction(t.events.onNullRender)) {
                            Trigger.customEvent(t.events.onNullRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedFunction(r)) {
                    if (!t.ignore.functionValues) {
                        l = t.showValueColors ? "function" : "";
                        s = DomElement.createWithHTML(a, "span", l, Default.getFunctionName(r));
                        c = "function";
                        if (Is.definedFunction(t.events.onFunctionRender)) {
                            Trigger.customEvent(t.events.onFunctionRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedBoolean(r)) {
                    if (!t.ignore.booleanValues) {
                        l = t.showValueColors ? "boolean" : "";
                        s = DomElement.createWithHTML(a, "span", l, r);
                        c = "boolean";
                        if (Is.definedFunction(t.events.onBooleanRender)) {
                            Trigger.customEvent(t.events.onBooleanRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedDecimal(r)) {
                    if (!t.ignore.decimalValues) {
                        const e = Default.getFixedDecimalPlacesValue(r, t.maximumDecimalPlaces);
                        l = t.showValueColors ? "decimal" : "";
                        s = DomElement.createWithHTML(a, "span", l, e);
                        c = "decimal";
                        if (Is.definedFunction(t.events.onDecimalRender)) {
                            Trigger.customEvent(t.events.onDecimalRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedNumber(r)) {
                    if (!t.ignore.numberValues) {
                        l = t.showValueColors ? "number" : "";
                        s = DomElement.createWithHTML(a, "span", l, r);
                        c = "number";
                        if (Is.definedFunction(t.events.onNumberRender)) {
                            Trigger.customEvent(t.events.onNumberRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedString(r)) {
                    if (!t.ignore.stringValues) {
                        if (t.parseStringsToDates && DateTime.isDateValid(r)) {
                            renderValue(e, t, n, new Date(r), o);
                            u = true;
                        } else {
                            let e = null;
                            if (t.showValueColors && t.showStringHexColors && Is.hexColor(r)) {
                                e = r;
                            } else {
                                if (t.maximumStringLength > 0 && r.length > t.maximumStringLength) {
                                    r = r.substring(0, t.maximumStringLength) + _configuration.text.ellipsisText;
                                }
                            }
                            const n = t.showStringQuotes ? `"${r}"` : r;
                            l = t.showValueColors ? "string" : "";
                            s = DomElement.createWithHTML(a, "span", l, n);
                            c = "string";
                            if (Is.definedString(e)) {
                                s.style.color = e;
                            }
                            if (Is.definedFunction(t.events.onStringRender)) {
                                Trigger.customEvent(t.events.onStringRender, s);
                            }
                            createComma(t, a, o);
                        }
                    } else {
                        u = true;
                    }
                } else if (Is.definedDate(r)) {
                    if (!t.ignore.dateValues) {
                        l = t.showValueColors ? "date" : "";
                        s = DomElement.createWithHTML(a, "span", l, DateTime.getCustomFormattedDateText(_configuration, r, t.dateTimeFormat));
                        c = "date";
                        if (Is.definedFunction(t.events.onDateRender)) {
                            Trigger.customEvent(t.events.onDateRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedObject(r) && !Is.definedArray(r)) {
                    if (!t.ignore.objectValues) {
                        const e = DomElement.create(a, "span", t.showValueColors ? "object" : "");
                        const n = DomElement.create(a, "div", "object-type-contents");
                        const l = renderObjectValues(i, n, t, r);
                        DomElement.createWithHTML(e, "span", "title", _configuration.text.objectText);
                        if (t.showCounts && l > 0) {
                            DomElement.createWithHTML(e, "span", "count", `{${l}}`);
                        }
                        createComma(t, e, o);
                        c = "object";
                    } else {
                        u = true;
                    }
                } else if (Is.definedArray(r)) {
                    if (!t.ignore.arrayValues) {
                        const e = DomElement.create(a, "span", t.showValueColors ? "array" : "");
                        const n = DomElement.create(a, "div", "object-type-contents");
                        DomElement.createWithHTML(e, "span", "title", _configuration.text.arrayText);
                        if (t.showCounts) {
                            DomElement.createWithHTML(e, "span", "count", `[${r.length}]`);
                        }
                        createComma(t, e, o);
                        renderArrayValues(i, n, t, r);
                        c = "array";
                    } else {
                        u = true;
                    }
                } else {
                    if (!t.ignore.unknownValues) {
                        l = t.showValueColors ? "unknown" : "";
                        s = DomElement.createWithHTML(a, "span", l, r.toString());
                        c = "unknown";
                        if (Is.definedFunction(t.events.onUnknownRender)) {
                            Trigger.customEvent(t.events.onUnknownRender, s);
                        }
                        createComma(t, a, o);
                    } else {
                        u = true;
                    }
                }
                if (u) {
                    e.removeChild(a);
                } else {
                    if (Is.defined(s)) {
                        addValueClickEvent(t, s, r, c, d);
                    }
                }
            }
            function addValueClickEvent(e, t, n, r, o) {
                if (o && Is.definedFunction(e.events.onValueClick)) {
                    t.onclick = () => {
                        Trigger.customEvent(e.events.onValueClick, n, r);
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
                return `[${r}]`;
            }
            function makeAreaDroppable(e, t) {
                if (t.fileDroppingEnabled) {
                    e.ondragover = DomElement.cancelBubble;
                    e.ondragenter = DomElement.cancelBubble;
                    e.ondragleave = DomElement.cancelBubble;
                    e.ondrop = e => {
                        DomElement.cancelBubble(e);
                        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
                            importFromFiles(e.dataTransfer.files, t);
                        }
                    };
                }
            }
            function importFromFiles(e, t) {
                const n = e.length;
                for (let r = 0; r < n; r++) {
                    const n = e[r];
                    const o = n.name.split(".").pop().toLowerCase();
                    if (o === "json") {
                        importFromJson(n, t);
                    }
                }
            }
            function importFromJson(e, t) {
                const n = new FileReader;
                let r = null;
                n.onloadend = () => {
                    t._currentView.dataArrayCurrentIndex = 0;
                    t.data = r;
                    renderControlContainer(t);
                    Trigger.customEvent(t.events.onSetJson, t._currentView.element);
                };
                n.onload = e => {
                    const t = getObjectFromString(e.target.result);
                    if (t.parsed && Is.definedObject(t.object)) {
                        r = t.object;
                    }
                };
                n.readAsText(e);
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
                        result.object = eval(`(${objectString})`);
                        if (Is.definedFunction(result.object)) {
                            result.object = result.object();
                        }
                    } catch (e) {
                        if (!_configuration.safeMode) {
                            console.error(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
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
                Trigger.customEvent(e.events.onDestroy, e._currentView.element);
            }
            const _public = {
                refresh: function(e) {
                    if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                        const t = _elements_Data[e];
                        renderControlContainer(t);
                        Trigger.customEvent(t.events.onRefresh, t._currentView.element);
                    }
                    return _public;
                },
                refreshAll: function() {
                    for (let e in _elements_Data) {
                        if (_elements_Data.hasOwnProperty(e)) {
                            const t = _elements_Data[e];
                            renderControlContainer(t);
                            Trigger.customEvent(t.events.onRefresh, t._currentView.element);
                        }
                    }
                    return _public;
                },
                render: function(e, t) {
                    if (Is.definedObject(e) && Is.definedObject(t)) {
                        renderControl(Binding.Options.getForNewInstance(t, e));
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
                setJson: function(e, t) {
                    if (Is.definedString(e) && Is.defined(t) && _elements_Data.hasOwnProperty(e)) {
                        let n = null;
                        if (Is.definedString(t)) {
                            const e = getObjectFromString(t);
                            if (e.parsed) {
                                n = e.object;
                            }
                        } else {
                            n = t;
                        }
                        const r = _elements_Data[e];
                        r._currentView.dataArrayCurrentIndex = 0;
                        r.data = n;
                        renderControlContainer(r);
                        Trigger.customEvent(r.events.onSetJson, r._currentView.element);
                    }
                    return _public;
                },
                getJson: function(e) {
                    let t = null;
                    if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
                        t = _elements_Data[e].data;
                    }
                    return t;
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
                            _configuration = Config.Options.get(n);
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
                    return "2.2.0";
                }
            };
            (() => {
                _configuration = Config.Options.get();
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