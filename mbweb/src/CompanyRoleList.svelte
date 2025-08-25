<script>
    import CompanyRole from './CompanyRole.svelte';
    import Carousel from 'svelte-carousel'

    let callAPI = false;
    let jsonData = [];
    const defaultRoles = {
        data: [
            {rowStatus: 'A', code: 'Vendedor', name: 'Vender facturas'},
            {rowStatus: 'A', code: 'Comprador', name: 'Comprar facturas'}
        ]
    };

	async function getCompanyRoles() {
        const url = 'http://localhost:8080/api/companyRoles';
        const res = await fetch(url);
        //if (!res.ok || res.status === 404) return []; 
        if (!res.ok || res.status === 404) return defaultRoles; 
        jsonData = await res.json();
        //console.log('jsonData:', jsonData);
        return jsonData;
    }
    let rolesPromise = callAPI ? getCompanyRoles(): null;

</script>
<Carousel
    autoplay
    autoplayDuration={5000}
    let:loaded
>
  <div class="img-container">
    <img alt="mybill" src="img/mybill2.png" style="width:100%">
  </div>
  <div class="img-container">
    <img alt="mybill" src="img/mybill1.png" style="width:100%">
  </div>
  <div class="img-container">
    <img alt="mybill" src="img/mybill3.png" style="width:100%">
  </div>
</Carousel>

<div class="row_container centered">
    {#if callAPI }
        {#await rolesPromise}
            <div>Procesando ...</div>
        {:then roles}
            {#each roles.data as role}
                <CompanyRole role={role}/>
            {:else}
                <div>No encontré roles</div>
            {/each}
        {:catch error}
            <div>Error: {error.message}</div>
        {/await}
    {:else}
        {#each defaultRoles.data as role}
            <CompanyRole role={role}/>
        {:else}
            <div>No encontré roles</div>
        {/each}
    {/if}
</div>
