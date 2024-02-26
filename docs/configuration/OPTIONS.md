# JsonTree.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.
<br>
<br>


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | highlightAllDomElementTypes | The DOM element types to lookup (can be either an array of strings, or a space separated string, and defaults to "*"). |

<br>


### Options - Strings:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | objectText | The text that should be shown for the "object" label. |
| *string* | arrayText | The text that should be shown for the "array" label. |
| *string* | closeAllButtonText | The text that should be shown for the "Close All" button text. |
| *string* | openAllButtonText | The text that should be shown for the "Open All" button text. |
| *string* | copyAllButtonText | The text that should be shown for the "Copy All" button text. |

<br>


## Example:

```markdown
<script> 
  $jsontree.setConfiguration( {
      safeMode: false
  } );
</script>
```