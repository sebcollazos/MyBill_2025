import { writable } from 'svelte/store';

export let tasas_corr_titles = writable(
    [
        "Tasa mes: ",
        "Pagos anuales: ",
        "Tasa Trimestral: ",
        "Pagos anuales: ",
        "Tasa Tanual: ",
        "Pagos anuales (para dias): ",
        "Tasa Dias: "
    ]);

export let tasas_comi_titles = writable(
    [
        "Tasa mes: ",
        "Pagos anuales: ",
        "Tasa anual: ",
        "Tasa mes: ",
        "Pagos anuales: ",
        "Tasa anual: "

    ]);

    
export let tasas_mora_titles = writable(
    [
        "Tasa mes: ",
        "Pagos anuales: ",
        "Tasa Trimestral: ",
        "Pagos anuales: ",
        "Tasa Tanual: ",
        "Pagos anuales (para dias): ",
        "Tasa Dias: "
    ]);

export let tasas_corr_data = writable([
		{
			"id": 1,
			"emisor": 0,
			"comprador": 0,
			"order": 1
		},
		{
			"id": 2,
			"emisor": 4,
			"comprador": 4,
			"order": 2
		},
		{
			"id": 3,
			"emisor": 0,
			"comprador": 0,
			"order": 3
		},
		{
			"id": 4,
			"emisor": 12,
			"comprador": 12,
			"order": 4
		},
		{
			"id": 5,
			"emisor": 0,
			"comprador": 0,
			"order": 5
		},
		{
			"id": 6,
			"emisor": 365,
			"comprador": 365,
			"order": 6
		},
		{
			"id": 7,
			"emisor": 0,
			"comprador": 0,
			"order": 7
		}
]);

export let tasas_comi_data = writable([
    {
        "id": 1,
        "emisor": 0.003,
        "comprador": 0.003,
        "order": 1
    },
    {
        "id": 2,
        "emisor": 4,
        "comprador": 4,
        "order": 2
    },
    {
        "id": 3,
        "emisor": 1.21,
        "comprador": 1.21,
        "order": 3
    },
    {
        "id": 4,
        "emisor": 2.40,
        "comprador": 2.40,
        "order": 4
    },
    {
        "id": 5,
        "emisor": 4,
        "comprador": 4,
        "order": 5
    },
    {
        "id": 6,
        "emisor": 0.6,
        "comprador": 0.6,
        "order": 6
    }
]);

export let tasas_mora_data = writable([
    {
        "id": 1,
        "emisor": 0,
        "comprador": 0,
        "order": 1
    },
    {
        "id": 2,
        "emisor": 0,
        "comprador": 0,
        "order": 2
    },
    {
        "id": 3,
        "emisor": 0,
        "comprador": 0,
        "order": 3
    },
    {
        "id": 4,
        "emisor": 0,
        "comprador": 0,
        "order": 4
    },
    {
        "id": 5,
        "emisor": 0,
        "comprador": 0,
        "order": 5
    },
    {
        "id": 6,
        "emisor": 0,
        "comprador": 0,
        "order": 6
    },
    {
        "id": 7,
        "emisor": 0,
        "comprador": 0,
        "order": 7
    }
]);

