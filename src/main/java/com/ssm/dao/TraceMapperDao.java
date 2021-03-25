package com.ssm.dao;

import com.ssm.entity.Trace;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author zhangjie
 * @date 2021/3/24
 */

@Repository
public interface TraceMapperDao {
    public Trace getTraceById(int id);

    public List<Trace> getAllTraces();

    public List<Integer> getChildrenByTraceId(int id);

    /*
        获取有子文件的dll的id
     */
    public List<Integer> getParentIds();
}
