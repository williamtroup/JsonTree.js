# JsonTree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-jsontree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | data | States the data that should be used for the tree (defaults to null). |
| *boolean* | showCounts | States if the property/length counts should be shown for Objects/Arrays (defaults to true). |
| *boolean* | useZeroIndexingForArrays | States if the indexes should for arrays should start from zero (defaults to true). |
| *string* | dateTimeFormat | States the display format that should be used for date values (defaults to "{yyyy}-{mm}-{dd}T{hh}:{MM}:{ss}Z", refer to ["Date Formats"](DATE_FORMATS.md) documentation for formatting). |
| *boolean* | showArrowToggles | States if the toggle arrows should be shown (defaults to true). |
| *boolean* | showStringQuotes | States if quotes should be shown around string values (defaults to true). |
| *boolean* | showTitle | States if the title should be shown (defaults to true). |
| *boolean* | showTitleTreeControls | States if the tree control button should be shown in the title bar (defaults to true). |
| *boolean* | showAllAsClosed | States if all the nodes should be closed when first rendered (defaults to false). |
| *boolean* | sortPropertyNames | States if the property names for an object should be sorted (defaults to true). |
| *boolean* | sortPropertyNamesInAlphabeticalOrder | States if the sorted property names for an object should be in alphabetical order (defaults to true). |
| *boolean* | showCommas | States if commas should be shown at the end of each line (defaults to false). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | titleText | The text that should be displayed for the "JsonTree.js" title bar label. |

<br/>


## Binding Example:

```markdown
<div data-jsontree-options="{ 'showCounts': false }">
    Your HTML.
</div>
```