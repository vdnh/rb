import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichTechniqueComponent } from './fich-technique.component';

describe('FichTechniqueComponent', () => {
  let component: FichTechniqueComponent;
  let fixture: ComponentFixture<FichTechniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichTechniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
