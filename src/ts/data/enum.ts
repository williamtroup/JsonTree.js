/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        enum.ts
 * @version     v4.7.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2025
 */


export enum Char {
    empty = "",
    space = " ",
    zero = "0",
    hash = "#",
    backslash = "\\",
    dash = "_",
    underscore = "_",
    dot = ".",
    coma = ",",
}

export const enum Value {
    notFound = -1,
}

export enum DataType {
    null = "null",
    function = "function",
    boolean = "boolean",
    float = "float",
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
    url = "url",
    image = "image",
    email = "email",
    html = "html",
    lambda = "lambda",
}

export enum KeyCode {
    C = "c",
    escape = "Escape",
    enter = "Enter",
    left = "ArrowLeft",
    up = "ArrowUp",
    right = "ArrowRight",
    down = "ArrowDown",
    f11 = "F11",
}