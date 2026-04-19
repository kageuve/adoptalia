import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { environment } from '../../../environments/environment';

type CounterKeys = 'adoptions' | 'shelters' | 'animals' | 'users';

@Component({
  selector: 'app-impacto',
  imports: [RouterLink],
  templateUrl: './impacto.html',
  styleUrls: ['./impacto.scss'],
})
export class Impacto implements AfterViewInit {

  //contadores animados
  adoptions = 0;
  shelters = 0;
  animals = 0;
  users = 0;

  private apiUrl = environment.apiUrl;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngAfterViewInit() {
    this.http.get<{ success: boolean; data: Record<CounterKeys, number> }>(`${this.apiUrl}/usuarios/impacto`).subscribe({
      next: (res) => {
        this.animateCounter('adoptions', res.data.adoptions);
        this.animateCounter('shelters', res.data.shelters);
        this.animateCounter('animals', res.data.animals);
        this.animateCounter('users', res.data.users);
      },
      error: (err) => console.error('Error cargando impacto:', err)
    });

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
  }

  animateCounter(counter: CounterKeys, target: number) {

    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;

    const timer = setInterval(() => {

      current += increment;

      if (current >= target) {
        this[counter] = target;
        clearInterval(timer);
      } else {
        this[counter] = Math.floor(current);
      }

      this.cdr.detectChanges();

    }, stepTime);

  }

  // Barra de progreso animada
  goalAdoptions = 100;

  get progress(): number {
    return (this.adoptions / this.goalAdoptions) * 100;
  }
}


