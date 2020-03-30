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



        });
    });

</script>

</head>
<body>
<ul id='home-tree'></ul>
</body>
</html>