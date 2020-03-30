package com.ssm.service.impl;

import com.ssm.dao.FunctionMapperDao;
import com.ssm.entity.Function;
import com.ssm.service.FunctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FunctionServiceImpl implements FunctionService{

	@Autowired
	FunctionMapperDao functionMapperDao;

	public Function getFunctionById(int id) {

		return functionMapperDao.getFunctionById(id);
	}

	public List<Function> getAllFunctions() {
		return functionMapperDao.getAllFunctions();
	}

	public List<Function> getFunctionsByFileId(int fileId){

		return functionMapperDao.getFunctionsByFileId(fileId);
	}
}
