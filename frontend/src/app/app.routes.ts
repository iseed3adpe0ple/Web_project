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
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/calendar/calendar').then(m => m.CalendarComponent)
  },
  {
     path: 'dashboard',
     loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },

  {
    path: 'groups',
    loadComponent: () => import('./pages/groups/groups').then(m => m.GroupsComponent)
  },
  {
    path: 'groups/:id',
    loadComponent: () => import('./pages/groups/group-detail/group-detail').then(m => m.GroupDetailComponent)
  },
  {
    path: 'invitations',
    loadComponent: () => import('./pages/invitations/invitations').then(m => m.InvitationsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
  },
];
