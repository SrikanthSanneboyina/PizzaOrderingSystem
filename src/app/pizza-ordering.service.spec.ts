import { TestBed } from '@angular/core/testing';

import { PizzaOrderingService } from './pizza-ordering.service';

describe('PizzaOrderingService', () => {
  let service: PizzaOrderingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzaOrderingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
