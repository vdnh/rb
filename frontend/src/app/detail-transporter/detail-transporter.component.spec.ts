import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTransporterComponent } from './detail-transporter.component';

describe('DetailTransporterComponent', () => {
  let component: DetailTransporterComponent;
  let fixture: ComponentFixture<DetailTransporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTransporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
