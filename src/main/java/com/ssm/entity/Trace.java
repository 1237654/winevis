package com.ssm.entity;

import java.util.List;

/**
 * @author zhangjie
 * @date 2021/3/24
 */
public class Trace {

    int id;
    int tPointId;
    String funName;
    int parentId;
    String processId;
    String threadId;
    String apartment;
    String channel;
    String layer;
    String parameters;
    String detail;

    List<Trace> children;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int gettPointId() {
        return tPointId;
    }

    public void settPointId(int tPointId) {
        this.tPointId = tPointId;
    }

    public String getFunName() {
        return funName;
    }

    public void setFunName(String funName) {
        this.funName = funName;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public String getThreadId() {
        return threadId;
    }

    public void setThreadId(String threadId) {
        this.threadId = threadId;
    }

    public String getApartment() {
        return apartment;
    }

    public void setApartment(String apartment) {
        this.apartment = apartment;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public List<Trace> getChildren() {
        return children;
    }

    public void setChildren(List<Trace> children) {
        this.children = children;
    }
}
