# SUPERSOCIEDADES

## Repositorio:
https://github.com/jumanja/mbweb.git

## Ubicar el link principal (para este proceso ejemplo tomaremos el de 2020, que contiene la info de 2019)


El link base es: 
https://www.supersociedades.gov.co/delegatura_aec/Documents/2020/


## Ubicar los nombres de los archivos a descargar, en este caso:

- Plenas-Individuales.xlsx
- Plenas-Separados.xlsx
- Pymes-Individuales.xlsx
- Pymes-Separados.xlsx


## Descargar los archivos para el pre-procesamiento en la subcarpeta downloads. El proceso NO descarga los archivos automáticamente para prevenir posibles problemas si la página web cambia más adelante su estructura, o se mueven de carpeta los archivos (o cambian de nombre)

## Procesamiento en pasos:

00. ./run_00_setup.sh - Ejecuta el programa 00-setup.py, el cual se encarga de generar los archivos de configuración en la subcarpeta config (si no existen) y de leer el archivo config.json de esa subcarpeta (si y existe configuración previa). El programa lee de config/config.json la lista de archivos a procesar, del nodo: files. Si se quire procesar más o menos archivos s epuede manipular esta lista según lo que se quiera, para eso se provee una lista auxiliar, por ejemplo:

    "files": [
        {"template": "NIIF", "name": "Pymes-Individuales.xlsx" }
    ],
    "all_files": [
        {"template": "NIIF", "name": "Plenas-Individuales.xlsx" },
        {"template": "NIIF", "name": "Plenas-Separados.xlsx" },
        {"template": "NIIF", "name": "Pymes-Individuales.xlsx" },
        {"template": "NIIF", "name": "Pymes-Separados.xlsx" }

Como el programa lee la lista de "files", se puede intercambiar los nombres enrte all_files y files, y así procesr solo un archivo y guardar la lista completa con otro nombre. En el ejemplo de arriba, solo se procesará un archivo "Pymes-individuales.xlsx" que se espera esté en la subcarpeta downloads, Y se mantiene una copia de la lista completa en all_files. Cuando se quiera procesar toda la lista, se intercambiarían los nombres de esos nodos, ejemplo, donde dice "files" quedaría como "all_files" (o cualquier otro nombre diferente de "files"), y donde dice "all_files" se pasaría a "files", así:

    "all_iles": [
        {"template": "NIIF", "name": "Pymes-Individuales.xlsx" }
    ],
    "files": [
        {"template": "NIIF", "name": "Plenas-Individuales.xlsx" },
        {"template": "NIIF", "name": "Plenas-Separados.xlsx" },
        {"template": "NIIF", "name": "Pymes-Individuales.xlsx" },
        {"template": "NIIF", "name": "Pymes-Separados.xlsx" }

Para cada archivo en "files" se abrirá la hoja "Carátula" y se extraerá la información requerida para el proceso, al finalizar se creará un archivo en la subcarpeta proc llamado caratula_nn.csv donde nn corresponde al número consecutivo, es decir para este ejemplo files tiene cuatro archivos, se generarán caratula_0.csv hasta caratula_3.csv en la subcarpeta proc.

Finalmente en este paso, se generará también un archivo proc/ciiu.csv con el código, descripción y un campo en blanco para el riesgo asociado con cada uno de los códigos de actividad que se encuentren en los archivos procesados. Esto permite solamente conservar los códigos de actividad únicos que resulten de procesar uno o muchos archivos, es decir, el .csv resultante se reemplazará cada vez que se ejecute este paso y se sobreescribirá, por lo que va a ser útil solamente cuando se procese toda la lista de archivos.

01. ./run_01_ESF.sh - Ejecuta el programa 01-ESF.py, el cual se encarga de Procesar Hojas con nombre ESF de cada archivo en el nodo files, que contiene, además del nombre del archivo, el template o plantilla a utilizar, en el momento solamente existe la plantilla NIIF, esto es para ubicar los nombres de las columnas que el programa debe buscar en el resto de las hojas.

Se procesará para cada archivo en files la hoja ESF, generará archivos proc/ESF_nn.csv según el número de archivos en files.

El archivo de configuración config/config.json tendrá un nodo que asocia hoja y template o plantilla, para espeecificar los nombres de las columnas asociadas a cada valor. por ejemplo:

    "ESF_NIIF": {
        "units": "MILES",
        "v1" : ["Efectivo y equivalentes al efectivo"],
        "v2" : ["CALCULADA"],

En el ejemplo de arriba para la hoja ESF del archivo procesado actualmente, y asociado con la plantilla NIIF, el valor "v1" será tomado de la columna con nombre "Efectivo y equivalentes al efectivo". Para esa misma hoja y plantilla, la "v2" será de tipo "CALCULADA", pues corresponde a una operación matemática realizada por el programa. Se sugiere seguir los ejemplos y cambiar solamente una columna si algún día se descargan archivos con nombres diferentes, es decir, hacer un cambio pequeño y ejecutar el proceso, y no reemplazar al mismo tiempo muchas columnas. De igual forma respetar la estructura del config, respetar la apertura y cierre de comillas "", los dos pntos : y los corchetes [] ya que se está utilizando un formato .JSON que requiere de estas particularidades.

02. ./run_01_ERI.sh - Ejecuta el programa 02-ERI.py, el cual se encarga de Procesar Hojas con nombre ERI de cada archivo en el nodo files, que contiene, además del nombre del archivo, el template o plantilla a utilizar, en el momento solamente existe la plantilla NIIF, esto es para ubicar los nombres de las columnas que el programa debe buscar en el resto de las hojas.

Se procesará para cada archivo en files la hoja ERI, generará archivos proc/ERI_nn.csv según el número de archivos en files.

Es muy similar la configuración y recomendaciones del archivo config/config.json y aquí se revisa el nodo ERI_NIIF (según el template o plantilla especificado en cada archivo en el nodo files en la propiedad template)

03. ./run_03_DB.sh - Ejecuta el programa 03-DB.py, el cual se encarga de crear una base de datos de procesamiento en db/super.db que contendrá la importación de los archivos csv generados unidos en sus propias tablas, junto a nuevos archivos generados durante el proceso de determinación del scoring. De esta forma contendrá al finalizar este paso, las siguientes tablas:

ERI - Unión de todos los archivos proc/ERI_nn.csv generados en el paso 02.
ESF - Unión de todos los archivos proc/ESF_nn.csv generados en el paso 01.
caratula - Unión de todos los archivos proc/caratula_nn.csv generados en el paso 00.
ciiu - Importación del archivo proc/ciiu_csv generado en el paso 00.
indfin - Cálculo de indicadores financieros por período (ej. solvencia, razon corriente, etc..)
puntos - Cálculo de puntos obtenidos según cada indicador financiero.
scoring - Scoring obtenido.

... con sus correspondientes índices, y además, una vista llamada v_top_mkt que contendrá el acceso a las empresas que hayan alcanzado el máximo puntaje en el scoring.

Para ello, generará (si no existen) o leerá (si ya existen) archivos con las sentencias SQL (DDL) de creación de cada tabla. Estos archivos son:

config/indfin.sql - DDL para creación de la tabla de indicadores financieros.
config/puntos.sql - DDL para creación de la tabla de puntos obtnidos según indicadores.
config/top_mkt.sql - DDL para creación de la vista para marketing.
config/scoring.sql - DDL para creación de la tabla con el scoring.

04. ./run_04_export.sh - Se encarga exportar la tabla de scoring y de crear una base de datos db/scoring.db como producto final.