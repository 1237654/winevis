    
//版本差异性界面中增加tab页
function addTabchayi(subtitle, url,id) {
           if (!$('#tabchayi').tabs('exists', subtitle)) {
               $('#tabchayi').tabs('add', {
                   title: subtitle,                      
                   content: createFrame(url,id),
                   width: $('#mainPanle').width() - 10,
                   height: $('#mainPanle').height() - 26,
				   closable:true
               });
           } else {

               $('#tabchayi').tabs('select', subtitle);
          }
       }

//主界面中增加tab页
function addTab(subtitle, url,id) {
           if (!$('#tabs').tabs('exists', subtitle)) {

               $('#tabs').tabs('add', {
                   title: subtitle,                      
                   content: createFrame(url,id),
                   width: $('#mainPanle').width() - 10,
                   height: $('#mainPanle').height() - 26,
				   closable:true
               });
           } else {
               $('#tabs').tabs('select', subtitle);
          }
       }
//创建tab页中的frame
function createFrame(url,fid) {
           var s = '<iframe name="mainFrame" id="'+fid+'" scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:99%;"></iframe>';
           return s;
       }
//增加新的tab页显示权限
function permission()
       {   
    	   drawPermissionTree();
    	   var tit = "系统权限分布图";        		          
	       var url = "${ctx}/android/front/permission/permissionCheck/";
    	   addTab(tit,url,"permission");  	   
       }
       

       
       
//滚动字幕函数
function ScrollImgLeft() {
    var speed = 50;
    var scroll_begin = document.getElementById("scroll_begin");
    var scroll_end = document.getElementById("scroll_end");
    var scroll_div = document.getElementById("scroll_div");
    scroll_end.innerHTML = scroll_begin.innerHTML;
    function Marquee() {
        if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0) scroll_div.scrollLeft -= scroll_begin.offsetWidth;
        else scroll_div.scrollLeft++;
    }
    var MyMar = setInterval(Marquee, speed);
    scroll_div.onmouseover = function() {
        clearInterval(MyMar);
    }
    scroll_div.onmouseout = function() {
        MyMar = setInterval(Marquee, speed);
    }
}