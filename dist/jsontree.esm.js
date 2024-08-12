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
                function o(e) {
                    return !isNaN(+new Date(e));
                }
                e.date = o;
            })(t = e.String || (e.String = {}));
            function n(e) {
                return e !== null && e !== void 0 && e.toString() !== "";
            }
            e.defined = n;
            function o(e) {
                return n(e) && typeof e === "object";
            }
            e.definedObject = o;
            function r(e) {
                return n(e) && typeof e === "boolean";
            }
            e.definedBoolean = r;
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
                return o(e) && e instanceof Array;
            }
            e.definedArray = u;
            function c(e) {
                return o(e) && e instanceof Date;
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
            function o(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getBoolean = o;
            function r(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getNumber = r;
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
            e.getStringOrArray = s;
            function u(e, t) {
                const n = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
                return e.toString().match(n)?.[0] || "";
            }
            e.getFixedDecimalPlacesValue = u;
            function c(e, t) {
                let n;
                const o = e.toString().split("(");
                const r = o[0].split(" ");
                const i = "()";
                if (r.length === 2) {
                    n = r[1];
                } else {
                    n = r[0];
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
            function t(e, t, n = "", o = null) {
                const r = t.toLowerCase();
                const i = r === "text";
                let l = i ? document.createTextNode("") : document.createElement(r);
                if (Is.defined(n)) {
                    l.className = n;
                }
                if (Is.defined(o)) {
                    e.insertBefore(l, o);
                } else {
                    e.appendChild(l);
                }
                return l;
            }
            e.create = t;
            function n(e, n, o, r, i = null) {
                const l = t(e, n, o, i);
                l.innerHTML = r;
                return l;
            }
            e.createWithHTML = n;
            function o(e, t) {
                e.classList.add(t);
            }
            e.addClass = o;
            function r(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            e.cancelBubble = r;
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
                let o = e.pageY;
                const r = i();
                t.style.display = "block";
                if (n + t.offsetWidth > window.innerWidth) {
                    n -= t.offsetWidth;
                } else {
                    n++;
                }
                if (o + t.offsetHeight > window.innerHeight) {
                    o -= t.offsetHeight;
                } else {
                    o++;
                }
                if (n < r.left) {
                    n = e.pageX + 1;
                }
                if (o < r.top) {
                    o = e.pageY + 1;
                }
                t.style.left = `${n}px`;
                t.style.top = `${o}px`;
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
                let o = n;
                if (n.length < t) {
                    const e = t - n.length + 1;
                    o = Array(e).join("0") + n;
                }
                return o;
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
            function o(e, o, r) {
                let i = r;
                const l = t(o);
                i = i.replace("{hh}", Str.padNumber(o.getHours(), 2));
                i = i.replace("{h}", o.getHours().toString());
                i = i.replace("{MM}", Str.padNumber(o.getMinutes(), 2));
                i = i.replace("{M}", o.getMinutes().toString());
                i = i.replace("{ss}", Str.padNumber(o.getSeconds(), 2));
                i = i.replace("{s}", o.getSeconds().toString());
                i = i.replace("{ff}", Str.padNumber(o.getMilliseconds(), 3));
                i = i.replace("{f}", o.getMilliseconds().toString());
                i = i.replace("{dddd}", e.text.dayNames[l]);
                i = i.replace("{ddd}", e.text.dayNamesAbbreviated[l]);
                i = i.replace("{dd}", Str.padNumber(o.getDate()));
                i = i.replace("{d}", o.getDate().toString());
                i = i.replace("{o}", n(e, o.getDate()));
                i = i.replace("{mmmm}", e.text.monthNames[o.getMonth()]);
                i = i.replace("{mmm}", e.text.monthNamesAbbreviated[o.getMonth()]);
                i = i.replace("{mm}", Str.padNumber(o.getMonth() + 1));
                i = i.replace("{m}", (o.getMonth() + 1).toString());
                i = i.replace("{yyyy}", o.getFullYear().toString());
                i = i.replace("{yyy}", o.getFullYear().toString().substring(1));
                i = i.replace("{yy}", o.getFullYear().toString().substring(2));
                i = i.replace("{y}", Number.parseInt(o.getFullYear().toString().substring(2)).toString());
                return i;
            }
            e.getCustomFormattedDateText = o;
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
                    const o = e.Options.get(t);
                    o._currentView = {};
                    o._currentView.element = n;
                    o._currentView.dataArrayCurrentIndex = 0;
                    o._currentView.titleBarButtons = null;
                    return o;
                }
                t.getForNewInstance = n;
                function o(e) {
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
                    t = r(t);
                    t = i(t);
                    t = l(t);
                    t = a(t);
                    t = s(t);
                    return t;
                }
                t.get = o;
                function r(e) {
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
                let o = t ? document.addEventListener : document.removeEventListener;
                n("mousemove", (() => {
                    i(e);
                }));
                o("scroll", (() => {
                    i(e);
                }));
            }
            e.assignToEvents = n;
            function o(e, t, n) {
                if (e !== null) {
                    e.onmousemove = e => {
                        r(e, t, n);
                    };
                }
            }
            e.add = o;
            function r(e, t, n) {
                DomElement.cancelBubble(e);
                i(t);
                t._currentView.tooltipTimerId = setTimeout((() => {
                    t._currentView.tooltip.innerHTML = n;
                    t._currentView.tooltip.style.display = "block";
                    DomElement.showElementAtMousePosition(e, t._currentView.tooltip);
                }), t.tooltip.delay);
            }
            e.show = r;
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
                            renderControl(Binding.Options.getForNewInstance(o.object, e));
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
                renderControlTitleBar(e, n);
                const o = DomElement.create(e._currentView.element, "div", "contents");
                if (t) {
                    DomElement.addClass(o, "page-switch");
                }
                makeAreaDroppable(o, e);
                if (e.showArrayItemsAsSeparateObjects && Is.definedArray(n)) {
                    n = n[e._currentView.dataArrayCurrentIndex];
                }
                if (Is.definedObject(n) && !Is.definedArray(n)) {
                    renderObject(o, e, n);
                } else if (Is.definedArray(n)) {
                    renderArray(o, e, n);
                }
                if (o.innerHTML === "") {
                    DomElement.createWithHTML(o, "span", "no-json-text", _configuration.text.noJsonToViewText);
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
                        const o = DomElement.createWithHTML(e._currentView.titleBarButtons, "button", "next", _configuration.text.nextButtonSymbolText);
                        ToolTip.add(o, e, _configuration.text.nextButtonText);
                        if (e._currentView.dataArrayCurrentIndex < t.length - 1) {
                            o.onclick = () => {
                                e._currentView.dataArrayCurrentIndex++;
                                renderControlContainer(e, true);
                                Trigger.customEvent(e.events.onNextPage, e._currentView.element);
                            };
                        } else {
                            o.disabled = true;
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
                let o = jsonStringifyReplacer;
                if (Is.definedFunction(e.events.onCopyJsonReplacer)) {
                    o = e.events.onCopyJsonReplacer;
                }
                if (e.copyOnlyCurrentPage && e.showArrayItemsAsSeparateObjects) {
                    n = JSON.stringify(t[e._currentView.dataArrayCurrentIndex], o, e.copyIndentSpaces);
                } else {
                    n = JSON.stringify(t, o, e.copyIndentSpaces);
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
                const o = getObjectPropertyNames(n, t);
                const r = o.length;
                if (r !== 0 || !t.ignore.emptyObjects) {
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
                    if (t.showCounts && r > 0) {
                        DomElement.createWithHTML(i, "span", t.showValueColors ? "object count" : "count", `{${r}}`);
                    }
                    if (t.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(i, "span", "opening-symbol", "{");
                    }
                    renderObjectValues(a, null, l, t, n, o, u, false, true);
                    addValueClickEvent(t, s, n, "object");
                }
            }
            function renderArray(e, t, n) {
                const o = DomElement.create(e, "div", "object-type-title");
                const r = DomElement.create(e, "div", "object-type-contents object-type-contents-parent");
                const i = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
                const l = DomElement.createWithHTML(o, "span", t.showValueColors ? "array main-title" : "main-title", _configuration.text.arrayText);
                let a = null;
                if (t.showCounts) {
                    DomElement.createWithHTML(o, "span", t.showValueColors ? "array count" : "count", `[${n.length}]`);
                }
                if (t.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(o, "span", "opening-symbol", "[");
                }
                renderArrayValues(i, null, r, t, n, a, false, true);
                addValueClickEvent(t, l, n, "object");
            }
            function renderObjectValues(e, t, n, o, r, i, l, a, s) {
                const u = i.length;
                for (let e = 0; e < u; e++) {
                    const t = i[e];
                    if (r.hasOwnProperty(t)) {
                        renderValue(r, n, o, t, r[t], e === u - 1, false);
                    }
                }
                if (o.showOpeningClosingCurlyBraces) {
                    createClosingSymbol(o, n, "}", a, s);
                }
                addArrowEvent(o, e, t, n, l);
            }
            function renderArrayValues(e, t, n, o, r, i, l, a) {
                const s = r.length;
                if (!o.reverseArrayValues) {
                    for (let e = 0; e < s; e++) {
                        renderValue(r, n, o, getIndexName(o, e, s), r[e], e === s - 1, true);
                    }
                } else {
                    for (let e = s; e--; ) {
                        renderValue(r, n, o, getIndexName(o, e, s), r[e], e === 0, true);
                    }
                }
                if (o.showOpeningClosingCurlyBraces) {
                    createClosingSymbol(o, n, "]", l, a);
                }
                addArrowEvent(o, e, t, n, i);
            }
            function renderValue(e, t, n, o, r, i, l) {
                const a = DomElement.create(t, "div", "object-type-value");
                const s = n.showArrowToggles ? DomElement.create(a, "div", "no-arrow") : null;
                let u = null;
                let c = null;
                let d = false;
                let f = null;
                const g = DomElement.createWithHTML(a, "span", "title", o);
                DomElement.createWithHTML(a, "span", "split", ":");
                if (!l) {
                    makePropertyNameEditable(n, e, o, g);
                }
                if (r === null) {
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
                } else if (r === void 0) {
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
                } else if (Is.definedFunction(r)) {
                    if (!n.ignore.functionValues) {
                        u = n.showValueColors ? "function value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, Default.getFunctionName(r, _configuration));
                        f = "function";
                        if (Is.definedFunction(n.events.onFunctionRender)) {
                            Trigger.customEvent(n.events.onFunctionRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedBoolean(r)) {
                    if (!n.ignore.booleanValues) {
                        u = n.showValueColors ? "boolean value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, r);
                        f = "boolean";
                        makePropertyValueEditable(n, e, o, r, c, l);
                        if (Is.definedFunction(n.events.onBooleanRender)) {
                            Trigger.customEvent(n.events.onBooleanRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedDecimal(r)) {
                    if (!n.ignore.decimalValues) {
                        const t = Default.getFixedDecimalPlacesValue(r, n.maximumDecimalPlaces);
                        u = n.showValueColors ? "decimal value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, t);
                        f = "decimal";
                        makePropertyValueEditable(n, e, o, r, c, l);
                        if (Is.definedFunction(n.events.onDecimalRender)) {
                            Trigger.customEvent(n.events.onDecimalRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedNumber(r)) {
                    if (!n.ignore.numberValues) {
                        u = n.showValueColors ? "number value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, r);
                        f = "number";
                        makePropertyValueEditable(n, e, o, r, c, l);
                        if (Is.definedFunction(n.events.onNumberRender)) {
                            Trigger.customEvent(n.events.onNumberRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedBigInt(r)) {
                    if (!n.ignore.bigIntValues) {
                        u = n.showValueColors ? "bigint value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, r);
                        f = "bigint";
                        makePropertyValueEditable(n, e, o, r, c, l);
                        if (Is.definedFunction(n.events.onBigIntRender)) {
                            Trigger.customEvent(n.events.onBigIntRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedString(r)) {
                    if (!n.ignore.stringValues) {
                        if (n.parse.stringsToBooleans && Is.String.boolean(r)) {
                            renderValue(e, t, n, o, r.toString().toLowerCase().trim() === "true", i, l);
                            d = true;
                        } else if (n.parse.stringsToNumbers && !isNaN(r)) {
                            renderValue(e, t, n, o, parseFloat(r), i, l);
                            d = true;
                        } else if (n.parse.stringsToDates && Is.String.date(r)) {
                            renderValue(e, t, n, o, new Date(r), i, l);
                            d = true;
                        } else {
                            let t = null;
                            if (n.showValueColors && n.showStringHexColors && Is.String.hexColor(r)) {
                                t = r;
                            } else {
                                if (n.maximumStringLength > 0 && r.length > n.maximumStringLength) {
                                    r = r.substring(0, n.maximumStringLength) + _configuration.text.ellipsisText;
                                }
                            }
                            const s = n.showStringQuotes && t === null ? `"${r}"` : r;
                            u = n.showValueColors ? "string value" : "value";
                            c = DomElement.createWithHTML(a, "span", u, s);
                            f = "string";
                            makePropertyValueEditable(n, e, o, r, c, l);
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
                } else if (Is.definedDate(r)) {
                    if (!n.ignore.dateValues) {
                        u = n.showValueColors ? "date value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, DateTime.getCustomFormattedDateText(_configuration, r, n.dateTimeFormat));
                        f = "date";
                        makePropertyValueEditable(n, e, o, r, c, l);
                        if (Is.definedFunction(n.events.onDateRender)) {
                            Trigger.customEvent(n.events.onDateRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedSymbol(r)) {
                    if (!n.ignore.symbolValues) {
                        u = n.showValueColors ? "symbol value" : "value";
                        c = DomElement.createWithHTML(a, "span", u, r.toString());
                        f = "symbol";
                        if (Is.definedFunction(n.events.onSymbolRender)) {
                            Trigger.customEvent(n.events.onSymbolRender, c);
                        }
                        createComma(n, a, i);
                    } else {
                        d = true;
                    }
                } else if (Is.definedObject(r) && !Is.definedArray(r)) {
                    if (!n.ignore.objectValues) {
                        const e = getObjectPropertyNames(r, n);
                        const t = e.length;
                        if (t === 0 && n.ignore.emptyObjects) {
                            d = true;
                        } else {
                            const o = DomElement.create(a, "span", n.showValueColors ? "object" : "");
                            const l = DomElement.create(a, "div", "object-type-contents");
                            let u = null;
                            c = DomElement.createWithHTML(o, "span", "main-title", _configuration.text.objectText);
                            if (n.showCounts && t > 0) {
                                DomElement.createWithHTML(o, "span", "count", `{${t}}`);
                            }
                            if (n.showOpeningClosingCurlyBraces) {
                                u = DomElement.createWithHTML(o, "span", "opening-symbol", "{");
                            }
                            let d = createComma(n, o, i);
                            renderObjectValues(s, d, l, n, r, e, u, true, i);
                            f = "object";
                        }
                    } else {
                        d = true;
                    }
                } else if (Is.definedArray(r)) {
                    if (!n.ignore.arrayValues) {
                        const e = DomElement.create(a, "span", n.showValueColors ? "array" : "");
                        const t = DomElement.create(a, "div", "object-type-contents");
                        let o = null;
                        c = DomElement.createWithHTML(e, "span", "main-title", _configuration.text.arrayText);
                        if (n.showCounts) {
                            DomElement.createWithHTML(e, "span", "count", `[${r.length}]`);
                        }
                        if (n.showOpeningClosingCurlyBraces) {
                            o = DomElement.createWithHTML(e, "span", "opening-symbol", "[");
                        }
                        let l = createComma(n, e, i);
                        renderArrayValues(s, l, t, n, r, o, true, i);
                        f = "array";
                    } else {
                        d = true;
                    }
                } else {
                    if (!n.ignore.unknownValues) {
                        u = n.showValueColors ? "unknown value non-value" : "value non-value";
                        c = DomElement.createWithHTML(a, "span", u, r.toString());
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
                        addValueClickEvent(n, c, r, f);
                    }
                }
            }
            function makePropertyNameEditable(e, t, n, o) {
                if (e.allowEditing) {
                    o.ondblclick = () => {
                        DomElement.addClass(o, "editable");
                        o.setAttribute("contenteditable", "true");
                        o.focus();
                        DomElement.setTextCursorToEnd(o);
                        o.onblur = () => {
                            renderControlContainer(e, false);
                        };
                        o.onkeydown = r => {
                            if (r.code == "Escape") {
                                r.preventDefault();
                                renderControlContainer(e, false);
                            } else if (r.code == "Enter") {
                                r.preventDefault();
                                const i = o.innerText;
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
            function makePropertyValueEditable(e, t, n, o, r, i) {
                if (e.allowEditing) {
                    r.ondblclick = () => {
                        DomElement.addClass(r, "editable");
                        r.setAttribute("contenteditable", "true");
                        r.innerText = o.toString();
                        r.focus();
                        DomElement.setTextCursorToEnd(r);
                        r.onblur = () => {
                            renderControlContainer(e, false);
                        };
                        r.onkeydown = l => {
                            if (l.code == "Escape") {
                                l.preventDefault();
                                renderControlContainer(e, false);
                            } else if (l.code == "Enter") {
                                l.preventDefault();
                                const a = r.innerText;
                                if (a.trim() === "") {
                                    if (i) {
                                        t.splice(getArrayIndex(n), 1);
                                    } else {
                                        delete t[n];
                                    }
                                } else {
                                    let e = null;
                                    if (Is.definedBoolean(o)) {
                                        e = a.toLowerCase() === "true";
                                    } else if (Is.definedDecimal(o) && !isNaN(+a)) {
                                        e = parseFloat(a);
                                    } else if (Is.definedNumber(o) && !isNaN(+a)) {
                                        e = parseInt(a);
                                    } else if (Is.definedString(o)) {
                                        e = a;
                                    } else if (Is.definedDate(o)) {
                                        e = new Date(a);
                                    } else if (Is.definedBigInt(o)) {
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
            function addValueClickEvent(e, t, n, o) {
                if (Is.definedFunction(e.events.onValueClick)) {
                    t.onclick = () => {
                        Trigger.customEvent(e.events.onValueClick, n, o);
                    };
                } else {
                    DomElement.addClass(t, "no-hover");
                }
            }
            function addArrowEvent(e, t, n, o, r) {
                if (Is.defined(t)) {
                    const i = () => {
                        o.style.display = "none";
                        t.className = "right-arrow";
                        if (Is.defined(r)) {
                            r.style.display = "none";
                        }
                        if (Is.defined(n)) {
                            n.style.display = "inline-block";
                        }
                    };
                    const l = () => {
                        o.style.display = "block";
                        t.className = "down-arrow";
                        if (Is.defined(r)) {
                            r.style.display = "inline-block";
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
                let o = null;
                if (e.showCommas && !n) {
                    o = DomElement.createWithHTML(t, "span", "comma", ",");
                }
                return o;
            }
            function getIndexName(e, t, n) {
                let o = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
                if (!e.addArrayIndexPadding) {
                    o = Str.padNumber(parseInt(o), n.toString().length);
                }
                if (e.showArrayIndexBrackets) {
                    o = `[${o}]`;
                }
                return o;
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
            function createClosingSymbol(e, t, n, o, r) {
                let i = DomElement.create(t, "div", "closing-symbol");
                if (o) {
                    DomElement.create(i, "div", "no-arrow");
                }
                DomElement.createWithHTML(i, "div", "object-type-end", n);
                createComma(e, i, r);
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
                for (let o = 0; o < n; o++) {
                    const n = e[o];
                    const r = n.name.split(".").pop().toLowerCase();
                    if (r === "json") {
                        importFromJson(n, t);
                    }
                }
            }
            function importFromJson(e, t) {
                const n = new FileReader;
                let o = null;
                n.onloadend = () => {
                    t._currentView.dataArrayCurrentIndex = 0;
                    t.data = o;
                    renderControlContainer(t);
                    Trigger.customEvent(t.events.onSetJson, t._currentView.element);
                };
                n.onload = e => {
                    const t = getObjectFromString(e.target.result);
                    if (t.parsed && Is.definedObject(t.object)) {
                        o = t.object;
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
                        const o = _elements_Data[e];
                        o._currentView.dataArrayCurrentIndex = 0;
                        o.data = n;
                        renderControlContainer(o);
                        Trigger.customEvent(o.events.onSetJson, o._currentView.element);
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
                        for (let o in e) {
                            if (e.hasOwnProperty(o) && _configuration.hasOwnProperty(o) && n[o] !== e[o]) {
                                n[o] = e[o];
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