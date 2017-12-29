package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;


public class DtmfTextVoiceXMLWriter {
  public static StringBuffer addDtmfText(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String languageCode) {
    vxml.append("<?xml version=\"1.0\"?>\n");
    vxml.append("<!DOCTYPE vxml PUBLIC \"-//Nuance/DTD VoiceXML 1.2/EN\"\n");
    vxml.append("                      \"http://voicexml.nuance.com/dtd/nuancevoicexml-1-2.dtd\">\n");
    vxml.append("<vxml version=\"2.0\">\n");
    vxml.append("<!--property  name = \"termtimeout\" value = \"10s\" /-->\n");
    vxml.append("<property name=\"interdigittimeout\" value=\"5s\"/>\n");
    vxml.append("<property name=\"timeout\" value=\"5s\"/>\n");
    vxml.append("<property name=\"inputmodes\" value=\"dtmf\"/>\n");
    vxml.append("<property name=\"termchar\" value=\" \"/>\n");
    vxml.append("<var name=\"group\" expr=\"''\"/>\n");
    vxml.append("<var name=\"letter\" expr=\"''\"/>\n");
    vxml.append("<var name=\"word\" expr=\"''\"/>\n");
    vxml.append("<!--group-->\n");
    vxml.append("<form id=\"group_form\">\n");
    vxml.append("<field name=\"group_input\">\n");
    addSrcWav(vxml, "intro", languageCode);

    //vxml.append("<prompt>letter</prompt>\n");
    vxml.append("<grammar type=\"application/grammar+xml\" root=\"group_grammar\" mode=\"dtmf\">\n");
    vxml.append("<rule id=\"group_grammar\" scope=\"public\">\n");
    vxml.append("<one-of>\n");
    vxml.append("<item>dtmf-2</item>\n");
    vxml.append("<item>dtmf-3</item>\n");
    vxml.append("<item>dtmf-4</item>\n");
    vxml.append("<item>dtmf-5</item>\n");
    vxml.append("<item>dtmf-6</item>\n");
    vxml.append("<item>dtmf-7</item>\n");
    vxml.append("<item>dtmf-8</item>\n");
    vxml.append("<item>dtmf-9</item>\n");
    vxml.append("<item>dtmf-0</item>\n");
    vxml.append("</one-of>\n");
    vxml.append("</rule>\n");
    vxml.append("</grammar>\n");
    vxml.append("<catch event=\"noinput\">\n");
    vxml.append("<reprompt/>\n");
    vxml.append("</catch>\n");

    //TODO change to Group error.wav
    vxml.append("<catch event=\"nomatch\">Group error</catch>\n");
    vxml.append("<filled>\n");
    vxml.append("<assign name=\"group\" expr=\"group_input\"/>\n");
    vxml.append("<!--value expr=\"group\"/-->\n");
    vxml = addExprWav(vxml, "group", languageCode);
    vxml.append("<goto next=\"#letter_form\"/>\n");
    vxml.append("</filled>\n");
    vxml.append("</field>\n");
    vxml.append("</form>\n");
    vxml.append("<!--letter-->\n");
    vxml.append("<form id=\"letter_form\">\n");
    vxml.append("<field name=\"letter_input\">\n");
    vxml.append("<!--prompt>letter</prompt-->\n");
    vxml.append("<grammar type=\"application/grammar+xml\" root=\"letter_grammar\" mode=\"dtmf\">\n");
    vxml.append("<rule id=\"letter_grammar\" scope=\"public\">\n");
    vxml.append("<one-of>\n");
    vxml.append("<item>dtmf-1</item>\n");
    vxml.append("<item>dtmf-2</item>\n");
    vxml.append("<item>dtmf-3</item>\n");
    vxml.append("<item>dtmf-4</item>\n");
    vxml.append("<item>dtmf-star</item>\n");
    vxml.append("</one-of>\n");
    vxml.append("</rule>\n");
    vxml.append("</grammar>\n");
    vxml.append("<catch event=\"noinput\">\n");
    vxml.append("<reprompt/>\n");
    vxml.append("</catch>\n");

    //TODO change to letter error.wav
    vxml.append("<catch event=\"nomatch\">Letter error</catch>\n");
    vxml.append("<filled>\n");
    vxml.append("<if cond=\"letter_input == 'dtmf-star'\">\n");
    vxml.append("<goto next=\"#group_form\"/>\n");
    vxml.append("<else/>\n");
    vxml.append("<assign name=\"letter\" expr=\"group+letter_input\"/>\n");
    vxml = addExprWav(vxml, "letter", languageCode);
    addSrcWav(vxml, "new_letter", languageCode);

    //vxml.append("new letter or validate\n");
    vxml.append("<goto next=\"#valid_form\"/>\n");
    vxml.append("</if>\n");
    vxml.append("</filled>\n");
    vxml.append("</field>\n");
    vxml.append("</form>\n");
    vxml.append("<!--validation-->\n");
    vxml.append("<form id=\"valid_form\">\n");
    vxml.append("<field name=\"valid_input\">\n");
    vxml.append("<!--prompt>validate </prompt-->\n");
    vxml.append("<grammar type=\"application/grammar+xml\" root=\"valid_grammar\" mode=\"dtmf\">\n");
    vxml.append("<rule id=\"valid_grammar\" scope=\"public\">\n");
    vxml.append("<one-of>\n");
    vxml.append("<!--item>dtmf-1</item-->\n");
    vxml.append("<item>dtmf-2</item>\n");
    vxml.append("<item>dtmf-3</item>\n");
    vxml.append("<item>dtmf-4</item>\n");
    vxml.append("<item>dtmf-5</item>\n");
    vxml.append("<item>dtmf-6</item>\n");
    vxml.append("<item>dtmf-7</item>\n");
    vxml.append("<item>dtmf-8</item>\n");
    vxml.append("<item>dtmf-9</item>\n");
    vxml.append("<item>dtmf-0</item>\n");
    vxml.append("<item>dtmf-pound</item>\n");
    vxml.append("<item>dtmf-star</item>\n");
    vxml.append("</one-of>\n");
    vxml.append("</rule>\n");
    vxml.append("</grammar>\n");
    vxml.append("<catch event=\"noinput\">\n");
    vxml.append("<reprompt/>\n");
    vxml.append("</catch>\n");

    //TODO change to Validate error.wav
    vxml.append("<catch event=\"nomatch\">Validate error</catch>\n");
    vxml.append("<filled>\n");
    vxml.append("<if cond=\"valid_input == 'dtmf-star'\">\n");
    vxml.append("<goto next=\"#group_form\"/>\n");
    vxml.append("<elseif cond=\"valid_input == 'dtmf-pound'\"/>\n");
    vxml.append("<assign name=\"word\" expr=\"word+letter\"/>\n");

    //vxml.append("<value expr=\"word\"/>\n");
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = addToValidateSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId, "word", languageCode);
    vxml.append("<else/>\n");
    vxml.append("<assign name=\"word\" expr=\"word+letter\"/>\n");
    vxml.append("<assign name=\"group\" expr=\"valid_input\"/>\n");
    vxml = addExprWav(vxml, "group", languageCode);
    vxml.append("<goto next=\"#letter_form\"/>\n");
    vxml.append("</if>\n");
    vxml.append("</filled>\n");
    vxml.append("</field>\n");
    vxml.append("</form>\n");
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);
    vxml.append("</vxml>\n");

    return vxml;
  }

  public static StringBuffer addDtmfTextValidate(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String input, String[] letters, String languageCode) {
    vxml.append("<?xml version=\"1.0\"?>\n");
    vxml.append("<!DOCTYPE vxml PUBLIC \"-//Nuance/DTD VoiceXML 1.2/EN\"\n");
    vxml.append("                      \"http://voicexml.nuance.com/dtd/nuancevoicexml-1-2.dtd\">\n");
    vxml.append("<vxml version=\"2.0\">\n");
    vxml.append("<!--property  name = \"termtimeout\" value = \"10s\" /-->\n");
    vxml.append("<property name=\"interdigittimeout\" value=\"5s\"/>\n");
    vxml.append("<property name=\"timeout\" value=\"5s\"/>\n");
    vxml.append("<property name=\"inputmodes\" value=\"dtmf\"/>\n");
    vxml.append("<property name=\"termchar\" value=\" \"/>\n");
    vxml.append("<form id=\"dtmf_text\">\n");
    vxml.append("<block>\n");

    for (int i = 0; i < letters.length; i++) {
      vxml = addSrcWav(vxml, letters[i], languageCode);
    }

    //vxml.append("'"+input+"'\n");
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = addValidateSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId, input);
    vxml.append("</block>\n");
    vxml.append("</form>\n");
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);
    vxml.append("</vxml>\n");

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

  public static StringBuffer addToValidateSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String input, String languageCode) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"" + input + "\"/>\n");
    vxml.append("  <var name=\"");
    vxml.append(Constants.LANGUAGE_CODE);
    vxml.append("\" expr=\"'" + languageCode + "'\"/>\n");
    vxml = addSubmit(vxml, Constants.DTMF_TEXT_VALID_URL_VOXPILOT, true);

    return vxml;
  }

  public static StringBuffer addValidateSubmit(StringBuffer vxml, String callerNumber, String calledNumber,
    Long serviceDialogId, Long dialogOutputId, String input) {
    vxml = addVariables(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml.append("  <var name=\"");
    vxml.append(Constants.INPUT);
    vxml.append("\" expr=\"'" + input + "'\"/>\n");
    vxml = addSubmit(vxml, Constants.ROBOT_VOXPILOT_URL, false);

    return vxml;
  }

  private static StringBuffer addSubmit(StringBuffer vxml, String nextVxml, boolean sendLanguageCode) {
    String submit = "<submit next=\"" + nextVxml + "\" namelist=\"";
    submit += (Constants.SESSION_ID + " ");
    submit += (Constants.CALLER_ID + " ");
    submit += (Constants.CALLED_ID + " ");
    submit += (Constants.DIALOG_ID + " ");
    submit += (Constants.DIALOG_OUTPUT_ID + " ");
    submit += (Constants.INPUT + " ");

    if (sendLanguageCode) {
      submit += (Constants.LANGUAGE_CODE + " ");
    }

    submit += "\"/>\n";
    vxml.append(submit);

    return vxml;
  }

  public static StringBuffer addExprWav(StringBuffer vxml, String audioFile, String languageCode) {
    vxml.append("<audio expr=\"'" + Constants.DTMF_TEXT_VOXPILOT_PROMPTS_URL + "/" + languageCode + "/'+");
    vxml.append(audioFile);
    vxml.append("+'.wav'\"/>\n");

    return vxml;
  }

  public static StringBuffer addSrcWav(StringBuffer vxml, String audioFile, String languageCode) {
    vxml.append("<audio src=\"" + Constants.DTMF_TEXT_VOXPILOT_PROMPTS_URL + "/" + languageCode + "/");
    vxml.append(audioFile);
    vxml.append(".wav\"/>\n");

    return vxml;
  }
}
