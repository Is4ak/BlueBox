
// You need a Particle object to call the API. Make sure your html file loads the js file for the API.
var particle = new Particle();

// Global variables
var accessToken;
var deviceId;
var relay1On = false;
var relay2On =false;
var relay3On= false;
var relay4On =false;
var zumbadorOn=false;
$(document).ready(function() {
	initPage();
});


function initPage() {
	// Hook up handlers using jquery
	$('#logoutButton').on('click', logoutButtonHandler);
	//Relays
	$('#Relevador1on').on('click', relevador1Handler);
	$('#Relevador1off').on('click', relevador1Handler);
	$('#Relevador2on').on('click', relevador2Handler);
	$('#Relevador2off').on('click', relevador2Handler);
	$('#Relevador3on').on('click', relevador3Handler);
	$('#Relevador3off').on('click', relevador3Handler);
	$('#Relevador4on').on('click', relevador4Handler);
	$('#Relevador4off').on('click', relevador4Handler);
	// Buzzer
	$('#Zumbadoron').on('click', zumbadorHandler);
	$('#Zumbadoroff').on('click', zumbadorHandler);
	
	
	
	// Read the access token from a browser cookie, if we can. This uses js-cookie.js, which is much
	// easier than coding for each browser quirk you might encounter.
	
	// Note: We don't store the actual username and password, but the access token that has a limited
	// lifetime and is less sensitive. You may not even want to save the accessToken at all, but for
	// this test program it's helpful because it eliminates the need to type in your username and 
	// password every time you reload the page.
	accessToken = Cookies.get('accessToken');
	deviceId = Cookies.get('lastDeviceId');
	if (accessToken == undefined || accessToken == '') {
		// Show messages
		$('#headDiv').show();
		$('#headDiv2').show();
		$('#appDiv2').hide();
		$('#appDiv3').hide();
	}
	else {
		// We have an access token, so show the main page. Note that the access token
		// may be expired, but we'll only find that out the first time we try to use it, when
		// we update the device list.
		$('#headDiv').hide();
		$('#headDiv2').hide();
		$('#appDiv3').show();
		if (deviceId == undefined || deviceId == ''){
		 $('#appDiv2').hide();
		  $('#headDiv3').show();
		}
		else {$('#appDiv2').show();
		 $('#headDiv3').hide();	
		  particle.getEventStream({ deviceId: deviceId, name: 'Alarm', auth: accessToken }).then(function(stream) {
			stream.on('event', eventHandler);
		});
		
		 checkDevConnected();
		 updateLedDisplay();
		
		 }
	}
}
function checkDevConnected(){
	particle.getEventStream({ deviceId:deviceId, auth: accessToken }).then(function(stream) {
  stream.on('event', function(data) {
    console.log("Event: ", data);
  });
});
	var devicesPr = particle.getDevice({ deviceId:deviceId, auth: accessToken });

devicesPr.then(
  function(data){
    console.log('Device attrs retrieved successfully:(if trying to control and this appears you probably have the wrong app on device)', data);
	if (data.body.connected) {
	 $('#appDiv2').show();
	$('#headDiv4').hide();	}
	else {
	$('#appDiv2').hide();
     $('#headDiv4').show();
	}
  },
  function(err) {
    console.log('API call failed: ', err);
	$('#appDiv2').hide();
    $('#headDiv2').show();
  }
);
}
/*particle.getVariable({ deviceId: deviceId, name: 'luz', auth: accessToken }).then(function(data) {
		console.log('Device variable retrieved successfully:', data);
		$('#queryingDiv').hide();
		$('#appDiv').show();
		//$('#appDiv2').show();
		$('#headDiv3').hide();
		hasSelectedDevice=true;

		relay1On = (data.body.result != 0);
		updateLedDisplay();
		
		// We were able to get the "led" variable, so we probably have the right firmware running.
		// Subscribe to the led event stream so we will be notified when the status changes.
		particle.getEventStream({ deviceId: deviceId, name: 'Alarm', auth: accessToken }).then(function(stream) {
			stream.on('event', ledEventHandler);
		});
	}, function(err) {
		// We try to get the "led" variable. If this causes an error, then the selected device probably
		// isn't running our code. Show the error message in wrongApiDiv.
		console.log('failure trying to get led variable ', err);
		$('#queryingDiv').hide();
		if (err.statusCode == 404) {
			$('#wrongApiDiv').show();
		}
		else {
			// Device did not respond is 408 but in this test code we just show that message for all errors
			$('#deviceNotAvailableDiv').show();			
		}
	});*/




// Called when a "led" event is sent by the Photon. We subscribe to this in deviceSelectChange.
function eventHandler(data) {
    console.log("eventHandler: ", data);
	//var cadena= data;
	//$(".events").append(document.write('nuevo evento recibido: '+events()));
	//if (data.coreid != deviceId) {
		// This happens if you switch devices, because I'm not actually sure how to stop getting a device stream
	//	return;
	//}
	//relay1On = (data.data == '1');
	//updateLedDisplay();
}

