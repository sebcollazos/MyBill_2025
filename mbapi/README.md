# Setup Django App after cloning

## Create and activate virtual environment

```bash
python3 -m venv venv && source venv/bin/activate
```

## Install dependencies

```bash
pip3 install -r requirements.txt
```

## Create migrations

```bash
python3 manage.py migrate
```

## Load initial data for scoring
```bash
python3 manage.py loaddata apps/scoring/fixtures/{file_name}.json
```

## Run server

```bash
python3 manage.py runserver
```

