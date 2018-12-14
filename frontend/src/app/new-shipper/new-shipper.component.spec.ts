import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShipperComponent } from './new-shipper.component';

describe('NewShipperComponent', () => {
  let component: NewShipperComponent;
  let fixture: ComponentFixture<NewShipperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewShipperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
