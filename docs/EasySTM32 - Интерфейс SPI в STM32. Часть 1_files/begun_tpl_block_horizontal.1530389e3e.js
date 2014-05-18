Begun.Autocontext.Customization.setTpls({
	"begun_html_tpls": [
		{"block_horizontal": '\
<span class="begun_adv_span">\
<table class="begun_adv begun_adv_hor {{css_mobile_class}}"{{block_hover}} style="width:{{block_width}}">\
<tr>\
<td class="begun_adv_cell">\
<div class="begun_adv_common">\
<table class="begun_adv_table {{css_thumbnails}}">\
<tr>\
<span class="begun_adv_age">18+</span>\
{{banners}}\
</tr>\
</table>\
<a class="begun_adv_sys_logo snap_noshots" href="{{begun_url}}" target="_blank" style="display:{{logo_display}}">{{begun_logo}}</a>\
</div>\
</td>\
</tr>\
</table>\
</span>\
'},
		{'banner_horizontal': '\
<td class="begun_adv_cell" style="width:{{banner_width}} !important" title="{{fullDomain}}" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
{{thumb}}{{mobileIcon}}\
<div class="begun_adv_block " >\
<div class="begun_adv_title">{{cross}}<a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}" {{styleTitle}}>{{favicon}}{{title}}</a></div>\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a>{{gifts_link}}</div>\
<div class="begun_adv_contact"{{styleContact}}>{{contact}}</div>\
{{bnnr_warn}}\
</div>\
</td>\
'},
		{'banner_horizontal_rich': '\
<td class="begun_adv_cell begun_adv_rich" style="width:{{banner_width}} !important" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
{{picture}}\
<div class="begun_adv_block" title="{{fullDomain}}">\
<div class="begun_adv_title"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleTitle}}>{{title}}</a></div>\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a>{{gifts_link}}</div>\
<div class="begun_adv_contact"{{styleContact}}>{{contact}}</div>\
{{bnnr_warn}}\
</div>\
</td>\
'},
		{'banner_horizontal_rich_mini': '\
<td class="begun_adv_cell begun_adv_rich" style="width:{{banner_width}} !important" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
<div class="begun_adv_title"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleTitle}}>{{title}}</a></div>\
{{picture}}\
<div class="begun_adv_block" title="{{fullDomain}}">\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a>{{gifts_link}}</div>\
{{bnnr_warn}}\
</div>\
</td>\
'}
	],
	"begun_css_tpls": [
		{"block_horizontal": '\
#begun_block_{{block_id}} .begun_adv,\
#begun_block_{{block_id}} .begun_adv .begun_adv_table,\
#begun_block_{{block_id}} .begun_adv_span {\
	width: 100% !important;\
	border-collapse: collapse !important;\
}\
#begun_block_{{block_id}} .begun_adv_common {\
	padding-bottom: 6px !important;\
}\
#begun_block_{{block_id}} .begun_adv_cell .begun_adv_cell {\
	padding: 8px 16px 8px 8px !important;\
}\
#begun_block_{{block_id}} .begun_adv td {\
	vertical-align: top !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_title {\
	margin-top: 0 !important;\
	margin-bottom: 4px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_rich .begun_adv_block {\
    margin-left: 71px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_block .begun_adv_text {\
	padding: 0 !important;\
	line-height: 1.1 !important;\
},\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_block .begun_adv_text * {\
	line-height: 1.1 !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_image {\
    top: 1px !important;\
    width: 62px !important;\
    height: 62px !important;\
    margin-right: 9px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_image img {\
	image-rendering: optimizeQuality;\
	-ms-interpolation-mode: bicubic;\
	width: 60px;\
	height: 60px;\
}\
#begun_top_mobile_block_wrapper #begun_block_{{block_id}} .begun_mobile_rich .begun_adv_title * {\
	font-size: 38px !important;\
	font-weight: bold !important;\
}\
#begun_top_mobile_block_wrapper #begun_block_{{block_id}} .begun_mobile_rich .begun_adv_text * {\
	font-size: 24px !important;\
}\
#begun_block_{{block_id}} .begun_mobile_icon {\
	float: left !important;\
	margin-bottom: 0 !important;\
}\
'}
	]
});
/*$LastChangedRevision$*/
Begun.Autocontext.tplLoaded("begun_tpl_block_horizontal");
