CREATE TABLE puntos AS
select 
    nit,  
    codigo, 
    riesgo,
    periodo,
    unidades,
    ingr_op,
    CASE 
        WHEN razon_cte IS NULL THEN 0
        WHEN razon_cte < 0.4 THEN 0
        WHEN razon_cte >= 0.4 AND razon_cte < 0.6   THEN 2
        WHEN razon_cte >= 0.6 AND razon_cte < 0.8   THEN 4
        WHEN razon_cte >= 0.8 AND razon_cte < 1     THEN 6
        WHEN razon_cte >= 1   AND razon_cte <= 1.25 THEN 8
        ELSE
            10
    END pts_razon_cte,
    CASE 
        WHEN ciclo_op IS NULL THEN 0
        WHEN ciclo_op >= 360 THEN 0
        WHEN ciclo_op >= 280 AND ciclo_op <= 359  THEN 2
        WHEN ciclo_op >= 220 AND ciclo_op <= 279  THEN 4
        WHEN ciclo_op >= 160 AND ciclo_op <= 219  THEN 6
        WHEN ciclo_op >= 100 AND ciclo_op <= 159 THEN 8
        ELSE
            10
    END pts_ciclo_op,
    CASE 
        WHEN end_total IS NULL THEN 0
        WHEN end_total > 90 THEN 0
        WHEN end_total > 80 AND ciclo_op <= 90 THEN 2
        WHEN end_total > 70 AND ciclo_op <= 80 THEN 4
        WHEN end_total > 60 AND ciclo_op <= 70 THEN 6
        WHEN end_total > 40 AND ciclo_op <= 60 THEN 8
        ELSE
            10
    END pts_end_total,
    CASE 
        WHEN renta_op IS NULL THEN 0
        WHEN renta_op < 0 THEN 0
        WHEN renta_op >= 0 AND ciclo_op <= 3  THEN 2
        WHEN renta_op > 3  AND ciclo_op <= 6  THEN 4
        WHEN renta_op > 6  AND ciclo_op <= 9  THEN 6
        WHEN renta_op > 9  AND ciclo_op <= 12 THEN 8
        ELSE
            10
    END pts_renta_op
from indfin
