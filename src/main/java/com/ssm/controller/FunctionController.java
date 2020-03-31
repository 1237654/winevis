package com.ssm.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssm.entity.Call;
import com.ssm.entity.Function;
import com.ssm.service.CallService;
import com.ssm.service.FunctionService;
import netscape.javascript.JSObject;
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
import java.util.HashSet;
import java.util.List;

@Controller
@RequestMapping("/function")
public class FunctionController {

	@Autowired
	FunctionService functionService;

	@Autowired
	CallService callService;

	@RequestMapping("/selectFunction")
	public void selectFunction(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("Function");
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");

		int id = Integer.parseInt(request.getParameter("id"));
		Function function = functionService.getFunctionById(id);

		ObjectMapper mapper = new ObjectMapper();

		response.getWriter().write(mapper.writeValueAsString(function));
		response.getWriter().close();

	}

	@RequestMapping("/getFileFunction/{fileId}")
	@ResponseBody
	public void getFunctionsOfFile(@PathVariable(value = "fileId",required = true) Integer fileId,HttpServletResponse response) throws Exception
	{
		System.out.println("1");
		System.out.println("getFunctionsOfFile");
		System.out.println(fileId);
		response.reset();
		response.setCharacterEncoding("UTF-8");
		List<Function> functions = functionService.getFunctionsByFileId(fileId);

		//最后的返回结果
		JSONObject obj = new JSONObject();

		//放置函数
		JSONArray function_arr = new JSONArray();
		//放置调用关系
		JSONArray link_arr = new JSONArray();

		HashSet<Integer> functionsIdSet = new HashSet<>();

		for (Function f : functions){

			JSONObject jj = new JSONObject();
			jj.put("id",f.getId());
			jj.put("label",f.getName());
			function_arr.add(jj);
			functionsIdSet.add(f.getId());
		}

		obj.put("GC",function_arr);

		for (Function f: functions)
		{
			List<Call> l = callService.getCallRelationsByCalleeId(f.getId());
			for ( Call c : l )
			{
				if (functionsIdSet.contains(c.getCallerId())){
					JSONObject link = new JSONObject();
					link.put("source",c.getCallerId());
					link.put("target",c.getCalleeId());
					link_arr.add(link);
				}
			}
		}
		obj.put("LINK",link_arr);
		response.getWriter().print(URLDecoder.decode(obj.toString(), "UTF-8"));


	}
}
