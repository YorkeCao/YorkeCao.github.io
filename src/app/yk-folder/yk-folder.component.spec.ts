import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YkFolderComponent } from './yk-folder.component';

describe('YkFolderComponent', () => {
  let component: YkFolderComponent;
  let fixture: ComponentFixture<YkFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YkFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YkFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
