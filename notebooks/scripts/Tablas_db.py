
# Author: Juan Pablo Cuevas Ing. Forest
# Github: https://github.com/juanpac96
# Copyright (c) 2022, legut Inc.  All rights reserved.
# Copyrights licensed under the New BSD License.
# See the accompanying LICENSE file for terms.

# Import the modules
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Text, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from geoalchemy2 import Geometry  # Importar Geometry desde GeoAlchemy2
from geoalchemy2.shape import from_shape
from shapely.geometry import Polygon, Point

# Set specials function
def _unique(session, cls, hashfunc, queryfunc, constructor, arg, kw):
    cache = getattr(session, '_unique_cache', None)
    if cache is None:
        session._unique_cache = cache = {}

    key = (cls, hashfunc(*arg, **kw))
    if key in cache:
        return cache[key]
    else:
        with session.no_autoflush:
            q = session.query(cls)
            q = queryfunc(q, *arg, **kw)
            obj = q.first()
            if not obj:
                obj = constructor(*arg, **kw)
                session.add(obj)
        cache[key] = obj
        return obj

class UniqueMixin(object):
    @classmethod
    def unique_hash(cls, *arg, **kw):
        raise NotImplementedError()

    @classmethod
    def unique_filter(cls, query, *arg, **kw):
        raise NotImplementedError()

    @classmethod
    def as_unique(cls, session, *arg, **kw):
        return _unique(
                    session,
                    cls,
                    cls.unique_hash,
                    cls.unique_filter,
                    cls,
                    arg, kw
               )

# Set the initial parameters for make the databese

engine = create_engine('postgresql+psycopg2://postgres:postgres@localhost:5432/szh_coello_ohts', echo=True)
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()

# Define the tables that will be used in the database,
# With their respective names, relationships and data types by column


# Table of geografic systems

class Geog_coord_syst(Base):
  '''
  In this table is the information related to the georeferencing systems
  in which the coordinates indicated in the dataset were captured.
  It inherits its properties from the `Base` class of the SQLAlchemy module. 
  The columns and data types that this table requires are:

  epsg: SmallInteger
  unit: String
  geodetic_crs: String
  datum: String
  ellipsoid: String
  prime_meridian: String
  data_source: String
  information_source: String
  revision_date: DateTime
  scope: String
  area_of_use: String
  coordinate_system: String
  '''
  # Table name
  __tablename__ = 'geog_coord_syst'
  # Table columns
  epsg = Column(SmallInteger, primary_key=True)
  unit = Column(String)
  geodetic_crs = Column(String)
  datum = Column(String)
  ellipsoid = Column(String)
  prime_meridian = Column(String)
  data_source = Column(String)
  information_source = Column(String)
  revision_date = Column(DateTime)
  scope = Column(String)
  area_of_use = Column(String)
  coordinate_system = Column(String)
  list_columns = ['epsg','unit','geodetic_crs','datum','ellipsoid','prime_meridian',
                  'data_source','information_source','revision_date','scope',
                  'area_of_use','coordinate_system']

  def __init__(self, epsg, unit, geodetic_crs, datum, ellipsoid, prime_meridian, data_source,information_source, revision_date, scope, area_of_use, coordinate_system):
    self.epsg = epsg
    self.unit = unit
    self.geodetic_crs = geodetic_crs
    self.datum = datum
    self.ellipsoid = ellipsoid
    self.prime_meridian = prime_meridian
    self.data_source = data_source
    self.information_source = information_source
    self.revision_date = revision_date
    self.scope = scope
    self.area_of_use = area_of_use
    self.coordinate_system = coordinate_system
  def __repr__(self):
    return "<geog_coord_syst(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"


  def __str__(self):
    return self.epsg

# Make the table of sub_zonas_hidrograficas

