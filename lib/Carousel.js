import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { tns } from 'tiny-slider';
import { ObjectsEqual, ChildrenEqual } from './utils';

/**
 * Wrapper component to show carousel, controlling the lifecycle
 * methods and settings update.
 * @param {object} settings - setting to configure tiny-slider plugin
 * @param {function} onClick - callback to return slide clicked
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
class Carousel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      defaultSettings: {},
    };

    this.hasForwardedRef = false;
    if (props.forwardedRef) {
      this.hasForwardedRef = true;
      this.ref = props.forwardedRef;
    }
    this.slider = null;
    this.build = this.build.bind(this);
    this.onClick = this.onClick.bind(this);
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
    if (this.slider && this.slider.destroy) this.slider.destroy();

    /* INIT CAROUSEL */
    this.mergedSettings = {
      ...this.state.defaultSettings,
      ...settings,
      container: this.hasForwardedRef ? this.ref.current : this.ref,
      onInit: () => {
        this.postInit();
      },
    };

    this.slider = tns(this.mergedSettings);
    if (this.hasForwardedRef) {
      let o = this.ref && this.ref.current;
      if (o) {
        if (typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string") {
          o.slider = this.slider;
        }
      }
    }

    // call events binding
    if (this.slider) return;

    // if the slider doesn't load because there is just a child
    // so add class to normal behavior
    if (this.hasForwardedRef && this.ref.current) this.ref.current.className += ' tns-item';
    if (!this.hasForwardedRef && this.ref) this.ref.className += ' tns-item';
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

    const { events } = this.slider;
    const {
      onIndexChanged,
      onTransitionStart,
      onTransitionEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd,

      onInit,
    } = this.props;

    /* BIND EVENTS */

    //We should not even think of doing this if events is null. sl@sweprod.com 2021-04-27
    if(events){
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
    }

    // call on Innit
    onInit(true);
  }

  /* LIFECYCLE EVENTS */
  componentDidMount() {
    this.build(this.props.settings);
  }

  componentDidUpdate(prevProps) {
    if (
      !ObjectsEqual(prevProps.settings, this.props.settings) ||
      !ChildrenEqual(prevProps.children, this.props.children)
    ) {
      // prepare to reinitializationgit
      if (this.slider) {
        this.slider.rebuild();
      } else {
        this.build(this.props.settings);
      }
    }
  }

  componentWillUnmount() {
    if (this.slider && this.slider.destroy) this.slider.destroy();
  }

  render() {
    const { children, className, style, forwardedRef } = this.props;
    let ref = forwardedRef ? forwardedRef : ele => (this.ref = ele)
    return (
      <div
        ref={ref}
        onClick={this.onClick}
        className={className}
        style={style}
      >
        {children}
      </div>
    );
  }
}

Carousel.propTypes = {
  settings: PropTypes.object,
  onClick: PropTypes.func,
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
