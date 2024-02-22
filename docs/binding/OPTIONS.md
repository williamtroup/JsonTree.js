# JsonTree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-jsontree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | data | States the data that should be used for the tree (defaults to null). |
| *boolean* | showCounts | States ... (defaults to true). |
| *number* | indentSpacing | States ... (defaults to 10). |
| *boolean* | useZeroIndexingForArrays | States ... (defaults to true). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | copyButtonText | The text that should be displayed for the "Copy" button. |

<br/>


## Binding Example:

```markdown
<code data-jsontree-options="{ 'showCopyButton': false }">
    <pre>
        var something = true;
    </pre>
</code>
```