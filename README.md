## tiny-slider-react

Original plugin [tiny-slider](https://github.com/ganlanyuan/tiny-slider)

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
