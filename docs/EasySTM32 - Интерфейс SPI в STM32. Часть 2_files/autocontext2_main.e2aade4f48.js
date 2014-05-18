if(typeof Begun!=="object"){
var Begun={};
}
if(typeof Begun.Error!=="object"){
Begun.Error={};
}
if(typeof Begun.loaderCallbacks==="undefined"){
Begun.loaderCallbacks=[];
}

Begun.DOM_TIMEOUT=1;
Begun.REVISION='$LastChangedRevision$';
Begun.VERSION=Begun.REVISION.replace(/\D/g,'');

Begun.loaderCallbacks.push(begun_load_autocontext);

function begun_load_autocontext(){
Begun.Scripts.importAllScripts({"acp/begun_utils.4e3ae41527.js":true});

if(typeof Begun.Error.send==='undefined'){
Begun.Error.send=function(errorMessage,errorUrl,errorLine,loggerAddress){
var be=Begun.Error;

if(
typeof be.sent[errorMessage]!=='undefined'||
be.excludedErrors[errorMessage]
){
return;
}

var protocol=Begun.Scripts.getConformProtocol();
var defaultErrorLogger=protocol+'//autocontext.begun.ru/log_errors?';
var address=loggerAddress||window.begun_error_url||defaultErrorLogger;

var padId=window.begun_auto_pad;

be.sent[errorMessage]=Begun.Utils.includeImage(
address+'e_msg='+encodeURIComponent(errorMessage)+'&e_url='+
encodeURI(errorUrl)+'&e_line='+errorLine+
'&pad_id='+padId+'&location='+encodeURI(document.URL)+
'&rev='+Begun.VERSION
);
};

Begun.Error.sent={};

Begun.Error.excludedErrors={
'Error loading script':true
};
}

(function(){
if(!Begun.Autocontext){
var errorHandler=window.onerror;
window.onerror=function regErrors(msg,url,line){
if(errorHandler&&errorHandler instanceof Function){
errorHandler();
}
if(typeof url==="string"&&url.search(/autocontext/i)!==-1||typeof msg==="string"&&msg.search(/Begun/i)!==-1){
Begun.Error.send(msg,url,line);
}
};
}
})();

Begun.Scripts.Callbacks['ac']=function(fileName){
if(!Begun.Autocontext&&Begun.Scripts.isLastRequired(fileName)){
Begun.Autocontext=new function(){
var _this=this;
this.dom_change=false;
this.multiple_feed=true;
this.options={
max_blocks_count:10,

fake_block_offset:200,
fake_block_high_limit:251
};
this.unhandledDebugs=[];

_this.Callbacks=new function(){
var ac=_this;
var _callbacks={};
var _extend=function(destination,source){
for(var property in source){
if(typeof source[property]=='object'){
var new_obj={};
for(var property2 in source[property]){
if(typeof source[property][property2]=='function'){
if((typeof destination[property]!=="undefined")&&(typeof destination[property][property2]=='function')){
new_obj[property2]=function(old_func,new_func,property2){
return function(args){
old_func.apply(property2=='click'?this:ac,[args]);
new_func.apply(property2=='click'?this:ac,[args]);
};
}(destination[property][property2],source[property][property2],property2);
}else{
new_obj[property2]=function(func,property2){
return function(args){
func.apply(property2=='click'?this:ac,[args]);
};
}(source[property][property2],property2);
}
}
}
destination[property]=new_obj;
}
}
return destination;
};
this.register=function(callbacks){
_extend(_callbacks,callbacks);
};
this.unregister=function(ns,handler){
if(ns in _callbacks){
if(handler){
delete _callbacks[ns][handler];
}else{
delete _callbacks[ns];
}
}
};
this.dispatch=function(obj,method,context_obj,args){
if(_callbacks[obj]&&typeof _callbacks[obj][method]=='function'){
args=args||[];
_callbacks[obj][method].apply(context_obj||this,args);
}else{
return null;
}
};
this.getCallbacks=function(){
return _callbacks;
};
};

var Module=(function(){
var ext={
"auto_rich":"8d147d2d80",
"auto_catalog":"0a1df05177",
"auto_hyper":"2ad8da44e6",
"auto_photo":"038dd3975d",
"auto_turnoff":"18e44be271",
"toolbar":"7f66d92c7c",
"auto_zoom_slider":"09c0eca2eb",
"catalog_tree":"f37944542d"
};


_this.Callbacks.register({
'modules':{
'Slider':function(Slider){
Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
waiter(undefined,undefined,undefined,Begun.Slider);
}
);
}
}
});

var loaded=[];
return{
updateAnticash:function(link){
var reModule=new RegExp("^"+_this.Strings.urls.base_scripts_url+"(\\w+)\.js$");
var parsed=reModule.exec(link);
if((parsed!==null)&&(parsed.length===2)&&
typeof ext[parsed[1]]!=="undefined"){
return ext[parsed[1]];
}else{
return false;
}
},
isLoaded:function(link){
return Begun.Utils.in_array(loaded,link);
},
load:function(link){
if(!this.isLoaded(link)){
var revNumber=this.updateAnticash(link),
included;

if(revNumber){
included=Begun.Utils.includeScript(
link.replace(
/(.+)\/([^\/]+)\.js$/,
"$1/acp/$2."+revNumber+".js"
)
);
}else{
included=Begun.Utils.includeScript(link);
}

if(included){
loaded.push(link);
}
}
},

baseLoad:function(path){
var base=_this.Strings.urls.base_scripts_url;
this.load(base+path);
},

baseLoadIf:function(flag,path){
if(flag){
this.baseLoad(path);
}
},

getNames:function(what){
switch(what){
case"loaded":
return loaded.toString();
case"all":
default:
var allModules='';
var comma='';
for(var aModule in ext){
if(ext.hasOwnProperty(aModule)){
allModules+=comma+aModule;
comma=',';
}
}
return allModules;
}
},

initInBlock:function(block,pad){
var initExtraModule=function(objName,func,object){
if(objName in Begun){
func(object);
}else{
setTimeout(function(){
initExtraModule(objName,func,object);
},Begun.DOM_TIMEOUT);
}
};

if(
(_this.bannersContainViewType('rich',pad.pad_id,null,block.id)||
_this.bannersContainViewType('pseudorich',pad.pad_id,null,block.id))&&
!_this.isRichExpanded(block)&&
!_this.isRichMini(block)
){
initExtraModule('richBlocks',_this.initAutoRichBlock,block);
}else if(_this.Blocks.checkType(block,'top')){
var collapsableBlock=Begun.Utils.getElementsByClassName(block.dom_obj,'div','begun_collapsable')[0],
height=collapsableBlock&&collapsableBlock.clientHeight,
body=document.getElementsByTagName('body')&&document.getElementsByTagName('body')[0];
if(height&&body){
body.style.paddingTop=height+'px';
}
}else if(_this.isTurnOff(block)){
initExtraModule('Turnoff',_this.initTurnoff,block);
}
}
};
})();

this.warningModule={};

(function(warningModule){
var warningText={
"medicine":"&#1045;&#1089;&#1090;&#1100;&#32;&#1087;&#1088;&#1086;&#1090;&#1080;&#1074;&#1086;&shy;&#1087;&#1086;&#1082;&#1072;&#1079;&#1072;&#1085;&#1080;&#1103;&#46;&#32;&#1055;&#1086;&#1089;&#1086;&#1074;&#1077;&#1090;&#1091;&#1081;&#1090;&#1077;&#1089;&#1100;&#32;&#1089;&nbsp;&#1074;&#1088;&#1072;&#1095;&#1086;&#1084;&#46;",
"abortion":"&#1045;&#1089;&#1090;&#1100;&#32;&#1087;&#1088;&#1086;&#1090;&#1080;&#1074;&#1086;&shy;&#1087;&#1086;&#1082;&#1072;&#1079;&#1072;&#1085;&#1080;&#1103;&#46;&#32;&#1055;&#1086;&#1089;&#1086;&#1074;&#1077;&#1090;&#1091;&#1081;&#1090;&#1077;&#1089;&#1100;&#32;&#1089;&nbsp;&#1074;&#1088;&#1072;&#1095;&#1086;&#1084;&#46;"
};
warningModule.getText=function(type){
return warningText[type]||"";
};
}(this.warningModule));

this.tplLoaded=function(tpl){
this.tplLoaded.notFinished[tpl]=false;
if(this.fillBlocks.delayedCall&&!ExtBlockTypes.isLoading()){
this.fillBlocks();
this.fillBlocks.delayedCall=false;
}
};
this.tplLoaded.notFinished={};

var ExtBlockTypes=(function(){
var ext={
"begun_tpl_block_120x600":"cef4e553a1",
"begun_tpl_block_160x600":"7047c9e599",
"begun_tpl_block_200x300":"7786ef14fa",
"begun_tpl_block_240x400":"d750df40e1",
"begun_tpl_block_240x400_custom":"4fd34f6a5a",
"begun_tpl_block_price_240x400":"0d3b3ef3ce",
"begun_tpl_block_300x250":"841b3cb2a1",
"begun_tpl_block_468x60":"ace4fdd537",
"begun_tpl_block_728x90":"32d7a16cb7",
"begun_tpl_block_728x90_custom":"e6371c8aa5",
"begun_tpl_block_price_728x90":"d2f5abe43a",
"begun_tpl_block_990x90":"656dc8074b",
"begun_tpl_block_flat":"b1eead6451",
"begun_tpl_block_horizontal":"1530389e3e",
"begun_tpl_block_price_horizontal":"63a37ed6ff",
"begun_tpl_block_square":"97372a40bd",
"begun_tpl_block_top":"49b37c7c3b",
"begun_tpl_block_vertical":"64bfa5c1b0",
"begun_tpl_block_price_vertical":"ed0ec9e22e",
"begun_tpl_block_price_composite":"9043cbb3f6",
"begun_tpl_block_price_search":"b54c4c5ba4"
};

return{
isLoading:function(){
var isAny=false;
for(var status in _this.tplLoaded.notFinished){
if(_this.tplLoaded.notFinished.hasOwnProperty(status)){
if(_this.tplLoaded.notFinished[status]){
isAny=true;
break;
}
}
}
return isAny;
},
load:function(tplFileName){
if(typeof ext[tplFileName]==="undefined"){
return;
}
if(typeof _this.tplLoaded.notFinished[tplFileName]==="undefined"){
var included=Begun.Utils.includeScript(_this.Strings.urls.base_scripts_url+"acp/"+
tplFileName+"."+ext[tplFileName]+".js","write");

_this.tplLoaded.notFinished[tplFileName]=included;
}
},
loadAll:function(){
for(var tplFileName in ext){
if(ext.hasOwnProperty(tplFileName)){
this.load(tplFileName);
}
}
}
};
})();

this.getModules=Module.getNames;

var UA_DESKTOP=0,
UA_CLASSIC_MOBILE=1,
UA_RICH_MOBILE=2,
BLOCK_ID_TOP_MOBILE=2;

this.getBlockIdTopMobile=function(){
return BLOCK_ID_TOP_MOBILE;
};


var protocol=Begun.Scripts.getConformProtocol();

this.Strings={
urls:{
begun:protocol+'//www.begun.ru/?utm_source=begun_network&utm_medium=logo&utm_campaign=text_blocks',
price:protocol+'//price.ru/smart/?utm_source=begodik&utm_medium=logo&utm_campaign=goods_blocks',
autocontext:protocol+'//autocontext.begun.ru/',
ac_filename:'autocontext2.js',
hostname:'autocontext.begun.ru',
base_scripts_url:protocol+'//autocontext.begun.ru/',
daemon:protocol+'//autocontext.begun.ru/context.jsp?',
rtb_daemon:protocol+'//rtb.begun.ru',
video:protocol+'//video.begun.ru/vcp.swf',
thumbs:protocol+'//thumbs.begun.ru/',
blank:protocol+'//autocontext.begun.ru/img/blank.gif',
log_banners_counter:protocol+'//autocontext.begun.ru/blockcounter?log_visibility=1&',
begun_logo_src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAQCAYAAABKkhw/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA8VJREFUeNrkl1loE1EUhs8k6R63ulSt4tKKVcGNuvvgQgU3FB8UEVEEURBBcUHxQX3wQSuoIGpdUKpYBHeoiLigolZapEpbqEUpxbZujVqjRGsS/9P+KTcxwmj6UOiBL5PcuTNz/3v+e+7ECgaD0pHCZVlWZxwTwEfQrtQnZohk5olYOrBAa/NYjPIxx/zP4QBHQR1Iam/Z8L0SaXwIwfFhzZqUpv+9pwp2aqb1/kBvnfyXvtovhX2jhV7rlpaERD7DinKvyLbkaFn7eAEfgSi9bcTPwJ+W1cH4yV7wCDwD+c3WobPAOnALlIM7YBPFa6SCXQC5kApwBazguQHgMlhqPDMbXAcz+HsKOAVegCfgABgU6vy9UsRzAzOUYk+kCvTj49svkTFdsyUjZXjzb1NwkDO+HnwC78BycBx0ATvAYdAN3ASdwH6wh/c4AXbyHvfAVHCGIjVjC8AoY0zpYA7oDzJBIVgFSsEXsAFcoltaRmejsqgoL0Q2IavxjkSZ12eRHBp9VdKTBsov43oXRWuMBC/5XYXlgCwwC9SDeSxs3cFdsBio4Rbydw7NN5aZWkbHSMSa8/PoBXM5qWtBHtvzOeHDQLGdrKrIFFeC5KTNllFdJsqE7jNlROfs5nPvf9S2CgwJtjiH1Ua7lxOh6+obbXub/TCP0hc0gMHsX0+xGjV0SqTTohZiHiuMthIKtlWFNbNul1tyR56T6b0WhJ0r8tyWKm+ZOK3oGTYjYBzjQCMoMM7r2vwAKnl9H2Pisri+/UapMQX7IpaT8Blm8RO7W+QPjHDjkG1hYr80eaTYc0/2VW4Wn98Pi4cLbuDAVnLtaNYmsf0NB+5m0XrGdZfPrUyLVREL0HM6Yyj7qxM+8znzwVmu0VAB+xrrtqXZTXY6ZFzqNHz3S2F9gdx8WyB1vhp57S3HZAQlwRE+cyr4GAtNnrGONLYD7IRykAWsyFw24KROMIudFpp+uhOwKi9jllVgLthi1AeN+1z3U41xRNrcZUd0kjNRqr9XyenqXAi+JtDYbGHNarzjT5uELJfGotOXM1/KwhMKtelk0BN4WExKaT+tzLWszFrhx4Mj4DyFO+iYcazkVeABs59Jiuko4ZakLnkaqgXpmM4eS5DRFk+MgQq93q1i4hxxyLJbGn5+kjgbe7UVo6ssbklbI97UVMBq2jy2d1+UywG7YRdsbAFfuGBz33XZVOKKcTxBruOL3FeFti6hnWMO92hs/BNREDzR02OJfbFtITgUZaTNo/caZLAxTKyz9aXkfyzZ0f4e/hZgAMX8C7KjSuh8AAAAAElFTkSuQmCC',
price_logo_src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAANCAYAAAD12g16AAAACXBIWXMAAAsSAAALEgHS3X78AAACJklEQVRIx%2BXWXWjPYRQH8M%2BfJRvNy7xNUksyiYi4cKOFvMwsjOLC2wXuTeNCrrzcsCtqF2o3rohpiLw0MeWl5oKSl4REFC0vk%2BnvwvnXr3%2B%2FbGtb0U79Or%2FfeZ5znud7fud8nyeTzWb9b%2FIgk4E6HOqp7yADTAoyf7L1z0sPK%2FE7ClMBYzDWYDY6cRmtMV6GGoxGPWahGKfDtwpz8S387offcKzHNHzEGbxIWX8BlsYejmIXTuJDjK%2FDM7R1E%2BhNXEUJ3uJIWknXowGTMAMt2BaAbmMjRsWmqrElfM%2BHX1lsvBXbMRT3sCf8FuMx5uetPRW3AvDIeA5jQmLOfizrJtjXuBE4CgNbU9of3opanAhbIzbhCkqxOgAkZQyWYxWaw7YPEwNYeSTiZYw9wgbcTcSYg19YFHpyL6u%2BGQ9xIL6rA9PnfMDD8Cpha8eQBKF1pAQvCp0MdjD0itAt0SI5%2BZqS7I4Am2%2FPyYgegj6beD%2BX5p8LXpIHprOLwD9CFydseyNJ1%2BN7Id7E%2B%2B7I%2Ft%2FkZ%2BhxoTPRHh19ytKhj2NlBK%2FBsS783gdJNUZWi7A2ergNT3Ep%2BroUS1CBKbiIzSkx3wVnNAQ%2FTI%2B4F%2FoDcG2U9njsxKlYrC42kiyT3F%2BtCpAz4xiowJ0YmxdkVx6ga%2FEkSKwpGLQ90W%2BQjcRsDPK8hh143k0slUGsSRmbPykTC1X2dSb78xzuzU2rIM7YLwPmpoVPA%2Blq%2BRtzLnZ6da%2FBBQAAAABJRU5ErkJggg%3D%3D',
price_search_logo_src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAATCAYAAAADKFpSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBQTk3MTVEQjMwQ0FFMzExOUQwRDlGODdFQjlENjBEQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRDM4NDIwNEQwNDkxMUUzODYyOTg1QjZERUQ5MTg1OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRDM4NDIwM0QwNDkxMUUzODYyOTg1QjZERUQ5MTg1OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJFNTBBMUQwQjlDQkUzMTE5RDBEOUY4N0VCOUQ2MERBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFBOTcxNURCMzBDQUUzMTE5RDBEOUY4N0VCOUQ2MERBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+z04eFwAAA3NJREFUeNrsmGtIVEEUx2d1V1fxsZaWmtnLSsRQKCIwSEhKelBJfZPoBVZEifQhCuxJn/xYmYWhkCFlZURhRKRgRhhKD4gESzQzF9HIR2Sbt/+s/61h213ddU1q98CPOzN35szcc8+cM/fqhA/LcyFW4GL0gqo6vfBtqQRzvKDHEOAFJVlgrY+/EDFRjwwDD1meCcx+Q3omg+AM9fT8T4bRBQWJsIwMEWA0isHGRmHpcf146tZeD8rAY3AfHKeX2SQI5IO7oBYcABoIAZFghP2iwVFQDR6BcrBNrk3RFQi2M0ZJXXfAYRDuYq3TwGnwgGOywUqueY1d3z1sT/TIiIGBYmFNjQjPzBTG1FSxoLpaGJOTxzX2BI0ijdEJ+ln/AOLZp4RtFtAGCtkuy59ZnsUxst9X6rKwXq7Md4ttw+A9GGD9LYhwssZn7DPEObeCHWzLt+tbxvb0MbJ2G9DseZ2SopmLi7Vmk8lKa06O1lFQoDnqS/Q2jzwGvnBiaYzp4BLL+9hnC/gOksBccMrB2g5xTAm9VJYTQAs9UJaXU1cziAPzQAy4ARaBXAd6EzmuhX3l/FWTsaUjsrNFckODsJjNIr2vz0pcYaEISUsTCUVFLre2jjGuAbxk+7DiQbOVrd1Fb3Am83m9Qh1SPoEj4CS90+bhTdQtX97iUQexSpKTbS3lDePypIkhNlYEhIYK06ZNv2NaYqI1Xuqjo8eVbL7Z3Rty0F8bZ/Iatmu/TVTZTVzF7alJNAaD1QN/BfSoKCsD9fUeZW2DB2uwOBkrt7Jc2UWl7TxQ90okt3mLB/OG2tWD/7bx1be/BCyzvRSwjuV+N/S94zVXMaaMt2d5CpAvrpvtMub1MVR0gL302izl/tIx5mvndaOSpGS4WMVy91ScI2V8awS9NGQUs3ilG/rOMZMeBDtpqHjOU8aM3skjjPwa+khjzGAcbAVXgQk8ZSiJcTGfPAY9ARmM31385JPzXWbdPdG0CRtSfqHc4wNG8gFLuFAp15zEzSpla7XTs/eL0R8CwTSIPFNeV+LsBrCLXh9Dr6wDF3h60HMtI9wRvUx+TXZzy/urQZ6y7lfgJqjwxCD9tbWip7RU6PR/Rr3eCucqdWSEh+LNPvb3p83bPy1e8GDslwnEyDG/APziXtb2yxT+/fnXJc/BGdQT+fFTgAEA3W/ozKnZ36MAAAAASUVORK5CYII=',
gifts_link:'http://click01.begun.ru/click.jsp?url=cheaterdetecter',
hyper_shadow_1:protocol+'//autocontext.begun.ru/img/hyper-shadow-1.png',
hyper_shadow_2:protocol+'//autocontext.begun.ru/img/hyper-shadow-2.png',
mobile_icon:protocol+'//autocontext.begun.ru/img/mobile_icon.png',
turnoff_handler:protocol+'//autocontext.begun.ru/hide.jsp?',
integration:'integrations/{{name}}.js',


no_flash:protocol+'//autocontext.begun.ru/noshow'
},
contacts:{
card:'&#1050;&#1086;&#1085;&#1090;&#1072;&#1082;&#1090;&#1099;'
},
css:{
prefix:'begun',
block_prefix:'begun_block_',
catalog_search_wrapper:'begun_catalog_search_span',
catalog_results_wrapper:'begun_catalog_results_span',
catalog_cloud_wrapper:'begun_catalog_cloud_span',
thumb:'begun_adv_thumb',
logo_color:'#000000',
fix_layout:'begun_fix_layout',
mobile_classic:'begun_mobile_classic',
mobile_rich:'begun_mobile_rich'
},
js:{
banner_onclick:'Begun.Autocontext.clickBanner(event, this)'
}
};

var isBFSApplicable=function(){
return(typeof window.begun_multiple_feed!=="undefined"||_this.multiple_feed)&&!window.begun_block_ids;
};

var addFakeBlocks=function(){
var feed=_this.getFeed();
if(feed.blocks){
var _block=null;
var i=0;
while(_block=feed.blocks[i]){
if((_block)&&_block.id==BLOCK_ID_TOP_MOBILE){
_this.Blocks.add(_block);
}
i++;
}
}
};

var LoadingStrategy=function(){};
LoadingStrategy.prototype={
loadBlock:function(block_id){},
parseFeed:function(){}
};


var DS=function(){};
DS.prototype=new LoadingStrategy();
DS.prototype.loadBlock=function(block_id){
this.block_id=block_id;
if(!_this.initFeedLoad()&&arguments.callee.run){
_this.loadFeedDone();
}
arguments.callee.run=true;
};
DS.prototype.parseFeed=function(){
_this.loadExtraResources();
var feed=_this.getFeed();
if(feed&&feed.blocks&&this.block_id){
addFakeBlocks();
var block=_this.Blocks.getBlockById(this.block_id,feed.blocks);
if(block){
_this.Blocks.push(block);
}
}
};


var FBS=function(){};
FBS.prototype=new LoadingStrategy();
FBS.prototype.parseFeed=function(){
var extendUndefinedFields=function(destination,source){
for(var property in source){
if(source.hasOwnProperty(property)){
if(typeof destination[property]==="undefined"){
destination[property]=source[property];
}else if(typeof destination[property]==="object"&&typeof source[property]==="object"){
destination[property]=extendUndefinedFields(destination[property],source[property]);
}
}
}
return destination;
};
_this.loadExtraResources();
var feed=_this.getFeed();
if(feed&&feed.blocks&&this.block_id){
var block=_this.Blocks.getBlockById(this.block_id,feed.blocks);
if(block){
extendUndefinedFields(block.options,window.begun_extra_block.options);
window.begun_extra_block.id=window.begun_block_id;
_this.Blocks.push(window.begun_extra_block);
}
addFakeBlocks();
}
};
FBS.prototype.loadBlock=function(block_id){
var feed=_this.getFeed();
if(feed&&feed.blocks){
_this.resetBannerIndex();
var sBanners=_this.getShownBanners();
if(typeof sBanners==="object"){
sBanners=sBanners.toString();
}else{
sBanners="";
}
_this.feedLoad({"banner_filter":sBanners});
}
this.block_id=block_id;
};


var BFS=function(){};
BFS.prototype=new LoadingStrategy();
BFS.prototype.loadBlock=function(block_id){
this.block_id=block_id;
var feed=_this.getFeed();
if(feed&&feed.blocks){
_this.resetBannerIndex();
var sBanners=_this.getShownBanners();
if(typeof sBanners==="object"){
sBanners=sBanners.toString();
}else{
sBanners="";
}
_this.feedLoad({"banner_filter":sBanners});
}
};
BFS.prototype.parseFeed=function(){
(new DS).parseFeed.apply(this);
};

this.getLoadingStrategy=function(){
if(window.begun_extra_block){
if(!arguments.callee.fbs){
arguments.callee.fbs=new FBS();
}
return arguments.callee.fbs;
}else if(isBFSApplicable()){
if(!arguments.callee.bfs){
arguments.callee.bfs=new BFS();
}
return arguments.callee.bfs;
}else{
if(!arguments.callee.ds){
arguments.callee.ds=new DS();
}
return arguments.callee.ds;
}
};
this.setOptions=function(options){
Begun.extend(_this.options,options||{});
};

this.requestParams={
"pad_id":'',
"block_id":'',
"n":'',
"lmt":Date.parse(document.lastModified)/1000,
"json":1,
"jscall":'loadFeedDone',
"condition_id":window.begun_condition_id||'',
"frm_level":'',
"frm_top":'',
"misc_id":window.begun_misc_id||window.misc_id,
"version":'',
"banner_filter":'',
"stopwords":window.stopwords||'',
"begun_self_keywords":window.begun_self_keywords||'',
"begun_self_categories":window.begun_self_categories||'',
"ref":document.referrer,
"real_refer":document.URL
};

this.responseParams={};

this.Storage=new function(){
try{
if(!top.Begun){
top.Begun={};
}
var values=top.Begun.storageValues=top.Begun.storageValues||{};
}catch(e){
try{
if(!parent.Begun){
parent.Begun={};
}
var values=parent.Begun.storageValues=parent.Begun.storageValues||{};
}catch(ex){
var values={};
}
}

return{
getV:values,
set:function(prop,data){
if(typeof data!='object'||!values[prop]){
values[prop]=data;
}else{
Begun.extend(values[prop],data);
}
},
erase:function(prop){
values[prop]={};
},
get:function(prop){
return values[prop];
},

incProperty:function(obj,prop){
if(typeof values[obj]!=='object'){
values[obj]={};
values[obj][prop]=0;
}else{
values[obj][prop]=typeof values[obj][prop]=='number'?values[obj][prop]+1:0;
}
}
};
};

this.prepareRequestParams=function(newValues){
var comma="",
begunStorage=_this.Storage,
padId=_this.requestParams.pad_id=window.begun_auto_pad;
if(begunStorage.get('url')&&begunStorage.get('url')!==document.URL){
begunStorage.erase(padId);
begunStorage.set('pageId',false);
}
if(_this.Monitor.setFirst(padId,'requested')){
_this.requestParams.first='1';
}

_this.requestParams.version=Begun.VERSION;
if(typeof(window.begun_js_force_load)!='undefined'&&window.begun_js_force_load){
ExtBlockTypes.loadAll();
var moduleNames=Module.getNames('all').split(','),
baseUrl=_this.Strings.urls.base_scripts_url,
j;
for(j=0;j<moduleNames.length;j++){
if(moduleNames[j]!=="toolbar"){
Module.load(baseUrl+moduleNames[j]+".js");
}
}
}
var frame_level=(function(){
var level=0,
_parent=self;
while(_parent!==top&&level<999){
_parent=_parent.parent;
level++;
}
return level;
})();
if(frame_level){
_this.requestParams.frm_level=frame_level;
try{
_this.requestParams.frm_top=top.location.href;
}catch(exc){
_this.requestParams.frm_top='top_not_accessible';
}
}

if(typeof _this.isNotFirstRequest==="undefined"){
_this.isNotFirstRequest=true;
comma=",";
_this.requestParams.block_id=BLOCK_ID_TOP_MOBILE;
}

if(window.begun_block_ids){
_this.requestParams.block_id+=comma+window.begun_block_ids.replace(/\s/g,"");
}else{
if(window.begun_block_id&&isBFSApplicable()){
_this.requestParams.block_id+=comma+window.begun_block_id;
}
}

if(window.begun_request_params&&window.begun_request_params.constructor===Object){
Begun.extend(_this.requestParams,window.begun_request_params);
}
if(newValues){
Begun.extend(_this.requestParams,newValues);
}
begunStorage.incProperty(padId,'rq');
if(!begunStorage.get('pageId')){
begunStorage.set('pageId',(function(){
var ret="",i=0;
while(i<32){
ret+=Math.floor(Math.random()*16).toString(16);i++;
}
return ret.toUpperCase();
})());
begunStorage.set('url',document.URL);
}
_this.requestParams.rq=begunStorage.get(padId)['rq'];
_this.requestParams.rq_sess=begunStorage.get('pageId');
_this.requestParams.begun_self_keywords=window.begun_self_keywords||'';
_this.requestParams.begun_self_categories=window.begun_self_categories||'';
window.begun_self_keywords='';
window.begun_self_categories='';

};
this.init=function(){
_this.Customization.init();
_this.Pads.init();
_this.initCurrentBlock();
if(typeof arguments.callee.run==="undefined"){
arguments.callee.run=true;
}
};
this.initToolbar=function(debug){
if(Begun.Toolbar){
var toolbar=Begun.Toolbar.init(debug);
}
};
this.initHypercontextBlock=function(block,pad_id){
if(!Begun.Hypercontext||!block){
return;
}
this.hyperBlock=new Begun.Hypercontext(block,pad_id);
};
this.initPhotocontextBlock=function(block,pad_id){
if(!Begun.Photocontext||!block){
return;
}
this.photoBlock=new Begun.Photocontext(block,pad_id);
};
this.initTurnoff=function(block){
if(!Begun.Turnoff){
return false;
}
new Begun.Turnoff(block);
};

this.getRichSizes=function(img,max){
var minP='width',
maxP='height',
px='px';

var res={};
res[minP]=img[minP];
res[maxP]=img[maxP];

if(res[maxP]!==res[minP]){
if(res[minP]>res[maxP]){
var sw=maxP;
maxP=minP;
minP=sw;
}

res[minP]=Math.round(max*res[minP]/res[maxP]);
res[maxP]=max;
}else{
res[maxP]=res[minP]=max;
}

img.style[maxP]=res[maxP]+px;
img.style[minP]=res[minP]+px;

return res;
};

this.callRich=function(options,rich_blocks_div,block){
var rich_blocks=(new Begun.richBlocks(rich_blocks_div,options));
rich_blocks.init();
block.is_rich_blocks_processing=true;
};

this.initZoomSlider=function(block,sliderStyle){
var blockId=block.id,
blockDiv=this.Blocks.getDomObj(blockId);

var slider=new Begun.Slider(
blockDiv,
blockId,
{
style:sliderStyle,
duration:600
}
);


slider.cycle(5e3);

!(function(slider){
var images=slider.container.getElementsByTagName('img'),
len=images.length,i=0,zoom;

while(i<len){
zoom=new Begun.Zoom(
images[i],
slider.container,
{
marginTop:-15,
marginLeft:-15,
duration:150
}
);


zoom.options.shiftLeft=Math.floor((
zoom.container.clientWidth-zoom.endWidth-

(zoom.element.offsetWidth-zoom.element.clientWidth)
)/2)-zoom.startLeft;

i+=1;
}
}(slider));

!(function(slider,utils){
var HOVER_CLASS='begun_hover';

blockDiv.onmouseover=function(){
utils.addClassName(this,HOVER_CLASS);
slider.stopCycling();
};
blockDiv.onmouseout=function(){
utils.removeClassName(this,HOVER_CLASS);

};
}(slider,Begun.Utils));
};

this.initAutoRichBlock=function(block){
if(!Begun.richBlocks){
return false;
}
var rich_blocks_div=_this.Blocks.getDomObj(block.id);
if(!block.is_rich_blocks_processing&&rich_blocks_div){
var options={};
options.is_block_240x400=_this.Blocks.checkType(block,'240x400');

var min=70;
var max=200;

if(typeof _this._big_rich_sizes==="undefined"){
_this._big_rich_sizes={};
}
var small_images=[];
var i;
var l;
var cells=Begun.Utils.getElementsByClassName(rich_blocks_div,'td','begun_adv_rich');
var ln=0;
for(i=0,l=cells.length;i<l;i++){
small_images[i]=Begun.Utils.getElementsByClassName(cells[i],'img','begun_adv_picture')&&Begun.Utils.getElementsByClassName(cells[i],'img','begun_adv_picture')[0];
if(small_images[i]){
ln+=2;
}
}
block.ln=ln;
for(i=0,l=small_images.length;i<l;i++){
if(small_images[i]){
var setSizes=function(num,image,max,key,obj,block){
var sizes=_this.getRichSizes.call(obj,image,max);
obj._big_rich_sizes['img_width_'+key+'_'+num]=sizes.width;
obj._big_rich_sizes['img_height_'+key+'_'+num]=sizes.height;
if(--block.ln==0){
options.num_pics=l;
options.sizes=obj._big_rich_sizes;
obj.callRich(options,rich_blocks_div,block);
image.onload=null;
}
}
var detectImgDimensions=function(img,i,value,key,obj,block){
if(img.complete){
setSizes(i,img,value,key,obj,block);
}else{
window.setTimeout((function(img,i,value,key,obj,block){
return function(){
detectImgDimensions(img,i,value,key,obj,block);
};
})(img,i,value,key,obj,block),Begun.DOM_TIMEOUT);
}
};
detectImgDimensions(small_images[i],i,min,'min',_this,block);

var big=Begun.Utils.includeImage(
small_images[i].getAttribute('_big_photo_src')
);
if(big){
detectImgDimensions(big,i,max,'max',_this,block);
}
}
}
}
};
this.initAutoCatalogBlock=function(block){
if(!Begun.Catalog){
return false;
}
if(!block.is_catalog_processing){
var feed=this.getFeed();
var catalog=(new Begun.Catalog(block,feed));
catalog.init();
block.is_catalog_processing=true;
}
};
this.parseLinks=function(){
var feed=_this.getFeed();
if(!feed){
return;
}
var links=feed.links;
if(links){
var i=0,link=null,linksArr=[];
while(link=links[i]){
switch(link.type){
case'iframe_js':
linksArr.push('script='+encodeURIComponent(link.url));
break;
case'img':
case'gif':
case'png':
case'204':
case 204:
case'302':
case 302:
default:
linksArr.push('img='+encodeURIComponent(link.url));
break;
}
i++;
}
var vars={url:Begun.Scripts.getConformProtocol()+"//profile.begun.ru/sandbox?"+linksArr.join('&')};
document.write((new Begun.Template(_this.Tpls.getHTML('link_iframe'))).evaluate(vars));
}
};

this.excludeFakeBanners=function(feed,section){
if(feed.banners){
var isAnyFake=false,
goodBanners=[];

Begun.Utils.forEach(
feed.banners[section],
function(banner){
if(this.checkBannerViewType(banner,'Fake')){
isAnyFake=true;
this.Banners.infoValues.setAll(
banner.block_id,banner
);
this.Banners.infoValues.set(banner.block_id,banner.banner_id,'source',
banner.source);
this.Banners.infoValues.set(banner.block_id,'fake','id',
banner.banner_id);
delete banner;
}else{
goodBanners.push(banner);
}
},
this
);

if(isAnyFake){
feed.banners[section]=goodBanners;
}
}

return feed;
};

this.loadExtraResources=function(){
var feed=_this.getFeed();
if(!feed){
return;
}
var isRich;
var isHyper;
var isCatalog;
var isPhoto;
var isTurnoff;
var blocks=feed.blocks;
for(var k=0;k<blocks.length;k++){
if(_this.Blocks.checkType(blocks[k],'hyper')||_this.Blocks.checkType(blocks[k],'price_hyper')){
isHyper=true;
}
if(_this.Blocks.checkType(blocks[k],'photo')){
isPhoto=true;
}
if(blocks[k].options){
if(Begun.Utils.inList(blocks[k].options.block_options,'JSCatalog')){
isCatalog=true;
}
if(_this.isTurnOff(blocks[k])){
isTurnoff=true;
}
}
}
var feedBanners=feed.banners;
for(var bannersGroup in feedBanners){
if(feedBanners.hasOwnProperty(bannersGroup)&&feedBanners[bannersGroup].length){
for(var j=0;j<feedBanners[bannersGroup].length;j++){
if(this.isNormalRichBanner(feedBanners[bannersGroup][j])){
isRich=true;
}
}
}
}

Module.baseLoadIf(isRich,"auto_rich.js");
Module.baseLoadIf(isHyper,"auto_hyper.js");
Module.baseLoadIf(isCatalog,"catalog_tree.js");
Module.baseLoadIf(isCatalog,"auto_catalog.js");
Module.baseLoadIf(isPhoto,"auto_photo.js");
Module.baseLoadIf(isTurnoff,"auto_turnoff.js");
};

this.draw=function(){
if(!arguments.callee.run){
_this.Blocks.init();
}
arguments.callee.run=true;
if(ExtBlockTypes.isLoading()){
_this.fillBlocks.delayedCall=true;
}else{
_this.fillBlocks();
}
};
this.useBlockIdDistr=function(){
return!!(_this.getBanner('autocontext',0)&&_this.getBanner('autocontext',0)["block_id"]);
};
this.isFakeBlockId=function(block_id){
return block_id<this.options.fake_block_high_limit&&block_id>this.options.fake_block_offset&&this.lastBlockId;
};
this.initCurrentBlock=function(){
var fakeBlockId;
if(typeof window.begun_auto_pad!=="undefined"&&window.begun_auto_pad>0&&
typeof window.begun_block_id!=="undefined"&&window.begun_block_id>0){
if(window.begun_extra_block&&typeof begunAutoRun!=="function"){
var total_banners=window.begun_total_banners||_this.getActualBlockBannersCount();
fakeBlockId=this.options.fake_block_offset+parseInt(total_banners);
this.lastBlockId=window.begun_block_id;
}
if(!window.begun_extra_block||!_this.isOldBlock()){
_this.printBlockPlace(window.begun_block_id);
}
_this.getLoadingStrategy().loadBlock(window.begun_block_id);
if(fakeBlockId){
window.begun_block_id=fakeBlockId;
}
_this.initFeedLoad();
}else if((_this.init.run)||(typeof window.begun_total_banners==="undefined"
&&typeof window.begun_block_ids==="undefined")){
Begun.Error.send("begun_block_id is missing",document.URL,-1);
}
};
this.getActualBlockBannersCount=function(block){
if(typeof block==="undefined"){
if(typeof window.begun_extra_block!=="undefined"){
block=window.begun_extra_block;
}else{
return 0;
}
}
var coef=Math.ceil(Number(block.options.banners_count_coef))||1;
return Number(block.options.banners_count)*coef;
};
this.initFeedLoad=function(){
if(_this.isFeedStarted()){
return false;
}
if(isBFSApplicable()||window.begun_extra_block||!_this.getFeed()){
_this.setFeedStarted();
this.feedLoad();
}
return false;
};
this.feedLoad=function(paramsUpdate){
_this.prepareRequestParams(paramsUpdate);

var params=Begun.Utils.toQuery(_this.requestParams);

var feedURL=(
window.begun_feed_source?
_this.Strings.urls.rtb_daemon+window.begun_feed_source:
_this.Strings.urls.daemon+params
).replace(/%[0-9a-fA-F]?$/,'');

var included=Begun.Utils.includeScript(
feedURL,
'write',
null,
'begunAds'
);
_this.requestParams.block_id="";
_this.requestParams.begun_self_keywords="";
_this.requestParams.begun_self_categories="";
return included;
};
this.getGraphHTML=function(graph_banner,callback,width,height,block_id){
width=width||240;
height=height||400;

var inlineStyles='',
type='img',
src=graph_banner.source,
block,
size,

BRANDRICH_PREFIX='_custom';

if(block_id&&block_id==BLOCK_ID_TOP_MOBILE&&width==320&&height==50){
width=640;
height=100;
}

if(("swf"==graph_banner.mime)||("application/x-shockwave-flash"==graph_banner.mime)){
type='swf';
inlineStyles='width:'+width+'px;height:'+height+'px;';
}else if(("html"==graph_banner.mime)||("text/html"==graph_banner.mime)){
type='html';
}else if(("js"==graph_banner.mime)||("application/x-javascript"==graph_banner.mime)){
type='js';
_this.bindJsBanner();

if(graph_banner.view_type&&
graph_banner.view_type.toLowerCase().indexOf('brandrich')>-1){

block=_this.Blocks.getBlockById(graph_banner.block_id);
size=_this.getGraphDimensions(graph_banner.view_type).size;
block&&(block.options.dimensions.type=size+BRANDRICH_PREFIX);
ExtBlockTypes.load("begun_tpl_block_"+block.options.dimensions.type);

Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
var undefined;
waiter(undefined,graph_banner.url);
}
);

Begun.Utils.includeScript(src,'write');
}else{
Begun.Utils.includeScript(src,'append',callback);
}
}else if(!Begun.Browser.Gecko){
inlineStyles='width:'+width+'px;height:'+height+'px;';
}

var vars={
'url':graph_banner.url,
'source':src,
'width':width,
'height':height,
'close_button':_this.getCloseButton(block_id),
'styles':inlineStyles
};

if(type=="swf"){
vars.url=encodeURIComponent(vars.url);
var hasFlash=function(){
if(typeof window.navigator.plugins=="undefined"||window.navigator.plugins.length==0){
if(typeof window.ActiveXObject!="undefined"){
try{
var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
return!!a;
}
catch(e){
return false;
}
}else{
return false;
}
}else{
return window.navigator.plugins["Shockwave Flash"]
}
};
if(!hasFlash()){
Begun.Utils.includeImage(_this.Strings.urls.no_flash);
}
}

var block=this.Blocks.getBlockById(block_id);
block.banner_id=graph_banner.banner_id;

this.Banners.infoValues.setAll(
block_id,graph_banner
);

return new Begun.Template(
_this.Tpls.getHTML('search_banner_'+type)
).evaluate(vars);
};
this.initFilledBannersData=function(block){
if(block&&!block.filled_banners_data){
block.filled_banners_data={
text:0,
graph:0,
code:0
};
}
};

