# Import libraries
import collections
import os
import json
import sys

import pandas as pd
from pandas import DataFrame
from superLibrary import *


# Default Values
balance_counter = 0
nro_balance = 0
downloads_folder = 'downloads'
config_folder = 'config'
config_name = 'config.json'
proc_folder = 'proc'

default_json = config_folder + '/' + config_name

ESF_dict = {}

# Argumentos
nit_to_proc = sys.argv[1] if len(sys.argv) > 1 else ''
nit_to_stop = sys.argv[2] if len(sys.argv) > 2 else ''

if not nit_to_proc == "" :
    print("Procesar solo este nit...: " + nit_to_proc )

if not nit_to_stop == "" :
    print("Parar proceso en este nit: " + nit_to_stop ) 

# # Columnas

# Read json file
with open(default_json) as json_file:
    data = json.load(json_file)
    archivonro = 1

    for file in data['files']:
        template_name = file["template"]
        file_name = file['name']

        xls = pd.ExcelFile(downloads_folder + '/' + file_name)
        print(xls.sheet_names)
            
        #['Carátula', 'ESF', 'ERI', 'ORI', 'EFE']
        # ESF and ERI 
        # to read just one sheet to dataframe:
        tipoproceso = "full"

        df1 = ""
        if not 'ESF' in xls.sheet_names:

            if not template_name.startswith('ESF'):
                continue

            template = data[ template_name ]

            print('File does not have ESF : ' + downloads_folder + '/' + file_name + ' with template: ' +  template_name)
            tipoproceso = "values"
            df1 = pd.read_excel(downloads_folder + '/' + file_name)

        else:
            df1 = pd.read_excel(downloads_folder + '/' + file_name, sheet_name="ESF")
            template = data['ESF_' + template_name ]

        df1 = df1.fillna(0)

        ESF = ""
        try:          
            ESF = df1.set_index("Nit", drop = False)
            llave = "Nit"
            print("Nit como llave")
        except Exception as e:
            ESF = df1.set_index("NIT", drop = False)
            llave = "NIT"
            print("NIT como llave")

        print('')
        print('')
        print('Archivo: ' + file_name + ' ' + str(archivonro) + ' de ' + str(len(data['files'])), 'Formato: ' + template_name )

        #print(ESF.columns)
        print('Filas en el archivo:', ESF.shape[0])
        n_rows = ESF.shape[0]

        # Create ESF files
        # ESF_file = open(proc_folder + "/ESF_" +  str(balance_counter) + ".csv", "w")

        # Initial call to print 0% progress
        printProgressBar(0, n_rows, prefix = 'Progreso ESF:', suffix = 'Paso Completado', length = 50)

        # Print header
        # fila = 'id;nit;fecha;periodo;unidades;v1;v2;v3;v4;tot_AC_CO;v5;v6;v7;v8;v9;tot_AC_NCO;tot_ACTIVOS;v10;v11;v12;v13;v14;v15;tot_PS_CO;v16;v17;v18;v19;v20;tot_PS_NCO;tot_PASIVOS;v21;v22;v23;v24;v25;v26;tot_PATRIMONIO;tot_PASIVO_PATRIMONIO;error'
        # ESF_file.write(fila + os.linesep)

        # Count rows with error
        error_count = 0
        printed_lines = 0
        for n_fila in range(n_rows) :

            # Inconsistencias
            error = ""

            # Extract data
            s_id = str(n_fila + nro_balance)
            s_nit = ESF.iloc[n_fila][llave].astype('int32').astype(str)

            if not nit_to_proc == '' and not s_nit == nit_to_proc :
                continue

            try:
                s_fecha = str(ESF.iloc[n_fila]["Fecha de Corte"])
            except:
                s_fecha = str(ESF.iloc[n_fila]["Fecha Corte"])

            s_fecha = s_fecha.replace(" 00:00:00", "")

            s_periodo = str(ESF.iloc[n_fila]["Periodo"])
            s_periodo = s_periodo.replace("Periodo ", "")
            s_periodo = s_fecha[0:4] if s_periodo == 'Actual' else str(int(s_fecha[0:4]) - 1)

            s_unidades = template['units']

            # ACTIVOS CORRIENTES, leyendo template['v1']
            columna = template['v1'][0]
            s_v1 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v3'][0]
            s_v3 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v4'][0]
            s_v4 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['tot_AC_CO'][0]
            s_tot_AC_CO = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v2 = s_tot_AC_CO - (s_v1 + s_v3 + s_v4)
            s_v2 = s_v2.astype("float64")

            # VERIFICACIONES
            ecuacion_AC = s_tot_AC_CO

            # To String
            s_v1 = str(s_v1)
            s_v2 = str(s_v2)
            s_v3 = str(s_v3)
            s_v4 = str(s_v4)

            s_tot_AC_CO = str(s_tot_AC_CO)

            # ACTIVOS NO CORRIENTES
            columna = template['v5'][0]
            s_v5 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v6'][0]
            s_v6 = ESF.iloc[n_fila][ columna ].astype("float64")
            
            columna = template['v7'][0]
            s_v7 = 0
            if columna in ESF.columns :
                s_v7 = ESF.iloc[n_fila][ columna ].astype("float64")
            else:
                s_v7 = ESF.iloc[n_fila][ template['v7'][1] ].astype("float64") + ESF.iloc[n_fila][ template['v7'][2] ].astype("float64") 

            columna = template['v9'][0]
            s_v9 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['tot_AC_NCO'][0]
            s_tot_AC_NCO = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v8 = s_tot_AC_NCO - (s_v5 + s_v6 + s_v7 + s_v9)
            s_v8 = s_v8.astype("float64")

            # VERIFICACIONES
            ecuacion_AC = ecuacion_AC + s_tot_AC_NCO

            #to string
            s_v5 = str(s_v5)
            s_v6 = str(s_v6)
            s_v7 = str(s_v7)
            s_v9 = str(s_v9)

            s_tot_AC_NCO = str(s_tot_AC_NCO)
            s_v8 = str(s_v8)

            columna = template['tot_ACTIVOS'][0]
            s_tot_ACTIVOS = ESF.iloc[n_fila][ columna ].astype("float64")

            # VERIFICACIONES
            if not (s_tot_ACTIVOS - ecuacion_AC) == 0 :
                error = "ERR Activos"

            s_tot_ACTIVOS = str(s_tot_ACTIVOS)

            # PASIVOS CORRIENTES
            columna = template['v10'][0]
            s_v10 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v11'][0]
            s_v11 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v12'][0]
            s_v12 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v13'][0]
            s_v13 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v14'][0]
            s_v14 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['tot_PS_CO'][0]
            s_tot_PS_CO = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v15 = s_tot_PS_CO - (s_v10 + s_v11 + s_v12 + s_v13 + s_v14)
            s_v15 = s_v15.astype("float64")

            # VERIFICACIONES
            ecuacion_PS = s_tot_PS_CO

            # To String
            s_v10 = str(s_v10)
            s_v11 = str(s_v11)
            s_v12 = str(s_v12)
            s_v13 = str(s_v13)
            s_v14 = str(s_v14)
            s_v15 = str(s_v15)

            s_tot_PS_CO = str(s_tot_PS_CO)

            # PASIVOS NO CORRIENTES
            columna = template['v16'][0]
            s_v16 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v17'][0]
            s_v17 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v18'][0]
            s_v18 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v19'][0]
            s_v19 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['tot_PS_NCO'][0]
            s_tot_PS_NCO = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v20 = s_tot_PS_NCO - (s_v16 + s_v17 + s_v18 + s_v19)
            s_v20 = s_v20.astype("float64")

            # VERIFICACIONES
            ecuacion_PS = ecuacion_PS + s_tot_PS_NCO

            # To String
            s_v16 = str(s_v16)
            s_v17 = str(s_v17)
            s_v18 = str(s_v18)
            s_v19 = str(s_v19)
            s_v20 = str(s_v20)

            s_tot_PS_NCO = str(s_tot_PS_NCO)

            columna = template['tot_PASIVOS'][0]
            s_tot_PASIVOS = ESF.iloc[n_fila][ columna ].astype("float64")

            # VERIFICACIONES
            if not (s_tot_PASIVOS - ecuacion_PS) == 0 and error == "":
                error = "ERR Pasivos"

            s_tot_PASIVOS = str(s_tot_PASIVOS)

            # PATRIMONIO
            columna = template['v21'][0]
            s_v21 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v22'][0]
            s_v22 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v23'][0]
            s_v23 = ESF.iloc[n_fila][ columna ].astype("float64")

            columna = template['v24'][0]
            s_v24 = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v25 = 0

            columna = template['tot_PATRIMONIO'][0]
            s_tot_PATRIMONIO = ESF.iloc[n_fila][ columna ].astype("float64")

            s_v26 = s_tot_PATRIMONIO - (s_v21 + s_v22 + s_v23 + s_v24 + s_v25)
            s_v26 = s_v26.astype("float64")

            # To String
            s_v21 = str(s_v21)
            s_v22 = str(s_v22)
            s_v23 = str(s_v23)
            s_v24 = str(s_v24)
            s_v25 = str(s_v25)
            s_v26 = str(s_v26)

            # VERIFICACIONES
            ecuacion_PT = s_tot_PATRIMONIO

            columna = template['tot_PASIVO_PATRIMONIO'][0]
            s_tot_PASIVO_PATRIMONIO = ESF.iloc[n_fila][ columna ].astype("float64")

            # VERIFICACIONES
            if not (s_tot_PASIVO_PATRIMONIO - s_tot_PATRIMONIO) == ecuacion_PS and error == "" :
                error = "ERR Patrimonio"

            s_tot_PATRIMONIO = str(s_tot_PATRIMONIO)
            s_tot_PASIVO_PATRIMONIO = str(s_tot_PASIVO_PATRIMONIO)

            # VERIFICACIONES
            if not (ecuacion_AC == ecuacion_PS + ecuacion_PT) and error == "" :
                error = "ERR Ecuacion"


            # Row Assemble
            fila_INFO = s_id + ';' + s_nit + ';' + s_fecha + ';' + s_periodo + ';' + s_unidades + ';'

            fila_AC_CO = s_v1 + ';' + s_v2 + ';' + s_v3 + ';' + s_v4  + ';' + s_tot_AC_CO  + ';'
            fila_AC_NCO = s_v5 + ';' + s_v6 + ';' + s_v7 + ';' + s_v8 + ';' + s_v9 + ';' + s_tot_AC_NCO + ';' + s_tot_ACTIVOS  + ';'
            fila_PS_CO = s_v10 + ";" + s_v11 + ";" + s_v12 + ";" + s_v13 + ";" + s_v14 + ";" + s_v15 + ";" + s_tot_PS_CO + ';'
            fila_PS_NCO = s_v16 + ";" + s_v17 + ";" + s_v18 + ";" + s_v19 + ";" + s_v20 + ";" + s_tot_PS_NCO + ';' + s_tot_PASIVOS  + ';'
            fila_PATRIMONIO = s_v21 + ";" + s_v22 + ";" + s_v23 + ";" + s_v24 + ";" + s_v25 + ";" + s_v26 + ";" + s_tot_PATRIMONIO + ';' + s_tot_PASIVO_PATRIMONIO  + ';'

            fila_ACTIVOS = fila_AC_CO + fila_AC_NCO
            fila_PASIVOS = fila_PS_CO + fila_PS_NCO

            fila = fila_INFO + fila_ACTIVOS + fila_PASIVOS + fila_PATRIMONIO + error
            fila = fila.replace(os.linesep, "")

            #ESF_file.write(fila + os.linesep )
            ESF_dict[s_nit + '_' + s_periodo] = fila
            printed_lines = printed_lines + 1

            # Update Progress Bar
            printProgressBar(n_fila, n_rows, prefix = 'Progreso ESF:', suffix = 'Paso Completado', length = 50)

            # If there was an error
            if not error == "" :
                error_count = error_count + 1

            if not nit_to_stop == '' and s_nit == nit_to_stop :
                break

        # Show rows
        print("P")
        print("Nro Filas: ", printed_lines)
        print("ERR Filas: ", error_count)

        nro_balance = n_rows + nro_balance
        # ESF_file.close()
        balance_counter = balance_counter + 1
        archivonro += 1

# Generate dictionaries as files

# Create ESF files

with open(proc_folder + "/ESF_" +  str(balance_counter) + ".csv", 'w') as f:

    # There is no Header
    sortedDict = collections.OrderedDict(sorted(ESF_dict.items()))
    for key, item in sortedDict.items():
        f.write("%s;\n"%(item))


# print the end
print("Proceso Finalizado, revise carpeta proc, los archivos ESF_nn.csv")