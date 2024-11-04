/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        jsontree.ts
 * @version     v4.5.0
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
    type BindingOptionsCurrentView, 
    type ColumnLayout, 
    type CustomDataType } from "./ts/type";

import { type PublicApi } from "./ts/api";
import { ImportedFilename } from "./ts/type";  
import { Default } from "./ts/data/default";
import { Is } from "./ts/data/is";
import { DomElement } from "./ts/dom/dom";
import { Char, DataType, KeyCode, Value } from "./ts/data/enum";
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
import { ContextMenu } from "./ts/area/context-menu";


type JsonTreeData = Record<string, BindingOptions>;


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Data
    let _elements_Data: JsonTreeData = {} as JsonTreeData;
    let _elements_Data_Count: number = 0;

    // Variables: Global Keys
    let _key_Control_Pressed: boolean = false;


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
        ContextMenu.renderControl( bindingOptions );

        if ( !Is.definedString( bindingOptions._currentView.element.id ) ) {
            if ( Is.definedString( bindingOptions.id ) ) {
                bindingOptions._currentView.element.id = bindingOptions.id!;
            } else {
                bindingOptions._currentView.element.id = crypto.randomUUID();
            }
            
            bindingOptions._currentView.idSet = true;
        }

        bindingOptions._currentView.element.classList.add( "json-tree-js" );
        bindingOptions._currentView.element.removeAttribute( Constants.JSONTREE_JS_ATTRIBUTE_NAME );

        if ( Is.definedString( bindingOptions.class ) ) {
            const classes: string[] = bindingOptions.class!.split( Char.space );
            const classesLength: number = classes.length;

            for ( let classIndex: number = 0; classIndex < classesLength; classIndex++ ) {
                bindingOptions._currentView.element.classList.add( classes[ classIndex ].trim() );
            }
        }

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
        ContextMenu.hide( bindingOptions );

        bindingOptions.data = data;
        bindingOptions._currentView.element.innerHTML = Char.empty;
        bindingOptions._currentView.editMode = false;
        bindingOptions._currentView.contentPanelsIndex = 0;
        bindingOptions._currentView.sideMenuChanged = false;
        bindingOptions._currentView.currentContentColumns = [];
        bindingOptions._currentView.dataTypeCounts = {} as Record<string, number>;

        renderControlTitleBar( bindingOptions, data );

        const contents: HTMLElement = DomElement.create( bindingOptions._currentView.element, "div", "contents" );

        if ( isForPageSwitch ) {
            contents.classList.add( "page-switch" );
        }

        if ( bindingOptions.paging!.enabled && Is.definedArray( data ) ) {
            const allowColumnReordering: boolean = Is.defined( data[ bindingOptions._currentView.currentDataArrayPageIndex + 1 ] );
            const updatedData: Array<any> = Arr.removeNullOrUndefinedEntries( data );

            bindingOptions.data = updatedData;

            for ( let pageIndex: number = 0; pageIndex < bindingOptions.paging!.columnsPerPage!; pageIndex++ ) {
                const actualDataIndex: number = pageIndex + bindingOptions._currentView.currentDataArrayPageIndex;

                if ( actualDataIndex <= updatedData.length - 1 ) {
                    const actualData: any = updatedData[ actualDataIndex ];

                    bindingOptions._currentView.contentPanelsIndex = 0;
                    bindingOptions._currentView.contentPanelsDataIndex = actualDataIndex;
    
                    renderControlContentsPanel( actualData, contents, bindingOptions, actualDataIndex, scrollTopsForColumns[ pageIndex ], bindingOptions.paging!.columnsPerPage!, allowColumnReordering );
                }
            }

        } else {
            bindingOptions._currentView.contentPanelsIndex = 0;
            bindingOptions._currentView.contentPanelsDataIndex = 0;

            renderControlContentsPanel( data, contents, bindingOptions, null!, scrollTopsForColumns[ 0 ], 1, false );
        }

        renderControlDisabledBackground( bindingOptions );
        renderControlSideMenu( bindingOptions );
        renderControlFooterBar( bindingOptions );
        renderControlDragAndDrop( bindingOptions );

        bindingOptions._currentView.initialized = true;
    }

    function renderControlContentsPanel( data: any, contents: HTMLElement, bindingOptions: BindingOptions, dataIndex: number, scrollTop: number, totalColumns: number, enableColumnOrder: boolean ) : void {
        const contentsColumn: HTMLElement = DomElement.create( contents, "div", totalColumns > 1 ? "contents-column-multiple" : "contents-column" );
        const contentsColumnIndex: number = bindingOptions._currentView.currentColumnBuildingIndex;
        
        if ( !Is.defined( data ) ) {
            const noJson: HTMLElement = DomElement.create( contentsColumn, "div", "no-json" );
            DomElement.createWithHTML( noJson, "span", "no-json-text", _configuration.text!.noJsonToViewText! );

            if ( bindingOptions.sideMenu!.showImportButton ) {
                const importText: HTMLSpanElement = DomElement.createWithHTML( noJson, "span", "no-json-import-text", `${_configuration.text!.importButtonText!}${_configuration.text!.ellipsisText!}` ) as HTMLSpanElement;
                importText.onclick = () => onSideMenuImportClick( bindingOptions );
            }
        } else {
            
            contentsColumn.onscroll = () => onContentsColumnScroll( contentsColumn, bindingOptions, contentsColumnIndex );

            if ( bindingOptions.paging!.enabled && Is.definedNumber( dataIndex ) ) {
                contentsColumn.setAttribute( Constants.JSONTREE_JS_ATTRIBUTE_ARRAY_INDEX_NAME, dataIndex.toString() );
            }
    
            if ( enableColumnOrder && bindingOptions.paging!.allowColumnReordering && bindingOptions.paging!.columnsPerPage! > 1 && bindingOptions.allowEditing!.bulk ) {
                contentsColumn.setAttribute( "draggable", "true" );
                contentsColumn.ondragstart = () => onContentsColumnDragStart( contentsColumn, bindingOptions, dataIndex );
                contentsColumn.ondragend = () => onContentsColumnDragEnd( contentsColumn, bindingOptions );
                contentsColumn.ondragover = ( ev: DragEvent ) => ev.preventDefault();
                contentsColumn.ondrop = () => onContentsColumnDrop( bindingOptions, dataIndex );
            }

            let renderValuesContainer: HTMLElement = contentsColumn;
            let lineNumbers: HTMLElement = null!;
            let lines: HTMLElement = null!;

            if ( bindingOptions.lineNumbers!.enabled ) {
                lineNumbers = DomElement.create( contentsColumn, "div", "contents-column-line-numbers" );
                lines = DomElement.create( contentsColumn, "div", "contents-column-lines" );
                renderValuesContainer = lines;
            }

            const columnLayout: ColumnLayout = {
                column: contentsColumn,
                lineNumbers: lineNumbers,
                lines: lines,
                controlButtons: null!
            };

            bindingOptions._currentView.currentContentColumns.push( columnLayout );
            bindingOptions._currentView.currentColumnBuildingIndex = bindingOptions._currentView.currentContentColumns.length - 1;

            if ( Is.definedArray( data ) ) {
                renderRootArray( renderValuesContainer, bindingOptions, data, DataType.array );
            } else if ( Is.definedSet( data ) ) {
                renderRootArray( renderValuesContainer, bindingOptions, Convert.setToArray( data ), DataType.set );
            } else if ( Is.definedHtml( data ) ) {
                renderRootObject( renderValuesContainer, bindingOptions, Convert.htmlToObject( data, bindingOptions.showCssStylesForHtmlObjects! ), dataIndex, DataType.html );
            } else if ( Is.definedMap( data ) ) {
                renderRootObject( renderValuesContainer, bindingOptions, Convert.mapToObject( data ), dataIndex, DataType.map );
            } else if ( Is.definedObject( data ) ) {
                renderRootObject( renderValuesContainer, bindingOptions, data, dataIndex, DataType.object );
            } else {
                renderRootObject( renderValuesContainer, bindingOptions, Obj.createFromValue( data ), dataIndex, DataType.object );
            }

            renderControlColumnLineNumbers( bindingOptions._currentView.currentColumnBuildingIndex, bindingOptions );
            renderControlContentsControlButtons( bindingOptions, contentsColumn, data, dataIndex );
    
            if ( Is.defined( scrollTop ) ) {
                contentsColumn.scrollTop = scrollTop;
            }
    
            bindingOptions._currentView.titleBarButtons.style.display = "block";
    
            if ( bindingOptions.allowEditing!.bulk ) {
                contentsColumn.ondblclick = ( ev: MouseEvent ) => {
                    enableContentsColumnEditMode( ev, bindingOptions, data, contentsColumn, dataIndex );
                };
            }
        }
    }

    function enableContentsColumnEditMode( ev: MouseEvent, bindingOptions: BindingOptions, data: any, contentsColumn: HTMLElement, dataIndex: number ) : void {
        let statusBarMessage: string = null!;

        if ( Is.defined( ev ) ) {
            DomElement.cancelBubble( ev );
        }

        clearTimeout( bindingOptions._currentView.valueClickTimerId );

        bindingOptions._currentView.valueClickTimerId = 0;
        bindingOptions._currentView.editMode = true;

        contentsColumn.classList.add( "editable" );
        contentsColumn.setAttribute( "contenteditable", "true" );
        contentsColumn.setAttribute( "draggable", "false" );
        contentsColumn.innerText = JSON.stringify( Convert.toJsonStringifyClone( data, _configuration, bindingOptions ), bindingOptions.events!.onCopyJsonReplacer, bindingOptions.jsonIndentSpaces );
        contentsColumn.focus();

        DomElement.selectAllText( contentsColumn );

        contentsColumn.onblur = () => {
            renderControlContainer( bindingOptions, false );

            if ( Is.definedString( statusBarMessage ) ) {
                setFooterStatusText( bindingOptions, statusBarMessage );
            }
        };

        contentsColumn.onkeydown = ( ev: KeyboardEvent ) => {
            if ( ev.code === KeyCode.escape ) {
                ev.preventDefault();
                contentsColumn.setAttribute( "contenteditable", "false" );

            } else if ( isCommandKey( ev ) && ev.code === KeyCode.enter ) {
                ev.preventDefault();

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

                            if ( dataIndex === bindingOptions._currentView.currentDataArrayPageIndex && bindingOptions._currentView.currentDataArrayPageIndex > 0 ) {
                                bindingOptions._currentView.currentDataArrayPageIndex -= bindingOptions.paging!.columnsPerPage!
                            }
                        }
                        
                    } else {
                        bindingOptions.data = newData.object;
                    }
                }

                contentsColumn.setAttribute( "contenteditable", "false" );
                
            } else if ( ev.code === KeyCode.enter ) {
                ev.preventDefault();
                document.execCommand( "insertLineBreak" );    
            }
        };
    }

    function getContentColumnScrollTops( bindingOptions: BindingOptions ) : number[] {
        const result: number[] = [];
        
        ToolTip.hide( bindingOptions );
        ContextMenu.hide( bindingOptions );

        if ( bindingOptions._currentView.editMode || bindingOptions._currentView.sideMenuChanged ) {
            const contentColumnsLength: number = bindingOptions._currentView.currentContentColumns.length;

            for ( let contentColumnIndex: number = 0; contentColumnIndex < contentColumnsLength; contentColumnIndex++ ) {
                result.push( bindingOptions._currentView.currentContentColumns[ contentColumnIndex ].column.scrollTop );
            }
        }

        return result;
    }

    function onContentsColumnScroll( column: HTMLElement, bindingOptions: BindingOptions, dataIndex: number ) : void {
        ToolTip.hide( bindingOptions );
        ContextMenu.hide( bindingOptions );

        const scrollTop: number = column.scrollTop;
        const scrollLeft: number = column.scrollLeft;
        const columnsLength: number = bindingOptions._currentView.currentContentColumns.length;

        if ( bindingOptions.controlPanel!.enabled ) {
            const columnLayout: ColumnLayout = bindingOptions._currentView.currentContentColumns[ dataIndex ];

            if ( Is.defined( columnLayout.controlButtons ) ) {
                columnLayout.controlButtons.style.top = `${columnLayout.column.scrollTop}px`;
                columnLayout.controlButtons.style.right = `-${columnLayout.column.scrollLeft}px`;
            }
        }

        for ( let columnIndex: number = 0; columnIndex < columnsLength; columnIndex++ ) {
            const columnLayout: ColumnLayout = bindingOptions._currentView.currentContentColumns[ columnIndex ];

            if ( columnLayout.column !== column ) {
                if ( bindingOptions.paging!.synchronizeScrolling ) {
                    columnLayout.column.scrollTop = scrollTop;
                    columnLayout.column.scrollLeft = scrollLeft;
                }

                if ( bindingOptions.controlPanel!.enabled && Is.defined( columnLayout.controlButtons ) ) {
                    columnLayout.controlButtons.style.top = `${columnLayout.column.scrollTop}px`;
                    columnLayout.controlButtons.style.right = `-${columnLayout.column.scrollLeft}px`;
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

            if ( ( bindingOptions._currentView.currentDataArrayPageIndex + ( bindingOptions.paging!.columnsPerPage! - 1 ) ) < newIndex ) {
                bindingOptions._currentView.currentDataArrayPageIndex += bindingOptions.paging!.columnsPerPage!;
            } else if ( newIndex < bindingOptions._currentView.currentDataArrayPageIndex ) {
                bindingOptions._currentView.currentDataArrayPageIndex -= bindingOptions.paging!.columnsPerPage!;
            }

            renderControlContainer( bindingOptions );
            setFooterStatusText( bindingOptions, _configuration.text!.jsonUpdatedText! );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Line Numbers
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlColumnLineNumbers( columnLayoutIndex: number, bindingOptions: BindingOptions ) : void {
        const columnLayout: ColumnLayout = bindingOptions._currentView.currentContentColumns[ columnLayoutIndex ];

        if ( bindingOptions.lineNumbers!.enabled ) {
            let lineNumberCount: number = 1;
            let firstLineTop: number = 0;
            let largestLineNumberWidth: number = 0;
            const valueElements: NodeListOf<Element> = columnLayout.column.querySelectorAll( ".object-type-title, .object-type-value-title, .object-type-end" );
            const valueElementsLength: number = valueElements.length;

            columnLayout.lineNumbers.innerHTML = Char.empty;

            for ( let valueElementIndex = 0; valueElementIndex < valueElementsLength; valueElementIndex++ ) {
                const valueElement: HTMLElement = valueElements[ valueElementIndex ] as HTMLElement;

                if ( valueElement.offsetHeight > 0 ) {
                    let elementTop: number = DomElement.getOffset( valueElement ).top;
    
                    if ( lineNumberCount === 1 ) {
                        firstLineTop = elementTop;
                    }
    
                    elementTop -= firstLineTop;
        
                    const lineNumber: HTMLElement = DomElement.create( columnLayout.lineNumbers, "div", "contents-column-line-number" );
                    const lineNumberDot: string = bindingOptions.lineNumbers!.addDots ? Char.dot : Char.empty;

                    if ( bindingOptions.lineNumbers!.padNumbers ) {
                        lineNumber.innerHTML = `${Str.padNumber( lineNumberCount, valueElementsLength.toString().length )}${lineNumberDot}`;
                    } else {
                        lineNumber.innerHTML = `${lineNumberCount}${lineNumberDot}`;
                    }

                    const newTop: number = elementTop + ( valueElement.offsetHeight / 2 ) - ( lineNumber.offsetHeight / 2 );

                    lineNumber.style.top = `${newTop}px`;

                    largestLineNumberWidth = Math.max( largestLineNumberWidth, lineNumber.offsetWidth );
                }

                lineNumberCount++;
            }
    
            columnLayout.lineNumbers.style.height = `${columnLayout.lines.offsetHeight}px`;
            columnLayout.lineNumbers.style.width = `${largestLineNumberWidth}px`;

        } else {
            if ( Is.defined( columnLayout.lineNumbers ) ) {
                columnLayout.lineNumbers.parentNode!.removeChild( columnLayout.lineNumbers );
                columnLayout.lineNumbers = null!;
            }
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Control Buttons Panel
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlContentsControlButtons( bindingOptions: BindingOptions, contentsColumn: HTMLElement, data: any, dataIndex: number ) : void {
        if ( bindingOptions.controlPanel!.enabled ) {
            const columnIndex: number = bindingOptions._currentView.currentColumnBuildingIndex;
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

            if ( isPagingEnabled && bindingOptions.controlPanel!.showExportButton ) {
                const exportButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "export", _configuration.text!.exportButtonSymbolText! ) as HTMLButtonElement;
                exportButton.onclick = () => onExport( bindingOptions, data );
    
                ToolTip.add( exportButton, bindingOptions, _configuration.text!.exportButtonText! );
            }
    
            if ( isPagingEnabled && bindingOptions.allowEditing!.bulk && bindingOptions.controlPanel!.showImportButton ) {
                const importButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "import", _configuration.text!.importButtonSymbolText! ) as HTMLButtonElement;
                importButton.onclick = () => onSideMenuImportClick( bindingOptions, dataIndex + 1 );
    
                ToolTip.add( importButton, bindingOptions, _configuration.text!.importButtonText! );
            }
    
            if ( bindingOptions.allowEditing!.bulk && bindingOptions.controlPanel!.showRemoveButton ) {
                const removeButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "remove", _configuration.text!.removeSymbolButtonText! ) as HTMLButtonElement;
                removeButton.onclick = () => onRemoveArrayJson( bindingOptions, dataIndex );
                removeButton.ondblclick = DomElement.cancelBubble;
        
                ToolTip.add( removeButton, bindingOptions, _configuration.text!.removeButtonText! );
            }
    
            if ( !isPagingEnabled && Is.definedArray( bindingOptions.data ) && bindingOptions.data.length > 1 && bindingOptions.controlPanel!.showSwitchToPagesButton ) {
                const switchToPagesButton: HTMLButtonElement = DomElement.createWithHTML( controlButtons, "button", "switch-to-pages", _configuration.text!.switchToPagesSymbolText! ) as HTMLButtonElement;
                switchToPagesButton.onclick = () => onSwitchToPages( bindingOptions );
                switchToPagesButton.ondblclick = DomElement.cancelBubble;
    
                ToolTip.add( switchToPagesButton, bindingOptions, _configuration.text!.switchToPagesText! );
            }
    
            if ( controlButtons.innerHTML !== Char.empty ) {
                const paddingLeft: number = DomElement.getStyleValueByName( contentsColumn, "padding-left", true );
    
                bindingOptions._currentView.currentContentColumns[ columnIndex ].controlButtons = controlButtons;
                contentsColumn.style.minHeight = `${controlButtons.offsetHeight}px`;
                contentsColumn.style.paddingRight = `${controlButtons.offsetWidth + paddingLeft}px`;
    
            } else {
                contentsColumn.removeChild( controlButtons );
            }
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

            if ( dataIndex === bindingOptions._currentView.currentDataArrayPageIndex && bindingOptions._currentView.currentDataArrayPageIndex > 0 ) {
                bindingOptions._currentView.currentDataArrayPageIndex -= bindingOptions.paging!.columnsPerPage!
            }

        } else {
            bindingOptions.data = null;
        }

        renderControlContainer( bindingOptions );
        setFooterStatusText( bindingOptions, _configuration.text!.arrayJsonItemDeleted! );
    }

    function onCopy( bindingOptions: BindingOptions, data: any ) : void {
        const copyDataJson: string  = JSON.stringify( Convert.toJsonStringifyClone( data, _configuration, bindingOptions ), bindingOptions.events!.onCopyJsonReplacer, bindingOptions.jsonIndentSpaces );

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
                bindingOptions._currentView.backPageButton = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "back-page", _configuration.text!.backButtonSymbolText! ) as HTMLButtonElement;
                bindingOptions._currentView.backPageButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( bindingOptions._currentView.backPageButton, bindingOptions, _configuration.text!.backButtonText! );

                if ( bindingOptions._currentView.currentDataArrayPageIndex > 0 ) {
                    bindingOptions._currentView.backPageButton.onclick = () => onBackPage( bindingOptions );
                } else {
                    bindingOptions._currentView.backPageButton.disabled = true;
                }

                bindingOptions._currentView.nextPageButton = DomElement.createWithHTML( bindingOptions._currentView.titleBarButtons, "button", "next-page", _configuration.text!.nextButtonSymbolText! ) as HTMLButtonElement;
                bindingOptions._currentView.nextPageButton.ondblclick = DomElement.cancelBubble;

                ToolTip.add( bindingOptions._currentView.nextPageButton, bindingOptions, _configuration.text!.nextButtonText! );

                if ( ( bindingOptions._currentView.currentDataArrayPageIndex + ( bindingOptions.paging!.columnsPerPage! - 1 ) ) < data.length - 1 ) {
                    bindingOptions._currentView.nextPageButton.onclick = () => onNextPage( bindingOptions );
                } else {
                    bindingOptions._currentView.nextPageButton.disabled = true;
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
            ContextMenu.hide( bindingOptions );
            updateFooterDisplay( bindingOptions );
            Trigger.customEvent( bindingOptions.events!.onFullScreenChange!, bindingOptions._currentView.element, bindingOptions._currentView.element.classList.contains( "full-screen" ) );
        }
    }

    function onTitleBarCopyAllClick( bindingOptions: BindingOptions, data: any ) : void {
        const copyDataJson: string = JSON.stringify( Convert.toJsonStringifyClone( data, _configuration, bindingOptions ), bindingOptions.events!.onCopyJsonReplacer, bindingOptions.jsonIndentSpaces );

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
        if ( bindingOptions._currentView.backPageButton !== null && !bindingOptions._currentView.backPageButton.disabled ) {
            bindingOptions._currentView.currentDataArrayPageIndex -= bindingOptions.paging!.columnsPerPage!;
    
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onBackPage!, bindingOptions._currentView.element );
        }
    }

    function onNextPage( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.nextPageButton !== null && !bindingOptions._currentView.nextPageButton.disabled ) {
            bindingOptions._currentView.currentDataArrayPageIndex += bindingOptions.paging!.columnsPerPage!;
                        
            renderControlContainer( bindingOptions, true );
            Trigger.customEvent( bindingOptions.events!.onNextPage!, bindingOptions._currentView.element );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Disabled Background
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlDisabledBackground( bindingOptions: BindingOptions ) : void {
        bindingOptions._currentView.disabledBackground = DomElement.create( bindingOptions._currentView.element, "div", "disabled-background" );
        bindingOptions._currentView.disabledBackground.onclick = () => onSideMenuClose( bindingOptions );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Side Menu
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlSideMenu( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions.sideMenu!.enabled ) {
            bindingOptions._currentView.sideMenu = DomElement.create( bindingOptions._currentView.element, "div", "side-menu" );

            const titleBar: HTMLElement = DomElement.create( bindingOptions._currentView.sideMenu, "div", "side-menu-title-bar" );

            if ( Is.definedString( bindingOptions.sideMenu!.titleText ) ) {
                const titleBarText: HTMLElement = DomElement.create( titleBar, "div", "side-menu-title-bar-text" );
                titleBarText.innerHTML = bindingOptions.sideMenu!.titleText!;
            }
            
            const titleBarControls: HTMLElement = DomElement.create( titleBar, "div", "side-menu-title-controls" );

            if ( bindingOptions.sideMenu!.showClearJsonButton && Is.definedObject( bindingOptions.data ) ) {
                const clearJsonButton: HTMLButtonElement = DomElement.createWithHTML( titleBarControls, "button", "clear-json", _configuration.text!.clearJsonSymbolText! ) as HTMLButtonElement;
                clearJsonButton.onclick = () => onSideMenuClearJson( bindingOptions );
    
                ToolTip.add( clearJsonButton, bindingOptions, _configuration.text!.clearJsonText! );
            }

            if ( bindingOptions.sideMenu!.showExportButton && Is.definedObject( bindingOptions.data ) ) {
                const exportButton: HTMLButtonElement = DomElement.createWithHTML( titleBarControls, "button", "export", _configuration.text!.exportButtonSymbolText! ) as HTMLButtonElement;
                exportButton.onclick = () => onExport( bindingOptions, bindingOptions.data );
    
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

    function onSideMenuImportClick( bindingOptions: BindingOptions, insertDataIndex: number = null! ) : void {
        const input: HTMLInputElement = DomElement.createWithNoContainer( "input" ) as HTMLInputElement;
        input.type = "file";
        input.accept = ".json";
        input.multiple = true;

        onSideMenuClose( bindingOptions );

        input.onchange = () => importFromFiles( input.files!, bindingOptions, insertDataIndex );
        input.click();
    }

    function onSideMenuOpen( bindingOptions: BindingOptions ) : void {
        if ( !bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.add( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "block";

            ToolTip.hide( bindingOptions );
            ContextMenu.hide( bindingOptions );
        }
    }

    function onSideMenuClose( bindingOptions: BindingOptions ) : boolean {
        let closed: boolean = false;

        if ( bindingOptions._currentView.sideMenu.classList.contains( "side-menu-open" ) ) {
            bindingOptions._currentView.sideMenu.classList.remove( "side-menu-open" );
            bindingOptions._currentView.disabledBackground.style.display = "none";

            ToolTip.hide( bindingOptions );
            ContextMenu.hide( bindingOptions );
    
            if ( bindingOptions._currentView.sideMenuChanged ) {
                setTimeout( () => {
                    renderControlContainer( bindingOptions );
                    setFooterStatusText( bindingOptions, _configuration.text!.ignoreDataTypesUpdated! );
                }, bindingOptions.sideMenu!.updateDisplayDelay );
            }

            closed = true;
        }

        return closed;
    }

    function onSideMenuClearJson( bindingOptions: BindingOptions ) : void {
        bindingOptions.data = null;

        renderControlContainer( bindingOptions );
        setFooterStatusText( bindingOptions, _configuration.text!.jsonUpdatedText! );
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

        for ( const dataType in bindingOptions._currentView.dataTypeCounts ) {
            if ( dataTypes.indexOf( dataType ) === Value.notFound ) {
                dataTypes.push( dataType );
            }
        }

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
            const currentPage: number = Math.ceil( ( bindingOptions._currentView.currentDataArrayPageIndex + 1 ) / bindingOptions.paging!.columnsPerPage! );
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
            const length: number = Size.length( value, bindingOptions.showCssStylesForHtmlObjects! );

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
            const size: string = Size.of( value, bindingOptions.showCssStylesForHtmlObjects! );

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
     * Render:  Roots
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderRootObject( container: HTMLElement, bindingOptions: BindingOptions, data: any, dataIndex: number, dataType: string ) : void {
        let actualData: any = data;
        
        if ( Is.definedImportedFilename( data ) ) {
            actualData = actualData.object;
        }

        const propertyNames: string[] = Obj.getPropertyNames( actualData, bindingOptions );
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
            const expandIcon: HTMLElement = bindingOptions.showExpandIcons ? DomElement.create( objectTypeTitle, "div", `opened-${bindingOptions.expandIconType}` ) : null!;
            let rootNameTitle: HTMLSpanElement = null!;

            if ( !bindingOptions.paging!.enabled || !Is.definedNumber( dataIndex ) || Is.definedImportedFilename( data ) ) {
                let rootName: string = bindingOptions.rootName!;

                if ( Is.definedImportedFilename( data ) ) {
                    rootName = data.filename;
                }

                if ( bindingOptions.showPropertyNameQuotes ) {
                    rootName = `\"${rootName}\"`;
                }

                rootNameTitle = DomElement.createWithHTML( objectTypeTitle, "span", "root-name", rootName );
                DomElement.createWithHTML( objectTypeTitle, "span", "split", _configuration.text!.propertyColonCharacter! );
            }

            const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} main-title` : "main-title", mainTitle ) as HTMLSpanElement;
            let openingBrace: HTMLSpanElement = null!;
            let closedBraces: HTMLSpanElement = null!;

            addObjectContentsBorder( objectTypeContents, bindingOptions );

            if ( bindingOptions.paging!.enabled && Is.definedNumber( dataIndex ) ) {
                let dataArrayIndex: string = bindingOptions.useZeroIndexingForArrays ? dataIndex.toString() : ( dataIndex + 1 ).toString();
    
                if ( bindingOptions.showArrayIndexBrackets ) {
                    dataArrayIndex = `[${dataArrayIndex}]`;
                }

                const beforeNode: HTMLSpanElement = Is.defined( rootNameTitle ) ? rootNameTitle : titleText;

                DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} data-array-index` : "data-array-index", dataArrayIndex, beforeNode );
                DomElement.createWithHTML( objectTypeTitle, "span", "split", _configuration.text!.propertyColonCharacter!, beforeNode );
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
            }

            if ( bindingOptions.showClosedObjectCurlyBraces ) {
                closedBraces = DomElement.createWithHTML( objectTypeTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
            }

            renderObjectValues( expandIcon, null!, objectTypeContents, bindingOptions, actualData, propertyNames, openingBrace, closedBraces, false, true, Char.empty, dataType, dataType !== DataType.object, 1 );
            addValueClickEvent( bindingOptions, titleText, actualData, dataType, false );
            addFooterSizeStatus( bindingOptions, actualData, titleText );
            addFooterLengthStatus( bindingOptions, actualData, titleText );
            renderValueContextMenuItems( bindingOptions, objectTypeTitle, false, actualData, actualData, null!, false, null! );
        }
    }

    function renderRootArray( container: HTMLElement, bindingOptions: BindingOptions, data: any, dataType: string ) : void {
        let actualData: any = data;
        
        if ( Is.definedImportedFilename( data ) ) {
            actualData = actualData.object;
        }

        let mainTitle: string = null!;

        if ( dataType === DataType.set ) {
            mainTitle = _configuration.text!.setText!;
        } else if ( dataType === DataType.array ) {
            mainTitle = _configuration.text!.arrayText!;
        }

        const objectTypeTitle: HTMLElement = DomElement.create( container, "div", "object-type-title" );
        const objectTypeContents: HTMLElement = DomElement.create( container, "div", "object-type-contents last-item" );
        const expandIcon: HTMLElement = bindingOptions.showExpandIcons ? DomElement.create( objectTypeTitle, "div", `opened-${bindingOptions.expandIconType}` ) : null!;
        
        if ( !bindingOptions.paging!.enabled || Is.definedImportedFilename( data ) ) {
            let rootName: string = bindingOptions.rootName!;

            if ( Is.definedImportedFilename( data ) ) {
                rootName = data.filename;
            }

            if ( bindingOptions.showPropertyNameQuotes ) {
                rootName = `\"${rootName}\"`;
            }

            DomElement.createWithHTML( objectTypeTitle, "span", "root-name", rootName );
            DomElement.createWithHTML( objectTypeTitle, "span", "split", _configuration.text!.propertyColonCharacter! );
        }
        
        const titleText: HTMLSpanElement = DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} main-title` : "main-title", mainTitle );
        let openingBracket: HTMLSpanElement = null!;
        let closedBrackets: HTMLSpanElement = null!;

        addObjectContentsBorder( objectTypeContents, bindingOptions );

        if ( bindingOptions.showObjectSizes ) {
            DomElement.createWithHTML( objectTypeTitle, "span", bindingOptions.showValueColors ? `${dataType} size` : "size", `[${data.length}]` );
        }

        if ( bindingOptions.showOpeningClosingSquaredBrackets ) {
            openingBracket = DomElement.createWithHTML( objectTypeTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
        }

        if ( bindingOptions.showClosedArraySquaredBrackets ) {
            closedBrackets = DomElement.createWithHTML( objectTypeTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
        }

        renderArrayValues( expandIcon, null!, objectTypeContents, bindingOptions, data, openingBracket, closedBrackets, false, true, Char.empty, dataType, dataType !== DataType.array, 1 );
        addValueClickEvent( bindingOptions, titleText, data, dataType, false );
        addFooterSizeStatus( bindingOptions, data, titleText );
        addFooterLengthStatus( bindingOptions, data, titleText );
        renderValueContextMenuItems( bindingOptions, objectTypeTitle, false, data, data, null!, false, null! );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Contents
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderObjectValues( expandIcon: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, propertyNames: string[], openingBrace: HTMLSpanElement, closedBraces: HTMLElement, addNoExpandIconToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean, indentationLevel: number ) : boolean {
        let propertiesAdded: boolean = true;
        const propertiesLength: number = propertyNames.length;
        const propertiesLengthForAutoClose: number = jsonPath !== Char.empty ? propertiesLength : 0;

        if ( propertiesLength === 0 && !bindingOptions.ignore!.emptyObjects ) {
            renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing, indentationLevel );
            propertiesAdded = false;

        } else if ( bindingOptions.maximum!.inspectionLevels! > 0 && indentationLevel > bindingOptions.maximum!.inspectionLevels! ) {
            renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.maximumInspectionLevelsReached!, true, false, Char.empty, parentType, preventEditing, indentationLevel );
            propertiesAdded = false;
        } else {

            for ( let propertyIndex: number = 0; propertyIndex < propertiesLength; propertyIndex++ ) {
                const propertyName: string = propertyNames[ propertyIndex ];
                const newJsonPath: string = jsonPath === Char.empty ? propertyName : `${jsonPath}${Char.backslash}${propertyName}`;
    
                if ( data.hasOwnProperty( propertyName ) ) {
                    renderValue( data, objectTypeContents, bindingOptions, propertyName, data[ propertyName ], propertyIndex === propertiesLength - 1, false, newJsonPath, parentType, preventEditing, indentationLevel );
                }
            }

            if ( objectTypeContents.children.length === 0 || ( bindingOptions.showOpenedObjectArrayBorders && objectTypeContents.children.length === 1 ) ) {
                renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing, indentationLevel );
                propertiesAdded = false;

            } else {
                if ( bindingOptions.showOpeningClosingCurlyBraces ) {
                    createClosingSymbol( bindingOptions, objectTypeContents, "}", addNoExpandIconToClosingSymbol, isLastItem );
                }
            }
        }

        addExpandIconEvent( bindingOptions, expandIcon, coma, objectTypeContents, openingBrace, closedBraces, propertiesLengthForAutoClose, parentType );

        return propertiesAdded;
    }

    function renderArrayValues( expandIcon: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, bindingOptions: BindingOptions, data: any, openingBracket: HTMLSpanElement, closedBrackets: HTMLElement, addNoExpandIconToClosingSymbol: boolean, isLastItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean, indentationLevel: number ) : boolean {
        let propertiesAdded: boolean = true;
        const dataLength: number = data.length;
        const dataLengthForAutoClose: number = jsonPath !== Char.empty ? dataLength : 0;

        if ( bindingOptions.maximum!.inspectionLevels! > 0 && indentationLevel > bindingOptions.maximum!.inspectionLevels! ) {
            renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.maximumInspectionLevelsReached!, true, false, Char.empty, parentType, preventEditing, indentationLevel );
            propertiesAdded = false;
        } else {

            if ( !bindingOptions.reverseArrayValues ) {
                for ( let dataIndex1: number = 0; dataIndex1 < dataLength; dataIndex1++ ) {
                    const actualIndex: number = Arr.getIndex( dataIndex1, bindingOptions );
                    const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;
    
                    renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex1 ], dataIndex1 === dataLength - 1, true, newJsonPath, parentType, preventEditing, indentationLevel );
                }
    
            } else {
                for ( let dataIndex2: number = dataLength; dataIndex2--; ) {
                    const actualIndex: number = Arr.getIndex( dataIndex2, bindingOptions );
                    const newJsonPath: string = jsonPath === Char.empty ? actualIndex.toString() : `${jsonPath}${Char.backslash}${actualIndex}`;
    
                    renderValue( data, objectTypeContents, bindingOptions, Arr.getIndexName( bindingOptions, actualIndex, dataLength ), data[ dataIndex2 ], dataIndex2 === 0, true, newJsonPath, parentType, preventEditing, indentationLevel );
                }
            }
    
            if ( objectTypeContents.children.length === 0 || ( bindingOptions.showOpenedObjectArrayBorders && objectTypeContents.children.length === 1 ) ) {
                renderValue( data, objectTypeContents, bindingOptions, Char.empty, _configuration.text!.noPropertiesText!, true, false, Char.empty, parentType, preventEditing, indentationLevel );
                propertiesAdded = false;
    
            } else {
                if ( bindingOptions.showOpeningClosingSquaredBrackets ) {
                    createClosingSymbol( bindingOptions, objectTypeContents, "]", addNoExpandIconToClosingSymbol, isLastItem );
                }
            }
        }

        addExpandIconEvent( bindingOptions, expandIcon, coma, objectTypeContents, openingBracket, closedBrackets, dataLengthForAutoClose, parentType );

        return propertiesAdded;
    }

    function renderValue( data: any, container: HTMLElement, bindingOptions: BindingOptions, name: string, value: any, isLastItem: boolean, isArrayItem: boolean, jsonPath: string, parentType: string, preventEditing: boolean, indentationLevel: number ) : void {
        const objectTypeValue: HTMLElement = DomElement.create( container, "div", "object-type-value" );
        const objectTypeValueTitle: HTMLElement = DomElement.create( objectTypeValue, "div", "object-type-value-title" );
        const expandIcon: HTMLElement = bindingOptions.showExpandIcons ? DomElement.create( objectTypeValueTitle, "div", `no-${bindingOptions.expandIconType}` ) : null!;
        let valueClass: string = null!;
        let valueElement: HTMLElement = null!;
        let ignored: boolean = false;
        let ignoredDataType: boolean = false;
        let dataType: string = null!;
        let nameElement: HTMLSpanElement = DomElement.create( objectTypeValueTitle, "span" );
        let allowEditing: boolean = false;
        let typeElement: HTMLSpanElement = null!;
        const isForEmptyProperties: boolean = !Is.definedString( name );
        let assignClickEvent: boolean = true;
        let openButton: HTMLSpanElement = null!;
        const columnIndex: number = bindingOptions._currentView.currentColumnBuildingIndex;

        if ( !isForEmptyProperties ) {
            let nameValue: string = Str.getMaximumLengthDisplay( name, bindingOptions.maximum!.propertyNameLength!, _configuration.text!.ellipsisText! );

            if ( isArrayItem || !bindingOptions.showPropertyNameQuotes ) {
                nameElement.innerHTML = nameValue;
            } else {
                nameElement.innerHTML = `\"${nameValue}\"`;
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

        if ( bindingOptions.showDataTypes && !isForEmptyProperties ) {
            typeElement = DomElement.createWithHTML( objectTypeValueTitle, "span", bindingOptions.showValueColors ? "data-type-color" : "data-type", Char.empty ) as HTMLSpanElement;
        }

        if ( Is.defined( nameElement ) && !isForEmptyProperties && bindingOptions.showValueColors && bindingOptions.showPropertyNameAndIndexColors  ) {
            nameElement.classList.add( parentType );
        }

        if ( Is.defined( nameElement ) && !isForEmptyProperties ) {
            DomElement.createWithHTML( objectTypeValueTitle, "span", "split", _configuration.text!.propertyColonCharacter! );

            if ( !preventEditing ) {
                makePropertyNameEditable( bindingOptions, data, name, nameElement, isArrayItem );
            } else {
                nameElement.ondblclick = DomElement.cancelBubble;
            }

            if ( Is.definedString( jsonPath ) ) {
                objectTypeValueTitle.setAttribute( Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME, jsonPath );
            }

            if ( !isArrayItem ) {
                addFooterSizeStatus( bindingOptions, name, nameElement );
                addFooterLengthStatus( bindingOptions, name, nameElement );
            }

            selectItemAndCompareProperties( bindingOptions, objectTypeValueTitle, jsonPath, columnIndex, value );
        }

        const renderCustomDataType: any | CustomDataType = Trigger.customEvent( bindingOptions.events!.onCustomDataTypeRender!, bindingOptions._currentView.element, value );
        
        if ( Is.defined( renderCustomDataType ) && renderCustomDataType !== false ) {
            dataType = renderCustomDataType.dataType;

            const ignoreValues: any = bindingOptions.ignore;
            const dataTypeKeyName: string = `${renderCustomDataType.dataType}Values`;

            if ( !ignoreValues.hasOwnProperty( dataTypeKeyName ) || !ignoreValues[ dataTypeKeyName ] ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", renderCustomDataType.class, renderCustomDataType.html );
                allowEditing = renderCustomDataType.allowEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( value === null ) {
            dataType = DataType.null;

            if ( !bindingOptions.ignore!.nullValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value undefined-or-null` : "value undefined-or-null";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, "null" );

                Trigger.customEvent( bindingOptions.events!.onNullRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( value === undefined ) {
            dataType = DataType.undefined;

            if ( !bindingOptions.ignore!.undefinedValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value undefined-or-null` : "value undefined-or-null";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, "undefined" );

                Trigger.customEvent( bindingOptions.events!.onUndefinedRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFunction( value ) ) {
            const functionName: FunctionName = Default.getFunctionName( value, _configuration );

            if ( functionName.isLambda ) {
                dataType = DataType.lambda;

                if ( !bindingOptions.ignore!.lambdaValues ) {
                    valueClass = bindingOptions.showValueColors ? `${dataType} value non-value` : "value non-value";
                    valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, functionName.name );
    
                    Trigger.customEvent( bindingOptions.events!.onLambdaRender!, bindingOptions._currentView.element, valueElement );
                    createComma( bindingOptions, objectTypeValueTitle, isLastItem );
    
                } else {
                    ignored = true;
                }

            } else {
                dataType = DataType.function;

                if ( !bindingOptions.ignore!.functionValues ) {
                    valueClass = bindingOptions.showValueColors ? `${dataType} value non-value` : "value non-value";
                    valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, functionName.name );
    
                    Trigger.customEvent( bindingOptions.events!.onFunctionRender!, bindingOptions._currentView.element, valueElement );
                    createComma( bindingOptions, objectTypeValueTitle, isLastItem );
    
                } else {
                    ignored = true;
                }
            }

        } else if ( Is.definedBoolean( value ) ) {
            dataType = DataType.boolean;

            if ( !bindingOptions.ignore!.booleanValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.booleanValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onBooleanRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedFloat( value ) ) {
            dataType = DataType.float;

            if ( !bindingOptions.ignore!.floatValues ) {
                const newValue: string = Convert.numberToFloatWithDecimalPlaces( value, bindingOptions.maximum!.decimalPlaces! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newValue );
                allowEditing = bindingOptions.allowEditing!.floatValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onFloatRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedNumber( value ) ) {
            dataType = DataType.number;

            if ( !bindingOptions.ignore!.numberValues ) {
                let newNumberValue: string = Str.getMaximumLengthDisplay( value.toString(), bindingOptions.maximum!.numberLength!, _configuration.text!.ellipsisText! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newNumberValue );
                allowEditing = bindingOptions.allowEditing!.numberValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onNumberRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedBigInt( value ) ) {
            dataType = DataType.bigint;

            if ( !bindingOptions.ignore!.bigintValues ) {
                let newBigIntValue: string = Str.getMaximumLengthDisplay( value.toString(), bindingOptions.maximum!.bigIntLength!, _configuration.text!.ellipsisText! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newBigIntValue );
                allowEditing = bindingOptions.allowEditing!.bigIntValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onBigIntRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.String.guid( value ) ) {
            dataType = DataType.guid;

            if ( !bindingOptions.ignore!.guidValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.guidValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onGuidRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && ( Is.String.hexColor( value ) || Is.String.rgbColor( value ) ) ) {
            dataType = DataType.color;

            if ( !bindingOptions.ignore!.colorValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value );
                allowEditing = bindingOptions.allowEditing!.colorValues! && !preventEditing;

                if ( bindingOptions.showValueColors ) {
                    valueElement.style.color = value;
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onColorRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.definedUrl( value ) ) {
            dataType = DataType.url;

            if ( !bindingOptions.ignore!.urlValues ) {
                let newUrlValue: string = Str.getMaximumLengthDisplay( value, bindingOptions.maximum!.urlLength!, _configuration.text!.ellipsisText! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newUrlValue );
                allowEditing = bindingOptions.allowEditing!.urlValues! && !preventEditing;

                if ( bindingOptions.showUrlOpenButtons ) {
                    openButton = DomElement.createWithHTML( objectTypeValueTitle, "span", bindingOptions.showValueColors ? "open-button-color" : "open-button", `${_configuration.text!.openText}${Char.space}${_configuration.text!.openSymbolText}` );
                    openButton.onclick = () => window.open( value );
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing, openButton );
                Trigger.customEvent( bindingOptions.events!.onUrlRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedString( value ) && Is.definedEmail( value ) ) {
            dataType = DataType.email;

            if ( !bindingOptions.ignore!.emailValues ) {
                let newEmailValue: string = Str.getMaximumLengthDisplay( value, bindingOptions.maximum!.emailLength!, _configuration.text!.ellipsisText! );

                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newEmailValue );
                allowEditing = bindingOptions.allowEditing!.emailValues! && !preventEditing;

                if ( bindingOptions.showEmailOpenButtons ) {
                    openButton = DomElement.createWithHTML( objectTypeValueTitle, "span", bindingOptions.showValueColors ? "open-button-color" : "open-button", `${_configuration.text!.openText}${Char.space}${_configuration.text!.openSymbolText}` );
                    openButton.onclick = () => window.open( `mailto:${value}` );
                }

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing, openButton );
                Trigger.customEvent( bindingOptions.events!.onEmailRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedStringAny( value ) ) {
            dataType = DataType.string;

            if ( !bindingOptions.ignore!.stringValues || isForEmptyProperties ) {
                const parsedValue: any = Convert.stringToParsedValue( value, bindingOptions );

                if ( Is.defined( parsedValue ) ) {
                    renderValue( data, container, bindingOptions, name, parsedValue, isLastItem, isArrayItem, jsonPath, parentType, preventEditing, indentationLevel );
                    ignored = true;
                    ignoredDataType = true;

                } else {
                    let newStringValue: string = value;

                    if ( !isForEmptyProperties ) {
                        if ( !Is.definedString( newStringValue ) ) {
                            newStringValue = bindingOptions.emptyStringValue!;
                        }

                        newStringValue = Str.getMaximumLengthDisplay( newStringValue, bindingOptions.maximum!.stringLength!, _configuration.text!.ellipsisText! );
        
                        newStringValue = bindingOptions.showStringQuotes ? `\"${newStringValue}\"` : newStringValue;
                        valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                        allowEditing = bindingOptions.allowEditing!.stringValues! && !preventEditing;
                    } else {

                        valueClass = "no-properties-text";
                        allowEditing = false;
                        assignClickEvent = false;
                    }

                    valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, newStringValue );

                    if ( !isForEmptyProperties ) {
                        makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                        Trigger.customEvent( bindingOptions.events!.onStringRender!, bindingOptions._currentView.element, valueElement );
                        createComma( bindingOptions, objectTypeValueTitle, isLastItem );
                    }
                }

            } else {
                ignored = true;
            }

        } else if ( Is.definedDate( value ) ) {
            dataType = DataType.date;

            if ( !bindingOptions.ignore!.dateValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, DateTime.getCustomFormattedDateText( _configuration, value, bindingOptions.dateTimeFormat! ) );
                allowEditing = bindingOptions.allowEditing!.dateValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onDateRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedSymbol( value ) ) {
            dataType = DataType.symbol;

            if ( !bindingOptions.ignore!.symbolValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value.toString() );
                allowEditing = bindingOptions.allowEditing!.symbolValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onSymbolRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedRegExp( value ) ) {
            dataType = DataType.regexp;

            if ( !bindingOptions.ignore!.regexpValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value.source.toString() );
                allowEditing = bindingOptions.allowEditing!.regExpValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );
                Trigger.customEvent( bindingOptions.events!.onRegExpRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

            } else {
                ignored = true;
            }

        } else if ( Is.definedImage( value ) ) {
            dataType = DataType.image;

            if ( !bindingOptions.ignore!.imageValues ) {
                valueClass = bindingOptions.showValueColors ? `${dataType} value` : "value";
                valueElement = DomElement.create( objectTypeValueTitle, "span", valueClass );
                allowEditing = bindingOptions.allowEditing!.imageValues! && !preventEditing;

                makePropertyValueEditable( bindingOptions, data, name, value, valueElement, isArrayItem, allowEditing );

                const image: HTMLImageElement = DomElement.create( valueElement, "img" ) as HTMLImageElement;
                image.src = value.src;

                Trigger.customEvent( bindingOptions.events!.onImageRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

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

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValueTitle, "span", bindingOptions.showValueColors ? dataType : Char.empty );
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
                    }

                    if ( bindingOptions.showClosedObjectCurlyBraces ) {
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    const coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                    const propertiesAdded: boolean = renderObjectValues( expandIcon, coma, objectTypeContents, bindingOptions, htmlObject, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, true, indentationLevel + 1 );
                    
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
                const objectTitle: HTMLElement = DomElement.create( objectTypeValueTitle, "span", bindingOptions.showValueColors ? dataType : Char.empty );
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

                if ( bindingOptions.showOpeningClosingSquaredBrackets ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
                }

                if ( bindingOptions.showClosedArraySquaredBrackets ) {
                    closedBrackets = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
                }

                const coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                const propertiesAdded: boolean = renderArrayValues( expandIcon, coma, arrayTypeContents, bindingOptions, arrayValues, openingBracket, closedBrackets, true, isLastItem, jsonPath, dataType, true, indentationLevel + 1 );

                if ( !propertiesAdded && bindingOptions.showOpeningClosingSquaredBrackets ) {
                    openingBracket.parentNode!.removeChild( openingBracket );
                    closedBrackets.parentNode!.removeChild( closedBrackets );
                }
                
            } else {
                ignored = true;
            }

        } else if ( Is.definedArray( value ) ) {
            dataType = DataType.array;

            if ( !bindingOptions.ignore!.arrayValues ) {
                const objectTitle: HTMLElement = DomElement.create( objectTypeValueTitle, "span", bindingOptions.showValueColors ? dataType : Char.empty );
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

                if ( bindingOptions.showOpeningClosingSquaredBrackets ) {
                    openingBracket = DomElement.createWithHTML( objectTitle, "span", "opening-symbol", "[" ) as HTMLSpanElement;
                }

                if ( bindingOptions.showClosedArraySquaredBrackets ) {
                    closedBrackets = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "[ ... ]" ) as HTMLSpanElement;
                }

                const coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                const propertiesAdded: boolean = renderArrayValues( expandIcon, coma, arrayTypeContents, bindingOptions, value, openingBracket, closedBrackets, true, isLastItem, jsonPath, dataType, false, indentationLevel + 1 );

                if ( !propertiesAdded && bindingOptions.showOpeningClosingSquaredBrackets ) {
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

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValueTitle, "span", bindingOptions.showValueColors ? dataType : Char.empty );
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
                    }

                    if ( bindingOptions.showClosedObjectCurlyBraces ) {
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    const coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                    const propertiesAdded: boolean = renderObjectValues( expandIcon, coma, objectTypeContents, bindingOptions, valueObject, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, true, indentationLevel + 1 );

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

                    const objectTitle: HTMLElement = DomElement.create( objectTypeValueTitle, "span", bindingOptions.showValueColors ? dataType : Char.empty );
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
                    }

                    if ( bindingOptions.showClosedObjectCurlyBraces ) {
                        closedBraces = DomElement.createWithHTML( objectTitle, "span", "closed-symbols", "{ ... }" ) as HTMLSpanElement;
                    }
    
                    const coma: HTMLSpanElement = createComma( bindingOptions, objectTitle, isLastItem );
                    const propertiesAdded: boolean = renderObjectValues( expandIcon, coma, objectTypeContents, bindingOptions, value, propertyNames, openingBrace, closedBraces, true, isLastItem, jsonPath, dataType, false, indentationLevel + 1 );
                    
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
                valueElement = DomElement.createWithHTML( objectTypeValueTitle, "span", valueClass, value.toString() );

                Trigger.customEvent( bindingOptions.events!.onUnknownRender!, bindingOptions._currentView.element, valueElement );
                createComma( bindingOptions, objectTypeValueTitle, isLastItem );

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
                    renderValueContextMenuItems( bindingOptions, valueElement, allowEditing, data, value, name, isArrayItem, openButton );
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

            if ( !bindingOptions.showExpandIcons ) {
                objectContents.classList.add( "object-border-no-toggles" );
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
            propertyName.ondblclick = ( ev: MouseEvent ) => {
                DomElement.cancelBubble( ev );

                let originalArrayIndex: number = 0;
                let statusBarMessage: string = null!;

                clearTimeout( bindingOptions._currentView.valueClickTimerId );
                
                bindingOptions._currentView.valueClickTimerId = 0;
                bindingOptions._currentView.editMode = true;

                propertyName.classList.add( "editable-name" );

                if ( isArrayItem ) {
                    propertyName.innerHTML = Arr.getIndexFromBrackets( originalPropertyName ).toString();
                } else {
                    propertyName.innerHTML = originalPropertyName;
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
    
                propertyName.onkeydown = ( ev: KeyboardEvent ) => {
                    if ( ev.code === KeyCode.escape ) {
                        ev.preventDefault();
                        propertyName.setAttribute( "contenteditable", "false" );

                    } else if ( ev.code === KeyCode.enter ) {
                        ev.preventDefault();
    
                        const newPropertyName: string = propertyName.innerText;

                        if ( isArrayItem ) {
                            if ( Is.definedString( newPropertyName ) && !isNaN( +newPropertyName ) ) {
                                let newArrayIndex: number = +newPropertyName;

                                if ( !bindingOptions.useZeroIndexingForArrays ) {
                                    newArrayIndex--;
                                }

                                if ( originalArrayIndex !== newArrayIndex ) {
                                    statusBarMessage = _configuration.text!.indexUpdatedText!;

                                    Arr.moveIndex( data, originalArrayIndex, newArrayIndex );
                                    Trigger.customEvent( bindingOptions.events!.onJsonEdit!, bindingOptions._currentView.element );
                                }
                                
                            } else {
                                data.splice( Arr.getIndexFromBrackets( originalPropertyName ), 1 );
    
                                statusBarMessage = _configuration.text!.itemDeletedText!;
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
            propertyValue.ondblclick = ( ev: MouseEvent ) => {
                enableValueEditingMode( ev, bindingOptions, data, originalPropertyName, originalPropertyValue, propertyValue, isArrayItem, openButton );
            };
        }
    }

    function enableValueEditingMode( ev: MouseEvent, bindingOptions: BindingOptions, data: any, originalPropertyName: string, originalPropertyValue: any, propertyValue: HTMLSpanElement, isArrayItem: boolean, openButton: HTMLSpanElement = null! ) : void {
        let statusBarMessage: string = null!;

        DomElement.cancelBubble( ev );

        clearTimeout( bindingOptions._currentView.valueClickTimerId );

        bindingOptions._currentView.valueClickTimerId = 0;
        bindingOptions._currentView.editMode = true;

        propertyValue.classList.add( "editable" );
        propertyValue.setAttribute( "contenteditable", "true" );

        if ( Is.definedDate( originalPropertyValue ) && !bindingOptions.includeTimeZoneInDates ) {
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

        propertyValue.onkeydown = ( ev: KeyboardEvent ) => {
            if ( ev.code === KeyCode.escape ) {
                ev.preventDefault();
                propertyValue.setAttribute( "contenteditable", "false" );
                
            } else if ( ev.code === KeyCode.enter ) {
                ev.preventDefault();

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
    }

    function addValueClickEvent( bindingOptions: BindingOptions, valueElement: HTMLElement, value: any, type: string, allowEditing: boolean ) : void {
        if ( Is.definedFunction( bindingOptions.events!.onValueClick ) ) {
            valueElement.onclick = () => {
                let clickValue: any = value;

                if ( bindingOptions.convertClickedValuesToString ) {
                    clickValue = JSON.stringify( Convert.toJsonStringifyClone( value, _configuration, bindingOptions ), bindingOptions.events!.onCopyJsonReplacer, bindingOptions.jsonIndentSpaces );
                }

                if ( allowEditing ) {
                    bindingOptions._currentView.valueClickTimerId = setTimeout( () => {
                        if ( !bindingOptions._currentView.editMode ) {
                            Trigger.customEvent( bindingOptions.events!.onValueClick!, bindingOptions._currentView.element, clickValue, type );
                        }
                    }, bindingOptions.editingValueClickDelay );

                } else {
                    valueElement.ondblclick = DomElement.cancelBubble;

                    Trigger.customEvent( bindingOptions.events!.onValueClick!, bindingOptions._currentView.element, clickValue, type );
                }
            };

        } else {
            valueElement.classList.add( "no-hover" );
        }
    }

    function addExpandIconEvent( bindingOptions: BindingOptions, expandIcon: HTMLElement, coma: HTMLSpanElement, objectTypeContents: HTMLElement, openingSymbol: HTMLSpanElement, closedSymbols: HTMLElement, dataLength: number, dataType: string ) : void {
        const panelId: number = bindingOptions._currentView.contentPanelsIndex;
        const dataArrayIndex: number = bindingOptions._currentView.contentPanelsDataIndex;
        const columnLayoutProcessingIndex: number = bindingOptions._currentView.currentColumnBuildingIndex;

        if ( !bindingOptions._currentView.contentPanelsOpen.hasOwnProperty( dataArrayIndex ) ) {
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ] = {} as ContentPanels;
        }

        const hideFunc: Function = ( updateLineNumbers: boolean = true ) : void => {
            objectTypeContents.style.display = "none";
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = true;

            if ( Is.defined( expandIcon ) ) {
                expandIcon.className = `closed-${bindingOptions.expandIconType!}`;
            }

            if ( Is.defined( openingSymbol ) ) {
                openingSymbol.style.display = "none";
            }

            if ( Is.defined( closedSymbols ) ) {
                closedSymbols.style.display = "inline-block";
            }

            if ( Is.defined( coma ) ) {
                coma.style.display = "inline-block";
            }

            if ( updateLineNumbers ) {
                renderControlColumnLineNumbers( columnLayoutProcessingIndex, bindingOptions );
            }
        };

        const showFunc: Function = ( ev: MouseEvent, updateLineNumbers: boolean = true ) : void => {
            if ( Is.defined( ev ) ) {
                DomElement.cancelBubble( ev );

                if ( !_key_Control_Pressed ) {
                    removeSelectedItemsAndComparedProperties( bindingOptions );
                }
            }
            
            objectTypeContents.style.display = "block";
            bindingOptions._currentView.contentPanelsOpen[ dataArrayIndex ][ panelId ] = false;

            if ( Is.defined( expandIcon ) ) {
                expandIcon.className = `opened-${bindingOptions.expandIconType}`;
            }

            if ( Is.defined( openingSymbol ) ) {
                openingSymbol.style.display = "inline-block";
            }

            if ( Is.defined( closedSymbols ) ) {
                closedSymbols.style.display = "none";
            }

            if ( Is.defined( coma ) ) {
                coma.style.display = "none";
            }

            if ( updateLineNumbers ) {
                renderControlColumnLineNumbers( columnLayoutProcessingIndex, bindingOptions );
            }
        };

        const conditionFunc: Function = ( ev: MouseEvent, condition: boolean, updateLineNumbers: boolean = true ) : void => {
            if ( Is.defined( ev ) ) {
                DomElement.cancelBubble( ev );

                if ( !_key_Control_Pressed ) {
                    removeSelectedItemsAndComparedProperties( bindingOptions );
                }
            }

            if ( condition ) {
                hideFunc( updateLineNumbers );
            } else {
                showFunc( null, updateLineNumbers );
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

        if ( Is.defined( expandIcon ) ) {
            expandIcon.onclick = ( ev: MouseEvent ) => conditionFunc( ev, expandIcon.className === `opened-${bindingOptions.expandIconType!}` );
            expandIcon.ondblclick = DomElement.cancelBubble;
        }

        if ( Is.defined( closedSymbols ) ) {
            closedSymbols.onclick = ( ev: MouseEvent ) => showFunc( ev );
            closedSymbols.ondblclick = DomElement.cancelBubble;
        }

        conditionFunc( null, isClosed, false );

        bindingOptions._currentView.contentPanelsIndex++;
    }

    function createComma( bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean ) : HTMLSpanElement {
        let result: HTMLSpanElement = null!;

        if ( bindingOptions.showCommas && !isLastItem ) {
            result = DomElement.createWithHTML( objectTypeValue, "span", "comma", Char.coma ) as HTMLSpanElement;
        }

        return result;
    }

    function createClosingSymbol( bindingOptions: BindingOptions, container: HTMLElement, symbol: string, addNoExpandIcon: boolean, isLastItem: boolean ) : void {
        const symbolContainer: HTMLElement = DomElement.create( container, "div", "closing-symbol" );
        
        if ( ( addNoExpandIcon && bindingOptions.showExpandIcons ) || bindingOptions.showOpenedObjectArrayBorders ) {
            DomElement.create( symbolContainer, "div", `no-${bindingOptions.expandIconType}` );
        }
        
        DomElement.createWithHTML( symbolContainer, "div", "object-type-end", symbol );

        createComma( bindingOptions, symbolContainer, isLastItem )
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Selected Items / Property Comparisons
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function selectItemAndCompareProperties( bindingOptions: BindingOptions, objectTypeValueTitle: HTMLElement, jsonPath: string, currentColumnIndex: number, data: any ) : void {
        objectTypeValueTitle.onclick = ( ev: MouseEvent ) => {
            DomElement.cancelBubble( ev );

            const itemIsSelected: boolean = objectTypeValueTitle.classList.contains( "highlight-selected" ) && _key_Control_Pressed;
            const columns: ColumnLayout[] = bindingOptions._currentView.currentContentColumns;
            const columnsLength: number = bindingOptions._currentView.currentContentColumns.length;
    
            let elementsHighlighted: boolean = false;

            if ( !_key_Control_Pressed ) {
                bindingOptions._currentView.selectedValues = [];
            }
    
            for ( let columnIndex: number = 0; columnIndex < columnsLength; columnIndex++ ) {
                const valueElements: NodeListOf<Element> = columns[ columnIndex ].column.querySelectorAll( ".object-type-value-title" );
                const valueElementsLength: number = valueElements.length;
    
                for ( let valueElementIndex: number = 0; valueElementIndex < valueElementsLength; valueElementIndex++ ) {
                    const valueElement: HTMLElement = valueElements[ valueElementIndex ] as HTMLElement;
    
                    if ( !_key_Control_Pressed ) {
                        valueElement.classList.remove( "highlight-selected" );
                        valueElement.classList.remove( "highlight-compare" );
                    }
    
                    if ( isCompareColumnValuesEnabled( bindingOptions ) && columnIndex !== currentColumnIndex ) {
                        const valueJsonPath: string = valueElement.getAttribute( Constants.JSONTREE_JS_ATTRIBUTE_PATH_NAME )!;
    
                        if ( Is.definedString( valueJsonPath ) && valueJsonPath === jsonPath ) {
                            if ( !itemIsSelected ) {
                                valueElement.classList.add( "highlight-compare" );
                            } else {
                                valueElement.classList.remove( "highlight-compare" );
                            }
                            
                            elementsHighlighted = true;
                        }
                    }
                }
    
                if ( elementsHighlighted ) {
                    renderControlColumnLineNumbers( columnIndex, bindingOptions );
                }
            }
    
            if ( !itemIsSelected ) {
                objectTypeValueTitle.classList.add( "highlight-selected" );
                bindingOptions._currentView.selectedValues.push( data );

            } else {
                objectTypeValueTitle.classList.remove( "highlight-selected" );
                bindingOptions._currentView.selectedValues.splice( bindingOptions._currentView.selectedValues.indexOf( data ), 1 );
            }

            Trigger.customEvent( bindingOptions.events!.onSelectionChange!, bindingOptions._currentView.element );
            renderControlColumnLineNumbers( currentColumnIndex, bindingOptions );
        };
    }

    function removeSelectedItemsAndComparedProperties( bindingOptions: BindingOptions ) : void {
        if ( bindingOptions._currentView.selectedValues.length > 0 ) {
            const columns: ColumnLayout[] = bindingOptions._currentView.currentContentColumns;
            const columnsLength: number = bindingOptions._currentView.currentContentColumns.length;
    
            bindingOptions._currentView.selectedValues = [];
    
            for ( let columnIndex: number = 0; columnIndex < columnsLength; columnIndex++ ) {
                let classesRemoved: boolean = false;
    
                const valueElements: NodeListOf<Element> = columns[ columnIndex ].column.querySelectorAll( ".object-type-value-title" );
                const valueElementsLength: number = valueElements.length;
    
                for ( let valueElementIndex: number = 0; valueElementIndex < valueElementsLength; valueElementIndex++ ) {
                    const valueElement: HTMLElement = valueElements[ valueElementIndex ] as HTMLElement;
    
                    if ( valueElement.classList.contains( "highlight-selected" ) ) {
                        valueElement.classList.remove( "highlight-selected" );
                        classesRemoved = true;
                    }
    
                    if ( isCompareColumnValuesEnabled( bindingOptions ) && valueElement.classList.contains( "highlight-compare" ) ) {
                        valueElement.classList.remove( "highlight-compare" );
                        classesRemoved = true;
                    }
                }
    
                if ( classesRemoved ) {
                    renderControlColumnLineNumbers( columnIndex, bindingOptions );
                    Trigger.customEvent( bindingOptions.events!.onSelectionChange!, bindingOptions._currentView.element );
                }
            }
        }
    }

    function isCompareColumnValuesEnabled( bindingOptions: BindingOptions ) : boolean {
        return bindingOptions.paging!.enabled! && bindingOptions.paging!.columnsPerPage! > 1 && bindingOptions.paging!.allowComparisons!;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Value Context Menu
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderValueContextMenuItems( bindingOptions: BindingOptions, valueElement: HTMLSpanElement, allowEditing: boolean, data: any, value: any, propertyName: string, isArrayItem: boolean, openButton: HTMLSpanElement ) : void {
        valueElement.oncontextmenu = ( ev: MouseEvent ) => {
            DomElement.cancelBubble( ev );

            bindingOptions._currentView.contextMenu.innerHTML = Char.empty;

            if ( allowEditing && bindingOptions._currentView.selectedValues.length <= 1 ) {
                const editMenuItem: HTMLElement = ContextMenu.addMenuItem( bindingOptions, _configuration.text!.editSymbolButtonText!, _configuration.text!.editButtonText! );
                editMenuItem.onclick = ( ev: MouseEvent )  => onContextMenuItemEdit( ev, bindingOptions, valueElement, data, propertyName, value, isArrayItem, openButton );
            }
            
            const copyMenuItem: HTMLElement = ContextMenu.addMenuItem( bindingOptions, _configuration.text!.copyButtonSymbolText!, _configuration.text!.copyButtonText! );
            copyMenuItem.onclick = ( ev: MouseEvent )  => onContextMenuItemCopy( ev, bindingOptions, value );

            if ( allowEditing && bindingOptions._currentView.selectedValues.length <= 1 ) {
                const removeMenuItem: HTMLElement = ContextMenu.addMenuItem( bindingOptions, _configuration.text!.removeSymbolButtonText!, _configuration.text!.removeButtonText! );
                removeMenuItem.onclick = ( ev: MouseEvent )  => onContextMenuItemRemove( ev, bindingOptions, data, propertyName, isArrayItem );
            }

            DomElement.showElementAtMousePosition( ev, bindingOptions._currentView.contextMenu, 0 );
        };
    }

    function onContextMenuItemEdit( ev: MouseEvent, bindingOptions: BindingOptions, valueElement: HTMLSpanElement, data: any, propertyName: string, value: any, isArrayItem: boolean, openButton: HTMLSpanElement ) : void {
        DomElement.cancelBubble( ev );

        enableValueEditingMode( ev, bindingOptions, data, propertyName, value, valueElement, isArrayItem, openButton );

        ContextMenu.hide( bindingOptions );
    }

    function onContextMenuItemCopy( ev: MouseEvent, bindingOptions: BindingOptions, value: any ) : void {
        DomElement.cancelBubble( ev );

        let copyValue: any = value;

        if ( bindingOptions._currentView.selectedValues.length !== 0 ) {
            copyValue = bindingOptions._currentView.selectedValues;
        }

        onCopy( bindingOptions, copyValue );

        ContextMenu.hide( bindingOptions );
    }

    function onContextMenuItemRemove( ev: MouseEvent, bindingOptions: BindingOptions, data: any, propertyName: string, isArrayItem: boolean ) : void {
        DomElement.cancelBubble( ev );

        if ( isArrayItem ) {
            data.splice( Arr.getIndexFromBrackets( propertyName ), 1 );
        } else {
            delete data[ propertyName ];
        }

        ContextMenu.hide( bindingOptions );

        renderControlContainer( bindingOptions, false );
        setFooterStatusText( bindingOptions, _configuration.text!.itemDeletedText! );
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
            dragAndDropBackground.ondrop = ( ev: DragEvent ) => onDropFiles( ev, bindingOptions );
        }
    }

    function onDragStart( bindingOptions: BindingOptions, dragAndDropBackground: HTMLElement ) : void {
        if ( !bindingOptions._currentView.columnDragging ) {
            dragAndDropBackground.style.display = "block"
        }
    }

    function onDropFiles( ev: DragEvent, bindingOptions: BindingOptions ) : void {
        DomElement.cancelBubble( ev );

        bindingOptions._currentView.dragAndDropBackground.style.display = "none";

        if ( Is.defined( window.FileReader ) && ev.dataTransfer!.files.length > 0 ) {
            importFromFiles( ev.dataTransfer!.files, bindingOptions );
        }
    }

    function importFromFiles( files: FileList, bindingOptions: BindingOptions, insertDataIndex: number = null! ) : void {
        let filesLength: number = files.length;
        let filesRead: number = 0;
        let filesData: Record<string, any> = {} as Record<string, any>;

        const onFileLoad = ( data: any, filename: string ) : void => {
            filesRead++;
            filesData[ filename ] = data;

            if ( filesRead === filesLength ) {
                importLoadedFiles( bindingOptions, filesData, insertDataIndex, filesRead, filesLength );
            }
        };

        for ( let fileIndex: number = 0; fileIndex < filesLength; fileIndex++ ) {
            const file: File = files[ fileIndex ];
            const fileExtension: string = file!.name!.split( Char.dot )!.pop()!.toLowerCase();

            if ( fileExtension === "json" ) {
                importFromJson( file, onFileLoad );
            } else {
                filesLength--;
            }
        }
    }

    function importFromJson( file: File, onFileLoad: ( data: any, filename: string ) => void ) : void {
        const reader: FileReader = new FileReader();
        let renderData: ImportedFilename = null!;

        reader.onloadend = () => onFileLoad( renderData, file.name );
    
        reader.onload = ( ev: ProgressEvent<FileReader> ) => {
            const json: StringToJson = Convert.jsonStringToObject( ev.target!.result, _configuration );

            if ( json.parsed && Is.definedObject( json.object ) ) {
                renderData = new ImportedFilename();
                renderData.filename = file.name;
                renderData.object = json.object;
            }
        };

        reader.readAsText( file );
    }

    function importLoadedFiles( bindingOptions: BindingOptions, filesData: Record<string, any>, insertDataIndex: number, filesRead: number, filesLength: number ) : void {
        bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;

        const keys: string[] = Object.keys( filesData ) as Array<string>;
        keys.sort();

        if ( Is.definedNumber( insertDataIndex ) ) {
            for ( let keyIndex: number = 0; keyIndex < filesRead; keyIndex++ ) {
                if ( insertDataIndex > bindingOptions.data.length - 1 ) {
                    bindingOptions.data.push( filesData[ keys[ keyIndex ] ] );
                } else {
                    bindingOptions.data.splice( insertDataIndex, 0, filesData[ keys[ keyIndex ] ] );
                }
            }

            bindingOptions._currentView.currentDataArrayPageIndex = insertDataIndex - ( insertDataIndex % bindingOptions.paging!.columnsPerPage! );
        } else {

            bindingOptions._currentView.currentDataArrayPageIndex = 0;

            if ( filesRead === 1 ) {
                bindingOptions.data = filesData[ keys[ 0 ] ];
            } else {
                bindingOptions.data = [];

                for ( let keyIndex: number = 0; keyIndex < filesRead; keyIndex++ ) {
                    bindingOptions.data.push( filesData[ keys[ keyIndex ] ] );
                }
            }
        }

        renderControlContainer( bindingOptions );
        setFooterStatusText( bindingOptions, _configuration.text!.importedText!.replace( "{0}", filesLength.toString() ) );
        Trigger.customEvent( bindingOptions.events!.onSetJson!, bindingOptions._currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Export
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function onExport( bindingOptions: BindingOptions, data: any ) : void {
        const contents: string = JSON.stringify( Convert.toJsonStringifyClone( data, _configuration, bindingOptions ), bindingOptions.events!.onCopyJsonReplacer, bindingOptions.jsonIndentSpaces );

        if ( Is.definedString( contents ) ) {
            const tempLink: HTMLElement = DomElement.create( document.body, "a" );
            tempLink.style.display = "none";
            tempLink.setAttribute( "target", "_blank" );
            tempLink.setAttribute( "href", `data:application/json;charset=utf-8,${encodeURIComponent( contents )}` );
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
        const windowFunc: Function = addEvents ? window.addEventListener : window.removeEventListener;

        documentFunc( "keydown", ( ev: KeyboardEvent ) => onDocumentKeyDown( ev, bindingOptions ) );
        documentFunc( "keyup", ( ev: KeyboardEvent ) => onDocumentKeyUp( ev ) );
        documentFunc( "contextmenu", () => onWindowContextMenuOrClick( bindingOptions ) );
        windowFunc( "click", () => onWindowContextMenuOrClick( bindingOptions ) );
        windowFunc( "focus", () => _key_Control_Pressed = false );
    }

    function onWindowContextMenuOrClick( bindingOptions: BindingOptions ) : void {
        if ( !_key_Control_Pressed ) {
            removeSelectedItemsAndComparedProperties( bindingOptions );
        }
    }

    function onDocumentKeyDown( ev: KeyboardEvent, bindingOptions: BindingOptions ) : void {
        _key_Control_Pressed = isCommandKey( ev );

        if ( bindingOptions.shortcutKeysEnabled && _elements_Data_Count === 1 && _elements_Data.hasOwnProperty( bindingOptions._currentView.element.id ) && !bindingOptions._currentView.editMode ) {
            if ( isCommandKey( ev ) && ev.code === KeyCode.C ) {
                ev.preventDefault();
                onTitleBarCopyAllClick( bindingOptions, bindingOptions.data );
            
            } else if ( isCommandKey( ev ) && ev.code === KeyCode.f11 ) {
                ev.preventDefault();
                onTitleBarDblClick( bindingOptions );

            } else if ( ev.code === KeyCode.left ) {
                ev.preventDefault();
                onBackPage( bindingOptions );

            } else if ( ev.code === KeyCode.right ) {
                ev.preventDefault();
                onNextPage( bindingOptions );

            } else if ( ev.code === KeyCode.up ) {
                ev.preventDefault();
                onCloseAll( bindingOptions );

            } else if ( ev.code === KeyCode.down ) {
                ev.preventDefault();
                onOpenAll( bindingOptions );

            } else if ( ev.code === KeyCode.escape ) {
                ev.preventDefault();

                if ( !onSideMenuClose( bindingOptions ) && !_key_Control_Pressed ) {
                    removeSelectedItemsAndComparedProperties( bindingOptions );
                }
            }
        }
    }

    function onDocumentKeyUp( ev: KeyboardEvent ) : void {
        _key_Control_Pressed = isCommandKey( ev );
    }

    function isCommandKey( ev: KeyboardEvent ) : boolean {
        return ev.ctrlKey || ev.metaKey;
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:  Helpers:  Destroy
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    function destroyElement( bindingOptions: BindingOptions ) : void {
        bindingOptions._currentView.element.innerHTML = Char.empty;
        bindingOptions._currentView.element.classList.remove( "json-tree-js" );
        bindingOptions._currentView.element.classList.remove( "full-screen" );

        if ( Is.definedString( bindingOptions.class ) ) {
            const classes: string[] = bindingOptions.class!.split( Char.space );
            const classesLength: number = classes.length;

            for ( let classIndex: number = 0; classIndex < classesLength; classIndex++ ) {
                bindingOptions._currentView.element.classList.remove( classes[ classIndex ].trim() );
            }
        }

        if ( bindingOptions._currentView.element.className.trim() === Char.empty ) {
            bindingOptions._currentView.element.removeAttribute( "class" );
        }

        if ( bindingOptions._currentView.idSet ) {
            bindingOptions._currentView.element.removeAttribute( "id" );
        }

        buildDocumentEvents( bindingOptions, false );

        ToolTip.assignToEvents( bindingOptions, false );
        ContextMenu.assignToEvents( bindingOptions, false );
        ToolTip.remove( bindingOptions );
        ContextMenu.remove( bindingOptions );
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

                result = Math.ceil( ( bindingOptions._currentView.currentDataArrayPageIndex + 1 ) / bindingOptions.paging!.columnsPerPage! );
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
    
                bindingOptions._currentView.currentDataArrayPageIndex = 0;
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

        getSelectedJsonValues: function ( elementId: string ) : any[] {
            let result: any[] = [];

            if ( Is.definedString( elementId ) && _elements_Data.hasOwnProperty( elementId ) ) {
                result = _elements_Data[ elementId ]._currentView.selectedValues;
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
            return "4.5.0";
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