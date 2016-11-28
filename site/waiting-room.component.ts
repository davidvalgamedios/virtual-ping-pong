import { Component, OnInit } from '@angular/core';
import {RoomsService} from "./rooms.service";
import {ActivatedRoute, Params, Router}   from '@angular/router';

@Component({
    selector: 'otracosa',
    template: `
        <h3>Sala de espera - {{getRoomData('name')}}</h3> 
        <div *ngFor="let sPlayerUuid of getPlayersList()" class="roomItem">
            {{sPlayerUuid}}
        </div>
        
        <div (click)="startGame()" class="startGameBtn">Empezar juego</div>
        <div (click)="returnToRoomsList()" class="createRoomBtn">Volver</div>
    `,
    providers:[RoomsService]
})
export class WaitingRoomComponent implements OnInit{

    constructor(private roomsService: RoomsService, private route: ActivatedRoute, private router: Router){

    }

    ngOnInit(): void{
        this.route.params.forEach((params: Params) => {
            let uuid = params['uuid'];
            this.roomsService.joinRoom(uuid);
        });
    }

    returnToRoomsList(){
        this.roomsService.exitRoom();
        this.router.navigate(['/lugar']);
    }

    getPlayersList(){
        return this.roomsService.getPlayersList();
    }

    getRoomData(sDataId){
        return this.roomsService.getRoomData(sDataId);
    }

    startGame(){
        this.roomsService.startGame()
    }
}