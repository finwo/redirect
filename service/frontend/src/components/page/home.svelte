<script>
  import { listPorts } from '../../lib/api-client';
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';

  let ports = [];
  listPorts().then(response => ports = response.port.data);

  function openEditPortDialog(port) {
    return () => {
       editPortDialog.showModal();
    };
  }

  function closeDialogOnClick(el) {
    return e => {
      if (e.target == el) {
        el.close();
      }
    }
  }


</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Ingress</th>
        <th>Egress</th>
        <th>
          <button>
            <PlusSquare class="vmiddle"/>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each ports as port}
        <tr>
          <td>{port.ingress}</td>
          <td>{port.egress}</td>
          <td>
            <button on:click={openEditPortDialog(port)} ><Edit class="vmiddle"/></button>
            <button><Delete class="vmiddle"/></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<dialog id=editPortDialog on:click={closeDialogOnClick(editPortDialog)}>
  <header>
    Hello World
  </header>
  <form>
    FooBar
  </form>
</dialog>

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
