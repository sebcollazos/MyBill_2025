<script>
	import { FormGroup, Button } from 'sveltestrap';
	import {
		Input, Label
	} from 'sveltestrap';

  let isOpen = false;
  let lgIsOpen = false;
  let smIsOpen = false;
	import { debts_data, debts_titles } from './debts-store.js';

	let currentOrder = 0
	let selected;
	function orden1() {
		debts_data.set(
			JSON.parse(JSON.stringify($debts_data)).
			sort((a, b) => a.order - b.order)
		)
		currentOrder = 0
	}
	function orden2() {
		debts_data.set(
			JSON.parse(JSON.stringify($debts_data)).
			sort((a, b) => b.order - a.order)
		)
		currentOrder = 1
	}

</script>
<div>
	<FormGroup>
		<Input style="display:inline-block;width: auto;" class="small-select inline-control" bind:value={selected} type="select" name="select" id="exampleSelect">
			{#each $debts_titles as title}
				<option value={title}>
					{title}
				</option>
			{/each}
		</Input>
		<Button on:click={orden1}>
			&#10595;
		</Button>
		<Button on:click={orden2}>
			&#10597;
		</Button>
	
	</FormGroup>

</div>