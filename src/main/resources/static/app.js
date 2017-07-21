var stompClient = null;
var canvas=null;
var context = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
        stompClient.subscribe('/topic/canvas_test', function (json) {
        	drawImageText(json.body);
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function getCurrentPos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}

function sendText(json){
	stompClient.send("/app/canvas",{},json);
}

function defineImage(evt) {
	var currentPos = getCurrentPos(evt);

	for (i = 0; i < document.inputForm.color.length; i++) {
		if (document.inputForm.color[i].checked) {
			var color = document.inputForm.color[i];
			break;
		}
	}

	for (i = 0; i < document.inputForm.shape.length; i++) {
		if (document.inputForm.shape[i].checked) {
			var shape = document.inputForm.shape[i];
			break;
		}
	}
	var json = JSON.stringify({
		"shape" : shape.value,
		"color" : color.value,
		"coords" : {
			"x" : currentPos.x,
			"y" : currentPos.y
		}
	});
	drawImageText(json);
	sendText(json);
}

function drawImageText(image) {
	var json = JSON.parse(image);
	context.fillStyle = json.color;
	switch (json.shape) {
	case "circle":
		context.beginPath();
		context.arc(json.coords.x, json.coords.y, 5, 0, 2 * Math.PI, false);
		context.fill();
		break;
	case "square":
	default:
		context.fillRect(json.coords.x, json.coords.y, 10, 10);
		break;
	}
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("click", defineImage, false);
    connect();
});

