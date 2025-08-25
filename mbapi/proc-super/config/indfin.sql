
CREATE TABLE indfin AS
select 
    CARATULA.nit,
    CIIU.codigo, 
    CIIU.riesgo,
    ESF.periodo,
    ESF.unidades,
    ERI.v27 as ingr_op,
    ROUND(CAST(ESF.tot_PATRIMONIO AS FLOAT)/ ESF.tot_ACTIVOS, 3) as solvencia,
    ROUND(CAST(ESF.tot_AC_CO AS FLOAT) / ESF.tot_PS_CO, 3) as razon_cte,
    ROUND((CAST(ESF.tot_AC_CO AS FLOAT) - CAST(ESF.v4 AS FLOAT))/ ESF.tot_PS_CO, 3)  as prueba_acida,
    ESF.tot_AC_CO - ESF.tot_PS_CO as capital_trabajo,
    ROUND(CAST(ERI.tot_RES_OPERACIONAL AS FLOAT) / ESF.tot_PATRIMONIO, 3) as ROE,
    ROUND(CAST(100 * ERI.v31 AS FLOAT) / ERI.v27, 3) as fin_ventas,
    ROUND(CAST(100 * (ESF.v10 + ESF.V16) AS FLOAT) / ESF.tot_PATRIMONIO, 3) as gearing,
    ROUND(CAST(100 * ESF.v5 AS FLOAT) / ERI.v27, 3) as ap_act_ing,
    ROUND(CAST(100 * ESF.v5 AS FLOAT) / ESF.tot_ACTIVOS, 3) as ap_act_tot,
    ROUND(CAST(100*(ESF.v10 + ESF.V16) AS FLOAT) / ESF.tot_PASIVOS, 3) as end_fin,
    ROUND(CAST(100 * ESF.tot_PASIVOS AS FLOAT) / ERI.v27, 3) as end_ventas,
    ROUND(CAST(100 * ESF.tot_PS_CO AS FLOAT) / ESF.tot_PASIVOS, 3) as conc_CP,
    ROUND(CAST(100 * ESF.tot_PASIVOS AS FLOAT) / ESF.tot_ACTIVOS, 3) as end_total,
    ROUND(CAST(100 * ESF.v10 AS FLOAT) / ERI.v27, 3) as deuda_CP_ventas,
    ROUND(CAST(100 * ERI.v31 AS FLOAT) / ERI.tot_RES_OPERACIONAL, 3) as gas_fin_uti_op,
    ROUND(CAST(100 * (ESF.v10 + ESF.V16) AS FLOAT) / ESF.tot_PASIVO_PATRIMONIO, 3) as ap_bancario,
    ROUND(CAST(100 * ERI.tot_RES_OPERACIONAL AS FLOAT) / ERI.v27, 3) as margen_op,
    ROUND(CAST(100 * ERI.tot_RES_EJERCICIO AS FLOAT) / ERI.v27, 3) as margen_neto,
    (360 * ESF.v4) / ERI.v28 as rot_inv,
    (360 * ESF.v3) / ERI.v27 as rot_cart,
    ((360 * ESF.v4) / ERI.v28) + ((360 * ESF.v3) / ERI.v27) as ciclo_op,
    (360 * ESF.v11) / ERI.v28 as pago_prov,
    ROUND(CAST(100 * ERI.tot_RES_OPERACIONAL AS FLOAT) / ERI.v27, 3) as renta_op
from caratula
    inner join ciiu on ciiu.codigo = caratula.ciiu 
    inner join esf on esf.nit = caratula.nit
    inner join eri on eri.nit = esf.nit and eri.periodo = esf.periodo
