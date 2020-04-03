package com.ssm.entity;

public class Testcase {

	int id;
	String TFunction;
	int functionId;
	int fileId;
	int lineNum;
	String Location;
	String TestRes;


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTFunction() {
		return TFunction;
	}

	public void setTFunction(String TFunction) {
		this.TFunction = TFunction;
	}

	public int getFunctionId() {
		return functionId;
	}

	public void setFunctionId(int functionId) {
		this.functionId = functionId;
	}

	public int getFileId() {
		return fileId;
	}

	public void setFileId(int fileId) {
		this.fileId = fileId;
	}

	public int getLineNum() {
		return lineNum;
	}

	public void setLineNum(int lineNum) {
		this.lineNum = lineNum;
	}

	public String getLocation() {
		return Location;
	}

	public void setLocation(String location) {
		Location = location;
	}

	public String getTestRes() {
		return TestRes;
	}

	public void setTestRes(String testRes) {
		TestRes = testRes;
	}
}
