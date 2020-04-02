package com.ssm.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ssm.entity.Call;
import com.ssm.entity.Function;
import com.ssm.service.CallService;
import com.ssm.service.FunctionService;
import com.ssm.service.impl.CallServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.List;

@Controller
@RequestMapping("/call")
public class CallController {

	@Autowired
	CallService callService;
	@Autowired
	FunctionService functionService;

	@RequestMapping("/{calleeId}")
	public String getCallRelationsByCalleeId(@PathVariable("calleeId") int calleeId,Model model){

		List<Call> calls = callService.getCallRelationsByCalleeId(calleeId);
		model.addAttribute("calls",calls);
		return "list";

	}

	@RequestMapping("/getCallRelationsByFunId/{funId}")
	@ResponseBody
	public void getCallRelationsByFunId(@PathVariable(value = "funId",required = true) Integer funId, HttpServletResponse response) throws IOException {
		response.reset();
		response.setCharacterEncoding("UTF-8");
		List<Call> callers = callService.getCallRelationsByCalleeId(funId);
		List<Call> callees = callService.getCallRelationsByCallerId(funId);
		//最后的返回结果
		JSONObject obj = new JSONObject();
		//放置函数
		JSONArray function_arr = new JSONArray();
		//放置调用关系
		JSONArray link_arr = new JSONArray();

		Function f = functionService.getFunctionById(funId);
		JSONObject jj = new JSONObject();
		jj.put("id",f.getId());
		jj.put("label",f.getName());
		function_arr.add(jj);
		for(Call c : callers){
			Function fun = functionService.getFunctionById(c.getCallerId());
			JSONObject oj = new JSONObject();
			oj.put("id",fun.getId());
			oj.put("label",fun.getName());
			function_arr.add(oj);
			JSONObject link = new JSONObject();
			link.put("source",c.getCallerId());
			link.put("target",c.getCalleeId());
			link_arr.add(link);
		}
		for(Call c : callees){
			Function fun = functionService.getFunctionById(c.getCalleeId());
			JSONObject oj = new JSONObject();
			oj.put("id",fun.getId());
			oj.put("label",fun.getName());
			function_arr.add(oj);
			JSONObject link = new JSONObject();
			link.put("source",c.getCallerId());
			link.put("target",c.getCalleeId());
			link_arr.add(link);
		}

		obj.put("FUN",function_arr);
		obj.put("REL",link_arr);
		response.getWriter().print(URLDecoder.decode(obj.toString(), "UTF-8"));




	}



}
