<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>
<script>
    import Carousel from 'svelte-carousel'
</script>
<div class="card">
    <h2>Nuestro Equipo</h2>
    <div class="row_container">
        <div class="col">
            <Carousel
                autoplay
                autoplayDuration={5000}
                particlesToShow={3}
                particlesToScroll={1}
                >
            <div class="img-container">
                <img alt="mybill" src="img/team-title-00.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-01.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-02.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-03.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-04.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-05.png" style="width:100%">
            </div>
            <div class="img-container">
                <img alt="mybill" src="img/team-title-06.png" style="width:100%">
            </div>
            </Carousel>        
        </div>
    </div>
</div>