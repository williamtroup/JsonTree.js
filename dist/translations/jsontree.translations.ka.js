/*! JsonTree.js v2.5.0 - Georgian | (c) Bunoon 2024 | MIT License */
var __TRANSLATION_OPTIONS = {
    "dayHeaderNames": [
        "ორშაბათი",
        "სამ",
        "ოთხ",
        "ხუთ",
        "პარასკევი",
        "სატ",
        "მზე"
    ],
    "dayNames": [
        "ორშაბათი",
        "სამშაბათი",
        "ოთხშაბათი",
        "ხუთშაბათი",
        "პარასკევი",
        "შაბათი",
        "კვირა"
    ],
    "dayNamesAbbreviated": [
        "ორშაბათი",
        "სამ",
        "ოთხ",
        "ხუთ",
        "პარასკევი",
        "სატ",
        "მზე"
    ],
    "monthNames": [
        "იანვარი",
        "თებერვალი",
        "მარტი",
        "აპრილი",
        "მაისი",
        "ივნისი",
        "ივლისი",
        "აგვისტო",
        "სექტემბერი",
        "ოქტომბერი",
        "ნოემბერი",
        "დეკემბერი"
    ],
    "monthNamesAbbreviated": [
        "იან",
        "თებ",
        "მარ",
        "აპრ",
        "მაისი",
        "ივნ",
        "ივლისი",
        "აგვ",
        "სექ",
        "ოქტ",
        "ნოემ",
        "დეკ"
    ],
    "previousMonthTooltipText": "Გასული თვე",
    "nextMonthTooltipText": "Შემდეგი თვე",
    "previousDayTooltipText": "Წინა დღე",
    "nextDayTooltipText": "Შემდეგი დღე",
    "previousWeekTooltipText": "Წინა კვირა",
    "nextWeekTooltipText": "Შემდეგი კვირა",
    "addEventTooltipText": "ღონისძიების დამატება",
    "closeTooltipText": "დახურვა",
    "exportEventsTooltipText": "მოვლენების ექსპორტი",
    "todayTooltipText": "დღეს",
    "refreshTooltipText": "განაახლეთ",
    "searchTooltipText": "ძიება",
    "expandDayTooltipText": "გაფართოების დღე",
    "viewAllEventsTooltipText": "ყველა მოვლენის ნახვა",
    "viewFullWeekTooltipText": "სრული კვირის ნახვა",
    "fromText": "მდებარეობა:",
    "toText": "მიმართ:",
    "isAllDayText": "მთელი დღეა",
    "titleText": "სათაური:",
    "descriptionText": "აღწერა:",
    "locationText": "მდებარეობა:",
    "addText": "დამატება",
    "updateText": "განახლება",
    "cancelText": "გაუქმება",
    "removeEventText": "ამოღება",
    "addEventTitle": "ღონისძიების დამატება",
    "editEventTitle": "მოვლენის რედაქტირება",
    "exportStartFilename": "ექსპორტირებული_მოვლენები_",
    "fromTimeErrorMessage": "გთხოვთ, აირჩიოთ სწორი დრო \"From\".",
    "toTimeErrorMessage": "გთხოვთ, აირჩიოთ სწორი დრო.",
    "toSmallerThanFromErrorMessage": "გთხოვთ, აირჩიოთ თარიღი \"დასასრულამდე\", რომელიც აღემატება \"From\" თარიღს.",
    "titleErrorMessage": "გთხოვთ, შეიყვანოთ მნიშვნელობა ველში „სათაური“ (ცარიელი ადგილის გარეშე).",
    "stText": "",
    "ndText": "",
    "rdText": "",
    "thText": "",
    "yesText": "დიახ",
    "noText": "არა",
    "allDayText": "Მთელი დღე",
    "allEventsText": "ყველა ღონისძიება",
    "toTimeText": "რომ",
    "confirmEventRemoveTitle": "დაადასტურეთ მოვლენის წაშლა",
    "confirmEventRemoveMessage": "ამ მოვლენის წაშლის გაუქმება შეუძლებელია. ",
    "okText": "კარგი",
    "exportEventsTitle": "მოვლენების ექსპორტი",
    "selectColorsText": "აირჩიეთ ფერები",
    "backgroundColorText": "Ფონის ფერი:",
    "textColorText": "ტექსტის ფერი:",
    "borderColorText": "საზღვრის ფერი:",
    "searchEventsTitle": "მოძებნეთ მოვლენები",
    "previousText": "წინა",
    "nextText": "შემდეგი",
    "matchCaseText": "მატჩის საქმე",
    "repeatsText": "იმეორებს:",
    "repeatDaysToExcludeText": "გაიმეორეთ დღეები გამორიცხვის მიზნით:",
    "daysToExcludeText": "გამორიცხვის დღეები:",
    "seriesIgnoreDatesText": "სერიების უგულებელყოფის თარიღები:",
    "repeatsNever": "არასოდეს",
    "repeatsEveryDayText": "Ყოველ დღე",
    "repeatsEveryWeekText": "Ყოველ კვირა",
    "repeatsEvery2WeeksText": "ყოველ 2 კვირაში",
    "repeatsEveryMonthText": "Ყოველ თვე",
    "repeatsEveryYearText": "Ყოველ წელს",
    "repeatsCustomText": "მორგებული:",
    "repeatOptionsTitle": "გამეორების პარამეტრები",
    "moreText": "მეტი",
    "includeText": "მოიცავს:",
    "minimizedTooltipText": "მინიმიზაცია",
    "restoreTooltipText": "აღდგენა",
    "removeAllEventsInSeriesText": "სერიების ყველა მოვლენის წაშლა",
    "createdText": "შექმნილია:",
    "organizerNameText": "ორგანიზატორი:",
    "organizerEmailAddressText": "ორგანიზატორის ელ.ფოსტა:",
    "enableFullScreenTooltipText": "ჩართეთ სრული ეკრანის რეჟიმი",
    "disableFullScreenTooltipText": "გამორთეთ სრული ეკრანის რეჟიმი",
    "idText": "ID:",
    "expandMonthTooltipText": "გააფართოვეთ თვე",
    "repeatEndsText": "განმეორებითი დასრულება:",
    "noEventsAvailableText": "ღონისძიებები არ არის ხელმისაწვდომი.",
    "viewFullWeekText": "სრული კვირის ნახვა",
    "noEventsAvailableFullText": "არ არის ხელმისაწვდომი ღონისძიებები სანახავად.",
    "clickText": "დააწკაპუნეთ",
    "hereText": "აქ",
    "toAddANewEventText": "ახალი მოვლენის დასამატებლად.",
    "weekText": "კვირა",
    "groupText": "ჯგუფი:",
    "configurationTooltipText": "კონფიგურაცია",
    "configurationTitleText": "კონფიგურაცია",
    "groupsText": "ჯგუფები",
    "eventNotificationTitle": "Calendar.js",
    "eventNotificationBody": "ღონისძიება „{0}“ დაიწყო.",
    "optionsText": "Პარამეტრები:",
    "startsWithText": "Იწყება",
    "endsWithText": "მთავრდება",
    "containsText": "შეიცავს",
    "displayTabText": "ჩვენება",
    "enableAutoRefreshForEventsText": "ჩართეთ ავტომატური განახლება მოვლენებისთვის",
    "enableBrowserNotificationsText": "ბრაუზერის შეტყობინებების ჩართვა",
    "enableTooltipsText": "ინსტრუმენტების რჩევების ჩართვა",
    "dayText": "დღეს",
    "daysText": "დღეები",
    "hourText": "საათი",
    "hoursText": "საათები",
    "minuteText": "წუთი",
    "minutesText": "წუთები",
    "enableDragAndDropForEventText": "ჩათრევის ჩართვა",
    "organizerTabText": "ორგანიზატორი",
    "removeEventsTooltipText": "მოვლენების წაშლა",
    "confirmEventsRemoveTitle": "დაადასტურეთ მოვლენების წაშლა",
    "confirmEventsRemoveMessage": "ამ არაგანმეორებადი მოვლენების წაშლის გაუქმება შეუძლებელია. ",
    "eventText": "ღონისძიება",
    "optionalText": "სურვილისამებრ",
    "urlText": "URL:",
    "openUrlText": "გახსენით Url",
    "thisWeekTooltipText": "Ამ კვირაში",
    "dailyText": "ყოველდღიური",
    "weeklyText": "ყოველკვირეული",
    "monthlyText": "ყოველთვიური",
    "yearlyText": "ყოველწლიურად",
    "repeatsByCustomSettingsText": "მორგებული პარამეტრებით",
    "lastUpdatedText": "ბოლო განახლება:",
    "advancedText": "Მოწინავე",
    "copyText": "კოპირება",
    "pasteText": "პასტა",
    "duplicateText": "დუბლიკატი",
    "showAlertsText": "გაფრთხილებების ჩვენება",
    "selectDatePlaceholderText": "აირჩიეთ თარიღი...",
    "hideDayText": "დამალვა დღე",
    "notSearchText": "არა (საპირისპირო)",
    "showHolidaysInTheDisplaysText": "არდადეგების ჩვენება მთავარ ეკრანზე და სათაურის ზოლებზე",
    "newEventDefaultTitle": "* ახალი მოვლენა",
    "urlErrorMessage": "გთხოვთ, შეიყვანოთ სწორი URL ველში \"Url\" (ან დატოვეთ ცარიელი).",
    "searchTextBoxPlaceholder": "მოძებნეთ სათაური, აღწერა და ა.შ.",
    "currentMonthTooltipText": "Მიმდინარე თვე",
    "cutText": "გაჭრა",
    "showMenuTooltipText": "მენიუს ჩვენება",
    "eventTypesText": "ღონისძიების ტიპები",
    "lockedText": "ჩაკეტილი:",
    "typeText": "ტიპი:",
    "sideMenuHeaderText": "Calendar.js",
    "sideMenuDaysText": "დღეები",
    "visibleDaysText": "ხილული დღეები",
    "previousYearTooltipText": "წინა წელი",
    "nextYearTooltipText": "Მომავალ წელს",
    "showOnlyWorkingDaysText": "მხოლოდ სამუშაო დღეების ჩვენება",
    "exportFilenamePlaceholderText": "სახელი (სურვილისამებრ)",
    "errorText": "შეცდომა",
    "exportText": "ექსპორტი",
    "configurationUpdatedText": "კონფიგურაცია განახლებულია.",
    "eventAddedText": "დამატებულია {0} ღონისძიება.",
    "eventUpdatedText": "{0} ღონისძიება განახლდა.",
    "eventRemovedText": "{0} ღონისძიება წაიშალა.",
    "eventsRemovedText": "{0} ღონისძიება წაიშალა.",
    "eventsExportedToText": "მოვლენები ექსპორტირებულია {0}-ში.",
    "eventsPastedText": "ჩასმულია {0} მოვლენა.",
    "eventsExportedText": "მოვლენები ექსპორტირებულია.",
    "copyToClipboardOnlyText": "კოპირება მხოლოდ ბუფერში",
    "workingDaysText": "Სამუშაო დღეები",
    "weekendDaysText": "შაბათ-კვირის დღეები",
    "showAsBusyText": "აჩვენე როგორც დაკავებული",
    "selectAllText": "Მონიშნე ყველა",
    "selectNoneText": "აირჩიეთ არცერთი",
    "importEventsTooltipText": "მოვლენების იმპორტი",
    "eventsImportedText": "იმპორტირებულია {0} მოვლენა.",
    "viewFullYearTooltipText": "მთელი წლის ნახვა",
    "currentYearTooltipText": "მიმდინარე წელი",
    "alertOffsetText": "გაფრთხილების ოფსეტი (წუთები):",
    "viewFullDayTooltipText": "მთელი დღის ნახვა",
    "confirmEventUpdateTitle": "დაადასტურეთ ღონისძიების განახლება",
    "confirmEventUpdateMessage": "გსურთ განაახლოთ ღონისძიება ამ მომენტიდან მოყოლებული, თუ მთელი სერია?",
    "forwardText": "წინ",
    "seriesText": "სერიალი",
    "viewTimelineTooltipText": "ქრონოლოგიის ნახვა",
    "nextPropertyTooltipText": "შემდეგი საკუთრება",
    "noneText": "(არცერთი)",
    "shareText": "გააზიარეთ",
    "shareStartFilename": "გაზიარებული_მოვლენები_",
    "previousPropertyTooltipText": "წინა საკუთრება",
    "jumpToDateTitle": "თარიღზე გადასვლა",
    "goText": "წადი"
};