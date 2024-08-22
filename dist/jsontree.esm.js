var Is;

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
        function o(e) {
            return e.toString().toLowerCase().trim() === "true" || e.toString().toLowerCase().trim() === "false";
        }
        e.boolean = o;
        function r(e) {
            return !isNaN(+new Date(e));
        }
        e.date = r;
        function l(e) {
            const t = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
            return t.test(e);
        }
        e.guid = l;
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
    function l(e) {
        return n(e) && typeof e === "string";
    }
    e.definedString = l;
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
    function g(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = g;
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
        const r = o[0].split(" ");
        const l = "()";
        if (r.length === 2) {
            n = r[1];
        } else {
            n = r[0];
        }
        n += l;
        if (n.trim() === l) {
            n = `${t.text.functionText}${l}`;
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
})(Default2 || (Default2 = {}));

var DomElement;

(e => {
    function t(e, t, n = "", o = null) {
        const r = t.toLowerCase();
        const l = r === "text";
        let i = l ? document.createTextNode("") : document.createElement(r);
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
    function n(e, n, o, r, l = null) {
        const i = t(e, n, o, l);
        i.innerHTML = r;
        return i;
    }
    e.createWithHTML = n;
    function o(e, t) {
        e.classList.add(t);
    }
    e.addClass = o;
    function r(e, t) {
        e.classList.remove(t);
    }
    e.removeClass = r;
    function l(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    e.cancelBubble = l;
    function i() {
        const e = document.documentElement;
        const t = {
            left: e.scrollLeft - (e.clientLeft || 0),
            top: e.scrollTop - (e.clientTop || 0)
        };
        return t;
    }
    e.getScrollPosition = i;
    function a(e, t) {
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
    e.showElementAtMousePosition = a;
    function s(e) {
        const t = document.createRange();
        t.selectNodeContents(e);
        const n = window.getSelection();
        n.removeAllRanges();
        n.addRange(t);
    }
    e.selectAllText = s;
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
    function o(e, o, r) {
        let l = r;
        const i = t(o);
        l = l.replace("{hh}", Str.padNumber(o.getHours(), 2));
        l = l.replace("{h}", o.getHours().toString());
        l = l.replace("{MM}", Str.padNumber(o.getMinutes(), 2));
        l = l.replace("{M}", o.getMinutes().toString());
        l = l.replace("{ss}", Str.padNumber(o.getSeconds(), 2));
        l = l.replace("{s}", o.getSeconds().toString());
        l = l.replace("{ff}", Str.padNumber(o.getMilliseconds(), 3));
        l = l.replace("{f}", o.getMilliseconds().toString());
        l = l.replace("{dddd}", e.text.dayNames[i]);
        l = l.replace("{ddd}", e.text.dayNamesAbbreviated[i]);
        l = l.replace("{dd}", Str.padNumber(o.getDate()));
        l = l.replace("{d}", o.getDate().toString());
        l = l.replace("{o}", n(e, o.getDate()));
        l = l.replace("{mmmm}", e.text.monthNames[o.getMonth()]);
        l = l.replace("{mmm}", e.text.monthNamesAbbreviated[o.getMonth()]);
        l = l.replace("{mm}", Str.padNumber(o.getMonth() + 1));
        l = l.replace("{m}", (o.getMonth() + 1).toString());
        l = l.replace("{yyyy}", o.getFullYear().toString());
        l = l.replace("{yyy}", o.getFullYear().toString().substring(1));
        l = l.replace("{yy}", o.getFullYear().toString().substring(2));
        l = l.replace("{y}", Number.parseInt(o.getFullYear().toString().substring(2)).toString());
        return l;
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
            t.enableFullScreenToggling = Default2.getBoolean(t.enableFullScreenToggling, true);
            t.valueToolTips = Default2.getObject(t.valueToolTips, {});
            t = r(t);
            t = l(t);
            t = i(t);
            t = a(t);
            t = s(t);
            t = u(t);
            return t;
        }
        t.get = o;
        function r(e) {
            e.title = Default2.getObject(e.title, {});
            e.title.text = Default2.getString(e.title.text, "JsonTree.js");
            e.title.show = Default2.getBoolean(e.title.show, true);
            e.title.showTreeControls = Default2.getBoolean(e.title.showTreeControls, true);
            e.title.showCopyButton = Default2.getBoolean(e.title.showCopyButton, true);
            return e;
        }
        function l(e) {
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
            e.ignore.bigIntValues = Default2.getBoolean(e.ignore.bigIntValues, false);
            e.ignore.symbolValues = Default2.getBoolean(e.ignore.symbolValues, false);
            e.ignore.emptyObjects = Default2.getBoolean(e.ignore.emptyObjects, true);
            e.ignore.undefinedValues = Default2.getBoolean(e.ignore.undefinedValues, false);
            e.ignore.guidValues = Default2.getBoolean(e.ignore.guidValues, false);
            e.ignore.colorValues = Default2.getBoolean(e.ignore.colorValues, false);
            return e;
        }
        function i(e) {
            e.tooltip = Default2.getObject(e.tooltip, {});
            e.tooltip.delay = Default2.getNumber(e.tooltip.delay, 750);
            return e;
        }
        function a(e) {
            e.parse = Default2.getObject(e.parse, {});
            e.parse.stringsToDates = Default2.getBoolean(e.parse.stringsToDates, false);
            e.parse.stringsToBooleans = Default2.getBoolean(e.parse.stringsToBooleans, false);
            e.parse.stringsToNumbers = Default2.getBoolean(e.parse.stringsToNumbers, false);
            return e;
        }
        function s(e) {
            e.allowEditing = Default2.getObject(e.allowEditing, {});
            e.allowEditing.booleanValues = Default2.getBoolean(e.allowEditing.booleanValues, true);
            e.allowEditing.decimalValues = Default2.getBoolean(e.allowEditing.decimalValues, true);
            e.allowEditing.numberValues = Default2.getBoolean(e.allowEditing.numberValues, true);
            e.allowEditing.stringValues = Default2.getBoolean(e.allowEditing.stringValues, true);
            e.allowEditing.dateValues = Default2.getBoolean(e.allowEditing.dateValues, true);
            e.allowEditing.bigIntValues = Default2.getBoolean(e.allowEditing.bigIntValues, true);
            e.allowEditing.guidValues = Default2.getBoolean(e.allowEditing.guidValues, true);
            e.allowEditing.colorValues = Default2.getBoolean(e.allowEditing.colorValues, true);
            return e;
        }
        function u(e) {
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
            e.text.closeAllButtonSymbolText = Default2.getAnyString(e.text.closeAllButtonSymbolText, "↑");
            e.text.openAllButtonSymbolText = Default2.getAnyString(e.text.openAllButtonSymbolText, "↓");
            e.text.copyAllButtonSymbolText = Default2.getAnyString(e.text.copyAllButtonSymbolText, "❐");
            e.text.backButtonText = Default2.getAnyString(e.text.backButtonText, "Back");
            e.text.nextButtonText = Default2.getAnyString(e.text.nextButtonText, "Next");
            e.text.backButtonSymbolText = Default2.getAnyString(e.text.backButtonSymbolText, "←");
            e.text.nextButtonSymbolText = Default2.getAnyString(e.text.nextButtonSymbolText, "→");
            e.text.noJsonToViewText = Default2.getAnyString(e.text.noJsonToViewText, "There is currently no JSON to view.");
            e.text.functionText = Default2.getAnyString(e.text.functionText, "function");
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
        n("mousemove", (() => l(e)));
        o("scroll", (() => l(e)));
    }
    e.assignToEvents = n;
    function o(e, t, n) {
        if (e !== null) {
            e.onmousemove = e => r(e, t, n);
        }
    }
    e.add = o;
    function r(e, t, n) {
        DomElement.cancelBubble(e);
        l(t);
        t._currentView.tooltipTimerId = setTimeout((() => {
            t._currentView.tooltip.innerHTML = n;
            t._currentView.tooltip.style.display = "block";
            DomElement.showElementAtMousePosition(e, t._currentView.tooltip);
        }), t.tooltip.delay);
    }
    e.show = r;
    function l(e) {
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
    e.hide = l;
})(ToolTip || (ToolTip = {}));

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
            const l = o.length;
            for (let e = 0; e < l; e++) {
                if (!r(o[e])) {
                    break;
                }
            }
        }
    }
    function r(t) {
        let n = true;
        if (Is.defined(t) && t.hasAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME)) {
            const o = t.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
            if (Is.definedString(o)) {
                const r = Default2.getObjectFromString(o, e);
                if (r.parsed && Is.definedObject(r.object)) {
                    l(Binding.Options.getForNewInstance(r.object, t));
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
    function l(e) {
        Trigger.customEvent(e.events.onBeforeRender, e._currentView.element);
        ToolTip.renderControl(e);
        if (!Is.definedString(e._currentView.element.id)) {
            e._currentView.element.id = crypto.randomUUID();
            e._currentView.idSet = true;
        }
        e._currentView.element.className = "json-tree-js";
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (e.enableFullScreenToggling && e.openInFullScreenMode) {
            DomElement.addClass(e._currentView.element, "full-screen");
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        p(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let r = t[n._currentView.element.id].data;
        ToolTip.hide(n);
        n._currentView.element.innerHTML = "";
        n._currentView.editMode = false;
        n._currentView.contentPanelsIndex = 0;
        a(n, r);
        const l = DomElement.create(n._currentView.element, "div", "contents");
        if (o) {
            DomElement.addClass(l, "page-switch");
        }
        O(l, n);
        if (n.showArrayItemsAsSeparateObjects && Is.definedArray(r)) {
            r = r[n._currentView.dataArrayCurrentIndex];
        }
        if (Is.definedObject(r) && !Is.definedArray(r)) {
            w(l, n, r);
        } else if (Is.definedArray(r)) {
            y(l, n, r);
        }
        if (l.innerHTML === "") {
            DomElement.createWithHTML(l, "span", "no-json-text", e.text.noJsonToViewText);
            n._currentView.titleBarButtons.style.display = "none";
        } else {
            n._currentView.titleBarButtons.style.display = "block";
        }
    }
    function a(t, n) {
        if (t.title.show || t.title.showTreeControls || t.title.showCopyButton) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.enableFullScreenToggling) {
                o.ondblclick = () => s(t);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (t.title.show) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyAllButtonSymbolText);
                o.onclick = () => u(t, n);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.copyAllButtonText);
            }
            if (t.title.showTreeControls) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "openAll", e.text.openAllButtonSymbolText);
                n.onclick = () => c(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "closeAll", e.text.closeAllButtonSymbolText);
                o.onclick = () => d(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.showArrayItemsAsSeparateObjects && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => f(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex < n.length - 1) {
                    t._currentView.nextButton.onclick = () => g(t);
                } else {
                    t._currentView.nextButton.disabled = true;
                }
            } else {
                if (Is.definedArray(n)) {
                    t.showArrayItemsAsSeparateObjects = false;
                }
            }
        }
    }
    function s(e) {
        if (e._currentView.element.classList.contains("full-screen")) {
            DomElement.removeClass(e._currentView.element, "full-screen");
        } else {
            DomElement.addClass(e._currentView.element, "full-screen");
        }
    }
    function u(e, t) {
        let n = null;
        let o = m;
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
    function c(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function d(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function f(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex--;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function g(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex++;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function m(t, n) {
        if (Is.definedBigInt(n)) {
            n = n.toString();
        } else if (Is.definedSymbol(n)) {
            n = n.toString();
        } else if (Is.definedFunction(n)) {
            n = Default2.getFunctionName(n, e);
        }
        return n;
    }
    function p(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => b(t, e)));
    }
    function b(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id)) {
            if (e.code === "ArrowLeft") {
                e.preventDefault();
                f(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                g(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                d(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                c(o);
            }
        }
    }
    function w(t, n, o) {
        const r = C(o, n);
        const l = r.length;
        if (l !== 0 || !n.ignore.emptyObjects) {
            const i = DomElement.create(t, "div", "object-type-title");
            const a = DomElement.create(t, "div", "object-type-contents object-type-contents-parent");
            const s = n.showArrowToggles ? DomElement.create(i, "div", "down-arrow") : null;
            const u = DomElement.createWithHTML(i, "span", n.showValueColors ? "object main-title" : "main-title", e.text.objectText);
            let c = null;
            if (n.showArrayItemsAsSeparateObjects) {
                let e = n.useZeroIndexingForArrays ? n._currentView.dataArrayCurrentIndex.toString() : (n._currentView.dataArrayCurrentIndex + 1).toString();
                if (n.showArrayIndexBrackets) {
                    e = `[${e}]:`;
                }
                DomElement.createWithHTML(i, "span", n.showValueColors ? `${"object"} data-array-index` : "data-array-index", e, u);
            }
            if (n.showCounts && l > 0) {
                DomElement.createWithHTML(i, "span", n.showValueColors ? `${"object"} count` : "count", `{${l}}`);
            }
            if (n.showOpeningClosingCurlyBraces) {
                c = DomElement.createWithHTML(i, "span", "opening-symbol", "{");
            }
            T(s, null, a, n, o, r, c, false, true, "");
            S(n, u, o, "object");
        }
    }
    function y(t, n, o) {
        const r = DomElement.create(t, "div", "object-type-title");
        const l = DomElement.create(t, "div", "object-type-contents object-type-contents-parent");
        const i = n.showArrowToggles ? DomElement.create(r, "div", "down-arrow") : null;
        const a = DomElement.createWithHTML(r, "span", n.showValueColors ? "array main-title" : "main-title", e.text.arrayText);
        let s = null;
        if (n.showCounts) {
            DomElement.createWithHTML(r, "span", n.showValueColors ? `${"array"} count` : "count", `[${o.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            s = DomElement.createWithHTML(r, "span", "opening-symbol", "[");
        }
        D(i, null, l, n, o, s, false, true, "");
        S(n, a, o, "object");
    }
    function T(e, t, n, o, r, l, i, a, s, u) {
        const c = l.length;
        for (let e = 0; e < c; e++) {
            const t = l[e];
            const i = u === "" ? t : `${u}\\${t}`;
            if (r.hasOwnProperty(t)) {
                v(r, n, o, t, r[t], e === c - 1, false, i);
            }
        }
        if (o.showOpeningClosingCurlyBraces) {
            _(o, n, "}", a, s);
        }
        A(o, e, t, n, i);
    }
    function D(e, t, n, o, r, l, i, a, s) {
        const u = r.length;
        if (!o.reverseArrayValues) {
            for (let e = 0; e < u; e++) {
                const t = s === "" ? e.toString() : `${s}\\${e}`;
                v(r, n, o, I(o, e, u), r[e], e === u - 1, true, t);
            }
        } else {
            for (let e = u; e--; ) {
                const t = s === "" ? e.toString() : `${s}\\${e}`;
                v(r, n, o, I(o, e, u), r[e], e === 0, true, t);
            }
        }
        if (o.showOpeningClosingCurlyBraces) {
            _(o, n, "]", i, a);
        }
        A(o, e, t, n, l);
    }
    function v(t, n, o, r, l, i, a, s) {
        const u = DomElement.create(n, "div", "object-type-value");
        const c = o.showArrowToggles ? DomElement.create(u, "div", "no-arrow") : null;
        let d = null;
        let f = null;
        let g = false;
        let m = null;
        const p = DomElement.createWithHTML(u, "span", "title", r);
        DomElement.createWithHTML(u, "span", "split", ":");
        if (!a) {
            x(o, t, r, p, s);
        }
        if (l === null) {
            if (!o.ignore.nullValues) {
                d = o.showValueColors ? `${"null"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, "null");
                m = "null";
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (l === void 0) {
            if (!o.ignore.undefinedValues) {
                d = o.showValueColors ? `${"undefined"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, "undefined");
                m = "undefined";
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedFunction(l)) {
            if (!o.ignore.functionValues) {
                d = o.showValueColors ? `${"function"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, Default2.getFunctionName(l, e));
                m = "function";
                if (Is.definedFunction(o.events.onFunctionRender)) {
                    Trigger.customEvent(o.events.onFunctionRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedBoolean(l)) {
            if (!o.ignore.booleanValues) {
                d = o.showValueColors ? `${"boolean"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l);
                m = "boolean";
                V(o, t, r, l, f, a, o.allowEditing.booleanValues);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedDecimal(l)) {
            if (!o.ignore.decimalValues) {
                const e = Default2.getFixedDecimalPlacesValue(l, o.maximumDecimalPlaces);
                d = o.showValueColors ? `${"decimal"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, e);
                m = "decimal";
                V(o, t, r, l, f, a, o.allowEditing.decimalValues);
                if (Is.definedFunction(o.events.onDecimalRender)) {
                    Trigger.customEvent(o.events.onDecimalRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedNumber(l)) {
            if (!o.ignore.numberValues) {
                d = o.showValueColors ? `${"number"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l);
                m = "number";
                V(o, t, r, l, f, a, o.allowEditing.numberValues);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedBigInt(l)) {
            if (!o.ignore.bigIntValues) {
                d = o.showValueColors ? `${"bigint"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l);
                m = "bigint";
                V(o, t, r, l, f, a, o.allowEditing.bigIntValues);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(l) && Is.String.guid(l)) {
            if (!o.ignore.guidValues) {
                d = o.showValueColors ? `${"guid"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l);
                m = "guid";
                V(o, t, r, l, f, a, o.allowEditing.guidValues);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(l) && (Is.String.hexColor(l) || Is.String.rgbColor(l))) {
            if (!o.ignore.colorValues) {
                d = o.showValueColors ? `${"color"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l);
                m = "color";
                if (o.showValueColors) {
                    f.style.color = l;
                }
                V(o, t, r, l, f, a, o.allowEditing.colorValues);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedString(l)) {
            if (!o.ignore.stringValues) {
                if (o.parse.stringsToBooleans && Is.String.boolean(l)) {
                    v(t, n, o, r, l.toString().toLowerCase().trim() === "true", i, a, s);
                    g = true;
                } else if (o.parse.stringsToNumbers && !isNaN(l)) {
                    v(t, n, o, r, parseFloat(l), i, a, s);
                    g = true;
                } else if (o.parse.stringsToDates && Is.String.date(l)) {
                    v(t, n, o, r, new Date(l), i, a, s);
                    g = true;
                } else {
                    if (o.maximumStringLength > 0 && l.length > o.maximumStringLength) {
                        l = l.substring(0, o.maximumStringLength) + e.text.ellipsisText;
                    }
                    const n = o.showStringQuotes ? `"${l}"` : l;
                    d = o.showValueColors ? `${"string"} value` : "value";
                    f = DomElement.createWithHTML(u, "span", d, n);
                    m = "string";
                    V(o, t, r, l, f, a, o.allowEditing.stringValues);
                    if (Is.definedFunction(o.events.onStringRender)) {
                        Trigger.customEvent(o.events.onStringRender, f);
                    }
                    B(o, u, i);
                }
            } else {
                g = true;
            }
        } else if (Is.definedDate(l)) {
            if (!o.ignore.dateValues) {
                d = o.showValueColors ? `${"date"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, DateTime.getCustomFormattedDateText(e, l, o.dateTimeFormat));
                m = "date";
                V(o, t, r, l, f, a, o.allowEditing.dateValues);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedSymbol(l)) {
            if (!o.ignore.symbolValues) {
                d = o.showValueColors ? `${"symbol"} value` : "value";
                f = DomElement.createWithHTML(u, "span", d, l.toString());
                m = "symbol";
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        } else if (Is.definedObject(l) && !Is.definedArray(l)) {
            if (!o.ignore.objectValues) {
                const t = C(l, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    g = true;
                } else {
                    const r = DomElement.create(u, "span", o.showValueColors ? "object" : "");
                    const a = DomElement.create(u, "div", "object-type-contents");
                    let d = null;
                    f = DomElement.createWithHTML(r, "span", "main-title", e.text.objectText);
                    if (o.showCounts && n > 0) {
                        DomElement.createWithHTML(r, "span", "count", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        d = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    let g = B(o, r, i);
                    T(c, g, a, o, l, t, d, true, i, s);
                    m = "object";
                }
            } else {
                g = true;
            }
        } else if (Is.definedArray(l)) {
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(u, "span", o.showValueColors ? "array" : "");
                const n = DomElement.create(u, "div", "object-type-contents");
                let r = null;
                f = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                if (o.showCounts) {
                    DomElement.createWithHTML(t, "span", "count", `[${l.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    r = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                let a = B(o, t, i);
                D(c, a, n, o, l, r, true, i, s);
                m = "array";
            } else {
                g = true;
            }
        } else {
            if (!o.ignore.unknownValues) {
                d = o.showValueColors ? `${"unknown"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(u, "span", d, l.toString());
                m = "unknown";
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, f);
                }
                B(o, u, i);
            } else {
                g = true;
            }
        }
        if (g) {
            n.removeChild(u);
        } else {
            if (Is.defined(f)) {
                h(o, s, f);
                S(o, f, l, m);
            }
        }
    }
    function h(e, t, n) {
        if (e.valueToolTips.hasOwnProperty(t)) {
            ToolTip.add(n, e, e.valueToolTips[t]);
        }
    }
    function x(e, t, n, o, r) {
        if (e.allowEditing) {
            o.ondblclick = () => {
                clearTimeout(e._currentView.valueClickTimerId);
                e._currentView.valueClickTimerId = 0;
                e._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                o.setAttribute("contenteditable", "true");
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => i(e, false);
                o.onkeydown = l => {
                    if (l.code == "Escape") {
                        l.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (l.code == "Enter") {
                        l.preventDefault();
                        const i = o.innerText;
                        if (i.trim() === "") {
                            delete t[n];
                        } else {
                            if (!t.hasOwnProperty(i)) {
                                const o = t[n];
                                delete t[n];
                                t[i] = o;
                                if (e.valueToolTips.hasOwnProperty(r)) {
                                    let t = r.substring(0, r.length - n.length);
                                    t += i;
                                    const o = e.valueToolTips[r];
                                    delete e.valueToolTips[r];
                                    e.valueToolTips[t] = o;
                                }
                            }
                        }
                        o.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function V(e, t, n, o, r, l, a) {
        if (a) {
            r.ondblclick = () => {
                clearTimeout(e._currentView.valueClickTimerId);
                e._currentView.valueClickTimerId = 0;
                e._currentView.editMode = true;
                DomElement.addClass(r, "editable");
                r.setAttribute("contenteditable", "true");
                if (Is.definedDate(o) && !e.includeTimeZoneInDateTimeEditing) {
                    r.innerText = JSON.stringify(o).replace(/['"]+/g, "");
                } else {
                    r.innerText = o.toString();
                }
                r.focus();
                DomElement.selectAllText(r);
                r.onblur = () => i(e, false);
                r.onkeydown = e => {
                    if (e.code == "Escape") {
                        e.preventDefault();
                        r.setAttribute("contenteditable", "false");
                    } else if (e.code == "Enter") {
                        e.preventDefault();
                        const i = r.innerText;
                        if (i.trim() === "") {
                            if (l) {
                                t.splice(E(n), 1);
                            } else {
                                delete t[n];
                            }
                        } else {
                            let e = null;
                            if (Is.definedBoolean(o)) {
                                e = i.toLowerCase() === "true";
                            } else if (Is.definedDecimal(o) && !isNaN(+i)) {
                                e = parseFloat(i);
                            } else if (Is.definedNumber(o) && !isNaN(+i)) {
                                e = parseInt(i);
                            } else if (Is.definedString(o)) {
                                e = i;
                            } else if (Is.definedDate(o)) {
                                e = new Date(i);
                            } else if (Is.definedBigInt(o)) {
                                e = BigInt(i);
                            }
                            if (e !== null) {
                                if (l) {
                                    t[E(n)] = e;
                                } else {
                                    t[n] = e;
                                }
                            }
                        }
                        r.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function E(e) {
        return parseInt(e.replace("[", "").replace("]", ""));
    }
    function S(e, t, n, o) {
        if (Is.definedFunction(e.events.onValueClick)) {
            t.onclick = () => {
                if (e.allowEditing) {
                    e._currentView.valueClickTimerId = setTimeout((() => {
                        if (!e._currentView.editMode) {
                            Trigger.customEvent(e.events.onValueClick, n, o);
                        }
                    }), 500);
                } else {
                    Trigger.customEvent(e.events.onValueClick, n, o);
                }
            };
        } else {
            DomElement.addClass(t, "no-hover");
        }
    }
    function A(e, t, n, o, r) {
        if (Is.defined(t)) {
            const l = e._currentView.contentPanelsIndex;
            const i = e._currentView.dataArrayCurrentIndex;
            if (!e._currentView.contentPanelsOpen.hasOwnProperty(i)) {
                e._currentView.contentPanelsOpen[i] = {};
            }
            const a = () => {
                o.style.display = "none";
                t.className = "right-arrow";
                e._currentView.contentPanelsOpen[i][l] = true;
                if (Is.defined(r)) {
                    r.style.display = "none";
                }
                if (Is.defined(n)) {
                    n.style.display = "inline-block";
                }
            };
            const s = () => {
                o.style.display = "block";
                t.className = "down-arrow";
                e._currentView.contentPanelsOpen[i][l] = false;
                if (Is.defined(r)) {
                    r.style.display = "inline-block";
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
            if (e._currentView.contentPanelsOpen[i].hasOwnProperty(l)) {
                c = e._currentView.contentPanelsOpen[i][l];
            } else {
                e._currentView.contentPanelsOpen[i][l] = c;
            }
            t.onclick = () => u(t.className === "down-arrow");
            u(c);
            e._currentView.contentPanelsIndex++;
        }
    }
    function B(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function I(e, t, n) {
        let o = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
        if (!e.addArrayIndexPadding) {
            o = Str.padNumber(parseInt(o), n.toString().length);
        }
        if (e.showArrayIndexBrackets) {
            o = `[${o}]`;
        }
        return o;
    }
    function C(e, t) {
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
    function _(e, t, n, o, r) {
        let l = DomElement.create(t, "div", "closing-symbol");
        if (o) {
            DomElement.create(l, "div", "no-arrow");
        }
        DomElement.createWithHTML(l, "div", "object-type-end", n);
        B(e, l, r);
    }
    function O(e, t) {
        if (t.fileDroppingEnabled) {
            e.ondragover = DomElement.cancelBubble;
            e.ondragenter = DomElement.cancelBubble;
            e.ondragleave = DomElement.cancelBubble;
            e.ondrop = e => {
                DomElement.cancelBubble(e);
                if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
                    N(e.dataTransfer.files, t);
                }
            };
        }
    }
    function N(e, t) {
        const n = e.length;
        for (let o = 0; o < n; o++) {
            const n = e[o];
            const r = n.name.split(".").pop().toLowerCase();
            if (r === "json") {
                j(n, t);
            }
        }
    }
    function j(t, n) {
        const o = new FileReader;
        let r = null;
        o.onloadend = () => {
            n._currentView.dataArrayCurrentIndex = 0;
            n._currentView.contentPanelsOpen = {};
            n.data = r;
            i(n);
            Trigger.customEvent(n.events.onSetJson, n._currentView.element);
        };
        o.onload = t => {
            const n = Default2.getObjectFromString(t.target.result, e);
            if (n.parsed && Is.definedObject(n.object)) {
                r = n.object;
            }
        };
        o.readAsText(t);
    }
    function F(e) {
        e._currentView.element.innerHTML = "";
        DomElement.removeClass(e._currentView.element, "json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        p(e, false);
        ToolTip.assignToEvents(e, false);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const R = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return R;
        },
        refreshAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return R;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                l(Binding.Options.getForNewInstance(t, e));
            }
            return R;
        },
        renderAll: function() {
            o();
            return R;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                c(t[e]);
            }
            return R;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                d(t[e]);
            }
            return R;
        },
        setJson: function(n, o) {
            if (Is.definedString(n) && Is.defined(o) && t.hasOwnProperty(n)) {
                let r = null;
                if (Is.definedString(o)) {
                    const t = Default2.getObjectFromString(o, e);
                    if (t.parsed) {
                        r = t.object;
                    }
                } else {
                    r = o;
                }
                const l = t[n];
                l._currentView.dataArrayCurrentIndex = 0;
                l._currentView.contentPanelsOpen = {};
                l.data = r;
                i(l);
                Trigger.customEvent(l.events.onSetJson, l._currentView.element);
            }
            return R;
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
                F(t[e]);
                delete t[e];
                n--;
            }
            return R;
        },
        destroyAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    F(t[e]);
                }
            }
            t = {};
            n = 0;
            return R;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const o = e;
                for (let r in t) {
                    if (t.hasOwnProperty(r) && e.hasOwnProperty(r) && o[r] !== t[r]) {
                        o[r] = t[r];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(o);
                }
            }
            return R;
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
            return "2.8.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => o()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = R;
        }
    })();
})();//# sourceMappingURL=jsontree.esm.js.map