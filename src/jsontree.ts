/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.0.1
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

import { type PublicApi } from "./ts/api";
import { Default } from "./ts/data/default";
import { Is } from "./ts/data/is";
import { DomElement } from "./ts/dom/dom";
import { Char } from "./ts/data/enum";
import { DateTime } from "./ts/data/datetime";
import { Constants } from "./ts/constant";
import { Str } from "./ts/data/str";


type StringToJson = {
    parsed: boolean;
    object: any;
};

type JsonTreeData = Record<string, BindingOptions>;


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Data
    let _elements_Data: JsonTreeData = {} as JsonTreeData;


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
            bindingOptions._currentView.element.id = Str.newGuid();
        }

        bindingOptions._currentView.element.className = "json-tree-js";
        bindingOptions._currentView.element.removeAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME );

        if ( !_elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) ) {
            _elements_Data[ bindingOptions._currentView.element.id ] = bindingOptions;
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

                copy.onclick = () => {
                    const copyData: string = JSON.stringify( _elements_Data[ bindingOptions._currentView.element.id ].data );

                    navigator.clipboard.writeText( copyData );

                    fireCustomTriggerEvent( bindingOptions.events!.onCopyAll!, copyData );
                };
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAll: HTMLElement = DomElement.createWithHTML( controls, "button", "openAll", _configuration.openAllButtonText! );
                const closeAll: HTMLElement = DomElement.createWithHTML( controls, "button", "closeAll", _configuration.closeAllButtonText! );

                openAll.onclick = () => {
                    openAllNodes( bindingOptions );
                };

                closeAll.onclick = () => {
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
                const newValue: string = Default.getFixedDecimalPlacesValue( value, bindingOptions.maximumDecimalPlaces! );

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

                if ( bindingOptions.showValueColors && bindingOptions.showStringHexColors && Is.hexColor( value ) ) {
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
            valueElement.onclick = () => {
                fireCustomTriggerEvent( bindingOptions.events!.onValueClick!, value, type );
            };

        } else {
            DomElement.addClass( valueElement, "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions: BindingOptions, arrow: HTMLElement, objectTypeContents: HTMLElement ) : void {
        if ( Is.defined( arrow ) ) {
            arrow.onclick = () => {
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
        let result: string = bindingOptions.useZeroIndexingForArrays ? index.toString() : ( index + 1 ).toString();
    
        if ( !bindingOptions.addArrayIndexPadding ) {
            result = Str.padNumber( parseInt( result ), largestValue.toString().length );
        }
    
        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions: any ) : BindingOptions {
        let options: BindingOptions = Default.getDefaultObject( newOptions, {} as BindingOptions );
        options.data = Default.getDefaultObject( options.data, null! );
        options.showCounts = Default.getDefaultBoolean( options.showCounts, true );
        options.useZeroIndexingForArrays = Default.getDefaultBoolean( options.useZeroIndexingForArrays, true );
        options.dateTimeFormat = Default.getDefaultString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
        options.showArrowToggles = Default.getDefaultBoolean( options.showArrowToggles, true );
        options.showStringQuotes = Default.getDefaultBoolean( options.showStringQuotes, true );
        options.showAllAsClosed = Default.getDefaultBoolean( options.showAllAsClosed, false );
        options.sortPropertyNames = Default.getDefaultBoolean( options.sortPropertyNames, true );
        options.sortPropertyNamesInAlphabeticalOrder = Default.getDefaultBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
        options.showCommas = Default.getDefaultBoolean( options.showCommas, false );
        options.reverseArrayValues = Default.getDefaultBoolean( options.reverseArrayValues, false );
        options.addArrayIndexPadding = Default.getDefaultBoolean( options.addArrayIndexPadding, false );
        options.showValueColors = Default.getDefaultBoolean( options.showValueColors, true );
        options.maximumDecimalPlaces = Default.getDefaultNumber( options.maximumDecimalPlaces, 2 );
        options.maximumStringLength = Default.getDefaultNumber( options.maximumStringLength, 0 );
        options.showStringHexColors = Default.getDefaultBoolean( options.showStringHexColors, false );

        options = buildAttributeOptionTitle( options );
        options = buildAttributeOptionIgnore( options );
        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionTitle( options: BindingOptions ) : BindingOptions {
        options.title = Default.getDefaultObject( options.title, {} as Title );
        options.title!.text = Default.getDefaultString( options.title!.text, "JsonTree.js" );
        options.title!.show = Default.getDefaultBoolean( options.title!.show, true );
        options.title!.showTreeControls = Default.getDefaultBoolean( options.title!.showTreeControls, true );
        options.title!.showCopyButton = Default.getDefaultBoolean( options.title!.showCopyButton, false );

        return options;
    }

    function buildAttributeOptionIgnore( options: BindingOptions ) : BindingOptions {
        options.ignore = Default.getDefaultObject( options.ignore, {} as Ignore );
        options.ignore!.nullValues = Default.getDefaultBoolean( options.ignore!.nullValues, false );
        options.ignore!.functionValues = Default.getDefaultBoolean( options.ignore!.functionValues, false );
        options.ignore!.unknownValues = Default.getDefaultBoolean( options.ignore!.unknownValues, false );
        options.ignore!.booleanValues = Default.getDefaultBoolean( options.ignore!.booleanValues, false );
        options.ignore!.decimalValues = Default.getDefaultBoolean( options.ignore!.decimalValues, false );
        options.ignore!.numberValues = Default.getDefaultBoolean( options.ignore!.numberValues, false );
        options.ignore!.stringValues = Default.getDefaultBoolean( options.ignore!.stringValues, false );
        options.ignore!.dateValues = Default.getDefaultBoolean( options.ignore!.dateValues, false );
        options.ignore!.objectValues = Default.getDefaultBoolean( options.ignore!.objectValues, false );
        options.ignore!.arrayValues = Default.getDefaultBoolean( options.ignore!.arrayValues, false );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options: BindingOptions ) : BindingOptions {
        options.events = Default.getDefaultObject( options.events, {} as Events );
        options.events!.onBeforeRender = Default.getDefaultFunction( options.events!.onBeforeRender, null! );
        options.events!.onRenderComplete = Default.getDefaultFunction( options.events!.onRenderComplete, null! );
        options.events!.onValueClick = Default.getDefaultFunction( options.events!.onValueClick, null! );
        options.events!.onRefresh = Default.getDefaultFunction( options.events!.onRefresh, null! );
        options.events!.onCopyAll = Default.getDefaultFunction( options.events!.onCopyAll, null! );
        options.events!.onOpenAll = Default.getDefaultFunction( options.events!.onOpenAll, null! );
        options.events!.onCloseAll = Default.getDefaultFunction( options.events!.onCloseAll, null! );
        options.events!.onDestroy = Default.getDefaultFunction( options.events!.onDestroy, null! );
        options.events!.onBooleanRender = Default.getDefaultFunction( options.events!.onBooleanRender, null! );
        options.events!.onDecimalRender = Default.getDefaultFunction( options.events!.onDecimalRender, null! );
        options.events!.onNumberRender =Default.getDefaultFunction( options.events!.onNumberRender, null! );
        options.events!.onStringRender = Default.getDefaultFunction( options.events!.onStringRender, null! );
        options.events!.onDateRender = Default.getDefaultFunction( options.events!.onDateRender, null! );
        options.events!.onFunctionRender = Default.getDefaultFunction( options.events!.onFunctionRender, null! );
        options.events!.onNullRender = Default.getDefaultFunction( options.events!.onNullRender, null! );
        options.events!.onUnknownRender = Default.getDefaultFunction( options.events!.onUnknownRender, null! );

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
	 * Public API Functions:  Helpers:  Destroy
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    function destroyElement( bindingOptions: BindingOptions ) : void {
        bindingOptions._currentView.element.innerHTML = Char.empty;
        bindingOptions._currentView.element.className = Char.empty;

        fireCustomTriggerEvent( bindingOptions.events!.onDestroy!, bindingOptions._currentView.element );
    }

	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:  Helpers:  Configuration
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    function buildDefaultConfiguration( newConfiguration: any = null ) : void {
        _configuration = Default.getDefaultObject( newConfiguration, {} as Configuration );
        _configuration.safeMode = Default.getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = Default.getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() : void {
        _configuration.objectText = Default.getDefaultAnyString( _configuration.objectText, "object" );
        _configuration.arrayText = Default.getDefaultAnyString( _configuration.arrayText, "array" );
        _configuration.closeAllButtonText = Default.getDefaultAnyString( _configuration.closeAllButtonText, "Close All" );
        _configuration.openAllButtonText = Default.getDefaultAnyString( _configuration.openAllButtonText, "Open All" );
        _configuration.copyAllButtonText = Default.getDefaultAnyString( _configuration.copyAllButtonText, "Copy All" );
        _configuration.objectErrorText = Default.getDefaultAnyString( _configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
        _configuration.attributeNotValidErrorText = Default.getDefaultAnyString( _configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
        _configuration.attributeNotSetErrorText = Default.getDefaultAnyString( _configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
        _configuration.stText = Default.getDefaultAnyString( _configuration.stText, "st" );
        _configuration.ndText = Default.getDefaultAnyString( _configuration.ndText, "nd" );
        _configuration.rdText = Default.getDefaultAnyString( _configuration.rdText, "rd" );
        _configuration.thText = Default.getDefaultAnyString( _configuration.thText, "th" );
        _configuration.ellipsisText = Default.getDefaultAnyString( _configuration.ellipsisText, "..." );

        if ( Is.invalidOptionArray( _configuration.dayNames, 7 ) ) {
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

        if ( Is.invalidOptionArray( _configuration.dayNamesAbbreviated, 7 ) ) {
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

        if ( Is.invalidOptionArray( _configuration.monthNames, 12 ) ) {
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

        if ( Is.invalidOptionArray( _configuration.monthNamesAbbreviated, 12 ) ) {
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
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Manage Instances
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        refresh: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                const bindingOptions: BindingOptions = _elements_Data[ elementId ];
    
                renderControlContainer( bindingOptions );
                fireCustomTriggerEvent( bindingOptions.events!.onRefresh!, bindingOptions._currentView.element );
            }
    
            return _public;
        },

        refreshAll: function () : PublicApi {
            for ( let elementId in _elements_Data ) {
                if ( _elements_Data.hasOwnProperty( elementId ) ) {
                    const bindingOptions: BindingOptions = _elements_Data[ elementId ];
    
                    renderControlContainer( bindingOptions );
                    fireCustomTriggerEvent( bindingOptions.events!.onRefresh!, bindingOptions._currentView.element );
                }
            }
    
            return _public;
        },

        render: function ( element: HTMLElement, options: object ) : PublicApi {
            if ( Is.definedObject( element ) && Is.definedObject( options ) ) {
                renderControl( renderBindingOptions( options, element ) );
            }
    
            return _public;
        },

        renderAll: function () : PublicApi {
            render();

            return _public;
        },

        openAll: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                openAllNodes( _elements_Data[ elementId ] );
            }
    
            return _public;
        },

        closeAll: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                closeAllNodes( _elements_Data[ elementId ] );
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroy: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                destroyElement( _elements_Data[ elementId ] );
    
                delete _elements_Data[ elementId ];
            }
    
            return _public;
        },

        destroyAll: function () : PublicApi {
            for ( let elementId in _elements_Data ) {
                if ( _elements_Data.hasOwnProperty( elementId ) ) {
                    destroyElement( _elements_Data[ elementId ] );
                }
            }

            _elements_Data = {} as JsonTreeData;

            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            if ( Is.definedObject( newConfiguration ) ) {
                let configurationHasChanged: boolean = false;
                const newInternalConfiguration: any = _configuration;
            
                for ( let propertyName in newConfiguration ) {
                    if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newInternalConfiguration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                        newInternalConfiguration[ propertyName ] = newConfiguration[ propertyName ];
                        configurationHasChanged = true;
                    }
                }
        
                if ( configurationHasChanged ) {
                    buildDefaultConfiguration( newInternalConfiguration );
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getIds: function () : string[] {
            const result: string[] = [];
        
            for ( let elementId in _elements_Data ) {
                if ( _elements_Data.hasOwnProperty( elementId ) ) {
                    result.push( elementId );
                }
            }
    
            return result;
        },

        getVersion: function () : string {
            return "2.0.1";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        buildDefaultConfiguration();

        document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !Is.defined( window.$jsontree ) ) {
            window.$jsontree = _public;
        }
    } )();
} )();