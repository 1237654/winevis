package com.ssm.util;

import com.ssm.entity.File;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TreeNoteUtil {

	public final static List<File> getFatherNode(List<File> treesList){
		List<File> newTrees = new ArrayList<File>();
		for (File mt : treesList) {
			if (mt.getIsDir() == 1) {//如果pId为空，则该节点为父节点
				//递归获取父节点下的子节点
				mt.setChildren(getChildrenNode(mt.getId(), treesList));
				newTrees.add(mt);
			}
		}
		return newTrees;
	}

	private final static List<File> getChildrenNode(int pId, List<File> treesList){
		List<File> newTrees = new ArrayList<File>();
		for (File mt : treesList) {
			if (mt.getParentId() == -1) continue;
			if(mt.getParentId() == pId){
				//递归获取子节点下的子节点，即设置树控件中的children
				mt.setChildren(getChildrenNode(mt.getId(), treesList));
				//设置树控件attributes属性的数据
//				Map<String, Object> map = new HashMap<String, Object>();
//				map.put("url", "/file/"+mt.getId());
//				mt.setAttributes(map);
				newTrees.add(mt);
			}
		}
		return newTrees;
	}

}
