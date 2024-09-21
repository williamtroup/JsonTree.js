/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        convert.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type StringToJson, type Configuration } from "../type";
import { Default } from "./default";
import { Char } from "./enum";
import { Is } from "./is";


export namespace Convert {
    export function stringifyJson( _: string, value: any, configuration: Configuration ) : any {
        if ( Is.definedBigInt( value ) ) {
            value = value.toString();

        } else if ( Is.definedSymbol( value ) ) {
            value = value.toString();

        } else if ( Is.definedFunction( value ) ) {
            value = Default.getFunctionName( value, configuration ).name;

        } else if ( Is.definedMap( value ) ) {
            value = mapToObject( value );

        } else if ( Is.definedSet( value ) ) {
            value = setToArray( value );

        } else if ( Is.definedRegExp( value ) ) {
            value = value.source;
            
        } else if ( Is.definedImage( value ) ) {
            value = value.src;
        }

        return value;
    }

    export function dataTypeValue( oldValue: any, newValue: any ) : any {
        let result: any = null;

        if ( Is.definedBoolean( oldValue ) ) {
            result = newValue.toLowerCase() === "true";

        } else if ( Is.definedFloat( oldValue ) && !isNaN( +newValue ) ) {
            result = parseFloat( newValue );

        } else if ( Is.definedNumber( oldValue ) && !isNaN( +newValue ) ) {
            result = parseInt( newValue );

        } else if ( Is.definedString( oldValue ) ) {
            result = newValue;

        } else if ( Is.definedDate( oldValue ) ) {
            result = new Date( newValue );

        } else if ( Is.definedBigInt( oldValue ) ) {
            result = BigInt( newValue );
        }

        return result;
    }

    export function htmlToObject( value: HTMLElement ) : any {
        const result: any = {};
        const attributesLength: number = value.attributes.length;
        const childrenLength: number = value.children.length;
        const childrenKeyName: string = "children";

        result[ childrenKeyName ] = [];

        for ( let attributeIndex: number = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            const attribute: Attr = value.attributes[ attributeIndex ];

            if ( Is.definedString( attribute.nodeName ) ) {
                result[ attribute.nodeName ] = attribute.nodeValue;
            }
        }

        for ( let childIndex: number = 0; childIndex < childrenLength; childIndex++ ) {
            result[ childrenKeyName ].push( value.children[ childIndex ] );
        }

        if ( result[ childrenKeyName ].length === 0 ) {
            delete result[ childrenKeyName ];
        }

        return result;
    }

    export function mapToObject( map: Map<any, any> ) : object {
        const result: object = Object.fromEntries( map.entries() );
    
        return result;
    }

    export function setToArray( set: Set<any> ) : any[] {
        const result: any[] = Array.from( set.values() );
    
        return result;
    }

    export function jsonStringToObject( objectString: any, configuration: Configuration ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                result.object = JSON.parse( objectString );
            }

        } catch ( e1: any ) {
            try {
                result.object = eval( `(${objectString})` );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !configuration.safeMode ) {
                    console.error( configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
    }

    export function numberToFloatWithDecimalPlaces( value: number, decimalPlaces: number ) : string {
        const regExp: RegExp = new RegExp( `^-?\\d+(?:.\\d{0,${decimalPlaces || -1}})?` );
    
        return value.toString().match( regExp )?.[ 0 ] || Char.empty;
    }

    export function stringToBigInt( value: string ) : BigInt {
        return BigInt( value.substring( 0, value.length - 1 ) );
    }
}