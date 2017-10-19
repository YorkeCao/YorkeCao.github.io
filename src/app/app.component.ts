import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Content } from './content';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "宇坤的博客";
  dirs: Content[];

  constructor(
    private router: Router,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.blogService.getDirs()
      .subscribe(dirs => this.dirs = dirs);
  }

  gotoList(name: string): void {
    this.router.navigate(['/' + name]);
  }
}
