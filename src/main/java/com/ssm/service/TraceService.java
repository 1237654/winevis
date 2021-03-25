package com.ssm.service;


import com.ssm.entity.Trace;

import java.util.List;

/**
 * @author zhangjie
 * @date 2021/3/24
 */
public interface TraceService {

    public Trace getTraceById(int id);

    public List<Trace> getAllTraces();

    public List<Integer> getChildrenByTraceId(int id);

    public List<Integer> getParentIds();
}
