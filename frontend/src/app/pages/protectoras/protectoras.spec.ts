import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Protectoras } from './protectoras';

describe('Protectoras', () => {
  let component: Protectoras;
  let fixture: ComponentFixture<Protectoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Protectoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Protectoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
