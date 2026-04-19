import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarNotif } from './avatar-notif';

describe('AvatarNotif', () => {
  let component: AvatarNotif;
  let fixture: ComponentFixture<AvatarNotif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarNotif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarNotif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
