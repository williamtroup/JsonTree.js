/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        config.ts
 * @version     v2.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { ConfigurationText, type Configuration } from "../type";
import { Default } from "../data/default";
import { Is } from "../data/is";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: any = null ) : Configuration {
            let configuration: Configuration = Default.getDefaultObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getDefaultBoolean( configuration.safeMode, true );
            configuration.domElementTypes = Default.getDefaultStringOrArray( configuration.domElementTypes, [ "*" ] );
    
            configuration = getText( configuration );

            return configuration;
        }
    
        function getText( configuration: Configuration ) : Configuration {
            configuration.text = Default.getDefaultObject( configuration.text, {} as ConfigurationText );
            configuration.text!.objectText = Default.getDefaultAnyString( configuration.text!.objectText, "object" );
            configuration.text!.arrayText = Default.getDefaultAnyString( configuration.text!.arrayText, "array" );
            configuration.text!.closeAllButtonText = Default.getDefaultAnyString( configuration.text!.closeAllButtonText, "Close All" );
            configuration.text!.openAllButtonText = Default.getDefaultAnyString( configuration.text!.openAllButtonText, "Open All" );
            configuration.text!.copyAllButtonText = Default.getDefaultAnyString( configuration.text!.copyAllButtonText, "Copy All" );
            configuration.text!.objectErrorText = Default.getDefaultAnyString( configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.text!.attributeNotValidErrorText = Default.getDefaultAnyString( configuration.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configuration.text!.attributeNotSetErrorText = Default.getDefaultAnyString( configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            configuration.text!.stText = Default.getDefaultAnyString( configuration.text!.stText, "st" );
            configuration.text!.ndText = Default.getDefaultAnyString( configuration.text!.ndText, "nd" );
            configuration.text!.rdText = Default.getDefaultAnyString( configuration.text!.rdText, "rd" );
            configuration.text!.thText = Default.getDefaultAnyString( configuration.text!.thText, "th" );
            configuration.text!.ellipsisText = Default.getDefaultAnyString( configuration.text!.ellipsisText, "..." );
            configuration.text!.closeAllButtonSymbolText = Default.getDefaultAnyString( configuration.text!.closeAllButtonSymbolText, "↑" );
            configuration.text!.openAllButtonSymbolText = Default.getDefaultAnyString( configuration.text!.openAllButtonSymbolText, "↓" );
            configuration.text!.copyAllButtonSymbolText = Default.getDefaultAnyString( configuration.text!.copyAllButtonSymbolText, "❐" )
    
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