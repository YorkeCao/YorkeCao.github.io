import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './content/content.component';

const appRoutes: Routes = [
  { path: 'blogs/:title', component: ContentComponent },
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
