package com.ssm.entity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/*
	绘制文件树时的文件节点对象
 */
public class FileNode {

	private int id;

	private int pId; //父节点id

	private String text;

	private String state;

	private String url;

	private Map<String, Object> attributes = new HashMap<String, Object>(); // 添加到节点的自定义属性

	private List<FileNode> children; //子节点数据

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getpId() {
		return pId;
	}

	public void setpId(int pId) {
		this.pId = pId;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Map<String, Object> getAttributes() {
		return attributes;
	}

	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	public List<FileNode> getChildren() {
		return children;
	}

	public void setChildren(List<FileNode> children) {
		this.children = children;
	}
}
