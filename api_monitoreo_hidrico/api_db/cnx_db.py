import psycopg2
from psycopg2.extras import RealDictCursor

class CnxDb():
    cnx = None    
    
    def __init__(self) -> None:
        try:
            self.cnx = psycopg2.connect(database='monitoreo_hidrico_v3', user='postgres', host='127.0.0.1', password='12345', port='5432')               
        except (psycopg2.DatabaseError, Exception) as error:
            self.cnx = None
            print(error)     
    
    def get_cnx(self):
        if(self.cnx):
            return self.cnx
        return None
    
    def insert_sql(self, sql):
        cursor = self.cnx.cursor()
        self.cnx.autocommit = False
        cursor.execute(sql)
        self.cnx.commit()   

class CnxDb_SZH():
    cnx = None    
    
    def __init__(self) -> None:
        try:
            self.cnx = psycopg2.connect(database='db_szh_coello_ohts', user='postgres', host='127.0.0.1', password='12345', port='5432')               
        except (psycopg2.DatabaseError, Exception) as error:
            self.cnx = None
            print(error)  

    def get_cnx(self):
        if(self.cnx):
            return self.cnx
        return None
    
    def getQueryAll(self, sql):
        cursor = self.cnx.cursor(cursor_factory=RealDictCursor)
        cursor.execute(sql)
        rows = cursor.fetchall()
        if(self.cnx):
            cursor.close()
        return rows
      
