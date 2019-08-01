import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemorquageProComponent } from './remorquage-pro.component';

describe('RemorquageProComponent', () => {
  let component: RemorquageProComponent;
  let fixture: ComponentFixture<RemorquageProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemorquageProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemorquageProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
