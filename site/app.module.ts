import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent }     from './app.component';
import { AgmCoreModule } from 'angular2-google-maps/core';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyChKwSFDf325cs_n_1hd4RaLObtv6qhN78'
        })
    ],
    declarations: [ AppComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule {}