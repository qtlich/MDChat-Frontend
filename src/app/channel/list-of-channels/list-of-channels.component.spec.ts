import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfChannelsComponent } from './list-of-channels.component';

describe('ListOfChannelsComponent', () => {
  let component: ListOfChannelsComponent;
  let fixture: ComponentFixture<ListOfChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
