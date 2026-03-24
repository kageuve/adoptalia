import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheltersService } from '../../services/shelters.service';
import { Shelter } from '../../types/shelter.model';

@Component({
  selector: 'app-protectoras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protectoras.html',
  styleUrls: ['./protectoras.scss']
})
export class Protectoras implements OnInit {

  shelters: Shelter[] = [];

  constructor(private sheltersService: SheltersService) {}

  ngOnInit(): void {
    this.sheltersService.getShelters().subscribe(data => {
      this.shelters = data;
    });
  }

  // Asegura que la página se desplace al inicio cada vez que se carga
  ngAfterViewInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
