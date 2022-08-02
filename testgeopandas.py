import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
import gmplot

sidewalk_data_dir = "./src/sidewalkdata/"
county_to_files = sidewalk_data_dir + "which_county_files.json"
output_dir = "./query_output/"
maps_crs = "epsg:4326"

# apikey = open("googleapikey.txt").read()
#
# minor_dataframe = gpd.read_file("./src/sidewalkdata/sidewalks_minor.shp", rows=10)
# minor_series = minor_dataframe.head() # .get("geometry")
# minor_series = minor_series.to_crs(epsg=4326)  # EPSG:4326, EPSG:3857
# print(minor_series)
# # ax = minor_series.plot(figsize=(10, 10), alpha=0.5, edgecolor='k')
# gmap = gmplot.GoogleMapPlotter(37.766956, -122.448481, 14, apikey=apikey)
# # gmap.draw("./map.html")

bb = gpd.GeoDataFrame({'geometry':[Point(76.82592340153855, 39.293719177135394), Point(-76.81814499553275, 39.28838835226815)]}, index=["p1", "p2"], crs={"init":maps_crs})
print(bb.crs)
bb = bb.to_crs({"init":"epsg:2248"})
print(bb)
all_sidewalk_minor_df = gpd.read_file(sidewalk_data_dir + "howard_county/sidewalks_minor.shp", bbox=bb)
all_sidewalk_major_df = gpd.read_file(sidewalk_data_dir + "howard_county/sidewalks_major.shp", bbox=bb)
both = pd.concat([all_sidewalk_minor_df, all_sidewalk_major_df])
print(both)
print(both.to_crs(maps_crs))