this.insertNonTextBlock=function(block){
if(_this.Blocks.checkType(block,'hyper')||_this.Blocks.checkType(block,'price_hyper')){
return;
}
this.initFilledBannersData(block);
arguments.callee.blocksHandled=arguments.callee.blocksHandled||[];
if(Begun.Utils.in_array(arguments.callee.blocksHandled,block)){
return;
}else{
arguments.callee.blocksHandled.push(block);
}

var feed=_this.getFeed();

if(feed&&!feed.code_patched){
if(feed.code&&feed.banners&&!feed.banners.code){
feed.banners.code=feed.code;
}
feed.code_patched=true;
}
var block_id=block.id;
var codes=this.getBannersByBlockId(block_id,'code');
var graphs=this.getBannersByBlockId(block_id,'graph');

if(codes){
var code,i,l=codes.length,
dot=/\./g,
acSrc=new RegExp([
'\\ssrc=[\'"].*?\\b',
this.Strings.urls.hostname.replace(dot,'\.'),
'/',
this.Strings.urls.ac_filename.replace(dot,'\.'),
'\\b.*?[\'"]'
].join(''));

for(var i=0;i<l;i++){
code=codes[i].js;

if(null!=codes&&code.length){
if(code.match(acSrc)){
code=code.replace(acSrc,'');
Begun.Utils.evalScript(code);
document.write('<script type="text/javascript">Begun.Autocontext.init();</script>');
}else{
Begun.Utils.evalScript(code);
}
block.filled_banners_data.code++;
block.nonTextBannersInserted=true;
}
}
}
var type=block&&block.options&&block.options.dimensions&&block.options.dimensions.type;
if(graphs){
for(var i=0,l=graphs.length;i<l;i++){
if(graphs[i].loaded){
continue;
}

if(block.options.view_type&&(block.options.view_type.indexOf('Graph')!=-1||block.options.view_type.indexOf('BrandRich')!=-1)){
var blockId=block.id;
var waiter=_this.sliderWaiters[blockId]=Begun.Utils.createWaiter(
_this.printSliderBlock,_this
);
waiter(block);

if(
!arguments.callee.top_mobile_inserted
&&block_id==BLOCK_ID_TOP_MOBILE
&&Begun.Browser.getUaType()!==UA_DESKTOP
){
_this.prepareTopMobileBlock(block.id);
arguments.callee.top_mobile_inserted=true;
}

var size=_this.getGraphDimensions(graphs[i].view_type);

var html=_this.getGraphHTML(graphs[i],function(){
if(window.begunJsBannerString){
var elem=_this.Blocks.getDomObj(block.id);
elem.innerHTML=window.begunJsBannerString;
}
},size.width,size.height,block_id);

block.filled_banners_data.graph++;
block.nonTextBannersInserted=true;
graphs[i].loaded=true;

var block_place=_this.Blocks.getDomObj(block_id);
if(html&&block_place){
block_place.innerHTML=html;

return;
}
}
}
}
if(!arguments.callee.top_mobile_inserted&&block_id==BLOCK_ID_TOP_MOBILE&&Begun.Browser.getUaType()!==UA_DESKTOP&&this.getBannersByBlockId(BLOCK_ID_TOP_MOBILE,'autocontext').length){
_this.prepareTopMobileBlock(block_id);
arguments.callee.top_mobile_inserted=true;
}
};

