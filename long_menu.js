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
 *  OR
 *  <div class="controlled">
 *  <ul class="menu">
 *     <li>Menu Header</li>
 *     <li class="controllable"><a href="#">...</a></li>
 *     <li class="controllable"><a href="#">...</a></li>
 *  </ul>
 *  <ul class="menu">
 *     <li>Menu Header 2</li>
 *     <li class="controllable"><a href="#">...</a></li>
 *     <li class="controllable"><a href="#">...</a></li>
 *  </ul>
 *  </div>
 * 
 * Usage:
 * var long_menu = new LongMenu()
 *          , $items = $menu.find('ul').children()
 *          , item_count = $items.length
 *          , window_h = $(window).height()
 *          , item_height = 0;
 *
 *      $items.each(function () {
 *          item_height += $(this).outerHeight();
 *      });
 *
 *      // divide the window height by the average item height
 *      var allowed = Math.floor(window_h / (item_height / item_count));
 *
 *      if (item_count < allowed) {
 *          return
 *      }
 *
 *      long_menu.init('#' + $menu.attr('id'));
 *      if (!long_menu.allowed_items) {
 *          long_menu.setAllowedItems(allowed);
 *      }
 *      long_menu.resetList();
 * 
 * @constructor
 */
function LongMenu() {
    var menu = this;

    this.delay = 80; // ms
    this.$master = [];
    this.$items = [];
    this.$up = [];
    this.$down = [];
    this.moving = null;
    this.allowed_items = 0;
    this.up_arrow_html = '<li class="up-mover"><a href="javascript:;"><b class="up-caret"></b></a></li>';
    this.down_arrow_html = '<li class="down-mover"><a href="javascript:;"><b class="caret"></b></a></li>';

    this.moveUp = function (once) {
        if (this.$down.hasClass('inactive')) {
            return;
        }

        var available_items = this.$items.filter(':visible')
            , last_item = available_items.last()
            , next_item = last_item.next('.controllable')
            , parents_next_item = last_item.parent().next().find('.controllable:first');

        clearTimeout(this.moving);

        if (next_item.length) {
            next_item.show();
        } else if (parents_next_item.length) {
            parents_next_item.show();
        } else {
            this.$down.addClass('inactive');
        }

        if (next_item.length || parents_next_item.length) {
            available_items.first().hide();
            this.$up.removeClass('inactive');
            if (!once) {
                this.moving = setTimeout(function () {
                    menu.moveUp();
                }, this.delay);
            }
        }
    };

    this.moveDown = function (once) {
        if (this.$up.hasClass('inactive')) {
            return;
        }

        var available_items = this.$items.filter(':visible')
            , first_item = available_items.first()
            , prev_item = first_item.prev('.controllable')
            , parents_prev_item = first_item.parent().prev().find('.controllable:last');

        clearTimeout(this.moving);

        if (prev_item.length) {
            prev_item.show();
        } else if (parents_prev_item.length) {
            parents_prev_item.show();
        } else {
            this.$up.addClass('inactive');
        }
        if (prev_item.length || parents_prev_item.length) {
            available_items.last().hide();
            this.$down.removeClass('inactive');
            if (!once) {
                this.moving = setTimeout(function () {
                    menu.moveDown();
                }, this.delay)
            }
        }
    };

    this.resetList = function () {
        this.$items.show();
        this.$down.removeClass('inactive');
        this.$up.addClass('inactive');
        this.hideOverflow();
    };

    this.hideOverflow = function () {
        this.$items.slice(this.allowed_items, this.$items.length).hide();
    };

    this.init = function (master) {
        this.$master = $(master);
        this.$items = this.$master.find('.controllable');

        if (!this.$master.length) {
            return false;
        }

        $(this.up_arrow_html).insertBefore(this.$items.first());
        $(this.down_arrow_html).insertAfter(this.$items.last());

        this.$up = this.$master.find('.up-mover');
        this.$down = this.$master.find('.down-mover');

        this.bindElements();
        return true;
    };

    /**
     * Onclick is for tablets and such that dont support mouseover
     */
    this.bindElements = function () {
        this.$down
            .on('click', function (e) {
                menu.moveUp(true);
                e.stopPropagation();
            })
            .on('mouseover', function () {
                menu.moveUp();
            })
            .on('mouseout', function () {
                clearTimeout(menu.moving);
            });

        this.$up
            .on('click', function (e) {
                menu.moveDown(true);
                e.stopPropagation();
            })
            .on('mouseover', function () {
                menu.moveDown();
            })
            .on('mouseout', function () {
                clearTimeout(menu.moving);
            });
    };

    this.setAllowedItems = function (item_count) {
        this.allowed_items = item_count - 1; // -1 for up / down arrows;
    };

    // To prevent width from changing when items are hidden
    this.saveWidth = function () {
        this.$master.css('width', this.$master.width() + 'px');
    };
}
