import { FrameInterface } from "./FrameInterface";
import { FramePointer } from "./FramePointer";

/**
 * Class LandingFrameComponent
 *
 * @type {LandingFrameComponent}
 */
export const LandingFrameComponent = (function () {
    const HOVER_MODE_EXTERNAL = 0;//default mode
    const HOVER_MODE_INTERNAL = 1;

    /**
     * Class LandingFrameComponent
     */
    class LandingFrameComponent extends FrameInterface {
        /**
         *
         * @param {LandingFrame} landingFrame
         */
        constructor(landingFrame) {
            super(landingFrame.getLandingBuilder());
            /**
             *
             * @type {LandingFrame}
             * @private
             */
            this._landingFrame = landingFrame;

            this._localPointer = {};

            this._localPointer.x              = 0;
            this._localPointer.y              = 0;
            this._localPointer._mouseIsActive = false;
            this._localPointer._mouseX        = 0;
            this._localPointer._mouseY        = 0;
            this._localPointer._touchIsActive = false;
            this._localPointer._touchX        = 0;
            this._localPointer._touchY        = 0;

            this._hoverMode = HOVER_MODE_EXTERNAL;

            //local pointer callbacks
            this._mouseMoveCallbacks         = [];
            this._mouseActiveMoveCallbacks   = [];
            this._mouseDownCallbacks         = [];
            this._mouseUpCallbacks           = [];
            this._touchMoveCallbacks         = [];
            this._touchDownCallbacks         = [];
            this._touchUpCallbacks           = [];
            this._pointerMoveCallbacks       = [];
            this._pointerDownCallbacks       = [];
            this._pointerUpCallbacks         = [];
            this._pointerActiveMoveCallbacks = [];
            this._clickCallbacks             = [];

            //hover callbacks
            this._pointerOnHoverBeginCallbacks = [];
            this._pointerOnHoverEndCallbacks   = [];
            this._pointerOnHoverCallbacks      = [];

            //is hover bool variable
            this._isPointerHovered = false;
        }

        /**
         * Method switch component in external hover mode
         * @return void
         */
        setHoverModeExternal() {
            this._hoverMode = HOVER_MODE_EXTERNAL;
        }

        /**
         * Method switch component in internal hover mode
         * @return void
         */
        setHoverModeInternal() {
            this._hoverMode = HOVER_MODE_INTERNAL;
        }

        /**
         * Return absolute x coordinate of this component regarding parent frame
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         * @return {null|int}
         */
        getAbsCoordX() {
            if (this.getLandingBuilder().isConsoleAlertsEnabled() && this._hoverMode === HOVER_MODE_INTERNAL)
                console.log('This method like interface and must be implemented in inherited class');

            return null;
        }

        /**
         * Return absolute y coordinate of this component regarding parent frame
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         * @return {null|int}
         */
        getAbsCoordY() {
            if (this.getLandingBuilder().isConsoleAlertsEnabled() && this._hoverMode === HOVER_MODE_INTERNAL)
                console.log('This method like interface and must be implemented in inherited class');

            return null;
        }

        /**
         * Return height of this component
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         * @return {null|int}
         */
        getComponentHeight() {
            if (this.getLandingBuilder().isConsoleAlertsEnabled() && this._hoverMode === HOVER_MODE_INTERNAL)
                console.log('This method like interface and must be implemented in inherited class');

            return null;
        }

        /**
         * Return width of this component
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         * @return {null|int}
         */
        getComponentWidth() {
            if (this.getLandingBuilder().isConsoleAlertsEnabled() && this._hoverMode === HOVER_MODE_INTERNAL)
                console.log('This method like interface and must be implemented in inherited class');

            return null;
        }

        /**
         * Return LandingBuilder of parent frame
         * @returns {LandingBuilderBase}
         */
        getLandingBuilder() {
            return this._landingFrame.getLandingBuilder();
        }

        /**
         * On click on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onClick(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._clickCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onClick((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this._localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            });
        }

        /**
         * This method for proxy click event from any animation framework to laco
         * @return void
         */
        externalClick() {
            this._strikeClick();
            this._localPointer.x = this.getPointer().x;
            this._localPointer.y = this.getPointer().y;
        }

        /**
         * Uses for strike laco click event in external hover mode
         * @private
         * @return void
         */
        _strikeClick() {
            for (let i = 0; i < this._clickCallbacks.length; i++) {
                let currentCallback = this._clickCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._clickCallbacks.length; i++) {
                if (this._clickCallbacks[i][1])
                    this._clickCallbacks.splice(i--, 1);
            }
        }

        /**
         * On mouse move on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onMouseMove(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._mouseMoveCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onMouseMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseX = -this.getAbsCoordX() + pointer._mouseX;
                    this._localPointer._mouseY = -this.getAbsCoordY() + pointer._mouseY;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy click mouse move from any animation framework to laco
         * @return void
         */
        externalMouseMove() {
            this._strikeMouseMove();
            this._localPointer._mouseX = this.getPointer()._mouseX;
            this._localPointer._mouseY = this.getPointer()._mouseY;
        }

        /**
         * Uses for strike laco mouse move event in external hover mode
         * @private
         * @return void
         */
        _strikeMouseMove() {
            for (let i = 0; i < this._mouseMoveCallbacks.length; i++) {
                let currentCallback = this._mouseMoveCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._mouseMoveCallbacks.length; i++) {
                if (this._mouseMoveCallbacks[i][1])
                    this._mouseMoveCallbacks.splice(i--, 1);
            }
        }

        /**
         * On active move move on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onActiveMouseMove(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._mouseActiveMoveCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onActiveMouseMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseX = -this.getAbsCoordX() + pointer._mouseX;
                    this._localPointer._mouseY = -this.getAbsCoordY() + pointer._mouseY;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy click active mouse move from any animation framework to laco
         * @return void
         */
        externalActiveMouseMove() {
            //TODO: check for mouse button active
            this._strikeActiveMouseMove();
            this._localPointer._mouseX = this.getPointer()._mouseX;
            this._localPointer._mouseY = this.getPointer()._mouseY;
        }

        /**
         * Uses for strike laco active mouse move event in external hover mode
         * @private
         */
        _strikeActiveMouseMove() {
            for (let i = 0; i < this._mouseActiveMoveCallbacks.length; i++) {
                let currentCallback = this._mouseActiveMoveCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._mouseActiveMoveCallbacks.length; i++) {
                if (this._mouseActiveMoveCallbacks[i][1])
                    this._mouseActiveMoveCallbacks.splice(i--, 1);
            }
        }

        /**
         * On mouse down on this component
         * @param callback
         * @param isOnce
         */
        onMouseDown(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._mouseDownCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onMouseDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseIsActive = true;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy click mouse down from any animation framework to laco
         * @return void
         */
        externalMouseDown() {
            this._strikeMouseDown();
            this._localPointer._mouseIsActive = true;
        }

        /**
         * Uses for strike laco mouse down event in external hover mode
         * @private
         * @return void
         */
        _strikeMouseDown() {
            for (let i = 0; i < this._mouseDownCallbacks.length; i++) {
                let currentCallback = this._mouseDownCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._mouseDownCallbacks.length; i++) {
                if (this._mouseDownCallbacks[i][1])
                    this._mouseDownCallbacks.splice(i--, 1);
            }
        }

        /**
         * On mouse up on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onMouseUp(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._mouseUpCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onMouseDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy mouse up event from any animation framework to laco
         * @return void
         */
        externalMouseUp() {
            this._strikeMouseUp();
            this._localPointer._mouseIsActive = false;
        }

        /**
         * Uses for strike laco mouse up event in external hover mode
         * @private
         * @return void
         */
        _strikeMouseUp() {
            for (let i = 0; i < this._mouseUpCallbacks.length; i++) {
                let currentCallback = this._mouseUpCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._mouseUpCallbacks.length; i++) {
                if (this._mouseUpCallbacks[i][1])
                    this._mouseUpCallbacks.splice(i--, 1);
            }
        }

        /**
         * On touch move on this component
         * @param callback
         * @param isOnce
         */
        onTouchMove(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._touchMoveCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onTouchMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy touch move from any animation framework to laco
         */
        externalTouchMove() {
            this._strikeTouchMove();
        }

        /**
         * Uses for strike laco touch move event in external hover mode
         * @private
         */
        _strikeTouchMove() {
            for (let i = 0; i < this._touchMoveCallbacks.length; i++) {
                let currentCallback = this._touchMoveCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._touchMoveCallbacks.length; i++) {
                if (this._touchMoveCallbacks[i][1])
                    this._touchMoveCallbacks.splice(i--, 1);
            }
        }

        /**
         * On touch down on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onTouchDown(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._touchDownCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onTouchDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy touch down event from any animation framework to laco
         * @return void
         */
        externalTouchDown() {
            this._strikeTouchDown();
        }

        /**
         * Uses for strike laco touch down event in external hover mode
         * @private
         * @return void
         */
        _strikeTouchDown() {
            for (let i = 0; i < this._touchDownCallbacks.length; i++) {
                let currentCallback = this._touchDownCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._touchDownCallbacks.length; i++) {
                if (this._touchDownCallbacks[i][1])
                    this._touchDownCallbacks.splice(i--, 1);
            }
        }

        /**
         * On touch up on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onTouchUp(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._touchUpCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onTouchUp((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * This method for proxy touch up event from any animation framework to laco
         * @return void
         */
        externalTouchUp() {
            this._strikeTouchUp();
        }

        /**
         * Uses for strike laco touch up event in external hover mode
         * @private
         * @return void
         */
        _strikeTouchUp() {
            for (let i = 0; i < this._touchUpCallbacks.length; i++) {
                let currentCallback = this._touchUpCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._touchUpCallbacks.length; i++) {
                if (this._touchUpCallbacks[i][1])
                    this._touchUpCallbacks.splice(i--, 1);
            }
        }

        /**
         * On pointer move on this component
         * Must implement interface
         * @param callback
         * @param isOnce
         * @return void
         */
        onPointerMove(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._pointerMoveCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onPointerMove((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this._localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            }, isOnce);
        }

        /**
         * Uses for strike laco pointer move event in external hover mode
         * @private
         * @return void
         */
        _strikePointerMove() {
            for (let i = 0; i < this._pointerMoveCallbacks.length; i++) {
                let currentCallback = this._pointerMoveCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._pointerMoveCallbacks.length; i++) {
                if (this._pointerMoveCallbacks[i][1])
                    this._pointerMoveCallbacks.splice(i--, 1);
            }
        }

        /**
         * On pointer active move on this component
         * Must implement interface
         * @param callback
         * @param isOnce
         * @return void
         */
        onActivePointerMove(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._pointerActiveMoveCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onActivePointerMove((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this._localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this._localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            }, isOnce);
        }

        /**
         * Uses for strike laco active pointer move event in external hover mode
         * @private
         * @return void
         */
        _strikeActivePointerMove() {
            for (let i = 0; i < this._pointerActiveMoveCallbacks.length; i++) {
                let currentCallback = this._pointerActiveMoveCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._pointerActiveMoveCallbacks.length; i++) {
                if (this._pointerActiveMoveCallbacks[i][1])
                    this._pointerActiveMoveCallbacks.splice(i--, 1);
            }
        }

        /**
         * On pointer down on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onPointerDown(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._pointerDownCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onPointerDown((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    //this.localPointer.x = -this.getAbsCoordX() + pointer.x;
                    //this.localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            });
        }

        /**
         * Uses for strike laco pointer down event in external hover mode
         * @private
         * @return void
         */
        _strikePointerDown() {
            for (let i = 0; i < this._pointerDownCallbacks.length; i++) {
                let currentCallback = this._pointerDownCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._pointerDownCallbacks.length; i++) {
                if (this._pointerDownCallbacks[i][1])
                    this._pointerDownCallbacks.splice(i--, 1);
            }
        }

        /**
         * On pointer down up on this component
         * @param callback
         * @param isOnce
         * @return void
         */
        onPointerUp(callback, isOnce = false) {
            if (this._hoverMode === HOVER_MODE_EXTERNAL) {
                this._pointerUpCallbacks.push([
                    callback,
                    isOnce
                ]);

                return;
            }

            this._landingFrame.onPointerUp((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    //this.localPointer.x = -this.getAbsCoordX() + pointer.x;
                    //this.localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            });
        }

        /**
         * Uses for strike laco pointer up event in external hover mode
         * @private
         * @return void
         */
        _strikePointerUp() {
            for (let i = 0; i < this._pointerUpCallbacks.length; i++) {
                let currentCallback = this._pointerUpCallbacks[i][0];

                currentCallback(this, event);
            }

            for (let i = 0; i < this._pointerUpCallbacks.length; i++) {
                if (this._pointerUpCallbacks[i][1])
                    this._pointerUpCallbacks.splice(i--, 1);
            }
        }

        /**
         * On pointer hover begin on this component
         * Must implement interface
         * @param callback
         * @param isOnce
         */
        onPointerHoverBegin(callback, isOnce = false) {
            this._pointerOnHoverBeginCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * On pointer hover end this component
         * Must implement interface
         * @param callback
         * @param isOnce
         */
        onPointerHoverEnd(callback, isOnce = false) {
            this._pointerOnHoverEndCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * On pointer hover this component
         * Must implement interface
         * @param callback
         * @param isOnce
         */
        onPointerHover(callback, isOnce = false) {
            this._pointerOnHoverCallbacks.push([
                callback,
                isOnce
            ]);
        }

        /**
         * Return true if component hovered
         * @returns {boolean}
         */
        isComponentHover() {
            return ((this.getPointer().x > this.getAbsCoordX() &&
                    this.getPointer().x < this.getAbsCoordX() + this.getComponentWidth()) &&
                (this.getPointer().y > this.getAbsCoordY() &&
                    this.getPointer().y < this.getAbsCoordY() + this.getComponentHeight())
            );
        }

        /**
         * @inheritDoc
         */
        animationFrame(triggerComponents) {
            super.animationFrame(triggerComponents);

            let inArea = false;

            if ((this.getPointer().x > this.getAbsCoordX() &&
                this.getPointer().x < this.getAbsCoordX() + this.getComponentWidth()) &&
                (this.getPointer().y > this.getAbsCoordY() &&
                    this.getPointer().y < this.getAbsCoordY() + this.getComponentHeight())
            ) {
                inArea = true;
            }

            if (!this._isPointerHovered) {
                if (inArea) {
                    this._isPointerHovered = true;

                    for (let i = 0; i < this._pointerOnHoverBeginCallbacks.length; i++) {
                        let currentCallback = this._pointerOnHoverBeginCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._pointerOnHoverBeginCallbacks.length; i++) {
                        if (this._pointerOnHoverBeginCallbacks[i][1])
                            this._pointerOnHoverBeginCallbacks.splice(i--, 1);
                    }
                }
            } else {
                if (!inArea) {
                    this._isPointerHovered = false;

                    for (let i = 0; i < this._pointerOnHoverEndCallbacks.length; i++) {
                        let currentCallback = this._pointerOnHoverEndCallbacks[i][0];

                        currentCallback(this);
                    }

                    for (let i = 0; i < this._pointerOnHoverEndCallbacks.length; i++) {
                        if (this._pointerOnHoverEndCallbacks[i][1])
                            this._pointerOnHoverEndCallbacks.splice(i--, 1);
                    }
                }
            }

            if (inArea) {
                for (let i = 0; i < this._pointerOnHoverCallbacks.length; i++) {
                    let currentCallback = this._pointerOnHoverCallbacks[i][0];

                    currentCallback(this);
                }

                for (let i = 0; i < this._pointerOnHoverCallbacks.length; i++) {
                    if (this._pointerOnHoverCallbacks[i][1])
                        this._pointerOnHoverCallbacks.splice(i--, 1);
                }
            }

            this.getPointer().animationFrame();
        }

        /**
         * @inheritdoc
         * @returns {FramePointer}
         */
        getPointer() {
            return this._landingFrame.getPointer();
        }

        /**
         * @inheritdoc
         * @returns {FramePointer}
         */
        getGlobalPointer() {
            return this._landingFrame.getLandingBuilder().getGlobalPointer();
        }
    }

    return LandingFrameComponent;
}());
