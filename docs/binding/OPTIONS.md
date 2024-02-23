# JsonTree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-jsontree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | data | States the data that should be used for the tree (defaults to null). |
| *boolean* | showCounts | States ... (defaults to true). |
| *boolean* | useZeroIndexingForArrays | States ... (defaults to true). |
| *string* | dateTimeFormat | States ... (defaults to "{yyyy}-{mm}-{dd}T{hh}:{MM}:{ss}Z", refer to ["Date Formats"](DATE_FORMATS.md) documentation for formatting). |
| *boolean* | showArrowToggles | States ... (defaults to true). |
| *boolean* | showStringQuotes | States ... (defaults to true). |
| *boolean* | showTitle | States ... (defaults to true). |
| *boolean* | showTitleTreeControls | States ... (defaults to true). |
| *boolean* | showAllAsClosed | States ... (defaults to false). |
| *boolean* | sortPropertyNames | States ... (defaults to true). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | titleText | The text that should be displayed for the "JsonTree.js" title bar label. |

<br/>


## Binding Example:

```markdown
<code data-jsontree-options="{ 'showCopyButton': false }">
    <pre>
        var something = true;
    </pre>
</code>
```