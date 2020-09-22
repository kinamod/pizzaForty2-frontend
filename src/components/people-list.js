const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { logger } = require('../utils/logger-helper');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listConnectionNames(auth) {
  const service = google.people({version: 'v1', auth});
  service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const connections = res.data.connections;
    if (connections) {
      logger("listConnectionNames",'Connections:');
      connections.forEach((person) => {
        if (person.names && person.names.length > 0) {
          logger("listConnectionNames",person.names[0].displayName);
        } else {
          logger("listConnectionNames",'No display name found for connection.');
        }
      });
    } else {
      logger("listConnectionNames",'No connections found.');
    }
  });
}