import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'groups',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/groups/groups').then(m => m.GroupsComponent)
  },
  {
    path: 'groups/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/groups/group-detail/group-detail').then(m => m.GroupDetailComponent)
  },
  {
    path: 'invitations',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/invitations/invitations').then(m => m.InvitationsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
  },
];
