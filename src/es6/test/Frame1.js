import 'velocity-animate';

import {LandingFrame} from "../classes/LandingFrame";
import { LandingFrameComponent } from "../classes/LandingFrameComponent";

/**
 *
 */
export class Frame1 extends LandingFrame {
    constructor(frameContainer, landingBuilder) {
        super(frameContainer, landingBuilder);

        this.component1 = new Frame1Component1(this);
        this.component2 = new Frame1Component2(this);
        this.component3 = new Frame1Component3(this);

        this.addFrameComponent(this.component1);
        this.addFrameComponent(this.component2);
        this.addFrameComponent(this.component3);
    }

    initialization() {
        super.initialization();
    }
}

/**
 *
 */
class Frame1Component1 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame)
    }

    initialization() {
        super.initialization();

        console.log('C1 init');

    }
}

/**
 *
 */
class Frame1Component2 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame)
    }

    initialization() {
        super.initialization();

        console.log('C2 init');
    }
}

/**
 *
 */
class Frame1Component3 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame);


    }

    initialization() {
        super.initialization();

        console.log('C3 init');
    }
}
