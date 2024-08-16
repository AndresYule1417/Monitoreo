import psycopg2

database = psycopg2.connect(
    host='localhost',
    user='postgres',
    password='12345',
    database='crud'
)
