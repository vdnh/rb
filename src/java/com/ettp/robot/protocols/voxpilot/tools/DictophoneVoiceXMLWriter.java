package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;
import com.ettp.robot.protocols.voxpilot.Dictophone;


public class DictophoneVoiceXMLWriter {
  //<assign name="offset" expr="offset + lastresult$.bargeintime"/>
  public static StringBuffer addSimpleBlock(StringBuffer vxml, String block) {
    vxml.append("<block>");
    vxml.append(block);
    vxml.append("</block>\n");

    return vxml;
  }

  public static StringBuffer addGrammar(StringBuffer vxml, String name) {
    vxml.append("<grammar type=\"application/grammar+xml\" root=\"" + name + "\" version=\"1.0\" mode=\"dtmf\" >\n");
    vxml.append("<rule id=\"" + name + "\" scope=\"public\">\n");
    vxml.append("<one-of>\n");
    vxml.append("<item> dtmf-1 </item>\n");
    vxml.append("<item> dtmf-2 </item>\n");
    vxml.append("<item> dtmf-3 </item>\n");
    vxml.append("<item> dtmf-4 </item>\n");
    vxml.append("<item> dtmf-5 </item>\n");
    vxml.append("<item> dtmf-6 </item>\n");
    vxml.append("<item> dtmf-7 </item>\n");

    //vxml.append("<item> dtmf-8 </item>\n");
    vxml.append("<item> dtmf-9 </item>\n");
    vxml.append("<item> dtmf-0 </item>\n");
    vxml.append("<item> dtmf-pound </item>\n");
    vxml.append("<item> dtmf-star </item>\n");
    vxml.append("</one-of>\n");
    vxml.append("</rule>\n");
    vxml.append("</grammar>\n");

    return vxml;
  }

  public static StringBuffer addHeader(StringBuffer vxml) {
    vxml.append("<?xml version=\"1.0\"?>\n");
    vxml.append("<!DOCTYPE vxml PUBLIC \"-//Nuance/DTD VoiceXML 2.0//EN\"\n");
    vxml.append("\"//voicexml.nuance.com/dtd/nuancevoicexml-2-0.dtd\">\n");

    //vxml.append("<vxml version=\"2.0\">\n");
    vxml.append("<vxml version=\"2.0\" xmlns=\"http://www.w3.org/2001/vxml\">\n");
    vxml.append("<!--property  name = \"termtimeout\" value = \"5s\" /-->\n");
    vxml.append("<property  name = \"interdigittimeout\" value = \"5s\" />\n");
    vxml.append("<property  name = \"timeout\" value = \"5s\" />\n");
    vxml.append("<property name=\"inputmodes\" value=\"dtmf\" />\n");
    vxml.append("<property name=\"termchar\" value=\" \" />\n");
    vxml.append("<var name=\"begin\" expr=\"'false'\"/>\n");
    vxml.append("<var name=\"position\" expr=\"0\"/>\n");
    vxml.append("<var name=\"offset\" expr=\"0\"/>\n");

    //vxml.append("<property name=\"bargein\" value=\"false\"/>\n");
    vxml.append("<property name=\"");
    vxml.append(Constants.REPROMPT);
    vxml.append("\" value=\"f\"/>\n");

    return vxml;
  }

  public static StringBuffer addFormHeader(StringBuffer vxml, String name) {
    vxml.append("<form id=\"" + name + "\">\n");

    return vxml;
  }

  public static StringBuffer addFormFooter(StringBuffer vxml) {
    vxml.append("</form>\n");

    return vxml;
  }

  public static StringBuffer addFooter(StringBuffer vxml) {
    vxml.append("</vxml>\n");

    return vxml;
  }

  public static StringBuffer addFieldHeader(StringBuffer vxml, String name) {
    vxml.append("<field name =\"" + name + "\">\n");

    return vxml;
  }

