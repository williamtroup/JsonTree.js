/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        config.ts
 * @version     v2.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "../type";
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
            configuration.objectText = Default.getDefaultAnyString( configuration.objectText, "object" );
            configuration.arrayText = Default.getDefaultAnyString( configuration.arrayText, "array" );
            configuration.closeAllButtonText = Default.getDefaultAnyString( configuration.closeAllButtonText, "Close All" );
            configuration.openAllButtonText = Default.getDefaultAnyString( configuration.openAllButtonText, "Open All" );
            configuration.copyAllButtonText = Default.getDefaultAnyString( configuration.copyAllButtonText, "Copy All" );
            configuration.objectErrorText = Default.getDefaultAnyString( configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.attributeNotValidErrorText = Default.getDefaultAnyString( configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configuration.attributeNotSetErrorText = Default.getDefaultAnyString( configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            configuration.stText = Default.getDefaultAnyString( configuration.stText, "st" );
            configuration.ndText = Default.getDefaultAnyString( configuration.ndText, "nd" );
            configuration.rdText = Default.getDefaultAnyString( configuration.rdText, "rd" );
            configuration.thText = Default.getDefaultAnyString( configuration.thText, "th" );
            configuration.ellipsisText = Default.getDefaultAnyString( configuration.ellipsisText, "..." );
    
            if ( Is.invalidOptionArray( configuration.dayNames, 7 ) ) {
                configuration.dayNames = [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.dayNamesAbbreviated, 7 ) ) {
                configuration.dayNamesAbbreviated = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.monthNames, 12 ) ) {
                configuration.monthNames = [
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
    
            if ( Is.invalidOptionArray( configuration.monthNamesAbbreviated, 12 ) ) {
                configuration.monthNamesAbbreviated = [
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