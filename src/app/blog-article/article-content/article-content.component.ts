import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import * as marked from 'marked';
import 'rxjs/add/operator/switchMap';

import { BlogArticleService } from '../blog-article.service';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {
  article: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private blogArticleService: BlogArticleService
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .switchMap((params: Params) => this.blogArticleService.getArticle(params['title']))
      .subscribe(article => this.article = marked(article));
  }

}
