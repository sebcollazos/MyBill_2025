CREATE VIEW v_top_mkt AS
select * from (
select a. nit,
	b.razon,
    b.pyme,
    b.ind,
	a.codigo as ciiu,
	c.descripcion as actividad,
	b.direccion,
	b.ciudad,
	b.depto,
	b.pais,
	b.telefono,
	b.celular,
	b.email,
	(a.pts_razon_cte + a.pts_ciclo_op +a. pts_end_total + a.pts_renta_op)/4 as scoring
from puntos a 
inner join caratula as b on b.nit = a.nit
inner join ciiu as c on c.codigo = a.codigo
where periodo = 2019
order by scoring desc)
where scoring = 10
