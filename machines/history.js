module.exports = {
  friendlyName: 'History',
  description: 'Load publish history of a channel through GET method',
  extendedDescription: '',
  inputs: {
    subKey: {
      example: 'demo',
      description: 'Subscribe key from your PubNub account',
      required: true
    },
    channel: {
      example: 'hello_world',
      description: 'Channel to which you want to subscribe messages from',
      required: true
    },
    callback: {
      example: '0',
      description: 'Callback',
      required: true
    },
    limit: {
      example: '10',
      description: 'Limit',
      required: true
    },
  },
  defaultExit: 'success',
  
  exits: {
    error: {
      description: 'Unexpected error occurred.',
    },
    success: {
      description: 'Done.',
    },
  },
  
  fn: function (inputs,exits) {
    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'http://pubsub.pubnub.com/history/' + inputs.subKey + '/' + inputs.channel + '/' + inputs.callback + '/' + inputs.limit ,
      url: '',
      method: 'get',
    }).exec({
      // OK.
      success: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.success(responseBody.id);

      },
      // Non-2xx status code returned from server
      notOk: function(result) {

        try {
          if (result.status === 403) {
            return exits.wrongOrNoKey("Invalid or unprovided API key. All calls must have a key.");
          }
        } catch (e) {
          return exits.error(e);
        }

      },
      // An unexpected error occurred.
      error: function(err) {
        exits.error(err);
      },
    });
  },
};
