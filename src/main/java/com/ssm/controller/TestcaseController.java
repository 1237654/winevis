package com.ssm.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssm.entity.Function;
import com.ssm.entity.Testcase;
import com.ssm.service.TestcaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.List;

@Controller
@RequestMapping("/testcase")
public class TestcaseController {

	@Autowired
	TestcaseService testcaseService;

	@RequestMapping("/selectTestcase")
	public void selectFile(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("LLKK");
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");

		int id = Integer.parseInt(request.getParameter("id"));
		com.ssm.entity.Testcase testcase =testcaseService.getTestcaseById(id);

		ObjectMapper mapper = new ObjectMapper();

		response.getWriter().write(mapper.writeValueAsString(testcase));
		response.getWriter().close();

	}

	@RequestMapping("/getFileTestcase/{fileId}")
	@ResponseBody
	public void getTestcaseOfFile(@PathVariable(value = "fileId",required = true) Integer fileId, HttpServletResponse response) throws IOException {
		response.reset();
		response.setCharacterEncoding("UTF-8");
		List<Testcase> testcases = testcaseService.getTestcaseByFileId(fileId);
		//最后的返回结果
		JSONObject obj = new JSONObject();
		//放置测试用例
		JSONArray testcase_arr = new JSONArray();
		for (Testcase tc : testcases){
			JSONObject jj = new JSONObject();
			jj.put("id",tc.getId());
			jj.put("name",tc.getTFunction());
			jj.put("lineNum",tc.getLineNum());
			jj.put("location",tc.getLocation());
			jj.put("result",tc.getTestRes());
			testcase_arr.add(jj);
		}
		obj.put("TC",testcase_arr);
		response.getWriter().print(URLDecoder.decode(obj.toString(), "UTF-8"));

	}


}
