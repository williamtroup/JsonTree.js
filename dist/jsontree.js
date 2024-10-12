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
        function s(e) {
            return e.startsWith("Symbol(") && e.endsWith(")");
        }
        e.symbol = s;
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
        return e !== null && e !== void 0 && typeof e === "string";
    }
    e.definedStringAny = i;
    function s(e) {
        return n(e) && typeof e === "function";
    }
    e.definedFunction = s;
    function a(e) {
        return n(e) && typeof e === "number";
    }
    e.definedNumber = a;
    function u(e) {
        return n(e) && typeof e === "bigint";
    }
    e.definedBigInt = u;
    function c(e) {
        return e !== null && e !== void 0 && e instanceof Array;
    }
    e.definedArray = c;
    function d(e) {
        return o(e) && e instanceof Date;
    }
    e.definedDate = d;
    function f(e) {
        return n(e) && typeof e === "number" && e % 1 !== 0;
    }
    e.definedFloat = f;
    function g(e) {
        return n(e) && typeof e === "symbol";
    }
    e.definedSymbol = g;
    function m(e) {
        return n(e) && e instanceof RegExp;
    }
    e.definedRegExp = m;
    function p(e) {
        return n(e) && (e instanceof Map || e instanceof WeakMap);
    }
    e.definedMap = p;
    function x(e) {
        return n(e) && (e instanceof Set || e instanceof WeakSet);
    }
    e.definedSet = x;
    function T(e) {
        return n(e) && e instanceof Image;
    }
    e.definedImage = T;
    function b(e) {
        return n(e) && e instanceof HTMLElement;
    }
    e.definedHtml = b;
    function w(e) {
        let t;
        try {
            t = new URL(e);
        } catch {
            t = null;
        }
        return t !== null && (t.protocol === "http:" || t.protocol === "https:");
    }
    e.definedUrl = w;
    function h(e) {
        const t = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e);
    }
    e.definedEmail = h;
    function y(e, t = 1) {
        return !c(e) || e.length < t;
    }
    e.invalidOptionArray = y;
})(Is || (Is = {}));

var Convert2;

