import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFlotteComponent } from './map-flotte.component';

describe('MapFlotteComponent', () => {
  let component: MapFlotteComponent;
  let fixture: ComponentFixture<MapFlotteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFlotteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFlotteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
