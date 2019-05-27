import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemorquageComponent } from './remorquage.component';

describe('RemorquageComponent', () => {
  let component: RemorquageComponent;
  let fixture: ComponentFixture<RemorquageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemorquageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemorquageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
