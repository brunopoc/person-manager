import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cadastrar',
    loadComponent: () => import('./pages/cadastrar/cadastrar.component').then(m => m.CadastrarComponent)
  },
  {
    path: 'buscar',
    loadComponent: () => import('./pages/buscar/buscar.component').then(m => m.BuscarComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
