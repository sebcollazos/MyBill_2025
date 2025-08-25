<script>
	import { Button } from 'sveltestrap';

	import { emisor_data } from './emisor-store.js';

/*
	import { inversor_data } from './inversor-store.js';
	import { tasas_data } from './tasas-store.js';
	*/

	function clear() {
		emisor_data.set([]);
		inversor_data.set([]);
		tasas_data.set([]);
	}
</script>

<Button color="warning" disabled on:click={clear}>Reiniciar Simulador</Button>
