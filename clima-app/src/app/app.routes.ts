import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'detalhes',
    loadComponent: () => import('./detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: 'cidades',
    loadComponent: () => import('./cidades/cidades.page').then((m) => m.CidadesPage),
  },
  {
    path: 'alertas',
    loadComponent: () => import('./alertas/alertas.page').then((m) => m.AlertasPage),
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./configuracoes/configuracoes.page').then((m) => m.ConfiguracoesPage),
  },
];
