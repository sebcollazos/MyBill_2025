<script>
    import { appStore } from "./stores";
    import { createForm } from "svelte-forms-lib";

    let platformText = "Condiciones de uso de la Plataforma:\n\n" +
    "Lorem ipsum dolor sit amet consectetur adipisicing elit." + 
    "Aliquid sequi debitis voluptate consequuntur eum iusto"+
    "incidunt a architecto velit, accusantium officiis porro"+
    "inventore ullam similique praesentium quas magni eius"+
    "voluptatibus. Lorem ipsum, dolor sit amet consectetur"+
    "adipisicing elit. In atque porro laboriosam officia"+
    "aperiam incidunt veniam vitae dolorum distinctio fugit"+
    "dicta repellat facere nihil debitis, ipsa dolorem rerum"+
    "deserunt consectetur. Lorem ipsum dolor sit amet"+
    "consectetur adipisicing elit. Incidunt eum corporis"+
    "maxime temporibus quisquam id quod, blanditiis"+
    "repudiandae. Corporis accusantium natus dolorem veniam"+
    "voluptatibus vitae velit excepturi, repellat dicta? Vel."+
    "Lorem ipsum dolor sit amet consectetur adipisicing elit."+
    "Rem libero cupiditate deserunt? Quos possimus aperiam,"+
    "ea impedit reiciendis, magnam necessitatibus iste"+
    "temporibus nisi deserunt pariatur consectetur quo,"+
    "eligendi facere magni. Lorem ipsum dolor sit amet"+
    "consectetur adipisicing elit. Aliquid sequi debitis"+
    "voluptate consequuntur eum iusto incidunt a architecto"+
    "velit, accusantium officiis porro inventore ullam"+
    "similique praesentium quas magni eius voluptatibus."+
    "Lorem ipsum, dolor sit amet consectetur adipisicing"+
    "elit. In atque porro laboriosam officia aperiam incidunt"+
    "veniam vitae dolorum distinctio fugit dicta repellat"+
    "facere nihil debitis, ipsa dolorem rerum deserunt"+
    "consectetur. Lorem ipsum dolor sit amet consectetur"+
    "adipisicing elit. Incidunt eum corporis maxime"+
    "temporibus quisquam id quod, blanditiis repudiandae."+
    "Corporis accusantium natus dolorem veniam voluptatibus"+
    "vitae velit excepturi, repellat dicta? Vel. Lorem ipsum"+
    "dolor sit amet consectetur adipisicing elit. Rem libero"+
    "cupiditate deserunt? Quos possimus aperiam, ea impedit"+
    "reiciendis, magnam necessitatibus iste temporibus nisi"+
    "deserunt pariatur consectetur quo, eligendi facere"+
    "magni. Lorem ipsum dolor sit amet consectetur"+
    "adipisicing elit. Aliquid sequi debitis voluptate"+
    "consequuntur eum iusto incidunt a architecto velit,"+
    "accusantium officiis porro inventore ullam similique"+
    "praesentium quas magni eius voluptatibus. Lorem ipsum,"+
    "dolor sit amet consectetur adipisicing elit. In atque"+
    "porro laboriosam officia aperiam incidunt veniam vitae"+
    "dolorum distinctio fugit dicta repellat facere nihil"+
    "debitis, ipsa dolorem rerum deserunt consectetur. Lorem"+
    "ipsum dolor sit amet consectetur adipisicing elit."+
    "Incidunt eum corporis maxime temporibus quisquam id"+
    "quod, blanditiis repudiandae. Corporis accusantium natus"+
    "dolorem veniam voluptatibus vitae velit excepturi,"+
    "repellat dicta? Vel. Lorem ipsum dolor sit amet"+
    "consectetur adipisicing elit. Rem libero cupiditate"+
    "deserunt? Quos possimus aperiam, ea impedit reiciendis,"+
    "magnam necessitatibus iste temporibus nisi deserunt"+
    "pariatur consectetur quo, eligendi facere magni."

    const { form, errors, state, handleChange, handleSubmit } = createForm({
        initialValues: {
            platform: false,
        },
        validate: (values) => {
            let errs = {};
            if (!values.platform) {
                errs["platform"] =
                    "Debe aceptar las condiciones antes de continuar";
            }
            return errs;
        },
        onSubmit: (values) => {
            //alert(JSON.stringify(values));
            //alert('Formulario Enviado');
            localStorage.setItem("mybill-tc-platform", JSON.stringify('true'));
            handleRoute('personal');
        },
    });

    function handleRoute(route) {
        $appStore.route = route;
    }

</script>

<div class="card text-center">
    <div class="card-header">
        <h3>Condiciones de Uso de la Plataforma</h3>
    </div>
    <div class="card-body">
        <div class="row_container">
            <form on:submit={handleSubmit} novalidate>
                <div class="form-group">
                    <textarea
                        readonly
                        class="form-control full-width"
                        rows="8"
                        cols="180"
                        id="platform-conditions"
                        bind:value={platformText}></textarea>
                </div>
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="platform"
                        on:change={handleChange}
                        bind:checked={$form.platform} />

                    <label class="form-check-label" for="platform">
                        He leído y acepto las condiciones de Uso de la
                        Plataforma.
                    </label>
                    {#if $errors.platform}
                        <br><small class="text-danger">{$errors.platform}</small>
                    {/if}
                </div>
                <p></p>
                <button class="btn btn-primary" type="submit">Continuar</button>
                <button class="btn btn-secondary" on:click={() => handleRoute('home')}>Ir al Inicio</button>

            </form>
        </div>
    </div>
</div>
