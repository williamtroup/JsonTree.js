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
    function t(e, t) {
        const n = e.length;
        for (let o = 0; o < n; o++) {
            const n = document.getElementsByTagName(e[o]);
            const r = [].slice.call(n);
            const l = r.length;
            for (let e = 0; e < l; e++) {
                if (!t(r[e])) {
                    break;
                }
            }
        }
    }
    e.find = t;
    function n(e, t, n = "", o = null) {
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
    e.create = n;
    function o(e, t, o, r, l = null) {
        const i = n(e, t, o, l);
        i.innerHTML = r;
        return i;
    }
    e.createWithHTML = o;
    function r(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        let o = n ? document.createTextNode("") : document.createElement(t);
        return o;
    }
    e.createWithNoContainer = r;
    function l(e, t) {
        e.classList.add(t);
    }
    e.addClass = l;
    function i(e, t) {
        e.classList.remove(t);
    }
    e.removeClass = i;
    function a(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    e.cancelBubble = a;
    function s() {
        const e = document.documentElement;
        const t = {
            left: e.scrollLeft - (e.clientLeft || 0),
            top: e.scrollTop - (e.clientTop || 0)
        };
        return t;
    }
    e.getScrollPosition = s;
    function u(e, t, n) {
        let o = e.pageX;
        let r = e.pageY;
        const l = s();
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
    e.showElementAtMousePosition = u;
    function c(e) {
        const t = document.createRange();
        t.selectNodeContents(e);
        const n = window.getSelection();
        n.removeAllRanges();
        n.addRange(t);
    }
    e.selectAllText = c;
    function d(e, t, r, l, i, a) {
        const s = n(e, "div", "checkbox");
        const u = n(s, "label", "checkbox");
        const c = n(u, "input");
        c.type = "checkbox";
        c.name = r;
        c.checked = l;
        n(u, "span", "check-mark");
        o(u, "span", `text ${i}`, t);
        if (Is.definedString(a)) {
            o(u, "span", `additional-text`, a);
        }
        return c;
    }
    e.createCheckBox = d;
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
            t = f(t);
            t = g(t);
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
            e.text.valueUpdatedText = Default2.getAnyString(e.text.valueUpdatedText, "Value updated.");
            e.text.jsonUpdatedText = Default2.getAnyString(e.text.jsonUpdatedText, "JSON updated.");
            e.text.nameUpdatedText = Default2.getAnyString(e.text.nameUpdatedText, "Property name updated.");
            e.text.indexUpdatedText = Default2.getAnyString(e.text.indexUpdatedText, "Array index updated.");
            e.text.itemDeletedText = Default2.getAnyString(e.text.itemDeletedText, "Item deleted.");
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
            } else if (Is.definedImage(t)) {
                n = t.src.length;
            } else if (Is.definedRegExp(t)) {
                n = t.source.length;
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
                if (!Is.definedFunction(t) && !Is.definedSymbol(t)) {
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
        DomElement.find(e.domElementTypes, (t => {
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
        }));
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
        l(e);
        ne(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function l(n, o = false) {
        let r = t[n._currentView.element.id].data;
        if (Is.definedUrl(r)) {
            Default2.getObjectFromUrl(r, e, (e => {
                i(n, o, e);
            }));
        } else {
            i(n, o, r);
        }
    }
    function i(e, t, n) {
        const o = u(e);
        ToolTip.hide(e);
        e._currentView.element.innerHTML = "";
        e._currentView.editMode = false;
        e._currentView.contentPanelsIndex = 0;
        e._currentView.sideMenuChanged = false;
        e._currentView.contentColumns = [];
        e._currentView.dataTypeCounts = {};
        m(e, n);
        const r = DomElement.create(e._currentView.element, "div", "contents");
        if (t) {
            DomElement.addClass(r, "page-switch");
        }
        if (e.paging.enabled && Is.definedArray(n)) {
            const t = Is.defined(n[e._currentView.dataArrayCurrentIndex + 1]);
            for (let l = 0; l < e.paging.columnsPerPage; l++) {
                const i = l + e._currentView.dataArrayCurrentIndex;
                const s = n[i];
                e._currentView.contentPanelsIndex = 0;
                e._currentView.contentPanelsDataIndex = i;
                if (Is.defined(s)) {
                    a(s, r, e, i, o[l], e.paging.columnsPerPage, t);
                }
            }
        } else {
            e._currentView.contentPanelsIndex = 0;
            e._currentView.contentPanelsDataIndex = 0;
            a(n, r, e, null, o[0], 1, false);
        }
        h(e);
        A(e);
        G(e);
        e._currentView.initialized = true;
    }
    function a(t, n, o, r, l, i, a) {
        const u = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        u.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, r.toString());
        u.onscroll = () => c(u, o);
        if (a && o.paging.allowColumnReordering && o.paging.columnsPerPage > 1 && o.allowEditing !== false) {
            u.setAttribute("draggable", "true");
            u.ondragstart = () => d(u, o, r);
            u.ondragend = () => f(u, o);
            u.ondragover = e => e.preventDefault();
            u.ondrop = () => g(o, r);
        }
        o._currentView.contentColumns.push(u);
        if (Is.definedArray(t) || Is.definedSet(t)) {
            N(u, o, t);
        } else if (Is.definedObject(t)) {
            F(u, o, t, r);
        }
        if (u.innerHTML === "" || u.children.length >= 2 && (!o.showOpenedObjectArrayBorders && u.children[1].children.length === 0 || u.children[1].children.length === 1)) {
            u.innerHTML = "";
            DomElement.createWithHTML(u, "span", "no-json-text", e.text.noJsonToViewText);
            o._currentView.titleBarButtons.style.display = "none";
        } else {
            if (Is.defined(l)) {
                u.scrollTop = l;
            }
            o._currentView.titleBarButtons.style.display = "block";
        }
        s(o, t, u, r);
    }
    function s(t, n, o, r) {
        if (t._currentView.isBulkEditingEnabled) {
            o.ondblclick = i => {
                let a = null;
                DomElement.cancelBubble(i);
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(o, "editable");
                o.setAttribute("contenteditable", "true");
                o.innerText = JSON.stringify(n, y, t.jsonIndentSpaces);
                o.focus();
                DomElement.selectAllText(o);
                o.onblur = () => {
                    l(t, false);
                    if (Is.definedString(a)) {
                        j(t, a);
                    }
                };
                o.onkeydown = n => {
                    if (n.code == "Escape") {
                        n.preventDefault();
                        o.setAttribute("contenteditable", "false");
                    } else if (re(n) && n.code == "Enter") {
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
                        a = e.text.jsonUpdatedText;
                        o.setAttribute("contenteditable", "false");
                    } else if (n.code == "Enter") {
                        n.preventDefault();
                        document.execCommand("insertLineBreak");
                    }
                };
            };
        }
    }
    function u(e) {
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
    function c(e, t) {
        ToolTip.hide(t);
        if (t.paging.synchronizeScrolling) {
            const n = e.scrollTop;
            const o = e.scrollLeft;
            const r = t._currentView.contentColumns.length;
            for (let e = 0; e < r; e++) {
                t._currentView.contentColumns[e].scrollTop = n;
                t._currentView.contentColumns[e].scrollLeft = o;
            }
        }
    }
    function d(e, t, n) {
        t._currentView.columnDragging = true;
        t._currentView.columnDraggingDataIndex = n;
        e.classList.add("draggable-item");
    }
    function f(e, t) {
        t._currentView.columnDragging = false;
        e.classList.remove("draggable-item");
    }
    function g(e, t) {
        e._currentView.columnDragging = false;
        if (t !== e._currentView.columnDraggingDataIndex) {
            const n = e.data[t];
            const o = e.data[e._currentView.columnDraggingDataIndex];
            const r = e._currentView.contentPanelsOpen[t];
            const i = e._currentView.contentPanelsOpen[e._currentView.columnDraggingDataIndex];
            e.data[t] = o;
            e.data[e._currentView.columnDraggingDataIndex] = n;
            e._currentView.contentPanelsOpen[t] = i;
            e._currentView.contentPanelsOpen[e._currentView.columnDraggingDataIndex] = r;
            l(e);
        }
    }
    function m(t, n) {
        if (Is.definedString(t.title.text) || t.title.showTreeControls || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => p(t);
            }
            if (t.sideMenu.enabled && Is.definedObject(n)) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => S(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyAllButtonSymbolText);
                o.onclick = () => x(t, n);
                o.ondblclick = DomElement.cancelBubble;
                if (t.paging.copyOnlyCurrentPage && t.paging.enabled) {
                    ToolTip.add(o, t, e.text.copyButtonText);
                } else {
                    ToolTip.add(o, t, e.text.copyAllButtonText);
                }
            }
            if (t.title.showTreeControls) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "openAll", e.text.openAllButtonSymbolText);
                n.onclick = () => T(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "closeAll", e.text.closeAllButtonSymbolText);
                o.onclick = () => b(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.paging.enabled && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => w(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
                    t._currentView.nextButton.onclick = () => D(t);
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
                t._currentView.toggleFullScreenButton.onclick = () => p(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function p(t) {
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
            C(t);
        }
    }
    function x(t, n) {
        let o = null;
        let r = y;
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
        j(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, o);
    }
    function T(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        l(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function b(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        l(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function w(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex -= e.paging.columnsPerPage;
            l(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function D(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex += e.paging.columnsPerPage;
            l(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function y(t, n) {
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
    function h(t) {
        if (t.sideMenu.enabled) {
            t._currentView.disabledBackground = DomElement.create(t._currentView.element, "div", "side-menu-disabled-background");
            t._currentView.disabledBackground.onclick = () => v(t);
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showExportButton) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => ee(t);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => V(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const r = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            r.onclick = () => v(t);
            ToolTip.add(r, t, e.text.closeButtonText);
            const l = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
            E(l, t);
        }
    }
    function V(e) {
        const t = DomElement.createWithNoContainer("input");
        t.type = "file";
        t.accept = ".json";
        t.multiple = true;
        t.onchange = () => X(t.files, e);
        t.click();
    }
    function S(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
        }
    }
    function v(t) {
        if (t._currentView.sideMenu.classList.contains("side-menu-open")) {
            t._currentView.sideMenu.classList.remove("side-menu-open");
            t._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(t);
            if (t._currentView.sideMenuChanged) {
                setTimeout((() => {
                    l(t);
                    j(t, e.text.ignoreDataTypesUpdated);
                }), 500);
            }
        }
    }
    function E(t, n) {
        const o = [];
        const r = DomElement.create(t, "div", "settings-panel");
        const l = DomElement.create(r, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(l, "div", "settings-panel-title-text", `${e.text.showTypesText}:`);
        const i = DomElement.create(l, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => B(n, o, true);
        s.onclick = () => B(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(r, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            o.push(I(u, e, n, !d[`${e}Values`]));
        }));
    }
    function B(e, t, n) {
        const o = t.length;
        const r = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            r[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function I(e, t, n, o) {
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
    function A(t) {
        if (t.footer.enabled) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            C(t);
            t._currentView.footerStatusText = DomElement.createWithHTML(t._currentView.footer, "div", "status-text", e.text.waitingText);
            if (t.footer.showLengths) {
                t._currentView.footerLengthText = DomElement.create(t._currentView.footer, "div", "status-value-length");
                t._currentView.footerLengthText.style.display = "none";
            }
            if (t.footer.showSizes) {
                t._currentView.footerSizeText = DomElement.create(t._currentView.footer, "div", "status-value-size");
                t._currentView.footerSizeText.style.display = "none";
            }
            if (t.paging.enabled && t.footer.showPageOf) {
                t._currentView.footerPageText = DomElement.create(t._currentView.footer, "div", "status-page-index");
                _(t);
            }
        }
    }
    function _(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.dataArrayCurrentIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const r = DomElement.createWithHTML(null, "span", "status-count", n.toFixed()).outerHTML;
            const l = DomElement.createWithHTML(null, "span", "status-count", o.toFixed()).outerHTML;
            const i = e.text.pageOfText.replace("{0}", r).replace("{1}", l);
            t._currentView.footerPageText.innerHTML = i;
        }
    }
    function C(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function O(t, n, o) {
        if (t.footer.enabled && t.footer.showLengths) {
            const r = Size.length(n);
            if (r > 0) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", r.toString()).outerHTML;
                    const o = e.text.lengthText.replace("{0}", n);
                    t._currentView.footerLengthText.style.display = "block";
                    t._currentView.footerLengthText.innerHTML = o;
                }));
                o.addEventListener("mouseleave", (() => {
                    t._currentView.footerLengthText.style.display = "none";
                    t._currentView.footerLengthText.innerHTML = "";
                }));
            }
        }
    }
    function M(t, n, o) {
        if (t.footer.enabled && t.footer.showSizes) {
            const r = Size.of(n);
            if (Is.definedString(r)) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", r.toString()).outerHTML;
                    const o = e.text.sizeText.replace("{0}", n);
                    t._currentView.footerSizeText.style.display = "block";
                    t._currentView.footerSizeText.innerHTML = o;
                }));
                o.addEventListener("mouseleave", (() => {
                    t._currentView.footerSizeText.style.display = "none";
                    t._currentView.footerSizeText.innerHTML = "";
                }));
            }
        }
    }
    function j(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), 5e3);
        }
    }
    function F(t, n, o, r) {
        const l = Is.definedMap(o);
        const i = l ? "map" : "object";
        const a = l ? Default2.getObjectFromMap(o) : o;
        const s = Obj.getPropertyNames(a, n);
        const u = s.length;
        if (u !== 0 || !n.ignore.emptyObjects) {
            const c = DomElement.create(t, "div", "object-type-title");
            const d = DomElement.create(t, "div", "object-type-contents last-item");
            const f = n.showArrowToggles ? DomElement.create(c, "div", "down-arrow") : null;
            const g = DomElement.createWithHTML(c, "span", n.showValueColors ? `${i} main-title` : "main-title", l ? e.text.mapText : e.text.objectText);
            let m = null;
            H(d, n);
            if (n.paging.enabled) {
                let e = n.useZeroIndexingForArrays ? r.toString() : (r + 1).toString();
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
            L(f, null, d, n, a, s, m, false, true, "", i);
            U(n, g, o, i, false);
            M(n, o, g);
            O(n, o, g);
        }
    }
    function N(t, n, o) {
        const r = Is.definedSet(o);
        const l = r ? "set" : "array";
        const i = r ? Default2.getArrayFromSet(o) : o;
        const a = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const u = n.showArrowToggles ? DomElement.create(a, "div", "down-arrow") : null;
        const c = DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} main-title` : "main-title", r ? e.text.setText : e.text.arrayText);
        let d = null;
        H(s, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} size` : "size", `[${i.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            d = DomElement.createWithHTML(a, "span", "opening-symbol", "[");
        }
        P(u, null, s, n, i, d, false, true, "", l);
        U(n, c, o, l, false);
        M(n, o, c);
        O(n, o, c);
    }
    function L(t, n, o, r, l, i, a, s, u, c, d) {
        let f = true;
        const g = i.length;
        const m = c !== "" ? g : 0;
        if (g === 0 && !r.ignore.emptyObjects) {
            R(l, o, r, "", e.text.noPropertiesText, true, false, "", d);
            f = false;
        } else {
            for (let e = 0; e < g; e++) {
                const t = i[e];
                const n = c === "" ? t : `${c}${"\\"}${t}`;
                if (l.hasOwnProperty(t)) {
                    R(l, o, r, t, l[t], e === g - 1, false, n, d);
                }
            }
            if (o.children.length === 0 || r.showOpenedObjectArrayBorders && o.children.length === 1) {
                R(l, o, r, "", e.text.noPropertiesText, true, false, "", d);
                f = false;
            } else {
                if (r.showOpeningClosingCurlyBraces) {
                    Y(r, o, "}", s, u);
                }
            }
        }
        J(r, t, n, o, a, m, d);
        return f;
    }
    function P(t, n, o, r, l, i, a, s, u, c) {
        let d = true;
        const f = l.length;
        const g = u !== "" ? f : 0;
        if (!r.reverseArrayValues) {
            for (let e = 0; e < f; e++) {
                const t = Arr.getIndex(e, r);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                R(l, o, r, Arr.getIndexName(r, t, f), l[e], e === f - 1, true, n, c);
            }
        } else {
            for (let e = f; e--; ) {
                const t = Arr.getIndex(e, r);
                const n = u === "" ? t.toString() : `${u}${"\\"}${t}`;
                R(l, o, r, Arr.getIndexName(r, t, f), l[e], e === 0, true, n, c);
            }
        }
        if (o.children.length === 0 || r.showOpenedObjectArrayBorders && o.children.length === 1) {
            R(l, o, r, "", e.text.noPropertiesText, true, false, "", c);
            d = false;
        } else {
            if (r.showOpeningClosingCurlyBraces) {
                Y(r, o, "]", a, s);
            }
        }
        J(r, t, n, o, i, g, c);
        return d;
    }
    function R(t, n, o, r, l, i, a, s, u) {
        const c = DomElement.create(n, "div", "object-type-value");
        const d = o.showArrowToggles ? DomElement.create(c, "div", "no-arrow") : null;
        let f = null;
        let g = null;
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
            $(o, t, r, x, a);
            if (!a) {
                M(o, r, x);
                O(o, r, x);
            }
        }
        if (l === null) {
            if (!o.ignore.nullValues) {
                f = o.showValueColors ? `${"null"} value undefined-or-null` : "value undefined-or-null";
                g = DomElement.createWithHTML(c, "span", f, "null");
                p = "null";
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (l === void 0) {
            if (!o.ignore.undefinedValues) {
                f = o.showValueColors ? `${"undefined"} value undefined-or-null` : "value undefined-or-null";
                g = DomElement.createWithHTML(c, "span", f, "undefined");
                p = "undefined";
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFunction(l)) {
            const t = Default2.getFunctionName(l, e);
            if (t.isLambda) {
                if (!o.ignore.lambdaValues) {
                    f = o.showValueColors ? `${"lambda"} value non-value` : "value non-value";
                    g = DomElement.createWithHTML(c, "span", f, t.name);
                    p = "lambda";
                    if (Is.definedFunction(o.events.onLambdaRender)) {
                        Trigger.customEvent(o.events.onLambdaRender, g);
                    }
                    Z(o, c, i);
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
                    Z(o, c, i);
                } else {
                    m = true;
                }
            }
        } else if (Is.definedBoolean(l)) {
            if (!o.ignore.booleanValues) {
                f = o.showValueColors ? `${"boolean"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l);
                p = "boolean";
                T = o.allowEditing.booleanValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedFloat(l)) {
            if (!o.ignore.floatValues) {
                const e = Default2.getFixedFloatPlacesValue(l, o.maximumDecimalPlaces);
                f = o.showValueColors ? `${"float"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, e);
                p = "float";
                T = o.allowEditing.floatValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onFloatRender)) {
                    Trigger.customEvent(o.events.onFloatRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedNumber(l)) {
            if (!o.ignore.numberValues) {
                f = o.showValueColors ? `${"number"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l);
                p = "number";
                T = o.allowEditing.numberValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedBigInt(l)) {
            if (!o.ignore.bigintValues) {
                f = o.showValueColors ? `${"bigint"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l);
                p = "bigint";
                T = o.allowEditing.bigIntValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.String.guid(l)) {
            if (!o.ignore.guidValues) {
                f = o.showValueColors ? `${"guid"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l);
                p = "guid";
                T = o.allowEditing.guidValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && (Is.String.hexColor(l) || Is.String.rgbColor(l))) {
            if (!o.ignore.colorValues) {
                f = o.showValueColors ? `${"color"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l);
                p = "color";
                T = o.allowEditing.colorValues;
                if (o.showValueColors) {
                    g.style.color = l;
                }
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.definedUrl(l)) {
            if (!o.ignore.urlValues) {
                let n = l;
                if (o.maximumUrlLength > 0 && n.length > o.maximumUrlLength) {
                    n = n.substring(0, o.maximumUrlLength) + e.text.ellipsisText;
                }
                f = o.showValueColors ? `${"url"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, n);
                p = "url";
                T = o.allowEditing.urlValues;
                if (o.showUrlOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(l);
                }
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onUrlRender)) {
                    Trigger.customEvent(o.events.onUrlRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l) && Is.definedEmail(l)) {
            if (!o.ignore.emailValues) {
                let n = l;
                if (o.maximumEmailLength > 0 && n.length > o.maximumEmailLength) {
                    n = n.substring(0, o.maximumEmailLength) + e.text.ellipsisText;
                }
                f = o.showValueColors ? `${"email"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, n);
                p = "email";
                T = o.allowEditing.emailValues;
                if (o.showEmailOpenButtons) {
                    const t = DomElement.createWithHTML(c, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    t.onclick = () => window.open(`mailto:${l}`);
                }
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onEmailRender)) {
                    Trigger.customEvent(o.events.onEmailRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedString(l)) {
            if (!o.ignore.stringValues || w) {
                if (o.parse.stringsToBooleans && Is.String.boolean(l)) {
                    R(t, n, o, r, l.toString().toLowerCase().trim() === "true", i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToNumbers && !isNaN(l)) {
                    R(t, n, o, r, parseFloat(l), i, a, s, u);
                    m = true;
                } else if (o.parse.stringsToDates && Is.String.date(l)) {
                    R(t, n, o, r, new Date(l), i, a, s, u);
                    m = true;
                } else {
                    let n = l;
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
                        D = false;
                    }
                    g = DomElement.createWithHTML(c, "span", f, n);
                    p = "string";
                    if (!w) {
                        z(o, t, r, l, g, a, T);
                        if (Is.definedFunction(o.events.onStringRender)) {
                            Trigger.customEvent(o.events.onStringRender, g);
                        }
                        Z(o, c, i);
                    }
                }
            } else {
                m = true;
            }
        } else if (Is.definedDate(l)) {
            if (!o.ignore.dateValues) {
                f = o.showValueColors ? `${"date"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, DateTime.getCustomFormattedDateText(e, l, o.dateTimeFormat));
                p = "date";
                T = o.allowEditing.dateValues;
                z(o, t, r, l, g, a, T);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedSymbol(l)) {
            if (!o.ignore.symbolValues) {
                f = o.showValueColors ? `${"symbol"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l.toString());
                p = "symbol";
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedRegExp(l)) {
            if (!o.ignore.regexpValues) {
                f = o.showValueColors ? `${"regexp"} value` : "value";
                g = DomElement.createWithHTML(c, "span", f, l.source.toString());
                p = "regexp";
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        } else if (Is.definedImage(l)) {
            if (!o.ignore.imageValues) {
                f = o.showValueColors ? `${"image"} value` : "value";
                g = DomElement.create(c, "span", f);
                p = "image";
                const e = DomElement.create(g, "img");
                e.src = l.src;
                if (Is.definedFunction(o.events.onImageRender)) {
                    Trigger.customEvent(o.events.onImageRender, g);
                }
                Z(o, c, i);
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
                        H(a, o);
                        if (i) {
                            DomElement.addClass(a, "last-item");
                        }
                        g = DomElement.createWithHTML(l, "span", "main-title", e.text.htmlText);
                        p = "html";
                        if (o.showObjectSizes && (r > 0 || !o.ignore.emptyObjects)) {
                            DomElement.createWithHTML(l, "span", "size", `{${r}}`);
                        }
                        if (o.showOpeningClosingCurlyBraces) {
                            u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                        }
                        let f = Z(o, l, i);
                        const m = L(d, f, a, o, t, n, u, true, i, s, p);
                        if (!m && Is.defined(u)) {
                            u.parentNode.removeChild(u);
                        }
                    }
                } else {
                    f = o.showValueColors ? `${"html"} value` : "value";
                    g = DomElement.createWithHTML(c, "span", f, l.tagName.toLowerCase());
                    p = "html";
                    if (Is.definedFunction(o.events.onHtmlRender)) {
                        Trigger.customEvent(o.events.onHtmlRender, g);
                    }
                    Z(o, c, i);
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
                H(r, o);
                if (i) {
                    DomElement.addClass(r, "last-item");
                }
                g = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                p = "set";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                let u = Z(o, n, i);
                const f = P(d, u, r, o, t, a, true, i, s, p);
                if (!f && Is.defined(a)) {
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
                H(n, o);
                if (i) {
                    DomElement.addClass(n, "last-item");
                }
                g = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                p = "array";
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(t, "span", "size", `[${l.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    r = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                let a = Z(o, t, i);
                const u = P(d, a, n, o, l, r, true, i, s, p);
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
                    H(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    g = DomElement.createWithHTML(l, "span", "main-title", e.text.mapText);
                    p = "map";
                    if (o.showObjectSizes && (r > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(l, "span", "size", `{${r}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                    }
                    let f = Z(o, l, i);
                    const m = L(d, f, a, o, t, n, u, true, i, s, p);
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
                    H(a, o);
                    if (i) {
                        DomElement.addClass(a, "last-item");
                    }
                    g = DomElement.createWithHTML(r, "span", "main-title", e.text.objectText);
                    p = "object";
                    if (o.showObjectSizes && (n > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    let f = Z(o, r, i);
                    const m = L(d, f, a, o, l, t, u, true, i, s, p);
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
                g = DomElement.createWithHTML(c, "span", f, l.toString());
                p = "unknown";
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, g);
                }
                Z(o, c, i);
            } else {
                m = true;
            }
        }
        if (m) {
            n.removeChild(c);
        } else {
            if (Is.defined(g)) {
                if (!w) {
                    k(o, p);
                    M(o, l, g);
                    O(o, l, g);
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
                    W(o, s, x, b, g);
                    U(o, g, l, p, T);
                }
            }
        }
    }
    function k(e, t) {
        if (e.sideMenu.showDataTypeCounts) {
            if (!e._currentView.dataTypeCounts.hasOwnProperty(t)) {
                e._currentView.dataTypeCounts[t] = 0;
            }
            e._currentView.dataTypeCounts[t]++;
        }
    }
    function H(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            DomElement.addClass(e, "object-border");
            if (!t.showArrowToggles) {
                DomElement.addClass(e, "object-border-no-arrow-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function W(e, t, n, o, r) {
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
    function $(t, n, o, r, i) {
        if (t.allowEditing.propertyNames) {
            r.ondblclick = a => {
                DomElement.cancelBubble(a);
                let s = 0;
                let u = null;
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(r, "editable");
                if (i) {
                    s = Arr.getIndexFromBrackets(r.innerHTML);
                    r.innerHTML = s.toString();
                } else {
                    r.innerHTML = r.innerHTML.replace(/['"]+/g, "");
                }
                r.setAttribute("contenteditable", "true");
                r.focus();
                DomElement.selectAllText(r);
                r.onblur = () => {
                    l(t, false);
                    if (Is.definedString(u)) {
                        j(t, u);
                    }
                };
                r.onkeydown = l => {
                    if (l.code == "Escape") {
                        l.preventDefault();
                        r.setAttribute("contenteditable", "false");
                    } else if (l.code == "Enter") {
                        l.preventDefault();
                        const a = r.innerText;
                        if (i) {
                            if (!isNaN(+a)) {
                                let o = +a;
                                if (!t.useZeroIndexingForArrays) {
                                    o--;
                                }
                                if (s !== o) {
                                    u = e.text.indexUpdatedText;
                                    Arr.moveIndex(n, s, o);
                                    Trigger.customEvent(t.events.onJsonEdit, t._currentView.element);
                                }
                            }
                        } else {
                            if (a !== o) {
                                if (a.trim() === "") {
                                    u = e.text.itemDeletedText;
                                    delete n[o];
                                } else {
                                    if (!n.hasOwnProperty(a)) {
                                        u = e.text.nameUpdatedText;
                                        const t = n[o];
                                        delete n[o];
                                        n[a] = t;
                                    }
                                }
                                Trigger.customEvent(t.events.onJsonEdit, t._currentView.element);
                            }
                        }
                        r.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function z(t, n, o, r, i, a, s) {
        if (s) {
            i.ondblclick = s => {
                let u = null;
                DomElement.cancelBubble(s);
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                DomElement.addClass(i, "editable");
                i.setAttribute("contenteditable", "true");
                if (Is.definedDate(r) && !t.includeTimeZoneInDateTimeEditing) {
                    i.innerText = JSON.stringify(r).replace(/['"]+/g, "");
                } else {
                    i.innerText = r.toString();
                }
                i.focus();
                DomElement.selectAllText(i);
                i.onblur = () => {
                    l(t, false);
                    if (Is.definedString(u)) {
                        j(t, u);
                    }
                };
                i.onkeydown = l => {
                    if (l.code == "Escape") {
                        l.preventDefault();
                        i.setAttribute("contenteditable", "false");
                    } else if (l.code == "Enter") {
                        l.preventDefault();
                        const s = i.innerText;
                        if (s.trim() === "") {
                            if (a) {
                                n.splice(Arr.getIndexFromBrackets(o), 1);
                            } else {
                                delete n[o];
                            }
                            u = e.text.itemDeletedText;
                        } else {
                            let l = null;
                            if (Is.definedBoolean(r)) {
                                l = s.toLowerCase() === "true";
                            } else if (Is.definedFloat(r) && !isNaN(+s)) {
                                l = parseFloat(s);
                            } else if (Is.definedNumber(r) && !isNaN(+s)) {
                                l = parseInt(s);
                            } else if (Is.definedString(r)) {
                                l = s;
                            } else if (Is.definedDate(r)) {
                                l = new Date(s);
                            } else if (Is.definedBigInt(r)) {
                                l = BigInt(s);
                            }
                            if (l !== null) {
                                if (a) {
                                    n[Arr.getIndexFromBrackets(o)] = l;
                                } else {
                                    n[o] = l;
                                }
                                u = e.text.valueUpdatedText;
                                Trigger.customEvent(t.events.onJsonEdit, t._currentView.element);
                            }
                        }
                        i.setAttribute("contenteditable", "false");
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
    function J(e, t, n, o, r, l, i) {
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
        let f = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[s].hasOwnProperty(a)) {
            f = e._currentView.contentPanelsOpen[s][a];
        } else {
            if (!e._currentView.initialized) {
                if (i === "object" && e.autoClose.objectSize > 0 && l >= e.autoClose.objectSize) {
                    f = true;
                } else if (i === "array" && e.autoClose.arraySize > 0 && l >= e.autoClose.arraySize) {
                    f = true;
                } else if (i === "map" && e.autoClose.mapSize > 0 && l >= e.autoClose.mapSize) {
                    f = true;
                } else if (i === "set" && e.autoClose.setSize > 0 && l >= e.autoClose.setSize) {
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
    function Z(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function Y(e, t, n, o, r) {
        let l = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles || e.showOpenedObjectArrayBorders) {
            DomElement.create(l, "div", "no-arrow");
        }
        DomElement.createWithHTML(l, "div", "object-type-end", n);
        Z(e, l, r);
    }
    function G(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => K(t, n);
            t._currentView.element.ondragenter = () => K(t, n);
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => Q(e, t);
        }
    }
    function K(e, t) {
        if (!e._currentView.columnDragging) {
            t.style.display = "block";
        }
    }
    function Q(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            X(e.dataTransfer.files, t);
        }
    }
    function X(t, n) {
        const o = t.length;
        let r = 0;
        let i = [];
        const a = t => {
            r++;
            i.push(t);
            if (r === o) {
                n._currentView.dataArrayCurrentIndex = 0;
                n._currentView.contentPanelsOpen = {};
                n.data = i.length === 1 ? i[0] : i;
                l(n);
                j(n, e.text.importedText.replace("{0}", o.toString()));
                Trigger.customEvent(n.events.onSetJson, n._currentView.element);
            }
        };
        for (let e = 0; e < o; e++) {
            const n = t[e];
            const o = n.name.split(".").pop().toLowerCase();
            if (o === "json") {
                q(n, a);
            }
        }
    }
    function q(t, n) {
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
    function ee(t) {
        let n = JSON.stringify(t.data, y, t.jsonIndentSpaces);
        if (Is.definedString(n)) {
            const o = DomElement.create(document.body, "a");
            o.style.display = "none";
            o.setAttribute("target", "_blank");
            o.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(n)}`);
            o.setAttribute("download", te(t));
            o.click();
            document.body.removeChild(o);
            v(t);
            j(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function te(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function ne(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => oe(t, e)));
    }
    function oe(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id) && !o._currentView.editMode) {
            if (re(e) && e.code === "F11") {
                e.preventDefault();
                p(o);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                w(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                D(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                b(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                T(o);
            } else if (e.code === "Escape") {
                e.preventDefault();
                v(o);
            }
        }
    }
    function re(e) {
        return e.ctrlKey || e.metaKey;
    }
    function le(e) {
        e._currentView.element.innerHTML = "";
        DomElement.removeClass(e._currentView.element, "json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        ne(e, false);
        ToolTip.assignToEvents(e, false);
        ToolTip.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const ie = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                l(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return ie;
        },
        refreshAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    l(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return ie;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e));
            }
            return ie;
        },
        renderAll: function() {
            o();
            return ie;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                T(t[e]);
            }
            return ie;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                b(t[e]);
            }
            return ie;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    w(t[e]);
                }
            }
            return ie;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    D(t[e]);
                }
            }
            return ie;
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
                const i = t[n];
                i._currentView.dataArrayCurrentIndex = 0;
                i._currentView.contentPanelsOpen = {};
                i.data = r;
                l(i);
                Trigger.customEvent(i.events.onSetJson, i._currentView.element);
            }
            return ie;
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
                le(t[e]);
                delete t[e];
                n--;
            }
            return ie;
        },
        destroyAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    le(t[e]);
                }
            }
            t = {};
            n = 0;
            return ie;
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
            return ie;
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
            window.$jsontree = ie;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map