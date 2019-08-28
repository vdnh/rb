import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportClientComponent } from './transport-client.component';

describe('TransportClientComponent', () => {
  let component: TransportClientComponent;
  let fixture: ComponentFixture<TransportClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
