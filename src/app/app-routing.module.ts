import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YkBlogContentComponent } from './yk-blog-content/yk-blog-content.component';

const appRoutes: Routes = [
  { path: ':dir/:file', component: YkBlogContentComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
