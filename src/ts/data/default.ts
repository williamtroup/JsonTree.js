/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        default.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type StringToJson,
    type Configuration,
    type FunctionName } from "../type";

import { Convert } from "./convert";
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

    export function getNumberMinimum( value: any, defaultValue: number, minimum: number ) : number {
        return Is.definedNumber( value ) ? ( value >= minimum ? value : minimum ) : defaultValue;
    }

    export function getNumberMaximum( value: any, defaultValue: number, maximum: number ) : number {
        return Is.definedNumber( value ) ? ( value > maximum ? maximum : value ) : defaultValue;
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

    export function getFunctionName( value: any, configuration: Configuration ) : FunctionName {
        let name: string;
        let isLambda: boolean = false;

        const valueParts: string[] = value.toString().split( "(" );
        const valueNameParts: string[] = valueParts[ 0 ].split( Char.space );
        const functionBrackets: string = "()";

        name = `${valueNameParts.join(Char.space)}${functionBrackets}`;

        if ( name.trim() === functionBrackets ) {
            name = `${configuration.text!.functionText!}${functionBrackets}`;
            isLambda = true;
        }

        return {
            name: name,
            isLambda: isLambda
        } as FunctionName;
    }

    export function getObjectFromUrl( url: string, configuration: Configuration, callback: ( object: any ) => void ) : void {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open( "GET", url, true );
        request.send();

        request.onreadystatechange = () => {
            if ( request.readyState === 4 && request.status === 200 ) {
                const data: string = request.responseText;
                const dataJson: StringToJson = Convert.jsonStringToObject( data, configuration );

                if ( dataJson.parsed ) {
                    callback( dataJson.object );
                }

            } else {
                callback( null );
            }
        }
    }
}