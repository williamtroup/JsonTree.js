/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        binding.ts
 * @version     v4.7.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2025
 */


import {
    type ContentPanelsForArrayIndex,
    type BindingOptionsCurrentView,
    type BindingOptionsParse,
    type BindingOptionsTooltip,
    type BindingOptions,
    type BindingOptionsEvents,
    type BindingOptionsIgnore,
    type BindingOptionsTitle, 
    type BindingOptionsAllowEditing, 
    type BindingOptionsSideMenu, 
    type BindingOptionsAutoClose, 
    type BindingOptionsPaging, 
    type BindingOptionsFooter, 
    type BindingOptionsControlPanel, 
    type BindingOptionsLineNumbers, 
    type BindingOptionsMaximum, 
    type ControlButtonsOpenStateArrayIndex, 
    type DataTypeCounts } from "../type";

import { Default } from "../data/default";
import { Is } from "../data/is";
import { Char } from "../data/enum";


export namespace Binding {
    export namespace Options {
        export function getForNewInstance( data: any, element: HTMLElement ) : BindingOptions {
            const bindingOptions: BindingOptions = Binding.Options.get( data );
            const allowEditing: any = bindingOptions.allowEditing;

            bindingOptions._currentView = {} as BindingOptionsCurrentView;
            bindingOptions._currentView.element = element;
            bindingOptions._currentView.currentDataArrayPageIndex = ( bindingOptions.paging!.startPage! - 1 ) * bindingOptions.paging!.columnsPerPage!;
            bindingOptions._currentView.titleBarButtons = null!;
            bindingOptions._currentView.valueClickTimerId = 0;
            bindingOptions._currentView.editMode = false;
            bindingOptions._currentView.idSet = false;
            bindingOptions._currentView.controlButtonsOpen = {} as ControlButtonsOpenStateArrayIndex;
            bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
            bindingOptions._currentView.contentPanelsIndex = 0;
            bindingOptions._currentView.contentPanelsDataIndex = 0;
            bindingOptions._currentView.backPageButton = null!;
            bindingOptions._currentView.nextPageButton = null!;
            bindingOptions._currentView.disabledBackground = null!;
            bindingOptions._currentView.sideMenu = null!;
            bindingOptions._currentView.sideMenuChanged = false;
            bindingOptions._currentView.toggleFullScreenButton = null!;
            bindingOptions._currentView.fullScreenOn = false;
            bindingOptions._currentView.dragAndDropBackground = null!;
            bindingOptions._currentView.initialized = false;
            bindingOptions._currentView.currentContentColumns = [];
            bindingOptions._currentView.footer = null!;
            bindingOptions._currentView.footerStatusText = null!;
            bindingOptions._currentView.footerDataTypeText = null!;
            bindingOptions._currentView.footerLengthText = null!;
            bindingOptions._currentView.footerSizeText = null!;
            bindingOptions._currentView.footerPageText = null!;
            bindingOptions._currentView.footerStatusTextTimerId = 0;
            bindingOptions._currentView.columnDragging = false;
            bindingOptions._currentView.columnDraggingDataIndex = 0;
            bindingOptions._currentView.dataTypeCounts = {} as DataTypeCounts;
            bindingOptions._currentView.contextMenu = null!;
            bindingOptions._currentView.currentColumnBuildingIndex = 0;
            bindingOptions._currentView.selectedValues = [];

            if ( bindingOptions.paging!.enabled && Is.definedArray( bindingOptions.data ) && bindingOptions.data.length > 1 && bindingOptions._currentView.currentDataArrayPageIndex > ( bindingOptions.data.length - 1 ) ) {
                bindingOptions._currentView.currentDataArrayPageIndex = 0;
            }

            for ( const key in allowEditing ) {
                if ( !allowEditing[ key ] ) {
                    bindingOptions.allowEditing!.bulk = false;
                    break;
                }
            }

            return bindingOptions;
        }

