<script>
  import { onDestroy } from 'svelte';
  import { Router    } from 'svelte-router-spa';
  import * as apiClient from './lib/api-client';

  import DefaultLayout from './components/layout/default.svelte';

  import Spinner       from './components/loader/spinner.svelte';
  import HomePage      from './components/page/home.svelte';
  import LoginPage     from './components/page/login.svelte';
  import DashboardPage from './components/page/login.svelte';
  import NotFoundPage  from './components/page/not-found.svelte';

  function authGuard() {
    return apiClient.isLoggedIn.value;
  }

  const routes = [
    { name: '/'        , component: HomePage     , layout: DefaultLayout },
    { name: 'dashboard', component: DashboardPage, layout: DefaultLayout, onlyIf: { guard: authGuard, redirect: '/login' } },
    { name: '404'      , component: NotFoundPage , layout: DefaultLayout },
  ];


  let isLoading = true;
  let isLoggedIn = false;
  onDestroy(apiClient.isLoading.subscribe(value => isLoading = value));
  onDestroy(apiClient.isLoggedIn.subscribe(value => isLoggedIn = value));

</script>

{#if isLoading}
  <main id=loading>
    <Spinner/>
  </main>
{:else}
  {#if isLoggedIn}
    <Router {routes}/>
  {:else}
    <LoginPage/>
  {/if}
{/if}

<style>
  #loading {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

