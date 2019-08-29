import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportProComponent } from './transport-pro.component';

describe('TransportProComponent', () => {
  let component: TransportProComponent;
  let fixture: ComponentFixture<TransportProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
