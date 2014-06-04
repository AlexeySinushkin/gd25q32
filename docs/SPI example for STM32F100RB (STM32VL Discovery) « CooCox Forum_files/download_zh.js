// JavaScript Document
var currentIndex = '';
var loginFuction = {func:function (){}};
function getLoginForm(){
	$.ajax({
		url: '/order.php?getUserInfo=1&re='+encodeURIComponent(window.location.href),
		type: 'GET',
		dateType:'html',
		cache: false,  
		success: function(json) {
			$('#login_form').html(json);
		}
	});
}
function getDownUrl(downIndex){
	currentIndex = downIndex;
	$.ajax({
		url: '/forum/checklogin.php?menthod=checklogin',
		type: 'GET',
		dataType:'html',
		cache: false,
		beforeSend: function() {
			$('#'+currentIndex).html('<img src="/images/loading_big.gif" width="22" height="22" />');
		},	
		complete: function() {
			$('#'+currentIndex).html('');
		},
		success: function(json) {
			if(json != 1){
				$.blockUI({ message: $('#login_box') }); 
				$('.close').bind('click',function(){
					$.unblockUI();
					document.getElementById('callAjaxForm').reset();
					document.getElementById('callAjaxForm1').reset();
					$('#notification1').html(''); 
				}); 
			}else{
				getUrl();
			}
		}
	});			
}

function getUrl(){
	$.ajax({
		url: '/forum/getDownloadUrl.php?language=en&downIndex=' + currentIndex,
		type: 'GET',
		dataType:'html',
		cache: false,  
		success: function(json) {
			if(json){
				location.href = json;
			}
		}
	});
	//location.href = '/app/download.php?downIndex=' + currentIndex;
}

function onFormSubmit(){
	var remember = 0;
	if($("#remember").attr('checked') == true){
		remember = 1;
	}
	var formData = "&user_login=" + Trim($("#user_login").val()) + "&password=" + Trim($("#password").val())+ "&remember=" + remember;
	$.ajax({  
		type:"GET",  
		url:"/forum/checklogin.php?menthod=login"+formData,  
		dataType:"html",  
		data:"&time="+new Date(),  
		beforeSend: function() {
			$('.wait').show();
		},	
		complete: function() {
			$('.wait').hide();
		},
		success:function(msg) {
			if(msg == 1){
				getLoginForm();
				$.unblockUI();
				loginFuction.func();
				if(currentIndex){
					getUrl();
				}
			}else if(msg == 2){
				getLoginForm();
				$.unblockUI();
				chooseLocation();
			}else{ 
				$('#notification1').html(msg); 
				return false;
			}
		},  
		error:function() {
		}  
	});						  
}

function onRegisterFormSubmit(){
	var emailcheck = $("#callAjaxForm1 input:checked").val();
	var formData = "&emailcheck="+emailcheck+"&list_id="+$("#list_id").val()+"&user_login=" + Trim($("#user_login1").val()) + "&user_email=" + Trim($("#user_email").val()) + "&password=" + Trim($("#password1").val()) + "&edit_auto_add_favorit=1" + "&favorite_notification=1"+ "&password2=" + Trim($("#password2").val())+"&seccodehidden="+$("#seccodehidden").val()+"&seccode="+$("#seccode").val();
	$.ajax({  
		type:"GET",  
		url:"/forum/checklogin.php?menthod=register"+formData,  
		dataType:"html",  
		data:"&time="+new Date(),  
		beforeSend: function() {
			$('.wait').show();
		},	
		complete: function() {
			$('.wait').hide();
		},
		success:function(msg) {
			if(msg == 1){
				$.ajax({  
					type:"GET",  
					url:"/forum/checklogin.php?menthod=login&user_login=" + Trim($("#user_login1").val()) + "&password=" + Trim($("#password1").val())+ "&remember=1",  
					dataType:"html",  
					data:"&time="+new Date(),  
					cache: false,  
					async: false
				});	
				getLoginForm();
				$.unblockUI();
				loginFuction.func();
				if(currentIndex){
					getUrl();
				}
			}else if(msg == 2){
				$.ajax({  
					type:"GET",  
					url:"/forum/checklogin.php?menthod=login&user_login=" + Trim($("#user_login1").val()) + "&password=" + Trim($("#password1").val())+ "&remember=1",  
					dataType:"html",  
					data:"&time="+new Date(),  
					cache: false,  
					async: false
				});	
				getLoginForm();
				$.unblockUI();
				chooseLocation();
			}else{ 
				$('#notification1').html(msg); 
				return false;
			}
		},  
		error:function() {
		}  
	});						  
}

function openRegisterForm(){
	$.blockUI({ message: $('#login_box') }); 
	$('.close').bind('click',function(){
		$.unblockUI();
		document.getElementById('callAjaxForm').reset();
		document.getElementById('callAjaxForm1').reset();
		$('#notification1').html(''); 
	});
}

function checkEmail(){
	var reg = /^[a-zA-Z0-9_|.-]+@[a-zA-Z0-9_|.-]+(\.[a-zA-Z0-9_-]+)+$/;
	var user_email = Trim($('#user_email').val());
	if(user_email == '' || user_email == null || !user_email){
		$('#notification1').html('Email is required!');
	}else if(!user_email.match(reg)){
		$('#notification1').html('Email is not valid!');
	}else{
		$.ajax({  
			type:"GET",  
			url:"/forum/checklogin.php?menthod=checkemail&user_email="+user_email,  
			dataType:"html",  
			data:"&time="+new Date(),  
			success:function(msg) {
				$('#notification1').html(msg); 
			}
		});		
	}
}

function Trim(sText){ 
	return sText.replace(new RegExp("(^[\\s]*)|([\\s]*$)", "g"), ""); 
}

function getLoginHtml(){
	$.ajax({
		url: '/forum/getLoginForm.php?re='+encodeURIComponent(window.location.href),
		type: 'GET',
		dateType:'html',
		cache: false,  
		success: function(json) {
			//alert(document.documentMode);
			//alert(json);
			if(document.documentMode == 10){
				var html = document.getElementById('login_form').innerHTML
				document.getElementById('login_form').innerHTML = html+json;
			}else{
				$('body').append(json);
			}
		}
	});
}

function chooseLocation(){
	$.ajax({
		url: '/forum/location.php', 
		type: 'post',
		data: 'floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			if(document.documentMode == 10){
				var html = document.getElementById('login_form').innerHTML
				document.getElementById('login_form').innerHTML = html+json;
			}else{
				$('body').append(json);
			}
		}
	})
}

//统计下载记录
function setcounts(id,tag) {
	$.ajax({
		url: '/app/setc.php', 
		type: 'post',
		data: 'id='+id,
		dataType: 'html',
		async: false,
		success: function(json) {
			return false;
		}
	})
}

function getcounts(id,tag) {
	$.ajax({
		url: '/app/getc.php', 
		type: 'get',
		data: 'id='+id,
		dataType: 'html',
		success: function(data) {
			$('#'+tag).html(data);
		}
	})
}

$(document).ready(function(e) {
	getLoginHtml();
	getLoginForm();
})