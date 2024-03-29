const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependecies = [
    ['_', 'lodash'],
    ['passport', 'passport'],
    ['Users', './models/user'],
    ['validator', 'express-validator'],
    ['formidable', 'formidable'],
    ['async', 'async'],
    ['group', './models/groups'],
    ['aws', './helpers/AWSUpload'],
    ['Message','./models/message'],
    ['Groupmex','./models/groupmex']


];

simpleDependecies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    })
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function () {
    return container;
});

module.exports = container;
















