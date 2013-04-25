function LongMenu() {
    var menu = this;

    this.$master = $('.controlled');
    this.$items = this.$master.find('.controllable');
    this.item_height = 26; // pre-determined height for each list item
    this.moving = null;
    this.allowed_items = Math.ceil(this.$master.height() / this.item_height); 

    this.moveUp = function () {
        var available_items = this.$items.filter(':visible');
        clearTimeout(this.moving);
        if (available_items.last().next('.controllable').length) {
            available_items.first().hide().end().last().next('.controllable').show();
            this.moving = setTimeout(function () {
                menu.moveUp();
            }, 80)
        }
    };

    this.moveDown = function () {
        var available_items = this.$items.filter(':visible');
        clearTimeout(this.moving);
        if (available_items.first().prev('.controllable').length) {
            available_items.last().hide().end().first().prev('.controllable').show();
            this.moving = setTimeout(function () {
                menu.moveDown();
            }, 80)
        }
    };

    this.resetList = function () {
        this.$items.show();
        this.hideOverflow();
    };

    this.hideOverflow = function () {
        this.$items.slice(this.allowed_items, this.$items.length).hide();
    };

}
$(function () {
    var menu = new LongMenu();

    if (!menu.$master.length) {
        return;
    }

    menu.hideOverflow();
    menu.$master.hover(function () {

        $(this)
            .css('width', $(this).width() + 'px') // maintain original width
            .off()                                // avoid double binding
            .on('mousemove', function (e) {
                if (e.clientY < 187 && e.clientY > 144) {
                    menu.moveDown();
                } else if (e.clientY < 567 && e.clientY > 525) {
                    menu.moveUp();
                } else {
                    clearTimeout(menu.moving);
                }
            });

    }, function () {
        clearTimeout(menu.moving);
    });

    $('.dropdown-toggle).on('click', function () {
        menu.resetList();
    });
});
