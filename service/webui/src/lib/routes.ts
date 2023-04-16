import DefaultLayout from '../components/layout/default.svelte';

import HomePage      from '../components/page/home.svelte';
import PortsPage     from '../components/page/ports.svelte';
import UsersPage     from '../components/page/users.svelte';
import NotFoundPage  from '../components/page/not-found.svelte';

export const routes = [
  { name: '/'     , label: 'Home' , component: HomePage    , layout: DefaultLayout },
  { name: '/ports', label: 'Ports', component: PortsPage   , layout: DefaultLayout },
  { name: '/users', label: 'Users', component: UsersPage   , layout: DefaultLayout },
  { name: '404'   , label: '404'  , component: NotFoundPage, layout: DefaultLayout },
];
