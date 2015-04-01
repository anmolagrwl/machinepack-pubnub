module.exports = {
  friendlyName: 'Publish message',
  description: 'Publish a message through HTTP GET',
  extendedDescription: '',
  inputs: {
    pubKey: {
      example: 'demo',
      description: 'Publish key from your PubNub account',
      required: true
    },
    subKey: {
      example: 'demo',
      description: 'Subscribe key from your PubNub account',
      required: true
    },
    signature: {
      example: '0',
      description: 'Signature',
      required: true
    },
    channel: {
      example: 'hello_world',
      description: 'Channel to which you want to publish the messages',
      required: true
    },
    callback: {
      example: '0',
      description: 'Callback',
      required: true
    },
    message: {
      example: 'demo',
      description: 'Message you want to send to your channel',
      required: true
    },
  },
  defaultExit: 'success',
  exits: {
     error: {
        description: 'Unexpected error occurred.'
      },
      wrongOrNoKey: {
        description: 'Invalid or unprovided API key. All calls must have a key.'
      },
      success: {
        description: 'Returns a JSON object of message sent',
        example: '[1,"Sent","14279165931593790"]'
      }
  },

  fn: function (inputs,exits) {

    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'http://pubsub.pubnub.com/publish/' + inputs.pubKey + '/' + inputs.subKey + '/' + inputs.signature + '/' + inputs.channel + '/' + inputs.callback + '/"' + inputs.message + '"',
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
