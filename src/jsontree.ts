/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptions,
    type Events,
    type Ignore,
    type Title,
    type Configuration, 
    type CurrentView } from "./ts/type";

import { PublicApi } from "./ts/api";
import { Data } from "./ts/data";
import { Is } from "./ts/is";
import { DomElement } from "./ts/dom";
import { Char } from "./ts/enum";
import { DateTime } from "./ts/datetime";
import { Constants } from "./ts/constant";


type StringToJson = {
    parsed: boolean;
    object: any;
};

type JsonTreeData = {
    options: BindingOptions;
    data: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Data
    let _elements_Data: Record<string, JsonTreeData> = {};


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() : void {
        const tagTypes: string[] = _configuration.domElementTypes as string[];
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element: HTMLElement ) : boolean {
        let result: boolean = true;

        if ( Is.defined( element ) && element.hasAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME ) ) {
            const bindingOptionsData: string = element.getAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME )!;

            if ( Is.definedString( bindingOptionsData ) ) {
                const bindingOptions: StringToJson = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && Is.definedObject( bindingOptions.object ) ) {
                    renderControl( renderBindingOptions( bindingOptions.object, element ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( _configuration.attributeNotValidErrorText!.replace( "{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME ) );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.attributeNotSetErrorText!.replace( "{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME ) );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderBindingOptions( data: any, element: HTMLElement ) : BindingOptions {
        const bindingOptions: BindingOptions = buildAttributeOptions( data );
        bindingOptions._currentView = {} as CurrentView;
        bindingOptions._currentView.element = element;

        return bindingOptions;
    }

    function renderControl( bindingOptions: BindingOptions ) : void {
        fireCustomTriggerEvent( bindingOptions.events!.onBeforeRender!, bindingOptions._currentView.element );

        if ( !Is.definedString( bindingOptions._currentView.element.id ) ) {
            bindingOptions._currentView.element.id = Data.String.newGuid();
        }

        bindingOptions._currentView.element.className = "json-tree-js";
        bindingOptions._currentView.element.removeAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME );

        if ( !_elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) ) {
            _elements_Data[ bindingOptions._currentView.element.id ] = {} as JsonTreeData;
            _elements_Data[ bindingOptions._currentView.element.id ].options = bindingOptions;
            _elements_Data[ bindingOptions._currentView.element.id ].data = bindingOptions.data;

            delete bindingOptions.data;
        }

        renderControlContainer( bindingOptions );
        fireCustomTriggerEvent( bindingOptions.events!.onRenderComplete!, bindingOptions._currentView.element );
    }

    function renderControlContainer( bindingOptions: BindingOptions ) : void {
        const data: any = _elements_Data[ bindingOptions._currentView.element.id ].data;

        bindingOptions._currentView.element.innerHTML = Char.empty;

        renderControlTitleBar( bindingOptions );

        if ( Is.definedObject( data ) && !Is.definedArray( data ) ) {
            renderObject( bindingOptions._currentView.element, bindingOptions, data );
        } else if ( Is.definedArray( data ) ) {
            renderArray( bindingOptions._currentView.element, bindingOptions, data );
        }
    }

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.title!.show || bindingOptions.title!.showTreeControls || bindingOptions.title!.showCopyButton ) {
            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "title-bar" );
            const controls: HTMLElement = DomElement.create( titleBar, "div", "controls" );
        
            if ( bindingOptions.title!.show ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, controls );
            }

            if ( bindingOptions.title!.showCopyButton ) {
                const copy: HTMLElement = DomElement.createWithHTML( controls, "button", "copy-all", _configuration.copyAllButtonText! );

                copy.onclick = function() {
                    const copyData: string = JSON.stringify( _elements_Data[ bindingOptions._currentView.element.id ].data );

                    navigator.clipboard.writeText( copyData );

                    fireCustomTriggerEvent( bindingOptions.events!.onCopyAll!, copyData );
                };
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAll: HTMLElement = DomElement.createWithHTML( controls, "button", "openAll", _configuration.openAllButtonText! );
                const closeAll: HTMLElement = DomElement.createWithHTML( controls, "button", "closeAll", _configuration.closeAllButtonText! );

                openAll.onclick = function() {
                    openAllNodes( bindingOptions );
                };

                closeAll.onclick = function() {
                    closeAllNodes( bindingOptions );
                };
            }
        }
    }

    function openAllNodes( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = false;

        renderControlContainer( bindingOptions );
        fireCustomTriggerEvent( bindingOptions.events!.onOpenAll!, bindingOptions._currentView.element );
    }

    function closeAllNodes( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = true;

        renderControlContainer( bindingOptions );
        fireCustomTriggerEvent( bindingOptions.events!.onCloseAll!, bindingOptions._currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Tree
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const propertyCount: number = renderObjectValues( arrow, objectTypeContents, bindingOptions, data );

        DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object" : Char.empty, _configuration.objectText! );

        if ( bindingOptions.showCounts && propertyCount > 0 ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", "{" + propertyCount + "}" );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;

        DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array" : Char.empty, _configuration.arrayText! );

        renderArrayValues( arrow, objectTypeContents, bindingOptions, data );

        if ( bindingOptions.showCounts ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", "[" + data.length + "]" );
        }
    }

    function renderObjectValues( arrow: HTMLElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any ) : number {
        let propertyCount: number = 0;
        let properties: string[] = [];

        for ( let key in data ) {
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

        const propertiesLength: number = properties.length;

        for ( let propertyIndex: number = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
            const propertyName: string = properties[ propertyIndex ];

            if ( data.hasOwnProperty( propertyName ) ) {
                renderValue( objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1 );
                propertyCount++;
            }
        }

        addArrowEvent( bindingOptions, arrow, objectTypeContents );

        return propertyCount;
    }

    function renderArrayValues( arrow: HTMLElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const dataLength: number = data.length;

        if ( !bindingOptions.reverseArrayValues ) {
            for ( let dataIndex1: number = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                renderValue( objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex1, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1 );
            }

        } else {
            for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                renderValue( objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex2, dataLength ), data[ dataIndex2 ], dataIndex2 === 0 );
            }
        }

        addArrowEvent( bindingOptions, arrow, objectTypeContents );
    }

    function renderValue( container: HTMLElement, bindingOptions: BindingOptions, name: string, value: any, isLastItem: boolean ) : void {
        const objectTypeValue: HTMLElement = DomElement.create( container, "div", "object-type-value" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeValue, "div", "no-arrow" ) : null!;
        let valueClass: string = null!;
        let valueElement: HTMLElement = null!;
        let ignored: boolean = false;
        let type: string = null!;
        let addClickEvent: boolean = true;

        DomElement.createWithHTML( objectTypeValue, "span", "title", name );
        DomElement.createWithHTML( objectTypeValue, "span", "split", ":" );

        if ( !Is.defined( value ) ) {
            if ( !bindingOptions.ignore!.nullValues ) {
                valueClass = bindingOptions.showValueColors ? "null" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, "null" );
                addClickEvent = false;

                if ( Is.definedFunction( bindingOptions.events!.onNullRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onNullRender!, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFunction( value ) ) {
            if ( !bindingOptions.ignore!.functionValues ) {
                valueClass = bindingOptions.showValueColors ? "function" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, getFunctionName( value ) );
                type = "function";

                if ( Is.definedFunction( bindingOptions.events!.onFunctionRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onFunctionRender!, valueElement );
                }
            
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBoolean( value ) ) {
            if ( !bindingOptions.ignore!.booleanValues ) {
                valueClass = bindingOptions.showValueColors ? "boolean" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = "boolean";

                if ( Is.definedFunction( bindingOptions.events!.onBooleanRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onBooleanRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedDecimal( value ) ) {
            if ( !bindingOptions.ignore!.decimalValues ) {
                const newValue: string = getFixedValue( value, bindingOptions.maximumDecimalPlaces! );

                valueClass = bindingOptions.showValueColors ? "decimal" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newValue );
                type = "decimal";

                if ( Is.definedFunction( bindingOptions.events!.onDecimalRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onDecimalRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedNumber( value ) ) {
            if ( !bindingOptions.ignore!.numberValues ) {
                valueClass = bindingOptions.showValueColors ? "number" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = "number";

                if ( Is.definedFunction( bindingOptions.events!.onNumberRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onNumberRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) ) {
            if ( !bindingOptions.ignore!.stringValues ) {
                let color: string = null!;

                if ( bindingOptions.showStringHexColors && isHexColor( value ) ) {
                    color = value;

                } else {
                    if ( bindingOptions.maximumStringLength! > 0 && value.length > bindingOptions.maximumStringLength! ) {
                        value = value.substring( 0, bindingOptions.maximumStringLength ) + _configuration.ellipsisText;
                    }
                }

                const newStringValue: string = bindingOptions.showStringQuotes ? "\"" + value + "\"" : value;
    
                valueClass = bindingOptions.showValueColors ? "string" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newStringValue );
                type = "string";

                if ( Is.definedString( color ) ) {
                    valueElement.style.color = color;
                }
    
                if ( Is.definedFunction( bindingOptions.events!.onStringRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onStringRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedDate( value ) ) {
            if ( !bindingOptions.ignore!.dateValues ) {
                valueClass = bindingOptions.showValueColors ? "date" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                type = "date";

                if ( Is.definedFunction( bindingOptions.events!.onDateRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onDateRender!, valueElement );
                }
    
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedObject( value ) && !Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.objectValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? "object" : Char.empty );
                const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                const propertyCount: number = renderObjectValues( arrow, objectTypeContents, bindingOptions, value );

                DomElement.createWithHTML( objectTitle, "span", "title", _configuration.objectText! );

                if ( bindingOptions.showCounts && propertyCount > 0 ) {
                    DomElement.createWithHTML( objectTitle, "span", "count", "{" + propertyCount + "}" );
                }

                createComma( bindingOptions, objectTitle, isLastItem );

                type = "object";

            } else {
                ignored = true;
            }


        } else if ( Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.arrayValues ) {
                const arrayTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? "array" : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );

                DomElement.createWithHTML( arrayTitle, "span", "title", _configuration.arrayText! );

                if ( bindingOptions.showCounts ) {
                    DomElement.createWithHTML( arrayTitle, "span", "count", "[" + value.length + "]" );
                }

                createComma( bindingOptions, arrayTitle, isLastItem );
                renderArrayValues( arrow, arrayTypeContents, bindingOptions, value );

                type = "array";
                
            } else {
                ignored = true;
            }

        } else {
            if ( !bindingOptions.ignore!.unknownValues ) {
                valueClass = bindingOptions.showValueColors ? "unknown" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                type = "unknown";

                if ( Is.definedFunction( bindingOptions.events!.onUnknownRender ) ) {
                    fireCustomTriggerEvent( bindingOptions.events!.onUnknownRender!, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }
        }

        if ( ignored ) {
            container.removeChild( objectTypeValue );
            
        } else {
            if ( Is.defined( valueElement ) ) {
                addValueClickEvent( bindingOptions, valueElement, value, type, addClickEvent );
            }
        }
    }

    function addValueClickEvent( bindingOptions: BindingOptions, valueElement: HTMLElement, value: any, type: string, addClickEvent: boolean ) : void {
        if ( addClickEvent && Is.definedFunction( bindingOptions.events!.onValueClick ) ) {
            valueElement.onclick = function() {
                fireCustomTriggerEvent( bindingOptions.events!.onValueClick!, value, type );
            };

        } else {
            DomElement.addClass( valueElement, "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions: BindingOptions, arrow: HTMLElement, objectTypeContents: HTMLElement ) : void {
        if ( Is.defined( arrow ) ) {
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

    function getFunctionName( value: any ) : string {
        let result: string;
        const valueParts: string[] = value.toString().split( "(" );
        const valueNameParts: string[] = valueParts[ 0 ].split( Char.space );

        if ( valueNameParts.length === 2 ) {
            result = valueNameParts[ 1 ];
        } else {
            result = valueNameParts[ 0 ];
        }

        result += "()";

        return result;
    }

    function createComma( bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean ) : void {
        if ( bindingOptions.showCommas && !isLastItem ) {
            DomElement.createWithHTML( objectTypeValue, "span", "comma", "," );
        }
    }
    
    function getIndexName( bindingOptions: BindingOptions, index: number, largestValue: number ) : string {
        let result: string = bindingOptions.useZeroIndexingForArrays ? index.toString() : (index + 1).toString();
    
        if ( !bindingOptions.addArrayIndexPadding ) {
            result = Data.String.padNumber( parseInt( result ), largestValue.toString().length );
        }
    
        return result;
    }
    
    function getFixedValue( value: number, length: number ) : string {
        const regExp: RegExp = new RegExp( "^-?\\d+(?:.\\d{0," + ( length || -1 ) + "})?" );
    
        return value.toString().match( regExp )?.[ 0 ] || "";
    }
    
    function isHexColor( value: string ) : boolean {
        let valid: boolean = value.length >= 2 && value.length <= 7;
    
        if ( valid && value[ 0 ] === "#" ) {
            valid = isNaN( +value.substring( 1, value.length - 1 ) );
        }
    
        return valid;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions: any ) : BindingOptions {
        let options: BindingOptions = Data.getDefaultObject( newOptions, {} as BindingOptions );
        options.data = Data.getDefaultObject( options.data, null! );
        options.showCounts = Data.getDefaultBoolean( options.showCounts, true );
        options.useZeroIndexingForArrays = Data.getDefaultBoolean( options.useZeroIndexingForArrays, true );
        options.dateTimeFormat = Data.getDefaultString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
        options.showArrowToggles = Data.getDefaultBoolean( options.showArrowToggles, true );
        options.showStringQuotes = Data.getDefaultBoolean( options.showStringQuotes, true );
        options.showAllAsClosed = Data.getDefaultBoolean( options.showAllAsClosed, false );
        options.sortPropertyNames = Data.getDefaultBoolean( options.sortPropertyNames, true );
        options.sortPropertyNamesInAlphabeticalOrder = Data.getDefaultBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
        options.showCommas = Data.getDefaultBoolean( options.showCommas, false );
        options.reverseArrayValues = Data.getDefaultBoolean( options.reverseArrayValues, false );
        options.addArrayIndexPadding = Data.getDefaultBoolean( options.addArrayIndexPadding, false );
        options.showValueColors = Data.getDefaultBoolean( options.showValueColors, true );
        options.maximumDecimalPlaces = Data.getDefaultNumber( options.maximumDecimalPlaces, 2 );
        options.maximumStringLength = Data.getDefaultNumber( options.maximumStringLength, 0 );
        options.showStringHexColors = Data.getDefaultBoolean( options.showStringHexColors, false );

        options = buildAttributeOptionTitle( options );
        options = buildAttributeOptionIgnore( options );
        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionTitle( options: BindingOptions ) : BindingOptions {
        options.title = Data.getDefaultObject( options.title, {} as Title );
        options.title!.text = Data.getDefaultString( options.title!.text, "JsonTree.js" );
        options.title!.show = Data.getDefaultBoolean( options.title!.show, true );
        options.title!.showTreeControls = Data.getDefaultBoolean( options.title!.showTreeControls, true );
        options.title!.showCopyButton = Data.getDefaultBoolean( options.title!.showCopyButton, false );

        return options;
    }

    function buildAttributeOptionIgnore( options: BindingOptions ) : BindingOptions {
        options.ignore = Data.getDefaultObject( options.ignore, {} as Ignore );
        options.ignore!.nullValues = Data.getDefaultBoolean( options.ignore!.nullValues, false );
        options.ignore!.functionValues = Data.getDefaultBoolean( options.ignore!.functionValues, false );
        options.ignore!.unknownValues = Data.getDefaultBoolean( options.ignore!.unknownValues, false );
        options.ignore!.booleanValues = Data.getDefaultBoolean( options.ignore!.booleanValues, false );
        options.ignore!.decimalValues = Data.getDefaultBoolean( options.ignore!.decimalValues, false );
        options.ignore!.numberValues = Data.getDefaultBoolean( options.ignore!.numberValues, false );
        options.ignore!.stringValues = Data.getDefaultBoolean( options.ignore!.stringValues, false );
        options.ignore!.dateValues = Data.getDefaultBoolean( options.ignore!.dateValues, false );
        options.ignore!.objectValues = Data.getDefaultBoolean( options.ignore!.objectValues, false );
        options.ignore!.arrayValues = Data.getDefaultBoolean( options.ignore!.arrayValues, false );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options: BindingOptions ) : BindingOptions {
        options.events = Data.getDefaultObject( options.events, {} as Events );
        options.events!.onBeforeRender = Data.getDefaultFunction( options.events!.onBeforeRender, null! );
        options.events!.onRenderComplete = Data.getDefaultFunction( options.events!.onRenderComplete, null! );
        options.events!.onValueClick = Data.getDefaultFunction( options.events!.onValueClick, null! );
        options.events!.onRefresh = Data.getDefaultFunction( options.events!.onRefresh, null! );
        options.events!.onCopyAll = Data.getDefaultFunction( options.events!.onCopyAll, null! );
        options.events!.onOpenAll = Data.getDefaultFunction( options.events!.onOpenAll, null! );
        options.events!.onCloseAll = Data.getDefaultFunction( options.events!.onCloseAll, null! );
        options.events!.onDestroy = Data.getDefaultFunction( options.events!.onDestroy, null! );
        options.events!.onBooleanRender = Data.getDefaultFunction( options.events!.onBooleanRender, null! );
        options.events!.onDecimalRender = Data.getDefaultFunction( options.events!.onDecimalRender, null! );
        options.events!.onNumberRender =Data.getDefaultFunction( options.events!.onNumberRender, null! );
        options.events!.onStringRender = Data.getDefaultFunction( options.events!.onStringRender, null! );
        options.events!.onDateRender = Data.getDefaultFunction( options.events!.onDateRender, null! );
        options.events!.onFunctionRender = Data.getDefaultFunction( options.events!.onFunctionRender, null! );
        options.events!.onNullRender = Data.getDefaultFunction( options.events!.onNullRender, null! );
        options.events!.onUnknownRender = Data.getDefaultFunction( options.events!.onUnknownRender, null! );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTriggerEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObjectFromString( objectString: any ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                result.object = JSON.parse( objectString );
            }

        } catch ( e1: any ) {
            try {
                result.object = eval( "(" + objectString + ")" );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Manage Instances
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        refresh: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        refreshAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },

        render: function ( element: HTMLElement, options: Object ): PublicApi {
            throw new Error("Function not implemented.");
        },

        renderAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },

        openAll: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        closeAll: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroy: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        destroyAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( configuration: any ): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getIds: function (): string[] {
            throw new Error("Function not implemented.");
        },

        getVersion: function (): string {
            throw new Error("Function not implemented.");
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {

    } )();
} )();