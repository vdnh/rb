import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculePrixComponent } from './calcule-prix.component';

describe('CalculePrixComponent', () => {
  let component: CalculePrixComponent;
  let fixture: ComponentFixture<CalculePrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculePrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculePrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
