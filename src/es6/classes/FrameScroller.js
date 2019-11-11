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


            this.buildScroller();
            // let scrollContainerContent = this._scrollerContainer.children;
            //
            //
            // console.log(scrollContainerContent);
            //
            // for (let i=0; i< scrollContainerContent.length; i++) {
            //     let currentElement = scrollContainerContent[i];
            //
            //     console.log(currentElement)
            //     currentElement.remove();
            // }

            //scrollContainerContent.remove()
        }

        buildScroller() {
            let content = $(this._scrollerContainer).children();

            $(content).each((index, elem) => {
                $(elem).remove();
            });

            $(this._scrollerContainer).append('<div class="scroll-cont-external"></div>');
            $(this._scrollerContainer).find('.scroll-cont-external').append('<div class="scroll-cont-internal"></div>')
            $(this._scrollerContainer).find('.scroll-cont-internal').append(content);

            $(this._scrollerContainer).append('<div class="scrollbar"></div>')
                .find('.scrollbar')
                .append('<span class="button-forward"></span>')
                .append('<div class="dragger-box">' +
                    '<div class="dragger-vertical"></div>' +
                    '<div class="dragger-rail"></div>' +
                    '</div>')
                .append('<span class="button-backward"></span>');

            // $(this._scrollerContainer).find('.dragger-vertical').hover(() => {
            //     console.log('hover1')
            // });
            //
            // $(this._scrollerContainer).find('.dragger-vertical').mousemove((event) => {
            //     console.log(event);
            // });
            this._handleConfig();

        }

        _handleConfig() {
            for (let i = 0; i < this._configArray.length; i++) {
                let currentConfigElement = this._configArray[i];

                let t = currentConfigElement[0];

                if ()
                console.log(/%$/.test(t));
            }


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
