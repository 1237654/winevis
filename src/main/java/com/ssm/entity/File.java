package com.ssm.entity;

import java.util.List;

public class File {

	int id;
	String name;
	int isDir;
	int parentId;
	String location;

	public List<File> getChildren() {
		return children;
	}

	public void setChildren(List<File> children) {
		this.children = children;
	}

	List<File> children;


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getIsDir() {
		return isDir;
	}

	public void setIsDir(int isDir) {
		this.isDir = isDir;
	}

	public int getParentId() {
		return parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
}
