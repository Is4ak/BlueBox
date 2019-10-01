
// You need a Particle object to call the API. Make sure your html file loads the js file for the API.
var particle = new Particle();

// Global variables
var accessToken;
var deviceId;
var DHT22;
var gif1,gif2,gif3,gif4,gif5;
var relay1On = false;
var relay2On =false;
var relay3On= false;
var relay4On =false;
var zumbadorOn=false;
var fuego,luz,gas,ventana,presencia,puerta,temperatura;
accessToken = Cookies.get('accessToken');
	deviceId = Cookies.get('lastDeviceId');
$(document).ready(function() {
	initPage();
});


function initPage() {
   gif1 = SuperGif({ gif: document.getElementById('relay1gif'), progressbar_height:1, max_width:180  } );
   gif1.load( );
   gif2 = new SuperGif({ gif: document.getElementById('relay2gif'), progressbar_height:1, max_width:180} );
   gif2.load( );
   gif3 = SuperGif({ gif: document.getElementById('relay3gif'), progressbar_height:1, max_width:180 } );
   gif3.load( );
   gif4 = SuperGif({ gif: document.getElementById('relay4gif'), progressbar_height:1, max_width:190 } );
   gif4.load( );
   gif5 = SuperGif({ gif: document.getElementById('buzzergif'), progressbar_height:1, max_width:150 } );
   gif5.load( );
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
		else { $('#appDiv2').show();
		 $('#headDiv3').hide();	
         checkDevConnected();
		 particle.getVariable({ deviceId:deviceId, name: 'temp-C', auth: accessToken }).then(function(data) {
			 console.log('Device variable retrieved successfully:', data);
			  
			 temperatura=data.body.result;
             checkVarStatus();
            
 			 particle.getEventStream({ deviceId:deviceId, auth: accessToken }).then(function (stream) {
			 stream.on('event', function(event) {
			  //console.log("Event: ", event);
			  $("#events").append("<br><b>Nuevo evento publicado:</b>  " + event.name +": "+ event.data + " <b>con fecha:</b> "+event.published_at );
			  eventHandler(event);
			  });
		       },
		      function(err){
			  console.log("failed to get event",err);
		      });
			
		  }, function(err) {
			console.log('An error occurred while getting attrs:', err);
			$('#appDiv2').hide();
			$('#headDiv5').Show();	
		  });

		
		 
		 updateLedDisplay();
		
		 }
	}
		
	
   
}


