import { FrameInterface } from "./classes/FrameInterface";
import { LandingFrame } from "./classes/LandingFrame";

console.log('sasat');

let x = new FrameInterface();

console.log(x);

class NCL extends LandingFrame {
    constructor(a, b) {
        super(a, b);

        console.log('NCL constructor');



    }
}

let z = new NCL(1,2);

console.log(z);