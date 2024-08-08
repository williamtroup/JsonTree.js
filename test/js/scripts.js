( () => {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += " v" + $jsontree.getVersion();
        document.getElementById( "header" ).innerText += ` - v${$jsontree.getVersion()}`;
    } );
} )();

function bindingOptions( showValueColors = true ) {
    return {
        data: [
            {
                value1: true,
                value2: "This is a string",
                value3: new Date(),
                value4: 5,
                value7: null,
                value8: function( message ) {
                    alert( message );
                },
                value9: 3.1415926535,
                value10: 9007199254740991n,
                value11: Symbol( "id" ),
                value12: {},
                value13: undefined,
                value14: ( message ) => {
                    alert( message );
                },
                value5: [
                    true,
                    "This is another string",
                    {
                        arrayValue1: true,
                        arrayValue2: 10
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
                value2: "This is a string",
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
            }
        ],
        parse: {
            stringsToDates: true,
            stringsToBooleans: true,
            stringsToNumbers: true,
        },
        events: {
            onValueClick: onValueClickEvent,
        },
        showValueColors: showValueColors,
        showStringHexColors: true,
        showArrayItemsAsSeparateObjects: true,
        copyOnlyCurrentPage: false,
        sortPropertyNames: true,
        showArrayIndexBrackets: true,
        showOpeningClosingCurlyBraces: false,
        showOpeningClosingSquaredBrackets: false,
        showCommas: false,
        showArrowToggles: true
    };
}

function onValueClickEvent( value, type ) {
    if ( value === null ) {
        value = "null";
    } else if ( value === undefined ) {
        value = "undefined";
    }

    console.log( `Type: ${type}, Value: ${value.toString()}` );
}