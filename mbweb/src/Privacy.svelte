<script>
    import { appStore } from "./stores";
    import { createForm } from "svelte-forms-lib";

    let privacyText = "Política de Privacidad:\n\n" + 
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
            privacy: false,
        },
        validate: (values) => {
            let errs = {};
            if (!values.privacy) {
                errs["privacy"] =
                    "Debe aceptar la política de privacidad antes de continuar";
            }
            return errs;
        },
        onSubmit: (values) => {
            //alert(JSON.stringify(values));
            //alert('Formulario Enviado');
            localStorage.setItem("mybill-tc-privacy", JSON.stringify('true'));
            handleRoute('signin');
        },
    });

    function handleRoute(route) {
        $appStore.route = route;
    }

</script>

<div class="card text-center">
    <div class="card-header">
        <h3>Política de Privacidad</h3>
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
                        id="privacy-conditions"
                        bind:value={privacyText}></textarea>

                </div>
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="privacy"
                        on:change={handleChange}
                        bind:checked={$form.privacy} />

                    <label class="form-check-label" for="privacy">
                        He leído y acepto la Política de Privacidad de la
                        Plataforma.
                    </label>
                    {#if $errors.privacy}
                        <br><small class="text-danger">{$errors.privacy}</small>
                    {/if}
                </div>
                <p></p>
                <button class="btn btn-primary" type="submit">Continuar</button>
                <button class="btn btn-secondary"  on:click={() => handleRoute('home')}>Ir al Inicio</button>


            </form>
        </div>
    </div>
</div>
