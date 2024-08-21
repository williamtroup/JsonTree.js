/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        tooltip.ts
 * @version     v2.7.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions } from "../type";
import { DomElement } from "../dom/dom";
import { Is } from "../data/is";


export namespace ToolTip {
    export function renderControl( bindingOptions: BindingOptions ) : void {
        if ( !Is.defined( bindingOptions._currentView.tooltip ) ) {
            bindingOptions._currentView.tooltip = DomElement.create( document.body, "div", "jsontree-js-tooltip" );
            bindingOptions._currentView.tooltip.style.display = "none";
    
            assignToEvents( bindingOptions );
        }
    }

    export function assignToEvents( bindingOptions: BindingOptions, add: boolean = true ) : void {
        let addEventListener_Window: Function = add ? window.addEventListener : window.removeEventListener;
        let addEventListener_Document: Function = add ? document.addEventListener : document.removeEventListener;

        addEventListener_Window( "mousemove", () => {
            hide( bindingOptions );
        } );

        addEventListener_Document( "scroll", () => {
            hide( bindingOptions );
        } );
    }

    export function add( element: HTMLElement, bindingOptions: BindingOptions, text: string ) : void {
        if ( element !== null ) {
            element.onmousemove = ( e: MouseEvent ) => {
                show( e, bindingOptions, text );
            };
        }
    }

    export function show( e: MouseEvent, bindingOptions: BindingOptions, text: string ) : void {
        DomElement.cancelBubble( e );
        hide( bindingOptions );

        bindingOptions._currentView.tooltipTimerId = setTimeout( () => {
            bindingOptions._currentView.tooltip.innerHTML = text;
            bindingOptions._currentView.tooltip.style.display = "block";

            DomElement.showElementAtMousePosition( e, bindingOptions._currentView.tooltip );
        }, bindingOptions.tooltip!.delay );
    }

    export function hide( bindingOptions: BindingOptions ) : void {
        if ( Is.defined( bindingOptions._currentView.tooltip ) ) {
            if ( bindingOptions._currentView.tooltipTimerId !== 0 ) {
                clearTimeout( bindingOptions._currentView.tooltipTimerId );
                bindingOptions._currentView.tooltipTimerId = 0;
            }
    
            if ( bindingOptions._currentView.tooltip.style.display !== "none" ) {
                bindingOptions._currentView.tooltip.style.display = "none";
            }
        }
    }
}