class SubZonasHidrograficas(UniqueMixin, Base):
    '''
    Clase para mapear la tabla `sub_zonas_hidrograficas` en la base de datos PostGIS. 
    Esta clase está diseñada para manejar la información espacial y descriptiva relacionada con las subzonas hidrográficas.

    Atributos:
    ----------
    - id_sub_zona : Integer
        Identificador único para cada subzona hidrográfica (clave primaria).

    - nombre_sub_zona : String
        Nombre de la subzona hidrográfica.

    - codigo_sub_zona : String
        Código alfanumérico que identifica a la subzona hidrográfica.

    - corriente : String
        Nombre de la corriente principal o río que atraviesa la subzona.

    - descrip : String
        Descripción adicional o comentarios sobre la subzona hidrográfica.

    - area_km2 : Float
        Área de la subzona hidrográfica en kilómetros cuadrados.

    - perim_km : Float
        Perímetro de la subzona hidrográfica en kilómetros.

    - nombre_szh : String
        Nombre de la Subzona Hidrográfica mayor a la cual pertenece.

    - cod_szh : String
        Código alfanumérico que identifica a la Subzona Hidrográfica mayor.

    - lo_axialkm : Float
        Longitud axial de la subzona hidrográfica en kilómetros.

    - dir_flujo : String
        Dirección del flujo principal del agua dentro de la subzona hidrográfica.

    - ext : Float
        Extensión o longitud del flujo principal en la subzona.

    - consumo : Float
        Consumo de agua registrado en la subzona hidrográfica.

    - trasout : Float
        Cantidad de agua transferida fuera de la subzona hidrográfica.

    - trasin : Float
        Cantidad de agua transferida hacia dentro de la subzona hidrográfica.

    - dh_m3ps : Float
        Descarga de agua en metros cúbicos por segundo.

    - retd_m3ps : Float
        Retención de agua en metros cúbicos por segundo.

    - mslope : Float
        Pendiente media de la subzona hidrográfica.

    - sum_longit : Float
        Suma de la longitud de los cursos de agua en la subzona.

    - areadren : Float
        Área de drenaje de la subzona hidrográfica.

    - geometry : Geometry
        Columna espacial que almacena la geometría de la subzona hidrográfica en formato de multipolígono con el sistema de referencia espacial (SRID) 4326.

    Métodos:
    --------
    - __init__(self, ...):
        Constructor para inicializar un objeto de la clase `SubZonasHidrograficas`.

    - __repr__(self):
        Representación en cadena de un objeto `SubZonasHidrograficas` para facilitar la depuración.

    - __str__(self):
        Devuelve una cadena con el nombre de la subzona hidrográfica, lo cual es útil para identificar el objeto.

    - unique_hash(cls, nombre_sub_zona):
        Genera un hash único basado en el nombre de la subzona hidrográfica para verificar la unicidad del objeto en la base de datos.

    - unique_filter(cls, query, nombre_sub_zona):
        Filtra la base de datos para encontrar objetos que coincidan con el nombre de la subzona hidrográfica proporcionada, utilizado para garantizar la unicidad.
    '''
    __tablename__ = 'sub_zonas_hidrograficas'

    id_sub_zona = Column(Integer, primary_key=True)
    nombre_sub_zona = Column(String, nullable=False)
    codigo_sub_zona = Column(String, nullable=False)
    corriente = Column(String, nullable=False)
    descrip = Column(String)
    area_km2 = Column(Float)
    perim_km = Column(Float)
    nombre_szh = Column(String, nullable=False)
    cod_szh = Column(String, nullable=False)
    lo_axialkm = Column(Float)
    dir_flujo = Column(String)
    ext = Column(Float)
    consumo = Column(Float)
    trasout = Column(Float)
    trasin = Column(Float)
    dh_m3ps = Column(Float)
    retd_m3ps = Column(Float)
    mslope = Column(Float)
    sum_longit = Column(Float)
    areadren = Column(Float)
    epsg_id = Column(SmallInteger, ForeignKey("geog_coord_syst.epsg"))
    geometry = Column(Geometry(geometry_type='MULTIPOLYGONZ', srid=4326)) #'MULTIPOLYGON'

    list_columns = ['nombre_sub_zona', 'codigo_sub_zona', 'corriente', 'descrip', 'area_km2', 'perim_km', 'nombre_szh', 
                    'cod_szh', 'lo_axialkm', 'dir_flujo', 'ext', 'consumo', 'trasout', 'trasin', 'dh_m3ps', 
                    'retd_m3ps', 'mslope', 'sum_longit', 'areadren' ,'epsg_id', 'geometry']

    def __init__(self, nombre_sub_zona, codigo_sub_zona, corriente, descrip, area_km2, perim_km, nombre_szh, cod_szh, 
                 lo_axialkm, dir_flujo, ext, consumo, trasout, trasin, dh_m3ps, retd_m3ps, mslope, sum_longit, 
                 areadren, epsg_id, geometry):
        self.nombre_sub_zona = nombre_sub_zona
        self.codigo_sub_zona = codigo_sub_zona
        self.corriente = corriente
        self.descrip = descrip
        self.area_km2 = area_km2
        self.perim_km = perim_km
        self.nombre_szh = nombre_szh
        self.cod_szh = cod_szh
        self.lo_axialkm = lo_axialkm
        self.dir_flujo = dir_flujo
        self.ext = ext
        self.consumo = consumo
        self.trasout = trasout
        self.trasin = trasin
        self.dh_m3ps = dh_m3ps
        self.retd_m3ps = retd_m3ps
        self.mslope = mslope
        self.sum_longit = sum_longit
        self.areadren = areadren
        self.epsg_id = epsg_id
        self.geometry = geometry

    def __repr__(self):
        return "<sub_zonas_hidrograficas(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return self.nombre_sub_zona

    @classmethod
    def unique_hash(cls, nombre_sub_zona):
        return nombre_sub_zona

    @classmethod
    def unique_filter(cls, query, nombre_sub_zona):
        return query.filter(SubZonasHidrograficas.nombre_sub_zona == nombre_sub_zona)

