// Alpha Vantage API Key

var apiKeyVantage = "872539a0f7mshb399d637cc60cd4p19b746jsnb2cef270256c";
var stocks = [];

const stockSettings = {
	"async": true,
	"crossDomain": true,
	"url": "https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=MSFT&datatype=json",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "872539a0f7mshb399d637cc60cd4p19b746jsnb2cef270256c",
		"X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
	}
};

$.ajax(stockiSettings).done(function (response) {
	console.log(response);
});



const STOCK_STORAGE_KEY = "stockWatchList";

function getStockWatchList() {
  var stockWatchList = JSON.parse(localStorage).getItem(STOCK_STORAGE_KEY);

  if (stockWatchList === null) {
    stockWatchList = [];
  }
  return stockWatchList;
}

function setStockWatchList(stockWatchList) {
  localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stockWatchList));
}

function pageRefresh() {
  $("#stockPinnedList").empty();

  getCityWatchList().forEach((stock) => {
    var stockAppend = $(
      '<li><span class="badge badge-primary">' + stock + "<span></li>"
    );
    stockAppend.on("click", function () {
      selectStock(stock);
    });
    $("#stockPinnedList").append(stockAppend);
  });
}

function stockLog() {
  localStorage.setItem("inputtedStock", JSON.stringify(inputtedCity));
}

$(document).ready(function () {
  pageRefresh();
  $("#currentStockSelected").hide();

  $("#pinStock").on("click", function (event) {
    event.preventDefault();
    var cityWatchList = getCityWatchList();
    var cityName = $("#stockInputField").val().trim();
    if (cityName === "") {
      return;
    }

    if (cityWatchList.indexOf(cityName) === -1) {
      cityWatchList.push(cityName);
      setStockWatchList(cityWatchList);
    }

    selectCity(cityName);

    pageRefresh();
  });
});
