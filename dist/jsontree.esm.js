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
                    return (e.startsWith("rgb(") || e.startsWith("rgba(")) && e.endsWith(")");
                }
                e.rgbColor = n;
                function r(e) {
                    return e.toString().toLowerCase().trim() === "true" || e.toString().toLowerCase().trim() === "false";
                }
                e.boolean = r;
                function o(e) {
                    return !isNaN(+new Date(e));
                }
                e.date = o;
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
            function a(e) {
                return n(e) && typeof e === "number";
            }
            e.definedNumber = a;
            function s(e) {
                return n(e) && typeof e === "bigint";
            }
            e.definedBigInt = s;
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
            function a(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getObject = a;
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
            e.getStringOrArray = s;
            function u(e, t) {
                const n = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
                return e.toString().match(n)?.[0] || "";
            }
            e.getFixedDecimalPlacesValue = u;
            function c(e, t) {
                let n;
                const r = e.toString().split("(");
                const o = r[0].split(" ");
                const i = "()";
                if (o.length === 2) {
                    n = o[1];
                } else {
                    n = o[0];
                }
                n += i;
                if (n.trim() === i) {
                    n = `${t.text.functionText}${i}`;
                }
                return n;
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
            function a(e) {
                const t = document.createRange();
                const n = window.getSelection();
                t.setStart(e.childNodes[0], e.innerHTML.length);
                t.collapse(true);
                n.removeAllRanges();
                n.addRange(t);
            }
            e.setTextCursorToEnd = a;
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
                    r._currentView.valueClickTimerId = 0;
                    r._currentView.editMode = false;
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
                    t.allowEditing = Default.getBoolean(t.allowEditing, true);
                    t = o(t);
                    t = i(t);
                    t = l(t);
                    t = a(t);
                    t = s(t);
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
                    e.ignore.undefinedValues = Default.getBoolean(e.ignore.undefinedValues, false);
                    return e;
                }
                function l(e) {
                    e.tooltip = Default.getObject(e.tooltip, {});
                    e.tooltip.delay = Default.getNumber(e.tooltip.delay, 750);
                    return e;
                }
                function a(e) {
                    e.parse = Default.getObject(e.parse, {});
                    e.parse.stringsToDates = Default.getBoolean(e.parse.stringsToDates, false);
                    e.parse.stringsToBooleans = Default.getBoolean(e.parse.stringsToBooleans, false);
                    e.parse.stringsToNumbers = Default.getBoolean(e.parse.stringsToNumbers, false);
                    return e;
                }
                function s(e) {
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
                    e.events.onUndefinedRender = Default.getFunction(e.events.onUndefinedRender, null);
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
                    e.text.functionText = Default.getAnyString(e.text.functionText, "function");
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
            function renderControlContainer(e, t = false) {
                let n = _elements_Data[e._currentView.element.id].data;
                ToolTip.hide(e);
                e._currentView.element.innerHTML = "";
                e._currentView.editMode = false;
                renderControlTitleBar(e, n);
                const r = DomElement.create(e._currentView.element, "div", "contents");
                if (t) {
                    DomElement.addClass(r, "page-switch");
                }
                makeAreaDroppable(r, e);
                if (e.showArrayItemsAsSeparateObjects && Is.definedArray(n)) {
                    n = n[e._currentView.dataArrayCurrentIndex];
                }
                if (Is.definedObject(n) && !Is.definedArray(n)) {
                    renderObject(r, e, n);
                } else if (Is.definedArray(n)) {
                    renderArray(r, e, n);
                }
                if (r.innerHTML === "") {
                    DomElement.createWithHTML(r, "span", "no-json-text", _configuration.text.noJsonToViewText);
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
                            onTitleBarCopyClick(e, t);
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
                                renderControlContainer(e, true);
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
                                renderControlContainer(e, true);
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
            function onTitleBarCopyClick(e, t) {
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
            }
            function jsonStringifyReplacer(e, t) {
                if (Is.definedBigInt(t)) {
                    t = t.toString();
                } else if (Is.definedSymbol(t)) {
                    t = t.toString();
                } else if (Is.definedFunction(t)) {
                    t = Default.getFunctionName(t, _configuration);
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
            function renderObject(e, t, n) {
                const r = getObjectPropertyNames(n, t);
                const o = r.length;
                if (o !== 0 || !t.ignore.emptyObjects) {
                    const i = DomElement.create(e, "div", "object-type-title");
                    const l = DomElement.create(e, "div", "object-type-contents object-type-contents-parent");
                    const a = t.showArrowToggles ? DomElement.create(i, "div", "down-arrow") : null;
                    const s = DomElement.createWithHTML(i, "span", t.showValueColors ? "object main-title" : "main-title", _configuration.text.objectText);
                    let u = null;
                    if (t.showArrayItemsAsSeparateObjects) {
                        let e = t.useZeroIndexingForArrays ? t._currentView.dataArrayCurrentIndex.toString() : (t._currentView.dataArrayCurrentIndex + 1).toString();
                        if (t.showArrayIndexBrackets) {
                            e = `[${e}]:`;
                        }
                        DomElement.createWithHTML(i, "span", t.showValueColors ? "object data-array-index" : "data-array-index", e, s);
                    }
                    if (t.showCounts && o > 0) {
                        DomElement.createWithHTML(i, "span", t.showValueColors ? "object count" : "count", `{${o}}`);
                    }
                    if (t.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(i, "span", "opening-symbol", "{");
                    }
                    renderObjectValues(a, null, l, t, n, r, u, false, true);
                    addValueClickEvent(t, s, n, "object");
                }
            }
            function renderArray(e, t, n) {
                const r = DomElement.create(e, "div", "object-type-title");
                const o = DomElement.create(e, "div", "object-type-contents object-type-contents-parent");
                const i = t.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
                const l = DomElement.createWithHTML(r, "span", t.showValueColors ? "array main-title" : "main-title", _configuration.text.arrayText);
                let a = null;
                if (t.showCounts) {
                    DomElement.createWithHTML(r, "span", t.showValueColors ? "array count" : "count", `[${n.length}]`);
                }
                if (t.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(r, "span", "opening-symbol", "[");
                }
                renderArrayValues(i, null, o, t, n, a, false, true);
                addValueClickEvent(t, l, n, "object");
            }
            function renderObjectValues(e, t, n, r, o, i, l, a, s) {
                const u = i.length;
                for (let e = 0; e < u; e++) {
                    const t = i[e];
                    if (o.hasOwnProperty(t)) {
                        renderValue(o, n, r, t, o[t], e === u - 1, false);
                    }
                }
                if (r.showOpeningClosingCurlyBraces) {
                    createClosingSymbol(r, n, "}", a, s);
                }
                addArrowEvent(r, e, t, n, l);
            }
            function renderArrayValues(e, t, n, r, o, i, l, a) {
                const s = o.length;
                if (!r.reverseArrayValues) {
                    for (let e = 0; e < s; e++) {
                        renderValue(o, n, r, getIndexName(r, e, s), o[e], e === s - 1, true);
                    }
                } else {
                    for (let e = s; e--; ) {
                        renderValue(o, n, r, getIndexName(r, e, s), o[e], e === 0, true);
                    }
                }
                if (r.showOpeningClosingCurlyBraces) {
                    createClosingSymbol(r, n, "]", l, a);
                }
                addArrowEvent(r, e, t, n, i);
            }
            function renderValue(e, t, n, r, o, i, l) {
                const a = DomElement.create(t, "div", "object-type-value");
                const s = n.showArrowToggles ? DomElement.create(a, "div", "no-arrow") : null;
                let u = null;
                let c = null;
                let d = false;
                let f = null;
                const g = DomElement.createWithHTML(a, "span", "title", r);
                DomElement.createWithHTML(a, "span", "split", ":");
                if (!l) {
                    makePropertyNameEditable(n, e, r, g);
                }
                if (o === null) {
                    if (!n.ignore.nullValues) {
                        u = n.showValueColors ? "null value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, "null");
                        f = "null";
                        if (Is.definedFunction(n.events.onNullRender)) {
                            Trigger.customEvent(n.events.onNullRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (o === void 0) {
                    if (!n.ignore.undefinedValues) {
                        u = n.showValueColors ? "undefined value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, "undefined");
                        f = "undefined";
                        if (Is.definedFunction(n.events.onUndefinedRender)) {
                            Trigger.customEvent(n.events.onUndefinedRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedFunction(o)) {
                    if (!n.ignore.functionValues) {
                        u = n.showValueColors ? "function value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, Default.getFunctionName(o, _configuration));
                        f = "function";
                        if (Is.definedFunction(n.events.onFunctionRender)) {
                            Trigger.customEvent(n.events.onFunctionRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedBoolean(o)) {
                    if (!n.ignore.booleanValues) {
                        u = n.showValueColors ? "boolean value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, o);
                        f = "boolean";
                        makePropertyValueEditable(n, e, r, o, c, l);
                        if (Is.definedFunction(n.events.onBooleanRender)) {
                            Trigger.customEvent(n.events.onBooleanRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedDecimal(o)) {
                    if (!n.ignore.decimalValues) {
                        const t = Default.getFixedDecimalPlacesValue(o, n.maximumDecimalPlaces);
                        u = n.showValueColors ? "decimal value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, t);
                        f = "decimal";
                        makePropertyValueEditable(n, e, r, o, c, l);
                        if (Is.definedFunction(n.events.onDecimalRender)) {
                            Trigger.customEvent(n.events.onDecimalRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedNumber(o)) {
                    if (!n.ignore.numberValues) {
                        u = n.showValueColors ? "number value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, o);
                        f = "number";
                        makePropertyValueEditable(n, e, r, o, c, l);
                        if (Is.definedFunction(n.events.onNumberRender)) {
                            Trigger.customEvent(n.events.onNumberRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedBigInt(o)) {
                    if (!n.ignore.bigIntValues) {
                        u = n.showValueColors ? "bigint value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, o);
                        f = "bigint";
                        makePropertyValueEditable(n, e, r, o, c, l);
                        if (Is.definedFunction(n.events.onBigIntRender)) {
                            Trigger.customEvent(n.events.onBigIntRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedString(o)) {
                    if (!n.ignore.stringValues) {
                        if (n.parse.stringsToBooleans && Is.String.boolean(o)) {
                            renderValue(e, t, n, r, o.toString().toLowerCase().trim() === "true", i, l);
                            d = true;
                        } else if (n.parse.stringsToNumbers && !isNaN(o)) {
                            renderValue(e, t, n, r, parseFloat(o), i, l);
                            d = true;
                        } else if (n.parse.stringsToDates && Is.String.date(o)) {
                            renderValue(e, t, n, r, new Date(o), i, l);
                            d = true;
                        } else {
                            let t = null;
                            if (n.showValueColors && n.showStringHexColors && (Is.String.hexColor(o) || Is.String.rgbColor(o))) {
                                t = o;
                                f = "color";
                            } else {
                                if (n.maximumStringLength > 0 && o.length > n.maximumStringLength) {
                                    o = o.substring(0, n.maximumStringLength) + _configuration.text.ellipsisText;
                                }
                                f = "string";
                            }
                            const s = n.showStringQuotes && t === null ? `"${o}"` : o;
                            u = n.showValueColors ? "string value" : "value";
                            c = DomElement.createWithHTML(a, "span", u, s);
                            makePropertyValueEditable(n, e, r, o, c, l);
                            if (Is.definedString(t)) {
                                c.style.color = t;
                            }
                            if (Is.definedFunction(n.events.onStringRender)) {
                                Trigger.customEvent(n.events.onStringRender, c);
                            }
                            createComma(n, a, i);
                        }
                    } else {
                        d = true;
                    }
                } else if (Is.definedDate(o)) {
                    if (!n.ignore.dateValues) {
                        u = n.showValueColors ? "date value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, DateTime.getCustomFormattedDateText(_configuration, o, n.dateTimeFormat));
                        f = "date";
                        makePropertyValueEditable(n, e, r, o, c, l);
                        if (Is.definedFunction(n.events.onDateRender)) {
                            Trigger.customEvent(n.events.onDateRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedSymbol(o)) {
                    if (!n.ignore.symbolValues) {
                        u = n.showValueColors ? "symbol value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, o.toString());
                        f = "symbol";
                        if (Is.definedFunction(n.events.onSymbolRender)) {
                            Trigger.customEvent(n.events.onSymbolRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedObject(o) && !Is.definedArray(o)) {
                    if (!n.ignore.objectValues) {
                        const e = getObjectPropertyNames(o, n);
                        const t = e.length;
                        if (t === 0 && n.ignore.emptyObjects) {
                            d = true;
                        } else {
                            const r = DomElement.create(a, "span", n.showValueColors ? "object" : "");
                            const l = DomElement.create(a, "div", "object-type-contents");
                            let u = null;
                            c = DomElement.createWithHTML(r, "span", "main-title", _configuration.text.objectText);
                            if (n.showCounts && t > 0) {
                                DomElement.createWithHTML(r, "span", "count", `{${t}}`);
                            }
                            if (n.showOpeningClosingCurlyBraces) {
                                u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                            }
                            let d = createComma(n, r, i);
                            renderObjectValues(s, d, l, n, o, e, u, true, i);
                            f = "object";
                        }
                    } else {
                        d = true;
                    }
                } else if (Is.definedArray(o)) {
                    if (!n.ignore.arrayValues) {
                        const e = DomElement.create(a, "span", n.showValueColors ? "array" : "");
                        const t = DomElement.create(a, "div", "object-type-contents");
                        let r = null;
                        c = DomElement.createWithHTML(e, "span", "main-title", _configuration.text.arrayText);
                        if (n.showCounts) {
                            DomElement.createWithHTML(e, "span", "count", `[${o.length}]`);
                        }
                        if (n.showOpeningClosingCurlyBraces) {
                            r = DomElement.createWithHTML(e, "span", "opening-symbol", "[");
                        }
                        let l = createComma(n, e, i);
                        renderArrayValues(s, l, t, n, o, r, true, i);
                        f = "array";
                    } else {
                        d = true;
                    }
                } else {
                    if (!n.ignore.unknownValues) {
                        u = n.showValueColors ? "unknown value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, o.toString());
                        f = "unknown";
                        if (Is.definedFunction(n.events.onUnknownRender)) {
                            Trigger.customEvent(n.events.onUnknownRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                }
                if (d) {
                    t.removeChild(a);
                } else {
                    if (Is.defined(c)) {
                        addValueClickEvent(n, c, o, f);
                    }
                }
            }
            function makePropertyNameEditable(e, t, n, r) {
                if (e.allowEditing) {
                    r.ondblclick = () => {
                        clearTimeout(e._currentView.valueClickTimerId);
                        e._currentView.valueClickTimerId = 0;
                        e._currentView.editMode = true;
                        DomElement.addClass(r, "editable");
                        r.setAttribute("contenteditable", "true");
                        r.focus();
                        DomElement.setTextCursorToEnd(r);
                        r.onblur = () => {
                            renderControlContainer(e, false);
                        };
                        r.onkeydown = o => {
                            if (o.code == "Escape") {
                                o.preventDefault();
                                renderControlContainer(e, false);
                            } else if (o.code == "Enter") {
                                o.preventDefault();
                                const i = r.innerText;
                                if (i.trim() === "") {
                                    delete t[n];
                                } else {
                                    if (!t.hasOwnProperty(i)) {
                                        const e = t[n];
                                        delete t[n];
                                        t[i] = e;
                                    }
                                }
                                renderControlContainer(e, false);
                            }
                        };
                    };
                }
            }
            function makePropertyValueEditable(e, t, n, r, o, i) {
                if (e.allowEditing) {
                    o.ondblclick = () => {
                        clearTimeout(e._currentView.valueClickTimerId);
                        e._currentView.valueClickTimerId = 0;
                        e._currentView.editMode = true;
                        DomElement.addClass(o, "editable");
                        o.setAttribute("contenteditable", "true");
                        o.innerText = r.toString();
                        o.focus();
                        DomElement.setTextCursorToEnd(o);
                        o.onblur = () => {
                            renderControlContainer(e, false);
                        };
                        o.onkeydown = l => {
                            if (l.code == "Escape") {
                                l.preventDefault();
                                renderControlContainer(e, false);
                            } else if (l.code == "Enter") {
                                l.preventDefault();
                                const a = o.innerText;
                                if (a.trim() === "") {
                                    if (i) {
                                        t.splice(getArrayIndex(n), 1);
                                    } else {
                                        delete t[n];
                                    }
                                } else {
                                    let e = null;
                                    if (Is.definedBoolean(r)) {
                                        e = a.toLowerCase() === "true";
                                    } else if (Is.definedDecimal(r) && !isNaN(+a)) {
                                        e = parseFloat(a);
                                    } else if (Is.definedNumber(r) && !isNaN(+a)) {
                                        e = parseInt(a);
                                    } else if (Is.definedString(r)) {
                                        e = a;
                                    } else if (Is.definedDate(r)) {
                                        e = new Date(a);
                                    } else if (Is.definedBigInt(r)) {
                                        e = BigInt(a);
                                    }
                                    if (e !== null) {
                                        if (i) {
                                            t[getArrayIndex(n)] = e;
                                        } else {
                                            t[n] = e;
                                        }
                                    }
                                }
                                renderControlContainer(e, false);
                            }
                        };
                    };
                }
            }
            function getArrayIndex(e) {
                return parseInt(e.replace("[", "").replace("]", ""));
            }
            function addValueClickEvent(e, t, n, r) {
                if (Is.definedFunction(e.events.onValueClick)) {
                    t.onclick = () => {
                        if (e.allowEditing) {
                            e._currentView.valueClickTimerId = setTimeout((() => {
                                if (!e._currentView.editMode) {
                                    Trigger.customEvent(e.events.onValueClick, n, r);
                                }
                            }), 500);
                        } else {
                            Trigger.customEvent(e.events.onValueClick, n, r);
                        }
                    };
                } else {
                    DomElement.addClass(t, "no-hover");
                }
            }
            function addArrowEvent(e, t, n, r, o) {
                if (Is.defined(t)) {
                    const i = () => {
                        r.style.display = "none";
                        t.className = "right-arrow";
                        if (Is.defined(o)) {
                            o.style.display = "none";
                        }
                        if (Is.defined(n)) {
                            n.style.display = "inline-block";
                        }
                    };
                    const l = () => {
                        r.style.display = "block";
                        t.className = "down-arrow";
                        if (Is.defined(o)) {
                            o.style.display = "inline-block";
                        }
                        if (Is.defined(n)) {
                            n.style.display = "none";
                        }
                    };
                    t.onclick = () => {
                        if (t.className === "down-arrow") {
                            i();
                        } else {
                            l();
                        }
                    };
                    if (e.showAllAsClosed) {
                        i();
                    } else {
                        l();
                    }
                }
            }
            function createComma(e, t, n) {
                let r = null;
                if (e.showCommas && !n) {
                    r = DomElement.createWithHTML(t, "span", "comma", ",");
                }
                return r;
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
            function createClosingSymbol(e, t, n, r, o) {
                let i = DomElement.create(t, "div", "closing-symbol");
                if (r) {
                    DomElement.create(i, "div", "no-arrow");
                }
                DomElement.createWithHTML(i, "div", "object-type-end", n);
                createComma(e, i, o);
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
                    return "2.6.0";
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