<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>

	<%@ include file="/include/jquery.libs.jsp"%>
	<script type="text/javascript" src="./resource/js/jtopo-0.4.6-min.js"></script>
	<script type="text/javascript" src="./resource/js/addtabs.js"></script>
	<link rel="stylesheet" href="./resource/css/main.css">

	<link href="./resource/bootstrap/bootstrap.min.css" rel="stylesheet">
	<script src="./resource/bootstrap/bootstrap.min.js"></script>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes">
	<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes/icon.css">
	<script type="text/javascript" src="./third-lib/easyui/jquery.min.js"></script>
	<script type="text/javascript" src="./third-lib/easyui/jquery.easyui.min.js"></script>



</head>

<body>



<script type="text/javascript">


    function positionLayout(step,zoom,len){
        var positionXY = new Array();
        var baseNum=15;
        if(len<15)
        {
            var angle=(2*Math.PI/(len-1));
            var radius =step/1.2;
        }
        else
        {
            var angle=(2*Math.PI/baseNum);
            var radius =step;
        }

        var rNum=0;
        var angles =0;
        var round=0;


        var x=600*zoom;
        var y=300*zoom;
        positionXY.push({"x":Math.round(x),"y":Math.round(y)});
        for(var i = 0; i < len-1; i++) {
            x=600*zoom+(radius+round*170)*Math.cos(angles);
            y=300*zoom+(radius+round*170)*Math.sin(angles);
            positionXY.push({"x":Math.round(x),"y":Math.round(y)});

            if(rNum==baseNum-1)
            {
                angles =0;
                round++;
                baseNum=baseNum+round*20+15;
                angle=(2*Math.PI/(15+round*20));
            }
            else
            {
                angles += angle;

            }
            rNum++;
        }


        return positionXY;
    }


    var fileId = ${param.fileId};
    $.ajax({
        type:'GET',
        url:'http://localhost:8080/WineVis/function/getFileFunction/'+fileId,
        //async:false,
        dataType:"json",
        beforeSend:function(XMLHttpRequest){
            $("#loading").html('<img src="./third-lib/easyui/themes/default/images/loading.gif">');
        },
        success:function(data){

            var sw = $(document).width();
            var sh = $(window).height()-80;
            document.getElementById("canvas").width= sw;
            document.getElementById("canvas").height= sh;
            var canvas = document.getElementById('canvas');
            var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
            var scene = new JTopo.Scene(stage); // 创建一个场景对
            var arr_n = data.GC;
            var arr_l = data.LINK;
            console.log("lklklk"+arr_l.length);

            var num = Math.ceil(Math.sqrt(arr_n.length));
            var zoom = 1;
            var zx=0,zy=0;

            if(arr_n.length>70){
                zoom =Math.ceil(num/8);
                zx = sw*(zoom-1)/2;
                zy = sh*(zoom-1)/2;
            }
            var step = Math.round(sw/num)*zoom/2;
            var pLayout = positionLayout(step-1,zoom,arr_n.length+1);
            var pNum = pLayout.length-1;

            var nodes = new Array();
            var nodeImgF = './resource/images/function.png';

            for (i = 0; i < arr_n.length; i++)
			{
                var node = new JTopo.Node(arr_n[i].label);
                node.id = arr_n[i].id;
                node.setImage(nodeImgF, true);

                var random_x = pLayout[i].x;
                var random_y = pLayout[i].y;
                node.setLocation(random_x-zx,random_y-zy);

                node.font="14px 黑体";
                node.fontColor="20,20,20";
                node.textOffsetY = -5;

                scene.add(node);
                nodes[i]={id:arr_n[i].id,node:node};
			}

            for (m = 0; m < arr_l.length; m++){

                for(n=0;n<nodes.length;n++){
                    if(arr_l[m].source==nodes[n].id){
                        source=nodes[n].node;
                    }

                }
                for(n=0;n<nodes.length;n++){
                    if(arr_l[m].target==nodes[n].id){
                        target=nodes[n].node;
                    }
                }

                if (source.id!=0&&target.id!=0){
                    addLink(source,target);
                }

            }

            function addLink(source,target)
			{
                var link = new JTopo.Link(source, target,'','level');

                link.strokeColor = "120,165,65";

                link.lineWidth = 1;
                link.arrowsRadius = 5;
                link.arrowsShape="arrows";
                link.textOffsetY = 3;
                link.fontColor = JTopo.util.randomColor();
                scene.add(link);

                return link;
            }
        }
    });


</script>

<script type="text/javascript">
    $(function(){
        $('#home-tree').tree({

            url : 'http://localhost:8080/WineVis/file/selectMenuTrees',
            onLoadSuccess: function(node, data){
            },

        });
    });
</script>

<ul id='home-tree' ></ul>


<canvas id="canvas"></canvas>


</body>


</html>