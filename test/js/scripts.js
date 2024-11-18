var _HTML_ELEMENT_1 = null;
var _HTML_ELEMENT_2 = null;
var _MAP_1 = null;
var _MAP_2 = null;
var _SET_1 = null;
var _SET_2 = null;
var _IMAGE_1 = null;

( () => {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += ` v${$jsontree.getVersion()}`;
        document.getElementById( "header" ).innerText += ` - v${$jsontree.getVersion()}`;
    } );

    createHTML();
    createMaps();
    createSets();
    createImages();
} )();

function createHTML() {
    _HTML_ELEMENT_1 = document.createElement( "div" );
    _HTML_ELEMENT_1.innerHTML = "This is an HTML element.";
    _HTML_ELEMENT_1.id = "test-id-1";
    _HTML_ELEMENT_1.className = "test-class-1";

    _HTML_ELEMENT_2 = document.createElement( "div" );
    _HTML_ELEMENT_2.id = "test-id-2";
    _HTML_ELEMENT_2.className = "test-class-2";
    _HTML_ELEMENT_2.innerHTML = "This is a child HTML element.";

    _HTML_ELEMENT_1.appendChild( _HTML_ELEMENT_2 );
}

function createMaps() {
    _MAP_1 = new Map();
    _MAP_1.set( "key1", true );
    _MAP_1.set( "key2", 10 );
    _MAP_1.set( "key3", "This is a string in a map" );
    _MAP_1.set( "key4", { value1: true, value2: 10 } );

    _MAP_2 = new Map();
    _MAP_2.set( "key1", false );
    _MAP_2.set( "key2", 20 );
    _MAP_2.set( "key3", "This is a another string in a map" );
    _MAP_2.set( "key4", { value1: false, value2: 20 } );
}

function createSets() {
    _SET_1 = new Set( [ true, false, "This is a string in a set", { value1: true, value2: 10 } ] );
    _SET_2 = new Set( [ false, true, "This is a another string in a set", { value1: false, value2: 20 } ] );
}

function createImages() {
    _IMAGE_1 = new Image( 100, 100 );
    _IMAGE_1.src = "images/image.png";
}

