import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDemandeDeChaqueComponent } from './list-demande-de-chaque.component';

describe('ListDemandeDeChaqueComponent', () => {
  let component: ListDemandeDeChaqueComponent;
  let fixture: ComponentFixture<ListDemandeDeChaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDemandeDeChaqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDemandeDeChaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
