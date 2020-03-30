package com.ssm.service.impl;


import com.ssm.dao.FileMapperDao;
import com.ssm.entity.File;
import com.ssm.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class FileServiceImpl implements FileService{

	@Autowired(required = true)
	FileMapperDao fileMapperDao;

	public File getFileById(int id)
	{
		return fileMapperDao.getFileById(id);
	}

	public List<File> getAllFiles(){
		return fileMapperDao.getAllFiles();
	}

	public List<Integer> getChildrenByFileId(int id){

		return fileMapperDao.getChildrenByFileId(id);
	}

	public List<Integer> getParentIds(){

		return fileMapperDao.getParentIds();
	}

}
