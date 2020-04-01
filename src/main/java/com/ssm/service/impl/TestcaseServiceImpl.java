package com.ssm.service.impl;

import com.ssm.dao.TestcaseMapperDao;
import com.ssm.entity.Testcase;
import com.ssm.service.TestcaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestcaseServiceImpl implements TestcaseService {

	@Autowired
	TestcaseMapperDao testcaseMapperDao;
	public List<Testcase> getAllTestcases() {

		return testcaseMapperDao.getAllTestcases();
	}

	public Testcase getTestcaseById(int id){
		return testcaseMapperDao.getTestcaseById(id);
	}

	public List<Testcase> getTestcaseByFileId(int id){
		return testcaseMapperDao.getTestcaseByFileId(id);
	}
}
