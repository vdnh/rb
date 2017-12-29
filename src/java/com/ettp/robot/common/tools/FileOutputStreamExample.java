    
    package com.ettp.robot.common.tools;
    
//import com.ettp.robot.common.tools.logs.*;
//import java.io.File;
import java.io.FileOutputStream;  
import java.io.PrintStream;
import java.text.DateFormat;
import java.util.Date;
    public class FileOutputStreamExample {  
        public static void main(String args[]){    
            PrintStream sessionPrintStream;
               try{    
//                 FileOutputStream fout=new FileOutputStream("testout.txt", true);    
//                 String s="Welcome to javaTpoint.";    
                 FileOutputStream fout=new FileOutputStream("testout", true);    
                 String s="Welcome to javaTpoint.\n ";    
                 byte b[]=s.getBytes();//converting string into byte array 
                 fout.write(b);    
                 sessionPrintStream = new PrintStream(fout, true);
                 try {
                    Date now = new Date();
                    System.out.println(s);
                    sessionPrintStream.println(DateFormat.getDateInstance(DateFormat.SHORT).format(now) + " " +
                        DateFormat.getTimeInstance(DateFormat.MEDIUM).format(now) + " " + s);
                }
                catch (Exception ex) {
                    ex.printStackTrace();
                }
                 
                 fout.close();    
                 System.out.println("success...");    
                }catch(Exception e){System.out.println(e);}    
          }    
    }  