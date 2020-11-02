import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportExpressVisitorComponent } from './transport-express-visitor.component';

describe('TransportExpressVisitorComponent', () => {
  let component: TransportExpressVisitorComponent;
  let fixture: ComponentFixture<TransportExpressVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportExpressVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportExpressVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
