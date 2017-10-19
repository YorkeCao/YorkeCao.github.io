import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YkUpdateLogsComponent } from './yk-update-logs/yk-update-logs.component';
import { YkBlogContentComponent } from './yk-blog-content/yk-blog-content.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/updates', pathMatch: 'full' },
  { path: 'updates', component: YkUpdateLogsComponent },
  { path: ':dir/:file', component: YkBlogContentComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
