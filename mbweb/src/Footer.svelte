<script>
    import {appStore} from './stores';

  function handleRoute(route) {
        $appStore.route = route;
    }
</script>

<footer>
    <div class="row_container align-items-center space_between">
        <a href="http://www.sena.edu.co/es-co/Paginas/default.aspx" target="_blank" rel="noopener">
            <img alt="logo_sena" id="logo_sena" src="img/logo_sena-150x150.png " sizes="(max-width: 77px) 100vw, 77px">
        </a>
        <a href="https://apps.co/" target="_blank" rel="noopener">
            <img id="logo_appsco" src="img/appsco-logo.png" alt="logo_appsco">
        </a>
        <button class="footer_text_link" on:click={() => handleRoute('team')}>
            <img src="img/equipo-1.png" alt="" >
        </button>
        <button class="footer_text_link" on:click={() => handleRoute('about')}>
            <img src="img/about.png" alt="" >
        </button>
    </div>
    <br>
    <div class="row_container align-items-center space_between small_footer">
        <p>© 2021 MyBill - Canasta de facturas</p>
        <button class="btn btn_link text-white " on:click={() => handleRoute('home')}>Ir al Inicio</button>
    </div>
</footer>
