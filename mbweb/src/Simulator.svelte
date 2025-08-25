<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<script>
    import { Col, Row } from 'sveltestrap';

    import TablaEmisor from './TablaEmisor.svelte';
    import TablaInversor from './TablaInversor.svelte';
    import ClearTable from './ClearTable.svelte';

    import { emisor_titles } from './emisor-store.js';
    import { inversor_titles } from './inversor-store.js';

    let blueStyle = "blueTable";

</script>
<p></p>
<Row>
    <Col>
        <ClearTable/>
    </Col>
</Row>
<p></p>

<Row>
    <Col>
        <TablaEmisor titles={$emisor_titles} style={blueStyle}/>
        <TablaInversor titles={$inversor_titles} style={blueStyle}/>
    </Col>
</Row>