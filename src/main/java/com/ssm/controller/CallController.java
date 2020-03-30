package com.ssm.controller;

import com.ssm.entity.Call;
import com.ssm.service.CallService;
import com.ssm.service.impl.CallServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/call")
public class CallController {

	@Autowired
	CallService callService;

	@RequestMapping("/{calleeId}")
	public String getCallRelationsByCalleeId(@PathVariable("calleeId") int calleeId,Model model){

		List<Call> calls = callService.getCallRelationsByCalleeId(calleeId);
		model.addAttribute("calls",calls);
		return "list";

	}



}
