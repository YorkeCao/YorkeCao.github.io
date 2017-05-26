import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { BlogArticleRoutingModule } from './blog-article-routing.module';
import { ArticlePanelComponent } from './article-panel/article-panel.component';
import { ArticleContentComponent } from './article-content/article-content.component';

import { BlogArticleService } from './blog-article.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    BlogArticleRoutingModule
  ],
  declarations: [
    ArticlePanelComponent,
    ArticleContentComponent
  ],
  providers: [
    BlogArticleService
  ]
})
export class BlogArticleModule { }