this.bindJsBanner=function(){
var _this=this,
observer=this.Callbacks,
undefined;

observer.register({
'jsBanner':{
'BrandRich':function(params){
observer.unregister('jsBanner','BrandRich');

Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
waiter(undefined,undefined,params,Begun.Slider);
}
);

if(!('Slider'in Begun)){
Module.baseLoad('auto_zoom_slider.js');
}
}
}
});
};

this.getGraphDimensions=function(viewType){
var size=viewType.match(/(\d+)x(\d+)/)||[null,'0','0'];

return{
size:size[0],
width:size[1],
height:size[2]
};
};

this.getCloseButton=function(block_id){
return _this.isMobileBottomBlock(block_id)?(new Begun.Template(_this.Tpls.getHTML('close_button'))).evaluate({'block_id':block_id}):'';
};
this.prepareTopMobileBlock=function(block_id){
try{
var vars={id:_this.Strings.css.block_prefix+block_id};
var block_wrapper=top.document.getElementById('begun_top_mobile_block_wrapper');
if(!block_wrapper){
var bo=top.document.getElementsByTagName('BODY');
var block_wrapper=top.document.createElement('div');
block_wrapper.id='begun_top_mobile_block_wrapper';
if(_this.isMobileBottomBlock(block_id)){
block_wrapper.className='begun_top_mobile_bottom';
var isViewportSet=(function(){
var meta_tags=document.getElementsByTagName('meta');
for(var i=0;i<meta_tags.length;i++){
if(meta_tags[i].name&&meta_tags[i].name.toLowerCase()=='viewport'&&meta_tags[i].content){
return true;
}
}
return false;
})();
var recalcMobileBlock=function(isViewportSet){
var block=Begun.$('begun_top_mobile_block_wrapper');
if(block&&block.childNodes.length){
var coef=document.documentElement.clientWidth/(window.orientation==0||window.orientation==180?window.innerWidth:window.innerHeight);
block.style.webkitTextSizeAdjust=100/(isViewportSet?1:coef*0.25)+'%';
Begun.Utils.setStyle(block,"width",window.innerWidth+"px");
Begun.Utils.setStyle(block,"left",window.scrollX+"px");
Begun.Utils.setStyle(block,"top",window.innerHeight+window.pageYOffset-block.offsetHeight+"px");
}
};
Begun.Utils.addEvent(window,'scroll',function(){recalcMobileBlock(isViewportSet)});
Begun.Utils.addEvent(window,'load',function(){recalcMobileBlock(isViewportSet)});
}
bo[0].insertBefore(block_wrapper,bo[0].firstChild);
}
block_wrapper.innerHTML=(new Begun.Template(_this.Tpls.getHTML('blck_place'))).evaluate(vars);
}catch(e){}
};
this.isOldBlock=function(){
var isPadNew=function(params){
if(!params||!window.begun_auto_pad){
return false;
}
return Begun.Utils.in_array(params.split(','),window.begun_auto_pad);
};
if(typeof _this.responseParams['old_blocks']!=="undefined"&&Number(_this.responseParams['old_blocks'])!=0&&typeof begunAutoRun=='function'){
var feed=_this.getFeed();
if(feed&&feed.cookies&&feed.cookies.js_force_new_pads&&isPadNew(feed.cookies.js_force_new_pads)){
return false;
}
return true;
}
return false;
};
this.renderOldBlock=function(){
if(_this.isOldBlock()){
begunAutoRun();
return true;
}
return false;
};

