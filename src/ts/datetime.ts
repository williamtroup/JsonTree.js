/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        datetime.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Data } from "./data";
import { Configuration } from "./type";


export namespace DateTime {
    export function getWeekdayNumber( date: Date ) : number {
        return date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
    }

    export function getDayOrdinal( configuration: Configuration, value: number ) : string {
        let result: string = configuration.thText!;

        if ( value === 31 || value === 21 || value === 1 ) {
            result = configuration.stText!;
        } else if ( value === 22 || value === 2 ) {
            result = configuration.ndText!;
        } else if ( value === 23 || value === 3 ) {
            result = configuration.rdText!;
        }

        return result;
    }

    export function getCustomFormattedDateText( configuration: Configuration, dateFormat: string, date: Date ) : string {
        let result: string = dateFormat;
        const weekDayNumber: number = getWeekdayNumber( date );

        result = result.replace( "{hh}", Data.String.padNumber( date.getHours(), 2 ) );
        result = result.replace( "{h}", date.getHours().toString() );
    
        result = result.replace( "{MM}", Data.String.padNumber( date.getMinutes(), 2 ) );
        result = result.replace( "{M}", date.getMinutes().toString() );
    
        result = result.replace( "{ss}", Data.String.padNumber( date.getSeconds(), 2 ) );
        result = result.replace( "{s}", date.getSeconds().toString() );
    
        result = result.replace( "{dddd}", configuration.dayNames![ weekDayNumber ] );
        result = result.replace( "{ddd}", configuration.dayNamesAbbreviated![ weekDayNumber ] );
        result = result.replace( "{dd}", Data.String.padNumber( date.getDate() ) );
        result = result.replace( "{d}", date.getDate().toString() );
    
        result = result.replace( "{o}", getDayOrdinal( configuration, date.getDate() ) );
    
        result = result.replace( "{mmmm}", configuration.monthNames![ date.getMonth() ] );
        result = result.replace( "{mmm}", configuration.monthNamesAbbreviated![ date.getMonth() ] );
        result = result.replace( "{mm}", Data.String.padNumber( date.getMonth() + 1 ) );
        result = result.replace( "{m}", ( date.getMonth() + 1 ).toString() );
    
        result = result.replace( "{yyyy}", date.getFullYear().toString() );
        result = result.replace( "{yyy}", date.getFullYear().toString().substring( 1 ) );
        result = result.replace( "{yy}", date.getFullYear().toString().substring( 2 ) );
        result = result.replace( "{y}", Number.parseInt( date.getFullYear().toString().substring( 2 ) ).toString() );

        return result;
    }
}