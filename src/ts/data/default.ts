/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        default.ts
 * @version     v2.9.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type StringToJson, type Configuration } from "../type";
import { Char } from "./enum";
import { Is } from "./is";


export namespace Default {
    export function getAnyString( value: any, defaultValue: string ) : string {
        return typeof value === "string" ? value : defaultValue;
    }

    export function getString( value: any, defaultValue: string ) : string {
        return Is.definedString( value ) ? value : defaultValue;
    }

    export function getBoolean( value: any, defaultValue: boolean ) : boolean {
        return Is.definedBoolean( value ) ? value : defaultValue;
    }

    export function getNumber( value: any, defaultValue: number ) : number {
        return Is.definedNumber( value ) ? value : defaultValue;
    }

    export function getFunction( value: any, defaultValue: object ) : any {
        return Is.definedFunction( value ) ? value : defaultValue;
    }

    export function getArray( value: any, defaultValue: any[] ) : any[] {
        return Is.definedArray( value ) ? value : defaultValue;
    }

    export function getObject( value: any, defaultValue: object ) : any {
        return Is.definedObject( value ) ? value : defaultValue;
    }

    export function getStringOrArray( value: any, defaultValue: string[] ) : string[] {
        let result: string[] = defaultValue;

        if ( Is.definedString( value ) ) {
            const values: string[] = value.toString().split( Char.space );

            if ( values.length === 0 ) {
                value = defaultValue;
            } else {
                result = values;
            }

        } else {
            result = getArray( value, defaultValue );
        }

        return result;
    }

    export function getFixedDecimalPlacesValue( value: number, decimalPlaces: number ) : string {
        const regExp: RegExp = new RegExp( `^-?\\d+(?:.\\d{0,${decimalPlaces || -1}})?` );
    
        return value.toString().match( regExp )?.[ 0 ] || Char.empty;
    }

    export function getFunctionName( value: any, configuration: Configuration ) : string {
        let result: string;
        const valueParts: string[] = value.toString().split( "(" );
        const valueNameParts: string[] = valueParts[ 0 ].split( Char.space );
        const functionBrackets: string = "()";

        if ( valueNameParts.length === 2 ) {
            result = valueNameParts[ 1 ];
        } else {
            result = valueNameParts[ 0 ];
        }

        result += functionBrackets;

        if ( result.trim() === functionBrackets ) {
            result = `${configuration.text!.functionText!}${functionBrackets}`;
        }

        return result;
    }

    export function getObjectFromString( objectString: any, configuration: Configuration ) : StringToJson {
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

    export function getObjectFromMap( map: Map<any, any> ) : object {
        const result: object = Object.fromEntries( map.entries() );
    
        return result;
    }

    export function getArrayFromSet( set: Set<any> ) : any[] {
        const result: any[] = Array.from( set.values() );
    
        return result;
    }
}