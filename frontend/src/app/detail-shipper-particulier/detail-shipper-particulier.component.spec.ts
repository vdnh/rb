import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShipperParticulierComponent } from './detail-shipper-particulier.component';

describe('DetailShipperParticulierComponent', () => {
  let component: DetailShipperParticulierComponent;
  let fixture: ComponentFixture<DetailShipperParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailShipperParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShipperParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
