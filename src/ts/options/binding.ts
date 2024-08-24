/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        binding.ts
 * @version     v2.8.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptionsCurrentView,
    type BindingOptionsParse,
    type BindingOptionsTooltip,
    type BindingOptions,
    type BindingOptionsEvents,
    type BindingOptionsIgnore,
    type BindingOptionsTitle, 
    type ContentPanelsForArrayIndex, 
    type BindingOptionsAllowEditing } from "../type";

import { Default } from "../data/default";
import { Is } from "../data/is";


export namespace Binding {
    export namespace Options {
        export function getForNewInstance( data: any, element: HTMLElement ) : BindingOptions {
            const bindingOptions: BindingOptions = Binding.Options.get( data );
            bindingOptions._currentView = {} as BindingOptionsCurrentView;
            bindingOptions._currentView.element = element;
            bindingOptions._currentView.dataArrayCurrentIndex = 0;
            bindingOptions._currentView.titleBarButtons = null!;
            bindingOptions._currentView.valueClickTimerId = 0;
            bindingOptions._currentView.editMode = false;
            bindingOptions._currentView.idSet = false;
            bindingOptions._currentView.contentPanelsOpen = {} as ContentPanelsForArrayIndex;
            bindingOptions._currentView.contentPanelsIndex = 0;
            bindingOptions._currentView.backButton = null!;
            bindingOptions._currentView.nextButton = null!;

            return bindingOptions;
        }

