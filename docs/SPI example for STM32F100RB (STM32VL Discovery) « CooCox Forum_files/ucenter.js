function addFriend_1(uid){
	$.ajax({
		url: '/ucenter/add_friend.php', 
		type: 'post',
		data: 'uid='+uid+'&floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			if(json == 'isSelf'){
				$('#addFriendBtn').hide();
				$('#addFriendBtn_'+uid).hide();
				$('#sendMessageBtn').hide();
			}else{
				$('#append_parent').append(json);
			}
		}
	})
}
function addFriend(uid){
	loginFuction = {func:function (){ addFriend_1(uid); }};
	$.ajax({
		url: '/forum/checklogin.php?menthod=checklogin',
		type: 'GET',
		dataType:'html',
		cache: false,
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
				addFriend_1(uid);
			}
		}
	});			
}
function sendMessage_1(username){
	window.location.href = '/forum/my-plugins/bbpm/?new/'+username;
}
function sendMessage(username){
	loginFuction = {func:function (){ sendMessage_1(username); }};
	$.ajax({
		url: '/forum/checklogin.php?menthod=checklogin',
		type: 'GET',
		dataType:'html',
		cache: false,
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
				sendMessage_1(username);
			}
		}
	});
}

function hideMenu(){
	$('#append_parent').html('');
}
function addDriverFav(id,name,url,type){
	$.ajax({
		url: '/ucenter/add_favorite.php', 
		type: 'post',
		data: 'type='+type+'&name='+name+'&url='+encodeURIComponent(url),
		dataType: 'html',
		success: function(json) {
			if(json == 1){
				$('#a_f_'+id).html('Remove to favorites');
			}else{
				$('#a_f_'+id).html('Add to favorites');
			}
		}
	})
}
function feed_menu(feedid, display){
	if(display == 1){
		$('#a_feed_menu_'+feedid).show();
	}
	if(display == 0){
		$('#a_feed_menu_'+feedid).hide();
	}
}
function getFeedOptionsForm(feedid){
	$.ajax({
		url: '/ucenter/post_feed.php', 
		type: 'post',
		data: 'feedid='+feedid+'&floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			$('#feed_'+feedid+'_li').append(json);
		}
	})
}
function postFeed(feedid){
	$.ajax({
		url: '/ucenter/post_feed.php', 
		type: 'post',
		data: $("#feedform_"+feedid).serialize(),
		dataType: 'html',
		success: function(json) {
			$('#a_feed_menu_'+feedid+'_menu').remove();
			$('#feed_'+feedid+'_li').append(json);
			setTimeout("$('#feed_"+feedid+"_li').remove()",2000);
		}
	})
}
function hideFeedMenu(feedid){
	$('#a_feed_menu_'+feedid+'_menu').remove();
}

function getAddRequestForm(uid){
	$.ajax({
		url: '/ucenter/add_friend.php', 
		type: 'post',
		data: 'op=get_add_request_form&uid='+uid+'&floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			$('#append_parent').append(json);
		}
	})
}
function getDelFriendForm(uid){
	$.ajax({
		url: '/ucenter/add_friend.php', 
		type: 'post',
		data: 'op=get_ignore_form&uid='+uid+'&floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			$('#append_parent').append(json);
		}
	})
}
function getGroupForm(uid){
	$.ajax({
		url: '/ucenter/add_friend.php', 
		type: 'post',
		data: 'op=get_group_form&uid='+uid+'&floatleft='+($(window).width()-390)/2,
		dataType: 'html',
		success: function(json) {
			$('#append_parent').append(json);
		}
	})
}