/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        str.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Str {
    export function newGuid() : string {
        const result: string[] = [];

        for ( let charIndex: number = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( Char.dash );
            }

            const character: string = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( Char.empty );
    }

    export function padNumber( number: number, length: number = 1 ) : string {
        const numberString: string = number.toString();
        let numberResult: string = numberString;

        if ( numberString.length < length ) {
            const arrayLength: number = ( length - numberString.length ) + 1;

            numberResult = Array( arrayLength ).join( "0" ) + numberString;
        }

        return numberResult;
    }
}