        export function get( newOptions: any ) : BindingOptions {
            const options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
            options.id = Default.getString( options.id, Char.empty );
            options.class = Default.getString( options.class, Char.empty );
            options.showObjectSizes = Default.getBoolean( options.showObjectSizes, true );
            options.useZeroIndexingForArrays = Default.getBoolean( options.useZeroIndexingForArrays, true );
            options.dateTimeFormat = Default.getString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
            options.showExpandIcons = Default.getBoolean( options.showExpandIcons, true );
            options.showStringQuotes = Default.getBoolean( options.showStringQuotes, true );
            options.showAllAsClosed = Default.getBoolean( options.showAllAsClosed, false );
            options.sortPropertyNames = Default.getBoolean( options.sortPropertyNames, true );
            options.sortPropertyNamesInAlphabeticalOrder = Default.getBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
            options.showCommas = Default.getBoolean( options.showCommas, true );
            options.reverseArrayValues = Default.getBoolean( options.reverseArrayValues, false );
            options.addArrayIndexPadding = Default.getBoolean( options.addArrayIndexPadding, false );
            options.showValueColors = Default.getBoolean( options.showValueColors, true );
            options.fileDroppingEnabled = Default.getBoolean( options.fileDroppingEnabled, true );
            options.jsonIndentSpaces = Default.getNumber( options.jsonIndentSpaces, 8 );
            options.showArrayIndexBrackets = Default.getBoolean( options.showArrayIndexBrackets, true );
            options.showOpeningClosingCurlyBraces = Default.getBoolean( options.showOpeningClosingCurlyBraces, false );
            options.showOpeningClosingSquaredBrackets = Default.getBoolean( options.showOpeningClosingSquaredBrackets, false );
            options.includeTimeZoneInDates = Default.getBoolean( options.includeTimeZoneInDates, true );
            options.shortcutKeysEnabled = Default.getBoolean( options.shortcutKeysEnabled, true );
            options.openInFullScreenMode = Default.getBoolean( options.openInFullScreenMode, false );
            options.valueToolTips = Default.getObject( options.valueToolTips, null! );
            options.editingValueClickDelay = Default.getNumber( options.editingValueClickDelay, 500 );
            options.showDataTypes = Default.getBoolean( options.showDataTypes, false );
            options.logJsonValueToolTipPaths = Default.getBoolean( options.logJsonValueToolTipPaths, false );
            options.exportFilenameFormat = Default.getString( options.exportFilenameFormat, "JsonTree_{dd}-{mm}-{yyyy}_{hh}-{MM}-{ss}.json" );
            options.showPropertyNameQuotes = Default.getBoolean( options.showPropertyNameQuotes, true );
            options.showOpenedObjectArrayBorders = Default.getBoolean( options.showOpenedObjectArrayBorders, true );
            options.showPropertyNameAndIndexColors = Default.getBoolean( options.showPropertyNameAndIndexColors, true );
            options.showUrlOpenButtons = Default.getBoolean( options.showUrlOpenButtons, true );
            options.showEmailOpenButtons = Default.getBoolean( options.showEmailOpenButtons, true );
            options.minimumArrayIndexPadding = Default.getNumber( options.minimumArrayIndexPadding, 0 );
            options.arrayIndexPaddingCharacter = Default.getString( options.arrayIndexPaddingCharacter, "0" );
            options.showCssStylesForHtmlObjects = Default.getBoolean( options.showCssStylesForHtmlObjects, false );
            options.jsonPathAny = Default.getString( options.jsonPathAny, ".." );
            options.jsonPathSeparator = Default.getString( options.jsonPathSeparator, Char.backslash );
            options.showChildIndexes = Default.getBoolean( options.showChildIndexes, true );
            options.showClosedArraySquaredBrackets = Default.getBoolean( options.showClosedArraySquaredBrackets, true );
            options.showClosedObjectCurlyBraces = Default.getBoolean( options.showClosedObjectCurlyBraces, true );
            options.convertClickedValuesToString = Default.getBoolean( options.convertClickedValuesToString, false );
            options.rootName = Default.getString( options.rootName, "root" );
            options.emptyStringValue = Default.getString( options.emptyStringValue, Char.empty );
            options.expandIconType = Default.getString( options.expandIconType, "arrow" );
            options.openUrlsInSameWindow = Default.getBoolean( options.openUrlsInSameWindow, false );
            options.wrapTextInValues = Default.getBoolean( options.wrapTextInValues, false );
            options.hideRootObjectNames = Default.getBoolean( options.hideRootObjectNames, false );

            options.maximum = getMaximum( options );
            options.paging = getPaging( options );
            options.title = getTitle( options );
            options.footer = getFooter( options );
            options.controlPanel = getControlPanel( options );
            options.lineNumbers = getLineNumbers( options );
            options.ignore = getIgnore( options );
            options.tooltip = getToolTip( options );
            options.parse = getParse( options );
            options.allowEditing = getAllowEditing( options );
            options.sideMenu = getSideMenu( options );
            options.autoClose = getAutoClose( options );
            options.events = getCustomTriggers( options );
    
            return options;
        }

