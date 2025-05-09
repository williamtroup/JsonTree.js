/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        dom.ts
 * @version     v4.7.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2025
 */


import { type Position } from "../type";
import { Char } from "../data/enum";
import { Is } from "../data/is";


export namespace DomElement {
    export function find( tagTypes: string[], func: ( element: HTMLElement ) => boolean ) : void {
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !func( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    export function create( container: HTMLElement, type: string, className: string = Char.empty, beforeNode: HTMLElement = null! ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";
        const result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        if ( Is.defined( className ) ) {
            result.className = className;
        }

        if ( Is.defined( container ) ) {
            if ( Is.defined( beforeNode ) ) {
                container.insertBefore( result, beforeNode );
            } else {
                container.appendChild( result );
            }
        }

        return result;
    }

    export function createWithHTML( container: HTMLElement, type: string, className: string, html: string, beforeNode: HTMLElement = null! ) : HTMLElement {
        const element: HTMLElement = create( container, type, className, beforeNode );
        element.innerHTML = html;

        return element;
    }

    export function createWithNoContainer( type: string ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";
        const result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        return result;
    }

    export function cancelBubble( ev: Event ) : void {
        ev.preventDefault();
        ev.stopPropagation();
    }

    export function getScrollPosition() : Position {
        const documentElement: HTMLElement = document.documentElement;

        const result: Position = {
            left: documentElement.scrollLeft  - ( documentElement.clientLeft || 0 ),
            top: documentElement.scrollTop - ( documentElement.clientTop || 0 )
        } as Position;

        return result;
    }

    export function showElementAtMousePosition( ev: MouseEvent, element: HTMLElement, offset: number ) : void {
        let left: number = ev.pageX;
        let top: number = ev.pageY;
        const scrollPosition: Position = getScrollPosition();

        element.style.display = "block";

        if ( left + element.offsetWidth > window.innerWidth ) {
            left -= ( element.offsetWidth + offset );
        } else {
            left++;
            left += offset;
        }

        if ( top + element.offsetHeight > window.innerHeight ) {
            top -= ( element.offsetHeight + offset );
        } else {
            top++;
            top += offset;
        }

        if ( left < scrollPosition.left ) {
            left = ev.pageX + 1;
        }

        if ( top < scrollPosition.top ) {
            top = ev.pageY + 1;
        }
        
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    }

    export function selectAllText( element: HTMLElement ) : void {
        const range: Range = document.createRange();
        range.selectNodeContents( element );

        const selection: Selection = window.getSelection()!;

        selection.removeAllRanges();
        selection.addRange( range );
    }

    export function createCheckBox( container: HTMLElement, labelText: string, name: string, checked: boolean, spanClass: string, additionalText: string ) : HTMLInputElement {
        const lineContainer: HTMLElement = create( container, "div", "checkbox" );
        const label: HTMLElement = create( lineContainer, "label", "checkbox" );
        const input: HTMLInputElement = create( label, "input" ) as HTMLInputElement;

        input.type = "checkbox";
        input.name = name;
        input.checked = checked;
        input.autocomplete = "off";

        create( label, "span", "check-mark" );
        createWithHTML( label, "span", `text ${spanClass}`, labelText );

        if ( Is.definedString( additionalText ) ) {
            createWithHTML( label, "span", `additional-text`, additionalText );
        }
        
        return input;
    }

    export function getOffset( element: HTMLElement ) : Position {
        const position: Position = {} as Position;
        position.left = 0;
        position.top = 0;

        while ( element && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop ) ) {
            position.left += element.offsetLeft - element.scrollLeft;
            position.top += element.offsetTop - element.scrollTop;

            element = element.offsetParent as HTMLElement;
        }

        return position;
    }

    export function getStyleValueByName( element: any, stylePropertyName: string, toNumber: boolean = false ) : any {
        const styles: CSSStyleDeclaration = getComputedStyle( element );
        let style: any = styles.getPropertyValue( stylePropertyName );
        
        if ( toNumber ) {
            style = parseFloat( style );
        }

        return style;
    }
}