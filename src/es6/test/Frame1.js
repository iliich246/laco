import 'velocity-animate';

import {LandingFrame} from "../classes/LandingFrame";
import { LandingFrameComponent } from "../classes/LandingFrameComponent";

/**
 *
 */
export class Frame1 extends LandingFrame {
    constructor(frameContainer, landingBuilder) {
        super(frameContainer, landingBuilder);
    }
}

/**
 *
 */
class Frame1Component1 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame)
    }
}

/**
 *
 */
class Frame1Component2 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame)
    }
}

/**
 *
 */
class Frame1Component3 extends  LandingFrameComponent {
    constructor(landingFrame) {
        super(landingFrame)
    }
}
