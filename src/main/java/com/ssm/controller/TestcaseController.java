package com.ssm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssm.entity.Testcase;
import com.ssm.service.TestcaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

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


}
