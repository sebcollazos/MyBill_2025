<script>
  import { createForm } from "svelte-forms-lib";

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      email: "",
      password: "",
      rememberme: false,
    },
    validate: (values) => {
      let errs = {};
      if (values.email === "" || !emailValidator(values.email)) {
        errs["email"] = "Email válido es requerido.";
      }
      if (values.password === "" || !passwordValidator(values.password)) {
        errs["password"] = "La Contraseña es requerida.";
      }

      return errs;
    },
    onSubmit: (values) => {
      //alert(JSON.stringify(values));
      alert("Formulario Enviado");
    },
  });

  function emailValidator(value) {
    return (
      value &&
      !!value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    );
  }

  function passwordValidator(value) {
    return value.length > 7 && value.length < 16;
  }
</script>

<div class="row_container centered">
  <form on:submit={handleSubmit} novalidate>
    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        class="form-control"
        id="email"
        aria-describedby="emailHelp"
        name="email"
        on:change={handleChange}
        bind:value={$form.email} />
      <small id="emailHelp" class="form-text text-muted">Tu usuario en el sitio
        será tu cuenta de email.</small>
      {#if $errors.email}<small class="text-danger">{$errors.email}</small>{/if}
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input
        type="password"
        class="form-control"
        id="password"
        name="password"
        on:change={handleChange}
        bind:value={$form.password} />
      <small id="passwordHelp" class="form-text text-muted">Entre 8 a 16
        caracteres.</small>
      {#if $errors.password}
        <small class="text-danger">{$errors.password}</small>
      {/if}
    </div>
    <div class="form-group form-check">
      <input
        type="checkbox"
        class="form-check-input"
        id="rememberme"
        on:change={handleChange}
        bind:checked={$form.rememberme} />
      <label class="form-check-label" for="rememberme">Recordarme</label>
    </div>
    <button type="submit" class="btn btn-primary">Ingresar</button>
  </form>
</div>
