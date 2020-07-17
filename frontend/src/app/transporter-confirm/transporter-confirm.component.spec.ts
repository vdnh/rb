import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterConfirmComponent } from './transporter-confirm.component';

describe('TransporterConfirmComponent', () => {
  let component: TransporterConfirmComponent;
  let fixture: ComponentFixture<TransporterConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporterConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
