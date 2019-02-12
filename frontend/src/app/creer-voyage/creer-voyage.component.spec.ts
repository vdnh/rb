import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerVoyageComponent } from './creer-voyage.component';

describe('CreerVoyageComponent', () => {
  let component: CreerVoyageComponent;
  let fixture: ComponentFixture<CreerVoyageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreerVoyageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreerVoyageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
