( () => {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += " v" + $jsontree.getVersion();
        document.getElementById( "header" ).innerText += ` - v${$jsontree.getVersion()}`;
    } );
} )();

function bindingOptions( showValueColors = true, allowValueToolTips = true, showPaging = false, columnSize = 1 ) {
    return {
        data: getData(),
        //data: null,
        //data: "https://william-troup.com/jsontree-js/test-data/test.json",
        showValueColors: showValueColors,
        sortPropertyNames: true,
        showArrayIndexBrackets: true,
        showOpeningClosingCurlyBraces: false,
        showOpeningClosingSquaredBrackets: false,
        showCommas: false,
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
        showHtmlValuesAsObjects: false,
        maximumUrlLength: 0,
        maximumEmailLength: 0,
        showStringQuotes: true,
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
            showTreeControls: true,
            enableFullScreenToggling: true,
            showFullScreenButton: true,
        },
        footer: {
            enabled: true,
            showLengths: true,
            showSizes: true,
            showPageOf: true,
            showDataTypes: true,
        },
        sideMenu: {
            enabled: true,
            showImportButton: true,
            showAvailableDataTypeCounts: true,
            showOnlyDataTypesAvailable: false,
        },
        allowEditing: {
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
            emptyObjects: false
        },
        paging: {
            enabled: showPaging,
            columnsPerPage: columnSize,
            startPage: 1,
            synchronizeScrolling: false,
            allowColumnReordering: true,
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
    var map = new Map();
    map.set( "key1", true );
    map.set( "key2", 10 );
    map.set( "key3", "This is a string in a map" );
    map.set( "key4", { value1: true, value2: 10 } );

    var set = new Set( [ true, false, "This is a string in a set", { value1: true, value2: 10 } ] );

    var image = new Image( 100, 100 );
    image.src = "images/image.png";

    var htmlElement1 = document.createElement( "div" );
    htmlElement1.innerHTML = "This is an HTML element.";
    htmlElement1.id = "test-id-1";

    var htmlElement2 = document.createElement( "div" );
    htmlElement2.id = "test-id-2";
    htmlElement2.innerHTML = "This is a child HTML element.";

    htmlElement1.appendChild( htmlElement2 );

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
            value12: {},
            value13: [],
            value14: undefined,
            value15: {
                lambda: ( message ) => {
                    console.log( message );
                },
                namedFunction: testFunctionName,
                function: function( message ) {
                    console.log( message );
                }
            },
            value16: "rgb(144, 238, 144)",
            value17: crypto.randomUUID(),
            value18: new RegExp( "ab+c" ),
            value19: map,
            value20: set,
            value21: "https://www.william-troup.com",
            value22: "william@troup.uk",
            value23: image,
            value24: htmlElement1,
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
        }
    ]
}

function testFunctionName( message ) {
    console.log( message );
}

function onValueClickEvent( value, type ) {
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