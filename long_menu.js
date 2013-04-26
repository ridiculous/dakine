/**
 * Works on a markup that looks something like this (only longer):
 *  <a href="#" class="menu-header dropdown-toggle" data-toggle="dropdown">Open Menu</a>
 *  <ul class="dropdown-menu controlled">
 *     <li>Menu Header</li>
 *     <li class="controllable"><a href="#">Item 1</a></li>
 *     <li class="controllable"><a href="#">Item 2</a></li>
 *     <li class="controllable"><a href="#">Item 3</a></li>
 *     <li class="controllable"><a href="#">Item 4</a></li>
 *     <li class="controllable"><a href="#">Item 5</a></li>
 *     <li class="controllable"><a href="#">Item 6</a></li>
 *  </ul>
 * @constructor
 */
function LongMenu() {
    var menu = this;

    this.$master = $('.controlled');
    this.$items = this.$master.find('.controllable');
    this.moving = null;
    this.allowed_items = 0;

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

    menu.$master.hover(function () {

        $(this)
            .off()
            .on('mousemove', function (e) {
                // TODO: calculate this dynamically based on UL position on page
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

    $('.menu-header').on('click', function () {
        // only do this the first time
        if (!menu.allowed_items) {
            menu.$master.css('width', menu.$master.width() + 'px'); // do this because the width may change when items are hidden
            menu.allowed_items = Math.ceil(menu.$master.height() / 26); // 26 is the list item height
        }
        menu.resetList();
    });
});
