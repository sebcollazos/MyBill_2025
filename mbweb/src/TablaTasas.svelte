<script>
	import { Icon } from 'sveltestrap';

	import { tasas_corr_titles, tasas_corr_data, tasas_comi_titles, tasas_comi_data, tasas_mora_titles, tasas_mora_data } from './tasas-store.js';

	export let style;


</script>

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
		{#each Object.values($tasas_corr_data) as row, i}
			<tr>
				<td>
					<span id="tasa_corr_name_{i}" class="right-text">{$tasas_corr_titles[i]}</span>
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[i].percentage }
					id="tasa_corr_percentage_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_corr_data[i].value}
					id="tasa_corr_value_{i}" >
				</td>
			</tr>
		{/each}
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
		{#each Object.values($tasas_comi_data) as row, i}
			<tr>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_comi_titles[i] }
					id="tasa_comi_name_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_comi_data[i].percentage }
					id="tasa_comi_percentage_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $tasas_comi_data[i].value }
					id="tasa_comi_value_{i}" >
				</td>
			</tr>
			{#if i == 2}
				<tr>
					<th colspan="3" class="bg-secondary">De Mayor a Menor Plazo 90 días</th>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>


<table class='redTable'>
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
	
	table.redTable {
		border: 2px solid #A40808;
		background-color: #EEE7DB;
		width: 90%;
		text-align: center;
		border-collapse: collapse;
	}
	table.redTable td, table.redTable th {
		border: 1px solid #AAAAAA;
		padding: 3px 2px;
	}
	table.redTable tbody td {
		font-size: 13px;
	}
	table.redTable tr:nth-child(even) {
		background: #F5C8BF;
	}
	table.redTable thead {
		background: #A40808;
		background: -moz-linear-gradient(top, #bb4646 0%, #ad2020 66%, #A40808 100%);
		background: -webkit-linear-gradient(top, #bb4646 0%, #ad2020 66%, #A40808 100%);
		background: linear-gradient(to bottom, #bb4646 0%, #ad2020 66%, #A40808 100%);
	}
	table.redTable thead th {
		font-size: 19px;
		font-weight: bold;
		color: #FFFFFF;
		text-align: center;
		border-left: 2px solid #A40808;
	}
	table.redTable thead th:first-child {
		border-left: none;
	}
	.right-text {
		text-align: right;
	}
</style>
