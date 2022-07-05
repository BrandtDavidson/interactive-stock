
// TODO: Clean up styling (7/1)
var stock = [];
var searchBtn = $("#pinStock");
var STOCK_STORAGE_KEY = "stockWatchList";

// This is the Alpha Vantage (RapidAPI) integration

const baseSettings = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/JSON",
    "X-RapidAPI-Key": "872539a0f7mshb399d637cc60cd4p19b746jsnb2cef270256c",
    "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
  },
};

// Generating the API call URL (with substitution params) ->
// the default resultFunction = TIME_SERIES_INTRADAY
function getAlphaVantageUrl(symbol, resultFunction = "TIME_SERIES_DAILY") {
  return `https://alpha-vantage.p.rapidapi.com/query?interval=5min&function=${resultFunction}&symbol=${symbol}&datatype=json&output_size=compact`;
}
// Will need parameters to get URL - because we are calling with different symbols and stock names
function getAlphaVantageResult(symbol, resultFunction) {
  var url = getAlphaVantageUrl(symbol, resultFunction);
  // this will now return a reponse that get turned into a result
  return fetch(url, baseSettings).then((response) => {
    // returning the json (converted)
    return response.json();
  });
}

function getStockWatchList() {
  var stockWatchList = JSON.parse(localStorage.getItem(STOCK_STORAGE_KEY));

  if (stockWatchList === null) {
    stockWatchList = [];
  }
  return stockWatchList;
}

function setStockWatchList(stockWatchList) {
  localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stockWatchList));
}

// Put our data into a usable form
// this function contains the daily data results - objects returned
// transforms
// making series of calls
function createDailyData(date, data) {
  return {
    date: date,
    open: parseFloat(data["1. open"]),
    high: parseFloat(data["2. high"]),
    low: parseFloat(data["3. low"]),
    close: parseFloat(data["4. close"]),
    volume: parseInt(data["5. volume"]),
  };
}

function selectStock(symbol) {
  getAlphaVantageResult(symbol).then((stockData) => {
    // console.log(stockData);
    // defining daily time series data object
    var timeSeriesDayData = stockData["Time Series (Daily)"];
    // have to account for the 5 day market week
    // based on the way the properties are listed in the array (bottom to top) we need to gather only the last property each time in this array (Time series daily), each data is a key. e1 and e2 are the entries sorted (parameters for the arrow function)
    // using moment to compare dates
    // array function pipelines
    var dailyDataEntries = Object.entries(timeSeriesDayData)
      // for each of the entries in createDailyData we creating a moment for the date and transforming the data into the usable form
      // .map will transform the raw data into a daily data entry using createDailyEntry
      .map((entry) => createDailyData(moment(entry[0]), entry[1]))
      // sort this data in date order here
      .sort((e1, e2) => {
        return e1.date.diff(e2.date, "days");
      });
    console.log(dailyDataEntries);

    // using .pop() to remove those last two entries so we can display them later
    // zero based array so much index for .length -1
    var currentDayData = dailyDataEntries[dailyDataEntries.length - 1];
    var previousDayData = dailyDataEntries[dailyDataEntries.length - 2];

    console.log(currentDayData, previousDayData);
    // format.('L) is just the local date format
    $("#currentMarketIndex .date").text(currentDayData.date.format("L"));
    $("#currentMarketIndex .stockName").text(symbol);
    $("#currentMarketIndex .dailyOpen")
      .text(currentDayData.open)
      // chaining (jquery) an if statement in one line - without an else --> TERNARY expression
      // instead of doing an if and repeating the same - ?=if, : =else
      .addClass(
        currentDayData.open > previousDayData.open ? "priceUp" : "priceDown"
      );
    $("#currentMarketIndex .dailyHigh").text(currentDayData.high);
    $("#currentMarketIndex .dailyLow").text(currentDayData.low);
    $("#currentMarketIndex .dailyClose")
      .text(currentDayData.close)
      .addClass(
        currentDayData.close > currentDayData.open ? "priceUp" : "priceDown"
      );
    // toLocaleString() method for adding commas to output number value of volume
    $("#currentMarketIndex .dailyVolume").text(
      currentDayData.volume.toLocaleString()
    );

    // ANYCHART https://www.anychart.com/blog/2020/03/25/js-candlestick-chart-steps/

    var dataTable = anychart.data.table(0, "MMM d, yyyy");
    dataTable.addData(dailyDataEntries.map((e) => [e.date.toDate(), e.open, e.high, e.low, e.close]));

    // map data
    var mapping = dataTable.mapAs({ x: 0, open: 1, high: 2, low: 3, close: 4 });

    // set the chart type
    var chart = anychart.stock();

    // set the series
    var series = chart.plot(0).candlestick(mapping);
    series.name(`${symbol} Trade Data`);

    // set the chart title
    chart.title(`${symbol} Trade Data`);

    // clear the container
    $("#candlestickChart").empty();

    // set the container id
    chart.container("candlestickChart");

    // draw the chart
    chart.draw();

    series.fallingFill("red");
    series.fallingStroke("black");
    series.risingFill("green");
    series.risingStroke("black");

    // END OF CHART


    //show selected stock container
    $('#currentStockSelected').show();
  });
}

function pageRefresh() {
  $("#stockPinnedList").empty();

  getStockWatchList().forEach((stock) => {
    var stockAppend = $("<li>" + stock + "</li>");

    stockAppend.on("click", function () {
      selectStock(stock);
    });
    $("#stockPinnedList").append(stockAppend);
  });
}

function stockLog() {
  localStorage.setItem("inputtedStock", JSON.stringify(inputtedStock));
}

$(document).ready(function () {
  pageRefresh();

  $('#currentStockSelected').hide();

  $("#searchStockBtn").on("click", function (event) {
    event.preventDefault();
    var stockWatchList = getStockWatchList();
    var stockName = $("#stockInputField").val().trim();
    if (stockName === "") {
      return;
    }

    if (stockWatchList.indexOf(stockName) === -1) {
      stockWatchList.push(stockName);
      setStockWatchList(stockWatchList);
    }

    selectStock(stockName);

    $("#stockInputField").val("");

    pageRefresh();
  });
});
