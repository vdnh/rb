import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransporterComponent } from './new-transporter.component';

describe('NewTransporterComponent', () => {
  let component: NewTransporterComponent;
  let fixture: ComponentFixture<NewTransporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTransporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
