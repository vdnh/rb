package com.ettp.robot.common.tools;

import java.io.File;
//import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.io.Serializable;

import java.text.DateFormat;

import java.util.Date;
//import java.util.Properties;


public class SessionLog extends Log implements Serializable {
  private String sessionId;
  private FileOutputStream fos;
  private PrintStream sessionPrintStream;

  public SessionLog(String sessionId) {
    this.sessionId = sessionId;

    //File logFile = new File();
    try {
      //origin
      //fos = new FileOutputStream("logs" + File.separator + "robot" + File.separator + sessionId, true);
      fos = new FileOutputStream(sessionId, true);
      // for test
      //fos = new FileOutputStream("logs" + File.separator + "robot" + File.separator + sessionId, false);
      sessionPrintStream = new PrintStream(fos, true);
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  public void close() {
    sessionPrintStream.close();

    try {
      fos.close();
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  @Override
  protected synchronized void log(String string) {
    try {
      Date now = new Date();
      System.out.println(string);
      sessionPrintStream.println(DateFormat.getDateInstance(DateFormat.SHORT).format(now) + " " +
        DateFormat.getTimeInstance(DateFormat.MEDIUM).format(now) + " " + string);
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
  }
}
