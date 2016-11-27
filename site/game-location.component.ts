import { Component } from '@angular/core';
import {RoomsService} from "./rooms.service";

@Component({
    selector: 'lugar',
    template: `
        <h1>Virtual Ping Pong</h1>
        
        <div *ngIf="!getCurrentPos()" class="loadingContainer">
            <h3>Geolocalizandote...</h3>
        </div>
        <sebm-google-map *ngIf="getCurrentPos()" [latitude]="getCurrentPos().lat" [longitude]="getCurrentPos().lng" [zoom]="18">
            <sebm-google-map-marker [latitude]="getCurrentPos().lat" [longitude]="getCurrentPos().lng"></sebm-google-map-marker>
        </sebm-google-map>
        
        <h3>Lista de salas</h3>
        <div *ngFor="let oRoom of getRoomList()" class="roomItem"
            (click)="joinRoom(oRoom.uuid)">
            {{oRoom.name}} - {{oRoom.uuid}}
        </div>
        
        <div class="createRoomBtn" (click)="createRoom()">Crear sala</div>
    `,
    providers:[RoomsService]
})
export class GameLocationComponent {

    constructor(private roomsService: RoomsService){
        /*navigator.geolocation.getCurrentPosition(oLoc => {
            this.myPos = {
                lat: oLoc.coords.latitude,
                lng: oLoc.coords.longitude
            }
        });*/
        roomsService.setCurrentPos({
            lat: 39.484842199999996,
            lng: -0.3601954
        });
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

    joinRoom(uuid){
        this.roomsService.joinRoom(uuid);
    }
}