  public static StringBuffer addFieldFooter(StringBuffer vxml) {
    vxml.append("</field>\n");

    return vxml;
  }

  public static StringBuffer addFilledHeader(StringBuffer vxml) {
    vxml.append("<filled>\n");

    return vxml;
  }

  public static StringBuffer addFilledFooter(StringBuffer vxml) {
    vxml.append("</filled>\n");

    return vxml;
  }

  public static StringBuffer addBlockHeader(StringBuffer vxml) {
    vxml.append("<block>\n");

    return vxml;
  }

  public static StringBuffer addBlockFooter(StringBuffer vxml) {
    vxml.append("</block>\n");

    return vxml;
  }

  public static StringBuffer addPromptHeader(StringBuffer vxml, boolean bargin) {
    vxml.append("<prompt bargein = \"" + bargin + "\">\n");

    return vxml;
  }

  public static StringBuffer addPromptFooter(StringBuffer vxml) {
    vxml.append("</prompt>\n");

    return vxml;
  }

  public static StringBuffer addWav(StringBuffer vxml, String audioFile) {
    vxml.append("<audio src=\"");
    vxml.append(audioFile);
    vxml.append("\"/>\n");

    return vxml;
  }

  /*public static StringBuffer addBlob(StringBuffer vxml, long blobId, String sessionId) {
    vxml.append("<audio src=\"");
    vxml.append(Constants.BLOB_URL);
    vxml.append(blobId);
    vxml.append("&");
    vxml.append(Constants.SESSION_ID);
    vxml.append("=");
    vxml.append(sessionId);
    vxml.append("\"/>\n");

    return vxml;
  }*/
  public static StringBuffer addGoTo(StringBuffer vxml, String nextVxml) {
    vxml.append("<goto next=\"#");
    vxml.append(nextVxml);
    vxml.append("\" />\n");

    return vxml;
  }

  public static StringBuffer addRecordingHeader(StringBuffer vxml) {
    vxml.append("<record name=\"" + Constants.RECORDING_VARIABLE_NAME +
      "\" type=\"audio/wav\" maxtime=\"300s\" finalsilence=\"10s\" beep=\"true\" dtmfterm=\"true\">\n");

    return vxml;
  }

  public static StringBuffer addRecordingFooter(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, boolean confirm, long logId) {
    vxml = addFilledHeader(vxml);

    if (confirm) {
      vxml.append("  <if cond=\"" + Constants.RECORDING_VARIABLE_NAME + "$.termchar == '#'\">\n");
      vxml.append("   <prompt>\n");
      vxml.append("    <value expr=\"" + Constants.RECORDING_VARIABLE_NAME + "\" />\n");
      vxml.append("   </prompt>\n");
      vxml.append("  </if>\n");
    }

    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"" + Constants.RECORDING_VARIABLE_NAME + "$.termchar\"/>\n");
    vxml.append("  <var name=\"");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append("\" expr=\"'" + logId + "'\"/>\n");
    vxml.append("  <var name=\"");
    vxml.append(Constants.RECORDING_DURATION);
    vxml.append("\" expr=\"" + Constants.RECORDING_VARIABLE_NAME + "$.duration\"/>\n");

    vxml.append("  <submit next=\"");
    vxml.append(Constants.DICTOPHONE_URL_VOXPILOT);
    vxml.append("\" namelist=\"");
    vxml.append(Constants.SESSION_ID);
    vxml.append(" ");
    vxml.append(Constants.CALLER_ID);
    vxml.append(" ");
    vxml.append(Constants.CALLED_ID);
    vxml.append(" ");
    vxml.append(Constants.DIALOG_ID);
    vxml.append(" ");
    vxml.append(Constants.DIALOG_OUTPUT_ID);
    vxml.append(" ");
    vxml.append(Constants.INPUT);
    vxml.append(" ");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append(" ");
    vxml.append(Constants.RECORDING_DURATION);
    vxml.append(" position ");
    vxml.append(Constants.RECORDING_VARIABLE_NAME);
    vxml.append("\" method=\"post\" enctype=\"multipart/form-data\"/>\n");

