import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as marked from 'marked';
import 'rxjs/add/operator/toPromise';

const ARTICLES = [
  "Spring Cloud 架构概述",
  "Eureka - 服务发现",
  "Zuul - 反向代理",
  "Ribbon - 负载均衡",
  "Config - 配置中心"
];
const ARTICLE_PATH = '/assets/articles/Spring Cloud/';
const ARTICLE_SUFFIX = '.md';

@Injectable()
export class BlogArticleService {
  private articleList = ARTICLES;

  constructor(
    private http: Http
  ) { }

  getArticleList(): string[] {
    return this.articleList;
  }

  getArticle(title: string): Promise<string> {
    return this.http.get(ARTICLE_PATH + title + ARTICLE_SUFFIX)
      .toPromise()
      .then(response =>  marked(response.text() as string));
  }
}
