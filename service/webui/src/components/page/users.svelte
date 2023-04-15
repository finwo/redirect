<script>
  import { onDestroy } from 'svelte';
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';
  import { user, listUsers, createUser, editUser, deleteUser } from '../../lib/api-client';

  let authUser = {};
  onDestroy(user.subscribe(value => authUser = value || {}));

  let users    = [];
  let createUserData = { username: '', password: '' };
  let editUserId     = '';
  let editUserData   = { username: '', password: '' };
  let deleteUserData = { username: '' };

  function loadUsers() {
    listUsers().then(response => users = response.data);
  }

  function closeDialogOnClick(el) {
    return e => {
      if (e.target == el) {
        el.close();
      }
    }
  }

  function openCreateUserDialog() {
    createUserData = { username: '', password: '' };
    createUserDialog.showModal();
  }

  async function handleCreateUserDialog() {
    createUserDialog.close();
    await createUser(createUserData.username, createUserData.password);
    loadUsers();
  }

  function openEditUserDialog(user) {
    return () => {
      editUserId   = user.username;
      editUserData = { ...user, password: '' };
      editUserDialog.showModal();
    };
  }

  async function handleEditUserDialog() {
    // TODO: require password update on username update
    editUserDialog.close();
    if (!editUserData.password) editUserData.password = false;
    await editUser(editUserId, editUserData);
    loadUsers();
  }

  function openDeleteUserDialog(user) {
    return () => {
      deleteUserData = { ...user };
      deleteUserDialog.showModal();
    };
  }

  async function handleDeleteUserDialog(event) {
    if (event.target.returnValue !== 'confirm') return;
    await deleteUser(deleteUserData.username);
    loadUsers();
  }

  loadUsers();
</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>
          <button on:click={openCreateUserDialog}>
            <PlusSquare class="vmiddle"/>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each users as listUser}
        <tr>
          <td>{listUser.username}</td>
          <td>
            <button on:click={openEditUserDialog(listUser)}><Edit class="vmiddle"/></button>
            <button disabled={listUser.username == authUser.username} on:click={openDeleteUserDialog(listUser)}><Delete class="vmiddle"/></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<dialog id=createUserDialog on:click={closeDialogOnClick(createUserDialog)}>
  <header>
    Create user
  </header>
  <form on:submit|preventDefault={handleCreateUserDialog}>
    <div class="form-group">
      <label for=createUsername>Username</label>
      <input type=text name=createUsername bind:value={createUserData.username}>
    </div>
    <div class="form-group">
      <label for=createPassword>Password</label>
      <input type=password name=createPassword bind:value={createUserData.password}>
    </div>
    <br />
    <button type="submit">Create</button>
  </form>
</dialog>

<dialog id=editUserDialog on:click={closeDialogOnClick(editUserDialog)}>
  <header>
    Edit user
  </header>
  <form on:submit|preventDefault={handleEditUserDialog}>
    <div class="form-group">
      <label for=editUsername>Username</label>
      <input type=text name=editUsername bind:value={editUserData.username}>
    </div>
    <div class="form-group">
      <label for=editPassword>Password (only enter if updating)</label>
      <input type=password name=editPassword bind:value={editUserData.password}>
    </div>
    <br />
    <button type="submit">Update</button>
  </form>
</dialog>

<dialog id=deleteUserDialog on:click={closeDialogOnClick(deleteUserDialog)} on:close={handleDeleteUserDialog}>
  <header>
    Delete user
  </header>
  <form method="dialog">
    Are you sure you want to delete the user <code>{deleteUserData.username}</code>?<br/><br/>
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
