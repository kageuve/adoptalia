import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.animateCounter('adoptions', 26);
    this.animateCounter('shelters', 12);
    this.animateCounter('animals', 90);
    this.animateCounter('users', 25);
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


