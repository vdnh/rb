/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ettp.robot.common;

import com.ettp.robot.common.tools.SessionLog;

//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.PrintWriter;

import java.sql.Timestamp;

import java.util.Hashtable;

//import javax.servlet.*;
import javax.servlet.http.*;


public abstract class AbstractServlet extends HttpServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";
  public static Hashtable robotSessionS = new Hashtable();
  public static Hashtable sessionLoggers = new Hashtable();
  protected int count = 0;

  protected SessionLog getSessionLog(String sessionId) {
    SessionLog sessionLog = (SessionLog) sessionLoggers.get(sessionId);

    if ((sessionLog == null)) {
      sessionLog = new SessionLog(sessionId);
      sessionLoggers.put(sessionId, sessionLog);
    }

    return sessionLog;
  }

  protected String formatCallerNumber(String callerNumber) {
    int size = callerNumber.length();

    if (size < 10) {
      String zeros = "";

      for (int i = 0; i < (10 - size); i++) {
        zeros += "0";
      }

      return (zeros + callerNumber);
    }
    else {
      return callerNumber;
    }
  }

  protected String formatCalledNumber(String calledNumber) {
    int size = calledNumber.length();

    if ((size < 10) && (size > 6)) {
      return (Constants.REFERENCE_NUMBER.substring(0, Constants.REFERENCE_NUMBER.length() - size) + calledNumber);
    }
    else {
      return calledNumber;
    }
  }

  protected String addTextRecording(SessionLog sessionLog, String text, RobotSession robotSession, String input) {
    try {
      sessionLog.log(SessionLog.FINE, "Recording : " + text);

      Timestamp ts = new Timestamp(System.currentTimeMillis());
      robotSession.addRecording(text, new Double(0), input, ts);

      return text;
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);

      return "";
    }
  }
}