# Tabla: oferta_total_diaria
class OfertaTotalDiaria(Base):
    '''
    Esta tabla contiene la información de la oferta total diaria.
    Hereda sus propiedades de la clase `Base` del módulo SQLAlchemy. 
    Las columnas y tipos de datos que esta tabla requiere son:

    id_diaria: Integer
    fecha: DateTime
    sub_zona_id: Integer
    caudal: Float
    '''
    # Nombre de la tabla
    __tablename__ = 'oferta_total_diaria'
    
    # Columnas de la tabla
    id_diaria = Column(Integer, primary_key=True)
    fecha = Column(DateTime, nullable=False)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"))
    caudal = Column(Float, nullable=True)  # Unidades en m3s-1

    # Relaciones
    sub_zona = relationship("SubZonasHidrograficas")

    list_columns = ['fecha', 'sub_zona_id', 'caudal']

    def __init__(self, fecha, sub_zona_id, caudal):
        self.fecha = fecha
        self.sub_zona_id = sub_zona_id
        self.caudal = caudal

    def __repr__(self):
        return "<oferta_total_diaria(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Oferta Total Diaria para Sub Zona {self.sub_zona_id} en {self.fecha}"

# Tabla: oferta_total_mensual
class OfertaTotalMensual(Base):
    '''
    Esta tabla contiene la información de la oferta total mensual.
    Hereda sus propiedades de la clase `Base` del módulo SQLAlchemy. 
    Las columnas y tipos de datos que esta tabla requiere son:

    id_mensual: Integer
    fecha: DateTime
    sub_zona_id: Integer
    caudal: Float
    '''
    # Nombre de la tabla
    __tablename__ = 'oferta_total_mensual'
    
    # Columnas de la tabla
    id_mensual = Column(Integer, primary_key=True)
    fecha = Column(DateTime, nullable=False)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"))
    caudal = Column(Float, nullable=True)  # Unidades en m3s-1

    # Relaciones
    sub_zona = relationship("SubZonasHidrograficas")

    list_columns = ['fecha', 'sub_zona_id', 'caudal']

    def __init__(self, fecha, sub_zona_id, caudal):
        self.fecha = fecha
        self.sub_zona_id = sub_zona_id
        self.caudal = caudal

    def __repr__(self):
        return "<oferta_total_mensual(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Oferta Total Mensual para Sub Zona {self.sub_zona_id} en {self.fecha}"

