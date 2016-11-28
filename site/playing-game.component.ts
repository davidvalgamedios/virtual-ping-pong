import { Component } from '@angular/core';
import {RoomsService} from "./rooms.service";
import {Router} from "@angular/router";

@Component({
    selector: 'cosas',
    template: `
        <div *ngIf="hasBall()" class="ball"></div>
        <div (click)="kickBall()" class="startGameBtn">Mandar bola</div>
    `,
    providers:[RoomsService]
})
export class PlayingGameComponent {

    constructor(private roomsService: RoomsService, private router: Router){
        window.addEventListener('shake', nothing => {
            this.kickBall();
        }, false);
    }

    hasBall():boolean{
        return this.roomsService.hasBall()
    }

    kickBall(){
        if(this.hasBall()){
            this.roomsService.kickBall();
        }
    }
}