'use strict';
//
//basic dependencies
var express = require('express'),
    router = express.Router(),
    app = express(),
    _ = require('lodash'),
    https = require('https'),
    pogobuf = require('../utils/pogobuf/pogobuf/pogobuf.js'),
    POGOProtos = require('node-pogo-protos'),
    bluebird = require('bluebird'),
    Long = require('long'),
    util = require('../utils/util.js'),
    colors = require('colors');
//
//pogo buf information
const username = 'bighomie12345';
const password = 'abcde12345';
const ptc = new pogobuf.PTCLogin(),
    client = new pogobuf.Client();
//API Route
router.get('/getPokemon', function (req, res) {
    var results = util.generateLocationSteps([40.761201, -73.950971], 3, 800)
    console.log(results)
    ptc.login(username, password).then(token => {
        client.setAuthInfo('ptc', token);
        return client.init();
    }).then(() => {
        var lat;
        var lng;
        bluebird.each(results, function (result) {
            lat = result[0];
            lng = result[1]
            client.setPosition(lat, lng);
            var cellIDs = pogobuf.Utils.getCellIDs(lat, lng, 5);
            return bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))).then(mapObjects => {
                return mapObjects.map_cells;
            }).each(cell => {
                //var nearbyPokemonArr = [];
                if (cell.catchable_pokemons.length > 0) {
                    console.log('Cell ' + cell.s2_cell_id.toString());
                    console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
                    return bluebird.resolve(cell.catchable_pokemons).each(catchablePokemon => {
                        console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, catchablePokemon.pokemon_id) + ' is asking you to catch it.'.underline.red);
                        var testPokemon = pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, 19);
                        //nearbyPokemonArr.push(testPokemon);
                    }).then(function () {
                        //return nearbyPokemonArr;
                    });
                } else {
                    console.log("no pokemon")
                }
            }).then(function (nearbyPokemonArr) {
                console.log("cell search done homie")
                return nearbyPokemonArr;
            });
        }).then(function (nearbyPokemonArr) {
            console.log(nearbyPokemonArr)
            console.log("okay, seriously, now im done")
        });
    });
})
module.exports = router;
