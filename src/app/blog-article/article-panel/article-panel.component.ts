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
  selectedArticle = 'Spring Cloud';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogArticleService: BlogArticleService
  ) { }

  ngOnInit() {
    this.articleList = this.blogArticleService.getArticleList();
  }

  onSelect(title: string): void {
    this.selectedArticle = title;
    this.router.navigate([title], {relativeTo: this.activatedRoute});
  }
}
