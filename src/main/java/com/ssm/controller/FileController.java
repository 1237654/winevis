package com.ssm.controller;

import com.alibaba.fastjson.JSONArray;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssm.entity.FileNode;
import com.ssm.service.FileService;
import com.ssm.service.impl.FileServiceImpl;
import com.ssm.util.TreeNoteUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Controller
@RequestMapping("/file")
public class FileController {

	@Autowired
	private FileService fileService;


	@RequestMapping("/selectFile")
	public void selectFile(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("LLKK");
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");

		int id = Integer.parseInt(request.getParameter("id"));
		com.ssm.entity.File file =fileService.getFileById(id);

		ObjectMapper mapper = new ObjectMapper();

		response.getWriter().write(mapper.writeValueAsString(file));
		response.getWriter().close();

	}

	@RequestMapping("/selectMenuTrees")
	@ResponseBody
	public Object selectMenuTrees(HttpServletRequest request, HttpServletResponse response){

		System.out.println("LLLKKK");
		System.out.println("LLLKKK");
		//用于接收数据库查询到的数据
		List<com.ssm.entity.File> list = new ArrayList<com.ssm.entity.File>();
		//用于把接收到的数据改造成EasyUI tree认识的数据格式
		List<com.ssm.entity.FileNode> menuTrees = new ArrayList<com.ssm.entity.FileNode>();
		List<Integer> parentIds = new ArrayList<>();
		try {
			//后台接收到的数据
			list = fileService.getAllFiles();
			parentIds = fileService.getParentIds();
			HashSet<Integer> hashSet =new HashSet<>();
			for (Integer i : parentIds){
				hashSet.add(i);
			}
			for (com.ssm.entity.File f : list){
				FileNode fileNode = fileToFileNode(f);
				if(f.getParentId()>-1){
					String name = fileService.getFileById(f.getParentId()).getName();
					if(name.equals("tests")){
						fileNode.setUrl(null);
					}
				}

				menuTrees.add(fileNode);
			}

			for (int id = 0;id<menuTrees.size();id++)
			{
				FileNode fileNode = menuTrees.get(id);
				if (list.get(id).getIsDir() == 0) {
					fileNode.setState("open");
					continue;
				}
				List<Integer> childrenId = fileService.getChildrenByFileId(id);

				List<FileNode> children = new ArrayList<>();
				if (id == 0)
				{
					for (Integer cid : childrenId) {
						if (hashSet.contains(cid))
							children.add(menuTrees.get(cid));
					}
				}
				else {
					for (Integer cid : childrenId) {
						children.add(menuTrees.get(cid));
					}
				}
				fileNode.setChildren(children);
			}

		} catch (Exception e) {
			System.out.println(("MenuTreeController.selectMenuTrees() error:" + e));
		}

		Object obj = JSONArray.toJSON(menuTrees.get(0));
		String jsonstring = obj.toString();

		jsonstring = "["+jsonstring+"]";
		System.out.println(jsonstring);
		return jsonstring;

	}

	public static FileNode fileToFileNode(com.ssm.entity.File file)
	{
		FileNode fileNode = new FileNode();
		fileNode.setId(file.getId());
		fileNode.setpId(file.getParentId());

		fileNode.setState("closed");
		fileNode.setText(file.getName());
		fileNode.setUrl("/file/"+file.getId());
		HashMap<String,Object> hashMap = new HashMap<>();
		hashMap.put("url",fileNode.getUrl());
		fileNode.setAttributes(hashMap);
		fileNode.setChildren(null);

		return fileNode;
	}
}
