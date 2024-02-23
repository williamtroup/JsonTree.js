# JsonTree.js - Functions:

Below is a list of all the public functions that can be called from the JsonTree.js instance.
<br>
<br>


## Manage Instances:

### **render( *element*, *options* )**:
Renders an element using the options specified.
<br>
***Parameter: element***: '*Object*' - The element to render.
<br>
***Parameter: options***: '*Object*' - The options to use (refer to ["Binding Options"](binding/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The JsonTree.js class instance.
<br>

### **renderAll()**:
Finds all new elements and renders them.
<br>
***Returns***: '*Object*' - The JsonTree.js class instance.
<br>
<br>


## Configuration:

### **setConfiguration( *newConfiguration* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newConfiguration***: '*Options*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The JsonTree.js class instance.
<br>
<br>


## Additional Data:

### **getVersion()**:
Returns the version of JsonTree.js.
<br>
***Returns***: '*string*' - The version number.
<br>
<br>


## Example:

```markdown
<script> 
    var version = $jsontree.getVersion();
</script>
```