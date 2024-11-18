"use strict";

var ImportedFilename = class {
    constructor() {
        this.filename = null;
        this.object = null;
    }
};

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
            const t = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|\-)(?:\d{2}):?(?:\d{2}))/;
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
        return e !== null && e !== void 0 && typeof e === "string";
    }
    e.definedStringAny = i;
    function a(e) {
        return n(e) && typeof e === "function";
    }
    e.definedFunction = a;
    function s(e) {
        return n(e) && typeof e === "number";
    }
    e.definedNumber = s;
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
    function y(e) {
        let t;
        try {
            t = new URL(e);
        } catch {
            t = null;
        }
        return t !== null && (t.protocol === "http:" || t.protocol === "https:");
    }
    e.definedUrl = y;
    function h(e) {
        const t = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e);
    }
    e.definedEmail = h;
    function w(e, t = 1) {
        return !c(e) || e.length < t;
    }
    e.invalidOptionArray = w;
    function D(e) {
        return n(e) && e instanceof ImportedFilename;
    }
    e.definedImportedFilename = D;
})(Is || (Is = {}));

var Convert2;

(Convert => {
    function toJsonStringifyClone(e, t, n) {
        let o = null;
        if (!Is.defined(e)) {
            o = null;
        } else if (Is.definedImportedFilename(e)) {
            o = e.object;
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
            } else if (Is.definedStringAny(e)) {
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
    function stringToBoolean(e) {
        return e.toString().toLowerCase().trim() === "true";
    }
    Convert.stringToBoolean = stringToBoolean;
    function stringToParsedValue(e, t) {
        let n = null;
        if (Is.definedString(e) && e.trim() !== "") {
            const o = parseFloat(e);
            if (t.parse.stringsToBooleans && Is.String.boolean(e)) {
                n = Convert.stringToBoolean(e);
            } else if (t.parse.stringsToBigInts && Is.String.bigInt(e)) {
                n = Convert.stringToBigInt(e);
            } else if (t.parse.stringsToNumbers && !isNaN(e) && !Is.definedFloat(o)) {
                n = parseInt(e);
            } else if (t.parse.stringsToFloats && !isNaN(e) && Is.definedFloat(o)) {
                n = o;
            } else if (t.parse.stringsToDates && Is.String.date(e)) {
                n = new Date(e);
            } else if (t.parse.stringsToSymbols && Is.String.symbol(e)) {
                n = Symbol(Convert.symbolToString(e));
            }
        }
        return n;
    }
    Convert.stringToParsedValue = stringToParsedValue;
    function symbolToSpacedOutString(e) {
        let t = e.toString();
        if (t.indexOf("()") === -1) {
            t = t.replace("(", `(${" "}`).replace(")", `${" "})`);
        } else {
            t = t.replace("()", "");
        }
        return t;
    }
    Convert.symbolToSpacedOutString = symbolToSpacedOutString;
})(Convert2 || (Convert2 = {}));

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
    function o(e, t, n) {
        let o = e;
        if (t > 0 && o.length > t) {
            o = `${o.substring(0, t)}${" "}${n}${" "}`;
        }
        return o;
    }
    e.getMaximumLengthDisplay = o;
})(Str || (Str = {}));

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
    function d(e, t, n) {
        const o = e.toString();
        const l = o.substring(0, o.indexOf(")") + 1);
        let r = l.trim();
        let i = false;
        if (l[0] === "(") {
            r = `${t.text.functionText}${r}`;
            i = true;
        }
        if (!i) {
            r = Str.getMaximumLengthDisplay(r, n.maximum.functionLength, t.text.ellipsisText);
        } else {
            r = Str.getMaximumLengthDisplay(r, n.maximum.lambdaLength, t.text.ellipsisText);
        }
        return {
            name: r,
            isLambda: i
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
    function a(e, t, n) {
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
    e.showElementAtMousePosition = a;
    function s(e) {
        const t = document.createRange();
        t.selectNodeContents(e);
        const n = window.getSelection();
        n.removeAllRanges();
        n.addRange(t);
    }
    e.selectAllText = s;
    function u(e, t, l, r, i, a) {
        const s = n(e, "div", "checkbox");
        const u = n(s, "label", "checkbox");
        const c = n(u, "input");
        c.type = "checkbox";
        c.name = l;
        c.checked = r;
        c.autocomplete = "off";
        n(u, "span", "check-mark");
        o(u, "span", `text ${i}`, t);
        if (Is.definedString(a)) {
            o(u, "span", `additional-text`, a);
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
        if (Is.definedString(n)) {
            n = `<sup>${n}</sup>`;
        }
        return n;
    }
    e.getDayOrdinal = n;
    function o(e, o, l) {
        const r = isNaN(+o) ? new Date : o;
        let i = l;
        const a = t(r);
        i = i.replace("{hh}", Str.padNumber(r.getHours(), 2));
        i = i.replace("{h}", r.getHours().toString());
        i = i.replace("{MM}", Str.padNumber(r.getMinutes(), 2));
        i = i.replace("{M}", r.getMinutes().toString());
        i = i.replace("{ss}", Str.padNumber(r.getSeconds(), 2));
        i = i.replace("{s}", r.getSeconds().toString());
        i = i.replace("{fff}", Str.padNumber(r.getMilliseconds(), 3));
        i = i.replace("{ff}", Str.padNumber(r.getMilliseconds(), 2));
        i = i.replace("{f}", r.getMilliseconds().toString());
        i = i.replace("{dddd}", e.text.dayNames[a]);
        i = i.replace("{ddd}", e.text.dayNamesAbbreviated[a]);
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
            o._currentView.controlButtonsOpen = {};
            o._currentView.contentPanelsOpen = {};
            o._currentView.contentPanelsIndex = 0;
            o._currentView.contentPanelsDataIndex = 0;
            o._currentView.backPageButton = null;
            o._currentView.nextPageButton = null;
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
            t.id = Default.getString(t.id, "");
            t.class = Default.getString(t.class, "");
            t.showObjectSizes = Default.getBoolean(t.showObjectSizes, true);
            t.useZeroIndexingForArrays = Default.getBoolean(t.useZeroIndexingForArrays, true);
            t.dateTimeFormat = Default.getString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
            t.showExpandIcons = Default.getBoolean(t.showExpandIcons, true);
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
            t.expandIconType = Default.getString(t.expandIconType, "arrow");
            t.openUrlsInSameWindow = Default.getBoolean(t.openUrlsInSameWindow, false);
            t.maximum = l(t);
            t.paging = r(t);
            t.title = i(t);
            t.footer = a(t);
            t.controlPanel = s(t);
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
            e.maximum.propertyNameLength = Default.getNumber(e.maximum.propertyNameLength, 0);
            e.maximum.functionLength = Default.getNumber(e.maximum.functionLength, 0);
            e.maximum.lambdaLength = Default.getNumber(e.maximum.lambdaLength, 0);
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
        function a(e) {
            e.footer = Default.getObject(e.footer, {});
            e.footer.enabled = Default.getBoolean(e.footer.enabled, true);
            e.footer.showDataTypes = Default.getBoolean(e.footer.showDataTypes, true);
            e.footer.showLengths = Default.getBoolean(e.footer.showLengths, true);
            e.footer.showSizes = Default.getBoolean(e.footer.showSizes, true);
            e.footer.showPageOf = Default.getBoolean(e.footer.showPageOf, true);
            e.footer.statusResetDelay = Default.getNumber(e.footer.statusResetDelay, 5e3);
            return e.footer;
        }
        function s(e) {
            e.controlPanel = Default.getObject(e.controlPanel, {});
            e.controlPanel.enabled = Default.getBoolean(e.controlPanel.enabled, true);
            e.controlPanel.showCopyButton = Default.getBoolean(e.controlPanel.showCopyButton, true);
            e.controlPanel.showMovingButtons = Default.getBoolean(e.controlPanel.showMovingButtons, true);
            e.controlPanel.showRemoveButton = Default.getBoolean(e.controlPanel.showRemoveButton, false);
            e.controlPanel.showEditButton = Default.getBoolean(e.controlPanel.showEditButton, true);
            e.controlPanel.showCloseOpenAllButtons = Default.getBoolean(e.controlPanel.showCloseOpenAllButtons, true);
            e.controlPanel.showSwitchToPagesButton = Default.getBoolean(e.controlPanel.showSwitchToPagesButton, true);
            e.controlPanel.showImportButton = Default.getBoolean(e.controlPanel.showImportButton, true);
            e.controlPanel.showExportButton = Default.getBoolean(e.controlPanel.showExportButton, true);
            e.controlPanel.showOpenCloseButton = Default.getBoolean(e.controlPanel.showOpenCloseButton, true);
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
            e.parse.stringsToFloats = Default.getBoolean(e.parse.stringsToFloats, false);
            e.parse.stringsToBigInts = Default.getBoolean(e.parse.stringsToBigInts, false);
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
            e.sideMenu.updateDisplayDelay = Default.getNumber(e.sideMenu.updateDisplayDelay, 500);
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
            e.events.onCustomDataTypeRender = Default.getFunction(e.events.onCustomDataTypeRender, null);
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
            e.text.maximumInspectionLevelsReached = Default.getAnyString(e.text.maximumInspectionLevelsReached, "Maximum inspection levels have been reached.");
            e.text.openCloseSymbolText = Default.getAnyString(e.text.openCloseSymbolText, "↹");
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
            if (Is.definedString(e.id)) {
                e._currentView.element.id = e.id;
            } else {
                e._currentView.element.id = crypto.randomUUID();
            }
            e._currentView.idSet = true;
        }
        e._currentView.element.classList.add("json-tree-js");
        e._currentView.element.removeAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
        if (Is.definedString(e.class)) {
            const t = e.class.split(" ");
            const n = t.length;
            for (let o = 0; o < n; o++) {
                e._currentView.element.classList.add(t[o].trim());
            }
        }
        if (e.openInFullScreenMode) {
            e._currentView.element.classList.add("full-screen");
            e._currentView.fullScreenOn = true;
        }
        if (!t.hasOwnProperty(e._currentView.element.id)) {
            t[e._currentView.element.id] = e;
            n++;
        }
        i(e);
        Ve(e);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i(n, o = false) {
        let l = t[n._currentView.element.id].data;
        if (Is.definedUrl(l)) {
            Default.getObjectFromUrl(l, e, (e => {
                a(n, o, e);
            }));
        } else {
            a(n, o, l);
        }
    }
    function a(e, t, n) {
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
        v(e, n);
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
                    const a = r[i];
                    e._currentView.contentPanelsIndex = 0;
                    e._currentView.contentPanelsDataIndex = i;
                    s(a, l, e, i, o[n], e.paging.columnsPerPage, t);
                }
            }
        } else {
            e._currentView.contentPanelsIndex = 0;
            e._currentView.contentPanelsDataIndex = 0;
            s(n, l, e, null, o[0], 1, false);
        }
        O(e);
        M(e);
        R(e);
        xe(e);
        e._currentView.initialized = true;
    }
    function s(t, n, o, l, r, i, a) {
        const s = DomElement.create(n, "div", i > 1 ? "contents-column-multiple" : "contents-column");
        const c = o._currentView.currentColumnBuildingIndex;
        if (!Is.defined(t)) {
            const t = DomElement.create(s, "div", "no-json");
            DomElement.createWithHTML(t, "span", "no-json-text", e.text.noJsonToViewText);
            if (o.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(t, "span", "no-json-import-text", `${e.text.importButtonText}${" "}${e.text.ellipsisText}`);
                n.onclick = () => L(o);
            }
        } else {
            s.onscroll = () => d(s, o, c);
            if (o.paging.enabled && Is.definedNumber(l)) {
                s.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, l.toString());
            }
            if (a && o.paging.allowColumnReordering && o.paging.columnsPerPage > 1 && o.allowEditing.bulk) {
                s.setAttribute("draggable", "true");
                s.ondragstart = () => f(s, o, l);
                s.ondragend = () => g(s, o);
                s.ondragover = e => e.preventDefault();
                s.ondrop = () => m(o, l);
            }
            let e = s;
            let n = null;
            let i = null;
            if (o.lineNumbers.enabled) {
                n = DomElement.create(s, "div", "contents-column-line-numbers");
                i = DomElement.create(s, "div", "contents-column-lines");
                e = i;
            }
            const p = {
                column: s,
                lineNumbers: n,
                lines: i,
                controlButtons: null
            };
            o._currentView.currentContentColumns.push(p);
            o._currentView.currentColumnBuildingIndex = o._currentView.currentContentColumns.length - 1;
            if (Is.definedArray(t)) {
                Q(e, o, t, "array");
            } else if (Is.definedSet(t)) {
                Q(e, o, Convert2.setToArray(t), "set");
            } else if (Is.definedHtml(t)) {
                Z(e, o, Convert2.htmlToObject(t, o.showCssStylesForHtmlObjects), l, "html");
            } else if (Is.definedMap(t)) {
                Z(e, o, Convert2.mapToObject(t), l, "map");
            } else if (Is.definedObject(t)) {
                Z(e, o, t, l, "object");
            } else {
                Z(e, o, Obj.createFromValue(t), l, "object");
            }
            x(o._currentView.currentColumnBuildingIndex, o);
            T(o, s, t, l);
            if (Is.defined(r)) {
                s.scrollTop = r;
            }
            o._currentView.titleBarButtons.style.display = "block";
            if (o.allowEditing.bulk) {
                s.ondblclick = e => {
                    u(e, o, t, s, l);
                };
            }
        }
    }
    function u(t, n, o, l, r) {
        let a = null;
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
            if (Is.definedString(a)) {
                q(n, a);
            }
        };
        l.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                l.setAttribute("contenteditable", "false");
            } else if (Ie(t) && t.code === "Enter") {
                t.preventDefault();
                const o = l.innerText;
                const i = Convert2.jsonStringToObject(o, e);
                if (i.parsed) {
                    a = e.text.jsonUpdatedText;
                    if (n.paging.enabled) {
                        if (Is.defined(i.object)) {
                            n.data[r] = i.object;
                        } else {
                            n.data.splice(r, 1);
                            a = e.text.arrayJsonItemDeleted;
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
            const e = t._currentView.currentContentColumns[n];
            if (Is.defined(e.controlButtons)) {
                e.controlButtons.style.top = `${e.column.scrollTop}px`;
                e.controlButtons.style.right = `-${e.column.scrollLeft}px`;
            }
        }
        for (let n = 0; n < r; n++) {
            const r = t._currentView.currentContentColumns[n];
            if (r.column !== e) {
                if (t.paging.synchronizeScrolling) {
                    r.column.scrollTop = o;
                    r.column.scrollLeft = l;
                }
                if (t.controlPanel.enabled && Is.defined(r.controlButtons)) {
                    r.controlButtons.style.top = `${r.column.scrollTop}px`;
                    r.controlButtons.style.right = `-${r.column.scrollLeft}px`;
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
            let a = t._currentView.contentPanelsOpen[o];
            let s = t._currentView.contentPanelsOpen[n];
            let u = t._currentView.controlButtonsOpen[o];
            let c = t._currentView.controlButtonsOpen[n];
            if (!Is.defined(a)) {
                a = {};
            }
            if (!Is.defined(s)) {
                s = {};
            }
            t.data[o] = r;
            t.data[n] = l;
            t._currentView.contentPanelsOpen[o] = s;
            t._currentView.contentPanelsOpen[n] = a;
            t._currentView.controlButtonsOpen[o] = c;
            t._currentView.controlButtonsOpen[n] = u;
            if (t._currentView.currentDataArrayPageIndex + (t.paging.columnsPerPage - 1) < o) {
                t._currentView.currentDataArrayPageIndex += t.paging.columnsPerPage;
            } else if (o < t._currentView.currentDataArrayPageIndex) {
                t._currentView.currentDataArrayPageIndex -= t.paging.columnsPerPage;
            }
            i(t);
            q(t, e.text.jsonUpdatedText);
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
            for (let a = 0; a < i; a++) {
                const s = r[a];
                if (s.offsetHeight > 0) {
                    let r = DomElement.getOffset(s).top;
                    if (e === 1) {
                        o = r;
                    }
                    r -= o;
                    const a = DomElement.create(n.lineNumbers, "div", "contents-column-line-number");
                    const u = t.lineNumbers.addDots ? "." : "";
                    if (t.lineNumbers.padNumbers) {
                        a.innerHTML = `${Str.padNumber(e, i.toString().length)}${u}`;
                    } else {
                        a.innerHTML = `${e}${u}`;
                    }
                    const c = r + s.offsetHeight / 2 - a.offsetHeight / 2;
                    a.style.top = `${c}px`;
                    l = Math.max(l, a.offsetWidth);
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
        if (t.controlPanel.enabled) {
            const r = t._currentView.currentColumnBuildingIndex;
            const i = DomElement.create(n, "div", "column-control-buttons");
            i.ondblclick = DomElement.cancelBubble;
            const a = t.paging.enabled && Is.definedArray(t.data) && t.data.length > 1;
            if (t.allowEditing.bulk && t.controlPanel.showEditButton) {
                const r = DomElement.createWithHTML(i, "button", "control-button edit", e.text.editSymbolButtonText);
                r.onclick = () => u(null, t, o, n, l);
                r.ondblclick = DomElement.cancelBubble;
                ToolTip.add(r, t, e.text.editButtonText);
            }
            if (a && t.allowEditing.bulk && t.paging.allowColumnReordering && t.controlPanel.showMovingButtons) {
                const n = DomElement.createWithHTML(i, "button", "control-button move-right", e.text.moveRightSymbolButtonText);
                n.ondblclick = DomElement.cancelBubble;
                if (l + 1 > t.data.length - 1) {
                    n.disabled = true;
                } else {
                    n.onclick = () => p(t, l, l + 1);
                }
                ToolTip.add(n, t, e.text.moveRightButtonText);
                const o = DomElement.createWithHTML(i, "button", "control-button move-left", e.text.moveLeftSymbolButtonText);
                o.ondblclick = DomElement.cancelBubble;
                if (l - 1 < 0) {
                    o.disabled = true;
                } else {
                    o.onclick = () => p(t, l, l - 1);
                }
                ToolTip.add(o, t, e.text.moveLeftButtonText);
            }
            if (a && t.controlPanel.showCopyButton) {
                const n = DomElement.createWithHTML(i, "button", "control-button copy", e.text.copyButtonSymbolText);
                n.onclick = () => V(t, o);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.copyButtonText);
            }
            if (a && t.controlPanel.showCloseOpenAllButtons) {
                const n = DomElement.createWithHTML(i, "button", "control-button open-all", e.text.openAllButtonSymbolText);
                n.onclick = () => w(t, l);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(i, "button", "control-button close-all", e.text.closeAllButtonSymbolText);
                o.onclick = () => D(t, l);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (a && t.controlPanel.showExportButton) {
                const n = DomElement.createWithHTML(i, "button", "control-button export", e.text.exportButtonSymbolText);
                n.onclick = () => De(t, o);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (a && t.allowEditing.bulk && t.controlPanel.showImportButton) {
                const n = DomElement.createWithHTML(i, "button", "control-button import", e.text.importButtonSymbolText);
                n.onclick = () => L(t, l + 1);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            if (t.allowEditing.bulk && t.controlPanel.showRemoveButton) {
                const n = DomElement.createWithHTML(i, "button", "control-button remove", e.text.removeSymbolButtonText);
                n.onclick = () => S(t, l);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.removeButtonText);
            }
            if (!a && Is.definedArray(t.data) && t.data.length > 1 && t.controlPanel.showSwitchToPagesButton) {
                const n = DomElement.createWithHTML(i, "button", "control-button switch-to-pages", e.text.switchToPagesSymbolText);
                n.onclick = () => h(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.switchToPagesText);
            }
            if (i.innerHTML !== "") {
                if (t.controlPanel.showOpenCloseButton) {
                    if (!t._currentView.controlButtonsOpen.hasOwnProperty(l)) {
                        t._currentView.controlButtonsOpen[l] = true;
                    }
                    const n = DomElement.createWithHTML(i, "button", "expander", e.text.openCloseSymbolText);
                    n.onclick = () => b(t, n, i, l);
                    n.ondblclick = DomElement.cancelBubble;
                    y(n, i, t._currentView.controlButtonsOpen[l]);
                }
                const o = DomElement.getStyleValueByName(n, "padding-left", true);
                t._currentView.currentContentColumns[r].controlButtons = i;
                n.style.minHeight = `${i.offsetHeight}px`;
                n.style.paddingRight = `${i.offsetWidth + o}px`;
            } else {
                n.removeChild(i);
            }
        }
    }
    function b(e, t, n, o) {
        e._currentView.controlButtonsOpen[o] = !e._currentView.controlButtonsOpen[o];
        y(t, n, e._currentView.controlButtonsOpen[o]);
    }
    function y(e, t, n) {
        const o = t.querySelectorAll(".control-button");
        const l = o.length;
        for (let e = 0; e < l; e++) {
            const t = o[e];
            t.style.display = n ? "block" : "none";
        }
        e.className = n ? "expander" : "expander-closed";
    }
    function h(e) {
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
    function D(e, t) {
        const n = e._currentView.contentPanelsOpen[t];
        for (const e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = true;
            }
        }
        i(e);
    }
    function S(t, n) {
        if (t.paging.enabled) {
            t.data.splice(n, 1);
            if (n === t._currentView.currentDataArrayPageIndex && t._currentView.currentDataArrayPageIndex > 0) {
                t._currentView.currentDataArrayPageIndex -= t.paging.columnsPerPage;
            }
        } else {
            t.data = null;
        }
        const o = {};
        const l = {};
        delete t._currentView.contentPanelsOpen[n];
        delete t._currentView.controlButtonsOpen[n];
        for (const e in t._currentView.contentPanelsOpen) {
            let l = +e;
            if (l > n) {
                l--;
            }
            o[l] = t._currentView.contentPanelsOpen[e];
        }
        for (const e in t._currentView.controlButtonsOpen) {
            let o = +e;
            if (o > n) {
                o--;
            }
            l[o] = t._currentView.controlButtonsOpen[e];
        }
        t._currentView.contentPanelsOpen = o;
        t._currentView.controlButtonsOpen = l;
        i(t);
        q(t, e.text.arrayJsonItemDeleted);
    }
    function V(t, n) {
        const o = JSON.stringify(Convert2.toJsonStringifyClone(n, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        navigator.clipboard.writeText(o);
        q(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopy, t._currentView.element, o);
    }
    function v(t, n) {
        if (Is.definedString(t.title.text) || t.title.showCloseOpenAllButtons || t.title.showCopyButton || t.sideMenu.enabled || t.paging.enabled || t.title.enableFullScreenToggling) {
            const o = DomElement.create(t._currentView.element, "div", "title-bar");
            if (t.title.enableFullScreenToggling) {
                o.ondblclick = () => B(t);
            }
            if (t.sideMenu.enabled) {
                const n = DomElement.createWithHTML(o, "button", "side-menu", e.text.sideMenuButtonSymbolText);
                n.onclick = () => P(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.sideMenuButtonText);
            }
            t._currentView.titleBarButtons = DomElement.create(o, "div", "controls");
            if (Is.definedString(t.title.text)) {
                DomElement.createWithHTML(o, "div", "title", t.title.text, t._currentView.titleBarButtons);
            }
            if (t.title.showCopyButton && Is.defined(n)) {
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "copy-all", e.text.copyButtonSymbolText);
                o.onclick = () => E(t, n);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.copyAllButtonText);
            }
            if (t.title.showCloseOpenAllButtons && Is.defined(n)) {
                const n = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "open-all", e.text.openAllButtonSymbolText);
                n.onclick = () => I(t);
                n.ondblclick = DomElement.cancelBubble;
                ToolTip.add(n, t, e.text.openAllButtonText);
                const o = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "close-all", e.text.closeAllButtonSymbolText);
                o.onclick = () => C(t);
                o.ondblclick = DomElement.cancelBubble;
                ToolTip.add(o, t, e.text.closeAllButtonText);
            }
            if (t.paging.enabled && Is.definedArray(n) && n.length > 1) {
                t._currentView.backPageButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "back-page", e.text.backButtonSymbolText);
                t._currentView.backPageButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.backPageButton, t, e.text.backButtonText);
                if (t._currentView.currentDataArrayPageIndex > 0) {
                    t._currentView.backPageButton.onclick = () => _(t);
                } else {
                    t._currentView.backPageButton.disabled = true;
                }
                t._currentView.nextPageButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "next-page", e.text.nextButtonSymbolText);
                t._currentView.nextPageButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.nextPageButton, t, e.text.nextButtonText);
                if (t._currentView.currentDataArrayPageIndex + (t.paging.columnsPerPage - 1) < n.length - 1) {
                    t._currentView.nextPageButton.onclick = () => A(t);
                } else {
                    t._currentView.nextPageButton.disabled = true;
                }
            } else {
                if (Is.definedArray(n)) {
                    t.paging.enabled = false;
                }
            }
            if (t.title.enableFullScreenToggling && t.title.showFullScreenButton) {
                const n = !t._currentView.fullScreenOn ? e.text.fullScreenOnButtonSymbolText : e.text.fullScreenOffButtonSymbolText;
                t._currentView.toggleFullScreenButton = DomElement.createWithHTML(t._currentView.titleBarButtons, "button", "toggle-full-screen", n);
                t._currentView.toggleFullScreenButton.onclick = () => B(t);
                t._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
                ToolTip.add(t._currentView.toggleFullScreenButton, t, e.text.fullScreenButtonText);
            }
        }
    }
    function B(t) {
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
            $(t);
            Trigger.customEvent(t.events.onFullScreenChange, t._currentView.element, t._currentView.element.classList.contains("full-screen"));
        }
    }
    function E(t, n) {
        const o = JSON.stringify(Convert2.toJsonStringifyClone(n, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        navigator.clipboard.writeText(o);
        q(t, e.text.copiedText);
        Trigger.customEvent(t.events.onCopyAll, t._currentView.element, o);
    }
    function I(e) {
        e.showAllAsClosed = false;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onOpenAll, e._currentView.element);
    }
    function C(e) {
        e.showAllAsClosed = true;
        e._currentView.contentPanelsOpen = {};
        i(e);
        Trigger.customEvent(e.events.onCloseAll, e._currentView.element);
    }
    function _(e) {
        if (e._currentView.backPageButton !== null && !e._currentView.backPageButton.disabled) {
            e._currentView.currentDataArrayPageIndex -= e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onBackPage, e._currentView.element);
        }
    }
    function A(e) {
        if (e._currentView.nextPageButton !== null && !e._currentView.nextPageButton.disabled) {
            e._currentView.currentDataArrayPageIndex += e.paging.columnsPerPage;
            i(e, true);
            Trigger.customEvent(e.events.onNextPage, e._currentView.element);
        }
    }
    function O(e) {
        e._currentView.disabledBackground = DomElement.create(e._currentView.element, "div", "disabled-background");
        e._currentView.disabledBackground.onclick = () => N(e);
    }
    function M(t) {
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
                n.onclick = () => j(t);
                ToolTip.add(n, t, e.text.clearJsonText);
            }
            if (t.sideMenu.showExportButton && Is.definedObject(t.data)) {
                const n = DomElement.createWithHTML(o, "button", "export", e.text.exportButtonSymbolText);
                n.onclick = () => De(t, t.data);
                ToolTip.add(n, t, e.text.exportButtonText);
            }
            if (t.sideMenu.showImportButton) {
                const n = DomElement.createWithHTML(o, "button", "import", e.text.importButtonSymbolText);
                n.onclick = () => L(t);
                ToolTip.add(n, t, e.text.importButtonText);
            }
            const l = DomElement.createWithHTML(o, "button", "close", e.text.closeButtonSymbolText);
            l.onclick = () => N(t);
            ToolTip.add(l, t, e.text.closeButtonText);
            if (Is.definedObject(t.data)) {
                const e = DomElement.create(t._currentView.sideMenu, "div", "side-menu-contents");
                k(e, t);
            }
        }
    }
    function L(e, t = null) {
        const n = DomElement.createWithNoContainer("input");
        n.type = "file";
        n.accept = ".json";
        n.multiple = true;
        N(e);
        n.onchange = () => ye(n.files, e, t);
        n.click();
    }
    function P(e) {
        if (!e._currentView.sideMenu.classList.contains("side-menu-open")) {
            e._currentView.sideMenu.classList.add("side-menu-open");
            e._currentView.disabledBackground.style.display = "block";
            ToolTip.hide(e);
            ContextMenu.hide(e);
        }
    }
    function N(t) {
        let n = false;
        if (t._currentView.sideMenu.classList.contains("side-menu-open")) {
            t._currentView.sideMenu.classList.remove("side-menu-open");
            t._currentView.disabledBackground.style.display = "none";
            ToolTip.hide(t);
            ContextMenu.hide(t);
            if (t._currentView.sideMenuChanged) {
                setTimeout((() => {
                    i(t);
                    q(t, e.text.ignoreDataTypesUpdated);
                }), t.sideMenu.updateDisplayDelay);
            }
            n = true;
        }
        return n;
    }
    function j(t) {
        t.data = null;
        i(t);
        q(t, e.text.jsonUpdatedText);
    }
    function k(t, n) {
        const o = [];
        const l = DomElement.create(t, "div", "settings-panel");
        const r = DomElement.create(l, "div", "settings-panel-title-bar");
        DomElement.createWithHTML(r, "div", "settings-panel-title-text", `${e.text.showDataTypesText}:`);
        const i = DomElement.create(r, "div", "settings-panel-control-buttons");
        const a = DomElement.create(i, "div", "settings-panel-control-button settings-panel-fill");
        const s = DomElement.create(i, "div", "settings-panel-control-button");
        a.onclick = () => F(n, o, true);
        s.onclick = () => F(n, o, false);
        ToolTip.add(a, n, e.text.selectAllText);
        ToolTip.add(s, n, e.text.selectNoneText);
        const u = DomElement.create(l, "div", "settings-panel-contents");
        const c = Object.keys(DataType);
        const d = n.ignore;
        for (const e in n._currentView.dataTypeCounts) {
            if (c.indexOf(e) === -1) {
                c.push(e);
            }
        }
        c.sort();
        c.forEach(((e, t) => {
            const l = H(u, e, n, !d[`${e}Values`]);
            if (Is.defined(l)) {
                o.push(l);
            }
        }));
    }
    function F(e, t, n) {
        const o = t.length;
        const l = e.ignore;
        for (let e = 0; e < o; e++) {
            t[e].checked = n;
            l[`${t[e].name}Values`] = !n;
        }
        e._currentView.sideMenuChanged = true;
    }
    function H(e, t, n, o) {
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
    function R(t) {
        if (t.footer.enabled && Is.defined(t.data)) {
            t._currentView.footer = DomElement.create(t._currentView.element, "div", "footer-bar");
            $(t);
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
                W(t);
            }
        }
    }
    function W(t) {
        if (t.paging.enabled) {
            const n = Math.ceil((t._currentView.currentDataArrayPageIndex + 1) / t.paging.columnsPerPage);
            const o = Math.ceil(t.data.length / t.paging.columnsPerPage);
            const l = DomElement.createWithHTML(null, "span", "status-count", n.toFixed()).outerHTML;
            const r = DomElement.createWithHTML(null, "span", "status-count", o.toFixed()).outerHTML;
            const i = e.text.pageOfText.replace("{0}", l).replace("{1}", r);
            t._currentView.footerPageText.innerHTML = i;
        }
    }
    function $(e) {
        if (Is.defined(e._currentView.footer)) {
            e._currentView.footer.style.display = e._currentView.fullScreenOn ? "flex" : "none";
        }
    }
    function J(t, n, o) {
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
    function z(t, n, o) {
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
    function U(t, n, o) {
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
    function q(t, n) {
        if (t.footer.enabled) {
            t._currentView.footerStatusText.innerHTML = n;
            clearTimeout(t._currentView.footerStatusTextTimerId);
            t._currentView.footerStatusTextTimerId = setTimeout((() => {
                t._currentView.footerStatusText.innerHTML = e.text.waitingText;
            }), t.footer.statusResetDelay);
        }
    }
    function Z(t, n, o, l, r) {
        let i = o;
        if (Is.definedImportedFilename(o)) {
            i = i.object;
        }
        const a = Obj.getPropertyNames(i, n);
        const s = a.length;
        if (s !== 0 || !n.ignore.emptyObjects) {
            let u = null;
            if (r === "object") {
                u = e.text.objectText;
            } else if (r === "map") {
                u = e.text.mapText;
            } else if (r === "html") {
                u = e.text.htmlText;
            }
            const c = DomElement.create(t, "div", "object-type-title");
            const d = DomElement.create(t, "div", "object-type-contents last-item");
            const f = n.showExpandIcons ? DomElement.create(c, "div", `opened-${n.expandIconType}`) : null;
            let g = null;
            if (!n.paging.enabled || !Is.definedNumber(l) || Is.definedImportedFilename(o)) {
                let t = n.rootName;
                if (Is.definedImportedFilename(o)) {
                    t = o.filename;
                }
                if (n.showPropertyNameQuotes) {
                    t = `"${t}"`;
                }
                g = DomElement.createWithHTML(c, "span", "root-name", t);
                DomElement.createWithHTML(c, "span", "split", e.text.propertyColonCharacter);
            }
            const m = DomElement.createWithHTML(c, "span", n.showValueColors ? `${r} main-title` : "main-title", u);
            let p = null;
            let x = null;
            ee(d, n);
            if (n.paging.enabled && Is.definedNumber(l)) {
                let t = n.useZeroIndexingForArrays ? l.toString() : (l + 1).toString();
                if (n.showArrayIndexBrackets) {
                    t = `[${t}]`;
                }
                const o = Is.defined(g) ? g : m;
                DomElement.createWithHTML(c, "span", n.showValueColors ? `${r} data-array-index` : "data-array-index", t, o);
                DomElement.createWithHTML(c, "span", "split", e.text.propertyColonCharacter, o);
            }
            if (n.showObjectSizes && s > 0) {
                if (r === "html") {
                    DomElement.createWithHTML(c, "span", n.showValueColors ? `${r} size` : "size", `<${s}>`);
                } else {
                    DomElement.createWithHTML(c, "span", n.showValueColors ? `${r} size` : "size", `{${s}}`);
                }
            }
            if (n.showOpeningClosingCurlyBraces) {
                p = DomElement.createWithHTML(c, "span", "opening-symbol", "{");
            }
            if (n.showClosedObjectCurlyBraces) {
                x = DomElement.createWithHTML(c, "span", "closed-symbols", "{ ... }");
            }
            Y(f, null, d, n, i, a, p, x, false, true, "", r, r !== "object", 1);
            re(n, m, i, r, false);
            U(n, i, m);
            z(n, i, m);
            fe(n, c, false, i, i, null, false, null);
        }
    }
    function Q(t, n, o, l) {
        let r = o;
        if (Is.definedImportedFilename(o)) {
            r = r.object;
        }
        let i = null;
        if (l === "set") {
            i = e.text.setText;
        } else if (l === "array") {
            i = e.text.arrayText;
        }
        const a = DomElement.create(t, "div", "object-type-title");
        const s = DomElement.create(t, "div", "object-type-contents last-item");
        const u = n.showExpandIcons ? DomElement.create(a, "div", `opened-${n.expandIconType}`) : null;
        if (!n.paging.enabled || Is.definedImportedFilename(o)) {
            let t = n.rootName;
            if (Is.definedImportedFilename(o)) {
                t = o.filename;
            }
            if (n.showPropertyNameQuotes) {
                t = `"${t}"`;
            }
            DomElement.createWithHTML(a, "span", "root-name", t);
            DomElement.createWithHTML(a, "span", "split", e.text.propertyColonCharacter);
        }
        const c = DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} main-title` : "main-title", i);
        let d = null;
        let f = null;
        ee(s, n);
        if (n.showObjectSizes) {
            DomElement.createWithHTML(a, "span", n.showValueColors ? `${l} size` : "size", `[${o.length}]`);
        }
        if (n.showOpeningClosingSquaredBrackets) {
            d = DomElement.createWithHTML(a, "span", "opening-symbol", "[");
        }
        if (n.showClosedArraySquaredBrackets) {
            f = DomElement.createWithHTML(a, "span", "closed-symbols", "[ ... ]");
        }
        K(u, null, s, n, o, d, f, false, true, "", l, l !== "array", 1);
        re(n, c, o, l, false);
        U(n, o, c);
        z(n, o, c);
        fe(n, a, false, o, o, null, false, null);
    }
    function Y(t, n, o, l, r, i, a, s, u, c, d, f, g, m) {
        let p = true;
        const x = i.length;
        const T = d !== "" ? x : 0;
        if (x === 0 && !l.ignore.emptyObjects) {
            X(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g, m);
            p = false;
        } else if (l.maximum.inspectionLevels > 0 && m > l.maximum.inspectionLevels) {
            X(r, o, l, "", e.text.maximumInspectionLevelsReached, true, false, "", f, g, m);
            p = false;
        } else {
            for (let e = 0; e < x; e++) {
                const t = i[e];
                const n = d === "" ? t : `${d}${"\\"}${t}`;
                if (r.hasOwnProperty(t)) {
                    X(r, o, l, t, r[t], e === x - 1, false, n, f, g, m);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                X(r, o, l, "", e.text.noPropertiesText, true, false, "", f, g, m);
                p = false;
            } else {
                if (l.showOpeningClosingCurlyBraces) {
                    se(l, o, "}", u, c);
                }
            }
        }
        ie(l, t, n, o, a, s, T, f);
        return p;
    }
    function K(t, n, o, l, r, i, a, s, u, c, d, f, g) {
        let m = true;
        const p = r.length;
        const x = c !== "" ? p : 0;
        if (l.maximum.inspectionLevels > 0 && g > l.maximum.inspectionLevels) {
            X(r, o, l, "", e.text.maximumInspectionLevelsReached, true, false, "", d, f, g);
            m = false;
        } else {
            if (!l.reverseArrayValues) {
                for (let e = 0; e < p; e++) {
                    const t = Arr.getIndex(e, l);
                    const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                    X(r, o, l, Arr.getIndexName(l, t, p), r[e], e === p - 1, true, n, d, f, g);
                }
            } else {
                for (let e = p; e--; ) {
                    const t = Arr.getIndex(e, l);
                    const n = c === "" ? t.toString() : `${c}${"\\"}${t}`;
                    X(r, o, l, Arr.getIndexName(l, t, p), r[e], e === 0, true, n, d, f, g);
                }
            }
            if (o.children.length === 0 || l.showOpenedObjectArrayBorders && o.children.length === 1) {
                X(r, o, l, "", e.text.noPropertiesText, true, false, "", d, f, g);
                m = false;
            } else {
                if (l.showOpeningClosingSquaredBrackets) {
                    se(l, o, "]", s, u);
                }
            }
        }
        ie(l, t, n, o, i, a, x, d);
        return m;
    }
    function X(t, n, o, l, r, i, a, s, u, c, d) {
        const f = DomElement.create(n, "div", "object-type-value");
        const g = DomElement.create(f, "div", "object-type-value-title");
        const m = o.showExpandIcons ? DomElement.create(g, "div", `no-${o.expandIconType}`) : null;
        let p = null;
        let x = null;
        let T = false;
        let b = false;
        let y = null;
        let h = DomElement.create(g, "span");
        let w = false;
        let D = null;
        const S = !Is.definedString(l);
        let V = true;
        let v = null;
        const B = o._currentView.currentColumnBuildingIndex;
        if (!S) {
            let t = Str.getMaximumLengthDisplay(l, o.maximum.propertyNameLength, e.text.ellipsisText);
            if (a || !o.showPropertyNameQuotes) {
                h.innerHTML = t;
            } else {
                h.innerHTML = `"${t}"`;
            }
            if (a && !o.showChildIndexes) {
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
                ne(o, t, l, h, a);
            } else {
                h.ondblclick = DomElement.cancelBubble;
            }
            if (Is.definedString(s)) {
                g.setAttribute(Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME, s);
            }
            if (!a) {
                U(o, l, h);
                z(o, l, h);
            }
            ue(o, g, s, B, r);
        }
        const E = Trigger.customEvent(o.events.onCustomDataTypeRender, o._currentView.element, r);
        if (Is.defined(E) && E !== false) {
            y = E.dataType;
            const e = o.ignore;
            const n = `${E.dataType}Values`;
            if (!e.hasOwnProperty(n) || !e[n]) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", E.class, E.html);
                w = E.allowEditing;
                oe(o, t, l, r, x, a, w);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (r === null) {
            y = "null";
            if (!o.ignore.nullValues) {
                p = o.showValueColors ? `${y} value undefined-or-null` : "value undefined-or-null";
                x = DomElement.createWithHTML(g, "span", p, "null");
                Trigger.customEvent(o.events.onNullRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (r === void 0) {
            y = "undefined";
            if (!o.ignore.undefinedValues) {
                p = o.showValueColors ? `${y} value undefined-or-null` : "value undefined-or-null";
                x = DomElement.createWithHTML(g, "span", p, "undefined");
                Trigger.customEvent(o.events.onUndefinedRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedFunction(r)) {
            const t = Default.getFunctionName(r, e, o);
            if (t.isLambda) {
                y = "lambda";
                if (!o.ignore.lambdaValues) {
                    p = o.showValueColors ? `${y} value non-value` : "value non-value";
                    x = DomElement.createWithHTML(g, "span", p, t.name);
                    Trigger.customEvent(o.events.onLambdaRender, o._currentView.element, x);
                    ae(o, g, i);
                } else {
                    T = true;
                }
            } else {
                y = "function";
                if (!o.ignore.functionValues) {
                    p = o.showValueColors ? `${y} value non-value` : "value non-value";
                    x = DomElement.createWithHTML(g, "span", p, t.name);
                    Trigger.customEvent(o.events.onFunctionRender, o._currentView.element, x);
                    ae(o, g, i);
                } else {
                    T = true;
                }
            }
        } else if (Is.definedBoolean(r)) {
            y = "boolean";
            if (!o.ignore.booleanValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                w = o.allowEditing.booleanValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onBooleanRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedFloat(r)) {
            y = "float";
            if (!o.ignore.floatValues) {
                const e = Convert2.numberToFloatWithDecimalPlaces(r, o.maximum.decimalPlaces);
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, e);
                w = o.allowEditing.floatValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onFloatRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedNumber(r)) {
            y = "number";
            if (!o.ignore.numberValues) {
                let n = Str.getMaximumLengthDisplay(r.toString(), o.maximum.numberLength, e.text.ellipsisText);
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                w = o.allowEditing.numberValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onNumberRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedBigInt(r)) {
            y = "bigint";
            if (!o.ignore.bigintValues) {
                let n = Str.getMaximumLengthDisplay(r.toString(), o.maximum.bigIntLength, e.text.ellipsisText);
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                w = o.allowEditing.bigIntValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onBigIntRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.String.guid(r)) {
            y = "guid";
            if (!o.ignore.guidValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                w = o.allowEditing.guidValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onGuidRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && (Is.String.hexColor(r) || Is.String.rgbColor(r))) {
            y = "color";
            if (!o.ignore.colorValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r);
                w = o.allowEditing.colorValues && !c;
                if (o.showValueColors) {
                    x.style.color = r;
                }
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onColorRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.definedUrl(r)) {
            y = "url";
            if (!o.ignore.urlValues) {
                let n = Str.getMaximumLengthDisplay(r, o.maximum.urlLength, e.text.ellipsisText);
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                w = o.allowEditing.urlValues && !c;
                if (o.showUrlOpenButtons) {
                    v = DomElement.createWithHTML(g, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    v.onclick = () => {
                        if (o.openUrlsInSameWindow) {
                            window.location = r;
                        } else {
                            window.open(r);
                        }
                    };
                }
                oe(o, t, l, r, x, a, w, v);
                Trigger.customEvent(o.events.onUrlRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedString(r) && Is.definedEmail(r)) {
            y = "email";
            if (!o.ignore.emailValues) {
                let n = Str.getMaximumLengthDisplay(r, o.maximum.emailLength, e.text.ellipsisText);
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, n);
                w = o.allowEditing.emailValues && !c;
                if (o.showEmailOpenButtons) {
                    v = DomElement.createWithHTML(g, "span", o.showValueColors ? "open-button-color" : "open-button", `${e.text.openText}${" "}${e.text.openSymbolText}`);
                    v.onclick = () => window.open(`mailto:${r}`);
                }
                oe(o, t, l, r, x, a, w, v);
                Trigger.customEvent(o.events.onEmailRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedStringAny(r)) {
            y = "string";
            if (!o.ignore.stringValues || S) {
                const f = Convert2.stringToParsedValue(r, o);
                if (Is.defined(f)) {
                    X(t, n, o, l, f, i, a, s, u, c, d);
                    T = true;
                    b = true;
                } else {
                    let n = r;
                    if (!S) {
                        if (!Is.definedString(n)) {
                            n = o.emptyStringValue;
                        }
                        n = Str.getMaximumLengthDisplay(n, o.maximum.stringLength, e.text.ellipsisText);
                        n = o.showStringQuotes ? `"${n}"` : n;
                        p = o.showValueColors ? `${y} value` : "value";
                        w = o.allowEditing.stringValues && !c;
                    } else {
                        p = "no-properties-text";
                        w = false;
                        V = false;
                    }
                    x = DomElement.createWithHTML(g, "span", p, n);
                    if (!S) {
                        oe(o, t, l, r, x, a, w);
                        Trigger.customEvent(o.events.onStringRender, o._currentView.element, x);
                        ae(o, g, i);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedDate(r)) {
            y = "date";
            if (!o.ignore.dateValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, DateTime.getCustomFormattedDateText(e, r, o.dateTimeFormat));
                w = o.allowEditing.dateValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onDateRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedSymbol(r)) {
            y = "symbol";
            if (!o.ignore.symbolValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, Convert2.symbolToSpacedOutString(r));
                w = o.allowEditing.symbolValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onSymbolRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedRegExp(r)) {
            y = "regexp";
            if (!o.ignore.regexpValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.createWithHTML(g, "span", p, r.source.toString());
                w = o.allowEditing.regExpValues && !c;
                oe(o, t, l, r, x, a, w);
                Trigger.customEvent(o.events.onRegExpRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedImage(r)) {
            y = "image";
            if (!o.ignore.imageValues) {
                p = o.showValueColors ? `${y} value` : "value";
                x = DomElement.create(g, "span", p);
                w = o.allowEditing.imageValues && !c;
                oe(o, t, l, r, x, a, w);
                const e = DomElement.create(x, "img");
                e.src = r.src;
                Trigger.customEvent(o.events.onImageRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        } else if (Is.definedHtml(r)) {
            y = "html";
            if (!o.ignore.htmlValues) {
                const t = Convert2.htmlToObject(r, o.showCssStylesForHtmlObjects);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const r = DomElement.create(g, "span", o.showValueColors ? y : "");
                    const a = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    ee(a, o);
                    if (i) {
                        a.classList.add("last-item");
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
                    const p = ae(o, r, i);
                    const T = Y(m, p, a, o, t, n, u, c, true, i, s, y, true, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedSet(r)) {
            y = "set";
            if (!o.ignore.setValues) {
                const t = Convert2.setToArray(r);
                const n = DomElement.create(g, "span", o.showValueColors ? y : "");
                const l = DomElement.create(f, "div", "object-type-contents");
                let a = null;
                let u = null;
                ee(l, o);
                if (i) {
                    l.classList.add("last-item");
                }
                x = DomElement.createWithHTML(n, "span", "main-title", e.text.setText);
                if (o.showObjectSizes) {
                    DomElement.createWithHTML(n, "span", "size", `[${t.length}]`);
                }
                if (o.showOpeningClosingSquaredBrackets) {
                    a = DomElement.createWithHTML(n, "span", "opening-symbol", "[");
                }
                if (o.showClosedArraySquaredBrackets) {
                    u = DomElement.createWithHTML(n, "span", "closed-symbols", "[ ... ]");
                }
                const c = ae(o, n, i);
                const p = K(m, c, l, o, t, a, u, true, i, s, y, true, d + 1);
                if (!p && o.showOpeningClosingSquaredBrackets) {
                    a.parentNode.removeChild(a);
                    u.parentNode.removeChild(u);
                }
            } else {
                T = true;
            }
        } else if (Is.definedArray(r)) {
            y = "array";
            if (!o.ignore.arrayValues) {
                const t = DomElement.create(g, "span", o.showValueColors ? y : "");
                const n = DomElement.create(f, "div", "object-type-contents");
                let l = null;
                let a = null;
                ee(n, o);
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
                    a = DomElement.createWithHTML(t, "span", "closed-symbols", "[ ... ]");
                }
                const u = ae(o, t, i);
                const c = K(m, u, n, o, r, l, a, true, i, s, y, false, d + 1);
                if (!c && o.showOpeningClosingSquaredBrackets) {
                    l.parentNode.removeChild(l);
                    a.parentNode.removeChild(a);
                }
            } else {
                T = true;
            }
        } else if (Is.definedMap(r)) {
            y = "map";
            if (!o.ignore.mapValues) {
                const t = Convert2.mapToObject(r);
                const n = Obj.getPropertyNames(t, o);
                const l = n.length;
                if (l === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const r = DomElement.create(g, "span", o.showValueColors ? y : "");
                    const a = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    ee(a, o);
                    if (i) {
                        a.classList.add("last-item");
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
                    const p = ae(o, r, i);
                    const T = Y(m, p, a, o, t, n, u, c, true, i, s, y, true, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else if (Is.definedObject(r)) {
            y = "object";
            if (!o.ignore.objectValues) {
                const t = Obj.getPropertyNames(r, o);
                const n = t.length;
                if (n === 0 && o.ignore.emptyObjects) {
                    T = true;
                } else {
                    const l = DomElement.create(g, "span", o.showValueColors ? y : "");
                    const a = DomElement.create(f, "div", "object-type-contents");
                    let u = null;
                    let c = null;
                    ee(a, o);
                    if (i) {
                        a.classList.add("last-item");
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
                    const p = ae(o, l, i);
                    const T = Y(m, p, a, o, r, t, u, c, true, i, s, y, false, d + 1);
                    if (!T && o.showOpeningClosingCurlyBraces) {
                        u.parentNode.removeChild(u);
                        c.parentNode.removeChild(c);
                    }
                }
            } else {
                T = true;
            }
        } else {
            y = "unknown";
            if (!o.ignore.unknownValues) {
                p = o.showValueColors ? `${y} value non-value` : "value non-value";
                x = DomElement.createWithHTML(g, "span", p, r.toString());
                Trigger.customEvent(o.events.onUnknownRender, o._currentView.element, x);
                ae(o, g, i);
            } else {
                T = true;
            }
        }
        if (!S && !b) {
            G(o, y);
        }
        if (T) {
            n.removeChild(f);
        } else {
            if (Is.defined(x)) {
                if (!S) {
                    U(o, r, x);
                    z(o, r, x);
                    J(o, y, x);
                    fe(o, x, w, t, r, l, a, v);
                }
                if (Is.defined(D)) {
                    if (y !== "null" && y !== "undefined" && y !== "array" && y !== "object" && y !== "map" && y !== "set") {
                        D.innerHTML = `(${y})`;
                    } else {
                        D.parentNode.removeChild(D);
                        D = null;
                    }
                }
                if (V) {
                    te(o, s, h, D, x);
                    re(o, x, r, y, w);
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
    function ee(e, t) {
        if (t.showOpenedObjectArrayBorders) {
            e.classList.add("object-border");
            if (!t.showExpandIcons) {
                e.classList.add("object-border-no-toggles");
            }
            DomElement.create(e, "div", "object-border-bottom");
        }
    }
    function te(e, t, n, o, l) {
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
    function ne(t, n, o, l, r) {
        if (t.allowEditing.propertyNames) {
            l.ondblclick = a => {
                DomElement.cancelBubble(a);
                let s = 0;
                let u = null;
                clearTimeout(t._currentView.valueClickTimerId);
                t._currentView.valueClickTimerId = 0;
                t._currentView.editMode = true;
                l.classList.add("editable-name");
                if (r) {
                    l.innerHTML = Arr.getIndexFromBrackets(o).toString();
                } else {
                    l.innerHTML = o;
                }
                l.setAttribute("contenteditable", "true");
                l.focus();
                DomElement.selectAllText(l);
                l.onblur = () => {
                    i(t, false);
                    if (Is.definedString(u)) {
                        q(t, u);
                    }
                };
                l.onkeydown = i => {
                    if (i.code === "Escape") {
                        i.preventDefault();
                        l.setAttribute("contenteditable", "false");
                    } else if (i.code === "Enter") {
                        i.preventDefault();
                        const a = l.innerText;
                        if (r) {
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
    function oe(e, t, n, o, l, r, i, a = null) {
        if (i) {
            l.ondblclick = i => {
                le(i, e, t, n, o, l, r, a);
            };
        }
    }
    function le(t, n, o, l, r, a, s, u = null) {
        let c = null;
        DomElement.cancelBubble(t);
        clearTimeout(n._currentView.valueClickTimerId);
        n._currentView.valueClickTimerId = 0;
        n._currentView.editMode = true;
        a.classList.add("editable");
        a.setAttribute("contenteditable", "true");
        if (Is.definedDate(r) && !n.includeTimeZoneInDates) {
            a.innerText = JSON.stringify(r).replace(/['"]+/g, "");
        } else if (Is.definedRegExp(r)) {
            a.innerText = r.source;
        } else if (Is.definedSymbol(r)) {
            a.innerText = Convert2.symbolToString(r);
        } else if (Is.definedImage(r)) {
            a.innerText = r.src;
        } else {
            a.innerText = r.toString();
        }
        a.focus();
        DomElement.selectAllText(a);
        if (Is.defined(u)) {
            u.parentNode.removeChild(u);
        }
        a.onblur = () => {
            i(n, false);
            if (Is.definedString(c)) {
                q(n, c);
            }
        };
        a.onkeydown = t => {
            if (t.code === "Escape") {
                t.preventDefault();
                a.setAttribute("contenteditable", "false");
            } else if (t.code === "Enter") {
                t.preventDefault();
                const i = a.innerText;
                if (i.trim() === "") {
                    if (s) {
                        o.splice(Arr.getIndexFromBrackets(l), 1);
                    } else {
                        delete o[l];
                    }
                    c = e.text.itemDeletedText;
                } else {
                    let t = Convert2.stringToDataTypeValue(r, i);
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
    function re(t, n, o, l, r) {
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
    function ie(e, t, n, l, r, i, a, s) {
        const u = e._currentView.contentPanelsIndex;
        const c = e._currentView.contentPanelsDataIndex;
        const d = e._currentView.currentColumnBuildingIndex;
        if (!e._currentView.contentPanelsOpen.hasOwnProperty(c)) {
            e._currentView.contentPanelsOpen[c] = {};
        }
        const f = (o = true) => {
            l.style.display = "none";
            e._currentView.contentPanelsOpen[c][u] = true;
            if (Is.defined(t)) {
                t.className = `closed-${e.expandIconType}`;
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
        const g = (a, s = true) => {
            if (Is.defined(a)) {
                DomElement.cancelBubble(a);
                if (!o) {
                    ce(e);
                }
            }
            l.style.display = "block";
            e._currentView.contentPanelsOpen[c][u] = false;
            if (Is.defined(t)) {
                t.className = `opened-${e.expandIconType}`;
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
            if (s) {
                x(d, e);
            }
        };
        const m = (t, n, l = true) => {
            if (Is.defined(t)) {
                DomElement.cancelBubble(t);
                if (!o) {
                    ce(e);
                }
            }
            if (n) {
                f(l);
            } else {
                g(null, l);
            }
        };
        let p = e.showAllAsClosed;
        if (e._currentView.contentPanelsOpen[c].hasOwnProperty(u)) {
            p = e._currentView.contentPanelsOpen[c][u];
        } else {
            if (!e._currentView.initialized) {
                if (s === "object" && e.autoClose.objectSize > 0 && a >= e.autoClose.objectSize) {
                    p = true;
                } else if (s === "array" && e.autoClose.arraySize > 0 && a >= e.autoClose.arraySize) {
                    p = true;
                } else if (s === "map" && e.autoClose.mapSize > 0 && a >= e.autoClose.mapSize) {
                    p = true;
                } else if (s === "set" && e.autoClose.setSize > 0 && a >= e.autoClose.setSize) {
                    p = true;
                } else if (s === "html" && e.autoClose.htmlSize > 0 && a >= e.autoClose.htmlSize) {
                    p = true;
                }
            }
            e._currentView.contentPanelsOpen[c][u] = p;
        }
        if (Is.defined(t)) {
            t.onclick = n => m(n, t.className === `opened-${e.expandIconType}`);
            t.ondblclick = DomElement.cancelBubble;
        }
        if (Is.defined(i)) {
            i.onclick = e => g(e);
            i.ondblclick = DomElement.cancelBubble;
        }
        m(null, p, false);
        e._currentView.contentPanelsIndex++;
    }
    function ae(e, t, n) {
        let o = null;
        if (e.showCommas && !n) {
            o = DomElement.createWithHTML(t, "span", "comma", ",");
        }
        return o;
    }
    function se(e, t, n, o, l) {
        const r = DomElement.create(t, "div", "closing-symbol");
        if (o && e.showExpandIcons || e.showOpenedObjectArrayBorders) {
            DomElement.create(r, "div", `no-${e.expandIconType}`);
        }
        DomElement.createWithHTML(r, "div", "object-type-end", n);
        ae(e, r, l);
    }
    function ue(e, t, n, l, r) {
        t.onclick = i => {
            DomElement.cancelBubble(i);
            const a = t.classList.contains("highlight-selected") && o;
            const s = e._currentView.currentContentColumns;
            const u = e._currentView.currentContentColumns.length;
            let c = false;
            if (!o) {
                e._currentView.selectedValues = [];
            }
            for (let t = 0; t < u; t++) {
                const r = s[t].column.querySelectorAll(".object-type-value-title");
                const i = r.length;
                for (let s = 0; s < i; s++) {
                    const i = r[s];
                    if (!o) {
                        i.classList.remove("highlight-selected");
                        i.classList.remove("highlight-compare");
                    }
                    if (de(e) && t !== l) {
                        const e = i.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME);
                        if (Is.definedString(e) && e === n) {
                            if (!a) {
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
            if (!a) {
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
    function ce(e) {
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
                    if (de(e) && o.classList.contains("highlight-compare")) {
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
    function de(e) {
        return e.paging.enabled && e.paging.columnsPerPage > 1 && e.paging.allowComparisons;
    }
    function fe(t, n, o, l, r, i, a, s) {
        n.oncontextmenu = u => {
            DomElement.cancelBubble(u);
            t._currentView.contextMenu.innerHTML = "";
            if (o && t._currentView.selectedValues.length <= 1) {
                const o = ContextMenu.addMenuItem(t, e.text.editSymbolButtonText, e.text.editButtonText);
                o.onclick = e => ge(e, t, n, l, i, r, a, s);
            }
            const c = ContextMenu.addMenuItem(t, e.text.copyButtonSymbolText, e.text.copyButtonText);
            c.onclick = e => me(e, t, r);
            if (o && t._currentView.selectedValues.length <= 1) {
                const n = ContextMenu.addMenuItem(t, e.text.removeSymbolButtonText, e.text.removeButtonText);
                n.onclick = e => pe(e, t, l, i, a);
            }
            DomElement.showElementAtMousePosition(u, t._currentView.contextMenu, 0);
        };
    }
    function ge(e, t, n, o, l, r, i, a) {
        DomElement.cancelBubble(e);
        le(e, t, o, l, r, n, i, a);
        ContextMenu.hide(t);
    }
    function me(e, t, n) {
        DomElement.cancelBubble(e);
        let o = n;
        if (t._currentView.selectedValues.length !== 0) {
            o = t._currentView.selectedValues;
        }
        V(t, o);
        ContextMenu.hide(t);
    }
    function pe(t, n, o, l, r) {
        DomElement.cancelBubble(t);
        if (r) {
            o.splice(Arr.getIndexFromBrackets(l), 1);
        } else {
            delete o[l];
        }
        ContextMenu.hide(n);
        i(n, false);
        q(n, e.text.itemDeletedText);
    }
    function xe(t) {
        if (t.fileDroppingEnabled) {
            const n = DomElement.create(t._currentView.element, "div", "drag-and-drop-background");
            const o = DomElement.create(n, "div", "notice-text");
            DomElement.createWithHTML(o, "p", "notice-text-symbol", e.text.dragAndDropSymbolText);
            DomElement.createWithHTML(o, "p", "notice-text-title", e.text.dragAndDropTitleText);
            DomElement.createWithHTML(o, "p", "notice-text-description", e.text.dragAndDropDescriptionText);
            t._currentView.dragAndDropBackground = n;
            t._currentView.element.ondragover = () => Te(t, n);
            t._currentView.element.ondragenter = () => Te(t, n);
            n.ondragover = DomElement.cancelBubble;
            n.ondragenter = DomElement.cancelBubble;
            n.ondragleave = () => n.style.display = "none";
            n.ondrop = e => be(e, t);
        }
    }
    function Te(e, t) {
        if (!e._currentView.columnDragging) {
            t.style.display = "block";
        }
    }
    function be(e, t) {
        DomElement.cancelBubble(e);
        t._currentView.dragAndDropBackground.style.display = "none";
        if (Is.defined(window.FileReader) && e.dataTransfer.files.length > 0) {
            ye(e.dataTransfer.files, t);
        }
    }
    function ye(e, t, n = null) {
        let o = e.length;
        let l = 0;
        let r = {};
        const i = (e, i) => {
            l++;
            r[i] = e;
            if (l === o) {
                we(t, r, n, l, o);
            }
        };
        for (let t = 0; t < o; t++) {
            const n = e[t];
            const l = n.name.split(".").pop().toLowerCase();
            if (l === "json") {
                he(n, i);
            } else {
                o--;
            }
        }
    }
    function he(t, n) {
        const o = new FileReader;
        let l = null;
        o.onloadend = () => n(l, t.name);
        o.onload = n => {
            const o = Convert2.jsonStringToObject(n.target.result, e);
            if (o.parsed && Is.definedObject(o.object)) {
                l = new ImportedFilename;
                l.filename = t.name;
                l.object = o.object;
            }
        };
        o.readAsText(t);
    }
    function we(t, n, o, l, r) {
        t._currentView.contentPanelsOpen = {};
        t._currentView.controlButtonsOpen = {};
        const a = Object.keys(n);
        a.sort();
        if (Is.definedNumber(o)) {
            for (let e = 0; e < l; e++) {
                if (o > t.data.length - 1) {
                    t.data.push(n[a[e]]);
                } else {
                    t.data.splice(o, 0, n[a[e]]);
                }
            }
            t._currentView.currentDataArrayPageIndex = o - o % t.paging.columnsPerPage;
        } else {
            t._currentView.currentDataArrayPageIndex = 0;
            if (l === 1) {
                t.data = n[a[0]];
            } else {
                t.data = [];
                for (let e = 0; e < l; e++) {
                    t.data.push(n[a[e]]);
                }
            }
        }
        i(t);
        q(t, e.text.importedText.replace("{0}", r.toString()));
        Trigger.customEvent(t.events.onSetJson, t._currentView.element);
    }
    function De(t, n) {
        const o = JSON.stringify(Convert2.toJsonStringifyClone(n, e, t), t.events.onCopyJsonReplacer, t.jsonIndentSpaces);
        if (Is.definedString(o)) {
            const n = DomElement.create(document.body, "a");
            n.style.display = "none";
            n.setAttribute("target", "_blank");
            n.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(o)}`);
            n.setAttribute("download", Se(t));
            n.click();
            document.body.removeChild(n);
            N(t);
            q(t, e.text.exportedText);
            Trigger.customEvent(t.events.onExport, t._currentView.element);
        }
    }
    function Se(t) {
        const n = new Date;
        const o = DateTime.getCustomFormattedDateText(e, n, t.exportFilenameFormat);
        return o;
    }
    function Ve(e, t = true) {
        const n = t ? document.addEventListener : document.removeEventListener;
        const l = t ? window.addEventListener : window.removeEventListener;
        n("keydown", (t => Be(t, e)));
        n("keyup", (e => Ee(e)));
        n("contextmenu", (() => ve(e)));
        l("click", (() => ve(e)));
        l("focus", (() => o = false));
    }
    function ve(e) {
        if (!o) {
            ce(e);
        }
    }
    function Be(e, l) {
        o = Ie(e);
        if (l.shortcutKeysEnabled && n === 1 && t.hasOwnProperty(l._currentView.element.id) && !l._currentView.editMode) {
            if (Ie(e) && e.code === "KeyC") {
                e.preventDefault();
                E(l, l.data);
            } else if (Ie(e) && e.code === "F11") {
                e.preventDefault();
                B(l);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                _(l);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                A(l);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                C(l);
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                I(l);
            } else if (e.code === "Escape") {
                e.preventDefault();
                if (!N(l) && !o) {
                    ce(l);
                }
            }
        }
    }
    function Ee(e) {
        o = Ie(e);
    }
    function Ie(e) {
        return e.ctrlKey || e.metaKey;
    }
    function Ce(e) {
        e._currentView.element.innerHTML = "";
        e._currentView.element.classList.remove("json-tree-js");
        e._currentView.element.classList.remove("full-screen");
        if (Is.definedString(e.class)) {
            const t = e.class.split(" ");
            const n = t.length;
            for (let o = 0; o < n; o++) {
                e._currentView.element.classList.remove(t[o].trim());
            }
        }
        if (e._currentView.element.className.trim() === "") {
            e._currentView.element.removeAttribute("class");
        }
        if (e._currentView.idSet) {
            e._currentView.element.removeAttribute("id");
        }
        Ve(e, false);
        ToolTip.assignToEvents(e, false);
        ContextMenu.assignToEvents(e, false);
        ToolTip.remove(e);
        ContextMenu.remove(e);
        Trigger.customEvent(e.events.onDestroy, e._currentView.element);
    }
    const _e = {
        refresh: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                i(n);
                Trigger.customEvent(n.events.onRefresh, n._currentView.element);
            }
            return _e;
        },
        refreshAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    const n = t[e];
                    i(n);
                    Trigger.customEvent(n.events.onRefresh, n._currentView.element);
                }
            }
            return _e;
        },
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e));
            }
            return _e;
        },
        renderAll: function() {
            l();
            return _e;
        },
        openAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                I(t[e]);
            }
            return _e;
        },
        closeAll: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                C(t[e]);
            }
            return _e;
        },
        backPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    _(t[e]);
                }
            }
            return _e;
        },
        nextPage: function(e) {
            if (Is.definedString(e) && t.hasOwnProperty(e)) {
                const n = t[e];
                if (n.paging.enabled) {
                    A(t[e]);
                }
            }
            return _e;
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
                r._currentView.controlButtonsOpen = {};
                r.data = l;
                i(r);
                Trigger.customEvent(r.events.onSetJson, r._currentView.element);
            }
            return _e;
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
            return _e;
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
                Ce(t[e]);
                delete t[e];
                n--;
            }
            return _e;
        },
        destroyAll: function() {
            for (const e in t) {
                if (t.hasOwnProperty(e)) {
                    Ce(t[e]);
                }
            }
            t = {};
            n = 0;
            return _e;
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
            return _e;
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
            return "4.6.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => l()));
        if (!Is.defined(window.$jsontree)) {
            window.$jsontree = _e;
        }
    })();
})();//# sourceMappingURL=jsontree.js.map