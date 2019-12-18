import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonSignatureComponent } from './bon-signature.component';

describe('BonSignatureComponent', () => {
  let component: BonSignatureComponent;
  let fixture: ComponentFixture<BonSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
