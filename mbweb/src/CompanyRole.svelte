<script>
    import { appStore } from "./stores";
    import Simulator from "./Simulator.svelte";

    function handleRoute(route) {
        $appStore.route = route;
    }

    export let role;
</script>

<div class="card">
    <h2>{role.name}</h2>
    <div class="row_container">
        {#if role.code == 'Comprador'}
            <div class="d-none d-md-block col-md-3 ">
                <img
                    src="img/icons/briefcase_money.svg"
                    class="big_icon"
                    alt="" />
            </div>
            <div class="col col-md-5">
                Invierta en facturas aceptadas de emisores y pagadores
                previamente evaluados
                <ul>
                    <li>Minimiza riesgos operativos</li>
                    <li>Mejor rentabilidad vs mercado tradicional</li>
                    <li>Operaciones de corto plazo</li>
                    <li>Alta rotación del capital</li>
                    <li>Capitaliza la inversión inicial</li>
                </ul>
            </div>
            <div class="col col-md-4">
                <p />
                Para Ingresar, debes
                <button class="btn btn-primary" on:click={() => handleRoute('platform')}>Solicitar
                    Registro</button>
                <p />
                ¿Ya estás registrado?
                <button
                    class="btn btn-success"
                    on:click={() => handleRoute('login')}>Ingresar</button>
            </div>
        {:else if role.code == 'Vendedor'}
            <div class="d-none d-md-block col-md-3 ">
                <img src="img/icons/price_tag.svg" class="big_icon" alt="" />
            </div>
            <div class="col col-md-5">
                Descuenta tus facturas de forma ágil y oportuna a un costo
                razonable.
                <ul>
                    <li>Rápida financiación</li>
                    <li>Alivia el flujo de caja</li>
                    <li>Mantiene la operatividad</li>
                    <li>Genera nuevos negocios</li>
                    <li>Permite crecimiento</li>
                </ul>
            </div>
            <div class="col col-md-4">
                <p />
                Para Ingresar, debes
                <button class="btn btn-primary" on:click={() => handleRoute('platform')}>Solicitar
                    Registro</button>
                <p />
                ¿Ya estás registrado?
                <button
                    class="btn btn-success"
                    on:click={() => handleRoute('login')}>Ingresar</button>
            </div>
        {:else if role.code == 'Pagador'}
            <img src="img/icons/price_tag.svg" class="big_icon" alt="Pagador" />
            <div>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. quis.
                <ul>
                    <li>Numquam dicta ex molestiae voluptatem alias atque</li>
                    <li>erum ipsum eaque et vero quas?</li>
                    <li>Eius exercitationem, temporibus tempora</li>
                    <li>Ex repudiandae veniam necessitatibus</li>
                </ul>
                ¿Ya estás registrado?
                <button
                    class="btn btn-success"
                    on:click={() => handleRoute('login')}>Ingresar</button>
            </div>
        {:else if role.code == 'Simulador'}
            <div>
                <p>Este simulador permite obtener un aproximado del proceso de Liquidación</p>
                <Simulator />
            </div>
        {:else}
            <p>{role.code}</p>
        {/if}
    </div>
</div>
