/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        jsontree.ts
 * @version     v3.0.0
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
import { Arr } from "./ts/data/arr";


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

        if ( bindingOptions.openInFullScreenMode ) {
            DomElement.addClass( bindingOptions._currentView.element, "full-screen" );
            bindingOptions._currentView.fullScreenOn = true;
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
        bindingOptions._currentView.sideMenuChanged = false;

        renderControlTitleBar( bindingOptions, data );
        renderControlSideMenu( bindingOptions );

        const contents: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "contents" );

        if ( isForPageSwitch ) {
            DomElement.addClass( contents, "page-switch" );
        }

        if ( bindingOptions.showArrayItemsAsSeparateObjects && Is.definedArray( data ) ) {
            data = data[ bindingOptions._currentView.dataArrayCurrentIndex ];
        }

        if ( Is.definedArray( data ) || Is.definedSet( data ) ) {
            renderArray( contents, bindingOptions, data );
        } else if ( Is.definedObject( data ) ) {
            renderObject( contents, bindingOptions, data );
        }

        if ( contents.innerHTML === Char.empty || ( contents.children.length >= 2 && contents.children[ 1 ].children.length === 0 ) ) {
            contents.innerHTML = Char.empty;

            DomElement.createWithHTML( contents, "span", "no-json-text", _configuration.text!.noJsonToViewText! );

            bindingOptions._currentView.titleBarButtons.style.display = "none";

        } else {
            bindingOptions._currentView.titleBarButtons.style.display = "block";
        }

        renderControlDragAndDrop( bindingOptions );
        makeContentsEditable( bindingOptions, data, contents );
    }

    function makeContentsEditable( bindingOptions: BindingOptions, data: any, contents: HTMLElement ) : void {
        if ( bindingOptions._currentView.isBulkEditingEnabled ) {
            contents.ondblclick = ( e: MouseEvent ) => {
                DomElement.cancelBubble( e );

                clearTimeout( bindingOptions._currentView.valueClickTimerId );

                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                DomElement.addClass( contents, "editable" );

                contents.setAttribute( "contenteditable", "true" );
                contents.innerText = JSON.stringify( data, jsonStringifyReplacer, bindingOptions.editableJsonIndentSpaces );
                contents.focus();

                DomElement.selectAllText( contents );

                contents.onblur = () => renderControlContainer( bindingOptions, false );
    
                contents.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code == KeyCode.escape ) {
                        e.preventDefault();
                        contents.setAttribute( "contenteditable", "false" );
                        
                    } else if ( e.code == KeyCode.enter ) {
                        e.preventDefault();
    
                        const newValue: string = contents.innerText;
                        const newData: StringToJson = Default.getObjectFromString( newValue, _configuration );

                        if ( newData.parsed ) {
                            if ( bindingOptions.showArrayItemsAsSeparateObjects ) {
                                bindingOptions.data[ bindingOptions._currentView.dataArrayCurrentIndex ] = newData.object;
                            } else {
                                bindingOptions.data = newData.object;
                            }
                        }

                        contents.setAttribute( "contenteditable", "false" );
                    }
                };
            };
        }
    }

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions: BindingOptions, data: any ) : void {
        if ( Is.definedString( bindingOptions.title!.text ) || bindingOptions.title!.showTreeControls || bindingOptions.title!.showCopyButton || bindingOptions.sideMenu!.enabled || bindingOptions.showArrayItemsAsSeparateObjects || bindingOptions.title!.enableFullScreenToggling ) {
            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "title-bar" );

            if ( bindingOptions.title!.enableFullScreenToggling ) {
                titleBar.ondblclick = () => onTitleBarDblClick( bindingOptions );
            }

            if ( bindingOptions.sideMenu!.enabled && Is.definedObject( data ) ) {
                const sideMenuButton: HTMLButtonElement = DomElement.createWithHTML( titleBar, "button", "side-menu", _configuration.text!.sideMenuButtonSymbolText! ) as HTMLButtonElement;
                sideMenuButton.onclick = () => onSideMenuOpen( bindingOptions );
                sideMenuButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( sideMenuButton, bindingOptions, _configuration.text!.sideMenuButtonText! );
            }

            bindingOptions._currentView.titleBarButtons = DomElement.create( titleBar, "div", "controls" );
        
            if ( Is.definedString( bindingOptions.title!.text ) ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, bindingOptions._currentView.titleBarButtons );
            }

            if ( bindingOptions.title!.showCopyButton ) {
                const copyButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "copy-all", _configuration.text!.copyAllButtonSymbolText! ) as HTMLButtonElement;
                copyButton.onclick = () => onTitleBarCopyClick( bindingOptions, data );
                copyButton.ondblclick = DomElement.cancelBubble;

                if ( bindingOptions.copyOnlyCurrentPage && bindingOptions.showArrayItemsAsSeparateObjects ) {
                    ToolTip.add( copyButton, bindingOptions, _configuration.text!.copyButtonText! );
                }
                else {
                    ToolTip.add( copyButton, bindingOptions, _configuration.text!.copyAllButtonText! );
                }
            }

            if ( bindingOptions.title!.showTreeControls ) {
                const openAllButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "openAll", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;
                openAllButton.onclick = () => onOpenAll( bindingOptions );
                openAllButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( openAllButton, bindingOptions, _configuration.text!.openAllButtonText! );

                const closeAllButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "closeAll", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;
                closeAllButton.onclick = () => onCloseAll( bindingOptions );
                closeAllButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( closeAllButton, bindingOptions, _configuration.text!.closeAllButtonText! );
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

            if ( bindingOptions.title!.enableFullScreenToggling && bindingOptions.title!.showFullScreenButton ) {
                const buttonText: string = !bindingOptions._currentView.fullScreenOn
                    ? _configuration.text!.fullScreenOnButtonSymbolText!
                    : _configuration.text!.fullScreenOffButtonSymbolText!

                bindingOptions._currentView.toggleFullScreenButton = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "toggle-full-screen", buttonText ) as HTMLButtonElement;
                bindingOptions._currentView.toggleFullScreenButton.onclick = () => onTitleBarDblClick( bindingOptions );
                bindingOptions._currentView.toggleFullScreenButton.ondblclick = DomElement.cancelBubble;
    
                ToolTip.add( bindingOptions._currentView.toggleFullScreenButton, bindingOptions, _configuration.text!.fullScreenButtonText! );
            }
        }
    }

    function onTitleBarDblClick( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.title!.enableFullScreenToggling ) {
            if ( bindingOptions._currentView.element.classList.contains( "full-screen" ) ) {
                DomElement.removeClass( bindingOptions._currentView.element, "full-screen" );
                bindingOptions._currentView.toggleFullScreenButton.innerHTML = _configuration.text!.fullScreenOnButtonSymbolText!
                bindingOptions._currentView.fullScreenOn = false;
            } else {
                DomElement.addClass( bindingOptions._currentView.element, "full-screen" );
                bindingOptions._currentView.toggleFullScreenButton.innerHTML = _configuration.text!.fullScreenOffButtonSymbolText!
                bindingOptions._currentView.fullScreenOn = true;
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
     * Render:  Side Menu
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlSideMenu( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.sideMenu!.enabled ) {
            bindingOptions._currentView.disabledBackground = DomElement.create( bindingOptions._currentView.element, "div", "side-menu-disabled-background" );
            bindingOptions._currentView.disabledBackground.onclick = () => onSideMenuClose( bindingOptions );
            bindingOptions._currentView.sideMenu = DomElement.create( bindingOptions._currentView.element, "div", "side-menu" );

            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.sideMenu, "div", "side-menu-title-bar" );

            if ( Is.definedString( bindingOptions.sideMenu!.titleText ) ) {
                const titleBarText: HTMLElement = DomElement.create( titleBar, "div", "side-menu-title-bar-text" );
                titleBarText.innerHTML = bindingOptions.sideMenu!.titleText!;
            }
            
            const titleBarControls: HTMLElement = DomElement.create( titleBar, "div", "side-menu-title-controls" );

            if ( bindingOptions.sideMenu!.showExportButton ) {
                const exportButton: HTMLButtonElement = DomElement.createWithHTML( titleBarControls, "button", "export", _configuration.text!.exportButtonSymbolText! ) as HTMLButtonElement;
                exportButton.onclick = () => onExport( bindingOptions );
    
                ToolTip.add( exportButton, bindingOptions, _configuration.text!.exportButtonText! );
            }

            if ( bindingOptions.sideMenu!.showImportButton ) {
                const importButton: HTMLButtonElement = DomElement.createWithHTML( titleBarControls, "button", "import", _configuration.text!.importButtonSymbolText! ) as HTMLButtonElement;
                importButton.onclick = () => onSideMenuImportClick( bindingOptions );
    
                ToolTip.add( importButton, bindingOptions, _configuration.text!.importButtonText! );
            }

            const closeButton: HTMLButtonElement = DomElement.createWithHTML( titleBarControls, "button", "close", _configuration.text!.closeButtonSymbolText! ) as HTMLButtonElement;
            closeButton.onclick = () => onSideMenuClose( bindingOptions );

            ToolTip.add( closeButton, bindingOptions, _configuration.text!.closeButtonText! );

            const contents: HTMLElement = DomElement.create( bindingOptions._currentView.sideMenu, "div", "side-menu-contents" );

            addSideMenuIgnoreTypes( contents, bindingOptions );
        }
    }

    function onSideMenuImportClick( bindingOptions: BindingOptions ) : void {
        const input: HTMLInputElement = DomElement.createWithNoContainer( "input" ) as HTMLInputElement;
        input.type = "file";
        input.accept = ".json";
        input.multiple = true;
        input.onchange = () => importFromFiles( input.files!, bindingOptions );

        input.click();
    }

    function onSideMenuOpen( bindingOptions: BindingOptions ) : void {
        if ( !bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.add( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "block";
        }
    }

    function onSideMenuClose( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.remove( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "none";
    
            if ( bindingOptions._currentView.sideMenuChanged ) {
                renderControlContainer( bindingOptions );
            }
        }
    }

    function addSideMenuIgnoreTypes( contents: HTMLElement, bindingOptions: BindingOptions ) : void {
        const checkboxes: HTMLInputElement[] = [];
        const ignoreTypes: HTMLElement = DomElement.create( contents, "div", "settings-panel" );
        const titleBar: HTMLElement = DomElement.create( ignoreTypes, "div", "settings-panel-title-bar" );

        DomElement.createWithHTML( titleBar, "div", "settings-panel-title-text", `${_configuration.text!.showTypesText!}:` );
        const controlButtons: HTMLElement = DomElement.create( titleBar, "div", "settings-panel-control-buttons" );

        const selectAll: HTMLElement = DomElement.create( controlButtons, "div", "settings-panel-control-button settings-panel-fill" );
        const selectNone: HTMLElement = DomElement.create( controlButtons, "div", "settings-panel-control-button" );

        selectAll.onclick = () => changeSidePanelCheckboxSelection( bindingOptions, checkboxes, true );
        selectNone.onclick = () => changeSidePanelCheckboxSelection( bindingOptions, checkboxes, false );

        ToolTip.add( selectAll, bindingOptions, _configuration.text!.selectAllText! );
        ToolTip.add( selectNone, bindingOptions, _configuration.text!.selectNoneText! );

        const ignoreTypesContent: HTMLElement = DomElement.create( ignoreTypes, "div", "settings-panel-contents" );
        const dataTypes: string[] = Object.keys( DataType );
        const ignore: any = bindingOptions.ignore;

        dataTypes.sort();

        dataTypes.forEach( ( key: string, _: any ) => {
            checkboxes.push( createSideMenuIgnoreTypeCheckBox( ignoreTypesContent, key, bindingOptions, !ignore[ `${key}Values` ] ) );
        } );
    }

    function changeSidePanelCheckboxSelection( bindingOptions: BindingOptions, checkboxes: HTMLInputElement[], flag: boolean ) : void {
        const checkboxesLength: number = checkboxes.length;
        const ignoreTypes: any = bindingOptions.ignore;

        for ( let checkboxIndex: number = 0; checkboxIndex < checkboxesLength; checkboxIndex++ ) {
            checkboxes[ checkboxIndex ].checked = flag;
            ignoreTypes[ `${checkboxes[ checkboxIndex ].name}Values` ] = !flag;
        }

        bindingOptions._currentView.sideMenuChanged = true;
    }

    function createSideMenuIgnoreTypeCheckBox( ignoreTypesContent: HTMLElement, key: string, bindingOptions: BindingOptions, checked: boolean ) : HTMLInputElement {
        const input: HTMLInputElement = DomElement.createCheckBox( ignoreTypesContent, Str.capitalizeFirstLetter( key ), key, checked, bindingOptions.showValueColors ? key : Char.empty );

        input.onchange = () => {
            const ignoreTypes: any = bindingOptions.ignore;

            ignoreTypes[ `${key}Values` ] = !input.checked;

            bindingOptions.ignore = ignoreTypes;
            bindingOptions._currentView.sideMenuChanged = true;
        };

        return input;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Tree
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const isMap: boolean = Is.definedMap( data );
        const type: string = isMap ? DataType.map : DataType.object;
        const objectData: object = isMap ? Default.getObjectFromMap( data ) : data;
        const propertyNames: string[] = getObjectPropertyNames( objectData, bindingOptions );
        const propertyCount: number = propertyNames.length;

        if ( propertyCount !== 0 || !bindingOptions.ignore!.emptyObjects ) {
            const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
            const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents last-item" );
            const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
            const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${type} main-title` : "main-title", isMap ? _configuration.text!.mapText! : _configuration.text!.objectText! ) as HTMLSpanElement;
            let openingBrace: HTMLSpanElement = null!;

            if ( bindingOptions.showArrayItemsAsSeparateObjects ) {
                let dataArrayIndex: string = bindingOptions.useZeroIndexingForArrays ? bindingOptions._currentView.dataArrayCurrentIndex.toString() : ( bindingOptions._currentView.dataArrayCurrentIndex + 1 ).toString();
    
                if ( bindingOptions.showArrayIndexBrackets ) {
                    dataArrayIndex = `[${dataArrayIndex}]${Char.space}:`;
                }

                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${type} data-array-index` : "data-array-index", dataArrayIndex, titleText );
            }
    
            if ( bindingOptions.showCounts && propertyCount > 0 ) {
                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${type} count` : "count", `{${propertyCount}}` );
            }

            if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                openingBrace = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
            }

            renderObjectValues( arrow, null!, objectTypeContents, bindingOptions, objectData, propertyNames, openingBrace, false, true, Char.empty );
            addValueClickEvent( bindingOptions, titleText, data, type, false );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any ) : void {
        const isSet: boolean = Is.definedSet( data );
        const type: string = isSet ? DataType.set : DataType.array;
        const setData: any[] = isSet ? Default.getArrayFromSet( data ) : data;
        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents last-item" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${type} main-title` : "main-title", isSet ? _configuration.text!.setText! : _configuration.text!.arrayText! );
        let openingBracket: HTMLSpanElement = null!;

        if ( bindingOptions.showCounts ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${type} count` : "count", `[${setData.length}]` );
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            openingBracket = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
        }

        renderArrayValues( arrow, null!, objectTypeContents, bindingOptions, setData, openingBracket, false, true, Char.empty );
        addValueClickEvent( bindingOptions, titleText, data, type, false );
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
                const actualIndex: number = Arr.getIndex( dataIndex1, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1, true, newJsonPath );
            }

        } else {
            for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                const actualIndex: number = Arr.getIndex( dataIndex2, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex2 ], dataIndex2 === 0, true, newJsonPath );
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
        const nameElement: HTMLSpanElement = DomElement.create( objectTypeValue, "span", "title" );
        let allowEditing: boolean = false;
        let typeElement: HTMLSpanElement = null!;
        
        if ( isArrayItem || !bindingOptions.showPropertyNameQuotes ) {
            nameElement.innerHTML = name;
        } else {
            nameElement.innerHTML = `\"${name}\"`;
        }

        if ( isLastItem ) {
            DomElement.addClass( objectTypeValue, "last-item" );
        }

        if ( bindingOptions.showTypes ) {
            typeElement = DomElement.createWithHTML( objectTypeValue, "span", bindingOptions.showValueColors ? "type-color" : "type", Char.empty ) as HTMLSpanElement;
        }

        DomElement.createWithHTML( objectTypeValue, "span", "split", ":" );

        makePropertyNameEditable( bindingOptions, data, name, nameElement, isArrayItem );

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
            if ( !bindingOptions.ignore!.bigintValues ) {
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

        } else if ( Is.definedString( value ) && Is.definedUrl( value ) ) {
            if ( !bindingOptions.ignore!.urlValues ) {
                valueClass = bindingOptions.showValueColors ? `${DataType.url} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                type = DataType.url;
                allowEditing = bindingOptions.allowEditing!.urlValues!;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onUrlRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUrlRender!, valueElement );
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
            if ( !bindingOptions.ignore!.regexpValues ) {
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

        } else if ( Is.definedSet( value ) ) {
            if ( !bindingOptions.ignore!.setValues ) {
                const arrayValues: any[] = Default.getArrayFromSet( value );
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.set : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                let openingBracket: HTMLSpanElement = null!;

                if ( isLastItem ) {
                    DomElement.addClass( arrayTypeContents, "last-item" );
                }

                valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.setText! );
                type = DataType.set;

                if ( bindingOptions.showCounts ) {
                    DomElement.createWithHTML( objectTitle, "span", "count", `[${arrayValues.length}]` );
                }

                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
                }

                let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                
                renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, arrayValues, openingBracket, true, isLastItem, jsonPath );
                
            } else {
                ignored = true;
            }

        } else if ( Is.definedArray( value ) ) {
            if ( !bindingOptions.ignore!.arrayValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.array : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                let openingBracket: HTMLSpanElement = null!;

                if ( isLastItem ) {
                    DomElement.addClass( arrayTypeContents, "last-item" );
                }

                valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.arrayText! );
                type = DataType.array;

                if ( bindingOptions.showCounts ) {
                    DomElement.createWithHTML( objectTitle, "span", "count", `[${value.length}]` );
                }

                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement
                }

                let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                
                renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, value, openingBracket, true, isLastItem, jsonPath );
                
            } else {
                ignored = true;
            }

        } else if ( Is.definedMap( value ) ) {
            if ( !bindingOptions.ignore!.mapValues ) {
                const valueObject: object = Default.getObjectFromMap( value );
                const propertyNames: string[] = getObjectPropertyNames( valueObject, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.map : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;

                    if ( isLastItem ) {
                        DomElement.addClass( objectTypeContents, "last-item" );
                    }

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.mapText! );
                    type = DataType.map;

                    if ( bindingOptions.showCounts && propertyCount > 0 ) {
                        DomElement.createWithHTML( objectTitle, "span", "count", `{${propertyCount}}` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, valueObject, propertyNames, openingBrace, true, isLastItem, jsonPath );
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedObject( value ) ) {
            if ( !bindingOptions.ignore!.objectValues ) {
                const propertyNames: string[] = getObjectPropertyNames( value, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? DataType.object : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;

                    if ( isLastItem ) {
                        DomElement.addClass( objectTypeContents, "last-item" );
                    }

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.objectText! );
                    type = DataType.object;

                    if ( bindingOptions.showCounts && propertyCount > 0 ) {
                        DomElement.createWithHTML( objectTitle, "span", "count", `{${propertyCount}}` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, value, propertyNames, openingBrace, true, isLastItem, jsonPath );
                }

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
                if ( Is.defined( typeElement ) ) {
                    if ( type !== DataType.null && type !== DataType.undefined && type !== DataType.array && type !== DataType.object && type !== DataType.map && type !== DataType.set ) {
                        typeElement.innerHTML = `(${type})`;
                    } else {
                        typeElement.parentNode!.removeChild( typeElement );
                        typeElement = null!;
                    }
                }

                addValueElementToolTip( bindingOptions, jsonPath, nameElement, typeElement, valueElement );
                addValueClickEvent( bindingOptions, valueElement, value, type, allowEditing );
            }
        }
    }

    function addValueElementToolTip( bindingOptions: BindingOptions, jsonPath: string, nameElement: HTMLSpanElement, typeElement: HTMLSpanElement, valueElement: HTMLElement ) : void {
        if ( Is.definedObject( bindingOptions.valueToolTips ) ) {
            if ( bindingOptions.logJsonValueToolTipPaths ) {
                console.log( jsonPath );
            }

            if ( !bindingOptions.valueToolTips!.hasOwnProperty( jsonPath ) ) {
                const jsonPathParts: string[] = jsonPath.split( Char.backslash );
                const jsonPathPartsLength: number = jsonPathParts.length - 1;

                for ( let jsonPathPartIndex = 0; jsonPathPartIndex < jsonPathPartsLength; jsonPathPartIndex++ ) {
                    jsonPathParts[ jsonPathPartIndex ] = "..";
                }

                jsonPath = jsonPathParts.join( Char.backslash );
            }

            if ( bindingOptions.valueToolTips!.hasOwnProperty( jsonPath ) ) {
                ToolTip.add( nameElement, bindingOptions, bindingOptions.valueToolTips![ jsonPath ], "jsontree-js-tooltip-value" );
                ToolTip.add( typeElement, bindingOptions, bindingOptions.valueToolTips![ jsonPath ], "jsontree-js-tooltip-value" );
                ToolTip.add( valueElement, bindingOptions, bindingOptions.valueToolTips![ jsonPath ], "jsontree-js-tooltip-value" );
            }
        }
    }

    function makePropertyNameEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, propertyName: HTMLSpanElement, isArrayItem: boolean ) : void {
        if ( bindingOptions.allowEditing!.propertyNames ) {
            propertyName.ondblclick = ( e: MouseEvent ) => {
                DomElement.cancelBubble( e );

                let originalArrayIndex: number = 0;

                clearTimeout( bindingOptions._currentView.valueClickTimerId );
                
                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                DomElement.addClass( propertyName, "editable" );

                if ( isArrayItem ) {
                    originalArrayIndex = Arr.getIndexFromBrackets( propertyName.innerHTML );
                    
                    propertyName.innerHTML = originalArrayIndex.toString();
                    
                } else {
                    propertyName.innerHTML = propertyName.innerHTML.replace( /['"]+/g, Char.empty );
                }
                
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

                        if ( isArrayItem ) {
                            if ( !isNaN( +newPropertyName ) ) {
                                let newArrayIndex: number = +newPropertyName;

                                if ( !bindingOptions.useZeroIndexingForArrays ) {
                                    newArrayIndex--;
                                }

                                if ( originalArrayIndex !== newArrayIndex ) {
                                    Arr.moveIndex( data, originalArrayIndex, newArrayIndex );
                                    Trigger.customEvent( bindingOptions.events!.onJsonEdit!, bindingOptions._currentView.element );
                                }
                            }

                        } else {
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
                        }

                        propertyName.setAttribute( "contenteditable", "false" );
                    }
                };
            };
        }
    }

    function makePropertyValueEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, originalPropertyValue: any, propertyValue: HTMLSpanElement, isArrayItem: boolean, allowEditing: boolean ) : void {
        if ( allowEditing ) {
            propertyValue.ondblclick = ( e: MouseEvent ) => {
                DomElement.cancelBubble( e );

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
                                data.splice( Arr.getIndexFromBrackets( originalPropertyName ), 1 );
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
                                    data[ Arr.getIndexFromBrackets( originalPropertyName ) ] = newDataPropertyValue;
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
        const panelId: number = bindingOptions._currentView.contentPanelsIndex;
        const dataArrayIndex: number = bindingOptions._currentView.dataArrayCurrentIndex;

        if ( !bindingOptions._currentView.contentPanelsOpen.hasOwnProperty( dataArrayIndex ) ) {
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ] = {} as ContentPanels;
        }

        const hideFunc: Function = () : void => {
            objectTypeContents.style.display = "none";
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = true;

            if ( Is.defined( arrow ) ) {
                arrow.className = "right-arrow";
            }

            if ( Is.defined( openingSymbol ) ) {
                openingSymbol.style.display = "none";
            }

            if ( Is.defined( coma ) ) {
                coma.style.display = "inline-block";
            }
        };

        const showFunc: Function = () : void => {
            objectTypeContents.style.display = "block";
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = false;

            if ( Is.defined( arrow ) ) {
                arrow.className = "down-arrow";
            }

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

        if ( Is.defined( arrow ) ) {
            arrow.onclick = () => conditionFunc( arrow.className === "down-arrow" );
        }

        conditionFunc( isClosed );

        bindingOptions._currentView.contentPanelsIndex++;
    }

    function createComma( bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean ) : HTMLSpanElement {
        let result: HTMLSpanElement = null!;

        if ( bindingOptions.showCommas && !isLastItem ) {
            result = DomElement.createWithHTML( objectTypeValue, "span", "comma", "," ) as HTMLSpanElement;
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
        
        if ( addNoArrow && bindingOptions.showArrowToggles ) {
            DomElement.create( symbolContainer, "div", "no-arrow" );
        }
        
        DomElement.createWithHTML( symbolContainer, "div", "object-type-end", symbol );

        createComma( bindingOptions, symbolContainer, isLastItem )
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Import / Drag & Drop Files
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlDragAndDrop( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.fileDroppingEnabled ) {
            const dragAndDropBackground: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "drag-and-drop-background" );
            const dragAndDropText: HTMLElement = DomElement.create( dragAndDropBackground, "div", "notice-text" );

            DomElement.createWithHTML( dragAndDropText, "p", "notice-text-symbol", _configuration.text!.dragAndDropSymbolText! );
            DomElement.createWithHTML( dragAndDropText, "p", "notice-text-title", _configuration.text!.dragAndDropTitleText! );
            DomElement.createWithHTML( dragAndDropText, "p", "notice-text-description", _configuration.text!.dragAndDropDescriptionText! );

            bindingOptions._currentView.dragAndDropBackground = dragAndDropBackground;
            bindingOptions._currentView.element.ondragover = () => dragAndDropBackground.style.display = "block";
            bindingOptions._currentView.element.ondragenter = () => dragAndDropBackground.style.display = "block";

            dragAndDropBackground.ondragover = DomElement.cancelBubble;
            dragAndDropBackground.ondragenter = DomElement.cancelBubble;
            dragAndDropBackground.ondragleave = () => dragAndDropBackground.style.display = "none";
            dragAndDropBackground.ondrop = ( e: DragEvent ) => onDropFiles( e, bindingOptions );
        }
    }

    function onDropFiles( e: DragEvent, bindingOptions: BindingOptions ) : void {
        DomElement.cancelBubble( e );

        bindingOptions._currentView.dragAndDropBackground.style.display = "none";

        if ( Is.defined( window.FileReader ) && e.dataTransfer!.files.length > 0 ) {
            importFromFiles( e.dataTransfer!.files, bindingOptions );
        }
    }

    function importFromFiles( files: FileList, bindingOptions: BindingOptions ) : void {
        const filesLength: number = files.length;
        let filesRead: number = 0;
        let filesData: any[] = [];

        const onFileLoad: Function = ( data: any ) => {
            filesRead++;
            filesData.push( data );

            if ( filesRead === filesLength ) {
                bindingOptions._currentView.dataArrayCurrentIndex = 0;
                bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
                bindingOptions.data = filesData.length === 1 ? filesData[ 0 ] : filesData;
    
                renderControlContainer( bindingOptions );
                Trigger.customEvent( bindingOptions.events!.onSetJson!, bindingOptions._currentView.element );
            }
        };

        for ( let fileIndex: number = 0; fileIndex < filesLength; fileIndex++ ) {
            const file: File = files[ fileIndex ];
            const fileExtension: string = file!.name!.split( "." )!.pop()!.toLowerCase();

            if ( fileExtension === "json" ) {
                importFromJson( file, onFileLoad );
            }
        }
    }

    function importFromJson( file: File, onFileLoad: Function ) : void {
        const reader: FileReader = new FileReader();
        let renderData: any = null as any;

        reader.onloadend = () => onFileLoad( renderData );
    
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
     * Export
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function onExport( bindingOptions: BindingOptions ) : void {
        let contents: string = JSON.stringify( bindingOptions.data, jsonStringifyReplacer, bindingOptions.copyIndentSpaces );

        if ( Is.definedString( contents ) ) {
            const tempLink: HTMLElement = DomElement.create( document.body, "a" );
            tempLink.style.display = "none";
            tempLink.setAttribute( "target", "_blank" );
            tempLink.setAttribute( "href", `data:application/json;charset=utf-8,${encodeURIComponent(contents)}` );
            tempLink.setAttribute( "download", getExportFilename( bindingOptions ) );
            tempLink.click();
            
            document.body.removeChild( tempLink );

            Trigger.customEvent( bindingOptions.events!.onExport!, bindingOptions._currentView.element );
        }
    }

    function getExportFilename( bindingOptions: BindingOptions ) : string {
        const date: Date = new Date();
        const filename: string = DateTime.getCustomFormattedDateText( _configuration, date, bindingOptions.exportFilenameFormat! )

        return filename;
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
            if ( isCommandKey( e ) && e.code === KeyCode.f11 ) {
                e.preventDefault();
                onTitleBarDblClick( bindingOptions );

            } else if ( e.code === KeyCode.left ) {
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

            } else if ( e.code === KeyCode.escape ) {
                e.preventDefault();
                onSideMenuClose( bindingOptions );
            }
        }
    }

    function isCommandKey( e: KeyboardEvent ) : boolean {
        return e.ctrlKey || e.metaKey;
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
            return "3.0.0";
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