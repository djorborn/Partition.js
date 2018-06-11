# Partition
Partition lets you make resizable elements. Pass it two elements that share the same parent element and the direction u want do split it, vertical or horizontal. Thats it.

```js
var splitScreen = new Partition({
    direction: 'vertical',
    a: '#left',
    b: '#right',
    barWidth: '8'
});
```
```css
#left, #right {

}
```
To make a new Partition: `new Partition({options})`:
### Options
- __direction__
    - horizontal
    - vertical
    - Is Required
- __a__ and __b__
    - DOM element, String or DOM-Selector
    - Is Required
- __bar__
    - DOM element, String or DOM-Selector
    - Will be inserted between a and b if not added.
- __barWidth__
    - The thickness of the resize bar in pixels.
    - Default is 10
- __stopGap__
    - Where the the bar will stop in percent.
    - defualt is 10
- __splitSize__
    - The initial size of the elements in percent.
    - defualt is '50 50'
- __iframe__
    - Lets you resize over iframes
    - Boolean defualt = false

## Example Code
HTML
```html
<div id="app">
    <div id="left"></div>
    <div id="right"></div>
</div>
```
CSS
```css
#app {
    width: 500px;
    height: 500px;
    margin: auto;
}
#left {
    background-color: pink;
}
#right {
    background-color: lightblue;
}
```
JS
```js
var part = new Partition({
    direction: 'vertical',
    a: '#left',
    b: '#right',
})
```

### Style Options
The bars will have the class name __bar-__ plus the direction like __bar-horizontal__.
