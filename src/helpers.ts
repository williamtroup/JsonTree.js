import { type BindingOptions, type Configuration, STRING } from "./types";

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * String Handling
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

export function newGuid() {
	const result = [];

	for (let charIndex = 0; charIndex < 32; charIndex++) {
		if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
			result.push("-");
		}

		const character = Math.floor(Math.random() * 16).toString(16);
		result.push(character);
	}

	return result.join(STRING.empty);
}

export function padNumber(number: number | string, length = 1) {
	let numberString = number.toString(),
		numberResult = numberString;

	if (numberString.length < length) {
		const arrayLength = length - numberString.length + 1;

		numberResult = Array(arrayLength).join("0") + numberString;
	}

	return numberResult;
}

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Date/Time
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

export function getWeekdayNumber(date: Date) {
	return date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
}

export function getDayOrdinal(value: number, configuration: Configuration) {
	let result = configuration.thText;

	if (value === 31 || value === 21 || value === 1) {
		result = configuration.stText;
	} else if (value === 22 || value === 2) {
		result = configuration.ndText;
	} else if (value === 23 || value === 3) {
		result = configuration.rdText;
	}

	return result;
}

export function getCustomFormattedDateTimeText(date: Date, dateFormat: string, configuration: Configuration) {
	let result = dateFormat;
	const weekDayNumber = getWeekdayNumber(date);

	result = result.replace("{hh}", padNumber(date.getHours(), 2));
	result = result.replace("{h}", date.getHours().toString());

	result = result.replace("{MM}", padNumber(date.getMinutes(), 2));
	result = result.replace("{M}", date.getMinutes().toString());

	result = result.replace("{ss}", padNumber(date.getSeconds(), 2));
	result = result.replace("{s}", date.getSeconds().toString());

	result = result.replace("{dddd}", configuration.dayNames[weekDayNumber]);
	result = result.replace("{ddd}", configuration.dayNamesAbbreviated[weekDayNumber]);
	result = result.replace("{dd}", padNumber(date.getDate()));
	result = result.replace("{d}", date.getDate().toString());

	result = result.replace("{o}", getDayOrdinal(date.getDate(), configuration));

	result = result.replace("{mmmm}", configuration.monthNames[date.getMonth()]);
	result = result.replace("{mmm}", configuration.monthNamesAbbreviated[date.getMonth()]);
	result = result.replace("{mm}", padNumber(date.getMonth() + 1));
	result = result.replace("{m}", (date.getMonth() + 1).toString());

	result = result.replace("{yyyy}", date.getFullYear().toString());
	result = result.replace("{yyy}", date.getFullYear().toString().substring(1));
	result = result.replace("{yy}", date.getFullYear().toString().substring(2));
	result = result.replace("{y}", Number.parseInt(date.getFullYear().toString().substring(2)).toString());

	return result;
}

// --------------------

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Default Parameter/Option Handling
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

export function isDefined(value: any) {
	return value !== null && value !== undefined && value !== STRING.empty;
}

export function isDefinedObject(object: any): object is Object {
	return isDefined(object) && typeof object === "object";
}

export function isDefinedBoolean(object: any): object is boolean {
	return isDefined(object) && typeof object === "boolean";
}

export function isDefinedString(object: any): object is string {
	return isDefined(object) && typeof object === "string";
}

export function isDefinedFunction(object: any): object is Function {
	return isDefined(object) && typeof object === "function";
}

export function isDefinedNumber(object: any): object is number {
	return isDefined(object) && typeof object === "number";
}

export function isDefinedArray(object: any): object is any[] {
	return Array.isArray(object);
}

export function isDefinedDate(object: any): object is Date {
	return isDefinedObject(object) && object instanceof Date;
}

export function isDefinedDecimal(object: any): object is number {
	return isDefined(object) && typeof object === "number" && object % 1 !== 0;
}

export function isInvalidOptionArray(array: any, minimumLength = 1) {
	return !isDefinedArray(array) || array.length < minimumLength;
}

