/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.js
 * @version     v1.1.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    "use strict";

    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_Navigator = null,
        _parameter_Math = null,
        _parameter_JSON = null,

        // Variables: Public Scope
        _public = {},

        // Variables: Configuration
        _configuration = {},

        // Variables: Elements
        _elements_Type = {},
        _elements_Data = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
        },

        // Variables: Attribute Names
        _attribute_Name_Options = "data-jsontree-js";

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() {
        var tagTypes = _configuration.domElementTypes,
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element ) {
        var result = true;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    renderControl( renderBindingOptions( bindingOptions.result, element ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( _configuration.attributeNotValidErrorText.replace( "{{attribute_name}}", _attribute_Name_Options ) );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.attributeNotSetErrorText.replace( "{{attribute_name}}", _attribute_Name_Options ) );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderBindingOptions( data, element ) {
        var bindingOptions = buildAttributeOptions( data );
        bindingOptions.currentView = {};
        bindingOptions.currentView.element = element;

        return bindingOptions;
    }

    function renderControl( bindingOptions ) {
        fireCustomTrigger( bindingOptions.events.onBeforeRender, bindingOptions.element );

        if ( !isDefinedString( bindingOptions.currentView.element.id ) ) {
            bindingOptions.currentView.element.id = newGuid();
        }

        bindingOptions.currentView.element.className = "json-tree-js";
        bindingOptions.currentView.element.removeAttribute( _attribute_Name_Options );

        if ( !_elements_Data.hasOwnProperty( bindingOptions.currentView.element.id ) ) {
            _elements_Data[ bindingOptions.currentView.element.id ] = {};
            _elements_Data[ bindingOptions.currentView.element.id ].options = bindingOptions;
            _elements_Data[ bindingOptions.currentView.element.id ].data = bindingOptions.data;

            delete bindingOptions.data;
        }

        renderControlContainer( bindingOptions );
        fireCustomTrigger( bindingOptions.events.onRenderComplete, bindingOptions.currentView.element );
    }

    function renderControlContainer( bindingOptions ) {
        var data = _elements_Data[ bindingOptions.currentView.element.id ].data;

        bindingOptions.currentView.element.innerHTML = _string.empty;

        renderControlTitleBar( bindingOptions );

        if ( isDefinedObject( data ) && !isDefinedArray( data ) ) {
            renderObject( bindingOptions.currentView.element, bindingOptions, data );
        } else if ( isDefinedArray( data ) ) {
            renderArray( bindingOptions.currentView.element, bindingOptions, data );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions ) {
        if ( bindingOptions.title.show || bindingOptions.title.showTreeControls || bindingOptions.title.showCopyButton ) {
            var titleBar = createElement( bindingOptions.currentView.element, "div", "title-bar" ),
                controls = createElement( titleBar, "div", "controls" );
        
            if ( bindingOptions.title.show ) {
                createElementWithHTML( titleBar, "div", "title", bindingOptions.title.text, controls );
            }

            if ( bindingOptions.title.showCopyButton ) {
                var copy = createElementWithHTML( controls, "button", "copy-all", _configuration.copyAllButtonText );

                copy.onclick = function() {
                    var copyData = _parameter_JSON.stringify( _elements_Data[ bindingOptions.currentView.element.id ].data );

                    _parameter_Navigator.clipboard.writeText( copyData );

                    fireCustomTrigger( bindingOptions.events.onCopyAll, copyData );
                };
            }

            if ( bindingOptions.title.showTreeControls ) {
                var openAll = createElementWithHTML( controls, "button", "openAll", _configuration.openAllButtonText ),
                    closeAll = createElementWithHTML( controls, "button", "closeAll", _configuration.closeAllButtonText );

                openAll.onclick = function() {
                    openAllNodes( bindingOptions );
                };

                closeAll.onclick = function() {
                    closeAllNodes( bindingOptions );
                };
            }
        }
    }

    function openAllNodes( bindingOptions ) {
        bindingOptions.showAllAsClosed = false;

        renderControlContainer( bindingOptions );
        fireCustomTrigger( bindingOptions.events.onOpenAll, bindingOptions.currentView.element );
    }

    function closeAllNodes( bindingOptions ) {
        bindingOptions.showAllAsClosed = true;

        renderControlContainer( bindingOptions );
        fireCustomTrigger( bindingOptions.events.onCloseAll, bindingOptions.currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Tree
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container, bindingOptions, data ) {
        var objectTypeTitle = createElement( container, "div", "object-type-title" ),
            objectTypeContents = createElement( container, "div", "object-type-contents" ),
            arrow = bindingOptions.showArrowToggles ? createElement( objectTypeTitle, "div", "down-arrow" ) : null,
            propertyCount = renderObjectValues( arrow, objectTypeContents, bindingOptions, data );

        createElementWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object" : _string.empty, _configuration.objectText );

        if ( bindingOptions.showCounts && propertyCount > 0 ) {
            createElementWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", "{" + propertyCount + "}" );
        }
    }

    function renderArray( container, bindingOptions, data ) {
        var objectTypeTitle = createElement( container, "div", "object-type-title" ),
            objectTypeContents = createElement( container, "div", "object-type-contents" ),
            arrow = bindingOptions.showArrowToggles ? createElement( objectTypeTitle, "div", "down-arrow" ) : null;

        createElementWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array" : _string.empty, _configuration.arrayText );

        renderArrayValues( arrow, objectTypeContents, bindingOptions, data );

        if ( bindingOptions.showCounts ) {
            createElementWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", "[" + data.length + "]" );
        }
    }

    function renderObjectValues( arrow, objectTypeContents, bindingOptions, data ) {
        var propertyCount = 0,
            properties = [];

        for ( var key in data ) {
            if ( data.hasOwnProperty( key ) ) {
                properties.push( key );
            }
        }

        if ( bindingOptions.sortPropertyNames ) {
            properties = properties.sort();

            if ( !bindingOptions.sortPropertyNamesInAlphabeticalOrder ) {
                properties = properties.reverse();
            }
        }

        var propertiesLength = properties.length;

        for ( var propertyIndex = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
            var propertyName = properties[ propertyIndex ];

            if ( data.hasOwnProperty( propertyName ) ) {
                renderValue( objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1 );
                propertyCount++;
            }
        }

        addArrowEvent( bindingOptions, arrow, objectTypeContents );

        return propertyCount;
    }

    function renderArrayValues( arrow, objectTypeContents, bindingOptions, data ) {
        var dataLength = data.length;

        if ( !bindingOptions.reverseArrayValues ) {
            for ( var dataIndex1 = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                renderValue( objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex1, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1 );
            }

        } else {
            for ( var dataIndex2 = dataLength; dataIndex2--; ) {
                renderValue( objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex2, dataLength ), data[ dataIndex2 ], dataIndex2 === 0 );
            }
        }

        addArrowEvent( bindingOptions, arrow, objectTypeContents );
    }

    function renderValue( container, bindingOptions, name, value, isLastItem ) {
        var objectTypeValue = createElement( container, "div", "object-type-value" ),
            arrow = bindingOptions.showArrowToggles ? createElement( objectTypeValue, "div", "no-arrow" ) : null,
            valueClass = null,
            valueElement = null,
            ignored = false,
            type = null,
            addClickEvent = true;

        createElementWithHTML( objectTypeValue, "span", "title", name );
        createElementWithHTML( objectTypeValue, "span", "split", ":" );

        if ( !isDefined( value ) ) {
            if ( !bindingOptions.ignore.nullValues ) {
                valueClass = bindingOptions.showValueColors ? "null" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, "null" );
                addClickEvent = false;

                if ( isDefinedFunction( bindingOptions.events.onNullRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onNullRender, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedFunction( value ) ) {
            if ( !bindingOptions.ignore.functionValues ) {
                valueClass = bindingOptions.showValueColors ? "function" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, getFunctionName( value ) );
                type = "function";

                if ( isDefinedFunction( bindingOptions.events.onFunctionRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onFunctionRender, valueElement );
                }
            
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedBoolean( value ) ) {
            if ( !bindingOptions.ignore.booleanValues ) {
                valueClass = bindingOptions.showValueColors ? "boolean" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, value );
                type = "boolean";

                if ( isDefinedFunction( bindingOptions.events.onBooleanRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onBooleanRender, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedDecimal( value ) ) {
            if ( !bindingOptions.ignore.decimalValues ) {
                var newValue = getFixedValue( value, bindingOptions.maximumDecimalPlaces );

                valueClass = bindingOptions.showValueColors ? "decimal" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, newValue );
                type = "decimal";

                if ( isDefinedFunction( bindingOptions.events.onDecimalRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onDecimalRender, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedNumber( value ) ) {
            if ( !bindingOptions.ignore.numberValues ) {
                valueClass = bindingOptions.showValueColors ? "number" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, value );
                type = "number";

                if ( isDefinedFunction( bindingOptions.events.onNumberRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onNumberRender, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedString( value ) ) {
            if ( !bindingOptions.ignore.stringValues ) {
                var color = null;

                if ( bindingOptions.showStringHexColors && isHexColor( value ) ) {
                    color = value;

                } else {
                    if ( bindingOptions.maximumStringLength > 0 && value.length > bindingOptions.maximumStringLength ) {
                        value = value.substring( 0, bindingOptions.maximumStringLength ) + _configuration.ellipsisText;
                    }
                }

                var newStringValue = bindingOptions.showStringQuotes ? "\"" + value + "\"" : value;
    
                valueClass = bindingOptions.showValueColors ? "string" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, newStringValue );
                type = "string";

                if ( isDefinedString( color ) ) {
                    valueElement.style.color = color;
                }
    
                if ( isDefinedFunction( bindingOptions.events.onStringRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onStringRender, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedDate( value ) ) {
            if ( !bindingOptions.ignore.dateValues ) {
                valueClass = bindingOptions.showValueColors ? "date" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, getCustomFormattedDateTimeText( value, bindingOptions.dateTimeFormat ) );
                type = "date";

                if ( isDefinedFunction( bindingOptions.events.onDateRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onDateRender, valueElement );
                }
    
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( isDefinedObject( value ) && !isDefinedArray( value ) ) {
            if ( !bindingOptions.ignore.objectValues ) {
                var objectTitle = createElement( objectTypeValue, "span", bindingOptions.showValueColors ? "object" : _string.empty ),
                    objectTypeContents = createElement( objectTypeValue, "div", "object-type-contents" ),
                    propertyCount = renderObjectValues( arrow, objectTypeContents, bindingOptions, value );

                createElementWithHTML( objectTitle, "span", "title", _configuration.objectText );

                if ( bindingOptions.showCounts && propertyCount > 0 ) {
                    createElementWithHTML( objectTitle, "span", "count", "{" + propertyCount + "}" );
                }

                createComma( bindingOptions, objectTitle, isLastItem );

                type = "object";

            } else {
                ignored = true;
            }


        } else if ( isDefinedArray( value ) ) {
            if ( !bindingOptions.ignore.arrayValues ) {
                var arrayTitle = createElement( objectTypeValue, "span", bindingOptions.showValueColors ? "array" : _string.empty ),
                    arrayTypeContents = createElement( objectTypeValue, "div", "object-type-contents" );

                createElementWithHTML( arrayTitle, "span", "title", _configuration.arrayText );

                if ( bindingOptions.showCounts ) {
                    createElementWithHTML( arrayTitle, "span", "count", "[" + value.length + "]" );
                }

                createComma( bindingOptions, arrayTitle, isLastItem );
                renderArrayValues( arrow, arrayTypeContents, bindingOptions, value );

                type = "array";
                
            } else {
                ignored = true;
            }

        } else {
            if ( !bindingOptions.ignore.unknownValues ) {
                valueClass = bindingOptions.showValueColors ? "unknown" : _string.empty;
                valueElement = createElementWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                type = "unknown";

                if ( isDefinedFunction( bindingOptions.events.onUnknownRender ) ) {
                    fireCustomTrigger( bindingOptions.events.onUnknownRender, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }
        }

        if ( ignored ) {
            container.removeChild( objectTypeValue );
            
        } else {
            if ( isDefined( valueElement ) ) {
                addValueClickEvent( bindingOptions, valueElement, value, type, addClickEvent );
            }
        }
    }

    function addValueClickEvent( bindingOptions, valueElement, value, type, addClickEvent ) {
        if ( addClickEvent && isDefinedFunction( bindingOptions.events.onValueClick ) ) {
            valueElement.onclick = function() {
                fireCustomTrigger( bindingOptions.events.onValueClick, value, type );
            };

        } else {
            addClass( valueElement, "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions, arrow, objectTypeContents ) {
        if ( isDefined( arrow ) ) {
            arrow.onclick = function() {
                if ( arrow.className === "down-arrow" ) {
                    objectTypeContents.style.display = "none";
                    arrow.className = "right-arrow";
                } else {
                    objectTypeContents.style.display = "block";
                    arrow.className = "down-arrow";
                }
            };

            if ( bindingOptions.showAllAsClosed ) {
                objectTypeContents.style.display = "none";
                arrow.className = "right-arrow";
            } else {
                arrow.className = "down-arrow";
            }
        }
    }

    function getFunctionName( value ) {
        var result,
            valueParts = value.toString().split( "(" ),
            valueNameParts = valueParts[ 0 ].split( _string.space );

        if ( valueNameParts.length === 2 ) {
            result = valueNameParts[ 1 ];
        } else {
            result = valueNameParts[ 0 ];
        }

        result += "()";

        return result;
    }

    function createComma( bindingOptions, objectTypeValue, isLastItem ) {
        if ( bindingOptions.showCommas && !isLastItem ) {
            createElementWithHTML( objectTypeValue, "span", "comma", "," );
        }
    }

    function getIndexName( bindingOptions, index, largestValue ) {
        var result = bindingOptions.useZeroIndexingForArrays ? index.toString() : ( index + 1 ).toString();

        if ( !bindingOptions.addArrayIndexPadding ) {
            result = padNumber( result, largestValue.toString().length );
        }

        return result;
    }

    function getFixedValue( number, length ) {
        var regExp = new RegExp( "^-?\\d+(?:\.\\d{0," + ( length || -1 ) + "})?" );

        return number.toString().match( regExp )[ 0 ];
    }

    function isHexColor( value ) {
        var valid = value.length >= 2 && value.length <= 7;

        if ( valid && value[ 0 ] === "#" ) {
            valid = isNaN( value.substring( 1, value.length - 1 ) );
        }

        return valid;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = getDefaultObject( newOptions, {} );
        options.data = getDefaultObject( options.data, null );
        options.showCounts = getDefaultBoolean( options.showCounts, true );
        options.useZeroIndexingForArrays = getDefaultBoolean( options.useZeroIndexingForArrays, true );
        options.dateTimeFormat = getDefaultString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
        options.showArrowToggles = getDefaultBoolean( options.showArrowToggles, true );
        options.showStringQuotes = getDefaultBoolean( options.showStringQuotes, true );
        options.showAllAsClosed = getDefaultBoolean( options.showAllAsClosed, false );
        options.sortPropertyNames = getDefaultBoolean( options.sortPropertyNames, true );
        options.sortPropertyNamesInAlphabeticalOrder = getDefaultBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
        options.showCommas = getDefaultBoolean( options.showCommas, false );
        options.reverseArrayValues = getDefaultBoolean( options.reverseArrayValues, false );
        options.addArrayIndexPadding = getDefaultBoolean( options.addArrayIndexPadding, false );
        options.showValueColors = getDefaultBoolean( options.showValueColors, true );
        options.maximumDecimalPlaces = getDefaultNumber( options.maximumDecimalPlaces, 2 );
        options.maximumStringLength = getDefaultNumber( options.maximumStringLength, 0 );
        options.showStringHexColors = getDefaultBoolean( options.showStringHexColors, false );

        options = buildAttributeOptionTitle( options );
        options = buildAttributeOptionIgnore( options );
        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionTitle( options ) {
        options.title = getDefaultObject( options.title, {} );
        options.title.text = getDefaultString( options.title.text, "JsonTree.js" );
        options.title.show = getDefaultBoolean( options.title.show, true );
        options.title.showTreeControls = getDefaultBoolean( options.title.showTreeControls, true );
        options.title.showCopyButton = getDefaultBoolean( options.title.showCopyButton, false );

        return options;
    }

    function buildAttributeOptionIgnore( options ) {
        options.ignore = getDefaultObject( options.ignore, {} );
        options.ignore.nullValues = getDefaultBoolean( options.ignore.nullValues, false );
        options.ignore.functionValues = getDefaultBoolean( options.ignore.functionValues, false );
        options.ignore.unknownValues = getDefaultBoolean( options.ignore.unknownValues, false );
        options.ignore.booleanValues = getDefaultBoolean( options.ignore.booleanValues, false );
        options.ignore.decimalValues = getDefaultBoolean( options.ignore.decimalValues, false );
        options.ignore.numberValues = getDefaultBoolean( options.ignore.numberValues, false );
        options.ignore.stringValues = getDefaultBoolean( options.ignore.stringValues, false );
        options.ignore.dateValues = getDefaultBoolean( options.ignore.dateValues, false );
        options.ignore.objectValues = getDefaultBoolean( options.ignore.objectValues, false );
        options.ignore.arrayValues = getDefaultBoolean( options.ignore.arrayValues, false );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.events = getDefaultObject( options.events, {} );
        options.events.onBeforeRender = getDefaultFunction( options.events.onBeforeRender, null );
        options.events.onRenderComplete = getDefaultFunction( options.events.onRenderComplete, null );
        options.events.onValueClick = getDefaultFunction( options.events.onValueClick, null );
        options.events.onRefresh = getDefaultFunction( options.events.onRefresh, null );
        options.events.onCopyAll = getDefaultFunction( options.events.onCopyAll, null );
        options.events.onOpenAll = getDefaultFunction( options.events.onOpenAll, null );
        options.events.onCloseAll = getDefaultFunction( options.events.onCloseAll, null );
        options.events.onDestroy = getDefaultFunction( options.events.onDestroy, null );
        options.events.onBooleanRender = getDefaultFunction( options.events.onBooleanRender, null );
        options.events.onDecimalRender = getDefaultFunction( options.events.onDecimalRender, null );
        options.events.onNumberRender = getDefaultFunction( options.events.onNumberRender, null );
        options.events.onStringRender = getDefaultFunction( options.events.onStringRender, null );
        options.events.onDateRender = getDefaultFunction( options.events.onDateRender, null );
        options.events.onFunctionRender = getDefaultFunction( options.events.onFunctionRender, null );
        options.events.onNullRender = getDefaultFunction( options.events.onNullRender, null );
        options.events.onUnknownRender = getDefaultFunction( options.events.onUnknownRender, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( container, type, className, beforeNode ) {
        var result = null,
            nodeType = type.toLowerCase(),
            isText = nodeType === "text";

        if ( !_elements_Type.hasOwnProperty( nodeType ) ) {
            _elements_Type[ nodeType ] = isText ? _parameter_Document.createTextNode( _string.empty ) : _parameter_Document.createElement( nodeType );
        }

        result = _elements_Type[ nodeType ].cloneNode( false );

        if ( isDefined( className ) ) {
            result.className = className;
        }

        if ( isDefined( beforeNode ) ) {
            container.insertBefore( result, beforeNode );
        } else {
            container.appendChild( result );
        }

        return result;
    }

    function createElementWithHTML( container, type, className, html, beforeNode ) {
        var element = createElement( container, type, className, beforeNode );
        element.innerHTML = html;

        return element;
    }

    function addClass( element, className ) {
        element.className += _string.space + className;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }

    function isDefinedDate( object ) {
        return isDefinedObject( object ) && object instanceof Date;
    }

    function isDefinedDecimal( object ) {
        return isDefined( object ) && typeof object === "number" && object % 1 !== 0;
    }

    function isInvalidOptionArray( array, minimumLength ) {
        minimumLength = isDefinedNumber( minimumLength ) ? minimumLength : 1;

        return !isDefinedArray( array ) || array.length < minimumLength;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultAnyString( value, defaultValue ) {
        return typeof value === "string" ? value : defaultValue;
    }

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultObject( value, defaultValue ) {
        return isDefinedObject( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = _parameter_JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.objectErrorText.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    parsed = false;
                }
                
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( "-" );
            }

            var character = _parameter_Math.floor( _parameter_Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }

    function padNumber( number, length ) {
        length = isDefined( length ) ? length : 1;

        var numberString = number.toString(),
            numberResult = numberString;

        if ( numberString.length < length ) {
            var arrayLength = ( length - numberString.length ) + 1;

            numberResult = Array( arrayLength ).join( "0" ) + numberString;
        }

        return numberResult;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Date/Time
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getWeekdayNumber( date ) {
        return date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
    }

    function getDayOrdinal( value ) {
        var result = _configuration.thText;

        if ( value === 31 || value === 21 || value === 1 ) {
            result = _configuration.stText;
        } else if ( value === 22 || value === 2 ) {
            result = _configuration.ndText;
        } else if ( value === 23 || value === 3 ) {
            result = _configuration.rdText;
        }

        return result;
    }

    function getCustomFormattedDateTimeText( date, dateFormat ) {
        var result = dateFormat,
            weekDayNumber = getWeekdayNumber( date );

        result = result.replace( "{hh}", padNumber( date.getHours(), 2 ) );
        result = result.replace( "{h}", date.getHours() );

        result = result.replace( "{MM}", padNumber( date.getMinutes(), 2 ) );
        result = result.replace( "{M}", date.getMinutes() );

        result = result.replace( "{ss}", padNumber( date.getSeconds(), 2 ) );
        result = result.replace( "{s}", date.getSeconds() );

        result = result.replace( "{dddd}", _configuration.dayNames[ weekDayNumber ] );
        result = result.replace( "{ddd}", _configuration.dayNamesAbbreviated[ weekDayNumber ] );
        result = result.replace( "{dd}", padNumber( date.getDate() ) );
        result = result.replace( "{d}", date.getDate() );

        result = result.replace( "{o}", getDayOrdinal( date.getDate() ) );

        result = result.replace( "{mmmm}", _configuration.monthNames[ date.getMonth() ] );
        result = result.replace( "{mmm}", _configuration.monthNamesAbbreviated[ date.getMonth() ] );
        result = result.replace( "{mm}", padNumber( date.getMonth() + 1 ) );
        result = result.replace( "{m}", date.getMonth() + 1 );

        result = result.replace( "{yyyy}", date.getFullYear() );
        result = result.replace( "{yyy}", date.getFullYear().toString().substring( 1 ) );
        result = result.replace( "{yy}", date.getFullYear().toString().substring( 2 ) );
        result = result.replace( "{y}", parseInt( date.getFullYear().toString().substring( 2 ) ).toString() );

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Manage Instances
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * refresh().
     * 
     * Refreshes a JsonTree.js instance.
     * 
     * @public
     * @fires       onRefresh
     * 
     * @param       {string}    elementId                                   The JsonTree.js element ID that should be refreshed.
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.refresh = function( elementId ) {
        if ( isDefinedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
            var bindingOptions = _elements_Data[ elementId ].options;

            renderControlContainer( bindingOptions );
            fireCustomTrigger( bindingOptions.events.onRefresh, bindingOptions.currentView.element );
        }

        return _public;
    };

    /**
     * refreshAll().
     * 
     * Refreshes all of the rendered JsonTree.js instances.
     * 
     * @public
     * @fires       onRefresh
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.refreshAll = function() {
        for ( var elementId in _elements_Data ) {
            if ( _elements_Data.hasOwnProperty( elementId ) ) {
                var bindingOptions = _elements_Data[ elementId ].options;

                renderControlContainer( bindingOptions );
                fireCustomTrigger( bindingOptions.events.onRefresh, bindingOptions.currentView.element );
            }
        }

        return _public;
    };

    /**
     * render().
     * 
     * Renders an element using the options specified.
     * 
     * @public
     * 
     * @param       {Object}    element                                     The element to render.
     * @param       {Object}    options                                     The options to use (refer to "Binding Options" documentation for properties).
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.render = function( element, options ) {
        if ( isDefinedObject( element ) && isDefinedObject( options ) ) {
            renderControl( renderBindingOptions( options, element ) );
        }

        return _public;
    };

    /**
     * renderAll().
     * 
     * Finds all new elements and renders them.
     * 
     * @public
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.renderAll = function() {
        render();

        return _public;
    };

    /**
     * openAll().
     * 
     * Opens all the nodes in a JsonTree.js instance.
     * 
     * @public
     * @fires       onOpenAll
     * 
     * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.openAll = function( elementId ) {
        if ( isDefinedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
            openAllNodes( _elements_Data[ elementId ].options );
        }

        return _public;
    };

    /**
     * closeAll().
     * 
     * Closes all the nodes in a JsonTree.js instance.
     * 
     * @public
     * @fires       onCloseAll
     * 
     * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.closeAll = function( elementId ) {
        if ( isDefinedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
            closeAllNodes( _elements_Data[ elementId ].options );
        }

        return _public;
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Destroying
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * destroyAll().
     * 
     * Reverts all rendered elements to their original state (without render attributes).
     * 
     * @public
     * @fires       onDestroy
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.destroyAll = function() {
        for ( var elementId in _elements_Data ) {
            if ( _elements_Data.hasOwnProperty( elementId ) ) {
                destroyElement( _elements_Data[ elementId ].options );
            }
        }

        _elements_Data = {};

        return _public;
    };

    /**
     * destroy().
     * 
     * Reverts an element to its original state (without render attributes).
     * 
     * @public
     * @fires       onDestroy
     * 
     * @param       {string}    elementId                                   The JsonTree.js element ID to destroy.
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.destroy = function( elementId ) {
        if ( isDefinedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
            destroyElement( _elements_Data[ elementId ].options );

            delete _elements_Data[ elementId ];
        }

        return _public;
    };

    function destroyElement( bindingOptions ) {
        bindingOptions.currentView.element.innerHTML = _string.empty;
        bindingOptions.currentView.element.className = _string.empty;

        fireCustomTrigger( bindingOptions.events.onDestroy, bindingOptions.currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
     * 
     * @returns     {Object}                                                The JsonTree.js class instance.
     */
    _public.setConfiguration = function( newConfiguration ) {
        for ( var propertyName in newConfiguration ) {
            if ( newConfiguration.hasOwnProperty( propertyName ) ) {
                _configuration[ propertyName ] = newConfiguration[ propertyName ];
            }
        }

        buildDefaultConfiguration( _configuration );

        return _public;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.objectText = getDefaultAnyString( _configuration.objectText, "object" );
        _configuration.arrayText = getDefaultAnyString( _configuration.arrayText, "array" );
        _configuration.closeAllButtonText = getDefaultAnyString( _configuration.closeAllButtonText, "Close All" );
        _configuration.openAllButtonText = getDefaultAnyString( _configuration.openAllButtonText, "Open All" );
        _configuration.copyAllButtonText = getDefaultAnyString( _configuration.copyAllButtonText, "Copy All" );
        _configuration.objectErrorText = getDefaultAnyString( _configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
        _configuration.attributeNotValidErrorText = getDefaultAnyString( _configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
        _configuration.attributeNotSetErrorText = getDefaultAnyString( _configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
        _configuration.stText = getDefaultAnyString( _configuration.stText, "st" );
        _configuration.ndText = getDefaultAnyString( _configuration.ndText, "nd" );
        _configuration.rdText = getDefaultAnyString( _configuration.rdText, "rd" );
        _configuration.thText = getDefaultAnyString( _configuration.thText, "th" );
        _configuration.ellipsisText = getDefaultAnyString( _configuration.ellipsisText, "..." );

        if ( isInvalidOptionArray( _configuration.dayNames, 7 ) ) {
            _configuration.dayNames = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ];
        }

        if ( isInvalidOptionArray( _configuration.dayNamesAbbreviated, 7 ) ) {
            _configuration.dayNamesAbbreviated = [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ];
        }

        if ( isInvalidOptionArray( _configuration.monthNames, 12 ) ) {
            _configuration.monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
        }

        if ( isInvalidOptionArray( _configuration.monthNamesAbbreviated, 12 ) ) {
            _configuration.monthNamesAbbreviated = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getIds().
     * 
     * Returns an array of element IDs that have been rendered.
     * 
     * @public
     * 
     * @returns     {string[]}                                              The element IDs that have been rendered.
     */
    _public.getIds = function() {
        var result = [];
        
        for ( var elementId in _elements_Data ) {
            if ( _elements_Data.hasOwnProperty( elementId ) ) {
                result.push( elementId );
            }
        }

        return result;
    };

    /**
     * getVersion().
     * 
     * Returns the version of JsonTree.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    _public.getVersion = function() {
        return "1.1.1";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, navigatorObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_Navigator = navigatorObject;
        _parameter_Math = mathObject;
        _parameter_JSON = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$jsontree ) ) {
            _parameter_Window.$jsontree = _public;
        }

    } ) ( document, window, navigator, Math, JSON );
} )();