(Convert => {
    function toJsonStringifyClone(e, t, n) {
        let o = null;
        if (!Is.defined(e)) {
            o = null;
        } else if (Is.definedDate(e)) {
            if (!n.includeTimeZoneInDates) {
                o = JSON.stringify(e).replace(/['"]+/g, "");
            } else {
                o = e.toString();
            }
        } else if (Is.definedSymbol(e)) {
            o = symbolToString(e);
        } else if (Is.definedBigInt(e)) {
            o = e.toString();
        } else if (Is.definedFunction(e)) {
            o = Default.getFunctionName(e, t).name;
        } else if (Is.definedRegExp(e)) {
            o = e.source;
        } else if (Is.definedImage(e)) {
            o = e.src;
        } else if (Is.definedHtml(e)) {
            o = htmlToObject(e, n.showCssStylesForHtmlObjects);
        } else if (Is.definedArray(e)) {
            o = [];
            const l = e.length;
            for (let r = 0; r < l; r++) {
                o.push(toJsonStringifyClone(e[r], t, n));
            }
        } else if (Is.definedSet(e)) {
            o = [];
            const l = setToArray(e);
            const r = l.length;
            for (let e = 0; e < r; e++) {
                o.push(toJsonStringifyClone(l[e], t, n));
            }
        } else if (Is.definedMap(e)) {
            o = {};
            const l = mapToObject(e);
            for (const e in l) {
                if (l.hasOwnProperty(e)) {
                    o[e] = toJsonStringifyClone(l[e], t, n);
                }
            }
        } else if (Is.definedObject(e)) {
            o = {};
            for (const l in e) {
                if (e.hasOwnProperty(l)) {
                    o[l] = toJsonStringifyClone(e[l], t, n);
                }
            }
        } else {
            o = e;
        }
        return o;
    }
    Convert.toJsonStringifyClone = toJsonStringifyClone;
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
        const s = e.cloneNode(true);
        let a = s.children.length;
        while (a > 0) {
            if (s.children[0].nodeType !== Node.TEXT_NODE) {
                s.removeChild(s.children[0]);
            }
            a--;
        }
        n[r] = [];
        n[i] = s.innerText;
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
        } catch (exception1) {
            try {
                result.object = eval(`(${objectString})`);
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!configuration.safeMode) {
                    console.error(configuration.text.objectErrorText.replace("{{error_1}}", exception1.message).replace("{{error_2}}", e.message));
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
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getObject = s;
    function a(e, t, n) {
        return Is.definedNumber(e) ? e >= n ? e : n : t;
    }
    e.getNumberMinimum = a;
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
    function n(e, t, n = "", o = null) {
        const l = t.toLowerCase();
        const r = l === "text";
        const i = r ? document.createTextNode("") : document.createElement(l);
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
    function o(e, t, o, l, r = null) {
        const i = n(e, t, o, r);
        i.innerHTML = l;
        return i;
    }
    e.createWithHTML = o;
    function l(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        const o = n ? document.createTextNode("") : document.createElement(t);
        return o;
    }
    e.createWithNoContainer = l;
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
    function s(e, t, n) {
        let o = e.pageX;
        let l = e.pageY;
        const r = i();
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
    function a(e) {
        const t = document.createRange();
        t.selectNodeContents(e);
        const n = window.getSelection();
        n.removeAllRanges();
        n.addRange(t);
    }
    e.selectAllText = a;
    function u(e, t, l, r, i, s) {
        const a = n(e, "div", "checkbox");
        const u = n(a, "label", "checkbox");
        const c = n(u, "input");
        c.type = "checkbox";
        c.name = l;
        c.checked = r;
        c.autocomplete = "off";
        n(u, "span", "check-mark");
        o(u, "span", `text ${i}`, t);
        if (Is.definedString(s)) {
            o(u, "span", `additional-text`, s);
        }
        return c;
    }
    e.createCheckBox = u;
    function c(e) {
        const t = {};
        t.left = 0;
        t.top = 0;
        while (e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop)) {
            t.left += e.offsetLeft - e.scrollLeft;
            t.top += e.offsetTop - e.scrollTop;
            e = e.offsetParent;
        }
        return t;
    }
    e.getOffset = c;
    function d(e, t, n = false) {
        const o = getComputedStyle(e);
        let l = o.getPropertyValue(t);
        if (n) {
            l = parseFloat(l);
        }
        return l;
    }
    e.getStyleValueByName = d;
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
            o._currentView.currentDataArrayPageIndex = (o.paging.startPage - 1) * o.paging.columnsPerPage;
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
            o._currentView.currentContentColumns = [];
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
            o._currentView.contextMenu = null;
            o._currentView.currentColumnBuildingIndex = 0;
            o._currentView.selectedValues = [];
            if (o.paging.enabled && Is.definedArray(o.data) && o.data.length > 1 && o._currentView.currentDataArrayPageIndex > o.data.length - 1) {
                o._currentView.currentDataArrayPageIndex = 0;
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
            const t = Default.getObject(e, {});
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
            t.fileDroppingEnabled = Default.getBoolean(t.fileDroppingEnabled, true);
            t.jsonIndentSpaces = Default.getNumber(t.jsonIndentSpaces, 8);
            t.showArrayIndexBrackets = Default.getBoolean(t.showArrayIndexBrackets, true);
            t.showOpeningClosingCurlyBraces = Default.getBoolean(t.showOpeningClosingCurlyBraces, false);
            t.showOpeningClosingSquaredBrackets = Default.getBoolean(t.showOpeningClosingSquaredBrackets, false);
            t.includeTimeZoneInDates = Default.getBoolean(t.includeTimeZoneInDates, true);
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
            t.showCssStylesForHtmlObjects = Default.getBoolean(t.showCssStylesForHtmlObjects, false);
            t.jsonPathAny = Default.getString(t.jsonPathAny, "..");
            t.jsonPathSeparator = Default.getString(t.jsonPathSeparator, "\\");
            t.showChildIndexes = Default.getBoolean(t.showChildIndexes, true);
            t.showClosedArraySquaredBrackets = Default.getBoolean(t.showClosedArraySquaredBrackets, true);
            t.showClosedObjectCurlyBraces = Default.getBoolean(t.showClosedObjectCurlyBraces, true);
            t.convertClickedValuesToString = Default.getBoolean(t.convertClickedValuesToString, false);
            t.rootName = Default.getString(t.rootName, "root");
            t.emptyStringValue = Default.getString(t.emptyStringValue, "");
            t.maximum = l(t);
            t.paging = r(t);
            t.title = i(t);
            t.footer = s(t);
            t.controlPanel = a(t);
            t.lineNumbers = u(t);
            t.ignore = c(t);
            t.tooltip = d(t);
            t.parse = f(t);
            t.allowEditing = g(t);
            t.sideMenu = m(t);
            t.autoClose = p(t);
            t.events = x(t);
            return t;
        }
        t.get = o;
        function l(e) {
            e.maximum = Default.getObject(e.maximum, {});
            e.maximum.decimalPlaces = Default.getNumber(e.maximum.decimalPlaces, 2);
            e.maximum.stringLength = Default.getNumber(e.maximum.stringLength, 0);
            e.maximum.urlLength = Default.getNumber(e.maximum.urlLength, 0);
            e.maximum.emailLength = Default.getNumber(e.maximum.emailLength, 0);
            e.maximum.numberLength = Default.getNumber(e.maximum.numberLength, 0);
            e.maximum.bigIntLength = Default.getNumber(e.maximum.bigIntLength, 0);
            e.maximum.inspectionLevels = Default.getNumber(e.maximum.inspectionLevels, 10);
            return e.maximum;
        }
        function r(e) {
            e.paging = Default.getObject(e.paging, {});
            e.paging.enabled = Default.getBoolean(e.paging.enabled, true);
            e.paging.columnsPerPage = Default.getNumberMaximum(e.paging.columnsPerPage, 1, 6);
            e.paging.startPage = Default.getNumberMinimum(e.paging.startPage, 1, 1);
            e.paging.synchronizeScrolling = Default.getBoolean(e.paging.synchronizeScrolling, false);
            e.paging.allowColumnReordering = Default.getBoolean(e.paging.allowColumnReordering, true);
            e.paging.allowComparisons = Default.getBoolean(e.paging.allowComparisons, false);
            return e.paging;
        }
        function i(e) {
            e.title = Default.getObject(e.title, {});
            e.title.text = Default.getAnyString(e.title.text, "JsonTree.js");
            e.title.showCloseOpenAllButtons = Default.getBoolean(e.title.showCloseOpenAllButtons, true);
            e.title.showCopyButton = Default.getBoolean(e.title.showCopyButton, true);
            e.title.enableFullScreenToggling = Default.getBoolean(e.title.enableFullScreenToggling, true);
            e.title.showFullScreenButton = Default.getBoolean(e.title.showFullScreenButton, true);
            return e.title;
        }
        function s(e) {
            e.footer = Default.getObject(e.footer, {});
            e.footer.enabled = Default.getBoolean(e.footer.enabled, true);
            e.footer.showDataTypes = Default.getBoolean(e.footer.showDataTypes, true);
            e.footer.showLengths = Default.getBoolean(e.footer.showLengths, true);
            e.footer.showSizes = Default.getBoolean(e.footer.showSizes, true);
            e.footer.showPageOf = Default.getBoolean(e.footer.showPageOf, true);
            e.footer.statusResetDelay = Default.getNumber(e.footer.statusResetDelay, 5e3);
            return e.footer;
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
            e.controlPanel.showImportButton = Default.getBoolean(e.controlPanel.showImportButton, true);
            return e.controlPanel;
        }
        function u(e) {
            e.lineNumbers = Default.getObject(e.lineNumbers, {});
            e.lineNumbers.enabled = Default.getBoolean(e.lineNumbers.enabled, true);
            e.lineNumbers.padNumbers = Default.getBoolean(e.lineNumbers.padNumbers, false);
            e.lineNumbers.addDots = Default.getBoolean(e.lineNumbers.addDots, true);
            return e.lineNumbers;
        }
        function c(e) {
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
            return e.ignore;
        }
        function d(e) {
            e.tooltip = Default.getObject(e.tooltip, {});
            e.tooltip.delay = Default.getNumber(e.tooltip.delay, 750);
            e.tooltip.offset = Default.getNumber(e.tooltip.offset, 0);
            return e.tooltip;
        }
        function f(e) {
            e.parse = Default.getObject(e.parse, {});
            e.parse.stringsToDates = Default.getBoolean(e.parse.stringsToDates, false);
            e.parse.stringsToBooleans = Default.getBoolean(e.parse.stringsToBooleans, false);
            e.parse.stringsToNumbers = Default.getBoolean(e.parse.stringsToNumbers, false);
            e.parse.stringsToSymbols = Default.getBoolean(e.parse.stringsToSymbols, false);
            return e.parse;
        }
        function g(e) {
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
            const n = e.allowEditing;
            for (const t in n) {
                if (n.hasOwnProperty(t) && !n[t]) {
                    e.allowEditing.bulk = false;
                    break;
                }
            }
            return e.allowEditing;
        }
        function m(e) {
            e.sideMenu = Default.getObject(e.sideMenu, {});
            e.sideMenu.enabled = Default.getBoolean(e.sideMenu.enabled, true);
            e.sideMenu.showImportButton = Default.getBoolean(e.sideMenu.showImportButton, true);
            e.sideMenu.showExportButton = Default.getBoolean(e.sideMenu.showExportButton, true);
            e.sideMenu.titleText = Default.getAnyString(e.sideMenu.titleText, e.title.text);
            e.sideMenu.showAvailableDataTypeCounts = Default.getBoolean(e.sideMenu.showAvailableDataTypeCounts, true);
            e.sideMenu.showOnlyDataTypesAvailable = Default.getBoolean(e.sideMenu.showOnlyDataTypesAvailable, false);
            e.sideMenu.showClearJsonButton = Default.getBoolean(e.sideMenu.showClearJsonButton, true);
            return e.sideMenu;
        }
        function p(e) {
            e.autoClose = Default.getObject(e.autoClose, {});
            e.autoClose.objectSize = Default.getNumber(e.autoClose.objectSize, 0);
            e.autoClose.arraySize = Default.getNumber(e.autoClose.arraySize, 0);
            e.autoClose.mapSize = Default.getNumber(e.autoClose.mapSize, 0);
            e.autoClose.setSize = Default.getNumber(e.autoClose.setSize, 0);
            e.autoClose.htmlSize = Default.getNumber(e.autoClose.htmlSize, 0);
            return e.autoClose;
        }
        function x(e) {
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
            e.events.onSelectionChange = Default.getFunction(e.events.onSelectionChange, null);
            return e.events;
        }
    })(t = e.Options || (e.Options = {}));
})(Binding || (Binding = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            const t = Default.getObject(e, {});
            t.safeMode = Default.getBoolean(t.safeMode, true);
            t.domElementTypes = Default.getStringOrArray(t.domElementTypes, [ "*" ]);
            t.text = n(t);
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
            e.text.clearJsonSymbolText = Default.getAnyString(e.text.clearJsonSymbolText, "⏎");
            e.text.clearJsonText = Default.getAnyString(e.text.clearJsonText, "Clear JSON");
            e.text.maximumInspectionLevelsReached = Default.getAnyString(e.text.maximumInspectionLevelsReached, "Maximum inspection levels has been reached.");
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
            return e.text;
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
        const n = t ? window.addEventListener : window.removeEventListener;
        const o = t ? document.addEventListener : document.removeEventListener;
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
    function r(e) {
        let t = [];
        const n = e.length;
        for (let o = 0; o < n; o++) {
            const n = e[o];
            if (Is.defined(n)) {
                t.push(n);
            }
        }
        return t;
    }
    e.removeNullOrUndefinedEntries = r;
})(Arr || (Arr = {}));

var Size;

(e => {
    function t(e, t) {
        let n = null;
        const l = o(e, t);
        if (l > 0) {
            const e = Math.floor(Math.log(l) / Math.log(1024));
            return `${Convert2.numberToFloatWithDecimalPlaces(l / Math.pow(1024, e), 2)} ${" KMGTP".charAt(e)}B`;
        }
        return n;
    }
    e.of = t;
    function n(e, t) {
        let o = 0;
        if (Is.defined(e)) {
            if (Is.definedDate(e)) {
                o = e.toString().length;
            } else if (Is.definedImage(e)) {
                o = e.src.length;
            } else if (Is.definedRegExp(e)) {
                o = e.source.length;
            } else if (Is.definedSet(e)) {
                o = n(Convert2.setToArray(e), t);
            } else if (Is.definedMap(e)) {
                o = n(Convert2.mapToObject(e), t);
            } else if (Is.definedHtml(e)) {
                o = n(Convert2.htmlToObject(e, t), t);
            } else if (Is.definedArray(e)) {
                o = e.length;
            } else if (Is.definedObject(e)) {
                for (const t in e) {
                    if (e.hasOwnProperty(t)) {
                        o++;
                    }
                }
            } else {
                if (!Is.definedFunction(e) && !Is.definedSymbol(e)) {
                    o = e.toString().length;
                }
            }
        }
        return o;
    }
    e.length = n;
    function o(e, t) {
        let n = 0;
        if (Is.defined(e)) {
            if (Is.definedNumber(e)) {
                n = 8;
            } else if (Is.definedString(e)) {
                n = e.length * 2;
            } else if (Is.definedBoolean(e)) {
                n = 4;
            } else if (Is.definedBigInt(e)) {
                n = o(e.toString(), t);
            } else if (Is.definedRegExp(e)) {
                n = o(e.toString(), t);
            } else if (Is.definedDate(e)) {
                n = o(e.toString(), t);
            } else if (Is.definedSet(e)) {
                n = o(Convert2.setToArray(e), t);
            } else if (Is.definedMap(e)) {
                n = o(Convert2.mapToObject(e), t);
            } else if (Is.definedHtml(e)) {
                n = o(Convert2.htmlToObject(e, t), t);
            } else if (Is.definedArray(e)) {
                const l = e.length;
                for (let r = 0; r < l; r++) {
                    n += o(e[r], t);
                }
            } else if (Is.definedObject(e)) {
                for (const l in e) {
                    if (e.hasOwnProperty(l)) {
                        n += o(l, t) + o(e[l], t);
                    }
                }
            }
        }
        return n;
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
    function n(e) {
        const t = {};
        t[crypto.randomUUID()] = e;
        return t;
    }
    e.createFromValue = n;
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
        const n = t ? window.addEventListener : window.removeEventListener;
        const o = t ? document.addEventListener : document.removeEventListener;
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
    let o = false;
    function l() {
        DomElement.find(e.domElementTypes, (t => {
            let n = true;
            if (Is.defined(t) && t.hasAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME)) {
                const o = t.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
                if (Is.definedString(o)) {
                    const l = Convert2.jsonStringToObject(o, e);
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
        ContextMenu.renderControl(e);
        if (!Is.definedString(e._currentView.element.id)) {
            e._currentView.element.id = crypto.randomUUID();
            e._currentView.idSet = true;
        }
        e._currentView.element.classList.add("json-tree-js");
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (e.openInFullScreenMode) {
            e._currentView.element.classList.add("full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        ye(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let l = t[n._currentView.element.id].data;
        if (Is.definedUrl(l)) {
            Default.getObjectFromUrl(l, e, (e => {
                s(n, o, e);
            }));
        } else {
            s(n, o, l);
        }
    }
    function s(e, t, n) {
        const o = c(e);
        ToolTip.hide(e);
        ContextMenu.hide(e);
        e.data = n;
        e._currentView.element.innerHTML = "";
        e._currentView.editMode = false;
        e._currentView.contentPanelsIndex = 0;
        e._currentView.sideMenuChanged = false;
        e._currentView.currentContentColumns = [];
        e._currentView.dataTypeCounts = {};
        S(e, n);
        const l = DomElement.create(e._currentView.element, "div", "contents");
        if (t) {
            l.classList.add("page-switch");
        }
        if (e.paging.enabled && Is.definedArray(n)) {
            const t = Is.defined(n[e._currentView.currentDataArrayPageIndex + 1]);
            const r = Arr.removeNullOrUndefinedEntries(n);
            e.data = r;
            for (let n = 0; n < e.paging.columnsPerPage; n++) {
                const i = n + e._currentView.currentDataArrayPageIndex;
                if (i <= r.length - 1) {
                    const s = r[i];
                    e._currentView.contentPanelsIndex = 0;
                    e._currentView.contentPanelsDataIndex = i;
                    a(s, l, e, i, o[n], e.paging.columnsPerPage, t);
                }
            }
        } else {
            e._currentView.contentPanelsIndex = 0;
            e._currentView.contentPanelsDataIndex = 0;
            a(n, l, e, null, o[0], 1, false);
        }
        _(e);
        A(e);
        F(e);
        me(e);
        e._currentView.initialized = true;
    }
    function a(t, n, o, l, r, i, s) {
        const a = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        if (!Is.defined(t)) {
            const t = DomElement.create(a, "div", "no-json");
            DomElement.createWithHTML(t, "span", "no-json-text", e.text.noJsonToViewText);
            if (o.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(t, "span", "no-json-import-text", `${e.text.importButtonText}${e.text.ellipsisText}`);
                n.onclick = () => M(o);
            }
        } else {
            a.onscroll = () => d(a, o, o._currentView.currentColumnBuildingIndex);
            if (o.paging.enabled && Is.definedNumber(l)) {
                a.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, l.toString());
            }
            if (s && o.paging.allowColumnReordering && o.paging.columnsPerPage > 1 && o.allowEditing.bulk) {
                a.setAttribute("draggable", "true");
                a.ondragstart = () => f(a, o, l);
                a.ondragend = () => g(a, o);
                a.ondragover = e => e.preventDefault();
                a.ondrop = () => m(o, l);
            }
            let e = a;
            let n = null;
            let i = null;
            if (o.lineNumbers.enabled) {
                n = DomElement.create(a, "div", "contents-column-line-numbers");
                i = DomElement.create(a, "div", "contents-column-lines");
                e = i;
            }
            const c = {
                column: a,
                lineNumbers: n,
                lines: i,
                controlButtons: null
            };
            o._currentView.currentContentColumns.push(c);
            o._currentView.currentColumnBuildingIndex = o._currentView.currentContentColumns.length - 1;
            if (Is.definedArray(t)) {
                q(e, o, t, "array");
            } else if (Is.definedSet(t)) {
                q(e, o, Convert2.setToArray(t), "set");
            } else if (Is.definedHtml(t)) {
                U(e, o, Convert2.htmlToObject(t, o.showCssStylesForHtmlObjects), l, "html");
            } else if (Is.definedMap(t)) {
                U(e, o, Convert2.mapToObject(t), l, "map");
            } else if (Is.definedObject(t)) {
                U(e, o, t, l, "object");
            } else {
                U(e, o, Obj.createFromValue(t), l, "object");
            }
            x(o._currentView.currentColumnBuildingIndex, o);
            T(o, a, t, l);
            if (Is.defined(r)) {
                a.scrollTop = r;
            }
            o._currentView.titleBarButtons.style.display = "block";
            if (o.allowEditing.bulk) {
                a.ondblclick = e => {
                    u(e, o, t, a, l);
                };
            }
        }
    }
    function u(t, n, o, l, r) {
        let s = null;
        if (Is.defined(t)) {
            DomElement.cancelBubble(t);
        }
        clearTimeout(n._currentView.valueClickTimerId);
        n._currentView.valueClickTimerId = 0;
        n._currentView.editMode = true;
        l.classList.add("editable");
        l.setAttribute("contenteditable", "true");
        l.setAttribute("draggable", "false");
        l.innerText = JSON.stringify(Convert2.toJsonStringifyClone(o, e, n), n.events.onCopyJsonReplacer, n.jsonIndentSpaces);
        l.focus();
        DomElement.selectAllText(l);
        l.onblur = () => {
            i(n, false);
            if (Is.definedString(s)) {
                z(n, s);
            }
        };
        l.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                l.setAttribute("contenteditable", "false");
            } else if (Ve(t) && t.code === "Enter") {
                t.preventDefault();
                const o = l.innerText;
                const i = Convert2.jsonStringToObject(o, e);
                if (i.parsed) {
                    s = e.text.jsonUpdatedText;
                    if (n.paging.enabled) {
                        if (Is.defined(i.object)) {
                            n.data[r] = i.object;
                        } else {
                            n.data.splice(r, 1);
                            s = e.text.arrayJsonItemDeleted;
                            if (r === n._currentView.currentDataArrayPageIndex && n._currentView.currentDataArrayPageIndex > 0) {
                                n._currentView.currentDataArrayPageIndex -= n.paging.columnsPerPage;
                            }
                        }
                    } else {
                        n.data = i.object;
                    }
                }
                l.setAttribute("contenteditable", "false");
            } else if (t.code === "Enter") {
                t.preventDefault();
                document.execCommand("insertLineBreak");
            }
        };
    }
    function c(e) {
        const t = [];
        ToolTip.hide(e);
        ContextMenu.hide(e);
        if (e._currentView.editMode || e._currentView.sideMenuChanged) {
            const n = e._currentView.currentContentColumns.length;
            for (let o = 0; o < n; o++) {
                t.push(e._currentView.currentContentColumns[o].column.scrollTop);
            }
        }
        return t;
    }
    function d(e, t, n) {
        ToolTip.hide(t);
        ContextMenu.hide(t);
        const o = e.scrollTop;
        const l = e.scrollLeft;
        const r = t._currentView.currentContentColumns.length;
        if (t.controlPanel.enabled) {
            const e = t._currentView.currentContentColumns[n].controlButtons;
            if (Is.defined(e)) {
                e.style.top = `${t._currentView.currentContentColumns[n].column.scrollTop}px`;
                e.style.right = `-${t._currentView.currentContentColumns[n].column.scrollLeft}px`;
            }
        }
        if (t.paging.synchronizeScrolling) {
            for (let e = 0; e < r; e++) {
                if (n !== e) {
                    t._currentView.currentContentColumns[e].column.scrollTop = o;
                    t._currentView.currentContentColumns[e].column.scrollLeft = l;
                }
            }
        }
        if (t.controlPanel.enabled) {
            for (let e = 0; e < r; e++) {
                if (n !== e) {
                    const n = t._currentView.currentContentColumns[e].controlButtons;
                    if (Is.defined(n)) {
                        n.style.top = `${t._currentView.currentContentColumns[e].column.scrollTop}px`;
                        n.style.right = `-${t._currentView.currentContentColumns[e].column.scrollLeft}px`;
                    }
                }
            }
        }
    }
    function f(e, t, n) {
        t._currentView.columnDragging = true;
        t._currentView.columnDraggingDataIndex = n;
        e.classList.add("draggable-item");
    }
    function g(e, t) {
        t._currentView.columnDragging = false;
        e.classList.remove("draggable-item");
    }
    function m(e, t) {
        e._currentView.columnDragging = false;
        p(e, e._currentView.columnDraggingDataIndex, t);
    }
    function p(t, n, o) {
        if (n !== o) {
            const l = t.data[o];
            const r = t.data[n];
            let s = t._currentView.contentPanelsOpen[o];
            let a = t._currentView.contentPanelsOpen[n];
            if (!Is.defined(s)) {
                s = {};
            }
            if (!Is.defined(a)) {
                a = {};
            }
            t.data[o] = r;
            t.data[n] = l;
            t._currentView.contentPanelsOpen[o] = a;
            t._currentView.contentPanelsOpen[n] = s;
            if (t._currentView.currentDataArrayPageIndex + (t.paging.columnsPerPage - 1) < o) {
                t._currentView.currentDataArrayPageIndex += t.paging.columnsPerPage;
            } else if (o < t._currentView.currentDataArrayPageIndex) {
                t._currentView.currentDataArrayPageIndex -= t.paging.columnsPerPage;
            }
            i(t);
            z(t, e.text.jsonUpdatedText);
        }
    }
    function x(e, t) {
        const n = t._currentView.currentContentColumns[e];
        if (t.lineNumbers.enabled) {
            let e = 1;
            let o = 0;
            let l = 0;
            const r = n.column.querySelectorAll(".object-type-title, .object-type-value-title, .object-type-end");
            const i = r.length;
            n.lineNumbers.innerHTML = "";
            for (let s = 0; s < i; s++) {
                const a = r[s];
                if (a.offsetHeight > 0) {
                    let r = DomElement.getOffset(a).top;
                    if (e === 1) {
                        o = r;
                    }
                    r -= o;
                    const s = DomElement.create(n.lineNumbers, "div", "contents-column-line-number");
                    const u = t.lineNumbers.addDots ? "." : "";
                    if (t.lineNumbers.padNumbers) {
                        s.innerHTML = `${Str.padNumber(e, i.toString().length)}${u}`;
                    } else {
                        s.innerHTML = `${e}${u}`;
                    }
                    const c = r + a.offsetHeight / 2 - s.offsetHeight / 2;
                    s.style.top = `${c}px`;
                    l = Math.max(l, s.offsetWidth);
                }
                e++;
            }
            n.lineNumbers.style.height = `${n.lines.offsetHeight}px`;
            n.lineNumbers.style.width = `${l}px`;
        } else {
            if (Is.defined(n.lineNumbers)) {
                n.lineNumbers.parentNode.removeChild(n.lineNumbers);
                n.lineNumbers = null;
            }
        }
    }
    function T(t, n, o, l) {
        const r = t._currentView.currentColumnBuildingIndex;
        const i = DomElement.create(n, "div", "column-control-buttons");
        i.ondblclick = DomElement.cancelBubble;
        const s = t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1;
        if (t.allowEditing.bulk && t.controlPanel.showEditButton) {
            const r = DomElement.createWithHTML(i, "button", "edit", e.text.editSymbolButtonText);
            r.onclick = () => u(null, t, o, n, l);
            r.ondblclick = DomElement.cancelBubble;
            ToolTip.add(r, t, e.text.editButtonText);
        }
        if (s && t.allowEditing.bulk && t.paging.allowColumnReordering && t.controlPanel.showMovingButtons) {
            const n = DomElement.createWithHTML(i, "button", "move-right", e.text.moveRightSymbolButtonText);
            n.ondblclick = DomElement.cancelBubble;
            if (l + 1 > t.data.length - 1) {
                n.disabled = true;
            } else {
                n.onclick = () => p(t, l, l + 1);
            }
            ToolTip.add(n, t, e.text.moveRightButtonText);
            const o = DomElement.createWithHTML(i, "button", "move-left", e.text.moveLeftSymbolButtonText);
            o.ondblclick = DomElement.cancelBubble;
            if (l - 1 < 0) {
                o.disabled = true;
            } else {
                o.onclick = () => p(t, l, l - 1);
            }
            ToolTip.add(o, t, e.text.moveLeftButtonText);
        }
        if (s && t.controlPanel.showCopyButton) {
            const n = DomElement.createWithHTML(i, "button", "copy", e.text.copyButtonSymbolText);
            n.onclick = () => D(t, o);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.copyButtonText);
        }
        if (s && t.controlPanel.showCloseOpenAllButtons) {
            const n = DomElement.createWithHTML(i, "button", "open-all", e.text.openAllButtonSymbolText);
            n.onclick = () => w(t, l);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.openAllButtonText);
            const o = DomElement.createWithHTML(i, "button", "close-all", e.text.closeAllButtonSymbolText);
            o.onclick = () => h(t, l);
            o.ondblclick = DomElement.cancelBubble;
            ToolTip.add(o, t, e.text.closeAllButtonText);
        }
        if (t.paging.enabled && t.allowEditing.bulk && t.controlPanel.showImportButton) {
            const n = DomElement.createWithHTML(i, "button", "import", e.text.importButtonSymbolText);
            n.onclick = () => M(t, l + 1);
            ToolTip.add(n, t, e.text.importButtonText);
        }
        if (t.allowEditing.bulk && t.controlPanel.showRemoveButton) {
            const n = DomElement.createWithHTML(i, "button", "remove", e.text.removeSymbolButtonText);
            n.onclick = () => y(t, l);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.removeButtonText);
        }
        if (!t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1 && t.controlPanel.showSwitchToPagesButton) {
            const n = DomElement.createWithHTML(i, "button", "switch-to-pages", e.text.switchToPagesSymbolText);
            n.onclick = () => b(t);
            n.ondblclick = DomElement.cancelBubble;
            ToolTip.add(n, t, e.text.switchToPagesText);
        }
        if (i.innerHTML !== "") {
            const e = DomElement.getStyleValueByName(n, "padding-left", true);
            t._currentView.currentContentColumns[r].controlButtons = i;
            n.style.minHeight = `${i.offsetHeight}px`;
            n.style.paddingRight = `${i.offsetWidth + e}px`;
        } else {
            n.removeChild(i);
        }
    }
    function b(e) {
        e.paging.enabled = true;
        i(e);
    }
    function w(e, t) {
        const n = e._currentView.contentPanelsOpen[t];
        for (const e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = false;
            }
        }
        i(e);
    }
    function h(e, t) {
        const n = e._currentView.contentPanelsOpen[t];
        for (const e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = true;
            }
        }
        i(e);
    }
    function y(t, n) {
        if (t.paging.enabled) {
            t.data.splice(n, 1);
            if (n === t._currentView.currentDataArrayPageIndex && t._currentView.currentDataArrayPageIndex > 0) {
                t._currentView.currentDataArrayPageIndex -= t.paging.columnsPerPage;
            }
        } else {
            t.data = null;
        }
        i(t);
        z(t, e.text.arrayJsonItemDeleted);
    }
    function D(t, n) {
        const o = JSON.stringify(Convert2.toJsonStringifyClone(n, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        navigator.clipboard.writeText(o);
        z(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopy, t._currentView.element, o);
    }
    function S(t, n) {
        if (Is.definedString(t.title.text) || t.title.showCloseOpenAllButtons || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => v(t);
            }
            if (t.sideMenu.enabled) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => O(t);
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
                n.onclick = () => B(t);
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
                if (t._currentView.currentDataArrayPageIndex > 0) {
                    t._currentView.backButton.onclick = () => C(t);
                } else {
                    t._currentView.backButton.disabled = true;
                }
                t._currentView.nextButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next", e.text.nextButtonSymbolText);
                t._currentView.nextButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextButton, t, e.text.nextButtonText);
                if (t._currentView.currentDataArrayPageIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
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
            H(t);
            Trigger.customEvent(t.events.onFullScreenChange, t._currentView.element, t._currentView.element.classList.contains("full-screen"));
        }
    }
    function V(t, n) {
        const o = JSON.stringify(Convert2.toJsonStringifyClone(n, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        navigator.clipboard.writeText(o);
        z(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, t._currentView.element, o);
    }
    function B(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function E(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function C(e) {
        if (e._currentView.backButton !== null && !e._currentView.backButton.disabled) {
            e._currentView.currentDataArrayPageIndex -= e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function I(e) {
        if (e._currentView.nextButton !== null && !e._currentView.nextButton.disabled) {
            e._currentView.currentDataArrayPageIndex += e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function _(e) {
        e._currentView.disabledBackground = DomElement.create(e._currentView.element, "div", "disabled-background");
        e._currentView.disabledBackground.onclick = () => L(e);
    }
    function A(t) {
        if (t.sideMenu.enabled) {
            t._currentView.sideMenu = DomElement.create(t._currentView.element, "div", "side-menu");
            const n = DomElement.create(t._currentView.sideMenu, "div", "side-menu-title-bar");
            if (Is.definedString(t.sideMenu.titleText)) {
                const e = DomElement.create(n, "div", "side-menu-title-bar-text");
                e.innerHTML = t.sideMenu.titleText;
            }
            const o = DomElement.create(n, "div", "side-menu-title-controls");
            if (t.sideMenu.showClearJsonButton && Is.definedObject(t.data)) {
                const n = DomElement.createWithHTML(o, "button", "clear-json", e.text.clearJsonSymbolText);
                n.onclick = () => P(t);
                ToolTip.add(n, t, e.text.clearJsonText);
            }
            if (t.sideMenu.showExportButton && Is.definedObject(t.data)) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => we(t);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => M(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const l = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            l.onclick = () => L(t);
            ToolTip.add(l, t, e.text.closeButtonText);
            if (Is.definedObject(t.data)) {
                const e = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
                N(e, t);
            }
        }
    }
    function M(e, t = null) {
        const n = DomElement.createWithNoContainer("input");
        n.type = "file";
        n.accept = ".json";
        n.multiple = true;
        L(e);
        n.onchange = () => Te(n.files, e, t);
        n.click();
    }
    function O(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
            ContextMenu.hide(e);
        }
    }
    function L(t) {
        let n = false;
        if (t._currentView.sideMenu.classList.contains("side-menu-open")) {
            t._currentView.sideMenu.classList.remove("side-menu-open");
            t._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(t);
            ContextMenu.hide(t);
            if (t._currentView.sideMenuChanged) {
                setTimeout((() => {
                    i(t);
                    z(t, e.text.ignoreDataTypesUpdated);
                }), 500);
            }
            n = true;
        }
        return n;
    }
    function P(t) {
        t.data = null;
        i(t);
        z(t, e.text.jsonUpdatedText);
    }
    function N(t, n) {
        const o = [];
        const l = DomElement.create(t, "div", "settings-panel");
        const r = DomElement.create(l, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(r, "div", "settings-panel-title-text", `${e.text.showDataTypesText}:`);
        const i = DomElement.create(r, "div", "settings-panel-control-buttons");
        const s = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const a = DomElement.create(i, "div", "settings-panel-control-button");
        s.onclick = () => j(n, o, true);
        a.onclick = () => j(n, o, false);
        ToolTip.add(s, n, e.text.selectAllText);
        ToolTip.add(a, n, e.text.selectNoneText);
        const u = DomElement.create(l, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        c.sort();
        c.forEach(((e, t) => {
            const l = k(u, e, n, !d[`${e}Values`]);
            if (Is.defined(l)) {
                o.push(l);
            }
        }));
    }
    function j(e, t, n) {
        const o = t.length;
        const l = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            l[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function k(e, t, n, o) {
        let l = null;
        const r = n._currentView.dataTypeCounts[t];
        if (!n.sideMenu.showOnlyDataTypesAvailable || r > 0) {
            let i = Str.capitalizeFirstLetter(t);
            let s = "";
            if (n.sideMenu.showAvailableDataTypeCounts) {
                if (n._currentView.dataTypeCounts.hasOwnProperty(t)) {
                    s = `(${r})`;
                }
            }
            l = DomElement.createCheckBox(e, i, t, o, n.showValueColors ? t : "", s);
            l.onchange = () => {
                const e = n.ignore;
                e[`${t}Values`] = !l.checked;
                n.ignore = e;
                n._currentView.sideMenuChanged = true;
            };
        }
        return l;
    }
    function F(t) {
        if (t.footer.enabled && Is.defined(t.data)) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            H(t);
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
                R(t);
            }
        }
    }
    function R(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.currentDataArrayPageIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const l = DomElement.createWithHTML(null, "span", "status-count", n.toFixed()).outerHTML;
            const r = DomElement.createWithHTML(null, "span", "status-count", o.toFixed()).outerHTML;
            const i = e.text.pageOfText.replace("{0}", l).replace("{1}", r);
            t._currentView.footerPageText.innerHTML = i;
        }
    }
    function H(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function W(t, n, o) {
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
    function $(t, n, o) {
        if (t.footer.enabled && t.footer.showLengths) {
            const l = Size.length(n, t.showCssStylesForHtmlObjects);
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
    function J(t, n, o) {
        if (t.footer.enabled && t.footer.showSizes) {
            const l = Size.of(n, t.showCssStylesForHtmlObjects);
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
    function z(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), t.footer.statusResetDelay);
        }
    }
    function U(t, n, o, l, r) {
        const i = Obj.getPropertyNames(o, n);
        const s = i.length;
        if (s !== 0 || !n.ignore.emptyObjects) {
            let a = null;
            if (r === "object") {
                a = e.text.objectText;
            } else if (r === "map") {
                a = e.text.mapText;
            } else if (r === "html") {
                a = e.text.htmlText;
            }
            const u = DomElement.create(t, "div", "object-type-title");
            const c = DomElement.create(t, "div", "object-type-contents last-item");
            const d = n.showArrowToggles ? DomElement.create(u, "div", "down-arrow") : null;
            if (!n.paging.enabled || !Is.definedNumber(l)) {
                let t = n.rootName;
                if (n.showPropertyNameQuotes) {
                    t = `"${t}"`;
                }
                DomElement.createWithHTML(u, "span", "root-name", t);
                DomElement.createWithHTML(u, "span", "split", e.text.propertyColonCharacter);
            }
            const f = DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} main-title` : "main-title", a);
            let g = null;
            let m = null;
            K(c, n);
            if (n.paging.enabled && Is.definedNumber(l)) {
                let t = n.useZeroIndexingForArrays ? l.toString() : (l + 1).toString();
                if (n.showArrayIndexBrackets) {
                    t = `[${t}]`;
                }
                DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} data-array-index` : "data-array-index", t, f);
                DomElement.createWithHTML(u, "span", "split", e.text.propertyColonCharacter, f);
            }
            if (n.showObjectSizes && s > 0) {
                if (r === "html") {
                    DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} size` : "size", `<${s}>`);
                } else {
                    DomElement.createWithHTML(u, "span", n.showValueColors ? `${r} size` : "size", `{${s}}`);
                }
            }
            if (n.showOpeningClosingCurlyBraces) {
                g = DomElement.createWithHTML(u, "span", "opening-symbol", "{");
            }
            if (n.showClosedObjectCurlyBraces) {
                m = DomElement.createWithHTML(u, "span", "closed-symbols", "{ ... }");
            }
            Z(d, null, c, n, o, i, g, m, false, true, "", r, r !== "object", 1);
            oe(n, f, o, r, false);
            J(n, o, f);
            $(n, o, f);
            ce(n, u, false, o, o, null, false, null);
        }
    }
    function q(t, n, o, l) {
        let r = null;
        if (l === "set") {
            r = e.text.setText;
        } else if (l === "array") {
            r = e.text.arrayText;
        }
        const i = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const a = n.showArrowToggles ? DomElement.create(i, "div", "down-arrow") : null;
        if (!n.paging.enabled) {
            let t = n.rootName;
            if (n.showPropertyNameQuotes) {
                t = `"${t}"`;
            }
            DomElement.createWithHTML(i, "span", "root-name", t);
            DomElement.createWithHTML(i, "span", "split", e.text.propertyColonCharacter);
        }
        const u = DomElement.createWithHTML(i, "span", n.showValueColors ? `${l} main-title` : "main-title", r);
        let c = null;
        let d = null;
        K(s, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(i, "span", n.showValueColors ? `${l} size` : "size", `[${o.length}]`);
        }
        if (n.showOpeningClosingSquaredBrackets) {
            c = DomElement.createWithHTML(i, "span", "opening-symbol", "[");
        }
        if (n.showClosedArraySquaredBrackets) {
            d = DomElement.createWithHTML(i, "span", "closed-symbols", "[ ... ]");
        }
        Q(a, null, s, n, o, c, d, false, true, "", l, l !== "array", 1);
        oe(n, u, o, l, false);
        J(n, o, u);
        $(n, o, u);
        ce(n, i, false, o, o, null, false, null);
    }
    function Z(t, n, o, l, r, i, s, a, u, c, d, f, g, m) {
        let p = true;
        const x = i.length;
        const T = d !== "" ? x : 0;
        if (x === 0 && !l.ignore.emptyObjects) {
            Y(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g, m);
            p = false;
        } else if (l.maximum.inspectionLevels > 0 && m > l.maximum.inspectionLevels) {
            Y(r, o, l, "", e.text.maximumInspectionLevelsReached, true, false, "", f, g, m);
            p = false;
        } else {
            for (let e = 0; e < x; e++) {
                const t = i[e];
                const n = d === "" ? t : `${d}${"\\"}${t}`;
                if (r.hasOwnProperty(t)) {
                    Y(r, o, l, t, r[t], e === x - 1, false, n, f, g, m);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                Y(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g, m);
                p = false;
            } else {
                if (l.showOpeningClosingCurlyBraces) {
                    ie(l, o, "}", u, c);
                }
            }
        }
        le(l, t, n, o, s, a, T, f);
        return p;
    }
    function Q(t, n, o, l, r, i, s, a, u, c, d, f, g) {
        let m = true;
        const p = r.length;
        const x = c !== "" ? p : 0;
        if (l.maximum.inspectionLevels > 0 && g > l.maximum.inspectionLevels) {
            Y(r, o, l, "", e.text.maximumInspectionLevelsReached, true, false, "", d, f, g);
            m = false;
        } else {
            if (!l.reverseArrayValues) {
                for (let e = 0; e < p; e++) {
                    const t = Arr.getIndex(e, l);
                    const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                    Y(r, o, l, Arr.getIndexName(l, t, p), r[e], e === p - 1, true, n, d, f, g);
                }
            } else {
                for (let e = p; e--; ) {
                    const t = Arr.getIndex(e, l);
                    const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                    Y(r, o, l, Arr.getIndexName(l, t, p), r[e], e === 0, true, n, d, f, g);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                Y(r, o, l, "", e.text.noPropertiesText, true, false, "", d, f, g);
                m = false;
            } else {
                if (l.showOpeningClosingSquaredBrackets) {
                    ie(l, o, "]", a, u);
                }
            }
        }
        le(l, t, n, o, i, s, x, d);
        return m;
    }
    function Y(t, n, o, l, r, i, s, a, u, c, d) {
        const f = DomElement.create(n, "div", "object-type-value");
        const g = DomElement.create(f, "div", "object-type-value-title");
        const m = o.showArrowToggles ? DomElement.create(g, "div", "no-arrow") : null;
        let p = null;
        let x = null;
        let T = false;
        let b = false;
        let w = null;
        let h = DomElement.create(g, "span");
        let y = false;
        let D = null;
        const S = !Is.definedString(l);
        let v = true;
        let V = null;
        const B = o._currentView.currentColumnBuildingIndex;
        if (!S) {
            if (s || !o.showPropertyNameQuotes) {
                h.innerHTML = l;
            } else {
                h.innerHTML = `"${l}"`;
            }
            if (s && !o.showChildIndexes) {
                h.parentNode.removeChild(h);
                h = null;
            }
        } else {
            h.parentNode.removeChild(h);
            h = null;
        }
        if (i) {
            f.classList.add("last-item");
        }
        if (o.showDataTypes && !S) {
            D = DomElement.createWithHTML(g, "span", o.showValueColors ? "data-type-color" : "data-type", "");
        }
        if (Is.defined(h) && !S && o.showValueColors && o.showPropertyNameAndIndexColors) {
            h.classList.add(u);
        }
        if (Is.defined(h) && !S) {
            DomElement.createWithHTML(g, "span", "split", e.text.propertyColonCharacter);
            if (!c) {
                ee(o, t, l, h, s);
            } else {
                h.ondblclick = DomElement.cancelBubble;
            }
            if (Is.definedString(a)) {
                g.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME, a);
            }
            if (!s) {
                J(o, l, h);
                $(o, l, h);
            }
            se(o, g, a, B, r);
        }
        if (r === null) {
            w = "null";
            if (!o.ignore.nullValues) {
                p = o.showValueColors ? `${w} value undefined-or-null` : "value undefined-or-null";
                x = DomElement.createWithHTML(g, "span", p, "null");
                if (Is.definedFunction(o.events.onNullRender)) {
                    Trigger.customEvent(o.events.onNullRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (r === void 0) {
            w = "undefined";
            if (!o.ignore.undefinedValues) {
                p = o.showValueColors ? `${w} value undefined-or-null` : "value undefined-or-null";
                x = DomElement.createWithHTML(g, "span", p, "undefined");
                if (Is.definedFunction(o.events.onUndefinedRender)) {
                    Trigger.customEvent(o.events.onUndefinedRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedFunction(r)) {
            const t = Default.getFunctionName(r, e);
            if (t.isLambda) {
                w = "lambda";
                if (!o.ignore.lambdaValues) {
                    p = o.showValueColors ? `${w} value non-value` : "value non-value";
                    x = DomElement.createWithHTML(g, "span", p, t.name);
                    if (Is.definedFunction(o.events.onLambdaRender)) {
                        Trigger.customEvent(o.events.onLambdaRender, o._currentView.element, x);
                    }
                    re(o, g, i);
                } else {
                    T = true;
                }
            } else {
                w = "function";
                if (!o.ignore.functionValues) {
                    p = o.showValueColors ? `${w} value non-value` : "value non-value";
                    x = DomElement.createWithHTML(g, "span", p, t.name);
                    if (Is.definedFunction(o.events.onFunctionRender)) {
                        Trigger.customEvent(o.events.onFunctionRender, o._currentView.element, x);
                    }
                    re(o, g, i);
                } else {
                    T = true;
                }
            }
        } else if (Is.definedBoolean(r)) {
            w = "boolean";
            if (!o.ignore.booleanValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                y = o.allowEditing.booleanValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onBooleanRender)) {
                    Trigger.customEvent(o.events.onBooleanRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedFloat(r)) {
            w = "float";
            if (!o.ignore.floatValues) {
                const e = Convert2.numberToFloatWithDecimalPlaces(r, o.maximum.decimalPlaces);
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, e);
                y = o.allowEditing.floatValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onFloatRender)) {
                    Trigger.customEvent(o.events.onFloatRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedNumber(r)) {
            w = "number";
            if (!o.ignore.numberValues) {
                let n = r.toString();
                if (o.maximum.numberLength > 0 && n.length > o.maximum.numberLength) {
                    n = `${n.substring(0, o.maximum.numberLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                y = o.allowEditing.numberValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onNumberRender)) {
                    Trigger.customEvent(o.events.onNumberRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedBigInt(r)) {
            w = "bigint";
            if (!o.ignore.bigintValues) {
                let n = r.toString();
                if (o.maximum.bigIntLength > 0 && n.length > o.maximum.bigIntLength) {
                    n = `${n.substring(0, o.maximum.bigIntLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                y = o.allowEditing.bigIntValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onBigIntRender)) {
                    Trigger.customEvent(o.events.onBigIntRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.String.guid(r)) {
            w = "guid";
            if (!o.ignore.guidValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                y = o.allowEditing.guidValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onGuidRender)) {
                    Trigger.customEvent(o.events.onGuidRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && (Is.String.hexColor(r) || Is.String.rgbColor(r))) {
            w = "color";
            if (!o.ignore.colorValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                y = o.allowEditing.colorValues && !c;
                if (o.showValueColors) {
                    x.style.color = r;
                }
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onColorRender)) {
                    Trigger.customEvent(o.events.onColorRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.definedUrl(r)) {
            w = "url";
            if (!o.ignore.urlValues) {
                let n = r;
                if (o.maximum.urlLength > 0 && n.length > o.maximum.urlLength) {
                    n = `${n.substring(0, o.maximum.urlLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                y = o.allowEditing.urlValues && !c;
                if (o.showUrlOpenButtons) {
                    V = DomElement.createWithHTML(g, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    V.onclick = () => window.open(r);
                }
                te(o, t, l, r, x, s, y, V);
                if (Is.definedFunction(o.events.onUrlRender)) {
                    Trigger.customEvent(o.events.onUrlRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.definedEmail(r)) {
            w = "email";
            if (!o.ignore.emailValues) {
                let n = r;
                if (o.maximum.emailLength > 0 && n.length > o.maximum.emailLength) {
                    n = `${n.substring(0, o.maximum.emailLength)}${" "}${e.text.ellipsisText}${" "}`;
                }
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                y = o.allowEditing.emailValues && !c;
                if (o.showEmailOpenButtons) {
                    V = DomElement.createWithHTML(g, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    V.onclick = () => window.open(`mailto:${r}`);
                }
                te(o, t, l, r, x, s, y, V);
                if (Is.definedFunction(o.events.onEmailRender)) {
                    Trigger.customEvent(o.events.onEmailRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedStringAny(r)) {
            w = "string";
            if (!o.ignore.stringValues || S) {
                if (o.parse.stringsToBooleans && Is.definedString(r) && Is.String.boolean(r)) {
                    Y(t, n, o, l, r.toString().toLowerCase().trim() === "true", i, s, a, u, c, d);
                    T = true;
                    b = true;
                } else if (o.parse.stringsToNumbers && Is.definedString(r) && Is.String.bigInt(r)) {
                    Y(t, n, o, l, Convert2.stringToBigInt(r), i, s, a, u, c, d);
                    T = true;
                    b = true;
                } else if (o.parse.stringsToNumbers && Is.definedString(r) && !isNaN(r)) {
                    Y(t, n, o, l, parseFloat(r), i, s, a, u, c, d);
                    T = true;
                    b = true;
                } else if (o.parse.stringsToDates && Is.definedString(r) && Is.String.date(r)) {
                    Y(t, n, o, l, new Date(r), i, s, a, u, c, d);
                    T = true;
                    b = true;
                } else if (o.parse.stringsToSymbols && Is.definedString(r) && Is.String.symbol(r)) {
                    Y(t, n, o, l, Symbol(Convert2.symbolToString(r)), i, s, a, u, c, d);
                    T = true;
                    b = true;
                } else {
                    let n = r;
                    if (!S) {
                        if (!Is.definedString(n)) {
                            n = o.emptyStringValue;
                        }
                        if (o.maximum.stringLength > 0 && n.length > o.maximum.stringLength) {
                            n = `${n.substring(0, o.maximum.stringLength)}${" "}${e.text.ellipsisText}${" "}`;
                        }
                        n = o.showStringQuotes ? `"${n}"` : n;
                        p = o.showValueColors ? `${w} value` : "value";
                        y = o.allowEditing.stringValues && !c;
                    } else {
                        p = "no-properties-text";
                        y = false;
                        v = false;
                    }
                    x = DomElement.createWithHTML(g, "span", p, n);
                    if (!S) {
                        te(o, t, l, r, x, s, y);
                        if (Is.definedFunction(o.events.onStringRender)) {
                            Trigger.customEvent(o.events.onStringRender, o._currentView.element, x);
                        }
                        re(o, g, i);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedDate(r)) {
            w = "date";
            if (!o.ignore.dateValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, DateTime.getCustomFormattedDateText(e, r, o.dateTimeFormat));
                y = o.allowEditing.dateValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onDateRender)) {
                    Trigger.customEvent(o.events.onDateRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedSymbol(r)) {
            w = "symbol";
            if (!o.ignore.symbolValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r.toString());
                y = o.allowEditing.symbolValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onSymbolRender)) {
                    Trigger.customEvent(o.events.onSymbolRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedRegExp(r)) {
            w = "regexp";
            if (!o.ignore.regexpValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r.source.toString());
                y = o.allowEditing.regExpValues && !c;
                te(o, t, l, r, x, s, y);
                if (Is.definedFunction(o.events.onRegExpRender)) {
                    Trigger.customEvent(o.events.onRegExpRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedImage(r)) {
            w = "image";
            if (!o.ignore.imageValues) {
                p = o.showValueColors ? `${w} value` : "value";
                x = DomElement.create(g, "span", p);
                y = o.allowEditing.imageValues && !c;
                te(o, t, l, r, x, s, y);
                const e = DomElement.create(x, "img");
                e.src = r.src;
                if (Is.definedFunction(o.events.onImageRender)) {
                    Trigger.customEvent(o.events.onImageRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedHtml(r)) {
            w = "html";
            if (!o.ignore.htmlValues) {
                const t = Convert2.htmlToObject(r, o.showCssStylesForHtmlObjects);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const r = DomElement.create(g, "span", o.showValueColors ? w : "");
                    const s = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    K(s, o);
                    if (i) {
                        s.classList.add("last-item");
                    }
                    x = DomElement.createWithHTML(r, "span", "main-title", e.text.htmlText);
                    if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `<${l}>`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    if (o.showClosedObjectCurlyBraces) {
                        c = DomElement.createWithHTML(r, "span", "closed-symbols", "{ ... }");
                    }
                    const p = re(o, r, i);
                    const T = Z(m, p, s, o, t, n, u, c, true, i, a, w, true, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedSet(r)) {
            w = "set";
            if (!o.ignore.setValues) {
                const t = Convert2.setToArray(r);
                const n = DomElement.create(g, "span", o.showValueColors ? w : "");
                const l = DomElement.create(f, "div", "object-type-contents");
                let s = null;
                let u = null;
                K(l, o);
                if (i) {
                    l.classList.add("last-item");
                }
                x = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingSquaredBrackets) {
                    s = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                if (o.showClosedArraySquaredBrackets) {
                    u = DomElement.createWithHTML(n, "span", "closed-symbols", "[ ... ]");
                }
                const c = re(o, n, i);
                const p = Q(m, c, l, o, t, s, u, true, i, a, w, true, d + 1);
                if (!p && o.showOpeningClosingSquaredBrackets) {
                    s.parentNode.removeChild(s);
                    u.parentNode.removeChild(u);
                }
            } else {
                T = true;
            }
        } else if (Is.definedArray(r)) {
            w = "array";
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(g, "span", o.showValueColors ? w : "");
                const n = DomElement.create(f, "div", "object-type-contents");
                let l = null;
                let s = null;
                K(n, o);
                if (i) {
                    n.classList.add("last-item");
                }
                x = DomElement.createWithHTML(t, "span", "main-title", e.text.arrayText);
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(t, "span", "size", `[${r.length}]`);
                }
                if (o.showOpeningClosingSquaredBrackets) {
                    l = DomElement.createWithHTML(t, "span", "opening-symbol", "[");
                }
                if (o.showClosedArraySquaredBrackets) {
                    s = DomElement.createWithHTML(t, "span", "closed-symbols", "[ ... ]");
                }
                const u = re(o, t, i);
                const c = Q(m, u, n, o, r, l, s, true, i, a, w, false, d + 1);
                if (!c && o.showOpeningClosingSquaredBrackets) {
                    l.parentNode.removeChild(l);
                    s.parentNode.removeChild(s);
                }
            } else {
                T = true;
            }
        } else if (Is.definedMap(r)) {
            w = "map";
            if (!o.ignore.mapValues) {
                const t = Convert2.mapToObject(r);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const r = DomElement.create(g, "span", o.showValueColors ? w : "");
                    const s = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    K(s, o);
                    if (i) {
                        s.classList.add("last-item");
                    }
                    x = DomElement.createWithHTML(r, "span", "main-title", e.text.mapText);
                    if (o.showObjectSizes && (l > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(r, "span", "size", `{${l}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(r, "span", "opening-symbol", "{");
                    }
                    if (o.showClosedObjectCurlyBraces) {
                        c = DomElement.createWithHTML(r, "span", "closed-symbols", "{ ... }");
                    }
                    const p = re(o, r, i);
                    const T = Z(m, p, s, o, t, n, u, c, true, i, a, w, true, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedObject(r)) {
            w = "object";
            if (!o.ignore.objectValues) {
                const t = Obj.getPropertyNames(r, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const l = DomElement.create(g, "span", o.showValueColors ? w : "");
                    const s = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    K(s, o);
                    if (i) {
                        s.classList.add("last-item");
                    }
                    x = DomElement.createWithHTML(l, "span", "main-title", e.text.objectText);
                    if (o.showObjectSizes && (n > 0 || !o.ignore.emptyObjects)) {
                        DomElement.createWithHTML(l, "span", "size", `{${n}}`);
                    }
                    if (o.showOpeningClosingCurlyBraces) {
                        u = DomElement.createWithHTML(l, "span", "opening-symbol", "{");
                    }
                    if (o.showClosedObjectCurlyBraces) {
                        c = DomElement.createWithHTML(l, "span", "closed-symbols", "{ ... }");
                    }
                    const p = re(o, l, i);
                    const T = Z(m, p, s, o, r, t, u, c, true, i, a, w, false, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else {
            w = "unknown";
            if (!o.ignore.unknownValues) {
                p = o.showValueColors ? `${w} value non-value` : "value non-value";
                x = DomElement.createWithHTML(g, "span", p, r.toString());
                if (Is.definedFunction(o.events.onUnknownRender)) {
                    Trigger.customEvent(o.events.onUnknownRender, o._currentView.element, x);
                }
                re(o, g, i);
            } else {
                T = true;
            }
        }
        if (!S && !b) {
            G(o, w);
        }
        if (T) {
            n.removeChild(f);
        } else {
            if (Is.defined(x)) {
                if (!S) {
                    J(o, r, x);
                    $(o, r, x);
                    W(o, w, x);
                    ce(o, x, y, t, r, l, s, V);
                }
                if (Is.defined(D)) {
                    if (w !== "null" && w !== "undefined" && w !== "array" && w !== "object" && w !== "map" && w !== "set") {
                        D.innerHTML = `(${w})`;
                    } else {
                        D.parentNode.removeChild(D);
                        D = null;
                    }
                }
                if (v) {
                    X(o, a, h, D, x);
                    oe(o, x, r, w, y);
                } else {
                    x.ondblclick = DomElement.cancelBubble;
                }
            }
        }
    }
    function G(e, t) {
        if (!e._currentView.dataTypeCounts.hasOwnProperty(t)) {
            e._currentView.dataTypeCounts[t] = 0;
        }
        e._currentView.dataTypeCounts[t]++;
    }
    function K(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            e.classList.add("object-border");
            if (!t.showArrowToggles) {
                e.classList.add("object-border-no-arrow-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function X(e, t, n, o, l) {
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
    function ee(t, n, o, l, r) {
        if (t.allowEditing.propertyNames) {
            l.ondblclick = s => {
                DomElement.cancelBubble(s);
                let a = 0;
                let u = null;
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                l.classList.add("editable-name");
                if (r) {
                    a = Arr.getIndexFromBrackets(l.innerHTML);
                    l.innerHTML = a.toString();
                } else {
                    l.innerHTML = l.innerHTML.replace(/['"]+/g, "");
                }
                l.setAttribute("contenteditable", "true");
                l.focus();
                DomElement.selectAllText(l);
                l.onblur = () => {
                    i(t, false);
                    if (Is.definedString(u)) {
                        z(t, u);
                    }
                };
                l.onkeydown = i => {
                    if (i.code === "Escape") {
                        i.preventDefault();
                        l.setAttribute("contenteditable", "false");
                    } else if (i.code === "Enter") {
                        i.preventDefault();
                        const s = l.innerText;
                        if (r) {
                            if (Is.definedString(s) && !isNaN(+s)) {
                                let o = +s;
                                if (!t.useZeroIndexingForArrays) {
                                    o--;
                                }
                                if (a !== o) {
                                    u = e.text.indexUpdatedText;
                                    Arr.moveIndex(n, a, o);
                                    Trigger.customEvent(t.events.onJsonEdit, t._currentView.element);
                                }
                            } else {
                                n.splice(Arr.getIndexFromBrackets(o), 1);
                                u = e.text.itemDeletedText;
                            }
                        } else {
                            if (s !== o) {
                                if (s.trim() === "") {
                                    u = e.text.itemDeletedText;
                                    delete n[o];
                                } else {
                                    if (!n.hasOwnProperty(s)) {
                                        u = e.text.nameUpdatedText;
                                        const t = n[o];
                                        delete n[o];
                                        n[s] = t;
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
    function te(e, t, n, o, l, r, i, s = null) {
        if (i) {
            l.ondblclick = i => {
                ne(i, e, t, n, o, l, r, s);
            };
        }
    }
    function ne(t, n, o, l, r, s, a, u = null) {
        let c = null;
        DomElement.cancelBubble(t);
        clearTimeout(n._currentView.valueClickTimerId);
        n._currentView.valueClickTimerId = 0;
        n._currentView.editMode = true;
        s.classList.add("editable");
        s.setAttribute("contenteditable", "true");
        if (Is.definedDate(r) && !n.includeTimeZoneInDates) {
            s.innerText = JSON.stringify(r).replace(/['"]+/g, "");
        } else if (Is.definedRegExp(r)) {
            s.innerText = r.source;
        } else if (Is.definedSymbol(r)) {
            s.innerText = Convert2.symbolToString(r);
        } else if (Is.definedImage(r)) {
            s.innerText = r.src;
        } else {
            s.innerText = r.toString();
        }
        s.focus();
        DomElement.selectAllText(s);
        if (Is.defined(u)) {
            u.parentNode.removeChild(u);
        }
        s.onblur = () => {
            i(n, false);
            if (Is.definedString(c)) {
                z(n, c);
            }
        };
        s.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                s.setAttribute("contenteditable", "false");
            } else if (t.code === "Enter") {
                t.preventDefault();
                const i = s.innerText;
                if (i.trim() === "") {
                    if (a) {
                        o.splice(Arr.getIndexFromBrackets(l), 1);
                    } else {
                        delete o[l];
                    }
                    c = e.text.itemDeletedText;
                } else {
                    let t = Convert2.stringToDataTypeValue(r, i);
                    if (t !== null) {
                        if (a) {
                            o[Arr.getIndexFromBrackets(l)] = t;
                        } else {
                            o[l] = t;
                        }
                        c = e.text.valueUpdatedText;
                        Trigger.customEvent(n.events.onJsonEdit, n._currentView.element);
                    }
                }
                s.setAttribute("contenteditable", "false");
            }
        };
    }
    function oe(t, n, o, l, r) {
        if (Is.definedFunction(t.events.onValueClick)) {
            n.onclick = () => {
                let i = o;
                if (t.convertClickedValuesToString) {
                    i = JSON.stringify(Convert2.toJsonStringifyClone(o, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
                }
                if (r) {
                    t._currentView.valueClickTimerId = setTimeout((() => {
                        if (!t._currentView.editMode) {
                            Trigger.customEvent(t.events.onValueClick, t._currentView.element, i, l);
                        }
                    }), t.editingValueClickDelay);
                } else {
                    n.ondblclick = DomElement.cancelBubble;
                    Trigger.customEvent(t.events.onValueClick, t._currentView.element, i, l);
                }
            };
        } else {
            n.classList.add("no-hover");
        }
    }
    function le(e, t, n, l, r, i, s, a) {
        const u = e._currentView.contentPanelsIndex;
        const c = e._currentView.contentPanelsDataIndex;
        const d = e._currentView.currentColumnBuildingIndex;
        const f = e._currentView.currentContentColumns[d];
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(c)) {
            e._currentView.contentPanelsOpen[c] = {};
        }
        const g = (o = true) => {
            l.style.display = "none";
            e._currentView.contentPanelsOpen[c][u] = true;
            if (Is.defined(t)) {
                t.className = "right-arrow";
            }
            if (Is.defined(r)) {
                r.style.display = "none";
            }
            if (Is.defined(i)) {
                i.style.display = "inline-block";
            }
            if (Is.defined(n)) {
                n.style.display = "inline-block";
            }
            if (o) {
                x(d, e);
            }
        };
        const m = (s, a = true) => {
            if (Is.defined(s)) {
                DomElement.cancelBubble(s);
                if (!o) {
                    ae(e);
                }
            }
            l.style.display = "block";
            e._currentView.contentPanelsOpen[c][u] = false;
            if (Is.defined(t)) {
                t.className = "down-arrow";
            }
            if (Is.defined(r)) {
                r.style.display = "inline-block";
            }
            if (Is.defined(i)) {
                i.style.display = "none";
            }
            if (Is.defined(n)) {
                n.style.display = "none";
            }
            if (a) {
                x(d, e);
            }
        };
        const p = (t, n) => {
            if (Is.defined(t)) {
                DomElement.cancelBubble(t);
                if (!o) {
                    ae(e);
                }
            }
            if (n) {
                g();
            } else {
                m(null);
            }
        };
        let T = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[c].hasOwnProperty(u)) {
            T = e._currentView.contentPanelsOpen[c][u];
        } else {
            if (!e._currentView.initialized) {
                if (a === "object" && e.autoClose.objectSize > 0 && s >= e.autoClose.objectSize) {
                    T = true;
                } else if (a === "array" && e.autoClose.arraySize > 0 && s >= e.autoClose.arraySize) {
                    T = true;
                } else if (a === "map" && e.autoClose.mapSize > 0 && s >= e.autoClose.mapSize) {
                    T = true;
                } else if (a === "set" && e.autoClose.setSize > 0 && s >= e.autoClose.setSize) {
                    T = true;
                } else if (a === "html" && e.autoClose.htmlSize > 0 && s >= e.autoClose.htmlSize) {
                    T = true;
                }
            }
            e._currentView.contentPanelsOpen[c][u] = T;
        }
        if (Is.defined(t)) {
            t.onclick = e => p(e, t.className === "down-arrow");
            t.ondblclick = DomElement.cancelBubble;
        }
        if (Is.defined(i)) {
            i.onclick = e => m(e);
            i.ondblclick = DomElement.cancelBubble;
        }
        p(null, T, false);
        e._currentView.contentPanelsIndex++;
    }
    function re(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function ie(e, t, n, o, l) {
        const r = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showArrowToggles || e.showOpenedObjectArrayBorders) {
            DomElement.create(r, "div", "no-arrow");
        }
        DomElement.createWithHTML(r, "div", "object-type-end", n);
        re(e, r, l);
    }
    function se(e, t, n, l, r) {
        t.onclick = i => {
            DomElement.cancelBubble(i);
            const s = t.classList.contains("highlight-selected") && o;
            const a = e._currentView.currentContentColumns;
            const u = e._currentView.currentContentColumns.length;
            let c = false;
            if (!o) {
                e._currentView.selectedValues = [];
            }
            for (let t = 0; t < u; t++) {
                const r = a[t].column.querySelectorAll(".object-type-value-title");
                const i = r.length;
                for (let a = 0; a < i; a++) {
                    const i = r[a];
                    if (!o) {
                        i.classList.remove("highlight-selected");
                        i.classList.remove("highlight-compare");
                    }
                    if (ue(e) && t !== l) {
                        const e = i.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME);
                        if (Is.definedString(e) && e === n) {
                            if (!s) {
                                i.classList.add("highlight-compare");
                            } else {
                                i.classList.remove("highlight-compare");
                            }
                            c = true;
                        }
                    }
                }
                if (c) {
                    x(t, e);
                }
            }
            if (!s) {
                t.classList.add("highlight-selected");
                e._currentView.selectedValues.push(r);
            } else {
                t.classList.remove("highlight-selected");
                e._currentView.selectedValues.splice(e._currentView.selectedValues.indexOf(r), 1);
            }
            Trigger.customEvent(e.events.onSelectionChange, e._currentView.element);
            x(l, e);
        };
    }
    function ae(e) {
        if (e._currentView.selectedValues.length > 0) {
            const t = e._currentView.currentContentColumns;
            const n = e._currentView.currentContentColumns.length;
            e._currentView.selectedValues = [];
            for (let o = 0; o < n; o++) {
                let n = false;
                const l = t[o].column.querySelectorAll(".object-type-value-title");
                const r = l.length;
                for (let t = 0; t < r; t++) {
                    const o = l[t];
                    if (o.classList.contains("highlight-selected")) {
                        o.classList.remove("highlight-selected");
                        n = true;
                    }
                    if (ue(e) && o.classList.contains("highlight-compare")) {
                        o.classList.remove("highlight-compare");
                        n = true;
                    }
                }
                if (n) {
                    x(o, e);
                    Trigger.customEvent(e.events.onSelectionChange, e._currentView.element);
                }
            }
        }
    }
    function ue(e) {
        return e.paging.enabled && e.paging.columnsPerPage > 1 && e.paging.allowComparisons;
    }
    function ce(t, n, o, l, r, i, s, a) {
        n.oncontextmenu = u => {
            DomElement.cancelBubble(u);
            t._currentView.contextMenu.innerHTML = "";
            if (o && t._currentView.selectedValues.length <= 1) {
                const o = ContextMenu.addMenuItem(t, e.text.editSymbolButtonText, e.text.editButtonText);
                o.onclick = e => de(e, t, n, l, i, r, s, a);
            }
            const c = ContextMenu.addMenuItem(t, e.text.copyButtonSymbolText, e.text.copyButtonText);
            c.onclick = e => fe(e, t, r);
            if (o && t._currentView.selectedValues.length <= 1) {
                const n = ContextMenu.addMenuItem(t, e.text.removeSymbolButtonText, e.text.removeButtonText);
                n.onclick = e => ge(e, t, l, i, s);
            }
            DomElement.showElementAtMousePosition(u, t._currentView.contextMenu, 0);
        };
    }
    function de(e, t, n, o, l, r, i, s) {
        DomElement.cancelBubble(e);
        ne(e, t, o, l, r, n, i, s);
        ContextMenu.hide(t);
    }
    function fe(e, t, n) {
        DomElement.cancelBubble(e);
        let o = n;
        if (t._currentView.selectedValues.length !== 0) {
            o = t._currentView.selectedValues;
        }
        D(t, o);
        ContextMenu.hide(t);
    }
    function ge(t, n, o, l, r) {
        DomElement.cancelBubble(t);
        if (r) {
            o.splice(Arr.getIndexFromBrackets(l), 1);
        } else {
            delete o[l];
        }
        ContextMenu.hide(n);
        i(n, false);
        z(n, e.text.itemDeletedText);
    }
    function me(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => pe(t, n);
            t._currentView.element.ondragenter = () => pe(t, n);
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => xe(e, t);
        }
    }
    function pe(e, t) {
        if (!e._currentView.columnDragging) {
            t.style.display = "block";
        }
    }
    function xe(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            Te(e.dataTransfer.files, t);
        }
    }
    function Te(t, n, o = null) {
        const l = t.length;
        let r = 0;
        let s = [];
        const a = t => {
            r++;
            s.push(t);
            if (r === l) {
                n._currentView.contentPanelsOpen = {};
                const t = s.length;
                if (Is.definedNumber(o)) {
                    for (let e = 0; e < t; e++) {
                        if (o > n.data.length - 1) {
                            n.data.push(s[e]);
                        } else {
                            n.data.splice(o, 0, s[e]);
                        }
                    }
                    n._currentView.currentDataArrayPageIndex = o - o % n.paging.columnsPerPage;
                } else {
                    n._currentView.currentDataArrayPageIndex = 0;
                    n.data = t === 1 ? s[0] : s;
                }
                i(n);
                z(n, e.text.importedText.replace("{0}", l.toString()));
                Trigger.customEvent(n.events.onSetJson, n._currentView.element);
            }
        };
        for (let e = 0; e < l; e++) {
            const n = t[e];
            const o = n.name.split(".").pop().toLowerCase();
            if (o === "json") {
                be(n, a);
            }
        }
    }
    function be(t, n) {
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
    function we(t) {
        const n = JSON.stringify(Convert2.toJsonStringifyClone(t.data, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        if (Is.definedString(n)) {
            const o = DomElement.create(document.body, "a");
            o.style.display = "none";
            o.setAttribute("target", "_blank");
            o.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(n)}`);
            o.setAttribute("download", he(t));
            o.click();
            document.body.removeChild(o);
            L(t);
            z(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function he(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function ye(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        const l = t ? window.addEventListener : window.removeEventListener;
        n("keydown", (t => Se(t, e)));
        n("keyup", (e => ve(e)));
        n("contextmenu", (() => De(e)));
        l("click", (() => De(e)));
        l("focus", (() => o = false));
    }
    function De(e) {
        if (!o) {
            ae(e);
        }
    }
    function Se(e, l) {
        o = Ve(e);
        if (l.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(l._currentView.element.id) && !l._currentView.editMode) {
            if (Ve(e) && e.code === "F11") {
                e.preventDefault();
                v(l);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                C(l);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                I(l);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                E(l);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                B(l);
            } else if (e.code === "Escape") {
                e.preventDefault();
                if (!L(l) && !o) {
                    ae(l);
                }
            }
        }
    }
    function ve(e) {
        o = Ve(e);
    }
    function Ve(e) {
        return e.ctrlKey || e.metaKey;
    }
    function Be(e) {
        e._currentView.element.innerHTML = "";
        e._currentView.element.classList.remove("json-tree-js");
        e._currentView.element.classList.remove("full-screen");
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        ye(e, false);
        ToolTip.assignToEvents(e, false);
        ContextMenu.assignToEvents(e, false);
        ToolTip.remove(e);
        ContextMenu.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const Ee = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return Ee;
        },
        refreshAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return Ee;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e));
            }
            return Ee;
        },
        renderAll: function() {
            l();
            return Ee;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                B(t[e]);
            }
            return Ee;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                E(t[e]);
            }
            return Ee;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    C(t[e]);
                }
            }
            return Ee;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    I(t[e]);
                }
            }
            return Ee;
        },
        getPageNumber: function(e) {
            let n = 1;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const o = t[e];
                n = Math.ceil((o._currentView.currentDataArrayPageIndex + 1) / o.paging.columnsPerPage);
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
                const r = t[n];
                r._currentView.currentDataArrayPageIndex = 0;
                r._currentView.contentPanelsOpen = {};
                r.data = l;
                i(r);
                Trigger.customEvent(r.events.onSetJson, r._currentView.element);
            }
            return Ee;
        },
        getJson: function(e) {
            let n = null;
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                n = t[e].data;
            }
            return n;
        },
        getSelectedJsonValues: function(e) {
            let n = [];
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                n = t[e]._currentView.selectedValues;
            }
            return n;
        },
        updateBindingOptions: function(e, n) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const o = t[e];
                const l = o.data;
                const r = o._currentView;
                t[e] = Binding.Options.get(n);
                t[e].data = l;
                t[e]._currentView = r;
                i(t[e]);
            }
            return Ee;
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
                Be(t[e]);
                delete t[e];
                n--;
            }
            return Ee;
        },
        destroyAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    Be(t[e]);
                }
            }
            t = {};
            n = 0;
            return Ee;
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
            return Ee;
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
            return "4.3.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => l()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = Ee;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map