import json
import sys
from SHPQuery import SHPQuery

# Constants
maps_crs = "epsg:4326"

args = sys.argv
try:
    qid = args[1]
    bounds = json.loads(args[2].replace("'", "\"")) # Need to take single quotes and turn them into double quotes for json.loads
    county = args[3]
    # TODO: Check that boundcoords are not null
    # print("python query: " + qid + str(bounds["ne"]) + str(bounds["sw"]) + county)
    SHPQuery(qid, county, bounds, maps_crs)
except IndexError:
    print("Not enough arguments")