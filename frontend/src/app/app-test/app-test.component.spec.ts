import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestComponent } from './app-test.component';

describe('AppTestComponent', () => {
  let component: AppTestComponent;
  let fixture: ComponentFixture<AppTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
