package com.ssm.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ssm.entity.FileNode;
import com.ssm.entity.Trace;
import com.ssm.service.TraceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

/**
 * @author zhangjie
 * @date 2021/3/24
 */
@Controller
@RequestMapping("/trace")
public class TraceController {

    @Autowired
    private TraceService traceService;

    @RequestMapping("/selectMenuTrees")
    @ResponseBody
    public Object selectMenuTrees(HttpServletRequest request, HttpServletResponse response){

        System.out.println("zjzjzjzj");
        System.out.println("zjzjzjzj");
        //用于接收数据库查询到的数据
        List<Trace> list = new ArrayList<Trace>();
        //用于把接收到的数据改造成EasyUI tree认识的数据格式
        List<com.ssm.entity.FileNode> menuTrees = new ArrayList<com.ssm.entity.FileNode>();
        List<Integer> parentIds = new ArrayList<>();
        try {
            //后台接收到的数据
            list = traceService.getAllTraces();
            parentIds = traceService.getParentIds();
            HashSet<Integer> hashSet =new HashSet<>();
            for (Integer i : parentIds){
                hashSet.add(i);
            }
            for (Trace trace : list){
                FileNode fileNode = traceToFileNode(trace);
                /*if(trace.getParentId()>-1){
                    String name = traceService.getTraceById(trace.getParentId()).getFunName();
                    if(name.equals("tests")){
                        fileNode.setUrl(null);
                    }
                }*/

                menuTrees.add(fileNode);
            }

            for (int id = 0;id<menuTrees.size();id++)
            {
                FileNode fileNode = menuTrees.get(id);
                fileNode.setState("open");
                /*if (list.get(id).getIsDir() == 0) {
                    fileNode.setState("open");
                    continue;
                }*/
                List<Integer> childrenId = traceService.getChildrenByTraceId(id);

                List<FileNode> children = new ArrayList<>();
                if (id == 0)
                {
                    for (Integer cid : childrenId) {
                        //if (hashSet.contains(cid))
                            children.add(menuTrees.get(cid));
                    }
                }
                else {
                    for (Integer cid : childrenId) {
                        children.add(menuTrees.get(cid));
                    }
                }
                fileNode.setChildren(children);
            }

        } catch (Exception e) {
            System.out.println(("MenuTreeController.selectMenuTrees() error:" + e));
        }

        Object obj = JSONArray.toJSON(menuTrees.get(0));
        String jsonstring = obj.toString();

        jsonstring = "["+jsonstring+"]";
        System.out.println(jsonstring);
        return jsonstring;

    }

    @RequestMapping("/getTraceList")
    @ResponseBody
    public void getTraceList(HttpServletResponse response) throws IOException {
        response.reset();
        response.setCharacterEncoding("UTF-8");
        /*Trace trace = traceService.getTraceById(traceId);
        List<Trace> traces = new ArrayList<>();
        traces.add(trace);*/
        List<Trace> traces = traceService.getAllTraces();
        //最后的返回结果
        JSONObject obj = new JSONObject();
        //放置测试用例
        JSONArray trace_arr = new JSONArray();
        for (Trace tc : traces){
            if(tc.getParentId()==-1){
                continue;
            }
            JSONObject jj = new JSONObject();
            jj.put("id",tc.getId());
            jj.put("funName",tc.getFunName());
            jj.put("processId",tc.getProcessId());
            jj.put("threadId",tc.getThreadId());
            jj.put("apartment",tc.getApartment());
            jj.put("channel",tc.getChannel());
            jj.put("layer",tc.getLayer());
            jj.put("parameters",tc.getParameters());
            jj.put("detail",tc.getDetail());
            trace_arr.add(jj);
        }
        obj.put("TC",trace_arr);
        response.getWriter().print(URLDecoder.decode(obj.toString(), "UTF-8"));

    }

    @RequestMapping("/getTraceDetail/{traceId}")
    @ResponseBody
    public void getTraceDetail(@PathVariable(value = "traceId",required = true) Integer traceId, HttpServletResponse response) throws IOException {
        response.reset();
        response.setCharacterEncoding("UTF-8");
        Trace trace = traceService.getTraceById(traceId);
        List<Trace> traces = new ArrayList<>();
        traces.add(trace);
        //List<Trace> traces = traceService.getAllTraces();
        //最后的返回结果
        JSONObject obj = new JSONObject();
        //放置测试用例
        JSONArray trace_arr = new JSONArray();
        for (Trace tc : traces){
            JSONObject jj = new JSONObject();
            jj.put("id",tc.getId());
            jj.put("funName",tc.getFunName());
            jj.put("processId",tc.getProcessId());
            jj.put("threadId",tc.getThreadId());
            jj.put("apartment",tc.getApartment());
            jj.put("channel",tc.getChannel());
            jj.put("layer",tc.getLayer());
            jj.put("parameters",tc.getParameters());
            jj.put("detail",tc.getDetail());
            trace_arr.add(jj);
        }
        obj.put("TC",trace_arr);
        response.getWriter().print(URLDecoder.decode(obj.toString(), "UTF-8"));

    }

    public static FileNode traceToFileNode(Trace trace)
    {
        FileNode fileNode = new FileNode();
        fileNode.setId(trace.getId());
        fileNode.setpId(trace.getParentId());

        fileNode.setState("closed");
        fileNode.setText(trace.getFunName());
        fileNode.setUrl(trace.getLayer());
        /*HashMap<String,Object> hashMap = new HashMap<>();
        hashMap.put("layer",trace.getLayer());
        fileNode.setAttributes(hashMap);*/
        fileNode.setChildren(null);

        return fileNode;
    }

}
