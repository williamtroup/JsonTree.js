# JsonTree.js v2.7.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=JsonTree.js%2C%20a%20free%20JavaScript%json%20treeview&url=https://github.com/williamtroup/JsonTree.js&hashtags=javascript,treeview,json)
[![npm](https://img.shields.io/badge/npmjs-v2.7.0-blue)](https://www.npmjs.com/package/jjsontree.js)
[![nuget](https://img.shields.io/badge/nuget-v2.7.0-purple)](https://www.nuget.org/packages/jJsonTree.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/JsonTree.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/JsonTree.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://william-troup.com/)

> 🔗 A lightweight JavaScript library that generates customizable tree views to better visualize, and edit, JSON data.


## What features does JsonTree.js have?

- Zero-dependencies and extremely lightweight!
- Written in TypeScript, allowing greater support for React, Angular, and other libraries!
- Full API available via public functions.
- Fully styled in CSS/SASS, fully responsive, and compatible with the Bootstrap library!
- Full CSS theme support (using :root variables), with dark and light themes.
- 14 types supported by default (with unknown type support).
- Fully configurable per DOM element!
- Close/Open all nodes.
- Clickable values via custom triggers!
- Custom value rendering.
- Array paging support (show array objects on different pages)!
- Drag & Drop JSON files support!
- Full property/value editing support (double click the property name/value).


## Where can I find the documentation?

All the documentation can be found [here](https://www.william-troup.com/jsontree-js/documentation/index.html).


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What types are supported?

- `boolean` Booleans
- `number` Numbers
- `bigint` Big Integers
- `string` Strings
- `object` Objects
- `object Array` Arrays
- `object Date` Dates
- `number` Decimals
- `null` Nulls
- `symbol` Symbols
- `function` Functions and Lambdas
- `undefined` Undefined
- `color` color
- `guid` guid
- `any` Unknown


## What languages are supported?

- `af` Afrikaans
- `ar` Arabic
- `hy` Armenian
- `be` Belarusian
- `bn` Bengali
- `bg` Bulgarian
- `ca` Catalan
- `zh` Chinese (simplified)
- `da` Danish
- `nl` Dutch
- `en` English (default)
- `eo` Esperanto
- `et` Estonian
- `fa` Farsi
- `fi` Finnish
- `fr` French
- `fy` Frisian
- `gl` Galician
- `ka` Georgian
- `de` German
- `el` Greek
- `he` Hebrew
- `hi` Hindi
- `hu` Hungarian
- `is` Icelandic
- `id` Indonesian
- `ga` Irish
- `it` Italian
- `ja` Japanese
- `ko` Korean
- `lv` Latvian
- `lt` Lithuanian
- `lb` Luxembourgish
- `ms` Malay
- `ne` Nepali
- `no` Norwegian
- `pl` Polish
- `pt` Portuguese
- `ro` Romanian
- `si` Sinhalese
- `sk` Slovak
- `sl` Slovenian
- `es` Spanish
- `sv` Swedish
- `tl` Tagalog
- `ta` Tamil
- `zh-tw` Taiwanese
- `te` Telugu
- `th` Thai
- `tr` Turkish
- `uk` Ukrainian


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://www.william-troup.com/jsontree-js/documentation/recent-changes.html).


## How do I install JsonTree.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jjsontree.js
```

You can also use the following CDN links:

```markdown
https://cdn.jsdelivr.net/gh/williamtroup/JsonTree.js@2.7.0/dist/jsontree.min.js
https://cdn.jsdelivr.net/gh/williamtroup/JsonTree.js@2.7.0/dist/jsontree.js.min.css
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