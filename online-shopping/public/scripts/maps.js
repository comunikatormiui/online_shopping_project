/*function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  // var uluru = {lat: 49.278109, lng: -122.919};
  var uluru = {lat: lat, lng: lng};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });



  var marker1 = new google.maps.Marker({
    var uluru = {lat:item.lat, lng:item.lng};
    position: uluru,
    map: map
  });


}


function initMap() {
  getLocation();
}
