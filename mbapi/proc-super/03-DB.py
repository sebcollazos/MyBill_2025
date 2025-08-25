import sqlite3
import pandas as pd
import glob
import os
import unicodedata
import math

def remove_control_characters(s):
    return "".join(ch for ch in s if unicodedata.category(ch)[0]!="C")

def proc_sqls(default, sql) :
    if not os.path.isfile(default):
        with open(default, 'w') as f:
            f.write(sql)

def proc_ciiu() :

    # load the data into a Pandas DataFrame
    print("Cargando proc/ciiu_dict.csv ...")
    ciiu = pd.read_csv('proc/ciiu_dict.csv', delimiter=';', index_col=False)

    # write the data to a sqlite table
    print("    Actualizando ciiu ...")
    ciiu.to_sql('ciiu', conn, if_exists='replace', index = False)

def proc_csv(table_name, csv, col_names) :
    nro = 0
    for name in sorted(glob.glob(csv), key=os.path.getmtime):
        # load the data into a Pandas DataFrame
        print("Procesando: ", name , "...")
        df = pd.read_csv(name, delimiter=';', engine='python', encoding='utf-8', index_col=False, names=col_names, header=None, skiprows=0)
        # warn_bad_lines=True, error_bad_lines=False)

        # write the data to a sqlite table
        print("    Actualizando ...")

        strategy = 'replace' if nro == 0 else 'append'
        df.to_sql(table_name, conn, if_exists=strategy, index = False)

        nro = nro + 1

indfin_name   = 'indfin.sql'
puntos_name   = 'puntos.sql'
topmkt_name   = 'top_mkt.sql'
scoring_name  = 'scoring.sql'
config_folder = 'config'

# Create when does not exist, the sql file for financial indicators
indfin_sql = f"""
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
"""

# Create when does not exist, the sql file for puntos
## CREATE TABLE puntos AS
puntos_sql = f"""
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
"""

# Create when does not exist, the sql file for marketing
## CREATE VIEW v_marketing AS
topmkt_sql = f"""
CREATE VIEW v_top_mkt AS
select * from (
select 
    a.nit,
    a.periodo,
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
order by scoring, cupo desc)
where scoring = 10
"""

# Create when does not exist, the sql file for scoring
## CREATE TABLE scoring AS
scoring_sql = f"""
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
"""

default_indfin  = config_folder + '/' + indfin_name
default_puntos  = config_folder + '/' + puntos_name
default_topmkt  = config_folder + '/' + topmkt_name
default_scoring = config_folder + '/' + scoring_name

proc_sqls(default_indfin, indfin_sql)
proc_sqls(default_puntos, puntos_sql)
proc_sqls(default_topmkt, topmkt_sql)
proc_sqls(default_scoring, scoring_sql)

# Creando/Abriendo db
print("Espere...")
print("Creando/Abriendo db/super.db ...")
conn = sqlite3.connect('db/super.db')

# Lista de procesos
proc_ciiu()

# Caratulas
col_names = ["id","nit","pyme","ind","razon","ciiu","constit","estado","direccion_jud","depto_jud","ciudad_jud","direccion","depto","ciudad","pais","telefono","celular","email","matricula","dom_matriz","pais_matriz","revisor","concepto"]
proc_csv('caratula', 'proc/caratula_*.csv', col_names)

# ESF
col_names = ["id","nit","fecha","periodo","unidades","v1","v2","v3","v4","tot_AC_CO","v5","v6","v7","v8","v9","tot_AC_NCO","tot_ACTIVOS","v10","v11","v12","v13","v14","v15","tot_PS_CO","v16","v17","v18","v19","v20","tot_PS_NCO","tot_PASIVOS","v21","v22","v23","v24","v25","v26","tot_PATRIMONIO","tot_PASIVO_PATRIMONIO","error"]
proc_csv('ESF', 'proc/ESF_*.csv', col_names)

# ERI
col_names = ["id","nit","fecha","periodo","unidades","v27","v28","tot_RES_BRUTO","v29","v30","tot_RES_OPERACIONAL","v31","v32","v33","v34","tot_RES_ANTES_IMP","v35","tot_RES_EJERCICIO","error"]
proc_csv('ERI', 'proc/ERI_*.csv', col_names)


# Create indexes and scoring base table

# Cursor object
cursor  = conn.cursor()

# Create indexes
print("    Indexando ciiu ...")
ciiu_index = "CREATE INDEX index_ciiu ON ciiu(codigo)"
cursor.execute(ciiu_index)

print("    Indexando caratula ...")
caratula_index = "CREATE INDEX index_caratula ON caratula(nit)"
cursor.execute(caratula_index)

print("    Indexando ESF ...")
ESF_index = "CREATE INDEX index_ESF ON ESF(nit, periodo)"
cursor.execute(ESF_index)

print("    Indexando ERI ...")
ERI_index = "CREATE INDEX index_ERI ON ERI(nit, periodo)"
cursor.execute(ERI_index)

