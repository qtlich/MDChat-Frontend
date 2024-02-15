import { TestBed } from '@angular/core/testing';

import { AuthDataService } from './auth.data.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: AuthDataService = TestBed.get(AuthDataService);
    expect(service).toBeTruthy();
  });
});
