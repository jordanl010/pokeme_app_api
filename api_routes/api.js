'use strict';


//basic dependencies
var express = require('express'),
    router = express.Router(),
    app = express(),
    util = require('../utils/util.js');


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
    var results = util.generateLocationSteps([40.722443, -73.994185], 2, 500)
    console.log(results)
    var nearbyPokemonArr = [];

    //login and begin the search process
    ptc.login(username, password).then(token => {
        console.log("got here")
        client.setAuthInfo('ptc', token);
        return client.init();
    }).then(() => {
        var lat;
        var lng;
        bluebird.each(results, function (result) {
            lat = result[0];
            lng = result[1];
            client.setPosition(lat, lng);
            var cellIDs = pogobuf.Utils.getCellIDs(lat, lng, 5);

            return bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))).then(mapObjects => {
                return mapObjects.map_cells;
            }).each(cell => {
                if (cell.catchable_pokemons.length > 0) {
                    //                    console.log('Cell ' + cell.s2_cell_id.toString());
                    //                    console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
                    return bluebird.resolve(cell.catchable_pokemons).each(catchablePokemon => {
                        //                        console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, catchablePokemon.pokemon_id) + ' is asking you to catch it.'.underline.red);
                        //                        var testPokemon = pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, catchablePokemon.pokemon_id);
                        console.log(catchablePokemon)
                        nearbyPokemonArr.push(catchablePokemon);
                    });
                }
            }).then(function () {
                console.log("cell search done homie")
            });
        }).then(function () {
            res.json({
                data: nearbyPokemonArr
            })
        });
    });
})

//API Route
router.get('/getTest', function (req, res) {
   res.json({
       data:"success"
   })
})
module.exports = router;
