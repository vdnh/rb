import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShipperComponent } from './detail-shipper.component';

describe('DetailShipperComponent', () => {
  let component: DetailShipperComponent;
  let fixture: ComponentFixture<DetailShipperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailShipperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
