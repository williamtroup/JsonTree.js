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
            let t;
            (e => {
                function t(e) {
                    let t = e.length >= 2 && e.length <= 7;
                    if (t && e[0] === "#") {
                        t = isNaN(+e.substring(1, e.length - 1));
                    }
                    return t;
                }
                e.hexColor = t;
                function n(e) {
                    return e.toString().toLowerCase().trim() === "true" || e.toString().toLowerCase().trim() === "false";
                }
                e.boolean = n;
                function r(e) {
                    return !isNaN(+new Date(e));
                }
                e.date = r;
            })(t = e.String || (e.String = {}));
            function n(e) {
                return e !== null && e !== void 0 && e.toString() !== "";
            }
            e.defined = n;
            function r(e) {
                return n(e) && typeof e === "object";
            }
            e.definedObject = r;
            function o(e) {
                return n(e) && typeof e === "boolean";
            }
            e.definedBoolean = o;
            function i(e) {
                return n(e) && typeof e === "string";
            }
            e.definedString = i;
            function l(e) {
                return n(e) && typeof e === "function";
            }
            e.definedFunction = l;
            function s(e) {
                return n(e) && typeof e === "number";
            }
            e.definedNumber = s;
            function a(e) {
                return n(e) && typeof e === "bigint";
            }
            e.definedBigInt = a;
            function u(e) {
                return r(e) && e instanceof Array;
            }
            e.definedArray = u;
            function c(e) {
                return r(e) && e instanceof Date;
            }
            e.definedDate = c;
            function d(e) {
                return n(e) && typeof e === "number" && e % 1 !== 0;
            }
            e.definedDecimal = d;
            function f(e) {
                return n(e) && typeof e === "symbol";
            }
            e.definedSymbol = f;
            function g(e, t = 1) {
                return !u(e) || e.length < t;
            }
            e.invalidOptionArray = g;
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
            function i(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getFunction = i;
            function l(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getArray = l;
            function s(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getObject = s;
            function a(e, t) {
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
            e.getStringOrArray = a;
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
            function o(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            e.cancelBubble = o;
            function i() {
                const e = document.documentElement;
                const t = {
                    left: e.scrollLeft - (e.clientLeft || 0),
                    top: e.scrollTop - (e.clientTop || 0)
                };
                return t;
            }
            e.getScrollPosition = i;
            function l(e, t) {
                let n = e.pageX;
                let r = e.pageY;
                const o = i();
                t.style.display = "block";
                if (n + t.offsetWidth > window.innerWidth) {
                    n -= t.offsetWidth;
                } else {
                    n++;
                }
                if (r + t.offsetHeight > window.innerHeight) {
                    r -= t.offsetHeight;
                } else {
                    r++;
                }
                if (n < o.left) {
                    n = e.pageX + 1;
                }
                if (r < o.top) {
                    r = e.pageY + 1;
                }
                t.style.left = `${n}px`;
                t.style.top = `${r}px`;
            }
            e.showElementAtMousePosition = l;
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
                let i = o;
                const l = t(r);
                i = i.replace("{hh}", Str.padNumber(r.getHours(), 2));
                i = i.replace("{h}", r.getHours().toString());
                i = i.replace("{MM}", Str.padNumber(r.getMinutes(), 2));
                i = i.replace("{M}", r.getMinutes().toString());
                i = i.replace("{ss}", Str.padNumber(r.getSeconds(), 2));
                i = i.replace("{s}", r.getSeconds().toString());
                i = i.replace("{ff}", Str.padNumber(r.getMilliseconds(), 3));
                i = i.replace("{f}", r.getMilliseconds().toString());
                i = i.replace("{dddd}", e.text.dayNames[l]);
                i = i.replace("{ddd}", e.text.dayNamesAbbreviated[l]);
                i = i.replace("{dd}", Str.padNumber(r.getDate()));
                i = i.replace("{d}", r.getDate().toString());
                i = i.replace("{o}", n(e, r.getDate()));
                i = i.replace("{mmmm}", e.text.monthNames[r.getMonth()]);
                i = i.replace("{mmm}", e.text.monthNamesAbbreviated[r.getMonth()]);
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
                    r._currentView.titleBarButtons = null;
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
                    t.copyIndentSpaces = Default.getNumber(t.copyIndentSpaces, 2);
                    t.showArrayIndexBrackets = Default.getBoolean(t.showArrayIndexBrackets, true);
                    t.showOpeningClosingCurlyBraces = Default.getBoolean(t.showOpeningClosingCurlyBraces, false);
                    t.showOpeningClosingSquaredBrackets = Default.getBoolean(t.showOpeningClosingSquaredBrackets, false);
                    t = o(t);
                    t = i(t);
                    t = l(t);
                    t = s(t);
                    t = a(t);
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
                function i(e) {
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
                    e.ignore.bigIntValues = Default.getBoolean(e.ignore.bigIntValues, false);
                    e.ignore.symbolValues = Default.getBoolean(e.ignore.symbolValues, false);
                    e.ignore.emptyObjects = Default.getBoolean(e.ignore.emptyObjects, true);
                    return e;
                }
                function l(e) {
                    e.tooltip = Default.getObject(e.tooltip, {});
                    e.tooltip.delay = Default.getNumber(e.tooltip.delay, 750);
                    return e;
                }
                function s(e) {
                    e.parse = Default.getObject(e.parse, {});
                    e.parse.stringsToDates = Default.getBoolean(e.parse.stringsToDates, false);
                    e.parse.stringsToBooleans = Default.getBoolean(e.parse.stringsToBooleans, false);
                    e.parse.stringsToNumbers = Default.getBoolean(e.parse.stringsToNumbers, false);
                    return e;
                }
                function a(e) {
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
                    e.events.onBigIntRender = Default.getFunction(e.events.onBigIntRender, null);
                    e.events.onStringRender = Default.getFunction(e.events.onStringRender, null);
                    e.events.onDateRender = Default.getFunction(e.events.onDateRender, null);
                    e.events.onFunctionRender = Default.getFunction(e.events.onFunctionRender, null);
                    e.events.onNullRender = Default.getFunction(e.events.onNullRender, null);
                    e.events.onUnknownRender = Default.getFunction(e.events.onUnknownRender, null);
                    e.events.onSymbolRender = Default.getFunction(e.events.onSymbolRender, null);
                    e.events.onCopyJsonReplacer = Default.getFunction(e.events.onCopyJsonReplacer, null);
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
                    e.text.noJsonToViewText = Default.getAnyString(e.text.noJsonToViewText, "There is currently no JSON to view.");
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

var ToolTip;

var init_tooltip = __esm({
    "src/ts/area/tooltip.ts"() {
        "use strict";
        init_dom();
        init_is();
        (e => {
            function t(e) {
                if (!Is.defined(e._currentView.tooltip)) {
                    e._currentView.tooltip = DomElement.create(document.body, "div", "jsontree-js-tooltip");
                    e._currentView.tooltip.style.display = "none";
                    n(e);
                }
            }
            e.renderControl = t;
            function n(e, t = true) {
                let n = t ? window.addEventListener : window.removeEventListener;
                let r = t ? document.addEventListener : document.removeEventListener;
                n("mousemove", (() => {
                    i(e);
                }));
                r("scroll", (() => {
                    i(e);
                }));
            }
            e.assignToEvents = n;
            function r(e, t, n) {
                if (e !== null) {
                    e.onmousemove = e => {
                        o(e, t, n);
                    };
                }
            }
            e.add = r;
            function o(e, t, n) {
                DomElement.cancelBubble(e);
                i(t);
                t._currentView.tooltipTimerId = setTimeout((() => {
                    t._currentView.tooltip.innerHTML = n;
                    t._currentView.tooltip.style.display = "block";
                    DomElement.showElementAtMousePosition(e, t._currentView.tooltip);
                }), t.tooltip.delay);
            }
            e.show = o;
            function i(e) {
                if (Is.defined(e._currentView.tooltip)) {
                    if (e._currentView.tooltipTimerId !== 0) {
                        clearTimeout(e._currentView.tooltipTimerId);
                        e._currentView.tooltipTimerId = 0;
                    }
                    if (e._currentView.tooltip.style.display !== "none") {
                        e._currentView.tooltip.style.display = "none";
                    }
                }
            }
            e.hide = i;
        })(ToolTip || (ToolTip = {}));
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
        init_tooltip();
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
                ToolTip.renderControl(e);
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
                ToolTip.hide(e);
                e._currentView.element.innerHTML = "";
                renderControlTitleBar(e, t);
                const n = DomElement.create(e._currentView.element, "div", "contents");
                makeAreaDroppable(n, e);
                if (e.showArrayItemsAsSeparateObjects && Is.definedArray(t)) {
                    t = t[e._currentView.dataArrayCurrentIndex];
                }
                if (Is.definedObject(t) && !Is.definedArray(t)) {
                    renderObject(n, e, t, true);
                } else if (Is.definedArray(t)) {
                    renderArray(n, e, t);
                }
                if (n.innerHTML === "") {
                    DomElement.createWithHTML(n, "span", "no-json-text", _configuration.text.noJsonToViewText);
                    e._currentView.titleBarButtons.style.display = "none";
                } else {
                    e._currentView.titleBarButtons.style.display = "block";
                }
            }
            function renderControlTitleBar(e, t) {
                if (e.title.show || e.title.showTreeControls || e.title.showCopyButton) {
                    const n = DomElement.create(e._currentView.element, "div", "title-bar");
                    e._currentView.titleBarButtons = DomElement.create(n, "div", "controls");
                    if (e.title.show) {
                        DomElement.createWithHTML(n, "div", "title", e.title.text, e._currentView.titleBarButtons);
                    }
                    if (e.title.showCopyButton) {
                        const n = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "copy-all", _configuration.text.copyAllButtonSymbolText);
                        ToolTip.add(n, e, _configuration.text.copyAllButtonText);
                        n.onclick = () => {
                            let n = null;
                            let r = jsonStringifyReplacer;
                            if (Is.definedFunction(e.events.onCopyJsonReplacer)) {
                                r = e.events.onCopyJsonReplacer;
                            }
                            if (e.copyOnlyCurrentPage && e.showArrayItemsAsSeparateObjects) {
                                n = JSON.stringify(t[e._currentView.dataArrayCurrentIndex], r, e.copyIndentSpaces);
                            } else {
                                n = JSON.stringify(t, r, e.copyIndentSpaces);
                            }
                            navigator.clipboard.writeText(n);
                            Trigger.customEvent(e.events.onCopyAll, n);
                        };
                    }
                    if (e.title.showTreeControls) {
                        const t = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "openAll", _configuration.text.openAllButtonSymbolText);
                        ToolTip.add(t, e, _configuration.text.openAllButtonText);
                        const n = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "closeAll", _configuration.text.closeAllButtonSymbolText);
                        ToolTip.add(n, e, _configuration.text.closeAllButtonText);
                        t.onclick = () => {
                            openAllNodes(e);
                        };
                        n.onclick = () => {
                            closeAllNodes(e);
                        };
                    }
                    if (e.showArrayItemsAsSeparateObjects && Is.definedArray(t) && t.length > 1) {
                        const n = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "back", _configuration.text.backButtonSymbolText);
                        ToolTip.add(n, e, _configuration.text.backButtonText);
                        if (e._currentView.dataArrayCurrentIndex > 0) {
                            n.onclick = () => {
                                e._currentView.dataArrayCurrentIndex--;
                                renderControlContainer(e);
                                Trigger.customEvent(e.events.onBackPage, e._currentView.element);
                            };
                        } else {
                            n.disabled = true;
                        }
                        const r = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "next", _configuration.text.nextButtonSymbolText);
                        ToolTip.add(r, e, _configuration.text.nextButtonText);
                        if (e._currentView.dataArrayCurrentIndex < t.length - 1) {
                            r.onclick = () => {
                                e._currentView.dataArrayCurrentIndex++;
                                renderControlContainer(e);
                                Trigger.customEvent(e.events.onNextPage, e._currentView.element);
                            };
                        } else {
                            r.disabled = true;
                        }
                    } else {
                        if (Is.definedArray(t)) {
                            e.showArrayItemsAsSeparateObjects = false;
                        }
                    }
                }
            }
            function jsonStringifyReplacer(e, t) {
                if (Is.definedBigInt(t)) {
                    t = t.toString();
                } else if (Is.definedSymbol(t)) {
                    t = t.toString();
                } else if (Is.definedFunction(t)) {
                    t = Default.getFunctionName(t);
                }
                return t;
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
                const o = getObjectPropertyNames(n, t);
                const i = o.length;
                if (i !== 0 || !t.ignore.emptyObjects) {
                    const l = DomElement.create(e, "div", "object-type-title");
                    const s = DomElement.create(e, "div", "object-type-contents");
                    const a = t.showArrowToggles ? DomElement.create(l, "div", "down-arrow") : null;
                    const u = DomElement.createWithHTML(l, "span", t.showValueColors ? "object" : "", _configuration.text.objectText);
                    let c = null;
                    if (r && t.showArrayItemsAsSeparateObjects) {
                        let e = t.useZeroIndexingForArrays ? t._currentView.dataArrayCurrentIndex.toString() : (t._currentView.dataArrayCurrentIndex + 1).toString();
                        if (t.showArrayIndexBrackets) {
                            e = `[${e}]:`;
                        }
                        DomElement.createWithHTML(l, "span", t.showValueColors ? "object data-array-index" : "data-array-index", e, u);
                    }
                    if (t.showCounts && i > 0) {
                        DomElement.createWithHTML(l, "span", t.showValueColors ? "object count" : "count", `{${i}}`);
                    }
                    if (t.showOpeningClosingCurlyBraces) {
                        c = DomElement.createWithHTML(l, "span", "opening-brace", "{");
                    }
                    renderObjectValues(a, s, t, n, o, c);
                }
            }
            function renderArray(e, t, n) {
                const r = DomElement.create(e, "div", "object-type-title");
                const o = DomElement.create(e, "div", "object-type-contents");
                const i = t.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
                let l = null;
                DomElement.createWithHTML(r, "span", t.showValueColors ? "array" : "", _configuration.text.arrayText);
                if (t.showCounts) {
                    DomElement.createWithHTML(r, "span", t.showValueColors ? "array count" : "count", `[${n.length}]`);
                }
                if (t.showOpeningClosingCurlyBraces) {
                    l = DomElement.createWithHTML(r, "span", "opening-bracket", "[");
                }
                renderArrayValues(i, o, t, n, l);
            }
            function renderObjectValues(e, t, n, r, o, i) {
                const l = o.length;
                for (let e = 0; e < l; e++) {
                    const i = o[e];
                    if (r.hasOwnProperty(i)) {
                        renderValue(t, n, i, r[i], e === l - 1);
                    }
                }
                if (n.showOpeningClosingCurlyBraces) {
                    DomElement.createWithHTML(t, "div", "object-type-end", "}");
                }
                addArrowEvent(n, e, t, i);
            }
            function renderArrayValues(e, t, n, r, o) {
                const i = r.length;
                if (!n.reverseArrayValues) {
                    for (let e = 0; e < i; e++) {
                        renderValue(t, n, getIndexName(n, e, i), r[e], e === i - 1);
                    }
                } else {
                    for (let e = i; e--; ) {
                        renderValue(t, n, getIndexName(n, e, i), r[e], e === 0);
                    }
                }
                if (n.showOpeningClosingCurlyBraces) {
                    DomElement.createWithHTML(t, "div", "object-type-end", "]");
                }
                addArrowEvent(n, e, t, o);
            }
            function renderValue(e, t, n, r, o) {
                const i = DomElement.create(e, "div", "object-type-value");
                const l = t.showArrowToggles ? DomElement.create(i, "div", "no-arrow") : null;
                let s = null;
                let a = null;
                let u = false;
                let c = null;
                DomElement.createWithHTML(i, "span", "title", n);
                DomElement.createWithHTML(i, "span", "split", ":");
                if (!Is.defined(r)) {
                    if (!t.ignore.nullValues) {
                        s = t.showValueColors ? "null" : "";
                        a = DomElement.createWithHTML(i, "span", s, "null");
                        c = "null";
                        if (Is.definedFunction(t.events.onNullRender)) {
                            Trigger.customEvent(t.events.onNullRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedFunction(r)) {
                    if (!t.ignore.functionValues) {
                        s = t.showValueColors ? "function" : "";
                        a = DomElement.createWithHTML(i, "span", s, Default.getFunctionName(r));
                        c = "function";
                        if (Is.definedFunction(t.events.onFunctionRender)) {
                            Trigger.customEvent(t.events.onFunctionRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedBoolean(r)) {
                    if (!t.ignore.booleanValues) {
                        s = t.showValueColors ? "boolean" : "";
                        a = DomElement.createWithHTML(i, "span", s, r);
                        c = "boolean";
                        if (Is.definedFunction(t.events.onBooleanRender)) {
                            Trigger.customEvent(t.events.onBooleanRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedDecimal(r)) {
                    if (!t.ignore.decimalValues) {
                        const e = Default.getFixedDecimalPlacesValue(r, t.maximumDecimalPlaces);
                        s = t.showValueColors ? "decimal" : "";
                        a = DomElement.createWithHTML(i, "span", s, e);
                        c = "decimal";
                        if (Is.definedFunction(t.events.onDecimalRender)) {
                            Trigger.customEvent(t.events.onDecimalRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedNumber(r)) {
                    if (!t.ignore.numberValues) {
                        s = t.showValueColors ? "number" : "";
                        a = DomElement.createWithHTML(i, "span", s, r);
                        c = "number";
                        if (Is.definedFunction(t.events.onNumberRender)) {
                            Trigger.customEvent(t.events.onNumberRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedBigInt(r)) {
                    if (!t.ignore.bigIntValues) {
                        s = t.showValueColors ? "bigint" : "";
                        a = DomElement.createWithHTML(i, "span", s, r);
                        c = "bigint";
                        if (Is.definedFunction(t.events.onBigIntRender)) {
                            Trigger.customEvent(t.events.onBigIntRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedString(r)) {
                    if (!t.ignore.stringValues) {
                        if (t.parse.stringsToBooleans && Is.String.boolean(r)) {
                            renderValue(e, t, n, r.toString().toLowerCase().trim() === "true", o);
                            u = true;
                        } else if (t.parse.stringsToNumbers && !isNaN(r)) {
                            renderValue(e, t, n, parseFloat(r), o);
                            u = true;
                        } else if (t.parse.stringsToDates && Is.String.date(r)) {
                            renderValue(e, t, n, new Date(r), o);
                            u = true;
                        } else {
                            let e = null;
                            if (t.showValueColors && t.showStringHexColors && Is.String.hexColor(r)) {
                                e = r;
                            } else {
                                if (t.maximumStringLength > 0 && r.length > t.maximumStringLength) {
                                    r = r.substring(0, t.maximumStringLength) + _configuration.text.ellipsisText;
                                }
                            }
                            const n = t.showStringQuotes ? `"${r}"` : r;
                            s = t.showValueColors ? "string" : "";
                            a = DomElement.createWithHTML(i, "span", s, n);
                            c = "string";
                            if (Is.definedString(e)) {
                                a.style.color = e;
                            }
                            if (Is.definedFunction(t.events.onStringRender)) {
                                Trigger.customEvent(t.events.onStringRender, a);
                            }
                            createComma(t, i, o);
                        }
                    } else {
                        u = true;
                    }
                } else if (Is.definedDate(r)) {
                    if (!t.ignore.dateValues) {
                        s = t.showValueColors ? "date" : "";
                        a = DomElement.createWithHTML(i, "span", s, DateTime.getCustomFormattedDateText(_configuration, r, t.dateTimeFormat));
                        c = "date";
                        if (Is.definedFunction(t.events.onDateRender)) {
                            Trigger.customEvent(t.events.onDateRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedSymbol(r)) {
                    if (!t.ignore.symbolValues) {
                        s = t.showValueColors ? "symbol" : "";
                        a = DomElement.createWithHTML(i, "span", s, r.toString());
                        c = "symbol";
                        if (Is.definedFunction(t.events.onSymbolRender)) {
                            Trigger.customEvent(t.events.onSymbolRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                } else if (Is.definedObject(r) && !Is.definedArray(r)) {
                    if (!t.ignore.objectValues) {
                        const e = getObjectPropertyNames(r, t);
                        const n = e.length;
                        if (n === 0 && t.ignore.emptyObjects) {
                            u = true;
                        } else {
                            const s = DomElement.create(i, "span", t.showValueColors ? "object" : "");
                            const a = DomElement.create(i, "div", "object-type-contents");
                            let u = null;
                            DomElement.createWithHTML(s, "span", "title", _configuration.text.objectText);
                            if (t.showCounts && n > 0) {
                                DomElement.createWithHTML(s, "span", "count", `{${n}}`);
                            }
                            if (t.showOpeningClosingCurlyBraces) {
                                u = DomElement.createWithHTML(s, "span", "opening-brace", "{");
                            }
                            createComma(t, s, o);
                            renderObjectValues(l, a, t, r, e, u);
                            c = "object";
                        }
                    } else {
                        u = true;
                    }
                } else if (Is.definedArray(r)) {
                    if (!t.ignore.arrayValues) {
                        const e = DomElement.create(i, "span", t.showValueColors ? "array" : "");
                        const n = DomElement.create(i, "div", "object-type-contents");
                        let s = null;
                        DomElement.createWithHTML(e, "span", "title", _configuration.text.arrayText);
                        if (t.showCounts) {
                            DomElement.createWithHTML(e, "span", "count", `[${r.length}]`);
                        }
                        if (t.showOpeningClosingCurlyBraces) {
                            s = DomElement.createWithHTML(e, "span", "opening-bracket", "[");
                        }
                        createComma(t, e, o);
                        renderArrayValues(l, n, t, r, s);
                        c = "array";
                    } else {
                        u = true;
                    }
                } else {
                    if (!t.ignore.unknownValues) {
                        s = t.showValueColors ? "unknown" : "";
                        a = DomElement.createWithHTML(i, "span", s, r.toString());
                        c = "unknown";
                        if (Is.definedFunction(t.events.onUnknownRender)) {
                            Trigger.customEvent(t.events.onUnknownRender, a);
                        }
                        createComma(t, i, o);
                    } else {
                        u = true;
                    }
                }
                if (u) {
                    e.removeChild(i);
                } else {
                    if (Is.defined(a)) {
                        addValueClickEvent(t, a, r, c);
                    }
                }
            }
            function addValueClickEvent(e, t, n, r) {
                if (Is.definedFunction(e.events.onValueClick)) {
                    t.onclick = () => {
                        Trigger.customEvent(e.events.onValueClick, n, r);
                    };
                } else {
                    DomElement.addClass(t, "no-hover");
                }
            }
            function addArrowEvent(e, t, n, r) {
                if (Is.defined(t)) {
                    t.onclick = () => {
                        if (t.className === "down-arrow") {
                            n.style.display = "none";
                            t.className = "right-arrow";
                            if (Is.defined(r)) {
                                r.style.display = "none";
                            }
                        } else {
                            n.style.display = "block";
                            t.className = "down-arrow";
                            if (Is.defined(r)) {
                                r.style.display = "inline-block";
                            }
                        }
                    };
                    if (e.showAllAsClosed) {
                        n.style.display = "none";
                        t.className = "right-arrow";
                        if (Is.defined(r)) {
                            r.style.display = "none";
                        }
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
                if (e.showArrayIndexBrackets) {
                    r = `[${r}]`;
                }
                return r;
            }
            function getObjectPropertyNames(e, t) {
                let n = [];
                for (let t in e) {
                    if (e.hasOwnProperty(t)) {
                        n.push(t);
                    }
                }
                if (t.sortPropertyNames) {
                    let e = new Intl.Collator(void 0, {
                        numeric: true,
                        sensitivity: "base"
                    });
                    n = n.sort(e.compare);
                    if (!t.sortPropertyNamesInAlphabeticalOrder) {
                        n = n.reverse();
                    }
                }
                return n;
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
                ToolTip.assignToEvents(e, false);
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
                    return "2.4.0";
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