function checkDevConnected(){
	
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

function checkVarStatus(){
	particle.getVariable({ deviceId:deviceId, name: 'Relevador1', auth: accessToken }).then(function(data) {
		console.log('Device variable relevador1 retrieved successfully:', data);
        relay1On = (data.body.result == 0);
		updateLedDisplay();
	  }, function(err) {
		console.log('An error occurred while getting attrs relevador 1:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Relevador2', auth: accessToken }).then(function(data) {
		console.log('Device variable relevador2 retrieved successfully:', data);
        relay2On = (data.body.result == 0);
		updateLedDisplay();
	  }, function(err) {
		console.log('An error occurred while getting attrs relevador 2:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Relevador3', auth: accessToken }).then(function(data) {
		console.log('Device variable relevador3 retrieved successfully:', data);
        relay3On = (data.body.result == 0);
		updateLedDisplay();
	  }, function(err) {
		console.log('An error occurred while getting attrs relevador 3:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Relevador4', auth: accessToken }).then(function(data) {
		console.log('Device variable relevador4 retrieved successfully:', data);
        relay4On = (data.body.result == 0);
		updateLedDisplay();
	  }, function(err) {
		console.log('An error occurred while getting attrs relevador 4:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Fuego', auth: accessToken }).then(function(data) {
		console.log('Device variable fuego retrieved successfully:', data);
		if (data.body.result == 1){
			$('#fuegoD').show();
			$('#fuegoL').hide();
		}
		else if (data.body.result==0){
			$('#fuegoL').show();
			$('#fuegoD').hide();
		}
	
	  }, function(err) {
		console.log('An error occurred while getting attrs fuego:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Gas', auth: accessToken }).then(function(data) {
		console.log('Device variable Gas retrieved successfully:', data);
		if (data.body.result == 1){
			$('#gasD').show();
			$('#gasL').hide();
		}
		else if (data.body.result==0){
			$('#gasL').show();
			$('#gasD').hide();
		}
	
	  }, function(err) {
		console.log('An error occurred while getting attrs gas:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Ventana', auth: accessToken }).then(function(data) {
		console.log('Device variable ventana retrieved successfully:', data);
		if (data.body.result == 1){
			$('#ventanaA').show();
			$('#ventanaC').hide();
		}
		else if (data.body.result==0){
			$('#ventanaC').show();
			$('#ventanaA').hide();
		}
	
	  }, function(err) {
		console.log('An error occurred while getting attrs ventana:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'presencia', auth: accessToken }).then(function(data) {
		console.log('Device variable presencia retrieved successfully:', data);
		if (data.body.result == 1){
			$('#presenciaD').show();
			$('#presenciaL').hide();
		}
		else if (data.body.result==0){
			$('#presenciaL').show();
			$('#presenciaD').hide();
		}
	
	  }, function(err) {
		console.log('An error occurred while getting attrs presencia:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Puerta', auth: accessToken }).then(function(data) {
		console.log('Device variable puerta retrieved successfully:', data);
		if (data.body.result == 1){
			$('#puertaA').show();
			$('#puertaC').hide();
		}
		else if (data.body.result==0){
			$('#puertaC').show();
			$('#puertaA').hide();
		}
	
	  }, function(err) {
		console.log('An error occurred while getting attrs puerta:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Zumbador', auth: accessToken }).then(function(data) {
		console.log('Device variable zumbador retrieved successfully:', data);
		zumbadorOn = (data.body.result == 1);
		updateLedDisplay();

	  }, function(err) {
		console.log('An error occurred while getting attrs zumbador:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'luz', auth: accessToken }).then(function(data) {
		console.log('Device variable luz retrieved successfully:', data);
		$('#luz').html("<b>Valor LDR:</b> " + data.body.result);
	
	  }, function(err) {
		console.log('An error occurred while getting attrs luminosidad:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'temp-C', auth: accessToken }).then(function(data) {
		console.log('Device variable temperatura retrieved successfully:', data);
		$('#temperatura').html("<b>Temperatura :</b> " + data.body.result + "°C");
	
	  }, function(err) {
		console.log('An error occurred while getting attrs temp:', err);
	  });
	  particle.getVariable({ deviceId:deviceId, name: 'Humedad', auth: accessToken }).then(function(data) {
		console.log('Device variable Humedad retrieved successfully:', data);
		$('#humedad').html("<b>Humedad:</b> " + data.body.result + "%");
	
	  }, function(err) {
		console.log('An error occurred while getting attrs Humedad:', err);
	  });
}

// Called when a "led" event is sent by the Photon. We subscribe to this in deviceSelectChange.
function eventHandler(event) {
	console.log("eventHandler: ", event);
	if (event.name=='Luminosidad'){
		$('#luz').html("<b>Valor LDR:</b> " + event.data);
	}
	else if (event.name=='DHT22'){
		 DHT22 = JSON.parse(event.data);
		$('#temperatura').html("<b>Temperatura :</b> " + DHT22.TempC + "°C <br> <br> Indice de Calor: " + DHT22.HIC + "°C");
		$('#humedad').html("<b>Humedad:</b> " + DHT22.Hum + "% <br> <br> Punto de Rocio: " + DHT22.DPC + "°C");
        console.log('dht22parsed: ',DHT22);
	}
	else if (event.name=='spark/status'&&event.data=='offline'){
		$('#appDiv2').hide();
        $('#headDiv4').show();
	}
switch(event.data){
	case 'Presencia Detectada':
			$('#presenciaD').show();
			$('#presenciaL').hide();
			break;
	case 'Presencia Libre':
			$('#presenciaL').show();
			$('#presenciaD').hide();
			break;
	case 'Fire Detected':
			$('#fuegoD').show();
			$('#fuegoL').hide();
			break;
	case 'Fire Free':
			$('#fuegoL').show();
			$('#fuegoD').hide();
			break;
	case 'Gas Detectado':
			$('#gasD').show();
			$('#gasL').hide();
			break;
	case 'Gas Libre':
			$('#gasL').show();
			$('#gasD').hide();
			break;
	case 'Ventana Abierta':
			$('#ventanaA').show();
			$('#ventanaC').hide();
			break;
	case 'Ventana Cerrada':
			$('#ventanaC').show();
			$('#ventanaA').hide();
			break;
	case 'Door Open':
			$('#puertaA').show();
			$('#puertaC').hide();
			break;
    case 'Door Closed':
			$('#puertaC').show();
			$('#puertaA').hide();
			break;		
			
	default: break;
}


	//var cadena= data;
	//$(".events").append(document.write('nuevo evento recibido: '+events()));
	//if (data.coreid != deviceId) {
		// This happens if you switch devices, because I'm not actually sure how to stop getting a device stream
	//	return;
//	(event.data=='Presencia Detectada'){
//		$('#presenciaD').show();
//		$('#presenciaL').hide();
	//}
	relay1On = (data.data == '1');
	updateLedDisplay();
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
			   if (relay1On) {
				$('#relay1ondiv').show();
				$('#relay1offdiv').hide();
				if(!gif1.get_loading()){
				gif1.play()
				setTimeout(function(){
					gif1.pause();
					gif1.move_to(25);
				 }, 2500); 
				}
			}
			else {
				$('#relay1ondiv').hide();		
				$('#relay1offdiv').show();
				if(!gif1.get_loading()){
				gif1.play();
				setTimeout(function(){
					gif1.pause();
					gif1.move_to(0);
				 }, 2500); 
				}
						
			}
	       
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
	        if (relay2On) {
				$('#relay2ondiv').show();
				$('#relay2offdiv').hide();
				if(!gif2.get_loading()){
					gif2.play();
					setTimeout(function(){
						gif2.pause();
						gif2.move_to(25);
					 }, 2500); 
					}	
			}
			else {
				$('#relay2ondiv').hide();		
				$('#relay2offdiv').show();	
				if(!gif2.get_loading()){
					gif2.play();
					setTimeout(function(){
						gif2.pause();
						gif2.move_to(0);
					 }, 2500); 
					}	
			}
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
			if (relay3On) {
				$('#relay3ondiv').show();
				$('#relay3offdiv').hide();
				if(!gif3.get_loading()){
					gif3.play();
					setTimeout(function(){
						gif3.pause();
						gif3.move_to(25);
					 }, 2500); 
					}
			}
			else {
				$('#relay3ondiv').hide();		
				$('#relay3offdiv').show();	
				if(!gif3.get_loading()){
					gif3.play();
					setTimeout(function(){
						gif3.pause();
						gif3.move_to(0);
					 }, 2500); 
					}	
			}
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
			if (relay4On) {
				$('#relay4ondiv').show();
				$('#relay4offdiv').hide();
				if(!gif4.get_loading()){
					gif4.play();
					setTimeout(function(){
						gif4.pause();
						gif4.move_to(25);
					 }, 2500); 
					}
			}
			else {
				$('#relay4ondiv').hide();		
				$('#relay4offdiv').show();
				if(!gif4.get_loading()){
					gif4.play();
					setTimeout(function(){
						gif4.pause();
						gif4.move_to(0);
					 }, 2500); 
					}		
			}
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
			if (zumbadorOn) {
				$('#zumbadorondiv').show();
				$('#zumbadoroffdiv').hide();
				//gif5.move_relative(1);
				if(!gif5.get_loading()){
					gif5.play();
					setTimeout(function(){
						gif5.pause();
						gif5.move_to(66);
						
					 }, 2800); 
					}
			}
			else {
				$('#zumbadorondiv').hide();		
				$('#zumbadoroffdiv').show();
				if(!gif5.get_loading()){
					gif5.play();
					setTimeout(function(){
						gif5.pause();
						gif5.move_to(0);
					 }, 1000); 
					}		
			}
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