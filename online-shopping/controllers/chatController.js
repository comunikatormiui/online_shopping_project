var socket = io(); 
// When a user submits their text, sent it out via socket.io
function submitfunction()
{
    var from = $('#user').val();
    var message = $('#m').val();
    if(message != '') 
    {
      socket.emit('chatMessage', from, message);
    }
    $('#m').val('').focus();
    return false;
}
// When a user is typing something in the text box, send a notice via socket.io
function notifyTyping()
{ 
    var user = $('#user').val();
    socket.emit('notifyUser', user);
}
// When a message is detected, display it as a list item in the form "User: message"
// Highlight messages sent by user by displaying them in a different color than other messages
socket.on('chatMessage', function(from, msg)
{
      var me = $('#user').val();
      // color is green for your own messages, blue otherwise
      var color = (from == me) ? 'green' : '#009afd';
      // messages from the server should be in a red
      if(from == 'System') 
      {
        color = '#ff0d00'; 
      }
      var from = (from == me) ? 'Me' : from;
      $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
// When a "user is typing" notice is detected, display it
socket.on('notifyUser', function(user)
{
  var me = $('#user').val();
  if(user != me)
  {
    $('#notifyUser').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
});
// If a user doesn't have a profile already, generate one for them
$(document).ready(function(){
      var name = makeid();
      $('#user').val(name);
      socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the chat');
});
// Generate a random ID for a user (a string of 5 lower case letters)
function makeid() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  for( var i=0; i < 5; i++ ) 
  {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
