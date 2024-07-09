"use strict";

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function o(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = o;
    function r(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = r;
    function a(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = a;
    function l(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = l;
    function i(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = i;
    function s(e) {
        return n(e) && e instanceof Date;
    }
    e.definedDate = s;
    function u(e) {
        return t(e) && typeof e === "number" && e % 1 !== 0;
    }
    e.definedDecimal = u;
    function c(e, t = 1) {
        return !i(e) || e.length < t;
    }
    e.invalidOptionArray = c;
})(Is || (Is = {}));

var Data;

(e => {
    let t;
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
    })(t = e.String || (e.String = {}));
    function n(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getDefaultAnyString = n;
    function o(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = o;
    function r(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = r;
    function a(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = a;
    function l(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = l;
    function i(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = i;
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = s;
    function u(e, t) {
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
    e.getDefaultStringOrArray = u;
})(Data || (Data = {}));

var DomElement;

(e => {
    function t(e, t, n = "", o = null) {
        const r = t.toLowerCase();
        const a = r === "text";
        let l = a ? document.createTextNode("") : document.createElement(r);
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
    function n(e, n, o, r, a = null) {
        const l = t(e, n, o, a);
        l.innerHTML = r;
        return l;
    }
    e.createWithHTML = n;
    function o(e, t) {
        e.classList.add(t);
    }
    e.addClass = o;
})(DomElement || (DomElement = {}));

var DateTime;

(e => {
    function t(e) {
        return e.getDay() - 1 < 0 ? 6 : e.getDay() - 1;
    }
    e.getWeekdayNumber = t;
    function n(e, t) {
        let n = e.thText;
        if (t === 31 || t === 21 || t === 1) {
            n = e.stText;
        } else if (t === 22 || t === 2) {
            n = e.ndText;
        } else if (t === 23 || t === 3) {
            n = e.rdText;
        }
        return n;
    }
    e.getDayOrdinal = n;
    function o(e, o, r) {
        let a = r;
        const l = t(o);
        a = a.replace("{hh}", Data.String.padNumber(o.getHours(), 2));
        a = a.replace("{h}", o.getHours().toString());
        a = a.replace("{MM}", Data.String.padNumber(o.getMinutes(), 2));
        a = a.replace("{M}", o.getMinutes().toString());
        a = a.replace("{ss}", Data.String.padNumber(o.getSeconds(), 2));
        a = a.replace("{s}", o.getSeconds().toString());
        a = a.replace("{dddd}", e.dayNames[l]);
        a = a.replace("{ddd}", e.dayNamesAbbreviated[l]);
        a = a.replace("{dd}", Data.String.padNumber(o.getDate()));
        a = a.replace("{d}", o.getDate().toString());
        a = a.replace("{o}", n(e, o.getDate()));
        a = a.replace("{mmmm}", e.monthNames[o.getMonth()]);
        a = a.replace("{mmm}", e.monthNamesAbbreviated[o.getMonth()]);
        a = a.replace("{mm}", Data.String.padNumber(o.getMonth() + 1));
        a = a.replace("{m}", (o.getMonth() + 1).toString());
        a = a.replace("{yyyy}", o.getFullYear().toString());
        a = a.replace("{yyy}", o.getFullYear().toString().substring(1));
        a = a.replace("{yy}", o.getFullYear().toString().substring(2));
        a = a.replace("{y}", Number.parseInt(o.getFullYear().toString().substring(2)).toString());
        return a;
    }
    e.getCustomFormattedDateText = o;
})(DateTime || (DateTime = {}));

(() => {
    let _configuration = {};
    let _elements_Data = {};
    function renderObject(e, t, n) {
        const o = DomElement.create(e, "div", "object-type-title");
        const r = DomElement.create(e, "div", "object-type-contents");
        const a = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
        const l = renderObjectValues(a, r, t, n);
        DomElement.createWithHTML(o, "span", t.showValueColors ? "object" : "", _configuration.objectText);
        if (t.showCounts && l > 0) {
            DomElement.createWithHTML(o, "span", t.showValueColors ? "object count" : "count", "{" + l + "}");
        }
    }
    function renderArray(e, t, n) {
        const o = DomElement.create(e, "div", "object-type-title");
        const r = DomElement.create(e, "div", "object-type-contents");
        const a = t.showArrowToggles ? DomElement.create(o, "div", "down-arrow") : null;
        DomElement.createWithHTML(o, "span", t.showValueColors ? "array" : "", _configuration.arrayText);
        renderArrayValues(a, r, t, n);
        if (t.showCounts) {
            DomElement.createWithHTML(o, "span", t.showValueColors ? "array count" : "count", "[" + n.length + "]");
        }
    }
    function renderObjectValues(e, t, n, o) {
        let r = 0;
        let a = [];
        for (let e in o) {
            if (o.hasOwnProperty(e)) {
                a.push(e);
            }
        }
        if (n.sortPropertyNames) {
            a = a.sort();
            if (!n.sortPropertyNamesInAlphabeticalOrder) {
                a = a.reverse();
            }
        }
        const l = a.length;
        for (let e = 0; e < l; e++) {
            const i = a[e];
            if (o.hasOwnProperty(i)) {
                renderValue(t, n, i, o[i], e === l - 1);
                r++;
            }
        }
        addArrowEvent(n, e, t);
        return r;
    }
    function renderArrayValues(e, t, n, o) {
        const r = o.length;
        if (!n.reverseArrayValues) {
            for (let e = 0; e < r; e++) {
                renderValue(t, n, getIndexName(n, e, r), o[e], e === r - 1);
            }
        } else {
            for (let e = r; e--; ) {
                renderValue(t, n, getIndexName(n, e, r), o[e], e === 0);
            }
        }
        addArrowEvent(n, e, t);
    }
    function renderValue(e, t, n, o, r) {
        const a = DomElement.create(e, "div", "object-type-value");
        const l = t.showArrowToggles ? DomElement.create(a, "div", "no-arrow") : null;
        let i = null;
        let s = null;
        let u = false;
        let c = null;
        let f = true;
        DomElement.createWithHTML(a, "span", "title", n);
        DomElement.createWithHTML(a, "span", "split", ":");
        if (!Is.defined(o)) {
            if (!t.ignore.nullValues) {
                i = t.showValueColors ? "null" : "";
                s = DomElement.createWithHTML(a, "span", i, "null");
                f = false;
                if (Is.definedFunction(t.events.onNullRender)) {
                    fireCustomTriggerEvent(t.events.onNullRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedFunction(o)) {
            if (!t.ignore.functionValues) {
                i = t.showValueColors ? "function" : "";
                s = DomElement.createWithHTML(a, "span", i, getFunctionName(o));
                c = "function";
                if (Is.definedFunction(t.events.onFunctionRender)) {
                    fireCustomTriggerEvent(t.events.onFunctionRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedBoolean(o)) {
            if (!t.ignore.booleanValues) {
                i = t.showValueColors ? "boolean" : "";
                s = DomElement.createWithHTML(a, "span", i, o);
                c = "boolean";
                if (Is.definedFunction(t.events.onBooleanRender)) {
                    fireCustomTriggerEvent(t.events.onBooleanRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedDecimal(o)) {
            if (!t.ignore.decimalValues) {
                const e = getFixedValue(o, t.maximumDecimalPlaces);
                i = t.showValueColors ? "decimal" : "";
                s = DomElement.createWithHTML(a, "span", i, e);
                c = "decimal";
                if (Is.definedFunction(t.events.onDecimalRender)) {
                    fireCustomTriggerEvent(t.events.onDecimalRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedNumber(o)) {
            if (!t.ignore.numberValues) {
                i = t.showValueColors ? "number" : "";
                s = DomElement.createWithHTML(a, "span", i, o);
                c = "number";
                if (Is.definedFunction(t.events.onNumberRender)) {
                    fireCustomTriggerEvent(t.events.onNumberRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedString(o)) {
            if (!t.ignore.stringValues) {
                let e = null;
                if (t.showStringHexColors && isHexColor(o)) {
                    e = o;
                } else {
                    if (t.maximumStringLength > 0 && o.length > t.maximumStringLength) {
                        o = o.substring(0, t.maximumStringLength) + _configuration.ellipsisText;
                    }
                }
                const n = t.showStringQuotes ? '"' + o + '"' : o;
                i = t.showValueColors ? "string" : "";
                s = DomElement.createWithHTML(a, "span", i, n);
                c = "string";
                if (Is.definedString(e)) {
                    s.style.color = e;
                }
                if (Is.definedFunction(t.events.onStringRender)) {
                    fireCustomTriggerEvent(t.events.onStringRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedDate(o)) {
            if (!t.ignore.dateValues) {
                i = t.showValueColors ? "date" : "";
                s = DomElement.createWithHTML(a, "span", i, DateTime.getCustomFormattedDateText(_configuration, o, t.dateTimeFormat));
                c = "date";
                if (Is.definedFunction(t.events.onDateRender)) {
                    fireCustomTriggerEvent(t.events.onDateRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        } else if (Is.definedObject(o) && !Is.definedArray(o)) {
            if (!t.ignore.objectValues) {
                const e = DomElement.create(a, "span", t.showValueColors ? "object" : "");
                const n = DomElement.create(a, "div", "object-type-contents");
                const i = renderObjectValues(l, n, t, o);
                DomElement.createWithHTML(e, "span", "title", _configuration.objectText);
                if (t.showCounts && i > 0) {
                    DomElement.createWithHTML(e, "span", "count", "{" + i + "}");
                }
                createComma(t, e, r);
                c = "object";
            } else {
                u = true;
            }
        } else if (Is.definedArray(o)) {
            if (!t.ignore.arrayValues) {
                const e = DomElement.create(a, "span", t.showValueColors ? "array" : "");
                const n = DomElement.create(a, "div", "object-type-contents");
                DomElement.createWithHTML(e, "span", "title", _configuration.arrayText);
                if (t.showCounts) {
                    DomElement.createWithHTML(e, "span", "count", "[" + o.length + "]");
                }
                createComma(t, e, r);
                renderArrayValues(l, n, t, o);
                c = "array";
            } else {
                u = true;
            }
        } else {
            if (!t.ignore.unknownValues) {
                i = t.showValueColors ? "unknown" : "";
                s = DomElement.createWithHTML(a, "span", i, o.toString());
                c = "unknown";
                if (Is.definedFunction(t.events.onUnknownRender)) {
                    fireCustomTriggerEvent(t.events.onUnknownRender, s);
                }
                createComma(t, a, r);
            } else {
                u = true;
            }
        }
        if (u) {
            e.removeChild(a);
        } else {
            if (Is.defined(s)) {
                addValueClickEvent(t, s, o, c, f);
            }
        }
    }
    function addValueClickEvent(e, t, n, o, r) {
        if (r && Is.definedFunction(e.events.onValueClick)) {
            t.onclick = function() {
                fireCustomTriggerEvent(e.events.onValueClick, n, o);
            };
        } else {
            DomElement.addClass(t, "no-hover");
        }
    }
    function addArrowEvent(e, t, n) {
        if (Is.defined(t)) {
            t.onclick = function() {
                if (t.className === "down-arrow") {
                    n.style.display = "none";
                    t.className = "right-arrow";
                } else {
                    n.style.display = "block";
                    t.className = "down-arrow";
                }
            };
            if (e.showAllAsClosed) {
                n.style.display = "none";
                t.className = "right-arrow";
            } else {
                t.className = "down-arrow";
            }
        }
    }
    function getFunctionName(e) {
        let t;
        const n = e.toString().split("(");
        const o = n[0].split(" ");
        if (o.length === 2) {
            t = o[1];
        } else {
            t = o[0];
        }
        t += "()";
        return t;
    }
    function createComma(e, t, n) {
        if (e.showCommas && !n) {
            DomElement.createWithHTML(t, "span", "comma", ",");
        }
    }
    function getIndexName(e, t, n) {
        let o = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
        if (!e.addArrayIndexPadding) {
            o = Data.String.padNumber(parseInt(o), n.toString().length);
        }
        return o;
    }
    function getFixedValue(e, t) {
        var n;
        const o = new RegExp("^-?\\d+(?:.\\d{0," + (t || -1) + "})?");
        return ((n = e.toString().match(o)) == null ? void 0 : n[0]) || "";
    }
    function isHexColor(e) {
        let t = e.length >= 2 && e.length <= 7;
        if (t && e[0] === "#") {
            t = isNaN(+e.substring(1, e.length - 1));
        }
        return t;
    }
    function buildAttributeOptions(e) {
        let t = Data.getDefaultObject(e, {});
        t.data = Data.getDefaultObject(t.data, null);
        t.showCounts = Data.getDefaultBoolean(t.showCounts, true);
        t.useZeroIndexingForArrays = Data.getDefaultBoolean(t.useZeroIndexingForArrays, true);
        t.dateTimeFormat = Data.getDefaultString(t.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}");
        t.showArrowToggles = Data.getDefaultBoolean(t.showArrowToggles, true);
        t.showStringQuotes = Data.getDefaultBoolean(t.showStringQuotes, true);
        t.showAllAsClosed = Data.getDefaultBoolean(t.showAllAsClosed, false);
        t.sortPropertyNames = Data.getDefaultBoolean(t.sortPropertyNames, true);
        t.sortPropertyNamesInAlphabeticalOrder = Data.getDefaultBoolean(t.sortPropertyNamesInAlphabeticalOrder, true);
        t.showCommas = Data.getDefaultBoolean(t.showCommas, false);
        t.reverseArrayValues = Data.getDefaultBoolean(t.reverseArrayValues, false);
        t.addArrayIndexPadding = Data.getDefaultBoolean(t.addArrayIndexPadding, false);
        t.showValueColors = Data.getDefaultBoolean(t.showValueColors, true);
        t.maximumDecimalPlaces = Data.getDefaultNumber(t.maximumDecimalPlaces, 2);
        t.maximumStringLength = Data.getDefaultNumber(t.maximumStringLength, 0);
        t.showStringHexColors = Data.getDefaultBoolean(t.showStringHexColors, false);
        t = buildAttributeOptionTitle(t);
        t = buildAttributeOptionIgnore(t);
        t = buildAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildAttributeOptionTitle(e) {
        e.title = Data.getDefaultObject(e.title, {});
        e.title.text = Data.getDefaultString(e.title.text, "JsonTree.js");
        e.title.show = Data.getDefaultBoolean(e.title.show, true);
        e.title.showTreeControls = Data.getDefaultBoolean(e.title.showTreeControls, true);
        e.title.showCopyButton = Data.getDefaultBoolean(e.title.showCopyButton, false);
        return e;
    }
    function buildAttributeOptionIgnore(e) {
        e.ignore = Data.getDefaultObject(e.ignore, {});
        e.ignore.nullValues = Data.getDefaultBoolean(e.ignore.nullValues, false);
        e.ignore.functionValues = Data.getDefaultBoolean(e.ignore.functionValues, false);
        e.ignore.unknownValues = Data.getDefaultBoolean(e.ignore.unknownValues, false);
        e.ignore.booleanValues = Data.getDefaultBoolean(e.ignore.booleanValues, false);
        e.ignore.decimalValues = Data.getDefaultBoolean(e.ignore.decimalValues, false);
        e.ignore.numberValues = Data.getDefaultBoolean(e.ignore.numberValues, false);
        e.ignore.stringValues = Data.getDefaultBoolean(e.ignore.stringValues, false);
        e.ignore.dateValues = Data.getDefaultBoolean(e.ignore.dateValues, false);
        e.ignore.objectValues = Data.getDefaultBoolean(e.ignore.objectValues, false);
        e.ignore.arrayValues = Data.getDefaultBoolean(e.ignore.arrayValues, false);
        return e;
    }
    function buildAttributeOptionCustomTriggers(e) {
        e.events = Data.getDefaultObject(e.events, {});
        e.events.onBeforeRender = Data.getDefaultFunction(e.events.onBeforeRender, null);
        e.events.onRenderComplete = Data.getDefaultFunction(e.events.onRenderComplete, null);
        e.events.onValueClick = Data.getDefaultFunction(e.events.onValueClick, null);
        e.events.onRefresh = Data.getDefaultFunction(e.events.onRefresh, null);
        e.events.onCopyAll = Data.getDefaultFunction(e.events.onCopyAll, null);
        e.events.onOpenAll = Data.getDefaultFunction(e.events.onOpenAll, null);
        e.events.onCloseAll = Data.getDefaultFunction(e.events.onCloseAll, null);
        e.events.onDestroy = Data.getDefaultFunction(e.events.onDestroy, null);
        e.events.onBooleanRender = Data.getDefaultFunction(e.events.onBooleanRender, null);
        e.events.onDecimalRender = Data.getDefaultFunction(e.events.onDecimalRender, null);
        e.events.onNumberRender = Data.getDefaultFunction(e.events.onNumberRender, null);
        e.events.onStringRender = Data.getDefaultFunction(e.events.onStringRender, null);
        e.events.onDateRender = Data.getDefaultFunction(e.events.onDateRender, null);
        e.events.onFunctionRender = Data.getDefaultFunction(e.events.onFunctionRender, null);
        e.events.onNullRender = Data.getDefaultFunction(e.events.onNullRender, null);
        e.events.onUnknownRender = Data.getDefaultFunction(e.events.onUnknownRender, null);
        return e;
    }
    function fireCustomTriggerEvent(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
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
                result.object = eval("(" + objectString + ")");
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!_configuration.safeMode) {
                    console.error(_configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    const _public = {
        refresh: function(e) {
            throw new Error("Function not implemented.");
        },
        refreshAll: function() {
            throw new Error("Function not implemented.");
        },
        render: function(e, t) {
            throw new Error("Function not implemented.");
        },
        renderAll: function() {
            throw new Error("Function not implemented.");
        },
        openAll: function(e) {
            throw new Error("Function not implemented.");
        },
        closeAll: function(e) {
            throw new Error("Function not implemented.");
        },
        destroy: function(e) {
            throw new Error("Function not implemented.");
        },
        destroyAll: function() {
            throw new Error("Function not implemented.");
        },
        setConfiguration: function(e) {
            throw new Error("Function not implemented.");
        },
        getIds: function() {
            throw new Error("Function not implemented.");
        },
        getVersion: function() {
            throw new Error("Function not implemented.");
        }
    };
    (() => {})();
})();//# sourceMappingURL=jsontree.js.map