import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostLittleComponent } from './create-post-little.component';

describe('CreatePostComponent', () => {
  let component: CreatePostLittleComponent;
  let fixture: ComponentFixture<CreatePostLittleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePostLittleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostLittleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
