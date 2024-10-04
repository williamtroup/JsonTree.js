/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        convert.ts
 * @version     v4.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type StringToJson, type Configuration, type BindingOptions } from "../type";
import { Default } from "./default";
import { Char } from "./enum";
import { Is } from "./is";


export namespace Convert {
    export function toJsonStringifyClone( object: any, configuration: Configuration, bindingOptions: BindingOptions ) : any {
        let result: any = null!;

        if ( Is.definedDate( object ) ) {
            if ( !bindingOptions.includeTimeZoneInDates ) {
                result = JSON.stringify( object ).replace( /['"]+/g, Char.empty );
            } else {
                result = object.toString();
            }

        } else if ( Is.definedSymbol( object ) ) {
            result = symbolToString( object );

        } else if ( Is.definedBigInt( object ) ) {
            result = object.toString();

        } else if ( Is.definedFunction( object ) ) {
            result = Default.getFunctionName( object, configuration ).name;

        } else if ( Is.definedRegExp( object ) ) {
            result = object.source;
            
        } else if ( Is.definedImage( object ) ) {
            result = object.src;

        } else if ( Is.definedHtml( object ) ) {
            result = htmlToObject( object, bindingOptions.showCssStylesForHtmlObjects! );

        } else if ( Is.definedArray( object ) ) {
            result = [];

            const arrayLength: number = object.length;

            for ( let arrayIndex: number = 0; arrayIndex < arrayLength; arrayIndex++ ) {
                result.push( toJsonStringifyClone( object[ arrayIndex ], configuration, bindingOptions ) );
            }

        } else if ( Is.definedSet( object ) ) {
            result = [];

            const array: Array<any> = setToArray( object );
            const arrayLength: number = array.length;

            for ( let arrayIndex: number = 0; arrayIndex < arrayLength; arrayIndex++ ) {
                result.push( toJsonStringifyClone( array[ arrayIndex ], configuration, bindingOptions ) );
            }

        } else if ( Is.definedMap( object ) ) {
            result = {};

            const obj: any = mapToObject( object );

            for ( const key in obj ) {
                if ( obj.hasOwnProperty( key ) ) {
                    result[ key ] = toJsonStringifyClone( obj[ key ], configuration, bindingOptions );
                }
            }

        } else if ( Is.definedObject( object ) ) {
            result = {};

            for ( const key in object ) {
                if ( object.hasOwnProperty( key ) ) {
                    result[ key ] = toJsonStringifyClone( object[ key ], configuration, bindingOptions );
                }
            }
            
        } else {
            result = object;
        }

        return result;
    }

    export function stringToDataTypeValue( oldValue: any, newValue: string ) : any {
        let result: any = null;

        try {
            if ( Is.definedBoolean( oldValue ) ) {
                if ( newValue.toLowerCase().trim() === "true" ) {
                    result = true;
                } else if ( newValue.toLowerCase().trim() === "false" ) {
                    result = false;
                }
    
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
    
            } else if ( Is.definedRegExp( oldValue ) ) {
                result = new RegExp( newValue );
    
            } else if ( Is.definedSymbol( oldValue ) ) {
                result = Symbol( newValue );

            } else if ( Is.definedImage( oldValue ) ) {
                result = new Image();
                result.src = newValue;
            }

        } catch ( e: any ) {
            result = null!
        }

        return result;
    }

    export function htmlToObject( value: HTMLElement, addCssStyles: boolean ) : any {
        const result: any = {};
        const attributesLength: number = value.attributes.length;
        const childrenLength: number = value.children.length;
        const childrenKeyName: string = "&children";
        const textKeyName: string = "#text";
        const valueCloned: HTMLElement = value.cloneNode( true ) as HTMLElement;
        let valueClonedChildrenLength = valueCloned.children.length;

        while ( valueClonedChildrenLength > 0 ) {
            if ( valueCloned.children[ 0 ].nodeType !== Node.TEXT_NODE ) {
                valueCloned.removeChild( valueCloned.children[ 0 ] );
            }

            valueClonedChildrenLength--;
        }

        result[ childrenKeyName ] = [];
        result[ textKeyName ] = valueCloned.innerText;

        for ( let attributeIndex: number = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            const attribute: Attr = value.attributes[ attributeIndex ];

            if ( Is.definedString( attribute.nodeName ) ) {
                result[ `@${attribute.nodeName}` ] = attribute.nodeValue;
            }
        }

        for ( let childIndex: number = 0; childIndex < childrenLength; childIndex++ ) {
            result[ childrenKeyName ].push( value.children[ childIndex ] );
        }

        if ( addCssStyles ) {
            const computedStyles: CSSStyleDeclaration = getComputedStyle( value );
            const computedStylesLength: number = computedStyles.length;
    
            for ( let cssComputedStyleIndex: number = 0; cssComputedStyleIndex < computedStylesLength; cssComputedStyleIndex++ ) {
                const cssComputedStyleName: string = computedStyles[ cssComputedStyleIndex ];
                const cssComputedStyleNameStorage: string = `$${cssComputedStyleName}`;
                const cssComputedValue: string = computedStyles.getPropertyValue( cssComputedStyleName );

                result[ cssComputedStyleNameStorage ] = cssComputedValue;
            }
        }

        if ( result[ childrenKeyName ].length === 0 ) {
            delete result[ childrenKeyName ];
        }

        if ( !Is.definedString( result[ textKeyName ] ) ) {
            delete result[ textKeyName ];
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

    export function symbolToString( value: Symbol ) : string {
        return value.toString().replace( "Symbol(", Char.empty ).replace( ")", Char.empty );
    }
}