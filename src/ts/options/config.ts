/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        config.ts
 * @version     v2.6.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type ConfigurationText, type Configuration } from "../type";
import { Default } from "../data/default";
import { Is } from "../data/is";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: any = null ) : Configuration {
            let configuration: Configuration = Default.getObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getBoolean( configuration.safeMode, true );
            configuration.domElementTypes = Default.getStringOrArray( configuration.domElementTypes, [ "*" ] );
    
            configuration = getText( configuration );

            return configuration;
        }
    
        function getText( configuration: Configuration ) : Configuration {
            configuration.text = Default.getObject( configuration.text, {} as ConfigurationText );
            configuration.text!.objectText = Default.getAnyString( configuration.text!.objectText, "object" );
            configuration.text!.arrayText = Default.getAnyString( configuration.text!.arrayText, "array" );
            configuration.text!.closeAllButtonText = Default.getAnyString( configuration.text!.closeAllButtonText, "Close All" );
            configuration.text!.openAllButtonText = Default.getAnyString( configuration.text!.openAllButtonText, "Open All" );
            configuration.text!.copyAllButtonText = Default.getAnyString( configuration.text!.copyAllButtonText, "Copy All" );
            configuration.text!.objectErrorText = Default.getAnyString( configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.text!.attributeNotValidErrorText = Default.getAnyString( configuration.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configuration.text!.attributeNotSetErrorText = Default.getAnyString( configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            configuration.text!.stText = Default.getAnyString( configuration.text!.stText, "st" );
            configuration.text!.ndText = Default.getAnyString( configuration.text!.ndText, "nd" );
            configuration.text!.rdText = Default.getAnyString( configuration.text!.rdText, "rd" );
            configuration.text!.thText = Default.getAnyString( configuration.text!.thText, "th" );
            configuration.text!.ellipsisText = Default.getAnyString( configuration.text!.ellipsisText, "..." );
            configuration.text!.closeAllButtonSymbolText = Default.getAnyString( configuration.text!.closeAllButtonSymbolText, "↑" );
            configuration.text!.openAllButtonSymbolText = Default.getAnyString( configuration.text!.openAllButtonSymbolText, "↓" );
            configuration.text!.copyAllButtonSymbolText = Default.getAnyString( configuration.text!.copyAllButtonSymbolText, "❐" );
            configuration.text!.backButtonText = Default.getAnyString( configuration.text!.backButtonText, "Back" );
            configuration.text!.nextButtonText = Default.getAnyString( configuration.text!.nextButtonText, "Next" );
            configuration.text!.backButtonSymbolText = Default.getAnyString( configuration.text!.backButtonSymbolText, "←" );
            configuration.text!.nextButtonSymbolText = Default.getAnyString( configuration.text!.nextButtonSymbolText, "→" );
            configuration.text!.noJsonToViewText = Default.getAnyString( configuration.text!.noJsonToViewText, "There is currently no JSON to view." );
            configuration.text!.functionText = Default.getAnyString( configuration.text!.functionText, "function" );

            if ( Is.invalidOptionArray( configuration.text!.dayNames, 7 ) ) {
                configuration.text!.dayNames = [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.dayNamesAbbreviated, 7 ) ) {
                configuration.text!.dayNamesAbbreviated = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.monthNames, 12 ) ) {
                configuration.text!.monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.monthNamesAbbreviated, 12 ) ) {
                configuration.text!.monthNamesAbbreviated = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ];
            }

            return configuration;
        }
    }
}