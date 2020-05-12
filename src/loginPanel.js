$(document).ready(function () {
	app.init();
});

const wrongColor = 'linear-gradient(0deg, rgba(226,44,44,0.2079439252336449) 0%, rgba(163,103,103,0) 63%)';
const app = {
	kwick_api_url: 'http://greenvelvet.alwaysdata.net/kwick/api/',
	init: function () {
		console.log('Kwick app is ready to rock !');
	},
	// SIGN UP FUNCTION 
	signUp: function (user, pswd) {
		// check
		const toCheck = ['#su_login', '#su_pass', '#su_pass1'];
		let wrongInputs = false;
		for (let i = 0; i < toCheck.length; i++) {
			if ($(toCheck[i]).val() == "") {
				$(toCheck[i]).css('background', wrongColor);
				wrongInputs = true;
			}
		}
		if (wrongInputs) return
		$.ajax({
			url: `${app.kwick_api_url}signup/${user}/${pswd}`,
			dataType: 'jsonp',
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			success: function (result, status, xhr) {
				if (result.result.status == 'failure') {
					$('#su_login').css('background', wrongColor);
					$('#su_login').val('');
					$('#su_pass').val('');
					$('#su_pass1').val('');
					$(".txtb input").removeClass('focus')
				} else {
					console.log(result)
					localStorage.setItem('token', result.result.token);
					localStorage.setItem('id', result.result.id);
					$('#su_login').val('');
					$('#su_pass').val('');
					$('#su_pass1').val('');
					$(".txtb input").removeClass('focus')
					alert(`${user} est bien inscrit ! `)
					window.location = 'index.html';
				}
			},
			error: function (xhr, status, error) {
				alert('Error');
			}
		});

	},
	signIn: function (user, pswd) {
		// check
		const toCheck = ['#si_login', '#si_pass'];
		let wrongInputs = false;
		for (let i = 0; i < toCheck.length; i++) {
			if ($(toCheck[i]).val() == "") {
				$(toCheck[i]).css('background', wrongColor);
				wrongInputs = true;
			}
		}
		if (wrongInputs) return
		$.ajax({
			url: `${app.kwick_api_url}login/${user}/${pswd}`,
			dataType: 'jsonp',
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			success: function (result, status, xhr) {
				if (result.result.status == 'failure') {
					const toWrong = ['#si_login', '#si_pass'];
					for (let i = 0; i < toWrong.length; i++) {
						$(toWrong[i]).css('background', wrongColor);
						$(toWrong[i]).val('');
					}
					$(".txtb input").removeClass('focus')

				} else {
					localStorage.setItem('token', result.result.token);
					localStorage.setItem('id', result.result.id);
					localStorage.setItem('username', user);
					window.location = "chat.html";
				}
			},
			error: function (xhr, status, error) {
				alert('Error');
			}
		});

	}
};
$(".bt_su").click(function(){
	$('.login-form').css('display','block')
	$('.signup-form').css('display','none')
	$('.inputs').css('background','none')

});
$(".bottom-txt a").click(function () {
	$('.login-form').css('display','none')
	$('.signup-form').css('display','block')
	$('.inputs').css('background','none')
});

$('.txtb input').on('focus', function () {
	$(this).addClass('focus')
});

$('.txtb input').on('blur', function () {
	if ($(this).val() == "") {
		$(this).removeClass('focus')
	}
});


$("#si_btn").click(function () {
	let login = $("#si_login").val();
	pass1 = $("#si_pass").val();
	app.signIn(login, pass1);
});

$("#su_btn").click(function () {
	let login = $("#su_login").val();
	pass1 = $("#su_pass").val();
	pass2 = $("#su_pass1").val();
	if (pass1 == pass2) {
		app.signUp(login, pass1);
	} else {
		const toWrong = ['#su_pass', '#su_pass1'];
		for (let i = 0; i < toWrong.length; i++) {
			$(toWrong[i]).css('background', wrongColor);
			$(toWrong[i]).val('');
		}
	}

});