export function getDefaultAnyString(value: any, defaultValue: string) {
	return typeof value === "string" ? value : defaultValue;
}

export function getDefaultString(value: any, defaultValue: string) {
	return isDefinedString(value) ? value : defaultValue;
}

export function getDefaultBoolean(value: any, defaultValue: boolean) {
	return isDefinedBoolean(value) ? value : defaultValue;
}

export function getDefaultNumber(value: any, defaultValue: number) {
	return isDefinedNumber(value) ? value : defaultValue;
}

export function getDefaultFunction(value: any, defaultValue: Function | null): Function | null {
	return isDefinedFunction(value) ? value : defaultValue;
}

export function getDefaultArray(value: any, defaultValue: any[]) {
	return isDefinedArray(value) ? value : defaultValue;
}

export function getDefaultObject(value: any, defaultValue: Object | null) {
	return isDefinedObject(value) ? value : defaultValue;
}

export function getDefaultStringOrArray(value: any, defaultValue: any[]): any[] {
	if (isDefinedString(value)) {
		value = value.split(STRING.space);

		if (value.length === 0) {
			value = defaultValue;
		}
	} else {
		value = getDefaultArray(value, defaultValue);
	}

	return value;
}

export function getObjectFromString(objectString: string, configuration: Configuration) {
	let parsed = true,
		result = null;

	try {
		if (isDefinedString(objectString)) {
			result = JSON.parse(objectString);
		}
	} catch (e1: any) {
		try {
			result = eval("(" + objectString + ")");

			if (isDefinedFunction(result)) {
				result = result();
			}
		} catch (e2: any) {
			if (!configuration.safeMode) {
				console.error(
					configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e2.message),
				);
				parsed = false;
			}

			result = null;
		}
	}

	return {
		parsed: parsed,
		result: result,
	};
}

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Element Handling
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

export function createElement(
	container: HTMLElement,
	type: string,
	className?: string,
	beforeNode: Node | null = null,
) {
	const nodeType = type.toLowerCase(),
		isText = nodeType === "text";
	const result = (isText ? document.createTextNode(STRING.empty) : document.createElement(nodeType)) as HTMLElement;

	if (className) {
		result.className = className;
	}

	if (isDefined(beforeNode)) {
		container.insertBefore(result, beforeNode);
	} else {
		container.appendChild(result);
	}

	return result;
}

export function createElementWithHTML(
	container: HTMLElement,
	type: string,
	className: string,
	html: string | boolean | number,
	beforeNode?: HTMLElement,
) {
	const element = createElement(container, type, className, beforeNode);
	element.innerHTML = String(html);

	return element;
}

export function addClass(element: HTMLElement, className: string) {
	element.classList.add(className);
}

export function getFunctionName(value: any) {
	let result,
		valueParts = value.toString().split("("),
		valueNameParts = valueParts[0].split(STRING.space);

	if (valueNameParts.length === 2) {
		result = valueNameParts[1];
	} else {
		result = valueNameParts[0];
	}

	result += "()";

	return result;
}

export function createComma(bindingOptions: BindingOptions, objectTypeValue: HTMLElement, isLastItem: boolean) {
	if (bindingOptions.showCommas && !isLastItem) {
		createElementWithHTML(objectTypeValue, "span", "comma", ",");
	}
}

export function getIndexName(bindingOptions: BindingOptions, index: number, largestValue: number) {
	let result = bindingOptions.useZeroIndexingForArrays ? index.toString() : (index + 1).toString();

	if (!bindingOptions.addArrayIndexPadding) {
		result = padNumber(result, largestValue.toString().length);
	}

	return result;
}

export function getFixedValue(value: number, length: number): string {
	const regExp = new RegExp("^-?\\d+(?:.\\d{0," + (length || -1) + "})?");

	return value.toString().match(regExp)?.[0] || "";
}

export function isHexColor(value: string) {
	let valid = value.length >= 2 && value.length <= 7;

	if (valid && value[0] === "#") {
		valid = isNaN(+value.substring(1, value.length - 1));
	}

	return valid;
}
