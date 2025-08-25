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

ERI_dict = {}

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
        print('')
        print('')
        print('Archivo: ' + file_name, 'Formato: ' + template_name )
        
        xls = pd.ExcelFile(downloads_folder + '/' + file_name)
        print(xls.sheet_names)
            
        #['Carátula', 'ESF', 'ERI', 'ORI', 'EFE']
        # ERI 
        # to read just one sheet to dataframe:
        tipoproceso = "full"

        df1 = ""
        if not 'ERI' in xls.sheet_names:

            if not template_name.startswith('ERI'):
                continue

            template = data[ template_name ]

            print('File does not have ERI : ' + downloads_folder + '/' + file_name + ' with template: ' +  template_name)
            tipoproceso = "values"
            df1 = pd.read_excel(downloads_folder + '/' + file_name)

        else:
            df1 = pd.read_excel(downloads_folder + '/' + file_name, sheet_name="ERI")
            template = data['ERI_' + template_name ]

        df1 = df1.fillna(0)

        ERI = ""
        try:          
            ERI = df1.set_index("Nit", drop = False)
            llave = "Nit"
            print("Nit como llave")
        except Exception as e:
            ERI = df1.set_index("NIT", drop = False)
            llave = "NIT"
            print("NIT como llave")

        print('')
        print('')
        print('Archivo: ' + file_name + ' ' + str(archivonro) + ' de ' + str(len(data['files'])), 'Formato: ' + template_name )

        #print(ERI.columns)
        print('Filas en el archivo:', ERI.shape[0])
        n_rows = ERI.shape[0]

        # Create ERI files
        # ERI_file = open(proc_folder + "/ERI_" +  str(balance_counter) + ".csv", "w")

        # Initial call to print 0% progress
        printProgressBar(0, n_rows, prefix = 'Progreso ERI:', suffix = 'Paso Completado', length = 50)

        # Print header
        # fila = 'id;nit;fecha;periodo;unidades;v27;v28;tot_RES_BRUTO;v29;v30;tot_RES_OPERACIONAL;v31;v32;v33;v34;tot_RES_ANTES_IMP;v35;tot_RES_EJERCICIO6;error'
        # ERI_file.write(fila + os.linesep)

        # Count rows with error
        error_count = 0
        printed_lines = 0
        for n_fila in range(n_rows) :

            # Inconsistencias
            error = ""

            # Extract data
            s_id = str(n_fila + nro_balance)
            s_nit = ERI.iloc[n_fila][llave].astype('int32').astype(str)

            if not nit_to_proc == '' and not s_nit == nit_to_proc :
                continue

            try:
                s_fecha = str(ERI.iloc[n_fila]["Fecha de Corte"])
            except:
                s_fecha = str(ERI.iloc[n_fila]["Fecha Corte"])

            s_fecha = s_fecha.replace(" 00:00:00", "")

            s_periodo = str(ERI.iloc[n_fila]["Periodo"])
            s_periodo = s_periodo.replace("Periodo ", "")
            s_periodo = s_fecha[0:4] if s_periodo == 'Actual' else str(int(s_fecha[0:4]) - 1)

            s_unidades = template['units']

            # PYG, leyendo template['v1']
            columna = template['v27'][0]
            s_v27 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v28'][0]
            s_v28 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['tot_RES_BRUTO'][0]
            s_tot_RES_BRUTO = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v29'][0]
            s_v29 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v30'][0]
            s_30 = 0
            if columna in ERI.columns :
                s_v30 = ERI.iloc[n_fila][ columna ].astype("int64")
            else:
                s_v30 = ERI.iloc[n_fila][ template['v30'][1] ].astype("int64")

            s_tot_RES_OPERACIONAL = s_tot_RES_BRUTO - s_v29 - s_v30
            s_tot_RES_OPERACIONAL = s_tot_RES_OPERACIONAL.astype("int64")

            columna = template['v31'][0]
            s_v31 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v32'][0]
            s_v32 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v33'][0]
            s_v33 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v34'][0]
            s_v34 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['tot_RES_ANTES_IMP'][0]
            s_tot_RES_ANTES_IMP = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['v35'][0]
            s_v35 = ERI.iloc[n_fila][ columna ].astype("int64")

            columna = template['tot_RES_EJERCICIO'][0]
            s_tot_RES_EJERCICIO = ERI.iloc[n_fila][ columna ].astype("int64")

            # VERIFICACIONES
            if s_v27 + s_v28 + s_v29 + s_v30 + s_v31 + s_v32 + s_v33 + s_v34 + s_v35 == 0 :
               error = 'ERR valores en cero'

            # To String
            s_v27 = str(s_v27)
            s_v28 = str(s_v28)
            s_tot_RES_BRUTO = str(s_tot_RES_BRUTO)
            s_v29 = str(s_v29)
            s_v30 = str(s_v30)
            s_tot_RES_OPERACIONAL = str(s_tot_RES_OPERACIONAL)
            s_v31 = str(s_v31)
            s_v32 = str(s_v32)
            s_v33 = str(s_v33)
            s_v34 = str(s_v34)
            s_tot_RES_ANTES_IMP = str(s_tot_RES_ANTES_IMP)
            s_v35 = str(s_v35)
            s_tot_RES_EJERCICIO = str(s_tot_RES_EJERCICIO)

            # Row Assemble
            fila_INFO = s_id + ';' + s_nit + ';' + s_fecha + ';' + s_periodo + ';' + s_unidades + ';'

            fila_ERI = s_v27 + ';' + s_v28 + ';' + s_tot_RES_BRUTO + ';' + s_v29 + ';' + s_v30 + ';' + s_tot_RES_OPERACIONAL + ';' + s_v31 + ';' + s_v32 + ';' + s_v33 + ';' + s_v34 + ';' + s_tot_RES_ANTES_IMP + ';' + s_v35 + ';' + s_tot_RES_EJERCICIO + ';'

            fila = fila_INFO + fila_ERI + error
            fila = fila.replace(os.linesep, "")

            #ERI_file.write(fila + os.linesep )
            ERI_dict[s_nit + '_' + s_periodo] = fila
            printed_lines = printed_lines + 1

            # Update Progress Bar
            printProgressBar(n_fila, n_rows, prefix = 'Progreso ERI:', suffix = 'Paso Completado', length = 50)

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
        #ERI_file.close()
        balance_counter = balance_counter + 1
        archivonro += 1

# Generate dictionaries as files

# Create ERI files

with open(proc_folder + "/ERI_" +  str(balance_counter) + ".csv", 'w') as f:

    # There is no Header
    sortedDict = collections.OrderedDict(sorted(ERI_dict.items()))
    for key, item in sortedDict.items():
        f.write("%s;\n"%(item))


# print the end
print("Proceso Finalizado, revise carpeta proc, los archivos ERI_nn.csv")