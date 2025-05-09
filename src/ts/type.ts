/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        type.ts
 * @version     v4.7.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2025
 */


export type JsonTreeData = Record<string, BindingOptions>;
export type ContentPanels = Record<number, boolean>;
export type ContentPanelsForArrayIndex = Record<number, ContentPanels>;
export type ControlButtonsOpenStateArrayIndex = Record<number, boolean>;
export type DataTypeCounts = Record<string, number>;

export class ImportedFilename {
	public filename: string = null!;
	public object: any = null!;
};

export type CustomDataType = {
	class: string;
	dataType: string;
	html: string;
	allowEditing: boolean;
};

export type ColumnLayout = {
	column: HTMLElement;
	lineNumbers: HTMLElement;
	lines: HTMLElement;
	controlButtons: HTMLElement;
};

export type FunctionName = {
	name: string;
	isLambda: boolean;
};

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
	htmlText?: string;
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
	copyButtonSymbolText?: string;
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
	showDataTypesText?: string;
	selectAllText?: string;
	selectNoneText?: string;
	importButtonSymbolText?: string;
	importButtonText?: string;
	fullScreenOnButtonSymbolText?: string;
	fullScreenOffButtonSymbolText?: string;
	fullScreenButtonText?: string;
	copyButtonText?: string;
	dragAndDropSymbolText?: string;
	dragAndDropTitleText?: string;
	dragAndDropDescriptionText?: string;
	exportButtonSymbolText?: string;
	exportButtonText?: string;
	propertyColonCharacter?: string;
	noPropertiesText?: string;
	openText?: string;
	openSymbolText?: string;
	waitingText?: string;
	pageOfText?: string;
	sizeText?: string;
	copiedText?: string;
	exportedText?: string;
	importedText?: string;
	ignoreDataTypesUpdated?: string;
	lengthText?: string;
	valueUpdatedText?: string;
	jsonUpdatedText?: string;
	nameUpdatedText?: string;
	indexUpdatedText?: string;
	itemDeletedText?: string;
	arrayJsonItemDeleted?: string;
	dataTypeText?: string;
	editSymbolButtonText?: string;
	editButtonText?: string;
	moveRightSymbolButtonText?: string;
	moveRightButtonText?: string;
	moveLeftSymbolButtonText?: string;
	moveLeftButtonText?: string;
	removeSymbolButtonText?: string;
	removeButtonText?: string;
	switchToPagesSymbolText?: string;
	switchToPagesText?: string;
	clearJsonSymbolText?: string;
	clearJsonText?: string;
	maximumInspectionLevelsReached?: string;
	openCloseSymbolText?: string;
};

export type BindingOptions = {
    _currentView: BindingOptionsCurrentView;
	data?: any;
	id?: string;
	class?: string;
	showObjectSizes?: boolean;
	useZeroIndexingForArrays?: boolean;
	dateTimeFormat?: string;
	showExpandIcons?: boolean;
	showStringQuotes?: boolean;
	showAllAsClosed?: boolean;
	sortPropertyNames?: boolean;
	sortPropertyNamesInAlphabeticalOrder?: boolean;
	showCommas?: boolean;
	reverseArrayValues?: boolean;
	addArrayIndexPadding?: boolean;
	showValueColors?: boolean;
	fileDroppingEnabled?: boolean;
	jsonIndentSpaces?: number;
	showArrayIndexBrackets?: boolean;
	showOpeningClosingCurlyBraces?: boolean;
	showOpeningClosingSquaredBrackets?: boolean;
	includeTimeZoneInDates?: boolean;
	shortcutKeysEnabled?: boolean;
	openInFullScreenMode?: boolean;
	valueToolTips?: Record<string, string>;
	editingValueClickDelay?: number;
	showDataTypes?: boolean;
	logJsonValueToolTipPaths?: boolean;
	exportFilenameFormat?: string;
	showPropertyNameQuotes?: boolean;
	showOpenedObjectArrayBorders?: boolean;
	showPropertyNameAndIndexColors?: boolean;
	showUrlOpenButtons?: boolean;
	showEmailOpenButtons?: boolean;
	minimumArrayIndexPadding?: number;
	arrayIndexPaddingCharacter?: string;
	showCssStylesForHtmlObjects?: boolean;
	jsonPathAny?: string;
	jsonPathSeparator?: string;
	showChildIndexes?: boolean;
	showClosedArraySquaredBrackets?: boolean;
	showClosedObjectCurlyBraces?: boolean;
	convertClickedValuesToString?: boolean;
	rootName?: string;
	emptyStringValue?: string;
	expandIconType?: string;
	openUrlsInSameWindow?: boolean;
	wrapTextInValues?: boolean;
	hideRootObjectNames?: boolean;
	lineNumbers?: BindingOptionsLineNumbers;
	maximum?: BindingOptionsMaximum;
	controlPanel?: BindingOptionsControlPanel;
	paging?: BindingOptionsPaging;
	autoClose?: BindingOptionsAutoClose;
	allowEditing?: BindingOptionsAllowEditing | boolean | any;
	title?: BindingOptionsTitle;
	footer?: BindingOptionsFooter;
	ignore?: BindingOptionsIgnore;
	tooltip?: BindingOptionsTooltip;
	parse?: BindingOptionsParse;
	sideMenu?: BindingOptionsSideMenu;
	events?: BindingOptionsEvents;
};