        function getMaximum( options: BindingOptions ) : BindingOptionsMaximum {
            options.maximum = Default.getObject( options.maximum, {} as BindingOptionsMaximum );
            options.maximum!.decimalPlaces = Default.getNumber( options.maximum!.decimalPlaces, 2 );
            options.maximum!.stringLength = Default.getNumber( options.maximum!.stringLength, 0 );
            options.maximum!.urlLength = Default.getNumber( options.maximum!.urlLength, 0 );
            options.maximum!.emailLength = Default.getNumber( options.maximum!.emailLength, 0 );
            options.maximum!.numberLength = Default.getNumber( options.maximum!.numberLength, 0 );
            options.maximum!.bigIntLength = Default.getNumber( options.maximum!.bigIntLength, 0 );
            options.maximum!.inspectionLevels = Default.getNumber( options.maximum!.inspectionLevels, 10 );
            options.maximum!.propertyNameLength = Default.getNumber( options.maximum!.propertyNameLength, 0 );
            options.maximum!.functionLength = Default.getNumber( options.maximum!.functionLength, 0 );
            options.maximum!.lambdaLength = Default.getNumber( options.maximum!.lambdaLength, 0 );

            return options.maximum!;
        }
        
        function getPaging( options: BindingOptions ) : BindingOptionsPaging {
            options.paging = Default.getObject( options.paging, {} as BindingOptionsPaging );
            options.paging!.enabled = Default.getBoolean( options.paging!.enabled, true );
            options.paging!.columnsPerPage = Default.getNumberMaximum( options.paging!.columnsPerPage, 1, 6 );
            options.paging!.startPage = Default.getNumberMinimum( options.paging!.startPage, 1, 1 );
            options.paging!.synchronizeScrolling = Default.getBoolean( options.paging!.synchronizeScrolling, false );
            options.paging!.allowColumnReordering = Default.getBoolean( options.paging!.allowColumnReordering, true );
            options.paging!.allowComparisons = Default.getBoolean( options.paging!.allowComparisons, false );

            return options.paging!;
        }
    
        function getTitle( options: BindingOptions ) : BindingOptionsTitle {
            options.title = Default.getObject( options.title, {} as BindingOptionsTitle );
            options.title!.text = Default.getAnyString( options.title!.text, "JsonTree.js" );
            options.title!.showCloseOpenAllButtons = Default.getBoolean( options.title!.showCloseOpenAllButtons, true );
            options.title!.showCopyButton = Default.getBoolean( options.title!.showCopyButton, true );
            options.title!.enableFullScreenToggling = Default.getBoolean( options.title!.enableFullScreenToggling, true );
            options.title!.showFullScreenButton = Default.getBoolean( options.title!.showFullScreenButton, true );

            return options.title!;
        }

        function getFooter( options: BindingOptions ) : BindingOptionsFooter {
            options.footer = Default.getObject( options.footer, {} as BindingOptionsFooter );
            options.footer!.enabled = Default.getBoolean( options.footer!.enabled, true );
            options.footer!.showDataTypes = Default.getBoolean( options.footer!.showDataTypes, true );
            options.footer!.showLengths = Default.getBoolean( options.footer!.showLengths, true );
            options.footer!.showSizes = Default.getBoolean( options.footer!.showSizes, true );
            options.footer!.showPageOf = Default.getBoolean( options.footer!.showPageOf, true );
            options.footer!.statusResetDelay = Default.getNumber( options.footer!.statusResetDelay, 5000 );

            return options.footer!;
        }

