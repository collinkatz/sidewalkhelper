# sidewalkhelper

## Goals
The goal of this project is to utilize sidewalk GIS data from the Howard County open data website to demonstrate walkability in different neighborhoods of Howard County.

## Project Description
Using GIS data in .shp files, we build a graph representation of all the datapoints and use these to deretmine reasonable connections between sidewalk paths in the county. We then use a graph search algorithm to determine if there is a sidewalk connection between two points on the graph.

### TODO
- [x] Figure out epsg number for correct transform
- [ ] Get plot() function to display output
- [ ] Get sattellite image background on plot
- [ ] Set up class heirarchy for graph : line-point-connections
- [ ] Convert linestring to set of connected points : i.e. form graph
- [ ] Define how separate linestrings connect : Maybe look at intersect or point proximity to determine path connections
- [ ] Choose search algorithm to operate on graph
