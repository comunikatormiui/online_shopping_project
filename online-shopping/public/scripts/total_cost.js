$(document).ready(function() {
    $('#quantity').on('input', function() {
        var price_of_item = $('#item_price').val();
        var quantity = $('#quantity').val();
        var total_cost = price_of_item * quantity;

        $('#total_amount').val('CDN$ ' + total_cost);
    });
});