import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTerminalComponent } from './new-terminal.component';

describe('NewTerminalComponent', () => {
  let component: NewTerminalComponent;
  let fixture: ComponentFixture<NewTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
