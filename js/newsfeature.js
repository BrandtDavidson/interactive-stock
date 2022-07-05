var searchBtn = document.getElementById("searchStockBtn")
var apiKey = "cbFInYyDImkzGOO66NTz9LPD0lxIYu6BpmALFthz"
var newSearch = document.querySelector("#stockInputField")


var formSubmitHandler = function (event) {
  event.preventDefault()

  var newCompany =  newSearch.value.trim();

  if(newCompany){
    getNews(newCompany)
  }
}

var requestOptions = {
  method: 'GET'
};

var getNews = function (name) {
  fetch(
    "https://api.marketaux.com/v1/news/all?exchanges=NYSE,NASDAQ&search=" + name + "&api_token=cbFInYyDImkzGOO66NTz9LPD0lxIYu6BpmALFthz"
  
  )
  .then((response) => response.json())
  .then((data) => {this.displayNews(data)

  console.log(data)

  })
}

var displayNews = function(data) {
  var headline = data.data[0].title
  var article = data.data[0].description
  var url1 = data.data[0].url
  
  var headline2 = data.data[1].title
  var article2 = data.data[1].description
  var url2 = data.data[1].url
  
  var headline3 = data.data[2].title
  var article3 = data.data[2].description
  var url3 = data.data[2].url
  

  document.querySelector(".news").innerHTML = headline
  document.querySelector(".article").innerHTML = article
  document.getElementById("url").href =  url1 
  document.getElementById("url").textContent =  "Read More"
  document.querySelector(".news2").innerHTML = headline2
  document.querySelector(".article2").innerHTML = article2
  document.querySelector(".url2").href = url2
  document.querySelector(".url2").textContent = "Read More"
  document.querySelector(".news3").innerHTML = headline3
  document.querySelector(".article3").innerHTML = article3
  document.querySelector(".url3").href = url3
  document.querySelector(".url3").textContent = "Read More"
}

searchBtn.addEventListener("click" , formSubmitHandler)