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

            url : 'http://localhost:8080/WineVis/file/selectMenuTrees',
            onLoadSuccess: function(node, data){
            },
			onClick:function(node){
            	if( $('#home-tree').tree('isLeaf', node.target)){
					//alert(node.url);
					if(node.url==null){
						addTab(node.text,'testcase.jsp?fileId='+node.id);
					}
					addTab(node.text, 'fun.jsp?fileId='+node.id);
				}

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
<!-- 左边树形布局 -->
<div data-options="region:'west',title:'Tree',split:true,collapsible:false" style="width:150px;padding:10px">
	<ul id='home-tree'></ul>
</div>
<!-- 右边显示内容 -->
<div data-options="region:'center',title:'CallGraph'" style="padding:5px">
	<div id="tree-tabs" class="easyui-tabs" fit="true" border="false">
		<div title="home" closable="true">welcome</div>

	</div>
</div>

</body>
</html>