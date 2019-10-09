import { FramePointer } from "./FramePointer";
export { FramePointer } from "./FramePointer";

/**
 * Class LandingBuilder
 *
 * Object of this class control all frames and effects between them.
 * Load from server and past in DOM lazy frames
 *
 * TODO: 1) Methods and callbacks for work with menu
 *          - delay for menu switch inactivity
 *       2) Methods and callbacks for work with themes
 *          - delay for theme switch inactivity
 *       3) Callbacks on switching frames
 *          - delay for theme switch inactivity
 *       4) Makes that components works for strike his interface methods like animationFrame() or
 *          stop sequence
 *
 * @type {FrameSwitchEffect}
 */
export const LandingBuilderBase = (function () {
    const DEFAULT_THEME = 0;

    /**
     * Class LandingBuilderBase
     */
    class LandingBuilderBase {
        /**
         * Constructor
         */
        constructor() {
            /**
             * Array of existed landing frames
             * @type {LandingFrame[]}
             * @private
             */
            this._frames = [];
            /**
             * Current active frame
             * @type {LandingFrame}|null
             * @private
             */
            this._activeFrame = null;
            /**
             * Current background frame
             * @type {LandingFrame}|null
             * @private
             */
            this._backGroundFrame = null;
            /**
             * Current menu frame
             * @type {MenuFrame}
             * @private
             */
            this._menuFrame = null;
            /**
             * List of FrameSwitchEffect concrete classes
             * @type {FrameSwitchEffect[]}
             */
            this._frameSwitchEffectClasses = [];
            /**
             * Instance of pointer that working on global window
             * @type {FramePointer}
             * @private
             */
            this._globalPointer = new FramePointer(this, window);
            /**
             * This variable needed to prevent unneeded slide switches when slide effect not end yet
             * @type {boolean}
             * @private
             */
            this._isSwithcAble = true;

            /**
             * Keep current site theme
             * @type {number}
             * @private
             */
            this._currentTheme = DEFAULT_THEME;

            //global pointer callbacks
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
            this._switchCallbaks           = [];

            this._switchThemeCallbacks     = [];

            //Add default switch effect
            //this.addSwitchClass(new DefaultSwitchEffect(this));

            /**
             * Landing builder must proxy window resize event to needed frames
             * TODO: need one time start resize for call one time before debounce
             */
            $(window).resize(_.debounce((event) => {

                if (this.menuFrame) this.menuFrame.prepareResize();
                if (this.activeFrame) this.activeFrame.prepareResize();
                if (this.backGroundFrame) this.backGroundFrame.prepareResize();

                if (this.menuFrame) {
                    this.menuFrame.resize();
                }

                if (!this.activeFrame && !this.backGroundFrame) return;

                if (this.activeFrame && !this.backGroundFrame) {
                    this.activeFrame.resize();
                    return;
                }

                if (!this.activeFrame && this.backGroundFrame) {
                    this.backGroundFrame.resize();
                    return;
                }

                this.activeFrame.resize();
                this.backGroundFrame.resize();
            }, 500));
        }



        /**
         * Hang callback on click event of global pointer
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
         * Hang callback on mouse move event of global pointer
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
         * Hang callback on mouse move with pressed left key event of global pointer
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
         * Hang callback on mouse left button down event of global pointer
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
         * Hang callback on mouse left button up event of global pointer
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
         * Hang callback on touch move event of global pointer
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
         * Hang callback on touch down event of global pointer
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
         * Hang callback on touch up event of global pointer
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
         * Hang callback on pointer move event of global pointer
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
         * Hang callback on active pointer move event of global pointer
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

        /**
         * Hang callback on switching frames
         * @param callback
         * @param isOnce
         */
        onSwitch(callback, isOnce = false) {
            this._switchCallbaks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on switch theme event
         * @param callback
         * @param isOnce
         */
        onSwitchTheme(callback, isOnce = false) {
            this._switchThemeCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Return instance of global pointer
         * @returns {FramePointer}
         */
        getGlobalPointer() {
            return this._globalPointer;
        }

        /**
         *
         * @param object
         */
        addSwitchClass(object) {
            this._frameSwitchEffectClasses.push(object);
        }

        /**
         * Sets landing builder to non switchable mode
         */
        setUnSwitchAble() {
            this._isSwithcAble = false;
        }

        /**
         * Sets landing builder to switchable mode
         */
        setSwitchAble() {
            this._isSwithcAble = true;
        }

        /**
         * Return true if switch process in progress
         * @returns {boolean}
         */
        isSwitchInProgress() {
            return !this._isSwithcAble;
        }

        /**
         *
         */
        start() {
            $(this.activeFrame.frameContainer).velocity({
                opacity: 1
            }, {
                display: "block"
            }).velocity('finish');
            this.activeFrame.startSequence();
            //this.menuFrame.startSequence();
        }

        /**
         * Strike switch callbacks
         * @private
         */
        _strikeSwitchCallbacks() {
            for (let i = 0; i < this._switchCallbaks.length; i++) {
                let currentCallback = this._switchCallbaks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._switchCallbaks.length; i++) {
                if (this._switchCallbaks[i][1])
                    this._switchCallbaks.splice(i--, 1);
            }
        }

        /**
         *
         */
        next() {
            if (!this._isSwithcAble) return false;

            this._isSwithcAble = false;

            let nextFrame = this._findNextFrame();

            if (!nextFrame) return false;

            let switchEffect = this._findSwitchEffect(this.activeFrame.switchEffectName);

            switchEffect.setActiveFrame(this.activeFrame);
            switchEffect.setReplaceFrame(nextFrame);
            switchEffect.setNextDirection();

            switchEffect.onComplete(() => {
                this._isSwithcAble = true;
            }, true);

            this._strikeSwitchCallbacks();

            switchEffect.effectSequence();

            this.activeFrame = nextFrame;
        }

        /**
         *
         */
        prev() {
            if (!this._isSwithcAble) return false;

            this._isSwithcAble = false;

            let prevFrame = this._findPrevFrame();

            if (!prevFrame) return;

            let switchEffect = this._findSwitchEffect(this.activeFrame.switchEffectName);

            switchEffect.setActiveFrame(this.activeFrame);
            switchEffect.setReplaceFrame(prevFrame);
            switchEffect.setPrevDirection();

            switchEffect.onComplete(() => {
                this._isSwithcAble = true;
            }, true);

            this._strikeSwitchCallbacks();

            switchEffect.effectSequence();

            this.activeFrame = prevFrame;
        }

        /**
         *
         * @param frameName
         * @param effectName
         * @param direction
         */
        toFrame(frameName, effectName = null, direction = false) {
            if (!this._isSwithcAble) return false;

            this._isSwithcAble = false;

            let frame = this._findFrameByName(frameName);

            if (!frame) return false;

            if (this.activeFrame.frameContainer.id === frame.frameContainer.id) return false;

            let switchEffect ;

            if (effectName) {
                switchEffect = this._findSwitchEffect(effectName);
            } else {
                switchEffect = this._findSwitchEffect(this.activeFrame.switchEffectName);
            }

            switchEffect.setActiveFrame(this.activeFrame);
            switchEffect.setReplaceFrame(frame);

            if (direction)
                switchEffect.setNextDirection();
            else
                switchEffect.setPrevDirection();

            switchEffect.onComplete(() => {
                this._isSwithcAble = true;
            }, true);

            this._strikeSwitchCallbacks();

            switchEffect.effectSequence();

            this.activeFrame = frame;
        }

        /**
         * Return name of active frame
         */
        getCurrentFrameName() {
            return this.activeFrame.getFrameName();
        }

        /**
         *
         * @param name
         * @returns {FrameSwitchEffect}
         * @private
         */
        _findSwitchEffect(name) {
            for (let i = 1; i < this._frameSwitchEffectClasses.length; i++) {
                let currentSlideEffect = this._frameSwitchEffectClasses[i];

                if (currentSlideEffect.getName() === name) return currentSlideEffect;
            }

            //default effect switcher
            return this._frameSwitchEffectClasses[0];
        }

        /**
         *
         * @returns {LandingFrame}
         * @private
         */
        _findNextFrame() {
            let nextFrame = $(this.activeFrame.frameContainer).data('nextFrame');

            for (let i = 0; i < this.frames.length; i++) {
                let currentFrame = this.frames[i];

                if (currentFrame.frameContainer.id === nextFrame)
                    return currentFrame;
            }

            //TODO: action for load frame from server
        }



        /**
         *
         * @returns {LandingFrame}
         * @private
         */
        _findPrevFrame() {
            let prevFrame = $(this.activeFrame.frameContainer).data('prevFrame');

            for (let i = 0; i < this.frames.length; i++) {
                let currentFrame = this.frames[i];

                if (currentFrame.frameContainer.id === prevFrame)
                    return currentFrame;
            }

            //TODO: action for load frame from server

        }

        /**
         *
         * @param frameId
         * @returns {LandingFrame}
         */
        _findFrameByName(frameId) {
            for (let i = 0; i < this.frames.length; i++) {
                let currentFrame = this.frames[i];

                if (currentFrame.frameContainer.id === frameId)
                    return currentFrame;
            }

            //TODO: load frame from server
        }

        /**
         *
         */
        loadFrame() {

        }

        /**
         *
         * @param frame
         */
        add(frame) {
            //frame.landingBuilder
            this.frames.push(frame);
        }

        /**
         *
         * @param frame
         */
        addBackgroundFrame(frame) {
            this.backGroundFrame = frame;
        }

        /**
         * Set menu frame
         * @param {MenuFrame} menuFrame
         */
        setMenuFrame(menuFrame) {
            this.menuFrame = menuFrame;
        }
    }

    return LandingBuilderBase;
}());