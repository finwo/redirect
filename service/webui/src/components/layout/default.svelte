<script>
  import { Route, Navigate } from 'svelte-router-spa';
  import { logout } from '../../lib/api-client';
  import { routes } from '../../lib/routes';

  export let currentRoute;

  let filteredRoutes = routes.filter(route => {
    if (!route.name.startsWith('/')) return false;
    if (route.name == '/') return false;
    return true;
  });
</script>

<button id=logoutButton on:click={logout}>
  Logout
</button>

<nav>
  {#each filteredRoutes as route}
    <span><Navigate to={route.name}>{route.label}</Navigate></span>
  {/each}
</nav>

<Route {currentRoute}/>

<style>
  #logoutButton {
    position : absolute;
    top      : 1em;
    right    : 1em;
  }
  nav {
    border-bottom: 1px solid var(--border);
    margin-bottom: 1em;
    padding-bottom: 1em;
  }
  nav span {
    display: inline-block;
    text-transform: uppercase;
    border-left: 1px solid var(--border);
    padding: 6px 1em;
  }
  nav span:last-child {
    border-right: 1px solid var(--border);
  }
</style>