this.loadFeedDone=(function(_this){
var extendVisualOptions=function(newVisualOptions){
Begun.extend(this.options.visual,newVisualOptions);
};

var setBlockBannerComponents=function(componentsParams){
for(var param in componentsParams){
if(componentsParams.hasOwnProperty(param)){
if(typeof this.options.visual[param]!=="object"){
this.options.visual[param]={};
}
if(!componentsParams[param]){
this.options.visual[param]["display"]="none";
}else{
this.options.visual[param]["display"]="";
}
}
}
};

var includeIntegrationScripts=function(scripts){
for(var j=0;j<scripts.length;j++){
Begun.Utils.includeScript(
new Begun.Template(
_this.Strings.urls.base_scripts_url+_this.Strings.urls.integration
).evaluate({name:scripts[j]}),
"write"
);
}
};

var loadToolbar=function(feed){
if(feed.debug&&feed.debug.request){
Module.baseLoad('toolbar.js');
_this.unhandledDebugs.push(feed.debug);
delete feed.debug;
_this.begunToolbarLoaded();
}
};

var normalize=function(feed){
var GRAPH='graph';

var banners=feed.banners.autocontext,
graphBanners=[],
banner,viewType,i;

for(i=banners.length-1;i>=0;i--){
banner=banners[i];
if(banner){
viewType=banner.view_type||'';
if(viewType.toLowerCase().indexOf(GRAPH)>=0){
banners.splice(i,1);
graphBanners.push(banner);
}
}
}

graphBanners.reverse();
var graphSection=feed.banners.graph;
if(!graphSection||!graphSection.length){
feed.banners.graph=graphBanners;
}else{
graphSection.push.apply(
graphSection,graphBanners
);
}
};

return function(){
var feed=window.begunAds;

if(!feed){
Begun.Error.send(
'Attempted to load an undefined feed.',
document.URL,-1
);
return null;
}

normalize(feed);

this.links_parsed=false;

this.Callbacks.dispatch('feed','load',this,[feed]);

var feedParams=feed.params||{},
isExtraBlock=false,
block,options,banner,i;

var replaceBlockTypeRich=function(options){
if(options.dimensions.type.toLowerCase()=='rich'){
options.dimensions.type='240x400';
if(typeof options.view_type=='string'&&options.view_type.length>0){
options.view_type+=',rich';
}else{
options.view_type='rich';
}
}
};

for(i=0;feed.blocks&&i<feed.blocks.length;i++){
block=feed.blocks[i];
options=block.options;

if(block){
block.setVisualOptions=extendVisualOptions;

if(
options&&
typeof block.options.json=="object"&&
typeof block.options.json.banner_components=="object"
){
setBlockBannerComponents.call(block,block.options.json.banner_components);
}

block.setBannerComponents=setBlockBannerComponents;
_this.initFilledBannersData(block);

if(
options&&
options.dimensions&&
options.dimensions.type
){
replaceBlockTypeRich(options);
ExtBlockTypes.load("begun_tpl_block_"+options.dimensions.type);
}

if(this.isFakeBlockId(block.id)&&window.begun_block_id==block.id){
block.id=this.lastBlockId;
isExtraBlock=true;
}
}
}

if(isExtraBlock){
for(var bannersType in feed.banners){
for(i=0;i<feed.banners[bannersType].length;i++){
banner=feed.banners[bannersType][i];
if(banner.block_id==window.begun_block_id){
banner.block_id=this.lastBlockId;
}
}
}
window.begun_block_id=this.lastBlockId;
}

if(
window.begun_extra_block&&
window.begun_extra_block.options&&
window.begun_extra_block.options.dimensions&&
window.begun_extra_block.options.dimensions.type
){
replaceBlockTypeRich(window.begun_extra_block.options);
ExtBlockTypes.load("begun_tpl_block_"+window.begun_extra_block.options.dimensions.type);
}

if("string"===typeof feedParams.add_integrations){
var addIntegrations=feedParams.add_integrations.replace(/\s+/g,"");
if(addIntegrations){
includeIntegrationScripts(addIntegrations.split(","));
}
}

if(typeof Begun.Browser!='undefined'){
Begun.Browser.getUaType=function(){
return feedParams.is_mobile||0;
};
}


this.excludeFakeBanners(feed,'graph');
this.excludeFakeBanners(feed,'autocontext');


loadToolbar(feed);


this.setFeed(feed);

Begun.extend(_this.responseParams,_this.getFeed()&&_this.getFeed().params||{});
if(!_this.renderOldBlock()){
_this.getLoadingStrategy().parseFeed();

var visualOptions,j;

block=_this.Blocks.getBlockById(BLOCK_ID_TOP_MOBILE);
if(block){
for(j=0;j<_this.getBlocks().length;j++){
if(BLOCK_ID_TOP_MOBILE!==_this.getBlocks()[j].id){
visualOptions={};
Begun.extend(visualOptions,_this.getBlocks()[j].options.visual,true);
Begun.extend(visualOptions,block.options.visual,true);
block.options.visual=visualOptions;
if(block.options.visual.block&&block.options.visual.block.backgroundColor.toLowerCase()=='transparent'){
block.options.visual.block.backgroundColor='#FFF';
if(!block.options.visual.block_hover){
block.options.visual.block_hover={};
}
block.options.visual.block_hover.backgroundColor='#FFF';
block.options.visual.title.color='#0066DF';
}
break;
}
}
_this.insertNonTextBlock(block);
}

_this.draw();
}
};
}(this));
this.printBlockPlace=function(block_id){
var vars={id:_this.Strings.css.block_prefix+block_id};
var tmpl=_this.Tpls.getHTML('blck_place');

if(document.body){
document.write((new Begun.Template(tmpl)).evaluate(vars));
}else{
document.write("<body>"+(new Begun.Template(tmpl)).evaluate(vars)+"</body>");
}
};
this.printDefaultStyle=function(){
Begun.Utils.includeStyle(_this.Tpls.getCSS('default'),'write');
};
var getBGColor=function(block){
var bgcolor=Begun.Utils.getStyle(block,'background-color');
while(bgcolor=='transparent'){
if(block.nodeName=='BODY'){
var body_bg=Begun.Utils.getStyle(block,'background-color');
if(body_bg=='transparent'){
bgcolor='#FFFFFF';
}else{
bgcolor=Begun.Utils.getStyle(block,'background-color');
}
break;
}
block=block.parentNode;
bgcolor=Begun.Utils.getStyle(block,'background-color');
}
return bgcolor;
};
this.getLogoColor=function(styles,block_id){
var default_logo_color=_this.Strings.css.logo_color,bgColor,
alternativeColor="#ffffff";

var toNumbers=function(str){
var ret=[];
str.replace(/(..)/g,function(str){
ret.push(parseInt(str,16));
});
return ret;
};

var areColorsTooClose=function(c1,c2,delta){
for(var i=0;i<arguments.length;i++){
if(0==arguments[i].indexOf('#')){
arguments[i]=toNumbers(arguments[i].slice(1));
}else{
return false;
}
}
delta=delta||160;
return(Math.sqrt((c1[0]-c2[0])*(c1[0]-c2[0])+(c1[1]-c2[1])*(c1[1]-c2[1])+(c1[2]-c2[2])*(c1[2]-c2[2]))<delta);
};

if(styles.block){
bgColor=styles.block.backgroundColor||getBGColor(_this.Blocks.getDomObj(block_id));
if(areColorsTooClose(bgColor,default_logo_color)){
return alternativeColor;
}
}
return default_logo_color;
};
var prepareColorStyles=function(styles){
var checkColorDef=function(obj,prop){
if(obj!==null&&typeof obj!=="undefined"){
if(obj[prop]===""){
obj[prop]="transparent";
}
}
}

var checkBgColor=function(obj){
checkColorDef(obj,"backgroundColor");
}

var checkBorderColor=function(obj){
checkColorDef(obj,"borderColor");
}

var mkTransparentBordersForIE=function(obj){
if(obj!==null&&typeof obj!=="undefined"){
obj.filter="font-family:inherit;";
if(Begun.Browser.IE&&Begun.Browser.less(7)&&obj.borderColor&&(obj.borderColor.toLowerCase()=='transparent'||obj.borderColor=='')){
obj.borderColor="white";
obj.filter="filter:chroma(color=white);";
obj.transparentBorders='transparentBorders';
}
}
}

checkBgColor(styles.block_hover);
checkBorderColor(styles.block_hover);

checkBgColor(styles.block);
checkBorderColor(styles.block);

mkTransparentBordersForIE(styles.block);
mkTransparentBordersForIE(styles.block_hover);
};
this.printBlockStyle=function(block_id,styles,pad){
styles=styles||{};
var vars={};
var block=_this.Blocks.getBlockById(block_id,false,pad.pad_id);
vars.block_id=block_id||-1;
vars.phone_margin_top=1;
vars.phone_margin_top=styles.domain&&styles.domain.fontSize?styles.domain.fontSize-9:1;
vars.block_logo_color=this.getLogoColor(styles,block_id);
prepareColorStyles(styles);
for(var key in styles){
if(styles[key]&&styles.hasOwnProperty&&styles.hasOwnProperty(key)){
for(var key2 in styles[key]){
if(styles[key][key2]&&styles[key].hasOwnProperty&&styles[key].hasOwnProperty(key2)){
vars[key+':'+key2]=typeof styles[key][key2]=='number'?styles[key][key2]+'px':styles[key][key2];
}
}
}
}
var css_text=(new Begun.Template(_this.Tpls.getCSS('block'))).evaluate(vars);
css_text+=(new Begun.Template(_this.Tpls.getCSS('block_'+block.options.dimensions.type.toLowerCase()))).evaluate(vars);
var css_text_for_ie=(new Begun.Template(_this.Tpls.getCSS('forOperaIE'))).evaluate(vars);
if(Begun.Browser.IE||Begun.Browser.Opera){
css_text+=css_text_for_ie;
}
if(block_id==BLOCK_ID_TOP_MOBILE){
Begun.Utils.includeStyle(css_text,'append','begun-block-css-'+block_id,top);
}else{
Begun.Utils.includeStyle(css_text,'append','begun-block-css-'+block_id);
}
};
this.isFeedStarted=function(){
return!!_this.getPad().feed_started;
};
this.setFeedStarted=function(){
_this.getPad().feed_started=true;
};
this.getBannerIndex=function(pad_id,section,banner_id){
if(!banner_id){
return _this.getPad(pad_id).banner_index;
}else{
section=section||'autocontext';
var banner_index=0;
var banner;
while(banner=_this.getBanner(section,banner_index,pad_id)){
if(banner.banner_id==banner_id){
return banner_index;
}
banner_index++;
}
}
};
this.setBannerIndex=function(index,pad_id){
_this.getPad(pad_id).banner_index=index;
};
this.incBannerIndex=function(pad_id){
_this.setBannerIndex(_this.getBannerIndex(pad_id)+1,pad_id);
};
this.resetBannerIndex=function(pad_id){
_this.setBannerIndex(0,pad_id);
};
this.registerShownBanner=function(shownBanner){
var bannerId=shownBanner&&shownBanner.banner_id;
if(!bannerId){
return;
}
if(!_this.banners){
_this.banners=[bannerId];
}else{
_this.banners.push(bannerId);
}
};
this.getShownBanners=function(){
return _this.banners;
};
this.getPad=function(pad_id){
return _this.Pads.getPad(pad_id||window.begun_auto_pad);
};

this.getFeed=function(pad_id){
var pad=_this.getPad(pad_id);
if(pad){
return pad.feed;
}
};

this.setFeed=function(feed,pad_id){
this.getPad(pad_id).feed=feed;
};

this.getBlock=function(index,pad){
if(typeof pad==="undefined"){
pad=_this.getPad();
}
var padBlocks=pad.blocks;
if(padBlocks.length>index){
return padBlocks[index];
}else{
return null;
}
};
this.getBlocks=function(pad_id){
var blocks=[];
if(pad_id){
blocks=_this.getPad(pad_id).blocks;
}else{
var pads=_this.Pads.getPads();
for(var i=0,l=pads.length;i<l;i++){
for(var j=0,n=pads[i].blocks.length;j<n;j++){
blocks.push(pads[i].blocks[j]);
}
}
}
return blocks;
};
this.getBanner=function(type,index,pad_id){
if(!_this.getFeed(pad_id)||typeof _this.getFeed(pad_id).banners==="undefined"||
typeof _this.getFeed(pad_id).banners[type]==="undefined"||
typeof _this.getFeed(pad_id).banners[type][index]!=="object"){
return null;
}
var banner=_this.getFeed(pad_id).banners[type][index];
banner.setImages=function(newImages){
if(typeof this.images==="undefined"){
this.images={};
}
Begun.extend(this.images,newImages);
};
return banner;
};
this.getBanners=function(pad_id){
var feed=_this.getFeed(pad_id);
return feed&&feed.banners;
};
this.getBannersByBlockId=function(block_id,type,pad_id){
var i=0;
var obj=[];
var banner=null;
while(banner=_this.getBanner(type,i,pad_id)){
if(banner.block_id==block_id){
obj[obj.length]=banner;
}
i++;
}
return obj;
};
this.getBannersByViewType=function(block_id,type,view_type){
var i=0;
var obj=[];
var banner=null;
while(banner=_this.getBanner(type,i)){
if(banner.view_type.toLowerCase()==view_type.toLowerCase()){
obj[obj.length]=banner;
}
i++;
}
return obj;
};
this.getRichPictureSrc=function(banner){
var banner_id=banner.banner_id+'';
if(_this.Strings.urls.rich_picture_big&&_this.Strings.urls.rich_picture_small&&banner_id){
var small=(new Begun.Template(_this.Strings.urls.rich_picture_small)).evaluate({banner_id:banner_id});
var big=(new Begun.Template(_this.Strings.urls.rich_picture_big)).evaluate({banner_id:banner_id});
return{
small:small,
big:big
};
}
var protocol=Begun.Scripts.getConformProtocol();
var src=_this.responseParams['thumbs_src']?protocol+'//'+_this.responseParams['thumbs_src']+'/':_this.Strings.urls.thumbs;
var src_s;
var src_b;
if(banner_id&&banner_id.length>3){
src+='rich/';
src+=banner_id.charAt(banner_id.length-2);
src+='/'+banner_id.charAt(banner_id.length-1);
src+='/'+banner_id;
src_s=src+'s';
src_b=src+'b';
}else{
src_s=_this.Strings.urls.blank;
src_b=src_s;
}
if(banner.images&&banner.images.richpreview){
src_s=banner.images.richpreview;
}
if(banner.images&&banner.images.rich){
src_b=banner.images.rich;
}
return{
small:src_s,
big:src_b
};
};
this.getThumbSrc=function(banner){
return banner.images&&banner.images.thematic;
};
this.getFaviconSrc=function(banner){
return banner.images&&banner.images.favicon;
};
this.getBannerContacts=function(banner,block,fullDomain,pad_id,section,banner_id){
var result=this.getBannerCardPPcallData(banner,block,pad_id,section,banner_id);
var banner_contacts_names=result.is_url_exist?['domain','geo']:['geo'];
return result.banner_contacts.concat(this.getBannerDomainGeoHTML(banner,block,banner_contacts_names,fullDomain));
};
this.getBannerCardPPcallData=function(banner,block,pad_id,section,banner_id){
var banner_contacts=[];
var is_url_exist=true;
var cards_mode=banner['cards_mode'];
var vars={};

function _card(){
var tmpl;

vars.card_text=_this.Strings.contacts.card;
vars.url=_this.addMisc2URL(block.options.misc_id,banner.card);

vars.phone=(new Begun.Template(
_this.Tpls.getHTML('bnnr_phone')
)).evaluate(vars);
tmpl='bnnr_card';

banner_contacts.push(
(new Begun.Template(
_this.Tpls.getHTML(tmpl)
)).evaluate(vars)
);
}

if(cards_mode=='Card'){
_card();
is_url_exist=false;
}else if(cards_mode=='Card, Url'){
_card();
}
return{
banner_contacts:banner_contacts,
is_url_exist:is_url_exist
};
};
this.getBannerDomainGeoHTML=function(banner,block,banner_contacts_names,fullDomain){
var banner_contacts=[];
var i=0;
var banner_contacts_name=null;
var vars={};
while(banner_contacts_name=banner_contacts_names[i]){
vars[banner_contacts_name]=banner[banner_contacts_name];
vars.status=banner.status;
vars.url=_this.addMisc2URL(block.options.misc_id,banner.url);
vars.fullDomain=fullDomain;
if(banner_contacts_name==='domain'&&banner.bottom&&banner.bottom.length){
vars.domain=banner.bottom;
}
if(vars[banner_contacts_name]){
banner_contacts.push((new Begun.Template(_this.Tpls.getHTML('bnnr_'+banner_contacts_name))).evaluate(vars));
}
i++;
}
return banner_contacts;
};
this.addMisc2URL=function(misc_id,url){
return(misc_id>0?url+'&misc2='+(Number(misc_id)<<8):url);
};
this.clickBanner=function(click_event,orig_elem){
click_event=click_event||window.event;
if(click_event.done){
return;
}
var curr_elem=click_event.target||click_event.srcElement;
var isInsideTag=function(child_elem,parent_tag){
var child_elem_parent=child_elem;
do{
if(child_elem_parent.tagName&&child_elem_parent.tagName.toUpperCase()==parent_tag.toUpperCase()){
return true;
}
}while(child_elem_parent=child_elem_parent.parentNode);
return false;
};

if(curr_elem.tagName.toUpperCase()=='A'||isInsideTag(curr_elem,'A')){
click_event.done=true;
_this.Callbacks.dispatch('banner','click',curr_elem);
_this.clickHandler(orig_elem).apply(_this);
}else if(orig_elem.getAttribute('_url')){
var anyLink=curr_elem.getElementsByTagName("a")[0];
if(anyLink&&typeof anyLink.click!=="undefined"){
if(typeof click_event.preventDefault!=="undefined"){
click_event.preventDefault();
}else{
click_event.returnValue=false;
}
if(typeof click_event.stopPropagation!=="undefined"){
click_event.stopPropagation();
}else{
click_event.cancelBubble=true;
}
anyLink.click();
}else{
_this.Callbacks.dispatch('banner','click',curr_elem);
_this.clickHandler(orig_elem).apply(_this);
window.open(orig_elem.getAttribute('_url'));
}
}
};

