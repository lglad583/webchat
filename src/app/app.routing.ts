import { ModuleWithProviders } from '@angular/core';

import { Routes , RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NotAvailableComponent } from './not-available/not-available.component';


const appRoutes :Routes = [
  { path : '' , component : LoginComponent},
  { path : 'home' , component : HomeComponent},
  { path : 'home/:userid' , component : HomeComponent},
  { path : '**' , component : NotAvailableComponent},
];

export const appRouting :ModuleWithProviders = RouterModule.forRoot(appRoutes);
