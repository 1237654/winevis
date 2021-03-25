package com.ssm.util;

import java.io.*;
import java.util.*;

/**
 * @author zhangjie
 * @date 2020/4/4
 */
public class OtherUtil {
    public static void main(String[] args){
        String path1 = "D:\\Repository\\data\\simp_exper4_wine4_tres";
        String path2 = "D:\\Repository\\data\\simp_exper7_wine4_tres";
        String path3 = "D:\\Repository\\data\\susp_func0309.txt";
        String path3_1 = "D:\\Repository\\data\\wrong_func_Jaccard.txt";
        String path3_2 = "D:\\Repository\\data\\wrong_func_Ochiai.txt";
        String path3_3 = "D:\\Repository\\data\\wrong_func_SBI.txt";
        String path4 = "D:\\Repository\\data\\markedErrorFunction.txt";

        //可疑度数据
        File file3 = new File(path3_1);
        final HashMap<String,Double> suslist = new HashMap<>();
        susp(file3,suslist);

        //错误函数列表
        File file4 = new File(path4);
        //List<String> errorlist = new ArrayList<>();
        HashMap<String,List<String>> errorlist = new HashMap<>();
        errorfunc(file4,errorlist);

        /*//第一次测试结果(失败的)
        File file1 = new File(path1);
        HashMap<String,List<String>> test1 = new HashMap<>();
        func(file1,test1);*/

        //第二次测试结果(失败的)
        File file2 = new File(path2);
        HashMap<String,List<String>> test2 = new HashMap<>();
        func(file2,test2);

        /*//差异(第二次测试失败但第一次测试成功)
        HashMap<String,List<String>> diff = new HashMap<>();
        Iterator iter = test2.entrySet().iterator();
        while(iter.hasNext()){
            Map.Entry entry = (Map.Entry)iter.next();
            if(!test1.containsKey(entry.getKey())){
                String name = (String)entry.getKey();
                List<String> trace = (List<String>) entry.getValue();
                Collections.sort(trace, new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        double sus1 = suslist.get(o1);
                        double sus2 = suslist.get(o2);
                        if(sus2-sus1>0){//按可疑度从大到小
                            return 1;
                        }else if(sus2-sus1<0){
                            return -1;
                        }
                        return 0;
                    }
                });
                diff.put(name,trace);
            }
        }*/



        Iterator it = test2.entrySet().iterator();
        while(it.hasNext()){
            Map.Entry entry = (Map.Entry)it.next();
            StringBuilder trace = new StringBuilder();
            for(String s : (List<String>)entry.getValue()){
                if(errorlist.containsKey(s)){
                    String rank = "("+((List<String>) entry.getValue()).indexOf(s)+"$"+((List<String>) entry.getValue()).size()+")";
                    trace.append(s).append(rank);
                    //errorlist.get(s).add(rank);
                }
            }
            System.out.println(entry.getKey()+"?"+trace);
        }

        /*Iterator temp = errorlist.entrySet().iterator();
        while(temp.hasNext()){
            Map.Entry entry = (Map.Entry)temp.next();
            StringBuilder sb = new StringBuilder();
            for(String s : (List<String>)entry.getValue()){
                sb.append(s+",");
            }
            System.out.println("name:"+entry.getKey()+" res:"+sb);
        }*/



    }

    private  static  void errorfunc(File file,HashMap<String,List<String>> map){
        try {
            BufferedReader in = new BufferedReader(new FileReader(file));
            String str;
            while((str=in.readLine())!=null){
                String[] strs = str.split(" ");
                List<String> list = new ArrayList<>();
                map.put(strs[1],list);
                //list.add(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private  static void susp(File file,HashMap<String,Double> map){
        try {
            BufferedReader in = new BufferedReader(new FileReader(file));
            String str;
            while((str=in.readLine())!=null){
                String[] strs = str.split(" ");
                String name = strs[0];
                double sus = Double.valueOf(strs[3]);
                map.put(name,sus);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    private static void func(File file,HashMap<String,List<String>> map){
        File[] files = file.listFiles();
        for(File f : files){
            if(f.isDirectory()){//文件夹
                func(f,map);
            }else{//文件
                try {
                    BufferedReader in = new BufferedReader(new FileReader(f));
                    String str;
                    while((str=in.readLine())!=null){
                        String[] strs = str.split(",");
                        if(strs[0].endsWith("F")){
                            String parent = f.getParent().substring(f.getParent().lastIndexOf("\\")+1);
                            String name = parent+"\\"+strs[0].substring(0,strs[0].length()-2);
                            String trace = "";
                            List<String> list = new ArrayList<>();
                            if(strs.length>1){
                                trace = str.substring(strs[0].length()+1);
                                String[] funs = trace.split(",");
                                list = Arrays.asList(funs);
                            }
                            map.put(name,list);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