this.prepareBannerMode=function(banner){
if(!banner||(!banner['url']&&!banner['card'])){
return null;
}

var possible_cards_modes=['Card, Url','Card','Url'];
if(
(!banner['cards_mode'])||
!Begun.Utils.in_array(possible_cards_modes,banner['cards_mode'])
){
banner['cards_mode']='Card, Url';
}
if(!banner['url']&&banner['card']){
banner['cards_mode']='Card';
}
if(banner['url']&&!banner['card']){
banner['cards_mode']='Url';
}
if(banner['cards_mode']=='Card'){
banner['url']=banner['card'];
}
return banner;
};

this.sliderWaiters={};

this.printSliderBlock=function(block,bannerUrl,sliderParams,_){
var blockType=this.Blocks.getBlockType(block),
blockDiv=this.Blocks.getDomObj(block.id),
blockId=block.id,
sliderBlockId=sliderParams.block_id;


delete this.sliderWaiters[blockId];

var callbackName='sliderLoad_'+Begun.Utils.getRandomId();

this[callbackName]=function(){
var sliderBlock,thumbsSrc,params,key,css,bannersHtml,
blockTmpl,ac,interval;
Begun.Utils.forEach(window.begunAds.blocks,function(block){
if(block.id===sliderBlockId){
sliderBlock=block;
return false;
}
});

if(!sliderBlock){
return;
}

thumbsSrc=Begun.Scripts.getConformProtocol()+"//"+_this.responseParams['thumbs_src'];

params={
block_id:blockId,
base_scripts_url:this.Strings.urls.base_scripts_url
};

for(key in sliderParams.images){
params[key]=sliderParams.images[key]?thumbsSrc+sliderParams.images[key]:"";
}

if(sliderParams.options){
Begun.extend(params,sliderParams.options);
}

blockType+='_'+params.template

css=new Begun.Template(
this.Tpls.getCSS(blockType)
).evaluate(params);

Begun.Utils.includeStyle(css);

bannersHtml=this.getSliderBanners(sliderBlock,blockType);

blockTmpl=new Begun.Template(
this.Tpls.getHTML('block_'+blockType)
);
blockDiv.innerHTML=blockTmpl.evaluate({
block_id:blockId,
banners:bannersHtml,
url:bannerUrl,
template:params.template
});


ac=this;
interval=setInterval(function(){
if(blockDiv.clientWidth&&blockDiv.clientHeight){
clearInterval(interval);
ac.initZoomSlider(block,params.slider_style);
}
},Begun.DOM_TIMEOUT);
};

var params=Begun.extend({},this.requestParams);
params.pad_id=sliderParams.pad_id;
params.ropad_id=this.getPad().pad_id;
params.block_id=sliderBlockId;
params.jscall=callbackName;

var feedUrl=this.Strings.urls.daemon+Begun.Utils.toQuery(params);

Begun.Utils.includeScript(feedUrl);
};

this.getSliderBanners=function(block,blockType){
var banners;
try{
banners=window.begunAds.banners.autocontext;
}catch(e){}

var bannersHtml=[],banner;
if(banners){
var len=block.options.banners_count,i=0;
while(i<len){
banner=banners[i];
if(banner&&banner.block_id===block.id){
bannersHtml.push(
this.getSliderBannerHTML(banner,blockType)
);
}
i+=1;
}
}
return bannersHtml.join('');
};

this.getSliderBannerHTML=function(banner,blockType){
var vars={

small_img_src:banner.images.rich,
big_img_src:banner.images.rich,
title:banner.title,
descr:banner.descr,
price:banner.bottom?banner.bottom+" <i>р.</i>":banner.bottom,
url:banner.url
};

var bannerType='banner_'+blockType;

return new Begun.Template(
this.Tpls.getHTML(bannerType)
).evaluate(vars);
};

var getAddress=function(poi){
var address=[],
parts=[
poi.office,
poi.building,
poi.block,
poi.house,
poi.street,
poi.city
],
i=parts.length,
part;

while(i--){
part=parts[i];
if(null!=part&&part.length){
address.push(part);
}
}

return address.join(', ');
};

this.getBannerHTML=function(banner,block,block_banner_count){
banner=this.prepareBannerMode(banner);

if(!banner){
return'';
}

if(banner.domain){
banner.domain=Begun.Utils.punycode.toUnicode(banner.domain);
banner.domain=banner.domain.replace(/[<]wbr[>]/ig,'');
banner.fullDomain=banner.domain;
banner.status='http://'+banner.domain+'/';
banner.domain=Begun.Utils.unescapeTruncateDomain(banner.domain);
}else{
banner.fullDomain=banner.domain=banner.status='';
}
banner.domain=banner.domain.replace(/\./g,'.<wbr>');
banner.title=banner.title.replace(/\,/g,',<wbr>');
banner.title=banner.title.replace(/-<(i|b)>/g,'-<wbr><$1>');
var banner_contacts=_this.getBannerContacts(banner,block,banner.fullDomain);
var vars={};
Begun.extend(vars,banner);
vars.styleTitle=vars.styleText=vars.styleContact="";
if(block.options.visual.title&&block.options.visual.title.display&&block.options.visual.title.display=="none"){
vars.styleTitle=" style=\"display: none\"";
}
if(block.options.visual.text&&block.options.visual.text.display&&block.options.visual.text.display=="none"){
vars.styleText=" style=\"display: none\"";
}
if(block.options.visual.contact&&block.options.visual.contact.display&&block.options.visual.contact.display=="none"){
vars.styleContact=" style=\"display: none\"";
}
vars.url=_this.addMisc2URL(block.options.misc_id,banner.url);
vars.cross=_this.isTurnOff(block)?_this.Tpls.getHTML('bnnr_close'):'';
vars.onclick=_this.isTurnOff(block)?'':_this.Strings.js.banner_onclick;
vars.block_id=block.id;
vars.banner_id=banner.banner_id;
vars.id=block_banner_count||0;
vars.descr=vars.descr.replace(/(\,|\.|\?|\!|\:)(\S\D)/g,'$1 $2');
vars.descr=vars.descr.replace(/-<(i|b)>/g,'-<wbr><$1>');
vars.banner_width=Math.round(100/Number(_this.getActualBlockBannersCount(block)))+'%';
vars.bnnr_warn=banner.constraints?(new Begun.Template(_this.Tpls.getHTML('bnnr_warn'))).evaluate({
type:banner.constraints.toLowerCase(),
text:_this.warningModule.getText(banner.constraints.toLowerCase())
}):'';
if(_this.Blocks.checkType(block,'square')&&block.options.json&&block.options.json.col){
vars.banner_width=Math.round(100/Number(block.options.json.col))+'%';
}
vars.gifts_link=(new Begun.Template(_this.Tpls.getHTML('gifts_link'))).evaluate({
url:this.Strings.urls.gifts_link
});
var is_use_rich='';

vars.mobileIcon='';
vars.favicon='';
vars.thumb='';
vars.picture='';

if(Begun.Browser.getUaType()!==UA_DESKTOP){
vars.mobileIcon=(new Begun.Template(_this.Tpls.getHTML('bnnr_mobile_icon'))).evaluate({
src:this.Strings.urls.mobile_icon
});
if(_this.checkBannerViewType(banner,'offerrich')||_this.checkBannerViewType(banner,'offerrichindirect')){
is_use_rich='_rich';
var pictures=_this.getRichPictureSrc(banner);
vars.picture=(new Begun.Template(_this.Tpls.getHTML('bnnr_picture'))).evaluate({src:_this.isRichExpanded(block)?pictures.big:pictures.small,big_photo_src:pictures.big,url:banner.url});
}
}else if(Number(block.options.show_favicons)){
vars.favicon=(new Begun.Template(_this.Tpls.getHTML('bnnr_favicon'))).evaluate({
src:_this.getFaviconSrc(banner)
});
}else if(!vars.favicon){
if(
_this.checkBannerViewType(banner,'rich')||
_this.checkBannerViewType(banner,'pseudorich')||
_this.checkBannerViewType(banner,'offerrich')||
_this.checkBannerViewType(banner,'offerrichindirect')||
_this.isRichExpanded(block)
){
var pictures=_this.getRichPictureSrc(banner);
vars.picture=(new Begun.Template(_this.Tpls.getHTML('bnnr_picture'))).evaluate({src:_this.isRichExpanded(block)?pictures.big:pictures.small,big_photo_src:pictures.big,url:banner.url});

is_use_rich='_rich';
if(_this.isRichExpanded(block)){
is_use_rich+='_exp';
}else if(_this.isRichMini(block)){
is_use_rich+='_mini';
}
}else{
vars.thumb=Number(block.options.show_thumbnails)?(new Begun.Template(_this.Tpls.getHTML('bnnr_thumb'))).evaluate({
url:banner.url,
src:_this.getThumbSrc(banner)
}):'';
vars.picture=vars.thumb;
}
}

if(_this.isRichMini(block)){
vars.contact='';
}else{
vars.contact=banner_contacts.join(_this.Tpls.getHTML('bnnr_glue'));
}

if(_this.checkBannerViewType(banner,'offer')){
is_use_rich='_offer';
}

if(banner.view_type.toLowerCase().indexOf('offer')>-1&&banner.bottom){
var parsedPrice=banner.bottom.split('|');
vars.contact=(new Begun.Template(_this.Tpls.getHTML('bnnr_domain'))).evaluate(vars);
vars.price=parsedPrice[0];
vars.offers=parsedPrice[1]?(new Begun.Template(
_this.Tpls.getHTML('offer_stores')
)).evaluate({count:parsedPrice[1]}):'';
vars.offers_link=banner.card||'';
}

var bannerType='banner_'+
block.options.dimensions.type.toLowerCase()+
is_use_rich;

if(bannerType=='banner_price_search_rich'){
vars.price=vars.price.replace(' &#x440;.','');
}

if(banner.poi&&(typeof begun_geotext==='function')){
var poiLen=banner.poi.length,
addressLines=[],
current;
for(current=0;current<poiLen;current++){
addressLines.push(getAddress(banner.poi[current]));
}
if(0 in addressLines){
vars.geoAdd=(new Begun.Template(
_this.Tpls.getHTML('bnnr_geo_add')
)).evaluate({address:addressLines.join('<br>')});
}
}
return(new Begun.Template(
_this.Tpls.getHTML(bannerType)
)).evaluate(vars);
};

this.checkBannerViewType=function(banner,viewtype){
return Begun.Utils.inList(banner.view_type,viewtype);
};

this.addBannerViewType=function(banner,viewtype){
if(!this.checkBannerViewType(banner,viewtype)){
banner.view_type+=(banner.view_type?',':'')+viewtype;
}
};
this.removeBannerViewType=function(banner,viewtype){
if(this.checkBannerViewType(banner,viewtype)){
var reg=new RegExp('(,?\\s?|^)'+viewtype+'(,?\\s?|$)');
banner.view_type=banner.view_type.replace(reg,',');
}
};

this.bannersContainViewType=function(view_type,pad_id,section,block_id){
if(null==section){
section='autocontext';
}

var banners;

if(null==block_id){
banners=this.getBanners(pad_id);

if(banners){
banners=banners[section];
}
}else{
banners=this.getBannersByBlockId(block_id,section,pad_id);
}

return Begun.Utils.in_array(
banners,
function(item){
return this.checkBannerViewType(item,view_type);
},
this
);
};

this.getTableWithAds=function(blockId){
var getSingleTable=function(id){
var element=_this.Blocks.getDomObj(id);
if(!element){
return undefined;
}
var tables=element.getElementsByTagName("table");
for(var i=0;i<tables.length;i++){
if(tables[i].className&&tables[i].className.indexOf("begun_adv_table")>-1){
return tables[i];
}
}
return undefined;
};
switch(typeof blockId){
case"number":
case"string":
return getSingleTable(blockId);
default:
var blocks=_this.getBlocks();
var res=[];
for(var i=0;i<blocks.length;i++){
var tbl=getSingleTable(blocks[i].id);
if(tbl){
res.push(tbl);
}
}
return(res.length>0?res:undefined);
}
};

this.updateUrlParamInTd=(function(){
var updateParamInLink=function(td,link,param,value){
var hrefText=link.getAttribute('href');

if(hrefText.indexOf('http://')==-1&&hrefText.indexOf('https://')==-1){
return false;
}

var newHref='';

if(hrefText.indexOf('?')===-1){
hrefText=hrefText+'?addingParams';
}

if(hrefText.indexOf('&'+param+'=')===-1){
newHref=hrefText+'&'+param+'='+value;
}else{
var firstPosition=hrefText.indexOf('&'+param+'=')+param.length+1,
lastPosition=hrefText.indexOf('&',firstPosition+1);

if(lastPosition===-1){
newHref=hrefText.substring(0,firstPosition+1)+value;
}else{
newHref=hrefText.substring(0,firstPosition+1)+value+hrefText.slice(lastPosition);
}
}


var linkText=firstText(link);

if(null==linkText){
linkText='';
}

link.setAttribute('href',newHref);


firstText(link,linkText);

return newHref;
};

var firstText=function(el,txt){
var fc=el.firstChild;


if(fc&&3===fc.nodeType){
if(null==txt){
return fc.nodeValue;
}else{
fc.nodeValue=txt;
}
}
};

return function(td,param,value){
var linksInTd=td.getElementsByTagName('a'),
href;
for(var i=0,len=linksInTd.length;i<len;i++){
href=updateParamInLink(td,linksInTd[i],param,value);
if(0===i){
td.setAttribute('_url',href);
}
}
};
}());

