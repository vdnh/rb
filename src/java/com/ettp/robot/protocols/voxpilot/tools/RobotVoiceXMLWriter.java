package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;


public class RobotVoiceXMLWriter {
  //<assign name="offset" expr="offset + lastresult$.bargeintime"/>
  public static StringBuffer addSimpleBlock(StringBuffer vxml, String block) {
    vxml.append("<block>");
    vxml.append(block);
    vxml.append("</block>\n");

    return vxml;
  }

  public static StringBuffer addGrammar(StringBuffer vxml, String grammar) {
    vxml.append(grammar);

    return vxml;
  }

  public static StringBuffer addHeader(StringBuffer vxml) {
    vxml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    vxml.append("<!DOCTYPE vxml PUBLIC \"-//Nuance/DTD VoiceXML 2.0//EN\"\n");
    vxml.append("\"//voicexml.nuance.com/dtd/nuancevoicexml-2-0.dtd\">\n");

    //vxml.append("<vxml version=\"2.0\">\n");
    vxml.append("<vxml version=\"2.0\" xmlns=\"http://www.w3.org/2001/vxml\">\n");
    vxml.append("<!--property  name = \"termtimeout\" value = \"5s\" /-->\n");
    vxml.append("<property  name = \"interdigittimeout\" value = \"2s\" />\n");
    vxml.append("<property  name = \"timeout\" value = \"5s\" />\n");
    vxml.append("<property name=\"inputmodes\" value=\"dtmf\" />\n");
    vxml.append("<property name=\"termchar\" value=\" \" />\n");

    //vxml.append("<property name=\"bargein\" value=\"false\"/>\n");
    vxml.append("<property name=\"");
    vxml.append(Constants.REPROMPT);
    vxml.append("\" value=\"f\"/>\n");
    vxml.append("<form id=\"robot\">\n");

    return vxml;
  }

  public static StringBuffer addHangUpCatch(StringBuffer vxml, String callerNumber, String calledNumber) {

    /*/ajout de Hung
    vxml.append("<block>\n");
    vxml.append("<exit/>\n");
    //vxml.append("<audio src=\"file:///usr/local/voxpilot/vxmlinterpreter/prompts/BILS_DEROO/FR/11000026.wav\"/>\n");
    vxml.append("</block>\n");
    //*/
    vxml.append("<catch event=\"connection.disconnect.hangup\">\n");
    /*/ajout de Hung
    vxml.append("<exit/>\n");
    //vxml.append("<audio src=\"file:///usr/local/voxpilot/vxmlinterpreter/prompts/BILS_DEROO/FR/11000026.wav\"/>\n");
    //*/
    //vxml = addSimpleSubmit(vxml, callerNumber, calledNumber, Constants.EXIT_EVENT_SERVICE_ID, new Long(1005101));
    vxml = addSimpleSubmit(vxml, callerNumber, calledNumber, Constants.EXIT_EVENT_SERVICE_ID, null);
    vxml.append("</catch>\n");

    return vxml;
  }
//ajout de Hung
  public static StringBuffer addFinish(StringBuffer vxml) {
    /* ajout de Hung
  	<block>
    	<audio src ="helloworld.wav"/>
    </block>
    */
    vxml.append("<block>\n");
    //vxml.append("<exit/>\n");
    vxml.append("<prompt bargein = \"true\">\n");
    vxml.append("<audio src=\"file:///usr/local/voxpilot/vxmlinterpreter/prompts/BILS_DEROO/FR/11000026.wav\"/>\n");
    vxml.append("</prompt>\n");
    vxml.append("</block>\n");
    //Hung
    //vxml.append("<catch event=\"connection.disconnect.hangup\">\n");
    //ajout de Hung
    //vxml.append("<exit/>\n");
    //vxml.append("<audio src=\"file:///usr/local/voxpilot/vxmlinterpreter/prompts/BILS_DEROO/FR/11000026.wav\"/>\n");
    //
    //vxml = addSimpleSubmit(vxml, callerNumber, calledNumber, Constants.EXIT_EVENT_SERVICE_ID, null);
    //vxml.append("</catch>\n");

    return vxml;
  }
//
  public static StringBuffer addFooter(StringBuffer vxml) {
    vxml.append("</form>\n");
    vxml.append("</vxml>\n");

    return vxml;
  }

