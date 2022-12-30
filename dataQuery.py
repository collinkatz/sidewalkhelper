import json
import sys
import numpy as np
from SHPQuery import SHPQuery

# Constants
maps_crs = "epsg:4326"

args = sys.argv
try:
    qid = args[1]
    county = args[3]
    chunks_enabled = args[4] == "true"

    if len(args) == 5 and chunks_enabled == False:
        bounds = json.loads(args[2].replace("'", "\"")) # Need to take single quotes and turn them into double quotes for json.loads
        # TODO: Check that boundcoords are not null
        # print("python query: " + qid + str(bounds["ne"]) + str(bounds["sw"]) + county)
        SHPQuery(qid, county, bounds, maps_crs)
    elif len(args) == 5 and chunks_enabled == True:
        num_chunks = 3
        bounds = json.loads(args[2].replace("'", "\"")) # Need to take single quotes and turn them into double quotes for json.loads
        bounds_lng = np.linspace(bounds['sw']['lng'], bounds['ne']['lng'], num_chunks) #bound_coords['ne']['lng']
        bounds_lat = np.linspace(bounds['sw']['lat'], bounds['ne']['lat'], num_chunks)
        lngv, latv = np.meshgrid(bounds_lng, bounds_lat)
        chunks = []
        for i in range(0, len(lngv)-1):
            for j in range(0, len(latv)-1):
                sw = {"lat": latv[j][i], "lng": lngv[j][i]}
                ne = {"lat": latv[j+1][i], "lng": lngv[j][i+1]}
                chunked_bounds = {"ne": ne, "sw": sw}
                SHPQuery(qid, county, chunked_bounds, maps_crs)
                # chunks.append(chunked_bounds)
        # sys.stdout.write(str(chunks).replace("\'", "\"")) # Need to replace this so JavaScript can convert to JSON like object
except IndexError:
    print("Not enough arguments")