/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        size.ts
 * @version     v4.6.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Convert } from "./convert";
import { Is } from "./is";


export namespace Size {
    export function of( value: any, addCssStyles: boolean ) : string {
        let result: string = null!;
        const bytes: number = getSize( value, addCssStyles );

        if ( bytes > 0 ) {
            const type: number = Math.floor( Math.log( bytes ) / Math.log( 1024 ) );

            return `${Convert.numberToFloatWithDecimalPlaces( ( bytes / Math.pow( 1024, type ) ), 2 )} ${' KMGTP'.charAt( type )}B`;
        }

        return result;
    }

    export function length( value: any, addCssStyles: boolean ) : number {
        let result: number = 0;

        if ( Is.defined( value ) ) {
            if ( Is.definedDate( value ) ) {
                result = value.toString().length;

            } else if ( Is.definedImage( value ) ) {
                result = value.src.length;

            } else if ( Is.definedRegExp( value ) ) {
                result = value.source.length;
                
            } else if ( Is.definedSet( value ) ) {
                result = length( Convert.setToArray( value ), addCssStyles );

            } else if ( Is.definedMap( value ) ) {
                result = length( Convert.mapToObject( value ), addCssStyles );

            } else if ( Is.definedHtml( value ) ) {
                result = length( Convert.htmlToObject( value, addCssStyles ), addCssStyles );

            } else if ( Is.definedArray( value ) ) {
                result = value.length;
                
            } else if ( Is.definedObject( value ) ) {
                for ( const itemKey in value ) {
                    if ( value.hasOwnProperty( itemKey ) ) {
                        result++;
                    }
                }

            } else {
                if ( !Is.definedFunction( value ) && !Is.definedSymbol( value ) ) {
                    result = value.toString().length;
                }
            }
        }

        return result;
    }

    function getSize( value: any, addCssStyles: boolean ) : number {
        let bytes: number = 0;

        if ( Is.defined( value ) ) {
            if ( Is.definedNumber( value ) ) {
                bytes = 8;

            } else if ( Is.definedString( value ) ) {
                bytes = value.length * 2;

            } else if ( Is.definedBoolean( value ) ) {
                bytes = 4;

            } else if ( Is.definedBigInt( value ) ) {
                bytes = getSize( value.toString(), addCssStyles );
            
            } else if ( Is.definedRegExp( value ) ) {
                bytes = getSize( value.toString(), addCssStyles );
            
            } else if ( Is.definedDate( value ) ) {
                bytes = getSize( value.toString(), addCssStyles );
            
            } else if ( Is.definedSet( value ) ) {
                bytes = getSize( Convert.setToArray( value ), addCssStyles );

            } else if ( Is.definedMap( value ) ) {
                bytes = getSize( Convert.mapToObject( value ), addCssStyles );

            } else if ( Is.definedHtml( value ) ) {
                bytes = getSize( Convert.htmlToObject( value, addCssStyles ), addCssStyles );

            } else if ( Is.definedArray( value ) ) {
                const arrayLength: number = value.length;

                for ( let arrayIndex: number = 0; arrayIndex < arrayLength; arrayIndex++ ) {
                    bytes += getSize( value[ arrayIndex ], addCssStyles );
                }
                
            } else if ( Is.definedObject( value ) ) {
                for ( const itemKey in value ) {
                    if ( value.hasOwnProperty( itemKey ) ) {
                        bytes += ( getSize( itemKey, addCssStyles ) + getSize( value[ itemKey ], addCssStyles ) );
                    }
                }
            }
        }

        return bytes;
    }
}