// server.js
// where your node app starts

// init project
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  request = require('request');

app.post('/webhook', (req, res) => {  
 
  let body = req.body;
  let token = "EAACIJ6qCOLMBAJTZBrvwpBEclMB7sNyDgNkRzzE09p5ZC4s4ZC1UA5akc0UbGiVLDWZAtMfUwNA6xfxYfqqILzAoIgZB2eALYgKTKdmein77OYZCcX5bBjfDNA1tWtOPGO1lkAz2bJY4qZBAqENJo1hSqNZC3WrOOXccWJTYKMJSKdklyUpczqrB";
  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    handleMessage(req ,res, token);  
    
  } 
  else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAACIJ6qCOLMBAJTZBrvwpBEclMB7sNyDgNkRzzE09p5ZC4s4ZC1UA5akc0UbGiVLDWZAtMfUwNA6xfxYfqqILzAoIgZB2eALYgKTKdmein77OYZCcX5bBjfDNA1tWtOPGO1lkAz2bJY4qZBAqENJo1hSqNZC3WrOOXccWJTYKMJSKdklyUpczqrB"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];  
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(req,res , token){
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[0]
      // console.log("=> "+ event )

    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      // console.log("=> "+ text )
      if (text === 'Generic'){ 
        console.log("welcome to chatbot")
        sendTextMessage(sender, "Welcome  ",token) 
        continue
      }
      // console.log(text)
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200),token)
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      // sendTextMessage(sender, "Postback received: "+text.substring(0, 200),token)
      continue
    }
  }
}

function sendTextMessage(sender, text, token) {
  let messageData = { text:text }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
};

app.post('/webhook', (req, res) => {  
  res.sendStatus(200).send()
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
