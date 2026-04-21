\! clear
\set ON_ERROR_STOP 1

\! echo "============================== init.sql ==============================";

DROP DATABASE IF EXISTS "[DB_name]";

CREATE DATABASE "[DB_name]" ENCODING 'UTF8';

\c "[DB_name]"

-- psql -U postgres < /path/to/project/init.sql;
\i /path/to/project/Functions.sql;
\i /path/to/project/x.sql;
\i /path/to/project/project.sql;
