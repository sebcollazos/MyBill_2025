import { writable } from 'svelte/store';

export let inversor_titles = writable(
    [
        "Vr inversion: ",
        "Tasa Int. MV: ",
        "Plazo  facturas (Días): ",
        "Vr I: ",
        "Costo administrativo (4 por mil): ",
        "Comision MyBill: ",
        "(-) Retefuente: ",
        "Subtotal costos: ",
        "Vr Rendimiento Neto Operacion: "       
    ]);

export let inversor_data = writable([
		{
			"id": 1,
			"percentage": '',
			"value": 0,
			"order": 1
		},
		{
			"id": 2,
			"percentage": '',
			"value": 0,
			"order": 2
		},
		{
			"id": 3,
			"percentage": '',
			"value": 0,
			"order": 3
		},
		{
			"id": 4,
			"percentage": '',
			"value": 0,
			"order": 4
		},
		{
			"id": 5,
			"percentage": '',
			"value": 0,
			"order": 5
		},
		{
			"id": 6,
			"percentage": '',
			"value": 0,
			"order": 6
		},
		{
			"id": 7,
			"percentage": '',
			"value": 0,
			"order": 7
		},
		{
			"id": 8,
			"percentage": '',
			"value": 0,
			"order": 8
		},
		{
			"id": 9,
			"percentage": '',
			"value": 0,
			"order": 9
		}
]);
	
export let inversor_default = writable([
	{
		"id": 0,
		"name": "Deuda Nueva",
		"balance": 0,
		"rate": 0,
		"min": 0,
		"order": 0
	}
]);

export let inversor_totals = writable([false, true, false, true, false]);
