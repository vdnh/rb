import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviRapideComponent } from './suivi-rapide.component';

describe('SuiviRapideComponent', () => {
  let component: SuiviRapideComponent;
  let fixture: ComponentFixture<SuiviRapideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviRapideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviRapideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
