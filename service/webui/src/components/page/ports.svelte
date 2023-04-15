<script>
  import { listPorts, createPort, editPort, deletePort } from '../../lib/api-client';
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';

  let ports = [];

  let createPortData = { ingress: '', egress: '' };
  let editPortId     = '';
  let editPortData   = { ingress: '', egress: '' };
  let deletePortId   = '';
  let deletePortData = { ingress: '', egress: '' };

  function openEditPortDialog(port) {
    return () => {
      editPortId   = port.ingress;
      editPortData = { ...port };
      editPortDialog.showModal();
    };
  }

  function openDeletePortDialog(port) {
    return () => {
      deletePortId   = port.ingress;
      deletePortData = { ...port };
      deletePortDialog.showModal();
    };
  }

  function openCreatePortDialog() {
    createPortData = { ingress: '', egress: '' };
    createPortDialog.showModal();
  }

  async function handleCreatePortDialog() {
    createPortDialog.close();
    await createPort(createPortData);
    loadPorts();
  }

  async function handleEditPortDialog() {
    editPortDialog.close();
    await editPort(editPortId, editPortData);
    loadPorts();
  }

  async function handleDeletePortDialog(event) {
    if (event.target.returnValue !== 'confirm') return;
    await deletePort(deletePortId);
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
    listPorts().then(response => ports = response.data);
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
          <button on:click={openCreatePortDialog}>
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
            <button on:click={openDeletePortDialog(port)}><Delete class="vmiddle"/></button>
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

<dialog id=createPortDialog on:click={closeDialogOnClick(createPortDialog)}>
  <header>
    Create port
  </header>
  <form on:submit|preventDefault={handleCreatePortDialog}>
    <div class="form-group">
      <label for=createIngress>Ingress</label>
      <input type=text name=createIngress bind:value={createPortData.ingress}>
    </div>
    <div class="form-group">
      <label for=createEgress>Egress</label>
      <input type=text name=createEgress bind:value={createPortData.egress}>
    </div>
    <br />
    <button type="submit">Create</button>
  </form>
</dialog>

<dialog id=deletePortDialog on:click={closeDialogOnClick(deletePortDialog)} on:close={handleDeletePortDialog}>
  <header>
    Delete port
  </header>
  <form method="dialog">
    Are you sure you want to delete the port for <code>{deletePortData.ingress}</code>?<br/><br/>
    <center>
      <button type="submit" value="cancel">Cancel</button>
      <button type="submit" value="confirm">Delete</button>
    </center>
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
