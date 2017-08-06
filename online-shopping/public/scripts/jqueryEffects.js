$(document).ready(function(){
  console.log("lalalalal-----------------");
  console.log(prices);
  $('#quantity').on('keyup', function() {
  	    var quantity = +$(this).val();
        //var dailyPrice = +$(this).data('daily-price');
        var dailyPrice = +$(this).prices;
  	    $('#total').text(quantity * dailyPrice);
    	});
});
/*
  	//<div class="price" data-daily-price="357">
  	  <p>$<span id="total">2,499</span></p>
  	  //<p><label for="quantity">Number of Nights</label></p>
  	  <p><input type="number" id="quantity" value="7"></p>
  	</div>
*/
