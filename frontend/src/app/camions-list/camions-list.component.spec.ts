import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamionsListComponent } from './camions-list.component';

describe('CamionsListComponent', () => {
  let component: CamionsListComponent;
  let fixture: ComponentFixture<CamionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
