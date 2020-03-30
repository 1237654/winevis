package com.ssm.service;

import com.ssm.entity.Function;

import java.util.List;

public interface FunctionService {

	public Function getFunctionById(int id);

	public List<Function> getAllFunctions();

	public List<Function> getFunctionsByFileId(int fileId);

}
