/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        api.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptions } from "./type";


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Manage Instances
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * refresh().
	 *
	 * Refreshes a JsonTree.js instance.
	 *
	 * @public
	 * @fires       onRefresh
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be refreshed.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	refresh: ( elementId: string ) => PublicApi;

	/**
	 * refreshAll().
	 *
	 * Refreshes all of the rendered JsonTree.js instances.
	 *
	 * @public
	 * @fires       onRefresh
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	refreshAll: () => PublicApi;

	/**
	 * render().
	 *
	 * Renders an element using the options specified.
	 *
	 * @public
	 *
	 * @param       {Object}    element                                     The element to render.
	 * @param       {Object}    options                                     The options to use (refer to "Binding Options" documentation for properties).
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	render: ( element: HTMLElement, options: object ) => PublicApi;

	/**
	 * renderAll().
	 *
	 * Finds all new elements and renders them.
	 *
	 * @public
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	renderAll: () => PublicApi;

	/**
	 * openAll().
	 *
	 * Opens all the nodes in a JsonTree.js instance.
	 *
	 * @public
	 * @fires       onOpenAll
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	openAll: ( elementId: string ) => PublicApi;

	/**
	 * closeAll().
	 *
	 * Closes all the nodes in a JsonTree.js instance.
	 *
	 * @public
	 * @fires       onCloseAll
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	closeAll: ( elementId: string ) => PublicApi;

	/**
	 * backPage().
	 *
	 * Moves back a page (if array paging is enabled).
	 *
	 * @public
	 * @fires       onBackPage
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	backPage: ( elementId: string ) => PublicApi;

	/**
	 * nextPage().
	 *
	 * Moves forward a page (if array paging is enabled).
	 *
	 * @public
	 * @fires       onNextPage
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	nextPage: ( elementId: string ) => PublicApi;

	/**
	 * getPageNumber().
	 *
	 * Returns the current page number (if array paging is enabled).
	 *
	 * @public
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 *
	 * @returns     {number}                                                The array page number.
	 */
	getPageNumber: ( elementId: string ) => number;
	

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Manage Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * setJson().
	 *
	 * Sets the JSON data currently being displayed.
	 *
	 * @public
	 * @fires       onSetJson
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID that should be updated.
	 * @param       {any}    	json                                   		The JSON that should be shown in the display (can be a string, or object).
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	setJson: ( elementId: string, json: any ) => PublicApi;

	/**
	 * getJson().
	 *
	 * Returns the JSON data currently being displayed.
	 *
	 * @public
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID.
	 *
	 * @returns     {any}                                                	The JSON that is being displayed.
	 */
	getJson: ( elementId: string ) => any;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Manage Binding Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * updateBindingOptions().
	 *
	 * Updates the binding options that are assigned to a specific element.
	 *
	 * @public
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID.
	 * @param       {Options}   newOptions                            		All the binding options that should be set (refer to "Binding Options" documentation for properties).
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	updateBindingOptions: ( elementId: string, newOptions: any ) => PublicApi;

	/**
	 * getBindingOptions().
	 *
	 * Gets the binding options that are assigned to a specific element.
	 *
	 * @public
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID.
	 *
	 * @returns     {Object}                                                The binding options.
	 */
	getBindingOptions: ( elementId: string ) => BindingOptions;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Destroying
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * destroy().
	 *
	 * Reverts an element to its original state (without render attributes).
	 *
	 * @public
	 * @fires       onDestroy
	 *
	 * @param       {string}    elementId                                   The JsonTree.js element ID to destroy.
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	destroy: ( elementId: string ) => PublicApi;

	/**
	 * destroyAll().
	 *
	 * Reverts all rendered elements to their original state (without render attributes).
	 *
	 * @public
	 * @fires       onDestroy
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	destroyAll: () => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * setConfiguration().
	 *
	 * Sets the specific configuration options that should be used.
	 *
	 * @public
	 *
	 * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	setConfiguration: ( newConfiguration: any ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

	/**
	 * getIds().
	 *
	 * Returns an array of element IDs that have been rendered.
	 *
	 * @public
	 *
	 * @returns     {string[]}                                              The element IDs that have been rendered.
	 */
	getIds: () => string[];

	/**
	 * getVersion().
	 *
	 * Returns the version of JsonTree.js.
	 *
	 * @public
	 *
	 * @returns     {string}                                                The version number.
	 */
	getVersion: () => string;
};

declare global {
	interface Window {
		$jsontree: PublicApi;
	}
}