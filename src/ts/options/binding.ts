/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        binding.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    BindingOptionsCurrentView,
    type BindingOptions,
    type BindingOptionsEvents,
    type BindingOptionsIgnore,
    type BindingOptionsTitle } from "../type";

import { Default } from "../data/default";


export namespace Binding {
    export namespace Options {
        export function getForNewInstance( data: any, element: HTMLElement ) : BindingOptions {
            const bindingOptions: BindingOptions = Binding.Options.get( data );
            bindingOptions._currentView = {} as BindingOptionsCurrentView;
            bindingOptions._currentView.element = element;
            bindingOptions._currentView.dataArrayCurrentIndex = 0;

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
            options.showStringHexColors = Default.getBoolean( options.showStringHexColors, false );
            options.showArrayItemsAsSeparateObjects = Default.getBoolean( options.showArrayItemsAsSeparateObjects, false );
            options.copyOnlyCurrentPage = Default.getBoolean( options.copyOnlyCurrentPage, false );
            options.fileDroppingEnabled = Default.getBoolean( options.fileDroppingEnabled, true );
            options.parseStringsToDates = Default.getBoolean( options.parseStringsToDates, false );
            
            options = getTitle( options );
            options = getIgnore( options );
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
            options.events!.onNumberRender =Default.getFunction( options.events!.onNumberRender, null! );
            options.events!.onStringRender = Default.getFunction( options.events!.onStringRender, null! );
            options.events!.onDateRender = Default.getFunction( options.events!.onDateRender, null! );
            options.events!.onFunctionRender = Default.getFunction( options.events!.onFunctionRender, null! );
            options.events!.onNullRender = Default.getFunction( options.events!.onNullRender, null! );
            options.events!.onUnknownRender = Default.getFunction( options.events!.onUnknownRender, null! );
    
            return options;
        }
    }
}