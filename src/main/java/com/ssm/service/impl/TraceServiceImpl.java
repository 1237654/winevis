package com.ssm.service.impl;

import com.ssm.dao.TraceMapperDao;
import com.ssm.entity.Trace;
import com.ssm.service.TraceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author zhangjie
 * @date 2021/3/24
 */
@Service
public class TraceServiceImpl implements TraceService {
    @Autowired(required = true)
    TraceMapperDao traceMapperDao;

    @Override
    public Trace getTraceById(int id) {
        return traceMapperDao.getTraceById(id);
    }

    @Override
    public List<Trace> getAllTraces() {
        return traceMapperDao.getAllTraces();
    }

    @Override
    public List<Integer> getChildrenByTraceId(int id) {
        return traceMapperDao.getChildrenByTraceId(id);
    }

    @Override
    public List<Integer> getParentIds() {
        return traceMapperDao.getParentIds();
    }
}
