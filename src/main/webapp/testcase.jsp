<%--
  User: zhangjie
  Date: 2020/4/1
--%>
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



    var fileId = ${param.fileId};
    $.ajax({
        type:'GET',
        url:'http://localhost:8080/WineVis/testcase/getFileTestcase/'+fileId,
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
                if(array[i].result=="fail"){
                    str = "<tr style=\"background-color:#FF0000\"><td>" + array[i].id + "</td><td>" + array[i].name+ "</td><td>" + array[i].lineNum+ "</td><td>" + array[i].location+ "</td><td>" + array[i].result+ "</td>";
                }else{
                    str = "<tr><td>" + array[i].id + "</td><td>" + array[i].name+ "</td><td>" + array[i].lineNum+ "</td><td>" + array[i].location+ "</td><td>" + array[i].result+ "</td>";
                }
                str = str + "<td><a href='trace.jsp'>trace</a></td></tr>";
                $("#testcase-table").append(str);
            }


        }
    });


</script>


<table id="testcase-table" cellspacing="0" cellpadding="3" width="60%" align="center" border="0">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>LineNum</th>
        <th>Location</th>
        <th>Result</th>
        <th>Trace</th>
    </tr>
</table>


</body>


</html>
