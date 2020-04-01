package com.ssm.service;

import com.ssm.entity.Testcase;

import java.util.List;

public interface TestcaseService {

	public List<Testcase> getAllTestcases();

	public Testcase getTestcaseById(int id);

	public List<Testcase> getTestcaseByFileId(int id);

}
