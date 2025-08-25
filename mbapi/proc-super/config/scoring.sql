
CREATE TABLE scoring AS
select * from (
select
    a.nit,
    a.periodo,
	b.razon,
    b.pyme,
    b.ind,
	a.codigo as ciiu,
	c.descripcion as actividad,
	c.riesgo as riesgo_actividad,
	b.direccion,
	b.ciudad,
	b.depto,
	b.pais,
	b.telefono,
	CAST(b.celular AS INT) as celular,
	b.email,
	(a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 as scoring,
	CASE
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 IS NULL THEN 0
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 <= 2 THEN 0
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 > 2 AND (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 <= 4  THEN 10*ingr_op/360
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 > 4 AND (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 <= 6  THEN 15*ingr_op/360
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 > 6 AND (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 <= 8  THEN 20*ingr_op/360
        WHEN (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 > 8 AND (a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4       THEN 30*ingr_op/360
    END cupo
from puntos a 
inner join caratula as b on b.nit = a.nit
inner join ciiu as c on c.codigo = a.codigo
) order by nit, periodo desc
