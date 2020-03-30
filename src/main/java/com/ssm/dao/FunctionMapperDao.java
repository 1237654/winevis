package com.ssm.dao;

import com.ssm.entity.Function;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FunctionMapperDao {

	public Function getFunctionById(int id);

	public List<Function> getAllFunctions();

	public List<Function> getFunctionsByFileId(int fileId);
}
