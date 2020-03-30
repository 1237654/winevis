package com.ssm.dao;

import com.ssm.entity.File;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileMapperDao {

	public File getFileById(int id);

	public List<File> getAllFiles();

	public List<Integer> getChildrenByFileId(int id);

	/*
		获取有子文件的dll的id
	 */
	public List<Integer> getParentIds();

}
