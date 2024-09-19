/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        replacer.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "../type";
import { Default } from "./default";
import { Is } from "./is";


export namespace Replacer {
    export function json( _: string, value: any, configuration: Configuration ) : any {
        if ( Is.definedBigInt( value ) ) {
            value = value.toString();

        } else if ( Is.definedSymbol( value ) ) {
            value = value.toString();

        } else if ( Is.definedFunction( value ) ) {
            value = Default.getFunctionName( value, configuration ).name;

        } else if ( Is.definedMap( value ) ) {
            value = Default.getObjectFromMap( value );

        } else if ( Is.definedSet( value ) ) {
            value = Default.getArrayFromSet( value );

        } else if ( Is.definedRegExp( value ) ) {
            value = value.source;
            
        } else if ( Is.definedImage( value ) ) {
            value = value.src;
        }

        return value;
    }
}