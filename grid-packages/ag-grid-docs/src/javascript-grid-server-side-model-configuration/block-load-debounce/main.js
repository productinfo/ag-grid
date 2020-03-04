var gridOptions = {
  columnDefs: [
    { field: 'id', maxWidth: 80 },
    { field: 'athlete' },
    { field: 'country' },
    { field: 'year' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
  ],

  defaultColDef: {
    flex: 1,
    minWidth: 150,
    resizable: true,
  },

  // use the server-side row model
  rowModelType: 'serverSide',

  // fetch 200 rows at a time (default is 100)
  cacheBlockSize: 200,

  // only keep 10 blocks of rows (default is all rows cached)
  maxBlocksInCache: 10,

  // adding a debounce to allow skipping over blocks while scrolling
  blockLoadDebounceMillis: 100,

  debug: true,

  animateRows: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json',
    })
    .then(function(data) {
      // adding row id to data
      var idSequence = 0;
      data.forEach(function(item) {
        item.id = idSequence++;
      });

      // setup the fake server with entire dataset
      var fakeServer = createFakeServer(data);

      // create datasource with a reference to the fake server
      var datasource = createServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function createServerSideDatasource(server) {
  return {
    getRows: function(params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);

      // get data for request from our fake server
      var response = server.getData(params.request);

      // simulating real server call with a 500ms delay
      setTimeout(function () {
        if (response.success) {
          // supply rows for requested block to grid
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    }
  };
}

function createFakeServer(allData) {
  return {
    getData: function(request) {
      // take a slice of the total rows for requested block
      var rowsForBlock = allData.slice(request.startRow, request.endRow);

      // when row count is known and 'blockLoadDebounceMillis' is set it is possible to
      // quickly skip over blocks while scrolling
      var lastRow = allData.length;

      return {
        success: true,
        rows: rowsForBlock,
        lastRow: lastRow,
      };
    },
  };
}