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
        function i(e) {
            let t = e.endsWith("n");
            if (t) {
                t = !isNaN(+e.substring(0, e.length - 1));
            }
            return t;
        }
        e.bigInt = i;
        function a(e) {
            return e.startsWith("Symbol(") && e.endsWith(")");
        }
        e.symbol = a;
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
        return e !== null && e !== void 0 && e instanceof Array;
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
    e.definedHtml = T;
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
    function y(e) {
        const t = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e);
    }
    e.definedEmail = y;
    function w(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = w;
})(Is || (Is = {}));

var Convert2;

(Convert => {
    function stringifyJson(e, t, n, o) {
        if (Is.definedBigInt(t)) {
            t = t.toString();
        } else if (Is.definedSymbol(t)) {
            t = symbolToString(t);
        } else if (Is.definedFunction(t)) {
            t = Default.getFunctionName(t, n).name;
        } else if (Is.definedMap(t)) {
            t = mapToObject(t);
        } else if (Is.definedSet(t)) {
            t = setToArray(t);
        } else if (Is.definedRegExp(t)) {
            t = t.source;
        } else if (Is.definedImage(t)) {
            t = t.src;
        } else if (Is.definedHtml(t)) {
            t = htmlToObject(t, o);
        }
        return t;
    }
    Convert.stringifyJson = stringifyJson;
    function stringToDataTypeValue(e, t) {
        let n = null;
        try {
            if (Is.definedBoolean(e)) {
                if (t.toLowerCase().trim() === "true") {
                    n = true;
                } else if (t.toLowerCase().trim() === "false") {
                    n = false;
                }
            } else if (Is.definedFloat(e) && !isNaN(+t)) {
                n = parseFloat(t);
            } else if (Is.definedNumber(e) && !isNaN(+t)) {
                n = parseInt(t);
            } else if (Is.definedString(e)) {
                n = t;
            } else if (Is.definedDate(e)) {
                n = new Date(t);
            } else if (Is.definedBigInt(e)) {
                n = BigInt(t);
            } else if (Is.definedRegExp(e)) {
                n = new RegExp(t);
            } else if (Is.definedSymbol(e)) {
                n = Symbol(t);
            } else if (Is.definedImage(e)) {
                n = new Image;
                n.src = t;
            }
        } catch (e) {
            n = null;
        }
        return n;
    }
    Convert.stringToDataTypeValue = stringToDataTypeValue;
    function htmlToObject(e, t) {
        const n = {};
        const o = e.attributes.length;
        const l = e.children.length;
        const r = "&children";
        const i = "#text";
        const a = e.cloneNode(true);
        let s = a.children.length;
        while (s > 0) {
            if (a.children[0].nodeType !== Node.TEXT_NODE) {
                a.removeChild(a.children[0]);
            }
            s--;
        }
        n[r] = [];
        n[i] = a.innerText;
        for (let t = 0; t < o; t++) {
            const o = e.attributes[t];
            if (Is.definedString(o.nodeName)) {
                n[`@${o.nodeName}`] = o.nodeValue;
            }
        }
        for (let t = 0; t < l; t++) {
            n[r].push(e.children[t]);
        }
        if (t) {
            const t = getComputedStyle(e);
            const o = t.length;
            for (let e = 0; e < o; e++) {
                const o = t[e];
                const l = `$${o}`;
                const r = t.getPropertyValue(o);
                n[l] = r;
            }
        }
        if (n[r].length === 0) {
            delete n[r];
        }
        if (!Is.definedString(n[i])) {
            delete n[i];
        }
        return n;
    }
    Convert.htmlToObject = htmlToObject;
    function mapToObject(e) {
        const t = Object.fromEntries(e.entries());
        return t;
    }
    Convert.mapToObject = mapToObject;
    function setToArray(e) {
        const t = Array.from(e.values());
        return t;
    }
    Convert.setToArray = setToArray;
    function jsonStringToObject(objectString, configuration) {
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
    Convert.jsonStringToObject = jsonStringToObject;
    function numberToFloatWithDecimalPlaces(e, t) {
        const n = new RegExp(`^-?\\d+(?:.\\d{0,${t || -1}})?`);
        return e.toString().match(n)?.[0] || "";
    }
    Convert.numberToFloatWithDecimalPlaces = numberToFloatWithDecimalPlaces;
    function stringToBigInt(e) {
        return BigInt(e.substring(0, e.length - 1));
    }
    Convert.stringToBigInt = stringToBigInt;
    function symbolToString(e) {
        return e.toString().replace("Symbol(", "").replace(")", "");
    }
    Convert.symbolToString = symbolToString;
})(Convert2 || (Convert2 = {}));

var Default;

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
    function l(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getNumber = l;
    function r(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getFunction = r;
    function i(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getArray = i;
    function a(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getObject = a;
    function s(e, t, n) {
        return Is.definedNumber(e) ? e >= n ? e : n : t;
    }
    e.getNumberMinimum = s;
    function u(e, t, n) {
        return Is.definedNumber(e) ? e > n ? n : e : t;
    }
    e.getNumberMaximum = u;
    function c(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split(" ");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = i(e, t);
        }
        return n;
    }
    e.getStringOrArray = c;
    function d(e, t) {
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
    e.getFunctionName = d;
    function f(e, t, n) {
        const o = new XMLHttpRequest;
        o.open("GET", e, true);
        o.send();
        o.onreadystatechange = () => {
            if (o.readyState === 4 && o.status === 200) {
                const e = o.responseText;
                const l = Convert2.jsonStringToObject(e, t);
                if (l.parsed) {
                    n(l.object);
                }
            } else {
                n(null);
            }
        };
    }
    e.getObjectFromUrl = f;
})(Default || (Default = {}));

var DomElement;

(e => {
    function t(e, t) {
        const n = e.length;
        for (let o = 0; o < n; o++) {
            const n = document.getElementsByTagName(e[o]);
            const l = [].slice.call(n);
            const r = l.length;
            for (let e = 0; e < r; e++) {
                if (!t(l[e])) {
                    break;
                }
            }
        }
    }
    e.find = t;
    function n(e, t, n) {
        const o = t.length;
        for (let l = 0; l < o; l++) {
            const o = e.getElementsByClassName(t[l]);
            const r = [].slice.call(o);
            const i = r.length;
            for (let e = 0; e < i; e++) {
                if (!n(r[e])) {
                    break;
                }
            }
        }
    }
    e.findByClassNames = n;
    function o(e, t, n = "", o = null) {
        const l = t.toLowerCase();
        const r = l === "text";
        let i = r ? document.createTextNode("") : document.createElement(l);
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
    e.create = o;
    function l(e, t, n, l, r = null) {
        const i = o(e, t, n, r);
        i.innerHTML = l;
        return i;
    }
    e.createWithHTML = l;
    function r(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        let o = n ? document.createTextNode("") : document.createElement(t);
        return o;
    }
    e.createWithNoContainer = r;
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
    function c(e, t, n, r, i, a) {
        const s = o(e, "div", "checkbox");
        const u = o(s, "label", "checkbox");
        const c = o(u, "input");
        c.type = "checkbox";
        c.name = n;
        c.checked = r;
        c.autocomplete = "off";
        o(u, "span", "check-mark");
        l(u, "span", `text ${i}`, t);
        if (Is.definedString(a)) {
            l(u, "span", `additional-text`, a);
        }
        return c;
    }
    e.createCheckBox = c;
    function d(e, t) {
        const n = {};
        n.left = 0;
        n.top = 0;
        while (e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop)) {
            n.left += e.offsetLeft - e.scrollLeft;
            n.top += e.offsetTop - e.scrollTop;
            e = e.offsetParent;
            if (e === t) {
                break;
            }
        }
        return n;
    }
    e.getOffset = d;
    function f(e, t, n = false) {
        const o = getComputedStyle(e);
        let l = o.getPropertyValue(t);
        if (n) {
            l = parseFloat(l);
        }
        return l;
    }
    e.getStyleValueByName = f;
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
    e.JSONTREE_JS_ATTRIBUTE_PATH_NAME = "data-jsontree-js-path";
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
            o._currentView.contentPanelsDataIndex = 0;
            o._currentView.backButton = null;
            o._currentView.nextButton = null;
            o._currentView.disabledBackground = null;
            o._currentView.sideMenu = null;
            o._currentView.sideMenuChanged = false;
            o._currentView.toggleFullScreenButton = null;
            o._currentView.fullScreenOn = false;
            o._currentView.dragAndDropBackground = null;
            o._currentView.initialized = false;
            o._currentView.contentColumns = [];
            o._currentView.footer = null;
            o._currentView.footerStatusText = null;
            o._currentView.footerDataTypeText = null;
            o._currentView.footerLengthText = null;
            o._currentView.footerSizeText = null;
            o._currentView.footerPageText = null;
            o._currentView.footerStatusTextTimerId = 0;
            o._currentView.columnDragging = false;
            o._currentView.columnDraggingDataIndex = 0;
            o._currentView.dataTypeCounts = {};
            o._currentView.contentControlButtons = [];
            o._currentView.contextMenu = null;
            if (o.paging.enabled && Is.definedArray(o.data) && o.data.length > 1 && o._currentView.dataArrayCurrentIndex > o.data.length - 1) {
                o._currentView.dataArrayCurrentIndex = 0;
            }
            for (const e in l) {
                if (!l[e]) {
                    o.allowEditing.bulk = false;
                    break;
                }
            }
            return o;
        }
        t.getForNewInstance = n;
        function o(e) {
            let t = Default.getObject(e, {});
            t.showObjectSizes = Default.getBoolean(t.showObjectSizes, true);
            t.useZeroIndexingForArrays = Default.getBoolean(t.useZeroIndexingForArrays, true);
            t.dateTimeFormat = Default.getString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
            t.showArrowToggles = Default.getBoolean(t.showArrowToggles, true);
            t.showStringQuotes = Default.getBoolean(t.showStringQuotes, true);
            t.showAllAsClosed = Default.getBoolean(t.showAllAsClosed, false);
            t.sortPropertyNames = Default.getBoolean(t.sortPropertyNames, true);
            t.sortPropertyNamesInAlphabeticalOrder = Default.getBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
            t.showCommas = Default.getBoolean(t.showCommas, true);
            t.reverseArrayValues = Default.getBoolean(t.reverseArrayValues, false);
            t.addArrayIndexPadding = Default.getBoolean(t.addArrayIndexPadding, false);
            t.showValueColors = Default.getBoolean(t.showValueColors, true);
            t.maximumDecimalPlaces = Default.getNumber(t.maximumDecimalPlaces, 2);
            t.maximumStringLength = Default.getNumber(t.maximumStringLength, 0);
            t.fileDroppingEnabled = Default.getBoolean(t.fileDroppingEnabled, true);
            t.jsonIndentSpaces = Default.getNumber(t.jsonIndentSpaces, 8);
            t.showArrayIndexBrackets = Default.getBoolean(t.showArrayIndexBrackets, true);
            t.showOpeningClosingCurlyBraces = Default.getBoolean(t.showOpeningClosingCurlyBraces, false);
            t.showOpeningClosingSquaredBrackets = Default.getBoolean(t.showOpeningClosingSquaredBrackets, false);
            t.includeTimeZoneInDateTimeEditing = Default.getBoolean(t.includeTimeZoneInDateTimeEditing, true);
            t.shortcutKeysEnabled = Default.getBoolean(t.shortcutKeysEnabled, true);
            t.openInFullScreenMode = Default.getBoolean(t.openInFullScreenMode, false);
            t.valueToolTips = Default.getObject(t.valueToolTips, null);
            t.editingValueClickDelay = Default.getNumber(t.editingValueClickDelay, 500);
            t.showDataTypes = Default.getBoolean(t.showDataTypes, false);
            t.logJsonValueToolTipPaths = Default.getBoolean(t.logJsonValueToolTipPaths, false);
            t.exportFilenameFormat = Default.getString(t.exportFilenameFormat, "JsonTree_{dd}-{mm}-{yyyy}_{hh}-{MM}-{ss}.json");
            t.showPropertyNameQuotes = Default.getBoolean(t.showPropertyNameQuotes, true);
            t.showOpenedObjectArrayBorders = Default.getBoolean(t.showOpenedObjectArrayBorders, true);
            t.showPropertyNameAndIndexColors = Default.getBoolean(t.showPropertyNameAndIndexColors, true);
            t.showUrlOpenButtons = Default.getBoolean(t.showUrlOpenButtons, true);
            t.showEmailOpenButtons = Default.getBoolean(t.showEmailOpenButtons, true);
            t.minimumArrayIndexPadding = Default.getNumber(t.minimumArrayIndexPadding, 0);
            t.arrayIndexPaddingCharacter = Default.getString(t.arrayIndexPaddingCharacter, "0");
            t.maximumUrlLength = Default.getNumber(t.maximumUrlLength, 0);
            t.maximumEmailLength = Default.getNumber(t.maximumEmailLength, 0);
            t.showCssStylesForHtmlObjects = Default.getBoolean(t.showCssStylesForHtmlObjects, false);
            t.jsonPathAny = Default.getString(t.jsonPathAny, "..");
            t.jsonPathSeparator = Default.getString(t.jsonPathSeparator, "\\");
            t.showChildIndexes = Default.getBoolean(t.showChildIndexes, true);
            t = l(t);
            t = r(t);
            t = i(t);
            t = a(t);
            t = s(t);
            t = u(t);
            t = c(t);
            t = d(t);
            t = f(t);
            t = g(t);
            t = m(t);
            t = p(t);
            return t;
        }
        t.get = o;
        function l(e) {
            e.paging = Default.getObject(e.paging, {});
            e.paging.enabled = Default.getBoolean(e.paging.enabled, true);
            e.paging.columnsPerPage = Default.getNumberMaximum(e.paging.columnsPerPage, 1, 6);
            e.paging.startPage = Default.getNumberMinimum(e.paging.startPage, 1, 1);
            e.paging.synchronizeScrolling = Default.getBoolean(e.paging.synchronizeScrolling, false);
            e.paging.allowColumnReordering = Default.getBoolean(e.paging.allowColumnReordering, true);
            return e;
        }
        function r(e) {
            e.title = Default.getObject(e.title, {});
            e.title.text = Default.getAnyString(e.title.text, "JsonTree.js");
            e.title.showCloseOpenAllButtons = Default.getBoolean(e.title.showCloseOpenAllButtons, true);
            e.title.showCopyButton = Default.getBoolean(e.title.showCopyButton, true);
            e.title.enableFullScreenToggling = Default.getBoolean(e.title.enableFullScreenToggling, true);
            e.title.showFullScreenButton = Default.getBoolean(e.title.showFullScreenButton, true);
            return e;
        }
        function i(e) {
            e.footer = Default.getObject(e.footer, {});
            e.footer.enabled = Default.getBoolean(e.footer.enabled, true);
            e.footer.showDataTypes = Default.getBoolean(e.footer.showDataTypes, true);
            e.footer.showLengths = Default.getBoolean(e.footer.showLengths, true);
            e.footer.showSizes = Default.getBoolean(e.footer.showSizes, true);
            e.footer.showPageOf = Default.getBoolean(e.footer.showPageOf, true);
            e.footer.statusResetDelay = Default.getNumber(e.footer.statusResetDelay, 5e3);
            return e;
        }
        function a(e) {
            e.controlPanel = Default.getObject(e.controlPanel, {});
            e.controlPanel.enabled = Default.getBoolean(e.controlPanel.enabled, true);
            e.controlPanel.showCopyButton = Default.getBoolean(e.controlPanel.showCopyButton, true);
            e.controlPanel.showMovingButtons = Default.getBoolean(e.controlPanel.showMovingButtons, true);
            e.controlPanel.showRemoveButton = Default.getBoolean(e.controlPanel.showRemoveButton, false);
            e.controlPanel.showEditButton = Default.getBoolean(e.controlPanel.showEditButton, true);
            e.controlPanel.showCloseOpenAllButtons = Default.getBoolean(e.controlPanel.showCloseOpenAllButtons, true);
            e.controlPanel.showSwitchToPagesButton = Default.getBoolean(e.controlPanel.showSwitchToPagesButton, true);
            return e;
        }
        function s(e) {
            e.lineNumbers = Default.getObject(e.lineNumbers, {});
            e.lineNumbers.enabled = Default.getBoolean(e.lineNumbers.enabled, true);
            return e;
        }
        function u(e) {
            e.ignore = Default.getObject(e.ignore, {});
            e.ignore.nullValues = Default.getBoolean(e.ignore.nullValues, false);
            e.ignore.functionValues = Default.getBoolean(e.ignore.functionValues, false);
            e.ignore.unknownValues = Default.getBoolean(e.ignore.unknownValues, false);
            e.ignore.booleanValues = Default.getBoolean(e.ignore.booleanValues, false);
            e.ignore.floatValues = Default.getBoolean(e.ignore.floatValues, false);
            e.ignore.numberValues = Default.getBoolean(e.ignore.numberValues, false);
            e.ignore.stringValues = Default.getBoolean(e.ignore.stringValues, false);
            e.ignore.dateValues = Default.getBoolean(e.ignore.dateValues, false);
            e.ignore.objectValues = Default.getBoolean(e.ignore.objectValues, false);
            e.ignore.arrayValues = Default.getBoolean(e.ignore.arrayValues, false);
            e.ignore.bigintValues = Default.getBoolean(e.ignore.bigintValues, false);
            e.ignore.symbolValues = Default.getBoolean(e.ignore.symbolValues, false);
            e.ignore.emptyObjects = Default.getBoolean(e.ignore.emptyObjects, false);
            e.ignore.undefinedValues = Default.getBoolean(e.ignore.undefinedValues, false);
            e.ignore.guidValues = Default.getBoolean(e.ignore.guidValues, false);
            e.ignore.colorValues = Default.getBoolean(e.ignore.colorValues, false);
            e.ignore.regexpValues = Default.getBoolean(e.ignore.regexpValues, false);
            e.ignore.mapValues = Default.getBoolean(e.ignore.mapValues, false);
            e.ignore.setValues = Default.getBoolean(e.ignore.setValues, false);
            e.ignore.urlValues = Default.getBoolean(e.ignore.urlValues, false);
            e.ignore.imageValues = Default.getBoolean(e.ignore.imageValues, false);
            e.ignore.emailValues = Default.getBoolean(e.ignore.emailValues, false);
            e.ignore.htmlValues = Default.getBoolean(e.ignore.htmlValues, false);
            e.ignore.lambdaValues = Default.getBoolean(e.ignore.lambdaValues, false);
            return e;
        }
        function c(e) {
            e.tooltip = Default.getObject(e.tooltip, {});
            e.tooltip.delay = Default.getNumber(e.tooltip.delay, 750);
            e.tooltip.offset = Default.getNumber(e.tooltip.offset, 0);
            return e;
        }
        function d(e) {
            e.parse = Default.getObject(e.parse, {});
            e.parse.stringsToDates = Default.getBoolean(e.parse.stringsToDates, false);
            e.parse.stringsToBooleans = Default.getBoolean(e.parse.stringsToBooleans, false);
            e.parse.stringsToNumbers = Default.getBoolean(e.parse.stringsToNumbers, false);
            e.parse.stringsToSymbols = Default.getBoolean(e.parse.stringsToSymbols, false);
            return e;
        }
        function f(e) {
            let t = Default.getBoolean(e.allowEditing, true);
            e.allowEditing = Default.getObject(e.allowEditing, {});
            e.allowEditing.booleanValues = Default.getBoolean(e.allowEditing.booleanValues, t);
            e.allowEditing.floatValues = Default.getBoolean(e.allowEditing.floatValues, t);
            e.allowEditing.numberValues = Default.getBoolean(e.allowEditing.numberValues, t);
            e.allowEditing.stringValues = Default.getBoolean(e.allowEditing.stringValues, t);
            e.allowEditing.dateValues = Default.getBoolean(e.allowEditing.dateValues, t);
            e.allowEditing.bigIntValues = Default.getBoolean(e.allowEditing.bigIntValues, t);
            e.allowEditing.guidValues = Default.getBoolean(e.allowEditing.guidValues, t);
            e.allowEditing.colorValues = Default.getBoolean(e.allowEditing.colorValues, t);
            e.allowEditing.urlValues = Default.getBoolean(e.allowEditing.urlValues, t);
            e.allowEditing.emailValues = Default.getBoolean(e.allowEditing.emailValues, t);
            e.allowEditing.regExpValues = Default.getBoolean(e.allowEditing.regExpValues, t);
            e.allowEditing.symbolValues = Default.getBoolean(e.allowEditing.symbolValues, t);
            e.allowEditing.imageValues = Default.getBoolean(e.allowEditing.imageValues, t);
            e.allowEditing.propertyNames = Default.getBoolean(e.allowEditing.propertyNames, t);
            e.allowEditing.bulk = Default.getBoolean(e.allowEditing.bulk, t);
            return e;
        }
        function g(e) {
            e.sideMenu = Default.getObject(e.sideMenu, {});
            e.sideMenu.enabled = Default.getBoolean(e.sideMenu.enabled, true);
            e.sideMenu.showImportButton = Default.getBoolean(e.sideMenu.showImportButton, true);
            e.sideMenu.showExportButton = Default.getBoolean(e.sideMenu.showExportButton, true);
            e.sideMenu.titleText = Default.getAnyString(e.sideMenu.titleText, e.title.text);
            e.sideMenu.showAvailableDataTypeCounts = Default.getBoolean(e.sideMenu.showAvailableDataTypeCounts, true);
            e.sideMenu.showOnlyDataTypesAvailable = Default.getBoolean(e.sideMenu.showOnlyDataTypesAvailable, false);
            return e;
        }
        function m(e) {
            e.autoClose = Default.getObject(e.autoClose, {});
            e.autoClose.objectSize = Default.getNumber(e.autoClose.objectSize, 0);
            e.autoClose.arraySize = Default.getNumber(e.autoClose.arraySize, 0);
            e.autoClose.mapSize = Default.getNumber(e.autoClose.mapSize, 0);
            e.autoClose.setSize = Default.getNumber(e.autoClose.setSize, 0);
            e.autoClose.htmlSize = Default.getNumber(e.autoClose.htmlSize, 0);
            return e;
        }
        function p(e) {
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
            e.events.onFloatRender = Default.getFunction(e.events.onFloatRender, null);
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
            e.events.onGuidRender = Default.getFunction(e.events.onGuidRender, null);
            e.events.onColorRender = Default.getFunction(e.events.onColorRender, null);
            e.events.onJsonEdit = Default.getFunction(e.events.onJsonEdit, null);
            e.events.onRegExpRender = Default.getFunction(e.events.onRegExpRender, null);
            e.events.onExport = Default.getFunction(e.events.onExport, null);
            e.events.onUrlRender = Default.getFunction(e.events.onUrlRender, null);
            e.events.onImageRender = Default.getFunction(e.events.onImageRender, null);
            e.events.onEmailRender = Default.getFunction(e.events.onEmailRender, null);
            e.events.onLambdaRender = Default.getFunction(e.events.onLambdaRender, null);
            e.events.onCopy = Default.getFunction(e.events.onCopy, null);
            e.events.onFullScreenChange = Default.getFunction(e.events.onFullScreenChange, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Binding || (Binding = {}));

var Config;

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
            e.text.mapText = Default.getAnyString(e.text.mapText, "map");
            e.text.setText = Default.getAnyString(e.text.setText, "set");
            e.text.htmlText = Default.getAnyString(e.text.htmlText, "html");
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
            e.text.closeAllButtonSymbolText = Default.getAnyString(e.text.closeAllButtonSymbolText, "⇈");
            e.text.openAllButtonSymbolText = Default.getAnyString(e.text.openAllButtonSymbolText, "⇊");
            e.text.copyButtonSymbolText = Default.getAnyString(e.text.copyButtonSymbolText, "❐");
            e.text.backButtonText = Default.getAnyString(e.text.backButtonText, "Back");
            e.text.nextButtonText = Default.getAnyString(e.text.nextButtonText, "Next");
            e.text.backButtonSymbolText = Default.getAnyString(e.text.backButtonSymbolText, "←");
            e.text.nextButtonSymbolText = Default.getAnyString(e.text.nextButtonSymbolText, "→");
            e.text.noJsonToViewText = Default.getAnyString(e.text.noJsonToViewText, "There is currently no JSON to view.");
            e.text.functionText = Default.getAnyString(e.text.functionText, "function");
            e.text.sideMenuButtonSymbolText = Default.getAnyString(e.text.sideMenuButtonSymbolText, "☰");
            e.text.sideMenuButtonText = Default.getAnyString(e.text.sideMenuButtonText, "Show Menu");
            e.text.closeButtonSymbolText = Default.getAnyString(e.text.closeButtonSymbolText, "✕");
            e.text.closeButtonText = Default.getAnyString(e.text.closeButtonText, "Close");
            e.text.showDataTypesText = Default.getAnyString(e.text.showDataTypesText, "Show Data Types");
            e.text.selectAllText = Default.getAnyString(e.text.selectAllText, "Select All");
            e.text.selectNoneText = Default.getAnyString(e.text.selectNoneText, "Select None");
            e.text.importButtonSymbolText = Default.getAnyString(e.text.importButtonSymbolText, "↑");
            e.text.importButtonText = Default.getAnyString(e.text.importButtonText, "Import");
            e.text.fullScreenOnButtonSymbolText = Default.getAnyString(e.text.fullScreenOnButtonSymbolText, "↗");
            e.text.fullScreenOffButtonSymbolText = Default.getAnyString(e.text.fullScreenOffButtonSymbolText, "↙");
            e.text.fullScreenButtonText = Default.getAnyString(e.text.fullScreenButtonText, "Toggle Full-Screen");
            e.text.copyButtonText = Default.getAnyString(e.text.copyButtonText, "Copy");
            e.text.dragAndDropSymbolText = Default.getAnyString(e.text.dragAndDropSymbolText, "⇪");
            e.text.dragAndDropTitleText = Default.getAnyString(e.text.dragAndDropTitleText, "Drag and drop your JSON files to upload");
            e.text.dragAndDropDescriptionText = Default.getAnyString(e.text.dragAndDropDescriptionText, "Multiple files will be joined as an array");
            e.text.exportButtonSymbolText = Default.getAnyString(e.text.exportButtonSymbolText, "↓");
            e.text.exportButtonText = Default.getAnyString(e.text.exportButtonText, "Export");
            e.text.propertyColonCharacter = Default.getAnyString(e.text.propertyColonCharacter, ":");
            e.text.noPropertiesText = Default.getAnyString(e.text.noPropertiesText, "There are no properties to view.");
            e.text.openText = Default.getAnyString(e.text.openText, "open");
            e.text.openSymbolText = Default.getAnyString(e.text.openSymbolText, "⤤");
            e.text.waitingText = Default.getAnyString(e.text.waitingText, "Waiting...");
            e.text.pageOfText = Default.getAnyString(e.text.pageOfText, "Page {0} of {1}");
            e.text.sizeText = Default.getAnyString(e.text.sizeText, "Size: {0}");
            e.text.copiedText = Default.getAnyString(e.text.copiedText, "JSON copied to clipboard.");
            e.text.exportedText = Default.getAnyString(e.text.exportedText, "JSON exported.");
            e.text.importedText = Default.getAnyString(e.text.importedText, "{0} JSON files imported.");
            e.text.ignoreDataTypesUpdated = Default.getAnyString(e.text.ignoreDataTypesUpdated, "Ignore data types updated.");
            e.text.lengthText = Default.getAnyString(e.text.lengthText, "Length: {0}");
            e.text.valueUpdatedText = Default.getAnyString(e.text.valueUpdatedText, "Value updated.");
            e.text.jsonUpdatedText = Default.getAnyString(e.text.jsonUpdatedText, "JSON updated.");
            e.text.nameUpdatedText = Default.getAnyString(e.text.nameUpdatedText, "Property name updated.");
            e.text.indexUpdatedText = Default.getAnyString(e.text.indexUpdatedText, "Array index updated.");
            e.text.itemDeletedText = Default.getAnyString(e.text.itemDeletedText, "Item deleted.");
            e.text.arrayJsonItemDeleted = Default.getAnyString(e.text.arrayJsonItemDeleted, "Array JSON item deleted.");
            e.text.dataTypeText = Default.getAnyString(e.text.dataTypeText, "Data Type: {0}");
            e.text.editSymbolButtonText = Default.getAnyString(e.text.editSymbolButtonText, "✎");
            e.text.editButtonText = Default.getAnyString(e.text.editButtonText, "Edit");
            e.text.moveRightSymbolButtonText = Default.getAnyString(e.text.moveRightSymbolButtonText, "→");
            e.text.moveRightButtonText = Default.getAnyString(e.text.moveRightButtonText, "Move Right");
            e.text.moveLeftSymbolButtonText = Default.getAnyString(e.text.moveLeftSymbolButtonText, "←");
            e.text.moveLeftButtonText = Default.getAnyString(e.text.moveLeftButtonText, "Move Left");
            e.text.removeSymbolButtonText = Default.getAnyString(e.text.removeSymbolButtonText, "✕");
            e.text.removeButtonText = Default.getAnyString(e.text.removeButtonText, "Remove");
            e.text.switchToPagesSymbolText = Default.getAnyString(e.text.switchToPagesSymbolText, "☷");
            e.text.switchToPagesText = Default.getAnyString(e.text.switchToPagesText, "Switch To Pages");
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
            e.addEventListener("mousemove", (e => l(e, t, n, o)));
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
        const n = o(e);
        if (n > 0) {
            const e = Math.floor(Math.log(n) / Math.log(1024));
            return `${Convert2.numberToFloatWithDecimalPlaces(n / Math.pow(1024, e), 2)} ${" KMGTP".charAt(e)}B`;
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
                n = e.length(Convert2.setToArray(t));
            } else if (Is.definedMap(t)) {
                n = e.length(Convert2.mapToObject(t));
            } else if (Is.definedHtml(t)) {
                n = e.length(Convert2.htmlToObject(t));
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
                t = o(Convert2.setToArray(e));
            } else if (Is.definedMap(e)) {
                t = o(Convert2.mapToObject(e));
            } else if (Is.definedHtml(e)) {
                t = o(Convert2.htmlToObject(e));
            } else if (Is.definedArray(e)) {
                const n = e.length;
                for (let l = 0; l < n; l++) {
                    t += o(e[l]);
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

var ContextMenu;

(e => {
    function t(e) {
        if (!Is.defined(e._currentView.contextMenu)) {
            e._currentView.contextMenu = DomElement.create(document.body, "div", "jsontree-js-context-menu");
            e._currentView.contextMenu.style.display = "none";
            n(e);
        }
    }
    e.renderControl = t;
    function n(e, t = true) {
        let n = t ? window.addEventListener : window.removeEventListener;
        let o = t ? document.addEventListener : document.removeEventListener;
        n("contextmenu", (() => l(e)));
        n("click", (() => l(e)));
        o("scroll", (() => l(e)));
    }
    e.assignToEvents = n;
    function o(e, t) {
        DomElement.cancelBubble(e);
        DomElement.showElementAtMousePosition(e, t._currentView.contextMenu, 0);
    }
    e.show = o;
    function l(e) {
        if (Is.defined(e._currentView.contextMenu) && e._currentView.contextMenu.style.display !== "none") {
            e._currentView.contextMenu.style.display = "none";
        }
    }
    e.hide = l;
    function r(e) {
        if (Is.defined(e._currentView.contextMenu)) {
            e._currentView.contextMenu.parentNode.removeChild(e._currentView.contextMenu);
        }
    }
    e.remove = r;
    function i(e, t, n) {
        const o = DomElement.create(e._currentView.contextMenu, "div", "context-menu-item");
        DomElement.createWithHTML(o, "span", "symbol", t);
        DomElement.createWithHTML(o, "span", "text", n);
        return o;
    }
    e.addMenuItem = i;
})(ContextMenu || (ContextMenu = {}));

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
                    const r = Convert2.jsonStringToObject(o, e);
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
        }));
    }
    function l(e) {
        Trigger.customEvent(e.events.onBeforeRender, e._currentView.element);
        ToolTip.renderControl(e);
        ContextMenu.renderControl(e);
        if (!Is.definedString(e._currentView.element.id)) {
            e._currentView.element.id = crypto.randomUUID();
            e._currentView.idSet = true;
        }
        e._currentView.element.className = "json-tree-js";
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (e.openInFullScreenMode) {
            e._currentView.element.classList.add("full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        r(e);
        pe(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function r(n, o = false) {
        let l = t[n._currentView.element.id].data;
        if (Is.definedUrl(l)) {
            Default.getObjectFromUrl(l, e, (e => {
                i(n, o, e);
            }));
        } else {
            i(n, o, l);
        }
    }
    function i(e, t, n) {
        const o = u(e);
        ToolTip.hide(e);
        ContextMenu.hide(e);
        e._currentView.element.innerHTML = "";
        e._currentView.editMode = false;
        e._currentView.contentPanelsIndex = 0;
        e._currentView.sideMenuChanged = false;
        e._currentView.contentColumns = [];
        e._currentView.dataTypeCounts = {};
        e._currentView.contentControlButtons = [];
        D(e, n);
        const l = DomElement.create(e._currentView.element, "div", "contents");
        if (t) {
            l.classList.add("page-switch");
        }
        if (e.paging.enabled && Is.definedArray(n)) {
            const t = Is.defined(n[e._currentView.dataArrayCurrentIndex + 1]);
            for (let r = 0; r < e.paging.columnsPerPage; r++) {
                const i = r + e._currentView.dataArrayCurrentIndex;
                const s = n[i];
                e._currentView.contentPanelsIndex = 0;
                e._currentView.contentPanelsDataIndex = i;
                if (Is.defined(s)) {
                    a(s, l, e, i, o[r], e.paging.columnsPerPage, t);
                }
            }
        } else {
            e._currentView.contentPanelsIndex = 0;
            e._currentView.contentPanelsDataIndex = 0;
            a(n, l, e, null, o[0], 1, false);
        }
        C(e);
        N(e);
        se(e);
        e._currentView.initialized = true;
    }
    function a(t, n, o, l, r, i, a) {
        const u = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        if (!Is.defined(t)) {
            const t = DomElement.create(u, "div", "no-json");
            DomElement.createWithHTML(t, "span", "no-json-text", e.text.noJsonToViewText);
            if (o.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(t, "span", "no-json-import-text", `${e.text.importButtonText}${e.text.ellipsisText}`);
                n.onclick = () => _(o);
            }
        } else {
            u.onscroll = () => c(u, o, l);
            if (o.paging.enabled && Is.definedNumber(l)) {
                u.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, l.toString());
            }
            if (a && o.paging.allowColumnReordering && o.paging.columnsPerPage > 1 && o.allowEditing.bulk) {
                u.setAttribute("draggable", "true");
                u.ondragstart = () => d(u, o, l);
                u.ondragend = () => f(u, o);
                u.ondragover = e => e.preventDefault();
                u.ondrop = () => g(o, l);
            }
            o._currentView.contentColumns.push(u);
            const e = DomElement.create(u, "div", "contents-column-line-numbers");
            const n = DomElement.create(u, "div", "contents-column-lines");
            if (Is.definedArray(t)) {
                J(n, o, t, "array");
            } else if (Is.definedSet(t)) {
                J(n, o, Convert2.setToArray(t), "set");
            } else if (Is.definedHtml(t)) {
                $(n, o, Convert2.htmlToObject(t, o.showCssStylesForHtmlObjects), l, "html");
            } else if (Is.definedMap(t)) {
                $(n, o, Convert2.mapToObject(t), l, "map");
            } else if (Is.definedObject(t)) {
                $(n, o, t, l, "object");
            }
            x(o, u, t, l);
            p(e, n, u, o);
            if (Is.defined(r)) {
                u.scrollTop = r;
            }
            o._currentView.titleBarButtons.style.display = "block";
            if (o.allowEditing.bulk) {
                u.ondblclick = e => {
                    s(e, o, t, u, l);
                };
            }
        }
    }
    function s(t, n, o, l, i) {
        let a = null;
        if (Is.defined(t)) {
            DomElement.cancelBubble(t);
        }
        clearTimeout(n._currentView.valueClickTimerId);
        n._currentView.valueClickTimerId = 0;
        n._currentView.editMode = true;
        const s = (t, o) => Convert2.stringifyJson(t, o, e, n.showCssStylesForHtmlObjects);
        l.classList.add("editable");
        l.setAttribute("contenteditable", "true");
        l.setAttribute("draggable", "false");
        l.innerText = JSON.stringify(o, s, n.jsonIndentSpaces);
        l.focus();
        DomElement.selectAllText(l);
        l.onblur = () => {
            r(n, false);
            if (Is.definedString(a)) {
                W(n, a);
            }
        };
        l.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                l.setAttribute("contenteditable", "false");
            } else if (Te(t) && t.code === "Enter") {
                t.preventDefault();
                const o = l.innerText;
                const r = Convert2.jsonStringToObject(o, e);
                if (r.parsed) {
                    a = e.text.jsonUpdatedText;
                    if (n.paging.enabled) {
                        if (Is.defined(r.object)) {
                            n.data[i] = r.object;
                        } else {
                            n.data.splice(i, 1);
                            a = e.text.arrayJsonItemDeleted;
                            if (i === n._currentView.dataArrayCurrentIndex && n._currentView.dataArrayCurrentIndex > 0) {
                                n._currentView.dataArrayCurrentIndex -= n.paging.columnsPerPage;
                            }
                        }
                    } else {
                        n.data = r.object;
                    }
                }
                l.setAttribute("contenteditable", "false");
            } else if (t.code === "Enter") {
                t.preventDefault();
                document.execCommand("insertLineBreak");
            }
        };
    }
    function u(e) {
        const t = [];
        ToolTip.hide(e);
        ContextMenu.hide(e);
        if (e._currentView.editMode || e._currentView.sideMenuChanged) {
            const n = e._currentView.contentColumns.length;
            for (let o = 0; o < n; o++) {
                t.push(e._currentView.contentColumns[o].scrollTop);
            }
        }
        return t;
    }
    function c(e, t, n) {
        ToolTip.hide(t);
        ContextMenu.hide(t);
        const o = e.scrollTop;
        const l = e.scrollLeft;
        const r = t._currentView.contentColumns.length;
        if (t.controlPanel.enabled) {
            const e = t._currentView.contentControlButtons[n];
            if (Is.defined(e)) {
                e.style.top = `${t._currentView.contentColumns[n].scrollTop}px`;
                e.style.right = `-${t._currentView.contentColumns[n].scrollLeft}px`;
            }
        }
        if (t.paging.synchronizeScrolling) {
            for (let e = 0; e < r; e++) {
                if (n !== e) {
                    t._currentView.contentColumns[e].scrollTop = o;
                    t._currentView.contentColumns[e].scrollLeft = l;
                }
            }
        }
        if (t.controlPanel.enabled) {
            for (let e = 0; e < r; e++) {
                if (n !== e) {
                    const n = t._currentView.contentControlButtons[e];
                    if (Is.defined(n)) {
                        n.style.top = `${t._currentView.contentColumns[e].scrollTop}px`;
                        n.style.right = `-${t._currentView.contentColumns[e].scrollLeft}px`;
                    }
                }
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
        m(e, e._currentView.columnDraggingDataIndex, t);
    }
    function m(t, n, o) {
        if (n !== o) {
            const l = t.data[o];
            const i = t.data[n];
            let a = t._currentView.contentPanelsOpen[o];
            let s = t._currentView.contentPanelsOpen[n];
            if (!Is.defined(a)) {
                a = {};
            }
            if (!Is.defined(s)) {
                s = {};
            }
            t.data[o] = i;
            t.data[n] = l;
            t._currentView.contentPanelsOpen[o] = s;
            t._currentView.contentPanelsOpen[n] = a;
            if (t._currentView.dataArrayCurrentIndex + (t.paging.columnsPerPage - 1) < o) {
                t._currentView.dataArrayCurrentIndex += t.paging.columnsPerPage;
            } else if (o < t._currentView.dataArrayCurrentIndex) {
                t._currentView.dataArrayCurrentIndex -= t.paging.columnsPerPage;
            }
            r(t);
            W(t, e.text.jsonUpdatedText);
        }
    }
    function p(e, t, n, o) {
        if (o.lineNumbers.enabled) {
            let o = 1;
            let l = 0;
            let r = 0;
            let i = null;
            const a = DomElement.getStyleValueByName(n, "padding-top", true);
            DomElement.findByClassNames(n, [ "object-type-title", "object-type-value-title" ], (n => {
                let s = DomElement.getOffset(n, t).top;
                if (o === 1) {
                    l = s;
                }
                s -= l;
                const u = DomElement.create(e, "div", "contents-column-line-number");
                u.style.top = `${s}px`;
                u.innerHTML = `${o.toString()}.`;
                if (Is.defined(i)) {
                    const e = i.offsetTop + i.offsetHeight;
                    if (e < s) {
                        i.style.height = `${i.offsetHeight + (s - e) - a}px`;
                    }
                }
                r = Math.max(r, u.offsetWidth);
                o++;
                i = u;
                return true;
            }));
            e.style.height = `${t.offsetHeight}px`;
            e.style.width = `${r}px`;
        } else {
            e.parentNode.removeChild(e);
        }
    }
    function x(t, n, o, l) {
        const r = DomElement.create(n, "div", "column-control-buttons");
        r.ondblclick = DomElement.cancelBubble;
        const i = t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1;
        if (t.allowEditing.bulk && t.controlPanel.showEditButton) {
            const i = DomElement.createWithHTML(r, "button", "edit", e.text.editSymbolButtonText);
            i.onclick = () => s(null, t, o, n, l);
            i.ondblclick = DomElement.cancelBubble;
            ToolTip.add(i, t, e.text.editButtonText);
        }
        if (i && t.allowEditing.bulk && t.paging.allowColumnReordering && t.controlPanel.showMovingButtons) {
            const n = DomElement.createWithHTML(r, "button", "move-right", e.text.moveRightSymbolButtonText);
            n.ondblclick = DomElement.cancelBubble;
            if (l + 1 > t.data.length - 1) {
                n.disabled = true;
            } else {
                n.onclick = () => m(t, l, l + 1);
            }
            ToolTip.add(n, t, e.text.moveRightButtonText);
            const o = DomElement.createWithHTML(r, "button", "move-left", e.text.moveLeftSymbolButtonText);
            o.ondblclick = DomElement.cancelBubble;
            if (l - 1 < 0) {
                o.disabled = true;
            } else {
                o.onclick = () => m(t, l, l - 1);
            }
            ToolTip.add(o, t, e.text.moveLeftButtonText);
        }
        if (i && t.controlPanel.showCopyButton) {
            const n = DomElement.createWithHTML(r, "button", "copy", e.text.copyButtonSymbolText);
            n.onclick = () => h(t, o);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.copyButtonText);
        }
        if (i && t.controlPanel.showCloseOpenAllButtons) {
            const n = DomElement.createWithHTML(r, "button", "open-all", e.text.openAllButtonSymbolText);
            n.onclick = () => b(t, l);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.openAllButtonText);
            const o = DomElement.createWithHTML(r, "button", "close-all", e.text.closeAllButtonSymbolText);
            o.onclick = () => y(t, l);
            o.ondblclick = DomElement.cancelBubble;
            ToolTip.add(o, t, e.text.closeAllButtonText);
        }
        if (t.allowEditing.bulk && t.controlPanel.showRemoveButton) {
            const n = DomElement.createWithHTML(r, "button", "remove", e.text.removeSymbolButtonText);
            n.onclick = () => w(t, l);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.removeButtonText);
        }
        if (!t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1 && t.controlPanel.showSwitchToPagesButton) {
            const n = DomElement.createWithHTML(r, "button", "switch-to-pages", e.text.switchToPagesSymbolText);
            n.onclick = () => T(t);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.switchToPagesText);
        }
        if (r.innerHTML !== "") {
            t._currentView.contentControlButtons.push(r);
            n.style.minHeight = `${r.offsetHeight}px`;
        } else {
            n.removeChild(r);
        }
    }
    function T(e) {
        e.paging.enabled = true;
        r(e);
    }
    function b(e, t) {
        const n = e._currentView.contentPanelsOpen[t];
        for (const e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = false;
            }
        }
        r(e);
    }
    function y(e, t) {
        const n = e._currentView.contentPanelsOpen[t];
        for (const e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = true;
            }
        }
        r(e);
    }
    function w(t, n) {
        if (t.paging.enabled) {
            t.data.splice(n, 1);
            if (n === t._currentView.dataArrayCurrentIndex && t._currentView.dataArrayCurrentIndex > 0) {
                t._currentView.dataArrayCurrentIndex -= t.paging.columnsPerPage;
            }
        } else {
            t.data = null;
        }
        r(t);
        W(t, e.text.arrayJsonItemDeleted);
    }
    function h(t, n) {
        let o = (n, o) => Convert2.stringifyJson(n, o, e, t.showCssStylesForHtmlObjects);
        if (Is.definedFunction(t.events.onCopyJsonReplacer)) {
            o = t.events.onCopyJsonReplacer;
        }
        let l = JSON.stringify(n, o, t.jsonIndentSpaces);
        navigator.clipboard.writeText(l);
        W(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopy, t._currentView.element, l);
    }
    function D(t, n) {
        if (Is.definedString(t.title.text) || t.title.showCloseOpenAllButtons || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => v(t);
            }
            if (t.sideMenu.enabled) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => A(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton && Is.defined(n)) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyButtonSymbolText);
                o.onclick = () => V(t, n);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.copyAllButtonText);
            }
            if (t.title.showCloseOpenAllButtons && Is.defined(n)) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "open-all", e.text.openAllButtonSymbolText);
                n.onclick = () => S(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "close-all", e.text.closeAllButtonSymbolText);
                o.onclick = () => E(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.paging.enabled && Is.definedArray(n) && n.length > 1) {
                t._currentView.backButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back", e.text.backButtonSymbolText);
                t._currentView.backButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backButton, t, e.text.backButtonText);
                if (t._currentView.dataArrayCurrentIndex > 0) {
                    t._currentView.backButton.onclick = () => B(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.dataArrayCurrentIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
                    t._currentView.nextButton.onclick = () => I(t);
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
                t._currentView.toggleFullScreenButton.onclick = () => v(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function v(t) {
        if (t.title.enableFullScreenToggling) {
            if (t._currentView.element.classList.contains("full-screen")) {
                t._currentView.element.classList.remove("full-screen");
                t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOnButtonSymbolText;
                t._currentView.fullScreenOn = false;
            } else {
                t._currentView.element.classList.add("full-screen");
                t._currentView.toggleFullScreenButton.innerHTML = e.text.fullScreenOffButtonSymbolText;
                t._currentView.fullScreenOn = true;
            }
            ToolTip.hide(t);
            ContextMenu.hide(t);
            k(t);
            Trigger.customEvent(t.events.onFullScreenChange, t._currentView.element, t._currentView.element.classList.contains("full-screen"));
        }
    }
    function V(t, n) {
        let o = (n, o) => Convert2.stringifyJson(n, o, e, t.showCssStylesForHtmlObjects);
        if (Is.definedFunction(t.events.onCopyJsonReplacer)) {
            o = t.events.onCopyJsonReplacer;
        }
        let l = JSON.stringify(n, o, t.jsonIndentSpaces);
        navigator.clipboard.writeText(l);
        W(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, t._currentView.element, l);
    }
    function S(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        r(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function E(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        r(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function B(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.dataArrayCurrentIndex -= e.paging.columnsPerPage;
            r(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function I(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.dataArrayCurrentIndex += e.paging.columnsPerPage;
            r(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function C(t) {
        if (t.sideMenu.enabled) {
            t._currentView.disabledBackground = DomElement.create(t._currentView.element, "div", "side-menu-disabled-background");
            t._currentView.disabledBackground.onclick = () => M(t);
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showExportButton && Is.definedObject(t.data)) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => ge(t);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => _(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const l = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            l.onclick = () => M(t);
            ToolTip.add(l, t, e.text.closeButtonText);
            if (Is.definedObject(t.data)) {
                const e = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
                O(e, t);
            }
        }
    }
    function _(e) {
        const t = DomElement.createWithNoContainer("input");
        t.type = "file";
        t.accept = ".json";
        t.multiple = true;
        M(e);
        t.onchange = () => de(t.files, e);
        t.click();
    }
    function A(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
            ContextMenu.hide(e);
        }
    }
    function M(t) {
        if (t._currentView.sideMenu.classList.contains("side-menu-open")) {
            t._currentView.sideMenu.classList.remove("side-menu-open");
            t._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(t);
            ContextMenu.hide(t);
            if (t._currentView.sideMenuChanged) {
                setTimeout((() => {
                    r(t);
                    W(t, e.text.ignoreDataTypesUpdated);
                }), 500);
            }
        }
    }
    function O(t, n) {
        const o = [];
        const l = DomElement.create(t, "div", "settings-panel");
        const r = DomElement.create(l, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(r, "div", "settings-panel-title-text", `${e.text.showDataTypesText}:`);
        const i = DomElement.create(r, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => L(n, o, true);
        s.onclick = () => L(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(l, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            const l = j(u, e, n, !d[`${e}Values`]);
            if (Is.defined(l)) {
                o.push(l);
            }
        }));
    }
    function L(e, t, n) {
        const o = t.length;
        const l = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            l[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function j(e, t, n, o) {
        let l = null;
        const r = n._currentView.dataTypeCounts[t];
        if (!n.sideMenu.showOnlyDataTypesAvailable || r > 0) {
            let i = Str.capitalizeFirstLetter(t);
            let a = "";
            if (n.sideMenu.showAvailableDataTypeCounts) {
                if (n._currentView.dataTypeCounts.hasOwnProperty(t)) {
                    a = `(${r})`;
                }
            }
            l = DomElement.createCheckBox(e, i, t, o, n.showValueColors ? t : "", a);
            l.onchange = () => {
                const e = n.ignore;
                e[`${t}Values`] = !l.checked;
                n.ignore = e;
                n._currentView.sideMenuChanged = true;
            };
        }
        return l;
    }
    function N(t) {
        if (t.footer.enabled && Is.defined(t.data)) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            k(t);
            t._currentView.footerStatusText = DomElement.createWithHTML(t._currentView.footer, "div", "status-text", e.text.waitingText);
            if (t.footer.showDataTypes) {
                t._currentView.footerDataTypeText = DomElement.create(t._currentView.footer, "div", "status-value-data-type");
                t._currentView.footerDataTypeText.style.display = "none";
            }
            if (t.footer.showLengths) {
                t._currentView.footerLengthText = DomElement.create(t._currentView.footer, "div", "status-value-length");
                t._currentView.footerLengthText.style.display = "none";
            }
            if (t.footer.showSizes) {
                t._currentView.footerSizeText = DomElement.create(t._currentView.footer, "div", "status-value-size");
                t._currentView.footerSizeText.style.display = "none";
            }
            if (t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1 && t.footer.showPageOf) {
                t._currentView.footerPageText = DomElement.create(t._currentView.footer, "div", "status-page-index");
                P(t);
            }
        }
    }
    function P(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.dataArrayCurrentIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const l = DomElement.createWithHTML(null, "span", "status-count", n.toFixed()).outerHTML;
            const r = DomElement.createWithHTML(null, "span", "status-count", o.toFixed()).outerHTML;
            const i = e.text.pageOfText.replace("{0}", l).replace("{1}", r);
            t._currentView.footerPageText.innerHTML = i;
        }
    }
    function k(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function F(t, n, o) {
        if (t.footer.enabled && t.footer.showDataTypes) {
            o.addEventListener("mousemove", (() => {
                const o = DomElement.createWithHTML(null, "span", "status-count", n).outerHTML;
                const l = e.text.dataTypeText.replace("{0}", o);
                t._currentView.footerDataTypeText.style.display = "block";
                t._currentView.footerDataTypeText.innerHTML = l;
            }));
            o.addEventListener("mouseleave", (() => {
                t._currentView.footerDataTypeText.style.display = "none";
                t._currentView.footerDataTypeText.innerHTML = "";
            }));
        }
    }
    function R(t, n, o) {
        if (t.footer.enabled && t.footer.showLengths) {
            const l = Size.length(n);
            if (l > 0) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", l.toString()).outerHTML;
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
    function H(t, n, o) {
        if (t.footer.enabled && t.footer.showSizes) {
            const l = Size.of(n);
            if (Is.definedString(l)) {
                o.addEventListener("mousemove", (() => {
                    const n = DomElement.createWithHTML(null, "span", "status-count", l.toString()).outerHTML;
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
    function W(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), t.footer.statusResetDelay);
        }
    }
    function $(t, n, o, l, r) {
        const i = Obj.getPropertyNames(o, n);
        const a = i.length;
        if (a !== 0 || !n.ignore.emptyObjects) {
            let s = null;
            if (r === "object") {
                s = e.text.objectText;
            } else if (r === "map") {
                s = e.text.mapText;
            } else if (r === "html") {
                s = e.text.htmlText;
            }
            const u = DomElement.create(t, "div", "object-type-title");
            const c = DomElement.create(t, "div", "object-type-contents last-item");
            const d = n.showArrowToggles ? DomElement.create(u, "div", "down-arrow") : null;
            const f = DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} main-title` : "main-title", s);
            let g = null;
            let m = null;
            G(c, n);
            if (n.paging.enabled && Is.definedNumber(l)) {
                let t = n.useZeroIndexingForArrays ? l.toString() : (l + 1).toString();
                if (n.showArrayIndexBrackets) {
                    t = `[${t}]`;
                }
                DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} data-array-index` : "data-array-index", t, f);
                DomElement.createWithHTML(u, "span", "split", e.text.propertyColonCharacter, f);
            }
            if (n.showObjectSizes && a > 0) {
                if (r === "html") {
                    DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} size` : "size", `<${a}>`);
                } else {
                    DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} size` : "size", `{${a}}`);
                }
            }
            if (n.showOpeningClosingCurlyBraces) {
                g = DomElement.createWithHTML(u, "span", "opening-symbol", "{");
                m = DomElement.createWithHTML(u, "span", "closed-symbols", "{ ... }");
            }
            z(d, null, c, n, o, i, g, m, false, true, "", r, r !== "object");
            ee(n, f, o, r, false);
            H(n, o, f);
            R(n, o, f);
            le(n, u, false, o, o, null, false, null);
        }
    }
    function J(t, n, o, l) {
        let r = null;
        if (l === "set") {
            r = e.text.setText;
        } else if (l === "array") {
            r = e.text.arrayText;
        }
        const i = DomElement.create(t, "div", "object-type-title");
        const a = DomElement.create(t, "div", "object-type-contents last-item");
        const s = n.showArrowToggles ? DomElement.create(i, "div", "down-arrow") : null;
        const u = DomElement.createWithHTML(i, "span", n.showValueColors ? `${l} main-title` : "main-title", r);
        let c = null;
        let d = null;
        G(a, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(i, "span", n.showValueColors ? `${l} size` : "size", `[${o.length}]`);
        }
        if (n.showOpeningClosingCurlyBraces) {
            c = DomElement.createWithHTML(i, "span", "opening-symbol", "[");
            d = DomElement.createWithHTML(i, "span", "closed-symbols", "[ ... ]");
        }
        U(s, null, a, n, o, c, d, false, true, "", l, l !== "array");
        ee(n, u, o, l, false);
        H(n, o, u);
        R(n, o, u);
        le(n, i, false, o, o, null, false, null);
    }
    function z(t, n, o, l, r, i, a, s, u, c, d, f, g) {
        let m = true;
        const p = i.length;
        const x = d !== "" ? p : 0;
        if (p === 0 && !l.ignore.emptyObjects) {
            Z(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g);
            m = false;
        } else {
            for (let e = 0; e < p; e++) {
                const t = i[e];
                const n = d === "" ? t : `${d}${"\\"}${t}`;
                if (r.hasOwnProperty(t)) {
                    Z(r, o, l, t, r[t], e === p - 1, false, n, f, g);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                Z(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g);
                m = false;
            } else {
                if (l.showOpeningClosingCurlyBraces) {
                    oe(l, o, "}", u, c);
                }
            }
        }
        te(l, t, n, o, a, s, x, f);
        return m;
    }
    function U(t, n, o, l, r, i, a, s, u, c, d, f) {
        let g = true;
        const m = r.length;
        const p = c !== "" ? m : 0;
        if (!l.reverseArrayValues) {
            for (let e = 0; e < m; e++) {
                const t = Arr.getIndex(e, l);
                const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                Z(r, o, l, Arr.getIndexName(l, t, m), r[e], e === m - 1, true, n, d, f);
            }
        } else {
            for (let e = m; e--; ) {
                const t = Arr.getIndex(e, l);
                const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                Z(r, o, l, Arr.getIndexName(l, t, m), r[e], e === 0, true, n, d, f);
            }
        }
        if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
            Z(r, o, l, "", e.text.noPropertiesText, true, false, "", d, f);
            g = false;
        } else {
            if (l.showOpeningClosingCurlyBraces) {
                oe(l, o, "]", s, u);
            }
        }
        te(l, t, n, o, i, a, p, d);
        return g;
    }
    function Z(t, n, o, l, r, i, a, s, u, c) {
        const d = DomElement.create(n, "div", "object-type-value");
        const f = DomElement.create(d, "div", "object-type-value-title");
        const g = o.showArrowToggles ? DomElement.create(f, "div", "no-arrow") : null;
        let m = null;
        let p = null;
        let x = false;
        let T = false;
        let b = null;
        let y = DomElement.create(f, "span", "title");
        let w = false;
        let h = null;
        const D = !Is.definedString(l);
        let v = true;
        let V = null;
        if (!D) {
            if (a || !o.showPropertyNameQuotes) {
                y.innerHTML = l;
            } else {
                y.innerHTML = `"${l}"`;
            }
            if (a && !o.showChildIndexes) {
                y.parentNode.removeChild(y);
                y = null;
            }
        } else {
            y.parentNode.removeChild(y);
            y = null;
        }
        if (i) {
            d.classList.add("last-item");
        }
        if (o.showDataTypes) {
            h = DomElement.createWithHTML(f, "span", o.showValueColors ? "type-color" : "type", "");
        }
        if (Is.defined(y) && !D && o.showValueColors && o.showPropertyNameAndIndexColors) {
            y.classList.add(u);
        }
        if (Is.defined(y) && !D) {
            DomElement.createWithHTML(f, "span", "split", e.text.propertyColonCharacter);
            if (!c) {
                Q(o, t, l, y, a);
            } else {
                y.ondblclick = DomElement.cancelBubble;
            }
            if (Is.definedString(s)) {
                f.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME, s);
            }
            if (!a) {
                H(o, l, y);
                R(o, l, y);
            }
        }
        if (r === null) {
            b = "null";
            if (!o.ignore.nullValues) {
                m = o.showValueColors ? `${b} value undefined-or-null` : "value undefined-or-null";
                p = DomElement.createWithHTML(f, "span", m, "null");
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (r === void 0) {
            b = "undefined";
            if (!o.ignore.undefinedValues) {
                m = o.showValueColors ? `${b} value undefined-or-null` : "value undefined-or-null";
                p = DomElement.createWithHTML(f, "span", m, "undefined");
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedFunction(r)) {
            const t = Default.getFunctionName(r, e);
            if (t.isLambda) {
                b = "lambda";
                if (!o.ignore.lambdaValues) {
                    m = o.showValueColors ? `${b} value non-value` : "value non-value";
                    p = DomElement.createWithHTML(f, "span", m, t.name);
                    if (Is.definedFunction(o.events.onLambdaRender)) {
                        Trigger.customEvent(o.events.onLambdaRender, o._currentView.element, p);
                    }
                    ne(o, f, i);
                } else {
                    x = true;
                }
            } else {
                b = "function";
                if (!o.ignore.functionValues) {
                    m = o.showValueColors ? `${b} value non-value` : "value non-value";
                    p = DomElement.createWithHTML(f, "span", m, t.name);
                    if (Is.definedFunction(o.events.onFunctionRender)) {
                        Trigger.customEvent(o.events.onFunctionRender, o._currentView.element, p);
                    }
                    ne(o, f, i);
                } else {
                    x = true;
                }
            }
        } else if (Is.definedBoolean(r)) {
            b = "boolean";
            if (!o.ignore.booleanValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r);
                w = o.allowEditing.booleanValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedFloat(r)) {
            b = "float";
            if (!o.ignore.floatValues) {
                const e = Convert2.numberToFloatWithDecimalPlaces(r, o.maximumDecimalPlaces);
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, e);
                w = o.allowEditing.floatValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onFloatRender)) {
                    Trigger.customEvent(o.events.onFloatRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedNumber(r)) {
            b = "number";
            if (!o.ignore.numberValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r);
                w = o.allowEditing.numberValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedBigInt(r)) {
            b = "bigint";
            if (!o.ignore.bigintValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r);
                w = o.allowEditing.bigIntValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedString(r) && Is.String.guid(r)) {
            b = "guid";
            if (!o.ignore.guidValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r);
                w = o.allowEditing.guidValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedString(r) && (Is.String.hexColor(r) || Is.String.rgbColor(r))) {
            b = "color";
            if (!o.ignore.colorValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r);
                w = o.allowEditing.colorValues && !c;
                if (o.showValueColors) {
                    p.style.color = r;
                }
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedString(r) && Is.definedUrl(r)) {
            b = "url";
            if (!o.ignore.urlValues) {
                let n = r;
                if (o.maximumUrlLength > 0 && n.length > o.maximumUrlLength) {
                    n = `${n.substring(0, o.maximumUrlLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, n);
                w = o.allowEditing.urlValues && !c;
                if (o.showUrlOpenButtons) {
                    V = DomElement.createWithHTML(f, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    V.onclick = () => window.open(r);
                }
                X(o, t, l, r, p, a, w, V);
                if (Is.definedFunction(o.events.onUrlRender)) {
                    Trigger.customEvent(o.events.onUrlRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedString(r) && Is.definedEmail(r)) {
            b = "email";
            if (!o.ignore.emailValues) {
                let n = r;
                if (o.maximumEmailLength > 0 && n.length > o.maximumEmailLength) {
                    n = `${n.substring(0, o.maximumEmailLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, n);
                w = o.allowEditing.emailValues && !c;
                if (o.showEmailOpenButtons) {
                    V = DomElement.createWithHTML(f, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    V.onclick = () => window.open(`mailto:${r}`);
                }
                X(o, t, l, r, p, a, w, V);
                if (Is.definedFunction(o.events.onEmailRender)) {
                    Trigger.customEvent(o.events.onEmailRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedString(r)) {
            b = "string";
            if (!o.ignore.stringValues || D) {
                if (o.parse.stringsToBooleans && Is.String.boolean(r)) {
                    Z(t, n, o, l, r.toString().toLowerCase().trim() === "true", i, a, s, u, c);
                    x = true;
                    T = true;
                } else if (o.parse.stringsToNumbers && Is.String.bigInt(r)) {
                    Z(t, n, o, l, Convert2.stringToBigInt(r), i, a, s, u, c);
                    x = true;
                    T = true;
                } else if (o.parse.stringsToNumbers && !isNaN(r)) {
                    Z(t, n, o, l, parseFloat(r), i, a, s, u, c);
                    x = true;
                    T = true;
                } else if (o.parse.stringsToDates && Is.String.date(r)) {
                    Z(t, n, o, l, new Date(r), i, a, s, u, c);
                    x = true;
                    T = true;
                } else if (o.parse.stringsToSymbols && Is.String.symbol(r)) {
                    Z(t, n, o, l, Symbol(Convert2.symbolToString(r)), i, a, s, u, c);
                    x = true;
                    T = true;
                } else {
                    let n = r;
                    if (!D) {
                        if (o.maximumStringLength > 0 && n.length > o.maximumStringLength) {
                            n = `${n.substring(0, o.maximumStringLength)}${" "}${e.text.ellipsisText}${" "}`;
                        }
                        n = o.showStringQuotes ? `"${n}"` : n;
                        m = o.showValueColors ? `${b} value` : "value";
                        w = o.allowEditing.stringValues && !c;
                    } else {
                        m = "no-properties-text";
                        w = false;
                        v = false;
                    }
                    p = DomElement.createWithHTML(f, "span", m, n);
                    if (!D) {
                        X(o, t, l, r, p, a, w);
                        if (Is.definedFunction(o.events.onStringRender)) {
                            Trigger.customEvent(o.events.onStringRender, o._currentView.element, p);
                        }
                        ne(o, f, i);
                    }
                }
            } else {
                x = true;
            }
        } else if (Is.definedDate(r)) {
            b = "date";
            if (!o.ignore.dateValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, DateTime.getCustomFormattedDateText(e, r, o.dateTimeFormat));
                w = o.allowEditing.dateValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedSymbol(r)) {
            b = "symbol";
            if (!o.ignore.symbolValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r.toString());
                w = o.allowEditing.symbolValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedRegExp(r)) {
            b = "regexp";
            if (!o.ignore.regexpValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.createWithHTML(f, "span", m, r.source.toString());
                w = o.allowEditing.regExpValues && !c;
                X(o, t, l, r, p, a, w);
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedImage(r)) {
            b = "image";
            if (!o.ignore.imageValues) {
                m = o.showValueColors ? `${b} value` : "value";
                p = DomElement.create(f, "span", m);
                w = o.allowEditing.imageValues && !c;
                X(o, t, l, r, p, a, w);
                const e = DomElement.create(p, "img");
                e.src = r.src;
                if (Is.definedFunction(o.events.onImageRender)) {
                    Trigger.customEvent(o.events.onImageRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        } else if (Is.definedHtml(r)) {
            b = "html";
            if (!o.ignore.htmlValues) {
                const t = Convert2.htmlToObject(r, o.showCssStylesForHtmlObjects);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    x = true;
                } else {
                    const r = DomElement.create(f, "span", o.showValueColors ? b : "");
                    const a = DomElement.create(d, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    G(a, o);
                    if (i) {
                        a.classList.add("last-item");
                    }
                    p = DomElement.createWithHTML(r, "span", "main-title", e.text.htmlText);
                    if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `<${l}>`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                        c = DomElement.createWithHTML(r, "span", "closed-symbols", "{ ... }");
                    }
                    let m = ne(o, r, i);
                    const x = z(g, m, a, o, t, n, u, c, true, i, s, b, true);
                    if (!x && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                x = true;
            }
        } else if (Is.definedSet(r)) {
            b = "set";
            if (!o.ignore.setValues) {
                const t = Convert2.setToArray(r);
                const n = DomElement.create(f, "span", o.showValueColors ? b : "");
                const l = DomElement.create(d, "div", "object-type-contents");
                let a = null;
                let u = null;
                G(l, o);
                if (i) {
                    l.classList.add("last-item");
                }
                p = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                    u = DomElement.createWithHTML(n, "span", "closed-symbols", "[ ... ]");
                }
                let c = ne(o, n, i);
                const m = U(g, c, l, o, t, a, u, true, i, s, b, true);
                if (!m && o.showOpeningClosingCurlyBraces) {
                    a.parentNode.removeChild(a);
                    u.parentNode.removeChild(u);
                }
            } else {
                x = true;
            }
        } else if (Is.definedArray(r)) {
            b = "array";
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(f, "span", o.showValueColors ? b : "");
                const n = DomElement.create(d, "div", "object-type-contents");
                let l = null;
                let a = null;
                G(n, o);
                if (i) {
                    n.classList.add("last-item");
                }
                p = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(t, "span", "size", `[${r.length}]`);
                }
                if (o.showOpeningClosingCurlyBraces) {
                    l = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                    a = DomElement.createWithHTML(t, "span", "closed-symbols", "[ ... ]");
                }
                let u = ne(o, t, i);
                const c = U(g, u, n, o, r, l, a, true, i, s, b, false);
                if (!c && o.showOpeningClosingCurlyBraces) {
                    l.parentNode.removeChild(l);
                    a.parentNode.removeChild(a);
                }
            } else {
                x = true;
            }
        } else if (Is.definedMap(r)) {
            b = "map";
            if (!o.ignore.mapValues) {
                const t = Convert2.mapToObject(r);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    x = true;
                } else {
                    const r = DomElement.create(f, "span", o.showValueColors ? b : "");
                    const a = DomElement.create(d, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    G(a, o);
                    if (i) {
                        a.classList.add("last-item");
                    }
                    p = DomElement.createWithHTML(r, "span", "main-title", e.text.mapText);
                    if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `{${l}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                        c = DomElement.createWithHTML(r, "span", "closed-symbols", "{ ... }");
                    }
                    let m = ne(o, r, i);
                    const x = z(g, m, a, o, t, n, u, c, true, i, s, b, true);
                    if (!x && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                x = true;
            }
        } else if (Is.definedObject(r)) {
            b = "object";
            if (!o.ignore.objectValues) {
                const t = Obj.getPropertyNames(r, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    x = true;
                } else {
                    const l = DomElement.create(f, "span", o.showValueColors ? b : "");
                    const a = DomElement.create(d, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    G(a, o);
                    if (i) {
                        a.classList.add("last-item");
                    }
                    p = DomElement.createWithHTML(l, "span", "main-title", e.text.objectText);
                    if (o.showObjectSizes && (n > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(l, "span", "size", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                        c = DomElement.createWithHTML(l, "span", "closed-symbols", "{ ... }");
                    }
                    let m = ne(o, l, i);
                    const x = z(g, m, a, o, r, t, u, c, true, i, s, b, false);
                    if (!x && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                x = true;
            }
        } else {
            b = "unknown";
            if (!o.ignore.unknownValues) {
                m = o.showValueColors ? `${b} value non-value` : "value non-value";
                p = DomElement.createWithHTML(f, "span", m, r.toString());
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, o._currentView.element, p);
                }
                ne(o, f, i);
            } else {
                x = true;
            }
        }
        if (!D && !T) {
            Y(o, b);
        }
        if (x) {
            n.removeChild(d);
        } else {
            if (Is.defined(p)) {
                if (!D) {
                    H(o, r, p);
                    R(o, r, p);
                    F(o, b, p);
                    le(o, p, w, t, r, l, a, V);
                }
                if (Is.defined(h)) {
                    if (b !== "null" && b !== "undefined" && b !== "array" && b !== "object" && b !== "map" && b !== "set") {
                        h.innerHTML = `(${b})`;
                    } else {
                        h.parentNode.removeChild(h);
                        h = null;
                    }
                }
                if (v) {
                    K(o, s, y, h, p);
                    ee(o, p, r, b, w);
                } else {
                    p.ondblclick = DomElement.cancelBubble;
                }
            }
        }
    }
    function Y(e, t) {
        if (!e._currentView.dataTypeCounts.hasOwnProperty(t)) {
            e._currentView.dataTypeCounts[t] = 0;
        }
        e._currentView.dataTypeCounts[t]++;
    }
    function G(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            e.classList.add("object-border");
            if (!t.showArrowToggles) {
                e.classList.add("object-border-no-arrow-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function K(e, t, n, o, l) {
        if (Is.definedObject(e.valueToolTips)) {
            if (e.logJsonValueToolTipPaths) {
                console.log(t);
            }
            if (!e.valueToolTips.hasOwnProperty(t)) {
                const n = t.split("\\");
                const o = n.length - 1;
                for (let t = 0; t < o; t++) {
                    n[t] = e.jsonPathAny;
                }
                t = n.join(e.jsonPathSeparator);
            }
            if (e.valueToolTips.hasOwnProperty(t)) {
                ToolTip.add(n, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
                ToolTip.add(o, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
                ToolTip.add(l, e, e.valueToolTips[t], "jsontree-js-tooltip-value");
            }
        }
    }
    function Q(t, n, o, l, i) {
        if (t.allowEditing.propertyNames) {
            l.ondblclick = a => {
                DomElement.cancelBubble(a);
                let s = 0;
                let u = null;
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                l.classList.add("editable-name");
                if (i) {
                    s = Arr.getIndexFromBrackets(l.innerHTML);
                    l.innerHTML = s.toString();
                } else {
                    l.innerHTML = l.innerHTML.replace(/['"]+/g, "");
                }
                l.setAttribute("contenteditable", "true");
                l.focus();
                DomElement.selectAllText(l);
                l.onblur = () => {
                    r(t, false);
                    if (Is.definedString(u)) {
                        W(t, u);
                    }
                };
                l.onkeydown = r => {
                    if (r.code === "Escape") {
                        r.preventDefault();
                        l.setAttribute("contenteditable", "false");
                    } else if (r.code === "Enter") {
                        r.preventDefault();
                        const a = l.innerText;
                        if (i) {
                            if (Is.definedString(a) && !isNaN(+a)) {
                                let o = +a;
                                if (!t.useZeroIndexingForArrays) {
                                    o--;
                                }
                                if (s !== o) {
                                    u = e.text.indexUpdatedText;
                                    Arr.moveIndex(n, s, o);
                                    Trigger.customEvent(t.events.onJsonEdit, t._currentView.element);
                                }
                            } else {
                                n.splice(Arr.getIndexFromBrackets(o), 1);
                                u = e.text.itemDeletedText;
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
                        l.setAttribute("contenteditable", "false");
                    }
                };
            };
        }
    }
    function X(e, t, n, o, l, r, i, a = null) {
        if (i) {
            l.ondblclick = i => {
                q(i, e, t, n, o, l, r, a);
            };
        }
    }
    function q(t, n, o, l, i, a, s, u = null) {
        let c = null;
        DomElement.cancelBubble(t);
        clearTimeout(n._currentView.valueClickTimerId);
        n._currentView.valueClickTimerId = 0;
        n._currentView.editMode = true;
        a.classList.add("editable");
        a.setAttribute("contenteditable", "true");
        if (Is.definedDate(i) && !n.includeTimeZoneInDateTimeEditing) {
            a.innerText = JSON.stringify(i).replace(/['"]+/g, "");
        } else if (Is.definedRegExp(i)) {
            a.innerText = i.source;
        } else if (Is.definedSymbol(i)) {
            a.innerText = Convert2.symbolToString(i);
        } else if (Is.definedImage(i)) {
            a.innerText = i.src;
        } else {
            a.innerText = i.toString();
        }
        a.focus();
        DomElement.selectAllText(a);
        if (Is.defined(u)) {
            u.parentNode.removeChild(u);
        }
        a.onblur = () => {
            r(n, false);
            if (Is.definedString(c)) {
                W(n, c);
            }
        };
        a.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                a.setAttribute("contenteditable", "false");
            } else if (t.code === "Enter") {
                t.preventDefault();
                const r = a.innerText;
                if (r.trim() === "") {
                    if (s) {
                        o.splice(Arr.getIndexFromBrackets(l), 1);
                    } else {
                        delete o[l];
                    }
                    c = e.text.itemDeletedText;
                } else {
                    let t = Convert2.stringToDataTypeValue(i, r);
                    if (t !== null) {
                        if (s) {
                            o[Arr.getIndexFromBrackets(l)] = t;
                        } else {
                            o[l] = t;
                        }
                        c = e.text.valueUpdatedText;
                        Trigger.customEvent(n.events.onJsonEdit, n._currentView.element);
                    }
                }
                a.setAttribute("contenteditable", "false");
            }
        };
    }
    function ee(e, t, n, o, l) {
        if (Is.definedFunction(e.events.onValueClick)) {
            t.onclick = () => {
                if (l) {
                    e._currentView.valueClickTimerId = setTimeout((() => {
                        if (!e._currentView.editMode) {
                            Trigger.customEvent(e.events.onValueClick, e._currentView.element, n, o);
                        }
                    }), e.editingValueClickDelay);
                } else {
                    t.ondblclick = DomElement.cancelBubble;
                    Trigger.customEvent(e.events.onValueClick, e._currentView.element, n, o);
                }
            };
        } else {
            t.classList.add("no-hover");
        }
    }
    function te(e, t, n, o, l, r, i, a) {
        const s = e._currentView.contentPanelsIndex;
        const u = e._currentView.contentPanelsDataIndex;
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(u)) {
            e._currentView.contentPanelsOpen[u] = {};
        }
        const c = () => {
            o.style.display = "none";
            e._currentView.contentPanelsOpen[u][s] = true;
            if (Is.defined(t)) {
                t.className = "right-arrow";
            }
            if (Is.defined(l)) {
                l.style.display = "none";
            }
            if (Is.defined(r)) {
                r.style.display = "inline-block";
            }
            if (Is.defined(n)) {
                n.style.display = "inline-block";
            }
        };
        const d = () => {
            o.style.display = "block";
            e._currentView.contentPanelsOpen[u][s] = false;
            if (Is.defined(t)) {
                t.className = "down-arrow";
            }
            if (Is.defined(l)) {
                l.style.display = "inline-block";
            }
            if (Is.defined(r)) {
                r.style.display = "none";
            }
            if (Is.defined(n)) {
                n.style.display = "none";
            }
        };
        const f = e => {
            if (e) {
                c();
            } else {
                d();
            }
        };
        let g = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[u].hasOwnProperty(s)) {
            g = e._currentView.contentPanelsOpen[u][s];
        } else {
            if (!e._currentView.initialized) {
                if (a === "object" && e.autoClose.objectSize > 0 && i >= e.autoClose.objectSize) {
                    g = true;
                } else if (a === "array" && e.autoClose.arraySize > 0 && i >= e.autoClose.arraySize) {
                    g = true;
                } else if (a === "map" && e.autoClose.mapSize > 0 && i >= e.autoClose.mapSize) {
                    g = true;
                } else if (a === "set" && e.autoClose.setSize > 0 && i >= e.autoClose.setSize) {
                    g = true;
                } else if (a === "html" && e.autoClose.htmlSize > 0 && i >= e.autoClose.htmlSize) {
                    g = true;
                }
            }
            e._currentView.contentPanelsOpen[u][s] = g;
        }
        if (Is.defined(t)) {
            t.onclick = () => f(t.className === "down-arrow");
            t.ondblclick = DomElement.cancelBubble;
        }
        f(g);
        e._currentView.contentPanelsIndex++;
    }
    function ne(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function oe(e, t, n, o, l) {
        let r = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles || e.showOpenedObjectArrayBorders) {
            DomElement.create(r, "div", "no-arrow");
        }
        DomElement.createWithHTML(r, "div", "object-type-end", n);
        ne(e, r, l);
    }
    function le(t, n, o, l, r, i, a, s) {
        n.oncontextmenu = u => {
            DomElement.cancelBubble(u);
            t._currentView.contextMenu.innerHTML = "";
            if (o) {
                const o = ContextMenu.addMenuItem(t, e.text.editSymbolButtonText, e.text.editButtonText);
                o.onclick = e => re(e, t, n, l, i, r, a, s);
            }
            const c = ContextMenu.addMenuItem(t, e.text.copyButtonSymbolText, e.text.copyButtonText);
            c.onclick = e => ie(e, t, r);
            if (o) {
                const n = ContextMenu.addMenuItem(t, e.text.removeSymbolButtonText, e.text.removeButtonText);
                n.onclick = e => ae(e, t, l, i, a);
            }
            DomElement.showElementAtMousePosition(u, t._currentView.contextMenu, 0);
        };
    }
    function re(e, t, n, o, l, r, i, a) {
        DomElement.cancelBubble(e);
        q(e, t, o, l, r, n, i, a);
        ContextMenu.hide(t);
    }
    function ie(e, t, n) {
        DomElement.cancelBubble(e);
        h(t, n);
        ContextMenu.hide(t);
    }
    function ae(t, n, o, l, i) {
        DomElement.cancelBubble(t);
        if (i) {
            o.splice(Arr.getIndexFromBrackets(l), 1);
        } else {
            delete o[l];
        }
        ContextMenu.hide(n);
        r(n, false);
        W(n, e.text.itemDeletedText);
    }
    function se(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => ue(t, n);
            t._currentView.element.ondragenter = () => ue(t, n);
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => ce(e, t);
        }
    }
    function ue(e, t) {
        if (!e._currentView.columnDragging) {
            t.style.display = "block";
        }
    }
    function ce(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            de(e.dataTransfer.files, t);
        }
    }
    function de(t, n) {
        const o = t.length;
        let l = 0;
        let i = [];
        const a = t => {
            l++;
            i.push(t);
            if (l === o) {
                n._currentView.dataArrayCurrentIndex = 0;
                n._currentView.contentPanelsOpen = {};
                n.data = i.length === 1 ? i[0] : i;
                r(n);
                W(n, e.text.importedText.replace("{0}", o.toString()));
                Trigger.customEvent(n.events.onSetJson, n._currentView.element);
            }
        };
        for (let e = 0; e < o; e++) {
            const n = t[e];
            const o = n.name.split(".").pop().toLowerCase();
            if (o === "json") {
                fe(n, a);
            }
        }
    }
    function fe(t, n) {
        const o = new FileReader;
        let l = null;
        o.onloadend = () => n(l);
        o.onload = t => {
            const n = Convert2.jsonStringToObject(t.target.result, e);
            if (n.parsed && Is.definedObject(n.object)) {
                l = n.object;
            }
        };
        o.readAsText(t);
    }
    function ge(t) {
        const n = (n, o) => Convert2.stringifyJson(n, o, e, t.showCssStylesForHtmlObjects);
        const o = JSON.stringify(t.data, n, t.jsonIndentSpaces);
        if (Is.definedString(o)) {
            const n = DomElement.create(document.body, "a");
            n.style.display = "none";
            n.setAttribute("target", "_blank");
            n.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(o)}`);
            n.setAttribute("download", me(t));
            n.click();
            document.body.removeChild(n);
            M(t);
            W(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function me(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function pe(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        n("keydown", (t => xe(t, e)));
    }
    function xe(e, o) {
        if (o.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(o._currentView.element.id) && !o._currentView.editMode) {
            if (Te(e) && e.code === "F11") {
                e.preventDefault();
                v(o);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                B(o);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                I(o);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                E(o);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                S(o);
            } else if (e.code === "Escape") {
                e.preventDefault();
                M(o);
            }
        }
    }
    function Te(e) {
        return e.ctrlKey || e.metaKey;
    }
    function be(e) {
        e._currentView.element.innerHTML = "";
        e._currentView.element.classList.remove("json-tree-js");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        pe(e, false);
        ToolTip.assignToEvents(e, false);
        ContextMenu.assignToEvents(e, false);
        ToolTip.remove(e);
        ContextMenu.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const ye = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                r(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return ye;
        },
        refreshAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    r(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return ye;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                l(Binding.Options.getForNewInstance(t, e));
            }
            return ye;
        },
        renderAll: function() {
            o();
            return ye;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                S(t[e]);
            }
            return ye;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                E(t[e]);
            }
            return ye;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    B(t[e]);
                }
            }
            return ye;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    I(t[e]);
                }
            }
            return ye;
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
                let l = null;
                if (Is.definedString(o)) {
                    const t = Convert2.jsonStringToObject(o, e);
                    if (t.parsed) {
                        l = t.object;
                    }
                } else {
                    l = o;
                }
                const i = t[n];
                i._currentView.dataArrayCurrentIndex = 0;
                i._currentView.contentPanelsOpen = {};
                i.data = l;
                r(i);
                Trigger.customEvent(i.events.onSetJson, i._currentView.element);
            }
            return ye;
        },
        getJson: function(e) {
            let n = null;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                n = t[e].data;
            }
            return n;
        },
        updateBindingOptions: function(e, n) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const o = t[e];
                const l = o.data;
                const i = o._currentView;
                t[e] = Binding.Options.get(n);
                t[e].data = l;
                t[e]._currentView = i;
                r(t[e]);
            }
            return ye;
        },
        getBindingOptions: function(e) {
            let n = null;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                n = t[e];
            }
            return n;
        },
        destroy: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                be(t[e]);
                delete t[e];
                n--;
            }
            return ye;
        },
        destroyAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    be(t[e]);
                }
            }
            t = {};
            n = 0;
            return ye;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const o = e;
                for (const l in t) {
                    if (t.hasOwnProperty(l) && e.hasOwnProperty(l) && o[l] !== t[l]) {
                        o[l] = t[l];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(o);
                }
            }
            return ye;
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
            return "4.1.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => o()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = ye;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map