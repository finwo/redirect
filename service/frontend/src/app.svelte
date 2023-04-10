<script>
  import { onDestroy } from 'svelte';
  import { Router    } from 'svelte-router-spa';
  import * as apiClient from './lib/api-client';
  import { routes } from './lib/routes';

  import Spinner       from './components/loader/spinner.svelte';
  import LoginPage     from './components/page/login.svelte';

  function authGuard() {
    return apiClient.isLoggedIn.value;
  }

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

