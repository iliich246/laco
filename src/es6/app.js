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
    let landingBuilder = new LandingBuilder({
        //configuration
    });

    let frame1 = new Frame1(document.getElementById('frame1'), landingBuilder);
    let frame2 = new Frame2(document.getElementById('frame2'), landingBuilder);
    let frame3 = new Frame3(document.getElementById('frame3'), landingBuilder);

    landingBuilder.setActiveFrame(frame1);

    landingBuilder.initialization();

    frame1.onResizeOnMobile(() => {
        console.log('Mobile rez');
    });

    frame1.onResizeOnMobile(() => {
        console.log('onResizeOnMobile rez');
    });

    frame1.onResizeOnDesktop(() => {
        console.log('onResizeOnDesktop rez');
    });
    frame1.onResizeOnBootstrapXl(() => {
        console.log('onResizeOnBootstrapXl rez');
    });
    frame1.onResizeOnBootstrapLg(() => {
        console.log('onResizeOnBootstrapLg rez');
    });
    frame1.onResizeOnBootstrapMd(() => {
        console.log('onResizeOnBootstrapMd rez');
    });
    frame1.onResizeOnBootstrapSm(() => {
        console.log('onResizeOnBootstrapSm rez');
    });
    frame1.onResizeOnBootstrapEsm(() => {
        console.log('onResizeOnBootstrapEsm rez');
    }, true);

    //frame1.startSequence();

    // landingBuilder.onResizeOnMobile(() => {
    //     console.log('Mobile rez');
    // });
    //
    // landingBuilder.onResizeOnMobile(() => {
    //     console.log('onResizeOnMobile rez');
    // });
    //
    // landingBuilder.onResizeOnDesktop(() => {
    //     console.log('onResizeOnDesktop rez');
    // });
    // landingBuilder.onResizeOnBootstrapXl(() => {
    //     console.log('onResizeOnBootstrapXl rez');
    // });
    // landingBuilder.onResizeOnBootstrapLg(() => {
    //     console.log('onResizeOnBootstrapLg rez');
    // });
    // landingBuilder.onResizeOnBootstrapMd(() => {
    //     console.log('onResizeOnBootstrapMd rez');
    // });
    // landingBuilder.onResizeOnBootstrapSm(() => {
    //     console.log('onResizeOnBootstrapSm rez');
    // });
    // landingBuilder.onResizeOnBootstrapEsm(() => {
    //     console.log('onResizeOnBootstrapEsm rez');
    // });


    //console.log(frame1);

    frame1.initialization();
    frame1.startSequence();
    frame1.stopSequence();
    frame1.offSequence();
    frame1.animationFrame();

    console.log(frame1.getName())
    // landingBuilder.add(frame1);
    // landingBuilder.add(frame2);
    // landingBuilder.add(frame3);
});