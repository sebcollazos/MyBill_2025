# Import libraries
import collections
import os
import json
import pandas as pd
from pandas import DataFrame
from superLibrary import *


# Default Values
caratula_counter = 0
nro_caratula = 0
downloads_folder = 'downloads'
config_folder = 'config'
config_name = 'config.json'
proc_folder = 'proc'

base_url = 'https://www.supersociedades.gov.co/delegatura_aec/Documents/2020/'
config_obj = {
    "all_files": [
        {"template": "ESF_NIIF", "name": "plenas_cons_ESF.xlsx" }
    ],
    "files": [
        {"template": "NIIF", "year": 2019, "name": "plenas_indiv_full_2019.xlsx" },
        {"template": "NIIF", "year": 2019, "name": "plenas_sep_full_2019.xlsx" },
        {"template": "NIIF", "year": 2019, "name": "pymes_indiv_full_2019.xlsx" },
        {"template": "NIIF", "year": 2019, "name": "pymes_sep_full_2019.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "plenas_cons_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "plenas_cons_ESF.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "plenas_indiv_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "plenas_indiv_ESF.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "plenas_sep_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "plenas_sep_ESF.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "pymes_cons_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "pymes_cons_ESF.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "pymes_indiv_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "pymes_indiv_ESF.xlsx" },
        {"template": "ERI_NIIF", "year": 2020, "name": "pymes_sep_ERI.xlsx" },
        {"template": "ESF_NIIF", "year": 2020, "name": "pymes_sep_ESF.xlsx" }

    ],
    "baseURL": "https://www.supersociedades.gov.co/delegatura_aec/Documents/2020/",
    "ESF_NIIF": {
        "units": "MILES",
        "v1" : ["Efectivo y equivalentes al efectivo"],
        "v2" : ["CALCULADA"],
        "v3" : ["Cuentas comerciales por cobrar y otras cuentas por cobrar corrientes"],
        "v4" : ["Inventarios corrientes"],
        "tot_AC_CO" : ["Activos corrientes totales"],
        "v5" : ["Propiedades, planta y equipo"],
        "v6" : ["Cuentas comerciales por cobrar y otras cuentas por cobrar no corrientes"],
        "v7" : ["Propiedad de inversión","Propiedades de inversión al costo menos depreciación acumulada y deterioro","Propiedades de inversión a valor razonable con cambios en resultados"],
        "v8" : ["CALCULADA"],
        "v9" : ["Cuentas comerciales por cobrar y otras cuentas por cobrar no corrientes"],
        "tot_AC_NCO" : ["Total de activos no corrientes"],
        "tot_ACTIVOS" : ["Total de activos"],
        "v10" : ["Otros pasivos financieros corrientes"],
        "v11" : ["Cuentas por pagar comerciales y otras cuentas por pagar"],
        "v12" : ["Otras provisiones corrientes"],
        "v13" : ["Provisiones corrientes por beneficios a los empleados"],
        "v14" : ["Pasivos por impuestos corrientes, corriente"],
        "v15" : ["CALCULADA"],
        "tot_PS_CO" : ["Pasivos corrientes totales"],
        "v16" : ["Otros pasivos financieros no corrientes"],
        "v17" : ["Cuentas comerciales por pagar y otras cuentas por pagar no corrientes"],
        "v18" : ["Pasivo por impuestos diferidos"],
        "v19" : ["Pasivos por impuestos corrientes, no corriente"],
        "v20" : ["CALCULADA"],
        "tot_PS_NCO" : ["Total de pasivos no corrientes"],
        "tot_PASIVOS" : ["Total pasivos"],
        "v21" : ["Capital emitido"],
        "v22" : ["Prima de emisión"],
        "v23" : ["Otras reservas"],
        "v24" : ["Ganancias acumuladas"],
        "v25" : ["Resultado del Ejercicio"],
        "v26" : ["CALCULADA"],
        "tot_PATRIMONIO" : ["Patrimonio total"],
        "tot_PASIVO_PATRIMONIO" : ["Total de patrimonio y pasivos"]
    },
    "ERI_NIIF": {
        "units": "MILES",
        "v27" : ["Ingresos de actividades ordinarias"],
        "v28" : ["Costo de ventas"],
        "tot_RES_BRUTO" : ["Ganancia bruta"],
        "v29" : ["Gastos de administración"],
        "v30" : ["Gastos de ventas","Costos de distribución"],
        "tot_RES_OPERACIONAL" : ["CALCULADA"],
        "v31" : ["Costos financieros"],
        "v32" : ["Otros gastos"],
        "v33" : ["Ingresos financieros"],
        "v34" : ["Otros ingresos"],
        "tot_RES_ANTES_IMP" : ["Ganancia (pérdida), antes de impuestos"],
        "v35" : ["Ingreso (gasto) por impuestos"],
        "tot_RES_EJERCICIO" : ["Ganancia (pérdida)"]

    }

}

