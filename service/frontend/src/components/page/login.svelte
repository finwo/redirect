<script>
  import { performLogin } from '../../lib/api-client';

  let working = false;

  async function handleLogin(e) {
    const formData = new FormData(e.target);
    const data     = {};
    for(const entry of formData) {
      const [key, value] = entry;
      data[key] = value;
    }

    working = true;
    await performLogin(data.username, data.password);
    working = false;
  }

</script>

<form on:submit|preventDefault={handleLogin}>
  <label for=username>Username</label>
  <input type=text name=username disabled={working}>
  <label for=password>Password</label>
  <input type=password name=password disabled={working}>
  <div>
    <a href="#!">Forgot password (tbd)</a>
    <br/>
    <br/>
  </div>
  <button disabled={working}>Login</button>
</form>

<style>
  form {
    width: 20rem;
    max-width: 100%;
    margin: 5rem auto 0 auto;
  }

  input {
    display: block;
    width: 100%;
  }
</style>
