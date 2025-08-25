<script>
  import { appStore } from "./stores";

  function handleRoute(route) {
        removeTC();
        $appStore.route = route;
        window.location.href= "/";
    }

  function removeTC() {
    localStorage.removeItem("mybill-tc-platform");
    localStorage.removeItem("mybill-tc-personal");
    localStorage.removeItem("mybill-tc-privacy");
  }
</script>

<div class="row_container centered">
    <form>
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" checked id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Deseo Terminar esta Sesión</label>
        </div>

        <button type="submit" class="btn btn-primary" on:click={() => handleRoute('home')}>Salir</button>

      </form>
</div>
