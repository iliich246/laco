/**
 * Class FrameInterface
 *
 * In terms of OOP this class must be abstract
 * He must not be used directly, only via inheritance
 *
 * @type {FrameInterface}
 */
export const FrameInterface = (function () {
    const STATE_OFF   = 0;
    const STATE_BEGIN = 1;
    const STATE_WAIT  = 2;
    const STATE_STOP  = 3;

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

    /**
     * Class FrameInterface
     */
    class FrameInterface {
        /**
         * Constructor
         */
        constructor() {
            /**
             * Keeps state of frame interface object
             * @type {number}
             * @private
             */
            this._state = STATE_OFF;
            /**
             * Array of components of this frame
             * @type {FrameInterface[]}
             */
            this._frameComponents = [];

            /**
             * FrameInterface actions callbacks arrays
             * @type {Array}
             * @private
             */
            this._startBeginCallbacks = [];
            this._startEndCallbacks   = [];
            this._stopBeginCallbacks  = [];
            this._stopEndCallbacks    = [];
            this._waitBeginCallbacks  = [];
            this._waitRetryCallbacks  = [];
            this._waitEndCallbacks    = [];
            this._offCallbacks        = [];

            /**
             * FrameInterface mechanics callbacks arrays
             * @type {Array}
             * @private
             */
            this._resizeCallbacks                 = [];
            this._beforeInitializationCallbacks   = [];
            this._afterInitializationCallbacks    = [];
            this._beforeLoadCallbacks             = [];
            this._afterLoadCallbacks              = [];
            this._onResizeOnDesktopCallbacks      = [];
            this._onResizeOnMobileCallbacks       = [];
            this._onResizeOnBootstrapXlCallbacks  = [];
            this._onResizeOnBootstrapLgCallbacks  = [];
            this._onResizeOnBootstrapMdCallbacks  = [];
            this._onResizeOnBootstrapSmCallbacks  = [];
            this._onResizeOnBootstrapEsmCallbacks = [];

            /**
             * FrameInterface callbacks arrays for use in switch frames mechanism
             * @type {Array}
             * @private
             */
            this._onBeginSwitchCallbacks = [];
            this._onEndSwitchCallbacks   = [];

            /**
             * Keeps true if concrete frame object in active wait sequence
             * @type {boolean}
             * @private
             */
            this._waitSequenceInProcess = false;
            /**
             * Allow new wait sequence iteration
             * @type {boolean}
             * @private
             */
            this._allowWaitIteration = true;
            /**
             * If true next wait sequence will be started without allow
             * @type {boolean}
             * @private
             */
            this._waitRepeat = true;
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
        }

        /**
         * Returns true if frame interface object is on off state
         * @returns {boolean}
         */
        isStateOff() {
            return this._state === STATE_OFF;
        }

        /**
         * Returns true if frame interface object is on begin state
         * @returns {boolean}
         */
        isStateBegin() {
            return this._state === STATE_BEGIN;
        }

        /**
         * Returns true if frame interface object is on wait state
         * @returns {boolean}
         */
        isStateWait() {
            return this._state === STATE_WAIT;
        }

        /**
         * Returns true if frame interface object is on stop state
         * @returns {boolean}
         */
        isStateStop() {
            return this._state === STATE_STOP;
        }

        /**
         * Set frame interface object in off state
         * @returns {FrameInterface}
         * @protected
         */
        _setStateOff() {
            this._state = STATE_OFF;
            return this;
        }

        /**
         * Set frame interface object in begin state
         * @returns {FrameInterface}
         * @protected
         */
        _setStateBegin() {
            this._state = STATE_BEGIN;
            return this;
        }

        /**
         * Set frame interface object in wait state
         * @returns {FrameInterface}
         * @protected
         */
        _setStateWait() {
            this._state = STATE_WAIT;
            return this;
        }

        /**
         * Set frame interface object in stop state
         * @returns {FrameInterface}
         * @protected
         */
        _setStateStop() {
            this._state = STATE_STOP;
            return this;
        }

        /**
         * Hang callback on before initialization event of this frame
         * @param callback
         * @param isOnce
         */
        onBeforeInitialization(callback, isOnce = false) {
            this._beforeInitializationCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on after initialization event of this frame
         * @param callback
         * @param isOnce
         */
        onAfterInitialization(callback, isOnce = false) {
            this._afterInitializationCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used for initialization in inherited class
         * as super.initialization() for trigger events
         */
        initialization() {
            for (let i = 0; i < this._beforeInitializationCallbacks.length; i++) {
                let currentCallback = this._beforeInitializationCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._beforeInitializationCallbacks.length; i++) {
                if (this._beforeInitializationCallbacks[i][1])
                    this._beforeInitializationCallbacks.splice(i--, 1);
            }

            if (FrameInterface.isDesktop()) this._currentDisplayState = CURRENT_DESKTOP;
            if (FrameInterface.isMobile())  this._currentDisplayState = CURRENT_MOBILE;

            if (FrameInterface.isBootstrapXl()) return this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_XL;
            if (FrameInterface.isBootstrapLg()) return this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_LG;
            if (FrameInterface.isBootstrapMd()) return this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_MD;
            if (FrameInterface.isBootstrapSm()) return this._currentBootstrapDisplayState  = CURRENT_BOOTSTRAP_SM;
            if (FrameInterface.isBootstrapEsm()) return this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_ESM;
        }

        /**
         * This method must be called in inherited class after complete initialization
         * of concrete frame as super.initializationComplete()
         */
        initializationComplete() {
            for (let i = 0; i < this._afterInitializationCallbacks.length; i++) {
                let currentCallback = this._afterInitializationCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._afterInitializationCallbacks.length; i++) {
                if (this._afterInitializationCallbacks[i][1])
                    this._afterInitializationCallbacks.splice(i--, 1);
            }
        }

        /**
         * Hang callback on before load event of this frame
         * @param callback
         * @param isOnce
         */
        onBeforeLoad(callback, isOnce = false) {
            this._beforeLoadCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on after load event of this frame
         * @param callback
         * @param isOnce
         */
        onAfterLoad(callback, isOnce = false) {
            this._afterLoadCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used for load various resources in inherited class
         * as super.loadSequence() for trigger events
         */
        loadSequence() {
            for (let i = 0; i < this._beforeLoadCallbacks.length; i++) {
                let currentCallback = this._beforeLoadCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._beforeLoadCallbacks.length; i++) {
                if (this._beforeLoadCallbacks[i][1])
                    this._beforeLoadCallbacks.splice(i--, 1);
            }
        }

        /**
         * This method must be called in inherited class after complete load
         * of concrete frame as super.loadSequenceComplete()
         */
        loadSequenceComplete() {
            for (let i = 0; i < this._afterLoadCallbacks.length; i++) {
                let currentCallback = this._afterLoadCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._afterLoadCallbacks.length; i++) {
                if (this._afterLoadCallbacks[i][1])
                    this._afterLoadCallbacks.splice(i--, 1);
            }
        }

        /**
         * This method must be used for in inherited class as super.resize()
         * for trigger events
         */
        resize() {
            for (let i = 0; i < this._resizeCallbacks.length; i++) {
                let currentCallback = this._resizeCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._resizeCallbacks.length; i++) {
                if (this._resizeCallbacks[i][1])
                    this._resizeCallbacks.splice(i--, 1);
            }

            //check to desktop size
            if (FrameInterface.isDesktop() && this._currentDisplayState !== CURRENT_DESKTOP) {
                this._currentDisplayState = CURRENT_DESKTOP;

                for (let i = 0; i < this._onResizeOnDesktopCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnDesktopCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnDesktopCallbacks.length; i++) {
                    if (this._onResizeOnDesktopCallbacks[i][1])
                        this._onResizeOnDesktopCallbacks.splice(i--, 1);
                }
            }

            //check to mobile size
            if (FrameInterface.isMobile() && this._currentDisplayState !== CURRENT_MOBILE) {
                this._currentDisplayState = CURRENT_MOBILE;

                for (let i = 0; i < this._onResizeOnMobileCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnMobileCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnMobileCallbacks.length; i++) {
                    if (this._onResizeOnMobileCallbacks[i][1])
                        this._onResizeOnMobileCallbacks.splice(i--, 1);
                }
            }

            //check resize to bootstrap xl
            if (FrameInterface.isBootstrapXl() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_XL) {
                this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_XL;

                for (let i = 0; i < this._onResizeOnBootstrapXlCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnBootstrapXlCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnBootstrapXlCallbacks.length; i++) {
                    if (this._onResizeOnBootstrapXlCallbacks[i][1])
                        this._onResizeOnBootstrapXlCallbacks.splice(i--, 1);
                }
            }

            //check resize to bootstrap lg
            if (FrameInterface.isBootstrapLg() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_LG) {
                this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_LG;

                for (let i = 0; i < this._onResizeOnBootstrapLgCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnBootstrapLgCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnBootstrapLgCallbacks.length; i++) {
                    if (this._onResizeOnBootstrapLgCallbacks[i][1])
                        this._onResizeOnBootstrapLgCallbacks.splice(i--, 1);
                }
            }

            //check resize to bootstrap md
            if (FrameInterface.isBootstrapMd() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_MD) {
                this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_MD;

                for (let i = 0; i < this._onResizeOnBootstrapMdCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnBootstrapMdCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnBootstrapMdCallbacks.length; i++) {
                    if (this._onResizeOnBootstrapMdCallbacks[i][1])
                        this._onResizeOnBootstrapMdCallbacks.splice(i--, 1);
                }
            }

            //check resize to bootstrap sm
            if (FrameInterface.isBootstrapSm() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_SM) {
                this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_SM;

                for (let i = 0; i < this._onResizeOnBootstrapSmCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnBootstrapSmCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnBootstrapSmCallbacks.length; i++) {
                    if (this._onResizeOnBootstrapSmCallbacks[i][1])
                        this._onResizeOnBootstrapSmCallbacks.splice(i--, 1);
                }
            }

            //check resize to bootstrap esm
            if (FrameInterface.isBootstrapEsm() && this._currentBootstrapDisplayState !== CURRENT_BOOTSTRAP_ESM) {
                this._currentBootstrapDisplayState = CURRENT_BOOTSTRAP_ESM;

                for (let i = 0; i < this._onResizeOnBootstrapEsmCallbacks.length; i++) {
                    let currentCallback = this._onResizeOnBootstrapEsmCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._onResizeOnBootstrapEsmCallbacks.length; i++) {
                    if (this._onResizeOnBootstrapEsmCallbacks[i][1])
                        this._onResizeOnBootstrapEsmCallbacks.splice(i--, 1);
                }
            }
        }

        /**
         * This method must be implementer in inherited class
         * He makes prepare operations before screen resize
         */
        prepareResize() {

        }

        /**
         * Hang callback on resize event of this frame
         * @param callback
         * @param isOnce
         */
        onResize(callback, isOnce = false) {
            this._resizeCallbacks.push([
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
         * This method add to frame frame component
         * @param {FrameInterface} frameComponent
         */
        addFrameComponent(frameComponent) {
            this._frameComponents.push(frameComponent);
        }

        /**
         * Remove frame component from queue of implementation
         * But not destroy frame component
         * @param {string} name
         */
        removeFrameComponent(name) {
            //TODO: make this method
        }

        /**
         * This method must be used in inherited class as super.animationFrame()
         * and putted in animation frames loop
         * @param {boolean} triggerComponents
         */
        animationFrame(triggerComponents = true) {
            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.animationFrame();
            }
        }

        /**
         * This method must be used in inherited class as super.startBeginConditions()
         * and after that you must put there initial state of begin state
         * all added frame components also will trigger they startBeginConditions() methods
         * @param {boolean} triggerComponents
         */
        startBeginConditions(triggerComponents = true) {
            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.startBeginConditions();
            }
        }

        /**
         * This method must be used in inherited class as super.startSequence()
         * and after that you must put there animation of start state
         * all added frame components also will trigger they startSequence() methods
         * @param {boolean} triggerComponents
         */
        startSequence(triggerComponents = true) {
            this._state = STATE_BEGIN;

            for (let i = 0; i < this._startBeginCallbacks.length; i++) {
                let currentCallback = this._startBeginCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._startBeginCallbacks.length; i++) {
                if (this._startBeginCallbacks[i][1])
                    this._startBeginCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.startSequence();
            }
        }

        /**
         * This method must be used in inherited class as super.startImmediately()
         * and after that you must put start state end without animation
         * all added frame components also will trigger they startImmediately() methods
         * @param {boolean} triggerComponents
         */
        startImmediately(triggerComponents = true) {
            this._state = STATE_BEGIN;

            for (let i = 0; i < this._startBeginCallbacks.length; i++) {
                let currentCallback = this._startBeginCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._startBeginCallbacks.length; i++) {
                if (this._startBeginCallbacks[i][1])
                    this._startBeginCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.startImmediately();
            }
        }

        /**
         * This method must be used in inherited class as super.startSequenceComplete()
         * He trigger startEndCallbacks for this frame
         * all added frame components also will trigger they startSequenceComplete() methods
         * @param {boolean} triggerComponents
         */
        startSequenceComplete(triggerComponents = true) {
            this._state = STATE_WAIT;

            for (let i = 0; i < this._startEndCallbacks.length; i++) {
                let currentCallback = this._startEndCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._startEndCallbacks.length; i++) {
                if (this._startEndCallbacks[i][1])
                    this._startEndCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.startSequenceComplete();
            }
        }

        /**
         * Hang callback on start begin event of this frame
         * @param callback
         * @param isOnce
         */
        onStartBegin(callback, isOnce = false) {
            this._startBeginCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on start end event of this frame
         * @param callback
         * @param isOnce
         */
        onStartEnd(callback, isOnce = false) {
            this._startEndCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used in inherited class as super.stopSequence()
         * and after that you must put there animation of stop state
         * all added frame components also will trigger they stopSequence() methods
         * @param {boolean} triggerComponents
         */
        stopSequence(triggerComponents = true) {
            this._state = STATE_STOP;

            for (let i = 0; i < this._stopBeginCallbacks.length; i++) {
                let currentCallback = this._stopBeginCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._stopBeginCallbacks.length; i++) {
                if (this._stopBeginCallbacks[i][1])
                    this._stopBeginCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.stopSequence();
            }
        }

        /**
         * This method must be used in inherited class as super.stopSequenceCompleted()
         * He trigger stopEndCallbacks for this frame
         * all added frame components also will trigger they stopSequenceCompleted() methods
         * @param {boolean} triggerComponents
         */
        stopSequenceCompleted(triggerComponents = true) {
            this._state = STATE_OFF;

            for (let i = 0; i < this._stopEndCallbacks.length; i++) {
                let currentCallback = this._stopEndCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._stopEndCallbacks.length; i++) {
                if (this._stopEndCallbacks[i][1])
                    this._stopEndCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.stopSequenceCompleted();
            }
        }

        /**
         * This method must be used in inherited class as super.stopImmediately()
         * and after that you must put stop state end without animation
         * all added frame components also will trigger they stopImmediately() methods
         * @param {boolean} triggerComponents
         */
        stopImmediately(triggerComponents = true) {
            this._state = STATE_OFF;

            for (let i = 0; i < this._stopEndCallbacks.length; i++) {
                let currentCallback = this._stopEndCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._stopEndCallbacks.length; i++) {
                if (this._stopEndCallbacks[i][1])
                    this._stopEndCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.stopImmediately();
            }
        }

        /**
         * This method must be used in inherited class as super.stopEndConditions()
         * and after that you must put there end state of stop state
         * all added frame components also will trigger they stopEndConditions() methods
         * @param {boolean} triggerComponents
         */
        stopEndConditions(triggerComponents = true) {
            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.stopEndConditions();
            }
        }

        /**
         * Hang callback on stop begin event of this frame
         * @param callback
         * @param isOnce
         */
        onStopBegin(callback, isOnce = true) {
            this._stopBeginCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on stop end event of this frame
         * @param callback
         * @param isOnce
         */
        onStopEnd(callback, isOnce = true) {
            this._stopEndCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used in inherited class as super.waitBeginConditions()
         * and after that you must put there initial state of wait state
         * all added frame components also will trigger they waitBeginConditions() methods
         * @param {boolean} triggerComponents
         */
        waitBeginConditions(triggerComponents = true) {
            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.waitBeginConditions();
            }
        }

        /**
         * This method must be used in inherited class as super.waitSequence()
         * and after that you must put there initial state of reset wait state (after resize for example)
         * all added frame components also will trigger they waitSequence() methods
         * @param {boolean} triggerComponents
         */
        waitResetConditions(triggerComponents = true) {
            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.waitResetConditions();
            }
        }

        /**
         * This method must be used in inherited class as super.waitSequence()
         * and after that you must put there animation of wait state
         * all added frame components also will trigger they waitSequence() methods
         * @param {boolean} triggerComponents
         */
        waitSequence(triggerComponents = true) {
            this._state = STATE_WAIT;

            this._waitSequenceInProcess = true;

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.waitSequence();
            }
        }

        /**
         * This method must be used in inherited class as super.waitSequenceCompleted()
         * He trigger _waitEndCallbacks for this frame interface object
         * all added frame components also will trigger they waitSequenceCompleted() methods
         * @param {boolean} triggerComponents
         */
        waitSequenceCompleted(triggerComponents = true) {
            this._waitSequenceInProcess = false;

            for (let i = 0; i < this._waitEndCallbacks.length; i++) {
                let currentCallback = this._waitEndCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._waitEndCallbacks.length; i++) {
                if (this._waitEndCallbacks[i][1])
                    this._waitEndCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.waitSequenceCompleted();
            }
        }

        /**
         * Returns true if  wait iteration in progress
         * @returns {boolean}
         */
        isWaitIterationInProgress() {
            return this._waitSequenceInProcess;
        }

        /**
         * Allow new wait iteration
         * @returns {FrameInterface}
         */
        allowWaitIteration() {
            this._allowWaitIteration = true;
            return this;
        }

        /**
         * Disallow new wait iteration
         * @returns {FrameInterface}
         */
        disallowWaitIteration() {
            this._allowWaitIteration = false;
            return this;
        }

        /**
         * Returns true if new wait iteration allowed
         * @returns {boolean}
         */
        isWaitIterationAllowed() {
            return this._allowWaitIteration;
        }

        /**
         * Hang callback on wait begin event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onWaitBegin(callback, isOnce = true) {
            this._waitBeginCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on wait retry event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onWaitRetry(callback, isOnce = true) {
            this._waitRetryCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on wait end event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onWaitEnd(callback, isOnce = true) {
            this._waitEndCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used in inherited class as super.offSequence()
         * He trigger offCallbacks for this frame interface object
         * all added frame components also will trigger they offSequence() methods
         * @param {boolean} triggerComponents
         */
        offSequence(triggerComponents = true) {
            this._state = STATE_OFF;

            for (let i = 0; i < this._offCallbacks.length; i++) {
                let currentCallback = this._offCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._offCallbacks.length; i++) {
                if (this._offCallbacks[i][1])
                    this._offCallbacks.splice(i--, 1);
            }

            if (!triggerComponents) return;

            for (let i = 0; i < this._frameComponents.length; i++) {
                let currentComponent = this._frameComponents[i];

                currentComponent.offSequence();
            }
        }

        /**
         * Hang callback on off event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onOff(callback, isOnce = true) {
            this._offCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on begin switch frame event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onBeginSwitch(callback, isOnce = true) {
            this._onBeginSwitchCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on end switch frame event of this frame interface object
         * @param callback
         * @param isOnce
         */
        onEndSwitch(callback, isOnce = true) {
            this._onEndSwitchCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be implemented in inherited class
         * Must return local pointer for this frame
         */
        getPointer() {

        }

        /**
         * This method must be implemented in inherited class
         * Must return global pointer for landing builder owner
         */
        getGlobalPointer() {

        }

        /**
         * This method must be implemented in inherited class
         * Return string name of frame
         * @returns {string}
         */
        getFrameName() {
            return 'NULL';
        }

        /**
         * Return true if desktop resolution
         * @returns {boolean}
         */
        static isDesktop() {
            return window.innerWidth > MAX_MOBILE_RESOLUTION;
        }

        /**
         * Return true if mobile resolution
         * @returns {boolean}
         */
        static isMobile() {
            return window.innerWidth <= MAX_MOBILE_RESOLUTION;
        }

        /**
         * Return true if bootstrap xl resolution
         * @returns {boolean}
         */
        static isBootstrapXl() {
            return window.innerWidth >= BOOTSTRAP_XL;
        }

        /**
         * Return true if bootstrap lg resolution
         * @returns {boolean}
         */
        static isBootstrapLg() {
            return window.innerWidth < BOOTSTRAP_XL && window.innerWidth >= BOOTSTRAP_LG;
        }

        /**
         * Return true if bootstrap md resolution
         * @returns {boolean}
         */
        static isBootstrapMd() {
            return window.innerWidth < BOOTSTRAP_LG && window.innerWidth >= BOOTSTRAP_MD;
        }

        /**
         * Return true if bootstrap sm resolution
         * @returns {boolean}
         */
        static isBootstrapSm() {
            return window.innerWidth < BOOTSTRAP_MD && window.innerWidth >= BOOTSTRAP_SM;
        }

        /**
         * Return true if bootstrap esm resolution
         * @returns {boolean}
         */
        static isBootstrapEsm() {
            return window.innerWidth < BOOTSTRAP_SM;
        }
    }

    return FrameInterface;
}());
