import json
import sys
import time
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
        # try:
        self.bounding_box = gpd.GeoDataFrame({'geometry':[Point(bound_coords['ne']['lng'], bound_coords['ne']['lat']), Point(bound_coords['sw']['lng'], bound_coords['sw']['lat'])]}, index=["p1", "p2"], crs={"init":crs})
        # TODO: check if county exists in json and has data files - output error if not
        ctf_file_obj = open(county_to_file, 'r')
        ctf_file_json = json.load(ctf_file_obj)
        self.file_names = ctf_file_json[county]["files"]
        self.file_types = ctf_file_json[county]["types"]
        ctf_file_obj.close()
        self.county_directory = sidewalk_data_dir + county + "/"
        self.county_data_crs = self.get_crs_from_file(self.file_names[0])
        # print(self.county_data_crs)
        self.bounding_box = self.bounding_box.to_crs(self.county_data_crs)
        # print(self.bounding_box)
        self.dfs = [df.to_crs(crs) for df in self.get_county_data()]
        # TODO: Need to try to get around stdout limit
        # TODO: Make it so there is a max query size and it will fill in more as it goes
        pd.set_option('display.max_columns', None)
        for df in self.dfs:
            if not df.empty:
                # print(df)
                sys.stdout.write(df.to_json().replace(' ','') + "\n") # Write this to a stream like stdout
                time.sleep(1)
        # self.output_json = self.df.to_file(output_dir + str(query_id) + "_" + county + ".json", driver="GeoJSON")
        # print("query: " + query_id + "_" + county + " finished with status 0")
        # except:
            
        #     print("query: " + query_id + "_" + county + " exited with status -1")

    def get_crs_from_file(self, file_name):
        temp_df = gpd.read_file(self.county_directory + file_name, rows=1)
        return temp_df.crs

    def get_county_data(self):
        file_dfs = []
        for i in range(len(self.file_names)):
            file_name = self.file_names[i]
            file_type = self.file_types[i]
            file_df = gpd.read_file(self.county_directory + file_name, bbox=self.bounding_box)
            file_df["FEATURE"] = file_type # Assign the file name to id so that we have the name when converting to json
            file_dfs.append(file_df)
        return file_dfs
        # return pd.concat(file_dfs)