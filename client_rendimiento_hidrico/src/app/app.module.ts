import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';

import { HomeModule } from './pages/home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMap,
    GoogleMapsModule,  
    BrowserAnimationsModule,
    MatTabsModule,
    NgxSpinnerModule,
    HomeModule    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