  public static StringBuffer addFieldHeader(StringBuffer vxml) {
    vxml.append("<field name =\"input\">\n");

    return vxml;
  }

  public static StringBuffer addFieldFooter(StringBuffer vxml) {
    vxml.append("</field>\n");

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
    /*vxml.append("<audio src=\"");
    vxml.append("http://robot.ettp.com/robot/190001.wav");
    vxml.append("\"/>\n");

     vxml.append("<audio src=\"");
    vxml.append("http://robot.ettp.com/robot/190002.wav");
    vxml.append("\"/>\n");

    /*for (int i = 43; i < 63; i++) {
      vxml.append("<audio src=\"");

      //vxml.append(audioFile);
      vxml.append("http://robot.ettp.com/robot/servlet/BlobDownloader?logid=306" + i);

      //vxml.append("file:///usr/local/voxpilot/vxmlinterpreter/examples_intro.wav");
      //vxml.append("file://../examples_intro.wav");
      //vxml.append("http://sectos.free.fr/top/examples_choices.wav");
      vxml.append("\"/>\n");
    }*/
    vxml.append("<audio src=\"");

    vxml.append(audioFile);
    vxml.append("\"/>\n");

    //vxml.append("\" offsetexpr=\"5000\" />\n");
    return vxml;
  }

  public static StringBuffer addBlob(StringBuffer vxml, long blobId, String sessionId) {
    vxml.append("<audio src=\"");
    vxml.append(Constants.BLOB_URL);
    vxml.append(blobId);

    /*vxml.append("&");
    vxml.append(Constants.SESSION_ID);
    vxml.append("=");
    vxml.append(sessionId);*/
    vxml.append("\"/>\n");

    return vxml;
  }

//ajout de Hung pour Blob direct
  public static StringBuffer addBlobDirect(StringBuffer vxml, long blobId, String sessionId) {
    vxml.append("<audio src=\"");
    vxml.append(Constants.BLOB_URL_DIRECT);
    vxml.append(blobId);

    /*vxml.append("&");
    vxml.append(Constants.SESSION_ID);
    vxml.append("=");
    vxml.append(sessionId);*/
    vxml.append("\"/>\n");

    return vxml;
  }
//ajout de Hung
  public static StringBuffer addBlobCommon(StringBuffer vxml, String blobCode, String sessionId) {
    vxml.append("<audio src=\"");
    vxml.append(Constants.BLOB_URL_COMMON);
    vxml.append(blobCode);

    /*vxml.append("&");
    vxml.append(Constants.SESSION_ID);
    vxml.append("=");
    vxml.append(sessionId);*/
    vxml.append("\"/>\n");

    return vxml;
  }
//
  private static StringBuffer addSubmit(StringBuffer vxml, String nextVxml, String input) {
    String submit = "<submit next=\"" + nextVxml + "\" namelist=\"";
    submit += (Constants.SESSION_ID + " ");
    submit += (Constants.CALLER_ID + " ");
    submit += (Constants.CALLED_ID + " ");
    submit += (Constants.DIALOG_ID + " ");
    submit += (Constants.DIALOG_OUTPUT_ID + " ");

    if (input != null) {
      submit += input;
    }

    submit += "\"/>\n";
    vxml.append(submit);

    return vxml;
  }