function bindingOptions( showValueColors = true, allowValueToolTips = true, showPaging = false, columnSize = 1 ) {
    return {
        data: getArrayData(),
        //data: getObjectData(),
        //data: null,
        //data: _MAP_1,
        //data: [ _MAP_1, _MAP_2 ],
        //data: _SET_1,
        //data: [ _SET_1, _SET_2 ],
        //data: _HTML_ELEMENT_1,
        //data: [ _HTML_ELEMENT_1, _HTML_ELEMENT_2 ],
        //data: "https://william-troup.com/jsontree-js/test-data/test.json",
        id: "",
        class: "",
        showValueColors: showValueColors,
        sortPropertyNames: true,
        showArrayIndexBrackets: true,
        showOpeningClosingCurlyBraces: false,
        showOpeningClosingSquaredBrackets: false,
        showClosedArraySquaredBrackets: true,
        showClosedObjectCurlyBraces: true,
        showCommas: true,
        showExpandIcons: true,
        openInFullScreenMode: columnSize > 1,
        useZeroIndexingForArrays: true,
        showObjectSizes: true,
        showDataTypes: false,
        logJsonValueToolTipPaths: false,
        showOpenedObjectArrayBorders: true,
        showPropertyNameQuotes: true,
        showPropertyNameAndIndexColors: true,
        addArrayIndexPadding: false,
        minimumArrayIndexPadding: 0,
        arrayIndexPaddingCharacter: "0",
        showStringQuotes: true,
        showCssStylesForHtmlObjects: false,
        jsonIndentSpaces: 8,
        showChildIndexes: true,
        includeTimeZoneInDates: true,
        convertClickedValuesToString: false,
        rootName: "root",
        emptyStringValue: "",
        expandIconType: "arrow",
        openUrlsInSameWindow: false,
        valueToolTips: allowValueToolTips ? {
            "value1": "This is a boolean tooltip for Value 1",
            "value5\\1": "This is a string tooltip for Value 5 > Array Index 1",
            "value6\\objectValue3": "This is a number tooltip for Value 6 > Object Value 3",
            "parsing\\booleans\\value1": "This is a boolean tooltip for Value 1 on Page 2",
            "..\\..\\arrayValue1": "This is a boolean tooltip shown for every array index",
        } : null,
        maximum: {
            decimalPlaces: 2,
            stringLength: 0,
            urlLength: 0,
            emailLength: 0,
            numberLength: 0,
            bigIntLength: 0,
            inspectionLevels: 10,
            propertyNameLength: 0,
            functionLength: 0,
            lambdaLength: 0,
        },
        parse: {
            stringsToDates: true,
            stringsToBooleans: true,
            stringsToNumbers: true,
            stringsToSymbols: true,
            stringsToFloats: true,
            stringsToBigInts: true,
        },
        events: {
            onValueClick: onValueClickEvent,
            onCustomDataTypeRender: onCustomDataTypeRender,
        },
        title: {
            showCopyButton: true,
            showCloseOpenAllButtons: true,
            enableFullScreenToggling: true,
            showFullScreenButton: true,
        },
        sideMenu: {
            enabled: true,
            showImportButton: true,
            showAvailableDataTypeCounts: true,
            showOnlyDataTypesAvailable: false,
            showExportButton: true,
        },
        allowEditing: {
            booleanValues: true,
            floatValues: true,
            stringValues: true,
            dateValues: true,
            numberValues: true,
            bigIntValues: true,
            guidValues: true,
            colorValues: true,
            urlValues: true,
            emailValues: true,
            regExpValues: true,
            symbolValues: true,
            imageValues: true,
            propertyNames: true,
            bulk: true,
        },
        autoClose: {
            objectSize: 0,
            arraySize: 0,
            mapSize: 0,
            setSize: 0,
            htmlSize: 0,
        },
        ignore: {
            nullValues: false,
            functionValues: false,
            unknownValues: false,
            booleanValues: false,
            floatValues: false,
            stringValues: false,
            arrayValues: false,
            objectValues: false,
            dateValues: false,
            numberValues: false,
            bigintValues: false,
            symbolValues: false,
            emptyObjects: false,
            undefinedValues: false,
            guidValues: false,
            colorValues: false,
            regexpValues: false,
            mapValues: false,
            setValues: false,
            urlValues: false,
            imageValues: false,
            emailValues: false,
            htmlValues: false,
            lambdaValues: false,
        },
        paging: {
            enabled: showPaging,
            columnsPerPage: columnSize,
            startPage: 1,
            synchronizeScrolling: false,
            allowColumnReordering: true,
            allowComparisons: false,
        },
        footer: {
            enabled: true,
            showLengths: true,
            showSizes: true,
            showPageOf: true,
            showDataTypes: true,
        },
        controlPanel: {
            enabled: true,
            showCopyButton: true,
            showMovingButtons: true,
            showRemoveButton: false,
            showEditButton: true,
            showCloseOpenAllButtons: true,
            showSwitchToPagesButton: true,
            showImportButton: true,
            showExportButton: true,
            showOpenCloseButton: true,
        },
        lineNumbers: {
            enabled: true,
            padNumbers: false,
            addDots: true,
        }
    };
}

