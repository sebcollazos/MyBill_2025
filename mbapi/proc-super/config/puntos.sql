
CREATE TABLE puntos AS
select distinct
    nit,  
    codigo, 
    riesgo,
    periodo,
    unidades,
    ingr_op,
    CASE 
        WHEN razon_cte IS NULL THEN 0
        WHEN razon_cte < 0.4 THEN 0
        WHEN razon_cte >= 0.4 AND razon_cte < 0.6   THEN (10*razon_cte-2)
        WHEN razon_cte >= 0.6 AND razon_cte < 0.8   THEN (10*razon_cte-2)
        WHEN razon_cte >= 0.8 AND razon_cte < 1     THEN (10*razon_cte-2)
        WHEN razon_cte >= 1   AND razon_cte <= 1.25 THEN (8*(10*razon_cte))
        ELSE
            10
    END pts_razon_cte,
    CASE 
        WHEN ciclo_op IS NULL THEN 0
        WHEN ciclo_op >= 360 THEN 0
        WHEN ciclo_op >= 280 AND ciclo_op <= 359  THEN ((-ciclo_op/40)+11)
        WHEN ciclo_op >= 220 AND ciclo_op <= 279  THEN ((-ciclo_op/30)+(40/3))
        WHEN ciclo_op >= 160 AND ciclo_op <= 219  THEN ((-ciclo_op/30)+(40/3))
        WHEN ciclo_op >= 100 AND ciclo_op <= 159 THEN ((-ciclo_op/40)+(40/3))
        ELSE
            10
    END pts_ciclo_op,
    CASE 
        WHEN end_total IS NULL THEN 0
        WHEN end_total > 90 THEN 0
        WHEN end_total > 80 AND end_total <= 90 THEN ((-end_total/5)+20)
        WHEN end_total > 70 AND end_total <= 80 THEN ((-end_total/5)+20)
        WHEN end_total > 60 AND end_total <= 70 THEN ((-end_total/5)+20)
        WHEN end_total > 40 AND end_total <= 60 THEN ((-end_total/5)+14)
        ELSE
            10
    END pts_end_total,
    CASE 
        WHEN renta_op IS NULL THEN 0
        WHEN renta_op < 0 THEN 0
        WHEN renta_op >= 0 AND renta_op <= 3  THEN ((2*renta_op/3)+2)
        WHEN renta_op > 3  AND renta_op <= 6  THEN ((2*renta_op/3)+2)
        WHEN renta_op > 6  AND renta_op <= 9  THEN ((2*renta_op/3)+2)
        WHEN renta_op > 9  AND renta_op <= 12 THEN ((2*renta_op/3)+2)
        ELSE
            10
    END pts_renta_op
from indfin
