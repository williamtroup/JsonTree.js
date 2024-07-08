/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        api.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "./type";


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Manage Instances
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
	refresh: ( elementId: string ) => void;

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
	refreshAll: () => void;

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
	render: ( element: HTMLElement, options: Object ) => void;

	/**
	 * renderAll().
	 *
	 * Finds all new elements and renders them.
	 *
	 * @public
	 *
	 * @returns     {Object}                                                The JsonTree.js class instance.
	 */
	renderAll: () => void;

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
	openAll: ( elementId?: string ) => void;

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
	closeAll: ( elementId?: string ) => void;

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Destroying
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
	destroy: ( elementId: string ) => void;

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
	destroyAll: () => void;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
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
	setConfiguration: ( config: Configuration ) => void;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
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
