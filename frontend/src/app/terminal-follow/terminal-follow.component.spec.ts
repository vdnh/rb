import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalFollowComponent } from './terminal-follow.component';

describe('TerminalFollowComponent', () => {
  let component: TerminalFollowComponent;
  let fixture: ComponentFixture<TerminalFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
