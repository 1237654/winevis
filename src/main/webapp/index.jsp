<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes">
<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="./third-lib/easyui/themes/icon.css">
<script type="text/javascript" src="./third-lib/easyui/jquery.min.js"></script>
<script type="text/javascript" src="./third-lib/easyui/jquery.easyui.min.js"></script>

<div>123</div>

	<style>
		.tree-icon{
			background:url("") no-repeat center center !important;
			/*background:url('./resource/images/test.png') no-repeat center center !important;*/
		}
	</style>
<script type="text/javascript">

    var tree_data = [{
        id : 1,
        text: 'aaa',
        state: 'closed',
        children: [{
            id : 11,
            text: 'aaa1',
            attributes : {
                url : '${path}/menuTree/index/success'
            }
        },{
            id : 12,
            text: 'aa2',
            attributes : {
                url : '${path}/menuTree/index/error'
            }
        }]
    },{
        id:2,
        text: '菜单管理',
        state: 'closed',
        children : [{
            id:21,
            text: '菜单配置',
            attributes : {
                url : '${path}/menuTree/index/error'
            }
        }]
    }];

    $(function(){
        $('#home-tree').tree({

            url : 'http://localhost:8080/WineVis/trace/selectMenuTrees',
            onLoadSuccess: function(node, data){

            },
			formatter:function(node){

				if(node.url=="com"){
					var s ='<span  style="color: green;">'+node.text+'</span>';
					return s;
				}
				if(node.url=="ole"){
					var s ='<span  style="color: blue;">'+node.text+'</span>';
					return s;
				}
            	if(node.url=="rpc"){
					var s ='<span  style="color: darkorange;">'+node.text+'</span>';
					return s;
				}
            	return node.text;


			},
			onClick:function(node){
            	/*if( $('#home-tree').tree('isLeaf', node.target)){
					//alert(node.url);
					if(node.url==null){
						addTab(node.text,'testcase.jsp?fileId='+node.id);
					}
					addTab(node.text, 'fun.jsp?fileId='+node.id);
				}*/
				addTab(node.text, 'traceDetail.jsp?traceId='+node.id);
			}

        });



		function addTab(title, url){
			if ($('#tree-tabs').tabs('exists', title)){
				$('#tree-tabs').tabs('select', title);
			} else {
				var content = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
				$('#tree-tabs').tabs('add',{
					title:title,
					content:content,
					closable:true
				});
			}
		}

		$('#tree-tabs').tabs('select','home');

	});



</script>

</head>
<body class="easyui-layout">
<!-- 左边trace布局 -->
<div data-options="region:'west',title:'TraceList',split:true" style="width:450px;padding:10px">
	<ul id='home-trace'></ul>
	<style>
		.td{width:100px;}
	</style>

	<script type="text/javascript">
		$.ajax({
			type:'GET',
			url:'http://localhost:8080/WineVis/trace/getTraceList',
			//async:false,
			dataType:"json",
			beforeSend:function(XMLHttpRequest){
				$("#loading").html('<img src="./third-lib/easyui/themes/default/images/loading.gif">');
			},
			success:function(data){

				var array = data.TC;
				console.log("zj"+array.length);

				var str = "";
				for (i = 0; i < array.length; i++)
				{
					//str = "<tr><td>" + array[i].id + "</td><td>" + array[i].funName+ "</td><td>" + array[i].threadId+ "</td><td>" + array[i].apartment+ "</td><td>"+ array[i].channel +"</td>";
					//str = "<tr><td>" + array[i].id + "</td><td>" + array[i].funName+ "</td><td>" + array[i].processId+ "</td><td>" + array[i].threadId+ "</td><td>" + array[i].apartment+ "</td><td>"+ array[i].channel +"</td>";
					//str = str + "<td>"+ array[i].layer + "</td></tr>";
					str = "<tr><td>" + array[i].id + "</td><td>" + array[i].funName+ "</td>";
					if(array[i].threadId=="0009"){
						str = str + "<td>"+ array[i].threadId + "</td>";
					}else{
						str = str + "<td style=\"background-color:darkgrey\">"+ array[i].threadId + "</td>";

					}
					str = str + "<td>"+ array[i].apartment+ "</td><td>"+ array[i].channel + "</td>";
					if(array[i].layer=="ole"){
						str = str + "<td style=\"background-color:#009999\">"+ array[i].layer + "</td></tr>";
					}else if(array[i].layer=="rpc"){
						str = str + "<td style=\"background-color:#cc6600\">"+ array[i].layer + "</td></tr>";
					}else{
						str = str + "<td style=\"background-color:#66cc00\">"+ array[i].layer + "</td></tr>";
					}

					$("#trace-table").append(str);
				}
			}
		});
	</script>

	<table id="trace-table" cellspacing="0" cellpadding="3" width="60%" align="center" border="0">
		<tr>
			<th>ID</th>
			<th>FunName</th>
			<%--<th>ProcessId</th>--%>
			<th>ThreadId</th>
			<th>Apartment</th>
			<th>Channel</th>
			<th>Layer</th>
			<%--<th>Parameters</th>
			<th>Detail</th>--%>
		</tr>
	</table>

</div>
<!-- 中间树布局 -->
<div data-options="region:'center',title:'Call Graph',split:true" style="width:350px;padding:10px">
	<ul id='home-tree'></ul>
</div>
<!-- 右边显示内容 -->
<div data-options="region:'east',title:'TraceDetail',split:true" style="width:350px;padding:5px">
	<div id="tree-tabs" class="easyui-tabs" fit="true" border="false">
		<div title="home" closable="true">welcome</div>

	</div>
</div>

</body>
</html>