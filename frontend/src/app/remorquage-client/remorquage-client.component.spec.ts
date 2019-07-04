import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemorquageClientComponent } from './remorquage-client.component';

describe('RemorquageClientComponent', () => {
  let component: RemorquageClientComponent;
  let fixture: ComponentFixture<RemorquageClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemorquageClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemorquageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
