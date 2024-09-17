"use strict";

var DataType = (e => {
    e["null"] = "null";
    e["function"] = "function";
    e["boolean"] = "boolean";
    e["float"] = "float";
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
    e["url"] = "url";
    e["image"] = "image";
    e["email"] = "email";
    e["html"] = "html";
    e["lambda"] = "lambda";
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
            const t = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
            return e.match(t);
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
    e.definedFloat = d;
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
    function x(e) {
        return n(e) && e instanceof Image;
    }
    e.definedImage = x;
    function T(e) {
        return n(e) && e instanceof HTMLElement;
    }
    e.definedHtmlElement = T;
    function b(e) {
        let t;
        try {
            t = new URL(e);
        } catch {
            t = null;
        }
        return t !== null && (t.protocol === "http:" || t.protocol === "https:");
    }
    e.definedUrl = b;
    function w(e) {
        const t = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e);
    }
    e.definedEmail = w;
    function y(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = y;
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
    function getNumberMinimum(e, t, n) {
        return Is.definedNumber(e) ? e >= n ? e : n : t;
    }
    Default.getNumberMinimum = getNumberMinimum;
    function getNumberMaximum(e, t, n) {
        return Is.definedNumber(e) ? e > n ? n : e : t;
    }
    Default.getNumberMaximum = getNumberMaximum;
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
    function getFixedFloatPlacesValue(e, t) {
        const n = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
        return e.toString().match(n)?.[0] || "";
    }
    Default.getFixedFloatPlacesValue = getFixedFloatPlacesValue;
    function getFunctionName(e, t) {
        let n;
        let o = false;
        const l = e.toString().split("(");
        const r = l[0].split(" ");
        const i = "()";
        n = `${r.join(" ")}${i}`;
        if (n.trim() === i) {
            n = `${t.text.functionText}${i}`;
            o = true;
        }
        return {
            name: n,
            isLambda: o
        };
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
    function getObjectFromUrl(e, t, n) {
        const o = new XMLHttpRequest;
        o.open("GET", e, true);
        o.send();
        o.onreadystatechange = () => {
            if (o.readyState === 4 && o.status === 200) {
                const e = o.responseText;
                const l = Default.getObjectFromString(e, t);
                if (l.parsed) {
                    n(l.object);
                }
            } else {
                n(null);
            }
        };
    }
    Default.getObjectFromUrl = getObjectFromUrl;
    function getHtmlElementAsObject(e) {
        const t = {};
        const n = e.attributes.length;
        const o = e.children.length;
        t["children"] = [];
        for (let o = 0; o < n; o++) {
            const n = e.attributes[o];
            if (Is.definedString(n.nodeName)) {
                t[n.nodeName] = n.nodeValue;
            }
        }
        for (let n = 0; n < o; n++) {
            t["children"].push(e.children[n]);
        }
        if (t["children"].length === 0) {
            delete t["children"];
        }
        return t;
    }
    Default.getHtmlElementAsObject = getHtmlElementAsObject;
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
    function t(e, t = 1, n = "0") {
        const o = e.toString();
        let l = o;
        if (o.length < t) {
            const e = t - o.length + 1;
            l = `${Array(e).join(n)}${o}`;
        }
        return l;
    }
    e.padNumber = t;
    function n(e) {
        return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
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
    e.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME = "data-jsontree-js-array-index";
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
            o._currentView.dataArrayCurrentIndex = (o.paging.startPage - 1) * o.paging.columnsPerPage;
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
            o._currentView.initialized = false;
            o._currentView.contentColumns = [];
            o._currentView.footer = null;
            o._currentView.footerStatusText = null;
            o._currentView.footerSizeText = null;
            o._currentView.footerPageText = null;
            o._currentView.footerStatusTextTimerId = 0;
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
            t.showObjectSizes = Default2.getBoolean(t.showObjectSizes, true);
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
            t.fileDroppingEnabled = Default2.getBoolean(t.fileDroppingEnabled, true);
            t.jsonIndentSpaces = Default2.getNumber(t.jsonIndentSpaces, 8);
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
            t.exportFilenameFormat = Default2.getString(t.exportFilenameFormat, "JsonTree_{dd}-{mm}-{yyyy}_{hh}-{MM}-{ss}.json");
            t.showPropertyNameQuotes = Default2.getBoolean(t.showPropertyNameQuotes, true);
            t.showOpenedObjectArrayBorders = Default2.getBoolean(t.showOpenedObjectArrayBorders, true);
            t.showPropertyNameAndIndexColors = Default2.getBoolean(t.showPropertyNameAndIndexColors, true);
            t.showUrlOpenButtons = Default2.getBoolean(t.showUrlOpenButtons, true);
            t.showEmailOpenButtons = Default2.getBoolean(t.showEmailOpenButtons, true);
            t.minimumArrayIndexPadding = Default2.getNumber(t.minimumArrayIndexPadding, 0);
            t.arrayIndexPaddingCharacter = Default2.getString(t.arrayIndexPaddingCharacter, "0");
            t.showHtmlValuesAsObjects = Default2.getBoolean(t.showHtmlValuesAsObjects, false);
            t.maximumUrlLength = Default2.getNumber(t.maximumUrlLength, 0);
            t.maximumEmailLength = Default2.getNumber(t.maximumEmailLength, 0);
            t = l(t);
            t = r(t);
            t = i(t);
            t = a(t);
            t = s(t);
            t = u(t);
            t = c(t, Is.definedObject(t.valueToolTips));
            t = d(t);
            t = f(t);
            t = g(t);
            return t;
        }
        t.get = o;
        function l(e) {
            e.paging = Default2.getObject(e.paging, {});
            e.paging.enabled = Default2.getBoolean(e.paging.enabled, false);
            e.paging.columnsPerPage = Default2.getNumberMaximum(e.paging.columnsPerPage, 1, 6);
            e.paging.copyOnlyCurrentPage = Default2.getBoolean(e.paging.copyOnlyCurrentPage, false);
            e.paging.startPage = Default2.getNumberMinimum(e.paging.startPage, 1, 1);
            e.paging.synchronizedScrolling = Default2.getBoolean(e.paging.synchronizedScrolling, false);
            return e;
        }
        function r(e) {
            e.title = Default2.getObject(e.title, {});
            e.title.text = Default2.getAnyString(e.title.text, "JsonTree.js");
            e.title.showTreeControls = Default2.getBoolean(e.title.showTreeControls, true);
            e.title.showCopyButton = Default2.getBoolean(e.title.showCopyButton, true);
            e.title.enableFullScreenToggling = Default2.getBoolean(e.title.enableFullScreenToggling, true);
            e.title.showFullScreenButton = Default2.getBoolean(e.title.showFullScreenButton, true);
            return e;
        }
        function i(e) {
            e.footer = Default2.getObject(e.footer, {});
            e.footer.enabled = Default2.getBoolean(e.footer.enabled, true);
            return e;
        }
        function a(e) {
            e.ignore = Default2.getObject(e.ignore, {});
            e.ignore.nullValues = Default2.getBoolean(e.ignore.nullValues, false);
            e.ignore.functionValues = Default2.getBoolean(e.ignore.functionValues, false);
            e.ignore.unknownValues = Default2.getBoolean(e.ignore.unknownValues, false);
            e.ignore.booleanValues = Default2.getBoolean(e.ignore.booleanValues, false);
            e.ignore.floatValues = Default2.getBoolean(e.ignore.floatValues, false);
            e.ignore.numberValues = Default2.getBoolean(e.ignore.numberValues, false);
            e.ignore.stringValues = Default2.getBoolean(e.ignore.stringValues, false);
            e.ignore.dateValues = Default2.getBoolean(e.ignore.dateValues, false);
            e.ignore.objectValues = Default2.getBoolean(e.ignore.objectValues, false);
            e.ignore.arrayValues = Default2.getBoolean(e.ignore.arrayValues, false);
            e.ignore.bigintValues = Default2.getBoolean(e.ignore.bigintValues, false);
            e.ignore.symbolValues = Default2.getBoolean(e.ignore.symbolValues, false);
            e.ignore.emptyObjects = Default2.getBoolean(e.ignore.emptyObjects, false);
            e.ignore.undefinedValues = Default2.getBoolean(e.ignore.undefinedValues, false);
            e.ignore.guidValues = Default2.getBoolean(e.ignore.guidValues, false);
            e.ignore.colorValues = Default2.getBoolean(e.ignore.colorValues, false);
            e.ignore.regexpValues = Default2.getBoolean(e.ignore.regexpValues, false);
            e.ignore.mapValues = Default2.getBoolean(e.ignore.mapValues, false);
            e.ignore.setValues = Default2.getBoolean(e.ignore.setValues, false);
            e.ignore.urlValues = Default2.getBoolean(e.ignore.urlValues, false);
            e.ignore.imageValues = Default2.getBoolean(e.ignore.imageValues, false);
            e.ignore.emailValues = Default2.getBoolean(e.ignore.emailValues, false);
            e.ignore.htmlValues = Default2.getBoolean(e.ignore.htmlValues, false);
            e.ignore.lambdaValues = Default2.getBoolean(e.ignore.lambdaValues, false);
            return e;
        }
        function s(e) {
            e.tooltip = Default2.getObject(e.tooltip, {});
            e.tooltip.delay = Default2.getNumber(e.tooltip.delay, 750);
            e.tooltip.offset = Default2.getNumber(e.tooltip.offset, 0);
            return e;
        }
        function u(e) {
            e.parse = Default2.getObject(e.parse, {});
            e.parse.stringsToDates = Default2.getBoolean(e.parse.stringsToDates, false);
            e.parse.stringsToBooleans = Default2.getBoolean(e.parse.stringsToBooleans, false);
            e.parse.stringsToNumbers = Default2.getBoolean(e.parse.stringsToNumbers, false);
            return e;
        }
        function c(e, t) {
            let n = Default2.getBoolean(e.allowEditing, true);
            e.allowEditing = Default2.getObject(e.allowEditing, {});
            e.allowEditing.booleanValues = Default2.getBoolean(e.allowEditing.booleanValues, n);
            e.allowEditing.floatValues = Default2.getBoolean(e.allowEditing.floatValues, n);
            e.allowEditing.numberValues = Default2.getBoolean(e.allowEditing.numberValues, n);
            e.allowEditing.stringValues = Default2.getBoolean(e.allowEditing.stringValues, n);
            e.allowEditing.dateValues = Default2.getBoolean(e.allowEditing.dateValues, n);
            e.allowEditing.bigIntValues = Default2.getBoolean(e.allowEditing.bigIntValues, n);
            e.allowEditing.guidValues = Default2.getBoolean(e.allowEditing.guidValues, n);
            e.allowEditing.colorValues = Default2.getBoolean(e.allowEditing.colorValues, n);
            e.allowEditing.urlValues = Default2.getBoolean(e.allowEditing.urlValues, n);
            e.allowEditing.emailValues = Default2.getBoolean(e.allowEditing.emailValues, n);
            e.allowEditing.propertyNames = Default2.getBoolean(e.allowEditing.propertyNames, n);
            e.allowEditing.bulk = Default2.getBoolean(e.allowEditing.bulk, n);
            if (t) {
                e.allowEditing.propertyNames = false;
            }
            return e;
        }
        function d(e) {
            e.sideMenu = Default2.getObject(e.sideMenu, {});
            e.sideMenu.enabled = Default2.getBoolean(e.sideMenu.enabled, true);
            e.sideMenu.showImportButton = Default2.getBoolean(e.sideMenu.showImportButton, true);
            e.sideMenu.showExportButton = Default2.getBoolean(e.sideMenu.showExportButton, true);
            e.sideMenu.titleText = Default2.getAnyString(e.sideMenu.titleText, "JsonTree.js");
            return e;
        }
        function f(e) {
            e.autoClose = Default2.getObject(e.autoClose, {});
            e.autoClose.objectSize = Default2.getNumber(e.autoClose.objectSize, 0);
            e.autoClose.arraySize = Default2.getNumber(e.autoClose.arraySize, 0);
            e.autoClose.mapSize = Default2.getNumber(e.autoClose.mapSize, 0);
            e.autoClose.setSize = Default2.getNumber(e.autoClose.setSize, 0);
            return e;
        }
        function g(e) {
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
            e.events.onFloatRender = Default2.getFunction(e.events.onFloatRender, null);
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
            e.events.onExport = Default2.getFunction(e.events.onExport, null);
            e.events.onUrlRender = Default2.getFunction(e.events.onUrlRender, null);
            e.events.onImageRender = Default2.getFunction(e.events.onImageRender, null);
            e.events.onEmailRender = Default2.getFunction(e.events.onEmailRender, null);
            e.events.onHtmlRender = Default2.getFunction(e.events.onHtmlRender, null);
            e.events.onLambdaRender = Default2.getFunction(e.events.onLambdaRender, null);
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
            e.text.htmlText = Default2.getAnyString(e.text.htmlText, "html");
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
            e.text.importButtonSymbolText = Default2.getAnyString(e.text.importButtonSymbolText, "↑");
            e.text.importButtonText = Default2.getAnyString(e.text.importButtonText, "Import");
            e.text.fullScreenOnButtonSymbolText = Default2.getAnyString(e.text.fullScreenOnButtonSymbolText, "↗");
            e.text.fullScreenOffButtonSymbolText = Default2.getAnyString(e.text.fullScreenOffButtonSymbolText, "↙");
            e.text.fullScreenButtonText = Default2.getAnyString(e.text.fullScreenButtonText, "Toggle Full-Screen");
            e.text.copyButtonText = Default2.getAnyString(e.text.copyButtonText, "Copy");
            e.text.dragAndDropSymbolText = Default2.getAnyString(e.text.dragAndDropSymbolText, "⇪");
            e.text.dragAndDropTitleText = Default2.getAnyString(e.text.dragAndDropTitleText, "Drag and drop your JSON files to upload");
            e.text.dragAndDropDescriptionText = Default2.getAnyString(e.text.dragAndDropDescriptionText, "Multiple files will be joined as an array");
            e.text.exportButtonSymbolText = Default2.getAnyString(e.text.exportButtonSymbolText, "↓");
            e.text.exportButtonText = Default2.getAnyString(e.text.exportButtonText, "Export");
            e.text.propertyColonCharacter = Default2.getAnyString(e.text.propertyColonCharacter, ":");
            e.text.noPropertiesText = Default2.getAnyString(e.text.noPropertiesText, "There are no properties to view.");
            e.text.openText = Default2.getAnyString(e.text.openText, "open");
            e.text.openSymbolText = Default2.getAnyString(e.text.openSymbolText, "⤤");
            e.text.waitingText = Default2.getAnyString(e.text.waitingText, "Waiting...");
            e.text.pageOfText = Default2.getAnyString(e.text.pageOfText, "Page {0} of {1}");
            e.text.sizeText = Default2.getAnyString(e.text.sizeText, "Size: {0}");
            e.text.copiedText = Default2.getAnyString(e.text.copiedText, "JSON copied!");
            e.text.exportedText = Default2.getAnyString(e.text.exportedText, "JSON exported!");
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
        if (e.addArrayIndexPadding) {
            let t = n.toString().length;
            if (t < e.minimumArrayIndexPadding + 1) {
                t = e.minimumArrayIndexPadding + 1;
            }
            o = Str.padNumber(parseInt(o), t, e.arrayIndexPaddingCharacter);
        }
        if (e.showArrayIndexBrackets) {
            o = `[${o}]`;
        }
        return o;
    }
    e.getIndexName = n;
    function o(e) {
        return parseInt(e.replace(/^\D+/g, ""));
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

var Size;

(e => {
    function t(e) {
        let t = null;
        const o = n(e);
        if (o > 0) {
            const e = Math.floor(Math.log(o) / Math.log(1024));
            return `${Default2.getFixedFloatPlacesValue(o / Math.pow(1024, e), 2)} ${" KMGTP".charAt(e)}B`;
        }
        return t;
    }
    e.of = t;
    function n(e) {
        let t = 0;
        if (Is.defined(e)) {
            if (Is.definedNumber(e)) {
                t = 8;
            } else if (Is.definedString(e)) {
                t = e.length * 2;
            } else if (Is.definedBoolean(e)) {
                t = 4;
            } else if (Is.definedBigInt(e)) {
                t = n(e.toString());
            } else if (Is.definedRegExp(e)) {
                t = n(e.toString());
            } else if (Is.definedDate(e)) {
                t = n(e.toString());
            } else if (Is.definedSet(e)) {
                t = n(Default2.getArrayFromSet(e));
            } else if (Is.definedMap(e)) {
                t = n(Default2.getObjectFromMap(e));
            } else if (Is.definedArray(e)) {
                const o = e.length;
                for (let l = 0; l < o; l++) {
                    t += n(e[l]);
                }
            } else if (Is.definedObject(e)) {
                for (let o in e) {
                    if (e.hasOwnProperty(o)) {
                        t += n(o) + n(e[o]);
                    }
                }
            }
        }
        return t;
    }
})(Size || (Size = {}));

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
        if (e.openInFullScreenMode) {
            DomElement.addClass(e._currentView.element, "full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        X(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let l = t[n._currentView.element.id].data;
        if (Is.definedUrl(l)) {
            Default2.getObjectFromUrl(l, e, (e => {
                a(n, o, e);
            }));
        } else {
            a(n, o, l);
        }
    }
    function a(e, t, n) {
        const o = c(e);
        ToolTip.hide(e);
        e._currentView.element.innerHTML = "";
        e._currentView.editMode = false;
        e._currentView.contentPanelsIndex = 0;
        e._currentView.sideMenuChanged = false;
        e._currentView.contentColumns = [];
        f(e, n);
        y(e);
        const l = DomElement.create(e._currentView.element, "div", "contents");
        if (t) {
            DomElement.addClass(l, "page-switch");
        }
        if (e.paging.enabled && Is.definedArray(n)) {
            for (let t = 0; t < e.paging.columnsPerPage; t++) {
                const r = t + e._currentView.dataArrayCurrentIndex;
                const i = n[r];
                if (Is.defined(i)) {
                    s(i, l, e, r, o[t], e.paging.columnsPerPage);
                }
            }
        } else {
            s(n, l, e, null, o[0], 1);
        }
        B(e);
        U(e);
        e._currentView.initialized = true;
    }
    function s(t, n, o, l, r, i) {
        const a = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        a.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, l.toString());
        o._currentView.contentColumns.push(a);
        if (o.paging.synchronizedScrolling) {
            a.onscroll = () => d(a, o);
        }
        if (Is.definedArray(t) || Is.definedSet(t)) {
            M(a, o, t);
        } else if (Is.definedObject(t)) {
            O(a, o, t, l);
        }
        if (a.innerHTML === "" || a.children.length >= 2 && (!o.showOpenedObjectArrayBorders && a.children[1].children.length === 0 || a.children[1].children.length === 1)) {
            a.innerHTML = "";
            DomElement.createWithHTML(a, "span", "no-json-text", e.text.noJsonToViewText);
            o._currentView.titleBarButtons.style.display = "none";
        } else {
            if (Is.defined(r)) {
                a.scrollTop = r;
            }
            o._currentView.titleBarButtons.style.display = "block";
        }
        u(o, t, a, l);
    }
    function u(t, n, o, l) {
        if (t._currentView.isBulkEditingEnabled) {
            o.ondblclick = r => {
                DomElement.cancelBubble(r);
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                o.setAttribute("contenteditable", "true");
                o.innerText = JSON.stringify(n, w, t.jsonIndentSpaces);
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => i(t, false);
                o.onkeydown = n => {
                    if (n.code == "Escape") {
                        n.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (ee(n) && n.code == "Enter") {
                        n.preventDefault();
                        const r = o.innerText;
                        const i = Default2.getObjectFromString(r, e);
                        if (i.parsed) {
                            if (t.paging.enabled) {
                                t.data[l] = i.object;
                            } else {
                                t.data = i.object;
                            }
                        }
                        o.setAttribute("contenteditable", "false");
                    } else if (n.code == "Enter") {
                        n.preventDefault();
                        document.execCommand("insertLineBreak");
                    }
                };
            };
        }
    }
    function c(e) {
        const t = [];
        ToolTip.hide(e);
        if (e._currentView.editMode || e._currentView.sideMenuChanged) {
            const n = e._currentView.contentColumns.length;
            for (let o = 0; o < n; o++) {
                t.push(e._currentView.contentColumns[o].scrollTop);
            }
        }
        return t;
    }
    function d(e, t) {
        const n = e.scrollTop;
        const o = e.scrollLeft;
        const l = t._currentView.contentColumns.length;
        for (let e = 0; e < l; e++) {
            t._currentView.contentColumns[e].scrollTop = n;
            t._currentView.contentColumns[e].scrollLeft = o;
        }
    }
    function f(t, n) {
        if (Is.definedString(t.title.text) || t.title.showTreeControls || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => g(t);
            }
            if (t.sideMenu.enabled && Is.definedObject(n)) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => h(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyAllButtonSymbolText);
                o.onclick = () => m(t, n);
                o.ondblclick = DomElement.cancelBubble;
                if (t.paging.copyOnlyCurrentPage && t.paging.enabled) {
                    ToolTip.add(o, t, e.text.copyButtonText);
                } else {
                    ToolTip.add(o, t, e.text.copyAllButtonText);
                }
            }
            if (t.title.showTreeControls) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "openAll", e.text.openAllButtonSymbolText);
                n.onclick = () => p(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "closeAll", e.text.closeAllButtonSymbolText);
                o.onclick = () => x(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.paging.enabled && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => T(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
                    t._currentView.nextButton.onclick = () => b(t);
                } else {
                    t._currentView.nextButton.disabled = true;
                }
            } else {
                if (Is.definedArray(n)) {
                    t.paging.enabled = false;
                }
            }
            if (t.title.enableFullScreenToggling && t.title.showFullScreenButton) {
                const n = !t._currentView.fullScreenOn ? e.text.fullScreenOnButtonSymbolText : e.text.fullScreenOffButtonSymbolText;
                t._currentView.toggleFullScreenButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "toggle-full-screen", n);
                t._currentView.toggleFullScreenButton.onclick = () => g(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function g(t) {
        if (t.title.enableFullScreenToggling) {
            if (t._currentView.element.classList.contains("full-screen")) {
                DomElement.removeClass(t._currentView.element, "full-screen");
                t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOnButtonSymbolText;
                t._currentView.fullScreenOn = false;
            } else {
                DomElement.addClass(t._currentView.element, "full-screen");
                t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOffButtonSymbolText;
                t._currentView.fullScreenOn = true;
            }
            ToolTip.hide(t);
            I(t);
        }
    }
    function m(t, n) {
        let o = null;
        let l = w;
        if (Is.definedFunction(t.events.onCopyJsonReplacer)) {
            l = t.events.onCopyJsonReplacer;
        }
        if (t.paging.copyOnlyCurrentPage && t.paging.enabled) {
            let e = null;
            if (t.paging.columnsPerPage <= 1) {
                e = n[t._currentView.dataArrayCurrentIndex];
            } else {
                e = [];
                for (let o = 0; o < t.paging.columnsPerPage; o++) {
                    const l = o + t._currentView.dataArrayCurrentIndex;
                    const r = n[l];
                    if (Is.defined(r)) {
                        e.push(r);
                    }
                }
            }
            o = JSON.stringify(e, l, t.jsonIndentSpaces);
        } else {
            o = JSON.stringify(n, l, t.jsonIndentSpaces);
        }
        navigator.clipboard.writeText(o);
        _(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, o);
    }
    function p(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function x(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function T(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex -= e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function b(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex += e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function w(t, n) {
        if (Is.definedBigInt(n)) {
            n = n.toString();
        } else if (Is.definedSymbol(n)) {
            n = n.toString();
        } else if (Is.definedFunction(n)) {
            n = Default2.getFunctionName(n, e).name;
        } else if (Is.definedMap(n)) {
            n = Default2.getObjectFromMap(n);
        } else if (Is.definedSet(n)) {
            n = Default2.getArrayFromSet(n);
        } else if (Is.definedRegExp(n)) {
            n = n.source;
        } else if (Is.definedImage(n)) {
            n = n.src;
        }
        return n;
    }
    function y(t) {
        if (t.sideMenu.enabled) {
            t._currentView.disabledBackground = DomElement.create(t._currentView.element, "div", "side-menu-disabled-background");
            t._currentView.disabledBackground.onclick = () => S(t);
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showExportButton) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => K(t);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => D(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const l = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            l.onclick = () => S(t);
            ToolTip.add(l, t, e.text.closeButtonText);
            const r = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
            V(r, t);
        }
    }
    function D(e) {
        const t = DomElement.createWithNoContainer("input");
        t.type = "file";
        t.accept = ".json";
        t.multiple = true;
        t.onchange = () => Y(t.files, e);
        t.click();
    }
    function h(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
        }
    }
    function S(e) {
        if (e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.remove("side-menu-open");
            e._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(e);
            if (e._currentView.sideMenuChanged) {
                i(e);
            }
        }
    }
    function V(t, n) {
        const o = [];
        const l = DomElement.create(t, "div", "settings-panel");
        const r = DomElement.create(l, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(r, "div", "settings-panel-title-text", `${e.text.showTypesText}:`);
        const i = DomElement.create(r, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => v(n, o, true);
        s.onclick = () => v(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(l, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            o.push(E(u, e, n, !d[`${e}Values`]));
        }));
    }
    function v(e, t, n) {
        const o = t.length;
        const l = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            l[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function E(e, t, n, o) {
        const l = DomElement.createCheckBox(e, Str.capitalizeFirstLetter(t), t, o, n.showValueColors ? t : "");
        l.onchange = () => {
            const e = n.ignore;
            e[`${t}Values`] = !l.checked;
            n.ignore = e;
            n._currentView.sideMenuChanged = true;
        };
        return l;
    }
    function B(t) {
        if (t.footer.enabled) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            I(t);
            t._currentView.footerStatusText = DomElement.createWithHTML(t._currentView.footer, "div", "status-text", e.text.waitingText);
            t._currentView.footerSizeText = DomElement.create(t._currentView.footer, "div", "status-value-size");
            if (t.paging.enabled) {
                t._currentView.footerPageText = DomElement.create(t._currentView.footer, "div", "status-page-index");
                A(t);
            }
        }
    }
    function A(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.dataArrayCurrentIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const l = e.text.pageOfText.replace("{0}", n.toString()).replace("{1}", o.toString());
            t._currentView.footerPageText.innerHTML = l;
        }
    }
    function I(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function C(t, n, o) {
        if (t.footer.enabled) {
            const l = Size.of(n);
            if (Is.definedString(l)) {
                o.onmouseover = () => t._currentView.footerSizeText.innerHTML = e.text.sizeText.replace("{0}", l.toString());
                o.onmouseleave = () => t._currentView.footerSizeText.innerHTML = "";
            }
        }
    }
    function _(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), 5e3);
        }
    }
    function O(t, n, o, l) {
        const r = Is.definedMap(o);
        const i = r ? "map" : "object";
        const a = r ? Default2.getObjectFromMap(o) : o;
        const s = z(a, n);
        const u = s.length;
        if (u !== 0 || !n.ignore.emptyObjects) {
            const c = DomElement.create(t, "div", "object-type-title");
            const d = DomElement.create(t, "div", "object-type-contents last-item");
            const f = n.showArrowToggles ? DomElement.create(c, "div", "down-arrow") : null;
            const g = DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} main-title` : "main-title", r ? e.text.mapText : e.text.objectText);
            let m = null;
            L(d, n);
            if (n.paging.enabled) {
                let e = n.useZeroIndexingForArrays ? l.toString() : (l + 1).toString();
                if (n.showArrayIndexBrackets) {
                    e = `[${e}]${" "}:`;
                }
                DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} data-array-index` : "data-array-index", e, g);
            }
            if (n.showObjectSizes && u > 0) {
                DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} size` : "size", `{${u}}`);
            }
            if (n.showOpeningClosingCurlyBraces) {
                m = DomElement.createWithHTML(c, "span", "opening-symbol", "{");
            }
            j(f, null, d, n, a, s, m, false, true, "", i);
            H(n, g, o, i, false);
            C(n, o, g);
        }
    }
    function M(t, n, o) {
        const l = Is.definedSet(o);
        const r = l ? "set" : "array";
        const i = l ? Default2.getArrayFromSet(o) : o;
        const a = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const u = n.showArrowToggles ? DomElement.create(a, "div", "down-arrow") : null;
        const c = DomElement.createWithHTML(a, "span", n.showValueColors ? `${r} main-title` : "main-title", l ? e.text.setText : e.text.arrayText);
        let d = null;
        L(s, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(a, "span", n.showValueColors ? `${r} size` : "size", `[${i.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            d = DomElement.createWithHTML(a, "span", "opening-symbol", "[");
        }
        F(u, null, s, n, i, d, false, true, "", r);
        H(n, c, o, r, false);
        C(n, o, c);
    }
    function j(t, n, o, l, r, i, a, s, u, c, d) {
        let f = true;
        const g = i.length;
        const m = c !== "" ? g : 0;
        if (g === 0 && !l.ignore.emptyObjects) {
            N(r, o, l, "", e.text.noPropertiesText, true, false, "", d);
            f = false;
        } else {
            for (let e = 0; e < g; e++) {
                const t = i[e];
                const n = c === "" ? t : `${c}${"\\"}${t}`;
                if (r.hasOwnProperty(t)) {
                    N(r, o, l, t, r[t], e === g - 1, false, n, d);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                N(r, o, l, "", e.text.noPropertiesText, true, false, "", d);
                f = false;
            } else {
                if (l.showOpeningClosingCurlyBraces) {
                    J(l, o, "}", s, u);
                }
            }
        }
        W(l, t, n, o, a, m, d);
        return f;
    }
    function F(t, n, o, l, r, i, a, s, u, c) {
        let d = true;
        const f = r.length;
        const g = u !== "" ? f : 0;
        if (!l.reverseArrayValues) {
            for (let e = 0; e < f; e++) {
                const t = Arr.getIndex(e, l);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                N(r, o, l, Arr.getIndexName(l, t, f), r[e], e === f - 1, true, n, c);
            }
        } else {
            for (let e = f; e--; ) {
                const t = Arr.getIndex(e, l);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                N(r, o, l, Arr.getIndexName(l, t, f), r[e], e === 0, true, n, c);
            }
        }
        if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
            N(r, o, l, "", e.text.noPropertiesText, true, false, "", c);
            d = false;
        } else {
            if (l.showOpeningClosingCurlyBraces) {
                J(l, o, "]", a, s);
            }
        }
        W(l, t, n, o, i, g, c);
        return d;
    }
    function N(t, n, o, l, r, i, a, s, u) {
        const c = DomElement.create(n, "div", "object-type-value");
        const d = o.showArrowToggles ? DomElement.create(c, "div", "no-arrow") : null;
        let f = null;
        let g = null;
        let m = false;
        let p = null;
        let x = DomElement.create(c, "span", "title");
        let T = false;
        let b = null;
        const w = !Is.definedString(l);
        let y = true;
        if (!w) {
            if (a || !o.showPropertyNameQuotes) {
                x.innerHTML = l;
            } else {
                x.innerHTML = `"${l}"`;
            }
        } else {
            x.parentNode.removeChild(x);
            x = null;
        }
        if (i) {
            DomElement.addClass(c, "last-item");
        }
        if (o.showTypes) {
            b = DomElement.createWithHTML(c, "span", o.showValueColors ? "type-color" : "type", "");
        }
        if (!w && o.showValueColors && o.showPropertyNameAndIndexColors) {
            DomElement.addClass(x, u);
        }
        if (!w) {
            DomElement.createWithHTML(c, "span", "split", e.text.propertyColonCharacter);
            R(o, t, l, x, a);
            if (!a) {
                C(o, l, x);
            }
        }
        if (r === null) {
            if (!o.ignore.nullValues) {
                f = o.showValueColors ? `${"null"} value undefined-or-null` : "value undefined-or-null";
                g = DomElement.createWithHTML(c, "span", f, "null");
                p = "null";
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (r === void 0) {
            if (!o.ignore.undefinedValues) {
                f = o.showValueColors ? `${"undefined"} value undefined-or-null` : "value undefined-or-null";
                g = DomElement.createWithHTML(c, "span", f, "undefined");
                p = "undefined";
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFunction(r)) {
            const t = Default2.getFunctionName(r, e);
            if (t.isLambda) {
                if (!o.ignore.lambdaValues) {
                    f = o.showValueColors ? `${"lambda"} value non-value` : "value non-value";
                    g = DomElement.createWithHTML(c, "span", f, t.name);
                    p = "lambda";
                    if (Is.definedFunction(o.events.onLambdaRender)) {
                        Trigger.customEvent(o.events.onLambdaRender, g);
                    }
                    $(o, c, i);
                } else {
                    m = true;
                }
            } else {
                if (!o.ignore.functionValues) {
                    f = o.showValueColors ? `${"function"} value non-value` : "value non-value";
                    g = DomElement.createWithHTML(c, "span", f, t.name);
                    p = "function";
                    if (Is.definedFunction(o.events.onFunctionRender)) {
                        Trigger.customEvent(o.events.onFunctionRender, g);
                    }
                    $(o, c, i);
                } else {
                    m = true;
                }
            }
        } else if (Is.definedBoolean(r)) {
            if (!o.ignore.booleanValues) {
                f = o.showValueColors ? `${"boolean"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r);
                p = "boolean";
                T = o.allowEditing.booleanValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFloat(r)) {
            if (!o.ignore.floatValues) {
                const e = Default2.getFixedFloatPlacesValue(r, o.maximumDecimalPlaces);
                f = o.showValueColors ? `${"float"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, e);
                p = "float";
                T = o.allowEditing.floatValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onFloatRender)) {
                    Trigger.customEvent(o.events.onFloatRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedNumber(r)) {
            if (!o.ignore.numberValues) {
                f = o.showValueColors ? `${"number"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r);
                p = "number";
                T = o.allowEditing.numberValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedBigInt(r)) {
            if (!o.ignore.bigintValues) {
                f = o.showValueColors ? `${"bigint"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r);
                p = "bigint";
                T = o.allowEditing.bigIntValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(r) && Is.String.guid(r)) {
            if (!o.ignore.guidValues) {
                f = o.showValueColors ? `${"guid"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r);
                p = "guid";
                T = o.allowEditing.guidValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(r) && (Is.String.hexColor(r) || Is.String.rgbColor(r))) {
            if (!o.ignore.colorValues) {
                f = o.showValueColors ? `${"color"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r);
                p = "color";
                T = o.allowEditing.colorValues;
                if (o.showValueColors) {
                    g.style.color = r;
                }
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(r) && Is.definedUrl(r)) {
            if (!o.ignore.urlValues) {
                let n = r;
                if (o.maximumUrlLength > 0 && n.length > o.maximumUrlLength) {
                    n = n.substring(0, o.maximumUrlLength) + e.text.ellipsisText;
                }
                f = o.showValueColors ? `${"url"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, n);
                p = "url";
                T = o.allowEditing.urlValues;
                if (o.showUrlOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(r);
                }
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onUrlRender)) {
                    Trigger.customEvent(o.events.onUrlRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(r) && Is.definedEmail(r)) {
            if (!o.ignore.emailValues) {
                let n = r;
                if (o.maximumEmailLength > 0 && n.length > o.maximumEmailLength) {
                    n = n.substring(0, o.maximumEmailLength) + e.text.ellipsisText;
                }
                f = o.showValueColors ? `${"email"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, n);
                p = "email";
                T = o.allowEditing.emailValues;
                if (o.showEmailOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(`mailto:${r}`);
                }
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onEmailRender)) {
                    Trigger.customEvent(o.events.onEmailRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(r)) {
            if (!o.ignore.stringValues || w) {
                if (o.parse.stringsToBooleans && Is.String.boolean(r)) {
                    N(t, n, o, l, r.toString().toLowerCase().trim() === "true", i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToNumbers && !isNaN(r)) {
                    N(t, n, o, l, parseFloat(r), i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToDates && Is.String.date(r)) {
                    N(t, n, o, l, new Date(r), i, a, s, u);
                    m = true;
                } else {
                    let n = r;
                    if (!w) {
                        if (o.maximumStringLength > 0 && n.length > o.maximumStringLength) {
                            n = n.substring(0, o.maximumStringLength) + e.text.ellipsisText;
                        }
                        n = o.showStringQuotes ? `"${n}"` : n;
                        f = o.showValueColors ? `${"string"} value` : "value";
                        T = o.allowEditing.stringValues;
                    } else {
                        f = "no-properties-text";
                        T = false;
                        y = false;
                    }
                    g = DomElement.createWithHTML(c, "span", f, n);
                    p = "string";
                    if (!w) {
                        P(o, t, l, r, g, a, T);
                        if (Is.definedFunction(o.events.onStringRender)) {
                            Trigger.customEvent(o.events.onStringRender, g);
                        }
                        $(o, c, i);
                    }
                }
            } else {
                m = true;
            }
        } else if (Is.definedDate(r)) {
            if (!o.ignore.dateValues) {
                f = o.showValueColors ? `${"date"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, DateTime.getCustomFormattedDateText(e, r, o.dateTimeFormat));
                p = "date";
                T = o.allowEditing.dateValues;
                P(o, t, l, r, g, a, T);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedSymbol(r)) {
            if (!o.ignore.symbolValues) {
                f = o.showValueColors ? `${"symbol"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r.toString());
                p = "symbol";
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedRegExp(r)) {
            if (!o.ignore.regexpValues) {
                f = o.showValueColors ? `${"regexp"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, r.source.toString());
                p = "regexp";
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedImage(r)) {
            if (!o.ignore.imageValues) {
                f = o.showValueColors ? `${"image"} value` : "value";
                g = DomElement.create(c, "span", f);
                p = "image";
                const e = DomElement.create(g, "img");
                e.src = r.src;
                if (Is.definedFunction(o.events.onImageRender)) {
                    Trigger.customEvent(o.events.onImageRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedHtmlElement(r)) {
            if (!o.ignore.htmlValues) {
                if (o.showHtmlValuesAsObjects) {
                    const t = Default2.getHtmlElementAsObject(r);
                    const n = z(t, o);
                    const l = n.length;
                    if (l === 0 && o.ignore.emptyObjects) {
                        m = true;
                    } else {
                        const r = DomElement.create(c, "span", o.showValueColors ? "html" : "");
                        const a = DomElement.create(c, "div", "object-type-contents");
                        let u = null;
                        L(a, o);
                        if (i) {
                            DomElement.addClass(a, "last-item");
                        }
                        g = DomElement.createWithHTML(r, "span", "main-title", e.text.htmlText);
                        p = "html";
                        if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                            DomElement.createWithHTML(r, "span", "size", `{${l}}`);
                        }
                        if (o.showOpeningClosingCurlyBraces) {
                            u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                        }
                        let f = $(o, r, i);
                        const m = j(d, f, a, o, t, n, u, true, i, s, p);
                        if (!m && Is.defined(u)) {
                            u.parentNode.removeChild(u);
                        }
                    }
                } else {
                    f = o.showValueColors ? `${"html"} value` : "value";
                    g = DomElement.createWithHTML(c, "span", f, r.tagName.toLowerCase());
                    p = "html";
                    if (Is.definedFunction(o.events.onHtmlRender)) {
                        Trigger.customEvent(o.events.onHtmlRender, g);
                    }
                    $(o, c, i);
                }
            } else {
                m = true;
            }
        } else if (Is.definedSet(r)) {
            if (!o.ignore.setValues) {
                const t = Default2.getArrayFromSet(r);
                const n = DomElement.create(c, "span", o.showValueColors ? "set" : "");
                const l = DomElement.create(c, "div", "object-type-contents");
                let a = null;
                L(l, o);
                if (i) {
                    DomElement.addClass(l, "last-item");
                }
                g = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                p = "set";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                let u = $(o, n, i);
                const f = F(d, u, l, o, t, a, true, i, s, p);
                if (!f && Is.defined(a)) {
                    a.parentNode.removeChild(a);
                }
            } else {
                m = true;
            }
        } else if (Is.definedArray(r)) {
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(c, "span", o.showValueColors ? "array" : "");
                const n = DomElement.create(c, "div", "object-type-contents");
                let l = null;
                L(n, o);
                if (i) {
                    DomElement.addClass(n, "last-item");
                }
                g = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                p = "array";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(t, "span", "size", `[${r.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    l = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                let a = $(o, t, i);
                const u = F(d, a, n, o, r, l, true, i, s, p);
                if (!u && Is.defined(l)) {
                    l.parentNode.removeChild(l);
                }
            } else {
                m = true;
            }
        } else if (Is.definedMap(r)) {
            if (!o.ignore.mapValues) {
                const t = Default2.getObjectFromMap(r);
                const n = z(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    m = true;
                } else {
                    const r = DomElement.create(c, "span", o.showValueColors ? "map" : "");
                    const a = DomElement.create(c, "div", "object-type-contents");
                    let u = null;
                    L(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    g = DomElement.createWithHTML(r, "span", "main-title", e.text.mapText);
                    p = "map";
                    if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `{${l}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    let f = $(o, r, i);
                    const m = j(d, f, a, o, t, n, u, true, i, s, p);
                    if (!m && Is.defined(u)) {
                        u.parentNode.removeChild(u);
                    }
                }
            } else {
                m = true;
            }
        } else if (Is.definedObject(r)) {
            if (!o.ignore.objectValues) {
                const t = z(r, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    m = true;
                } else {
                    const l = DomElement.create(c, "span", o.showValueColors ? "object" : "");
                    const a = DomElement.create(c, "div", "object-type-contents");
                    let u = null;
                    L(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    g = DomElement.createWithHTML(l, "span", "main-title", e.text.objectText);
                    p = "object";
                    if (o.showObjectSizes && (n > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(l, "span", "size", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                    }
                    let f = $(o, l, i);
                    const m = j(d, f, a, o, r, t, u, true, i, s, p);
                    if (!m && Is.defined(u)) {
                        u.parentNode.removeChild(u);
                    }
                }
            } else {
                m = true;
            }
        } else {
            if (!o.ignore.unknownValues) {
                f = o.showValueColors ? `${"unknown"} value non-value` : "value non-value";
                g = DomElement.createWithHTML(c, "span", f, r.toString());
                p = "unknown";
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, g);
                }
                $(o, c, i);
            } else {
                m = true;
            }
        }
        if (m) {
            n.removeChild(c);
        } else {
            if (Is.defined(g)) {
                C(o, r, g);
                if (Is.defined(b)) {
                    if (p !== "null" && p !== "undefined" && p !== "array" && p !== "object" && p !== "map" && p !== "set") {
                        b.innerHTML = `(${p})`;
                    } else {
                        b.parentNode.removeChild(b);
                        b = null;
                    }
                }
                if (y) {
                    k(o, s, x, b, g);
                    H(o, g, r, p, T);
                }
            }
        }
    }
    function L(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            DomElement.addClass(e, "object-border");
            if (!t.showArrowToggles) {
                DomElement.addClass(e, "object-border-no-arrow-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function k(e, t, n, o, l) {
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
    function R(e, t, n, o, l) {
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
                } else {
                    o.innerHTML = o.innerHTML.replace(/['"]+/g, "");
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
    function P(e, t, n, o, l, r, a) {
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
                            } else if (Is.definedFloat(o) && !isNaN(+a)) {
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
    function H(e, t, n, o, l) {
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
    function W(e, t, n, o, l, r, i) {
        const a = e._currentView.contentPanelsIndex;
        const s = e._currentView.dataArrayCurrentIndex;
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(s)) {
            e._currentView.contentPanelsOpen[s] = {};
        }
        const u = () => {
            o.style.display = "none";
            e._currentView.contentPanelsOpen[s][a] = true;
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
        const c = () => {
            o.style.display = "block";
            e._currentView.contentPanelsOpen[s][a] = false;
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
        const d = e => {
            if (e) {
                u();
            } else {
                c();
            }
        };
        let f = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[s].hasOwnProperty(a)) {
            f = e._currentView.contentPanelsOpen[s][a];
        } else {
            if (!e._currentView.initialized) {
                if (i === "object" && e.autoClose.objectSize > 0 && r >= e.autoClose.objectSize) {
                    f = true;
                } else if (i === "array" && e.autoClose.arraySize > 0 && r >= e.autoClose.arraySize) {
                    f = true;
                } else if (i === "map" && e.autoClose.mapSize > 0 && r >= e.autoClose.mapSize) {
                    f = true;
                } else if (i === "set" && e.autoClose.setSize > 0 && r >= e.autoClose.setSize) {
                    f = true;
                }
            }
            e._currentView.contentPanelsOpen[s][a] = f;
        }
        if (Is.defined(t)) {
            t.onclick = () => d(t.className === "down-arrow");
        }
        d(f);
        e._currentView.contentPanelsIndex++;
    }
    function $(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function z(e, t) {
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
    function J(e, t, n, o, l) {
        let r = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles || e.showOpenedObjectArrayBorders) {
            DomElement.create(r, "div", "no-arrow");
        }
        DomElement.createWithHTML(r, "div", "object-type-end", n);
        $(e, r, l);
    }
    function U(t) {
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
            n.ondrop = e => Z(e, t);
        }
    }
    function Z(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            Y(e.dataTransfer.files, t);
        }
    }
    function Y(e, t) {
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
                G(n, r);
            }
        }
    }
    function G(t, n) {
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
    function K(t) {
        let n = JSON.stringify(t.data, w, t.jsonIndentSpaces);
        if (Is.definedString(n)) {
            const o = DomElement.create(document.body, "a");
            o.style.display = "none";
            o.setAttribute("target", "_blank");
            o.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(n)}`);
            o.setAttribute("download", Q(t));
            o.click();
            document.body.removeChild(o);
            _(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function Q(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function X(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => q(t, e)));
    }
    function q(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id) && !o._currentView.editMode) {
            if (ee(e) && e.code === "F11") {
                e.preventDefault();
                g(o);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                T(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                b(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                x(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                p(o);
            } else if (e.code === "Escape") {
                e.preventDefault();
                S(o);
            }
        }
    }
    function ee(e) {
        return e.ctrlKey || e.metaKey;
    }
    function te(e) {
        e._currentView.element.innerHTML = "";
        DomElement.removeClass(e._currentView.element, "json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        X(e, false);
        ToolTip.assignToEvents(e, false);
        ToolTip.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const ne = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return ne;
        },
        refreshAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return ne;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e));
            }
            return ne;
        },
        renderAll: function() {
            o();
            return ne;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                p(t[e]);
            }
            return ne;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                x(t[e]);
            }
            return ne;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    T(t[e]);
                }
            }
            return ne;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    b(t[e]);
                }
            }
            return ne;
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
            return ne;
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
                te(t[e]);
                delete t[e];
                n--;
            }
            return ne;
        },
        destroyAll: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    te(t[e]);
                }
            }
            t = {};
            n = 0;
            return ne;
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
            return ne;
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
            return "3.2.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => o()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = ne;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map