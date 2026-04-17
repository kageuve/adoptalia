import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Adoptar } from './pages/adoptar/adoptar';
import { Protectoras } from './pages/protectoras/protectoras';
import { ComoFunciona } from './pages/como-funciona/como-funciona';
import { Impacto } from './pages/impacto/impacto';
import { Login } from './pages/login/login';
import { FichaAnimal } from './pages/ficha-animal/ficha-animal';
import { UserPanel } from './pages/user-panel/user-panel';
import { ShelterPanel } from './pages/shelter-panel/shelter-panel';

// Routing
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'adoptar', component: Adoptar },
  { path: 'protectoras', component: Protectoras },
  { path: 'como-funciona', component: ComoFunciona },
  { path: 'impacto', component: Impacto },
  { path: 'login', component: Login },
  { path: 'animal/:id', component: FichaAnimal },
  { path: 'panel-adoptante', component: UserPanel },
  { path: 'panel-protectora', component: ShelterPanel }
];
