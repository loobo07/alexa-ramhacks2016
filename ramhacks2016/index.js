'use strict';

var jquery = require('jquery');
var http = require('http');
var Alexa = require('alexa-sdk');
/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var relativeWeather = ["cold", "chilly", "cool", "warm", "hot"];
var apiStr = "";
var CARD_TITLE = "Forecast";

function getTemp(city) {
    //var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=b280819425992bbd289902c6fbf2ce55";
    var options = {
        host : 'http://api.openweathermap.org',
        path : '/data/2.5/weather?q='+city+'&APPID=b280819425992bbd289902c6fbf2ce55',
        method : 'GET'
    }

    var request = http.request(options, function(response){
        response.on('data', function(data) {
        apiStr = data.main.temp;
    });
    response.on('end', function() {});
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
  request.end();

  return apiStr;
}

function getDescription(temp) {
    switch(true){
        case temp < 277 :
            return relativeWeather[0];
        case temp < 289 :
            return relativeWeather[1];
        case temp < 294 :
            return relativeWeather[2];
        case temp < 305 :
            return relativeWeather[3];
        default:
            return relativeWeather[4];
    }
}
function getResponse() {
    var kelvin = getTemp("Richmond");
    var desc = getDescription(parseInt(kelvin)) 
    var speechOutput = "The weather is " + desc;
    return speechOutput;
}

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = function(event, context, callback){
	if (event.request.type === "IntentRequest") {
		onIntent(event.request, event.session,
			function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
	}
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function onIntent(intentRequest, session, callback){
    var intent = intentRequest.intent.slot.City.value;
	if ("AMAZON.US_CITY".includes(intent)){
        this.emit(':tell', getResponse(intent));
    } else {
        this.emit('SayForcast');
    } 
}