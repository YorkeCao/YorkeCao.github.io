import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YkUpdateLogsComponent } from './yk-update-logs.component';

describe('YkUpdateLogsComponent', () => {
  let component: YkUpdateLogsComponent;
  let fixture: ComponentFixture<YkUpdateLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YkUpdateLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YkUpdateLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
