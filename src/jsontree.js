/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.js
 * @version     v0.3.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_Math = null,
        _parameter_JSON = null,

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
        _attribute_Name_Options = "data-jsontree-options";

    
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
                        console.error( "The attribute '" + _attribute_Name_Options + "' is not a valid object." );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( "The attribute '" + _attribute_Name_Options + "' has not been set correctly." );
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
        fireCustomTrigger( bindingOptions.onBeforeRender, bindingOptions.element );

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
        fireCustomTrigger( bindingOptions.onRenderComplete, bindingOptions.currentView.element );
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
        if ( bindingOptions.showTitle || bindingOptions.showTitleTreeControls ) {
            var titleBar = createElement( bindingOptions.currentView.element, "div", "title-bar" );
        
            if ( bindingOptions.showTitle ) {
                createElementWithHTML( titleBar, "div", "title", bindingOptions.titleText );
            }

            if ( bindingOptions.showTitleTreeControls ) {
                var controls = createElement( titleBar, "div", "controls" ),
                    openAll = createElementWithHTML( controls, "button", "openAll", _configuration.openAllButtonText ),
                    closeAll = createElementWithHTML( controls, "button", "closeAll", _configuration.closeAllButtonText );

                openAll.onclick = function() {
                    bindingOptions.showAllAsClosed = false;

                    renderControlContainer( bindingOptions );
                };

                closeAll.onclick = function() {
                    bindingOptions.showAllAsClosed = true;

                    renderControlContainer( bindingOptions );
                };
            }
        }
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

        createElementWithHTML( objectTypeTitle, "span", "object", _configuration.objectText );

        if ( bindingOptions.showCounts && propertyCount > 0 ) {
            createElementWithHTML( objectTypeTitle, "span", "object count", "{" + propertyCount + "}" );
        }
    }

    function renderArray( container, bindingOptions, data ) {
        var objectTypeTitle = createElement( container, "div", "object-type-title" ),
            objectTypeContents = createElement( container, "div", "object-type-contents" ),
            arrow = bindingOptions.showArrowToggles ? createElement( objectTypeTitle, "div", "down-arrow" ) : null;

        createElementWithHTML( objectTypeTitle, "span", "array", _configuration.arrayText );

        renderArrayValues( arrow, objectTypeContents, bindingOptions, data );

        if ( bindingOptions.showCounts ) {
            createElementWithHTML( objectTypeTitle, "span", "array count", "[" + data.length + "]" );
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

        for ( var dataIndex = 0; dataIndex < dataLength; dataIndex++ ) {
            var name = bindingOptions.useZeroIndexingForArrays ? dataIndex.toString() : ( dataIndex + 1 ).toString();

            renderValue( objectTypeContents, bindingOptions, name, data[ dataIndex ], dataIndex === dataLength - 1 );
        }

        addArrowEvent( bindingOptions, arrow, objectTypeContents );
    }

    function renderValue( container, bindingOptions, name, value, isLastItem ) {
        var objectTypeValue = createElement( container, "div", "object-type-value" ),
            arrow = bindingOptions.showArrowToggles ? createElement( objectTypeValue, "div", "no-arrow" ) : null,
            valueElement = null;

        createElementWithHTML( objectTypeValue, "span", "title", name );
        createElementWithHTML( objectTypeValue, "span", "split", ":" );

        if ( !isDefined( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "null", "null" );

            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedFunction( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "function", getFunctionName( value ) );
            
            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedBoolean( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "boolean", value );
            
            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedDecimal( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "decimal", value );
            
            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedNumber( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "number", value );
            
            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedString( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "string", bindingOptions.showStringQuotes ? "\"" + value + "\"" : value );
            
            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedDate( value ) ) {
            valueElement = createElementWithHTML( objectTypeValue, "span", "date", getCustomFormattedDateTimeText( value, bindingOptions.dateTimeFormat ) );

            createComma( bindingOptions, objectTypeValue, isLastItem );

        } else if ( isDefinedObject( value ) && !isDefinedArray( value ) ) {
            var objectTitle = createElement( objectTypeValue, "span", "object" ),
                objectTypeContents = createElement( objectTypeValue, "div", "object-type-contents" ),
                propertyCount = renderObjectValues( arrow, objectTypeContents, bindingOptions, value );

            createElementWithHTML( objectTitle, "span", "title", _configuration.objectText );

            if ( bindingOptions.showCounts && propertyCount > 0 ) {
                createElementWithHTML( objectTitle, "span", "count", "{" + propertyCount + "}" );
            }

            createComma( bindingOptions, objectTitle, isLastItem );

        } else if ( isDefinedArray( value ) ) {
            var arrayTitle = createElement( objectTypeValue, "span", "array" ),
                arrayTypeContents = createElement( objectTypeValue, "div", "object-type-contents" );

            createElementWithHTML( arrayTitle, "span", "title", _configuration.arrayText );

            if ( bindingOptions.showCounts ) {
                createElementWithHTML( arrayTitle, "span", "count", "[" + value.length + "]" );
            }

            createComma( bindingOptions, arrayTitle, isLastItem );
            renderArrayValues( arrow, arrayTypeContents, bindingOptions, value );

        } else {
            valueElement = createElementWithHTML( objectTypeValue, "span", "unknown", value.toString() );

            createComma( bindingOptions, objectTypeValue, isLastItem );
        }

        if ( isDefined( valueElement ) ) {
            addValueClickEvent( bindingOptions, valueElement, value );
        }
    }

    function addValueClickEvent( bindingOptions, valueElement, value ) {
        if ( isDefinedFunction( bindingOptions.onValueClick ) ) {
            valueElement.onclick = function() {
                fireCustomTrigger( bindingOptions.onValueClick, value );
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


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;
        options.data = getDefaultObject( options.data, null );
        options.showCounts = getDefaultBoolean( options.showCounts, true );
        options.useZeroIndexingForArrays = getDefaultBoolean( options.useZeroIndexingForArrays, true );
        options.dateTimeFormat = getDefaultString( options.dateTimeFormat, "{yyyy}-{mm}-{dd}T{hh}:{MM}:{ss}Z" );
        options.showArrowToggles = getDefaultBoolean( options.showArrowToggles, true );
        options.showStringQuotes = getDefaultBoolean( options.showStringQuotes, true );
        options.showTitle = getDefaultBoolean( options.showTitle, true );
        options.showTitleTreeControls = getDefaultBoolean( options.showTitleTreeControls, true );
        options.showAllAsClosed = getDefaultBoolean( options.showAllAsClosed, false );
        options.sortPropertyNames = getDefaultBoolean( options.sortPropertyNames, true );
        options.sortPropertyNamesInAlphabeticalOrder = getDefaultBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
        options.showCommas = getDefaultBoolean( options.showCommas, false );

        options = buildAttributeOptionStrings( options );
        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionStrings( options ) {
        options.titleText = getDefaultString( options.titleText, "JsonTree.js" );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onBeforeRender = getDefaultFunction( options.onBeforeRender, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );
        options.onValueClick = getDefaultFunction( options.onValueClick, null );
        options.onRefresh = getDefaultFunction( options.onRefresh, null );

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
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
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
                    console.error( "Errors in object: " + e1.message + ", " + e2.message );
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

    function padNumber( number ) {
        var numberString = number.toString();

        return numberString.length === 1 ? "0" + numberString : numberString;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Date/Time
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getCustomFormattedDateTimeText( date, dateFormat ) {
        var result = dateFormat;

        result = result.replace( "{hh}", padNumber( date.getHours() ) );
        result = result.replace( "{h}", date.getHours() );

        result = result.replace( "{MM}", padNumber( date.getMinutes() ) );
        result = result.replace( "{M}", date.getMinutes() );

        result = result.replace( "{ss}", padNumber( date.getSeconds() ) );
        result = result.replace( "{s}", date.getSeconds() );

        result = result.replace( "{dd}", padNumber( date.getDate() ) );
        result = result.replace( "{d}", date.getDate() );

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
    this.refresh = function( elementId ) {
        if ( isDefinedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
            var bindingOptions = _elements_Data[ elementId ].options;

            renderControlContainer( bindingOptions );
            fireCustomTrigger( bindingOptions.onRefresh, bindingOptions.currentView.element );
        }

        return this;
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
    this.refreshAll = function() {
        for ( var elementId in _elements_Data ) {
            if ( _elements_Data.hasOwnProperty( elementId ) ) {
                var bindingOptions = _elements_Data[ elementId ].options;

                renderControlContainer( bindingOptions );
                fireCustomTrigger( bindingOptions.onRefresh, bindingOptions.currentView.element );
            }
        }

        return this;
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
    this.render = function( element, options ) {
        if ( isDefinedObject( element ) && isDefinedObject( options ) ) {
            renderControl( renderBindingOptions( options, element ) );
        }

        return this;
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
    this.renderAll = function() {
        render();

        return this;
    };


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
    this.setConfiguration = function( newConfiguration ) {
        for ( var propertyName in newConfiguration ) {
            if ( newConfiguration.hasOwnProperty( propertyName ) ) {
                _configuration[ propertyName ] = newConfiguration[ propertyName ];
            }
        }

        buildDefaultConfiguration( _configuration );

        return this;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.objectText = getDefaultString( _configuration.objectText, "object" );
        _configuration.arrayText = getDefaultString( _configuration.arrayText, "array" );
        _configuration.closeAllButtonText = getDefaultString( _configuration.closeAllButtonText, "Close All" );
        _configuration.openAllButtonText = getDefaultString( _configuration.openAllButtonText, "Open All" );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of JsonTree.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    this.getVersion = function() {
        return "0.3.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_Math = mathObject;
        _parameter_JSON = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$jsontree ) ) {
            _parameter_Window.$jsontree = this;
        }

    } ) ( document, window, Math, JSON );
} )();