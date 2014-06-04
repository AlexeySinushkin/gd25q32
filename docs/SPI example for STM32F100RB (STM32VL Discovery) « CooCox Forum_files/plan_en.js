function postApply(id,num){
	$.ajax({
		url: '/forum/checklogin.php?menthod=checklogin',
		type: 'GET',
		dataType:'html',
		cache: false,
		beforeSend: function() {
			$('#msg'+id).html('<img src="/images/loading_big.gif" width="22" height="22" />');
			$('.apply').after('<span class="wait1">&nbsp;<img src="http://www.embest-tech.cn/shop/catalog/view/theme/default/image/loading.gif"/></span>');
		},	
		complete: function() {
			$('#msg'+id).html('');
			$('.wait1').remove();
		},
		success: function(json) {
			if(json != 1){
				if(num == 2){
					loginFuction = {func:function (){ getAddApplyForm(id); }};
				}else{
					loginFuction = {func:function (){ delApply(id); }};
				}
				$.blockUI({ message: $('#login_box') }); 
				$('.close').bind('click',function(){
					$.unblockUI();
					document.getElementById('callAjaxForm').reset();
					document.getElementById('callAjaxForm1').reset();
					$('#notification1').html(''); 
				}); 
			}else{
				if(num == 2){
					getAddApplyForm(id);
				}else{
					delApply(id);
				}
			}
		}
	});		
}

function getAddApplyForm(id){
	$.ajax({
		url: '/forum/addapply.php?language=en&id='+id,
		type: 'GET',
		data: 'form=1&floatleft='+($(window).width()-390)/2,
		dataType:'json',
		cache: false,
		success: function(json) {
			if(json['has_apply'] == '1'){
				alert(json['html']);
			}else{
				$('#append_parent').append(json['html']);
				$('.popupmenu_centerbox').css('top',(($(window).scrollTop()+190))+'px');
			}
		}
	});		
}

function addApply(id){
	var reason = Trim($('#reason').val());
	if(reason.length < 10){
		alert('Enter at least 10 characters');
		return false;
	}
	if(reason.length > 101){
		alert('Must not exceed 100 characters');
		return false;
	}
	$.ajax({
		url: '/forum/addapply.php?language=en&id='+id,
		type: 'post',
		data: $('#addform').serialize(),
		dataType:'html',
		cache: false,
		success: function(json) {
			var d = json.split('$$$');
			$('#append_parent').html('');
			alert(d[0]);
			if(d[0] == 'Apply success'){
				if($('#ol'+id+' li').length == 3){
					$('#ol'+id+' li').last().remove();
				}
				$('#ol'+id).prepend('<li id="'+d[2]+'"><font class="f1">'+d[1]+'</font> Apply for developing the driver<br/><font class="f2">Reasons for applying：</font>'+reason+'</li>');
				$('#div'+id).html('<a href="javascript:void(0);" onclick="postApply('+id+', 1)">Cancel</a>');
			}
		}
	});		
}
function delApply(id){
	$.ajax({
		url: '/forum/addapply.php?language=en&del=1&id='+id,
		type: 'GET',
		dataType:'html',
		cache: false,
		success: function(json) {
			var d = json.split('$$$');
			alert(d[0]);
			if(d[0] == 'Cancel success'){
				$('#btna'+id).html('Apply');
				$('#div'+id).html('<a href="javascript:void(0);" onclick="postApply('+id+', 2)">Apply</a>');
				$('#ol'+id+' li').remove('li[id='+d[1]+']');
			}
		}
	});		
}

function checkReasonNum(){
	var reason = Trim($('#reason').val());
	if(reason.length < 101){
		$('#reason_num_text').html('You can also enter <span id="reason_num">'+(100-reason.length)+'</span> characters');
		$('#reason_num').css('color','#999999');
	}else{
		$('#reason_num_text').html('Has more than <span id="reason_num">'+(reason.length-100)+'</span> characters');
		$('#reason_num').css('color','#f00000');
	}
}

