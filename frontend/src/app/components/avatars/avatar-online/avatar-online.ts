import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-avatar-online',
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
          fill="#EAF3DE" stroke="#97C459" stroke-width="0.5"/>
 
        <!-- Cabeza -->
        <circle
          [attr.cx]="size/2" [attr.cy]="size * 0.35" [attr.r]="size * 0.18"
          fill="#639922"/>
 
        <!-- Cuerpo -->
        <ellipse
          [attr.cx]="size/2" [attr.cy]="size * 0.78"
          [attr.rx]="size * 0.3" [attr.ry]="size * 0.22"
          fill="#639922"
          [attr.clip-path]="'url(#clip-' + uid + ')'"/>
 
        <!-- Badge online -->
        <circle
          [attr.cx]="size * 0.82" [attr.cy]="size * 0.72"
          [attr.r]="size * 0.13"
          fill="white"/>
        <circle
          [attr.cx]="size * 0.82" [attr.cy]="size * 0.72"
          [attr.r]="size * 0.10"
          fill="#1D9E75"/>
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
export class AvatarOnlineComponent {
  @Input() size: number = 40;
  uid = Math.random().toString(36).slice(2);
}
 