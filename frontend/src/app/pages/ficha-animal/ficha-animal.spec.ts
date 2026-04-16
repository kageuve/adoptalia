import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAnimal } from './ficha-animal';

describe('FichaAnimal', () => {
  let component: FichaAnimal;
  let fixture: ComponentFixture<FichaAnimal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaAnimal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAnimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
