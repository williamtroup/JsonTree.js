/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        type.ts
 * @version     v3.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type ContentPanels = Record<number, boolean>;
export type ContentPanelsForArrayIndex = Record<number, ContentPanels>;

export type StringToJson = {
    parsed: boolean;
    object: any;
};

export type Position = {
    left: number;
    top: number;
};

export type Configuration = {
	safeMode?: boolean;
	domElementTypes?: string[] | string;
	text?: ConfigurationText;
};

export type ConfigurationText = {
	objectText?: string;
	arrayText?: string;
	mapText?: string;
	setText?: string;
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
	closeAllButtonSymbolText?: string;
	openAllButtonSymbolText?: string;
	copyAllButtonSymbolText?: string;
	backButtonText?: string;
	nextButtonText?: string;
	backButtonSymbolText?: string;
	nextButtonSymbolText?: string;
	noJsonToViewText?: string;
	functionText?: string;
	sideMenuButtonSymbolText?: string;
	sideMenuButtonText?: string;
	closeButtonSymbolText?: string;
	closeButtonText?: string;
};

export type BindingOptions = {
    _currentView: BindingOptionsCurrentView;
	data?: any;
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
	showArrayItemsAsSeparateObjects?: boolean;
	copyOnlyCurrentPage?: boolean;
	fileDroppingEnabled?: boolean;
	copyIndentSpaces?: number;
	showArrayIndexBrackets?: boolean;
	showOpeningClosingCurlyBraces?: boolean;
	showOpeningClosingSquaredBrackets?: boolean;
	includeTimeZoneInDateTimeEditing?: boolean;
	shortcutKeysEnabled?: boolean;
	openInFullScreenMode?: boolean;
	enableFullScreenToggling?: boolean;
	valueToolTips?: Record<string, string>;
	editingValueClickDelay?: number;
	showTypes?: boolean;
	allowEditing?: BindingOptionsAllowEditing | boolean | any;
	title?: BindingOptionsTitle;
	ignore?: BindingOptionsIgnore;
	tooltip?: BindingOptionsTooltip;
	parse?: BindingOptionsParse;
	events?: BindingOptionsEvents;
};

export type BindingOptionsCurrentView = {
    element: HTMLElement;
	dataArrayCurrentIndex: number;
	titleBarButtons: HTMLElement;
	tooltip: HTMLElement;
	tooltipTimerId: number;
	valueClickTimerId: number;
	editMode: boolean;
	idSet: boolean;
	contentPanelsOpen: ContentPanelsForArrayIndex;
	contentPanelsIndex: number;
	backButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	disabledBackground: HTMLElement;
	sideMenu: HTMLElement;
	sideMenuChanged: boolean;
};

export type BindingOptionsParse = {
    stringsToDates?: boolean;
	stringsToBooleans?: boolean;
	stringsToNumbers?: boolean;
};

export type BindingOptionsTitle = {
    text?: string;
    show?: boolean;
    showTreeControls?: boolean;
    showCopyButton?: boolean;
	showSideMenu?: boolean;
};

export type BindingOptionsIgnore = {
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
	bigIntValues?: boolean;
	symbolValues?: boolean;
	emptyObjects?: boolean;
	undefinedValues?: boolean;
	guidValues?: boolean;
	colorValues?: boolean;
	regExpValues?: boolean;
	mapValues?: boolean;
	setValues?: boolean;
};

export type BindingOptionsAllowEditing = {
    booleanValues?: boolean;
    decimalValues?: boolean;
    stringValues?: boolean;
    dateValues?: boolean;
    numberValues?: boolean;
	bigIntValues?: boolean;
	guidValues?: boolean;
	colorValues?: boolean;
	propertyNames?: boolean;
};

export type BindingOptionsTooltip = {
    delay?: number;
	offset?: number;
};

export type BindingOptionsEvents = {
    onBeforeRender?: ( element: HTMLElement ) => void;
    onRenderComplete?: ( element: HTMLElement ) => void;
    onValueClick?: ( value: any, type: string ) => void;
    onOpenAll?: ( element: HTMLElement ) => void;
    onCloseAll?: ( element: HTMLElement ) => void;
    onDestroy?: ( element: HTMLElement ) => void;
    onRefresh?: ( element: HTMLElement ) => void;
    onCopyAll?: ( data: string ) => void;
    onBooleanRender?: ( element: HTMLElement ) => void;
    onDateRender?: ( element: HTMLElement ) => void;
    onNumberRender?: ( element: HTMLElement ) => void;
    onDecimalRender?: ( element: HTMLElement ) => void;
    onFunctionRender?: ( element: HTMLElement ) => void;
    onNullRender?: ( element: HTMLElement ) => void;
    onStringRender?: ( element: HTMLElement ) => void;
    onUnknownRender?: ( element: HTMLElement ) => void;
	onBigIntRender?: ( element: HTMLElement ) => void;
	onSymbolRender?: ( element: HTMLElement ) => void;
	onUndefinedRender?: ( element: HTMLElement ) => void;
	onGuidRender?: ( element: HTMLElement ) => void;
	onColorRender?: ( element: HTMLElement ) => void;
	onRegExpRender?: ( element: HTMLElement ) => void;
	onBackPage?: ( element: HTMLElement ) => void;
	onNextPage?: ( element: HTMLElement ) => void;
	onSetJson?: ( element: HTMLElement ) => void;
	onCopyJsonReplacer?: ( key: string, value: any ) => any;
	onJsonEdit?: ( element: HTMLElement ) => void;
};