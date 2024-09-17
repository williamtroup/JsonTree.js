/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        trigger.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Is } from "../data/is";


export namespace Trigger {
    export function customEvent<Type>( triggerFunction: Function, ...args : any[] ) : Type {
        let result: any = null;

        if ( Is.definedFunction( triggerFunction ) ) {
            result = triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }

        return result;
    }
}