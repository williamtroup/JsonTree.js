# JsonTree.js v1.1.1

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=JsonTree.js%2C%20a%20free%20JavaScript%json%20treeview&url=https://github.com/williamtroup/JsonTree.js&hashtags=javascript,treeview,json)
[![npm](https://img.shields.io/badge/npmjs-v1.1.1-blue)](https://www.npmjs.com/package/jjsontree.js)
[![nuget](https://img.shields.io/badge/nuget-v1.1.1-purple)](https://www.nuget.org/packages/jJsonTree.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/JsonTree.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/JsonTree.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://william-troup.com/)

> 🔗 A lightweight JavaScript library that generates customizable tree views to better visualize JSON data.


## What features does JsonTree.js have?

- Zero-dependencies and extremely lightweight!
- Exportable for use in other frameworks!
- Full API available via public functions.
- Fully styled in CSS/SASS, fully responsive, and compatible with the Bootstrap library!
- Full CSS theme support (using :root variables).
- Fully configurable per DOM element!
- Close/Open all.
- Clickable values!
- Custom value rendering.


## Where can I find the documentation?

All the documentation can be found [here](https://www.william-troup.com/jsontree-js/documentation/index.html).


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://www.william-troup.com/jsontree-js/documentation/recent-changes.html).


## How do I install JsonTree.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jjsontree.js
```


## How do I get started?

To get started using JsonTree.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<link rel="stylesheet" href="dist/jsontree.js.css">
<script src="dist/jsontree.js"></script>
```

### 3. DOM Element Binding:

```markdown
<div id="tree-1" data-jsontree-js="{ 'showCounts': true, 'data': [ true, false, 5, 10, 'A String' ] }">
    Your HTML.
</div>
```

To see a list of all the available binding options you can use for "data-jsontree-js", click [here](https://www.william-troup.com/jsontree-js/documentation/binding-options.html).

To see a list of all the available custom triggers you can use for "data-jsontree-js", click [here](https://www.william-troup.com/jsontree-js/documentation/binding-options-custom-triggers.html).


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing JsonTree.js?

To customize, and get more out of JsonTree.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](https://www.william-troup.com/jsontree-js/documentation/public-functions.html).


### 2. Configuration:

Configuration options allow you to customize how JsonTree.js will function.  You can set them as follows:

```markdown
<script> 
  $jsontree.setConfiguration( {
      safeMode: false
  } );
</script>
```

To see a list of all the available configuration options you can use, click [here](https://www.william-troup.com/jsontree-js/documentation/options.html).