import { Component, OnInit } from '@angular/core';

import { BlogService } from './blog.service';
import { Blog } from './blog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "Yorke's Blog";
  blogs: Blog[];

  constructor(
    private blogService: BlogService
  ) {}

  ngOnInit() {
    this.blogService.getBlogList()
      .subscribe(blogs => this.blogs = blogs);
  }
}
