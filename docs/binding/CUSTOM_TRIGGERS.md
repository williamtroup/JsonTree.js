# JsonTree.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-jsontree-options" binding attribute for DOM elements.
<br>
<br>


## For Rendering:

### options.onRefresh( *element* ):
Fires when a rendered element is refreshed.
<br>
***Parameter:*** element: '*Object*' - The element that was refreshed.
<br>

### options.onBeforeRenderComplete( *element* ):
Fires before the rendering of the JsonTree.js of an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of the JsonTree.js for an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.
<br>
<br>


## For Data:

### options.onCopyAll( *data* ):
Fires when all the JSON is copied to the clipboard.
<br>
***Parameter:*** data: '*string*' - The JSON that was copied to the clipboard.
<br>

### options.onOpenAll( *element* ):
Fires when all the JSON nodes are opened.
<br>
***Parameter:*** element: '*Object*' - The DOM element.
<br>

### options.onCloseAll( *element* ):
Fires when all the JSON nodes are closed.
<br>
***Parameter:*** element: '*Object*' - The DOM element.
<br>
<br>


## For Clicking:

### options.onValueClick( *value* ):
Fires when a a value is clicked.
<br>
***Parameter:*** value: '*Object*' - The value that was clicked.
<br>
<br>


## Binding Example:

```markdown
<div data-jsontree-options="{ 'onRenderComplete': yourCustomJsFunction }">
    Your HTML.
</div>
```