import { Component } from '@angular/core';
import {RoomsService} from "./rooms.service";
import {Router} from "@angular/router";

@Component({
    selector: 'lugar',
    template: `
        <div *ngIf="!getCurrentPos()" class="loadingContainer">
            <h3>Geolocalizandote...</h3>
        </div>
        <sebm-google-map *ngIf="getCurrentPos()" [latitude]="getCurrentPos().lat" [longitude]="getCurrentPos().lng" [zoom]="18">
            <sebm-google-map-marker [latitude]="getCurrentPos().lat" [longitude]="getCurrentPos().lng"></sebm-google-map-marker>
        </sebm-google-map>
        
        <h3>Lista de salas</h3>
        <div *ngFor="let oRoom of getRoomList()" class="roomItem"
            (click)="joinRoom(oRoom)">
            {{oRoom.name}} - {{oRoom.uuid}}
        </div>
        
        <div class="createRoomBtn" (click)="createRoom()">Crear sala</div>
    `,
    providers:[RoomsService]
})
export class GameLocationComponent {

    constructor(private roomsService: RoomsService, private router: Router){

    }

    getCurrentPos(){
        return this.roomsService.getCurrentPos();
    }

    getRoomList(){
        return this.roomsService.getRoomsList();
    }

    createRoom(){
        if(this.roomsService.getCurrentPos()){
            this.roomsService.createRoom();
        }
    }

    joinRoom(oRoom){
        this.router.navigate(['/sala-de-espera', oRoom.uuid]);
    }
}