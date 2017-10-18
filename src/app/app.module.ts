import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule } from '@angular/material';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BlogService } from './blog.service';
import { YkFolderComponent } from './yk-folder/yk-folder.component';
import { YkBlogContentComponent } from './yk-blog-content/yk-blog-content.component';

@NgModule({
  declarations: [
    AppComponent,
    YkFolderComponent,
    YkBlogContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    AppRoutingModule
  ],
  providers: [
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
