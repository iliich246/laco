import { FrameInterface } from "./FrameInterface";
import { FramePointer } from "./FramePointer";

/**
 * Class LandingFrameComponent
 *
 * @type {LandingFrameComponent}
 */
export const LandingFrameComponent = (function () {
    const HOVER_MODE_INTERNAL = 0;
    const HOVER_MODE_EXTERNAL = 1;

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
            this._localPointer = new FramePointer();

            this._hoverMode = HOVER_MODE_EXTERNAL;

            //local pointer callbacks
            this._mouseMoveCallbacks = [];
            this._mouseActiveMoveCallbacks = [];
            this._mouseDownCallbacks = [];
            this._mouseUpCallbacks = [];
            this._touchMoveCallbacks = [];
            this._touchDownCallbacks = [];
            this._touchUpCallbacks = [];
            this._pointerMoveCallbacks = [];
            this._pointerDownCallbacks = [];
            this._pointerUpCallbacks = [];
            this._pointerActiveMove = [];

            //hover callbacks
            this._pointerOnHoverBeginCallbacks = [];
            this._pointerOnHoverEndCallbacks = [];
            this._pointerOnHoverCallbacks = [];
            //is hover bool variable
            this._isPointerHovered = false;
        }

        /**
         * Return absolute x coordinate of this component regarding parent frame
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         */
        getAbsCoordX() {
            console.log('This method like interface and must be implemented in inherited class');
            return null;
        }

        /**
         * Return absolute y coordinate of this component regarding parent frame
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         */
        getAbsCoordY() {
            console.log('This method like interface and must be implemented in inherited class');
            return null;
        }

        /**
         * Return height of this component
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         */
        getComponentHeight() {
            console.log('This method like interface and must be implemented in inherited class');
            return null;
        }

        /**
         * Return width of this component
         * This method is like interface and must be implemented if child of this class
         * will use pointer actions
         */
        getComponentWidth() {
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
         */
        onClick(callback, isOnce = false) {
            this._landingFrame.onClick((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this.localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            });
        }

        /**
         * On mouse move on this component
         * @param callback
         * @param isOnce
         */
        onMouseMove(callback, isOnce = false) {
            this._landingFrame.onMouseMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseX = -this.getAbsCoordX() + pointer._mouseX;
                    this.localPointer._mouseY = -this.getAbsCoordY() + pointer._mouseY;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On active move move on this component
         * @param callback
         * @param isOnce
         */
        onActiveMouseMove(callback, isOnce = false) {
            this._landingFrame.onActiveMouseMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseX = -this.getAbsCoordX() + pointer._mouseX;
                    this.localPointer._mouseY = -this.getAbsCoordY() + pointer._mouseY;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On mouse down on this component
         * @param callback
         * @param isOnce
         */
        onMouseDown(callback, isOnce = false) {
            this._landingFrame.onMouseDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseIsActive = true;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On mouse up on this component
         * @param callback
         * @param isOnce
         */
        onMouseUp(callback, isOnce = false) {
            this._landingFrame.onMouseDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On touch move on this component
         * @param callback
         * @param isOnce
         */
        onTouchMove(callback, isOnce = false) {
            this._landingFrame.onTouchMove((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On touch down on this component
         * @param callback
         * @param isOnce
         */
        onTouchDown(callback, isOnce = false) {
            this._landingFrame.onTouchDown((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On touch up on this component
         * @param callback
         * @param isOnce
         */
        onTouchUp(callback, isOnce = false) {
            this._landingFrame.onTouchUp((pointer) => {
                if ((pointer._mouseX > this.getAbsCoordX() && pointer._mouseX < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer._mouseY > this.getAbsCoordY() && pointer._mouseY < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer._mouseIsActive = false;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On pointer move on this component
         * Must implement interface
         * @param callback
         * @param isOnce
         */
        onPointerMove(callback, isOnce = false) {
            this._landingFrame.onPointerMove((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this.localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            }, isOnce);
        }

        /**
         * On pointer active move on this component
         * Must implement interface
         * @param callback
         * @param isOnce
         */
        onActivePointerMove(callback, isOnce = false) {
            this._landingFrame.onActivePointerMove((pointer) => {
                if ((pointer.x > this.getAbsCoordX() && pointer.x < this.getAbsCoordX() + this.getComponentWidth()) &&
                    (pointer.y > this.getAbsCoordY() && pointer.y < this.getAbsCoordY() + this.getComponentHeight())
                ) {
                    this.localPointer.x = -this.getAbsCoordX() + pointer.x;
                    this.localPointer.y = -this.getAbsCoordY() + pointer.y;
                    callback();
                }
            }, isOnce);
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