  public static StringBuffer addInitSubmit(StringBuffer vxml) {
    String calledNumber = "000";
    String callerNumber = "000";
    vxml.append("<block>\n");

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

    vxml.append("<assign name=\"");
    vxml.append(Constants.CALLED_ID);

    //vxml.append(
    //  "\" expr=\"session.connection.local.uri.substring(session.connection.local.uri.indexOf(':')+1,session.connection.local.uri.indexOf('@'))\"/>\n");
    vxml.append("\" expr=\"session.connection.local.uri\"/>\n");

    vxml.append("<if cond=\"session.connection.remote.uri.indexOf('@') >= 0 \">\n");
    vxml.append("<assign name=\"");
    vxml.append(Constants.CALLER_ID);
    vxml.append(
      "\" expr=\"session.connection.remote.uri.substring(session.connection.remote.uri.indexOf(':')+1,session.connection.remote.uri.indexOf('@'))\"/>\n");
    vxml.append("<else/>\n");
    vxml.append("<assign name=\"");
    vxml.append(Constants.CALLER_ID);
    vxml.append(
      "\" expr=\"session.connection.remote.uri.substring(session.connection.remote.uri.indexOf(':')+1,session.connection.remote.uri.length)\"/>\n");
    vxml.append("</if>\n");

    vxml.append("<var name=\"");
    vxml.append(Constants.DIALOG_ID);
    vxml.append("\" expr=\"\'-1\'\"/>\n");

    vxml.append("<var name=\"");

    vxml.append(Constants.DIALOG_OUTPUT_ID);
    vxml.append("\" expr=\"\'-1\'\"/>\n");
    vxml.append("<var name=\"");

    vxml.append(Constants.SESSION_ID);
    vxml.append("\" expr=\"session.connection.callid\"/>\n");

    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, null);

    //vxml = addSubmit(vxml, Constants.DICTOPHONE_URL, null);
    vxml.append("</block>\n");

