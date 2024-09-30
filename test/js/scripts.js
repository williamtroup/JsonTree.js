var _HTML_ELEMENT_1 = null;
var _HTML_ELEMENT_2 = null;
var _MAP_1 = null;
var _MAP_2 = null;
var _SET_1 = null;
var _SET_2 = null;
var _IMAGE_1 = null;

( () => {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += " v" + $jsontree.getVersion();
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
        data: getData(),
        //data: null,
        //data: _MAP_1,
        //data: [ _MAP_1, _MAP_2 ],
        //data: _SET_1,
        //data: [ _SET_1, _SET_2 ],
        //data: _HTML_ELEMENT_1,
        //data: [ _HTML_ELEMENT_1, _HTML_ELEMENT_2 ],
        //data: "https://william-troup.com/jsontree-js/test-data/test.json",
        showValueColors: showValueColors,
        sortPropertyNames: true,
        showArrayIndexBrackets: true,
        showOpeningClosingCurlyBraces: false,
        showOpeningClosingSquaredBrackets: false,
        showCommas: true,
        showArrowToggles: true,
        openInFullScreenMode: columnSize > 1,
        useZeroIndexingForArrays: true,
        showObjectSizes: true,
        showDataTypes: false,
        logJsonValueToolTipPaths: false,
        showOpenedObjectArrayBorders: true,
        showPropertyNameQuotes: true,
        showPropertyNameAndIndexColors: true,
        addArrayIndexPadding: false,
        maximumStringLength: 0,
        minimumArrayIndexPadding: 0,
        arrayIndexPaddingCharacter: "0",
        maximumUrlLength: 0,
        maximumEmailLength: 0,
        showStringQuotes: true,
        showCssStylesForHtmlObjects: false,
        jsonIndentSpaces: 8,
        showChildIndexes: true,
        includeTimeZoneInDateTimeEditing: true,
        valueToolTips: allowValueToolTips ? {
            "value1": "This is a boolean tooltip for Value 1",
            "value5\\1": "This is a string tooltip for Value 5 > Array Index 1",
            "value6\\objectValue3": "This is a number tooltip for Value 6 > Object Value 3",
            "parsing\\booleans\\value1": "This is a boolean tooltip for Value 1 on Page 2",
            "..\\..\\arrayValue1": "This is a boolean tooltip shown for every array index",
        } : null,
        parse: {
            stringsToDates: true,
            stringsToBooleans: true,
            stringsToNumbers: true,
        },
        events: {
            onValueClick: onValueClickEvent,
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
        }
    };
}

function getData() {
    return [
        {
            value1: true,
            value2: "This is a string for page 1",
            value3: new Date(),
            value4: 5,
            value7: null,
            value9: 3.1415926535,
            value10: 9007199254740991n,
            value11: Symbol( "id" ),
            value12: undefined,
            value13: {
                lambda: ( message ) => {
                    console.log( message );
                },
                namedFunction: testFunctionName,
                function: function( message ) {
                    console.log( message );
                }
            },
            value14: "rgb(144, 238, 144)",
            value15: crypto.randomUUID(),
            value16: new RegExp( "ab+c" ),
            value17: _MAP_1,
            value18: _SET_1,
            value19: "https://www.william-troup.com",
            value20: "william@troup.uk",
            value21: _IMAGE_1,
            value22: _HTML_ELEMENT_1,
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
                    new Date(),
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
        },
    ]
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
    var bindingOptions = $jsontree.getBindingOptions( "json-tree-1" );
    bindingOptions.showArrowToggles = false;

    $jsontree.updateBindingOptions( "json-tree-1", bindingOptions );
}