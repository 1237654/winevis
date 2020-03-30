package com.ssm.service.impl;

import com.ssm.dao.CallMapperDao;
import com.ssm.entity.Call;
import com.ssm.service.CallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CallServiceImpl implements CallService {

	@Autowired
	CallMapperDao callMapperDao;

	public List<Call> getCallRelationsByCalleeId(int id) {
		return callMapperDao.getCallRelationsByCalleeId(id);
	}
}