    return vxml;
  }

  public static StringBuffer addSimpleSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, null);

    return vxml;
  }

  public static StringBuffer addDictophoneSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, long logid) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("<var name=\"");
    vxml.append(Constants.RECORDING_LOG_ID);
    vxml.append("\" expr=\"'" + logid + "'\"/>\n");

    String submit = "<submit next=\"" + Constants.DICTOPHONE_URL_VOXPILOT + "\" namelist=\"";
    submit += (Constants.SESSION_ID + " ");
    submit += (Constants.CALLER_ID + " ");
    submit += (Constants.CALLED_ID + " ");
    submit += (Constants.DIALOG_ID + " ");
    submit += (Constants.DIALOG_OUTPUT_ID + " ");
    submit += (Constants.RECORDING_LOG_ID + " ");
    submit += "\"/>\n";
    vxml.append(submit);

    return vxml;
  }

  public static StringBuffer addDtmfTextSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String languageCode) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("<var name=\"");
    vxml.append(Constants.LANGUAGE_CODE);
    vxml.append("\" expr=\"'" + languageCode + "'\"/>\n");

    String submit = "<submit next=\"" + Constants.DTMF_TEXT_URL_VOXPILOT + "\" namelist=\"";
    submit += (Constants.SESSION_ID + " ");
    submit += (Constants.CALLER_ID + " ");
    submit += (Constants.CALLED_ID + " ");
    submit += (Constants.DIALOG_ID + " ");
    submit += (Constants.DIALOG_OUTPUT_ID + " ");
    submit += (Constants.LANGUAGE_CODE + " ");
    submit += "\"/>\n";
    vxml.append(submit);

    return vxml;
  }

  public static StringBuffer addFilledSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId) {
    vxml.append("<filled>\n");
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, Constants.INPUT);
    vxml.append("</filled>\n");

    return vxml;
  }

  public static StringBuffer addRecordingSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String termchar) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("<var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"\'");
    vxml.append(Constants.RECORDING);
    vxml.append(termchar);
    vxml.append("\'\"/>\n");

    //vxml.append("  <var name=\"message\" expr='"+new String(data)+"'/>\n");
    //vxml.append("  <audio expr=\"message\" />\n");
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, Constants.INPUT);

    return vxml;
  }

  public static StringBuffer addTimeoutSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("<assign name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"\'");
    vxml.append(Constants.TIME_OUT);
    vxml.append("\'\"/>\n");
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, Constants.INPUT);

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
    vxml.append("\" expr=\"session.connection.callid\"/>\n");

    return vxml;
  }

  public static StringBuffer addGoTo(StringBuffer vxml, String nextVxml) {
    vxml.append("<goto next=\"");
    vxml.append(nextVxml);
    vxml.append("\" />\n");

    return vxml;
  }

  public static StringBuffer addCatch(StringBuffer vxml, StringBuffer timeOut, StringBuffer inputError) {
    vxml.append("<catch event=\"noinput\">\n");
    vxml.append(timeOut);
    vxml.append("</catch>\n");
    vxml.append("<catch event=\"nomatch\">\n");
    vxml.append(inputError);
    vxml.append("</catch>\n");

    return vxml;
  }

  public static StringBuffer addRecordingHeader(StringBuffer vxml) {
    vxml.append("<record name=\"" + Constants.RECORDING_VARIABLE_NAME +
      "\" type=\"audio/wav\" maxtime=\"600s\" finalsilence=\"10s\" beep=\"true\" dtmfterm=\"true\">\n");

    return vxml;
  }

  public static StringBuffer addRecordingFooter(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String wavFile, boolean confirm) {
    vxml.append(" <filled>\n");

    if (confirm) {
      vxml.append("  <if cond=\"" + Constants.RECORDING_VARIABLE_NAME + "$.termchar == '#'\">\n");
      vxml.append("   <prompt bargein = \"true\">\n");
      vxml.append("    <value expr=\"" + Constants.RECORDING_VARIABLE_NAME + "\" />\n");
      vxml.append("   </prompt>\n");
      vxml.append("  </if>\n");
    }

    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"" + Constants.RECORDING_VARIABLE_NAME + "$.termchar\"/>\n");
    vxml.append("  <var name=\"");
    vxml.append(Constants.RECORDING_DURATION);
    vxml.append("\" expr=\"" + Constants.RECORDING_VARIABLE_NAME + "$.duration\"/>\n");
    vxml.append("  <var name=\"");
    vxml.append(Constants.WAV_FILE);
    vxml.append("\" expr=\"\'");
    vxml.append(wavFile);
    vxml.append("\'\"/>\n");
    vxml.append("  <submit next=\"");
    vxml.append(Constants.ROBOT_VOXPILOT_URL);
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
    vxml.append(Constants.RECORDING_DURATION);
    vxml.append(" ");
    vxml.append(Constants.WAV_FILE);
    vxml.append(" ");
    vxml.append(Constants.RECORDING_VARIABLE_NAME + "\" method=\"post\" enctype=\"multipart/form-data\"/>\n");

    //vxml.append("\" method=\"post\" enctype=\"multipart/form-data\"/>\n");
    vxml.append(" </filled>\n");
    vxml.append("</record>\n");

    return vxml;
  }
  // to transfer

  public static StringBuffer addFilledSubmit_transfer(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId) {
    vxml.append("<filled>\n");
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, "input");
    vxml.append("</filled>\n");

    return vxml;
    }
  public static StringBuffer addTransfer(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String number, String connecttimeout, String maxtime) {
    vxml.append("<var name=\"input\" expr=\"1\"/>");
    vxml.append("<transfer name=\"bridgeTransfer\" type=\"bridge\"  destexpr=\"'tel:'+");
    vxml.append("9"+number+"\"");
    vxml.append(" connecttimeout=\"");
    vxml.append(connecttimeout+"\"");
    vxml.append(" maxtime=\"");
    vxml.append(maxtime+"\">");
    	   vxml.append(" <grammar mode=\"dtmf\" root=\"my_root\"> ");
	       vxml.append(" <rule id=\"my_root\" scope=\"public\"> ");
	         vxml.append(" <one-of> ");
	           vxml.append(" <item>dtmf-* dtmf-*</item> ");
	         vxml.append(" </one-of> ");
	       vxml.append(" </rule> ");
	     vxml.append(" </grammar> ");

    vxml.append("<filled>");
		vxml.append("<if cond=\"'busy' == bridgeTransfer\">");
		vxml.append("<var name=\"input\" expr=\"2\"/>");
		vxml.append("<else cond=\"'noanswer' == bridgeTransfer\"/>");
		vxml.append("<var name=\"input\" expr=\"3\"/>");
		vxml.append("</if>");              
	  vxml.append("</filled>");
    vxml = addFilledSubmit_transfer(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("</transfer>");
    return vxml;  
  }  
}
