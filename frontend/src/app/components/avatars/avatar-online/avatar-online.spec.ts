import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarOnline } from './avatar-online';

describe('AvatarOnline', () => {
  let component: AvatarOnline;
  let fixture: ComponentFixture<AvatarOnline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarOnline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarOnline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
