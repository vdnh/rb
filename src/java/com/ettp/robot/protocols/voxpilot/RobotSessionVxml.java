package com.ettp.robot.protocols.voxpilot;

import com.ettp.pldialog.DialogOutputs_pl;
import com.ettp.robot.common.RobotSession;
import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.tools.RobotVoiceXMLWriter;
import com.ettp.robot.protocols.voxpilot.tools.VxmlGrammar;
import com.ettp.robot.protocols.voxpilot.tools.RobotDate;
import com.ettp.robot.protocols.voxpilot.tools.RobotNumbers;
import com.ettp.robot.protocols.voxpilot.tools.RobotSpell;
//ajout de Hung
//pour jouer Blob a la place de audio file
//import com.ettp.robot.common.MESSAGES_RECORDING_BLOBS;
//import com.ettp.plmessage.Message_pl;
//
import com.ettp.ejb.robot.dialogManager.DialogInputInfos;
import com.ettp.ejb.robot.messagesDescriptor.MessagePrompt;
import com.ettp.ejb.robot.messagesDescriptor.MessagesDescriptorBeanRemote;

import com.ettp.plsession.CommonBlobs_pl;
import java.rmi.RemoteException;

import java.util.ArrayList;
import java.util.List;


public class RobotSessionVxml extends RobotSession {
  public RobotSessionVxml(SessionLog sessionLog, String sessionId, String calledNb, String callerNb, int type)
    throws Exception {
    super(sessionLog, sessionId, calledNb, callerNb, type);

    PROMPTS_URL = "file:///usr/local/voxpilot/vxmlinterpreter/prompts/";
    //PROMPTS_URL = "C:\Voxpilot\vxmlinterpreter\data\\";
    //this.messageDescriptor.setPromptsUrl(PROMPTS_URL);
    COMMON_PROMPTS_URL = PROMPTS_URL + "common/";
    NUMBERS_PROMPTS_URL = COMMON_PROMPTS_URL + "numbers/";
    LETTERS_PROMPTS_URL = COMMON_PROMPTS_URL + "letters/";
  }

