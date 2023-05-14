#!/bin/sh

wait=1
max_wait=10

# echo "--------------- WAITING FOR DB ----------------"
# until nc -z -v -w30 $DB_HOST $DB_PORT
# do
#     if [ $wait -eq $max_wait ];
#     then
#         echo "Could not connect to database on $DB_HOST:$DB_PORT"
#         exit 1
#     fi

#     echo "Waiting for database connection on $DB_HOST:$DB_PORT"
#     sleep 1
#     wait=$((wait+1))
# done
# echo "------------------- DB UP ---------------------"

echo "------------- Migrating Database --------------"

ts-node --project ./tsconfig.migrations.json migrate.ts up--admin ./migrations
if [ $? != 0 ]; then
    exit 1;
fi

echo "---------------- Starting API ----------------"

node ./main.js
if [ $? != 0 ]; then
    exit 1;
fi


