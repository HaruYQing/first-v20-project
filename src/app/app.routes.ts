import { Routes } from '@angular/router';
import { Layout } from './core/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'playground',
        loadComponent: () => import('./features/playground/playground').then((m) => m.Playground),
      },
    ],
  },
];
