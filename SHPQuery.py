import json
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point


sidewalk_data_dir = "./src/sidewalkdata/"
county_to_file = sidewalk_data_dir + "which_county_files.json"
output_dir = "./query_output/"

class SHPQuery:
    def __init__(self, query_id, county, bound_coords, crs):
        """
        SHPQuery is a class that allows for easy querying of spacial data files using bounding box coordinates
        :param query_id: An integer, this is a unique id number for the query
        :param county: A string, used to get the directory that holds the files for the county of interest
        :param bound_coords: The North-East and South-West coordinates of a bounding box to query data within
        :param crs: The preferred coordinate reference system id for the data to be returned in E.G. "epsg:4326"
        """
        try:
            self.bounding_box = gpd.GeoDataFrame({'geometry':[Point(bound_coords['ne']['lng'], bound_coords['ne']['lat']), Point(bound_coords['sw']['lng'], bound_coords['sw']['lat'])]}, index=["p1", "p2"], crs={"init":crs})
            # TODO: check if county exists in json and has data files - output error if not
            ctf_file_obj = open(county_to_file, 'r')
            self.file_names = json.load(ctf_file_obj)[county]
            ctf_file_obj.close()
            self.county_directory = sidewalk_data_dir + county + "/"
            self.county_data_crs = self.get_crs_from_file(self.file_names[0])
            # print(self.county_data_crs)
            self.bounding_box = self.bounding_box.to_crs(self.county_data_crs)
            # print(self.bounding_box)
            self.df = self.get_county_data().to_crs(crs)
            # print(self.df)
            self.output_json = self.df.to_file(output_dir + str(query_id) + "_" + county + ".json", driver="GeoJSON")
            print("query: " + query_id + "_" + county + " finished with status 0")
        except:
            print("query: " + query_id + "_" + county + " exited with status -1")

    def get_crs_from_file(self, file_name):
        temp_df = gpd.read_file(self.county_directory + file_name, rows=1)
        return temp_df.crs

    def get_county_data(self):
        file_dfs = []
        for file_name in self.file_names:
            file_df = gpd.read_file(self.county_directory + file_name, bbox=self.bounding_box)
            file_dfs.append(file_df)
        return pd.concat(file_dfs)