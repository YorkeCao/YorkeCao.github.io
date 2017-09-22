import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { BlogService } from '../blog.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  blog: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .switchMap((params: Params) => this.blogService.getBlog(params['title']))
      .subscribe(blog => this.blog = blog);
  }
}
