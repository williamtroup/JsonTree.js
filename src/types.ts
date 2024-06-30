export enum STRING {
	empty = "",
	space = " ",
}

export type PublicApi = {
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
	render: (element: HTMLElement, options: Object) => void;
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
	openAll: (elementId?: string) => void;
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
	closeAll: (elementId?: string) => void;
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
	destroy: (elementId: string) => void;
	destroyElement: (options: BindingOptions) => void;
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
	refresh: (elementId: string) => void;
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
	setConfiguration: (config: Configuration) => void;

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
};

export type Configuration = {
	safeMode: boolean;
	domElementTypes: string[];
	objectText: string;
	arrayText: string;
	closeAllButtonText: string;
	openAllButtonText: string;
	copyAllButtonText: string;
	objectErrorText: string;
	attributeNotValidErrorText: string;
	attributeNotSetErrorText: string;
	stText: string;
	ndText: string;
	rdText: string;
	thText: string;
	ellipsisText: string;
	dayNames: string[];
	dayNamesAbbreviated: string[];
	monthNames: string[];
	monthNamesAbbreviated: string[];
};

export type BindingOptions = {
	data: Object | null;
	showCounts: boolean;
	useZeroIndexingForArrays: boolean;
	dateTimeFormat: string;
	showArrowToggles: boolean;
	showStringQuotes: boolean;
	showAllAsClosed: boolean;
	sortPropertyNames: boolean;
	sortPropertyNamesInAlphabeticalOrder: boolean;
	showCommas: boolean;
	reverseArrayValues: boolean;
	addArrayIndexPadding: boolean;
	showValueColors: boolean;
	maximumDecimalPlaces: number;
	maximumStringLength: number;
	showStringHexColors: boolean;
	title: {
		text: string;
		show: boolean;
		showTreeControls: boolean;
		showCopyButton: boolean;
	};
	ignore: {
		nullValues: boolean;
		functionValues: boolean;
		unknownValues: boolean;
		booleanValues: boolean;
		decimalValues: boolean;
		stringValues: boolean;
		arrayValues: boolean;
		objectValues: boolean;
		dateValues: boolean;
		numberValues: boolean;
	};

	events: {
		onBeforeRender: Function | null;
		onRender: Function | null;
		onRenderComplete: Function | null;
		onValueClick: Function | null;
		onOpenAll: Function | null;
		onCloseAll: Function | null;
		onDestroy: Function | null;
		onRefresh: Function | null;
		onCopyAll: Function | null;
		onBooleanRender: Function | null;
		onDateRender: Function | null;
		onNumberRender: Function | null;
		onDecimalRender: Function | null;
		onFunctionRender: Function | null;
		onNullRender: Function | null;
		onStringRender: Function | null;
		onUnknownRender: Function | null;
	};
	currentView: {
		element: HTMLElement;
	};
};

declare global {
	interface Window {
		$jsontree: PublicApi;
	}
}
