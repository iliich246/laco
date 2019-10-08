import Hammer from 'hammerjs';

/**
 * Class Pointer
 *
 * This class describe universal pointer object that`s used
 * in LandingFrame class objects
 *
 * @type {FramePointer}
 */
export const FramePointer = (function () {
    const LAST_TOUCH = 1;
    const LAST_MOUSE = 0;

    const ACTION_CLICK = 0;
    const ACTION_MOUSE_MOVE = 1;
    const ACTION_MOUSE_DOWN = 2;
    const ACTION_MOUSE_UP = 3;
    const ACTION_TOUCH_START = 4;
    const ACTION_TOUCH_END = 5;
    const ACTION_TOUCH_MOVE = 6;

    const ACTION_TO_STRING_ARRAY = [
        'click',
        'mousemove',
        'mousedown',
        'mouseup',
        'touchstart',
        'touchend',
        'touchmove'
    ];

    const HISTORY_ARRAY_ELEMENT_LENGTH = 8;

    const ARRAY_HISTORY_ELEMENT_X_POSITION        = 0;
    const ARRAY_HISTORY_ELEMENT_Y_POSITION        = 1;
    const ARRAY_HISTORY_ELEMENT_POINTER_STYLE     = 2;
    const ARRAY_HISTORY_ELEMENT_IS_POINTER_ACTIVE = 3;
    const ARRAY_HISTORY_ELEMENT_FRAME_TIME        = 4;
    const ARRAY_HISTORY_ELEMENT_SPEED_X           = 5;
    const ARRAY_HISTORY_ELEMENT_SPEED_Y           = 6;
    const ARRAY_HISTORY_ELEMENT_ACTION_TYPE       = 7;

    /**
     * Class FramePointer
     */
    class FramePointer {
        /**
         * Constructor
         * @param pointerHandler
         * @param pointerHandlerContainer
         */
        constructor(pointerHandler = null, pointerHandlerContainer = null) {
            /**
             * Is pointer is active (left mouse button pressed when moved or
             * on touch panel moved)
             * @type {boolean}
             */
            this.pointerIsActive = false;
            /**
             * Pointer x coordinate regarding LandingFrame
             * @type {number}
             */
            this.x = 0;
            /**
             * Pointer y coordinate regarding LandingFrame
             * @type {number}
             */
            this.y = 0;
            /**
             * Speed x component of pointer
             * @type {number}
             */
            this.speedX = 0;
            /**
             * Speed y component of pointer
             * @type {number}
             */
            this.speedY = 0;

            /**
             * Object into which this pointer is aggregated
             * @private
             */
            this._pointerHandler = pointerHandler;
            /**
             * Object container into which this pointer is aggregated
             * @private
             */
            this._pointerHandlerContainer = pointerHandlerContainer;
            /**
             * Prev x value of pointer used for speed calculations
             * @type {number}
             * @private
             */
            this._prevX = 0;
            /**
             * Prev y value of pointer used for speed calculations
             * @type {number}
             * @private
             */
            this._prevY = 0;
            /**
             * Keeps true if mouse left button is pressed
             * @type {boolean}
             * @private
             */
            this._mouseIsActive = false;
            /**
             * Mouse cursor x coordinate regarding landingFrame
             * @type {number}
             * @private
             */
            this._mouseX = 0;
            /**
             * Mouse cursor y coordinate regarding landingFrame
             * @type {number}
             * @private
             */
            this._mouseY = 0;
            /**
             * Keeps true if finger on touch panel
             * @type {boolean}
             * @private
             */
            this._touchIsActive = false;
            /**
             * Touch x coordinate regarding landingFrame
             * @type {number}
             * @private
             */
            this._touchX = 0;
            /**
             * Touch y coordinate regarding landingFrame
             * @type {number}
             * @private
             */
            this._touchY = 0;

            this._lastClickX = 0;

            this._lastClickY = 0;

            /**
             * If true this pointer will record his move and click history
             * @type {boolean}
             * @private
             */
            this._isPointerHistoryEnabled = false;
            /**
             * This field configure history array length
             * @type {number}
             * @private
             */
            this._pointerHistorySize = 20;
            /**
             * Pointer history array
             * @type {Array}
             * @private
             */
            this._historyArray = [];
            /**
             * Variable count frames iterations for this pointer
             * array in format [
             *     <pointer X coordinate(int)>,
             *     <pointer Y coordinate(int)>,
             *     <is pointer mouse(true) or touch(false)>,
             *     <is pointer active>,
             *     <poiner frame time>,
             *     <pointer speedX>,
             *     <pointer speedY>,
             *     <pointer action>,
             * ]
             *
             * @type {number}
             * @private
             */
            this._pointerFrameTime = 0;
            /**
             * Variable keep last device that was used in pointer
             * @type {number}
             * @private
             */
            this._lastPoinerDevice = LAST_TOUCH;

            if (!this._pointerHandler) return;

            this._hammer = new Hammer(this._pointerHandlerContainer);

            this._hammer.on('tap', (event) => {
                this._lastClickX = event.center.x;
                this._lastClickY = event.center.y;

                //console.log(event);

                for (let i = 0; i < this._pointerHandler._clickCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._clickCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._clickCallbacks.length; i++) {
                    if (this._pointerHandler._clickCallbacks[i][1])
                        this._pointerHandler._clickCallbacks.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    event.pageX,
                    event.pageY,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_CLICK
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * Jquery mouse click event on pointer handler container
             */
            //$(this._pointerHandlerContainer).on('click', (event) => {
            // this._lastClickX = event.pageX;
            // this._lastClickY = event.pageY;
            //
            // console.log([
            //     this._pointerHandlerContainer
            // ])
            //
            // for (let i = 0; i < this._pointerHandler._clickCallbacks.length; i++) {
            //     let currentCallback = this._pointerHandler._clickCallbacks[i][0];
            //
            //     currentCallback(this, event);
            // }
            //
            // for (let i = 0; i < this._pointerHandler._clickCallbacks.length; i++) {
            //     if (this._pointerHandler._clickCallbacks[i][1])
            //         this._pointerHandler._clickCallbacks.splice(i--, 1);
            // }
            //
            // if (!this._isPointerHistoryEnabled) return;
            //
            // let historyArrayFrame = [
            //     event.pageX,
            //     event.pageY,
            //     this.isPointerMouse(),
            //     this.pointerIsActive,
            //     this._pointerFrameTime,
            //     this.speedX,
            //     this.speedY,
            //     ACTION_CLICK
            // ];
            //
            // this._historyArray.pop();
            // this._historyArray.unshift(historyArrayFrame);
            //});

            /**
             * Jquery mouse move event on pointer handler container
             */
            $(this._pointerHandlerContainer).on('mousemove', (event) => {

                this._lastPoinerDevice = LAST_MOUSE;

                this._mouseX = event.pageX;
                this._mouseY = event.pageY;
                this.x = this._mouseX;
                this.y = this._mouseY;

                for (let i = 0; i < this._pointerHandler._mouseMoveCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._mouseMoveCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._mouseMoveCallbacks.length; i++) {
                    if (this._pointerHandler._mouseMoveCallbacks[i][1])
                        this._pointerHandler._mouseMoveCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerMoveCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerMoveCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerMoveCallbacks.length; i++) {
                    if (this._pointerHandler._pointerMoveCallbacks[i][1])
                        this._pointerHandler._pointerMoveCallbacks.splice(i--, 1);
                }

                if (!this._mouseIsActive) return;

                for (let i = 0; i < this._pointerHandler._mouseActiveMoveCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._mouseActiveMoveCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._mouseActiveMoveCallbacks.length; i++) {
                    if (this._pointerHandler._mouseActiveMoveCallbacks[i][1])
                        this._pointerHandler._mouseActiveMoveCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerActiveMove.length; i++) {
                    let currentCallback = this._pointerHandler._pointerActiveMove[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerActiveMove.length; i++) {
                    if (this._pointerHandler._pointerActiveMove[i][1])
                        this._pointerHandler._pointerActiveMove.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    event.pageX,
                    event.pageY,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_MOUSE_MOVE
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * Jquery mouse down event on landingFrame container
             */
            $(this._pointerHandlerContainer).on('mousedown', (event) => {
                this._mouseIsActive = true;
                this.pointerIsActive = true;

                for (let i = 0; i < this._pointerHandler._mouseDownCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._mouseDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._mouseDownCallbacks.length; i++) {
                    if (this._pointerHandler._mouseDownCallbacks[i][1])
                        this._pointerHandler._mouseDownCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerDownCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerDownCallbacks.length; i++) {
                    if (this._pointerHandler._pointerDownCallbacks[i][1])
                        this._pointerHandler._pointerDownCallbacks.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    this.x,
                    this.y,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_MOUSE_DOWN
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * Jquery mouse up event on landingFrame container
             */
            $(this._pointerHandlerContainer).on('mouseup', (event) => {
                this._mouseIsActive = false;
                this.pointerIsActive = false;

                for (let i = 0; i < this._pointerHandler._mouseUpCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._mouseUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._mouseUpCallbacks.length; i++) {
                    if (this._pointerHandler._mouseUpCallbacks[i][1])
                        this._pointerHandler._mouseUpCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerUpCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerUpCallbacks.length; i++) {
                    if (this._pointerHandler._pointerUpCallbacks[i][1])
                        this._pointerHandler._pointerUpCallbacks.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    this.x,
                    this.y,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_MOUSE_UP
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * DOM touch start event on landingFrame container
             */
            this._pointerHandlerContainer.addEventListener("touchstart", (event) => {

                this._lastPoinerDevice = LAST_TOUCH;

                this._touchIsActive = true;
                this.pointerIsActive = true;
                this._touchX = event.targetTouches[0].clientX;
                this._touchY = event.targetTouches[0].clientY;
                this.x = this._touchX;
                this.y = this._touchY;

                for (let i = 0; i < this._pointerHandler._touchDownCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._touchDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._touchDownCallbacks.length; i++) {
                    if (this._pointerHandler._touchDownCallbacks[i][1])
                        this._pointerHandler._touchDownCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerDownCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerDownCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerDownCallbacks.length; i++) {
                    if (this._pointerHandler._pointerDownCallbacks[i][1])
                        this._pointerHandler._pointerDownCallbacks.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    this.x,
                    this.y,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_TOUCH_START
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * DOM touch end event on landingFrame container
             */
            this._pointerHandlerContainer.addEventListener("touchend", (event) => {

                this._lastPoinerDevice = LAST_TOUCH;

                this._touchIsActive = false;
                this.pointerIsActive = false;

                for (let i = 0; i < this._pointerHandler._touchUpCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._touchUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._touchUpCallbacks.length; i++) {
                    if (this._pointerHandler._touchUpCallbacks[i][1])
                        this._pointerHandler._touchUpCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerUpCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerUpCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerUpCallbacks.length; i++) {
                    if (this._pointerHandler._pointerUpCallbacks[i][1])
                        this._pointerHandler._pointerUpCallbacks.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    this.x,
                    this.y,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_TOUCH_END
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });

            /**
             * DOM touch move event on landingFrame container
             */
            this._pointerHandlerContainer.addEventListener("touchmove", (event) => {

                this._lastPoinerDevice = LAST_TOUCH;

                this._touchX = event.targetTouches[0].clientX;
                this._touchY = event.targetTouches[0].clientY;
                this.x = this._touchX;
                this.y = this._touchY;

                for (let i = 0; i < this._pointerHandler._touchMoveCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._touchMoveCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._touchMoveCallbacks.length; i++) {
                    if (this._pointerHandler._touchMoveCallbacks[i][1])
                        this._pointerHandler._touchMoveCallbacks.splice(i--, 1);
                }

                for (let i = 0; i < this._pointerHandler._pointerMoveCallbacks.length; i++) {
                    let currentCallback = this._pointerHandler._pointerMoveCallbacks[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerMoveCallbacks.length; i++) {
                    if (this._pointerHandler._pointerMoveCallbacks[i][1])
                        this._pointerHandler._pointerMoveCallbacks.splice(i--, 1);
                }

                if (!this._touchIsActive) return;

                for (let i = 0; i < this._pointerHandler._pointerActiveMove.length; i++) {
                    let currentCallback = this._pointerHandler._pointerActiveMove[i][0];

                    currentCallback(this, event);
                }

                for (let i = 0; i < this._pointerHandler._pointerActiveMove.length; i++) {
                    if (this._pointerHandler._pointerActiveMove[i][1])
                        this._pointerHandler._pointerActiveMove.splice(i--, 1);
                }

                if (!this._isPointerHistoryEnabled) return;

                let historyArrayFrame = [
                    this.x,
                    this.y,
                    this.isPointerMouse(),
                    this.pointerIsActive,
                    this._pointerFrameTime,
                    this.speedX,
                    this.speedY,
                    ACTION_TOUCH_MOVE
                ];

                this._historyArray.pop();
                this._historyArray.unshift(historyArrayFrame);
            });
        }

        /**
         * Pointer animation frame method
         * Need to be inserted in frame animation method for correct work
         */
        animationFrame() {
            this.speedX = this._prevX - this.x;
            this.speedY = this._prevY - this.y;

            this._prevX = this.x;
            this._prevY = this.y;

            this._pointerFrameTime++;
        }

        /**
         * Returns true if last pointing device was mouse
         * @returns {boolean}
         */
        isPointerMouse() {
            return this._lastPoinerDevice === LAST_MOUSE;
        }

        /**
         * Returns true if last pointing device was touch screen
         * @returns {boolean}
         */
        isPointerTouch() {
            return this._lastPoinerDevice === LAST_TOUCH;
        }

        /**
         * Enable record of pointer history and configure history arrays
         * @param historyLength
         */
        enablePointerHistory(historyLength = 20) {
            this._pointerHistorySize = historyLength;

            this._isPointerHistoryEnabled = true;

            this._historyArray = [];

            for (let i = 0; i <  this._pointerHistorySize; i++)
                this._historyArray.push([0]);

            this._pointerFrameTime = 0;
        }

        /**
         * Disable record of pointer history
         */
        disablePointerHistory() {
            this._isPointerHistoryEnabled = false;
        }

        /**
         * Return pointer history array
         * @returns {Array}
         */
        getHistoryArray() {
            return this._historyArray;
        }

        /**
         * Return true if param is corrent history array element
         * @param historyArrayElement
         * @returns {boolean}
         */
        static isHistoryArrayElementActive(historyArrayElement) {
            return (historyArrayElement.length === HISTORY_ARRAY_ELEMENT_LENGTH);
        }

        /**
         * Return x coordinate form history array element
         * @param historyArrayElement
         * @returns {number}
         */
        static getXCoordinateFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return -9999;

            return historyArrayElement[ARRAY_HISTORY_ELEMENT_X_POSITION];
        }

        /**
         * Return y coordinate form history array element
         * @param historyArrayElement
         * @returns {number}
         */
        static getYCoordinateFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return -9999;

            return historyArrayElement[ARRAY_HISTORY_ELEMENT_Y_POSITION];
        }

        /**
         * Return type of pointer form history array element
         * @param historyArrayElement
         * @param textResult
         * @returns {string|number|null}
         */
        static getPointerTypeFromHistoryArrayElement(historyArrayElement, textResult = true) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) {
                if (textResult) return 'Wrong history array element';
                return null;
            }

            if (historyArrayElement[ARRAY_HISTORY_ELEMENT_POINTER_STYLE]) {
                if (textResult) return 'mouse';
                return 1;
            }

            if (textResult) return 'touch';
            return 0;
        }

        /**
         * Return true if pointer was active form history array element
         * @param historyArrayElement
         * @returns {boolean|null}
         */
        static isPointerActiveFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return null;

            return !!historyArrayElement[ARRAY_HISTORY_ELEMENT_IS_POINTER_ACTIVE];
        }

        /**
         * Return frame time form history array element
         * @param historyArrayElement
         * @returns {number}
         */
        static getPointerFrameTimeFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return -9999;

            return historyArrayElement[ARRAY_HISTORY_ELEMENT_FRAME_TIME];
        }

        /**
         * Return x speed form history array element
         * @param historyArrayElement
         * @returns {number}
         */
        static getSpeedXFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return -9999;

            return historyArrayElement[ARRAY_HISTORY_ELEMENT_SPEED_X];
        }

        /**
         * Return y speed form history array element
         * @param historyArrayElement
         * @returns {number}
         */
        static getSpeedYFromHistoryArrayElement(historyArrayElement) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) return -9999;

            return historyArrayElement[ARRAY_HISTORY_ELEMENT_SPEED_Y];
        }

        /**
         *
         * @param historyArrayElement
         * @param textResult
         * @returns {string|number|null}
         */
        static getActionTypeFromHistoryArrayElement(historyArrayElement, textResult = true) {
            if (!FramePointer.isHistoryArrayElementActive(historyArrayElement)) {
                if (textResult) return 'Wrong history array element';
                return null;
            }

            if (!textResult) return historyArrayElement[ARRAY_HISTORY_ELEMENT_ACTION_TYPE];

            return ACTION_TO_STRING_ARRAY[historyArrayElement[ARRAY_HISTORY_ELEMENT_ACTION_TYPE]];
        }
    }

    return FramePointer;
}());
