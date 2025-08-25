<script>
	import { Icon } from 'sveltestrap';
    import { Datepicker } from 'svelte-calendar';
	import dayjs from 'dayjs';
	import 'dayjs/locale/es.js'
	import { Swappable, themes } from 'svelte-calendar';

	import { emisor_data } from './emisor-store.js';
	import { tasas_corr_titles, tasas_corr_data, tasas_comi_titles, tasas_comi_data, tasas_mora_titles, tasas_mora_data } from './tasas-store.js';

	export let style;
	export let titles;

	let currentDate = new Date();
	let liquiDate = new Date();

	const onDateChange = d => {
		currentDate = d.detail;
	};

	const onLiquiDateChange = d => {
		liquiDate = d.detail;
	};
	
	let newRow = [...titles];
	const myLocaleString = 'en';
	$: {
		$emisor_data[3].value  = $emisor_data[2].value - ($emisor_data[2].value / (1 + ($emisor_data[3].percentage / 100)));
		$emisor_data[4].value  = ($emisor_data[2].value - $emisor_data[3].value) * ($emisor_data[4].percentage / 100) ;
		$emisor_data[5].value  = ($emisor_data[3].value - $emisor_data[4].value) * ($emisor_data[5].percentage / 100) ;
		$emisor_data[6].value  = ($emisor_data[2].value - $emisor_data[4].value - $emisor_data[5].value) ;
		$emisor_data[7].value  = ($emisor_data[6].value * ($emisor_data[7].percentage / 100)) ;
		$emisor_data[8].value  = ($emisor_data[6].value - $emisor_data[7].value) ;
		$emisor_data[9].value  = ($emisor_data[8].value * ($emisor_data[9].percentage / 100)) ;
		$emisor_data[10].value = Math.ceil(( liquiDate.getTime() - currentDate.getTime() )/ (1000 * 3600 * 24));

		$tasas_corr_data[0].emisor = $emisor_data[9].percentage;
		$tasas_corr_data[0].comprador = 1.5;
		$tasas_corr_data[2].emisor = (Math.pow(1 + ($tasas_corr_data[0].emisor / 100), $tasas_corr_data[1].emisor) - 1) * 100;
		$tasas_corr_data[2].comprador = (Math.pow(1 + ($tasas_corr_data[0].comprador / 100), $tasas_corr_data[1].comprador) - 1) * 100;
		$tasas_corr_data[4].emisor = (Math.pow(1 + ($tasas_corr_data[0].emisor / 100), $tasas_corr_data[3].emisor) - 1) * 100;
		$tasas_corr_data[4].comprador = (Math.pow(1 + ($tasas_corr_data[0].comprador / 100), $tasas_corr_data[3].comprador) - 1) * 100;
		$tasas_corr_data[6].emisor = Math.pow(1 + ($tasas_corr_data[4].emisor/100), (1/$tasas_corr_data[5].emisor) * 100) - 1;
		$tasas_corr_data[6].comprador = Math.pow(1 + ($tasas_corr_data[4].comprador / 100), (1/$tasas_corr_data[5].comprador) * 100) - 1;

		$emisor_data[11].value = ($emisor_data[8].value * ($tasas_corr_data[2].emisor / 100)) ;
		$emisor_data[14].value = ($emisor_data[7].value * ($emisor_data[14].percentage / 1000) ) ;
		$emisor_data[19].value = ($emisor_data[8].value * ($emisor_data[19].percentage / 1000) ) ;

		$tasas_comi_data[0].emisor = $emisor_data[19].percentage/100 ;
		$tasas_comi_data[0].comprador = $emisor_data[19].percentage/100 ;
		$tasas_comi_data[2].emisor = (Math.pow(1 + ($tasas_comi_data[0].emisor), $tasas_comi_data[1].emisor) - 1) * 100;
		$tasas_comi_data[2].comprador = (Math.pow(1 + ($tasas_comi_data[0].comprador), $tasas_comi_data[1].comprador) - 1) * 100;
		$tasas_comi_data[5].emisor = (Math.pow(1 + ($tasas_comi_data[3].emisor), 1/$tasas_comi_data[3].emisor) - 1);
		$tasas_comi_data[5].comprador = (Math.pow(1 + ($tasas_comi_data[3].comprador), 1/$tasas_comi_data[3].comprador) - 1);
	}

	const theme = {
			"calendar": {
				"width": "300px",
				"maxWidth": "50vw",
				"legend": {
				"height": "40px"
				},
				"shadow": "0px 10px 26px rgba(0, 0, 0, 0.25)",
				"colors": {
				"text": {
					"primary": "#333",
					"highlight": "#fff"
				},
				"background": {
					"primary": "#fff",
					"highlight": "#f3690e",
					"hover": "#eee"
				},
				"border": "#eee"
				},
				"font": {
				"regular": "1.2em",
				"large": "16em"
				},
				"grid": {
				"disabledOpacity": ".35",
				"outsiderOpacity": ".6"
				}
			}
		}
			

	let locale = 'es';

	$: dayjs.locale(locale);

