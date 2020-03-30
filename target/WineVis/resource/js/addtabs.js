           function addTab(subtitle,url,tabId) {
               if (!parent.$('#tabs').tabs('existsById', tabId)) {
            	   parent.$('#tabs').tabs('add', {
                	   id: tabId,
                       title: subtitle,
                       content: createFrame(url),
                       width: $('#mainPanle').width() - 10,
                       height: $('#mainPanle').height() - 26,
					   closable:true
                   });
               } else {
            	   parent.$('#tabs').tabs('selectById', tabId);
              }
           }
           
           function addtabchayi(subtitle,url,tabId) {
        	  
               if (!parent.$('#tabchayi').tabs('existsById', tabId)) {
            	   parent.$('#tabchayi').tabs('add', {
                	   id: tabId,
                       title: subtitle,
                       content: createFrame(url),
                       width: $('#mainPanle').width() - 10,
                       height: $('#mainPanle').height() - 26,
					   closable:true
                   });
               } else {
            	   parent.$('#tabschayi').tabs('selectById', tabId);
              }
           }
           function createFrame(url) {
               var s = '<iframe name="mainFrame" scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:99%;"></iframe>';
               return s;
           }
           
           
           
           //保留2位小数
   	    function twoDecimal(x) {
   	        var f_x = parseFloat(x);
   	        if (isNaN(f_x)) {
   	            alert('错误的参数');
   	            return false;
   	        }
   	        var f_x = Math.round(x * 100) / 100;
   	        var s_x = f_x.toString();
   	        var pos_decimal = s_x.indexOf('.');
   	        if (pos_decimal < 0) {
   	            pos_decimal = s_x.length;
   	            s_x += '.';
   	        }
   	        while (s_x.length <= pos_decimal + 2) {
   	            s_x += '0';
   	        }
   	        return s_x;
   	    }
   	//画饼状图
   	 function bingtu(nochange,change){   

   	     //third
   	     
   	     chart = new Highcharts.Chart({
   	     //	style:{backgroundColor:"red"},
   	     	chart: {
   	     		 backgroundColor: '#D1EEEE',
   	             renderTo: 'tubiao1'//关联页面元素div#id
   	             	
   	         },
   	         title: {  //图表标题
   	             text: '本层节点变化情况'
   	         },

   	         
   	         tooltip: {
   	             formatter: function() { //格式化鼠标滑向图表数据点时显示的提示框
   	                 var s;

   	                     s = '<b>' + this.point.name + '</b>: <br> (' +twoDecimal( this.percentage) + '%)';
   	            
   	                 return s;
   	             }
   	         },
   	     	series: [{
   	     		type: 'pie', //饼状图
   	     name: '变化百分比',
   	     data: [{
   	         name: '变化'+change+'行',
   	         y: change,
   	         color: '#FAC864' 
   	     },
   	     {
   	         name: '不变'+nochange+'行',
   	         y: nochange,
   	         color: '#77903D' 
   	     }],
   	     center: [100, 80],  //饼状图坐标
   	     size: 80,  //饼状图直径大小
   	     dataLabels: {
   	         enabled: true  //不显示饼状图数据标签
   	     }
   	 }]
   	 });
   	 }