# Relación con la tabla `sub_zonas_hidrograficas` (ya definida en otro lugar)
# Asumimos que la tabla `sub_zonas_hidrograficas` y su clase `SubZonasHidrograficas` ya están definidas


# Table for plots

class OfertaTotalMultianual(Base):
    '''
    Esta tabla contiene la información de la oferta total multianual.
    Hereda sus propiedades de la clase `Base` del módulo SQLAlchemy. 
    Las columnas y tipos de datos que esta tabla requiere son:

    sub_zona_id: Integer
    periodo_medio: Float
    periodo_humedo: Float
    periodo_seco: Float
    mes: String
    '''
    # Nombre de la tabla
    __tablename__ = 'oferta_total_multianual'
    
    # Columnas de la tabla
    id_multianual = Column(Integer, primary_key=True)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"))  # Asumiendo que existe una tabla sub_zonas
    periodo_medio = Column(Float, nullable=True)  # Unidades en m3s-1
    periodo_humedo = Column(Float, nullable=True)
    periodo_seco = Column(Float, nullable=True)
    mes = Column(String, nullable=False)

    # Relaciones
    sub_zona = relationship("SubZonasHidrograficas")
    
    list_columns = ['sub_zona_id', 'periodo_medio', 'periodo_humedo', 'periodo_seco', 'mes']

    def __init__(self, sub_zona_id, periodo_medio, periodo_humedo, periodo_seco, mes):
        self.sub_zona_id = sub_zona_id
        self.periodo_medio = periodo_medio
        self.periodo_humedo = periodo_humedo
        self.periodo_seco = periodo_seco
        self.mes = mes

    def __repr__(self):
        return "<oferta_total_multianual(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Oferta Total Multianual para Sub Zona {self.sub_zona_id} en {self.mes}"

class RendimientoHidrico(Base):
    '''
    Esta tabla contiene la información de la oferta total multianual.
    Hereda sus propiedades de la clase `Base` del módulo SQLAlchemy. 
    Las columnas y tipos de datos que esta tabla requiere son:

    sub_zona_id: Integer
    periodo_medio: Float
    periodo_humedo: Float
    periodo_seco: Float
    mes: String
    '''
    # Nombre de la tabla
    __tablename__ = 'rendimiento_hidrico'
    
    # Columnas de la tabla
    id_rendimiento_hidrico = Column(Integer, primary_key=True)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"))  # Asumiendo que existe una tabla sub_zonas
    periodo_medio = Column(Float, nullable=True)  # Unidades en m3s-1
    periodo_humedo = Column(Float, nullable=True)
    periodo_seco = Column(Float, nullable=True)
    mes = Column(String, nullable=False)

    # Relaciones
    sub_zona = relationship("SubZonasHidrograficas")
    
    list_columns = ['sub_zona_id', 'periodo_medio', 'periodo_humedo', 'periodo_seco', 'mes']

    def __init__(self, sub_zona_id, periodo_medio, periodo_humedo, periodo_seco, mes):
        self.sub_zona_id = sub_zona_id
        self.periodo_medio = periodo_medio
        self.periodo_humedo = periodo_humedo
        self.periodo_seco = periodo_seco
        self.mes = mes

    def __repr__(self):
        return "<rendimiento_hidrico(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"rendimiento hidrico para Sub Zona {self.sub_zona_id} en {self.mes}"

