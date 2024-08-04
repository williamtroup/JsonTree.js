/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions, type Configuration } from "./ts/type";
import { type PublicApi } from "./ts/api";
import { Default } from "./ts/data/default";
import { Is } from "./ts/data/is";
import { DomElement } from "./ts/dom/dom";
import { Char } from "./ts/data/enum";
import { DateTime } from "./ts/data/datetime";
import { Constants } from "./ts/constant";
import { Str } from "./ts/data/str";
import { Binding } from "./ts/options/binding";
import { Config } from "./ts/options/config";
import { Trigger } from "./ts/area/trigger";


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

    function renderControlContainer( bindingOptions: BindingOptions ) : void {
        let data: any = _elements_Data[ bindingOptions._currentView.element.id ].data;

        bindingOptions._currentView.element.innerHTML = Char.empty;

        renderControlTitleBar( bindingOptions, data );

        const contents: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "contents" );

        makeAreaDroppable( contents, bindingOptions );

        if ( bindingOptions.showArrayItemsAsSeparateObjects ) {
            data = data[ bindingOptions._currentView.dataArrayCurrentIndex ];
        }

        if ( Is.definedObject( data ) && !Is.definedArray( data ) ) {
            renderObject( contents, bindingOptions, data, true );
        } else if ( Is.definedArray( data ) ) {
            renderArray( contents, bindingOptions, data );
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
            const controls: HTMLElement = DomElement.create( titleBar, "div", "controls" );
        
            if ( bindingOptions.title!.show ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, controls );
            }

            if ( bindingOptions.title!.showCopyButton ) {
                const copy: HTMLButtonElement = DomElement.createWithHTML( controls, "button", "copy-all", _configuration.text!.copyAllButtonSymbolText! ) as HTMLButtonElement;
                copy.title = _configuration.text!.copyAllButtonText!

                copy.onclick = () => {
                    let copyData: string = null!;

                    if ( bindingOptions.copyOnlyCurrentPage && bindingOptions.showArrayItemsAsSeparateObjects ) {
                        copyData = JSON.stringify( _elements_Data[ bindingOptions._currentView.element.id ].data[ bindingOptions._currentView.dataArrayCurrentIndex ], null, 2 );
                    }
                    else {
                        copyData = JSON.stringify( _elements_Data[ bindingOptions._currentView.element.id ].data, null, 2 );
                    }

                    navigator.clipboard.writeText( copyData );

                    Trigger.customEvent( bindingOptions.events!.onCopyAll!, copyData );
                };
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAll: HTMLButtonElement = DomElement.createWithHTML( controls, "button", "openAll", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;
                openAll.title = _configuration.text!.openAllButtonText!

                const closeAll: HTMLButtonElement = DomElement.createWithHTML( controls, "button", "closeAll", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;
                closeAll.title = _configuration.text!.closeAllButtonText!

                openAll.onclick = () => {
                    openAllNodes( bindingOptions );
                };

                closeAll.onclick = () => {
                    closeAllNodes( bindingOptions );
                };
            }

            if ( bindingOptions.showArrayItemsAsSeparateObjects && Is.definedArray( data ) && data.length > 1 ) {
                const back: HTMLButtonElement = DomElement.createWithHTML( controls, "button", "back", _configuration.text!.backButtonSymbolText! ) as HTMLButtonElement;
                back.title = _configuration.text!.backButtonText!

                if ( bindingOptions._currentView.dataArrayCurrentIndex > 0 ) {
                    back.onclick = () => {
                        bindingOptions._currentView.dataArrayCurrentIndex--;
    
                        renderControlContainer( bindingOptions );
                    };

                } else {
                    back.disabled = true;
                }

                const next: HTMLButtonElement = DomElement.createWithHTML( controls, "button", "next", _configuration.text!.nextButtonSymbolText! ) as HTMLButtonElement;
                next.title = _configuration.text!.nextButtonText!

                if ( bindingOptions._currentView.dataArrayCurrentIndex < data.length - 1 ) {
                    next.onclick = () => {
                        bindingOptions._currentView.dataArrayCurrentIndex++;
                        
                        renderControlContainer( bindingOptions );
                    };

                } else {
                    next.disabled = true;
                }

            } else {
                bindingOptions.showArrayItemsAsSeparateObjects = false;
            }
        }
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

    function renderObject( container: HTMLElement, bindingOptions: BindingOptions, data: any, showPagingIndex: boolean = false ) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const propertyCount: number = renderObjectValues( arrow, objectTypeContents, bindingOptions, data );

        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object" : Char.empty, _configuration.text!.objectText! ) as HTMLSpanElement;

        if ( showPagingIndex && bindingOptions.showArrayItemsAsSeparateObjects ) {
            let dataArrayIndex: string = bindingOptions.useZeroIndexingForArrays ? bindingOptions._currentView.dataArrayCurrentIndex.toString() : ( bindingOptions._currentView.dataArrayCurrentIndex + 1 ).toString();

            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object data-array-index" : "data-array-index", `[${dataArrayIndex}]:`, titleText );
        }

        if ( bindingOptions.showCounts && propertyCount > 0 ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "object count" : "count", `{${propertyCount}}` );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;

        DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array" : Char.empty, _configuration.text!.arrayText! );

        renderArrayValues( arrow, objectTypeContents, bindingOptions, data );

        if ( bindingOptions.showCounts ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? "array count" : "count", `[${data.length}]` );
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
                    Trigger.customEvent( bindingOptions.events!.onNullRender!, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFunction( value ) ) {
            if ( !bindingOptions.ignore!.functionValues ) {
                valueClass = bindingOptions.showValueColors ? "function" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, Default.getFunctionName( value ) );
                type = "function";

                if ( Is.definedFunction( bindingOptions.events!.onFunctionRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onFunctionRender!, valueElement );
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
                    Trigger.customEvent( bindingOptions.events!.onBooleanRender!, valueElement );
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
                    Trigger.customEvent( bindingOptions.events!.onDecimalRender!, valueElement );
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
                    Trigger.customEvent( bindingOptions.events!.onNumberRender!, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) ) {
            if ( !bindingOptions.ignore!.stringValues ) {
                if ( bindingOptions.parseStringsToDates && DateTime.isDateValid( value ) ) {
                    renderValue( container, bindingOptions, name, new Date( value ), isLastItem );
                    ignored = true;

                } else {
                    let color: string = null!;

                    if ( bindingOptions.showValueColors && bindingOptions.showStringHexColors && Is.hexColor( value ) ) {
                        color = value;
    
                    } else {
                        if ( bindingOptions.maximumStringLength! > 0 && value.length > bindingOptions.maximumStringLength! ) {
                            value = value.substring( 0, bindingOptions.maximumStringLength ) + _configuration.text!.ellipsisText;
                        }
                    }
    
                    const newStringValue: string = bindingOptions.showStringQuotes ? `\"${value}\"` : value;
        
                    valueClass = bindingOptions.showValueColors ? "string" : Char.empty;
                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newStringValue );
                    type = "string";
    
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
                valueClass = bindingOptions.showValueColors ? "date" : Char.empty;
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                type = "date";

                if ( Is.definedFunction( bindingOptions.events!.onDateRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDateRender!, valueElement );
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

                DomElement.createWithHTML( objectTitle, "span", "title", _configuration.text!.objectText! );

                if ( bindingOptions.showCounts && propertyCount > 0 ) {
                    DomElement.createWithHTML( objectTitle, "span", "count", `{${propertyCount}}` );
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

                DomElement.createWithHTML( arrayTitle, "span", "title", _configuration.text!.arrayText! );

                if ( bindingOptions.showCounts ) {
                    DomElement.createWithHTML( arrayTitle, "span", "count", `[${value.length}]` );
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
                addValueClickEvent( bindingOptions, valueElement, value, type, addClickEvent );
            }
        }
    }

    function addValueClickEvent( bindingOptions: BindingOptions, valueElement: HTMLElement, value: any, type: string, addClickEvent: boolean ) : void {
        if ( addClickEvent && Is.definedFunction( bindingOptions.events!.onValueClick ) ) {
            valueElement.onclick = () => {
                Trigger.customEvent( bindingOptions.events!.onValueClick!, value, type );
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
    
        return `[${result}]`;
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
            return "2.2.0";
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