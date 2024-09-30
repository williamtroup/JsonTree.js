/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        jsontree.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type StringToJson,
    type BindingOptions,
    type Configuration,
    type ContentPanelsForArrayIndex,
    type ContentPanels, 
    type FunctionName, 
    type BindingOptionsCurrentView } from "./ts/type";
    
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
import { Size } from "./ts/data/size";
import { Obj } from "./ts/data/obj";
import { Convert } from "./ts/data/convert";


type JsonTreeData = Record<string, BindingOptions>;


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Data
    let _elements_Data: JsonTreeData = {} as JsonTreeData;
    let _elements_Data_Count: number = 0;

    let _jsonStringifyReplacer: any = ( key: string, value: any ) : any => {
        return Convert.stringifyJson( key, value, _configuration );
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() : void {
        DomElement.find( _configuration.domElementTypes as string[], ( element: HTMLElement ) => {
            let result: boolean = true;

            if ( Is.defined( element ) && element.hasAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME ) ) {
                const bindingOptionsData: string = element.getAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME )!;
    
                if ( Is.definedString( bindingOptionsData ) ) {
                    const bindingOptions: StringToJson = Convert.jsonStringToObject( bindingOptionsData, _configuration );
    
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
        } );
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
            bindingOptions._currentView.element.classList.add( "full-screen" );
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

        if ( Is.definedUrl( data ) ) {
            Default.getObjectFromUrl( data, _configuration, ( ajaxData: any ) => {
                renderControlContainerForData( bindingOptions, isForPageSwitch, ajaxData );
            } );

        } else {
            renderControlContainerForData( bindingOptions, isForPageSwitch, data );
        }
    }

    function renderControlContainerForData( bindingOptions: BindingOptions, isForPageSwitch: boolean, data: any ) : void {
        const scrollTopsForColumns: number[] = getContentColumnScrollTops( bindingOptions );
        
        ToolTip.hide( bindingOptions );

        bindingOptions._currentView.element.innerHTML = Char.empty;
        bindingOptions._currentView.editMode = false;
        bindingOptions._currentView.contentPanelsIndex = 0;
        bindingOptions._currentView.sideMenuChanged = false;
        bindingOptions._currentView.contentColumns = [];
        bindingOptions._currentView.dataTypeCounts = {} as Record<string, number>;
        bindingOptions._currentView.contentControlButtons = [];

        renderControlTitleBar( bindingOptions, data );

        const contents: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "contents" );

        if ( isForPageSwitch ) {
            contents.classList.add( "page-switch" );
        }

        if ( bindingOptions.paging!.enabled && Is.definedArray( data ) ) {
            const allowColumnReordering: boolean = Is.defined( data[ bindingOptions._currentView.dataArrayCurrentIndex + 1 ] );

            for ( let pageIndex: number = 0; pageIndex < bindingOptions.paging!.columnsPerPage!; pageIndex++ ) {
                const actualDataIndex: number = pageIndex + bindingOptions._currentView.dataArrayCurrentIndex;
                const actualData: any = data[ actualDataIndex ];

                bindingOptions._currentView.contentPanelsIndex = 0;
                bindingOptions._currentView.contentPanelsDataIndex = actualDataIndex;

                if ( Is.defined( actualData ) ) {
                    renderControlContentsPanel( actualData, contents, bindingOptions, actualDataIndex, scrollTopsForColumns[ pageIndex ], bindingOptions.paging!.columnsPerPage!, allowColumnReordering );
                }
            }

        } else {
            bindingOptions._currentView.contentPanelsIndex = 0;
            bindingOptions._currentView.contentPanelsDataIndex = 0;

            renderControlContentsPanel( data, contents, bindingOptions, null!, scrollTopsForColumns[ 0 ], 1, false );
        }

        renderControlSideMenu( bindingOptions );
        renderControlFooterBar( bindingOptions );
        renderControlDragAndDrop( bindingOptions );

        bindingOptions._currentView.initialized = true;
    }

    function renderControlContentsPanel( data: any, contents: HTMLElement, bindingOptions: BindingOptions, dataIndex: number, scrollTop: number, totalColumns: number, enableColumnOrder: boolean ) : void {
        const contentsColumn: HTMLElement = DomElement.create( contents, "div", totalColumns > 1 ? "contents-column-multiple" : "contents-column" );
        
        if ( !Is.defined( data ) ) {
            const noJson: HTMLElement = DomElement.create( contentsColumn, "div", "no-json" );
            DomElement.createWithHTML( noJson, "span", "no-json-text", _configuration.text!.noJsonToViewText! );

            if ( bindingOptions.sideMenu!.showImportButton ) {
                const importText: HTMLSpanElement = DomElement.createWithHTML( noJson, "span", "no-json-import-text", `${_configuration.text!.importButtonText!}${_configuration.text!.ellipsisText!}` ) as HTMLSpanElement;
                importText.onclick = () => onSideMenuImportClick( bindingOptions );
            }
        } else {
            
            contentsColumn.onscroll = () => onContentsColumnScroll( contentsColumn, bindingOptions, dataIndex );

            if ( bindingOptions.paging!.enabled && Is.definedNumber( dataIndex ) ) {
                contentsColumn.setAttribute( Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, dataIndex.toString() );
            }
    
            if ( enableColumnOrder && bindingOptions.paging!.allowColumnReordering && bindingOptions.paging!.columnsPerPage! > 1 && bindingOptions.allowEditing!.bulk ) {
                contentsColumn.setAttribute( "draggable", "true" );
                contentsColumn.ondragstart = () => onContentsColumnDragStart( contentsColumn, bindingOptions, dataIndex );
                contentsColumn.ondragend = () => onContentsColumnDragEnd( contentsColumn, bindingOptions );
                contentsColumn.ondragover = ( e: DragEvent ) => e.preventDefault();
                contentsColumn.ondrop = () => onContentsColumnDrop( bindingOptions, dataIndex );
            }
    
            bindingOptions._currentView.contentColumns.push( contentsColumn );
    
            if ( Is.definedArray( data ) ) {
                renderArray( contentsColumn, bindingOptions, data, DataType.array );
            } else if ( Is.definedSet( data ) ) {
                renderArray( contentsColumn, bindingOptions, Convert.setToArray( data ), DataType.set );
            } else if ( Is.definedHtml( data ) ) {
                renderObject( contentsColumn, bindingOptions, Convert.htmlToObject( data, bindingOptions.showCssStylesForHtmlObjects! ), dataIndex, DataType.html );
            } else if ( Is.definedMap( data ) ) {
                renderObject( contentsColumn, bindingOptions, Convert.mapToObject( data ), dataIndex, DataType.map );
            } else if ( Is.definedObject( data ) ) {
                renderObject( contentsColumn, bindingOptions, data, dataIndex, DataType.object );
            }

            renderControlContentsControlButtons( bindingOptions, contentsColumn, data, dataIndex );
    
            if ( Is.defined( scrollTop ) ) {
                contentsColumn.scrollTop = scrollTop;
            }
    
            bindingOptions._currentView.titleBarButtons.style.display = "block";
    
            if ( bindingOptions.allowEditing!.bulk ) {
                contentsColumn.ondblclick = ( e: MouseEvent ) => {
                    enableContentsColumnEditMode( e, bindingOptions, data, contentsColumn, dataIndex );
                };
            }
        }
    }

    function enableContentsColumnEditMode( e: MouseEvent, bindingOptions: BindingOptions, data: any, contentsColumn: HTMLElement, dataIndex: number ) : void {
        let statusBarMessage: string = null!;

        if ( Is.defined( e ) ) {
            DomElement.cancelBubble( e );
        }

        clearTimeout( bindingOptions._currentView.valueClickTimerId );

        bindingOptions._currentView.valueClickTimerId = 0;
        bindingOptions._currentView.editMode = true;

        contentsColumn.classList.add( "editable" );
        contentsColumn.setAttribute( "contenteditable", "true" );
        contentsColumn.setAttribute( "draggable", "false" );
        contentsColumn.innerText = JSON.stringify( data, _jsonStringifyReplacer, bindingOptions.jsonIndentSpaces );
        contentsColumn.focus();

        DomElement.selectAllText( contentsColumn );

        contentsColumn.onblur = () => {
            renderControlContainer( bindingOptions, false );

            if ( Is.definedString( statusBarMessage ) ) {
                setFooterStatusText( bindingOptions, statusBarMessage );
            }
        };

        contentsColumn.onkeydown = ( e: KeyboardEvent ) => {
            if ( e.code === KeyCode.escape ) {
                e.preventDefault();
                contentsColumn.setAttribute( "contenteditable", "false" );

            } else if ( isCommandKey( e ) && e.code === KeyCode.enter ) {
                e.preventDefault();

                const newValue: string = contentsColumn.innerText;
                const newData: StringToJson = Convert.jsonStringToObject( newValue, _configuration );

                if ( newData.parsed ) {
                    statusBarMessage = _configuration.text!.jsonUpdatedText!;

                    if ( bindingOptions.paging!.enabled ) {
                        if ( Is.defined( newData.object ) ) {
                            bindingOptions.data[ dataIndex ] = newData.object;

                        } else {
                            bindingOptions.data.splice( dataIndex, 1 );
                            statusBarMessage = _configuration.text!.arrayJsonItemDeleted!;

                            if ( dataIndex === bindingOptions._currentView.dataArrayCurrentIndex && bindingOptions._currentView.dataArrayCurrentIndex > 0 ) {
                                bindingOptions._currentView.dataArrayCurrentIndex -= bindingOptions.paging!.columnsPerPage!
                            }
                        }
                        
                    } else {
                        bindingOptions.data = newData.object;
                    }
                }

                contentsColumn.setAttribute( "contenteditable", "false" );
                
            } else if ( e.code === KeyCode.enter ) {
                e.preventDefault();
                document.execCommand( "insertLineBreak" );    
            }
        };
    }

    function getContentColumnScrollTops( bindingOptions: BindingOptions ) : number[] {
        const result: number[] = [];
        
        ToolTip.hide( bindingOptions );

        if ( bindingOptions._currentView.editMode || bindingOptions._currentView.sideMenuChanged ) {
            const contentColumnsLength: number = bindingOptions._currentView.contentColumns.length;

            for ( let contentColumnIndex: number = 0; contentColumnIndex < contentColumnsLength; contentColumnIndex++ ) {
                result.push( bindingOptions._currentView.contentColumns[ contentColumnIndex ].scrollTop );
            }
        }

        return result;
    }

    function onContentsColumnScroll( column: HTMLElement, bindingOptions: BindingOptions, dataIndex: number ) : void {
        ToolTip.hide( bindingOptions );

        const scrollTop: number = column.scrollTop;
        const scrollLeft: number = column.scrollLeft;
        const columnsLength: number = bindingOptions._currentView.contentColumns.length;

        if ( bindingOptions.controlPanel!.enabled ) {
            const controlButtons: HTMLElement = bindingOptions._currentView.contentControlButtons[ dataIndex ];

            if ( Is.defined( controlButtons ) ) {
                controlButtons.style.top = `${bindingOptions._currentView.contentColumns[ dataIndex ].scrollTop}px`;
                controlButtons.style.right = `-${bindingOptions._currentView.contentColumns[ dataIndex ].scrollLeft}px`;
            }
        }

        if ( bindingOptions.paging!.synchronizeScrolling ) {
            for ( let columnIndex: number = 0; columnIndex < columnsLength; columnIndex++ ) {
                if ( dataIndex !== columnIndex ) {
                    bindingOptions._currentView.contentColumns[ columnIndex ].scrollTop = scrollTop;
                    bindingOptions._currentView.contentColumns[ columnIndex ].scrollLeft = scrollLeft;
                }
            }
        }

        if ( bindingOptions.controlPanel!.enabled ) {
            for ( let columnIndex: number = 0; columnIndex < columnsLength; columnIndex++ ) {
                if ( dataIndex !== columnIndex ) {
                    const controlButtons: HTMLElement = bindingOptions._currentView.contentControlButtons[ columnIndex ];
                    
                    if ( Is.defined( controlButtons ) ) {
                        controlButtons.style.top = `${bindingOptions._currentView.contentColumns[ columnIndex ].scrollTop}px`;
                        controlButtons.style.right = `-${bindingOptions._currentView.contentColumns[ columnIndex ].scrollLeft}px`;
                    }
                }
            }
        }
    }

    function onContentsColumnDragStart( column: HTMLElement, bindingOptions: BindingOptions, dataIndex: number ) : void {
        bindingOptions._currentView.columnDragging = true;
        bindingOptions._currentView.columnDraggingDataIndex = dataIndex;

        column.classList.add( "draggable-item" );
    }

    function onContentsColumnDragEnd( column: HTMLElement, bindingOptions: BindingOptions ) : void {
        bindingOptions._currentView.columnDragging = false;

        column.classList.remove( "draggable-item" );
    }

    function onContentsColumnDrop( bindingOptions: BindingOptions, dataIndex: number ) : void {
        bindingOptions._currentView.columnDragging = false;

        moveDataArrayIndex( bindingOptions, bindingOptions._currentView.columnDraggingDataIndex, dataIndex );
    }

    function moveDataArrayIndex( bindingOptions: BindingOptions, oldIndex: number, newIndex: number ) : void {
        if ( oldIndex !== newIndex ) {
            const dataArray1: any = bindingOptions.data[ newIndex ];
            const dataArray2: any = bindingOptions.data[ oldIndex ];
            let dataPanelsOpen1: ContentPanels = bindingOptions._currentView.contentPanelsOpen[ newIndex ];
            let dataPanelsOpen2: ContentPanels = bindingOptions._currentView.contentPanelsOpen[ oldIndex ];

            if ( !Is.defined( dataPanelsOpen1 ) ) {
                dataPanelsOpen1 = {} as ContentPanels;
            }

            if ( !Is.defined( dataPanelsOpen2 ) ) {
                dataPanelsOpen2 = {} as ContentPanels;
            }
    
            bindingOptions.data[ newIndex ] = dataArray2;
            bindingOptions.data[ oldIndex  ] = dataArray1;
    
            bindingOptions._currentView.contentPanelsOpen[ newIndex ] = dataPanelsOpen2;
            bindingOptions._currentView.contentPanelsOpen[ oldIndex ] = dataPanelsOpen1;

            if ( ( bindingOptions._currentView.dataArrayCurrentIndex + ( bindingOptions.paging!.columnsPerPage! - 1 ) ) < newIndex ) {
                bindingOptions._currentView.dataArrayCurrentIndex += bindingOptions.paging!.columnsPerPage!;
            } else if ( newIndex < bindingOptions._currentView.dataArrayCurrentIndex ) {
                bindingOptions._currentView.dataArrayCurrentIndex -= bindingOptions.paging!.columnsPerPage!;
            }

            renderControlContainer( bindingOptions );
            setFooterStatusText( bindingOptions, _configuration.text!.jsonUpdatedText! );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Control Buttons Panel
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlContentsControlButtons( bindingOptions: BindingOptions, contentsColumn: HTMLElement, data: any, dataIndex: number ) : void {
        const controlButtons: HTMLElement = DomElement.create( contentsColumn, "div", "column-control-buttons" );
        controlButtons.ondblclick = DomElement.cancelBubble;

        const isPagingEnabled: boolean = bindingOptions.paging!.enabled! && Is.definedArray( bindingOptions.data ) && bindingOptions.data.length > 1;

        if ( bindingOptions.allowEditing!.bulk && bindingOptions.controlPanel!.showEditButton ) {
            const editButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "edit", _configuration.text!.editSymbolButtonText! ) as HTMLButtonElement;
            editButton.onclick = () => enableContentsColumnEditMode( null!, bindingOptions, data, contentsColumn, dataIndex );;
            editButton.ondblclick = DomElement.cancelBubble;
    
            ToolTip.add( editButton, bindingOptions, _configuration.text!.editButtonText! );
        }

        if ( isPagingEnabled && bindingOptions.allowEditing!.bulk && bindingOptions.paging!.allowColumnReordering && bindingOptions.controlPanel!.showMovingButtons ) {
            const moveRightButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "move-right", _configuration.text!.moveRightSymbolButtonText! ) as HTMLButtonElement;
            moveRightButton.ondblclick = DomElement.cancelBubble;

            if ( ( dataIndex + 1 ) > bindingOptions.data.length - 1 ) {
                moveRightButton.disabled = true;
            } else {
                moveRightButton.onclick = () => moveDataArrayIndex( bindingOptions, dataIndex, dataIndex + 1 );
            }
    
            ToolTip.add( moveRightButton, bindingOptions, _configuration.text!.moveRightButtonText! );
    
            const moveLeftButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "move-left", _configuration.text!.moveLeftSymbolButtonText! ) as HTMLButtonElement;
            moveLeftButton.ondblclick = DomElement.cancelBubble;

            if ( ( dataIndex - 1 ) < 0 ) {
                moveLeftButton.disabled = true;
            } else {
                moveLeftButton.onclick = () => moveDataArrayIndex( bindingOptions, dataIndex, dataIndex - 1 );
            }
    
            ToolTip.add( moveLeftButton, bindingOptions, _configuration.text!.moveLeftButtonText! );
        }

        if ( isPagingEnabled && bindingOptions.controlPanel!.showCopyButton ) {
            const copyButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "copy", _configuration.text!.copyButtonSymbolText! ) as HTMLButtonElement;
            copyButton.onclick = () => onCopy( bindingOptions, data );
            copyButton.ondblclick = DomElement.cancelBubble;
        
            ToolTip.add( copyButton, bindingOptions, _configuration.text!.copyButtonText! );
        }

        if ( isPagingEnabled && bindingOptions.controlPanel!.showCloseOpenAllButtons ) {
            const openAllButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "open-all", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;
            openAllButton.onclick = () => onOpenAllForPage( bindingOptions, dataIndex );
            openAllButton.ondblclick = DomElement.cancelBubble;

            ToolTip.add( openAllButton, bindingOptions, _configuration.text!.openAllButtonText! );

            const closeAllButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "close-all", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;
            closeAllButton.onclick = () => onCloseAllForPage( bindingOptions, dataIndex );
            closeAllButton.ondblclick = DomElement.cancelBubble;

            ToolTip.add( closeAllButton, bindingOptions, _configuration.text!.closeAllButtonText! );
        }

        if ( bindingOptions.allowEditing!.bulk && bindingOptions.controlPanel!.showRemoveButton ) {
            const removeButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "remove", _configuration.text!.removeSymbolButtonText! ) as HTMLButtonElement;
            removeButton.onclick = () => onRemoveArrayJson( bindingOptions, dataIndex );
            removeButton.ondblclick = DomElement.cancelBubble;
    
            ToolTip.add( removeButton, bindingOptions, _configuration.text!.removeButtonText! );
        }

        if ( !bindingOptions.paging!.enabled && Is.definedArray( bindingOptions.data ) && bindingOptions.data.length > 1 && bindingOptions.controlPanel!.showSwitchToPagesButton ) {
            const switchToPagesButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "switch-to-pages", _configuration.text!.switchToPagesSymbolText! ) as HTMLButtonElement;
            switchToPagesButton.onclick = () => onSwitchToPages( bindingOptions );
            switchToPagesButton.ondblclick = DomElement.cancelBubble;

            ToolTip.add( switchToPagesButton, bindingOptions, _configuration.text!.switchToPagesText! );
        }

        if ( controlButtons.innerHTML !== Char.empty ) {
            bindingOptions._currentView.contentControlButtons.push( controlButtons );
            contentsColumn.style.minHeight = `${controlButtons.offsetHeight}px`;

        } else {
            contentsColumn.removeChild( controlButtons );
        }
    }

    function onSwitchToPages( bindingOptions: BindingOptions ) : void {
        bindingOptions.paging!.enabled = true;

        renderControlContainer( bindingOptions );
    }

    function onOpenAllForPage( bindingOptions: BindingOptions, dataIndex: number ) : void {
        const panels: ContentPanels = bindingOptions._currentView.contentPanelsOpen[ dataIndex ];

        for ( const panelId in panels ) {
            if ( panels.hasOwnProperty( panelId ) ) {
                panels[ panelId ] = false;
            }
        }

        renderControlContainer( bindingOptions );
    }

    function onCloseAllForPage( bindingOptions: BindingOptions, dataIndex: number ) : void {
        const panels: ContentPanels = bindingOptions._currentView.contentPanelsOpen[ dataIndex ];

        for ( const panelId in panels ) {
            if ( panels.hasOwnProperty( panelId ) ) {
                panels[ panelId ] = true;
            }
        }

        renderControlContainer( bindingOptions );
    }

    function onRemoveArrayJson( bindingOptions: BindingOptions, dataIndex: number ) : void {
        if ( bindingOptions.paging!.enabled ) {
            bindingOptions.data.splice( dataIndex, 1 );

            if ( dataIndex === bindingOptions._currentView.dataArrayCurrentIndex && bindingOptions._currentView.dataArrayCurrentIndex > 0 ) {
                bindingOptions._currentView.dataArrayCurrentIndex -= bindingOptions.paging!.columnsPerPage!
            }

        } else {
            bindingOptions.data = null;
        }

        renderControlContainer( bindingOptions );
        setFooterStatusText( bindingOptions, _configuration.text!.arrayJsonItemDeleted! );
    }

    function onCopy( bindingOptions: BindingOptions, data: any ) : void {
        let replaceFunction: any = _jsonStringifyReplacer;

        if ( Is.definedFunction( bindingOptions.events!.onCopyJsonReplacer ) ) {
            replaceFunction = bindingOptions.events!.onCopyJsonReplacer!;
        }

        let copyDataJson: string  = JSON.stringify( data, replaceFunction, bindingOptions.jsonIndentSpaces );

        navigator.clipboard.writeText( copyDataJson );

        setFooterStatusText( bindingOptions, _configuration.text!.copiedText! );
        Trigger.customEvent( bindingOptions.events!.onCopy!, bindingOptions._currentView.element, copyDataJson );
    }

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions: BindingOptions, data: any ) : void {
        if ( Is.definedString( bindingOptions.title!.text ) || bindingOptions.title!.showCloseOpenAllButtons || bindingOptions.title!.showCopyButton || bindingOptions.sideMenu!.enabled || bindingOptions.paging!.enabled || bindingOptions.title!.enableFullScreenToggling ) {
            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "title-bar" );

            if ( bindingOptions.title!.enableFullScreenToggling ) {
                titleBar.ondblclick = () => onTitleBarDblClick( bindingOptions );
            }

            if ( bindingOptions.sideMenu!.enabled ) {
                const sideMenuButton: HTMLButtonElement = DomElement.createWithHTML( titleBar, "button", "side-menu", _configuration.text!.sideMenuButtonSymbolText! ) as HTMLButtonElement;
                sideMenuButton.onclick = () => onSideMenuOpen( bindingOptions );
                sideMenuButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( sideMenuButton, bindingOptions, _configuration.text!.sideMenuButtonText! );
            }

            bindingOptions._currentView.titleBarButtons = DomElement.create( titleBar, "div", "controls" );
        
            if ( Is.definedString( bindingOptions.title!.text ) ) {
                DomElement.createWithHTML( titleBar, "div", "title", bindingOptions.title!.text!, bindingOptions._currentView.titleBarButtons );
            }

            if ( bindingOptions.title!.showCopyButton && Is.defined( data ) ) {
                const copyButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "copy-all", _configuration.text!.copyButtonSymbolText! ) as HTMLButtonElement;
                copyButton.onclick = () => onTitleBarCopyAllClick( bindingOptions, data );
                copyButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( copyButton, bindingOptions, _configuration.text!.copyAllButtonText! );
            }

            if ( bindingOptions.title!.showCloseOpenAllButtons && Is.defined( data ) ) {
                const openAllButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "open-all", _configuration.text!.openAllButtonSymbolText! ) as HTMLButtonElement;
                openAllButton.onclick = () => onOpenAll( bindingOptions );
                openAllButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( openAllButton, bindingOptions, _configuration.text!.openAllButtonText! );

                const closeAllButton: HTMLButtonElement = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "close-all", _configuration.text!.closeAllButtonSymbolText! ) as HTMLButtonElement;
                closeAllButton.onclick = () => onCloseAll( bindingOptions );
                closeAllButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( closeAllButton, bindingOptions, _configuration.text!.closeAllButtonText! );
            }

            if ( bindingOptions.paging!.enabled && Is.definedArray( data ) && data.length > 1 ) {
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

                if ( ( bindingOptions._currentView.dataArrayCurrentIndex + ( bindingOptions.paging!.columnsPerPage! - 1 ) ) < data.length - 1 ) {
                    bindingOptions._currentView.nextButton.onclick = () => onNextPage( bindingOptions );
                } else {
                    bindingOptions._currentView.nextButton.disabled = true;
                }

            } else {
                if ( Is.definedArray( data ) ) {
                    bindingOptions.paging!.enabled = false;
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
                bindingOptions._currentView.element.classList.remove( "full-screen" );
                bindingOptions._currentView.toggleFullScreenButton.innerHTML = _configuration.text!.fullScreenOnButtonSymbolText!
                bindingOptions._currentView.fullScreenOn = false;
            } else {
                bindingOptions._currentView.element.classList.add( "full-screen" );
                bindingOptions._currentView.toggleFullScreenButton.innerHTML = _configuration.text!.fullScreenOffButtonSymbolText!
                bindingOptions._currentView.fullScreenOn = true;
            }
            
            ToolTip.hide( bindingOptions );
            updateFooterDisplay( bindingOptions );
            Trigger.customEvent( bindingOptions.events!.onFullScreenChange!, bindingOptions._currentView.element, bindingOptions._currentView.element.classList.contains( "full-screen" ) );
        }
    }

    function onTitleBarCopyAllClick( bindingOptions: BindingOptions, data: any ) : void {
        let replaceFunction: any = _jsonStringifyReplacer;

        if ( Is.definedFunction( bindingOptions.events!.onCopyJsonReplacer ) ) {
            replaceFunction = bindingOptions.events!.onCopyJsonReplacer!;
        }

        let copyDataJson: string = JSON.stringify( data, replaceFunction, bindingOptions.jsonIndentSpaces );

        navigator.clipboard.writeText( copyDataJson );

        setFooterStatusText( bindingOptions, _configuration.text!.copiedText! );
        Trigger.customEvent( bindingOptions.events!.onCopyAll!, bindingOptions._currentView.element, copyDataJson );
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
            bindingOptions._currentView.dataArrayCurrentIndex -= bindingOptions.paging!.columnsPerPage!;
    
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onBackPage!, bindingOptions._currentView.element );
        }
    }

    function onNextPage( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.nextButton !== null && !bindingOptions._currentView.nextButton.disabled ) {
            bindingOptions._currentView.dataArrayCurrentIndex += bindingOptions.paging!.columnsPerPage!;
                        
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onNextPage!, bindingOptions._currentView.element );
        }
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

            if ( bindingOptions.sideMenu!.showExportButton && Is.definedObject( bindingOptions.data ) ) {
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

            if ( Is.definedObject( bindingOptions.data ) ) {
                const contents: HTMLElement = DomElement.create( bindingOptions._currentView.sideMenu, "div", "side-menu-contents" );

                addSideMenuIgnoreTypes( contents, bindingOptions );
            }
        }
    }

    function onSideMenuImportClick( bindingOptions: BindingOptions ) : void {
        const input: HTMLInputElement = DomElement.createWithNoContainer( "input" ) as HTMLInputElement;
        input.type = "file";
        input.accept = ".json";
        input.multiple = true;

        onSideMenuClose( bindingOptions );

        input.onchange = () => importFromFiles( input.files!, bindingOptions );
        input.click();
    }

    function onSideMenuOpen( bindingOptions: BindingOptions ) : void {
        if ( !bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.add( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "block";

            ToolTip.hide( bindingOptions );
        }
    }

    function onSideMenuClose( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.remove( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "none";

            ToolTip.hide( bindingOptions );
    
            if ( bindingOptions._currentView.sideMenuChanged ) {
                setTimeout( () => {
                    renderControlContainer( bindingOptions );
                    setFooterStatusText( bindingOptions, _configuration.text!.ignoreDataTypesUpdated! );
                }, 500 );
            }
        }
    }

    function addSideMenuIgnoreTypes( contents: HTMLElement, bindingOptions: BindingOptions ) : void {
        const checkboxes: HTMLInputElement[] = [];
        const ignoreTypes: HTMLElement = DomElement.create( contents, "div", "settings-panel" );
        const titleBar: HTMLElement = DomElement.create( ignoreTypes, "div", "settings-panel-title-bar" );

        DomElement.createWithHTML( titleBar, "div", "settings-panel-title-text", `${_configuration.text!.showDataTypesText!}:` );
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
            const input: HTMLInputElement = createSideMenuIgnoreTypeCheckBox( ignoreTypesContent, key, bindingOptions, !ignore[ `${key}Values` ] );

            if ( Is.defined( input ) ) {
                checkboxes.push( input );
            }
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
        let result: HTMLInputElement = null!;
        const dataTypeDisplayCount: number = bindingOptions._currentView.dataTypeCounts[ key ];

        if ( !bindingOptions.sideMenu!.showOnlyDataTypesAvailable || dataTypeDisplayCount > 0 ) {
            let checkBoxName: string = Str.capitalizeFirstLetter( key );
            let checkBoxAdditionalText: string = Char.empty;
            
            if ( bindingOptions.sideMenu!.showAvailableDataTypeCounts ) {
                if ( bindingOptions._currentView.dataTypeCounts.hasOwnProperty( key ) ) {
                    checkBoxAdditionalText = `(${dataTypeDisplayCount})`;
                }
            }
    
            result = DomElement.createCheckBox( ignoreTypesContent, checkBoxName, key, checked, bindingOptions.showValueColors ? key : Char.empty, checkBoxAdditionalText );
    
            result.onchange = () => {
                const ignoreTypes: any = bindingOptions.ignore;
    
                ignoreTypes[ `${key}Values` ] = !result.checked;
    
                bindingOptions.ignore = ignoreTypes;
                bindingOptions._currentView.sideMenuChanged = true;
            };
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Footer Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlFooterBar( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.footer!.enabled && Is.defined( bindingOptions.data ) ) {
            bindingOptions._currentView.footer = DomElement.create( bindingOptions._currentView.element, "div", "footer-bar" );
            
            updateFooterDisplay( bindingOptions );

            bindingOptions._currentView.footerStatusText = DomElement.createWithHTML( bindingOptions._currentView.footer, "div", "status-text", _configuration.text!.waitingText! );
            
            if ( bindingOptions.footer!.showDataTypes ) {
                bindingOptions._currentView.footerDataTypeText = DomElement.create( bindingOptions._currentView.footer, "div", "status-value-data-type" );
                bindingOptions._currentView.footerDataTypeText.style.display = "none";
            }

            if ( bindingOptions.footer!.showLengths ) {
                bindingOptions._currentView.footerLengthText = DomElement.create( bindingOptions._currentView.footer, "div", "status-value-length" );
                bindingOptions._currentView.footerLengthText.style.display = "none";
            }

            if ( bindingOptions.footer!.showSizes ) {
                bindingOptions._currentView.footerSizeText = DomElement.create( bindingOptions._currentView.footer, "div", "status-value-size" );
                bindingOptions._currentView.footerSizeText.style.display = "none";
            }

            if ( bindingOptions.paging!.enabled && Is.definedArray( bindingOptions.data ) && bindingOptions.data.length > 1 && bindingOptions.footer!.showPageOf ) {
                bindingOptions._currentView.footerPageText = DomElement.create( bindingOptions._currentView.footer, "div", "status-page-index" );

                getFooterPageText( bindingOptions );
            }
        }
    }

    function getFooterPageText( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.paging!.enabled ) {
            const currentPage: number = Math.ceil( ( bindingOptions._currentView.dataArrayCurrentIndex + 1 ) / bindingOptions.paging!.columnsPerPage! );
            const totalPages: number = Math.ceil( bindingOptions.data.length / bindingOptions.paging!.columnsPerPage! );
            const currentReplacement: string = DomElement.createWithHTML( null!, "span", "status-count", currentPage.toFixed() ).outerHTML;
            const totalReplacement: string = DomElement.createWithHTML( null!, "span", "status-count", totalPages.toFixed() ).outerHTML;
            const text: string = _configuration.text!.pageOfText!.replace( "{0}", currentReplacement ).replace( "{1}", totalReplacement );

            bindingOptions._currentView.footerPageText.innerHTML = text;
        }
    }

    function updateFooterDisplay( bindingOptions: BindingOptions ) : void {
        if ( Is.defined( bindingOptions._currentView.footer ) ) {
            bindingOptions._currentView.footer.style.display = bindingOptions._currentView.fullScreenOn ? "flex" : "none";
        }
    }

    function addFooterDataTypeStatus( bindingOptions: BindingOptions, dataType: string, valueElement: HTMLElement ) : void {
        if ( bindingOptions.footer!.enabled && bindingOptions.footer!.showDataTypes ) {
            valueElement.addEventListener( "mousemove", () => {
                const replacement: string = DomElement.createWithHTML( null!, "span", "status-count", dataType ).outerHTML;
                const sizeText: string = _configuration.text!.dataTypeText!.replace( "{0}", replacement );

                bindingOptions._currentView.footerDataTypeText.style.display = "block";
                bindingOptions._currentView.footerDataTypeText.innerHTML = sizeText;

            } );

            valueElement.addEventListener( "mouseleave", () => {
                bindingOptions._currentView.footerDataTypeText.style.display = "none";
                bindingOptions._currentView.footerDataTypeText.innerHTML = Char.empty;
            } );
        }
    }

    function addFooterLengthStatus( bindingOptions: BindingOptions, value: any, valueElement: HTMLElement ) : void {
        if ( bindingOptions.footer!.enabled && bindingOptions.footer!.showLengths ) {
            const length: number = Size.length( value );

            if ( length > 0 ) {
                valueElement.addEventListener( "mousemove", () => {
                    const replacement: string = DomElement.createWithHTML( null!, "span", "status-count", length.toString() ).outerHTML;
                    const sizeText: string = _configuration.text!.lengthText!.replace( "{0}", replacement );

                    bindingOptions._currentView.footerLengthText.style.display = "block";
                    bindingOptions._currentView.footerLengthText.innerHTML = sizeText;

                } );

                valueElement.addEventListener( "mouseleave", () => {
                    bindingOptions._currentView.footerLengthText.style.display = "none";
                    bindingOptions._currentView.footerLengthText.innerHTML = Char.empty;
                } );
            }
        }
    }

    function addFooterSizeStatus( bindingOptions: BindingOptions, value: any, valueElement: HTMLElement ) : void {
        if ( bindingOptions.footer!.enabled && bindingOptions.footer!.showSizes ) {
            const size: string = Size.of( value );

            if ( Is.definedString( size ) ) {
                valueElement.addEventListener( "mousemove", () => {
                    const replacement: string = DomElement.createWithHTML( null!, "span", "status-count", size.toString() ).outerHTML;
                    const sizeText: string = _configuration.text!.sizeText!.replace( "{0}", replacement );

                    bindingOptions._currentView.footerSizeText.style.display = "block";
                    bindingOptions._currentView.footerSizeText.innerHTML = sizeText;
                } );
                
                valueElement.addEventListener( "mouseleave", () => {
                    bindingOptions._currentView.footerSizeText.style.display = "none";
                    bindingOptions._currentView.footerSizeText.innerHTML = Char.empty;
                } );
            }
        }
    }

    function setFooterStatusText( bindingOptions: BindingOptions, statusText: string ) : void {
        if ( bindingOptions.footer!.enabled ) {
            bindingOptions._currentView.footerStatusText.innerHTML = statusText;

            clearTimeout( bindingOptions._currentView.footerStatusTextTimerId );
    
            bindingOptions._currentView.footerStatusTextTimerId = setTimeout( () => {
                bindingOptions._currentView.footerStatusText.innerHTML = _configuration.text!.waitingText!
            }, bindingOptions.footer!.statusResetDelay );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Contents
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObject( container: HTMLElement, bindingOptions: BindingOptions, data: any, dataIndex: number, dataType: string ) : void {
        const propertyNames: string[] = Obj.getPropertyNames( data, bindingOptions );
        const propertyCount: number = propertyNames.length;

        if ( propertyCount !== 0 || !bindingOptions.ignore!.emptyObjects ) {
            let mainTitle: string = null!;

            if ( dataType === DataType.object ) {
                mainTitle = _configuration.text!.objectText!;
            } else if ( dataType === DataType.map ) {
                mainTitle = _configuration.text!.mapText!;
            } else if ( dataType === DataType.html ) {
                mainTitle = _configuration.text!.htmlText!;
            }

            const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
            const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents last-item" );
            const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
            const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} main-title` : "main-title", mainTitle ) as HTMLSpanElement;
            let openingBrace: HTMLSpanElement = null!;
            let closedBraces: HTMLSpanElement = null!;

            addObjectContentsBorder( objectTypeContents, bindingOptions );

            if ( bindingOptions.paging!.enabled && Is.definedNumber( dataIndex ) ) {
                let dataArrayIndex: string = bindingOptions.useZeroIndexingForArrays ? dataIndex.toString() : ( dataIndex + 1 ).toString();
    
                if ( bindingOptions.showArrayIndexBrackets ) {
                    dataArrayIndex = `[${dataArrayIndex}]`;
                }

                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} data-array-index` : "data-array-index", dataArrayIndex, titleText );
                DomElement.createWithHTML( objectTypeTitle, "span", "split", _configuration.text!.propertyColonCharacter!, titleText );
            }
    
            if ( bindingOptions.showObjectSizes && propertyCount > 0 ) {
                if ( dataType === DataType.html ) {
                    DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} size` : "size", `<${propertyCount}>` );
                } else {
                    DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} size` : "size", `{${propertyCount}}` );
                }
            }

            if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                openingBrace = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement;
                closedBraces = DomElement.createWithHTML( objectTypeTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
            }

            renderObjectValues( arrow, null!, objectTypeContents, bindingOptions, data, propertyNames, openingBrace, closedBraces, false, true, Char.empty, dataType, dataType !== DataType.object );
            addValueClickEvent( bindingOptions, titleText, data, dataType, false );
            addFooterSizeStatus( bindingOptions, data, titleText );
            addFooterLengthStatus( bindingOptions, data, titleText );
        }
    }

    function renderArray( container: HTMLElement, bindingOptions: BindingOptions, data: any, dataType: string ) : void {
        let mainTitle: string = null!;

        if ( dataType === DataType.set ) {
            mainTitle = _configuration.text!.setText!;
        } else if ( dataType === DataType.array ) {
            mainTitle = _configuration.text!.arrayText!;
        }

        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents last-item" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeTitle, "div", "down-arrow" ) : null!;
        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} main-title` : "main-title", mainTitle );
        let openingBracket: HTMLSpanElement = null!;
        let closedBrackets: HTMLSpanElement = null!;

        addObjectContentsBorder( objectTypeContents, bindingOptions );

        if ( bindingOptions.showObjectSizes ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} size` : "size", `[${data.length}]` );
        }

        if ( bindingOptions.showOpeningClosingCurlyBraces ) {
            openingBracket = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
            closedBrackets = DomElement.createWithHTML( objectTypeTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
        }

        renderArrayValues( arrow, null!, objectTypeContents, bindingOptions, data, openingBracket, closedBrackets, false, true, Char.empty, dataType, dataType !== DataType.array );
        addValueClickEvent( bindingOptions, titleText, data, dataType, false );
        addFooterSizeStatus( bindingOptions, data, titleText );
        addFooterLengthStatus( bindingOptions, data, titleText );
    }

    function renderObjectValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, propertyNames: string[], openingBrace: HTMLSpanElement, closedBraces: HTMLElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean ) : boolean {
        let propertiesAdded: boolean = true;
        const propertiesLength: number = propertyNames.length;
        const propertiesLengthForAutoClose: number = jsonPath !== Char.empty ? propertiesLength : 0;

        if ( propertiesLength === 0 && !bindingOptions.ignore!.emptyObjects ) {
            renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing );
            propertiesAdded = false;
        } else {

            for ( let propertyIndex: number = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
                const propertyName: string = propertyNames[ propertyIndex ];
                const newJsonPath: string = jsonPath === Char.empty ? propertyName : `${jsonPath}${Char.backslash}${propertyName}`;
    
                if ( data.hasOwnProperty( propertyName ) ) {
                    renderValue( data, objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1, false, newJsonPath, parentType, preventEditing );
                }
            }

            if ( objectTypeContents.children.length === 0 || ( bindingOptions.showOpenedObjectArrayBorders && objectTypeContents.children.length === 1 ) ) {
                renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing );
                propertiesAdded = false;

            } else {
                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    createClosingSymbol( bindingOptions, objectTypeContents, "}", addNoArrowToClosingSymbol, isLastItem );
                }
            }
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBrace, closedBraces, propertiesLengthForAutoClose, parentType );

        return propertiesAdded;
    }

    function renderArrayValues( arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, openingBracket: HTMLSpanElement, closedBrackets: HTMLElement, addNoArrowToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean ) : boolean {
        let propertiesAdded: boolean = true;
        const dataLength: number = data.length;
        const dataLengthForAutoClose: number = jsonPath !== Char.empty ? dataLength : 0;

        if ( !bindingOptions.reverseArrayValues ) {
            for ( let dataIndex1: number = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                const actualIndex: number = Arr.getIndex( dataIndex1, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1, true, newJsonPath, parentType, preventEditing );
            }

        } else {
            for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                const actualIndex: number = Arr.getIndex( dataIndex2, bindingOptions );
                const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;

                renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex2 ], dataIndex2 === 0, true, newJsonPath, parentType, preventEditing );
            }
        }

        if ( objectTypeContents.children.length === 0 || ( bindingOptions.showOpenedObjectArrayBorders && objectTypeContents.children.length === 1 ) ) {
            renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing );
            propertiesAdded = false;

        } else {
            if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                createClosingSymbol( bindingOptions, objectTypeContents, "]", addNoArrowToClosingSymbol, isLastItem );
            }
        }

        addArrowEvent( bindingOptions, arrow, coma, objectTypeContents, openingBracket, closedBrackets, dataLengthForAutoClose, parentType );

        return propertiesAdded;
    }

    function renderValue( data: any, container: HTMLElement, bindingOptions: BindingOptions, name: string, value: any, isLastItem: boolean, isArrayItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean ) : void {
        const objectTypeValue: HTMLElement = DomElement.create( container, "div", "object-type-value" );
        const arrow: HTMLElement = bindingOptions.showArrowToggles ? DomElement.create( objectTypeValue, "div", "no-arrow" ) : null!;
        let valueClass: string = null!;
        let valueElement: HTMLElement = null!;
        let ignored: boolean = false;
        let ignoredDataType: boolean = false;
        let dataType: string = null!;
        let nameElement: HTMLSpanElement = DomElement.create( objectTypeValue, "span", "title" );
        let allowEditing: boolean = false;
        let typeElement: HTMLSpanElement = null!;
        const isForEmptyProperties: boolean = !Is.definedString( name );
        let assignClickEvent: boolean = true;
        
        if ( !isForEmptyProperties ) {
            if ( isArrayItem || !bindingOptions.showPropertyNameQuotes ) {
                nameElement.innerHTML = name;
            } else {
                nameElement.innerHTML = `\"${name}\"`;
            }

            if ( isArrayItem && !bindingOptions.showChildIndexes ) {
                nameElement.parentNode!.removeChild( nameElement );
                nameElement = null!;
            }

        } else {
            nameElement.parentNode!.removeChild( nameElement );
            nameElement = null!;
        }

        if ( isLastItem ) {
            objectTypeValue.classList.add( "last-item" );
        }

        if ( bindingOptions.showDataTypes ) {
            typeElement = DomElement.createWithHTML( objectTypeValue, "span", bindingOptions.showValueColors ? "type-color" : "type", Char.empty ) as HTMLSpanElement;
        }

        if ( Is.defined( nameElement ) && !isForEmptyProperties && bindingOptions.showValueColors && bindingOptions.showPropertyNameAndIndexColors  ) {
            nameElement.classList.add( parentType );
        }

        if ( Is.defined( nameElement ) && !isForEmptyProperties ) {
            DomElement.createWithHTML( objectTypeValue, "span", "split", _configuration.text!.propertyColonCharacter! );

            if ( !preventEditing ) {
                makePropertyNameEditable( bindingOptions, data, name, nameElement, isArrayItem );
            } else {
                nameElement.ondblclick = DomElement.cancelBubble;
            }

            if ( Is.definedString( jsonPath ) ) {
                objectTypeValue.setAttribute( Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME, jsonPath );
            }

            if ( !isArrayItem ) {
                addFooterSizeStatus( bindingOptions, name, nameElement );
                addFooterLengthStatus( bindingOptions, name, nameElement );
            }
        }

        if ( value === null ) {
            dataType = DataType.null;

            if ( !bindingOptions.ignore!.nullValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value undefined-or-null` : "value undefined-or-null";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, "null" );

                if ( Is.definedFunction( bindingOptions.events!.onNullRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onNullRender!, bindingOptions._currentView.element, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( value === undefined ) {
            dataType = DataType.undefined;

            if ( !bindingOptions.ignore!.undefinedValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value undefined-or-null` : "value undefined-or-null";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, "undefined" );

                if ( Is.definedFunction( bindingOptions.events!.onUndefinedRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUndefinedRender!, bindingOptions._currentView.element, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFunction( value ) ) {
            const functionName: FunctionName = Default.getFunctionName( value, _configuration );

            if ( functionName.isLambda ) {
                dataType = DataType.lambda;

                if ( !bindingOptions.ignore!.lambdaValues ) {
                    valueClass = bindingOptions.showValueColors ? `${dataType} value non-value` : "value non-value";
                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, functionName.name );
    
                    if ( Is.definedFunction( bindingOptions.events!.onLambdaRender ) ) {
                        Trigger.customEvent( bindingOptions.events!.onLambdaRender!, bindingOptions._currentView.element, valueElement );
                    }
                
                    createComma( bindingOptions, objectTypeValue, isLastItem );
    
                } else {
                    ignored = true;
                }

            } else {
                dataType = DataType.function;

                if ( !bindingOptions.ignore!.functionValues ) {
                    valueClass = bindingOptions.showValueColors ? `${dataType} value non-value` : "value non-value";
                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, functionName.name );
    
                    if ( Is.definedFunction( bindingOptions.events!.onFunctionRender ) ) {
                        Trigger.customEvent( bindingOptions.events!.onFunctionRender!, bindingOptions._currentView.element, valueElement );
                    }
                
                    createComma( bindingOptions, objectTypeValue, isLastItem );
    
                } else {
                    ignored = true;
                }
            }

        } else if ( Is.definedBoolean( value ) ) {
            dataType = DataType.boolean;

            if ( !bindingOptions.ignore!.booleanValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.booleanValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onBooleanRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onBooleanRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFloat( value ) ) {
            dataType = DataType.float;

            if ( !bindingOptions.ignore!.floatValues ) {
                const newValue: string = Convert.numberToFloatWithDecimalPlaces( value, bindingOptions.maximumDecimalPlaces! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newValue );
                allowEditing = bindingOptions.allowEditing!.floatValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onFloatRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onFloatRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedNumber( value ) ) {
            dataType = DataType.number;

            if ( !bindingOptions.ignore!.numberValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.numberValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onNumberRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onNumberRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBigInt( value ) ) {
            dataType = DataType.bigint;

            if ( !bindingOptions.ignore!.bigintValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.bigIntValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onBigIntRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onBigIntRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.String.guid( value ) ) {
            dataType = DataType.guid;

            if ( !bindingOptions.ignore!.guidValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.guidValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onGuidRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onGuidRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && ( Is.String.hexColor( value )|| Is.String.rgbColor( value ) ) ) {
            dataType = DataType.color;

            if ( !bindingOptions.ignore!.colorValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.colorValues! && !preventEditing;

                if ( bindingOptions.showValueColors ) {
                    valueElement.style.color = value;
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onColorRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onColorRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.definedUrl( value ) ) {
            dataType = DataType.url;

            if ( !bindingOptions.ignore!.urlValues ) {
                let newUrlValue: string = value;
                let openButton: HTMLSpanElement = null!;

                if ( bindingOptions.maximumUrlLength! > 0 && newUrlValue.length > bindingOptions.maximumUrlLength! ) {
                    newUrlValue = `${newUrlValue.substring(0, bindingOptions.maximumUrlLength)}${Char.space}${_configuration.text!.ellipsisText}${Char.space}`;
                }

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newUrlValue );
                allowEditing = bindingOptions.allowEditing!.urlValues! && !preventEditing;

                if ( bindingOptions.showUrlOpenButtons ) {
                    openButton = DomElement.createWithHTML( objectTypeValue, "span", bindingOptions.showValueColors ? "open-button-color" : "open-button", `${_configuration.text!.openText}${Char.space}${_configuration.text!.openSymbolText}` );
                    openButton.onclick = () => window.open( value );
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing, openButton );

                if ( Is.definedFunction( bindingOptions.events!.onUrlRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUrlRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.definedEmail( value ) ) {
            dataType = DataType.email;

            if ( !bindingOptions.ignore!.emailValues ) {
                let newEmailValue: string = value;
                let openButton: HTMLSpanElement = null!;

                if ( bindingOptions.maximumEmailLength! > 0 && newEmailValue.length > bindingOptions.maximumEmailLength! ) {
                    newEmailValue = `${newEmailValue.substring(0, bindingOptions.maximumEmailLength)}${Char.space}${_configuration.text!.ellipsisText}${Char.space}`;
                }

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newEmailValue );
                allowEditing = bindingOptions.allowEditing!.emailValues! && !preventEditing;

                if ( bindingOptions.showEmailOpenButtons ) {
                    openButton = DomElement.createWithHTML( objectTypeValue, "span", bindingOptions.showValueColors ? "open-button-color" : "open-button", `${_configuration.text!.openText}${Char.space}${_configuration.text!.openSymbolText}` );
                    openButton.onclick = () => window.open( `mailto:${value}` );
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing, openButton );

                if ( Is.definedFunction( bindingOptions.events!.onEmailRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onEmailRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) ) {
            dataType = DataType.string;

            if ( !bindingOptions.ignore!.stringValues || isForEmptyProperties ) {
                if ( bindingOptions.parse!.stringsToBooleans && Is.String.boolean( value ) ) {
                    renderValue( data, container, bindingOptions, name, value.toString().toLowerCase().trim() === "true", isLastItem, isArrayItem, jsonPath, parentType, preventEditing );
                    ignored = true;
                    ignoredDataType = true;

                } else if ( bindingOptions.parse!.stringsToNumbers && Is.String.bigInt( value ) ) {
                    renderValue( data, container, bindingOptions, name, Convert.stringToBigInt( value ), isLastItem, isArrayItem, jsonPath, parentType, preventEditing );
                    ignored = true;
                    ignoredDataType = true;
                    
                } else if ( bindingOptions.parse!.stringsToNumbers && !isNaN( value ) ) {
                    renderValue( data, container, bindingOptions, name, parseFloat( value ), isLastItem, isArrayItem, jsonPath, parentType, preventEditing );
                    ignored = true;
                    ignoredDataType = true;

                } else if ( bindingOptions.parse!.stringsToDates && Is.String.date( value ) ) {
                    renderValue( data, container, bindingOptions, name, new Date( value ), isLastItem, isArrayItem, jsonPath, parentType, preventEditing );
                    ignored = true;
                    ignoredDataType = true;

                } else {
                    let newStringValue: string = value;

                    if ( !isForEmptyProperties ) {
                        if ( bindingOptions.maximumStringLength! > 0 && newStringValue.length > bindingOptions.maximumStringLength! ) {
                            newStringValue = `${newStringValue.substring(0, bindingOptions.maximumStringLength)}${Char.space}${_configuration.text!.ellipsisText}${Char.space}`;
                        }
        
                        newStringValue = bindingOptions.showStringQuotes ? `\"${newStringValue}\"` : newStringValue;
                        valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                        allowEditing = bindingOptions.allowEditing!.stringValues! && !preventEditing;
                    } else {

                        valueClass = "no-properties-text";
                        allowEditing = false;
                        assignClickEvent = false;
                    }

                    valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, newStringValue );

                    if ( !isForEmptyProperties ) {
                        makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
        
                        if ( Is.definedFunction( bindingOptions.events!.onStringRender ) ) {
                            Trigger.customEvent( bindingOptions.events!.onStringRender!, bindingOptions._currentView.element, valueElement );
                        }
                        
                        createComma( bindingOptions, objectTypeValue, isLastItem );
                    }
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedDate( value ) ) {
            dataType = DataType.date;

            if ( !bindingOptions.ignore!.dateValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                allowEditing = bindingOptions.allowEditing!.dateValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onDateRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onDateRender!, bindingOptions._currentView.element, valueElement );
                }
    
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedSymbol( value ) ) {
            dataType = DataType.symbol;

            if ( !bindingOptions.ignore!.symbolValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );
                allowEditing = bindingOptions.allowEditing!.symbolValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onSymbolRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onSymbolRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedRegExp( value ) ) {
            dataType = DataType.regexp;

            if ( !bindingOptions.ignore!.regexpValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.source.toString() );
                allowEditing = bindingOptions.allowEditing!.regExpValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                if ( Is.definedFunction( bindingOptions.events!.onRegExpRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onRegExpRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedImage( value ) ) {
            dataType = DataType.image;

            if ( !bindingOptions.ignore!.imageValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.create( objectTypeValue, "span", valueClass );
                allowEditing = bindingOptions.allowEditing!.imageValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                const image: HTMLImageElement = DomElement.create( valueElement, "img" ) as HTMLImageElement;
                image.src = value.src;

                if ( Is.definedFunction( bindingOptions.events!.onImageRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onImageRender!, bindingOptions._currentView.element, valueElement );
                }
                
                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedHtml( value ) ) {
            dataType = DataType.html;

            if ( !bindingOptions.ignore!.htmlValues ) {
                const htmlObject: any = Convert.htmlToObject( value, bindingOptions.showCssStylesForHtmlObjects! );
                const propertyNames: string[] = Obj.getPropertyNames( htmlObject, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? dataType : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;
                    let closedBraces: HTMLSpanElement = null!;

                    addObjectContentsBorder( objectTypeContents, bindingOptions );

                    if ( isLastItem ) {
                        objectTypeContents.classList.add( "last-item" );
                    }

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.htmlText! );

                    if ( bindingOptions.showObjectSizes && ( propertyCount > 0 || !bindingOptions.ignore!.emptyObjects ) ) {
                        DomElement.createWithHTML( objectTitle, "span", "size", `<${propertyCount}>` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement;
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    const propertiesAdded: boolean = renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, htmlObject, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, true );
                    
                    if ( !propertiesAdded && bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace.parentNode!.removeChild( openingBrace );
                        closedBraces.parentNode!.removeChild( closedBraces );
                    }
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedSet( value ) ) {
            dataType = DataType.set;

            if ( !bindingOptions.ignore!.setValues ) {
                const arrayValues: any[] = Convert.setToArray( value );
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? dataType : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                let openingBracket: HTMLSpanElement = null!;
                let closedBrackets: HTMLSpanElement = null!;

                addObjectContentsBorder( arrayTypeContents, bindingOptions );

                if ( isLastItem ) {
                    arrayTypeContents.classList.add( "last-item" );
                }

                valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.setText! );

                if ( bindingOptions.showObjectSizes ) {
                    DomElement.createWithHTML( objectTitle, "span", "size", `[${arrayValues.length}]` );
                }

                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
                    closedBrackets = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
                }

                let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                
                const propertiesAdded: boolean = renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, arrayValues, openingBracket, closedBrackets, true, isLastItem, jsonPath, dataType, true );

                if ( !propertiesAdded && bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket.parentNode!.removeChild( openingBracket );
                    closedBrackets.parentNode!.removeChild( closedBrackets );
                }
                
            } else {
                ignored = true;
            }

        } else if ( Is.definedArray( value ) ) {
            dataType = DataType.array;

            if ( !bindingOptions.ignore!.arrayValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? dataType : Char.empty );
                const arrayTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                let openingBracket: HTMLSpanElement = null!;
                let closedBrackets: HTMLSpanElement = null!;

                addObjectContentsBorder( arrayTypeContents, bindingOptions );

                if ( isLastItem ) {
                    arrayTypeContents.classList.add( "last-item" );
                }

                valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.arrayText! );

                if ( bindingOptions.showObjectSizes ) {
                    DomElement.createWithHTML( objectTitle, "span", "size", `[${value.length}]` );
                }

                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
                    closedBrackets = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
                }

                let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                
                const propertiesAdded: boolean = renderArrayValues( arrow, coma, arrayTypeContents, bindingOptions, value, openingBracket, closedBrackets, true, isLastItem, jsonPath, dataType, false );

                if ( !propertiesAdded && bindingOptions.showOpeningClosingCurlyBraces ) {
                    openingBracket.parentNode!.removeChild( openingBracket );
                    closedBrackets.parentNode!.removeChild( closedBrackets );
                }
                
            } else {
                ignored = true;
            }

        } else if ( Is.definedMap( value ) ) {
            dataType = DataType.map;

            if ( !bindingOptions.ignore!.mapValues ) {
                const valueObject: object = Convert.mapToObject( value );
                const propertyNames: string[] = Obj.getPropertyNames( valueObject, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? dataType : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;
                    let closedBraces: HTMLSpanElement = null!;

                    addObjectContentsBorder( objectTypeContents, bindingOptions );

                    if ( isLastItem ) {
                        objectTypeContents.classList.add( "last-item" );
                    }

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.mapText! );

                    if ( bindingOptions.showObjectSizes && ( propertyCount > 0 || !bindingOptions.ignore!.emptyObjects ) ) {
                        DomElement.createWithHTML( objectTitle, "span", "size", `{${propertyCount}}` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement;
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    const propertiesAdded: boolean = renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, valueObject, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, true );

                    if ( !propertiesAdded && bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace.parentNode!.removeChild( openingBrace );
                        closedBraces.parentNode!.removeChild( closedBraces );
                    }
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedObject( value ) ) {
            dataType = DataType.object;

            if ( !bindingOptions.ignore!.objectValues ) {
                const propertyNames: string[] = Obj.getPropertyNames( value, bindingOptions );
                const propertyCount: number = propertyNames.length;

                if ( propertyCount === 0 && bindingOptions.ignore!.emptyObjects ) {
                    ignored = true;
                } else {

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValue, "span", bindingOptions.showValueColors ? dataType : Char.empty );
                    const objectTypeContents: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-contents" );
                    let openingBrace: HTMLSpanElement = null!;
                    let closedBraces: HTMLSpanElement = null!;

                    addObjectContentsBorder( objectTypeContents, bindingOptions );

                    if ( isLastItem ) {
                        objectTypeContents.classList.add( "last-item" );
                    }

                    valueElement = DomElement.createWithHTML( objectTitle, "span", "main-title", _configuration.text!.objectText! );

                    if ( bindingOptions.showObjectSizes && ( propertyCount > 0 || !bindingOptions.ignore!.emptyObjects ) ) {
                        DomElement.createWithHTML( objectTitle, "span", "size", `{${propertyCount}}` );
                    }

                    if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "{" ) as HTMLSpanElement;
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    let coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );

                    const propertiesAdded: boolean = renderObjectValues( arrow, coma, objectTypeContents, bindingOptions, value, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, false );
                    
                    if ( !propertiesAdded && bindingOptions.showOpeningClosingCurlyBraces ) {
                        openingBrace.parentNode!.removeChild( openingBrace );
                        closedBraces.parentNode!.removeChild( closedBraces );
                    }
                }

            } else {
                ignored = true;
            }

        } else {
            dataType = DataType.unknown;

            if ( !bindingOptions.ignore!.unknownValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value non-value` : "value non-value";
                valueElement = DomElement.createWithHTML( objectTypeValue, "span", valueClass, value.toString() );

                if ( Is.definedFunction( bindingOptions.events!.onUnknownRender ) ) {
                    Trigger.customEvent( bindingOptions.events!.onUnknownRender!, bindingOptions._currentView.element, valueElement );
                }

                createComma( bindingOptions, objectTypeValue, isLastItem );

            } else {
                ignored = true;
            }
        }

        if ( !isForEmptyProperties && !ignoredDataType ) {
            updateDataTypeCount( bindingOptions, dataType );
        }

        if ( ignored ) {
            container.removeChild( objectTypeValue );

        } else {
            if ( Is.defined( valueElement ) ) {
                if ( !isForEmptyProperties ) {
                    addFooterSizeStatus( bindingOptions, value, valueElement );
                    addFooterLengthStatus( bindingOptions, value, valueElement );
                    addFooterDataTypeStatus( bindingOptions, dataType, valueElement );
                }

                if ( Is.defined( typeElement ) ) {
                    if ( dataType !== DataType.null && dataType !== DataType.undefined && dataType !== DataType.array && dataType !== DataType.object && dataType !== DataType.map && dataType !== DataType.set ) {
                        typeElement.innerHTML = `(${dataType})`;
                    } else {
                        typeElement.parentNode!.removeChild( typeElement );
                        typeElement = null!;
                    }
                }

                if ( assignClickEvent ) {
                    addValueElementToolTip( bindingOptions, jsonPath, nameElement, typeElement, valueElement );
                    addValueClickEvent( bindingOptions, valueElement, value, dataType, allowEditing );
                    
                } else {
                    valueElement.ondblclick = DomElement.cancelBubble;
                }
            }
        }
    }

    function updateDataTypeCount( bindingOptions: BindingOptions, dataType: string ) : void {
        if ( !bindingOptions._currentView.dataTypeCounts.hasOwnProperty( dataType ) ) {
            bindingOptions._currentView.dataTypeCounts[ dataType ] = 0;
        }

        bindingOptions._currentView.dataTypeCounts[ dataType ]++;
    }

    function addObjectContentsBorder( objectContents: HTMLElement, bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.showOpenedObjectArrayBorders ) {
            objectContents.classList.add( "object-border" );

            if ( !bindingOptions.showArrowToggles ) {
                objectContents.classList.add( "object-border-no-arrow-toggles" );
            }

            DomElement.create( objectContents, "div", "object-border-bottom" );
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
                    jsonPathParts[ jsonPathPartIndex ] = bindingOptions.jsonPathAny!;
                }

                jsonPath = jsonPathParts.join( bindingOptions.jsonPathSeparator! );
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
                let statusBarMessage: string = null!;

                clearTimeout( bindingOptions._currentView.valueClickTimerId );
                
                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                propertyName.classList.add( "editable-name" );

                if ( isArrayItem ) {
                    originalArrayIndex = Arr.getIndexFromBrackets( propertyName.innerHTML );
                    
                    propertyName.innerHTML = originalArrayIndex.toString();
                    
                } else {
                    propertyName.innerHTML = propertyName.innerHTML.replace( /['"]+/g, Char.empty );
                }
                
                propertyName.setAttribute( "contenteditable", "true" );
                propertyName.focus();

                DomElement.selectAllText( propertyName );

                propertyName.onblur = () => {
                    renderControlContainer( bindingOptions, false );

                    if ( Is.definedString( statusBarMessage ) ) {
                        setFooterStatusText( bindingOptions, statusBarMessage );
                    }
                };
    
                propertyName.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code === KeyCode.escape ) {
                        e.preventDefault();
                        propertyName.setAttribute( "contenteditable", "false" );

                    } else if ( e.code === KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyName: string = propertyName.innerText;

                        if ( isArrayItem ) {
                            if ( !isNaN( +newPropertyName ) ) {
                                let newArrayIndex: number = +newPropertyName;

                                if ( !bindingOptions.useZeroIndexingForArrays ) {
                                    newArrayIndex--;
                                }

                                if ( originalArrayIndex !== newArrayIndex ) {
                                    statusBarMessage = _configuration.text!.indexUpdatedText!;

                                    Arr.moveIndex( data, originalArrayIndex, newArrayIndex );
                                    Trigger.customEvent( bindingOptions.events!.onJsonEdit!, bindingOptions._currentView.element );
                                }
                            }

                        } else {
                            if ( newPropertyName !== originalPropertyName ) {
                                if ( newPropertyName.trim() === Char.empty ) {
                                    statusBarMessage = _configuration.text!.itemDeletedText!;

                                    delete data[ originalPropertyName ];
            
                                } else {
                                    if ( !data.hasOwnProperty( newPropertyName ) ) {
                                        statusBarMessage = _configuration.text!.nameUpdatedText!;

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

    function makePropertyValueEditable( bindingOptions: BindingOptions, data: any, originalPropertyName: string, originalPropertyValue: any, propertyValue: HTMLSpanElement, isArrayItem: boolean, allowEditing: boolean, openButton: HTMLSpanElement = null! ) : void {
        if ( allowEditing ) {
            propertyValue.ondblclick = ( e: MouseEvent ) => {
                let statusBarMessage: string = null!;

                DomElement.cancelBubble( e );

                clearTimeout( bindingOptions._currentView.valueClickTimerId );

                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                propertyValue.classList.add( "editable" );
                propertyValue.setAttribute( "contenteditable", "true" );

                if ( Is.definedDate( originalPropertyValue ) && !bindingOptions.includeTimeZoneInDateTimeEditing ) {
                    propertyValue.innerText = JSON.stringify( originalPropertyValue ).replace( /['"]+/g, Char.empty );
                } else if ( Is.definedRegExp( originalPropertyValue ) ) {
                    propertyValue.innerText = originalPropertyValue.source;
                } else if ( Is.definedSymbol( originalPropertyValue ) ) {
                    propertyValue.innerText = Convert.symbolToString( originalPropertyValue );
                } else if ( Is.definedImage( originalPropertyValue ) ) {
                    propertyValue.innerText = originalPropertyValue.src;
                } else {
                    propertyValue.innerText = originalPropertyValue.toString();
                }
                
                propertyValue.focus();

                DomElement.selectAllText( propertyValue );

                if ( Is.defined( openButton ) ) {
                    openButton.parentNode!.removeChild( openButton );
                }

                propertyValue.onblur = () => {
                    renderControlContainer( bindingOptions, false );

                    if ( Is.definedString( statusBarMessage ) ) {
                        setFooterStatusText( bindingOptions, statusBarMessage );
                    }
                };
    
                propertyValue.onkeydown = ( e: KeyboardEvent ) => {
                    if ( e.code === KeyCode.escape ) {
                        e.preventDefault();
                        propertyValue.setAttribute( "contenteditable", "false" );
                        
                    } else if ( e.code === KeyCode.enter ) {
                        e.preventDefault();
    
                        const newPropertyValue: string = propertyValue.innerText;
    
                        if ( newPropertyValue.trim() === Char.empty ) {
                            if ( isArrayItem ) {
                                data.splice( Arr.getIndexFromBrackets( originalPropertyName ), 1 );
                            } else {
                                delete data[ originalPropertyName ];
                            }

                            statusBarMessage = _configuration.text!.itemDeletedText!;
    
                        } else {
                            let newDataPropertyValue: any = Convert.stringToDataTypeValue( originalPropertyValue, newPropertyValue );

                            if ( newDataPropertyValue !== null ) {
                                if ( isArrayItem ) {
                                    data[ Arr.getIndexFromBrackets( originalPropertyName ) ] = newDataPropertyValue;
                                } else {
                                    data[ originalPropertyName ] = newDataPropertyValue;
                                }

                                statusBarMessage = _configuration.text!.valueUpdatedText!;

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
                            Trigger.customEvent( bindingOptions.events!.onValueClick!, bindingOptions._currentView.element, value, type );
                        }
                    }, bindingOptions.editingValueClickDelay );

                } else {
                    valueElement.ondblclick = DomElement.cancelBubble;

                    Trigger.customEvent( bindingOptions.events!.onValueClick!, bindingOptions._currentView.element, value, type );
                }
            };

        } else {
            valueElement.classList.add( "no-hover" );
        }
    }

    function addArrowEvent( bindingOptions: BindingOptions, arrow: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, openingSymbol: HTMLSpanElement, closedBraces: HTMLElement, dataLength: number, dataType: string ) : void {
        const panelId: number = bindingOptions._currentView.contentPanelsIndex;
        const dataArrayIndex: number = bindingOptions._currentView.contentPanelsDataIndex;

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

            if ( Is.defined( closedBraces ) ) {
                closedBraces.style.display = "inline-block";
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

            if ( Is.defined( closedBraces ) ) {
                closedBraces.style.display = "none";
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
            if ( !bindingOptions._currentView.initialized ) {
                if ( dataType === DataType.object && bindingOptions.autoClose!.objectSize! > 0 && dataLength >= bindingOptions.autoClose!.objectSize! ) {
                    isClosed = true;
                } else if ( dataType === DataType.array && bindingOptions.autoClose!.arraySize! > 0 && dataLength >= bindingOptions.autoClose!.arraySize! ) {
                    isClosed = true;
                } else if ( dataType === DataType.map && bindingOptions.autoClose!.mapSize! > 0 && dataLength >= bindingOptions.autoClose!.mapSize! ) {
                    isClosed = true;
                } else if ( dataType === DataType.set && bindingOptions.autoClose!.setSize! > 0 && dataLength >= bindingOptions.autoClose!.setSize! ) {
                    isClosed = true;
                } else if ( dataType === DataType.html && bindingOptions.autoClose!.htmlSize! > 0 && dataLength >= bindingOptions.autoClose!.htmlSize! ) {
                    isClosed = true;
                }
            }

            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = isClosed;
        }

        if ( Is.defined( arrow ) ) {
            arrow.onclick = () => conditionFunc( arrow.className === "down-arrow" );
            arrow.ondblclick = DomElement.cancelBubble;
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

    function createClosingSymbol( bindingOptions: BindingOptions, container: HTMLElement, symbol: string, addNoArrow: boolean, isLastItem: boolean ) : void {
        let symbolContainer: HTMLElement = DomElement.create( container, "div", "closing-symbol" );
        
        if ( ( addNoArrow && bindingOptions.showArrowToggles ) || bindingOptions.showOpenedObjectArrayBorders ) {
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
            bindingOptions._currentView.element.ondragover = () => onDragStart( bindingOptions, dragAndDropBackground );
            bindingOptions._currentView.element.ondragenter = () => onDragStart( bindingOptions, dragAndDropBackground );

            dragAndDropBackground.ondragover = DomElement.cancelBubble;
            dragAndDropBackground.ondragenter = DomElement.cancelBubble;
            dragAndDropBackground.ondragleave = () => dragAndDropBackground.style.display = "none";
            dragAndDropBackground.ondrop = ( e: DragEvent ) => onDropFiles( e, bindingOptions );
        }
    }

    function onDragStart( bindingOptions: BindingOptions, dragAndDropBackground: HTMLElement ) : void {
        if ( !bindingOptions._currentView.columnDragging ) {
            dragAndDropBackground.style.display = "block"
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

        const onFileLoad = ( data: any ) => {
            filesRead++;
            filesData.push( data );

            if ( filesRead === filesLength ) {
                bindingOptions._currentView.dataArrayCurrentIndex = 0;
                bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
                bindingOptions.data = filesData.length === 1 ? filesData[ 0 ] : filesData;
    
                renderControlContainer( bindingOptions );
                setFooterStatusText( bindingOptions, _configuration.text!.importedText!.replace( "{0}", filesLength.toString() ) );
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

    function importFromJson( file: File, onFileLoad: ( data: any ) => void ) : void {
        const reader: FileReader = new FileReader();
        let renderData: any = null as any;

        reader.onloadend = () => onFileLoad( renderData );
    
        reader.onload = ( e: ProgressEvent<FileReader> ) => {
            const json: StringToJson = Convert.jsonStringToObject( e.target!.result, _configuration );

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
        let contents: string = JSON.stringify( bindingOptions.data, _jsonStringifyReplacer, bindingOptions.jsonIndentSpaces );

        if ( Is.definedString( contents ) ) {
            const tempLink: HTMLElement = DomElement.create( document.body, "a" );
            tempLink.style.display = "none";
            tempLink.setAttribute( "target", "_blank" );
            tempLink.setAttribute( "href", `data:application/json;charset=utf-8,${encodeURIComponent(contents)}` );
            tempLink.setAttribute( "download", getExportFilename( bindingOptions ) );
            tempLink.click();
            
            document.body.removeChild( tempLink );

            onSideMenuClose( bindingOptions );
            setFooterStatusText( bindingOptions, _configuration.text!.exportedText! );
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
        if ( bindingOptions.shortcutKeysEnabled && _elements_Data_Count === 1 && _elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) && !bindingOptions._currentView.editMode ) {
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
        bindingOptions._currentView.element.classList.remove( "json-tree-js" );

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
            for ( const elementId in _elements_Data ) {
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

        backPage: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                const bindingOptions: BindingOptions = _elements_Data[ elementId ];

                if ( bindingOptions.paging!.enabled ) {
                    onBackPage( _elements_Data[ elementId ] );
                }
            }
    
            return _public;
        },

        nextPage: function ( elementId: string ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                const bindingOptions: BindingOptions = _elements_Data[ elementId ];

                if ( bindingOptions.paging!.enabled ) {
                    onNextPage( _elements_Data[ elementId ] );
                }
            }
    
            return _public;
        },

        getPageNumber: function ( elementId: string ) : number {
            let result: number = 1;

            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                const bindingOptions: BindingOptions = _elements_Data[ elementId ];

                result = Math.ceil( ( bindingOptions._currentView.dataArrayCurrentIndex + 1 ) / bindingOptions.paging!.columnsPerPage! );
            }
    
            return result;
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
                    const jsonResult: StringToJson = Convert.jsonStringToObject( json, _configuration );

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
         * Public API Functions:  Manage Binding Options
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        updateBindingOptions: function ( elementId: string, newOptions: any ) : PublicApi {
            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                const bindingOptions: BindingOptions = _elements_Data[ elementId ];
                const data: any = bindingOptions.data;
                const currentView: BindingOptionsCurrentView = bindingOptions._currentView;

                _elements_Data[ elementId ] = Binding.Options.get( newOptions );
                _elements_Data[ elementId ].data = data;
                _elements_Data[ elementId ]._currentView = currentView;

                renderControlContainer( _elements_Data[ elementId ] );
            }

            return _public;
        },

        getBindingOptions: function ( elementId: string ) : BindingOptions {
            let result: BindingOptions = null!;

            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                result = _elements_Data[ elementId ];
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
            for ( const elementId in _elements_Data ) {
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
            
                for ( const propertyName in newConfiguration ) {
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
        
            for ( const elementId in _elements_Data ) {
                if ( _elements_Data.hasOwnProperty( elementId ) ) {
                    result.push( elementId );
                }
            }
    
            return result;
        },

        getVersion: function () : string {
            return "4.0.0";
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