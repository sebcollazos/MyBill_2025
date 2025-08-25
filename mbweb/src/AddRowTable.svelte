<script>
	import { Button } from 'sveltestrap';

	import { debts_data, debts_default } from './debts-store.js';

	function addRow() {
		//console.log(JSON.stringify($debts_data));
		debts_data.set(
			JSON.parse(JSON.stringify($debts_data)).concat(
			JSON.parse(JSON.stringify($debts_default))
			)
		)
	}

	function updateStore(n) {
		console.log(n);
		return n
	}
</script>

<Button color="primary" on:click={addRow}>Add Row</Button>
