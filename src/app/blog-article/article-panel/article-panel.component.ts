import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BlogArticleService } from '../blog-article.service';

@Component({
  selector: 'app-article-panel',
  templateUrl: './article-panel.component.html',
  styleUrls: ['./article-panel.component.scss']
})
export class ArticlePanelComponent implements OnInit {
  articleList: string[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogArticleService: BlogArticleService
  ) { }

  ngOnInit() {
    this.articleList = this.blogArticleService.getArticleList();
  }

  onSelect(title: string): void {
    console.log(title);
    this.router.navigate([title], {relativeTo: this.activatedRoute});
  }
}