function getArrayData() {
    return [
        {
            value1: true,
            value2: "This is a string for page 1",
            value3: new Date(),
            value4: 5,
            value7: null,
            value8: 3.1415926535,
            value9: 9007199254740991n,
            value10: Symbol( "id" ),
            value11: undefined,
            value12: {
                lambda: ( message ) => {
                    console.log( message );
                },
                namedFunction: testFunctionName,
                function: function( message ) {
                    console.log( message );
                },
                functionNoParameters: function() {
                    console.log( "Function without parameters" );
                },
            },
            value13: "rgb(144, 238, 144)",
            value14: crypto.randomUUID(),
            value15: new RegExp( "ab+c" ),
            value16: _MAP_1,
            value17: _SET_1,
            value18: "https://www.william-troup.com",
            value19: "william@troup.uk",
            value20: _IMAGE_1,
            value21: _HTML_ELEMENT_1,
            value22: "en",
            value5: [
                true,
                "This is another string",
                {
                    arrayValue1: true,
                    arrayValue2: 10
                },
                {
                    arrayValue1: false,
                    arrayValue2: 20
                },
                [
                    false,
                    true,
                    5,
                    10,
                    new Date( "Sun Oct 10 2024 12:00:00 GMT+0100 (British Summer Time)" ),
                    "#90ee90"
                ]
            ],
            value6: {
                objectValue1: false,
                objectValue2: "This is a new string.",
                objectValue3: 20,
                objectValue4: "This is an example of a very long string that should force scrolling to kick in.",
            }
        },
        {
            empty: {
                map: new Map(),
                set: new Set(),
                object: {},
                array: [],
                html: document.createElement( "div" ),
                string: "",
                blankString: "   ",
                symbol: Symbol(),
                invalidDate: new Date( "" ),
            },
        },
        document.getElementById( "header" ),
        {
            value1: true,
            value2: "This is a string for page 2",
            value3: new Date(),
            value4: 5,
            value5: null,
            parsing: {
                booleans: {
                    value1: "true",
                    value2: "false",
                },
                dates: {
                    value1: "2024-08-05T21:17:32.720Z",
                },
                numbers: {
                    value1: "123",
                    value2: "9.876",
                    value3: "986917361936291n",
                },
                symbols: {
                    value1: "Symbol(id)",
                    value2: "Symbol(name)",
                },
            },
            booleans: [
                true,
                false,
            ]
        },
        {
            value1: false,
            value2: "This is a string for page 3",
            value3: new Date(),
            value4: {
                value1: 1,
                value2: 1.3,
                value3: Symbol( "id1" )
            }
        },
        {
            value1: true,
            value2: "This is a string for page 4",
            value3: new Date(),
            value4: {
                value1: 2,
                value2: 1.6,
                value3: Symbol( "id2" )
            }
        },
        true,
        false,
        null,
        undefined
    ]
}

function getObjectData() {
    return {
        value1: true,
        value2: "This is a string for page 2",
        value3: new Date(),
        value4: 5,
        value5: null,
        value6: {
            value1: 2,
            value2: 1.6,
            value3: Symbol( "id2" )
        }
    };
}

function testFunctionName( message ) {
    console.log( message );
}

function onValueClickEvent( _, value, type ) {
    if ( typeof value === "function" ) {
        value = "function";
    } else if ( value === null ) {
        value = "null";
    } else if ( value === undefined ) {
        value = "undefined";
    } else if ( value instanceof RegExp ) {
        value = value.source;
    } else if ( value instanceof Map ) {
        value = Array.from( value.keys() );
    } else if ( value instanceof Set ) {
        value = Array.from( value.values() );
    } else if ( value instanceof Image ) {
        value = value.src;
    } else if ( value instanceof HTMLElement ) {
        value = value.innerHTML;
    }

    console.log( `Type: ${type}, Value: ${JSON.stringify( value, onValueClickJsonReplacer )}` );
}

function onValueClickJsonReplacer( _, value ) {
    if ( typeof value === "bigint" ) {
        value = value.toString();
    }

    return value;
}

function updateBindingOptions() {
    const bindingOptions = $jsontree.getBindingOptions( "json-tree-1" );
    bindingOptions.showExpandIcons = false;

    $jsontree.updateBindingOptions( "json-tree-1", bindingOptions );
}

function onCustomDataTypeRender( _, value ) {
    var result = false,
        name = getLanguage( value );

    if ( name !== undefined && name !== null ) {
        result = {
            class: "language",
            dataType: "language",
            allowEditing: true,
            html: name,
        };
    }

    return result;
}

