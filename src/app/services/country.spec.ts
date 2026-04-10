import { TestBed } from '@angular/core/testing';

import { country } from './country';

describe('Country', () => {
  let service: country;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(country);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