        function getControlPanel( options: BindingOptions ) : BindingOptionsControlPanel {
            options.controlPanel = Default.getObject( options.controlPanel, {} as BindingOptionsControlPanel );
            options.controlPanel!.enabled = Default.getBoolean( options.controlPanel!.enabled, true );
            options.controlPanel!.showCopyButton = Default.getBoolean( options.controlPanel!.showCopyButton, true );
            options.controlPanel!.showMovingButtons = Default.getBoolean( options.controlPanel!.showMovingButtons, true );
            options.controlPanel!.showRemoveButton = Default.getBoolean( options.controlPanel!.showRemoveButton, false );
            options.controlPanel!.showEditButton = Default.getBoolean( options.controlPanel!.showEditButton, true );
            options.controlPanel!.showCloseOpenAllButtons = Default.getBoolean( options.controlPanel!.showCloseOpenAllButtons, true );
            options.controlPanel!.showSwitchToPagesButton = Default.getBoolean( options.controlPanel!.showSwitchToPagesButton, true );
            options.controlPanel!.showImportButton = Default.getBoolean( options.controlPanel!.showImportButton, true );
            options.controlPanel!.showExportButton = Default.getBoolean( options.controlPanel!.showExportButton, true );
            options.controlPanel!.showOpenCloseButton = Default.getBoolean( options.controlPanel!.showOpenCloseButton, true );

            return options.controlPanel!;
        }

        function getLineNumbers( options: BindingOptions ) : BindingOptionsLineNumbers {
            options.lineNumbers = Default.getObject( options.lineNumbers, {} as BindingOptionsLineNumbers );
            options.lineNumbers!.enabled = Default.getBoolean( options.lineNumbers!.enabled, true );
            options.lineNumbers!.padNumbers = Default.getBoolean( options.lineNumbers!.padNumbers, false );
            options.lineNumbers!.addDots = Default.getBoolean( options.lineNumbers!.addDots, true );

            return options.lineNumbers!;
        }
    
        function getIgnore( options: BindingOptions ) : BindingOptionsIgnore {
            options.ignore = Default.getObject( options.ignore, {} as BindingOptionsIgnore );
            options.ignore!.nullValues = Default.getBoolean( options.ignore!.nullValues, false );
            options.ignore!.functionValues = Default.getBoolean( options.ignore!.functionValues, false );
            options.ignore!.unknownValues = Default.getBoolean( options.ignore!.unknownValues, false );
            options.ignore!.booleanValues = Default.getBoolean( options.ignore!.booleanValues, false );
            options.ignore!.floatValues = Default.getBoolean( options.ignore!.floatValues, false );
            options.ignore!.numberValues = Default.getBoolean( options.ignore!.numberValues, false );
            options.ignore!.stringValues = Default.getBoolean( options.ignore!.stringValues, false );
            options.ignore!.dateValues = Default.getBoolean( options.ignore!.dateValues, false );
            options.ignore!.objectValues = Default.getBoolean( options.ignore!.objectValues, false );
            options.ignore!.arrayValues = Default.getBoolean( options.ignore!.arrayValues, false );
            options.ignore!.bigintValues = Default.getBoolean( options.ignore!.bigintValues, false );
            options.ignore!.symbolValues = Default.getBoolean( options.ignore!.symbolValues, false );
            options.ignore!.emptyObjects = Default.getBoolean( options.ignore!.emptyObjects, false );
            options.ignore!.undefinedValues = Default.getBoolean( options.ignore!.undefinedValues, false );
            options.ignore!.guidValues = Default.getBoolean( options.ignore!.guidValues, false );
            options.ignore!.colorValues = Default.getBoolean( options.ignore!.colorValues, false );
            options.ignore!.regexpValues = Default.getBoolean( options.ignore!.regexpValues, false );
            options.ignore!.mapValues = Default.getBoolean( options.ignore!.mapValues, false );
            options.ignore!.setValues = Default.getBoolean( options.ignore!.setValues, false );
            options.ignore!.urlValues = Default.getBoolean( options.ignore!.urlValues, false );
            options.ignore!.imageValues = Default.getBoolean( options.ignore!.imageValues, false );
            options.ignore!.emailValues = Default.getBoolean( options.ignore!.emailValues, false );
            options.ignore!.htmlValues = Default.getBoolean( options.ignore!.htmlValues, false );
            options.ignore!.lambdaValues = Default.getBoolean( options.ignore!.lambdaValues, false );

            return options.ignore!;
        }

