import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelExpressComponent } from './appel-express.component';

describe('AppelExpressComponent', () => {
  let component: AppelExpressComponent;
  let fixture: ComponentFixture<AppelExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppelExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppelExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
