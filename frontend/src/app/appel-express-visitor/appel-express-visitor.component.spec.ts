import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelExpressVisitorComponent } from './appel-express-visitor.component';

describe('AppelExpressVisitorComponent', () => {
  let component: AppelExpressVisitorComponent;
  let fixture: ComponentFixture<AppelExpressVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppelExpressVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppelExpressVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