        function getToolTip( options: BindingOptions ) : BindingOptionsTooltip {
            options.tooltip = Default.getObject( options.tooltip, {} as BindingOptionsTooltip );
            options.tooltip!.delay = Default.getNumber( options.tooltip!.delay, 750 );
            options.tooltip!.offset = Default.getNumber( options.tooltip!.offset, 0 );

            return options.tooltip!;
        }

        function getParse( options: BindingOptions ) : BindingOptionsParse {
            options.parse = Default.getObject( options.parse, {} as BindingOptionsParse );
            options.parse!.stringsToDates = Default.getBoolean( options.parse!.stringsToDates, false );
            options.parse!.stringsToBooleans = Default.getBoolean( options.parse!.stringsToBooleans, false );
            options.parse!.stringsToNumbers = Default.getBoolean( options.parse!.stringsToNumbers, false );
            options.parse!.stringsToSymbols = Default.getBoolean( options.parse!.stringsToSymbols, false );
            options.parse!.stringsToFloats = Default.getBoolean( options.parse!.stringsToFloats, false );
            options.parse!.stringsToBigInts = Default.getBoolean( options.parse!.stringsToBigInts, false );

            return options.parse!;
        }

        function getAllowEditing( options: BindingOptions ) : BindingOptionsAllowEditing {
            let defaultFlag: boolean = Default.getBoolean( options.allowEditing, true );

            options.allowEditing = Default.getObject( options.allowEditing, {} as BindingOptionsAllowEditing );
            options.allowEditing!.booleanValues = Default.getBoolean( options.allowEditing!.booleanValues, defaultFlag );
            options.allowEditing!.floatValues = Default.getBoolean( options.allowEditing!.floatValues, defaultFlag );
            options.allowEditing!.numberValues = Default.getBoolean( options.allowEditing!.numberValues, defaultFlag );
            options.allowEditing!.stringValues = Default.getBoolean( options.allowEditing!.stringValues, defaultFlag );
            options.allowEditing!.dateValues = Default.getBoolean( options.allowEditing!.dateValues, defaultFlag );
            options.allowEditing!.bigIntValues = Default.getBoolean( options.allowEditing!.bigIntValues, defaultFlag );
            options.allowEditing!.guidValues = Default.getBoolean( options.allowEditing!.guidValues, defaultFlag );
            options.allowEditing!.colorValues = Default.getBoolean( options.allowEditing!.colorValues, defaultFlag );
            options.allowEditing!.urlValues = Default.getBoolean( options.allowEditing!.urlValues, defaultFlag );
            options.allowEditing!.emailValues = Default.getBoolean( options.allowEditing!.emailValues, defaultFlag );
            options.allowEditing!.regExpValues = Default.getBoolean( options.allowEditing!.regExpValues, defaultFlag );
            options.allowEditing!.symbolValues = Default.getBoolean( options.allowEditing!.symbolValues, defaultFlag );
            options.allowEditing!.imageValues = Default.getBoolean( options.allowEditing!.imageValues, defaultFlag );
            options.allowEditing!.propertyNames = Default.getBoolean( options.allowEditing!.propertyNames, defaultFlag );
            options.allowEditing!.bulk = Default.getBoolean( options.allowEditing!.bulk, defaultFlag );

            const properties: any = options.allowEditing;

            for ( const property in properties ) {
                if ( properties.hasOwnProperty( property ) && !properties[ property ] ) {
                    options.allowEditing!.bulk = false;
                    break;
                }
            }

            return options.allowEditing!;
        }

        function getSideMenu( options: BindingOptions ) : BindingOptionsSideMenu {
            options.sideMenu = Default.getObject( options.sideMenu, {} as BindingOptionsSideMenu );
            options.sideMenu!.enabled = Default.getBoolean( options.sideMenu!.enabled, true );
            options.sideMenu!.showImportButton = Default.getBoolean( options.sideMenu!.showImportButton, true );
            options.sideMenu!.showExportButton = Default.getBoolean( options.sideMenu!.showExportButton, true );
            options.sideMenu!.titleText = Default.getAnyString( options.sideMenu!.titleText, options.title!.text! );
            options.sideMenu!.showAvailableDataTypeCounts = Default.getBoolean( options.sideMenu!.showAvailableDataTypeCounts, true );
            options.sideMenu!.showOnlyDataTypesAvailable = Default.getBoolean( options.sideMenu!.showOnlyDataTypesAvailable, false );
            options.sideMenu!.showClearJsonButton = Default.getBoolean( options.sideMenu!.showClearJsonButton, true );
            options.sideMenu!.updateDisplayDelay = Default.getNumber( options.sideMenu!.updateDisplayDelay, 500 );

            return options.sideMenu!;
        }

