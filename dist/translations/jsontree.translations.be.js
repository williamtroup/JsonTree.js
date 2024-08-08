/*! JsonTree.js v2.5.0 - Belarusian | (c) Bunoon 2024 | MIT License */
var __TRANSLATION_OPTIONS = {
    "dayHeaderNames": [
        "Пн",
        "аўт",
        "ср",
        "чц",
        "пт",
        "сб",
        "Сонца"
    ],
    "dayNames": [
        "панядзелак",
        "аўторак",
        "серада",
        "чацвер",
        "Пятніца",
        "субота",
        "Нядзеля"
    ],
    "dayNamesAbbreviated": [
        "Пн",
        "аўт",
        "ср",
        "чц",
        "пт",
        "сб",
        "Сонца"
    ],
    "monthNames": [
        "Студзень",
        "люты",
        "сакавік",
        "Красавік",
        "мая",
        "Чэрвень",
        "ліпень",
        "жнівень",
        "верасень",
        "кастрычніка",
        "лістапад",
        "Снежань"
    ],
    "monthNamesAbbreviated": [
        "Ян",
        "люты",
        "сак",
        "крас",
        "мая",
        "чэрв",
        "ліп",
        "Жнівень",
        "вер",
        "Кастрычнік",
        "лістапада",
        "снежань"
    ],
    "previousMonthTooltipText": "Папярэдні месяц",
    "nextMonthTooltipText": "Наступны месяц",
    "previousDayTooltipText": "Папярэдні дзень",
    "nextDayTooltipText": "Наступны дзень",
    "previousWeekTooltipText": "Папярэдні тыдзень",
    "nextWeekTooltipText": "Наступны тыдзень",
    "addEventTooltipText": "Дадаць падзею",
    "closeTooltipText": "Блізка",
    "exportEventsTooltipText": "Экспартныя падзеі",
    "todayTooltipText": "сёння",
    "refreshTooltipText": "Абнавіць",
    "searchTooltipText": "Пошук",
    "expandDayTooltipText": "Дзень разгортвання",
    "viewAllEventsTooltipText": "Прагледзець усе падзеі",
    "viewFullWeekTooltipText": "Прагледзець увесь тыдзень",
    "fromText": "ад:",
    "toText": "каму:",
    "isAllDayText": "З'яўляецца ўвесь дзень",
    "titleText": "Назва:",
    "descriptionText": "Апісанне:",
    "locationText": "Размяшчэнне:",
    "addText": "Дадаць",
    "updateText": "Абнаўленне",
    "cancelText": "Адмяніць",
    "removeEventText": "Выдаліць",
    "addEventTitle": "Дадаць падзею",
    "editEventTitle": "Рэдагаваць падзею",
    "exportStartFilename": "экспартаваныя_падзеі_",
    "fromTimeErrorMessage": "Калі ласка, абярыце сапраўдны час \"Ад\".",
    "toTimeErrorMessage": "Выберыце сапраўдны час \"Да\".",
    "toSmallerThanFromErrorMessage": "Калі ласка, абярыце дату \"Да\", якая большая за дату \"Ад\".",
    "titleErrorMessage": "Калі ласка, увядзіце значэнне ў поле «Назва» (без пустога месца).",
    "stText": "",
    "ndText": "",
    "rdText": "",
    "thText": "",
    "yesText": "так",
    "noText": "няма",
    "allDayText": "Увесь дзень",
    "allEventsText": "Усе падзеі",
    "toTimeText": "каб",
    "confirmEventRemoveTitle": "Пацвердзіце выдаленне падзеі",
    "confirmEventRemoveMessage": "Выдаленне гэтай падзеі нельга адрабіць. ",
    "okText": "добра",
    "exportEventsTitle": "Экспартныя падзеі",
    "selectColorsText": "Выберыце Колеры",
    "backgroundColorText": "Колер фону:",
    "textColorText": "Колер тэксту:",
    "borderColorText": "Колер мяжы:",
    "searchEventsTitle": "Пошук падзей",
    "previousText": "Папярэдні",
    "nextText": "Далей",
    "matchCaseText": "Матч Справа",
    "repeatsText": "Паўтараецца:",
    "repeatDaysToExcludeText": "Дні паўтору для выключэння:",
    "daysToExcludeText": "Дні для выключэння:",
    "seriesIgnoreDatesText": "Даты ігнаравання серыі:",
    "repeatsNever": "ніколі",
    "repeatsEveryDayText": "Кожны дзень",
    "repeatsEveryWeekText": "Кожны тыдзень",
    "repeatsEvery2WeeksText": "Кожныя 2 тыдні",
    "repeatsEveryMonthText": "Кожны месяц",
    "repeatsEveryYearText": "Кожны год",
    "repeatsCustomText": "Карыстальніцкі:",
    "repeatOptionsTitle": "Параметры паўтору",
    "moreText": "больш",
    "includeText": "Уключае:",
    "minimizedTooltipText": "Мінімізаваць",
    "restoreTooltipText": "Аднавіць",
    "removeAllEventsInSeriesText": "Выдаліць усе падзеі ў серыі",
    "createdText": "Створана:",
    "organizerNameText": "Арганізатар:",
    "organizerEmailAddressText": "Адрас электроннай пошты арганізатара:",
    "enableFullScreenTooltipText": "Уключыце поўнаэкранны рэжым",
    "disableFullScreenTooltipText": "Выключыце поўнаэкранны рэжым",
    "idText": "ID:",
    "expandMonthTooltipText": "Разгарнуць Месяц",
    "repeatEndsText": "Паўтор заканчваецца:",
    "noEventsAvailableText": "Няма даступных падзей.",
    "viewFullWeekText": "Прагледзець увесь тыдзень",
    "noEventsAvailableFullText": "Няма падзей, даступных для прагляду.",
    "clickText": "Націсніце",
    "hereText": "тут",
    "toAddANewEventText": "каб дадаць новую падзею.",
    "weekText": "Тыдзень",
    "groupText": "Група:",
    "configurationTooltipText": "Канфігурацыя",
    "configurationTitleText": "Канфігурацыя",
    "groupsText": "Групы",
    "eventNotificationTitle": "Calendar.js",
    "eventNotificationBody": "Падзея \"{0}\" пачалася.",
    "optionsText": "Параметры:",
    "startsWithText": "Пачынаецца з",
    "endsWithText": "Заканчваецца с",
    "containsText": "Змяшчае",
    "displayTabText": "Дысплей",
    "enableAutoRefreshForEventsText": "Уключыць аўтаматычнае абнаўленне падзей",
    "enableBrowserNotificationsText": "Уключыць апавяшчэнні браўзера",
    "enableTooltipsText": "Уключыць падказкі",
    "dayText": "дзень",
    "daysText": "дзён",
    "hourText": "гадзіну",
    "hoursText": "гадзіны",
    "minuteText": "хвіліна",
    "minutesText": "хвілін",
    "enableDragAndDropForEventText": "Уключыць перацягванне",
    "organizerTabText": "Арганізатар",
    "removeEventsTooltipText": "Выдаліць падзеі",
    "confirmEventsRemoveTitle": "Пацвердзіць выдаленне Events",
    "confirmEventsRemoveMessage": "Выдаленне гэтых непаўтаральных падзей нельга адрабіць. ",
    "eventText": "Падзея",
    "optionalText": "Дадаткова",
    "urlText": "URL:",
    "openUrlText": "Адкрыць URL",
    "thisWeekTooltipText": "Гэты тыдзень",
    "dailyText": "Штодня",
    "weeklyText": "Штотыдзень",
    "monthlyText": "Штомесяц",
    "yearlyText": "Штогод",
    "repeatsByCustomSettingsText": "Па карыстальніцкіх наладах",
    "lastUpdatedText": "Апошняе абнаўленне:",
    "advancedText": "Пашыраны",
    "copyText": "Копія",
    "pasteText": "Уставіць",
    "duplicateText": "Дублікат",
    "showAlertsText": "Паказаць абвесткі",
    "selectDatePlaceholderText": "Выберыце дату...",
    "hideDayText": "Схаваць дзень",
    "notSearchText": "Не (насупраць)",
    "showHolidaysInTheDisplaysText": "Паказаць святы на галоўным дысплеі і ў радках загалоўка",
    "newEventDefaultTitle": "* Новая падзея",
    "urlErrorMessage": "Калі ласка, увядзіце сапраўдны URL-адрас у поле \"URL-адрас\" (або пакіньце пустым).",
    "searchTextBoxPlaceholder": "Назва пошуку, апісанне і г.д.",
    "currentMonthTooltipText": "Бягучы месяц",
    "cutText": "Выразаць",
    "showMenuTooltipText": "Паказаць меню",
    "eventTypesText": "Тыпы падзей",
    "lockedText": "Заблакіравана:",
    "typeText": "Тып:",
    "sideMenuHeaderText": "Calendar.js",
    "sideMenuDaysText": "дзён",
    "visibleDaysText": "Бачныя дні",
    "previousYearTooltipText": "Папярэдні год",
    "nextYearTooltipText": "Наступны год",
    "showOnlyWorkingDaysText": "Паказаць толькі працоўныя дні",
    "exportFilenamePlaceholderText": "Імя (неабавязкова)",
    "errorText": "Памылка",
    "exportText": "Экспарт",
    "configurationUpdatedText": "Канфігурацыя абноўлена.",
    "eventAddedText": "{0} падзея дададзена.",
    "eventUpdatedText": "{0} падзея абноўлена.",
    "eventRemovedText": "{0} падзея выдалена.",
    "eventsRemovedText": "{0} падзей выдалена.",
    "eventsExportedToText": "Падзеі экспартаваны ў {0}.",
    "eventsPastedText": "Устаўлена падзей: {0}.",
    "eventsExportedText": "Падзеі экспартаваныя.",
    "copyToClipboardOnlyText": "Скапіраваць толькі ў буфер абмену",
    "workingDaysText": "Працоўныя дні",
    "weekendDaysText": "Выхадныя дні",
    "showAsBusyText": "Паказаць як заняты",
    "selectAllText": "Абраць усё",
    "selectNoneText": "Выберыце «Няма».",
    "importEventsTooltipText": "Імпарт падзей",
    "eventsImportedText": "Імпартавана падзей: {0}.",
    "viewFullYearTooltipText": "Прагледзець увесь год",
    "currentYearTooltipText": "Бягучы год",
    "alertOffsetText": "Зрушэнне абвесткі (хвіліны):",
    "viewFullDayTooltipText": "Прагледзець увесь дзень",
    "confirmEventUpdateTitle": "Пацвердзіце абнаўленне падзеі",
    "confirmEventUpdateMessage": "Хочаце абнавіць падзею з гэтага моманту ці ўсю серыю?",
    "forwardText": "Наперад",
    "seriesText": "серыял",
    "viewTimelineTooltipText": "Праглядаць часовую шкалу",
    "nextPropertyTooltipText": "Наступная ўласцівасць",
    "noneText": "(няма)",
    "shareText": "падзяліцца",
    "shareStartFilename": "агульныя_падзеі_",
    "previousPropertyTooltipText": "Папярэдняя ўласнасць",
    "jumpToDateTitle": "Перайсці да даты",
    "goText": "Ідзі"
};