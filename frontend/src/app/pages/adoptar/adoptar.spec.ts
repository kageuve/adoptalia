import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adoptar } from "./adoptar";

describe('Adoptar', () => {
  let component: Adoptar;
  let fixture: ComponentFixture<Adoptar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adoptar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adoptar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
