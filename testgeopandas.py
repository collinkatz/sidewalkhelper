import geopandas as gpd
minor_dataframe = gpd.read_file("./src/sidewalkdata/sidewalks_minor.shp")
minor_series = minor_dataframe.head()
minor_series = minor_series.to_crs(epsg=4326)  # EPSG:4326, EPSG:3857
print(minor_series)
