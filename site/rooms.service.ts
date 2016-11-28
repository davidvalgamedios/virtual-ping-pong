/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" />
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";

@Injectable()
export class RoomsService {
    static instance: RoomsService;
    private socketUrl = '/';
    private userName:string = 'Valero';
    private myUuid:string;
    private socket;

    private myPos;

    private roomsList = [];
    private actualRoomData = {};
    private actualRoomId = null;
    private playersList = [];

    private playerHasBall:boolean = false;


    constructor(private http:Http, private router: Router){
        let savedUuid = localStorage.getItem('savedUuid');
        if(savedUuid){
            this.myUuid = savedUuid;
        }
        else{
            this.myUuid = UUID.UUID();
            localStorage.setItem('savedUuid', this.myUuid);
        }

        /*navigator.geolocation.getCurrentPosition(oLoc => {
         this.myPos = {
         lat: oLoc.coords.latitude,
         lng: oLoc.coords.longitude
         }
         });*/
        this.myPos = {
            lat: 39.484842199999996,
            lng: -0.3601954
        };
        this.updateNearRooms();

        return RoomsService.instance = RoomsService.instance || this;
    }

    getCurrentPos(){
        return this.myPos;
    }

    updateNearRooms(){
        this.http.post('/api/getRooms', {
            lat: this.myPos.lat,
            lng: this.myPos.lng
        }).toPromise()
            .then(oRes => {
                this.roomsList = oRes.json()
            });
    }

    getRoomsList() {
        return this.roomsList;
    }

    getPlayersList(){
        return this.playersList;
    }

    exitRoom(){
        this.socket.disconnect();
        this.socket = null;
    }

    createRoom(){
        this.socket.emit('createRoom', {
            name: 'Test',
            lat: this.myPos.lat,
            lng: this.myPos.lng
        })
    }

    joinRoom(uuid){
        this.actualRoomId = uuid;
        this.playersList = [];
        this.roomsList.forEach(oRoom => {
            if(oRoom.uuid == uuid){
                this.actualRoomData = oRoom;
            }
        });

        this.socket = io(this.socketUrl);
        this.socket.emit('joinRoom', {
            myName: this.userName,
            myUuid: this.myUuid,
            roomUuid: uuid
        });

        this.socket.on('full-players-list', oData => {
            this.playersList = oData;
        });

        this.socket.on('player-disconnected', sPlayerId =>{
            let nIndex = this.playersList.indexOf(sPlayerId);
            if(nIndex != -1){
                this.playersList.splice(nIndex, 1);
            }
        });

        this.socket.on('player-connected', sPlayerId => {
            let nIndex = this.playersList.indexOf(sPlayerId);
            if(nIndex == -1){
                this.playersList.push(sPlayerId);
            }
        });

        this.socket.on('game-started', nothing => {
            this.router.navigate(['/juego', this.actualRoomId]);
        });

        this.socket.on('ball-received', nothing => {
            navigator.vibrate(500);
            this.playerHasBall = true;
        });
    }

    kickBall(){
        if(this.socket){
            this.socket.emit('kick-ball');
            this.playerHasBall = false;
        }
    }

    getRoomData(sDataId){
        if(this.actualRoomData.hasOwnProperty(sDataId)){
            return this.actualRoomData[sDataId];
        }
    }

    hasBall():boolean{
        return this.playerHasBall;
    }

    startGame(){
        if(this.playersList.length > 1 || true){
            this.socket.emit('startGame');
        }
    }
}