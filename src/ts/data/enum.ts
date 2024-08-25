/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        enum.ts
 * @version     v2.9.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export const enum Char {
    empty = "",
    space = " ",
    zero = "0",
    hash = "#",
    backslash = "\\",
}

export const enum DataType {
    null = "null",
    function = "function",
    boolean = "boolean",
    decimal = "decimal",
    number = "number",
    bigint = "bigint",
    string = "string",
    date = "date",
    symbol = "symbol",
    object = "object",
    array = "array",
    unknown = "unknown",
    undefined = "undefined",
    color = "color",
    guid = "guid",
    regexp = "regexp",
    map = "map",
    set = "set",
}

export const enum KeyCode {
    escape = "Escape",
    enter = "Enter",
    left = "ArrowLeft",
    up = "ArrowUp",
    right = "ArrowRight",
    down = "ArrowDown",
}