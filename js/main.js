// set first focus to text field
$('#focus').focus();

// history array
var historyArray = [];

// rows
var row = 0;

// createCookie function from stackoverflow
function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/; Secure";
}

// getCookie function from stackoverflow
function readCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
}

// eraseCookie function from stackoverflow
function eraseCookie(name) {
  createCookie(name, "", -1);
}

// "login" to the terminal == set a cookie for 1 year
function login() {
  var lastLogin;
  if ((lastLogin = readCookie('terminal-website-login')) == null) {
    // first login
    $('#login').text("Welcome to terminal-website");
    var exdays = new Date();
    exdays.setTime(exdays.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + exdays.toUTCString();
    createCookie('terminal-website-login', new Date(), expires);
  } else {
    $('#login').text("Last login: " + lastLogin + " on tty1");
    eraseCookie('terminal-website-login');
    var exdays = new Date();
    exdays.setTime(exdays.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + exdays.toUTCString();
    createCookie('terminal-website-login', new Date(), expires);
  }
}

// onclick into container get focus to text field
$('.container').on('click', function(e) {
  $('#focus').focus();
  $('html, body').animate({scrollTop: $("#focus").offset().top}, 500);
});

// get user input on enter
function formSubmit() {
  var cmd = $('#focus').val().toLowerCase();
  historyArray.push(cmd); // add to the front
  stdout(cmd);
  row++;
}

// switch commands
function stdout(cmd) {
  var clear = false;
  // no command
  if (cmd === "" || cmd === '' || cmd === null)
    var message = "Please insert a command";
  // help command
  else if (cmd == 'help'){
    var message = "Available commands:<span style=\"white-space: pre-line\">\n</span>";
    message += "- repos username<span style=\"white-space: pre-line\">\n</span>";
    message += "- help<span style=\"white-space: pre-line\">\n</span>";
    message += "- clear<span style=\"white-space: pre-line\">\n</span>";
    message += "- history";
  }
  // clear command
  else if (cmd == 'clear') {
    clear = true;
    $('.terminal').empty();
    // create new input form
    $('.terminal').append('<div id="row0" class="row"><p class="input-text">visitor@guests:~$</p><form class="term-form" id="remove" onsubmit="formSubmit()"><input type="text" id="focus" class="term-input" autocomplete="off"></form></div>');
    // scroll the page for new output
    $('html, body').animate({scrollTop: $("#focus").offset().top}, 500);
    // cancel input text field content
    $('#focus').val('');
    // reactivate the focus
    $('#focus').focus();
    row = -1; // it will be immadiately increased
  }
  // history command
  else if (cmd == 'history')
    var message = historyArray.join('<span style=\"white-space: pre-line\">\n</span>');
  // repos command
  else if (/^repos (\w)+$/.test(cmd)) {
    var username = cmd.split(' ')[1];
    var url = "https://api.github.com/users/" + username + "/repos";
    var message = "";
    var xmlhttp;
    if (window.XMLHttpRequest)
      xmlhttp = new XMLHttpRequest(); //code for IE7,firefox chrome and above
    else
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'); //code for Internet Explorer
    xmlhttp.open("GET", url, false); //false makes the request synchronous
    xmlhttp.send(null);
    if (xmlhttp.status === 200) {
      var data = JSON.parse(xmlhttp.responseText);
      var i;
      for (i = 0; i < data.length; i++) {
        message += '<a href="' + data[i].html_url + '">' + data[i].name + '</a>';
        message += ' (' + data[i].language + '): ';
        message += data[i].description;
        message += '<br>';
      }
    }
  } else if (cmd.includes("repos")) {
    var message = "Invalid syntax: repos username";
  }
  // command not found
  else
    var message = "Sorry, command \"" + cmd + "\" not found";

  if (!clear) {
    // remove form obj
    $('#remove').remove();

    // create input p with cmd text
    $('#row' + row).append('<p class="term-input">' + cmd + '</p>');

    // add output message
    $('.terminal').append('<p>' + message + '</p>');

    // create new input form
    $('.terminal').append('<div id="row' + (row + 1) + '" class="row"><p class="input-text">visitor@guests:~$</p><form class="term-form" id="remove" onsubmit="formSubmit()"><input type="text" id="focus" class="term-input" autocomplete="off"></form></div>');

    // scroll the page for new output
    $('html, body').animate({scrollTop: $("#focus").offset().top}, 500);

    // cancel input text field content
    $('#focus').val('');

    // reactivate the focus
    $('#focus').focus();
  }
}
