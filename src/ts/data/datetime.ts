/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        datetime.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "../type";
import { Str } from "./str";


export namespace DateTime {
    export function getWeekdayNumber( date: Date ) : number {
        return date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
    }

    export function getDayOrdinal( configuration: Configuration, value: number ) : string {
        let result: string = configuration.text!.thText!;

        if ( value === 31 || value === 21 || value === 1 ) {
            result = configuration.text!.stText!;
        } else if ( value === 22 || value === 2 ) {
            result = configuration.text!.ndText!;
        } else if ( value === 23 || value === 3 ) {
            result = configuration.text!.rdText!;
        }

        return result;
    }

    export function getCustomFormattedDateText( configuration: Configuration, date: Date , dateFormat: string) : string {
        let result: string = dateFormat;
        const weekDayNumber: number = getWeekdayNumber( date );

        result = result.replace( "{hh}", Str.padNumber( date.getHours(), 2 ) );
        result = result.replace( "{h}", date.getHours().toString() );
    
        result = result.replace( "{MM}", Str.padNumber( date.getMinutes(), 2 ) );
        result = result.replace( "{M}", date.getMinutes().toString() );
    
        result = result.replace( "{ss}", Str.padNumber( date.getSeconds(), 2 ) );
        result = result.replace( "{s}", date.getSeconds().toString() );

        result = result.replace( "{fff}", Str.padNumber( date.getMilliseconds(), 3 ) );
        result = result.replace( "{ff}", Str.padNumber( date.getMilliseconds(), 2 ) );
        result = result.replace( "{f}", date.getMilliseconds().toString() );
    
        result = result.replace( "{dddd}", configuration.text!.dayNames![ weekDayNumber ] );
        result = result.replace( "{ddd}", configuration.text!.dayNamesAbbreviated![ weekDayNumber ] );
        result = result.replace( "{dd}", Str.padNumber( date.getDate() ) );
        result = result.replace( "{d}", date.getDate().toString() );
    
        result = result.replace( "{o}", getDayOrdinal( configuration, date.getDate() ) );
    
        result = result.replace( "{mmmm}", configuration.text!.monthNames![ date.getMonth() ] );
        result = result.replace( "{mmm}", configuration.text!.monthNamesAbbreviated![ date.getMonth() ] );
        result = result.replace( "{mm}", Str.padNumber( date.getMonth() + 1 ) );
        result = result.replace( "{m}", ( date.getMonth() + 1 ).toString() );
    
        result = result.replace( "{yyyy}", date.getFullYear().toString() );
        result = result.replace( "{yyy}", date.getFullYear().toString().substring( 1 ) );
        result = result.replace( "{yy}", date.getFullYear().toString().substring( 2 ) );
        result = result.replace( "{y}", Number.parseInt( date.getFullYear().toString().substring( 2 ) ).toString() );

        return result;
    }
}