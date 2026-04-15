import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Countries } from './pages/countries/countries';
import { Search } from './pages/search/search';
import { CountryDetails } from './pages/country-details/country-details';
import { Favorites } from './pages/favorites/favorites';
import { About } from './pages/about/about';
import { Terms } from './pages/terms/terms';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'countries', component: Countries },
  { path: 'search', component: Search },
  { path: 'details/:cca3', component: CountryDetails },
  { path: 'favorites', component: Favorites },

  { path: 'about', component: About },
  { path: 'terms', component: Terms },

  { path: 'login', component: Login },
  { path: 'register', component: Register }
];