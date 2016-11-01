'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var priority = {
    'format': 0,
    'limit': 0,
    'select': 1,
    'sortBy': 2,
    'or': 3,
    'and': 3,
    'filterIn': 3
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var newCollection = copyCollection(collection);
    var query = [].slice.call(arguments, 1);
    query.sort(compareFunctions);


    return query.reduce(function (changeCollection, func) {

        return func(changeCollection);
    }, newCollection);
};

function copyCollection(collection) {
    return collection.map(function (item) {
        return Object.assign({}, item);
    });
}

function compareFunctions(first, second) {
    return priority[first.name] < priority[second.name] ? 1 : -1;
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

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
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
    return values.some(function (value) {
        return item[property] === value;
    });
}

/**
 * * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        var newCollection = collection.slice();

        return newCollection.filter(function (item) {
            return isHasValue(item, property, values);
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        var newCollection = collection.slice();
        var compareElements = function (firstItem, secondItem) {
            var sortSign = order === 'desc' ? -1 : 1;

            if (firstItem[property] === secondItem[property]) {
                return 0;
            }

            return sortSign * firstItem[property] < secondItem[property] ? -1 : 1;
        };
        newCollection.sort(compareElements);

        return newCollection;
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {

        return collection.map(function (item) {
            item[property] = formatter(item[property]);

            return item;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Ограничение количества элементов в коллекции
     * @param {Number} count – Максимальное количество элементов
     * @returns {Function}
     */
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

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var filters = [].slice.call(arguments);

        return function and(collection) {
            var newCollection = collection.slice();

            return filters.reduce(function (filteredCollection, filter) {
                return filter(filteredCollection);
            }, newCollection);
        };
    };
}
