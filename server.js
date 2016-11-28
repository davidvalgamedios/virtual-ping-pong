const express  = require('express');
const app      = express();
const port = 8000;

var https = require('https');
var fs = require('fs');
var bodyParser   = require('body-parser');

const httpsOptions = {
    key: fs.readFileSync('./certs/9015629-icarvs.dev.key'),
    cert: fs.readFileSync('./certs/9015629-icarvs.dev.cert')
};

var server = https.createServer(httpsOptions, app);
var io = require('socket.io').listen(server);
var uuid = require('uuid-random');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/VirtualPingPong');

var roomGameMdl = require('./server/Schemas/RoomSchema.js');


const env = 'prod';

var oActiveRooms = {};
/*
uuid:{
    name:'asdasd',

}
*/
var oActiveUsers = {};
/*
uuid: {
    name:asdfasdf,
    socket: socket
}
*/


// routes ======================================================================
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));
app.use(bodyParser()); // get information from html forms

app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/build", express.static(__dirname + '/build'));


app.get('/', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});
app.get('/lugar', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});
app.get('/sala-de-espera/*', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});
app.get('/juego/*', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});

app.post('/api/getRooms', function(req, res){
    //console.log(req.body.lat);
    //console.log(req.body.lng);
    roomGameMdl.find().then(aRooms => {
        let aParsed = [];

        aRooms.forEach(oRoom => {
            aParsed.push({
                name: oRoom.name,
                lat: oRoom.lat,
                lng: oRoom.lng,
                uuid: oRoom.uuid
            })
        });
        res.send(aParsed);
    });
});

app.post('/api/createRoom', function(req, res){
    let sNewRoomId = uuid();

    let newRoom = new roomGameMdl();
    newRoom.name = req.body.roomName;
    newRoom.lat = req.body.lat;
    newRoom.lng = req.body.lng;
    newRoom.uuid = sNewRoomId;
    newRoom.save();

    res.send({
        newUuid: sNewRoomId
    });
});

io.on('connection', function (socket) {
    var ownUuid = null;

    socket.on('disconnect', function(){
        if(ownUuid && oActiveUsers.hasOwnProperty(ownUuid)){
            if(oActiveUsers[ownUuid].inRoom){
                let room = oActiveRooms[oActiveUsers[ownUuid].inRoom];
                let nIndex = room.players.indexOf(ownUuid);
                if(nIndex != -1){
                    room.players.splice(nIndex, 1);
                }
                room.players.forEach(sPlayerId => {
                    if(oActiveUsers.hasOwnProperty(sPlayerId)){
                        let oSocket = oActiveUsers[sPlayerId].socket;
                        oSocket.emit('player-disconnected', ownUuid)
                    }
                });
            }
            delete(oActiveUsers[ownUuid]);
        }
    });

    socket.on('joinRoom', function(oData){
        ownUuid = oData.myUuid;
        oActiveUsers[oData.myUuid] = {
            name: oData.myName,
            socket: socket,
            inRoom: oData.roomUuid
        };

        if(oActiveRooms.hasOwnProperty(oData.roomUuid)){
            let oRoomPlayers = oActiveRooms[oData.roomUuid].players;
            if(oRoomPlayers.indexOf(ownUuid) == -1){
                oRoomPlayers.push(oData.myUuid);
            }
            socket.emit('full-players-list', oRoomPlayers);

            oRoomPlayers.forEach(sPlayer => {
                if(oActiveUsers.hasOwnProperty(sPlayer)){
                    let oSocket = oActiveUsers[sPlayer].socket;
                    oSocket.emit('player-connected', ownUuid);
                }
            });
        }
        else{
            roomGameMdl.findOne({uuid:oData.roomUuid})
            .then(mRoom => {
                if(mRoom != null){
                    oActiveRooms[oData.roomUuid] = {
                        name: mRoom.name,
                        players: [oData.myUuid],
                        isPlaying: false
                    };

                    socket.emit('full-players-list', oActiveRooms[oData.roomUuid].players);
                }
            })
        }
    });

    socket.on('startGame', function(){
        let nGameId = oActiveUsers[ownUuid].inRoom;
        if(nGameId){
            let oRoom = oActiveRooms[nGameId];
            oRoom.isPlaying = true;

            oRoom.players.forEach(sPlayerId => {
                if(oActiveUsers.hasOwnProperty(sPlayerId) && oActiveUsers[sPlayerId].inRoom == nGameId){
                    let oSocket = oActiveUsers[sPlayerId].socket;

                    oSocket.emit('game-started');
                }
            });
            socket.emit('ball-received');
        }
    });

    socket.on('kick-ball', function(){
        let nGameId = oActiveUsers[ownUuid].inRoom;
        if(nGameId && oActiveRooms.hasOwnProperty(nGameId)){
            let aPlayers = JSON.parse(JSON.stringify(oActiveRooms[nGameId].players));
            if(aPlayers.length == 1){
                socket.emit('ball-received');
            }
            else{
                let nIndex = aPlayers.indexOf(ownUuid);
                if(nIndex != -1){
                    aPlayers.splice(nIndex, 1);
                }
                let nRandom = randomInt(0, aPlayers.length-1);
                let oPlayer = oActiveUsers[aPlayers[nRandom]];
                oPlayer.socket.emit('ball-received');
            }
        }
    })
});

server.listen(port);
console.log("Listening on: "+port);
io.set("origins", "*:*");


function randomInt(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}