package com.ssm.util;

import com.alibaba.fastjson.JSONArray;
import com.ssm.entity.File;
import com.ssm.entity.FileNode;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
/**
 * @author zhangjie
 * @date 2020/4/3
 */
public class TraceUtil {
    //public final static List<FileNode> getTraceTree(){
    public static void main(String[] args){
        List<FileNode> list = new ArrayList<>();
        try {
            BufferedReader in = new BufferedReader(new FileReader("D:\\Repository\\vis_files\\dmime\\dmime.c_68.txt"));
            int i=0;
            FileNode root = new FileNode();
            List<FileNode> children = new ArrayList<>();
            root.setChildren(children);
            root.setText("dmime.c_68");
            root.setId(i);
            i++;
            root.setpId(-1);
            root.setUrl("-1");//level
            list.add(root);

            String str;
            while((str=in.readLine())!=null){
                FileNode node = new FileNode();
                List<FileNode> c = new ArrayList<>();
                node.setChildren(c);
                node.setId(i);
                i++;
                int level = 0;
                while(str.startsWith("-")){
                    level++;
                    str = str.substring(1);
                }
                node.setText(str);
                node.setUrl(String.valueOf(level));
                list.add(node);
                //System.out.println(str);
            }
            LinkedList<FileNode> parents = new LinkedList<>();//stack
            parents.push(root);
            for(int m=1;m<list.size();m++){
                FileNode node = list.get(m);
                if(Integer.valueOf(node.getUrl())>Integer.valueOf(parents.peek().getUrl())){
                    node.setpId(parents.peek().getId());
                    parents.push(node);
                }else{
                    while(Integer.valueOf(node.getUrl())<=Integer.valueOf(parents.peek().getUrl())){
                        parents.pop();
                    }
                    node.setpId(parents.peek().getId());
                    parents.push(node);
                }
                //System.out.println("id:"+node.getId()+" pid"+node.getpId()+" text:"+node.getText()+" level:"+node.getUrl());
            }
            for(int m=1;m<list.size();m++){
                FileNode node = list.get(m);
                FileNode par = list.get(node.getpId());
                par.getChildren().add(node);
            }
            /*for(int m=0;m<list.size();m++){
                FileNode node = list.get(m);
                System.out.println("id:"+node.getId()+" pid"+node.getpId()+" text:"+node.getText()+" children-size:"+node.getChildren().size());
            }*/
            Object obj = JSONArray.toJSON(list.get(0));
            String jsonstring = obj.toString();

            jsonstring = "["+jsonstring+"]";
            System.out.println(jsonstring);

        } catch (IOException e) {
            e.printStackTrace();
        }
        //return list;
    }
}
