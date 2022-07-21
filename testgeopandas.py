import geopandas as gpd
import contextily as cx
minor_dataframe = gpd.read_file("./src/sidewalkdata/sidewalks_minor.shp", rows=10)
minor_series = minor_dataframe.get("geometry")
minor_series = minor_series.to_crs(epsg=4326)  # EPSG:4326, EPSG:3857
# print(minor_series)
ax = minor_series.plot(figsize=(10, 10), alpha=0.5, edgecolor='k')
cx.add_basemap(ax)