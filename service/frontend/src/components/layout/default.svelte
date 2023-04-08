<script>
  import { Route } from 'svelte-router-spa';
  import { logout } from '../../lib/api-client';

  export let currentRoute;
</script>

<button id=logoutButton on:click={logout}>
  Logout
</button>

<Route {currentRoute}/>

<style>
  #logoutButton {
    position : absolute;
    top      : 1em;
    right    : 1em;
  }
</style>
