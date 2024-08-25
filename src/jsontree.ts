/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.8.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type StringToJson,
    type BindingOptions,
    type Configuration,
    type ContentPanelsForArrayIndex,
    type ContentPanels } from "./ts/type";
    
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


type JsonTreeData = Record<string, BindingOptions>;


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Data
    let _elements_Data: JsonTreeData = {} as JsonTreeData;
    let _elements_Data_Count: number = 0;


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
                const bindingOptions: StringToJson = Default.getObjectFromString( bindingOptionsData, _configuration );

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
            bindingOptions._currentView.element.id = crypto.randomUUID();
            bindingOptions._currentView.idSet = true;
        }

        bindingOptions._currentView.element.className = "json-tree-js";
        bindingOptions._currentView.element.removeAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME );

        if ( bindingOptions.enableFullScreenToggling && bindingOptions.openInFullScreenMode ) {
            DomElement.addClass( bindingOptions._currentView.element, "full-screen" );
        }

        if ( !_elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) ) {
            _elements_Data[ bindingOptions._currentView.element.id ] = bindingOptions;
            _elements_Data_Count++;
        }

        renderControlContainer( bindingOptions );
        buildDocumentEvents( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onRenderComplete!, bindingOptions._currentView.element );
    }

    function renderControlContainer( bindingOptions: BindingOptions, isForPageSwitch: boolean = false ) : void {
        let data: any = _elements_Data[ bindingOptions._currentView.element.id ].data;

        ToolTip.hide( bindingOptions );

        bindingOptions._currentView.element.innerHTML = Char.empty;
        bindingOptions._currentView.editMode = false;
        bindingOptions._currentView.contentPanelsIndex = 0;

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

            if ( bindingOptions.enableFullScreenToggling ) {
                titleBar.ondblclick = () => onTitleBarDblClick( bindingOptions );
            }

            bindingOptions._currentView.titleBarButtons = DomElement.create( titleBar, "div", "controls" );
        
            if ( bindingOptions.title!.show ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, bindingOptions._currentView.titleBarButtons );
            }

            if ( bindingOptions.title!.showCopyButton ) {
                const copy: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "copy-all", _configuration.text!.copyAllButtonSymbolText! ) as HTMLButtonElement;
                copy.onclick = () => onTitleBarCopyClick( bindingOptions, data );
                copy.ondblclick = DomElement.cancelBubble;

                ToolTip.add( copy, bindingOptions, _configuration.text!.copyAllButtonText! );
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAll: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "openAll", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;
                openAll.onclick = () => onOpenAll( bindingOptions );
                openAll.ondblclick = DomElement.cancelBubble;

                ToolTip.add( openAll, bindingOptions, _configuration.text!.openAllButtonText! );

                const closeAll: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "closeAll", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;
                closeAll.onclick = () => onCloseAll( bindingOptions );
                closeAll.ondblclick = DomElement.cancelBubble;

                ToolTip.add( closeAll, bindingOptions, _configuration.text!.closeAllButtonText! );
            }

            if ( bindingOptions.showArrayItemsAsSeparateObjects && Is.definedArray( data ) && data.length > 1 ) {
                bindingOptions._currentView.backButton = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "back", _configuration.text!.backButtonSymbolText! ) as HTMLButtonElement;
                bindingOptions._currentView.backButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( bindingOptions._currentView.backButton, bindingOptions, _configuration.text!.backButtonText! );

                if ( bindingOptions._currentView.dataArrayCurrentIndex > 0 ) {
                    bindingOptions._currentView.backButton.onclick = () => onBackPage( bindingOptions );
                } else {
                    bindingOptions._currentView.backButton.disabled = true;
                }

                bindingOptions._currentView.nextButton = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "next", _configuration.text!.nextButtonSymbolText! ) as HTMLButtonElement;
                bindingOptions._currentView.nextButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( bindingOptions._currentView.nextButton, bindingOptions, _configuration.text!.nextButtonText! );

                if ( bindingOptions._currentView.dataArrayCurrentIndex < data.length - 1 ) {
                    bindingOptions._currentView.nextButton.onclick = () => onNextPage( bindingOptions );
                } else {
                    bindingOptions._currentView.nextButton.disabled = true;
                }

            } else {
                if ( Is.definedArray( data ) ) {
                    bindingOptions.showArrayItemsAsSeparateObjects = false;
                }
            }
        }
    }

    function onTitleBarDblClick( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.element.classList.contains( "full-screen" ) ) {
            DomElement.removeClass( bindingOptions._currentView.element, "full-screen" );
        } else {
            DomElement.addClass( bindingOptions._currentView.element, "full-screen" );
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

    function onOpenAll( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = false;
        bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;

        renderControlContainer( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onOpenAll!, bindingOptions._currentView.element );
    }

    function onCloseAll( bindingOptions: BindingOptions ) : void {
        bindingOptions.showAllAsClosed = true;
        bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;

        renderControlContainer( bindingOptions );
        Trigger.customEvent( bindingOptions.events!.onCloseAll!, bindingOptions._currentView.element );
    }

    function onBackPage( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.backButton !== null && !bindingOptions._currentView.backButton.disabled ) {
            bindingOptions._currentView.dataArrayCurrentIndex--;
    
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onBackPage!, bindingOptions._currentView.element );
        }
    }

    function onNextPage( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.nextButton !== null && !bindingOptions._currentView.nextButton.disabled ) {
            bindingOptions._currentView.dataArrayCurrentIndex++;
                        
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onNextPage!, bindingOptions._currentView.element );
        }
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


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Document Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildDocumentEvents( bindingOptions: BindingOptions, addEvents: boolean = true ) : void {
        const documentFunc: Function = addEvents ? document.addEventListener : document.removeEventListener;

        documentFunc( "keydown", ( e: KeyboardEvent ) => onWindowKeyDown( e, bindingOptions ) );
    }

    function onWindowKeyDown( e: KeyboardEvent, bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.shortcutKeysEnabled && _elements_Data_Count === 1 && _elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) ) {
            if ( e.code === KeyCode.left ) {
                e.preventDefault();
                onBackPage( bindingOptions );

            } else if ( e.code === KeyCode.right ) {
                e.preventDefault();
                onNextPage( bindingOptions );

            } else if ( e.code === KeyCode.up ) {
                e.preventDefault();
                onCloseAll( bindingOptions );

            } else if ( e.code === KeyCode.down ) {
                e.preventDefault();
                onOpenAll( bindingOptions );
            }
        }
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

                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${DataType.object} data-array-index` : "data-array-index", dataArrayIndex, titleText );
            }
    
            if ( bindingOptions.showCounts && propertyCount > 0 ) {
                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${DataType.object} count` : "count", `{${propertyCount}}` );
            }

            if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                openingBrace = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
            }

            renderObjectValues( arrow, null!, objectTypeContents, bindingOptions, data, propertyNames, openingBrace, false, true, Char.empty );
            addValueClickEvent( bindingOptions, titleText, data, DataType.object, false );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents object-type-contents-parent" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array main-title" : "main-title", _configuration.text!.arrayText! );
        let openingBracket: HTMLSpanElement = null!;

        if ( bindingOptions.showCounts ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${DataType.array} count` : "count", `[${data.length}]` );
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            openingBracket = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
        }

        renderArrayValues( arrow, null!, objectTypeContents, bindingOptions, data, openingBracket, false, true, Char.empty );
        addValueClickEvent( bindingOptions, titleText, data, DataType.object, false );
    }

    function renderObjectValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, propertyNames: string[], openingBrace: HTMLSpanElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string ) : void {
        const propertiesLength: number = propertyNames.length;

        for ( let propertyIndex: number = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
            const propertyName: string = propertyNames[ propertyIndex ];
            const newJsonPath: string = jsonPath === Char.empty ? propertyName : `${jsonPath}${Char.backslash}${propertyName}`;

            if ( data.hasOwnProperty( propertyName ) ) {
                renderValue( data, objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1, false, newJsonPath );
            }
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            createClosingSymbol( bindingOptions, objectTypeContents, "}", addNoArrowToClosingSymbol, isLastItem );
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBrace );
    }

    function renderArrayValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, openingBracket: HTMLSpanElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string ) : void {
        const dataLength: number = data.length;

        if ( !bindingOptions.reverseArrayValues ) {
            for ( let dataIndex1: number = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                const actualIndex: number = getArrayIndex( dataIndex1, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, getArrayIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1, true, newJsonPath );
            }

        } else {
            for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                const actualIndex: number = getArrayIndex( dataIndex2, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, getArrayIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex2 ], dataIndex2 === 0, true, newJsonPath );
            }
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            createClosingSymbol( bindingOptions, objectTypeContents, "]", addNoArrowToClosingSymbol, isLastItem );
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBracket );
    }

    function renderValue( data: any, container: HTMLElement, bindingOptions: BindingOptions, name: string, value: any, isLastItem: boolean, isArrayItem: boolean, jsonPath: string ) : void {
        const objectTypeValue: HTMLElement = DomElement.create( container, "div", "object-type-value" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeValue, "div", "no-arrow" ) : null!;
        let valueClass: string = null!;
        let valueElement: HTMLElement = null!;
        let ignored: boolean = false;
        let type: string = null!;
        const propertyName: HTMLSpanElement = DomElement.createWithHTML( objectTypeValue, "span", "title", name );
        let allowEditing: boolean = false;

        DomElement.createWithHTML( objectTypeValue, "span", "split", ":" );

        if ( !isArrayItem ) {
            makePropertyNameEditable( bindingOptions, data, name, propertyName );
        }

        if ( value === null ) {
            if ( !bindingOptions.ignore!.nullValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.null} value non-value` : "value non-value";
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
                valueClass = bindingOptions.showValueColors ? `${DataType.undefined} value non-value` : "value non-value";
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
                valueClass = bindingOptions.showValueColors ? `${DataType.function} value non-value` : "value non-value";
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
                valueClass = bindingOptions.showValueColors ? `${DataType.boolean} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.boolean;
                allowEditing = bindingOptions.allowEditing!.booleanValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

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

                valueClass = bindingOptions.showValueColors ? `${DataType.decimal} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newValue );
                type = DataType.decimal;
                allowEditing = bindingOptions.allowEditing!.decimalValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onDecimalRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDecimalRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedNumber( value ) ) {
            if ( !bindingOptions.ignore!.numberValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.number} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.number;
                allowEditing = bindingOptions.allowEditing!.numberValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onNumberRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onNumberRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBigInt( value ) ) {
            if ( !bindingOptions.ignore!.bigIntValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.bigint} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.bigint;
                allowEditing = bindingOptions.allowEditing!.bigIntValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onBigIntRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onBigIntRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.String.guid( value ) ) {
            if ( !bindingOptions.ignore!.guidValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.guid} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.guid;
                allowEditing = bindingOptions.allowEditing!.guidValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onGuidRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onGuidRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && ( Is.String.hexColor( value )|| Is.String.rgbColor( value ) ) ) {
            if ( !bindingOptions.ignore!.colorValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.color} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.color;
                allowEditing = bindingOptions.allowEditing!.colorValues!;

                if ( bindingOptions.showValueColors ) {
                    valueElement.style.color = value;
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onColorRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onColorRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) ) {
            if ( !bindingOptions.ignore!.stringValues ) {
                if ( bindingOptions.parse!.stringsToBooleans && Is.String.boolean( value ) ) {
                    renderValue( data, container, bindingOptions, name, value.toString().toLowerCase().trim() === "true", isLastItem, isArrayItem, jsonPath );
                    ignored = true;

                } else if ( bindingOptions.parse!.stringsToNumbers && !isNaN( value ) ) {
                    renderValue( data, container, bindingOptions, name, parseFloat( value ), isLastItem, isArrayItem, jsonPath );
                    ignored = true;

                } else if ( bindingOptions.parse!.stringsToDates && Is.String.date( value ) ) {
                    renderValue( data, container, bindingOptions, name, new Date( value ), isLastItem, isArrayItem, jsonPath );
                    ignored = true;

                } else {
                    if ( bindingOptions.maximumStringLength! > 0 && value.length > bindingOptions.maximumStringLength! ) {
                        value = value.substring( 0, bindingOptions.maximumStringLength ) + _configuration.text!.ellipsisText;
                    }
    
                    const newStringValue: string = bindingOptions.showStringQuotes ? `\"${value}\"` : value;
        
                    valueClass = bindingOptions.showValueColors ? `${DataType.string} value` : "value";
                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newStringValue );
                    type = DataType.string;
                    allowEditing = bindingOptions.allowEditing!.stringValues!;

                    makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
        
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
                valueClass = bindingOptions.showValueColors ? `${DataType.date} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                type = DataType.date;
                allowEditing = bindingOptions.allowEditing!.dateValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onDateRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDateRender!, valueElement );
                }
    
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedSymbol( value ) ) {
            if ( !bindingOptions.ignore!.symbolValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.symbol} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                type = DataType.symbol;

                if ( Is.definedFunction( bindingOptions.events!.onSymbolRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onSymbolRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedRegExp( value ) ) {
            if ( !bindingOptions.ignore!.regExpValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.regexp} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.source.toString() );
                type = DataType.regexp;

                if ( Is.definedFunction( bindingOptions.events!.onRegExpRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onRegExpRender!, valueElement );
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

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.object : Char.empty );
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

                    renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, value, propertyNames, openingBrace, true, isLastItem, jsonPath );
    
                    type = DataType.object;
                }

            } else {
                ignored = true;
            }


        } else if ( Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.arrayValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.array : Char.empty );
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
                
                renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, value, openingBracket, true, isLastItem, jsonPath );

                type = DataType.array;
                
            } else {
                ignored = true;
            }

        } else {
            if ( !bindingOptions.ignore!.unknownValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.unknown} value non-value` : "value non-value";
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
                addValueElementToolTip( bindingOptions, jsonPath, valueElement );
                addValueClickEvent( bindingOptions, valueElement, value, type, allowEditing );
            }
        }
    }

    function addValueElementToolTip( bindingOptions: BindingOptions, jsonPath: string, valueElement: HTMLElement ) : void {
        if ( Is.definedObject( bindingOptions.valueToolTips ) ) {
            if ( bindingOptions.valueToolTips!.hasOwnProperty( jsonPath ) ) {
                ToolTip.add( valueElement, bindingOptions, bindingOptions.valueToolTips![ jsonPath ], "jsontree-js-tooltip-value" );
            } else {

                const jsonPathParts: string[] = jsonPath.split( Char.backslash );
                const jsonPathPartsLength: number = jsonPathParts.length - 1;

                for ( let jsonPathPartIndex = 0; jsonPathPartIndex < jsonPathPartsLength; jsonPathPartIndex++ ) {
                    jsonPathParts[ jsonPathPartIndex ] = "..";
                }

                jsonPath = jsonPathParts.join( Char.backslash );

                if ( bindingOptions.valueToolTips!.hasOwnProperty( jsonPath ) ) {
                    ToolTip.add( valueElement, bindingOptions, bindingOptions.valueToolTips![ jsonPath ], "jsontree-js-tooltip-value" );
                }
            }
        }
    }

    function makePropertyNameEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, propertyName: HTMLSpanElement ) : void {
        if ( bindingOptions.allowEditing!.propertyNames ) {
            propertyName.ondblclick = () => {
                clearTimeout( bindingOptions._currentView.valueClickTimerId );
                
                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                DomElement.addClass( propertyName, "editable" );

                propertyName.setAttribute( "contenteditable", "true" );
                propertyName.focus();

                DomElement.selectAllText( propertyName );

                propertyName.onblur = () => renderControlContainer( bindingOptions, false );
    
                propertyName.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code == KeyCode.escape ) {
                        e.preventDefault();
                        propertyName.setAttribute( "contenteditable", "false" );

                    } else if ( e.code == KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyName: string = propertyName.innerText;

                        if ( newPropertyName !== originalPropertyName ) {
                            if ( newPropertyName.trim() === Char.empty ) {
                                delete data[ originalPropertyName ];
        
                            } else {
                                if ( !data.hasOwnProperty( newPropertyName ) ) {
                                    const originalValue: any = data[ originalPropertyName ];
            
                                    delete data[ originalPropertyName ];
            
                                    data[ newPropertyName ] = originalValue;
                                }
                            }
    
                            Trigger.customEvent( bindingOptions.events!.onJsonEdit!, bindingOptions._currentView.element );
                        }

                        propertyName.setAttribute( "contenteditable", "false" );
                    }
                };
            };
        }
    }

    function makePropertyValueEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, originalPropertyValue: any, propertyValue: HTMLSpanElement, isArrayItem: boolean, allowEditing: boolean ) : void {
        if ( allowEditing ) {
            propertyValue.ondblclick = () => {
                clearTimeout( bindingOptions._currentView.valueClickTimerId );

                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                DomElement.addClass( propertyValue, "editable" );

                propertyValue.setAttribute( "contenteditable", "true" );

                if ( Is.definedDate( originalPropertyValue ) && !bindingOptions.includeTimeZoneInDateTimeEditing ) {
                    propertyValue.innerText = JSON.stringify( originalPropertyValue ).replace( /['"]+/g, Char.empty );
                } else {
                    propertyValue.innerText = originalPropertyValue.toString();
                }
                
                propertyValue.focus();

                DomElement.selectAllText( propertyValue );

                propertyValue.onblur = () => renderControlContainer( bindingOptions, false );
    
                propertyValue.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code == KeyCode.escape ) {
                        e.preventDefault();
                        propertyValue.setAttribute( "contenteditable", "false" );
                        
                    } else if ( e.code == KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyValue: string = propertyValue.innerText;
    
                        if ( newPropertyValue.trim() === Char.empty ) {
                            if ( isArrayItem ) {
                                data.splice( getArrayIndexFromBrackets( originalPropertyName ), 1 );
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
                                    data[ getArrayIndexFromBrackets( originalPropertyName ) ] = newDataPropertyValue;
                                } else {
                                    data[ originalPropertyName ] = newDataPropertyValue;
                                }

                                Trigger.customEvent( bindingOptions.events!.onJsonEdit!, bindingOptions._currentView.element );
                            }
                        }

                        propertyValue.setAttribute( "contenteditable", "false" );
                    }
                };
            };
        }
    }

    function addValueClickEvent( bindingOptions: BindingOptions, valueElement: HTMLElement, value: any, type: string, allowEditing: boolean ) : void {
        if ( Is.definedFunction( bindingOptions.events!.onValueClick ) ) {
            valueElement.onclick = () => {
                if ( allowEditing ) {
                    bindingOptions._currentView.valueClickTimerId = setTimeout( () => {
                        if ( !bindingOptions._currentView.editMode ) {
                            Trigger.customEvent( bindingOptions.events!.onValueClick!, value, type );
                        }
                    }, bindingOptions.editingValueClickDelay );

                } else {
                    Trigger.customEvent( bindingOptions.events!.onValueClick!, value, type );
                }
            };

        } else {
            DomElement.addClass( valueElement, "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions: BindingOptions, arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, openingSymbol: HTMLSpanElement ) : void {
        if ( Is.defined( arrow ) ) {
            const panelId: number = bindingOptions._currentView.contentPanelsIndex;
            const dataArrayIndex: number = bindingOptions._currentView.dataArrayCurrentIndex;

            if ( !bindingOptions._currentView.contentPanelsOpen.hasOwnProperty( dataArrayIndex ) ) {
                bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ] = {} as ContentPanels;
            }

            const hideFunc: Function = () : void => {
                objectTypeContents.style.display = "none";
                arrow.className = "right-arrow";
                bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = true;

                if ( Is.defined( openingSymbol ) ) {
                    openingSymbol.style.display = "none";
                }

                if ( Is.defined( coma ) ) {
                    coma.style.display = "inline-block";
                }
            };

            const showFunc: Function = () : void => {
                objectTypeContents.style.display = "block";
                arrow.className = "down-arrow";
                bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = false;

                if ( Is.defined( openingSymbol ) ) {
                    openingSymbol.style.display = "inline-block";
                }

                if ( Is.defined( coma ) ) {
                    coma.style.display = "none";
                }
            };

            const conditionFunc: Function = ( condition: boolean ) : void => {
                if ( condition ) {
                    hideFunc();
                } else {
                    showFunc();
                }
            }

            let isClosed: boolean = bindingOptions.showAllAsClosed!;

            if ( bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ].hasOwnProperty( panelId ) ) {
                isClosed = bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ];
            } else {
                bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = isClosed;
            }

            arrow.onclick = () => conditionFunc( arrow.className === "down-arrow" );

            conditionFunc( isClosed );

            bindingOptions._currentView.contentPanelsIndex++;
        }
    }

    function createComma( bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean ) : HTMLSpanElement {
        let result: HTMLSpanElement = null!;

        if ( bindingOptions.showCommas && !isLastItem ) {
            result = DomElement.createWithHTML( objectTypeValue, "span", "comma", "," ) as HTMLSpanElement;
        }

        return result;
    }

    function getArrayIndex( index: number, bindingOptions: BindingOptions ) : number {
        return bindingOptions.useZeroIndexingForArrays ? index : index + 1;
    }
    
    function getArrayIndexName( bindingOptions: BindingOptions, index: number, largestValue: number ) : string {
        let result: string = index.toString();
    
        if ( !bindingOptions.addArrayIndexPadding ) {
            result = Str.padNumber( parseInt( result ), largestValue.toString().length );
        }

        if ( bindingOptions.showArrayIndexBrackets ) {
            result = `[${result}]`;
        }
    
        return result;
    }

    function getArrayIndexFromBrackets( propertyName: string ) : number {
        return parseInt( propertyName.replace( "[", Char.empty ).replace( "]", Char.empty ) );
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
            bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
            bindingOptions.data = renderData;

            renderControlContainer( bindingOptions );
            Trigger.customEvent( bindingOptions.events!.onSetJson!, bindingOptions._currentView.element );
        };
    
        reader.onload = ( e: ProgressEvent<FileReader> ) => {
            const json: StringToJson = Default.getObjectFromString( e.target!.result, _configuration );

            if ( json.parsed && Is.definedObject( json.object ) ) {
                renderData = json.object;
            }
        };

        reader.readAsText( file );
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:  Helpers:  Destroy
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    function destroyElement( bindingOptions: BindingOptions ) : void {
        bindingOptions._currentView.element.innerHTML = Char.empty;

        DomElement.removeClass( bindingOptions._currentView.element, "json-tree-js" );

        if ( bindingOptions._currentView.element.className.trim() === Char.empty ) {
            bindingOptions._currentView.element.removeAttribute( "class" );
        }

        if ( bindingOptions._currentView.idSet ) {
            bindingOptions._currentView.element.removeAttribute( "id" );
        }

        buildDocumentEvents( bindingOptions, false );

        ToolTip.assignToEvents( bindingOptions, false );
        ToolTip.remove( bindingOptions );
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
                onOpenAll( _elements_Data[ elementId ] );
            }
    
            return _public;
        },

        closeAll: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                onCloseAll( _elements_Data[ elementId ] );
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
                    const jsonResult: StringToJson = Default.getObjectFromString( json, _configuration );

                    if ( jsonResult.parsed ) {
                        jsonObject = jsonResult.object;
                    }

                } else {
                    jsonObject = json;
                }

                const bindingOptions: BindingOptions = _elements_Data[ elementId ];
    
                bindingOptions._currentView.dataArrayCurrentIndex = 0;
                bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
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
                _elements_Data_Count--;
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
            _elements_Data_Count = 0;

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
            return "2.8.2";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        document.addEventListener( "DOMContentLoaded", () => render() );

        if ( !Is.defined( window.$jsontree ) ) {
            window.$jsontree = _public;
        }
    } )();
} )();