/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        arr.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions } from "../type";
import { Char } from "./enum";
import { Str } from "./str";


export namespace Arr {
    export function getIndex( index: number, bindingOptions: BindingOptions ) : number {
        return bindingOptions.useZeroIndexingForArrays ? index : index + 1;
    }
    
    export function getIndexName( bindingOptions: BindingOptions, index: number, largestValue: number ) : string {
        let result: string = index.toString();
    
        if ( bindingOptions.addArrayIndexPadding ) {
            let paddingLength = largestValue.toString().length;

            if ( paddingLength < ( bindingOptions.minimumArrayIndexPadding! + 1 ) ) {
                paddingLength = bindingOptions.minimumArrayIndexPadding! + 1;
            }

            result = Str.padNumber( parseInt( result ), paddingLength, bindingOptions.arrayIndexPaddingCharacter );
        }

        if ( bindingOptions.showArrayIndexBrackets ) {
            result = `[${result}]`;
        }
    
        return result;
    }

    export function getIndexFromBrackets( propertyName: string ) : number {
        return parseInt( propertyName.replace( /^\D+/g, Char.empty ) );
    }

    export function moveIndex( arrayData: any[], oldIndex: number, newIndex: number ) : void {
        if ( newIndex < 0 ) {
            newIndex = 0;
        } else if ( newIndex > arrayData.length - 1 ) {
            newIndex = arrayData.length - 1;
        }

        arrayData.splice( newIndex, 0, arrayData.splice( oldIndex, 1 )[ 0 ] );
    };
}