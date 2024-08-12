/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.6.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions, type Configuration } from "./ts/type";
import { type PublicApi } from "./ts/api";
import { Default } from "./ts/data/default";
import { Is } from "./ts/data/is";
import { DomElement } from "./ts/dom/dom";
import { Char, DataType, KeyCode } from "./ts/data/enum";
import { DateTime } from "./ts/data/datetime";
import { Constants } from "./ts/constant";
import { Str } from "./ts/data/str";
import { Binding } from "./ts/options/binding";
import { Config } from "./ts/options/config";
import { Trigger } from "./ts/area/trigger";
import { ToolTip } from "./ts/area/tooltip";


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
                    renderControl( Binding.Options.getForNewInstance( bindingOptions.object, element ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( _configuration.text!.attributeNotValidErrorText!.replace( "{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME ) );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.text!.attributeNotSetErrorText!.replace( "{{attribute_name}}", Constants.JSONTREE_JS_ATTRIBUTE_NAME ) );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderControl( bindingOptions: BindingOptions ) : void {
        Trigger.customEvent( bindingOptions.events!.onBeforeRender!, bindingOptions._currentView.element );
        ToolTip.renderControl( bindingOptions );

        if ( !Is.definedString( bindingOptions._currentView.element.id ) ) {
            bindingOptions._currentView.element.id = Str.newGuid();
        }

        bindingOptions._currentView.element.className = "json-tree-js";
        bindingOptions._currentView.element.removeAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME );

        if ( !_elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) ) {
            _elements_Data[ bindingOptions._currentView.element.id ] = bindingOptions;
        }

        renderControlContainer( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onRenderComplete!, bindingOptions._currentView.element );
    }

    function renderControlContainer( bindingOptions: BindingOptions, isForPageSwitch: boolean = false ) : void {
        let data: any = _elements_Data[ bindingOptions._currentView.element.id ].data;

        ToolTip.hide( bindingOptions );

        bindingOptions._currentView.element.innerHTML = Char.empty;

        renderControlTitleBar( bindingOptions, data );

        const contents: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "contents" );

        if ( isForPageSwitch ) {
            DomElement.addClass( contents, "page-switch" );
        }

        makeAreaDroppable( contents, bindingOptions );

        if ( bindingOptions.showArrayItemsAsSeparateObjects && Is.definedArray( data ) ) {
            data = data[ bindingOptions._currentView.dataArrayCurrentIndex ];
        }

        if ( Is.definedObject( data ) && !Is.definedArray( data ) ) {
            renderObject( contents, bindingOptions, data );
        } else if ( Is.definedArray( data ) ) {
            renderArray( contents, bindingOptions, data );
        }

        if ( contents.innerHTML === Char.empty ) {
            DomElement.createWithHTML( contents, "span", "no-json-text", _configuration.text!.noJsonToViewText! );

            bindingOptions._currentView.titleBarButtons.style.display = "none";

        } else {
            bindingOptions._currentView.titleBarButtons.style.display = "block";
        }
    }

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions: BindingOptions, data: any ) : void {
        if ( bindingOptions.title!.show || bindingOptions.title!.showTreeControls || bindingOptions.title!.showCopyButton ) {
            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "title-bar" );

            bindingOptions._currentView.titleBarButtons = DomElement.create( titleBar, "div", "controls" );
        
            if ( bindingOptions.title!.show ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, bindingOptions._currentView.titleBarButtons );
            }

            if ( bindingOptions.title!.showCopyButton ) {
                const copy: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "copy-all", _configuration.text!.copyAllButtonSymbolText! ) as HTMLButtonElement;

                ToolTip.add( copy, bindingOptions, _configuration.text!.copyAllButtonText! );

                copy.onclick = () => {
                    onTitleBarCopyClick( bindingOptions, data );
                };
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAll: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "openAll", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;

                ToolTip.add( openAll, bindingOptions, _configuration.text!.openAllButtonText! );

                const closeAll: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "closeAll", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;

                ToolTip.add( closeAll, bindingOptions, _configuration.text!.closeAllButtonText! );

                openAll.onclick = () => {
                    openAllNodes( bindingOptions );
                };

                closeAll.onclick = () => {
                    closeAllNodes( bindingOptions );
                };
            }

            if ( bindingOptions.showArrayItemsAsSeparateObjects && Is.definedArray( data ) && data.length > 1 ) {
                const back: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "back", _configuration.text!.backButtonSymbolText! ) as HTMLButtonElement;

                ToolTip.add( back, bindingOptions, _configuration.text!.backButtonText! );

                if ( bindingOptions._currentView.dataArrayCurrentIndex > 0 ) {
                    back.onclick = () => {
                        bindingOptions._currentView.dataArrayCurrentIndex--;
    
                        renderControlContainer( bindingOptions, true );
                        Trigger.customEvent( bindingOptions.events!.onBackPage!, bindingOptions._currentView.element );
                    };

                } else {
                    back.disabled = true;
                }

                const next: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "next", _configuration.text!.nextButtonSymbolText! ) as HTMLButtonElement;

                ToolTip.add( next, bindingOptions, _configuration.text!.nextButtonText! );

                if ( bindingOptions._currentView.dataArrayCurrentIndex < data.length - 1 ) {
                    next.onclick = () => {
                        bindingOptions._currentView.dataArrayCurrentIndex++;
                        
                        renderControlContainer( bindingOptions, true );
                        Trigger.customEvent( bindingOptions.events!.onNextPage!, bindingOptions._currentView.element );
                    };

                } else {
                    next.disabled = true;
                }

            } else {

                if ( Is.definedArray( data ) ) {
                    bindingOptions.showArrayItemsAsSeparateObjects = false;
                }
            }
        }
    }

    function onTitleBarCopyClick( bindingOptions: BindingOptions, data: any ) : void {
        let copyData: string = null!;
        let replaceFunction: any = jsonStringifyReplacer;

        if ( Is.definedFunction( bindingOptions.events!.onCopyJsonReplacer ) ) {
            replaceFunction = bindingOptions.events!.onCopyJsonReplacer!;
        }

        if ( bindingOptions.copyOnlyCurrentPage && bindingOptions.showArrayItemsAsSeparateObjects ) {
            copyData = JSON.stringify( data[ bindingOptions._currentView.dataArrayCurrentIndex ], replaceFunction, bindingOptions.copyIndentSpaces );
        }
        else {
            copyData = JSON.stringify( data, replaceFunction, bindingOptions.copyIndentSpaces );
        }

        navigator.clipboard.writeText( copyData );

        Trigger.customEvent( bindingOptions.events!.onCopyAll!, copyData );
    }

    function jsonStringifyReplacer( _: string, value: any ) : void {
        if ( Is.definedBigInt( value ) ) {
            value = value.toString();
        } else if ( Is.definedSymbol( value ) ) {
            value = value.toString();
        } else if ( Is.definedFunction( value ) ) {
            value = Default.getFunctionName( value, _configuration );
        }

        return value;
    }

    function openAllNodes( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = false;

        renderControlContainer( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onOpenAll!, bindingOptions._currentView.element );
    }

    function closeAllNodes( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = true;

        renderControlContainer( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onCloseAll!, bindingOptions._currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Tree
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const propertyNames: string[] = getObjectPropertyNames( data, bindingOptions );
        const propertyCount: number = propertyNames.length;

        if ( propertyCount !== 0 || !bindingOptions.ignore!.emptyObjects ) {
            const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
            const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents object-type-contents-parent" );
            const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
            const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object main-title" : "main-title", _configuration.text!.objectText! ) as HTMLSpanElement;
            let openingBrace: HTMLSpanElement = null!;

            if ( bindingOptions.showArrayItemsAsSeparateObjects ) {
                let dataArrayIndex: string = bindingOptions.useZeroIndexingForArrays ? bindingOptions._currentView.dataArrayCurrentIndex.toString() : ( bindingOptions._currentView.dataArrayCurrentIndex + 1 ).toString();
    
                if ( bindingOptions.showArrayIndexBrackets ) {
                    dataArrayIndex = `[${dataArrayIndex}]:`;
                }

                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object data-array-index" : "data-array-index", dataArrayIndex, titleText );
            }
    
            if ( bindingOptions.showCounts && propertyCount > 0 ) {
                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", `{${propertyCount}}` );
            }

            if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                openingBrace = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
            }

            renderObjectValues( arrow, null!, objectTypeContents, bindingOptions, data, propertyNames, openingBrace, false, true );
            addValueClickEvent( bindingOptions, titleText, data, DataType.object );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents object-type-contents-parent" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array main-title" : "main-title", _configuration.text!.arrayText! );
        let openingBracket: HTMLSpanElement = null!;

        if ( bindingOptions.showCounts ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", `[${data.length}]` );
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            openingBracket = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
        }

        renderArrayValues( arrow, null!, objectTypeContents, bindingOptions, data, openingBracket, false, true );
        addValueClickEvent( bindingOptions, titleText, data, DataType.object );
    }

    function renderObjectValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, propertyNames: string[], openingBrace: HTMLSpanElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean ) : void {
        const propertiesLength: number = propertyNames.length;

        for ( let propertyIndex: number = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
            const propertyName: string = propertyNames[ propertyIndex ];

            if ( data.hasOwnProperty( propertyName ) ) {
                renderValue( data, objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1, false );
            }
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            createClosingSymbol( bindingOptions, objectTypeContents, "}", addNoArrowToClosingSymbol, isLastItem );
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBrace );
    }

    function renderArrayValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, openingBracket: HTMLSpanElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean ) : void {
        const dataLength: number = data.length;

        if ( !bindingOptions.reverseArrayValues ) {
            for ( let dataIndex1: number = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                renderValue( data, objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex1, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1, true );
            }

        } else {
            for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                renderValue( data, objectTypeContents, bindingOptions, getIndexName( bindingOptions, dataIndex2, dataLength ), data[ dataIndex2 ], dataIndex2 === 0, true );
            }
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            createClosingSymbol( bindingOptions, objectTypeContents, "]", addNoArrowToClosingSymbol, isLastItem );
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBracket );
    }

    function renderValue( data: any, container: HTMLElement, bindingOptions: BindingOptions, name: string, value: any, isLastItem: boolean, isArrayItem: boolean ) : void {
        const objectTypeValue: HTMLElement = DomElement.create( container, "div", "object-type-value" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeValue, "div", "no-arrow" ) : null!;
        let valueClass: string = null!;
        let valueElement: HTMLElement = null!;
        let ignored: boolean = false;
        let type: string = null!;
        const propertyName: HTMLSpanElement = DomElement.createWithHTML( objectTypeValue, "span", "title", name );

        DomElement.createWithHTML( objectTypeValue, "span", "split", ":" );

        if ( !isArrayItem ) {
            makePropertyNameEditable( bindingOptions, data, name, propertyName );
        }

        if ( value === null ) {
            if ( !bindingOptions.ignore!.nullValues ) {
                valueClass = bindingOptions.showValueColors ? "null value non-value" : "value non-value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, "null" );
                type = DataType.null;

                if ( Is.definedFunction( bindingOptions.events!.onNullRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onNullRender!, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( value === undefined ) {
            if ( !bindingOptions.ignore!.undefinedValues ) {
                valueClass = bindingOptions.showValueColors ? "undefined value non-value" : "value non-value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, "undefined" );
                type = DataType.undefined;

                if ( Is.definedFunction( bindingOptions.events!.onUndefinedRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUndefinedRender!, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFunction( value ) ) {
            if ( !bindingOptions.ignore!.functionValues ) {
                valueClass = bindingOptions.showValueColors ? "function value non-value" : "value non-value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, Default.getFunctionName( value, _configuration ) );
                type = DataType.function;

                if ( Is.definedFunction( bindingOptions.events!.onFunctionRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onFunctionRender!, valueElement );
                }
            
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBoolean( value ) ) {
            if ( !bindingOptions.ignore!.booleanValues ) {
                valueClass = bindingOptions.showValueColors ? "boolean value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.boolean;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );

                if ( Is.definedFunction( bindingOptions.events!.onBooleanRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onBooleanRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedDecimal( value ) ) {
            if ( !bindingOptions.ignore!.decimalValues ) {
                const newValue: string = Default.getFixedDecimalPlacesValue( value, bindingOptions.maximumDecimalPlaces! );

                valueClass = bindingOptions.showValueColors ? "decimal value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newValue );
                type = DataType.decimal;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );

                if ( Is.definedFunction( bindingOptions.events!.onDecimalRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDecimalRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedNumber( value ) ) {
            if ( !bindingOptions.ignore!.numberValues ) {
                valueClass = bindingOptions.showValueColors ? "number value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.number;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );

                if ( Is.definedFunction( bindingOptions.events!.onNumberRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onNumberRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBigInt( value ) ) {
            if ( !bindingOptions.ignore!.bigIntValues ) {
                valueClass = bindingOptions.showValueColors ? "bigint value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.bigint;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );

                if ( Is.definedFunction( bindingOptions.events!.onBigIntRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onBigIntRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) ) {
            if ( !bindingOptions.ignore!.stringValues ) {
                if ( bindingOptions.parse!.stringsToBooleans && Is.String.boolean( value ) ) {
                    renderValue( data, container, bindingOptions, name, value.toString().toLowerCase().trim() === "true", isLastItem, isArrayItem );
                    ignored = true;

                } else if ( bindingOptions.parse!.stringsToNumbers && !isNaN( value ) ) {
                    renderValue( data, container, bindingOptions, name, parseFloat( value ), isLastItem, isArrayItem );
                    ignored = true;

                } else if ( bindingOptions.parse!.stringsToDates && Is.String.date( value ) ) {
                    renderValue( data, container, bindingOptions, name, new Date( value ), isLastItem, isArrayItem );
                    ignored = true;

                } else {
                    let color: string = null!;

                    if ( bindingOptions.showValueColors && bindingOptions.showStringHexColors && Is.String.hexColor( value ) ) {
                        color = value;
    
                    } else {
                        if ( bindingOptions.maximumStringLength! > 0 && value.length > bindingOptions.maximumStringLength! ) {
                            value = value.substring( 0, bindingOptions.maximumStringLength ) + _configuration.text!.ellipsisText;
                        }
                    }
    
                    const newStringValue: string = bindingOptions.showStringQuotes && color === null ? `\"${value}\"` : value;
        
                    valueClass = bindingOptions.showValueColors ? "string value" : "value";
                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newStringValue );
                    type = DataType.string;

                    makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );
    
                    if ( Is.definedString( color ) ) {
                        valueElement.style.color = color;
                    }
        
                    if ( Is.definedFunction( bindingOptions.events!.onStringRender ) ) {
                        Trigger.customEvent( bindingOptions.events!.onStringRender!, valueElement );
                    }
                    
                    createComma( bindingOptions, objectTypeValue, isLastItem );
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedDate( value ) ) {
            if ( !bindingOptions.ignore!.dateValues ) {
                valueClass = bindingOptions.showValueColors ? "date value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                type = DataType.date;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem );

                if ( Is.definedFunction( bindingOptions.events!.onDateRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDateRender!, valueElement );
                }
    
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedSymbol( value ) ) {
            if ( !bindingOptions.ignore!.symbolValues ) {
                valueClass = bindingOptions.showValueColors ? "symbol value" : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                type = DataType.symbol;

                if ( Is.definedFunction( bindingOptions.events!.onSymbolRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onSymbolRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedObject( value ) && !Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.objectValues ) {
                const propertyNames: string[] = getObjectPropertyNames( value, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? "object" : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.objectText! );

                    if ( bindingOptions.showCounts && propertyCount > 0 ) {
                        DomElement.createWithHTML( objectTitle, "span", "count", `{${propertyCount}}` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, value, propertyNames, openingBrace, true, isLastItem );
    
                    type = DataType.object;
                }

            } else {
                ignored = true;
            }


        } else if ( Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.arrayValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? "array" : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                let openingBracket: HTMLSpanElement = null!;

                valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.arrayText! );

                if ( bindingOptions.showCounts ) {
                    DomElement.createWithHTML( objectTitle, "span", "count", `[${value.length}]` );
                }

                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
                }

                let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                
                renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, value, openingBracket, true, isLastItem );

                type = DataType.array;
                
            } else {
                ignored = true;
            }

        } else {
            if ( !bindingOptions.ignore!.unknownValues ) {
                valueClass = bindingOptions.showValueColors ? "unknown value non-value" : "value non-value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                type = DataType.unknown;

                if ( Is.definedFunction( bindingOptions.events!.onUnknownRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUnknownRender!, valueElement );
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
                addValueClickEvent( bindingOptions, valueElement, value, type );
            }
        }
    }

    function makePropertyNameEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, propertyName: HTMLSpanElement ) : void {
        if ( bindingOptions.allowEditing ) {
            propertyName.ondblclick = () => {
                DomElement.addClass( propertyName, "editable" );

                propertyName.setAttribute( "contenteditable", "true" );
                propertyName.focus();

                DomElement.setTextCursorToEnd( propertyName );

                propertyName.onblur = () => {
                    renderControlContainer( bindingOptions, false );
                };
    
                propertyName.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code == KeyCode.escape ) {
                        e.preventDefault();
                        renderControlContainer( bindingOptions, false );

                    } else if ( e.code == KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyName: string = propertyName.innerText;
    
                        if ( newPropertyName.trim() === Char.empty ) {
                            delete data[ originalPropertyName ];
    
                        } else {
                            if ( !data.hasOwnProperty( newPropertyName ) ) {
                                const originalValue: any = data[ originalPropertyName ];
        
                                delete data[ originalPropertyName ];
        
                                data[ newPropertyName ] = originalValue;
                            }
                        }

                        renderControlContainer( bindingOptions, false );
                    }
                };
            };
        }
    }

    function makePropertyValueEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, originalPropertyValue: any, propertyValue: HTMLSpanElement, isArrayItem: boolean ) : void {
        if ( bindingOptions.allowEditing ) {
            propertyValue.ondblclick = () => {
                DomElement.addClass( propertyValue, "editable" );

                propertyValue.setAttribute( "contenteditable", "true" );
                propertyValue.innerText = originalPropertyValue.toString();
                propertyValue.focus();

                DomElement.setTextCursorToEnd( propertyValue );

                propertyValue.onblur = () => {
                    renderControlContainer( bindingOptions, false );
                };
    
                propertyValue.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code == KeyCode.escape ) {
                        e.preventDefault();
                        renderControlContainer( bindingOptions, false );
                        
                    } else if ( e.code == KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyValue: string = propertyValue.innerText;
    
                        if ( newPropertyValue.trim() === Char.empty ) {
                            if ( isArrayItem ) {
                                data.splice( getArrayIndex( originalPropertyName ), 1 );
                            } else {
                                delete data[ originalPropertyName ];
                            }
    
                        } else {
                            let newDataPropertyValue: any = null;

                            if ( Is.definedBoolean( originalPropertyValue ) ) {
                                newDataPropertyValue = newPropertyValue.toLowerCase() === "true";
                            } else if ( Is.definedDecimal( originalPropertyValue ) && !isNaN( +newPropertyValue ) ) {
                                newDataPropertyValue = parseFloat( newPropertyValue );
                            } else if ( Is.definedNumber( originalPropertyValue ) && !isNaN( +newPropertyValue ) ) {
                                newDataPropertyValue = parseInt( newPropertyValue );
                            } else if ( Is.definedString( originalPropertyValue ) ) {
                                newDataPropertyValue = newPropertyValue;
                            } else if ( Is.definedDate( originalPropertyValue ) ) {
                                newDataPropertyValue = new Date( newPropertyValue );
                            } else if ( Is.definedBigInt( originalPropertyValue ) ) {
                                newDataPropertyValue = BigInt( newPropertyValue );
                            }

                            if ( newDataPropertyValue !== null ) {
                                if ( isArrayItem ) {
                                    data[ getArrayIndex( originalPropertyName ) ] = newDataPropertyValue;
                                } else {
                                    data[ originalPropertyName ] = newDataPropertyValue;
                                }
                            }
                        }

                        renderControlContainer( bindingOptions, false );
                    }
                };
            };
        }
    }

    function getArrayIndex( propertyName: string ) : number {
        return parseInt( propertyName.replace( "[", Char.empty ).replace( "]", Char.empty ) );
    }

    function addValueClickEvent( bindingOptions: BindingOptions, valueElement: HTMLElement, value: any, type: string ) : void {
        if ( Is.definedFunction( bindingOptions.events!.onValueClick ) ) {
            valueElement.onclick = () => {
                Trigger.customEvent( bindingOptions.events!.onValueClick!, value, type );
            };

        } else {
            DomElement.addClass( valueElement, "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions: BindingOptions, arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, openingSymbol: HTMLSpanElement ) : void {
        if ( Is.defined( arrow ) ) {
            const hideFunc: Function = () => {
                objectTypeContents.style.display = "none";
                arrow.className = "right-arrow";

                if ( Is.defined( openingSymbol ) ) {
                    openingSymbol.style.display = "none";
                }

                if ( Is.defined( coma ) ) {
                    coma.style.display = "inline-block";
                }
            };

            const showFunc: Function = () => {
                objectTypeContents.style.display = "block";
                arrow.className = "down-arrow";

                if ( Is.defined( openingSymbol ) ) {
                    openingSymbol.style.display = "inline-block";
                }

                if ( Is.defined( coma ) ) {
                    coma.style.display = "none";
                }
            };

            arrow.onclick = () => {
                if ( arrow.className === "down-arrow" ) {
                    hideFunc();
                } else {
                    showFunc();
                }
            };

            if ( bindingOptions.showAllAsClosed ) {
                hideFunc();
            } else {
                showFunc();
            }
        }
    }

    function createComma( bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean ) : HTMLSpanElement {
        let result: HTMLSpanElement = null!;

        if ( bindingOptions.showCommas && !isLastItem ) {
            result = DomElement.createWithHTML( objectTypeValue, "span", "comma", "," ) as HTMLSpanElement;
        }

        return result;
    }
    
    function getIndexName( bindingOptions: BindingOptions, index: number, largestValue: number ) : string {
        let result: string = bindingOptions.useZeroIndexingForArrays ? index.toString() : ( index + 1 ).toString();
    
        if ( !bindingOptions.addArrayIndexPadding ) {
            result = Str.padNumber( parseInt( result ), largestValue.toString().length );
        }

        if ( bindingOptions.showArrayIndexBrackets ) {
            result = `[${result}]`;
        }
    
        return result;
    }

    function getObjectPropertyNames( data: any, bindingOptions: BindingOptions ) : string[] {
        let properties: string[] = [];

        for ( let key in data ) {
            if ( data.hasOwnProperty( key ) ) {
                properties.push( key );
            }
        }

        if ( bindingOptions.sortPropertyNames ) {
            let collator: Intl.Collator = new Intl.Collator( undefined, {
                numeric: true,
                sensitivity: "base"
            } );

            properties = properties.sort( collator.compare );

            if ( !bindingOptions.sortPropertyNamesInAlphabeticalOrder ) {
                properties = properties.reverse();
            }
        }

        return properties;
    }

    function createClosingSymbol( bindingOptions: BindingOptions, container: HTMLElement, symbol: string, addNoArrow: boolean, isLastItem: boolean ) : void {
        let symbolContainer: HTMLElement = DomElement.create( container, "div", "closing-symbol" );
        
        if ( addNoArrow ) {
            DomElement.create( symbolContainer, "div", "no-arrow" );
        }
        
        DomElement.createWithHTML( symbolContainer, "div", "object-type-end", symbol );

        createComma( bindingOptions, symbolContainer, isLastItem )
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Drop Files
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function makeAreaDroppable( element: HTMLElement, bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.fileDroppingEnabled ) {
            element.ondragover = DomElement.cancelBubble;
            element.ondragenter = DomElement.cancelBubble;
            element.ondragleave = DomElement.cancelBubble;
    
            element.ondrop = ( e: DragEvent ) => {
                DomElement.cancelBubble( e );
    
                if ( Is.defined( window.FileReader ) && e.dataTransfer!.files.length > 0 ) {
                    importFromFiles( e.dataTransfer!.files, bindingOptions );
                }
            };
        }
    }

    function importFromFiles( files: FileList, bindingOptions: BindingOptions ) : void {
        const filesLength: number = files.length;

        for ( let fileIndex: number = 0; fileIndex < filesLength; fileIndex++ ) {
            const file: File = files[ fileIndex ];
            const fileExtension: string = file!.name!.split( "." )!.pop()!.toLowerCase();

            if ( fileExtension === "json" ) {
                importFromJson( file, bindingOptions );
            }
        }
    }

    function importFromJson( file: File, bindingOptions: BindingOptions ) : void {
        const reader: FileReader = new FileReader();
        let renderData: any = null as any;

        reader.onloadend = () => {
            bindingOptions._currentView.dataArrayCurrentIndex = 0;
            bindingOptions.data = renderData;

            renderControlContainer( bindingOptions );
            Trigger.customEvent( bindingOptions.events!.onSetJson!, bindingOptions._currentView.element );
        };
    
        reader.onload = ( e: ProgressEvent<FileReader> ) => {
            const json: StringToJson = getObjectFromString( e.target!.result );

            if ( json.parsed && Is.definedObject( json.object ) ) {
                renderData = json.object;
            }
        };

        reader.readAsText( file );
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
                result.object = eval( `(${objectString})` );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
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

        ToolTip.assignToEvents( bindingOptions, false );
        Trigger.customEvent( bindingOptions.events!.onDestroy!, bindingOptions._currentView.element );
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
                Trigger.customEvent( bindingOptions.events!.onRefresh!, bindingOptions._currentView.element );
            }
    
            return _public;
        },

        refreshAll: function () : PublicApi {
            for ( let elementId in _elements_Data ) {
                if ( _elements_Data.hasOwnProperty( elementId ) ) {
                    const bindingOptions: BindingOptions = _elements_Data[ elementId ];
    
                    renderControlContainer( bindingOptions );
                    Trigger.customEvent( bindingOptions.events!.onRefresh!, bindingOptions._currentView.element );
                }
            }
    
            return _public;
        },

        render: function ( element: HTMLElement, options: object ) : PublicApi {
            if ( Is.definedObject( element ) && Is.definedObject( options ) ) {
                renderControl( Binding.Options.getForNewInstance( options, element ) );
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
         * Public API Functions:  Manage Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setJson: function ( elementId: string, json: any ) : PublicApi {
            if ( Is.definedString( elementId ) && Is.defined( json ) && _elements_Data.hasOwnProperty( elementId ) ) {
                let jsonObject: any = null;

                if ( Is.definedString( json ) ) {
                    const jsonResult: StringToJson = getObjectFromString( json );

                    if ( jsonResult.parsed ) {
                        jsonObject = jsonResult.object;
                    }

                } else {
                    jsonObject = json;
                }

                const bindingOptions: BindingOptions = _elements_Data[ elementId ];
    
                bindingOptions._currentView.dataArrayCurrentIndex = 0;
                bindingOptions.data = jsonObject;

                renderControlContainer( bindingOptions );
                Trigger.customEvent( bindingOptions.events!.onSetJson!, bindingOptions._currentView.element );
            }
    
            return _public;
        },

        getJson: function ( elementId: string ) : any {
            let result: any = null;

            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                result = _elements_Data[ elementId ].data;
            }

            return result;
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
                    _configuration = Config.Options.get( newInternalConfiguration );
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
            return "2.6.0";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !Is.defined( window.$jsontree ) ) {
            window.$jsontree = _public;
        }
    } )();
} )();