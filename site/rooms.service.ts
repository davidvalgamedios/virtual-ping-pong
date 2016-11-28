/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" />
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RoomsService {
    private socketUrl = '/';
    private userName:string = 'Valero';
    private myUuid:string;
    private socket;

    private myPos;

    private roomsList = [];
    private actualRoomData = {};
    private playersList = [];

    constructor(private http:Http){
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

        /*this.http.post('/api/register', {
            name: this.userName,
            uuid: this.uuid
        }).toPromise()
            .then(res => {

            });

        this.socket = io(this.socketUrl);
        this.socket.on('rooms-list', oData => {
            oData.forEach(oRoom => {
                this.roomsList.push({
                    lat: oRoom.lat,
                    lng: oRoom.lng,
                    name: oRoom.name,
                    uuid: oRoom.uuid
                });
            });
        });

        this.socket.on('join-succesful', oData => {

        });

        this.socket.emit('register', {
            name: this.userName,
            uuid: this.uuid
        });*/
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

        this.socket.on('player-connected', sPlayerId =>{
            let nIndex = this.playersList.indexOf(sPlayerId);
            if(nIndex == -1){
                this.playersList.push(sPlayerId);
            }
        });
    }

    getRoomData(sDataId){
        if(this.actualRoomData.hasOwnProperty(sDataId)){
            return this.actualRoomData[sDataId];
        }
    }

    register(userName){
        /*this.userName = userName;

        this.socket = io(this.url);
        this.socket.emit('register', this.userName);

        this.socket.on('statusChanged', (data) => {
            let count = this.roomsList.length;

            for(var i = 0;i<count;i++){
                if(this.roomsList[i].getData('uuid') == data.uuid){
                    this.roomsList[i].setStatus(data.inCoffee);
                    if(data.inCoffee){
                    }
                    return;
                }
            }
        });

        this.socket.on('registerOk', (data) => {
            for(var sUuid in data.connectedUsers){
                let oUser = data.connectedUsers[sUuid];

                //this.roomsList.push(new User(sUuid, oUser.name, oUser.inCoffee));
            }
        });


        this.socket.on('newUser', (data) => {
            //this.roomsList.push(new User(data.uuid, data.name, data.inCoffee));
        });

        this.socket.on('userDisconnected', (data) => {
            let count = this.roomsList.length;

            for(var i = 0;i<count;i++){
                if(this.roomsList[i].getData('uuid') == data.uuid){
                    this.roomsList.splice(i, 1);
                    return;
                }
            }
        });

        this.socket.on('msgBroadcast', (data) => {
            //new Notification(data.userName+' dice', {icon:'/dist/img/coffee.jpg',body: data.msg})
        });*/
    }
}