import { TestBed } from '@angular/core/testing';

import { VoteRestService } from './vote-button/services/vote.rest.service';

describe('VoteService', () => {
  let service: VoteRestService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
