/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        context-menu.ts
 * @version     v4.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions } from "../type";
import { DomElement } from "../dom/dom";
import { Is } from "../data/is";


export namespace ContextMenu {
    export function renderControl( bindingOptions: BindingOptions ) : void {
        if ( !Is.defined( bindingOptions._currentView.contextMenu ) ) {
            bindingOptions._currentView.contextMenu = DomElement.create( document.body, "div", "jsontree-js-context-menu" );
            bindingOptions._currentView.contextMenu.style.display = "none";
    
            assignToEvents( bindingOptions );
        }
    }

    export function assignToEvents( bindingOptions: BindingOptions, add: boolean = true ) : void {
        const addEventListener_Window: Function = add ? window.addEventListener : window.removeEventListener;
        const addEventListener_Document: Function = add ? document.addEventListener : document.removeEventListener;

        addEventListener_Window( "contextmenu", () => hide( bindingOptions ) );
        addEventListener_Window( "click", () => hide( bindingOptions ) );
        addEventListener_Document( "scroll", () => hide( bindingOptions ) );
    }

    export function show( e: MouseEvent, bindingOptions: BindingOptions ) : void {
        DomElement.cancelBubble( e );
        DomElement.showElementAtMousePosition( e, bindingOptions._currentView.contextMenu, 0 );
    }

    export function hide( bindingOptions: BindingOptions ) : void {
        if ( Is.defined( bindingOptions._currentView.contextMenu ) && bindingOptions._currentView.contextMenu.style.display !== "none" ) {
            bindingOptions._currentView.contextMenu.style.display = "none";
        }
    }

    export function remove( bindingOptions: BindingOptions ) : void {
        if ( Is.defined( bindingOptions._currentView.contextMenu ) ) {
            bindingOptions._currentView.contextMenu.parentNode!.removeChild( bindingOptions._currentView.contextMenu );
        }
    }

    export function addMenuItem( bindingOptions: BindingOptions, symbolText: string, text: string ) : HTMLElement {
        const menuItem: HTMLElement = DomElement.create( bindingOptions._currentView.contextMenu, "div", "context-menu-item" );

        DomElement.createWithHTML( menuItem, "span", "symbol", symbolText );
        DomElement.createWithHTML( menuItem, "span", "text", text );

        return menuItem;
    }
}