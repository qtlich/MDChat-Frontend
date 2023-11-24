import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSideBarComponent } from './channel-side-bar.component';

describe('ChannelSideBarComponent', () => {
  let component: ChannelSideBarComponent;
  let fixture: ComponentFixture<ChannelSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