    //addAfterRecordingSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId, logId);
    vxml = addFilledFooter(vxml);
    vxml.append("</record>\n");

    return vxml;
  }

  private static StringBuffer addVariables(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId) {
    vxml.append("<var name=\"");
    vxml.append(Constants.CALLER_ID);
    vxml.append("\" expr=\"\'");
    vxml.append(callerNumber);
    vxml.append("\'\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.CALLED_ID);
    vxml.append("\" expr=\"\'");
    vxml.append(calledNumber);
    vxml.append("\'\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.DIALOG_ID);
    vxml.append("\" expr=\"\'");
    vxml.append(serviceDialogId);
    vxml.append("\'\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.DIALOG_OUTPUT_ID);
    vxml.append("\" expr=\"\'");
    vxml.append(dialogOutputId);
    vxml.append("\'\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.SESSION_ID);
    vxml.append("\" expr=\"session.connection.sessionid\"/>\n");

    return vxml;
  }

  private static StringBuffer addSubmitWithLogId(StringBuffer vxml, String nextVxml) {
    String submit = "<submit next=\"" + nextVxml + "\" namelist=\"";
    submit += (Constants.SESSION_ID + " ");
    submit += (Constants.CALLER_ID + " ");
    submit += (Constants.CALLED_ID + " ");
    submit += (Constants.DIALOG_ID + " ");
    submit += (Constants.DIALOG_OUTPUT_ID + " ");
    submit += (Constants.INPUT + " ");
    submit += (Constants.RECORDING_LOG_ID + " ");

    submit += "\"/>\n";
    vxml.append(submit);

    return vxml;
  }

  public static StringBuffer addAfterRecordingSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, long logId) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"''\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append("\" expr=\"'" + logId + "'\"/>\n");

    vxml = addSubmitWithLogId(vxml, Constants.DICTOPHONE_URL_VOXPILOT);

    return vxml;
  }

  public static StringBuffer addFinalSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String nextVxml, String input, long logid) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"" + input + "\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append("\" expr=\"'" + logid + "'\"/>\n");
    vxml = addSubmitWithLogId(vxml, nextVxml);

    return vxml;
  }

  public static StringBuffer addToRobotSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, long logid) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"'" + Constants.DICTOPHONE + "'\"/>\n");
    vxml.append("<var name=\"");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append("\" expr=\"'" + logid + "'\"/>\n");
    vxml = addSubmitWithLogId(vxml, Constants.ROBOT_VOXPILOT_URL);

    return vxml;
  }

  public static StringBuffer addInitialHelp(StringBuffer vxml) {
    vxml = addFormHeader(vxml, Dictophone.INITIAL_HELP_FORM);
    vxml = addBlockHeader(vxml);

    //vxml.append("Appuyer sur 5 pour enregistrer et sur 0 pour l'aide");
    vxml = addWav(vxml, Constants.DICTOPHONE_VOXPILOT_PROMPTS_URL + "FR/intro.wav");
    vxml = addGoTo(vxml, Dictophone.PLAY_FORM);
    vxml = addBlockFooter(vxml);
    vxml = addFormFooter(vxml);

    return vxml;
  }

  public static StringBuffer addHelp(StringBuffer vxml) {
    vxml = addFormHeader(vxml, Dictophone.HELP_FORM);
    vxml = addBlockHeader(vxml);

    //vxml.append("Complete help");
    vxml = addWav(vxml, Constants.DICTOPHONE_VOXPILOT_PROMPTS_URL + "FR/aide.wav");
    vxml = addGoTo(vxml, Dictophone.PLAY_FORM);
    vxml = addBlockFooter(vxml);
    vxml = addFormFooter(vxml);

    return vxml;
  }
}
