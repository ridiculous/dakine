/**
 * Wrapper for launching undo message boxes.
 * Defers request to a queue in the case of rapid calls
 *
 * DEPENDENCIES:
 * -> jQuery
 * -> uses +compacted+ and +findObject+ from class_extensions.js
 *
 * @constructor
 */
function Undo() {

    var undo = this
        , $ = jQuery;

    this.pad = 8;
    this.boxes = [];
    this.box_queue = [];
    this.$body = $('body');

    this.launchNew = function (msg, ids) {
        var active_boxes = this.boxes.compacted();

        // only allow two to be visible at a time
        if (active_boxes.length > 1) {
            active_boxes.shift().boot();
        }

        if (active_boxes.findObject(true, 'busy')) {
            this.box_queue.push({msg: msg, ids: ids});
        } else {
            var my_box = new this.Box(msg, ids);
            this.repositionOtherBoxes(my_box, my_box.$box.outerHeight() + this.pad);
            this.boxes.push(my_box);
        }
        return this;
    };

    this.repositionOtherBoxes = function (my_box, offset) {
        var active_boxes = undo.boxes.compacted();
        for (var i = 0; i < active_boxes.length; i++) {
            var b = active_boxes[i];
            b.introduce(parseInt(b.$box.css('top').replace('px', '')) + offset + 'px');
        }
    };

    /**
     * boot all active boxes and reset
     */
    this.initialize = function () {
        var active_boxes = undo.boxes.compacted();
        for (var i = 0; i < active_boxes.length; i++) {
            active_boxes[i].boot();
        }
        this.boxes = [];
        this.box_queue = [];
    };

    this.newLink = function () {
        var a = document.createElement('a');
        a.href = 'javascript:;';
        a.rel = 'nofollow';
        return $(a);
    };

    /**
     * Undo boxes
     *
     * @param msg {String}
     * @param ids {Array}
     * @constructor
     */
    this.Box = function (msg, ids) {
        var box = this;

        this.ids = ids;
        this.msg = msg;
        this.index = undo.boxes.length;
        this.busy = false;
        this.$box = [];

        this.init = function () {
            var $msg = $(document.createElement('span')).addClass('undo-message')
                , $link = undo.newLink().addClass('undo-link').text('Undo');
            this.$box = $(document.createElement('div')).addClass('alert alert-tip undo-box');

            undo.$body.append(this.$box);
            this.$box.append('<button type="button" class="close-alert">&times;</button>');
            this.$box.append($msg);
            this.$box.append($link);
            this.bindCancelButton();
            this.bindUndoLink();
            this.$box.find('.undo-message').html(this.msg + ' ');
            this.introduce();
            return this;
        };

        this.bindCancelButton = function () {
            this.$box
                .find('.close-alert')
                .on('click', function () {
                    box.boot();
                });
        };

        this.bindUndoLink = function () {
            this.$box
                .find('.undo-link')
                .on('click', function () {
                    $.ajax({
                        type: 'PUT',
                        url: '/path_to/undo',
                        dataType: 'JSON',
                        data: {
                            ids: box.ids
                        },
                        beforeSend: function () {
                            // signal loading
                        },
                        complete: function () {
                            var txs = box.ids
                                , active_boxes = undo.boxes.compacted();

                            // remove other boxes if they have the same id as this one so they dont conflict
                            for (var o = 0; o < txs.length; o++) {
                                for (var i = 0; i < active_boxes.length; i++) {
                                    if (active_boxes[i].ids.find(txs[o])) {
                                        active_boxes[i].boot();
                                    }
                                }
                            }
                            // signal ready
                        },
                        success: function (data) {
                            try {
                                // update txactions on page
                                var records = data['restored'];
                                for (var i = 0; i < records.length; i++) {
                                    $.parseJSON(records[i]); // restore the record
                                }
                            } catch (e) {
                                console.log('error in success callback of undo. ' + e);
                            }
                        },
                        error: function (e) {
                            console.log('error restoring transactions. ' + e);
                        }
                    });
                });
        };

        /**
         * show or reposition boxes
         * @param my_top {String}
         */
        this.introduce = function (my_top) {
            this.busy = true;
            this.$box
                .animate({
                    top: my_top || '53px'
                }, 300, function () {
                    box.busy = false;
                    if (undo.box_queue.length) {
                        var nxt_box = undo.box_queue.pop();
                        undo.launchNew(nxt_box.msg, nxt_box.ids);
                    }
                });
        };

        /**
         * remove box, reposition those above and delete from -undo.boxes-
         */
        this.boot = function () {
            var active_boxes = undo.boxes.compacted()
                , offset = -this.$box.outerHeight() - undo.pad;

            // move other boxes up if they are below the one that got booted
            for (var i = 0; i < active_boxes.length; i++) {
                var b = active_boxes[i];
                if (b.index < this.index) {
                    b.introduce(parseInt(b.$box.css('top').replace('px', '')) + offset + 'px');
                }
            }

            delete undo.boxes[box.index];
            this.$box.hide(300, function () {
                box.$box.remove();
            });
        };

        this.init();
    }
}