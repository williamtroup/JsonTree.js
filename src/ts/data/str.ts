/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        str.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export namespace Str {
    export function padNumber( number: number, length: number = 1, paddingCharacter: string = "0" ) : string {
        const numberString: string = number.toString();
        let numberResult: string = numberString;

        if ( numberString.length < length ) {
            const arrayLength: number = ( length - numberString.length ) + 1;

            numberResult = `${Array(arrayLength).join(paddingCharacter)}${numberString}`;
        }

        return numberResult;
    }

    export function capitalizeFirstLetter( string: string ) : string {
        return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    }
}