/**
 * JsonTree.js
 * 
 * A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.
 * 
 * @file        config.ts
 * @version     v4.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type ConfigurationText, type Configuration } from "../type";
import { Default } from "../data/default";
import { Is } from "../data/is";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: any = null ) : Configuration {
            let configuration: Configuration = Default.getObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getBoolean( configuration.safeMode, true );
            configuration.domElementTypes = Default.getStringOrArray( configuration.domElementTypes, [ "*" ] );
    
            configuration = getText( configuration );

            return configuration;
        }
    
        function getText( configuration: Configuration ) : Configuration {
            configuration.text = Default.getObject( configuration.text, {} as ConfigurationText );
            configuration.text!.objectText = Default.getAnyString( configuration.text!.objectText, "object" );
            configuration.text!.arrayText = Default.getAnyString( configuration.text!.arrayText, "array" );
            configuration.text!.mapText = Default.getAnyString( configuration.text!.mapText, "map" );
            configuration.text!.setText = Default.getAnyString( configuration.text!.setText, "set" );
            configuration.text!.htmlText = Default.getAnyString( configuration.text!.htmlText, "html" );
            configuration.text!.closeAllButtonText = Default.getAnyString( configuration.text!.closeAllButtonText, "Close All" );
            configuration.text!.openAllButtonText = Default.getAnyString( configuration.text!.openAllButtonText, "Open All" );
            configuration.text!.copyAllButtonText = Default.getAnyString( configuration.text!.copyAllButtonText, "Copy All" );
            configuration.text!.objectErrorText = Default.getAnyString( configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.text!.attributeNotValidErrorText = Default.getAnyString( configuration.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configuration.text!.attributeNotSetErrorText = Default.getAnyString( configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            configuration.text!.stText = Default.getAnyString( configuration.text!.stText, "st" );
            configuration.text!.ndText = Default.getAnyString( configuration.text!.ndText, "nd" );
            configuration.text!.rdText = Default.getAnyString( configuration.text!.rdText, "rd" );
            configuration.text!.thText = Default.getAnyString( configuration.text!.thText, "th" );
            configuration.text!.ellipsisText = Default.getAnyString( configuration.text!.ellipsisText, "..." );
            configuration.text!.closeAllButtonSymbolText = Default.getAnyString( configuration.text!.closeAllButtonSymbolText, "⇈" );
            configuration.text!.openAllButtonSymbolText = Default.getAnyString( configuration.text!.openAllButtonSymbolText, "⇊" );
            configuration.text!.copyButtonSymbolText = Default.getAnyString( configuration.text!.copyButtonSymbolText, "❐" );
            configuration.text!.backButtonText = Default.getAnyString( configuration.text!.backButtonText, "Back" );
            configuration.text!.nextButtonText = Default.getAnyString( configuration.text!.nextButtonText, "Next" );
            configuration.text!.backButtonSymbolText = Default.getAnyString( configuration.text!.backButtonSymbolText, "←" );
            configuration.text!.nextButtonSymbolText = Default.getAnyString( configuration.text!.nextButtonSymbolText, "→" );
            configuration.text!.noJsonToViewText = Default.getAnyString( configuration.text!.noJsonToViewText, "There is currently no JSON to view." );
            configuration.text!.functionText = Default.getAnyString( configuration.text!.functionText, "function" );
            configuration.text!.sideMenuButtonSymbolText = Default.getAnyString( configuration.text!.sideMenuButtonSymbolText, "☰" );
            configuration.text!.sideMenuButtonText = Default.getAnyString( configuration.text!.sideMenuButtonText, "Show Menu" );
            configuration.text!.closeButtonSymbolText = Default.getAnyString( configuration.text!.closeButtonSymbolText, "✕" );
            configuration.text!.closeButtonText = Default.getAnyString( configuration.text!.closeButtonText, "Close" );
            configuration.text!.showDataTypesText = Default.getAnyString( configuration.text!.showDataTypesText, "Show Data Types" );
            configuration.text!.selectAllText = Default.getAnyString( configuration.text!.selectAllText, "Select All" );
            configuration.text!.selectNoneText = Default.getAnyString( configuration.text!.selectNoneText, "Select None" );
            configuration.text!.importButtonSymbolText = Default.getAnyString( configuration.text!.importButtonSymbolText, "↑" );
            configuration.text!.importButtonText = Default.getAnyString( configuration.text!.importButtonText, "Import" );
            configuration.text!.fullScreenOnButtonSymbolText = Default.getAnyString( configuration.text!.fullScreenOnButtonSymbolText, "↗" );
            configuration.text!.fullScreenOffButtonSymbolText = Default.getAnyString( configuration.text!.fullScreenOffButtonSymbolText, "↙" );
            configuration.text!.fullScreenButtonText = Default.getAnyString( configuration.text!.fullScreenButtonText, "Toggle Full-Screen" );
            configuration.text!.copyButtonText = Default.getAnyString( configuration.text!.copyButtonText, "Copy" );
            configuration.text!.dragAndDropSymbolText = Default.getAnyString( configuration.text!.dragAndDropSymbolText, "⇪" );
            configuration.text!.dragAndDropTitleText = Default.getAnyString( configuration.text!.dragAndDropTitleText, "Drag and drop your JSON files to upload" );
            configuration.text!.dragAndDropDescriptionText = Default.getAnyString( configuration.text!.dragAndDropDescriptionText, "Multiple files will be joined as an array" );
            configuration.text!.exportButtonSymbolText = Default.getAnyString( configuration.text!.exportButtonSymbolText, "↓" );
            configuration.text!.exportButtonText = Default.getAnyString( configuration.text!.exportButtonText, "Export" );
            configuration.text!.propertyColonCharacter = Default.getAnyString( configuration.text!.propertyColonCharacter, ":" );
            configuration.text!.noPropertiesText = Default.getAnyString( configuration.text!.noPropertiesText, "There are no properties to view." );
            configuration.text!.openText = Default.getAnyString( configuration.text!.openText, "open" );
            configuration.text!.openSymbolText = Default.getAnyString( configuration.text!.openSymbolText, "⤤" );
            configuration.text!.waitingText = Default.getAnyString( configuration.text!.waitingText, "Waiting..." );
            configuration.text!.pageOfText = Default.getAnyString( configuration.text!.pageOfText, "Page {0} of {1}" );
            configuration.text!.sizeText = Default.getAnyString( configuration.text!.sizeText, "Size: {0}" );
            configuration.text!.copiedText = Default.getAnyString( configuration.text!.copiedText, "JSON copied to clipboard." );
            configuration.text!.exportedText = Default.getAnyString( configuration.text!.exportedText, "JSON exported." );
            configuration.text!.importedText = Default.getAnyString( configuration.text!.importedText, "{0} JSON files imported." );
            configuration.text!.ignoreDataTypesUpdated = Default.getAnyString( configuration.text!.ignoreDataTypesUpdated, "Ignore data types updated." );
            configuration.text!.lengthText = Default.getAnyString( configuration.text!.lengthText, "Length: {0}" );
            configuration.text!.valueUpdatedText = Default.getAnyString( configuration.text!.valueUpdatedText, "Value updated." );
            configuration.text!.jsonUpdatedText = Default.getAnyString( configuration.text!.jsonUpdatedText, "JSON updated." );
            configuration.text!.nameUpdatedText = Default.getAnyString( configuration.text!.nameUpdatedText, "Property name updated." );
            configuration.text!.indexUpdatedText = Default.getAnyString( configuration.text!.indexUpdatedText, "Array index updated." );
            configuration.text!.itemDeletedText = Default.getAnyString( configuration.text!.itemDeletedText, "Item deleted." );
            configuration.text!.arrayJsonItemDeleted = Default.getAnyString( configuration.text!.arrayJsonItemDeleted, "Array JSON item deleted." );
            configuration.text!.dataTypeText = Default.getAnyString( configuration.text!.dataTypeText, "Data Type: {0}" );
            configuration.text!.editSymbolButtonText = Default.getAnyString( configuration.text!.editSymbolButtonText, "✎" );
            configuration.text!.editButtonText = Default.getAnyString( configuration.text!.editButtonText, "Edit" );
            configuration.text!.moveRightSymbolButtonText = Default.getAnyString( configuration.text!.moveRightSymbolButtonText, "→" );
            configuration.text!.moveRightButtonText = Default.getAnyString( configuration.text!.moveRightButtonText, "Move Right" );
            configuration.text!.moveLeftSymbolButtonText = Default.getAnyString( configuration.text!.moveLeftSymbolButtonText, "←" );
            configuration.text!.moveLeftButtonText = Default.getAnyString( configuration.text!.moveLeftButtonText, "Move Left" );
            configuration.text!.removeSymbolButtonText = Default.getAnyString( configuration.text!.removeSymbolButtonText, "✕" );
            configuration.text!.removeButtonText = Default.getAnyString( configuration.text!.removeButtonText, "Remove" );
            configuration.text!.switchToPagesSymbolText = Default.getAnyString( configuration.text!.switchToPagesSymbolText, "☷" );
            configuration.text!.switchToPagesText = Default.getAnyString( configuration.text!.switchToPagesText, "Switch To Pages" );

            if ( Is.invalidOptionArray( configuration.text!.dayNames, 7 ) ) {
                configuration.text!.dayNames = [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.dayNamesAbbreviated, 7 ) ) {
                configuration.text!.dayNamesAbbreviated = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.monthNames, 12 ) ) {
                configuration.text!.monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ];
            }
    
            if ( Is.invalidOptionArray( configuration.text!.monthNamesAbbreviated, 12 ) ) {
                configuration.text!.monthNamesAbbreviated = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ];
            }

            return configuration;
        }
    }
}