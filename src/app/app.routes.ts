import { Routes } from '@angular/router';
import { Layout } from './core/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'playground',
        loadComponent: () => import('./features/playground/playground').then((m) => m.Playground),
      },
      {
        path: 'workflow',
        loadComponent: () =>
          import('./features/workflow-canvas/workflow-canvas').then((m) => m.Floblex),
      },
    ],
  },
];