export type BindingOptionsCurrentView = {
    element: HTMLElement;
	titleBarButtons: HTMLElement;
	tooltip: HTMLElement;
	tooltipTimerId: number;
	valueClickTimerId: number;
	editMode: boolean;
	idSet: boolean;
	controlButtonsOpen: ControlButtonsOpenStateArrayIndex;
	contentPanelsOpen: ContentPanelsForArrayIndex;
	contentPanelsIndex: number;
	contentPanelsDataIndex: number;
	backPageButton: HTMLButtonElement;
	nextPageButton: HTMLButtonElement;
	disabledBackground: HTMLElement;
	sideMenu: HTMLElement;
	sideMenuChanged: boolean;
	toggleFullScreenButton: HTMLButtonElement;
	fullScreenOn: boolean;
	dragAndDropBackground: HTMLElement;
	initialized: boolean;
	currentContentColumns: ColumnLayout[];
	footer: HTMLElement;
	footerStatusText: HTMLElement;
	footerDataTypeText: HTMLElement;
	footerLengthText: HTMLElement;
	footerSizeText: HTMLElement;
	footerPageText: HTMLElement;
	footerStatusTextTimerId: number;
	columnDragging: boolean;
	columnDraggingDataIndex: number;
	dataTypeCounts: DataTypeCounts;
	contextMenu: HTMLElement;
	currentDataArrayPageIndex: number;
	currentColumnBuildingIndex: number;
	selectedValues: any[];
};

export type BindingOptionsMaximum = {
	decimalPlaces?: number;
	stringLength?: number;
	urlLength?: number;
	emailLength?: number;
	numberLength?: number;
	bigIntLength?: number;
	inspectionLevels?: number;
	propertyNameLength?: number;
	functionLength?: number;
	lambdaLength?: number;
};

export type BindingOptionsPaging = {
	enabled?: boolean;
	columnsPerPage?: number;
	startPage?: number;
	synchronizeScrolling?: boolean;
	allowColumnReordering?: boolean;
	allowComparisons?: boolean;
};

export type BindingOptionsParse = {
    stringsToDates?: boolean;
	stringsToBooleans?: boolean;
	stringsToNumbers?: boolean;
	stringsToSymbols?: boolean;
	stringsToFloats?: boolean;
	stringsToBigInts?: boolean;
};

export type BindingOptionsTitle = {
    text?: string;
    showCloseOpenAllButtons?: boolean;
    showCopyButton?: boolean;
	enableFullScreenToggling?: boolean;
	showFullScreenButton?: boolean;
};

export type BindingOptionsFooter = {
    enabled?: boolean;
	showDataTypes?: boolean;
	showLengths?: boolean;
	showSizes?: boolean;
	showPageOf?: boolean;
	statusResetDelay?: number;
};

export type BindingOptionsControlPanel = {
	enabled?: boolean;
	showCopyButton?: boolean;
	showMovingButtons?: boolean;
	showRemoveButton?: boolean;
	showEditButton?: boolean;
	showCloseOpenAllButtons?: boolean;
	showSwitchToPagesButton?: boolean;
	showImportButton?: boolean;
	showExportButton?: boolean;
	showOpenCloseButton?: boolean;
};