        function getAutoClose( options: BindingOptions ) : BindingOptionsAutoClose {
            options.autoClose = Default.getObject( options.autoClose, {} as BindingOptionsAutoClose );
            options.autoClose!.objectSize = Default.getNumber( options.autoClose!.objectSize, 0 );
            options.autoClose!.arraySize = Default.getNumber( options.autoClose!.arraySize, 0 );
            options.autoClose!.mapSize = Default.getNumber( options.autoClose!.mapSize, 0 );
            options.autoClose!.setSize = Default.getNumber( options.autoClose!.setSize, 0 );
            options.autoClose!.htmlSize = Default.getNumber( options.autoClose!.htmlSize, 0 );

            return options.autoClose!;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptionsEvents {
            options.events = Default.getObject( options.events, {} as BindingOptionsEvents );
            options.events!.onBeforeRender = Default.getFunction( options.events!.onBeforeRender, null! );
            options.events!.onRenderComplete = Default.getFunction( options.events!.onRenderComplete, null! );
            options.events!.onValueClick = Default.getFunction( options.events!.onValueClick, null! );
            options.events!.onRefresh = Default.getFunction( options.events!.onRefresh, null! );
            options.events!.onCopyAll = Default.getFunction( options.events!.onCopyAll, null! );
            options.events!.onOpenAll = Default.getFunction( options.events!.onOpenAll, null! );
            options.events!.onCloseAll = Default.getFunction( options.events!.onCloseAll, null! );
            options.events!.onDestroy = Default.getFunction( options.events!.onDestroy, null! );
            options.events!.onBooleanRender = Default.getFunction( options.events!.onBooleanRender, null! );
            options.events!.onFloatRender = Default.getFunction( options.events!.onFloatRender, null! );
            options.events!.onNumberRender = Default.getFunction( options.events!.onNumberRender, null! );
            options.events!.onBigIntRender = Default.getFunction( options.events!.onBigIntRender, null! );
            options.events!.onStringRender = Default.getFunction( options.events!.onStringRender, null! );
            options.events!.onDateRender = Default.getFunction( options.events!.onDateRender, null! );
            options.events!.onFunctionRender = Default.getFunction( options.events!.onFunctionRender, null! );
            options.events!.onNullRender = Default.getFunction( options.events!.onNullRender, null! );
            options.events!.onUnknownRender = Default.getFunction( options.events!.onUnknownRender, null! );
            options.events!.onSymbolRender = Default.getFunction( options.events!.onSymbolRender, null! );
            options.events!.onCopyJsonReplacer = Default.getFunction( options.events!.onCopyJsonReplacer, null! );
            options.events!.onUndefinedRender = Default.getFunction( options.events!.onUndefinedRender, null! );
            options.events!.onGuidRender = Default.getFunction( options.events!.onGuidRender, null! );
            options.events!.onColorRender = Default.getFunction( options.events!.onColorRender, null! );
            options.events!.onJsonEdit = Default.getFunction( options.events!.onJsonEdit, null! );
            options.events!.onRegExpRender = Default.getFunction( options.events!.onRegExpRender, null! );
            options.events!.onExport = Default.getFunction( options.events!.onExport, null! );
            options.events!.onUrlRender = Default.getFunction( options.events!.onUrlRender, null! );
            options.events!.onImageRender = Default.getFunction( options.events!.onImageRender, null! );
            options.events!.onEmailRender = Default.getFunction( options.events!.onEmailRender, null! );
            options.events!.onLambdaRender = Default.getFunction( options.events!.onLambdaRender, null! );
            options.events!.onCopy = Default.getFunction( options.events!.onCopy, null! );
            options.events!.onFullScreenChange = Default.getFunction( options.events!.onFullScreenChange, null! );
            options.events!.onSelectionChange = Default.getFunction( options.events!.onSelectionChange, null! );
            options.events!.onCustomDataTypeRender = Default.getFunction( options.events!.onCustomDataTypeRender, null! );

            return options.events!;
        }
    }
}