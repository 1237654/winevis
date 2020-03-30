package com.ssm.dao;

import com.ssm.entity.Call;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallMapperDao {

	public List<Call> getCallRelationsByCalleeId(int id);

}
