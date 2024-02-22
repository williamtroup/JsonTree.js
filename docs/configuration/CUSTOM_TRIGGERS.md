# JsonTree.js - Configuration - Options - Custom Triggers:

Below is a list of all the custom triggers supported in the configuration options.
<br>
<br>


### Rendering:

### options.onBeforeRender():
Fires before the DOM elements are rendered (if any are found).

### options.onAfterRender():
Fires after the DOM elements are rendered (if any are found).


<br/>


## Example:
<br/>

```markdown
<script> 
  $jsontree.setConfiguration( {
      onBeforeRender: yourCustomJsFunction
  } );
</script>
```