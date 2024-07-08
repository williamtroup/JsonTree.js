/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.
 * 
 * @file        type.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type Configuration = {
	safeMode?: boolean;
	domElementTypes?: string[] | string;
	objectText?: string;
	arrayText?: string;
	closeAllButtonText?: string;
	openAllButtonText?: string;
	copyAllButtonText?: string;
	objectErrorText?: string;
	attributeNotValidErrorText?: string;
	attributeNotSetErrorText?: string;
	stText?: string;
	ndText?: string;
	rdText?: string;
	thText?: string;
	ellipsisText?: string;
	dayNames?: string[];
	dayNamesAbbreviated?: string[];
	monthNames?: string[];
	monthNamesAbbreviated?: string[];
};

export type BindingOptions = {
    _currentView: CurrentView;
	data?: object;
	showCounts?: boolean;
	useZeroIndexingForArrays?: boolean;
	dateTimeFormat?: string;
	showArrowToggles?: boolean;
	showStringQuotes?: boolean;
	showAllAsClosed?: boolean;
	sortPropertyNames?: boolean;
	sortPropertyNamesInAlphabeticalOrder?: boolean;
	showCommas?: boolean;
	reverseArrayValues?: boolean;
	addArrayIndexPadding?: boolean;
	showValueColors?: boolean;
	maximumDecimalPlaces?: number;
	maximumStringLength?: number;
	showStringHexColors?: boolean;
	title?: Title;
	ignore?: Ignore;
	events?: Events;
};

export type CurrentView = {
    element: HTMLElement;
};

export type Title = {
    text?: string;
    show?: boolean;
    showTreeControls?: boolean;
    showCopyButton?: boolean;
};

export type Ignore = {
    nullValues?: boolean;
    functionValues?: boolean;
    unknownValues?: boolean;
    booleanValues?: boolean;
    decimalValues?: boolean;
    stringValues?: boolean;
    arrayValues?: boolean;
    objectValues?: boolean;
    dateValues?: boolean;
    numberValues?: boolean;
};

export type Events = {
    onBeforeRender?: () => void;
    onRender?: () => void;
    onRenderComplete?: () => void;
    onValueClick?: () => void;
    onOpenAll?: () => void;
    onCloseAll?: () => void;
    onDestroy?: () => void;
    onRefresh?: () => void;
    onCopyAll?: () => void;
    onBooleanRender?: () => void;
    onDateRender?: () => void;
    onNumberRender?: () => void;
    onDecimalRender?: () => void;
    onFunctionRender?: () => void;
    onNullRender?: () => void;
    onStringRender?: () => void;
    onUnknownRender?: () => void;
};