#        'Plenas-Individuales.xlsx','Plenas-Separados.xlsx','Pymes-Individuales.xlsx','Pymes-Separados.xlsx'   
default_json = config_folder + '/' + config_name

# Dictionaries
ciiu_dict = {}
caratula_dict = {}

if not os.path.exists(config_folder):
    os.makedirs(config_folder)

if not os.path.exists(downloads_folder):
    os.makedirs(downloads_folder)

if not os.path.exists(proc_folder):
    os.makedirs(proc_folder)

if not os.path.isfile(default_json):
    with open(default_json, 'w') as f:
        json.dump(config_obj, f)

# Columnas

# Read json file
with open(default_json) as json_file:
    data = json.load(json_file)
    print('baseURL: ' + data['baseURL'])
    archivonro = 1
    for file_to_proc in data['files']:
        file_name = file_to_proc["name"]

        print('')
        print('')
        print('Archivo: ' + file_name + ' ' + str(archivonro) + ' de ' + str(len(data['files'])))

        # If there is no file downlods with that name, download it
        if not os.path.isfile(downloads_folder + '/' + file_name):
            # Download each file to downloads folder
            print('File not Found: ' + downloads_folder + '/' + file_name)
        
        xls = pd.ExcelFile(downloads_folder + '/' + file_name)
        print(xls.sheet_names)

        tipoproceso = "full"

        df1 = ""
        if not 'Carátula' in xls.sheet_names:
            print('File does not have caratula : ' + downloads_folder + '/' + file_name)
            tipoproceso = "values"
            df1 = pd.read_excel(downloads_folder + '/' + file_name)
        else:
            df1 = pd.read_excel(downloads_folder + '/' + file_name, sheet_name="Carátula")
            
        df1 = df1.fillna(0)

        #df1 = pd.read_excel(xls, 'Sheet1')
        #df2 = pd.read_excel(xls, 'Sheet2')
        caratula = ""
        try:          
            caratula = df1.set_index("Nit", drop = False)
            llave = "Nit"
            print("Nit como llave")
        except Exception as e:
            caratula = df1.set_index("NIT", drop = False)
            llave = "NIT"
            print("NIT como llave")


        #print(caratula.columns)
        #print(caratula.shape[0])
        n_rows = caratula.shape[0]

        # Print header
        # fila = 'id;nit;pyme;ind;razon;ciiu;constit;estado;direccion_jud;depto_jud;ciudad_jud;direccion;depto;ciudad;pais;telefono;celular;email;matricula;dom_matriz;pais_matriz;revisor;concepto'
        # caratula_file.write(fila + os.linesep)

        # Initial call to print 0% progress
        printProgressBar(0, n_rows, prefix = 'Progreso Carátula:', suffix = 'Paso Completado', length = 50)

        for n_fila in range(n_rows) :
            # Extract data
            s_id = str(n_fila + nro_caratula)

            s_nit = caratula.iloc[n_fila][llave].astype('int32').astype(str)

            s_pyme = "0" if "Pyme" not in file_name else "1"
            s_ind = "0" if "Indiv" not in file_name else "1"
            s_razon = str(caratula.iloc[n_fila]["Razón social de la sociedad"])

            try:
                s_ciiu = caratula.iloc[n_fila]["Clasificación Industrial Internacional Uniforme Versión 4 A.C"]
            except:
                s_ciiu = caratula.iloc[n_fila]["Clasificación Industrial Internacional Uniforme Versión 4 A.C (CIIU)"]

            x = s_ciiu.split(" - ")
            ciiu_dict[x[0]] = x[1]
            s_ciiu = x[0]

            try:
                s_constit = str(caratula.iloc[n_fila]["Fecha de constitución (Aaaa-Mm-Dd)"])
                s_constit = s_constit.replace(" 00:00:00", "")
            except:
                s_constit = ""

            try:
                s_estado = caratula.iloc[n_fila]["Estado actual"]
            except:
                s_estado = ""

            try:
                s_direccion_jud = str(caratula.iloc[n_fila]["Dirección de notificación judicial registrada en Cámara de Comercio"])
            except:
                s_direccion_jud = ""

            try:
                s_depto_jud = str(caratula.iloc[n_fila]["Departamento de la dirección de notificación judicial"])
            except:
                s_depto_jud = ""

            try:
                s_ciudad_jud = str(caratula.iloc[n_fila]["Ciudad de la dirección de notificación judicial"])
            except:
                s_ciudad_jud = ""
            try:
                s_direccion = str(caratula.iloc[n_fila]["Dirección del domicilio"])
            except:
                s_direccion = ""
            try:
                s_depto = str(caratula.iloc[n_fila]["Departamento de la dirección del domicilio"])
            except:
                s_depto = ""
            try:
                s_ciudad = str(caratula.iloc[n_fila]["Ciudad de la dirección del domicilio"])
            except:
                s_ciudad = ""
            
            s_pais = "COL"

            try:
                s_telefono = str(caratula.iloc[n_fila]["Teléfono del domicilio"])
            except:
                s_telefono = ""
                
            try:
                s_celular = str(caratula.iloc[n_fila]["Celular corporativo"])
            except:
                s_celular = ""

            try:
                s_email = str(caratula.iloc[n_fila]["E-mail de la sociedad"])
            except:
                s_email = ""

            try:
                s_matricula = str(caratula.iloc[n_fila]["Matricula mercantil número"])
            except:
                s_matricula = ""

            try:
                s_dom_matriz = str(caratula.iloc[n_fila]["Domicilio casa matriz sucursal de sociedad extranjera"])
            except:
                s_dom_matriz = ""

            try:
                s_pais_matriz = str(caratula.iloc[n_fila]["País del domicilio casa matriz sucursal de sociedad extranjera"])
            except:
                s_pais_matriz = ""

            try:
                s_revisor = str(caratula.iloc[n_fila]["La compañía está obligada a tener Revisor fiscal?"])
            except:
                s_revisor = ""

            try:
                s_concepto =  str(caratula.iloc[n_fila]["Concepto del Revisor fiscal en su informe"])
            except:
                s_concepto = ""

            fila =  s_pyme + ';' + s_ind + ';' + s_razon + ';' + s_ciiu + ';' + s_constit + ';' + s_estado + ';' + s_direccion_jud + ";" + s_depto_jud + ";" + s_ciudad_jud + ";" + s_direccion + ";" + s_depto + ";" + s_ciudad + ";" + s_pais + ";" + s_telefono + ";" + s_celular + ";" + s_email + ";" + s_matricula + ";" + s_dom_matriz + ";" + s_pais_matriz + ";" + s_revisor + ";" + s_concepto
            fila = fila.replace('"', "")
            fila = fila.replace(os.linesep, "")

            caratula_dict[s_nit] = fila

            #print(s_id)
            
            printProgressBar(n_fila, n_rows, prefix = 'Progreso Carátula:', suffix = 'Paso Completado', length = 50)            
        
        nro_caratula = n_rows + nro_caratula
        caratula_counter = caratula_counter + 1
        archivonro += 1


