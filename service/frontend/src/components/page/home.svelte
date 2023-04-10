<script>
  import { listPorts, editPort } from '../../lib/api-client';
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';

  let ports = [];

  let editPortId   = '';
  let editPortData = { ingress: '', egress: '' };

  function openEditPortDialog(port) {
    return () => {
      editPortId   = port.ingress;
      editPortData = { ...port };
      editPortDialog.showModal();
    };
  }

  async function handleEditPortDialog() {
    await editPort(editPortId, editPortData);
    editPortDialog.close();
    loadPorts();
  }

  function closeDialogOnClick(el) {
    return e => {
      if (e.target == el) {
        el.close();
      }
    }
  }

  function loadPorts() {
    listPorts().then(response => ports = response.port.data);
  }

  loadPorts();
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
    Edit port
  </header>
  <form on:submit|preventDefault={handleEditPortDialog}>
    <div class="form-group">
      <label for=editIngress>Ingress</label>
      <input type=text name=editIngress bind:value={editPortData.ingress}>
    </div>
    <div class="form-group">
      <label for=editEgress>Egress</label>
      <input type=text name=editEgress bind:value={editPortData.egress}>
    </div>
    <br />
    <button type="submit">Update</button>
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
