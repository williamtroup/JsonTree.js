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
    function u(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = u;
    function i(e) {
        return n(e) && e instanceof Date;
    }
    e.definedDate = i;
    function s(e) {
        return t(e) && typeof e === "number" && e % 1 !== 0;
    }
    e.definedDecimal = s;
    function f(e, t = 1) {
        return !u(e) || e.length < t;
    }
    e.invalidOptionArray = f;
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
    function u(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = u;
    function i(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = i;
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
            n = u(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = s;
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

(() => {
    let _configuration = {};
    let _elements_Data = {};
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
        var t = Data.getDefaultObject(e, {});
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