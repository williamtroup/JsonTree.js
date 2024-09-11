( () => {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += " v" + $jsontree.getVersion();
        document.getElementById( "header" ).innerText += ` - v${$jsontree.getVersion()}`;
    } );
} )();

function bindingOptions( showValueColors = true, allowValueToolTips = true ) {
    return {
        data: getData(),
        //data: "https://william-troup.com/jsontree-js/test-data/test.json",
        parse: {
            stringsToDates: true,
            stringsToBooleans: true,
            stringsToNumbers: true,
        },
        events: {
            onValueClick: onValueClickEvent,
        },
        showValueColors: showValueColors,
        sortPropertyNames: true,
        showArrayIndexBrackets: true,
        showOpeningClosingCurlyBraces: false,
        showOpeningClosingSquaredBrackets: false,
        showCommas: false,
        showArrowToggles: true,
        openInFullScreenMode: false,
        useZeroIndexingForArrays: true,
        showCounts: true,
        showTypes: false,
        logJsonValueToolTipPaths: false,
        showOpenedObjectArrayBorders: true,
        showPropertyNameQuotes: true,
        showPropertyNameAndIndexColors: true,
        addArrayIndexPadding: false,
        maximumStringLength: 0,
        valueToolTips: allowValueToolTips ? {
            "value1": "This is a boolean tooltip for Value 1",
            "value5\\1": "This is a string tooltip for Value 1 > Array Index 1",
            "value6\\objectValue3": "This is a number tooltip for objectValue3",
            "parsing\\booleans\\value1": "This is a boolean tooltip for Value 1 on Page 2",
            "..\\..\\arrayValue1": "This is a boolean tooltip shown for every array index",
        } : null,
        title: {
            showCopyButton: true,
            showTreeControls: true,
            enableFullScreenToggling: true,
            showFullScreenButton: true,
        },
        sideMenu: {
            enabled: true,
            showImportButton: true,
        },
        allowEditing: {
            bulk: true,
        },
        autoCloseAt: {
            objectSize: 0,
            arraySize: 0,
            mapSize: 0,
            setSize: 0,
        },
        ignore: {
            emptyObjects: false
        },
        paging: {
            enabled: true,
            columnsPerPage: 1,
            copyOnlyCurrentPage: false,
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

    return [
        {
            value1: true,
            value2: "This is a string for page 1",
            value3: new Date(),
            value4: 5,
            value7: null,
            value8: function( message ) {
                console.log( message );
            },
            value9: 3.1415926535,
            value10: 9007199254740991n,
            value11: Symbol( "id" ),
            value12: {},
            value13: undefined,
            value14: ( message ) => {
                console.log( message );
            },
            value15: "rgb(144, 238, 144)",
            value16: crypto.randomUUID(),
            value17: new RegExp( "ab+c" ),
            value18: map,
            value19: set,
            value20: "https://www.william-troup.com",
            value21: "william@troup.uk",
            value22: image,
            value23: testFunctionName,
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
                },
            }
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
    }

    console.log( `Type: ${type}, Value: ${JSON.stringify( value, onValueClickJsonReplacer )}` );
}

function onValueClickJsonReplacer( _, value ) {
    if ( typeof value === "bigint" ) {
        value = value.toString();
    }

    return value;
}