this.getBlockHTML=function(banners_html_arr,block,pad){
if(!banners_html_arr){
return'';
}
var banners_html=banners_html_arr.join('');
var logo_display='';
if(block.options&&(typeof block.options.json!='undefined')&&(typeof block.options.json.logo!='undefined')){
logo_display=(Number(block.options.json.logo))?'':'none';
}
var extended_block_class='';
if(logo_display=='none'){
extended_block_class='begun_extended_block';
}

var rich_nopics_class='';

var getMobileClass=function(){
var cls='',
ua=Begun.Browser.getUaType();

if(ua===UA_CLASSIC_MOBILE||Begun.Browser.TabletPC||ua===UA_RICH_MOBILE){
cls=_this.Strings.css.mobile_classic;
}
return cls;
};

if((_this.Blocks.checkViewType(block,'rich')||_this.Blocks.checkViewType(block,'pseudorich'))&&block.options.show_favicons!=1){
var elem=_this.Blocks.getDomObj(block.id);
if(elem){
Begun.Utils.addClassName(elem,'begun_auto_rich');

if(_this.isRichMini(block)){
Begun.Utils.addClassName(elem,'begun_rich_mini');
}
}
if(!_this.bannersContainViewType('rich',pad.pad_id,null,block.id)&&!_this.bannersContainViewType('pseudorich',pad.pad_id,null,block.id)){
rich_nopics_class=' begun_rich_nopics';
}
}

var vars={};
var block_hover_html='';
var block_opts=block.options.visual||{};
if(block_opts.block&&block_opts.block_hover&&block_opts.block_hover.backgroundColor&&block_opts.block_hover.borderColor){
vars.bgcolor_over=block_opts.block_hover.backgroundColor;
vars.brdcolor_over=block_opts.block_hover.borderColor;
vars.bgcolor_out=block_opts.block.backgroundColor||'transparent';
vars.brdcolor_out=block_opts.block.borderColor||'transparent';
vars.block_id=block.id;
block_hover_html=(new Begun.Template(_this.Tpls.getHTML('blck_hover'))).evaluate(vars);
}
var pad_id=pad.pad_id;

vars={
block_id:block.id,
block_hover:block_hover_html,
banners:banners_html,
begun_warning:banners_html.indexOf('begun_warn_message')!=-1?'begun_warning':'',
banners_count:banners_html_arr.length,

block_width:Number(block.options.dimensions.width)?Number(block.options.dimensions.width)+'px':'',
begun_url:_this.Strings.urls.begun,
price_url:_this.Strings.urls.price,
css_thumbnails:(Number(block.options.show_thumbnails)&&!Number(block.options.show_favicons)&&!getMobileClass()?_this.Strings.css.thumb:'')+rich_nopics_class,
css_mobile_class:getMobileClass(),
logo_display:logo_display,
close_button:_this.getCloseButton(block.id),
extended_block_class:extended_block_class,
transparent_borders_class:(block_opts&&((block_opts.block&&block_opts.block.transparentBorders)||(block_opts.block_hover&&block_opts.block_hover.transparentBorders)))?'transparentBorders':'',
fix_layout:(Begun.Browser.IE&&Begun.Browser.version()<8&&document.compatMode&&document.compatMode=="CSS1Compat"&&_this.Blocks.isBlockFixed(block))?_this.Strings.css.fix_layout:'',
begun_logo:(new Begun.Template(_this.Tpls.getHTML('begun_logo'))).evaluate({
src:this.Strings.urls.begun_logo_src
}),
price_logo:(new Begun.Template(_this.Tpls.getHTML('price_logo'))).evaluate({
src:this.Strings.urls.price_logo_src
}),
price_search_logo:(new Begun.Template(_this.Tpls.getHTML('price_search_logo'))).evaluate({
src:this.Strings.urls.price_search_logo_src
})
};
var block_type=block.options.dimensions.type.toLowerCase();

if(block_type=='price_composite'){
var indirectRichBanner=_this.getBannersByViewType(block.id,'autocontext','OfferRichIndirect')[0];
if(indirectRichBanner){
var topIndirectRichBanner=Begun.extend({},indirectRichBanner,true);
indirectRichBanner.url=indirectRichBanner.card;
vars.rich_indirect_banner=_this.getBannerHTML(indirectRichBanner,block);
topIndirectRichBanner.view_type='OfferIndirect';
vars.top_rich_indirect_banner=_this.getBannerHTML(topIndirectRichBanner,block);
vars.all_offers=indirectRichBanner.card;
var offerBanners=_this.getBannersByViewType(block.id,'autocontext','Offer'),
offerBannersLength=offerBanners.length,
offerBanner,
offerBannersHTML=[],
encodeElement=document.createElement('div'),
bannersCount=block.options.banners_count,
DESCR_MAX_LENGTH=42;
if(offerBannersLength){
for(var j=0;j<offerBannersLength&&j<bannersCount;j++){
offerBanner=offerBanners[j];
encodeElement.innerHTML=offerBanner.descr;
offerBanner.descr=encodeElement.innerHTML;
if(offerBanner.descr&&offerBanner.descr.length&&offerBanner.descr.length>DESCR_MAX_LENGTH){
offerBanner.descr=offerBanner.descr.substr(0,DESCR_MAX_LENGTH)+"&#8230;";
}
offerBannersHTML.push(_this.getBannerHTML(offerBanner,block));
}
vars.offer_banners=offerBannersHTML.join('');
}else{
vars.hide_offers='display:none !important;';
}
}else{
vars.hide_offers='display:none !important;';
}
if(window.block_style){
window.block_style.block_id=block.id;
var css_text=(new Begun.Template(_this.Tpls.getCSS('block_price_composite_custom'))).evaluate(window.block_style);
Begun.Utils.includeStyle(css_text,'append','begun-block-css-custom-'+block.id);
}
}

if(block_type=='price_search'){
indirectRichBanner=_this.getBannersByViewType(block.id,'autocontext','OfferRichIndirect')[0];
if(indirectRichBanner){
vars.all_offers=indirectRichBanner.card;
}
}

var tmpl=_this.Tpls.getHTML('block_'+block_type);
return(new Begun.Template(tmpl)).evaluate(vars);
};

this.clickHandler=function(targetTd){
return function(){
var nowTime=(new Date).valueOf();
this.updateUrlParamInTd(targetTd,"click_time",nowTime);
this.updateUrlParamInTd(targetTd,"frame_level",_this.requestParams.frm_level);
};
};
this.printBlock=function(banners_html,block,pad){
if(_this.isOldBlock()){
return;
}
if(banners_html.length){
var regEvents=function(){
var mouseOverHandler=function(targetTd){
return function(e){
if(!e){
var e=window.event;
}
var relTarget=e.relatedTarget||e.fromElement;
if(relTarget===targetTd){
return;
}
var tdElements=targetTd.getElementsByTagName("*");
for(var i=0;i<tdElements.length;i++){
if(tdElements[i]===relTarget){
return;
}
}
if(!arguments.callee.count){
arguments.callee.count=1;
}
var nowTime=(new Date).valueOf();
_this.updateUrlParamInTd(targetTd,"mouseover_time",nowTime);
_this.updateUrlParamInTd(targetTd,"mouseover_count",arguments.callee.count++);
};
};
var mouseDownHandler=function(targetTd){
return function(){
var nowTime=(new Date).valueOf();
_this.updateUrlParamInTd(targetTd,"mousedown_time",nowTime);
};
};
var table=_this.getTableWithAds(block.id);
if(table){
var tds=table.getElementsByTagName("td");
var showTime=(new Date).valueOf();
for(var i=0;i<tds.length;i++){
_this.updateUrlParamInTd(tds[i],"show_time",showTime);
Begun.Utils.addEvent(tds[i],"mouseover",mouseOverHandler(tds[i]));
Begun.Utils.addEvent(tds[i],"mousedown",mouseDownHandler(tds[i]));
}
}
};
var elem=_this.Blocks.getDomObj(block.id);


if(!elem){
return false;
}
this.setExtraBlockResponseParams(block);
_this.dom_change=true;
var html=_this.getBlockHTML(banners_html,block,pad),
show,showDefault;

show=showDefault=function(elem,html){
elem.innerHTML=html;
_this.dom_change=false;
regEvents();
};


if(Begun.Browser.IE){
show=function(elem,html){
var n=elem.cloneNode(true);
n.innerHTML=html;
elem.parentNode.insertBefore(n,elem);
elem.parentNode.removeChild(elem);
_this.dom_change=false;
regEvents();
};
var appendTableCell=function(tr,elem){
if(tr.offsetHeight){
var td=document.createElement('td');
tr.appendChild(td);
td.innerHTML=elem.outerHTML;
show(td.firstChild,html);
elem.parentNode.removeChild(elem);
}else{
var func=arguments.callee;
window.setTimeout(function(){
func(tr,elem);
},Begun.DOM_TIMEOUT);
}
};
var parent=null;
if((parent=elem.parentNode)&&(parent.tagName)&&(Begun.Utils.in_array(['ol','ul','li'],parent.tagName.toLowerCase()))){
window.setTimeout(function(){
var parent2=parent.parentNode;
parent2.insertBefore(elem,parent);
showDefault(elem,html);
},Begun.DOM_TIMEOUT);
}else if((parent)&&(parent=elem.parentNode.parentNode)&&(parent.tagName)){
try{
show(elem,html);
}catch(e){
switch(parent.tagName.toLowerCase()){
case'table':
var tr=document.createElement('tr');
window.setTimeout(function(){
parent.lastChild.appendChild(tr);
appendTableCell(tr,elem);
},Begun.DOM_TIMEOUT);
break;
case'tr':
window.setTimeout(function(){
appendTableCell(parent,elem);
},Begun.DOM_TIMEOUT);
break;
case'thead':
case'tbody':
case'tfoot':
var tr=document.createElement('tr');
window.setTimeout(function(){
parent.appendChild(tr);
appendTableCell(tr,elem);
},Begun.DOM_TIMEOUT);
break;
default:
_this.dom_change=false;
}
}
}else{
try{
show(elem,html);
}catch(e){
_this.dom_change=false;
}
}
}else{
show(elem,html);
}
return true;
}else{
return false;
}
};
this.hideBlock=function(block_id){
var elem=_this.Blocks.getDomObj(block_id);
if(elem){
elem.className='';
elem.innerHTML='';
}
};
this.dispatchBlockDrawCallback=function(block){
if(block&&!block.drawCallbackDispatched){
_this.Callbacks.dispatch('block','draw',_this,[block]);
block.drawCallbackDispatched=true;
this.Monitor.prepare()&&this.Monitor.count();
}
};

this.fillBlocks=(function(_this){
var repeat=function(fn){
Begun.Utils.repeat(fn,Begun.DOM_TIMEOUT);
};

var initAutoCatalog=function(block){
repeat(function(){
var css=_this.Strings.css;

if(
!_this.dom_change&&
Begun.Catalog&&
Begun.$(css.catalog_search_wrapper)&&
Begun.$(css.catalog_results_wrapper)&&
Begun.$(css.catalog_cloud_wrapper)
){
_this.initAutoCatalogBlock(block);
return true;
}
});
};

var initHypercontext=function(block,pad_id){
repeat(function(){
if(!_this.dom_change&&Begun.Hypercontext){
_this.initHypercontextBlock(block,pad_id);
return true;
}
});
};

var initPhotocontext=function(block,pad_id){
repeat(function fn(){
if(!_this.dom_change&&Begun.Photocontext){
_this.initPhotocontextBlock(block,pad_id);
return true;
}
});
};

var isValidSquareBlock=function(block){
return(
_this.Blocks.checkType(block,'square')&&
block.options.json&&
block.options.json.row&&
block.options.json.col
);
};

var addHTML=function(block,banner,banners_html,block_banner_count){
banner&&_this.Banners.infoValues.setAll(
banner.block_id,banner
);

var banner_html=_this.getBannerHTML(
banner,block,(block_banner_count+1)
);

if(isValidSquareBlock(block)){
if(!(block_banner_count%block.options.json.col)){
banner_html='<tr>'+banner_html;
}

if(!((block_banner_count+1)%block.options.json.col)){
banner_html+='</tr>';
}
}

if(banner_html){
banners_html.push(banner_html);

block.filled_banners_data.text++;

_this.Callbacks.dispatch(
'banner','draw',_this,[banner]
);

_this.registerShownBanner(banner);
}
};

var fillBlocks=function(){
var pad=this.getPad(),
pad_id=pad.pad_id,
block_index=0,
out_of_banners=false,
block;
var loadFakeBanners=function(id){
var bannerId=_this.Banners.infoValues.get(id,'fake','id');
if(bannerId){
var srcUrl=_this.Banners.infoValues.get(id,bannerId,'source');
srcUrl&&Begun.Utils.includeImage(srcUrl);
}
};

var includeRamblerCounter=function(block){
if(!block){return false;}

var type=_this.Blocks.getBlockType(block),
typesForInclude=[
'vertical',
'240x400'
];

for(var i=0,lengthTypes=typesForInclude.length;i<lengthTypes;i+=1){
if(type===typesForInclude[i]){
(new Image).src=("https:"==document.location.protocol?"https:":"http:")+"//counter.rambler.ru/top100.scn?2761206&le=1&rn="+(+new Date)+"&rf="+encodeURIComponent(document.referrer);
return true;
}
}

};

if(!fillBlocks.blocksHandled){
fillBlocks.blocksHandled=[];
}

while(
!out_of_banners&&
(block=this.getBlock(block_index,pad))
){
loadFakeBanners(block.id);
if(!this.Blocks.getDomObj(block.id)){
block_index++;

continue;
}

if(!Begun.Utils.in_array(fillBlocks.blocksHandled,block)){
this.Callbacks.dispatch(
'block','predraw',this,[block]
);

if(block.options&&block.options.visual){
this.printBlockStyle(
block.id,block.options.visual,pad
);
}

fillBlocks.blocksHandled.push(block);
}

if(block.loaded||this.Blocks.isDeleted(block)){
block_index++;

continue;
}else if(block.nonTextBannersInserted){
this.dispatchBlockDrawCallback(block);
block_index++;

continue;
}else if(Begun.Utils.inList(
block.options&&block.options.block_options,
'JSCatalog'
)){
initAutoCatalog(block);
block.loaded=true;
block_index++;

continue;
}else if(this.Blocks.checkType(block,'hyper')||this.Blocks.checkType(block,'price_hyper')){
initHypercontext(block,pad_id);
block.loaded=true;
block_index++;

continue;
}else if(this.Blocks.checkType(block,'photo')){
initPhotocontext(block,pad_id);
block.loaded=true;
block_index++;

continue;
}

var banners_html=[],
block_banner_count=0,
banner;

this.setExtraBlockResponseParams(block);

if(isValidSquareBlock(block)&&Begun.Browser.getUaType()!==UA_DESKTOP){
block.options.banners_count=1;
}

var banners_count,banner_html;

if(this.useBlockIdDistr()){
var i=0;

banners_count=this.getActualBlockBannersCount(block);

while(banner=this.getBanner(
'autocontext',i,pad_id
)){
this.Callbacks.dispatch(
'banner','predraw',this,[banner]
);

if(
banner.block_id&&
!banner.disabled&&
(this.lastBlockId&&
this.lastBlockId==block.id||
banner.block_id==block.id)
){
addHTML(
block,
banner,
banners_html,
block_banner_count
);

block_banner_count++;
}

i++;
}
}else{
banners_count=this.getActualBlockBannersCount(block);

while(block_banner_count<banners_count){
banner=this.getBanner(
'autocontext',
this.getBannerIndex(pad_id),
pad_id
)||null;

if(banner){
this.Callbacks.dispatch(
'banner','predraw',this,[banner]
);

addHTML(
block,
banner,
banners_html,
block_banner_count
);
}else{
out_of_banners=true;
break;
}

block_banner_count++;

this.incBannerIndex(pad_id);
}
}

if(
block_banner_count<banners_count&&
block_banner_count!=0&&
isValidSquareBlock(block)
){
while(block_banner_count<banners_count){
var banner_html='';

if(!(
block_banner_count%
block.options.json.col
)){
banner_html+='<tr>';
}

banner_html+='<td>&nbsp;</td>';

if(!(
(block_banner_count+1)%
block.options.json.col
)){
banner_html+='</tr>';
}

banners_html.push(banner_html);

block_banner_count++;
}
}

if(this.printBlock(banners_html,block,pad)){
includeRamblerCounter(block);
block.loaded=true;
}

this.dispatchBlockDrawCallback(block);

Module.initInBlock(block,pad);

block_index++;
}

if(!this.links_parsed){
this.parseLinks();
this.links_parsed=true;
}
};

fillBlocks.delayedCall=false;

return fillBlocks;
})(this);

this.begunToolbarLoaded=function(){
if(!Begun.Toolbar||!Begun.Toolbar.init){
return;
}
while(this.unhandledDebugs.length>0){
Begun.Toolbar.init(this.unhandledDebugs.pop());
}
};
this.nullGlobalBlockParams=function(){
window.begun_block_id=null;
window.begun_feed_source=null;
window.begun_extra_block=null;
};
this.setExtraBlockResponseParams=function(block){
block.options.show_thumbnails=typeof block.options.show_thumbnails!='number'||isNaN(block.options.show_thumbnails)?Number(_this.responseParams['thumbs']):block.options.show_thumbnails;
};
this.isMobileBottomBlock=function(block_id){
return false;

};
this.isTurnOff=function(block){
return block&&Begun.Utils.inList(block.options.block_options,'HideAd')&&!(Begun.Browser.IE&&Begun.Browser.less(7)&&!_this.Blocks.isBlockFixed(block));
};
this.isRichExpanded=function(block){
return block&&Begun.Utils.inList(block.options.block_options,'RichExpanded');
};
this.isRichMini=function(block){
if('string'===typeof block){
block=this.Blocks.getBlockById(block);
}

return block&&block.options&&Begun.Utils.inList(
block.options.block_options,'RichMini'
);
};
this.isNormalRichBanner=function(banner){
return(
banner.view_type&&
banner.view_type.toLowerCase().indexOf("rich")>-1&&
(
!banner.block_id||
!this.isRichMini(banner.block_id)
)
);
};
};

