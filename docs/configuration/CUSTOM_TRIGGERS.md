# JsonTree.js - Configuration - Options - Custom Triggers:

Below is a list of all the custom triggers supported in the configuration options.
<br>
<br>


### Rendering:

### options.onBeforeRender( *element* ):
Fires before the rendering of an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.
<br>


## For Clicking:

### options.onValueClick( *value* ):
Fires when a a value is clicked.
<br>
***Parameter:*** value: '*Object*' - The value that was clicked.
<br>


## Example:

```markdown
<script> 
  $jsontree.setConfiguration( {
      onBeforeRender: yourCustomJsFunction
  } );
</script>
```