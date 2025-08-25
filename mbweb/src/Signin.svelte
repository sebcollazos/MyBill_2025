<script>
  import { dataset_dev } from "svelte/internal";
import { appStore } from "./stores";
  
  let nitFile;
  let nitActual = '';
  let disabled = true;
  let cupoActual = '0';
  let defaultData = [{
    "razon":'',
    "ciudad":'',
    "depto":'',
    "cupo":0
  }];

  const estados = [ '😡😡😡😡😡', '😶😡😡😡😡', '😶😶😡😡😡', '😶😶😶😡😡', '😶😶😶😶😡', '😶😶😶😶😶', '⭐😎😎😎😎', '⭐⭐😎😎😎', '⭐⭐⭐😎😎', '⭐⭐⭐⭐😎','⭐⭐⭐⭐⭐'];

  let jsonData = defaultData;

  function handleRoute(route) {
        $appStore.route = route;
  }
  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  	
	async function fetchNits() {
    console.log("Nit:", nitActual, "NitFile:", nitFile);
    if(nitFile){
      const response = await self.fetch('./nits/' + nitFile + '.json');

      if (response && response.ok) {
        jsonData = await response.json();
        jsonData = jsonData.filter( element => element.nit === nitActual);
      }
        //throw new Error(jsonData);
      if(!jsonData || jsonData.length == 0){
        jsonData = defaultData;
      }
      cupoActual = numberWithCommas(jsonData[jsonData.length - 1].cupo);
      console.log("jsonData:", jsonData)
      return jsonData;
    }
	}

  let promise = fetchNits();

  function nitInput(){
    if(nitActual.length >= 4){
      nitFile = nitActual.substring(0,4);
      console.log('nitFile: ', nitFile);
    }
  }

  function nitChange(){
    promise = fetchNits();
  }
</script>

<div class="card text-center">
  <div class="progress">
    <div
      class="progress-bar"
      role="progressbar"
      style="width: 10%;"
      aria-valuenow="10"
      aria-valuemin="0"
      aria-valuemax="100">
      10%
    </div>
  </div>

  <div class="card-header">
    <ul class="nav nav-pills card-header-pills">
      <li class="nav-item"><a class="nav-link active" href=".">Información Básica</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Comercial</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Proveedores</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Bancaria</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Seguros</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Bienes Raíces</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Accionaria (Socios)</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Clientes</a></li>
      <li class="nav-item disabled"><a class="nav-link disabled" href=".">Anexos</a></li>
    </ul>
  </div>
  <div class="card-body">
    <div class="row_container">
      <form class="needs-validation" novalidate>
        <div class="form-row" style="display:none">
          <div class="col-md-4 mb-3">
            <label for="fld_nombres">Nombres</label>
            <input
              type="text"
              class="form-control"
              id="fld_nombres"
              placeholder="Nombres"
              value="Juan Luis"
              required />
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-4 mb-3">
            <label for="fld_apellidos">Apellidos</label>
            <input
              type="text"
              class="form-control"
              id="fld_apellidos"
              placeholder="Apellidos"
              value="Manjarrés"
              required />
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-4 mb-3">
            <label for="fld_email">Email</label>
            <div class="input-group">
              <input
                type="email"
                class="form-control"
                id="fld_email"
                placeholder="Email"
                value="jumanja@gmail.com"
                aria-describedby="inputGroupPrepend"
                required />
              <div class="invalid-feedback">Ingrese un email válido</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="col-md-4 mb-3">
            <label for="fld_nit">Nit Empresa</label>
            {#await promise}
              <span>😅</span>
            {:then results}
              <span>😬</span>
            {:catch error}
              <span style="color: red;" title={error.message}>😳</span>
            {/await}
          <input
              type="text"
              class="form-control"
              id="fld_nit"
              placeholder="Nit"
              bind:value={ nitActual }
              on:change={ nitChange }
              on:input={ nitInput }
              required />
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-8 mb-7">
            <label for="validationCustom02">Nombre Empresa</label>
            <input
              type="text"
              class="form-control"
              id="validationCustom02"
              placeholder="Nombre Empresa"
              bind:value={ jsonData[0].razon }
              required />
            <div class="valid-feedback">Looks good!</div>
          </div>
<!--

        </div>

        <div class="form-row">
-->
<div class="col-md-6 mb-3">
            <label for="validationCustom03">Ciudad</label>
            <input
              type="text"
              class="form-control"
              id="validationCustom03"
              placeholder="Ciudad"
              bind:value={ jsonData[0].ciudad }
              required />
            <div class="invalid-feedback">Por favor ingrese una ciudad válida.</div>
          </div>
          <div class="col-md-3 mb-3">
            <label for="validationCustom04">Departamento</label>
            <input
              type="text"
              class="form-control"
              id="validationCustom04"
              placeholder="Departamento"
              bind:value={ jsonData[0].depto }
              required />
            <div class="invalid-feedback">Por favor Ingrese un departamento válido  .</div>
          </div>
        </div>

        <div class="form-row">
          <div class="col-md-3 mb-3">
            <label for="validationCustom04b">Cupo (En Miles)</label>
            <input
              type="text"
              class="form-control"
              id="validationCustom04"
              placeholder="No tiene cupo"
              bind:value={ cupoActual }
              readonly />
            <div class="invalid-feedback">0</div>
          </div>
          <div class="col-md-5 mb-5">
            <label for="validationCustom02b">Scoring</label>
              <span>({ jsonData[0].scoring == undefined ? 'No Disponible' : jsonData[0].scoring })</span>
              <p>
                {#await promise}
                    <span>...</span>
              {:then results}
                  {#if estados[jsonData[0].scoring] }
                    <span style="font-size: 1.5em;">{estados[jsonData[0].scoring]}</span>
                  {:else}
                    <span style="font-size: 1.5em;">Scoring No Disponible</span>
                  {/if}
              {:catch error}
                    <span style="color: red;" title={error.message}>😳</span>
              {/await}
  
            </p>
          </div>
        </div>

        <button class="btn btn-primary" type="submit">Continuar</button>
      </form>
    </div>
  </div>
</div>
