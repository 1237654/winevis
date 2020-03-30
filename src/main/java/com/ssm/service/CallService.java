package com.ssm.service;

import com.ssm.entity.Call;

import java.util.List;

public interface CallService {

	public List<Call> getCallRelationsByCalleeId(int id);
}
