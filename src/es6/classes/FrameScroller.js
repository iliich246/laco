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
            /**
             *
             * @type {Array}
             * @private
             */
            this._configArray = [];
            /**
             *
             * @type {null}
             * @private
             */
            this._scrollerExternalContainer = null;
            /**
             *
             * @type {null}
             * @private
             */
            this._scrollerInternalContainer = null;
            /**
             *
             * @type {null}
             * @private
             */
            this._draggerVertical = null;
            /**
             *
             * @type {number}
             * @private
             */
            this._draggerLength = 0;

            this.scrollCallbacks = [];

            this.scrollPercentCallbacks = [];

            this.scrollPixelsCallbacks = [];

            this._currentScrollPosition = 0;


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
            this._scrollerExternalContainer = $(this._scrollerContainer).find('.scroll-cont-external');

            $(this._scrollerExternalContainer).append('<div class="scroll-cont-internal"></div>');

            this._scrollerInternalContainer = $(this._scrollerContainer).find('.scroll-cont-internal');
            $(this._scrollerInternalContainer).append(content);

            $(this._scrollerContainer).append('<div class="scrollbar"></div>')
                .find('.scrollbar')
                .append('<span class="button-forward"></span>')
                .append('<div class="dragger-box">' +
                    '<div class="dragger-vertical"></div>' +
                    '<div class="dragger-rail"></div>' +
                    '</div>')
                .append('<span class="button-backward"></span>');

            this._draggerVertical = $(this._scrollerContainer).find('.dragger-vertical');

            this._calculateDraggerLength();
            this._handleConfig();

            $(this._scrollerContainer).on('mousewheel', (event) => {
                if (event.originalEvent.deltaY < 0) {//wheel up
                    this.scrollForward(10);
                } else {
                    this.scrollBackward(10);
                }
            });

        }

        /**
         *
         * @private
         */
        _calculateDraggerLength() {
            if ($(this._scrollerInternalContainer).height() / $(this._scrollerContainer).height() > 2) {
                this._draggerLength = $(this._scrollerContainer).height() * 0.1;
            } else {
                this._draggerLength = $(this._scrollerContainer).height() * 0.5;
            }
            
            $(this._draggerVertical).height(this._draggerLength);
        }

        /**
         *
         * @private
         */
        _handleConfig() {
            let containerLength =  $(this._scrollerContainer)
                .find('.scroll-cont-internal')
                .height();

            console.log(containerLength);

            for (let i = 0; i < this._configArray.length; i++) {
                let currentConfigElement = this._configArray[i];

                let triggerValue = currentConfigElement[0];

                let lastVal = 0;

                if (/%$/.test(triggerValue)) {

                    let numberVal = triggerValue.slice(0, -1);



                }
                //console.log(/%$/.test(t));
            }


        }


        scrollForward(value) {
            $(this._scrollerContainer).find('.scroll-cont-internal').css({
                top: '+=10px'
            });

            this._currentScrollPosition += 10;



            $('.dragger-vertical').css({
                top: -this._currentScrollPosition
            });
        }

        scrollBackward(value) {
            $(this._scrollerContainer).find('.scroll-cont-internal').css({
                top: '-=10px'
            });

            this._currentScrollPosition -= 10;

            $('.dragger-vertical').css({
                top: -this._currentScrollPosition
            });
        }

        recalculate() {

        }
    }

    return FrameScroller;
}());
