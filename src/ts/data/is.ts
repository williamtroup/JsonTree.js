/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        is.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Is {
    export namespace String {
        export function hexColor( value: string ) : boolean {
            let valid: boolean = value.length >= 2 && value.length <= 7;
        
            if ( valid && value[ 0 ] === Char.hash ) {
                valid = isNaN( +value.substring( 1, value.length - 1 ) );
            } else {
                valid = false;
            }
        
            return valid;
        }

        export function rgbColor( value: string ) : boolean {
            return ( value.startsWith( "rgb(" ) || value.startsWith( "rgba(" ) ) && value.endsWith( ")" );
        }
    
        export function boolean( object: string ) : boolean {
            return object.toString().toLowerCase().trim() === "true" || object.toString().toLowerCase().trim() === "false";
        }
    
        export function date( dateTimeString: string ) {
            const regExp: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

            return dateTimeString.match( regExp );
        }

        export function guid( value: string ) : boolean {
            const regex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

            return regex.test( value );
        }

        export function bigInt( value: string ) : boolean {
            let result: boolean = value.endsWith( "n" );

            if ( result ) {
                result = !isNaN( +value.substring( 0, value.length - 1 ) );
            }

            return result;
        }
    }

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
        return object !== null && object !== undefined && object instanceof Array;
    }

    export function definedDate( object: any ) : boolean {
        return definedObject( object ) && object instanceof Date;
    }

    export function definedFloat( object: any ) : boolean {
        return defined( object ) && typeof object === "number" && object % 1 !== 0;
    }

    export function definedSymbol( object: any ) : boolean {
        return defined( object ) && typeof object === "symbol";
    }

    export function definedRegExp( object: any ) : boolean {
        return defined( object ) && object instanceof RegExp;
    }

    export function definedMap( object: any ) : boolean {
        return defined( object ) && ( object instanceof Map || object instanceof WeakMap );
    }

    export function definedSet( object: any ) : boolean {
        return defined( object ) && ( object instanceof Set || object instanceof WeakSet );
    }

    export function definedImage( object: any ) : boolean {
        return defined( object ) && object instanceof Image;
    }

    export function definedHtml( object: any ) : boolean {
        return defined( object ) && object instanceof HTMLElement;
    }

    export function definedUrl( data: string ) : boolean {
        let url: URL;
        
        try {
            url = new URL( data );
        } catch {
            url = null!;  
        }
      
        return url !== null && ( url.protocol === "http:" || url.protocol === "https:" )
    }

    export function definedEmail( data: string ) : boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return regex.test( data );	
    }

    export function invalidOptionArray( array: any, minimumLength: number = 1 ) : boolean {
        return !definedArray( array ) || array.length < minimumLength;
    }
}