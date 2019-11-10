/**
 * Class FrameScroller
 *
 * @type {function(): FrameScroller}
 */
export const FrameScroller = (function() {

    /**
     * Class FrameScroller
     */
    class FrameScroller {
        /**
         * Constructor
         * @param config
         */
        constructor(config) {
            /**
             *
             * @type {HTMLElement|null}
             * @private
             */
            this._scrollerContainer = null;
            this._configArray = [];
            //this.

            this.scrollCallbacks = [];

            this.scrollPercentCallbacks = [];

            this.scrollPixelsCallbacks = [];
        }

        /**
         * Set dom element for which scroll needed
         * @param scrollerContainer
         * @return {FrameScroller}
         */
        setScrollerContainer(scrollerContainer) {
            this._scrollerContainer = scrollerContainer;
            return this;
        }

        /**
         * Sets config array
         * @param configArray
         * @return {FrameScroller}
         */
        setConfigArray(configArray) {
            this._configArray = configArray;
            return this;
        }

        initialization() {
            console.log(this._scrollerContainer.parentElement.parentElement);
            console.log(this._scrollerContainer.offsetHeight)
            //var node = document.createElement("div");


            let scrollContainerContent = this._scrollerContainer.children;


            console.log(scrollContainerContent);

            for (let i=0; i< scrollContainerContent.length; i++) {
                let currentElement = scrollContainerContent[i];

                console.log(currentElement)
                currentElement.remove();
            }

            //scrollContainerContent.remove()
        }

        scrollForvard(value) {

        }

        scrollBackward(value) {

        }

        recalculate() {

        }
    }

    return FrameScroller;
}());
