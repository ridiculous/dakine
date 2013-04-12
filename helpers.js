// first parameter should be the function name, followed by the arguments
// e.g. measureTime(stripeTableRows, $('#transactions'))
function measureTime() {
    var t = new Date();
    Array.prototype.shift.call(arguments).apply(this, arguments);
    console.log(new Date() - t);
}

function stripeTableRows(this_table, tr_selector) {
    var $rows = $(this_table).find(tr_selector || 'tr:not(:first)');
    $rows
        .removeClass('odd even')
        .filter(':even')
        .addClass('even')
        .end()
        .filter(':odd')
        .addClass('odd');
}

// simple algorithm for centering
function centered(box) {
    if (box) {
        var box_width = box.outerWidth(), view_port = $(window).width();
        box[0].style.left = ((view_port - box_width) / 2) + 'px';
    }
}