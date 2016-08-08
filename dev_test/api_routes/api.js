'use strict';


//basic dependencies
var express = require('express'),
    router = express.Router(),
    app = express(),
    util = require('../utils/util.js'),
    colors = require('colors');


//pogo buf information
const username = 'bighomie12345';
const password = 'abcde12345';

//pogobuf and pogobuf dependencies
const pogobuf = require('pogobuf'),
    POGOProtos = require('node-pogo-protos'),
    bluebird = require('bluebird'),
    Long = require('long');

//create pogobuf instances
const ptc = new pogobuf.PTCLogin(),
    client = new pogobuf.Client();


//API Route
router.get('/getPokemon', function (req, res) {
    //generate an array of coordinates to simulate you searching for pokemon all around you instead of your standing still locaiton
    var results = util.generateLocationSteps([40.722443, -73.994185], 3, 800)

    //login and begin the search process
    ptc.login(username, password).then(token => {
        client.setAuthInfo('ptc', token);
        client.setPosition(40.722443, -73.994185, 5);
        return client.init();
    }).then(() => {
        console.log('Authenticated, waiting for first map refresh (30s)');
        setInterval(() => {
            var cellIDs = pogobuf.Utils.getCellIDs(40.722443, -73.994185);
            return bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))).then(mapObjects => {
                return mapObjects.map_cells;
            }).each(cell => {
                console.log('Cell ' + cell.s2_cell_id.toString());
                console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
                return bluebird.resolve(cell.catchable_pokemons).each(catchablePokemon => {
                    console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId,
                        catchablePokemon.pokemon_id) + ' is asking you to catch it.');
                });
            });
        }, 30 * 1000);
    });
})
module.exports = router;
