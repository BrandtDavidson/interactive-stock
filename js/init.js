// (function($){
//   $(function(){

//     $('.sidenav').sidenav();

//   });
//   instance.open(); // end of document ready
// })(jQuery); // end of jQuery name space



var searchBtn = document.getElementById("pinStock")
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
  var url = data.data[0].url

  document.querySelector(".news").innerHTML = headline
  document.querySelector(".article").innerHTML = article
  document.querySelector(".url").innerHTML = url
}

searchBtn.addEventListener("click" , formSubmitHandler)