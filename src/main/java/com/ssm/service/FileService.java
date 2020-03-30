package com.ssm.service;

import com.ssm.entity.File;

import java.util.List;

public interface FileService {

	public File getFileById(int id);

	public List<File> getAllFiles();

	public List<Integer> getChildrenByFileId(int id);

	public List<Integer> getParentIds();


}