// Shows the appropriate string based on the value on relay1On (true/false)
function updateLedDisplay() {
	if (relay1On) {
		$('#relay1ondiv').show();
		$('#relay1offdiv').hide();
	}
	else {
		$('#relay1ondiv').hide();		
		$('#relay1offdiv').show();		
	}
	if (relay2On) {
		$('#relay2ondiv').show();
		$('#relay2offdiv').hide();
	}
	else {
		$('#relay2ondiv').hide();		
		$('#relay2offdiv').show();		
	}
	if (relay3On) {
		$('#relay3ondiv').show();
		$('#relay3offdiv').hide();
	}
	else {
		$('#relay3ondiv').hide();		
		$('#relay3offdiv').show();		
	}
	if (relay4On) {
		$('#relay4ondiv').show();
		$('#relay4offdiv').hide();
	}
	else {
		$('#relay4ondiv').hide();		
		$('#relay4offdiv').show();		
	}
	if (zumbadorOn) {
		$('#zumbadorondiv').show();
		$('#zumbadoroffdiv').hide();
	}
	else {
		$('#zumbadorondiv').hide();		
		$('#zumbadoroffdiv').show();		
	}
	
}

// This is called when the Toggle LED button is clicked. 
function relevador1Handler() {
	
	// The setled Particle cloud function takes a string of the state to set, either "1" or "0"
	var arg = (relay1On? "off1" : "on1");
	
	particle.callFunction({ deviceId:deviceId, name: 'Relays', argument: arg, auth: accessToken }).then(
		function(data) {
			console.log('relaySet success ', data);
           	relay1On = !relay1On;
	        updateLedDisplay();
		}, function(err) {
			console.log('relaySet error checking if dev connected', err);
			checkDevConnected()
		});

	
}
function relevador2Handler() {
	
	
	
	// The setled Particle cloud function takes a string of the state to set, either "1" or "0"
	var arg = (relay2On ? "off2" : "on2");
	
	particle.callFunction({ deviceId:deviceId, name: 'Relays', argument: arg, auth: accessToken }).then(
		function(data) {
			console.log('relaySet success ', data);
			relay2On = !relay2On;
	        updateLedDisplay();
		}, function(err) {
			console.log('relaySet error checking if dev connected', err);
			checkDevConnected();
		});

	
}
function relevador3Handler() {
	
	
    
	// The setled Particle cloud function takes a string of the state to set, either "1" or "0"
	var arg = (relay3On ? "off3" : "on3");
	
	particle.callFunction({ deviceId:deviceId, name: 'Relays', argument: arg, auth: accessToken }).then(
		function(data) {
			console.log('relaySet success ', data);
			relay3On = !relay3On;
	        updateLedDisplay();
		}, function(err) {
			console.log('relaySet error checking if dev connected', err);
			checkDevConnected();//si esta conectado es probable que no tenga el codigo correcto el dispositivo photon
		});

	
}
function relevador4Handler() {
	
	
	
	// The setled Particle cloud function takes a string of the state to set, either "1" or "0"
	var arg = (relay4On ? "off4" : "on4");
	
	particle.callFunction({ deviceId:deviceId, name: 'Relays', argument: arg, auth: accessToken }).then(
		function(data) {
			console.log('relaySet success ', data);
			relay4On = !relay4On;
	updateLedDisplay();
		}, function(err) {
			console.log('relaySet error checking if dev connected', err);
			checkDevConnected();
		});

	
}

function zumbadorHandler() {
	

	// The setled Particle cloud function takes a string of the state to set, either "1" or "0"
	var arg = (zumbadorOn ? "off" : "on");
	
	particle.callFunction({ deviceId:deviceId, name: 'zumbador', argument: arg, auth: accessToken }).then(
		function(data) {
			console.log('soundSet success ', data);
			zumbadorOn = !zumbadorOn;
			updateLedDisplay();
		}, function(err) {
			console.log('soundSet error checking if dev connected ', err);
			checkDevConnected();
			
		});

	
}
// This handles the logout button. Show the login screen and also remove our cookies.
function logoutButtonHandler() {
	$('#mainDiv').hide();
	$('#loginDiv').show();
	$('#loginDiv2').show();
	$('#headDiv').show();
	$('#headDiv2').show();
	$('#appDiv3').hide();
	accessToken = '';
	Cookies.remove('accessToken');	
	Cookies.remove('lastDeviceId');	

}

// This happens when our access token expires. Display the login screen, and API failure message, and 
// remove the access token cookie. Leave the selected device ID cookie, since the token probably just
// expired.
function accessTokenErrorHandler() {
	$('#mainDiv').hide();
	$('#loginDiv').show();
	$('#loginDiv2').show();
	$('#headDiv').show();
	$('#headDiv2').show();
	$('#apiFailureDiv').show();
	$('#appDiv3').hide();
	accessToken = '';
	Cookies.remove('accessToken');
}


