$(document).ready(function() {

  console.log(prices);

  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',

    // The data for our dataset
    data: {
      labels: prices.dates,
      datasets: [{
        label: 'SFU Trade',
        // borderColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(214, 72, 66)',
        fill: false,
        data: prices.prices,
        lineTension: 0,
      }]
    },

    // Configuration options go here
    options: {}
  });
});
