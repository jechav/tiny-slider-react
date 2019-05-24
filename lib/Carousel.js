import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { tns } from 'ventura-slider';
import 'ventura-slider/dist/tiny-slider.css';
import { ObjectsEqual, ChildrenEqual } from './utils';

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
    this.count = 0;
  }

  /**
   * Fire click on carousel when no draggin and call the onClick callback on prop
   */
  onClick(event) {
    const { onClick } = this.props;
    if (this.dragging || !onClick) return;

    // when only one element the slider doesnt init
    if (!this.slider) return onClick(null, null, event);

    const info = this.slider.getInfo();
    const slideClicked = info.slideItems[info.index];

    // call click callback wiht info and slide clicked
    onClick(slideClicked, info, event);
  }

  /** * Initialize the carousel plugin with new settings */
  build(settings = {}) {
    if (this.slider) this.slider.destroy();

    /* INIT CAROUSEL */
    this.mergedSettings = {
      ...this.state.defaultSettings,
      ...settings,
      container: this.ref,
      onInit: () => {
        this.postInit();
      },
    };

    this.slider = tns(this.mergedSettings);

    // call events binding
    if (this.slider) return;

    // if the slider doesn't load because there is just a child
    // so add class to normal behavior
    if (this.ref) this.ref.className += ' tns-item';

    // so if there is lazy load active load src manually
    if (this.mergedSettings.lazyload) {
      [].forEach.call(this.ref.querySelectorAll('img'), img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.className += ' loaded';
        }
      });
    }
  }

  /**
   * Once the slider plugins has been initialized
   */
  postInit() {
    if (!this.slider) {
      if (this.count >= 4) {
        return this.props.onInit(false); // call initMetod anyway
      }
      this.count++;
      return setTimeout(this.postInit.bind(this), 100);
    }
    this.count = 0;

    const { events, goTo } = this.slider;
    const {
      onIndexChanged,
      onTransitionStart,
      onTransitionEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      startIndex,

      onInit,
    } = this.props;

    /* BIND EVENTS */

    // change draggin value to purge onClick event.
    events.on('transitionStart', info => {
      this.dragging = true;
      if (onTransitionStart) onTransitionStart(info);
    });

    events.on('transitionEnd', info => {
      this.dragging = false;
      if (onTransitionEnd) onTransitionEnd(info);
    });

    if (onIndexChanged) events.on('indexChanged', onIndexChanged);
    if (onTouchStart) events.on('touchStart', onTouchStart);
    if (onTouchMove) events.on('touchMove', onTouchMove);
    if (onTouchEnd) events.on('touchEnd', onTouchEnd);

    /* GO TO START SLIDE */
    if (startIndex) {
      goTo(startIndex);
    }

    // call on Innit
    onInit(true);
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    this.build(this.props.settings);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !ObjectsEqual(nextProps.settings, this.props.settings) ||
      !ChildrenEqual(nextProps.children, this.props.children)
    ) {
      // prepare to reinitialization
      if (this.slider) {
        this.slider.destroy();
        this.slider = null;
      }
    }
  }

  componentDidUpdate() {
    if (!this.slider) {
      // rebuild in case to doesn exists
      this.build(this.props.settings);
    }
  }

  componentWillUnmount() {
    if (this.slider) this.slider.destroy();
  }

  render() {
    const { settings, children, ...props } = this.props;
    return (
      <div ref={ele => (this.ref = ele)} onClick={this.onClick}>
        {children}
      </div>
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
  // events
  onInit: PropTypes.func,
};

Carousel.defaultProps = {
  onInit: () => {},
};

export default Carousel;