export type BindingOptionsLineNumbers = {
    enabled?: boolean;
	padNumbers?: boolean;
	addDots?: boolean;
};

export type BindingOptionsIgnore = {
    nullValues?: boolean;
    functionValues?: boolean;
    unknownValues?: boolean;
    booleanValues?: boolean;
    floatValues?: boolean;
    stringValues?: boolean;
    arrayValues?: boolean;
    objectValues?: boolean;
    dateValues?: boolean;
    numberValues?: boolean;
	bigintValues?: boolean;
	symbolValues?: boolean;
	emptyObjects?: boolean;
	undefinedValues?: boolean;
	guidValues?: boolean;
	colorValues?: boolean;
	regexpValues?: boolean;
	mapValues?: boolean;
	setValues?: boolean;
	urlValues?: boolean;
	imageValues?: boolean;
	emailValues?: boolean;
	htmlValues?: boolean;
	lambdaValues?: boolean;
};

export type BindingOptionsAllowEditing = {
    booleanValues?: boolean;
    floatValues?: boolean;
    stringValues?: boolean;
    dateValues?: boolean;
    numberValues?: boolean;
	bigIntValues?: boolean;
	guidValues?: boolean;
	colorValues?: boolean;
	urlValues?: boolean;
	emailValues?: boolean;
	regExpValues?: boolean;
	symbolValues?: boolean;
	imageValues?: boolean;
	propertyNames?: boolean;
	bulk?: boolean;
};

export type BindingOptionsTooltip = {
    delay?: number;
	offset?: number;
};

export type BindingOptionsSideMenu = {
    enabled?: boolean;
	showImportButton?: boolean;
	showExportButton?: boolean;
	titleText?: string;
	showAvailableDataTypeCounts?: boolean;
	showOnlyDataTypesAvailable?: boolean;
	showClearJsonButton?: boolean;
	updateDisplayDelay?: number;
};

export type BindingOptionsAutoClose = {
	objectSize?: number;
	arraySize?: number;
	mapSize?: number;
	setSize?: number;
	htmlSize?: number;
};

export type BindingOptionsEvents = {
    onBeforeRender?: ( jsonTreeElement: HTMLElement ) => void;
    onRenderComplete?: ( jsonTreeElement: HTMLElement ) => void;
    onValueClick?: ( jsonTreeElement: HTMLElement, value: any, type: string ) => void;
    onOpenAll?: ( jsonTreeElement: HTMLElement ) => void;
    onCloseAll?: ( jsonTreeElement: HTMLElement ) => void;
    onDestroy?: ( jsonTreeElement: HTMLElement ) => void;
    onRefresh?: ( jsonTreeElement: HTMLElement ) => void;
    onCopyAll?: ( jsonTreeElement: HTMLElement, data: string ) => void;
    onBooleanRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onDateRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onNumberRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onFloatRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onFunctionRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onNullRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onStringRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
    onUnknownRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onBigIntRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onSymbolRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onUndefinedRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onGuidRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onColorRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onRegExpRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onUrlRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onImageRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onEmailRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onLambdaRender?: ( jsonTreeElement: HTMLElement, valueElement: HTMLElement ) => void;
	onBackPage?: ( jsonTreeElement: HTMLElement ) => void;
	onNextPage?: ( jsonTreeElement: HTMLElement ) => void;
	onSetJson?: ( jsonTreeElement: HTMLElement ) => void;
	onJsonEdit?: ( jsonTreeElement: HTMLElement ) => void;
	onExport?: ( jsonTreeElement: HTMLElement ) => void;
	onCopy?: ( jsonTreeElement: HTMLElement, data: string ) => void;
	onFullScreenChange?: ( jsonTreeElement: HTMLElement, enabled: boolean ) => void;
	onCopyJsonReplacer?: ( key: string, value: any ) => any;
	onSelectionChange?: ( jsonTreeElement: HTMLElement ) => void;
	onCustomDataTypeRender?: ( jsonTreeElement: HTMLElement, value: any ) => CustomDataType | boolean;
};