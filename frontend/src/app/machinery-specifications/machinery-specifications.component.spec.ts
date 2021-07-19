import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinerySpecificationsComponent } from './machinery-specifications.component';

describe('MachinerySpecificationsComponent', () => {
  let component: MachinerySpecificationsComponent;
  let fixture: ComponentFixture<MachinerySpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachinerySpecificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinerySpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
