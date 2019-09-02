
$(document).ready(function() {
	initPage();
});


function initPage() {
	
	accessToken = Cookies.get('accessToken');
	deviceId = Cookies.get('lastDeviceId');
	if (accessToken == undefined || accessToken == '') {
		$('#headDiv').show();
		$('#appDiv3').hide();
	}
	else {
		$('#headDiv').hide();
		$('#appDiv3').show();
	}
}