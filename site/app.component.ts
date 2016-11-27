import { Component } from '@angular/core';
import {RoomsService} from "./rooms.service";

@Component({
    selector: 'virtual-ping-pong',
    template: `
        <h1>Virtual Ping Pong</h1>
        <div *ngIf="!myPos" class="loadingContainer">
            <h3>Geolocalizandote...</h3>
        </div>
        <sebm-google-map *ngIf="myPos" [latitude]="myPos.lat" [longitude]="myPos.lng" [zoom]="18">
            <sebm-google-map-marker [latitude]="myPos.lat" [longitude]="myPos.lng"></sebm-google-map-marker>
        </sebm-google-map>
        
        <h3>Lista de salas</h3>
        <div *ngFor="let oRoom of roomsList" class="roomItem">
            {{oRoom.name}} - {{oRoom.uuid}}
        </div>
        
        <a (click)="createRoom()">Crear sala</a>
    `,
    providers:[RoomsService]
})
export class AppComponent {
    myPos = {
        lat: 39.484842199999996,
        lng: -0.3601954
    };
    roomsList;

    constructor(private roomsService: RoomsService){
        /*navigator.geolocation.getCurrentPosition(oLoc => {
            this.myPos = {
                lat: oLoc.coords.latitude,
                lng: oLoc.coords.longitude
            }
        });*/
        this.roomsList = roomsService.getRoomsList();
    }

    createRoom(){
        if(this.myPos){
            this.roomsService.createRoom(this.myPos);
        }
    }
}