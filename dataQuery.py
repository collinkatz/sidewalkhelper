import geopandas as gpd
import json
from shapely.geometry import Point

# Constants
sidewalk_data_dir = "./src/sidewalkdata/"
county_to_files = sidewalk_data_dir + "which_county_files.json"

bb = gpd.GeoDataFrame({'geometry':[Point(76.82592340153855, 39.293719177135394), Point(-76.81814499553275, 39.28838835226815)]}, index=["p1", "p2"], crs={"init":"epsg:4326"})
print(bb.crs)
bb = bb.to_crs({"init":"epsg:2248"})
print(bb)
all_sidewalk_minor_df = gpd.read_file("./src/sidewalkdata/howard_county/sidewalks_minor.shp", bbox=bb)
print(all_sidewalk_minor_df)
selection = all_sidewalk_minor_df.to_crs(epsg=4326)
print(selection)

class SHP_Query:
    def __init__(self, county, bound_coords):
        self.bounding_box = gpd.GeoDataFrame({'geometry':[Point(bound_coords.x1, bound_coords.y1), Point(bound_coords.x2, bound_coords.y2)]}, index=["p1", "p2"], crs={"init":"epsg:4326"})
        ctf_file_obj = open(county_to_files, 'r')
        self.file_names = json.load(ctf_file_obj)[county]
        ctf_file_obj.close()
        self.county_directory = sidewalk_data_dir + county

    def get_crs_from_file(self, file):
        temp_df = gpd.read_file(self.county_directory + self.file_names[0], rows=1)
        return temp_df.crs