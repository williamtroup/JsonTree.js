/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        obj.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions } from "../type";


export namespace Obj {
    export function getPropertyNames( data: any, bindingOptions: BindingOptions ) : string[] {
        let properties: string[] = [];

        for ( const key in data ) {
            if ( data.hasOwnProperty( key ) ) {
                properties.push( key );
            }
        }

        if ( bindingOptions.sortPropertyNames ) {
            let collator: Intl.Collator = new Intl.Collator( undefined, {
                numeric: true,
                sensitivity: "base"
            } );

            properties = properties.sort( collator.compare );

            if ( !bindingOptions.sortPropertyNamesInAlphabeticalOrder ) {
                properties = properties.reverse();
            }
        }

        return properties;
    }
}