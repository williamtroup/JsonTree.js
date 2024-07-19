/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        binding.ts
 * @version     v2.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptions,
    type BindingOptionsEvents,
    type BindingOptionsIgnore,
    type BindingOptionsTitle } from "../type";

import { Default } from "../data/default";


export namespace Binding {
    export namespace Options {
        export function get( newOptions: any ) : BindingOptions {
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
    
            options = getTitle( options );
            options = getIgnore( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getTitle( options: BindingOptions ) : BindingOptions {
            options.title = Default.getDefaultObject( options.title, {} as BindingOptionsTitle );
            options.title!.text = Default.getDefaultString( options.title!.text, "JsonTree.js" );
            options.title!.show = Default.getDefaultBoolean( options.title!.show, true );
            options.title!.showTreeControls = Default.getDefaultBoolean( options.title!.showTreeControls, true );
            options.title!.showCopyButton = Default.getDefaultBoolean( options.title!.showCopyButton, false );
    
            return options;
        }
    
        function getIgnore( options: BindingOptions ) : BindingOptions {
            options.ignore = Default.getDefaultObject( options.ignore, {} as BindingOptionsIgnore );
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
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.events = Default.getDefaultObject( options.events, {} as BindingOptionsEvents );
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
    }
}