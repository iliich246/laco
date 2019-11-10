import Hammer from 'hammerjs';

import { FrameInterface } from "./FrameInterface";
export { FrameInterface } from "./FrameInterface";

import {FramePointer} from "./FramePointer";
//const FrameInterface = require('./FrameInterface');

/**
 * Class LandingFrame
 *
 * This class is base of laco frames
 * For use this class you must inherit them in your class
 * For example:
 *
 * class YourClass extends LandingFrame { ...
 *
 * @type {LandingFrame}
 */
export const LandingFrame = (function () {
    //This constants needed because constance of FrameInterface not visible there
    const STATE_OFF   = 0;
    const STATE_START = 1;
    const STATE_WAIT  = 2;
    const STATE_STOP  = 3;

    /**
     * Class LandingFrame
     */
    class LandingFrame extends FrameInterface {
        /**
         * Constructor
         * @param {FrameInterface} frameContainer
         * @param {LandingBuilder} landingBuilder
         */
        constructor(frameContainer, landingBuilder) {
            super(landingBuilder);

            this._frameContainer = frameContainer;

            //this._switchEffectName = $(this._frameContainer).data('switchClass');

            //hammer callbacks
            this._swipeLeftCallbacks  = [];
            this._swipeRightCallbacks = [];
            this._swipeUpCallbacks    = [];
            this._swipeDownCallbacks  = [];

            this._panLeftCallbacks  = [];
            this._panRightCallbacks = [];
            this._panUpCallbacks    = [];
            this._panDownCallbacks  = [];

            //mouse wheel callbacks
            this._mouseWheelUpCallbacks   = [];
            this._mouseWheelDownCallbacks = [];

            //pointer callbacks
            this._mouseMoveCallbacks       = [];
            this._mouseActiveMoveCallbacks = [];
            this._mouseDownCallbacks       = [];
            this._mouseUpCallbacks         = [];
            this._touchMoveCallbacks       = [];
            this._touchDownCallbacks       = [];
            this._touchUpCallbacks         = [];
            this._pointerMoveCallbacks     = [];
            this._pointerDownCallbacks     = [];
            this._pointerUpCallbacks       = [];
            this._pointerActiveMove        = [];
            this._clickCallbacks           = [];
        }

        /**
         * This method must be used for initialization in inherited class
         * as super.initialization() for trigger events
         * @param {boolean} triggerComponents
         * @return {boolean}
         */
        initialization(triggerComponents = true) {
            if (!super.initialization(triggerComponents)) return false;

            this._pointer = new FramePointer(this, this._frameContainer);

            this._hammer = new Hammer(this._frameContainer);
            this._hammer.get('swipe').set({direction: Hammer.DIRECTION_ALL});

            this._hammer.on('swipeleft', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._swipeLeftCallbacks.length; i++) {
                    let currentCallback = this._swipeLeftCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._swipeLeftCallbacks.length; i++) {
                    if (this._swipeLeftCallbacks[i][1])
                        this._swipeLeftCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('swiperight', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._swipeRightCallbacks.length; i++) {
                    let currentCallback = this._swipeRightCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._swipeRightCallbacks.length; i++) {
                    if (this._swipeRightCallbacks[i][1])
                        this._swipeRightCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('swipedown', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._swipeDownCallbacks.length; i++) {
                    let currentCallback = this._swipeDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._swipeDownCallbacks.length; i++) {
                    if (this._swipeDownCallbacks[i][1])
                        this._swipeDownCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('swipeup', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._swipeUpCallbacks.length; i++) {
                    let currentCallback = this._swipeUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._swipeUpCallbacks.length; i++) {
                    if (this._swipeUpCallbacks[i][1])
                        this._swipeUpCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('panleft', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._panLeftCallbacks.length; i++) {
                    let currentCallback = this._panLeftCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._panLeftCallbacks.length; i++) {
                    if (this._panLeftCallbacks[i][1])
                        this._panLeftCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('panright', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._panRightCallbacks.length; i++) {
                    let currentCallback = this._panRightCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._panRightCallbacks.length; i++) {
                    if (this._panRightCallbacks[i][1])
                        this._panRightCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('panup', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._panUpCallbacks.length; i++) {
                    let currentCallback = this._panUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._panUpCallbacks.length; i++) {
                    if (this._panUpCallbacks[i][1])
                        this._panUpCallbacks.splice(i--, 1);
                }
            });

            this._hammer.on('pandown', (event) => {
                if (this.state === STATE_OFF) return;

                for (let i = 0; i < this._panDownCallbacks.length; i++) {
                    let currentCallback = this._panDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._panDownCallbacks.length; i++) {
                    if (this._panDownCallbacks[i][1])
                        this._panDownCallbacks.splice(i--, 1);
                }
            });

            $(this._frameContainer).on('mousewheel', (event) => {
                if (this.state === STATE_OFF) return;

                if (event.originalEvent.deltaY < 0) {//wheel up
                    for (let i = 0; i < this._mouseWheelUpCallbacks.length; i++) {
                        let currentCallback = this._mouseWheelUpCallbacks[i][0];

                        currentCallback(this, event);
                    }

                    for (let i = 0; i < this._mouseWheelUpCallbacks.length; i++) {
                        if (this._mouseWheelUpCallbacks[i][1])
                            this._mouseWheelUpCallbacks.splice(i--, 1);
                    }
                } else {//wheel down
                    for (let i = 0; i < this._mouseWheelDownCallbacks.length; i++) {
                        let currentCallback = this._mouseWheelDownCallbacks[i][0];

                        currentCallback(this, event);
                    }

                    for (let i = 0; i < this._mouseWheelDownCallbacks.length; i++) {
                        if (this._mouseWheelDownCallbacks[i][1])
                            this._mouseWheelDownCallbacks.splice(i--, 1);
                    }
                }
            });

            return true;
        }

        /**
         * @inheritdoc
         * @returns {FramePointer}
         */
        getPointer() {
            return this._pointer;
        }

        /**
         * @inheritdoc
         * @returns {FramePointer}
         */
        getGlobalPointer() {
            return this.getLandingBuilder().getGlobalPointer();
        }

        /**
         * Return current frame container
         * @return {HTMLElement}
         */
        getFrameContainer() {
            return this._frameContainer;
        }

        /**
         * Hang callback on click event of this frame
         * @param callback
         * @param isOnce
         */
        onClick(callback, isOnce = false) {
            this._clickCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse wheel up event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseWheelUp(callback, isOnce = false) {
            this._mouseWheelUpCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse wheel down event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseWheelDown(callback, isOnce = false) {
            this._mouseWheelDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on swipe right event of this frame
         * @param callback
         * @param isOnce
         */
        onSwipeRight(callback, isOnce = false) {
            this._swipeRightCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on swipe left event of this frame
         * @param callback
         * @param isOnce
         */
        onSwipeLeft(callback, isOnce = false) {
            this._swipeLeftCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on swipe up event of this frame
         * @param callback
         * @param isOnce
         */
        onSwipeUp(callback, isOnce = false) {
            this._swipeUpCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on swipe down event of this frame
         * @param callback
         * @param isOnce
         */
        onSwipeDown(callback, isOnce = false) {
            this._swipeDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pan right event of this frame
         * @param callback
         * @param isOnce
         */
        onPanRight(callback, isOnce = false) {
            this._panRightCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pan left event of this frame
         * @param callback
         * @param isOnce
         */
        onPanLeft(callback, isOnce = false) {
            this._panLeftCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pan up event of this frame
         * @param callback
         * @param isOnce
         */
        onPanUp(callback, isOnce = false) {
            this._panUpCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pan down event of this frame
         * @param callback
         * @param isOnce
         */
        onPanDown(callback, isOnce = false) {
            this._panDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse move event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseMove(callback, isOnce = false) {
            this._mouseMoveCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse move with pressed left key event of this frame
         * @param callback
         * @param isOnce
         */
        onActiveMouseMove(callback, isOnce = false) {
            this._mouseActiveMoveCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse left button down event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseDown(callback, isOnce = false) {
            this._mouseDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on mouse left button up event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseUp(callback, isOnce = false) {
            this._mouseUpCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on touch move event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchMove(callback, isOnce = false) {
            this._touchMoveCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on touch down event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchDown(callback, isOnce = false) {
            this._touchDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on touch up event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchUp(callback, isOnce = false) {
            this._touchUpCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pointer move event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerMove(callback, isOnce = false) {
            this._pointerMoveCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on active pointer move event of this frame
         * @param callback
         * @param isOnce
         */
        onActivePointerMove(callback, isOnce = false) {
            this._pointerActiveMove.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pointer down event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerDown(callback, isOnce = false) {
            this._pointerDownCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on pointer up event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerUp(callback, isOnce = false) {
            this._pointerUpCallbacks.push([
                callback,
                isOnce
            ]);
        }
    }

    return LandingFrame;
}());