(function(Begun){
var ac=Begun.Autocontext;

ac.Monitor=new function(){
var _this=this;
this.init=function(){
var onLoad=function(){
_this.prepare()&&_this.count();
};

if(ac.domContentLoaded){
onLoad();
}else{
ac.onContent(onLoad);
}

Begun.Utils.addEvent(window,'unload',function(){
if(_this.data){
_this.sendHidden(_this.data);
}
});
Begun.Utils.addEvent(window,'scroll',function(){
_this.count();
});
Begun.Utils.addEvent(window,'resize',function(){
_this.count();
});
};

this.prepare=function(){
var pads=ac.Pads.getPads();

if(pads.length===0){
Begun.Error.send("begun_auto_pad is missing",document.URL,-1);
return;
}

for(var n=0,ln=pads.length;n<ln;n++){
for(var i=0,length=pads[n].blocks.length;i<length;i++){
var block=pads[n].blocks[i];
var dom_obj=ac.Blocks.getDomObj(block.id),
conditions=[],
banners_ids=[],
kwtypes=[];

var fakeBannerId=ac.Banners.infoValues.get(block.id,'fake','id');
if(fakeBannerId){
var fakeConditionId=ac.Banners.infoValues.get(
block.id,fakeBannerId,'condition_id'
);

if(null!=fakeConditionId){
conditions.push(fakeConditionId);
}
var fakeKwtype=ac.Banners.infoValues.get(
block.id,fakeBannerId,'kwtype'
);

if(null!=fakeKwtype){
kwtypes.push(fakeKwtype);
}
banners_ids.push(fakeBannerId);
}

if(ac.Blocks.isDeleted(block)||!dom_obj){
if(conditions.length){
block.condition_id=conditions;
block.kwtype=kwtypes;
block.banners_ids=banners_ids;
}
continue;
}
var tds=dom_obj.getElementsByTagName('td'),
tdsLen=tds.length;

block.hidden=false;
block.dom_obj=dom_obj;

if(tdsLen){
for(var k=0;k<tdsLen;k++){
var td=tds[k],
bannerId=td.getAttribute('_banner_id');

if(bannerId){
var conditionId=ac.Banners.infoValues.get(
block.id,bannerId,'condition_id'
);

if(null!=conditionId){
conditions.push(conditionId);
}
var kwtype=ac.Banners.infoValues.get(
block.id,bannerId,'kwtype'
);

if(null!=kwtype){
kwtypes.push(kwtype);
}
banners_ids.push(bannerId);
}
}
}else{
var graphCondition=ac.Banners.infoValues.get(
block.id,block.banner_id,'condition_id'
);

graphCondition&&
conditions.push(graphCondition);
var graphKwtype=ac.Banners.infoValues.get(
block.id,block.banner_id,'kwtype'
);

graphKwtype&&
kwtypes.push(graphKwtype);
banners_ids.push(block.banner_id);
}

block.condition_id=conditions;
block.kwtype=kwtypes;
block.banners_ids=banners_ids;
}
}

return true;
};

this.count=function(isForcedLogging){
var data=[],
pads=ac.Pads.getPads(),
wSize=Begun.Utils.countWindowSize(),
wScroll=Begun.Utils.getScrollXY(),
_this=this;
var sendShowUrl=function(blockId,bannerId){
var showUrl=ac.Banners.infoValues.get(
blockId,bannerId,'show_url'
);
if(showUrl){
_this.send('',showUrl);
}
};

for(var n=0,ln=pads.length;n<ln;n++){
var padId=pads[n].pad_id;

for(var i=0,l=pads[n].blocks.length;i<l;i++){
var block=pads[n].blocks[i],
conditionIds=block.condition_id,
condLen=conditionIds&&conditionIds.length,
kwtypes=block.kwtype,
kwtypesLen=kwtypes&&kwtypes.length,
banners_ids=block.banners_ids,
banners_idsLen=banners_ids&&banners_ids.length,
dom_obj=block.dom_obj,
k;
if(condLen&&dom_obj||isForcedLogging){
var logData=[
{block_id:block.id}
];
for(k=0;k<condLen;k++){
logData.push(
{condition_id:conditionIds[k]}
);
}
for(k=0;k<kwtypesLen;k++){
logData.push(
{kwtype:kwtypes[k]}
);
}
for(k=0;k<banners_idsLen;k++){
logData.push(
{banner_id:banners_ids[k]}
);
}
var fakeBannerId=ac.Banners.infoValues.get(block.id,'fake','id');

if(!block.alreadySeen){
var blockVisible=this.isVisible(dom_obj,wSize,wScroll);

if(blockVisible||isForcedLogging){
block.alreadySeen=true;

sendShowUrl(block.id,block.banner_id);
if(fakeBannerId&&fakeBannerId!=block.banner_id){
sendShowUrl(block.id,fakeBannerId);
}

block.hidden=false;

this.sendVisible({
pad_id:padId,
data:logData
});

}else{
block.hidden=true;

data.push(
{pad_id:padId},
logData
);
}
}
}
}

}
this.data=data.length?data:null;
};

this.countBanner=function(banner,padId,blockId){
var data={
pad_id:padId,
block_id:blockId,
banner_id:banner.data.banner_id,
kwtype:banner.data.kwtype,
condition_id:banner.data.condition_id
}
this.sendVisible(data);
};

this.isVisible=function(dom_obj,wSize,wScroll){
var COMPULSORY_PART=2/3;
if(!dom_obj.offsetHeight){
var els=dom_obj.childNodes,
elsLen=els.length;

for(var i=0;i<elsLen;i++){
var el=els[i];

if(1===el.nodeType&&dom_obj!==el.offsetParent){
dom_obj=el;
break;
}
}
}

var pos=Begun.Utils.findPos(dom_obj),
blockHeight=dom_obj.offsetHeight;

return(pos&&(pos.top<wSize.height+wScroll.y-
blockHeight*COMPULSORY_PART)&&(pos.left<wSize.width+wScroll.x));
};

this.sendVisible=function(data,url){
var padId=data.pad_id,
visValue='visible';

data.first=+this.setFirst(padId,visValue);

data.visibility=visValue;

return this.send(data,url);
};

this.sendHidden=function(data,url){
data.push({
visibility:'hidden'
});

this.send(data,url);
};

this.setFirst=function(padId,eventType){
var stored=ac.Storage.get(padId);

if(!stored||!stored[eventType]){
stored=stored||{};
stored[eventType]=true;

ac.Storage.set(
padId,stored
);

return true;
}

return false;
};

this.send=function(data,url){
url=url||ac.Strings.urls.log_banners_counter;
data=Begun.Utils.serialize(data);

if(data){
var last=url.substring(url.length-1),
delim=(last==='?'||last==='&')?'':'?';

url+=delim+data;
}

return Begun.Utils.includeImage(url);
};

this.sendJSON=function(data,url){
return Begun.Utils.includeCounter(url,data);
};

};

ac.Pads=new function(){
var pads=[];
this.init=function(){
if(typeof window.begun_auto_pad!=="undefined"&&!this.getPad()){
this.push(window.begun_auto_pad);
}
};
this.push=function(pad_id){
pads[pads.length]={
pad_id:pad_id,
feed:null,
blocks:[],
banner_index:0,
feed_started:false
};
};
this.getPad=function(pad_id){
pad_id=pad_id||window.begun_auto_pad;
for(var i=0,l=pads.length;i<l;i++){
if(pads[i].pad_id==pad_id){
return pads[i];
}
}
return null;
};
this.getPads=function(){
return pads;
};
};

ac.Banners={
infoValues:{
ids:{},

set:function(blockId,bannerId,type,value){
if(null==value){
return value;
}
var block=this.ids[blockId];
if(!block){
block=this.ids[blockId]={};
}

if(!block[bannerId]){
block[bannerId]={};
}
block[bannerId][type]=value;

return value;
},

setAll:function(blockId,banner){
var properties=['condition_id','kwtype','show_url'],
i=properties.length;
while(i--){
this.set(blockId,banner.banner_id,properties[i],banner[properties[i]]);
}
},

get:function(blockId,bannerId,type){
var block=this.ids[blockId];
return block&&block[bannerId]&&block[bannerId][type];
}
}
};

ac.Blocks=new function(){
this.init=function(){
ac.resetBannerIndex();
};
this.add=function(elem,pad_id){
var blocks=ac.getPad(pad_id).blocks;
blocks[blocks.length]=elem;
};
this.push=function(elem,pad_id){
var blocks=ac.getPad(pad_id).blocks;
if(window.begun_extra_block){
blocks[0]=elem;
}else{
blocks[blocks.length]=elem;
}
if(!ac.isFeedStarted()){
ac.initFeedLoad();
}else if(!!ac.getFeed()){
ac.insertNonTextBlock(elem);
ac.draw();
}
ac.nullGlobalBlockParams();
};
this.del=function(block_id,pad_id){
var block=null;
var i=0;
var blocks=ac.getPad(pad_id).blocks;
while(block=blocks[i]){
if(block.id==block_id){
blocks[i].id=-1;
blocks[i].options.banners_count=0;
break;
}
i++;
}
};

this.deleteAll=function(pad_id){
var pad=ac.getPad(pad_id),
blocks=pad&&pad.blocks;

if(blocks&&blocks.length){
blocks.length=0;
}
};

this.isDeleted=function(block){
block.id==-1&&block.options.banners_count==0;
};

this.pushAll=function(blocks,pad_id){
this.deleteAll(pad_id);
this.init();

var block=null;
var i=0;
while(block=blocks[i]){
this.push(block);
i++;
}
};

this.getBlockById=function(block_id,blocks,pad_id){
var block=null;
var i=0;
blocks=blocks||ac.getPad(pad_id).blocks;
while(block=blocks[i]){
if(block.id==block_id){
return block;
}
i++;
}
return null;
};

this.deleteBlockById=function(block_id,blocks,pad_id){
blocks=blocks||ac.getPad(pad_id).blocks;

for(var i=0;i<blocks.length;i++){
if(blocks[i].id===block_id){
blocks.splice(i,1);
return true;
}
}

return false;
};

this.getDomObj=function(block_id){
var resultBlock;
if(ac.getBlockIdTopMobile()==block_id){
try{
resultBlock=top.document&&top.document.getElementById(ac.Strings.css.block_prefix+block_id);
}catch(e){}
}
return resultBlock||Begun.$(ac.Strings.css.block_prefix+block_id)||null;
};
this.checkType=function(block,type){
return(this.getBlockType(block)==type);
};

this.checkTypeContains=function(block,substring){
return this.getBlockType(block).indexOf(substring)>=0;
};

this.checkViewType=function(block,viewtype){
return Begun.Utils.inList((block.options&&block.options.view_type),viewtype);
};

this.getBlockType=function(block){
return block&&block.options&&block.options.dimensions&&block.options.dimensions.type&&block.options.dimensions.type.toLowerCase()||"";
};
this.isBlockFixed=function(block){
return(/(\d+)x(\d+)/.test(this.getBlockType(block)));
};
};

ac.Tpls=new function(){
var css={};
css['default']='\
#begun-default-css {display:none !important;}\
';
css['block']='.begun_adv * {clear:none !important;color:#000 !important;float:none !important;margin:0 !important;padding:0 !important;letter-spacing:normal !important;word-spacing:normal !important;z-index:auto !important;font-size:12px !important;font:normal normal 12px Arial,sans-serif !important;text-transform:none !important;list-style:none !important;position:static !important;text-indent:0 !important;visibility:visible !important;white-space:normal !important;}.begun_adv_common {position:relative !important;width:100% !important;}.begun_adv_common tr,.begun_adv_common td,.begun_adv_common a,.begun_adv_common b,.begun_adv_common div,.begun_adv_common span {background:none !important;border:none !important;}#begun_block_{{block_id}} {height:auto !important;width:auto !important;line-height:normal !important;margin:0 !important;padding:0 !important;font:12px/18px Arial,sans-serif !important;color:#000 !important;text-align:left !important;}#begun_block_{{block_id}} wbr {display:inline-block !important;}#begun_block_{{block_id}} .begun_adv_span {display:inline-block !important;position:relative !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;}#begun_block_{{block_id}} .begun_adv {-moz-box-sizing:border-box !important;-webkit-box-sizing:border-box !important;box-sizing:border-box !important;}#begun_block_{{block_id}} *:after,#begun_block_{{block_id}} *:before {content:normal !important;}#begun_block_{{block_id}} b {font-weight:bold !important;display:inline !important;}#begun_block_{{block_id}} .begun_adv,#begun_block_{{block_id}} table,#begun_block_{{block_id}} td,#begun_block_{{block_id}} div {padding:0 !important;text-align:left !important;table-layout:auto !important;}#begun_block_{{block_id}} .begun_adv table {border:none !important;border-collapse:collapse !important;}#begun_block_{{block_id}} td {vertical-align:middle !important;}#begun_block_{{block_id}} .begun_adv_cell {text-align:left !important;}#begun_block_{{block_id}} .begun_adv_bullit {color:#aaa !important;}#begun_block_{{block_id}} .begun_adv_title,#begun_block_{{block_id}} .begun_adv_text {display:block !important;}#begun_block_{{block_id}} .begun_adv_title .begun_favicon {width:16px !important;height:16px !important;margin-right:6px !important;vertical-align:middle !important;}#begun_block_{{block_id}} a.begun_adv_sys_logo {position:absolute !important;right:0 !important;bottom:0 !important;z-index:1 !important;height:16px !important;padding:0 5px 2px 1px !important;background:{{block:backgroundColor}} !important;}#begun_block_{{block_id}} span.begun_adv_age {position:absolute !important;right:0 !important;top:0 !important;padding:2px 5px 0 0 !important;font-style:italic !important;color:#622678 !important;color:{{text:color}} !important;font-weight:bold !important;}#begun_block_{{block_id}} .begun_hover a.begun_adv_sys_logo {background:{{block_hover:backgroundColor}} !important;}#begun_block_{{block_id}} .begun_adv_sys_logo,#begun_block_{{block_id}} .begun_adv_sys_logo a {font-size:14px !important;line-height:16px !important;text-align:right !important;color:{{block_logo_color}} !important;text-decoration:none !important;font-weight:bold !important;font-style:normal !important;}#begun_block_{{block_id}} .begun_adv_sys_logo strong {display:none !important;line-height:16px !important;font-size:14px !important;font-weight:bold !important;letter-spacing:-1px !important;color:{{block_logo_color}} !important;}#begun_block_{{block_id}} .begun_adv_sys_logo strong {*display:inline !important;}#begun_block_{{block_id}} .begun_adv_sys_logo img {*display:none !important;}#begun_block_{{block_id}} .begun_collapsable .begun_adv_cell .begun_adv_cell {padding:5px 2px 4px 5px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_title {margin-bottom:2px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_common {overflow:hidden !important;width:auto !important;}#begun_block_{{block_id}}.begun_auto_rich .begun_adv_fix .begun_adv_common {overflow:visible !important;}#begun_block_{{block_id}} .begun_adv_text {padding:2px 0 !important;line-height:1 !important;}#begun_block_{{block_id}} .begun_adv_block {border:none !important;cursor:pointer !important;cursor:hand !important;}#begun_block_{{block_id}} .begun_adv_title a.begun_cross {float:right !important;margin-left:8px !important;font-size:18px !important;text-decoration:none !important;font-weight:normal !important;line-height:14px !important;color:{{domain:color}} !important;opacity:0.25 !important;filter:alpha(opacity=25) !important;}#begun_block_{{block_id}} .begun_adv_title a.begun_cross:hover {color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv_phone {width:12px !important;margin:1px 3px 0 0 !important;position:absolute !important;top:0 !important;left:0 !important;}#begun_block_{{block_id}} .begun_adv_phone_wrapper {padding-left:15px !important;white-space:nowrap !important;position:relative !important;display:inline-block !important;_display:inline !important;zoom:1 !important;}#begun_block_{{block_id}} .begun_adv_phone_wrapper.begun_adv_phone_no_icon {padding-left:0 !important;}#begun_block_{{block_id}} div.begun_adv_contact > .begun_adv_phone {margin:0 5px 0 0 !important;}#begun_block_{{block_id}} .begun_adv_phone b {border:#000 solid 0 !important;height:1px !important;font-size:1px !important;line-height:1px !important;display:block !important;overflow:hidden !important;}#begun_block_{{block_id}} .begun_adv_phone .p0,#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p5,#begun_block_{{block_id}} .begun_adv_phone .p8 {background-color:#000 !important;}#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p7,#begun_block_{{block_id}} .begun_adv_phone .p8 {margin:0 1px !important;}#begun_block_{{block_id}} .begun_adv_phone .p2,#begun_block_{{block_id}} .begun_adv_phone .p7 {border-width:0 4px !important;}#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p6 {margin:0 2px !important;}#begun_block_{{block_id}} .begun_adv_phone .p0 {margin:0 3px !important;}#begun_block_{{block_id}} .begun_adv_phone .p4 {border-width:0 3px !important;}#begun_block_{{block_id}} .begun_adv_phone .p5 {margin:0 4px !important;}#begun_block_{{block_id}} .begun_adv_phone .p6 {border-width:0 2px !important;}#begun_block_{{block_id}} .begun_adv_phone .p8 {height:2px !important;}#begun_block_{{block_id}} .begun_adv_phone b {border-color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv_phone .p0,#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p5,#begun_block_{{block_id}} .begun_adv_phone .p8 {background-color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv_phone {font-size:11px !important;line-height:11px !important;margin-top:{{phone_margin_top}}px !important;}#begun_block_{{block_id}} .begun_adv_title * {line-height:1.2 !important;color:{{title:color}} !important;font-size:18px !important;font-size:{{title:fontSize}} !important;font-weight:normal !important;font-weight:{{title:fontWeight}} !important;}#begun_block_{{block_id}} .begun_collapsable .begun_adv_title *{font-size:12px !important;}#begun_block_{{block_id}} .begun_adv_title a:hover,#begun_block_{{block_id}} .begun_adv_title a:hover * {color:#f00 !important;color:{{title_hover:color}} !important;}#begun_block_{{block_id}} .begun_adv_text * {line-height:1.2 !important;color:#000 !important;color:{{text:color}} !important;font-size:12px !important;font-size:{{text:fontSize}} !important;text-decoration:none !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_adv_cell .begun_adv_block .begun_adv_text {font-size:14px !important;font-size:{{text:fontSize}} !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_adv_cell .begun_adv_block .begun_adv_text * {font-size:14px !important;font-size:{{text:fontSize}} !important;}#begun_block_{{block_id}} .begun_adv_hor .begun_adv_cell .begun_adv_block .begun_adv_text {font-size:14px !important;font-size:{{text:fontSize}} !important;}#begun_block_{{block_id}} .begun_adv_hor .begun_adv_cell .begun_adv_block .begun_adv_text * {font-size:14px !important;font-size:{{text:fontSize}} !important;}#begun_block_{{block_id}} .begun_adv_geo,#begun_block_{{block_id}} .begun_adv_geo * {color:#000 !important;color:{{text:color}} !important;text-decoration:none !important;font-size:{{domain:fontSize}} !important;font-weight:bold !important;cursor:text !important;}#begun_block_{{block_id}} div.begun_adv_contact {*position:relative !important;*top:3px !important;*margin-top:-3px !important;}#begun_block_{{block_id}} .begun_adv_contact,#begun_block_{{block_id}} .begun_adv_contact * {color:{{domain:color}} !important;font-size:12px !important;font-size:{{domain:fontSize}} !important;line-height:1.2 !important;}#begun_block_{{block_id}} .begun_adv_contact span {padding-right:2px !important;}#begun_block_{{block_id}} .begun_adv_contact a {color:{{domain:color}} !important;text-decoration:none !important;}#begun_block_{{block_id}} .begun_adv_thumb .begun_thumb {float:left !important;display:block !important;_display:inline !important;z-index:1 !important;overflow:hidden !important;zoom:1 !important;margin:0 auto 5px 7px !important;}#begun_block_{{block_id}} .begun_adv_thumb .begun_thumb img {z-index:20 !important;}#begun_block_{{block_id}} .begun_adv_rich {overflow:visible !important;}#begun_block_{{block_id}} .begun_adv_rich .begun_adv_image {float:left !important;margin-right:10px !important;_margin-right:7px !important;top:0 !important;width:72px !important;height:72px !important;position:relative !important;}#begun_block_{{block_id}} .begun_adv_thumb .begun_adv_block {margin-left:60px !important;_zoom:1 !important;}#begun_block_{{block_id}} .begun_adv_rich .begun_adv_block {margin-left:82px !important;_margin-left:79px !important;word-wrap:break-word !important;}#begun_block_{{block_id}}.begun_auto_rich .banners_count_1 .begun_adv_block * {text-align:left !important;}#begun_block_{{block_id}} .begun_adv_cell .begun_adv_phone_wrapper .begun_adv_phone *,#begun_block_{{block_id}}.begun_auto_rich .begun_adv_cell .begun_adv_phone_wrapper .begun_adv_phone *,#begun_block_{{block_id}} #begun_warn_{{block_id}}.banners_count_3 .begun_adv_cell .begun_adv_phone * {font-size:1px !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_adv_phone {margin-top:3px !important;}#begun_block_{{block_id}} .begun_mobile_classic .begun_adv_common .begun_adv_table .begun_adv_title * {font-size:18px !important;}#begun_block_{{block_id}} .begun_mobile_classic .begun_adv_common .begun_adv_table .begun_adv_text * {font-size:14px !important;}#begun_block_{{block_id}} .begun_mobile_rich .begun_adv_common .begun_adv_table .begun_adv_title * {font-size:24px !important;font-weight:bold !important;}#begun_block_{{block_id}} .begun_mobile_rich .begun_adv_common .begun_adv_table .begun_adv_text * {font-size:18px !important;}#begun_block_{{block_id}} .begun_mobile_icon {background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#D0DCF9),color-stop(1,#F7F8FC)) !important;background-repeat:no-repeat !important;background-size:90px 90px !important;border-color:#7F9DE6 !important;border-radius:5px !important;-webkit-border-radius:5px !important;border-style:solid !important;border-width:1px !important;margin-right:10px !important;height:90px !important;margin-bottom:10px !important;width:90px !important;}#begun_block_{{block_id}} .begun_mobile_icon img {height:70px !important;margin:10px !important;width:70px !important;}#begun_block_{{block_id}} .begun_mobile_classic .begun_mobile_icon {background-size:30px 30px !important;height:30px !important;width:30px !important;float:left !important;}#begun_block_{{block_id}} .begun_mobile_classic .begun_mobile_icon img {height:20px !important;margin:5px !important;width:20px !important;}#begun_block_{{block_id}} .gift {display:none !important;}#begun_block_{{block_id}} .begun_warn_message {position:relative !important;display:block !important;margin-top:4px !important;padding-left:16px !important;line-height:10px !important;font-size:9px !important;text-indent:-16px !important;color:#aaa !important;}#begun_block_{{block_id}} .begun_warn_message .begun_warn_icon {display:inline-block !important;position:relative !important;padding-right:16px !important;vertical-align:top !important;_display:inline !important;zoom:1 !important;}#begun_block_{{block_id}} .begun_warn_message .begun_warn_icon i {position:absolute !important;top:-2px !important;width:12px !important;height:13px !important;background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAYAAACdKY9CAAAACXBIWXMAAAsSAAALEgHS3X78AAAA10lEQVQoz43SvUpDQRAF4G/XC2muxD98AYsEe7HIC1jYiM+RSsFWGxvzLkJsfAVha4m1VhKCcmvRZoQ1iObAMGcPZ9iZ3UmlFBV2cYL9OD/iFq/fhqYyn+ESrZ+Y4CqyHOJ1CC067EV0od2ERyqlHOABKYrfsRH8Df3gnzjMGFfmv5AwzhhZHaNcXbkK+g2esV2JLUrFa7xk3P3S62bE8mzTVErZwRO2/nmlBQYN5jjFFOvo4SJMvchdeOapWo1hfN4R1kL7wD3OMVtejRmOo7VhpS3qIb4AJKgth4BJRpoAAAAASUVORK5CYII=\") transparent 0 0 no-repeat !important;}\
#begun_block_{{block_id}} .begun_adv a { /* .begun_adv increases the selectors specifity. #id a {display: block} - common pattern #6453, #6620 */\
display: inline;\
vertical-align: baseline;\
text-decoration: underline;\
opacity: 1 !important;\
}\
#begun_block_{{block_id}} .begun_adv {\
background-color: {{block:backgroundColor}}; /* no !important for hover */\
border: 1px solid {{block:borderColor}}; /* no !important for hover */\
{{block:filter}} /* no !important for hover */\
}\
#begun_block_{{block_id}} .begun_adv *, .begun_adv *:hover {\
width: auto; /* no !important for rich-images */\
height: auto; /* no !important for rich-images */\
background: none; /* no !important for hover */\
border: none; /* no !important for hover */\
}\
#begun_block_{{block_id}} .begun_adv.begun_hover {\
background-color: {{block_hover:backgroundColor}}; /* no !important for hover */\
border: 1px solid {{block_hover:borderColor}}; /* no !important for hover */\
{{block_hover:filter}} /* no !important for hover */\
}\
#begun_block_{{block_id}} td {\
overflow: visible;\
}\
#begun_block_{{block_id}} .begun_adv_rich .begun_active_image {\
z-index:1000;\
}\
#begun_block_{{block_id}} .begun_adv_rich .begun_active_image img {\
z-index:1000 !important;\
}\
#begun_block_{{block_id}} .begun_adv_rich .begun_adv_image img {\
border:1px solid {{block:borderColor}};\
position:absolute !important;\
background:#fff !important;\
top:0;\
left:0;\
max-width:none !important;\
z-index:20;\
cursor:pointer;\
}\
#begun_block_{{block_id}} .begun_adv_rich .begun_adv_picture {\
/*width:70px;\
height:70px;*/\
position:absolute !important;\
z-index:20;\
}\
#begun_block_{{block_id}} .begun_collapsed {\
height:45px !important;\
overflow:hidden !important;\
}\
#begun_block_{{block_id}} .begun_collapsed .begun_adv_title {\
margin-bottom:30px !important;\
}\
';
css['forOperaIE']='\
#begun_block_{{block_id}} .begun_adv_contact span.begun_adv_phone {\
float:none !important;\
position:static !important;\
vertical-align: baseline;\
display:inline-block !important;\
}\
#begun_block_{{block_id}} .begun_adv_phone_wrapper {\
padding-left:0 !important;\
position:static !important;\
display:inline !important;\
}\
';
var html={};
html['blck_place']='<div id="{{id}}"></div>';
html['link_iframe']='<iframe src="{{url}}" style="height:0;width:0;border:0"></iframe>';
html['bnnr_glue']=' <span class="begun_adv_bullit"> &#149; </span> ';
html['bnnr_close']='<a href="javascript:void(0);" class="begun_cross" title="&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;">&times;</a>';
html['bnnr_phone']='\
<span class="begun_adv_phone"><b class="p0"></b><b class="p1"></b><b class="p2"></b><b class="p4"><b class="p3"></b></b><b class="p5"></b><b class="p6"><b class="p1"></b></b><b class="p7"></b><b class="p8"></b></span>\
';
html['bnnr_card']='\
<span class="begun_adv_phone_wrapper"><a target="_blank" href="{{url}}" class="snap_noshots">{{phone}}</a><span class="begun_adv_card"><a target="_blank" href="{{url}}" class="snap_noshots">{{card_text}}</a></span></span>\
';
html['bnnr_card_no_phone']='\
<span class="begun_adv_phone_wrapper begun_adv_phone_no_icon"><span class="begun_adv_card"><a target="_blank" href="{{url}}" class="snap_noshots">{{card_text}}</a></span></span>\
';
html['bnnr_domain']='\
<span class="begun_adv_contact"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}">{{domain}}</a></span>\
';
html['bnnr_geo']='\
<span class="begun_adv_city"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}">{{geo}}</a></span>\
';
html['bnnr_geo_add']='\
<div class="begun_adv_geo"><a href="javascript:void(0)">{{address}}</a></div>\
';
html['bnnr_favicon']='\
<img class="begun_favicon" src="{{src}}" width="16" height="16" alt="" />\
';
html['bnnr_thumb']='\
<a href="{{url}}" class="begun_thumb snap_noshots" style="width:42px !important;height:42px !important;" target="_blank"><img src="{{src}}" {{pngfix}} {{mouse_events}} width="42" height="42" alt="" /></a>\
';
html['bnnr_picture']='\
<div class="begun_adv_image"><a href="{{url}}" class="snap_noshots" target="_blank"><img src="{{src}}" _big_photo_src="{{big_photo_src}}" _small_photo_src="{{src}}" class="begun_adv_picture" alt="" /></a></div>\
';
html['bnnr_mobile_icon']='\
<div class="begun_mobile_icon"><img src="{{src}}" /></div>\
';
html['bnnr_warn']='\
<div class="begun_warn_message begun_warn_{{type}}"><span class="begun_warn_icon"><i></i></span>{{text}}</div>\
';
html['blck_hover']=' onmouseover="Begun.Utils.addClassName(this, \'begun_hover\');" onmouseout="Begun.Utils.removeClassName(this, \'begun_hover\');"';
html['search_banner_swf']='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{{width}}" height="{{height}}"><param name="movie" VALUE="{{source}}&link1={{url}}"><param name="wmode" value="opaque"><param name="allowScriptAccess" value="always"><param name="quality" VALUE="high"><embed src="{{source}}&link1={{url}}" quality="high" width="{{width}}" height="{{height}}" style="{{styles}}" type="application/x-shockwave-flash" wmode="opaque"></embed></object>';
html['search_banner_js']='';
html['search_banner_html']='<iframe src="{{source}}" width="{{width}}" height="{{height}}" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" hspace="0" vspace="0"></iframe>';

html['search_banner_img']='<a href="{{url}}" target="_blank"><img src="{{source}}&redir=1" border="0" width="{{width}}" height="{{height}}" style="{{styles}}" /></a>{{close_button}}';

html['close_button']='<a href="javascript:void(0);" class="begun_close_button" onclick="document.getElementById(\'begun_block_{{block_id}}\').parentNode.removeChild(document.getElementById(\'begun_block_{{block_id}}\'));" title="&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;">&#215;</a>';
html['begun_logo']='<img src="{{src}}" border="0" alt="begun"/><strong>begun</strong>';
html['price_logo']='<img src="{{src}}" border="0" alt="price"/><strong>price</strong>';
html['price_search_logo']='<img src="{{src}}" border="0" alt="price"/>';
html['offer_stores']='магазины: <span class="begun_adv_stores_count">{{count}}</span>';
html['gifts_link']='';

this.getCSS=function(type){
return css[type];
};
this.getHTML=function(type){
return html[type];
};
this.addTpls=function(newTpls){
var types=['html','css'];
var i=0;
var type=null;
var is_default_css_override=false;
if(css['default']&&window['begun_css_tpls']&&window['begun_css_tpls']['default']&&css['default']!=window['begun_css_tpls']['default']){
is_default_css_override=true;
}
var tplContainer=typeof newTpls==="undefined"?window:newTpls;
while(type=types[i]){
if(typeof tplContainer['begun_'+type+'_tpls']!=="undefined"){
var j=0;
var tpl=null;
while(tpl=tplContainer['begun_'+type+'_tpls'][j]){
Begun.extend(eval(type),tpl);
j++;
}
}
i++;
}
return is_default_css_override;
};
};

ac.Customization=new function(){
var _this=this;
this.init=function(){
if(typeof window.begun_urls!=="undefined"){
_this.setURLs(window.begun_urls);
window.begun_urls=null;
}
if(typeof window.begun_callbacks!=="undefined"){
_this.setCallbacks(window.begun_callbacks);
window.begun_callbacks=null;
}
if(_this.setTpls()||!arguments.callee.run){
ac.printDefaultStyle();
arguments.callee.run=true;

}
};
this.setURLs=function(urls){
Begun.extend(ac.Strings.urls,urls||{});
};
this.setCallbacks=function(callbacks){
ac.Callbacks.register(callbacks||{});
};
this.setTpls=function(newTpls){
ac.Tpls.addTpls(newTpls);
};
};
})(Begun);

