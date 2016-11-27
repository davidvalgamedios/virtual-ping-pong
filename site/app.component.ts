import { Component } from '@angular/core';

@Component({
    selector: 'virtual-ping-pong',
    template: `
        <router-outlet></router-outlet>
    `,
    providers:[]
})
export class AppComponent {

    constructor(){
    }

}