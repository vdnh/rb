import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRemorquageComponent } from './detail-remorquage.component';

describe('DetailRemorquageComponent', () => {
  let component: DetailRemorquageComponent;
  let fixture: ComponentFixture<DetailRemorquageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRemorquageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRemorquageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
