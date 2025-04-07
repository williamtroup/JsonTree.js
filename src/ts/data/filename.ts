/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        filename.ts
 * @version     v4.7.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2025
 */


import { Char } from "./enum";


export namespace Filename {
    export function getExtension( filename: string ) : string {
        return filename.split( Char.dot )!.pop()!.toLowerCase();
    }

    export function isExtensionForObjectFile( extension: string ) : boolean {
        return extension === "csv" || extension === "html" || extension === "htm";
    }
}