class IndicesDeAridez(Base):
    '''
    Esta tabla contiene la información de los índices de aridez y está relacionada con la tabla `sub_zonas_hidrograficas`.
    
    Atributos:
    ----------
    - metrica: String
        Métrica utilizada para el índice de aridez.
    
    - tipo_ano: String
        Tipo de año (e.g., medio, húmedo, seco).
    
    - ua_text: String
        Texto descriptivo de la unidad analítica.
    
    - mes: String
        Mes correspondiente al índice.
    
    - valor: Float
        Valor del índice de aridez.
    
    - color: String
        Representación de color asociada al índice.
    
    Relaciones:
    -----------
    - sub_zona_hidrografica:
        Relación con la tabla `sub_zonas_hidrograficas`.
    '''
    __tablename__ = 'indices_de_aridez'
    
    # Columnas de la tabla
    id_indice_aridez = Column(Integer, primary_key=True, autoincrement=True)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"))
    metrica = Column(String, nullable=False)  # Ejemplo: 'Índice de Aridez'
    tipo_ano = Column(String, nullable=False)  # Ejemplo: 'Medio'
    mes = Column(String, nullable=False)  # Ejemplo: 'ENE'
    valor = Column(Float, nullable=False)  # Ejemplo: 0.201252
    color = Column(String, nullable=True)  # Ejemplo: '#06ba21'

    # Relaciones
    sub_zona = relationship("SubZonasHidrograficas")

    # Lista de columnas para inicialización y representación
    list_columns = ['sub_zona_id', 'metrica', 'tipo_ano', 'mes', 'valor', 'color']

    def __init__(self, sub_zona_id, metrica, tipo_ano, mes, valor, color):
        self.sub_zona_id = sub_zona_id
        self.metrica = metrica
        self.tipo_ano = tipo_ano
        self.mes = mes
        self.valor = valor
        self.color = color

    def __repr__(self):
        return "<indices_de_aridez(" + ', '.join([f"{col}='{getattr(self, col)}'" for col in self.list_columns]) + ")>"

    def __str__(self):
        return (f"Índice de Aridez para Subzona {self.sub_zona_id} ({self.ua_text}) en {self.mes} "
                f"({self.tipo_ano}): {self.valor} (Color: {self.color})")

class EscenarioHidrologico(Base):
    '''
    Clase para mapear la tabla `escenarios_hidrologicos` en la base de datos.
    Esta tabla contiene la información relacionada con los valores asociados a diferentes escenarios históricos en las subcuencas.

    Atributos:
    ----------
    - id_escenario : Integer
        Identificador único para cada registro (clave primaria).

    - index : Float
        Índice temporal o posición en la serie de datos.

    - escenario : String
        Nombre del escenario hidrológico.

    - ua : String
        Unidad analítica o región de análisis.

    - valor : Float
        Valor asociado al escenario hidrológico.

    - id_sub_cuenca : Integer
        Clave foránea que referencia la tabla de subcuencas.

    Relaciones:
    -----------
    - sub_cuenca : Relación con la tabla `SubZonasHidrograficas`.

    Métodos:
    --------
    - __init__: Constructor para inicializar los atributos de la clase.
    - __repr__: Representación de la instancia para depuración.
    - __str__: Representación amigable en cadena del objeto.
    '''

    __tablename__ = 'escenarios_hidrologicos'

    id_escenario = Column(Integer, primary_key=True, autoincrement=True)
    index = Column(Float, nullable=False)
    escenario = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    id_sub_cuenca = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"), nullable=False)

    # Relación con la tabla SubZonasHidrograficas
    sub_cuenca = relationship("SubZonasHidrograficas")

    list_columns = ['index', 'escenario', 'valor', 'id_sub_cuenca']

    def __init__(self, index, escenario, valor, id_sub_cuenca):
        self.index = index
        self.escenario = escenario
        self.valor = valor
        self.id_sub_cuenca = id_sub_cuenca

    def __repr__(self):
        return "<escenarios_hidrologicos(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Escenario Hidrológico: {self.escenario}, UA: {self.ua}, Subcuenca ID: {self.id_sub_cuenca}"

