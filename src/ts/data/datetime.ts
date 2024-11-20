/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        datetime.ts
 * @version     v4.6.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "../type";
import { Is } from "./is";
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

        if ( Is.definedString( result ) ) {
            result = `<sup>${result}</sup>`;
        }

        return result;
    }

    export function getCustomFormattedDateText( configuration: Configuration, date: Date , dateFormat: string ) : string {
        const actualDate: Date = isNaN( +date ) ? new Date() : date;
        let result: string = dateFormat;
        const weekDayNumber: number = getWeekdayNumber( actualDate );

        result = result.replace( "{hh}", Str.padNumber( actualDate.getHours(), 2 ) );
        result = result.replace( "{h}", actualDate.getHours().toString() );
    
        result = result.replace( "{MM}", Str.padNumber( actualDate.getMinutes(), 2 ) );
        result = result.replace( "{M}", actualDate.getMinutes().toString() );
    
        result = result.replace( "{ss}", Str.padNumber( actualDate.getSeconds(), 2 ) );
        result = result.replace( "{s}", actualDate.getSeconds().toString() );

        result = result.replace( "{fff}", Str.padNumber( actualDate.getMilliseconds(), 3 ) );
        result = result.replace( "{ff}", Str.padNumber( actualDate.getMilliseconds(), 2 ) );
        result = result.replace( "{f}", actualDate.getMilliseconds().toString() );
    
        result = result.replace( "{dddd}", configuration.text!.dayNames![ weekDayNumber ] );
        result = result.replace( "{ddd}", configuration.text!.dayNamesAbbreviated![ weekDayNumber ] );
        result = result.replace( "{dd}", Str.padNumber( actualDate.getDate() ) );
        result = result.replace( "{d}", actualDate.getDate().toString() );
    
        result = result.replace( "{o}", getDayOrdinal( configuration, actualDate.getDate() ) );
    
        result = result.replace( "{mmmm}", configuration.text!.monthNames![ actualDate.getMonth() ] );
        result = result.replace( "{mmm}", configuration.text!.monthNamesAbbreviated![ actualDate.getMonth() ] );
        result = result.replace( "{mm}", Str.padNumber( actualDate.getMonth() + 1 ) );
        result = result.replace( "{m}", ( actualDate.getMonth() + 1 ).toString() );
    
        result = result.replace( "{yyyy}", actualDate.getFullYear().toString() );
        result = result.replace( "{yyy}", actualDate.getFullYear().toString().substring( 1 ) );
        result = result.replace( "{yy}", actualDate.getFullYear().toString().substring( 2 ) );
        result = result.replace( "{y}", Number.parseInt( actualDate.getFullYear().toString().substring( 2 ) ).toString() );

        result = result.replace( "{aa}", actualDate.getHours() >= 12 ? "PM" : "AM" );

        return result;
    }
}