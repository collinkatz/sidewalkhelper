import geopandas as gpd
from shapely.geometry import Point

apikey = open("googleapikey.txt").read()

bb = gpd.GeoDataFrame([Point(76.82592340153855, 39.293719177135394), Point(-76.81814499553275, 39.28838835226815)], crs="epsg:4326").set_geometry("")
print(bb)
bb.to_crs(epsg=2248)
# all_sidewalk_minor_df = gpd.read_file("./src/sidewalkdata/sidewalks_minor.shp", bbox=bb)
# print(all_sidewalk_minor_df.crs)


# selection = all_sidewalk_minor_df[0:100].to_crs(epsg=4326) # [0:82843] ["geometry"]
# print(selection)