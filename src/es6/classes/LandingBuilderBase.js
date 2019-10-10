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
    const MAX_MOBILE_RESOLUTION = 768;

    const CURRENT_DESKTOP = 0;
    const CURRENT_MOBILE  = 1;

    const CURRENT_BOOTSTRAP_XL  = 0;
    const CURRENT_BOOTSTRAP_LG  = 1;
    const CURRENT_BOOTSTRAP_MD  = 2;
    const CURRENT_BOOTSTRAP_SM  = 3;
    const CURRENT_BOOTSTRAP_ESM = 4;

    const BOOTSTRAP_XL = 1200;
    const BOOTSTRAP_LG = 992;
    const BOOTSTRAP_MD = 768;
    const BOOTSTRAP_SM = 576;

    const DEFAULT_THEME = 0;

    const DEFAULT_RESIZE_DEBOUNCE = 200;

    /**
     * Class LandingBuilderBase
     */
    class LandingBuilderBase {
        /**
         * Constructor
         */
        constructor(config) {
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
             * Keeps state of previous display size
             * Needed for correct trigger onSwitchOnMobile and onSwitchOnDesktop events
             * @type {number}
             * @private
             */
            this._currentDisplayState = 0;
            /**
             * Keeps state of previous bootstrap display size
             * Needed for correct trigger bootstrap resize events
             * @type {number}
             * @private
             */
            this._currentBootstrapDisplayState = 0;
            /**
             * Keep current site theme
             * @type {number}
             * @private
             */
            this._currentTheme = DEFAULT_THEME;
            /**
             * For keep state of resize prepare
             * @type {boolean}
             * @private
             */
            this._isResizePrepared = false;

            /**
            * Group of resize callbacks arrays
            */
            this._onResizeCallbacks               = [];
            this._onPrepareResizeCallbacks        = [];
            this._onResizeOnDesktopCallbacks      = [];
            this._onResizeOnMobileCallbacks       = [];
            this._onResizeOnBootstrapXlCallbacks  = [];
            this._onResizeOnBootstrapLgCallbacks  = [];
            this._onResizeOnBootstrapMdCallbacks  = [];
            this._onResizeOnBootstrapSmCallbacks  = [];
            this._onResizeOnBootstrapEsmCallbacks = [];

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


        }

        /**
         *
         * @param triggerComponents
         */
        initialization(triggerComponents = true) {
            if (this.isDesktop()) this._currentDisplayState = CURRENT_DESKTOP;
            else if (this.isMobile()) this._currentDisplayState = CURRENT_MOBILE;

            if (this.isBootstrapXl())       this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_XL;
            else if (this.isBootstrapLg())  this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_LG;
            else if (this.isBootstrapMd())  this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_MD;
            else if (this.isBootstrapSm())  this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_SM;
            else if (this.isBootstrapEsm()) this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_ESM;

            let debouncedResize = _.debounce((event) => {
                this._isResizePrepared = false;

                for (let i = 0; i < this._onResizeCallbacks.length; i++) {
                    let currentCallback = this._onResizeCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeCallbacks.length; i++) {
                    if (this._onResizeCallbacks[i][1])
                        this._onResizeCallbacks.splice(i--, 1);
                }

                //check to desktop size
                if (this.isDesktop() && this._currentDisplayState !== CURRENT_DESKTOP) {
                    this._currentDisplayState = CURRENT_DESKTOP;

                    for (let i = 0; i < this._onResizeOnDesktopCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnDesktopCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnDesktopCallbacks.length; i++) {
                        if (this._onResizeOnDesktopCallbacks[i][1])
                            this._onResizeOnDesktopCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeDesktop();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeDesktop();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeDesktop();
                }

                //check to mobile size
                if (this.isMobile() && this._currentDisplayState !== CURRENT_MOBILE) {
                    this._currentDisplayState = CURRENT_MOBILE;

                    for (let i = 0; i < this._onResizeOnMobileCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnMobileCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnMobileCallbacks.length; i++) {
                        if (this._onResizeOnMobileCallbacks[i][1])
                            this._onResizeOnMobileCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeMobile();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeMobile();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeMobile();
                }

                //check resize to bootstrap xl
                if (this.isBootstrapXl() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_XL) {
                    this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_XL;

                    for (let i = 0; i < this._onResizeOnBootstrapXlCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnBootstrapXlCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnBootstrapXlCallbacks.length; i++) {
                        if (this._onResizeOnBootstrapXlCallbacks[i][1])
                            this._onResizeOnBootstrapXlCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeBootstrapXl();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeBootstrapXl();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeBootstrapXl();
                }

                //check resize to bootstrap lg
                if (this.isBootstrapLg() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_LG) {
                    this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_LG;

                    for (let i = 0; i < this._onResizeOnBootstrapLgCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnBootstrapLgCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnBootstrapLgCallbacks.length; i++) {
                        if (this._onResizeOnBootstrapLgCallbacks[i][1])
                            this._onResizeOnBootstrapLgCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeBootstrapLg();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeBootstrapLg();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeBootstrapLg();
                }

                //check resize to bootstrap md
                if (this.isBootstrapMd() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_MD) {
                    this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_MD;

                    for (let i = 0; i < this._onResizeOnBootstrapMdCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnBootstrapMdCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnBootstrapMdCallbacks.length; i++) {
                        if (this._onResizeOnBootstrapMdCallbacks[i][1])
                            this._onResizeOnBootstrapMdCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeBootstrapMd();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeBootstrapMd();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeBootstrapMd();
                }

                //check resize to bootstrap sm
                if (this.isBootstrapSm() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_SM) {
                    this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_SM;

                    for (let i = 0; i < this._onResizeOnBootstrapSmCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnBootstrapSmCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnBootstrapSmCallbacks.length; i++) {
                        if (this._onResizeOnBootstrapSmCallbacks[i][1])
                            this._onResizeOnBootstrapSmCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeBootstrapSm();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeBootstrapSm();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeBootstrapSm();
                }

                //check resize to bootstrap esm
                if (this.isBootstrapEsm() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_ESM) {
                    this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_ESM;

                    for (let i = 0; i < this._onResizeOnBootstrapEsmCallbacks.length; i++) {
                        let currentCallback = this._onResizeOnBootstrapEsmCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._onResizeOnBootstrapEsmCallbacks.length; i++) {
                        if (this._onResizeOnBootstrapEsmCallbacks[i][1])
                            this._onResizeOnBootstrapEsmCallbacks.splice(i--, 1);
                    }

                    if (this._menuFrame)
                        this._menuFrame._strikeOnResizeBootstrapEsm();

                    if (this._activeFrame)
                        this._activeFrame._strikeOnResizeBootstrapEsm();

                    if (this._backGroundFrame)
                        this._backGroundFrame._strikeOnResizeBootstrapEsm();
                }

                if (this._menuFrame)
                    this._menuFrame.resize(event);

                if (this._activeFrame)
                    this._activeFrame.resize(event);

                if (this._backGroundFrame)
                    this._backGroundFrame.resize(event);
            }, DEFAULT_RESIZE_DEBOUNCE);

            window.onresize = (event) => {
                debouncedResize(event);

                if (this._isResizePrepared) return;

                this._isResizePrepared = true;

                for (let i = 0; i < this._onPrepareResizeCallbacks.length; i++) {
                    let currentCallback = this._onPrepareResizeCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onPrepareResizeCallbacks.length; i++) {
                    if (this._onPrepareResizeCallbacks[i][1])
                        this._onPrepareResizeCallbacks.splice(i--, 1);
                }

                if (this._menuFrame) this._menuFrame.prepareResize();
                if (this._activeFrame) this._activeFrame.prepareResize();
                if (this._backGroundFrame) this._backGroundFrame.prepareResize();
            };

            if (!triggerComponents) return;

            if (this._activeFrame)
                this._activeFrame.initialization();

            if (this._menuFrame)
                this._menuFrame.initialization();

            if (this._backGroundFrame)
                this._backGroundFrame.initialization();
        }

        /**
         * Set active frame
         * @param activeFrame
         */
        setActiveFrame(activeFrame) {
            this._activeFrame = activeFrame;
        }

        /**
         * Set menu frame
         * @param {MenuFrame} menuFrame
         */
        setMenuFrame(menuFrame) {
            this._menuFrame = menuFrame;
        }

        /**
         * Set background frame
         * @param backGroundFrame
         */
        setBackGroundFrame(backGroundFrame) {
            this._backGroundFrame = backGroundFrame;
        }

        /**
         * Add
         * @param frame
         */
        addFrame(frame) {
            //Check on same frames
            this._frames.push(frame);
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
        addBackgroundFrame(frame) {
            this.backGroundFrame = frame;
        }

        /**
         * Hang callback on resize event
         * @param callback
         * @param isOnce
         */
        onResize(callback, isOnce = false) {
            this._onResizeCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hand callback on prepare resize event
         * @param callback
         * @param isOnce
         */
        omPrepareResize(callback, isOnce = false) {
            this._onPrepareResizeCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in desktop from mobile
         * @param callback
         * @param isOnce
         */
        onResizeOnDesktop(callback, isOnce = false) {
            this._onResizeOnDesktopCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in mobile from desktop
         * @param callback
         * @param isOnce
         */
        onResizeOnMobile(callback, isOnce = false) {
            this._onResizeOnMobileCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in Xl bootstrap from other
         * @param callback
         * @param isOnce
         */
        onResizeOnBootstrapXl(callback, isOnce = false) {
            this._onResizeOnBootstrapXlCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in Lg bootstrap from other
         * @param callback
         * @param isOnce
         */
        onResizeOnBootstrapLg(callback, isOnce = false) {
            this._onResizeOnBootstrapLgCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in Md bootstrap from other
         * @param callback
         * @param isOnce
         */
        onResizeOnBootstrapMd(callback, isOnce = false) {
            this._onResizeOnBootstrapMdCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in Sm bootstrap from other
         * @param callback
         * @param isOnce
         */
        onResizeOnBootstrapSm(callback, isOnce = false) {
            this._onResizeOnBootstrapSmCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on resize event of this frame
         * when size was switched in Esm bootstrap from other
         * @param callback
         * @param isOnce
         */
        onResizeOnBootstrapEsm(callback, isOnce = false) {
            this._onResizeOnBootstrapEsmCallbacks.push([
                callback,
                isOnce
            ]);
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
         * Return true if device in desktop resolution
         * @returns {boolean}
         */
        isDesktop() {
            return window.innerWidth > MAX_MOBILE_RESOLUTION;
        }

        /**
         * Return true if device in mobile resolution
         * @returns {boolean}
         */
        isMobile() {
            return window.innerWidth <= MAX_MOBILE_RESOLUTION;
        }

        /**
         * Return true if device in bootstrap xl resolution
         * @returns {boolean}
         */
        isBootstrapXl() {
            return window.innerWidth >= BOOTSTRAP_XL;
        }

        /**
         * Return true if device in bootstrap lg resolution
         * @returns {boolean}
         */
        isBootstrapLg() {
            return window.innerWidth < BOOTSTRAP_XL && window.innerWidth >= BOOTSTRAP_LG;
        }

        /**
         * Return true if device in bootstrap md resolution
         * @returns {boolean}
         */
        isBootstrapMd() {
            return window.innerWidth < BOOTSTRAP_LG && window.innerWidth >= BOOTSTRAP_MD;
        }

        /**
         * Return true if device in bootstrap sm resolution
         * @returns {boolean}
         */
        isBootstrapSm() {
            return window.innerWidth < BOOTSTRAP_MD && window.innerWidth >= BOOTSTRAP_SM;
        }

        /**
         * Return true if device in bootstrap esm resolution
         * @returns {boolean}
         */
        isBootstrapEsm() {
            return window.innerWidth < BOOTSTRAP_SM;
        }
    }

    return LandingBuilderBase;
}());