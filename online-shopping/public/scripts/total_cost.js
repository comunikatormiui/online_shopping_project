$(document).ready(function() {
    var updateTotalAmount = function(){
        var price_of_item = $('#item_price').val();
        var quantity = $('#quantity').val();
        var total_cost = Math.round(price_of_item * quantity * 100) / 100;
        $('#total_amount').val('CDN$ ' + total_cost);
    }
    $('#quantity').on('input', function() {
        updateTotalAmount();
    });
    $('#quantity').focusout(function() {
        var quantity = $('#quantity').val();
        if(quantity <= 0) {
            $('#quantity').val('1');
        }
        updateTotalAmount();
    });
});