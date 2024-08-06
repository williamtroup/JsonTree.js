/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        is.ts
 * @version     v2.4.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Is {
    export function defined( value: any ) : boolean {
        return value !== null && value !== undefined && value.toString() !== Char.empty;
    }

    export function definedObject( object: any ) : boolean {
        return defined( object ) && typeof object === "object";
    }

    export function definedBoolean( object: any ) : boolean {
        return defined( object ) && typeof object === "boolean";
    }

    export function definedString( object: any ) : boolean {
        return defined( object ) && typeof object === "string";
    }

    export function definedFunction( object: any ) : boolean {
        return defined( object ) && typeof object === "function";
    }

    export function definedNumber( object: any ) : boolean {
        return defined( object ) && typeof object === "number";
    }

    export function definedBigInt( object: any ) : boolean {
        return defined( object ) && typeof object === "bigint";
    }

    export function definedArray( object: any ) : boolean {
        return definedObject( object ) && object instanceof Array;
    }

    export function definedDate( object: any ) : boolean {
        return definedObject( object ) && object instanceof Date;
    }

    export function definedDecimal( object: any ) : boolean {
        return defined( object ) && typeof object === "number" && object % 1 !== 0;
    }

    export function definedSymbol( object: any ) : boolean {
        return defined( object ) && typeof object === "symbol";
    }

    export function invalidOptionArray( array: any, minimumLength: number = 1 ) : boolean {
        return !definedArray( array ) || array.length < minimumLength;
    }

    export function hexColor( value: string ) : boolean {
        let valid: boolean = value.length >= 2 && value.length <= 7;
    
        if ( valid && value[ 0 ] === Char.hash ) {
            valid = isNaN( +value.substring( 1, value.length - 1 ) );
        }
    
        return valid;
    }

    export function stringValueBoolean( object: string ) : boolean {
        return object.toString().toLowerCase().trim() === "true" || object.toString().toLowerCase().trim() === "false";
    }

    export function stringValueDate( dateTimeString: string ) {
        return !isNaN( +new Date( dateTimeString ) );
    }
}