/**
 * Class FrameSwitchEffect
 *
 * This is base class of switch effects.
 * He must not be used directly, only via inheritance
 *
 * @type {FrameSwitchEffect}
 */
export const FrameSwitchEffect = (function () {
    const DIRECTION_NEXT = 0;
    const DIRECTION_PREV = 1;

    const GLOBAL_SWITCH_DURATION = 3000;

    class FrameSwitchEffect {
        /**
         * Constructor
         * @param {LandingBuilderBase} landingBuilder
         * @param {LandingFrame[]|null} frames
         * @param {LandingFrame|null} activeFrame
         * @param {LandingFrame|null} replaceFrame
         */
        constructor(landingBuilder, frames = null, activeFrame = null, replaceFrame = null) {
            /**
             * Array of existed landing frames
             * @type {LandingFrame[]}
             */
            this._frames = frames;
            /**
             * Current active frame
             * @type {LandingFrame}|null
             */
            this._activeFrame = activeFrame;
            /**
             * Frame on that must be replaced active frame
             * @type {LandingFrame}|null
             */
            this._replaceFrame = replaceFrame;
            /**
             * Name of search effect for searching in list
             * @type string|null
             */
            this._name = null;
            /**
             * Instance of LandingBuilderBase aggregator of this class
             * @type {LandingBuilderBase}
             */
            this._landingBuilder = landingBuilder;
            /**
             * Direction of effect
             * @type {number}
             * @private
             */
            this._direction = DIRECTION_NEXT;
            /**
             * Keeps true if effect in progress
             * @type {boolean}
             * @private
             */
            this._inProcess = false;
            /**
             * Duration of frame switch effect
             * @type {number}
             * @private
             */
            this._effectDuration = GLOBAL_SWITCH_DURATION;

            /**
             * FrameSwitchEffect callbacks arrays
             * @type {Array}
             * @private
             */
            this._beginCallbacks = [];
            this._completeCallbacks = [];
        }

        /**
         * Return instance of aggregator
         * @returns {LandingBuilderBase}
         */
        getLandingBuilder() {
            return this._landingBuilder;
        }

        /**
         * Return name of the effect
         * @returns {string}
         */
        getName() {
            return this._name;
        }

        /**
         * Set switch duration
         * @param duration
         */
        setDuration(duration) {
            this._effectDuration = duration;
        }

        /**
         * Duration getter
         * @returns {number}
         */
        getDuration()
        {
            return this._effectDuration;
        }

        /**
         * Sets all frames
         * @param {LandingFrame[]} frames
         * @returns {FrameSwitchEffect}
         */
        setFrames(frames) {
            this._frames = frames;
            return this;
        }

        /**
         * Sets current active frame
         * @param {LandingFrame} activeFrame
         * @returns {FrameSwitchEffect}
         */
        setActiveFrame(activeFrame) {
            this._activeFrame = activeFrame;
            return this;
        }

        /**
         * Sets frame that must be raplaced
         * @param {LandingFrame} replaceFrame
         * @returns {FrameSwitchEffect}
         */
        setReplaceFrame(replaceFrame) {
            this._replaceFrame = replaceFrame;
            return this;
        }

        /**
         * Sets next direction of object
         * @returns {FrameSwitchEffect}
         */
        setNextDirection() {
            this._direction = DIRECTION_NEXT;
            return this;
        }

        /**
         * Sets prev direction of object
         * @returns {FrameSwitchEffect}
         */
        setPrevDirection() {
            this._direction = DIRECTION_PREV;
            return this;
        }

        /**
         * Returns true if object direction is next
         * @returns {boolean}
         */
        isDirectionNext() {
            return this._direction === DIRECTION_NEXT;
        }

        /**
         * Returns false if object direction is prev
         * @returns {boolean}
         */
        isDirectionPrev() {
            return this._direction === DIRECTION_PREV;
        }

        /**
         * Returns true if effect in process
         * @returns {boolean}
         */
        isInProcess() {
            return this._inProcess;
        }

        /**
         * Hang callback on begin of this switch frame object
         * @param callback
         * @param isOnce
         */
        onBegin(callback, isOnce = false) {
            this._beginCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Hang callback on complete of this switch frame object
         * @param callback
         * @param isOnce
         */
        onComplete(callback, isOnce = false) {
            this._completeCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * This method must be used in inherited class as super.effectStartConditions()
         * and after that you must put there initial state of concrete slide effect
         */
        effectBeginConditions() {

        }

        /**
         * This method must be used in inherited class as super.effectSequence()
         * and after that you must put there animation of effect
         */
        effectSequence() {
            this._inProcess = true;

            for (let i = 0; i < this._beginCallbacks.length; i++) {
                let currentCallback = this._beginCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._beginCallbacks.length; i++) {
                if (this._beginCallbacks[i][1])
                    this._beginCallbacks.splice(i--, 1);
            }

            for (let i = 0; i < this._activeFrame._onBeginSwitchCallbacks.length; i++) {
                let currentCallback = this._onBeginSwitchCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._activeFrame._onBeginSwitchCallbacks.length; i++) {
                if (this._onBeginSwitchCallbacks[i][1])
                    this._onBeginSwitchCallbacks.splice(i--, 1);
            }

            for (let i = 0; i < this._replaceFrame._onBeginSwitchCallbacks.length; i++) {
                let currentCallback = this._onBeginSwitchCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._replaceFrame._onBeginSwitchCallbacks.length; i++) {
                if (this._onBeginSwitchCallbacks[i][1])
                    this._onBeginSwitchCallbacks.splice(i--, 1);
            }
        }

        /**
         * This method must be used in inherited class as super.effectImmediately()
         * and after that you must put effect state end without animation
         */
        effectImmediately() {
            this._inProcess = false;

            for (let i = 0; i < this._completeCallbacks.length; i++) {
                let currentCallback = this._completeCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._completeCallbacks.length; i++) {
                if (this._completeCallbacks[i][1])
                    this._completeCallbacks.splice(i--, 1);
            }
        }

        /**
         * This method must be used in inherited class as super.effectSequenceComplete()
         * He trigger completeCallbacks for this frame
         */
        effectSequenceComplete() {
            this._inProcess = false;

            for (let i = 0; i < this._completeCallbacks.length; i++) {
                let currentCallback = this._completeCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._completeCallbacks.length; i++) {
                if (this._completeCallbacks[i][1])
                    this._completeCallbacks.splice(i--, 1);
            }

            for (let i = 0; i < this._activeFrame._onEndSwitchCallbacks.length; i++) {
                let currentCallback = this._onBeginSwitchCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._activeFrame._onEndSwitchCallbacks.length; i++) {
                if (this._onBeginSwitchCallbacks[i][1])
                    this._onBeginSwitchCallbacks.splice(i--, 1);
            }

            for (let i = 0; i < this._replaceFrame._onEndSwitchCallbacks.length; i++) {
                let currentCallback = this._onBeginSwitchCallbacks[i][0];

                currentCallback(this);
            }

            for (let i = 0; i < this._replaceFrame._onEndSwitchCallbacks.length; i++) {
                if (this._onBeginSwitchCallbacks[i][1])
                    this._onBeginSwitchCallbacks.splice(i--, 1);
            }
        }
    }

    return FrameSwitchEffect;
}());