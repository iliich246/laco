import 'velocity-animate';

import {LandingFrame} from "../classes/LandingFrame";
import { LandingFrameComponent } from "../classes/LandingFrameComponent";

/**
 *
 */
export class Frame1 extends LandingFrame {
    /**
     * Constructor
     * @param frameContainer
     * @param landingBuilder
     */
    constructor(frameContainer, landingBuilder) {
        super(frameContainer, landingBuilder);

        this.component1 = new Frame1Component1(this);
        this.component2 = new Frame1Component2(this);
        this.component3 = new Frame1Component3(this);

        this.addComponent(this.component1);
        this.addComponent(this.component2);
        this.addComponent(this.component3);

        this.component3.onClick(() => {
            console.log('SASAT component 3')
        })
    }

    /**
     * @inheritDoc
     */
    initialization(triggerComponents = true) {
        if (!super.initialization()) return false;

        console.log('Frame1 init');

        let that = this;

        function _animation() {
            requestAnimationFrame(_animation);
            that.animationFrame();
        }

        //_animation();

        super.initializationComplete();

        return true;
    }

    /**
     * @inheritDoc
     */
    startSequence(triggerComponents = true) {
        super.startConditions();
        super.startSequence();
    }

    /**
     * @inheritDoc
     */
    stopSequence(triggerComponents = true) {
        super.stopSequence();
    }

    /**
     * @inheritDoc
     */
    offSequence(triggerComponents = true) {
        super.offSequence();
    }
}

/**
 * Class Frame1Component1
 */
class Frame1Component1 extends  LandingFrameComponent {
    /**
     * Constructor
     */
    constructor(landingFrame) {
        super(landingFrame);
    }

    /**
     * @inheritDoc
     */
    initialization(triggerComponents = true) {
        if (!super.initialization()) return false;

        console.log('Frame1 Component1 init');

        return true;
    }

    /**
     * @inheritDoc
     */
    startConditions(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component1 startConditions');
    }

    /**
     * @inheritDoc
     */
    startSequence(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component1 startSequence');
    }

    /**
     * @inheritDoc
     */
    stopSequence(triggerComponents = true) {
        super.stopSequence(triggerComponents);

        console.log('Frame1 Component1 stopSequence');
    }

    /**
     * @inheritDoc
     */
    offSequence(triggerComponents = true) {
        super.offSequence();

        console.log('Frame1 Component1 offSequence');
    }

    /**
     * @inheritDoc
     */
    animationFrame(triggerComponents = true) {
        super.animationFrame(triggerComponents);

        console.log('anim1');
    }
}

/**
 * Class Frame1Component2
 */
class Frame1Component2 extends  LandingFrameComponent {
    /**
     * Constructor
     */
    constructor(landingFrame) {
        super(landingFrame)
    }

    /**
     * @inheritDoc
     */
    initialization(triggerComponents = true) {
        if (!super.initialization()) return false;

        console.log('Frame1 Component2 init');

        return true;
    }

    /**
     * @inheritDoc
     */
    startConditions(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component2 startConditions');
    }

    /**
     * @inheritDoc
     */
    startSequence(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component2 startSequence');
    }

    /**
     * @inheritDoc
     */
    stopSequence(triggerComponents = true) {
        super.stopSequence(triggerComponents);

        console.log('Frame1 Component2 stopSequence');
    }

    /**
     * @inheritDoc
     */
    offSequence(triggerComponents = true) {
        super.offSequence();

        console.log('Frame1 Component2 offSequence');
    }

    /**
     * @inheritDoc
     */
    animationFrame(triggerComponents = true) {
        super.animationFrame(triggerComponents);

        console.log('anim2');
    }
}

/**
 * Class Frame1Component3
 */
class Frame1Component3 extends  LandingFrameComponent {
    /**
     * Constructor
     */
    constructor(landingFrame) {
        super(landingFrame);
    }

    /**
     * @inheritDoc
     */
    initialization(triggerComponents = true) {
        if (!super.initialization()) return false;

        this.cont = $('#comp3');

        $(this.cont).click((event) => {
            this.externalClick();
        });



        console.log('Frame1 Component3 init');

        return true;
    }

    /**
     * @inheritDoc
     */
    startConditions(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component3 startConditions');
    }

    /**
     * @inheritDoc
     */
    startSequence(triggerComponents = true) {
        super.startConditions(triggerComponents);

        console.log('Frame1 Component3 startSequence');
    }

    /**
     * @inheritDoc
     */
    stopSequence(triggerComponents = true) {
        super.stopSequence(triggerComponents);

        console.log('Frame1 Component3 stopSequence');
    }

    /**
     * @inheritDoc
     */
    offSequence(triggerComponents = true) {
        super.offSequence();

        console.log('Frame1 Component3 offSequence');
    }

    /**
     * @inheritDoc
     */
    animationFrame(triggerComponents = true) {
        super.animationFrame(triggerComponents);

        console.log('anim3');
    }
}
