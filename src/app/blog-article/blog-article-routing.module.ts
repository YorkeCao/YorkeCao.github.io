import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticlePanelComponent } from './article-panel/article-panel.component';
import { ArticleContentComponent } from './article-content/article-content.component';

const routes: Routes = [
  {
    path: 'articles',
    component: ArticlePanelComponent,
    children: [{
      path: ':title',
      component: ArticleContentComponent
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogArticleRoutingModule { }
