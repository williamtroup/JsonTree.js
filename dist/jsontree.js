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
        function r(e) {
            const t = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
            return e.match(t);
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
    e.definedFloat = d;
    function g(e) {
        return n(e) && typeof e === "symbol";
    }
    e.definedSymbol = g;
    function f(e) {
        return n(e) && e instanceof RegExp;
    }
    e.definedRegExp = f;
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
    function D(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = D;
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
        const r = e.toString().split("(");
        const l = r[0].split(" ");
        const i = "()";
        n = `${l.join(" ")}${i}`;
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
                const r = Default.getObjectFromString(e, t);
                if (r.parsed) {
                    n(r.object);
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
        const r = t.toLowerCase();
        const l = r === "text";
        let i = l ? document.createTextNode("") : document.createElement(r);
        if (Is.defined(n)) {
            i.className = n;
        }
        if (Is.defined(e)) {
            if (Is.defined(o)) {
                e.insertBefore(i, o);
            } else {
                e.appendChild(i);
            }
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
    function o(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        let o = n ? document.createTextNode("") : document.createElement(t);
        return o;
    }
    e.createWithNoContainer = o;
    function r(e, t) {
        e.classList.add(t);
    }
    e.addClass = r;
    function l(e, t) {
        e.classList.remove(t);
    }
    e.removeClass = l;
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
        let r = e.pageY;
        const l = a();
        t.style.display = "block";
        if (o + t.offsetWidth > window.innerWidth) {
            o -= t.offsetWidth + n;
        } else {
            o++;
            o += n;
        }
        if (r + t.offsetHeight > window.innerHeight) {
            r -= t.offsetHeight + n;
        } else {
            r++;
            r += n;
        }
        if (o < l.left) {
            o = e.pageX + 1;
        }
        if (r < l.top) {
            r = e.pageY + 1;
        }
        t.style.left = `${o}px`;
        t.style.top = `${r}px`;
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
    function c(e, o, r, l, i, a) {
        const s = t(e, "div", "checkbox");
        const u = t(s, "label", "checkbox");
        const c = t(u, "input");
        c.type = "checkbox";
        c.name = r;
        c.checked = l;
        t(u, "span", "check-mark");
        n(u, "span", `text ${i}`, o);
        if (Is.definedString(a)) {
            n(u, "span", `additional-text`, a);
        }
        return c;
    }
    e.createCheckBox = c;
})(DomElement || (DomElement = {}));

var Str;

(e => {
    function t(e, t = 1, n = "0") {
        const o = e.toString();
        let r = o;
        if (o.length < t) {
            const e = t - o.length + 1;
            r = `${Array(e).join(n)}${o}`;
        }
        return r;
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
    function o(e, o, r) {
        let l = r;
        const i = t(o);
        l = l.replace("{hh}", Str.padNumber(o.getHours(), 2));
        l = l.replace("{h}", o.getHours().toString());
        l = l.replace("{MM}", Str.padNumber(o.getMinutes(), 2));
        l = l.replace("{M}", o.getMinutes().toString());
        l = l.replace("{ss}", Str.padNumber(o.getSeconds(), 2));
        l = l.replace("{s}", o.getSeconds().toString());
        l = l.replace("{fff}", Str.padNumber(o.getMilliseconds(), 3));
        l = l.replace("{ff}", Str.padNumber(o.getMilliseconds(), 2));
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
    e.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME = "data-jsontree-js-array-index";
})(Constants || (Constants = {}));

var Binding;

(e => {
    let t;
    (t => {
        function n(t, n) {
            const o = e.Options.get(t);
            const r = o.allowEditing;
            o._currentView = {};
            o._currentView.element = n;
            o._currentView.dataArrayCurrentIndex = (o.paging.startPage - 1) * o.paging.columnsPerPage;
            o._currentView.titleBarButtons = null;
            o._currentView.valueClickTimerId = 0;
            o._currentView.editMode = false;
            o._currentView.idSet = false;
            o._currentView.contentPanelsOpen = {};
            o._currentView.contentPanelsIndex = 0;
            o._currentView.contentPanelsDataIndex = 0;
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
            o._currentView.footerLengthText = null;
            o._currentView.footerSizeText = null;
            o._currentView.footerPageText = null;
            o._currentView.footerStatusTextTimerId = 0;
            o._currentView.columnDragging = false;
            o._currentView.columnDraggingDataIndex = 0;
            o._currentView.dataTypeCounts = {};
            for (const e in r) {
                if (!r[e]) {
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
            t.showDataTypes = Default2.getBoolean(t.showDataTypes, false);
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
            t = r(t);
            t = l(t);
            t = i(t);
            t = a(t);
            t = s(t);
            t = u(t);
            t = c(t);
            t = d(t);
            t = g(t);
            t = f(t);
            return t;
        }
        t.get = o;
        function r(e) {
            e.paging = Default2.getObject(e.paging, {});
            e.paging.enabled = Default2.getBoolean(e.paging.enabled, false);
            e.paging.columnsPerPage = Default2.getNumberMaximum(e.paging.columnsPerPage, 1, 6);
            e.paging.copyOnlyCurrentPage = Default2.getBoolean(e.paging.copyOnlyCurrentPage, false);
            e.paging.startPage = Default2.getNumberMinimum(e.paging.startPage, 1, 1);
            e.paging.synchronizeScrolling = Default2.getBoolean(e.paging.synchronizeScrolling, false);
            e.paging.allowColumnReordering = Default2.getBoolean(e.paging.allowColumnReordering, true);
            return e;
        }
        function l(e) {
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
            e.footer.showLengths = Default2.getBoolean(e.footer.showLengths, true);
            e.footer.showSizes = Default2.getBoolean(e.footer.showSizes, true);
            e.footer.showPageOf = Default2.getBoolean(e.footer.showPageOf, true);
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
        function c(e) {
            let t = Default2.getBoolean(e.allowEditing, true);
            e.allowEditing = Default2.getObject(e.allowEditing, {});
            e.allowEditing.booleanValues = Default2.getBoolean(e.allowEditing.booleanValues, t);
            e.allowEditing.floatValues = Default2.getBoolean(e.allowEditing.floatValues, t);
            e.allowEditing.numberValues = Default2.getBoolean(e.allowEditing.numberValues, t);
            e.allowEditing.stringValues = Default2.getBoolean(e.allowEditing.stringValues, t);
            e.allowEditing.dateValues = Default2.getBoolean(e.allowEditing.dateValues, t);
            e.allowEditing.bigIntValues = Default2.getBoolean(e.allowEditing.bigIntValues, t);
            e.allowEditing.guidValues = Default2.getBoolean(e.allowEditing.guidValues, t);
            e.allowEditing.colorValues = Default2.getBoolean(e.allowEditing.colorValues, t);
            e.allowEditing.urlValues = Default2.getBoolean(e.allowEditing.urlValues, t);
            e.allowEditing.emailValues = Default2.getBoolean(e.allowEditing.emailValues, t);
            e.allowEditing.propertyNames = Default2.getBoolean(e.allowEditing.propertyNames, t);
            e.allowEditing.bulk = Default2.getBoolean(e.allowEditing.bulk, t);
            return e;
        }
        function d(e) {
            e.sideMenu = Default2.getObject(e.sideMenu, {});
            e.sideMenu.enabled = Default2.getBoolean(e.sideMenu.enabled, true);
            e.sideMenu.showImportButton = Default2.getBoolean(e.sideMenu.showImportButton, true);
            e.sideMenu.showExportButton = Default2.getBoolean(e.sideMenu.showExportButton, true);
            e.sideMenu.titleText = Default2.getAnyString(e.sideMenu.titleText, e.title.text);
            e.sideMenu.showDataTypeCounts = Default2.getBoolean(e.sideMenu.showDataTypeCounts, true);
            return e;
        }
        function g(e) {
            e.autoClose = Default2.getObject(e.autoClose, {});
            e.autoClose.objectSize = Default2.getNumber(e.autoClose.objectSize, 0);
            e.autoClose.arraySize = Default2.getNumber(e.autoClose.arraySize, 0);
            e.autoClose.mapSize = Default2.getNumber(e.autoClose.mapSize, 0);
            e.autoClose.setSize = Default2.getNumber(e.autoClose.setSize, 0);
            return e;
        }
        function f(e) {
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
            e.text.showTypesText = Default2.getAnyString(e.text.showTypesText, "Show Data Types");
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
            e.text.copiedText = Default2.getAnyString(e.text.copiedText, "JSON copied to clipboard.");
            e.text.exportedText = Default2.getAnyString(e.text.exportedText, "JSON exported.");
            e.text.importedText = Default2.getAnyString(e.text.importedText, "{0} JSON files imported.");
            e.text.ignoreDataTypesUpdated = Default2.getAnyString(e.text.ignoreDataTypesUpdated, "Ignore data types updated.");
            e.text.lengthText = Default2.getAnyString(e.text.lengthText, "Length: {0}");
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
    function o(e, t, n, o = "jsontree-js-tooltip") {
        if (e !== null) {
            e.addEventListener("mousemove", (e => r(e, t, n, o)));
        }
    }
    e.add = o;
    function r(e, t, n, o) {
        DomElement.cancelBubble(e);
        l(t);
        t._currentView.tooltipTimerId = setTimeout((() => {
            t._currentView.tooltip.className = o;
            t._currentView.tooltip.innerHTML = n;
            t._currentView.tooltip.style.display = "block";
            DomElement.showElementAtMousePosition(e, t._currentView.tooltip, t.tooltip.offset);
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
    function r(e, t, n) {
        if (n < 0) {
            n = 0;
        } else if (n > e.length - 1) {
            n = e.length - 1;
        }
        e.splice(n, 0, e.splice(t, 1)[0]);
    }
    e.moveIndex = r;
})(Arr || (Arr = {}));

var Size;

(e => {
    function t(e) {
        let t = null;
        const n = o(e);
        if (n > 0) {
            const e = Math.floor(Math.log(n) / Math.log(1024));
            return `${Default2.getFixedFloatPlacesValue(n / Math.pow(1024, e), 2)} ${" KMGTP".charAt(e)}B`;
        }
        return t;
    }
    e.of = t;
    function n(t) {
        let n = 0;
        if (Is.defined(t)) {
            if (Is.definedDate(t)) {
                n = t.toString().length;
            } else if (Is.definedSet(t)) {
                n = e.length(Default2.getArrayFromSet(t));
            } else if (Is.definedMap(t)) {
                n = e.length(Default2.getObjectFromMap(t));
            } else if (Is.definedArray(t)) {
                n = t.length;
            } else if (Is.definedObject(t)) {
                for (const e in t) {
                    if (t.hasOwnProperty(e)) {
                        n++;
                    }
                }
            } else {
                if (!Is.definedFunction(t)) {
                    n = t.toString().length;
                }
            }
        }
        return n;
    }
    e.length = n;
    function o(e) {
        let t = 0;
        if (Is.defined(e)) {
            if (Is.definedNumber(e)) {
                t = 8;
            } else if (Is.definedString(e)) {
                t = e.length * 2;
            } else if (Is.definedBoolean(e)) {
                t = 4;
            } else if (Is.definedBigInt(e)) {
                t = o(e.toString());
            } else if (Is.definedRegExp(e)) {
                t = o(e.toString());
            } else if (Is.definedDate(e)) {
                t = o(e.toString());
            } else if (Is.definedSet(e)) {
                t = o(Default2.getArrayFromSet(e));
            } else if (Is.definedMap(e)) {
                t = o(Default2.getObjectFromMap(e));
            } else if (Is.definedArray(e)) {
                const n = e.length;
                for (let r = 0; r < n; r++) {
                    t += o(e[r]);
                }
            } else if (Is.definedObject(e)) {
                for (const n in e) {
                    if (e.hasOwnProperty(n)) {
                        t += o(n) + o(e[n]);
                    }
                }
            }
        }
        return t;
    }
})(Size || (Size = {}));

var Obj;

(e => {
    function t(e, t) {
        let n = [];
        for (const t in e) {
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
    e.getPropertyNames = t;
})(Obj || (Obj = {}));

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
        if (e.openInFullScreenMode) {
            DomElement.addClass(e._currentView.element, "full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        oe(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let r = t[n._currentView.element.id].data;
        if (Is.definedUrl(r)) {
            Default2.getObjectFromUrl(r, e, (e => {
                a(n, o, e);
            }));
        } else {
            a(n, o, r);
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
        e._currentView.dataTypeCounts = {};
        p(e, n);
        const r = DomElement.create(e._currentView.element, "div", "contents");
        if (t) {
            DomElement.addClass(r, "page-switch");
        }
        if (e.paging.enabled && Is.definedArray(n)) {
            const t = Is.defined(n[e._currentView.dataArrayCurrentIndex + 1]);
            for (let l = 0; l < e.paging.columnsPerPage; l++) {
                const i = l + e._currentView.dataArrayCurrentIndex;
                const a = n[i];
                e._currentView.contentPanelsIndex = 0;
                e._currentView.contentPanelsDataIndex = i;
                if (Is.defined(a)) {
                    s(a, r, e, i, o[l], e.paging.columnsPerPage, t);
                }
            }
        } else {
            e._currentView.contentPanelsIndex = 0;
            e._currentView.contentPanelsDataIndex = 0;
            s(n, r, e, null, o[0], 1, false);
        }
        V(e);
        _(e);
        K(e);
        e._currentView.initialized = true;
    }
    function s(t, n, o, r, l, i, a) {
        const s = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        s.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, r.toString());
        if (a && o.paging.allowColumnReordering && o.paging.columnsPerPage > 1 && o.allowEditing !== false) {
            s.setAttribute("draggable", "true");
            s.ondragstart = () => g(s, o, r);
            s.ondragend = () => f(s, o);
            s.ondragover = e => e.preventDefault();
            s.ondrop = () => m(o, r);
        }
        o._currentView.contentColumns.push(s);
        if (o.paging.synchronizeScrolling) {
            s.onscroll = () => d(s, o);
        }
        if (Is.definedArray(t) || Is.definedSet(t)) {
            L(s, o, t);
        } else if (Is.definedObject(t)) {
            N(s, o, t, r);
        }
        if (s.innerHTML === "" || s.children.length >= 2 && (!o.showOpenedObjectArrayBorders && s.children[1].children.length === 0 || s.children[1].children.length === 1)) {
            s.innerHTML = "";
            DomElement.createWithHTML(s, "span", "no-json-text", e.text.noJsonToViewText);
            o._currentView.titleBarButtons.style.display = "none";
        } else {
            if (Is.defined(l)) {
                s.scrollTop = l;
            }
            o._currentView.titleBarButtons.style.display = "block";
        }
        u(o, t, s, r);
    }
    function u(t, n, o, r) {
        if (t._currentView.isBulkEditingEnabled) {
            o.ondblclick = l => {
                DomElement.cancelBubble(l);
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                o.setAttribute("contenteditable", "true");
                o.innerText = JSON.stringify(n, h, t.jsonIndentSpaces);
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => i(t, false);
                o.onkeydown = n => {
                    if (n.code == "Escape") {
                        n.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (le(n) && n.code == "Enter") {
                        n.preventDefault();
                        const l = o.innerText;
                        const i = Default2.getObjectFromString(l, e);
                        if (i.parsed) {
                            if (t.paging.enabled) {
                                t.data[r] = i.object;
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
        const r = t._currentView.contentColumns.length;
        for (let e = 0; e < r; e++) {
            t._currentView.contentColumns[e].scrollTop = n;
            t._currentView.contentColumns[e].scrollLeft = o;
        }
    }
    function g(e, t, n) {
        t._currentView.columnDragging = true;
        t._currentView.columnDraggingDataIndex = n;
        e.classList.add("draggable-item");
    }
    function f(e, t) {
        t._currentView.columnDragging = false;
        e.classList.remove("draggable-item");
    }
    function m(e, t) {
        e._currentView.columnDragging = false;
        if (t !== e._currentView.columnDraggingDataIndex) {
            const n = e.data[t];
            const o = e.data[e._currentView.columnDraggingDataIndex];
            const r = e._currentView.contentPanelsOpen[t];
            const l = e._currentView.contentPanelsOpen[e._currentView.columnDraggingDataIndex];
            e.data[t] = o;
            e.data[e._currentView.columnDraggingDataIndex] = n;
            e._currentView.contentPanelsOpen[t] = l;
            e._currentView.contentPanelsOpen[e._currentView.columnDraggingDataIndex] = r;
            i(e);
        }
    }
    function p(t, n) {
        if (Is.definedString(t.title.text) || t.title.showTreeControls || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => x(t);
            }
            if (t.sideMenu.enabled && Is.definedObject(n)) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => v(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyAllButtonSymbolText);
                o.onclick = () => T(t, n);
                o.ondblclick = DomElement.cancelBubble;
                if (t.paging.copyOnlyCurrentPage && t.paging.enabled) {
                    ToolTip.add(o, t, e.text.copyButtonText);
                } else {
                    ToolTip.add(o, t, e.text.copyAllButtonText);
                }
            }
            if (t.title.showTreeControls) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "openAll", e.text.openAllButtonSymbolText);
                n.onclick = () => b(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "closeAll", e.text.closeAllButtonSymbolText);
                o.onclick = () => w(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.paging.enabled && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => D(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
                    t._currentView.nextButton.onclick = () => y(t);
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
                t._currentView.toggleFullScreenButton.onclick = () => x(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function x(t) {
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
            O(t);
        }
    }
    function T(t, n) {
        let o = null;
        let r = h;
        if (Is.definedFunction(t.events.onCopyJsonReplacer)) {
            r = t.events.onCopyJsonReplacer;
        }
        if (t.paging.copyOnlyCurrentPage && t.paging.enabled) {
            let e = null;
            if (t.paging.columnsPerPage <= 1) {
                e = n[t._currentView.dataArrayCurrentIndex];
            } else {
                e = [];
                for (let o = 0; o < t.paging.columnsPerPage; o++) {
                    const r = o + t._currentView.dataArrayCurrentIndex;
                    const l = n[r];
                    if (Is.defined(l)) {
                        e.push(l);
                    }
                }
            }
            o = JSON.stringify(e, r, t.jsonIndentSpaces);
        } else {
            o = JSON.stringify(n, r, t.jsonIndentSpaces);
        }
        navigator.clipboard.writeText(o);
        F(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, o);
    }
    function b(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function w(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function D(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex -= e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function y(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex += e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function h(t, n) {
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
    function V(t) {
        if (t.sideMenu.enabled) {
            t._currentView.disabledBackground = DomElement.create(t._currentView.element, "div", "side-menu-disabled-background");
            t._currentView.disabledBackground.onclick = () => E(t);
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showExportButton) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => te(t);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => S(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const r = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            r.onclick = () => E(t);
            ToolTip.add(r, t, e.text.closeButtonText);
            const l = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
            B(l, t);
        }
    }
    function S(e) {
        const t = DomElement.createWithNoContainer("input");
        t.type = "file";
        t.accept = ".json";
        t.multiple = true;
        t.onchange = () => q(t.files, e);
        t.click();
    }
    function v(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
        }
    }
    function E(t) {
        if (t._currentView.sideMenu.classList.contains("side-menu-open")) {
            t._currentView.sideMenu.classList.remove("side-menu-open");
            t._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(t);
            if (t._currentView.sideMenuChanged) {
                setTimeout((() => {
                    i(t);
                    F(t, e.text.ignoreDataTypesUpdated);
                }), 500);
            }
        }
    }
    function B(t, n) {
        const o = [];
        const r = DomElement.create(t, "div", "settings-panel");
        const l = DomElement.create(r, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(l, "div", "settings-panel-title-text", `${e.text.showTypesText}:`);
        const i = DomElement.create(l, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => I(n, o, true);
        s.onclick = () => I(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(r, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            o.push(A(u, e, n, !d[`${e}Values`]));
        }));
    }
    function I(e, t, n) {
        const o = t.length;
        const r = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            r[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function A(e, t, n, o) {
        let r = Str.capitalizeFirstLetter(t);
        let l = "";
        if (n.sideMenu.showDataTypeCounts) {
            if (n._currentView.dataTypeCounts.hasOwnProperty(t)) {
                l = `(${n._currentView.dataTypeCounts[t]})`;
            }
        }
        const i = DomElement.createCheckBox(e, r, t, o, n.showValueColors ? t : "", l);
        i.onchange = () => {
            const e = n.ignore;
            e[`${t}Values`] = !i.checked;
            n.ignore = e;
            n._currentView.sideMenuChanged = true;
        };
        return i;
    }
    function _(t) {
        if (t.footer.enabled) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            O(t);
            t._currentView.footerStatusText = DomElement.createWithHTML(t._currentView.footer, "div", "status-text", e.text.waitingText);
            if (t.footer.showLengths) {
                t._currentView.footerLengthText = DomElement.create(t._currentView.footer, "div", "status-value-length");
            }
            if (t.footer.showSizes) {
                t._currentView.footerSizeText = DomElement.create(t._currentView.footer, "div", "status-value-size");
            }
            if (t.paging.enabled && t.footer.showPageOf) {
                t._currentView.footerPageText = DomElement.create(t._currentView.footer, "div", "status-page-index");
                C(t);
            }
        }
    }
    function C(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.dataArrayCurrentIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const r = DomElement.createWithHTML(null, "span", "status-count", n.toFixed()).outerHTML;
            const l = DomElement.createWithHTML(null, "span", "status-count", o.toFixed()).outerHTML;
            const i = e.text.pageOfText.replace("{0}", r).replace("{1}", l);
            t._currentView.footerPageText.innerHTML = i;
        }
    }
    function O(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function M(t, n, o) {
        if (t.footer.enabled && t.footer.showLengths) {
            const r = Size.length(n);
            if (r > 0) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", r.toString()).outerHTML;
                    const o = e.text.lengthText.replace("{0}", n);
                    t._currentView.footerLengthText.innerHTML = o;
                }));
                o.addEventListener("mouseleave", (() => t._currentView.footerLengthText.innerHTML = ""));
            }
        }
    }
    function j(t, n, o) {
        if (t.footer.enabled && t.footer.showSizes) {
            const r = Size.of(n);
            if (Is.definedString(r)) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", r.toString()).outerHTML;
                    const o = e.text.sizeText.replace("{0}", n);
                    t._currentView.footerSizeText.innerHTML = o;
                }));
                o.addEventListener("mouseleave", (() => t._currentView.footerSizeText.innerHTML = ""));
            }
        }
    }
    function F(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), 5e3);
        }
    }
    function N(t, n, o, r) {
        const l = Is.definedMap(o);
        const i = l ? "map" : "object";
        const a = l ? Default2.getObjectFromMap(o) : o;
        const s = Obj.getPropertyNames(a, n);
        const u = s.length;
        if (u !== 0 || !n.ignore.emptyObjects) {
            const c = DomElement.create(t, "div", "object-type-title");
            const d = DomElement.create(t, "div", "object-type-contents last-item");
            const g = n.showArrowToggles ? DomElement.create(c, "div", "down-arrow") : null;
            const f = DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} main-title` : "main-title", l ? e.text.mapText : e.text.objectText);
            let m = null;
            W(d, n);
            if (n.paging.enabled) {
                let e = n.useZeroIndexingForArrays ? r.toString() : (r + 1).toString();
                if (n.showArrayIndexBrackets) {
                    e = `[${e}]${" "}:`;
                }
                DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} data-array-index` : "data-array-index", e, f);
            }
            if (n.showObjectSizes && u > 0) {
                DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} size` : "size", `{${u}}`);
            }
            if (n.showOpeningClosingCurlyBraces) {
                m = DomElement.createWithHTML(c, "span", "opening-symbol", "{");
            }
            P(g, null, d, n, a, s, m, false, true, "", i);
            U(n, f, o, i, false);
            j(n, o, f);
            M(n, o, f);
        }
    }
    function L(t, n, o) {
        const r = Is.definedSet(o);
        const l = r ? "set" : "array";
        const i = r ? Default2.getArrayFromSet(o) : o;
        const a = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const u = n.showArrowToggles ? DomElement.create(a, "div", "down-arrow") : null;
        const c = DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} main-title` : "main-title", r ? e.text.setText : e.text.arrayText);
        let d = null;
        W(s, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} size` : "size", `[${i.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            d = DomElement.createWithHTML(a, "span", "opening-symbol", "[");
        }
        R(u, null, s, n, i, d, false, true, "", l);
        U(n, c, o, l, false);
        j(n, o, c);
        M(n, o, c);
    }
    function P(t, n, o, r, l, i, a, s, u, c, d) {
        let g = true;
        const f = i.length;
        const m = c !== "" ? f : 0;
        if (f === 0 && !r.ignore.emptyObjects) {
            k(l, o, r, "", e.text.noPropertiesText, true, false, "", d);
            g = false;
        } else {
            for (let e = 0; e < f; e++) {
                const t = i[e];
                const n = c === "" ? t : `${c}${"\\"}${t}`;
                if (l.hasOwnProperty(t)) {
                    k(l, o, r, t, l[t], e === f - 1, false, n, d);
                }
            }
            if (o.children.length === 0 || r.showOpenedObjectArrayBorders && o.children.length === 1) {
                k(l, o, r, "", e.text.noPropertiesText, true, false, "", d);
                g = false;
            } else {
                if (r.showOpeningClosingCurlyBraces) {
                    G(r, o, "}", s, u);
                }
            }
        }
        Z(r, t, n, o, a, m, d);
        return g;
    }
    function R(t, n, o, r, l, i, a, s, u, c) {
        let d = true;
        const g = l.length;
        const f = u !== "" ? g : 0;
        if (!r.reverseArrayValues) {
            for (let e = 0; e < g; e++) {
                const t = Arr.getIndex(e, r);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                k(l, o, r, Arr.getIndexName(r, t, g), l[e], e === g - 1, true, n, c);
            }
        } else {
            for (let e = g; e--; ) {
                const t = Arr.getIndex(e, r);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                k(l, o, r, Arr.getIndexName(r, t, g), l[e], e === 0, true, n, c);
            }
        }
        if (o.children.length === 0 || r.showOpenedObjectArrayBorders && o.children.length === 1) {
            k(l, o, r, "", e.text.noPropertiesText, true, false, "", c);
            d = false;
        } else {
            if (r.showOpeningClosingCurlyBraces) {
                G(r, o, "]", a, s);
            }
        }
        Z(r, t, n, o, i, f, c);
        return d;
    }
    function k(t, n, o, r, l, i, a, s, u) {
        const c = DomElement.create(n, "div", "object-type-value");
        const d = o.showArrowToggles ? DomElement.create(c, "div", "no-arrow") : null;
        let g = null;
        let f = null;
        let m = false;
        let p = null;
        let x = DomElement.create(c, "span", "title");
        let T = false;
        let b = null;
        const w = !Is.definedString(r);
        let D = true;
        if (!w) {
            if (a || !o.showPropertyNameQuotes) {
                x.innerHTML = r;
            } else {
                x.innerHTML = `"${r}"`;
            }
        } else {
            x.parentNode.removeChild(x);
            x = null;
        }
        if (i) {
            DomElement.addClass(c, "last-item");
        }
        if (o.showDataTypes) {
            b = DomElement.createWithHTML(c, "span", o.showValueColors ? "type-color" : "type", "");
        }
        if (!w && o.showValueColors && o.showPropertyNameAndIndexColors) {
            DomElement.addClass(x, u);
        }
        if (!w) {
            DomElement.createWithHTML(c, "span", "split", e.text.propertyColonCharacter);
            z(o, t, r, x, a);
            if (!a) {
                j(o, r, x);
                M(o, r, x);
            }
        }
        if (l === null) {
            if (!o.ignore.nullValues) {
                g = o.showValueColors ? `${"null"} value undefined-or-null` : "value undefined-or-null";
                f = DomElement.createWithHTML(c, "span", g, "null");
                p = "null";
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (l === void 0) {
            if (!o.ignore.undefinedValues) {
                g = o.showValueColors ? `${"undefined"} value undefined-or-null` : "value undefined-or-null";
                f = DomElement.createWithHTML(c, "span", g, "undefined");
                p = "undefined";
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFunction(l)) {
            const t = Default2.getFunctionName(l, e);
            if (t.isLambda) {
                if (!o.ignore.lambdaValues) {
                    g = o.showValueColors ? `${"lambda"} value non-value` : "value non-value";
                    f = DomElement.createWithHTML(c, "span", g, t.name);
                    p = "lambda";
                    if (Is.definedFunction(o.events.onLambdaRender)) {
                        Trigger.customEvent(o.events.onLambdaRender, f);
                    }
                    Y(o, c, i);
                } else {
                    m = true;
                }
            } else {
                if (!o.ignore.functionValues) {
                    g = o.showValueColors ? `${"function"} value non-value` : "value non-value";
                    f = DomElement.createWithHTML(c, "span", g, t.name);
                    p = "function";
                    if (Is.definedFunction(o.events.onFunctionRender)) {
                        Trigger.customEvent(o.events.onFunctionRender, f);
                    }
                    Y(o, c, i);
                } else {
                    m = true;
                }
            }
        } else if (Is.definedBoolean(l)) {
            if (!o.ignore.booleanValues) {
                g = o.showValueColors ? `${"boolean"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l);
                p = "boolean";
                T = o.allowEditing.booleanValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFloat(l)) {
            if (!o.ignore.floatValues) {
                const e = Default2.getFixedFloatPlacesValue(l, o.maximumDecimalPlaces);
                g = o.showValueColors ? `${"float"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, e);
                p = "float";
                T = o.allowEditing.floatValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onFloatRender)) {
                    Trigger.customEvent(o.events.onFloatRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedNumber(l)) {
            if (!o.ignore.numberValues) {
                g = o.showValueColors ? `${"number"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l);
                p = "number";
                T = o.allowEditing.numberValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedBigInt(l)) {
            if (!o.ignore.bigintValues) {
                g = o.showValueColors ? `${"bigint"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l);
                p = "bigint";
                T = o.allowEditing.bigIntValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.String.guid(l)) {
            if (!o.ignore.guidValues) {
                g = o.showValueColors ? `${"guid"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l);
                p = "guid";
                T = o.allowEditing.guidValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && (Is.String.hexColor(l) || Is.String.rgbColor(l))) {
            if (!o.ignore.colorValues) {
                g = o.showValueColors ? `${"color"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l);
                p = "color";
                T = o.allowEditing.colorValues;
                if (o.showValueColors) {
                    f.style.color = l;
                }
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.definedUrl(l)) {
            if (!o.ignore.urlValues) {
                let n = l;
                if (o.maximumUrlLength > 0 && n.length > o.maximumUrlLength) {
                    n = n.substring(0, o.maximumUrlLength) + e.text.ellipsisText;
                }
                g = o.showValueColors ? `${"url"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, n);
                p = "url";
                T = o.allowEditing.urlValues;
                if (o.showUrlOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(l);
                }
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onUrlRender)) {
                    Trigger.customEvent(o.events.onUrlRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.definedEmail(l)) {
            if (!o.ignore.emailValues) {
                let n = l;
                if (o.maximumEmailLength > 0 && n.length > o.maximumEmailLength) {
                    n = n.substring(0, o.maximumEmailLength) + e.text.ellipsisText;
                }
                g = o.showValueColors ? `${"email"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, n);
                p = "email";
                T = o.allowEditing.emailValues;
                if (o.showEmailOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(`mailto:${l}`);
                }
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onEmailRender)) {
                    Trigger.customEvent(o.events.onEmailRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l)) {
            if (!o.ignore.stringValues || w) {
                if (o.parse.stringsToBooleans && Is.String.boolean(l)) {
                    k(t, n, o, r, l.toString().toLowerCase().trim() === "true", i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToNumbers && !isNaN(l)) {
                    k(t, n, o, r, parseFloat(l), i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToDates && Is.String.date(l)) {
                    k(t, n, o, r, new Date(l), i, a, s, u);
                    m = true;
                } else {
                    let n = l;
                    if (!w) {
                        if (o.maximumStringLength > 0 && n.length > o.maximumStringLength) {
                            n = n.substring(0, o.maximumStringLength) + e.text.ellipsisText;
                        }
                        n = o.showStringQuotes ? `"${n}"` : n;
                        g = o.showValueColors ? `${"string"} value` : "value";
                        T = o.allowEditing.stringValues;
                    } else {
                        g = "no-properties-text";
                        T = false;
                        D = false;
                    }
                    f = DomElement.createWithHTML(c, "span", g, n);
                    p = "string";
                    if (!w) {
                        J(o, t, r, l, f, a, T);
                        if (Is.definedFunction(o.events.onStringRender)) {
                            Trigger.customEvent(o.events.onStringRender, f);
                        }
                        Y(o, c, i);
                    }
                }
            } else {
                m = true;
            }
        } else if (Is.definedDate(l)) {
            if (!o.ignore.dateValues) {
                g = o.showValueColors ? `${"date"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, DateTime.getCustomFormattedDateText(e, l, o.dateTimeFormat));
                p = "date";
                T = o.allowEditing.dateValues;
                J(o, t, r, l, f, a, T);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedSymbol(l)) {
            if (!o.ignore.symbolValues) {
                g = o.showValueColors ? `${"symbol"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l.toString());
                p = "symbol";
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedRegExp(l)) {
            if (!o.ignore.regexpValues) {
                g = o.showValueColors ? `${"regexp"} value` : "value";
                f = DomElement.createWithHTML(c, "span", g, l.source.toString());
                p = "regexp";
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedImage(l)) {
            if (!o.ignore.imageValues) {
                g = o.showValueColors ? `${"image"} value` : "value";
                f = DomElement.create(c, "span", g);
                p = "image";
                const e = DomElement.create(f, "img");
                e.src = l.src;
                if (Is.definedFunction(o.events.onImageRender)) {
                    Trigger.customEvent(o.events.onImageRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedHtmlElement(l)) {
            if (!o.ignore.htmlValues) {
                if (o.showHtmlValuesAsObjects) {
                    const t = Default2.getHtmlElementAsObject(l);
                    const n = Obj.getPropertyNames(t, o);
                    const r = n.length;
                    if (r === 0 && o.ignore.emptyObjects) {
                        m = true;
                    } else {
                        const l = DomElement.create(c, "span", o.showValueColors ? "html" : "");
                        const a = DomElement.create(c, "div", "object-type-contents");
                        let u = null;
                        W(a, o);
                        if (i) {
                            DomElement.addClass(a, "last-item");
                        }
                        f = DomElement.createWithHTML(l, "span", "main-title", e.text.htmlText);
                        p = "html";
                        if (o.showObjectSizes && (r > 0 || !o.ignore.emptyObjects)) {
                            DomElement.createWithHTML(l, "span", "size", `{${r}}`);
                        }
                        if (o.showOpeningClosingCurlyBraces) {
                            u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                        }
                        let g = Y(o, l, i);
                        const m = P(d, g, a, o, t, n, u, true, i, s, p);
                        if (!m && Is.defined(u)) {
                            u.parentNode.removeChild(u);
                        }
                    }
                } else {
                    g = o.showValueColors ? `${"html"} value` : "value";
                    f = DomElement.createWithHTML(c, "span", g, l.tagName.toLowerCase());
                    p = "html";
                    if (Is.definedFunction(o.events.onHtmlRender)) {
                        Trigger.customEvent(o.events.onHtmlRender, f);
                    }
                    Y(o, c, i);
                }
            } else {
                m = true;
            }
        } else if (Is.definedSet(l)) {
            if (!o.ignore.setValues) {
                const t = Default2.getArrayFromSet(l);
                const n = DomElement.create(c, "span", o.showValueColors ? "set" : "");
                const r = DomElement.create(c, "div", "object-type-contents");
                let a = null;
                W(r, o);
                if (i) {
                    DomElement.addClass(r, "last-item");
                }
                f = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                p = "set";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                let u = Y(o, n, i);
                const g = R(d, u, r, o, t, a, true, i, s, p);
                if (!g && Is.defined(a)) {
                    a.parentNode.removeChild(a);
                }
            } else {
                m = true;
            }
        } else if (Is.definedArray(l)) {
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(c, "span", o.showValueColors ? "array" : "");
                const n = DomElement.create(c, "div", "object-type-contents");
                let r = null;
                W(n, o);
                if (i) {
                    DomElement.addClass(n, "last-item");
                }
                f = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                p = "array";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(t, "span", "size", `[${l.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    r = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                let a = Y(o, t, i);
                const u = R(d, a, n, o, l, r, true, i, s, p);
                if (!u && Is.defined(r)) {
                    r.parentNode.removeChild(r);
                }
            } else {
                m = true;
            }
        } else if (Is.definedMap(l)) {
            if (!o.ignore.mapValues) {
                const t = Default2.getObjectFromMap(l);
                const n = Obj.getPropertyNames(t, o);
                const r = n.length;
                if (r === 0 && o.ignore.emptyObjects) {
                    m = true;
                } else {
                    const l = DomElement.create(c, "span", o.showValueColors ? "map" : "");
                    const a = DomElement.create(c, "div", "object-type-contents");
                    let u = null;
                    W(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    f = DomElement.createWithHTML(l, "span", "main-title", e.text.mapText);
                    p = "map";
                    if (o.showObjectSizes && (r > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(l, "span", "size", `{${r}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                    }
                    let g = Y(o, l, i);
                    const m = P(d, g, a, o, t, n, u, true, i, s, p);
                    if (!m && Is.defined(u)) {
                        u.parentNode.removeChild(u);
                    }
                }
            } else {
                m = true;
            }
        } else if (Is.definedObject(l)) {
            if (!o.ignore.objectValues) {
                const t = Obj.getPropertyNames(l, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    m = true;
                } else {
                    const r = DomElement.create(c, "span", o.showValueColors ? "object" : "");
                    const a = DomElement.create(c, "div", "object-type-contents");
                    let u = null;
                    W(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    f = DomElement.createWithHTML(r, "span", "main-title", e.text.objectText);
                    p = "object";
                    if (o.showObjectSizes && (n > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    let g = Y(o, r, i);
                    const m = P(d, g, a, o, l, t, u, true, i, s, p);
                    if (!m && Is.defined(u)) {
                        u.parentNode.removeChild(u);
                    }
                }
            } else {
                m = true;
            }
        } else {
            if (!o.ignore.unknownValues) {
                g = o.showValueColors ? `${"unknown"} value non-value` : "value non-value";
                f = DomElement.createWithHTML(c, "span", g, l.toString());
                p = "unknown";
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, f);
                }
                Y(o, c, i);
            } else {
                m = true;
            }
        }
        if (m) {
            n.removeChild(c);
        } else {
            if (Is.defined(f)) {
                if (!w) {
                    H(o, p);
                    j(o, l, f);
                    M(o, l, f);
                }
                if (Is.defined(b)) {
                    if (p !== "null" && p !== "undefined" && p !== "array" && p !== "object" && p !== "map" && p !== "set") {
                        b.innerHTML = `(${p})`;
                    } else {
                        b.parentNode.removeChild(b);
                        b = null;
                    }
                }
                if (D) {
                    $(o, s, x, b, f);
                    U(o, f, l, p, T);
                }
            }
        }
    }
    function H(e, t) {
        if (e.sideMenu.showDataTypeCounts) {
            if (!e._currentView.dataTypeCounts.hasOwnProperty(t)) {
                e._currentView.dataTypeCounts[t] = 0;
            }
            e._currentView.dataTypeCounts[t]++;
        }
    }
    function W(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            DomElement.addClass(e, "object-border");
            if (!t.showArrowToggles) {
                DomElement.addClass(e, "object-border-no-arrow-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function $(e, t, n, o, r) {
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
                ToolTip.add(r, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
            }
        }
    }
    function z(e, t, n, o, r) {
        if (e.allowEditing.propertyNames) {
            o.ondblclick = l => {
                DomElement.cancelBubble(l);
                let a = 0;
                clearTimeout(e._currentView.valueClickTimerId);
                e._currentView.valueClickTimerId = 0;
                e._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                if (r) {
                    a = Arr.getIndexFromBrackets(o.innerHTML);
                    o.innerHTML = a.toString();
                } else {
                    o.innerHTML = o.innerHTML.replace(/['"]+/g, "");
                }
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
                        if (r) {
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
    function J(e, t, n, o, r, l, a) {
        if (a) {
            r.ondblclick = a => {
                DomElement.cancelBubble(a);
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
                r.onkeydown = i => {
                    if (i.code == "Escape") {
                        i.preventDefault();
                        r.setAttribute("contenteditable", "false");
                    } else if (i.code == "Enter") {
                        i.preventDefault();
                        const a = r.innerText;
                        if (a.trim() === "") {
                            if (l) {
                                t.splice(Arr.getIndexFromBrackets(n), 1);
                            } else {
                                delete t[n];
                            }
                        } else {
                            let r = null;
                            if (Is.definedBoolean(o)) {
                                r = a.toLowerCase() === "true";
                            } else if (Is.definedFloat(o) && !isNaN(+a)) {
                                r = parseFloat(a);
                            } else if (Is.definedNumber(o) && !isNaN(+a)) {
                                r = parseInt(a);
                            } else if (Is.definedString(o)) {
                                r = a;
                            } else if (Is.definedDate(o)) {
                                r = new Date(a);
                            } else if (Is.definedBigInt(o)) {
                                r = BigInt(a);
                            }
                            if (r !== null) {
                                if (l) {
                                    t[Arr.getIndexFromBrackets(n)] = r;
                                } else {
                                    t[n] = r;
                                }
                                Trigger.customEvent(e.events.onJsonEdit, e._currentView.element);
                            }
                        }
                        r.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function U(e, t, n, o, r) {
        if (Is.definedFunction(e.events.onValueClick)) {
            t.onclick = () => {
                if (r) {
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
    function Z(e, t, n, o, r, l, i) {
        const a = e._currentView.contentPanelsIndex;
        const s = e._currentView.contentPanelsDataIndex;
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(s)) {
            e._currentView.contentPanelsOpen[s] = {};
        }
        const u = () => {
            o.style.display = "none";
            e._currentView.contentPanelsOpen[s][a] = true;
            if (Is.defined(t)) {
                t.className = "right-arrow";
            }
            if (Is.defined(r)) {
                r.style.display = "none";
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
            if (Is.defined(r)) {
                r.style.display = "inline-block";
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
        let g = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[s].hasOwnProperty(a)) {
            g = e._currentView.contentPanelsOpen[s][a];
        } else {
            if (!e._currentView.initialized) {
                if (i === "object" && e.autoClose.objectSize > 0 && l >= e.autoClose.objectSize) {
                    g = true;
                } else if (i === "array" && e.autoClose.arraySize > 0 && l >= e.autoClose.arraySize) {
                    g = true;
                } else if (i === "map" && e.autoClose.mapSize > 0 && l >= e.autoClose.mapSize) {
                    g = true;
                } else if (i === "set" && e.autoClose.setSize > 0 && l >= e.autoClose.setSize) {
                    g = true;
                }
            }
            e._currentView.contentPanelsOpen[s][a] = g;
        }
        if (Is.defined(t)) {
            t.onclick = () => d(t.className === "down-arrow");
        }
        d(g);
        e._currentView.contentPanelsIndex++;
    }
    function Y(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function G(e, t, n, o, r) {
        let l = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles || e.showOpenedObjectArrayBorders) {
            DomElement.create(l, "div", "no-arrow");
        }
        DomElement.createWithHTML(l, "div", "object-type-end", n);
        Y(e, l, r);
    }
    function K(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => Q(t, n);
            t._currentView.element.ondragenter = () => Q(t, n);
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => X(e, t);
        }
    }
    function Q(e, t) {
        if (!e._currentView.columnDragging) {
            t.style.display = "block";
        }
    }
    function X(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            q(e.dataTransfer.files, t);
        }
    }
    function q(t, n) {
        const o = t.length;
        let r = 0;
        let l = [];
        const a = t => {
            r++;
            l.push(t);
            if (r === o) {
                n._currentView.dataArrayCurrentIndex = 0;
                n._currentView.contentPanelsOpen = {};
                n.data = l.length === 1 ? l[0] : l;
                i(n);
                F(n, e.text.importedText.replace("{0}", o.toString()));
                Trigger.customEvent(n.events.onSetJson, n._currentView.element);
            }
        };
        for (let e = 0; e < o; e++) {
            const n = t[e];
            const o = n.name.split(".").pop().toLowerCase();
            if (o === "json") {
                ee(n, a);
            }
        }
    }
    function ee(t, n) {
        const o = new FileReader;
        let r = null;
        o.onloadend = () => n(r);
        o.onload = t => {
            const n = Default2.getObjectFromString(t.target.result, e);
            if (n.parsed && Is.definedObject(n.object)) {
                r = n.object;
            }
        };
        o.readAsText(t);
    }
    function te(t) {
        let n = JSON.stringify(t.data, h, t.jsonIndentSpaces);
        if (Is.definedString(n)) {
            const o = DomElement.create(document.body, "a");
            o.style.display = "none";
            o.setAttribute("target", "_blank");
            o.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(n)}`);
            o.setAttribute("download", ne(t));
            o.click();
            document.body.removeChild(o);
            E(t);
            F(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function ne(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function oe(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => re(t, e)));
    }
    function re(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id) && !o._currentView.editMode) {
            if (le(e) && e.code === "F11") {
                e.preventDefault();
                x(o);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                D(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                y(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                w(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                b(o);
            } else if (e.code === "Escape") {
                e.preventDefault();
                E(o);
            }
        }
    }
    function le(e) {
        return e.ctrlKey || e.metaKey;
    }
    function ie(e) {
        e._currentView.element.innerHTML = "";
        DomElement.removeClass(e._currentView.element, "json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        oe(e, false);
        ToolTip.assignToEvents(e, false);
        ToolTip.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const ae = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return ae;
        },
        refreshAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return ae;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                l(Binding.Options.getForNewInstance(t, e));
            }
            return ae;
        },
        renderAll: function() {
            o();
            return ae;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                b(t[e]);
            }
            return ae;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                w(t[e]);
            }
            return ae;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    D(t[e]);
                }
            }
            return ae;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    y(t[e]);
                }
            }
            return ae;
        },
        getPageNumber: function(e) {
            let n = 1;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const o = t[e];
                n = Math.ceil((o._currentView.dataArrayCurrentIndex + 1) / o.paging.columnsPerPage);
            }
            return n;
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
            return ae;
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
                ie(t[e]);
                delete t[e];
                n--;
            }
            return ae;
        },
        destroyAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    ie(t[e]);
                }
            }
            t = {};
            n = 0;
            return ae;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const o = e;
                for (const r in t) {
                    if (t.hasOwnProperty(r) && e.hasOwnProperty(r) && o[r] !== t[r]) {
                        o[r] = t[r];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(o);
                }
            }
            return ae;
        },
        getIds: function() {
            const e = [];
            for (const n in t) {
                if (t.hasOwnProperty(n)) {
                    e.push(n);
                }
            }
            return e;
        },
        getVersion: function() {
            return "4.0.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => o()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = ae;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map