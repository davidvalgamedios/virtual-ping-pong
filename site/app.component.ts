import { Component } from '@angular/core';
declare var Shake: any;

@Component({
    selector: 'virtual-ping-pong',
    template: `
        <h1>Virtual Ping Pong</h1>
        <router-outlet></router-outlet>
    `,
    providers:[]
})
export class AppComponent {

    constructor(){
        var myShakeEvent = new Shake({
            threshold: 15, // optional shake strength threshold
            timeout: 1000 // optional, determines the frequency of event generation
        });
        myShakeEvent.start();
        window.addEventListener('shake', function(){
            navigator.vibrate(1000);
        }, false);
    }

}