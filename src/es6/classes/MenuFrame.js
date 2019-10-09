import { FrameInterface } from "./FrameInterface";
export { FrameInterface } from "./FrameInterface";
/**
 * Class of special menu frame
 * This some kind of abstract class and must be used only inherited classes
 * @type {MenuFrame}
 */
export const MenuFrame = (function() {
    //This constants needed because constance of FrameInterface not visible there
    const STATE_OFF   = 0;
    const STATE_BEGIN = 1;
    const STATE_WAIT  = 2;
    const STATE_STOP  = 3;

    class MenuFrame extends FrameInterface {
        /**
         *
         * @param frameContainer
         * @param {LandingBuilder} landingBuilder
         */
        constructor(frameContainer, landingBuilder) {
            super();

            this._landingBuilder = landingBuilder;
            this._frameContainer = frameContainer;
        }

        /**
         * Return landing builder
         * @returns {LandingBuilder}
         */
        getLandingBuilder() {
            return this._landingBuilder;
        }

        /**
         * Return dom container that consist menu element
         * @returns {Object}
         */
        getFrameContainer() {
            return this._frameContainer;
        }

        /**
         * Hang callback on click event of global pointer
         * @param callback
         * @param isOnce
         */
        onClick(callback, isOnce = false) {
            this._landingBuilder.onClick(callback, isOnce);
        }

        /**
         * Hang callback on mouse move event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseMove(callback, isOnce = false) {
            this._landingBuilder.onMouseMove(callback, isOnce);
        }

        /**
         * Hang callback on mouse move with pressed left key event of this frame
         * @param callback
         * @param isOnce
         */
        onActiveMouseMove(callback, isOnce = false) {
            this.landingBuilder.onActiveMouseMove(callback, isOnce);
        }

        /**
         * Hang callback on mouse left button down event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseDown(callback, isOnce = false) {
            this._landingBuilder.onMouseDown(callback, isOnce);
        }

        /**
         * Hang callback on mouse left button up event of this frame
         * @param callback
         * @param isOnce
         */
        onMouseUp(callback, isOnce = false) {
            this._landingBuilder.onMouseUp(callback, isOnce);
        }

        /**
         * Hang callback on touch move event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchMove(callback, isOnce = false) {
            this._landingBuilder.onTouchMove(callback, isOnce);
        }

        /**
         * Hang callback on touch down event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchDown(callback, isOnce = false) {
            this._landingBuilder.onTouchDown(callback, isOnce);
        }

        /**
         * Hang callback on touch up event of this frame
         * @param callback
         * @param isOnce
         */
        onTouchUp(callback, isOnce = false) {
            this._landingBuilder.onTouchUp(callback, isOnce);
        }

        /**
         * Hang callback on pointer move event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerMove(callback, isOnce = false) {
            this._landingBuilder.onPointerMove(callback, isOnce);
        }

        /**
         * Hang callback on active pointer move event of this frame
         * @param callback
         * @param isOnce
         */
        onActivePointerMove(callback, isOnce = false) {
            this._landingBuilder.onActivePointerMove(callback, isOnce);
        }

        /**
         * Hang callback on pointer down event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerDown(callback, isOnce = false) {
            this._landingBuilder.onPointerDown(callback, isOnce);
        }

        /**
         * Hang callback on pointer up event of this frame
         * @param callback
         * @param isOnce
         */
        onPointerUp(callback, isOnce = false) {
            this._landingBuilder.onPointerUp(callback, isOnce);
        }
    }

    return MenuFrame;
}());