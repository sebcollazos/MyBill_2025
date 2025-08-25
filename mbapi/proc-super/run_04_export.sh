rm db/scoring.db
sqlite3 db/super.db ".dump scoring" | sqlite3 db/scoring.db
sqlite3 db/scoring.db "CREATE INDEX index_scoring ON scoring(nit,periodo);" ".exit"
echo -e "\033[0;32m"
echo -e "** Último Paso Finalizado **"
echo -e "\033[1;37m"