        export function get( newOptions: any ) : BindingOptions {
            let options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
            options.data = Default.getObject( options.data, null! );
            options.showCounts = Default.getBoolean( options.showCounts, true );
            options.useZeroIndexingForArrays = Default.getBoolean( options.useZeroIndexingForArrays, true );
            options.dateTimeFormat = Default.getString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
            options.showArrowToggles = Default.getBoolean( options.showArrowToggles, true );
            options.showStringQuotes = Default.getBoolean( options.showStringQuotes, true );
            options.showAllAsClosed = Default.getBoolean( options.showAllAsClosed, false );
            options.sortPropertyNames = Default.getBoolean( options.sortPropertyNames, true );
            options.sortPropertyNamesInAlphabeticalOrder = Default.getBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
            options.showCommas = Default.getBoolean( options.showCommas, false );
            options.reverseArrayValues = Default.getBoolean( options.reverseArrayValues, false );
            options.addArrayIndexPadding = Default.getBoolean( options.addArrayIndexPadding, false );
            options.showValueColors = Default.getBoolean( options.showValueColors, true );
            options.maximumDecimalPlaces = Default.getNumber( options.maximumDecimalPlaces, 2 );
            options.maximumStringLength = Default.getNumber( options.maximumStringLength, 0 );
            options.showArrayItemsAsSeparateObjects = Default.getBoolean( options.showArrayItemsAsSeparateObjects, false );
            options.copyOnlyCurrentPage = Default.getBoolean( options.copyOnlyCurrentPage, false );
            options.fileDroppingEnabled = Default.getBoolean( options.fileDroppingEnabled, true );
            options.copyIndentSpaces = Default.getNumber( options.copyIndentSpaces, 2 );
            options.showArrayIndexBrackets = Default.getBoolean( options.showArrayIndexBrackets, true );
            options.showOpeningClosingCurlyBraces = Default.getBoolean( options.showOpeningClosingCurlyBraces, false );
            options.showOpeningClosingSquaredBrackets = Default.getBoolean( options.showOpeningClosingSquaredBrackets, false );
            options.includeTimeZoneInDateTimeEditing = Default.getBoolean( options.includeTimeZoneInDateTimeEditing, true );
            options.shortcutKeysEnabled = Default.getBoolean( options.shortcutKeysEnabled, true );
            options.openInFullScreenMode = Default.getBoolean( options.openInFullScreenMode, false );
            options.enableFullScreenToggling = Default.getBoolean( options.enableFullScreenToggling, true );
            options.valueToolTips = Default.getObject( options.valueToolTips, null! );
            options.editingValueClickDelay = Default.getNumber( options.editingValueClickDelay, 500 );

            options = getTitle( options );
            options = getIgnore( options );
            options = getToolTip( options );
            options = getParse( options );
            options = getAllowEditing( options, Is.definedObject( options.valueToolTips ) );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getTitle( options: BindingOptions ) : BindingOptions {
            options.title = Default.getObject( options.title, {} as BindingOptionsTitle );
            options.title!.text = Default.getString( options.title!.text, "JsonTree.js" );
            options.title!.show = Default.getBoolean( options.title!.show, true );
            options.title!.showTreeControls = Default.getBoolean( options.title!.showTreeControls, true );
            options.title!.showCopyButton = Default.getBoolean( options.title!.showCopyButton, true );
    
            return options;
        }
    
        function getIgnore( options: BindingOptions ) : BindingOptions {
            options.ignore = Default.getObject( options.ignore, {} as BindingOptionsIgnore );
            options.ignore!.nullValues = Default.getBoolean( options.ignore!.nullValues, false );
            options.ignore!.functionValues = Default.getBoolean( options.ignore!.functionValues, false );
            options.ignore!.unknownValues = Default.getBoolean( options.ignore!.unknownValues, false );
            options.ignore!.booleanValues = Default.getBoolean( options.ignore!.booleanValues, false );
            options.ignore!.decimalValues = Default.getBoolean( options.ignore!.decimalValues, false );
            options.ignore!.numberValues = Default.getBoolean( options.ignore!.numberValues, false );
            options.ignore!.stringValues = Default.getBoolean( options.ignore!.stringValues, false );
            options.ignore!.dateValues = Default.getBoolean( options.ignore!.dateValues, false );
            options.ignore!.objectValues = Default.getBoolean( options.ignore!.objectValues, false );
            options.ignore!.arrayValues = Default.getBoolean( options.ignore!.arrayValues, false );
            options.ignore!.bigIntValues = Default.getBoolean( options.ignore!.bigIntValues, false );
            options.ignore!.symbolValues = Default.getBoolean( options.ignore!.symbolValues, false );
            options.ignore!.emptyObjects = Default.getBoolean( options.ignore!.emptyObjects, true );
            options.ignore!.undefinedValues = Default.getBoolean( options.ignore!.undefinedValues, false );
            options.ignore!.guidValues = Default.getBoolean( options.ignore!.guidValues, false );
            options.ignore!.colorValues = Default.getBoolean( options.ignore!.colorValues, false );

            return options;
        }

        function getToolTip( options: BindingOptions ) : BindingOptions {
            options.tooltip = Default.getObject( options.tooltip, {} as BindingOptionsTooltip );
            options.tooltip!.delay = Default.getNumber( options.tooltip!.delay, 750 );
            options.tooltip!.offset = Default.getNumber( options.tooltip!.offset, 0 );

            return options;
        }

        function getParse( options: BindingOptions ) : BindingOptions {
            options.parse = Default.getObject( options.parse, {} as BindingOptionsParse );
            options.parse!.stringsToDates = Default.getBoolean( options.parse!.stringsToDates, false );
            options.parse!.stringsToBooleans = Default.getBoolean( options.parse!.stringsToBooleans, false );
            options.parse!.stringsToNumbers = Default.getBoolean( options.parse!.stringsToNumbers, false );

            return options;
        }

        function getAllowEditing( options: BindingOptions, valueToolTipsSet: boolean ) : BindingOptions {
            options.allowEditing = Default.getObject( options.allowEditing, {} as BindingOptionsAllowEditing );
            options.allowEditing!.booleanValues = Default.getBoolean( options.allowEditing!.booleanValues, true );
            options.allowEditing!.decimalValues = Default.getBoolean( options.allowEditing!.decimalValues, true );
            options.allowEditing!.numberValues = Default.getBoolean( options.allowEditing!.numberValues, true );
            options.allowEditing!.stringValues = Default.getBoolean( options.allowEditing!.stringValues, true );
            options.allowEditing!.dateValues = Default.getBoolean( options.allowEditing!.dateValues, true );
            options.allowEditing!.bigIntValues = Default.getBoolean( options.allowEditing!.bigIntValues, true );
            options.allowEditing!.guidValues = Default.getBoolean( options.allowEditing!.guidValues, true );
            options.allowEditing!.colorValues = Default.getBoolean( options.allowEditing!.colorValues, true );
            options.allowEditing!.propertyNames = Default.getBoolean( options.allowEditing!.propertyNames, true );

            if ( valueToolTipsSet ) {
                options.allowEditing!.propertyNames = false;
            }

            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
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
            options.events!.onDecimalRender = Default.getFunction( options.events!.onDecimalRender, null! );
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

            return options;
        }
    }
}