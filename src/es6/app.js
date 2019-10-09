import { LandingBuilderBase } from "./classes/LandingBuilderBase";

import {Frame1} from "./test/Frame1";
import {Frame2} from "./test/Frame2";
import {Frame3} from "./test/Frame3";

class LandingBuilder extends LandingBuilderBase {
    constructor() {
        super();
    }
}

$(() => {
    let landingBuilder = new LandingBuilder();

    let frame1 = new Frame1('', landingBuilder);
    let frame2 = new Frame2('', landingBuilder);
    let frame3 = new Frame3('', landingBuilder);

    // landingBuilder.add(frame1);
    // landingBuilder.add(frame2);
    // landingBuilder.add(frame3);
});