import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTransportProComponent } from './detail-transport-pro.component';

describe('DetailTransportProComponent', () => {
  let component: DetailTransportProComponent;
  let fixture: ComponentFixture<DetailTransportProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTransportProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTransportProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
