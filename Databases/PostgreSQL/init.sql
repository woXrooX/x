\set ON_ERROR_STOP 1

\! echo "============================== INIT ==============================";

-- \i /path/to/project/init.sql;
\i /path/to/project/x.sql;
\i /path/to/project/project.sql;

\c "[DB_name]" "[user]"
