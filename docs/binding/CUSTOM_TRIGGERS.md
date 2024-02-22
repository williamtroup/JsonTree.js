# JsonTree.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-jsontree-options" binding attribute for DOM elements.
<br>
<br>


## For Rendering:

### options.onBeforeRenderComplete( *element* ):
Fires before the rendering of the jsontree of an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of the jsontree for an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.

<br>


## Binding Example:

```markdown
<div data-jsontree-options="{ 'onRenderComplete': yourCustomJsFunction }">
    Your HTML.
</div>
```