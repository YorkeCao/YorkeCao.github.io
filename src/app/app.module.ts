import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MdToolbarModule, MdButtonModule, MdIconModule, MdSidenavModule, MdListModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BlogService } from './blog.service';
import { ContentComponent } from './content/content.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdListModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
