<script>
    import {appStore} from './stores';

    function handleRoute(route) {
        $appStore.route = route;
    }

</script>
<nav class="navbar navbar-light">
    <div class="btn-group btn-group-lg" role="group" aria-label="Navigation">
        <button class="btn btn-light" disabled={$appStore.route == 'home'} on:click={() => handleRoute('home')}>Inicio</button>
        <button class="btn btn-light" disabled={$appStore.route == 'simulator'} on:click={() => handleRoute('simulator')}>Simulador</button>
        <button class="btn btn-light" disabled={$appStore.route == 'login'} on:click={() => handleRoute('login')}>Ingresar</button>
        <button class="btn btn-light" disabled={$appStore.route == 'platform'} on:click={() => handleRoute('platform')}>Registro</button>
        <button class="btn btn-light" disabled={$appStore.route == 'vlog'} on:click={() => handleRoute('vlog')}>Vlog</button>
        <button class="btn btn-light" disabled={$appStore.route == 'logout'} on:click={() => handleRoute('logout')}>Salir</button>
    </div>
</nav>
