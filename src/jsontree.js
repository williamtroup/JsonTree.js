/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library.
 * 
 * @file        jsontree.js
 * @version     v0.1.0
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

        renderControlContainer( bindingOptions );
        fireCustomTrigger( bindingOptions.onRenderComplete, bindingOptions.currentView.element );
    }

    function renderControlContainer( bindingOptions ) {
        bindingOptions.currentView.element.innerHTML = _string.empty;

        if ( isDefinedObject( bindingOptions.data ) && !isDefinedArray( bindingOptions.data ) ) {
            renderObject( bindingOptions.currentView.element, bindingOptions, bindingOptions.data, 1 );
        } else if ( isDefinedArray( bindingOptions.data ) ) {
            renderArray( bindingOptions.currentView.element, bindingOptions, bindingOptions.data, 1 );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Tree
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container, bindingOptions, data, indentCount ) {
        var objectTypeTitle = createElementWithHTML( container, "div", "object-type-title", _configuration.objectText ),
            objectTypeContents = createElement( container, "div", "object-type-contents" ),
            propertyCount = renderObjectValues( objectTypeContents, bindingOptions, data, indentCount );

        if ( bindingOptions.showCounts && propertyCount > 0 ) {
            createElementWithHTML( objectTypeTitle, "span", "count", "{" + propertyCount + "}" );
        }
    }

    function renderArray( container, bindingOptions, data, indentCount ) {
        var objectTypeTitle = createElementWithHTML( container, "div", "object-type-title", _configuration.arrayText ),
            objectTypeContents = createElement( container, "div", "object-type-contents" ),
            propertyCount = 0;

        renderArrayValues( objectTypeContents, bindingOptions, data, indentCount );

        if ( bindingOptions.showCounts ) {
            createElementWithHTML( objectTypeTitle, "span", "count", "[" + data.length + "]" );
        }
    }

    function renderObjectValues( objectTypeContents, bindingOptions, data, indentCount ) {
        var propertyCount = 0;

        objectTypeContents.style.marginLeft = ( indentCount * bindingOptions.indentSpacing ) + "px";

        for ( var key in data ) {
            if ( data.hasOwnProperty( key ) ) {
                renderValue( objectTypeContents, bindingOptions, key, data[ key ], indentCount + 1 );
                propertyCount++;
            }
        }

        return propertyCount;
    }

    function renderArrayValues( objectTypeContents, bindingOptions, data, indentCount ) {
        objectTypeContents.style.marginLeft = ( indentCount * bindingOptions.indentSpacing ) + "px";

        var dataLength = data.length;

        for ( var dataIndex = 0; dataIndex < dataLength; dataIndex++ ) {
            var name = bindingOptions.useZeroIndexingForArrays ? dataIndex.toString() : ( dataIndex + 1 ).toString();

            renderValue( objectTypeContents, bindingOptions, name, data[ dataIndex ], indentCount + 1 );
        }
    }

    function renderValue( container, bindingOptions, name, value, indentCount ) {
        var objectTypeValue = createElementWithHTML( container, "div", "object-type-value", name );
        createElementWithHTML( objectTypeValue, "span", "split", ":" );

        if ( isDefinedBoolean( value ) ) {
            createElementWithHTML( objectTypeValue, "span", "boolean", value );

        } else if ( isDefinedNumber( value ) ) {
            createElementWithHTML( objectTypeValue, "span", "number", value );

        } else if ( isDefinedString( value ) ) {
            createElementWithHTML( objectTypeValue, "span", "string", "\"" + value + "\"" );

        } else if ( isDefinedDate( value ) ) {
            createElementWithHTML( objectTypeValue, "span", "date", getIsoDateTimeString( value ) );
            
        } else if ( isDefinedObject( value ) && !isDefinedArray( value ) ) {
            var objectTitle = createElementWithHTML( objectTypeValue, "span", "object", _configuration.objectText ),
                objectTypeContents = createElement( objectTypeValue, "div", "object-type-contents" ),
                propertyCount = renderObjectValues( objectTypeContents, bindingOptions, value, indentCount );

            if ( bindingOptions.showCounts && propertyCount > 0 ) {
                createElementWithHTML( objectTitle, "span", "count", "{" + propertyCount + "}" );
            }

        } else if ( isDefinedArray( value ) ) {
            var arrayTitle = createElementWithHTML( objectTypeValue, "span", "array", _configuration.arrayText ),
                arrayTypeContents = createElement( objectTypeValue, "div", "object-type-contents" );

            createElementWithHTML( arrayTitle, "span", "count", "[" + value.length + "]" );
            renderArrayValues( arrayTypeContents, bindingOptions, value, indentCount );
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
        options.indentSpacing = getDefaultNumber( options.indentSpacing, 10 );
        options.useZeroIndexingForArrays = getDefaultBoolean( options.useZeroIndexingForArrays, true );

        return buildAttributeOptionCustomTriggers( options );
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onBeforeRender = getDefaultFunction( options.onBeforeRender, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( container, type, className ) {
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

        container.appendChild( result );

        return result;
    }

    function createElementWithHTML( container, type, className, html ) {
        var element = createElement( container, type, className );
        element.innerHTML = html;

        return element;
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

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
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

    function getIsoDateTimeString( date ) {
        var format = [];

        if ( isDefined( date ) ) {
            format.push( date.getFullYear() );
            format.push( "-" );
            format.push( padNumber( date.getMonth() + 1 ) );
            format.push( "-" );
            format.push( padNumber( date.getDate() ) );
            format.push( "T" );
            format.push( padNumber( date.getHours() ) );
            format.push( ":" );
            format.push( padNumber( date.getMinutes() ) );
            format.push( ":00Z" );
        }

        return format.join( _string.empty );
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
        return "0.1.0";
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