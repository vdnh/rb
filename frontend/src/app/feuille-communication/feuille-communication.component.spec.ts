import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleCommunicationComponent } from './feuille-communication.component';

describe('FeuilleCommunicationComponent', () => {
  let component: FeuilleCommunicationComponent;
  let fixture: ComponentFixture<FeuilleCommunicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeuilleCommunicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeuilleCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
