import { TestBed } from '@angular/core/testing';

import { PostDataService } from '../services/posts/post.data.service';
describe('PostService', () => {
  let service: PostDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
