import { LandingFrame } from "./LandingFrame";
export { LandingFrame } from "./LandingFrame";

import { FrameScroller } from "./FrameScroller";

/**
 * https://codepen.io/dec04/pen/FCneH
 */
export class ScrollableFrame extends LandingFrame {
    /**
     *
     * @param frameContainer
     * @param landingBuilder
     */
    constructor(frameContainer, landingBuilder) {
        super(frameContainer, landingBuilder);
        /**
         * Instance of FrameScroller
         * @type {FrameScroller}
         */
        this._frameScroller = new FrameScroller();
        this._frameScroller.setScrollerContainer(frameContainer);
    }

    /**
     * Set scroll config array
     * @param scrollConfigArray
     */
    setScrollConfig(scrollConfigArray) {
        this._frameScroller.setConfigArray(scrollConfigArray);
    }


    /**
     * This method must be used for initialization in inherited class
     * as super.initialization() for trigger events
     * @param {boolean} triggerComponents
     * @return {boolean}
     */
    initialization(triggerComponents = true) {
        if (!super.initialization(triggerComponents)) return false;

        this._frameScroller.initialization();

        return true;
    }
}
