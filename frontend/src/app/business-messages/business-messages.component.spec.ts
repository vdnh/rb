import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMessagesComponent } from './business-messages.component';

describe('BusinessMessagesComponent', () => {
  let component: BusinessMessagesComponent;
  let fixture: ComponentFixture<BusinessMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
