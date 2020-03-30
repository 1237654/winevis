package com.ssm.dao;

import com.ssm.entity.Testcase;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestcaseMapperDao {

	public List<Testcase> getAllTestcases();

	public Testcase getTestcaseById(int id);

}
