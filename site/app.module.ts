import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule }     from '@angular/router';

import { AppComponent }     from './app.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import {GameLocationComponent} from "./game-location.component";
import {WaitingRoomComponent} from "./waiting-room.component";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyChKwSFDf325cs_n_1hd4RaLObtv6qhN78'
        }),
        RouterModule.forRoot([
            {
                path: 'lugar',
                component: GameLocationComponent
            },
            {
                path: 'sala-de-espera/:uuid',
                component: WaitingRoomComponent
            },
            {
                path: 'juego',
                component: GameLocationComponent
            },
            {
                path: '',
                redirectTo: '/lugar',
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [ AppComponent, GameLocationComponent, WaitingRoomComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule {}