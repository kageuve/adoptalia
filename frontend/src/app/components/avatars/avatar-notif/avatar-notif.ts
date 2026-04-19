import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-notif',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-wrapper" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.width]="size" [attr.height]="size" [attr.viewBox]="'0 0 ' + size + ' ' + size">
        <clipPath [id]="'clip-' + uid">
          <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="size/2 - 1"/>
        </clipPath>

        <!-- Fondo -->
        <circle
          [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="size/2 - 1"
          fill="#FAECE7" stroke="#F0997B" stroke-width="0.5"/>

        <!-- Cabeza -->
        <circle
          [attr.cx]="size/2" [attr.cy]="size * 0.35" [attr.r]="size * 0.18"
          fill="#D85A30"/>

        <!-- Cuerpo -->
        <ellipse
          [attr.cx]="size/2" [attr.cy]="size * 0.78"
          [attr.rx]="size * 0.3" [attr.ry]="size * 0.22"
          fill="#D85A30"
          [attr.clip-path]="'url(#clip-' + uid + ')'"/>

        <!-- Badge notificaciones: fondo blanco + círculo rojo -->
        <circle
          [attr.cx]="size * 0.80" [attr.cy]="size * 0.20"
          [attr.r]="badgeRadius + 2"
          fill="white"/>
        <circle
          [attr.cx]="size * 0.80" [attr.cy]="size * 0.20"
          [attr.r]="badgeRadius"
          fill="#E24B4A"/>

        <!-- Número o 99+ -->
        <text
          [attr.x]="size * 0.80"
          [attr.y]="size * 0.20 + badgeFontSize * 0.38"
          text-anchor="middle"
          [attr.font-size]="badgeFontSize"
          font-weight="500"
          fill="white"
          font-family="sans-serif">
          {{ displayCount }}
        </text>
      </svg>
    </div>
  `,
  styles: [`
    .avatar-wrapper {
      display: inline-block;
      position: relative;
    }
  `]
})
export class AvatarNotifComponent {
  @Input() size: number = 40;
  @Input() count: number = 0;

  uid = Math.random().toString(36).slice(2);

  get displayCount(): string {
    return this.count > 99 ? '99+' : String(this.count);
  }

  get badgeRadius(): number {
    return this.count > 9 ? this.size * 0.16 : this.size * 0.13;
  }

  get badgeFontSize(): number {
    return this.count > 99 ? this.size * 0.10 : this.size * 0.13;
  }
}