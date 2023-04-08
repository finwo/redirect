<script>
  import { listPorts } from '../../lib/api-client';
  import { PlusSquare, Edit, Delete } from 'lucide-svelte';

  let ports = [];
  listPorts().then(response => ports = response.port.data);
</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Ingress</th>
        <th>Egress</th>
        <th><PlusSquare/></th>
      </tr>
    </thead>
    <tbody>
      {#each ports as port}
        <tr>
          <td>{port.ingress}</td>
          <td>{port.egress}</td>
          <td>
            <Edit/>
            <Delete/>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  th:last-child, td:last-child {
    text-align: right;
    width: 5em;
  }
</style>
