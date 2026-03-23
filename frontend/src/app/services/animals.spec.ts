import { TestBed } from '@angular/core/testing';

import { Animales } from './animales';

describe('Animales', () => {
  let service: Animales;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Animales);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
