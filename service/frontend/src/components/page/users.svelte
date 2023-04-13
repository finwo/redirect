<script>
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';
  import { listUsers } from '../../lib/api-client';

  let users = [];

  function loadUsers() {
    listUsers().then(response => users = response.data);
  }

  loadUsers();
</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>
          <button>
            <PlusSquare class="vmiddle"/>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td>{user.username}</td>
          <td>
            <button><Edit class="vmiddle"/></button>
            <button><Delete class="vmiddle"/></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  th:last-child, td:last-child {
    text-align: right;
    width: 6em;
  }
  th button,
  td button {
    padding: 0.25em;
  }
</style>
