<script>
    import {appStore} from './stores';

    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
    import CompanyRoleList from "./CompanyRoleList.svelte";
    import Login from "./Login.svelte";
    import Logout from "./Logout.svelte";
    import Platform from "./Platform.svelte";
    import Personal from "./Personal.svelte";
    import Privacy from "./Privacy.svelte";
    import Signin from "./Signin.svelte";
    import Simulator from "./Simulator.svelte";
    import Vlog from "./Vlog.svelte";
    import Team from "./Team.svelte";
    import About from "./About.svelte";

    let tcAcepted = false;
    let persisted = {};

    $appStore = { route: "home" };

    restore();


    $: if (persisted) persist();
    function persist() {
        localStorage.setItem("mybill-conditions", JSON.stringify(persisted));
    }

    function restore() {
        const text = localStorage.getItem("mybill-conditions");
        if (text && text !== "{}") {
            persisted = JSON.parse(text);
        }

        let tcPlatform = localStorage.getItem("mybill-tc-platform");
        if (tcPlatform && tcPlatform !== "{}") {
            tcPlatform = true;
        }
        let tcPersonal = localStorage.getItem("mybill-tc-personal");
        if (text && text !== "{}") {
            tcPersonal = true;
        }
        let tcPrivacy = localStorage.getItem("mybill-tc-platform");
        if (text && text !== "{}") {
            tcPersonal = true;
        }

        tcAcepted = tcPlatform && tcPersonal && tcPersonal;
    }

</script>

    <Header />

    {#if $appStore.route == 'home'}
        <CompanyRoleList />
    {:else if $appStore.route == 'login'}
        <Login />
    {:else if $appStore.route == 'logout'}
        <Logout />
    {:else if (($appStore.route == 'platform' || $appStore.route == 'personal' || $appStore.route == 'privacy') && tcAcepted) }
        <Signin />
    {:else if $appStore.route == 'platform'}
        <Platform />
    {:else if $appStore.route == 'personal'}
        <Personal />
    {:else if $appStore.route == 'privacy'}
        <Privacy />
    {:else if $appStore.route == 'signin'}
        <Signin />
    {:else if $appStore.route == 'simulator'}
        <Simulator />
    {:else if $appStore.route == 'vlog'}
        <Vlog/>
    {:else if $appStore.route == 'team'}
        <Team/>
    {:else if $appStore.route == 'about'}
         <About/>
    {:else}
        <div>En construcción.</div>
    {/if}

    <Footer />
