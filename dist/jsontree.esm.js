var DataType = (e => {
    e["null"] = "null";
    e["function"] = "function";
    e["boolean"] = "boolean";
    e["decimal"] = "decimal";
    e["number"] = "number";
    e["bigint"] = "bigint";
    e["string"] = "string";
    e["date"] = "date";
    e["symbol"] = "symbol";
    e["object"] = "object";
    e["array"] = "array";
    e["unknown"] = "unknown";
    e["undefined"] = "undefined";
    e["color"] = "color";
    e["guid"] = "guid";
    e["regexp"] = "regexp";
    e["map"] = "map";
    e["set"] = "set";
    return e;
})(DataType || {});

var Is;

(e => {
    let t;
    (e => {
        function t(e) {
            let t = e.length >= 2 && e.length <= 7;
            if (t && e[0] === "#") {
                t = isNaN(+e.substring(1, e.length - 1));
            } else {
                t = false;
            }
            return t;
        }
        e.hexColor = t;
        function n(e) {
            return (e.startsWith("rgb(") || e.startsWith("rgba(")) && e.endsWith(")");
        }
        e.rgbColor = n;
        function o(e) {
            return e.toString().toLowerCase().trim() === "true" || e.toString().toLowerCase().trim() === "false";
        }
        e.boolean = o;
        function l(e) {
            return !isNaN(+new Date(e));
        }
        e.date = l;
        function r(e) {
            const t = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
            return t.test(e);
        }
        e.guid = r;
    })(t = e.String || (e.String = {}));
    function n(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = n;
    function o(e) {
        return n(e) && typeof e === "object";
    }
    e.definedObject = o;
    function l(e) {
        return n(e) && typeof e === "boolean";
    }
    e.definedBoolean = l;
    function r(e) {
        return n(e) && typeof e === "string";
    }
    e.definedString = r;
    function i(e) {
        return n(e) && typeof e === "function";
    }
    e.definedFunction = i;
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
    function g(e) {
        return n(e) && e instanceof RegExp;
    }
    e.definedRegExp = g;
    function m(e) {
        return n(e) && (e instanceof Map || e instanceof WeakMap);
    }
    e.definedMap = m;
    function p(e) {
        return n(e) && (e instanceof Set || e instanceof WeakSet);
    }
    e.definedSet = p;
    function T(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = T;
})(Is || (Is = {}));

var Default2;

(Default => {
    function getAnyString(e, t) {
        return typeof e === "string" ? e : t;
    }
    Default.getAnyString = getAnyString;
    function getString(e, t) {
        return Is.definedString(e) ? e : t;
    }
    Default.getString = getString;
    function getBoolean(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    Default.getBoolean = getBoolean;
    function getNumber(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    Default.getNumber = getNumber;
    function getFunction(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    Default.getFunction = getFunction;
    function getArray(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    Default.getArray = getArray;
    function getObject(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    Default.getObject = getObject;
    function getStringOrArray(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split(" ");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = getArray(e, t);
        }
        return n;
    }
    Default.getStringOrArray = getStringOrArray;
    function getFixedDecimalPlacesValue(e, t) {
        const n = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
        return e.toString().match(n)?.[0] || "";
    }
    Default.getFixedDecimalPlacesValue = getFixedDecimalPlacesValue;
    function getFunctionName(e, t) {
        let n;
        const o = e.toString().split("(");
        const l = o[0].split(" ");
        const r = "()";
        if (l.length === 2) {
            n = l[1];
        } else {
            n = l[0];
        }
        n += r;
        if (n.trim() === r) {
            n = `${t.text.functionText}${r}`;
        }
        return n;
    }
    Default.getFunctionName = getFunctionName;
    function getObjectFromString(objectString, configuration) {
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
                if (!configuration.safeMode) {
                    console.error(configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    Default.getObjectFromString = getObjectFromString;
    function getObjectFromMap(e) {
        const t = Object.fromEntries(e.entries());
        return t;
    }
    Default.getObjectFromMap = getObjectFromMap;
    function getArrayFromSet(e) {
        const t = Array.from(e.values());
        return t;
    }
    Default.getArrayFromSet = getArrayFromSet;
})(Default2 || (Default2 = {}));

var DomElement;

(e => {
    function t(e, t, n = "", o = null) {
        const l = t.toLowerCase();
        const r = l === "text";
        let i = r ? document.createTextNode("") : document.createElement(l);
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
    function n(e, n, o, l, r = null) {
        const i = t(e, n, o, r);
        i.innerHTML = l;
        return i;
    }
    e.createWithHTML = n;
    function o(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        let o = n ? document.createTextNode("") : document.createElement(t);
        return o;
    }
    e.createWithNoContainer = o;
    function l(e, t) {
        e.classList.add(t);
    }
    e.addClass = l;
    function r(e, t) {
        e.classList.remove(t);
    }
    e.removeClass = r;
    function i(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    e.cancelBubble = i;
    function a() {
        const e = document.documentElement;
        const t = {
            left: e.scrollLeft - (e.clientLeft || 0),
            top: e.scrollTop - (e.clientTop || 0)
        };
        return t;
    }
    e.getScrollPosition = a;
    function s(e, t, n) {
        let o = e.pageX;
        let l = e.pageY;
        const r = a();
        t.style.display = "block";
        if (o + t.offsetWidth > window.innerWidth) {
            o -= t.offsetWidth + n;
        } else {
            o++;
            o += n;
        }
        if (l + t.offsetHeight > window.innerHeight) {
            l -= t.offsetHeight + n;
        } else {
            l++;
            l += n;
        }
        if (o < r.left) {
            o = e.pageX + 1;
        }
        if (l < r.top) {
            l = e.pageY + 1;
        }
        t.style.left = `${o}px`;
        t.style.top = `${l}px`;
    }
    e.showElementAtMousePosition = s;
    function u(e) {
        const t = document.createRange();
        t.selectNodeContents(e);
        const n = window.getSelection();
        n.removeAllRanges();
        n.addRange(t);
    }
    e.selectAllText = u;
    function c(e, o, l, r, i) {
        const a = t(e, "div", "checkbox");
        const s = t(a, "label", "checkbox");
        const u = t(s, "input");
        u.type = "checkbox";
        u.name = l;
        u.checked = r;
        t(s, "span", "check-mark");
        n(s, "span", `text ${i}`, o);
        return u;
    }
    e.createCheckBox = c;
})(DomElement || (DomElement = {}));

var Str;

(e => {
    function t(e, t = 1) {
        const n = e.toString();
        let o = n;
        if (n.length < t) {
            const e = t - n.length + 1;
            o = Array(e).join("0") + n;
        }
        return o;
    }
    e.padNumber = t;
    function n(e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
    }
    e.capitalizeFirstLetter = n;
})(Str || (Str = {}));

var DateTime;

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
    function o(e, o, l) {
        let r = l;
        const i = t(o);
        r = r.replace("{hh}", Str.padNumber(o.getHours(), 2));
        r = r.replace("{h}", o.getHours().toString());
        r = r.replace("{MM}", Str.padNumber(o.getMinutes(), 2));
        r = r.replace("{M}", o.getMinutes().toString());
        r = r.replace("{ss}", Str.padNumber(o.getSeconds(), 2));
        r = r.replace("{s}", o.getSeconds().toString());
        r = r.replace("{fff}", Str.padNumber(o.getMilliseconds(), 3));
        r = r.replace("{ff}", Str.padNumber(o.getMilliseconds(), 2));
        r = r.replace("{f}", o.getMilliseconds().toString());
        r = r.replace("{dddd}", e.text.dayNames[i]);
        r = r.replace("{ddd}", e.text.dayNamesAbbreviated[i]);
        r = r.replace("{dd}", Str.padNumber(o.getDate()));
        r = r.replace("{d}", o.getDate().toString());
        r = r.replace("{o}", n(e, o.getDate()));
        r = r.replace("{mmmm}", e.text.monthNames[o.getMonth()]);
        r = r.replace("{mmm}", e.text.monthNamesAbbreviated[o.getMonth()]);
        r = r.replace("{mm}", Str.padNumber(o.getMonth() + 1));
        r = r.replace("{m}", (o.getMonth() + 1).toString());
        r = r.replace("{yyyy}", o.getFullYear().toString());
        r = r.replace("{yyy}", o.getFullYear().toString().substring(1));
        r = r.replace("{yy}", o.getFullYear().toString().substring(2));
        r = r.replace("{y}", Number.parseInt(o.getFullYear().toString().substring(2)).toString());
        return r;
    }
    e.getCustomFormattedDateText = o;
})(DateTime || (DateTime = {}));

var Constants;

(e => {
    e.JSONTREE_JS_ATTRIBUTE_NAME = "data-jsontree-js";
})(Constants || (Constants = {}));

var Binding;

(e => {
    let t;
    (t => {
        function n(t, n) {
            const o = e.Options.get(t);
            const l = o.allowEditing;
            o._currentView = {};
            o._currentView.element = n;
            o._currentView.dataArrayCurrentIndex = 0;
            o._currentView.titleBarButtons = null;
            o._currentView.valueClickTimerId = 0;
            o._currentView.editMode = false;
            o._currentView.idSet = false;
            o._currentView.contentPanelsOpen = {};
            o._currentView.contentPanelsIndex = 0;
            o._currentView.backButton = null;
            o._currentView.nextButton = null;
            o._currentView.disabledBackground = null;
            o._currentView.sideMenu = null;
            o._currentView.sideMenuChanged = false;
            o._currentView.toggleFullScreenButton = null;
            o._currentView.fullScreenOn = false;
            o._currentView.dragAndDropBackground = null;
            o._currentView.isBulkEditingEnabled = true;
            for (var r in l) {
                if (!l[r]) {
                    o._currentView.isBulkEditingEnabled = false;
                    break;
                }
            }
            return o;
        }
        t.getForNewInstance = n;
        function o(e) {
            let t = Default2.getObject(e, {});
            t.data = Default2.getObject(t.data, null);
            t.showCounts = Default2.getBoolean(t.showCounts, true);
            t.useZeroIndexingForArrays = Default2.getBoolean(t.useZeroIndexingForArrays, true);
            t.dateTimeFormat = Default2.getString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
            t.showArrowToggles = Default2.getBoolean(t.showArrowToggles, true);
            t.showStringQuotes = Default2.getBoolean(t.showStringQuotes, true);
            t.showAllAsClosed = Default2.getBoolean(t.showAllAsClosed, false);
            t.sortPropertyNames = Default2.getBoolean(t.sortPropertyNames, true);
            t.sortPropertyNamesInAlphabeticalOrder = Default2.getBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
            t.showCommas = Default2.getBoolean(t.showCommas, false);
            t.reverseArrayValues = Default2.getBoolean(t.reverseArrayValues, false);
            t.addArrayIndexPadding = Default2.getBoolean(t.addArrayIndexPadding, false);
            t.showValueColors = Default2.getBoolean(t.showValueColors, true);
            t.maximumDecimalPlaces = Default2.getNumber(t.maximumDecimalPlaces, 2);
            t.maximumStringLength = Default2.getNumber(t.maximumStringLength, 0);
            t.showArrayItemsAsSeparateObjects = Default2.getBoolean(t.showArrayItemsAsSeparateObjects, false);
            t.copyOnlyCurrentPage = Default2.getBoolean(t.copyOnlyCurrentPage, false);
            t.fileDroppingEnabled = Default2.getBoolean(t.fileDroppingEnabled, true);
            t.copyIndentSpaces = Default2.getNumber(t.copyIndentSpaces, 2);
            t.showArrayIndexBrackets = Default2.getBoolean(t.showArrayIndexBrackets, true);
            t.showOpeningClosingCurlyBraces = Default2.getBoolean(t.showOpeningClosingCurlyBraces, false);
            t.showOpeningClosingSquaredBrackets = Default2.getBoolean(t.showOpeningClosingSquaredBrackets, false);
            t.includeTimeZoneInDateTimeEditing = Default2.getBoolean(t.includeTimeZoneInDateTimeEditing, true);
            t.shortcutKeysEnabled = Default2.getBoolean(t.shortcutKeysEnabled, true);
            t.openInFullScreenMode = Default2.getBoolean(t.openInFullScreenMode, false);
            t.valueToolTips = Default2.getObject(t.valueToolTips, null);
            t.editingValueClickDelay = Default2.getNumber(t.editingValueClickDelay, 500);
            t.showTypes = Default2.getBoolean(t.showTypes, false);
            t.logJsonValueToolTipPaths = Default2.getBoolean(t.logJsonValueToolTipPaths, false);
            t = l(t);
            t = r(t);
            t = i(t);
            t = a(t);
            t = s(t, Is.definedObject(t.valueToolTips));
            t = u(t);
            t = c(t);
            return t;
        }
        t.get = o;
        function l(e) {
            e.title = Default2.getObject(e.title, {});
            e.title.text = Default2.getAnyString(e.title.text, "JsonTree.js");
            e.title.showTreeControls = Default2.getBoolean(e.title.showTreeControls, true);
            e.title.showCopyButton = Default2.getBoolean(e.title.showCopyButton, true);
            e.title.enableFullScreenToggling = Default2.getBoolean(e.title.enableFullScreenToggling, true);
            e.title.showFullScreenButton = Default2.getBoolean(e.title.showFullScreenButton, true);
            return e;
        }
        function r(e) {
            e.ignore = Default2.getObject(e.ignore, {});
            e.ignore.nullValues = Default2.getBoolean(e.ignore.nullValues, false);
            e.ignore.functionValues = Default2.getBoolean(e.ignore.functionValues, false);
            e.ignore.unknownValues = Default2.getBoolean(e.ignore.unknownValues, false);
            e.ignore.booleanValues = Default2.getBoolean(e.ignore.booleanValues, false);
            e.ignore.decimalValues = Default2.getBoolean(e.ignore.decimalValues, false);
            e.ignore.numberValues = Default2.getBoolean(e.ignore.numberValues, false);
            e.ignore.stringValues = Default2.getBoolean(e.ignore.stringValues, false);
            e.ignore.dateValues = Default2.getBoolean(e.ignore.dateValues, false);
            e.ignore.objectValues = Default2.getBoolean(e.ignore.objectValues, false);
            e.ignore.arrayValues = Default2.getBoolean(e.ignore.arrayValues, false);
            e.ignore.bigintValues = Default2.getBoolean(e.ignore.bigintValues, false);
            e.ignore.symbolValues = Default2.getBoolean(e.ignore.symbolValues, false);
            e.ignore.emptyObjects = Default2.getBoolean(e.ignore.emptyObjects, true);
            e.ignore.undefinedValues = Default2.getBoolean(e.ignore.undefinedValues, false);
            e.ignore.guidValues = Default2.getBoolean(e.ignore.guidValues, false);
            e.ignore.colorValues = Default2.getBoolean(e.ignore.colorValues, false);
            e.ignore.regexpValues = Default2.getBoolean(e.ignore.regexpValues, false);
            e.ignore.mapValues = Default2.getBoolean(e.ignore.mapValues, false);
            e.ignore.setValues = Default2.getBoolean(e.ignore.setValues, false);
            return e;
        }
        function i(e) {
            e.tooltip = Default2.getObject(e.tooltip, {});
            e.tooltip.delay = Default2.getNumber(e.tooltip.delay, 750);
            e.tooltip.offset = Default2.getNumber(e.tooltip.offset, 0);
            return e;
        }
        function a(e) {
            e.parse = Default2.getObject(e.parse, {});
            e.parse.stringsToDates = Default2.getBoolean(e.parse.stringsToDates, false);
            e.parse.stringsToBooleans = Default2.getBoolean(e.parse.stringsToBooleans, false);
            e.parse.stringsToNumbers = Default2.getBoolean(e.parse.stringsToNumbers, false);
            return e;
        }
        function s(e, t) {
            let n = Default2.getBoolean(e.allowEditing, true);
            e.allowEditing = Default2.getObject(e.allowEditing, {});
            e.allowEditing.booleanValues = Default2.getBoolean(e.allowEditing.booleanValues, n);
            e.allowEditing.decimalValues = Default2.getBoolean(e.allowEditing.decimalValues, n);
            e.allowEditing.numberValues = Default2.getBoolean(e.allowEditing.numberValues, n);
            e.allowEditing.stringValues = Default2.getBoolean(e.allowEditing.stringValues, n);
            e.allowEditing.dateValues = Default2.getBoolean(e.allowEditing.dateValues, n);
            e.allowEditing.bigIntValues = Default2.getBoolean(e.allowEditing.bigIntValues, n);
            e.allowEditing.guidValues = Default2.getBoolean(e.allowEditing.guidValues, n);
            e.allowEditing.colorValues = Default2.getBoolean(e.allowEditing.colorValues, n);
            e.allowEditing.propertyNames = Default2.getBoolean(e.allowEditing.propertyNames, n);
            e.allowEditing.bulk = Default2.getBoolean(e.allowEditing.bulk, n);
            if (t) {
                e.allowEditing.propertyNames = false;
            }
            return e;
        }
        function u(e) {
            e.sideMenu = Default2.getObject(e.sideMenu, {});
            e.sideMenu.enabled = Default2.getBoolean(e.sideMenu.enabled, true);
            e.sideMenu.showImportButton = Default2.getBoolean(e.sideMenu.showImportButton, true);
            e.sideMenu.titleText = Default2.getAnyString(e.sideMenu.titleText, "JsonTree.js");
            return e;
        }
        function c(e) {
            e.events = Default2.getObject(e.events, {});
            e.events.onBeforeRender = Default2.getFunction(e.events.onBeforeRender, null);
            e.events.onRenderComplete = Default2.getFunction(e.events.onRenderComplete, null);
            e.events.onValueClick = Default2.getFunction(e.events.onValueClick, null);
            e.events.onRefresh = Default2.getFunction(e.events.onRefresh, null);
            e.events.onCopyAll = Default2.getFunction(e.events.onCopyAll, null);
            e.events.onOpenAll = Default2.getFunction(e.events.onOpenAll, null);
            e.events.onCloseAll = Default2.getFunction(e.events.onCloseAll, null);
            e.events.onDestroy = Default2.getFunction(e.events.onDestroy, null);
            e.events.onBooleanRender = Default2.getFunction(e.events.onBooleanRender, null);
            e.events.onDecimalRender = Default2.getFunction(e.events.onDecimalRender, null);
            e.events.onNumberRender = Default2.getFunction(e.events.onNumberRender, null);
            e.events.onBigIntRender = Default2.getFunction(e.events.onBigIntRender, null);
            e.events.onStringRender = Default2.getFunction(e.events.onStringRender, null);
            e.events.onDateRender = Default2.getFunction(e.events.onDateRender, null);
            e.events.onFunctionRender = Default2.getFunction(e.events.onFunctionRender, null);
            e.events.onNullRender = Default2.getFunction(e.events.onNullRender, null);
            e.events.onUnknownRender = Default2.getFunction(e.events.onUnknownRender, null);
            e.events.onSymbolRender = Default2.getFunction(e.events.onSymbolRender, null);
            e.events.onCopyJsonReplacer = Default2.getFunction(e.events.onCopyJsonReplacer, null);
            e.events.onUndefinedRender = Default2.getFunction(e.events.onUndefinedRender, null);
            e.events.onGuidRender = Default2.getFunction(e.events.onGuidRender, null);
            e.events.onColorRender = Default2.getFunction(e.events.onColorRender, null);
            e.events.onJsonEdit = Default2.getFunction(e.events.onJsonEdit, null);
            e.events.onRegExpRender = Default2.getFunction(e.events.onRegExpRender, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Binding || (Binding = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = Default2.getObject(e, {});
            t.safeMode = Default2.getBoolean(t.safeMode, true);
            t.domElementTypes = Default2.getStringOrArray(t.domElementTypes, [ "*" ]);
            t = n(t);
            return t;
        }
        e.get = t;
        function n(e) {
            e.text = Default2.getObject(e.text, {});
            e.text.objectText = Default2.getAnyString(e.text.objectText, "object");
            e.text.arrayText = Default2.getAnyString(e.text.arrayText, "array");
            e.text.mapText = Default2.getAnyString(e.text.mapText, "map");
            e.text.setText = Default2.getAnyString(e.text.setText, "set");
            e.text.closeAllButtonText = Default2.getAnyString(e.text.closeAllButtonText, "Close All");
            e.text.openAllButtonText = Default2.getAnyString(e.text.openAllButtonText, "Open All");
            e.text.copyAllButtonText = Default2.getAnyString(e.text.copyAllButtonText, "Copy All");
            e.text.objectErrorText = Default2.getAnyString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
            e.text.attributeNotValidErrorText = Default2.getAnyString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
            e.text.attributeNotSetErrorText = Default2.getAnyString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            e.text.stText = Default2.getAnyString(e.text.stText, "st");
            e.text.ndText = Default2.getAnyString(e.text.ndText, "nd");
            e.text.rdText = Default2.getAnyString(e.text.rdText, "rd");
            e.text.thText = Default2.getAnyString(e.text.thText, "th");
            e.text.ellipsisText = Default2.getAnyString(e.text.ellipsisText, "...");
            e.text.closeAllButtonSymbolText = Default2.getAnyString(e.text.closeAllButtonSymbolText, "⇈");
            e.text.openAllButtonSymbolText = Default2.getAnyString(e.text.openAllButtonSymbolText, "⇊");
            e.text.copyAllButtonSymbolText = Default2.getAnyString(e.text.copyAllButtonSymbolText, "❐");
            e.text.backButtonText = Default2.getAnyString(e.text.backButtonText, "Back");
            e.text.nextButtonText = Default2.getAnyString(e.text.nextButtonText, "Next");
            e.text.backButtonSymbolText = Default2.getAnyString(e.text.backButtonSymbolText, "←");
            e.text.nextButtonSymbolText = Default2.getAnyString(e.text.nextButtonSymbolText, "→");
            e.text.noJsonToViewText = Default2.getAnyString(e.text.noJsonToViewText, "There is currently no JSON to view.");
            e.text.functionText = Default2.getAnyString(e.text.functionText, "function");
            e.text.sideMenuButtonSymbolText = Default2.getAnyString(e.text.sideMenuButtonSymbolText, "☰");
            e.text.sideMenuButtonText = Default2.getAnyString(e.text.sideMenuButtonText, "Show Menu");
            e.text.closeButtonSymbolText = Default2.getAnyString(e.text.closeButtonSymbolText, "✕");
            e.text.closeButtonText = Default2.getAnyString(e.text.closeButtonText, "Close");
            e.text.showTypesText = Default2.getAnyString(e.text.showTypesText, "Show Types");
            e.text.selectAllText = Default2.getAnyString(e.text.selectAllText, "Select All");
            e.text.selectNoneText = Default2.getAnyString(e.text.selectNoneText, "Select None");
            e.text.importButtonSymbolText = Default2.getAnyString(e.text.importButtonSymbolText, "⇪");
            e.text.importButtonText = Default2.getAnyString(e.text.importButtonText, "Import");
            e.text.fullScreenOnButtonSymbolText = Default2.getAnyString(e.text.fullScreenOnButtonSymbolText, "↗");
            e.text.fullScreenOffButtonSymbolText = Default2.getAnyString(e.text.fullScreenOffButtonSymbolText, "↙");
            e.text.fullScreenButtonText = Default2.getAnyString(e.text.fullScreenButtonText, "Toggle Full-Screen");
            e.text.copyButtonText = Default2.getAnyString(e.text.copyButtonText, "Copy");
            e.text.dragAndDropSymbolText = Default2.getAnyString(e.text.dragAndDropSymbolText, "⇪");
            e.text.dragAndDropTitleText = Default2.getAnyString(e.text.dragAndDropTitleText, "Drag and drop your JSON files to upload");
            e.text.dragAndDropDescriptionText = Default2.getAnyString(e.text.dragAndDropDescriptionText, "Multiple files will be joined as an array");
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

var Trigger;

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

var ToolTip;

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
        n("mousemove", (() => r(e)));
        o("scroll", (() => r(e)));
    }
    e.assignToEvents = n;
    function o(e, t, n, o = "jsontree-js-tooltip") {
        if (e !== null) {
            e.onmousemove = e => l(e, t, n, o);
        }
    }
    e.add = o;
    function l(e, t, n, o) {
        DomElement.cancelBubble(e);
        r(t);
        t._currentView.tooltipTimerId = setTimeout((() => {
            t._currentView.tooltip.className = o;
            t._currentView.tooltip.innerHTML = n;
            t._currentView.tooltip.style.display = "block";
            DomElement.showElementAtMousePosition(e, t._currentView.tooltip, t.tooltip.offset);
        }), t.tooltip.delay);
    }
    e.show = l;
    function r(e) {
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
    e.hide = r;
    function i(e) {
        if (Is.defined(e._currentView.tooltip)) {
            e._currentView.tooltip.parentNode.removeChild(e._currentView.tooltip);
        }
    }
    e.remove = i;
})(ToolTip || (ToolTip = {}));

var Arr;

(e => {
    function t(e, t) {
        return t.useZeroIndexingForArrays ? e : e + 1;
    }
    e.getIndex = t;
    function n(e, t, n) {
        let o = t.toString();
        if (!e.addArrayIndexPadding) {
            o = Str.padNumber(parseInt(o), n.toString().length);
        }
        if (e.showArrayIndexBrackets) {
            o = `[${o}]`;
        }
        return o;
    }
    e.getIndexName = n;
    function o(e) {
        return parseInt(e.replace("[", "").replace("]", ""));
    }
    e.getIndexFromBrackets = o;
    function l(e, t, n) {
        if (n < 0) {
            n = 0;
        } else if (n > e.length - 1) {
            n = e.length - 1;
        }
        e.splice(n, 0, e.splice(t, 1)[0]);
    }
    e.moveIndex = l;
})(Arr || (Arr = {}));

(() => {
    let e = {};
    let t = {};
    let n = 0;
    function o() {
        const t = e.domElementTypes;
        const n = t.length;
        for (let e = 0; e < n; e++) {
            const n = document.getElementsByTagName(t[e]);
            const o = [].slice.call(n);
            const r = o.length;
            for (let e = 0; e < r; e++) {
                if (!l(o[e])) {
                    break;
                }
            }
        }
    }
    function l(t) {
        let n = true;
        if (Is.defined(t) && t.hasAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME)) {
            const o = t.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
            if (Is.definedString(o)) {
                const l = Default2.getObjectFromString(o, e);
                if (l.parsed && Is.definedObject(l.object)) {
                    r(Binding.Options.getForNewInstance(l.object, t));
                } else {
                    if (!e.safeMode) {
                        console.error(e.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                        n = false;
                    }
                }
            } else {
                if (!e.safeMode) {
                    console.error(e.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME));
                    n = false;
                }
            }
        }
        return n;
    }
    function r(e) {
        Trigger.customEvent(e.events.onBeforeRender, e._currentView.element);
        ToolTip.renderControl(e);
        if (!Is.definedString(e._currentView.element.id)) {
            e._currentView.element.id = crypto.randomUUID();
            e._currentView.idSet = true;
        }
        e._currentView.element.className = "json-tree-js";
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (e.title.enableFullScreenToggling && e.openInFullScreenMode) {
            DomElement.addClass(e._currentView.element, "full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        H(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let l = t[n._currentView.element.id].data;
        ToolTip.hide(n);
        n._currentView.element.innerHTML = "";
        n._currentView.editMode = false;
        n._currentView.contentPanelsIndex = 0;
        n._currentView.sideMenuChanged = false;
        s(n, l);
        T(n);
        const r = DomElement.create(n._currentView.element, "div", "contents");
        if (o) {
            DomElement.addClass(r, "page-switch");
        }
        if (n.showArrayItemsAsSeparateObjects && Is.definedArray(l)) {
            l = l[n._currentView.dataArrayCurrentIndex];
        }
        if (Is.definedArray(l) || Is.definedSet(l)) {
            V(r, n, l);
        } else if (Is.definedObject(l)) {
            h(r, n, l);
        }
        if (r.innerHTML === "" || r.children.length >= 2 && r.children[1].children.length === 0) {
            r.innerHTML = "";
            DomElement.createWithHTML(r, "span", "no-json-text", e.text.noJsonToViewText);
            n._currentView.titleBarButtons.style.display = "none";
        } else {
            n._currentView.titleBarButtons.style.display = "block";
        }
        N(n);
        a(n, l, r);
    }
    function a(t, n, o) {
        if (t._currentView.isBulkEditingEnabled) {
            o.ondblclick = l => {
                DomElement.cancelBubble(l);
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                o.setAttribute("contenteditable", "true");
                o.innerText = JSON.stringify(n, p, 6);
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => i(t, false);
                o.onkeydown = n => {
                    if (n.code == "Escape") {
                        n.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (n.code == "Enter") {
                        n.preventDefault();
                        const l = o.innerText;
                        const r = Default2.getObjectFromString(l, e);
                        if (r.parsed) {
                            if (t.showArrayItemsAsSeparateObjects) {
                                t.data[t._currentView.dataArrayCurrentIndex] = r.object;
                            } else {
                                t.data = r.object;
                            }
                        }
                        o.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function s(t, n) {
        if (Is.definedString(t.title.text) || t.title.showTreeControls || t.title.showCopyButton || t.sideMenu.enabled || t.showArrayItemsAsSeparateObjects || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => u(t);
            }
            if (t.sideMenu.enabled && Is.definedObject(n)) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => y(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyAllButtonSymbolText);
                o.onclick = () => c(t, n);
                o.ondblclick = DomElement.cancelBubble;
                if (t.copyOnlyCurrentPage && t.showArrayItemsAsSeparateObjects) {
                    ToolTip.add(o, t, e.text.copyButtonText);
                } else {
                    ToolTip.add(o, t, e.text.copyAllButtonText);
                }
            }
            if (t.title.showTreeControls) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "openAll", e.text.openAllButtonSymbolText);
                n.onclick = () => d(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "closeAll", e.text.closeAllButtonSymbolText);
                o.onclick = () => f(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.showArrayItemsAsSeparateObjects && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => g(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex < n.length - 1) {
                    t._currentView.nextButton.onclick = () => m(t);
                } else {
                    t._currentView.nextButton.disabled = true;
                }
            } else {
                if (Is.definedArray(n)) {
                    t.showArrayItemsAsSeparateObjects = false;
                }
            }
            if (t.title.enableFullScreenToggling && t.title.showFullScreenButton) {
                const n = !t._currentView.fullScreenOn ? e.text.fullScreenOnButtonSymbolText : e.text.fullScreenOffButtonSymbolText;
                t._currentView.toggleFullScreenButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "toggle-full-screen", n);
                t._currentView.toggleFullScreenButton.onclick = () => u(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function u(t) {
        if (t._currentView.element.classList.contains("full-screen")) {
            DomElement.removeClass(t._currentView.element, "full-screen");
            t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOnButtonSymbolText;
            t._currentView.fullScreenOn = false;
        } else {
            DomElement.addClass(t._currentView.element, "full-screen");
            t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOffButtonSymbolText;
            t._currentView.fullScreenOn = true;
        }
    }
    function c(e, t) {
        let n = null;
        let o = p;
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
    function d(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function f(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function g(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex--;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function m(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex++;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function p(t, n) {
        if (Is.definedBigInt(n)) {
            n = n.toString();
        } else if (Is.definedSymbol(n)) {
            n = n.toString();
        } else if (Is.definedFunction(n)) {
            n = Default2.getFunctionName(n, e);
        }
        return n;
    }
    function T(t) {
        if (t.sideMenu.enabled) {
            t._currentView.disabledBackground = DomElement.create(t._currentView.element, "div", "side-menu-disabled-background");
            t._currentView.disabledBackground.onclick = () => w(t);
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "close", e.text.importButtonSymbolText);
                n.onclick = () => b(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const l = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            l.onclick = () => w(t);
            ToolTip.add(l, t, e.text.closeButtonText);
            const r = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
            x(r, t);
        }
    }
    function b(e) {
        const t = DomElement.createWithNoContainer("input");
        t.type = "file";
        t.accept = ".json";
        t.multiple = true;
        t.onchange = () => L(t.files, e);
        t.click();
    }
    function y(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
        }
    }
    function w(e) {
        if (e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.remove("side-menu-open");
            e._currentView.disabledBackground.style.display = "none";
            if (e._currentView.sideMenuChanged) {
                i(e);
            }
        }
    }
    function x(t, n) {
        const o = [];
        const l = DomElement.create(t, "div", "settings-panel");
        const r = DomElement.create(l, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(r, "div", "settings-panel-title-text", `${e.text.showTypesText}:`);
        const i = DomElement.create(r, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => D(n, o, true);
        s.onclick = () => D(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(l, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            o.push(v(u, e, n, !d[`${e}Values`]));
        }));
    }
    function D(e, t, n) {
        const o = t.length;
        const l = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            l[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function v(e, t, n, o) {
        const l = DomElement.createCheckBox(e, Str.capitalizeFirstLetter(t), t, o, n.showValueColors ? t : "");
        l.onchange = () => {
            const e = n.ignore;
            e[`${t}Values`] = !l.checked;
            n.ignore = e;
            n._currentView.sideMenuChanged = true;
        };
        return l;
    }
    function h(t, n, o) {
        const l = Is.definedMap(o);
        const r = l ? "map" : "object";
        const i = l ? Default2.getObjectFromMap(o) : o;
        const a = F(i, n);
        const s = a.length;
        if (s !== 0 || !n.ignore.emptyObjects) {
            const u = DomElement.create(t, "div", "object-type-title");
            const c = DomElement.create(t, "div", "object-type-contents last-item");
            const d = n.showArrowToggles ? DomElement.create(u, "div", "down-arrow") : null;
            const f = DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} main-title` : "main-title", l ? e.text.mapText : e.text.objectText);
            let g = null;
            if (n.showArrayItemsAsSeparateObjects) {
                let e = n.useZeroIndexingForArrays ? n._currentView.dataArrayCurrentIndex.toString() : (n._currentView.dataArrayCurrentIndex + 1).toString();
                if (n.showArrayIndexBrackets) {
                    e = `[${e}]${" "}:`;
                }
                DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} data-array-index` : "data-array-index", e, f);
            }
            if (n.showCounts && s > 0) {
                DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} count` : "count", `{${s}}`);
            }
            if (n.showOpeningClosingCurlyBraces) {
                g = DomElement.createWithHTML(u, "span", "opening-symbol", "{");
            }
            S(d, null, c, n, i, a, g, false, true, "");
            C(n, f, o, r, false);
        }
    }
    function V(t, n, o) {
        const l = Is.definedSet(o);
        const r = l ? "set" : "array";
        const i = l ? Default2.getArrayFromSet(o) : o;
        const a = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const u = n.showArrowToggles ? DomElement.create(a, "div", "down-arrow") : null;
        const c = DomElement.createWithHTML(a, "span", n.showValueColors ? `${r} main-title` : "main-title", l ? e.text.setText : e.text.arrayText);
        let d = null;
        if (n.showCounts) {
            DomElement.createWithHTML(a, "span", n.showValueColors ? `${r} count` : "count", `[${i.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            d = DomElement.createWithHTML(a, "span", "opening-symbol", "[");
        }
        E(u, null, s, n, i, d, false, true, "");
        C(n, c, o, r, false);
    }
    function S(e, t, n, o, l, r, i, a, s, u) {
        const c = r.length;
        for (let e = 0; e < c; e++) {
            const t = r[e];
            const i = u === "" ? t : `${u}${"\\"}${t}`;
            if (l.hasOwnProperty(t)) {
                B(l, n, o, t, l[t], e === c - 1, false, i);
            }
        }
        if (o.showOpeningClosingCurlyBraces) {
            j(o, n, "}", a, s);
        }
        O(o, e, t, n, i);
    }
    function E(e, t, n, o, l, r, i, a, s) {
        const u = l.length;
        if (!o.reverseArrayValues) {
            for (let e = 0; e < u; e++) {
                const t = Arr.getIndex(e, o);
                const r = s === "" ? t.toString() : `${s}${"\\"}${t}`;
                B(l, n, o, Arr.getIndexName(o, t, u), l[e], e === u - 1, true, r);
            }
        } else {
            for (let e = u; e--; ) {
                const t = Arr.getIndex(e, o);
                const r = s === "" ? t.toString() : `${s}${"\\"}${t}`;
                B(l, n, o, Arr.getIndexName(o, t, u), l[e], e === 0, true, r);
            }
        }
        if (o.showOpeningClosingCurlyBraces) {
            j(o, n, "]", i, a);
        }
        O(o, e, t, n, r);
    }
    function B(t, n, o, l, r, i, a, s) {
        const u = DomElement.create(n, "div", "object-type-value");
        const c = o.showArrowToggles ? DomElement.create(u, "div", "no-arrow") : null;
        let d = null;
        let f = null;
        let g = false;
        let m = null;
        const p = DomElement.createWithHTML(u, "span", "title", l);
        let T = false;
        let b = null;
        if (i) {
            DomElement.addClass(u, "last-item");
        }
        if (o.showTypes) {
            b = DomElement.createWithHTML(u, "span", o.showValueColors ? "type-color" : "type", "");
        }
        DomElement.createWithHTML(u, "span", "split", ":");
        I(o, t, l, p, a);
        if (r === null) {
            if (!o.ignore.nullValues) {
                d = o.showValueColors ? `${"null"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, "null");
                m = "null";
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (r === void 0) {
            if (!o.ignore.undefinedValues) {
                d = o.showValueColors ? `${"undefined"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, "undefined");
                m = "undefined";
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedFunction(r)) {
            if (!o.ignore.functionValues) {
                d = o.showValueColors ? `${"function"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, Default2.getFunctionName(r, e));
                m = "function";
                if (Is.definedFunction(o.events.onFunctionRender)) {
                    Trigger.customEvent(o.events.onFunctionRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedBoolean(r)) {
            if (!o.ignore.booleanValues) {
                d = o.showValueColors ? `${"boolean"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r);
                m = "boolean";
                T = o.allowEditing.booleanValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedDecimal(r)) {
            if (!o.ignore.decimalValues) {
                const e = Default2.getFixedDecimalPlacesValue(r, o.maximumDecimalPlaces);
                d = o.showValueColors ? `${"decimal"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, e);
                m = "decimal";
                T = o.allowEditing.decimalValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onDecimalRender)) {
                    Trigger.customEvent(o.events.onDecimalRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedNumber(r)) {
            if (!o.ignore.numberValues) {
                d = o.showValueColors ? `${"number"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r);
                m = "number";
                T = o.allowEditing.numberValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedBigInt(r)) {
            if (!o.ignore.bigintValues) {
                d = o.showValueColors ? `${"bigint"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r);
                m = "bigint";
                T = o.allowEditing.bigIntValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(r) && Is.String.guid(r)) {
            if (!o.ignore.guidValues) {
                d = o.showValueColors ? `${"guid"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r);
                m = "guid";
                T = o.allowEditing.guidValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(r) && (Is.String.hexColor(r) || Is.String.rgbColor(r))) {
            if (!o.ignore.colorValues) {
                d = o.showValueColors ? `${"color"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r);
                m = "color";
                T = o.allowEditing.colorValues;
                if (o.showValueColors) {
                    f.style.color = r;
                }
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(r)) {
            if (!o.ignore.stringValues) {
                if (o.parse.stringsToBooleans && Is.String.boolean(r)) {
                    B(t, n, o, l, r.toString().toLowerCase().trim() === "true", i, a, s);
                    g = true;
                } else if (o.parse.stringsToNumbers && !isNaN(r)) {
                    B(t, n, o, l, parseFloat(r), i, a, s);
                    g = true;
                } else if (o.parse.stringsToDates && Is.String.date(r)) {
                    B(t, n, o, l, new Date(r), i, a, s);
                    g = true;
                } else {
                    if (o.maximumStringLength > 0 && r.length > o.maximumStringLength) {
                        r = r.substring(0, o.maximumStringLength) + e.text.ellipsisText;
                    }
                    const n = o.showStringQuotes ? `"${r}"` : r;
                    d = o.showValueColors ? `${"string"} value` : "value";
                    f = DomElement.createWithHTML(u, "span", d, n);
                    m = "string";
                    T = o.allowEditing.stringValues;
                    _(o, t, l, r, f, a, T);
                    if (Is.definedFunction(o.events.onStringRender)) {
                        Trigger.customEvent(o.events.onStringRender, f);
                    }
                    M(o, u, i);
                }
            } else {
                g = true;
            }
        } else if (Is.definedDate(r)) {
            if (!o.ignore.dateValues) {
                d = o.showValueColors ? `${"date"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, DateTime.getCustomFormattedDateText(e, r, o.dateTimeFormat));
                m = "date";
                T = o.allowEditing.dateValues;
                _(o, t, l, r, f, a, T);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedSymbol(r)) {
            if (!o.ignore.symbolValues) {
                d = o.showValueColors ? `${"symbol"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r.toString());
                m = "symbol";
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedRegExp(r)) {
            if (!o.ignore.regexpValues) {
                d = o.showValueColors ? `${"regexp"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, r.source.toString());
                m = "regexp";
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedSet(r)) {
            if (!o.ignore.setValues) {
                const t = Default2.getArrayFromSet(r);
                const n = DomElement.create(u, "span", o.showValueColors ? "set" : "");
                const l = DomElement.create(u, "div", "object-type-contents");
                let a = null;
                if (i) {
                    DomElement.addClass(l, "last-item");
                }
                f = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                m = "set";
                if (o.showCounts) {
                    DomElement.createWithHTML(n, "span", "count", `[${t.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                let d = M(o, n, i);
                E(c, d, l, o, t, a, true, i, s);
            } else {
                g = true;
            }
        } else if (Is.definedArray(r)) {
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(u, "span", o.showValueColors ? "array" : "");
                const n = DomElement.create(u, "div", "object-type-contents");
                let l = null;
                if (i) {
                    DomElement.addClass(n, "last-item");
                }
                f = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                m = "array";
                if (o.showCounts) {
                    DomElement.createWithHTML(t, "span", "count", `[${r.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    l = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                let a = M(o, t, i);
                E(c, a, n, o, r, l, true, i, s);
            } else {
                g = true;
            }
        } else if (Is.definedMap(r)) {
            if (!o.ignore.mapValues) {
                const t = Default2.getObjectFromMap(r);
                const n = F(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    g = true;
                } else {
                    const r = DomElement.create(u, "span", o.showValueColors ? "map" : "");
                    const a = DomElement.create(u, "div", "object-type-contents");
                    let d = null;
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    f = DomElement.createWithHTML(r, "span", "main-title", e.text.mapText);
                    m = "map";
                    if (o.showCounts && l > 0) {
                        DomElement.createWithHTML(r, "span", "count", `{${l}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        d = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    let g = M(o, r, i);
                    S(c, g, a, o, t, n, d, true, i, s);
                }
            } else {
                g = true;
            }
        } else if (Is.definedObject(r)) {
            if (!o.ignore.objectValues) {
                const t = F(r, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    g = true;
                } else {
                    const l = DomElement.create(u, "span", o.showValueColors ? "object" : "");
                    const a = DomElement.create(u, "div", "object-type-contents");
                    let d = null;
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    f = DomElement.createWithHTML(l, "span", "main-title", e.text.objectText);
                    m = "object";
                    if (o.showCounts && n > 0) {
                        DomElement.createWithHTML(l, "span", "count", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        d = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                    }
                    let g = M(o, l, i);
                    S(c, g, a, o, r, t, d, true, i, s);
                }
            } else {
                g = true;
            }
        } else {
            if (!o.ignore.unknownValues) {
                d = o.showValueColors ? `${"unknown"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, r.toString());
                m = "unknown";
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, f);
                }
                M(o, u, i);
            } else {
                g = true;
            }
        }
        if (g) {
            n.removeChild(u);
        } else {
            if (Is.defined(f)) {
                if (Is.defined(b)) {
                    if (m !== "null" && m !== "undefined" && m !== "array" && m !== "object" && m !== "map" && m !== "set") {
                        b.innerHTML = `(${m})`;
                    } else {
                        b.parentNode.removeChild(b);
                        b = null;
                    }
                }
                A(o, s, p, b, f);
                C(o, f, r, m, T);
            }
        }
    }
    function A(e, t, n, o, l) {
        if (Is.definedObject(e.valueToolTips)) {
            if (e.logJsonValueToolTipPaths) {
                console.log(t);
            }
            if (!e.valueToolTips.hasOwnProperty(t)) {
                const e = t.split("\\");
                const n = e.length - 1;
                for (let t = 0; t < n; t++) {
                    e[t] = "..";
                }
                t = e.join("\\");
            }
            if (e.valueToolTips.hasOwnProperty(t)) {
                ToolTip.add(n, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
                ToolTip.add(o, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
                ToolTip.add(l, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
            }
        }
    }
    function I(e, t, n, o, l) {
        if (e.allowEditing.propertyNames) {
            o.ondblclick = r => {
                DomElement.cancelBubble(r);
                let a = 0;
                clearTimeout(e._currentView.valueClickTimerId);
                e._currentView.valueClickTimerId = 0;
                e._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                if (l) {
                    a = Arr.getIndexFromBrackets(o.innerHTML);
                    o.innerHTML = a.toString();
                }
                o.setAttribute("contenteditable", "true");
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => i(e, false);
                o.onkeydown = r => {
                    if (r.code == "Escape") {
                        r.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (r.code == "Enter") {
                        r.preventDefault();
                        const i = o.innerText;
                        if (l) {
                            if (!isNaN(+i)) {
                                let n = +i;
                                if (!e.useZeroIndexingForArrays) {
                                    n--;
                                }
                                if (a !== n) {
                                    Arr.moveIndex(t, a, n);
                                    Trigger.customEvent(e.events.onJsonEdit, e._currentView.element);
                                }
                            }
                        } else {
                            if (i !== n) {
                                if (i.trim() === "") {
                                    delete t[n];
                                } else {
                                    if (!t.hasOwnProperty(i)) {
                                        const e = t[n];
                                        delete t[n];
                                        t[i] = e;
                                    }
                                }
                                Trigger.customEvent(e.events.onJsonEdit, e._currentView.element);
                            }
                        }
                        o.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function _(e, t, n, o, l, r, a) {
        if (a) {
            l.ondblclick = a => {
                DomElement.cancelBubble(a);
                clearTimeout(e._currentView.valueClickTimerId);
                e._currentView.valueClickTimerId = 0;
                e._currentView.editMode = true;
                DomElement.addClass(l, "editable");
                l.setAttribute("contenteditable", "true");
                if (Is.definedDate(o) && !e.includeTimeZoneInDateTimeEditing) {
                    l.innerText = JSON.stringify(o).replace(/['"]+/g, "");
                } else {
                    l.innerText = o.toString();
                }
                l.focus();
                DomElement.selectAllText(l);
                l.onblur = () => i(e, false);
                l.onkeydown = i => {
                    if (i.code == "Escape") {
                        i.preventDefault();
                        l.setAttribute("contenteditable", "false");
                    } else if (i.code == "Enter") {
                        i.preventDefault();
                        const a = l.innerText;
                        if (a.trim() === "") {
                            if (r) {
                                t.splice(Arr.getIndexFromBrackets(n), 1);
                            } else {
                                delete t[n];
                            }
                        } else {
                            let l = null;
                            if (Is.definedBoolean(o)) {
                                l = a.toLowerCase() === "true";
                            } else if (Is.definedDecimal(o) && !isNaN(+a)) {
                                l = parseFloat(a);
                            } else if (Is.definedNumber(o) && !isNaN(+a)) {
                                l = parseInt(a);
                            } else if (Is.definedString(o)) {
                                l = a;
                            } else if (Is.definedDate(o)) {
                                l = new Date(a);
                            } else if (Is.definedBigInt(o)) {
                                l = BigInt(a);
                            }
                            if (l !== null) {
                                if (r) {
                                    t[Arr.getIndexFromBrackets(n)] = l;
                                } else {
                                    t[n] = l;
                                }
                                Trigger.customEvent(e.events.onJsonEdit, e._currentView.element);
                            }
                        }
                        l.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function C(e, t, n, o, l) {
        if (Is.definedFunction(e.events.onValueClick)) {
            t.onclick = () => {
                if (l) {
                    e._currentView.valueClickTimerId = setTimeout((() => {
                        if (!e._currentView.editMode) {
                            Trigger.customEvent(e.events.onValueClick, n, o);
                        }
                    }), e.editingValueClickDelay);
                } else {
                    Trigger.customEvent(e.events.onValueClick, n, o);
                }
            };
        } else {
            DomElement.addClass(t, "no-hover");
        }
    }
    function O(e, t, n, o, l) {
        const r = e._currentView.contentPanelsIndex;
        const i = e._currentView.dataArrayCurrentIndex;
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(i)) {
            e._currentView.contentPanelsOpen[i] = {};
        }
        const a = () => {
            o.style.display = "none";
            e._currentView.contentPanelsOpen[i][r] = true;
            if (Is.defined(t)) {
                t.className = "right-arrow";
            }
            if (Is.defined(l)) {
                l.style.display = "none";
            }
            if (Is.defined(n)) {
                n.style.display = "inline-block";
            }
        };
        const s = () => {
            o.style.display = "block";
            e._currentView.contentPanelsOpen[i][r] = false;
            if (Is.defined(t)) {
                t.className = "down-arrow";
            }
            if (Is.defined(l)) {
                l.style.display = "inline-block";
            }
            if (Is.defined(n)) {
                n.style.display = "none";
            }
        };
        const u = e => {
            if (e) {
                a();
            } else {
                s();
            }
        };
        let c = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[i].hasOwnProperty(r)) {
            c = e._currentView.contentPanelsOpen[i][r];
        } else {
            e._currentView.contentPanelsOpen[i][r] = c;
        }
        if (Is.defined(t)) {
            t.onclick = () => u(t.className === "down-arrow");
        }
        u(c);
        e._currentView.contentPanelsIndex++;
    }
    function M(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function F(e, t) {
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
    function j(e, t, n, o, l) {
        let r = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles) {
            DomElement.create(r, "div", "no-arrow");
        }
        DomElement.createWithHTML(r, "div", "object-type-end", n);
        M(e, r, l);
    }
    function N(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => n.style.display = "block";
            t._currentView.element.ondragenter = () => n.style.display = "block";
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => k(e, t);
        }
    }
    function k(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            L(e.dataTransfer.files, t);
        }
    }
    function L(e, t) {
        const n = e.length;
        let o = 0;
        let l = [];
        const r = e => {
            o++;
            l.push(e);
            if (o === n) {
                t._currentView.dataArrayCurrentIndex = 0;
                t._currentView.contentPanelsOpen = {};
                t.data = l.length === 1 ? l[0] : l;
                i(t);
                Trigger.customEvent(t.events.onSetJson, t._currentView.element);
            }
        };
        for (let t = 0; t < n; t++) {
            const n = e[t];
            const o = n.name.split(".").pop().toLowerCase();
            if (o === "json") {
                R(n, r);
            }
        }
    }
    function R(t, n) {
        const o = new FileReader;
        let l = null;
        o.onloadend = () => n(l);
        o.onload = t => {
            const n = Default2.getObjectFromString(t.target.result, e);
            if (n.parsed && Is.definedObject(n.object)) {
                l = n.object;
            }
        };
        o.readAsText(t);
    }
    function H(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => W(t, e)));
    }
    function W(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id)) {
            if (e.code === "ArrowLeft") {
                e.preventDefault();
                g(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                m(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                f(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                d(o);
            } else if (e.code === "Escape") {
                e.preventDefault();
                w(o);
            }
        }
    }
    function P(e) {
        e._currentView.element.innerHTML = "";
        DomElement.removeClass(e._currentView.element, "json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        H(e, false);
        ToolTip.assignToEvents(e, false);
        ToolTip.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const $ = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return $;
        },
        refreshAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return $;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e));
            }
            return $;
        },
        renderAll: function() {
            o();
            return $;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                d(t[e]);
            }
            return $;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                f(t[e]);
            }
            return $;
        },
        setJson: function(n, o) {
            if (Is.definedString(n) && Is.defined(o) && t.hasOwnProperty(n)) {
                let l = null;
                if (Is.definedString(o)) {
                    const t = Default2.getObjectFromString(o, e);
                    if (t.parsed) {
                        l = t.object;
                    }
                } else {
                    l = o;
                }
                const r = t[n];
                r._currentView.dataArrayCurrentIndex = 0;
                r._currentView.contentPanelsOpen = {};
                r.data = l;
                i(r);
                Trigger.customEvent(r.events.onSetJson, r._currentView.element);
            }
            return $;
        },
        getJson: function(e) {
            let n = null;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                n = t[e].data;
            }
            return n;
        },
        destroy: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                P(t[e]);
                delete t[e];
                n--;
            }
            return $;
        },
        destroyAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    P(t[e]);
                }
            }
            t = {};
            n = 0;
            return $;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const o = e;
                for (let l in t) {
                    if (t.hasOwnProperty(l) && e.hasOwnProperty(l) && o[l] !== t[l]) {
                        o[l] = t[l];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(o);
                }
            }
            return $;
        },
        getIds: function() {
            const e = [];
            for (let n in t) {
                if (t.hasOwnProperty(n)) {
                    e.push(n);
                }
            }
            return e;
        },
        getVersion: function() {
            return "3.0.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => o()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = $;
        }
    })();
})();//# sourceMappingURL=jsontree.esm.js.map