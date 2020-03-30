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

//显示浮动模块
function show(obj,id) {    

    var objDiv = $("#"+id+"");

    $(objDiv).css("display","block");

    $(objDiv).css("left", event.clientX);

    $(objDiv).css("top", event.offsetY);  

}
//隐藏浮动模块
function hide(obj,id) {

    var objDiv = $("#"+id+"");

    $(objDiv).css("display", "none");

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
      //  color: '#FAC864' 
        	color: '#FF9900'
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
