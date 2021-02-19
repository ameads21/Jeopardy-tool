\echo 'Delete and recreate jeopardy tool?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE jeopardy_tool;
CREATE DATABASE jeopardy_tool;
\connect jeopardy_tool

\i jeopardy-tool-schema.sql
\i jeopardy-tool-seed.sql

\echo 'Delete and recreate jeopardy_tool_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE jeopardy_tool_test;
CREATE DATABASE jeopardy_tool_test;
\connect jeopardy_tool_test

\i jeopardy-tool-schema.sql
