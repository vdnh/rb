package com.ettp.robot.protocols.voxpilot;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.DictophoneFilesManager;
import com.ettp.robot.protocols.voxpilot.tools.RobotVoiceXMLWriter;
import com.ettp.robot.protocols.voxpilot.tools.DictophoneVoiceXMLWriter;

import oracle.ord.im.OrdHttpUploadFile;
import oracle.ord.im.OrdHttpUploadFormData;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class Dictophone extends HttpServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";
  public static final String PLAY_FORM = "play_mode";
  private static final String PLAY_FIELD = "play";
  private static final String PLAY_GRAMAR = "play_grammar";
  private static final String PAUSE_FORM = "pause_mode";
  private static final String PAUSE_FIELD = "pause";
  private static final String PAUSE_GRAMMAR = "pause_grammar";
  private static final String RECORD_FORM = "record_mode";
  private static final String RECORD_FIELD = "record";
  private static final String RECORD_GRAMMAR = "record_grammar";
  public static final String INITIAL_HELP_FORM = "initial_help";
  public static final String HELP_FORM = "help";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setContentType(CONTENT_TYPE);

    String sessionId = request.getParameter(Constants.SESSION_ID);
    SessionLog sessionLog = (SessionLog) RobotVxml.sessionLoggers.get(sessionId);
    sessionLog.log(SessionLog.FINEST, sessionId);

    String callerNumber = request.getParameter(Constants.CALLER_ID);

    //callerNumber = formatCallerNumber(callerNumber);
    //callerNumber = "0660217481";
    sessionLog.log(SessionLog.INFO, "caller = " + callerNumber);

    String calledNumber = request.getParameter(Constants.CALLED_ID);

    //calledNumber = formatCalledNumber(calledNumber);
    sessionLog.log(SessionLog.INFO, "called = " + calledNumber);

    Long serviceDialogId = new Long(request.getParameter(Constants.DIALOG_ID));
    sessionLog.log(SessionLog.INFO, "serviceDialogId = " + serviceDialogId);

    if (serviceDialogId.equals(Constants.EXIT_EVENT_SERVICE_ID)) {
      sessionLog.log(SessionLog.INFO, "User hanged up, closing session");
      closeConnection(sessionLog, sessionId);
    }

    Long dialogOutputId = new Long(request.getParameter(Constants.DIALOG_OUTPUT_ID));
    sessionLog.log(SessionLog.INFO, "dialogOutputId = " + dialogOutputId);

    PrintWriter out = response.getWriter();
    String input = request.getParameter(Constants.INPUT);
    sessionLog.log(SessionLog.INFO, "input = " + input);

    String stringLogId = request.getParameter(Constants.RECORDING_LOG_ID);
    sessionLog.log(SessionLog.INFO, "logId = " + stringLogId);

    DictophoneFilesManager dfm = new DictophoneFilesManager(sessionId);
    long logId = -1;

    try {
      logId = Long.parseLong(stringLogId);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    //TODO a effacer : pour tester uniquement
    //logId = 10;

    /*if (logId == -1) {
      logId = dfm.newRecordingLog().longValue();
    }*/
    StringBuffer vxml = new StringBuffer("");
    vxml = DictophoneVoiceXMLWriter.addHeader(vxml);

    //quit
    if ((input != null) && input.equals("dtmf-star")) {
      dfm.setOriginalBlob(new Long(logId));
      vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, "commit");
      vxml = DictophoneVoiceXMLWriter.addBlockHeader(vxml);

      vxml = DictophoneVoiceXMLWriter.addToRobotSubmit(vxml, callerNumber, calledNumber, serviceDialogId,
          dialogOutputId, logId);
      vxml = DictophoneVoiceXMLWriter.addBlockFooter(vxml);
      vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);
    }

    //quit and save
    else if ((input != null) && input.equals("dtmf-pound")) {
      dfm.setNewBlob(new Long(logId));
      vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, "rollback");
      vxml = DictophoneVoiceXMLWriter.addBlockHeader(vxml);
      vxml = DictophoneVoiceXMLWriter.addToRobotSubmit(vxml, callerNumber, calledNumber, serviceDialogId,
          dialogOutputId, logId);
      vxml = DictophoneVoiceXMLWriter.addBlockFooter(vxml);
      vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);
    }

    //dictophone
    else {
      /* try{
         Thread.sleep(5000);
       }catch(Exception ex) {
         ex.printStackTrace();
       }*/
      float fileLength = dfm.initFiles(new Long(logId));

      vxml.append("<var name=\"length\" expr=\"" + fileLength + "\"/>\n");

      if (dfm.isNew()) {
        vxml = DictophoneVoiceXMLWriter.addInitialHelp(vxml);
      }

      //getPlayModeForm(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,"file:../../www/en-US/sites/helloWorld/rossiaud_0447.wav", logId);
      getPlayModeForm(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        Constants.TMP_WAV_URL + sessionId, logId);
      getPauseModeForm(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId, logId);
      getRecordModeForm(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId, logId);
      vxml = DictophoneVoiceXMLWriter.addHelp(vxml);

      vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);
    }

    vxml = DictophoneVoiceXMLWriter.addFooter(vxml);
    sessionLog.log(SessionLog.FINE, vxml.toString());
    out.println(vxml);
    out.close();
  }

  private void getPlayModeForm(StringBuffer vxml, String callerNumber, String calledNumber, Long serviceDialogId,
    Long dialogOutputId, String fileName, long logId) {
    vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, PLAY_FORM);

    //play mode
    vxml = DictophoneVoiceXMLWriter.addFieldHeader(vxml, PLAY_FIELD);

    vxml.append("<prompt>\n");

    //vxml.append("play from : \n");
    //vxml.append("<value expr=\"position\"/>\n");
    vxml.append("<audio src=\"" + fileName + "\" offsetexpr=\"position\"/>\n");
    vxml.append("</prompt>\n");

    vxml = DictophoneVoiceXMLWriter.addGrammar(vxml, PLAY_GRAMAR);
    vxml = DictophoneVoiceXMLWriter.addFilledHeader(vxml);
    vxml.append("<assign name=\"offset\" expr=\"lastresult$.bargeintime\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position+(offset*1000)\"/>\n");

    /*vxml.append("<if cond=\"position &lt; (offset*1000)\">\n");
    vxml.append("<assign name=\"position\" expr=\"(offset*1000)\"/>\n");
    vxml.append("</if>\n");
    */
    //1 rewind - rewind 5s and replay from new position (begin if position is negative)
    vxml.append("<if cond=\"" + PLAY_FIELD + " == 'dtmf-1'\">\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position-5000\"/>\n");
    vxml.append("<if cond=\"position &lt; '0'\">\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml.append("</if>\n");
    vxml.append("<value expr=\"position\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //2 pause - add bargein time to actual position and pause
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-2'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"(position+(offset*1000))\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PAUSE_FORM);

    //3 forward - forward 5s and replay from new position
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-3'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position+5000\"/>\n");
    vxml.append("<if cond=\"length &lt; position\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml.append("</if>\n");
    vxml.append("<value expr=\"position\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //4 quick rewind - rewind 20s and replay from new position
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-4'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append(" <assign name=\"position\" expr=\"position-20000\"/>\n");
    vxml.append("<if cond=\"position &lt; '0'\">\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml.append("</if>\n");
    vxml.append("<value expr=\"position\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //5record - add bargein time to actual position and begin recording from this position
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-5'\"/>\n");

    //vxml.append("<assign name=\"position\" expr=\"(position+(offset*1000))\"/>\n");
    vxml.append("<if cond=\"position == '0' &amp;&amp; begin == 'false' \">\n");

    //vxml.append("<if cond=\"begin == 'false'\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");

    //vxml.append("</if>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, RECORD_FORM);

    //6 quick forward - forward 20s and replay from new position
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-6'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position+20000\"/>\n");
    vxml.append("<if cond=\"length &lt; position\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml.append("</if>\n");
    vxml.append("<value expr=\"position\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //7 begin - replay from begin
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-7'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //8 nothing
    //9 end - go to end
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-9'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //0 prompt help : position 0?
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-0'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, HELP_FORM);

    //* quit
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-star'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addFinalSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        Constants.DICTOPHONE_URL_VOXPILOT, PLAY_FIELD, logId);

    //# quit and save
    vxml.append("<elseif cond=\"" + PLAY_FIELD + " == 'dtmf-pound'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addFinalSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        Constants.DICTOPHONE_URL_VOXPILOT, PLAY_FIELD, logId);

    vxml.append("<else/>\n");

    //nothing
    vxml.append("</if>\n");

    //vxml = DictophoneVoiceXMLWriter.addFilledSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,        "input");
    vxml = DictophoneVoiceXMLWriter.addFilledFooter(vxml);
    vxml = DictophoneVoiceXMLWriter.addFieldFooter(vxml);
    vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);

    //return vxml;
  }

  private void getPauseModeForm(StringBuffer vxml, String callerNumber, String calledNumber, Long serviceDialogId,
    Long dialogOutputId, long logId) {
    //pause
    vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, PAUSE_FORM);
    vxml = DictophoneVoiceXMLWriter.addFieldHeader(vxml, PAUSE_FIELD);
    vxml = DictophoneVoiceXMLWriter.addGrammar(vxml, PAUSE_GRAMMAR);

    vxml = DictophoneVoiceXMLWriter.addFilledHeader(vxml);

    //1 rewind - rewind 5s and replay from new position (begin if position is negative)
    vxml.append("<if cond=\"" + PAUSE_FIELD + " == 'dtmf-1'\">\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position-5000\"/>\n");
    vxml.append("<if cond=\"position &lt; '0'\">\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //2 play - replay from actual position
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-2'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //3 forward - forward 5s and replay from new position
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-3'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position+5000\"/>\n");
    vxml.append("<if cond=\"length &lt; position\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //4 quick rewind - rewind 20s and replay from new position
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-4'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position-20000\"/>\n");
    vxml.append("<if cond=\"position &lt; '0'\">\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //5 record - begin recording from actual position
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-5'\"/>\n");

    vxml.append("<if cond=\"position == '0' &amp;&amp; begin == 'false' \">\n");

    //vxml.append("<if cond=\"begin == 'false'\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");

    //vxml.append("</if>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, RECORD_FORM);

    //6 quick forward - forward 20s and replay from new position
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-6'\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"position+20000\"/>\n");
    vxml.append("<if cond=\"length &lt; position\">\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //7 begin - replay from begin
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-7'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //8 nothing
    //9 end - go to end
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-9'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"length\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'false'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, PLAY_FORM);

    //0 prompt help : position 0?
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-0'\"/>\n");
    vxml.append("<assign name=\"position\" expr=\"0\"/>\n");
    vxml.append("<assign name=\"begin\" expr=\"'true'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addGoTo(vxml, HELP_FORM);

    //* quit
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-star'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addFinalSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        Constants.DICTOPHONE_URL_VOXPILOT, PAUSE_FIELD, logId);

    //# quit and save
    vxml.append("<elseif cond=\"" + PAUSE_FIELD + " == 'dtmf-pound'\"/>\n");
    vxml = DictophoneVoiceXMLWriter.addFinalSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        Constants.DICTOPHONE_URL_VOXPILOT, PAUSE_FIELD, logId);

    vxml.append("<else/>\n");

    //nothing
    vxml.append("</if>\n");
    vxml = DictophoneVoiceXMLWriter.addFilledFooter(vxml);
    vxml = DictophoneVoiceXMLWriter.addFieldFooter(vxml);
    vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);

    //return vxml;
  }

  private void getRecordModeForm(StringBuffer vxml, String callerNumber, String calledNumber, Long serviceDialogId,
    Long dialogOutputId, long logId) {
    vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, RECORD_FORM);
    vxml = DictophoneVoiceXMLWriter.addRecordingHeader(vxml);
    vxml = DictophoneVoiceXMLWriter.addRecordingFooter(vxml, callerNumber, calledNumber, serviceDialogId,
        dialogOutputId, true, logId);
    vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);
  }

  public void doPost(HttpServletRequest req, HttpServletResponse res)
    throws ServletException, IOException {
    //String sessionId = req.getParameter(Constants.SESSION_ID);
    OrdHttpUploadFormData formData = new OrdHttpUploadFormData(req);
    formData.parseFormData();

    String sessionId = formData.getParameter(Constants.SESSION_ID);
    SessionLog sessionLog = (SessionLog) RobotVxml.sessionLoggers.get(sessionId);
    sessionLog.log(SessionLog.FINEST, sessionId);
    sessionLog.log(SessionLog.FINE, "-=|::: DICTOPHONE_POST  " + req.getSession());

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

    String stringLogId = formData.getParameter(Constants.RECORDING_LOG_ID);
    sessionLog.log(SessionLog.INFO, "logId = " + stringLogId);

    Long logId = new Long(10);

    try {
      logId = new Long(stringLogId);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    Double duration = new Double(Double.parseDouble(formData.getParameter(Constants.RECORDING_DURATION)) / (double) 1000.0);

    sessionLog.log(SessionLog.INFO, "duration = " + duration.doubleValue());

    Double totalOffset = new Double(formData.getParameter("position"));
    sessionLog.log(SessionLog.FINE, "position = " + totalOffset);

    OrdHttpUploadFile recordedFile = formData.getFileParameter(Constants.RECORDING_VARIABLE_NAME);
    sessionLog.log(SessionLog.FINE, "original file name = " + recordedFile.getSimpleFileName());
    sessionLog.log(SessionLog.FINE, "file size = " + recordedFile.getContentLength());

    try {
      byte[] data = new byte[recordedFile.getContentLength()];
      sessionLog.log(SessionLog.FINE, "Recording length : " + data.length);
      recordedFile.getInputStream().read(data);

      if (!recordedFile.equals("")) {
        sessionLog.log(SessionLog.FINE, "Recording file");

        DictophoneFilesManager dfm = new DictophoneFilesManager(sessionId);
        dfm.concatWavFiles(data, totalOffset.doubleValue());
        sessionLog.log(SessionLog.FINE, "Recorded file");
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    res.setContentType(CONTENT_TYPE);

    StringBuffer vxml = new StringBuffer("");
    vxml = DictophoneVoiceXMLWriter.addHeader(vxml);
    vxml = DictophoneVoiceXMLWriter.addFormHeader(vxml, "to_dictophone");
    vxml = DictophoneVoiceXMLWriter.addBlockHeader(vxml);
    vxml = DictophoneVoiceXMLWriter.addAfterRecordingSubmit(vxml, callerNumber, calledNumber, serviceDialogId,
        dialogOutputId, logId.longValue());
    vxml = DictophoneVoiceXMLWriter.addBlockFooter(vxml);
    vxml = DictophoneVoiceXMLWriter.addFormFooter(vxml);
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);
    vxml = DictophoneVoiceXMLWriter.addFooter(vxml);
    sessionLog.log(SessionLog.FINEST, vxml.toString());

    PrintWriter out = res.getWriter();
    out.println(vxml);
    out.close();
  }

  protected static void closeConnection(SessionLog sessionLog, String sessionId) {
    try {
      sessionLog.log(SessionLog.INFO, "closing session : DICTOPHONE");
      RobotVxml.closeConnection(sessionLog, sessionId);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }
}
