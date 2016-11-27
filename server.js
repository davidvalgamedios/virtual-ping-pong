const express  = require('express');
const app      = express();
const port = 8000;

var https = require('https');
var fs = require('fs');

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


const env = 'dev';

var oRooms = {};
/*
uuid:{
    name:'asdasd',

}
*/
var oUsers = {};
/*
uuid: {
    name:asdfasdf,
    socket: socket
}
*/


// routes ======================================================================
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));

app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/build", express.static(__dirname + '/build'));


app.get('/', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});
app.get('/sala-de-espera', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});
app.get('/juego', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});

io.on('connection', function (socket) {
    var ownUuid = null;

    socket.on('disconnect', function(){
        if(ownUuid){
            delete(oUsers[ownUuid]);
            socket.broadcast.emit('userDisconnected', {
                uuid: ownUuid
            });
        }
    });

    socket.on('createRoom', function(oData){
        var newRoom = new roomGameMdl();
        newRoom.name = oData.name;
        newRoom.lat = oData.lat;
        newRoom.lng = oData.lng;
        newRoom.uuid = uuid();
        newRoom.save();
    });

    socket.on('register', function(oData){
        ownUuid = oData.uuid;
        oUsers[oData.uuid] = {
            name: oData.name,
            inCoffee: false
        };

        roomGameMdl.find().then(aRooms => {
            var aParsed = [];

            aRooms.forEach(oRoom => {
                aParsed.push({
                    name: oRoom.name,
                    lat: oRoom.lat,
                    lng: oRoom.lng,
                    uuid: oRoom.uuid
                })
            });

            socket.emit('rooms-list', aParsed);
        });
    });

    /*socket.on('changeStatus', function(bStatus){
        if(oUsers.hasOwnProperty(ownUuid)){
            oUsers[ownUuid].inCoffee = bStatus;
            socket.broadcast.emit('statusChanged', {
                uuid: ownUuid,
                inCoffee: bStatus
            })
        }
    });

    socket.on('msgToAll', function(msg){
        if(oUsers.hasOwnProperty(ownUuid)){
            socket.broadcast.emit('msgBroadcast', {
                userName: oUsers[ownUuid].name,
                msg: msg
            })
        }
    })*/
});

server.listen(port);
console.log("Listening on: "+port);
io.set("origins", "*:*");