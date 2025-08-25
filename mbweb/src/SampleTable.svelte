<script>
	import { Button } from 'sveltestrap';

	import { debts_data } from './debts-store.js';

	function sample() {
		debts_data.set([
		{
			"id": 1,
			"name": "American Express",
			"balance": 400,
			"rate": 10,
			"min": 20,
			"order": 1
		},
		{
			"id": 2,
			"name": "Car 1",
			"balance": 3100,
			"rate": 9.75,
			"min": 30,
			"order": 2
		},
		{
			"id": 3,
			"name": "Car 2",
			"balance": 4500,
			"rate": 11.25,
			"min": 50,
			"order": 3
		},
		{
			"id": 4,
			"name": "Mastercard",
			"balance": 10000,
			"rate": 12,
			"min": 115,
			"order": 4
		},
		{
			"id": 5,
			"name": "University",
			"balance": 3600,
			"rate": 5,
			"min": 21,
			"order": 5
		}
	]);
	}
</script>

<Button color="warning" on:click={sample}>Sample Data</Button>
