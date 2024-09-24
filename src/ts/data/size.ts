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


import { Convert } from "./convert";
import { Is } from "./is";


export namespace Size {
    export function of( value: any ) : string {
        let result: string = null!;
        const bytes: number = getSize( value );

        if ( bytes > 0 ) {
            const type: number = Math.floor( Math.log( bytes ) / Math.log( 1024 ) );

            return `${Convert.numberToFloatWithDecimalPlaces( ( bytes / Math.pow( 1024, type ) ), 2 )} ${' KMGTP'.charAt( type )}B`;
        }

        return result;
    }

    export function length( value: any ) : number {
        let length: number = 0;

        if ( Is.defined( value ) ) {
            if ( Is.definedDate( value ) ) {
                length = value.toString().length;

            } else if ( Is.definedImage( value ) ) {
                length = value.src.length;

            } else if ( Is.definedRegExp( value ) ) {
                length = value.source.length;
                
            } else if ( Is.definedSet( value ) ) {
                length = Size.length( Convert.setToArray( value ) );

            } else if ( Is.definedMap( value ) ) {
                length = Size.length( Convert.mapToObject( value ) );

            } else if ( Is.definedHtml( value ) ) {
                length = Size.length( Convert.htmlToObject( value ) );

            } else if ( Is.definedArray( value ) ) {
                length = value.length;
                
            } else if ( Is.definedObject( value ) ) {
                for ( const itemKey in value ) {
                    if ( value.hasOwnProperty( itemKey ) ) {
                        length++;
                    }
                }

            } else {
                if ( !Is.definedFunction( value ) && !Is.definedSymbol( value ) ) {
                    length = value.toString().length;
                }
            }
        }

        return length;
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
                bytes = getSize( Convert.setToArray( value ) );

            } else if ( Is.definedMap( value ) ) {
                bytes = getSize( Convert.mapToObject( value ) );

            } else if ( Is.definedHtml( value ) ) {
                bytes = getSize( Convert.htmlToObject( value ) );

            } else if ( Is.definedArray( value ) ) {
                const arrayLength: number = value.length;

                for ( let arrayIndex: number = 0; arrayIndex < arrayLength; arrayIndex++ ) {
                    bytes += getSize( value[ arrayIndex ] );
                }
                
            } else if ( Is.definedObject( value ) ) {
                for ( const itemKey in value ) {
                    if ( value.hasOwnProperty( itemKey ) ) {
                        bytes += ( getSize( itemKey ) + getSize( value[ itemKey ] ) );
                    }
                }
            }
        }

        return bytes;
    }
}