(function(){
var ac=Begun.Autocontext;

ac.onContent=function(f){
var u=navigator.userAgent,
e=false,
CHECK_TIME;
if(/webkit/i.test(u)){
setTimeout(function(){
var dr=document.readyState;
if(dr=="loaded"||dr=="complete"){
f()
}else{
setTimeout(arguments.callee,CHECK_TIME);
}
},CHECK_TIME);
}else if((/mozilla/i.test(u)&&!/(compati)/.test(u))||(/opera/i.test(u))){
document.addEventListener("DOMContentLoaded",f,false);
}else if(e){
(function(){
var t=document.createElement('doc:rdy');
try{
t.doScroll('left');
f();
t=null;
}catch(e){
setTimeout(arguments.callee,0);
}
})();
}else{
Begun.Utils.addEvent(window,'load',function(){
f();
});
}
}

ac.onContent(function(){
ac.Callbacks.dispatch('blocks','draw',ac);
ac.domContentLoaded=true;
});

ac.Monitor.init();
})();
Begun.Autocontext.init();
}
}

if(typeof Begun.Autocontext==="object"){
Begun.Autocontext.init();
}

Begun.Scripts.addStrictFunction(Begun.Scripts.Callbacks['ac']);
}

if(typeof Begun.Scripts!=="object"){
(function(){
var scripts={
"begun_scripts":"3ac79a9a40"
};

var protocol=document.location.protocol;

var baseUrl=(function(){
if(window.begun_urls&&window.begun_urls.base_scripts_url){
return window.begun_urls.base_scripts_url;
}else{
return protocol+"//autocontext.begun.ru/";
}
}());

for(var scriptName in scripts){
if(scripts.hasOwnProperty(scriptName)){
document.write("<scr"+"ipt type=\"text/javascript\" src=\""+baseUrl+"acp/"+scriptName+"."+scripts[scriptName]+".js"+"\"></scr"+"ipt>");
}
}
})();
}else{
if(typeof Begun.Scripts.addStrictFunction!=="undefined"){
begun_load_autocontext();
}
}
