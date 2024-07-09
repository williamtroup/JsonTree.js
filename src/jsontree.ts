/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        jsontree.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptions,
    type Events,
    type Ignore,
    type Title,
    type Configuration } from "./ts/type";

import { PublicApi } from "./ts/api";
import { Data } from "./ts/data";
import { Is } from "./ts/is";


type StringToJson = {
    parsed: boolean;
    object: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions: any ) : BindingOptions {
        var options = Data.getDefaultObject( newOptions, {} as BindingOptions );
        options.data = Data.getDefaultObject( options.data, null! );
        options.showCounts = Data.getDefaultBoolean( options.showCounts, true );
        options.useZeroIndexingForArrays = Data.getDefaultBoolean( options.useZeroIndexingForArrays, true );
        options.dateTimeFormat = Data.getDefaultString( options.dateTimeFormat, "{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}" );
        options.showArrowToggles = Data.getDefaultBoolean( options.showArrowToggles, true );
        options.showStringQuotes = Data.getDefaultBoolean( options.showStringQuotes, true );
        options.showAllAsClosed = Data.getDefaultBoolean( options.showAllAsClosed, false );
        options.sortPropertyNames = Data.getDefaultBoolean( options.sortPropertyNames, true );
        options.sortPropertyNamesInAlphabeticalOrder = Data.getDefaultBoolean( options.sortPropertyNamesInAlphabeticalOrder, true );
        options.showCommas = Data.getDefaultBoolean( options.showCommas, false );
        options.reverseArrayValues = Data.getDefaultBoolean( options.reverseArrayValues, false );
        options.addArrayIndexPadding = Data.getDefaultBoolean( options.addArrayIndexPadding, false );
        options.showValueColors = Data.getDefaultBoolean( options.showValueColors, true );
        options.maximumDecimalPlaces = Data.getDefaultNumber( options.maximumDecimalPlaces, 2 );
        options.maximumStringLength = Data.getDefaultNumber( options.maximumStringLength, 0 );
        options.showStringHexColors = Data.getDefaultBoolean( options.showStringHexColors, false );

        options = buildAttributeOptionTitle( options );
        options = buildAttributeOptionIgnore( options );
        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionTitle( options: BindingOptions ) : BindingOptions {
        options.title = Data.getDefaultObject( options.title, {} as Title );
        options.title!.text = Data.getDefaultString( options.title!.text, "JsonTree.js" );
        options.title!.show = Data.getDefaultBoolean( options.title!.show, true );
        options.title!.showTreeControls = Data.getDefaultBoolean( options.title!.showTreeControls, true );
        options.title!.showCopyButton = Data.getDefaultBoolean( options.title!.showCopyButton, false );

        return options;
    }

    function buildAttributeOptionIgnore( options: BindingOptions ) : BindingOptions {
        options.ignore = Data.getDefaultObject( options.ignore, {} as Ignore );
        options.ignore!.nullValues = Data.getDefaultBoolean( options.ignore!.nullValues, false );
        options.ignore!.functionValues = Data.getDefaultBoolean( options.ignore!.functionValues, false );
        options.ignore!.unknownValues = Data.getDefaultBoolean( options.ignore!.unknownValues, false );
        options.ignore!.booleanValues = Data.getDefaultBoolean( options.ignore!.booleanValues, false );
        options.ignore!.decimalValues = Data.getDefaultBoolean( options.ignore!.decimalValues, false );
        options.ignore!.numberValues = Data.getDefaultBoolean( options.ignore!.numberValues, false );
        options.ignore!.stringValues = Data.getDefaultBoolean( options.ignore!.stringValues, false );
        options.ignore!.dateValues = Data.getDefaultBoolean( options.ignore!.dateValues, false );
        options.ignore!.objectValues = Data.getDefaultBoolean( options.ignore!.objectValues, false );
        options.ignore!.arrayValues = Data.getDefaultBoolean( options.ignore!.arrayValues, false );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options: BindingOptions ) : BindingOptions {
        options.events = Data.getDefaultObject( options.events, {} as Events );
        options.events!.onBeforeRender = Data.getDefaultFunction( options.events!.onBeforeRender, null! );
        options.events!.onRenderComplete = Data.getDefaultFunction( options.events!.onRenderComplete, null! );
        options.events!.onValueClick = Data.getDefaultFunction( options.events!.onValueClick, null! );
        options.events!.onRefresh = Data.getDefaultFunction( options.events!.onRefresh, null! );
        options.events!.onCopyAll = Data.getDefaultFunction( options.events!.onCopyAll, null! );
        options.events!.onOpenAll = Data.getDefaultFunction( options.events!.onOpenAll, null! );
        options.events!.onCloseAll = Data.getDefaultFunction( options.events!.onCloseAll, null! );
        options.events!.onDestroy = Data.getDefaultFunction( options.events!.onDestroy, null! );
        options.events!.onBooleanRender = Data.getDefaultFunction( options.events!.onBooleanRender, null! );
        options.events!.onDecimalRender = Data.getDefaultFunction( options.events!.onDecimalRender, null! );
        options.events!.onNumberRender =Data.getDefaultFunction( options.events!.onNumberRender, null! );
        options.events!.onStringRender = Data.getDefaultFunction( options.events!.onStringRender, null! );
        options.events!.onDateRender = Data.getDefaultFunction( options.events!.onDateRender, null! );
        options.events!.onFunctionRender = Data.getDefaultFunction( options.events!.onFunctionRender, null! );
        options.events!.onNullRender = Data.getDefaultFunction( options.events!.onNullRender, null! );
        options.events!.onUnknownRender = Data.getDefaultFunction( options.events!.onUnknownRender, null! );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTriggerEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
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
                result.object = eval( "(" + objectString + ")" );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
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

        refresh: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        refreshAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },

        render: function ( element: HTMLElement, options: Object ): PublicApi {
            throw new Error("Function not implemented.");
        },

        renderAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },

        openAll: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        closeAll: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroy: function ( elementId: string ): PublicApi {
            throw new Error("Function not implemented.");
        },

        destroyAll: function (): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( configuration: any ): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getIds: function (): string[] {
            throw new Error("Function not implemented.");
        },

        getVersion: function (): string {
            throw new Error("Function not implemented.");
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JsonTree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {

    } )();
} )();