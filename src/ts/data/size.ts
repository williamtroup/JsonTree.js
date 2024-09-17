/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        size.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Default } from "./default";
import { Is } from "./is";


export namespace Size {
    export function of( value: any ) : string {
        let result: string = null!;
        const bytes: number = getSize( value );

        if ( bytes > 0 ) {
            const type: number = Math.floor( Math.log( bytes ) / Math.log( 1024 ) );

            return `${Default.getFixedFloatPlacesValue( ( bytes / Math.pow( 1024, type ) ), 2 )} ${' KMGTP'.charAt( type )}B`;
        }

        return result;
    }

    function getSize( value: any ) : number {
        let bytes: number = 0;

        if ( Is.defined( value ) ) {
            if ( Is.definedNumber( value ) ) {
                bytes = 8;

            } else if ( Is.definedString( value ) ) {
                bytes = value.length * 2;

            } else if ( Is.definedBoolean( value ) ) {
                bytes = 4;

            } else if ( Is.definedBigInt( value ) ) {
                bytes = getSize( value.toString() );
            
            } else if ( Is.definedRegExp( value ) ) {
                bytes = getSize( value.toString() );
            
            } else if ( Is.definedDate( value ) ) {
                bytes = getSize( value.toString() );
            
            } else if ( Is.definedSet( value ) ) {
                bytes = getSize( Default.getArrayFromSet( value ) );

            } else if ( Is.definedMap( value ) ) {
                bytes = getSize( Default.getObjectFromMap( value ) );

            } else if ( Is.definedArray( value ) ) {
                const arrayLength: number = value.length;

                for ( let arrayIndex: number = 0; arrayIndex < arrayLength; arrayIndex++ ) {
                    bytes += getSize( value[ arrayIndex ] );
                }
                
            } else if ( Is.definedObject( value ) ) {
                for ( let itemKey in value ) {
                    if ( value.hasOwnProperty( itemKey ) ) {
                        bytes += ( getSize( itemKey ) + getSize( value[ itemKey ] ) );
                    }
                }
            }
        }

        return bytes;
    }
}