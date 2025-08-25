import { writable } from 'svelte/store';

export let debts_titles = writable(["Id", "Nombre", "Balance", "Tasa (%)", "Pago Mínimo", "Orden"]);
	
export let debts_data = writable([
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
	
export let debts_default = writable([
	{
		"id": 0,
		"name": "Deuda Nueva",
		"balance": 0,
		"rate": 0,
		"min": 0,
		"order": 0
	}
]);

export let debts_totals = writable([false, true, false, true, false]);
