<%--
  User: zhangjie
  Date: 2020/4/4
--%>
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

    <style>
        .tree-icon{
            background:url("") no-repeat center center !important;
            /*background:url('./resource/images/test.png') no-repeat center center !important;*/
        }
    </style>

    <script type="text/javascript">

        var tree_data = [{
            "children": [{
                "children": [{
                    "children": [{
                        "children": [{
                            "children": [],
                            "attributes": {},
                            "pId": 3,
                            "id": 4,
                            "state": "open",
                            "text": "COM_OpenKeyForCLSID"
                        }],
                        "attributes": {},
                        "pId": 2,
                        "id": 3,
                        "state": "open",
                        "text": "CoGetTreatAsClass"
                    }, {
                        "children": [{
                            "children": [],
                            "attributes": {},
                            "pId": 5,
                            "id": 6,
                            "state": "open",
                            "text": "COM_GetRegisteredClassObject"
                        }, {
                            "children": [],
                            "attributes": {},
                            "pId": 5,
                            "id": 7,
                            "state": "open",
                            "text": "COM_OpenKeyForCLSID"
                        }, {
                            "children": [{
                                "children": [],
                                "attributes": {},
                                "pId": 8,
                                "id": 9,
                                "state": "open",
                                "text": "get_object_dll_path"
                            }, {
                                "children": [{
                                    "children": [],
                                    "attributes": {},
                                    "pId": 10,
                                    "id": 11,
                                    "state": "open",
                                    "text": "DllGetClassObject"
                                }],
                                "attributes": {},
                                "pId": 8,
                                "id": 10,
                                "state": "open",
                                "text": "apartment_getclassobject"
                            }],
                            "attributes": {},
                            "pId": 5,
                            "id": 8,
                            "state": "open",
                            "text": "get_inproc_class_object"
                        }],
                        "attributes": {},
                        "pId": 2,
                        "id": 5,
                        "state": "open",
                        "text": "CoGetClassObject"
                    }, {
                        "children": [{
                            "children": [],
                            "attributes": {},
                            "pId": 12,
                            "id": 13,
                            "state": "open",
                            "text": "FileMonikerImpl_Construct"
                        }],
                        "attributes": {},
                        "pId": 2,
                        "id": 12,
                        "state": "open",
                        "text": "FileMoniker_CreateInstance"
                    }],
                    "attributes": {},
                    "pId": 1,
                    "id": 2,
                    "state": "open",
                    "text": "CoCreateInstanceEx"
                }],
                "attributes": {},
                "pId": 0,
                "id": 1,
                "state": "open",
                "text": "CoCreateInstance"
            }, {
                "children": [],
                "attributes": {},
                "pId": 0,
                "id": 14,
                "state": "open",
                "text": "FileMonikerImpl_Reduce"
            }],
            "attributes": {},
            "pId": -1,
            "id": 0,
            "state": "open",
            "text": "trace"
        }];

        $(function(){
            $('#home-tree').tree({
                data:tree_data,
//            url : 'http://localhost:8080/WineVis/file/selectMenuTrees',
//            onLoadSuccess: function(node, data){
//            },
            });
        });

    </script>

</head>
<body>
<ul id='home-tree'></ul>
</body>
</html>
