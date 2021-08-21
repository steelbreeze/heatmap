# landscape
[![Maintainability](https://api.codeclimate.com/v1/badges/1106fd03a5f0df4cf80f/maintainability)](https://codeclimate.com/github/steelbreeze/landscape/maintainability)

Landscape map visualisation of data.

![landscape map viewpoint](https://steelbreeze.net/images/landscape-map.png)
These visualisations conform to the [Archimate Landscape Map Viewpoint](https://pubs.opengroup.org/architecture/archimate2-doc/chap08.html#_Toc371945248).

The tool takes as an input data set of the portfolio and dimensions they are associated with; it then can determine the optimal sequence of the values on the dimensions you select for the x and y axis for the optimal layout. It then generates the layout, splitting a cell in the table if multiple items in the portfolio are mapped to it, and joining items in neighbouring cells. 

These visualisations are an invaluable communication tool offering insight into the health of an application portfolio. High density areas indicate a fragmented portfolio, or redundancy; a wide scope may indicate over-extension.

If you like @steelbreeze/landscape, please star it.
## Installation
To install from npm:
```
npm install @steelbreeze/landscape
```
### Dependencies
@steelbreeze/landscape is dependant on @steelbreeze/pivot, also installable via npm:
```
npm install @steelbreeze/pivot
```
The @steelbreeze/landscape API requires cubes and dimensions generated by @steelbreeze/pivot.
## Usage
The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v3/).

## Example
This simple example is taken from the [steelbreeze.net](https://steelbreeze.net) homepage:
```javascript
// create pre-defined dimensions
const product = pivot.dimension(["Rates", "FX", "MM", "Credit", "Equities"], "Product");
const capability = pivot.dimension(["Market gateway", "Order execution", "Order management", "Confirmations"], "Capability");

// pivot the data using the product and capability dimensions as the x and y axes respectively
const cube = pivot.cube(data, product, capability);

// create a table of data from the pivot cube and dimensions
const table = landscape.table(cube, product, capability, key, true);

// merge cells on both axes where possible
landscape.merge(table);

// render the table in a designated element
renderTable(table, 'landscapeTarget');
```

## License
MIT License

Copyright (c) 2020 David Mesquita-Morris
