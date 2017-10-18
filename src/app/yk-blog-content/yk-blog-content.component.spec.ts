import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YkBlogContentComponent } from './yk-blog-content.component';

describe('YkBlogContentComponent', () => {
  let component: YkBlogContentComponent;
  let fixture: ComponentFixture<YkBlogContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YkBlogContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YkBlogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
