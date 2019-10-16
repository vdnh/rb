import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculerExpressComponent } from './calculer-express.component';

describe('CalculerExpressComponent', () => {
  let component: CalculerExpressComponent;
  let fixture: ComponentFixture<CalculerExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculerExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculerExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
