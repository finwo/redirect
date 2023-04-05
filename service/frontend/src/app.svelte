<script>
  import { Router } from 'svelte-router-spa';

  import DefaultLayout from './components/layout/default.svelte';

  import HomePage     from './components/page/home.svelte';
  import NotFoundPage from './components/page/not-found.svelte';

  const routes = [
    { name: '/'  , component: HomePage    , layout: DefaultLayout },
    { name: '404', component: NotFoundPage, layout: DefaultLayout },
  ];
</script>

<Router {routes}/>
