import { TestBed } from '@angular/core/testing';

import { ChannelRestService } from '../services/channels/channel.rest.service';

describe('ChannelService', () => {
  let service: ChannelRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
