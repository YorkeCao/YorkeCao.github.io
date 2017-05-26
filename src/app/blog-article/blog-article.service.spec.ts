import { TestBed, inject } from '@angular/core/testing';

import { BlogArticleService } from './blog-article.service';

describe('BlogArticleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogArticleService]
    });
  });

  it('should be created', inject([BlogArticleService], (service: BlogArticleService) => {
    expect(service).toBeTruthy();
  }));
});