class MetricasHidrologicas(Base):
    '''
    Clase para mapear la tabla `metricas_hidrologicas` en la base de datos.
    Esta tabla contiene las métricas hidrológicas asociadas a las unidades analíticas (UA).

    Atributos:
    ----------
    - id_metrica : Integer
        Identificador único para cada registro (clave primaria).


    - metrica : String
        Nombre de la métrica hidrológica.

    - valor : Float
        Valor asociado a la métrica hidrológica.

    - id_sub_cuenca : Integer
        Clave foránea que referencia la tabla de subcuencas.

    Relaciones:
    -----------
    - sub_cuenca : Relación con la tabla `SubZonasHidrograficas`.

    Métodos:
    --------
    - __init__: Constructor para inicializar los atributos de la clase.
    - __repr__: Representación de la instancia para depuración.
    - __str__: Representación amigable en cadena del objeto.
    '''

    __tablename__ = 'metricas_hidrologicas'

    id_metrica = Column(Integer, primary_key=True, autoincrement=True)
    metrica = Column(String, nullable=False)
    valor = Column(String, nullable=False)
    id_sub_cuenca = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"), nullable=True)

    # Relación con la tabla SubZonasHidrograficas
    sub_cuenca = relationship("SubZonasHidrograficas")

    list_columns = ['ua', 'metrica', 'valor', 'id_sub_cuenca']

    def __init__(self, metrica, valor, id_sub_cuenca):
        self.metrica = metrica
        self.valor = valor
        self.id_sub_cuenca = id_sub_cuenca

    def __repr__(self):
        return "<metricas_hidrologicas(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Métrica: {self.metrica}, UA: {self.ua}, Valor: {self.valor}, Subcuenca ID: {self.id_sub_cuenca or 'N/A'}"

class WeatherMetrics(Base):
    """
    Clase para mapear la tabla `weather_metrics` en la base de datos.
    Contiene datos meteorológicos por fecha, hora y zona.

    Atributos:
    ----------
    - id : Integer
        Identificador único para cada registro (clave primaria).
    - date_time : DateTime
        Fecha y hora del registro.
    - temp : Float
        Temperatura actual.
    - temp_min : Float
        Temperatura mínima.
    - temp_max : Float
        Temperatura máxima.
    - pressure : Integer
        Presión atmosférica.
    - humidity : Integer
        Humedad relativa.
    - weather_main : String
        Descripción general del clima.
    - weather_description : String
        Descripción detallada del clima.
    - wind_speed : Float
        Velocidad del viento.
    - rain_volume : Float
        Volumen de lluvia.
    - sub_zona_id : Integer
        Clave foránea que referencia la tabla de subzonas hidrológicas.
    """

    __tablename__ = 'weather_metrics'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sub_zona_id = Column(Integer, ForeignKey("sub_zonas_hidrograficas.id_sub_zona"), nullable=False)
    date_time = Column(DateTime, nullable=False)
    temp = Column(Float, nullable=False)
    temp_min = Column(Float, nullable=False)
    temp_max = Column(Float, nullable=False)
    pressure = Column(Integer, nullable=False)
    humidity = Column(Integer, nullable=False)
    weather_main = Column(String, nullable=False)
    weather_description = Column(String, nullable=False)
    wind_speed = Column(Float, nullable=False)
    rain_volume = Column(Float, nullable=True)

    # Relación con la tabla SubZonasHidrograficas
    sub_cuenca = relationship("SubZonasHidrograficas")

    list_columns = [
        'sub_zona_id','date_time', 'temp', 'temp_min', 'temp_max', 'pressure', 
        'humidity', 'weather_main', 'weather_description', 
        'wind_speed', 'rain_volume'
    ]

    def __init__(self, date_time, temp, temp_min, temp_max, pressure, humidity, weather_main, weather_description, wind_speed, rain_volume, sub_zona_id):
        self.date_time = date_time
        self.temp = temp
        self.temp_min = temp_min
        self.temp_max = temp_max
        self.pressure = pressure
        self.humidity = humidity
        self.weather_main = weather_main
        self.weather_description = weather_description
        self.wind_speed = wind_speed
        self.rain_volume = rain_volume
        self.sub_zona_id = sub_zona_id

    def __repr__(self):
        return "<weather_metrics(" + ','.join([f"'{i}'" for i in self.list_columns]) + ")>"

    def __str__(self):
        return f"Fecha: {self.date_time}, Clima: {self.weather_main}, Subzona ID: {self.sub_zona_id}"