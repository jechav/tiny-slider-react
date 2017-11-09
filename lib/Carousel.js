import React, { Component } from "react";
import PropTypes from "prop-types";
import { tns } from "ventura-slider/src/tiny-slider.module";
import "ventura-slider/dist/tiny-slider.css";
import { ObjectsIqual } from './utils';


/**
 * Wrapper component to show carousel, controlling the lifecycle
 * methods and settings update.
 * @param {object} settings - setting to configure tiny-slider plugin
 * @param {function} onClick - callback to return slide clicked
 * @param {number} startIndex - index of carousel initiation
 *
 * @param {function} onIndexChanged - event bind
 * @param {function} onTransitionStart - event bind
 * @param {function} onTransitionEnd - event bind
 * @param {function} onTouchStart - event bind
 * @param {function} onTouchMove - event bind
 * @param {function} onTouchEnd - event bind
 *
 * @returns {ReactElement}
 */
class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultSettings: {
        responsive: {},
        controlsText: ['◀', '▶'],
      },
    };

    this.slider = null;
    this.build = this.build.bind(this);
    this.onClick = this.onClick.bind(this);
    this.dragging = false;
    this.mergedSettings = 0;
  }

  /**
   * Fire click on carousel when no draggin and call the onClick callback on prop
   */
  onClick(event) {
    const { onClick } = this.props;
    if (this.dragging || !onClick) return;

    const info = this.slider.getInfo();
    const slideClicked = info.slideItems[info.index];

    // call click callback wiht info and slide clicked
    onClick(slideClicked, info, event) 
  }


  /** * Initialize the carousel plugin with new settings */
  build(settings = {}) {
    if (this.slider) this.slider.destroy();

    /* INIT CAROUSEL */
    this.mergedSettings = {
      ...this.state.defaultSettings,
      ...settings,
      container: this.ref
    };

    this.slider = tns(this.mergedSettings);

    // call events binding 
    if (this.slider) return this.postInit();

    // if the slider doesn't load because there is just a child
    // so add class to normal behavior
    this.ref.className += ' tns-item';

    // so if there is lazy load active load src manually
    if (this.mergedSettings.lazyload) {
      [].forEach.call(this.ref.querySelectorAll('img'), (img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src; 
          img.className += ' loaded';
        }
      })
    }
  }

  /**
   * Once the slider plugins has been initialized 
  */
  postInit() {
    const { events, goTo } = this.slider;
    const { 
      onIndexChanged,
      onTransitionStart,
      onTransitionEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      startIndex,
    } = this.props;

    /* BIND EVENTS */

    // change draggin value to purge onClick event.
    events.on('transitionStart', (info) => {
      this.dragging = true;
      if (onTransitionStart) onTransitionStart(info);
    });
    events.on('transitionEnd', (info) => {
      this.dragging = false;
      if (onTransitionEnd) onTransitionEnd(info);
    });
    if (onIndexChanged) events.on('indexChanged', onIndexChanged)
    if (onTouchStart) events.on('touchStart', onTouchStart)
    if (onTouchMove) events.on('touchMove', onTouchMove)
    if (onTouchEnd) events.on('touchEnd', onTouchEnd)

    /* GO TO START SLIDE */
    if (startIndex) {
      goTo(startIndex);
    }
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    this.build(this.props.settings);
  }

  componentWillReceiveProps(nextProps) {
    if (!ObjectsIqual(nextProps.settings, this.props.settings)) {
      this.build(nextProps.settings); //rebuild in case the settings change
    }
  }

  componentWillUnmount() {
    if (this.slider) this.slider.destroy();
  }

  render() {
    const { settings, children, ...props } = this.props;
    return (
      <div ref={ele => (this.ref = ele)} onClick={this.onClick}>{children}</div>
    );
  }
}

Carousel.propTypes = {
  settings: PropTypes.object,
  onClick: PropTypes.func,
  startIndex: PropTypes.number,
  // custom tiny events events
  onIndexChanged: PropTypes.func,
  onTransitionStart: PropTypes.func,
  onTransitionEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
};

export default Carousel;
