/**
 * Kind of like ruby's 3.times do .. end method
 * usage: (3).timesDo(function() {} );
 *
 * @param callback {function} to be called however many times
 */
Number.prototype.timesDo = function (callback) {
    if (callback) {
        for (var i = 0; i < this; i++) {
            callback.call();
        }
    }
};

String.prototype.squeeze = function () {
    return this.replace(/\s+/g, '');
};

String.prototype.pluralize = function (count) {
    var plural = 's';
    if (count == 1) plural = '';
    return this + plural;

};

//
// Array extensions
//
Array.prototype.compacted = function () {
    var tmp = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i] !== undefined && this[i] !== null && this[i] !== false) {
            tmp.push(this[i]);
        }
    }
    return tmp;
};

Array.prototype.find = function (value) {
    var found = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            found = true;
        }
    }
    return found;
};

Array.prototype.findObject = function (value, key) {
    var found = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == value) {
            found = true;
        }
    }
    return found;
};

Array.prototype.updateObject = function (id, key, value_key, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == value) {
            return this[i][value_key] = value;
        }
    }
};

Array.prototype.findAndRemove = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.findAndRemoveObject = function (value, key) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] && this[i][key] == value) {
            this.splice(i, 1);
        }
    }
};