/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" />
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UUID } from 'angular2-uuid';

@Injectable()
export class RoomsService {
    private url = '/';
    private userName:string = 'Valero';
    private uuid:string;
    private socket;
    private playingStatus:boolean = false;

    private myPos;

    private roomsList = [];
    private playersList = [];

    constructor(){
        this.socket = io(this.url);
        let savedUuid = localStorage.getItem('savedUuid');
        if(savedUuid){
            this.uuid = savedUuid;
        }
        else{
            this.uuid = UUID.UUID();
            localStorage.setItem('savedUuid', this.uuid);
        }

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
        });
    }

    setCurrentPos(newPos){
        this.myPos = newPos;
    }

    getCurrentPos(){
        return this.myPos;
    }

    getRoomsList() {
        return this.roomsList;
    }

    createRoom(){
        this.socket.emit('createRoom', {
            name: 'Test',
            lat: this.myPos.lat,
            lng: this.myPos.lng
        })
    }

    joinRoom(uuid){
        this.playingStatus = true;
        this.socket.emit('joinRoom', uuid);
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