  protected StringBuffer continueDialogOutput(StringBuffer vxml) {
    try {
      initializeDialogInputs();

      if ((currentDialogInputs == null) || (currentDialogInputs.size() == 0) /*|| !isInputAllowed*/) {
        sessionLog.log(SessionLog.INFO, "continue NODI DO");

        //if no DIs goto the next DO
        vxml = addDONoInput(vxml);
      }
      else {
        if (isRecording()) {
          vxml = appendRecording(vxml);
        }
        else if (isDictophone()) {
          vxml = appendDictophone(vxml);
        }
        else if (isDtmfText()) {
          vxml = appendDtmfText(vxml);
        }
        else {
          vxml = appendDtmfMask(vxml);
        }
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return vxml;
  }

  private StringBuffer appendRecording(StringBuffer vxml)
    throws RemoteException {
    sessionLog.log(SessionLog.INFO, "continue RECORDING DO");
    vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);

    Long firstMessage = dialogManager.getShortMessageId();
    //reset originlanguageCode
    this.resetLanguageCode(firstMessage);
    //
    vxml = RobotVoiceXMLWriter.addPromptHeader(vxml, false);
    vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));
    vxml = RobotVoiceXMLWriter.addPromptFooter(vxml);
    vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);

    vxml = RobotVoiceXMLWriter.addRecordingHeader(vxml);

    /*vxml = RobotVoiceXMLWriter.addPromptHeader(vxml);
      vxml = RobotVoiceXMLWriter.addPromptFooter(vxml);*/
    String wavFile = "";

    try {
      wavFile = (String) sessionParams.get(Constants.WAV_FILE);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      wavFile = "";
    }

    if (wavFile == null) {
      wavFile = "";
    }

    vxml = RobotVoiceXMLWriter.addRecordingFooter(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        wavFile, confirmRecording);

    String termCharPropertyIndex = "<property name=\"termchar\" value=\"";
    vxml.insert(vxml.indexOf(termCharPropertyIndex) + termCharPropertyIndex.length(), "#");

    return vxml;
  }

  private StringBuffer appendDictophone(StringBuffer vxml)
    throws RemoteException {
    sessionLog.log(SessionLog.INFO, "continue DICTOPHONE DO");
    vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);

    Long firstMessage = dialogManager.getShortMessageId();
    //reset originlanguageCode
    this.resetLanguageCode(firstMessage);
    //    

    vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));

    //TODO dictophone on existing blob
    vxml = RobotVoiceXMLWriter.addDictophoneSubmit(vxml, callerNumber, calledNumber, serviceDialogId,
        dialogOutputId, -1);
    vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);

    return vxml;
  }

  private StringBuffer appendDtmfText(StringBuffer vxml)
    throws RemoteException {
    sessionLog.log(SessionLog.INFO, "continue DTMFTEXT DO");
    vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);

    Long firstMessage = dialogManager.getShortMessageId();
    //reset originlanguageCode
    this.resetLanguageCode(firstMessage);
    //    

    vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));

    //TODO dictophone on existing blob
    vxml = RobotVoiceXMLWriter.addDtmfTextSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        originLanguageCode);
    vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);
    vxml = RobotVoiceXMLWriter.addHangUpCatch(vxml, callerNumber, calledNumber);

    return vxml;
  }

  private StringBuffer appendDtmfListPrompts(StringBuffer vxml)
    throws RemoteException {
    sessionLog.log(SessionLog.INFO, "add DTMF_LIST prompts");

    String[] items = getVariable(Constants.ITEM_LIST).split(";");
    String[] messageIds = getVariable(Constants.MESSAGE_LIST).split(";");

    for (int i = 0; i < messageIds.length; i++) {
      try {
        vxml = addDTMFs(vxml, items[i]);
      }
      catch (IndexOutOfBoundsException ioobe) {
        ioobe.printStackTrace();
      }

      try {
        //TODO D.Stefan a voir
        vxml.append(addPrompts(new Long(messageIds[i]), messageIds[i], Constants.DIALOG_INPUT_MESS));
      }
      catch (NumberFormatException nfe) {
        nfe.printStackTrace();
      }
    }

    return vxml;
  }

  private StringBuffer appendDtmfMask(StringBuffer vxml)
    throws RemoteException {
    sessionLog.log(SessionLog.INFO, "continue NORMAL DO");

    //for transfer
      DialogOutputs_pl dO= new DialogOutputs_pl();
      dO= dO.findByPrimaryKey(this.getDialogOutputId());
      if (dO.getAllowInput().equalsIgnoreCase("transfer")){
        //Constants.EXIT_EVENT_SERVICE_ID=new Long(1005);
        
      //  StringBuffer ret=RobotVoiceXMLWriter.addTransfer("","","",Long("123"),new Long("456"),"","","");
        vxml = RobotVoiceXMLWriter.addTransfer(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId
                                                      ,Constants.NUMBER_TO_CALL,Constants.CONNECT_TIME_OUT,Constants.MAX_TIME);
        
      }
    //end of transfer */
    else{
    // get prompts for DO
    vxml = RobotVoiceXMLWriter.addFieldHeader(vxml);

    vxml = RobotVoiceXMLWriter.addPromptHeader(vxml, true);

    Long firstMessage = dialogManager.getShortMessageId();
    //reset originlanguageCode
    this.resetLanguageCode(firstMessage);
    //    
    vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));

    if (isDtmfList()) {
      vxml = appendDtmfListPrompts(vxml);
    }

    //add the help prompts
    //Long helpMessage = dialogManager.getHelpMessageId();
    //sessionLog.log(SessionLog.FINEST, "help msg : " + helpMessage);
    //vxml = addChoicePrompts(vxml, helpMessage);
    vxml = RobotVoiceXMLWriter.addPromptFooter(vxml);
    vxml = addGrammar(vxml, currentDialogInputs);
    vxml = addCatch(vxml);
    vxml = RobotVoiceXMLWriter.addFilledSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    vxml = RobotVoiceXMLWriter.addFieldFooter(vxml);
    }

    return vxml;
  }

  private StringBuffer addGrammar(StringBuffer vxml, List dialogInputs) {
    try {
      sessionLog.log(SessionLog.FINE, "add inputs");

      //get input type
      String grammar;

      if (isDtmfList()) {
        grammar = VxmlGrammar.getGrammar(sessionLog, dialogInputs, getVariable(Constants.ITEM_LIST).split(";"),
            originLanguageCode);
      }
      else {
        grammar = VxmlGrammar.getGrammar(sessionLog, dialogInputs, null, originLanguageCode);
      }

      vxml = RobotVoiceXMLWriter.addGrammar(vxml, grammar);

      //if voice grammar change input modes in voice dtmf
      if (grammar.indexOf("voice") >= 0) {
        String inputModes = "<property name=\"inputmodes\" value=\"";
        int start = vxml.indexOf(inputModes) + inputModes.length();
        int end = start + 4;
        vxml.replace(start, end, "voice dtmf");
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return vxml;
  }

  private StringBuffer addGrammar(StringBuffer vxml, String[] items) {
    try {
      sessionLog.log(SessionLog.FINE, "add inputs");

      //get input type
      String grammar = VxmlGrammar.getGrammar(sessionLog, items, originLanguageCode);
      vxml = RobotVoiceXMLWriter.addGrammar(vxml, grammar);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return vxml;
  }

  protected StringBuffer addPrompts(Long firstMessageNumber, String dialogInputMessageCode, int typeMess) {
    StringBuffer prompts = new StringBuffer();

    //ajout
    sessionLog.log(SessionLog.INFO, "addPrompts");
    sessionLog.log(SessionLog.INFO,"valeur de dialogType: "+dialogType);

    if (firstMessageNumber != null) {
      // reset originLanguageCode
      //this.resetLanguageCode(firstMessageNumber);
      //
      try {
        List messageList = new ArrayList();

        //corriger Hung
        //dialogType = Constants.MESSAGE_NUMBER_MESS_TYPE;
        //

        if (dialogType == Constants.MESSAGE_NUMBER_MESS_TYPE) {
          //System.out.println("commence getMessageListMessNum");
          messageList = messageDescriptor.getMessageListMessNum(firstMessageNumber, originGroupCode, originLanguageCode);
          //System.out.println("fini getMessageListMessNum");
          // ajout
          sessionLog.log(SessionLog.INFO, "getMessageListMessNum");
        }
        else if (typeMess == Constants.DIALOG_OUTPUT_MESS) {
          messageList = messageDescriptor.getMessageListDO(dialogOutputId, originGroupCode, originLanguageCode);
          //Ajout
          sessionLog.log(SessionLog.INFO, "getMessageListDO");
        }
        else if (typeMess == Constants.DIALOG_INPUT_MESS) {
          messageList = messageDescriptor.getMessageListDI(dialogInputMessageCode, originGroupCode, originLanguageCode);
          //ajout
          sessionLog.log(SessionLog.INFO, "getMessageListDI");
        }

        for (int i = 0; i < messageList.size(); i++) {
          MessagePrompt mpi = (MessagePrompt) messageList.get(i);
          sessionLog.log(SessionLog.FINEST, "LANGUAGE is : " + mpi.getLanguage());

          //ajout de Hung
          //pour BLOB, on teste avec blobId: 32512
          //sessionLog.log(SessionLog.INFO,"O - L - M : "+mpi.getOriginGroupCode()+ " - "+mpi.getLanguage()+
            //                                    " - "+mpi.getMessageCode());
          long blobId= messageDescriptor.getBlobId(mpi.getOriginGroupCode(), mpi.getLanguage(), mpi.getMessageCode()).longValue();
          sessionLog.log(SessionLog.INFO,"O-L-M - blobId : "+blobId);
          //int test=1;
          //if(test>0){
          if(blobId>0){ //pour tester BLOB
            prompts = RobotVoiceXMLWriter.addBlobDirect(prompts, blobId, sessionId);
          }
          //*/
          else { //pour tester BLOB
          if (mpi.getType().equals(MessagesDescriptorBeanRemote.FILE_MESSAGE)) {
            prompts = RobotVoiceXMLWriter.addWav(prompts, mpi.getFileMessage());
            //ajout
            sessionLog.log(SessionLog.INFO, "avoir ajoute "+mpi.getFileMessage());
          }

          else {
            //variable message
            sessionLog.log(SessionLog.FINE,
              " variable message   " + mpi.getStringMessage() + "  " + mpi.getOriginTable());

            String format = mpi.getFormat();

            sessionLog.log(SessionLog.FINE, " variable message   " + format);

            String variable = getVariable(mpi.getStringMessage());
            sessionLog.log(SessionLog.FINE, " variable message   " + variable);

            if (format.equals(Constants.BLOB)) {
              sessionLog.log(SessionLog.FINEST, "\t - Variable (blob) " + format + " a pronnoncer : " + variable);

              try {
                Long logId = new Long(variable);
                prompts = RobotVoiceXMLWriter.addBlob(prompts, logId.longValue(), sessionId);
              }
              catch (Exception ex) {
                sessionLog.log(SessionLog.SEVERE, ex);
              }
            }
            else {
              if ((mpi.getOriginTable() != null) && mpi.getOriginTable().equals(Constants.VARIABLE)) {
                Long varLong = new Long(0);

                if (!format.equals(Constants.SPELL)) {
                  try {
                    varLong = new Long(variable);

                    if (format.equals(Constants.STRING) || format.equals(Constants.MESSAGE)) {
                      sessionLog.log(SessionLog.FINEST, "String2Long cast succsesfull");
                      format = Constants.NUMBER;
                    }
                  }
                  catch (NumberFormatException nfex) {
                    try {
                      Double d = new Double(variable.replaceFirst(",", "."));
                      varLong = new Long(d.longValue());

                      if (format.equals(Constants.STRING) || format.equals(Constants.MESSAGE)) {
                        sessionLog.log(SessionLog.FINEST,
                          "String2Long cast succsesfull after replacing , with . => " + variable);
                        format = Constants.NUMBER;
                      }
                    }
                    catch (Exception ex) {
                      sessionLog.log(SessionLog.SEVERE, ex);
                      format = Constants.STRING;
                    }
                  }
                }

                if (format.equals(Constants.NUMBER)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (num) " + format + " : " + varLong.toString());

                  prompts = addNumber(prompts, varLong, mpi.getLanguage(), format);
                }
                else if (format.startsWith(Constants.DIGITS)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (digit) " + format + " : " + variable);
                  prompts = addDigits(prompts, variable, mpi.getLanguage(), format);
                }
                else if (format.equals(Constants.TEL)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (tel) " + format + " : " + variable);
                  prompts = addTel(prompts, variable, mpi.getLanguage(), format);
                }
                else if (format.equals(Constants.EUROS)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (euros) " + format + " : " + variable);
                  prompts = addEuros(prompts, variable, mpi.getLanguage(), format);
                }
                else if (format.equals(Constants.STRING)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + variable);

                  String varLanguage = mpi.getLanguage();
                  Long varGroupId = null;

                  try {
                    if (sessionParams.get(Constants.VARIABLE_LANGUAGE) != null) {
                      varLanguage = (String) sessionParams.get(Constants.VARIABLE_LANGUAGE);
                    }

                    if (sessionParams.get(Constants.VARIABLE_GROUP_ID) != null) {
                      varGroupId = new Long((String) sessionParams.get(Constants.VARIABLE_GROUP_ID));
                    }
                  }
                  catch (Exception ex) {
                    sessionLog.log(SessionLog.SEVERE, ex);
                  }

                  String variableAudio;

                  if (varGroupId != null) {
                    variableAudio = messageDescriptor.getVariableAudio(variable, varGroupId, varLanguage);
                  }
                  else {
                    variableAudio = messageDescriptor.getVariableAudio(variable, mpi.getOriginGroupCode(), varLanguage);
                  }

                  if (variableAudio != null) {
                    sessionLog.log(SessionLog.FINEST, "\t - VariableMessage file " + variableAudio);

                    StringBuffer variableMessageVxml = new StringBuffer();
                    prompts = RobotVoiceXMLWriter.addWav(prompts, variableAudio);
                  }
                  else {
                    sessionLog.log(SessionLog.FINEST, "\t - Variable (string) " + format + " do nothing");

                    //vxml.append(variable);
                  }
                }
                else if (format.equals(Constants.SPELL)) {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (spell) " + format + " a pronnoncer : " + variable);
                  prompts = addSpell(prompts, variable, mpi.getLanguage());
                }
                else {
                  sessionLog.log(SessionLog.FINEST, "\t - Variable (date) " + format + " a pronnoncer : " + variable);
                  prompts = addDate(prompts, variable, mpi.getLanguage(), format);
                }
              }
              else {
                sessionLog.log(SessionLog.FINEST, "\t - Variable (string) do nothing");

                //vxml.append(mpi.getStringMessage());
              }
            }
          }
          }//pour tester BLOB
        }
      }
      catch (Exception ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
      }
    }

    return prompts;
  }

  //protected StringBuffer addErrorPrompts(Long firstMessage) {
  public StringBuffer addErrorPrompts(Long firstMessage) {
    StringBuffer vxml = new StringBuffer("");
    //Trace de Hung : laisse trace sequence - 0,1,2,3,4....
    //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 0 firstMessage: "+firstMessage.toString());
    //if (firstMessage != null) {
    //ajout de Hung
    if ((firstMessage != null)&&(firstMessage.longValue()!=0)) {
    //
      //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 1");
      vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_HELP_MESS));
      //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 2");
    }

    try {
      for (int i = 0; (i < currentDialogInputs.size()); i++) {
        //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 3");
        DialogInputInfos di = (DialogInputInfos) currentDialogInputs.get(i);
        //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 4");
        String fileWav = di.getFileWav();
        //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 5");
        sessionLog.log(SessionLog.FINE, "\tHelp    " + fileWav);
        //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 6");

        if (fileWav != null) {
          //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 7");
          String dtmfMask = di.getInputType();
          //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 8");

          if (dtmfMask.indexOf(Constants.DTMF) >= 0) {
            dtmfMask = dtmfMask.substring(Constants.DTMF.length(), dtmfMask.length());
            vxml = addDTMFs(vxml, dtmfMask);
            //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 9");
          }

          vxml = RobotVoiceXMLWriter.addWav(vxml,
              PROMPTS_URL + originGroupCode + "/" + originLanguageCode + "/" + fileWav);
             //ajout de Hung
              //sessionLog.log(SessionLog.INFO, "addErrorPrompts "+PROMPTS_URL + originGroupCode + "/" + originLanguageCode + "/" + fileWav);
              //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 10");
        }
      }
    }
    catch (Exception ex) {
      //System.out.println("Hung - RobotSessionVxml.addErrorPrompts(Long firstMessage) rencontre de probleme");
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    vxml.append("<reprompt/>\n");
    //System.out.println("Hung - RobotSessionVxml.addErrorPrompts - 11");

    return vxml;
  }

  protected StringBuffer addHelpPrompts(Long firstMessage) {
    StringBuffer vxml = new StringBuffer("");

    //if (firstMessage != null) {
    //ajout de Hung
    if ((firstMessage != null)&&(firstMessage.longValue() !=0)) {
    //
      vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_HELP_MESS));
    }

    boolean timeout = false;

    try {
      for (int i = 0; (i < currentDialogInputs.size()) /* TODO why : && noTimeout*/; i++) {
        DialogInputInfos di = (DialogInputInfos) currentDialogInputs.get(i);

        String fileWav = di.getFileWav();
        String dtmfMask = di.getInputType();
        sessionLog.log(SessionLog.FINEST, "\tHelp for " + fileWav + " is " + dtmfMask);

        if (dtmfMask.indexOf(Constants.TIME_OUT) >= 0) {
          timeout = true;

          //if timeout do not wait
          int start = httpResponse.indexOf("<property  name = \"timeout\" value = \"") +
            "<property  name = \"timeout\" value = \"".length();
          httpResponse.replace(start, start + 2, "1");
        }
        else if (dtmfMask.indexOf(Constants.DTMF_LIST) >= 0) {
        }
        else {
          if (fileWav != null) {
            if (dtmfMask.indexOf(Constants.DTMF) >= 0) {
              dtmfMask = dtmfMask.substring(Constants.DTMF.length(), dtmfMask.length());
              vxml = addDTMFs(vxml, dtmfMask);
            }

            vxml = RobotVoiceXMLWriter.addWav(vxml,
                PROMPTS_URL + originGroupCode + "/" + originLanguageCode + "/" + fileWav);
            // ajout
            sessionLog.log(SessionLog.INFO, "addHelpPrompts "+PROMPTS_URL + originGroupCode + "/" + originLanguageCode + "/" + fileWav);
          }
        }
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    if (timeout) {
      sessionLog.log(SessionLog.FINEST, "\tSubmit on timeout");
      vxml = new StringBuffer("");
      vxml = RobotVoiceXMLWriter.addTimeoutSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
    }
    else {
      vxml.append("<reprompt/>\n");
    }

    return vxml;
  }

  /*  protected StringBuffer addChoicePrompts(StringBuffer vxml, Long firstMessage) {
      if (firstMessage != null) {
        vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));
      }

      try {
        for (int i = 0; (i < currentDialogInputs.size()) /* TODO why : && noTimeout*/
  /*; i++) {
  DialogInputInfos di = (DialogInputInfos) currentDialogInputs.get(i);

  String fileWav = di.getFileWav();
  String dtmfMask = di.getInputType();
  sessionLog.log(SessionLog.FINEST, "\tHelp for " + fileWav + " is " + dtmfMask);

  if (fileWav != null) {
  if (dtmfMask.indexOf(Constants.DTMF) >= 0) {
  dtmfMask = dtmfMask.substring(Constants.DTMF.length(), dtmfMask.length());
  vxml = addDTMFs(vxml, dtmfMask);
  }

  vxml = RobotVoiceXMLWriter.addWav(vxml,
  PROMPTS_URL + originGroupCode + "/" + originLanguageCode + "/" + fileWav);
  }
  }
  }
  catch (Exception ex) {
  sessionLog.log(SessionLog.SEVERE, ex);
  }

  return vxml;
  }*/
  protected StringBuffer addDONoInput(StringBuffer vxml) {
    try {
      vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);
      vxml = RobotVoiceXMLWriter.addPromptHeader(vxml, true);

      Long firstMessage = dialogManager.getShortMessageId();
      //reset originlanguageCode
      this.resetLanguageCode(firstMessage);
      //      
      vxml.append(addPrompts(firstMessage, null, Constants.DIALOG_OUTPUT_MESS));
      vxml = RobotVoiceXMLWriter.addPromptFooter(vxml);
      vxml = RobotVoiceXMLWriter.addSimpleSubmit(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId);
      vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return vxml;
  }

  protected String formatInput(String dtmfInput) {
    boolean nuance = true;
    String input = "";

    if (nuance) {
      String[] dtmfs = dtmfInput.split("dtmf-");

      for (int i = 0; i < dtmfs.length; i++) {
        String dtmf = dtmfs[i];

        if (dtmf.length() > 0) {
          if (dtmf.indexOf("pound") >= 0) {
            input += "#";
          }
          else if (dtmf.indexOf("star") >= 0) {
            input += "*";
          }
          else if (dtmf.endsWith(" ")) {
            input += dtmf.substring(0, dtmf.length() - 1);
          }
          else {
            input += dtmf;
          }
        }
      }
    }
    else {
      int newSize = (dtmfInput.length() + 1) / 2;

      for (int i = 0; i < newSize; i++) {
        input += dtmfInput.charAt(2 * i);
      }
    }

    sessionLog.log(SessionLog.FINE, " recognized input : " + input);

    return input;
  }

  protected boolean compareInput2DI(String inputType, long min, long max, String input) {
    try {
      if (inputType.indexOf(Constants.RECORDING) >= 0) {
        char termchar = input.charAt(input.length() - 1);
        sessionLog.log(SessionLog.FINE, "RECORDING compare : " + inputType + "   " + termchar);

        if (inputType.charAt(input.length() - 1) == termchar) {
          return true;
        }

        else {
          return false;
        }
      }
      else if (inputType.indexOf(Constants.DTMF_TEXT) >= 0) {
        return true;
      }
      else if (inputType.indexOf(Constants.DTMF_LIST) >= 0) {
        String[] items = getVariable(Constants.ITEM_LIST).split(";");

        boolean found = false;

        for (int j = 0; (j < items.length) && !found; j++) {
          try {
            found = items[j].equals(input);
          }
          catch (Exception e) {
            e.printStackTrace();
          }
        }

        return found;
      }
      else {
        sessionLog.log(SessionLog.FINE, "compare : " + input + "   " + inputType + " " + min + " " + max);

        return compareInput2InputType(input, inputType, min, max);
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);

      return false;
    }
  }

  protected StringBuffer addCatch(StringBuffer vxml) {
    try {
      Long helpMessage = dialogManager.getHelpMessageId();
      sessionLog.log(SessionLog.FINEST, "help msg : " + helpMessage);

      StringBuffer timeOut = new StringBuffer("");
      StringBuffer inputError = new StringBuffer("");

      timeOut = addHelpPrompts(helpMessage);

      Long errorMessage = dialogManager.getInputErrorMessageId();

      sessionLog.log(SessionLog.FINEST, "input error msg : " + errorMessage);
      //ajout de Hung
      if(errorMessage==null) {errorMessage= new Long(0);}
      //
      inputError = addErrorPrompts(errorMessage);
      //trace de Hung
      //System.out.println("Hung - RobotSessionVxml.addCatch(StringBuffer vxml) fonctionne bien avec inputError: "+inputError);
      //
      //ne pas remplacer le message d'erreur par celui d'aide

      /*else {
        inputError = addErrorPrompts(helpMessage);
      }*/
      if ((timeOut != null) && (inputError != null)) {
        vxml = RobotVoiceXMLWriter.addCatch(vxml, timeOut, inputError);
      }
    }
    catch (Exception ex) {
      //trace de Hung
      //System.out.println("Hung - RobotSessionVxml.addCatch(StringBuffer vxml) rencontre de probleme avec errorMessage ");
      //
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return vxml;
  }

  protected StringBuffer addNumber(StringBuffer vxml, Long varLong, String languageCode, String format) {
    List nombres = RobotNumbers.amountToVoice(varLong, languageCode);

    for (int n = 0; n < nombres.size(); n++) {
      //ajout de Hung
      //try{
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(nombres.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
        //String blobCode= messageDescriptor.getBlobCode(nombres.get(n).toString()+languageCode);

          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
          RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
        }
      /*/}
      catch(Exception e)
      {
        sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
        RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
      }//*/
    }

    return vxml;
  }

  protected StringBuffer addDigits(StringBuffer vxml, String digits, String languageCode, String format) {
    if (format.equals(Constants.DIGITS)) {
      format = null;
    }
    else {
      format = format.substring(5, format.length());
    }

    List nombres = RobotNumbers.digitsToVoice(digits, format);

    for (int n = 0; n < nombres.size(); n++) {
      //ajout de Hung
      //try{
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(nombres.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
          //String blobCode= messageDescriptor.getBlobCode(nombres.get(n).toString()+languageCode);
          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
          RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
        }
      /*}
      catch(Exception e)
      {
        sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
        RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
      }//*/
    }

    return vxml;
  }

  protected StringBuffer addTel(StringBuffer vxml, String tel, String languageCode, String format) {
    List nombres = RobotNumbers.telToVoice(tel);

    for (int n = 0; n < nombres.size(); n++) {
        //ajout de Hung
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(nombres.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
          //String blobCode= messageDescriptor.getBlobCode(nombres.get(n).toString()+languageCode);
          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
          RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
        /**/}

      //sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + nombres.get(n));
      //RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + nombres.get(n) + ".wav");
    }

    return vxml;
  }

  protected StringBuffer addEuros(StringBuffer vxml, String euros, String languageCode, String format) {
    List eurosList = RobotNumbers.eurosToVoice(euros, languageCode);

    for (int n = 0; n < eurosList.size(); n++) {
        //ajout de Hung
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(eurosList.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
          //String blobCode= messageDescriptor.getBlobCode(nombres.get(n).toString()+languageCode);
          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + eurosList.get(n));
          RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + eurosList.get(n) + ".wav");
        /**/}
      //sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + eurosList.get(n));
      //RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + eurosList.get(n) + ".wav");
    }

    return vxml;
  }

  protected StringBuffer addDate(StringBuffer vxml, String variable, String languageCode, String format) {
    List date = RobotDate.dateToVoice(variable, format, languageCode);

    for (int n = 0; n < date.size(); n++) {
      //ajout de Hung
      //try{
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(date.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
        //String blobCode= messageDescriptor.getBlobCode(date.get(n).toString()+languageCode);
          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + date.get(n));
          RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + date.get(n) + ".wav");
        }
      /*}
      catch(Exception e)
      {
        sessionLog.log(SessionLog.FINEST, "\t - Variable " + format + " a pronnoncer : " + date.get(n));
        RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + languageCode + "/" + date.get(n) + ".wav");
      }//*/
    }

    return vxml;
  }

  protected StringBuffer addDTMFs(StringBuffer vxml, String dtmfSuite) {
    if (dtmfSuite.length() >= 1) {
      char lastChar = dtmfSuite.charAt(dtmfSuite.length() - 1);
      Long varLong;

      try {
        if ((lastChar == '#') || (lastChar == '*')) {
          if (dtmfSuite.length() > 1) {
            varLong = new Long(dtmfSuite.substring(0, dtmfSuite.length() - 1));
            vxml = addNumber(vxml, varLong, originLanguageCode, Constants.NUMBER);
          }

          if (lastChar == '#') {
            //ajout de Hung
            CommonBlobs_pl bc= new CommonBlobs_pl();
            bc= bc.findByPrimaryKey("hatch"+originLanguageCode);
            if(bc!=null){
              String blobCode= bc.getBlobCode();
              RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
            }
            else{
            //
              RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + originLanguageCode + "/hatch.wav");
            }
          }

          if (lastChar == '*') {
            //ajout de Hung
            CommonBlobs_pl bc= new CommonBlobs_pl();
            bc= bc.findByPrimaryKey("star"+originLanguageCode);
            if(bc!=null){
              String blobCode= bc.getBlobCode();
              RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
            }
            else{
            //
              RobotVoiceXMLWriter.addWav(vxml, NUMBERS_PROMPTS_URL + originLanguageCode + "/start.wav");
            }
          }
        }
        else {
          varLong = new Long(dtmfSuite);
          vxml = addNumber(vxml, varLong, originLanguageCode, Constants.NUMBER);
        }
      }
      catch (Exception ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
      }
    }

    return vxml;
  }

  protected StringBuffer addSpell(StringBuffer vxml, String variable, String languageCode) {
    List spells = RobotSpell.spellVariable(variable, languageCode);

    for (int n = 0; n < spells.size(); n++) {
        //ajout de Hung
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(spells.get(n).toString()+languageCode);
        if(bc!=null){
          String blobCode= bc.getBlobCode();
        //String blobCode= messageDescriptor.getBlobCode(date.get(n).toString()+languageCode);
          RobotVoiceXMLWriter.addBlobCommon(vxml, blobCode, sessionId);
        }
        else{
        //
          sessionLog.log(SessionLog.FINEST, "\t - Variable " + variable + " a pronnoncer " + spells.get(n));
          RobotVoiceXMLWriter.addWav(vxml, LETTERS_PROMPTS_URL + languageCode + "/" + spells.get(n) + ".wav");
        }
      //sessionLog.log(SessionLog.FINEST, "\t - Variable " + variable + " a pronnoncer " + spells.get(n));
      //RobotVoiceXMLWriter.addWav(vxml, LETTERS_PROMPTS_URL + languageCode + "/" + spells.get(n) + ".wav");
    }

    return vxml;
  }
}