</script>

<table class={style}>
<tr>
	<td><span class="right-text">Fecha Liquidación:</span></td>
	<td>
	</td>
	<td>
		<Datepicker {theme}/>
	</td>
</tr>

<tr>
	<td><span class="right-text">Fecha Vencimiento Factura:</span></td>
	<td>
	</td>
	<td>
		<Datepicker {theme}/>
	</td>
</tr>
</table>

<table class={style}>
	<thead>
		<tr>
			<th class="bg-secondary">Campo</th>
			<th class="bg-secondary">%</th>
			<th class="bg-secondary">EMISOR</th>
		</tr>
	</thead>
	<tbody>
						
			<tr>
				<td><span class="right-text">Valor Total Factura:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $emisor_data[2].value } >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Iva Factura:</span></td>
				<td>
					<input class="right-text percentage" type="text"
					bind:value={ $emisor_data[3].percentage }>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[3].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Menos Retefuente:</span></td>
				<td>
					<select name="retefte" id="retefte" bind:value={$emisor_data[4].percentage}>
						<option value="0">0%</option>
						<option value="0.1">0.1%</option>
						<option value="0.5">0.5%</option>
						<option value="1">1%</option>
						<option value="1.5">1.5%</option>
						<option value="2">2%</option>
						<option value="2.5">2.5%</option>
						<option value="3">3%</option>
						<option value="3.5">3.5%</option>
						<option value="4">4%</option>
						<option value="5">5%</option>
						<option value="6">6%</option>
						<option value="7" selected>7%</option>
						<option value="10" >10%</option>
						<option value="11" >11%</option>
						<option value="15" >15%</option>
						<option value="20" >20%</option>
						<option value="33" >33%</option>
					</select>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $emisor_data[4].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) } >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Menos ReteIca:</span></td>
				<td>
					<select name="reteica" id="reteica" bind:value={$emisor_data[5].percentage}>
						<option value="0" selected>0%</option>
						<option value="4.14">4.14%</option>
						<option value="6.9">6.9%</option>
						<option value="7">7%</option>
						<option value="8">8%</option>
						<option value="9.66">9.66%</option>
						<option value="11.04">11.04%</option>
						<option value="13.8">13.8%</option>
					</select>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $emisor_data[5].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) } >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Factura Neta</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[6].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Valor cobertura:</span></td>
				<td>
					<input class="right-text percentage" type="text"
					bind:value={ $emisor_data[7].percentage }>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[7].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Valor neto a descontar:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[8].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">TASA Int. MV:</span></td>
				<td>
					<input class="right-text percentage" type="text"
					bind:value={ $emisor_data[9].percentage }>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[9].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Plazo facturas (Días):</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[10].value }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Valor del descuento:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[11].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Rev. Juridica:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[13].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>			
			
			<tr>
				<td><span class="right-text">Costo administrativo (4 por mil):</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[14].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Pasarela de pago:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[15].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">PSE:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[16].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Custodia Factura:</span></td>
				<td>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[17].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
			
			<tr>
				<td><span class="right-text">Comisión MyBill:</span></td>
				<td>
						<input class="right-text percentage" type="text"
						bind:value={ $emisor_data[19].percentage }>
				</td>
				<td>
					<input class="right-text" type="text" readonly
					value={ $emisor_data[19].value.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
					 >
				</td>
			</tr>
		</tbody>
</table>

<table class={style}>
	<thead>
		<tr>
			<th colspan="3" class="bg-secondary">TASA CORRIENTE OPERACIÓN FACTORING</th>
		</tr>
		<tr>
			<th colspan="3" class="bg-secondary">De Menor a Mayor Plazo 90 días</th>
		</tr>
		<tr>
			<th class="bg-secondary"></th>
			<th class="bg-secondary">EMISOR</th>
			<th class="bg-secondary">COMPRADOR</th>
		</tr>
	</thead>
	<tbody>
			<tr>
				<td>
					<span class="right-text">Tasa Mes:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[0].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[0].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Pagos Anuales:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[1].emisor }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[1].comprador}
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Tasa Trimestral:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[2].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[2].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Pagos Anuales:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[3].emisor }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[3].comprador}
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Tasa Tanual:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[4].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[4].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Pagos Anuales (para días):</span>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[5].emisor }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[5].comprador}
					>
				</td>
			</tr>
			<tr>
				<td>
					<span class="right-text">Tasa Días:</span>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[6].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
				<td>
					<input class="right-text" type="text"
					value={ $tasas_corr_data[6].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
					>
				</td>
			</tr>
	</tbody>
</table>

<table class={style}>
	<thead>
		<tr>
			<th colspan="3" class="bg-secondary">TASA COMISIÓN MYBILL</th>
		</tr>
		<tr>
			<th colspan="3" class="bg-secondary">De Menor a Mayor Plazo 90 días</th>
		</tr>
		<tr>
			<th class="bg-secondary"></th>
			<th class="bg-secondary">EMISOR</th>
			<th class="bg-secondary">COMPRADOR</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<span class="right-text">Tasa Mes:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[0].emisor  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[0].comprador }
				>
			</td>
		</tr>
		<tr>
			<td>
				<span class="right-text">Pagos Anuales:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[1].emisor  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[1].comprador }
				>
			</td>
		</tr>
		<tr>
			<td>
				<span class="right-text">Tasa anual:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[2].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%'  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[2].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
				>
			</td>
		</tr>
		<tr>
			<th colspan="3" class="bg-secondary">De Mayor a Menor Plazo 90 días</th>
		</tr>
		<tr>
			<td>
				<span class="right-text">Tasa Mes:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[3].emisor  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[3].comprador }
				>
			</td>
		</tr>
		<tr>
			<td>
				<span class="right-text">Pagos Anuales:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[4].emisor  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[4].comprador }
				>
			</td>
		</tr>
		<tr>
			<td>
				<span class="right-text">Tasa anual:</span>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[5].emisor.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%'  }
				>
			</td>
			<td>
				<input class="right-text" type="text"
				value={ $tasas_comi_data[5].comprador.toLocaleString(myLocaleString,{ minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' }
				>
			</td>
		</tr>
	</tbody>
</table>


<table class={style}>
	<thead>
		<tr>
			<th colspan="3" class="bg-secondary">TASA MORA OPERACIÓN FACTORING</th>
		</tr>
		<tr>
			<th colspan="3" class="bg-secondary">De Menor a Mayor Plazo 90 días</th>
		</tr>
		<tr>
			<th class="bg-secondary"></th>
			<th class="bg-secondary">EMISOR</th>
			<th class="bg-secondary">COMPRADOR</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.values($tasas_mora_data) as row, i}
			<tr>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_mora_titles[i] }
					id="tasas_mora_name_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ row.percentage }
					id="tasas_mora_percentage_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ row.value}
					id="tasas_mora_value_{i}" >
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table, th, td {
		border: 1px solid;
		border-collapse: collapse;
		margin-bottom: 10px;
	}
	table.blueTable {
		border: 1px solid #1C6EA4;
		background-color: #EEEEEE;
		width: 90%;
		text-align: left;
		border-collapse: collapse;
	}
	table.blueTable td, table.blueTable th {
		border: 1px solid #AAAAAA;
		padding: 3px 2px;
		text-transform: capitalize;
		text-align: center;
	}
	table.blueTable tbody td {
		font-size: 13px;
		text-align: right;
	}
	table.blueTable tfoot th {
		font-size: 13px;
		text-align: right;
	}
	table.blueTable tr:nth-child(even) {
		background: #D0E4F5;
	}
	table.blueTable thead {
		background: #1C6EA4;
		background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		border-bottom: 2px solid #444444;
	}
	table.blueTable thead th {
		font-size: 15px;
		font-weight: bold;
		color: #FFFFFF;
		border-left: 2px solid #D0E4F5;
	}
	table.blueTable thead th:first-child {
		border-left: none;
	}
	.right-text {
		text-align: right;
	}
	.percentage {
		width: 50px;
	}

</style>
