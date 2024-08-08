/*! JsonTree.js v2.5.0 - Nepali | (c) Bunoon 2024 | MIT License */
var __TRANSLATION_OPTIONS = {
    "dayHeaderNames": [
        "सोम",
        "मङ्गल",
        "बुध",
        "बृहस्पति",
        "शुक्र",
        "शनि",
        "सूर्य"
    ],
    "dayNames": [
        "सोमबार",
        "मंगलबार",
        "बुधबार",
        "बिहीबार",
        "शुक्रबार",
        "शनिबार",
        "आइतबार"
    ],
    "dayNamesAbbreviated": [
        "सोम",
        "मङ्गल",
        "बुध",
        "बृहस्पति",
        "शुक्र",
        "शनि",
        "सूर्य"
    ],
    "monthNames": [
        "जनवरी",
        "फेब्रुअरी",
        "मार्च",
        "अप्रिल",
        "सक्छ",
        "जुन",
        "जुलाई",
        "अगस्ट",
        "सेप्टेम्बर",
        "अक्टोबर",
        "नोभेम्बर",
        "डिसेम्बर"
    ],
    "monthNamesAbbreviated": [
        "जनवरी",
        "फेब्रुअरी",
        "मार्च",
        "अप्रिल",
        "सक्छ",
        "जुन",
        "जुलाइ",
        "अगस्ट",
        "सेप्टेम्बर",
        "अक्टोबर",
        "नोभेम्बर",
        "डिसेम्बर"
    ],
    "previousMonthTooltipText": "अघिल्लो महिना",
    "nextMonthTooltipText": "अर्को महिना",
    "previousDayTooltipText": "अघिल्लो दिन",
    "nextDayTooltipText": "अर्को दिन",
    "previousWeekTooltipText": "अघिल्लो हप्ता",
    "nextWeekTooltipText": "अर्को हप्ता",
    "addEventTooltipText": "घटना थप्नुहोस्",
    "closeTooltipText": "बन्द गर्नुहोस्",
    "exportEventsTooltipText": "घटनाहरू निर्यात गर्नुहोस्",
    "todayTooltipText": "आज",
    "refreshTooltipText": "रिफ्रेस गर्नुहोस्",
    "searchTooltipText": "खोज्नुहोस्",
    "expandDayTooltipText": "दिन विस्तार गर्नुहोस्",
    "viewAllEventsTooltipText": "सबै घटनाहरू हेर्नुहोस्",
    "viewFullWeekTooltipText": "पूरा हप्ता हेर्नुहोस्",
    "fromText": "बाट:",
    "toText": "प्रति:",
    "isAllDayText": "दिनभर छ",
    "titleText": "शीर्षक:",
    "descriptionText": "विवरण:",
    "locationText": "स्थान:",
    "addText": "थप्नुहोस्",
    "updateText": "अपडेट गर्नुहोस्",
    "cancelText": "रद्द गर्नुहोस्",
    "removeEventText": "हटाउनुहोस्",
    "addEventTitle": "घटना थप्नुहोस्",
    "editEventTitle": "घटना सम्पादन गर्नुहोस्",
    "exportStartFilename": "निर्यात गरिएका_घटनाहरू_",
    "fromTimeErrorMessage": "कृपया मान्य 'बाट' समय चयन गर्नुहोस्।",
    "toTimeErrorMessage": "कृपया मान्य 'प्रति' समय चयन गर्नुहोस्।",
    "toSmallerThanFromErrorMessage": "कृपया 'बाट' मिति भन्दा ठूलो 'टु' मिति चयन गर्नुहोस्।",
    "titleErrorMessage": "कृपया 'शीर्षक' फिल्डमा मान प्रविष्ट गर्नुहोस् (खाली ठाउँ छैन)।",
    "stText": "",
    "ndText": "",
    "rdText": "",
    "thText": "",
    "yesText": "हो",
    "noText": "छैन",
    "allDayText": "दिनभरि",
    "allEventsText": "सबै घटनाक्रम",
    "toTimeText": "को",
    "confirmEventRemoveTitle": "घटना हटाउने पुष्टि गर्नुहोस्",
    "confirmEventRemoveMessage": "यो घटना हटाउँदा पूर्ववत गर्न सकिँदैन। ",
    "okText": "ठिक छ",
    "exportEventsTitle": "घटनाहरू निर्यात गर्नुहोस्",
    "selectColorsText": "रङहरू चयन गर्नुहोस्",
    "backgroundColorText": "पृष्ठभूमि रंग:",
    "textColorText": "पाठ रङ:",
    "borderColorText": "सीमा रंग:",
    "searchEventsTitle": "खोज घटनाहरू",
    "previousText": "अघिल्लो",
    "nextText": "अर्को",
    "matchCaseText": "मिलान केस",
    "repeatsText": "दोहोर्याउँछ:",
    "repeatDaysToExcludeText": "बहिष्कार गर्न दिनहरू दोहोर्याउनुहोस्:",
    "daysToExcludeText": "बहिष्कार गर्ने दिनहरू:",
    "seriesIgnoreDatesText": "श्रृंखला बेवास्ता मितिहरू:",
    "repeatsNever": "कहिल्यै",
    "repeatsEveryDayText": "हरेक दिन",
    "repeatsEveryWeekText": "हरेक हप्ता",
    "repeatsEvery2WeeksText": "हरेक २ हप्तामा",
    "repeatsEveryMonthText": "हरेक महिना",
    "repeatsEveryYearText": "प्रत्येक बर्ष",
    "repeatsCustomText": "अनुकूलन:",
    "repeatOptionsTitle": "विकल्पहरू दोहोर्याउनुहोस्",
    "moreText": "थप",
    "includeText": "समावेश गर्नुहोस्:",
    "minimizedTooltipText": "घटाउनु",
    "restoreTooltipText": "पुनर्स्थापना गर्नुहोस्",
    "removeAllEventsInSeriesText": "शृङ्खलाका सबै घटनाहरू हटाउनुहोस्",
    "createdText": "सिर्जना गरिएको:",
    "organizerNameText": "आयोजक:",
    "organizerEmailAddressText": "आयोजक इमेल:",
    "enableFullScreenTooltipText": "पूर्ण-स्क्रिन मोड खोल्नुहोस्",
    "disableFullScreenTooltipText": "पूर्ण-स्क्रिन मोड बन्द गर्नुहोस्",
    "idText": "ID:",
    "expandMonthTooltipText": "महिना विस्तार गर्नुहोस्",
    "repeatEndsText": "दोहोरिने अन्त्यहरू:",
    "noEventsAvailableText": "कुनै घटनाहरू उपलब्ध छैनन्।",
    "viewFullWeekText": "पूरा हप्ता हेर्नुहोस्",
    "noEventsAvailableFullText": "हेर्नको लागि कुनै घटनाहरू उपलब्ध छैनन्।",
    "clickText": "क्लिक गर्नुहोस्",
    "hereText": "यहाँ",
    "toAddANewEventText": "नयाँ घटना थप्न।",
    "weekText": "हप्ता",
    "groupText": "समूह:",
    "configurationTooltipText": "कन्फिगरेसन",
    "configurationTitleText": "कन्फिगरेसन",
    "groupsText": "समूहहरू",
    "eventNotificationTitle": "Calendar.js",
    "eventNotificationBody": "घटना '{0}' सुरु भएको छ।",
    "optionsText": "विकल्पहरू:",
    "startsWithText": "बाट सुरु हुन्छ",
    "endsWithText": "संग समाप्त हुन्छ",
    "containsText": "समावेश गर्दछ",
    "displayTabText": "प्रदर्शन",
    "enableAutoRefreshForEventsText": "घटनाहरूको लागि स्वत: रिफ्रेस सक्षम गर्नुहोस्",
    "enableBrowserNotificationsText": "ब्राउजर सूचनाहरू सक्षम गर्नुहोस्",
    "enableTooltipsText": "टूलटिप्स सक्षम गर्नुहोस्",
    "dayText": "दिन",
    "daysText": "दिनहरू",
    "hourText": "घण्टा",
    "hoursText": "घण्टा",
    "minuteText": "मिनेट",
    "minutesText": "मिनेट",
    "enableDragAndDropForEventText": "तान्नुहोस् सक्षम गर्नुहोस्",
    "organizerTabText": "आयोजक",
    "removeEventsTooltipText": "घटनाहरू हटाउनुहोस्",
    "confirmEventsRemoveTitle": "घटनाहरू हटाउने पुष्टि गर्नुहोस्",
    "confirmEventsRemoveMessage": "यी नदोहोरिने घटनाहरूलाई हटाउने कार्यलाई पूर्ववत गर्न सकिँदैन। ",
    "eventText": "घटना",
    "optionalText": "ऐच्छिक",
    "urlText": "Url:",
    "openUrlText": "Url खोल्नुहोस्",
    "thisWeekTooltipText": "यो हप्ता",
    "dailyText": "दैनिक",
    "weeklyText": "साप्ताहिक",
    "monthlyText": "मासिक",
    "yearlyText": "वार्षिक",
    "repeatsByCustomSettingsText": "अनुकूलन सेटिङहरू द्वारा",
    "lastUpdatedText": "पछिल्लो अपडेट:",
    "advancedText": "उन्नत",
    "copyText": "कापी",
    "pasteText": "टाँस्नुहोस्",
    "duplicateText": "नक्कल",
    "showAlertsText": "अलर्टहरू देखाउनुहोस्",
    "selectDatePlaceholderText": "मिति चयन गर्नुहोस्...",
    "hideDayText": "लुकाउने दिन",
    "notSearchText": "होइन (विपरीत)",
    "showHolidaysInTheDisplaysText": "मुख्य प्रदर्शन र शीर्षक पट्टीहरूमा छुट्टिहरू देखाउनुहोस्",
    "newEventDefaultTitle": "* नयाँ घटना",
    "urlErrorMessage": "कृपया 'Url' फिल्डमा मान्य Url प्रविष्ट गर्नुहोस् (वा खाली छोड्नुहोस्)।",
    "searchTextBoxPlaceholder": "शीर्षक, विवरण, आदि खोज्नुहोस्...",
    "currentMonthTooltipText": "हालको महिना",
    "cutText": "काट्नुहोस्",
    "showMenuTooltipText": "मेनु देखाउनुहोस्",
    "eventTypesText": "घटनाका प्रकारहरू",
    "lockedText": "लक गरिएको:",
    "typeText": "प्रकार:",
    "sideMenuHeaderText": "Calendar.js",
    "sideMenuDaysText": "दिनहरू",
    "visibleDaysText": "देखिने दिनहरू",
    "previousYearTooltipText": "अघिल्लो वर्ष",
    "nextYearTooltipText": "आउने साल",
    "showOnlyWorkingDaysText": "काम गर्ने दिनहरू मात्र देखाउनुहोस्",
    "exportFilenamePlaceholderText": "नाम (वैकल्पिक)",
    "errorText": "त्रुटि",
    "exportText": "निर्यात गर्नुहोस्",
    "configurationUpdatedText": "कन्फिगरेसन अपडेट गरियो।",
    "eventAddedText": "{0} घटना थपियो।",
    "eventUpdatedText": "{0} घटना अद्यावधिक गरियो।",
    "eventRemovedText": "{0} घटना हटाइयो।",
    "eventsRemovedText": "{0} घटनाहरू हटाइयो।",
    "eventsExportedToText": "घटनाहरू {0} मा निर्यात गरियो।",
    "eventsPastedText": "{0} घटनाहरू टाँसियो।",
    "eventsExportedText": "घटनाहरू निर्यात गरियो।",
    "copyToClipboardOnlyText": "क्लिपबोर्डमा मात्र प्रतिलिपि गर्नुहोस्",
    "workingDaysText": "काम गर्ने दिनहरू",
    "weekendDaysText": "सप्ताहन्तका दिनहरू",
    "showAsBusyText": "व्यस्त रूपमा देखाउनुहोस्",
    "selectAllText": "सबै छान्नु",
    "selectNoneText": "कुनै पनि चयन गर्नुहोस्",
    "importEventsTooltipText": "घटनाहरू आयात गर्नुहोस्",
    "eventsImportedText": "{0} घटनाहरू आयात गरियो।",
    "viewFullYearTooltipText": "पूरा वर्ष हेर्नुहोस्",
    "currentYearTooltipText": "वर्तमान वर्ष",
    "alertOffsetText": "अलर्ट अफसेट (मिनेट):",
    "viewFullDayTooltipText": "पूरा दिन हेर्नुहोस्",
    "confirmEventUpdateTitle": "घटना अपडेट पुष्टि गर्नुहोस्",
    "confirmEventUpdateMessage": "के तपाईं घटनालाई यस बिन्दुबाट वा सम्पूर्ण शृङ्खलालाई अद्यावधिक गर्न चाहनुहुन्छ?",
    "forwardText": "अगाडि",
    "seriesText": "शृङ्खला",
    "viewTimelineTooltipText": "टाइमलाइन हेर्नुहोस्",
    "nextPropertyTooltipText": "अर्को सम्पत्ति",
    "noneText": "(कुनै पनि)",
    "shareText": "सेयर गर्नुहोस्",
    "shareStartFilename": "साझा_घटनाहरू_",
    "previousPropertyTooltipText": "अघिल्लो सम्पत्ति",
    "jumpToDateTitle": "मिति सम्म जानुहोस्",
    "goText": "जानुहोस्"
};