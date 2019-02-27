import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankClientComponent } from './bank-client.component';

describe('BankClientComponent', () => {
  let component: BankClientComponent;
  let fixture: ComponentFixture<BankClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
