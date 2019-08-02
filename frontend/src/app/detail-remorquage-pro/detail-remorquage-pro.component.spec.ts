import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRemorquageProComponent } from './detail-remorquage-pro.component';

describe('DetailRemorquageProComponent', () => {
  let component: DetailRemorquageProComponent;
  let fixture: ComponentFixture<DetailRemorquageProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRemorquageProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRemorquageProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