# Generate dictionaries as files
caratula_id = 0
# Create caratula files

with open(proc_folder + "/caratula_" +  str(caratula_counter) + ".csv", 'w') as f:

    # Header
    f.write("id;nit;pyme;ind;razon;ciiu;constit;estado;direccion_jud;depto_jud;ciudad_jud;direccion;depto;ciudad;pais;telefono;celular;email;matricula;dom_matriz;pais_matriz;revisor;concepto"+ os.linesep)
    sortedDict = collections.OrderedDict(sorted(caratula_dict.items()))
    for key, item in sortedDict.items():
        f.write("%d;%s;%s;\n"%(caratula_id, key, item))
        caratula_id = caratula_id + 1

# Generate dictionaries as files
ciiu_id = 0
with open(proc_folder + "/ciiu_dict.csv", 'w') as f:

    # Header
    f.write("id;codigo;descripcion;riesgo"+ os.linesep)
    sortedDict = collections.OrderedDict(sorted(ciiu_dict.items()))
    for key, item in sortedDict.items():
        f.write("%d;%s;%s;1000;\n"%(ciiu_id, key, item.replace(";", ",")))
        ciiu_id = ciiu_id + 1

# print the end
print("Proceso Finalizado, revise carpeta proc, los archivos caratula_nn.csv")