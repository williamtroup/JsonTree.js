# JsonTree.js - Change Log:

## Version 0.3.0:

#### **Binding Options:**
- Added a new binding option called "ignoreNullValues", which states if NULL values should be ignored and not rendered (defaults to false).
- Added a new binding option called "ignoreFunctionValues", which states if FUNCTION values should be ignored and not rendered (defaults to false).
- Added a new binding option called "reverseArrayValues", which states if the values from an array should be shown in reverse order (defaults to false).

#### **Public Functions:**
- Added a new public function "refresh()", which refreshes the UI for a specific element.
- Added a new public function "refreshAll()", which will refresh all the rendered elements.

#### **UI Improvements:**
- Added "unknown" property type support! This will use a new CSS class called "unknown".
- Added "decimal" property type support! This will use a new CSS class called "decimal".

#### **General Improvements:**
- All data is now tracked internally, allow for future improvements.

#### **Documentation:**
- Fixed the badge links in the README files pointing to the wrong project.

<br>


## Version 0.2.0:

#### **Binding Options:**
- Added a new binding option called "sortPropertyNamesInAlphabeticalOrder", which states if the sorted property names for an object should be in alphabetical order (defaults to true).
- Added a new binding option called "showCommas", which states if commas should be shown at the end of each line (defaults to false).

#### **Public Functions:**
- Added new public function "render()", which will render a specific DOM element using the options you specify.
- Added new public function "renderAll()", which will find all new DOM elements with the "data-jsontree-options" attribute and render them.

#### **UI Improvements:**
- The spacing used for the title bar buttons is now smaller when viewed on a mobile.

#### **Documentation:**
- Fixed some spelling and grammar mistakes in the documentation.
- Minor improvements to the documentation layout.

<br>


## Version 0.1.0:
- Everything :)