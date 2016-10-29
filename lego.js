'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

exports.query = function (collection) {
    var newCollection = collection.slice();
    var query = [].slice.call(arguments, 1);
    query.sort(compareFunctions);

    for (var index = 0; index < query.length; index++) {
        newCollection = query[index](newCollection);
    }

    return newCollection;
};

function compareFunctions(first, second) {
    var priority = ['format', 'limit', 'select', 'sortBy', 'filterIn', 'or', 'and'];

    return priority.indexOf(first.name) < priority.indexOf(second.name);
}

function filterItem(item, fields) {
    var keys = Object.keys(item);
    var newItem = {};
    keys.forEach(function (key) {
        if (fields.indexOf(key) !== -1) {
            newItem[key] = item[key];
        }
    });

    return newItem;
}

exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        var newCollection = collection.slice();

        return newCollection.map(function (item) {

            return filterItem(item, fields);
        });
    };
};

function isHasValue(item, property, values) {
    for (var index = 0; index < values.length; index++) {
        if (item[property] === values[index]) {
            return true;
        }
    }

    return false;
}

exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        var newCollection = collection.slice();

        return newCollection.filter(function (item) {

            return isHasValue(item, property, values);
        });
    };
};

exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        var newCollection = collection.slice();
        var compareElements = function (firstItem, secondItem) {
            if (firstItem[property] > secondItem[property]) {
                return 1;
            }
            if (firstItem[property] < secondItem[property]) {
                return -1;
            }
        };
        newCollection.sort(compareElements);
        if (order === 'desc') {
            newCollection.reverse();
        }

        return newCollection;
    };
};

exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        var newCollection = collection.slice();
        newCollection.forEach(function (item) {
            item[property] = formatter(item[property]);
        });

        return newCollection;
    };
};

exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {
    exports.or = function () {
        var filters = [].slice.call(arguments);

        return function or(collection) {
            var newCollection = collection.slice();

            return newCollection.filter(function (item) {
                return filters.some(function (filter) {
                    return filter(newCollection).indexOf(item) >= 0;
                });
            });
        };
    };

    exports.and = function () {
        var filters = [].slice.call(arguments);

        return function and(collection) {
            var newCollection = collection.slice();
            filters.forEach(function (filter) {
                newCollection = filter(newCollection);
            });

            return newCollection;
        };
    };
}