conn.commit()

# Read sql file and execute it
print("Procesando ", default_indfin)
cursor.execute('DROP TABLE IF EXISTS indfin')
print("    Indexando indfin ...")
conn.commit()

with open(default_indfin) as f: 
    sql = f.read()
    cursor.execute(sql)
conn.commit()

# Read sql file and execute it
print("Procesando ", default_puntos)
cursor.execute('DROP TABLE IF EXISTS puntos')
conn.commit()
with open(default_puntos) as f: 
    sql = f.read()
    cursor.execute(sql)
conn.commit()

# Read sql file and execute it
print("Procesando ", default_topmkt)
cursor.execute('DROP VIEW IF EXISTS v_top_mkt')
conn.commit()
with open(default_topmkt) as f: 
    sql = f.read()
    cursor.execute(sql)
conn.commit()

# Read sql file and execute it
print("Procesando ", default_scoring)
cursor.execute('DROP TABLE IF EXISTS scoring')
conn.commit()
with open(default_scoring) as f: 
    sql = f.read()
    cursor.execute(sql)

print("    Indexando scoring ...")
scoring_index = "CREATE INDEX index_scoring ON scoring(nit)"
cursor.execute(scoring_index)

conn.commit()

# Generating nit files
print("Generando nit files ...")
nit_sql = "select * from scoring order by nit, periodo desc"
# Cursor object
cursor  = conn.cursor()
cursor.execute(nit_sql)

nit_file = 'proc/empty'
with open(nit_file + ".json", 'w') as outfile:
    outfile.write('[' + os.linesep)

rows = cursor.fetchall()
current_nit = ''
for row in rows:
    if current_nit == str(row[0]) :
        continue
    
    if not nit_file == "proc/" + str(row[0])[0:4] : 
        with open(nit_file + ".json", 'a') as outfile:
             outfile.write('{}' + os.linesep + ']' + os.linesep)

        nit_file = "proc/" + str(row[0])[0:4]

        with open(nit_file + ".json", 'w') as outfile:
            outfile.write('[' + os.linesep)

        print("Generando " + nit_file)

    with open(nit_file + ".json", 'a') as outfile:
        str_00 = '"nit":"' + str(row[0]) + '"'
        str_01 = ',"periodo":"' + str(row[1]) + '"'
        str_02 = ',"razon":"' + str(row[2]) + '"'
        str_03 = ',"pyme":"' + str(row[3]) + '"'
        str_04 = ',"ind":"' + str(row[4]) + '"'
        str_05 = ',"ciiu":"' + str(row[5]) + '"'
        str_06 = ',"actividad":"' + str(row[6]) + '"'
        str_07 = ',"riesgo_actividad":"' + str(row[7]) + '"'
        str_08 = ',"direccion":"' + str(row[8]) + '"'
        str_09 = ',"ciudad":"' + str(row[9]) + '"'
        str_10 = ',"depto":"' + str(row[10]) + '"'
        str_11 = ',"pais":"' + str(row[11]) + '"'
        str_12 = ',"telefono":"' + str(row[12]) + '"'
        str_13 = ',"celular":"' + str(row[13]) + '"'
        str_14 = ',"email":"' + str(row[14]) + '"'
        str_15 = ',"scoring":' + str(math.trunc(row[15])) + ''
        str_16 = ',"cupo":' + str(row[16]) + ''
        strFinal = remove_control_characters(str_00 + str_01 + str_02 + str_03 + str_04 + str_05 + str_06 + str_07 + str_08 + str_09 + str_10 + str_11 + str_12 + str_13 + str_14 + str_15 + str_16)

        outfile.write('{' + strFinal + '},' + os.linesep)
        current_nit = str(row[0])


#{"nit":"800001234", "razon":"MI EMPRESA SA", "ciiu":"G12345", "actividad":"Desarrollo de Software", "riesgo_actividad":"BAJO", "direccion":"CRA 23 # 18-33", "ciudad":"80BARRANQUILLA-ATLANTICO0001234", "depto":"ATLANTICO", "pais":"COL", "telefono":"+57181118111", "celular":"+57301301301", "email":"ejemplo@example.com", "scoring":"9", "cupo":"1500" },
#{"nit":"800001235", "razon":"TU EMPRESA SA", "ciiu":"G12345", "actividad":"Desarrollo de Software", "riesgo_actividad":"BAJO", "direccion":"CRA 23 # 18-33", "ciudad":"80BARRANQUILLA-ATLANTICO0001234", "depto":"ATLANTICO", "pais":"COL", "telefono":"+57181118111", "celular":"+57301301301", "email":"ejemplo@example.com", "scoring":"9", "cupo":"1500" }

with open(nit_file + ".json", 'w') as outfile:
    outfile.write('{}' + os.linesep + ']' + os.linesep)

# Done
print("Proceso finalizado")
print("")
