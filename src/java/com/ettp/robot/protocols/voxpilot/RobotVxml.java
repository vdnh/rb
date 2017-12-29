package com.ettp.robot.protocols.voxpilot;

import com.ettp.pldialog.DialogOutputs_pl;
import com.ettp.pldialog.Dialogs_pl;
import com.ettp.robot.common.AbstractServlet;
import com.ettp.robot.common.RobotSession;
import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.GeneralLog;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.RobotSessionVxml;
import com.ettp.robot.protocols.voxpilot.tools.RobotVoiceXMLWriter;
import com.ettp.robot.protocols.voxpilot.tools.WavTools;

import oracle.ord.im.OrdHttpUploadFile;
import oracle.ord.im.OrdHttpUploadFormData;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;

import java.sql.Timestamp;

import java.util.Hashtable;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class RobotVxml extends AbstractServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  private RobotSession initSession(SessionLog sessionLog, String sessionId, String callerNumber,
    String calledNumber, Long serviceDialogId, Long dialogOutputId) {
    //init RobotSession
    RobotSession robotSession = (RobotSession) robotSessionS.get(sessionId);

    if ((robotSession == null) || serviceDialogId.equals(Constants.INIT_SERVICE_ID) ||
        dialogOutputId.equals(Constants.INIT_SERVICE_ID)) {
      //robotSession = (RobotSession) robotSessionS.get(sessionId);
      try {
        sessionLog.log(SessionLog.INFO, "<<<<< VXML SESSION OPENED >>>>>");
        robotSession = new RobotSessionVxml(sessionLog, sessionId, calledNumber, callerNumber, Constants.VXML);
        robotSessionS.put(sessionId, robotSession);
      }
      catch (Exception ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
        robotSession = null;
      }
    }

    sessionLog.log(SessionLog.FINE, "-=|::: Sessions : " + robotSessionS.size());

    return robotSession;
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setContentType(CONTENT_TYPE);

    /*String sessionId = request.getSession().getId();
    Log.log(Log.FINEST, sessionId);*/
    String sessionId = request.getParameter(Constants.SESSION_ID);
    SessionLog sessionLog = getSessionLog(sessionId);
    sessionLog.log(SessionLog.FINE, "-=|::: GET  " + request.getSession() + "   " + (count++) + " .");
    sessionLog.log(SessionLog.FINEST, "sessionId : " + sessionId);

    String callerNumber = request.getParameter(Constants.CALLER_ID);
    callerNumber = formatCallerNumber(callerNumber);

    //callerNumber = "0660217481";
    sessionLog.log(SessionLog.INFO, "caller = " + callerNumber);

    String calledNumber = request.getParameter(Constants.CALLED_ID);
    calledNumber = formatCalledNumber(calledNumber);
    sessionLog.log(SessionLog.INFO, "called = " + calledNumber);

    Long serviceDialogId = new Long(request.getParameter(Constants.DIALOG_ID));
    sessionLog.log(SessionLog.INFO, "serviceDialogId = " + serviceDialogId);

    //*
    boolean transfer=true;
    if (serviceDialogId.equals(Constants.EXIT_EVENT_SERVICE_ID)) {
    /*/for transfer
      Dialogs_pl ds= new Dialogs_pl();
      
      ds= ds.findByPrimaryKey(serviceDialogId);
      if (!(ds.getDialogName().equalsIgnoreCase("CARD"))){
        transfer=false;
    // end for transfer  */
        sessionLog.log(SessionLog.INFO, "User hanged up, closing session");
        closeConnection(sessionLog, sessionId);
      
      //}
    }
    //*/

    Long dialogOutputId = new Long(request.getParameter(Constants.DIALOG_OUTPUT_ID));
    sessionLog.log(SessionLog.INFO, "dialogOutputId = " + dialogOutputId);

    PrintWriter out = response.getWriter();
    RobotSession robotSession = initSession(sessionLog, sessionId, callerNumber, calledNumber, serviceDialogId,
        dialogOutputId);

    if (robotSession != null) {
      String input = request.getParameter(Constants.INPUT);
      sessionLog.log(SessionLog.INFO, "input = " + input);

      /*if (robotSession.hasNextDialogOutput(input)==null) {
        Log.log(Log.INFO, "Reprompting ........");

        StringBuffer vxmlReprompt = new StringBuffer("");
        vxmlReprompt = robotSession.reprompt(vxmlReprompt);
        out.println(vxmlReprompt);
        out.close();
      }
      else {*/
      robotSession.initNextDialogOutput(input);
      sessionLog.log(SessionLog.INFO, "New DialogOutput ........");
      robotSession.httpResponse = new StringBuffer("");
    
      robotSession.httpResponse = RobotVoiceXMLWriter.addHeader(robotSession.httpResponse);

      boolean continu = robotSession.newDialogOutput();
      /*
      if (transfer)
      {
        continu=transfer;
      }
      //*/
      sessionLog.log(SessionLog.FINEST, "continue dialog : " + continu);
      /*/ajout de Hung
      if (!continu) {
        //robotSession.httpResponse = RobotVoiceXMLWriter.addFinish(robotSession.httpResponse);
        sessionLog.log(SessionLog.FINEST, "closing : " + !continu);
        closeConnection(sessionLog, sessionId);
      }
      //*/
      robotSession.httpResponse = RobotVoiceXMLWriter.addHangUpCatch(robotSession.httpResponse, callerNumber,
          calledNumber);
      robotSession.httpResponse = RobotVoiceXMLWriter.addFooter(robotSession.httpResponse);

      sessionLog.log(SessionLog.FINE, robotSession.httpResponse.toString());
      out.println(robotSession.httpResponse);
      out.close();
     //
      if (!continu) {
        sessionLog.log(SessionLog.FINEST, "closing : " + !continu);
        closeConnection(sessionLog, sessionId);
      }
      //*/
    }
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
    if (calledNumber.indexOf(":") >= 0) {
      calledNumber = calledNumber.substring(calledNumber.indexOf(":") + 1, calledNumber.length());
    }

    if (calledNumber.indexOf("@") >= 0) {
      calledNumber = calledNumber.substring(0, calledNumber.indexOf("@"));
    }

    int size = calledNumber.length();

    if ((size < 10) && (size > 3)) {
      return (Constants.REFERENCE_NUMBER.substring(0, Constants.REFERENCE_NUMBER.length() - size) + calledNumber);
    }
    else {
      return calledNumber;
    }
  }

  //recording
  public void doPost(HttpServletRequest req, HttpServletResponse res)
    throws ServletException, IOException {
    OrdHttpUploadFormData formData = new OrdHttpUploadFormData(req);
    formData.parseFormData();

    String sessionId = formData.getParameter(Constants.SESSION_ID);
    SessionLog sessionLog = getSessionLog(sessionId);
    sessionLog.log(SessionLog.FINE, "-=|::: POST  " + req.getSession() + "   " + (count++) + " .");
    sessionLog.log(SessionLog.FINEST, sessionId);

    String callerNumber = formData.getParameter(Constants.CALLER_ID);
    sessionLog.log(SessionLog.INFO, "caller = " + callerNumber);

    String calledNumber = formData.getParameter(Constants.CALLED_ID);
    sessionLog.log(SessionLog.INFO, "called = " + calledNumber);

    sessionId = formData.getParameter(Constants.SESSION_ID);
    sessionLog.log(SessionLog.FINEST, sessionId);

    Long serviceDialogId = new Long(formData.getParameter(Constants.DIALOG_ID));
    sessionLog.log(SessionLog.INFO, "serviceDialogId = " + serviceDialogId);

    Long dialogOutputId = new Long(formData.getParameter(Constants.DIALOG_OUTPUT_ID));
    sessionLog.log(SessionLog.INFO, "dialogOutputId = " + dialogOutputId);

    String termchar = formData.getParameter(Constants.INPUT);

    Double duration = new Double(Double.parseDouble(formData.getParameter(Constants.RECORDING_DURATION)) / (double) 1000.0);

    sessionLog.log(SessionLog.INFO, "duration = " + duration.doubleValue());

    String wavFile = formData.getParameter(Constants.WAV_FILE);
    sessionLog.log(SessionLog.FINE, "filename = " + wavFile);

    OrdHttpUploadFile wavUpFile = formData.getFileParameter(Constants.RECORDING_VARIABLE_NAME);
    sessionLog.log(SessionLog.FINE, "original file name = " + wavUpFile.getSimpleFileName());
    sessionLog.log(SessionLog.FINE, "file size = " + wavUpFile.getContentLength());

    RobotSession robotSession = ((RobotSession) robotSessionS.get(sessionId));

    if ((termchar == null) || (termchar.length() == 0)) {
      //Re-record or validate?!
      termchar = "*";
    }

    if (termchar.equals("#")) {
      try {
        //byte[] tmpBytes = new byte[wavUpFile.getContentLength()];
        byte[] bytes = new byte[wavUpFile.getContentLength()];
        sessionLog.log(SessionLog.FINE, "Recording length : " + bytes.length);
        wavUpFile.getInputStream().read(bytes);
        sessionLog.log(SessionLog.FINE, "Cut last 100ms, new length : " + (bytes.length - 800));
        bytes = WavTools.cutEnd(bytes, 800);

        //size limit to upload blob in background
        Timestamp ts = new Timestamp(System.currentTimeMillis());
        robotSession.addRecording(bytes, duration, Constants.RECORDING + termchar, ts);

        if (!wavFile.equals("")) {
          sessionLog.log(SessionLog.INFO, " save file = " + wavFile);

          String languageCode = robotSession.getOriginLanguageCode();
          String group = robotSession.getOriginGroupCode();

          try {
            if (robotSession.getVariable(Constants.VARIABLE_LANGUAGE) != null) {
              languageCode = (String) robotSession.getVariable(Constants.VARIABLE_LANGUAGE);
            }

            sessionLog.log(SessionLog.FINEST, "\tvariable language code = " + languageCode);

            if (robotSession.getVariable(Constants.VARIABLE_GROUP_ID) != null) {
              Long groupId = new Long((String) robotSession.getVariable(Constants.VARIABLE_GROUP_ID));
              group = robotSession.getGroupCode(groupId);
            }

            sessionLog.log(SessionLog.FINEST, "\tvariable group = " + group);
          }
          catch (Exception ex) {
            sessionLog.log(SessionLog.SEVERE, ex);
          }

          String recordFileDirName = Constants.RECORD_DIR + File.separator + group + File.separator + languageCode;
          File recordFileDir = new File(recordFileDirName);

          if (!recordFileDir.exists()) {
            recordFileDir.mkdirs();
          }

          sessionLog.log(SessionLog.INFO, "Recording file : " + wavFile + " to : " + recordFileDirName);

          // if (bytes.length > 59) {
          FileOutputStream fos = new FileOutputStream(recordFileDirName + File.separator + wavFile + ".wav");
          fos.write(bytes);
          fos.flush();
          fos.close();

          //}
        }

        /*}
        else {
          termchar = "*";
        }*/
      }
      catch (Exception ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
      }
    }

    sessionLog.log(SessionLog.FINE, "after recording : " + termchar);
    res.setContentType(CONTENT_TYPE);

    StringBuffer vxml = new StringBuffer("");
    vxml = RobotVoiceXMLWriter.addHeader(vxml);
    vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);
    vxml = RobotVoiceXMLWriter.addRecordingSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        termchar);
    vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);
    vxml = RobotVoiceXMLWriter.addFooter(vxml);
    sessionLog.log(SessionLog.FINEST, vxml.toString());

    PrintWriter out = res.getWriter();
    out.println(vxml);
    out.close();
  }

  protected static void closeConnection(SessionLog sessionLog, String sessionId) {
    /*/ajout de Hung
    Object o=new Object();
    try
    {
      synchronized(o) { o.wait(1000); }
    }
    catch(InterruptedException ex) { }
    //*/
    try {
      RobotSession robotSession = (RobotSession) robotSessionS.get(sessionId);
      sessionLog.log(SessionLog.INFO, "closing session : " + robotSession);
      robotSession.closeConnection();
      robotSessionS.remove(sessionId);
      robotSession = null;
      sessionLog.log(SessionLog.INFO, "<<<<< VXML SESSION CLOSED >>>>>");

      sessionLoggers.remove(sessionId);
      //sessionLog.close();
      //sessionLog = null;
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    //sessionLoggers.remove(sessionId);
    //sessionLog.close();
    //sessionLog = null;
  }
}
