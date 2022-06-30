// (function($){
//   $(function(){

//     $('.sidenav').sidenav();

//   });
//   instance.open(); // end of document ready
// })(jQuery); // end of jQuery name space


var apiKey = "cbFInYyDImkzGOO66NTz9LPD0lxIYu6BpmALFthz"

var getNews = function (name) {
  fetch(
    "https://api.marketaux.com/v1/news/all?search=" + name + "&language=en&api_token=cbFInYyDImkzGOO66NTz9LPD0lxIYu6BpmALFthz"
  )
  .then((response) => response.json())
  .then((data) => console.log(data))
}