function getLanguage( code ) {
    var languageCodes = {
        "af":    "Afrikaans",
        "sq":    "Albanian",
        "an":    "Aragonese",
        "ar":    "Arabic (Standard)",
        "ar-dz": "Arabic (Algeria)",
        "ar-bh": "Arabic (Bahrain)",
        "ar-eg": "Arabic (Egypt)",
        "ar-iq": "Arabic (Iraq)",
        "ar-jo": "Arabic (Jordan)",
        "ar-kw": "Arabic (Kuwait)",
        "ar-lb": "Arabic (Lebanon)",
        "ar-ly": "Arabic (Libya)",
        "ar-ma": "Arabic (Morocco)",
        "ar-om": "Arabic (Oman)",
        "ar-qa": "Arabic (Qatar)",
        "ar-sa": "Arabic (Saudi Arabia)",
        "ar-sy": "Arabic (Syria)",
        "ar-tn": "Arabic (Tunisia)",
        "ar-ae": "Arabic (U.A.E.)",
        "ar-ye": "Arabic (Yemen)",
        "hy":    "Armenian",
        "as":    "Assamese",
        "ast":   "Asturian",
        "az":    "Azerbaijani",
        "eu":    "Basque",
        "bg":    "Bulgarian",
        "be":    "Belarusian",
        "bn":    "Bengali",
        "bs":    "Bosnian",
        "br":    "Breton",
        "bg":    "Bulgarian",
        "my":    "Burmese",
        "ca":    "Catalan",
        "ch":    "Chamorro",
        "ce":    "Chechen",
        "zh":    "Chinese",
        "zh-hk": "Chinese (Hong Kong)",
        "zh-cn": "Chinese (PRC)",
        "zh-sg": "Chinese (Singapore)",
        "zh-tw": "Chinese (Taiwan)",
        "cv":    "Chuvash",
        "co":    "Corsican",
        "cr":    "Cree",
        "hr":    "Croatian",
        "cs":    "Czech",
        "da":    "Danish",
        "nl":    "Dutch (Standard)",
        "nl-be": "Dutch (Belgian)",
        "en":    "English",
        "en-au": "English (Australia)",
        "en-bz": "English (Belize)",
        "en-ca": "English (Canada)",
        "en-ie": "English (Ireland)",
        "en-jm": "English (Jamaica)",
        "en-nz": "English (New Zealand)",
        "en-ph": "English (Philippines)",
        "en-za": "English (South Africa)",
        "en-tt": "English (Trinidad & Tobago)",
        "en-gb": "English (United Kingdom)",
        "en-us": "English (United States)",
        "en-zw": "English (Zimbabwe)",
        "eo":    "Esperanto",
        "et":    "Estonian",
        "fo":    "Faeroese",
        "fa":    "Farsi",
        "fj":    "Fijian",
        "fi":    "Finnish",
        "fr":    "French (Standard)",
        "fr-be": "French (Belgium)",
        "fr-ca": "French (Canada)",
        "fr-fr": "French (France)",
        "fr-lu": "French (Luxembourg)",
        "fr-mc": "French (Monaco)",
        "fr-ch": "French (Switzerland)",
        "fy":    "Frisian",
        "fur":   "Friulian",
        "gd":    "Gaelic (Scots)",
        "gd-ie": "Gaelic (Irish)",
        "gl":    "Galacian",
        "ka":    "Georgian",
        "de":    "German (Standard)",
        "de-at": "German (Austria)",
        "de-de": "German (Germany)",
        "de-li": "German (Liechtenstein)",
        "de-lu": "German (Luxembourg)",
        "de-ch": "German (Switzerland)",
        "el":    "Greek",
        "gu":    "Gujurati",
        "ht":    "Haitian",
        "he":    "Hebrew",
        "hi":    "Hindi",
        "hu":    "Hungarian",
        "is":    "Icelandic",
        "id":    "Indonesian",
        "iu":    "Inuktitut",
        "ga":    "Irish",
        "it":    "Italian (Standard)",
        "it-ch": "Italian (Switzerland)",
        "ja":    "Japanese",
        "kn":    "Kannada",
        "ks":    "Kashmiri",
        "kk":    "Kazakh",
        "km":    "Khmer",
        "ky":    "Kirghiz",
        "tlh":   "Klingon",
        "ko":    "Korean",
        "ko-kp": "Korean (North Korea)",
        "ko-kr": "Korean (South Korea)",
        "la":    "Latin",
        "lv":    "Latvian",
        "lt":    "Lithuanian",
        "lb":    "Luxembourgish",
        "mk":    "FYRO Macedonian",
        "ms":    "Malay",
        "ml":    "Malayalam",
        "mt":    "Maltese",
        "mi":    "Maori",
        "mr":    "Marathi",
        "mo":    "Moldavian",
        "nv":    "Navajo",
        "ng":    "Ndonga",
        "ne":    "Nepali",
        "no":    "Norwegian",
        "nb":    "Norwegian (Bokmal)",
        "nn":    "Norwegian (Nynorsk)",
        "oc":    "Occitan",
        "or":    "Oriya",
        "om":    "Oromo",
        "fa":    "Persian",
        "fa-ir": "Persian/Iran",
        "pl":    "Polish",
        "pt":    "Portuguese",
        "pt-br": "Portuguese (Brazil)",
        "pa":    "Punjabi",
        "pa-in": "Punjabi (India)",
        "pa-pk": "Punjabi (Pakistan)",
        "qu":    "Quechua",
        "rm":    "Rhaeto-Romanic",
        "ro":    "Romanian",
        "ro-mo": "Romanian (Moldavia)",
        "ru":    "Russian",
        "ru-mo": "Russian (Moldavia)",
        "sz":    "Sami (Lappish)",
        "sg":    "Sango",
        "sa":    "Sanskrit",
        "sc":    "Sardinian",
        "gd":    "Scots Gaelic",
        "sd":    "Sindhi",
        "si":    "Singhalese",
        "sr":    "Serbian",
        "sk":    "Slovak",
        "sl":    "Slovenian",
        "so":    "Somani",
        "sb":    "Sorbian",
        "es":    "Spanish",
        "es-ar": "Spanish (Argentina)",
        "es-bo": "Spanish (Bolivia)",
        "es-cl": "Spanish (Chile)",
        "es-co": "Spanish (Colombia)",
        "es-cr": "Spanish (Costa Rica)",
        "es-do": "Spanish (Dominican Republic)",
        "es-ec": "Spanish (Ecuador)",
        "es-sv": "Spanish (El Salvador)",
        "es-gt": "Spanish (Guatemala)",
        "es-hn": "Spanish (Honduras)",
        "es-mx": "Spanish (Mexico)",
        "es-ni": "Spanish (Nicaragua)",
        "es-pa": "Spanish (Panama)",
        "es-py": "Spanish (Paraguay)",
        "es-pe": "Spanish (Peru)",
        "es-pr": "Spanish (Puerto Rico)",
        "es-es": "Spanish (Spain)",
        "es-uy": "Spanish (Uruguay)",
        "es-ve": "Spanish (Venezuela)",
        "sx":    "Sutu",
        "sw":    "Swahili",
        "sv":    "Swedish",
        "sv-fi": "Swedish (Finland)",
        "sv-sv": "Swedish (Sweden)",
        "ta":    "Tamil",
        "tt":    "Tatar",
        "te":    "Teluga",
        "th":    "Thai",
        "tig":   "Tigre",
        "ts":    "Tsonga",
        "tn":    "Tswana",
        "tr":    "Turkish",
        "tk":    "Turkmen",
        "uk":    "Ukrainian",
        "hsb":   "Upper Sorbian",
        "ur":    "Urdu",
        "ve":    "Venda",
        "vi":    "Vietnamese",
        "vo":    "Volapuk",
        "wa":    "Walloon",
        "cy":    "Welsh",
        "xh":    "Xhosa",
        "ji":    "Yiddish",
        "zu":    "Zulu",
    };

    return languageCodes[ code ];
}