-- O
pg_dump -h localhost -U "user" -d "DB_name" \
  -t "table_name_1" \
  -t "table_name_2" \
  -f /path/to/export/out.sql

-- I
psql -h localhost -U "user" -d "DB_name" -f /path/to/export/out.sql
