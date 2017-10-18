import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { BlogService } from '../blog.service';
@Component({
  selector: 'app-yk-blog-content',
  templateUrl: './yk-blog-content.component.html',
  styleUrls: ['./yk-blog-content.component.scss']
})
export class YkBlogContentComponent implements OnInit {
  file: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .switchMap((params: Params) => this.blogService.getFile(params['dir'], params['file']))
      .subscribe(file => this.file = file);
  }

}
