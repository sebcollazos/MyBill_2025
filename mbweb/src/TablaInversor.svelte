<script>
	import { Icon } from 'sveltestrap';

	import { inversor_titles, inversor_data } from './inversor-store.js';

	export let style;
	export let titles;
	
	let newRow = [...titles];


</script>

<table class={style}>
	<thead>
		<tr>
			<th class="bg-secondary">Campo</th>
			<th class="bg-secondary">%</th>
			<th class="bg-secondary">INVERSOR</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.values($inversor_data) as row, i}
			<tr>
				<td>
					<span id="inversor_name_{i}" class="right-text">{$inversor_titles[i]}</span>
				</td>
				<td>
					<input class="right-text percentage" type="text"
					bind:value={ $inversor_data[i].percentage }
					id="inversor_percentage_{i}" >
				</td>
				<td>
					<input class="right-text" type="text"
					bind:value={ $inversor_data[i].value}
					id="inversor_value_{i}" >
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
