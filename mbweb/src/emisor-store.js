import { writable } from 'svelte/store';

const percentageCalc = ({ value, percentage }) => {
	console.log(value, percentage);
	return (value * (1 + (percentage / 100)));
};

const getEmisorValue = ({ index }) => {
	console.log(index);
	return (emisor_data[index].value);
};

export let emisor_titles = writable(
    [
        "Fecha Liquidación:",
        "Fecha Vencimiento Factura:",
        "Valor Total Factura:",
        "Iva Factura:",
        "Menos Retefuente:",
        "Menos ReteIca:",
        "Factura Neta",
        "Valor cobertura:",
        "Valor neto a descontar:",
        "TASA Int. MV:",
        "Plazo  facturas (Días):",
        "Valor del descuento:",
        "Rev. Juridica:",
        "Costo administrativo (4 por mil):",
        "Pasarela de pago:",
        "PSE:",
        "Custodia Factura:",
        "Comision MyBill:",
        "Costo total operacion Factoring:",
        "Valor a recibir Op. Factoring:",
        "Reintegro Cobertura:",
        "Valor Total Op. Factoring:"
    ]);

export let emisor_data = writable([
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
			"value": 250000000,
			"order": 3
		},
		{
			"id": 4,
			"percentage": 19,
			"value": 0,
			"order": 4
		},
		{
			"id": 5,
			"percentage": 7,
			"value": 0,
			"order": 5
		},
		{
			"id": 6,
			"percentage": 0,
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
			"percentage": 20,
			"value": 0,
			"order": 8
		},
		{
			"id": 9,
			"percentage": '',
			"value": 0,
			"order": 9
		},
		{
			"id": 10,
			"percentage": 1.3,
			"value": 0,
			"order": 10
		},
		{
			"id": 11,
			"percentage": '',
			"value": 0,
			"order": 11
		},
		{
			"id": 12,
			"percentage": '',
			"value": 0,
			"order": 12
		},
		{
			"id": 13,
			"percentage": '',
			"value": 30001,
			"order": 13
		},
		{
			"id": 14,
			"percentage": '',
			"value": 30000,
			"order": 14
		},
		{
			"id": 15,
			"percentage": 4,
			"value": 0,
			"order": 15
		},
		{
			"id": 16,
			"percentage": '',
			"value": 0,
			"order": 16
		},
		{
			"id": 17,
			"percentage": '',
			"value": 0,
			"order": 17
		},
		{
			"id": 18,
			"percentage": '',
			"value": 0,
			"order": 18
		},
		{
			"id": 19,
			"percentage": '',
			"value": 0,
			"order": 19
		},
		{
			"id": 20,
			"percentage": 0.3,
			"value": 0,
			"order": 20
		},
		{
			"id": 21,
			"percentage": '',
			"value": 0,
			"order": 21
		},
		{
			"id": 22,
			"percentage": '',
			"value": 0,
			"order": 22
		}
]);

export let emisor_default = writable([
	{
		"id": 0,
		"name": "Deuda Nueva",
		"balance": 0,
		"rate": 0,
		"min": 0,
		"order": 0
	}
]);

export let emisor_totals = writable([false, true, false, true, false]);
