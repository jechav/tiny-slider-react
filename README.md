## tiny-slider-react

Original plugin [tiny-slider](https://github.com/ganlanyuan/tiny-slider)

> Tiny Slider v2 <=> tiny-slider-react >= v5

> Tiny Slider v1 <=> tiny-slider-react <= v4

[demo](https://tiny-slider-react-tests.netlify.app/)
[demo2](https://codesandbox.io/s/test-tiny-slider-react-y9gem)

## props

|    prop            | decription                                                          |
|------------------  |---------------------------------------------------------------------|
| settings           |  [options slider](https://github.com/ganlanyuan/tiny-slider#options) |
| onClick            |  callback to return slide clicked (slideClicked, info, event)        |
| startIndex         |  index of carousel initiation                                        |
| onIndexChanged     |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) |
| onTransitionStart  |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) | 
| onTransitionEnd    |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) | 
| onTouchStart       |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) | 
| onTouchMove        |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) | 
| onTouchEnd         |  [event bind](https://github.com/ganlanyuan/tiny-slider#custom-events) |d

```js
import TinySlider from "tiny-slider-react";

const settings = {
  lazyload: true,
  nav: false,
  mouseDrag: true
};

<TinySlider settings={settings}>
    {imgs.map((el, index) => (
      <div key={index} style={{ position: "relative" }}>
        <img
          className={`tns-lazy-img`}
          src={loadingImage}
          data-src={el}
          alt=""
          style={imgStyles}
        />
      </div>
    ))}
</TinySlider>
```

> How to use external buttons for prev & next

```js
const settings = {
  lazyload: true,
  nav: false,
  mouseDrag: true,
  controls: false // remove built-in nav buttons
}
```

Get the slider from refs:

```js 
<TinySlider settings={settings} ref={ts => this.ts = ts}>...</TinySlider>
```

Add onClick for your buttons:
```js
<button type="button" onClick={() => this.onGoTo('prev')}>Previous</button>
<button type="button" onClick={() =>  this.onGoTo('next')}>Next</button>
```

Add the handler on your component:

```js 
onGoTo = dir => this.ts.slider.goTo(dir)
```
