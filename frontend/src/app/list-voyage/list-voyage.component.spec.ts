import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoyageComponent } from './list-voyage.component';

describe('ListVoyageComponent', () => {
  let component: ListVoyageComponent;
  let fixture: ComponentFixture<ListVoyageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVoyageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVoyageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
