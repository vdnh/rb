package com.ettp.robot.common;

import com.ettp.robot.common.tools.SessionLog;

//import com.ettp.ejb.robot.caller.ProcedureCallerBean;
import com.ettp.ejb.robot.caller.ProcedureCallerBeanRemote;
import com.ettp.ejb.robot.dialogManager.DialogInputInfos;
import com.ettp.ejb.robot.dialogManager.DialogManagerBeanRemote;
//import com.ettp.ejb.robot.dialogManager.
//import com.ettp.ejb.robot.dialogManager.
//import com.ettp.ejb.robot.messagesDescriptor.MessagePrompt;
//import com.ettp.ejb.robot.messagesDescriptor.MessagesDescriptorBean;
import com.ettp.ejb.robot.messagesDescriptor.MessagesDescriptorBeanRemote;
import com.ettp.ejb.robot.procedureManager.ParameterInfos;
//import com.ettp.ejb.robot.procedureManager.ProcedureManagerBean;
import com.ettp.ejb.robot.procedureManager.ProcedureManagerBeanRemote;
//import com.ettp.ejb.robot.sessionManager.SessionManagerBean;
import com.ettp.ejb.robot.sessionManager.SessionManagerBeanRemote;
import com.ettp.plmessage.Message_pl;


import java.io.File;
import java.io.FileInputStream;

import java.lang.reflect.Method;

import java.rmi.RemoteException;

import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;
//import java.util.Properties;

//import javax.ejb.RemoveException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

//import javax.rmi.PortableRemoteObject;


public abstract class RobotSession {
  Context ctx;
  protected Timestamp date = null;
  protected SessionManagerBeanRemote smHome;
  protected SessionManagerBeanRemote sessionManager = null;
  protected DialogManagerBeanRemote dialogManager = null;
  protected MessagesDescriptorBeanRemote messageDescriptor = null;
  protected ProcedureManagerBeanRemote procedureManager = null;
  protected ProcedureCallerBeanRemote procedureCaller = null;
  protected JavaProcedures ajp;
  public StringBuffer httpResponse = new StringBuffer("");
  protected int protocol; //VXML, HTML etc...
  protected String sessionId;
  protected String calledNumber;
  protected String callerNumber;
  protected Long serviceDialogId;
  protected Long dialogOutputId;

  //protected String serviceName;
  protected Hashtable lastProcReturn = new Hashtable();
  protected Hashtable sessionParams = new Hashtable();
  protected List currentDialogInputs = new ArrayList();
  protected String originGroupCode;
  protected String originLanguageCode;

  //private Long originGroupId;
  protected boolean confirmRecording = false;
  protected int pushedKeysLogLevel = 0;
  protected int proceduresLogLevel = 0;
  public SessionLog sessionLog;
  protected String PROMPTS_URL = "file:../../prompts/";
  protected String COMMON_PROMPTS_URL = PROMPTS_URL + "common/";
  protected String NUMBERS_PROMPTS_URL = COMMON_PROMPTS_URL + "numbers/";
  protected String LETTERS_PROMPTS_URL = COMMON_PROMPTS_URL + "letters/";
  private String exceptionMailFrom = "support@ettp.com";
  private String exceptionMailTo = "support@ettp.com";
  private String exceptionMailSubject = "Robot exception";
  private String exceptionSmsFrom = "sms@ettp.com";
  private String exceptionSmsTo = "sms@service_sms.com";
  private String exceptionSmsSubject = "0660217481";
  protected int dialogType = Constants.MESSAGE_NUMBER_MESS_TYPE; //0 : old with message_number, 1 new with message_code

  public RobotSession(SessionLog sessionLog, String sessionId, String calledNb, String callerNb, int protocol)
    throws Exception {
    //try {
    this.sessionLog = sessionLog;
    ctx = new InitialContext();
    sessionLog.log(SessionLog.INFO, "initialising session");
    this.protocol = protocol;
    this.sessionId = sessionId;
    this.calledNumber = calledNb;
    this.callerNumber = callerNb;

    /*/TODO a effacer pour tester numeros
    try {
      Properties props = new Properties();
      props.load(new FileInputStream(System.getProperty("user.dir") + File.separator + "config" + File.separator +
          "robot.properties"));
      //ajout de hung
      System.out.println("Properties props: "+props.toString());
      //
      sessionParams.put("TEST_FORMATS_DAN", props.get("TEST_FORMATS_DAN"));
      exceptionMailFrom = (String) props.get("EXCEPTION_MAIL_FROM");
      exceptionMailTo = (String) props.get("EXCEPTION_MAIL_TO");
      exceptionMailSubject = (String) props.get("EXCEPTION_MAIL_SUBJECT");
      exceptionSmsFrom = (String) props.get("EXCEPTION_SMS_FROM");
      exceptionSmsTo = (String) props.get("EXCEPTION_SMS_TO");
      exceptionSmsSubject = (String) props.get("EXCEPTION_SMS_SUBJECT");
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
    */

    sessionParams.put(Constants.CALLER_ID, callerNumber);
    sessionParams.put(Constants.CALLED_ID, calledNumber);

    sessionParams.put(Constants.MESSAGE_LEVEL, "1");

    //smHome 
    this.sessionManager = getSessionManagerHome();
    sessionLog.log(SessionLog.INFO, "find service : " + calledNumber + " & " + callerNumber);
    /*test*/System.out.println("serviceDialogId : "+serviceDialogId);
    this.sessionManager.init(sessionId, calledNumber, callerNumber);
    serviceDialogId = this.sessionManager.getServiceDialogId();
      /*test*/System.out.println("serviceDialogId : "+serviceDialogId);
    // Hung
    sessionParams.put(Constants.CALL_LOG_ID, sessionManager.getCallLogId().toString());
    //
    dialogOutputId = Constants.INIT_SERVICE_ID;

    sessionLog.log(SessionLog.INFO, "looking for dialog : " + serviceDialogId);

    //DialogManagerBeanRemote dmHome = getDialogManagerHome();
    this.dialogManager = getDialogManagerHome();
    this.dialogManager.init(sessionId, serviceDialogId); //= dmHome.create(sessionId, serviceDialogId);
    sessionLog.log(SessionLog.INFO, "dialog manager created");
    originLanguageCode = dialogManager.getDefaultLanguage();
    sessionLog.log(SessionLog.INFO, "Default language is : " + originLanguageCode);

    pushedKeysLogLevel = dialogManager.getPushedKeysLogLevel();
    proceduresLogLevel = dialogManager.getProceduresLogLevel();

    originGroupCode = dialogManager.getOriginGroupCode();
    sessionManager.setOriginGroupCode(originGroupCode);

    //MessagesDescriptorBeanRemote mdHome = getMessagesDescriptorHome();
    this.messageDescriptor = getMessagesDescriptorHome();
    this.messageDescriptor.init(sessionId);// = mdHome.create(sessionId);

    this.messageDescriptor.setMessageLevel(new Integer((String) sessionParams.get(Constants.MESSAGE_LEVEL)));

    //this.messageDescriptor.setPromptsUrl(PROMPTS_URL);
    this.messageDescriptor.setTts_url(Constants.TTS_URL);
    this.messageDescriptor.setTtsdaemon_url(Constants.TTSDAEMON_URL);

    //originGroupCode = messageDescriptor.getOriginGroupCode();
    sessionLog.log(SessionLog.INFO, "message descriptor created");

//    ProcedureManagerBeanRemote pmHome = getProcedureManagerHome();
    this.procedureManager = getProcedureManagerHome();
    this.procedureManager.init(sessionId, serviceDialogId); //= pmHome.create(sessionId, serviceDialogId);
    sessionLog.log(SessionLog.INFO, "procedure manager created");

//    ProcedureCallerBeanRemote pcHome = getProcedureCallerHome();
    this.procedureCaller = getProcedureCallerHome();
    this.procedureCaller.init(sessionId);// = pcHome.create(sessionId);
    sessionLog.log(SessionLog.INFO, "procedure caller created");

    this.ajp = new JavaProcedures(this);
    sessionLog.log(SessionLog.INFO, "robot procedures created");

    //}
    //catch (Exception ex) {
    //sessionLog.log(SessionLog.SEVERE, ex);
    //}
  }

  public boolean newDialogOutput() {
    sessionLog.log(SessionLog.INFO,
      "Enter newDialogOutput : " + dialogOutputId + " close? " +
      ((dialogOutputId != null) && (dialogOutputId.longValue()!=0) && !dialogOutputId.equals(Constants.LAST_DO_ID)));
      //((dialogOutputId.longValue()>0) && !dialogOutputId.equals(Constants.LAST_DO_ID)));

    try {
      if ((dialogOutputId != null) && (dialogOutputId.longValue()!=0) && !dialogOutputId.equals(Constants.LAST_DO_ID)) { //continue to next DO
      //if ((dialogOutputId.longValue()>0) && !dialogOutputId.equals(Constants.LAST_DO_ID)) { //continue to next DO
        dialogManager.setDialogOutput(dialogOutputId);

        //si dialogue local
        if (dialogManager.isDialogOutputLocal()) {
          sessionLog.log(SessionLog.INFO, "Local dialog : " + dialogOutputId);

          //recuperer le next DO
          //appeler le procs
          dialogOutputId = startEmptyDO();
          //trace de Hung
          //System.out.println("Hung - apres startEmptyDO(), dialogOutputId="+dialogOutputId);
          //

          return newDialogOutput();
        }

        //sinon continuer normalement
        else {
          sessionLog.log(SessionLog.INFO, "Normal dialog : " + dialogOutputId);

          Long oldDO = new Long(dialogOutputId.longValue());
          httpResponse = startDialogOutput(httpResponse);

          sessionLog.log(SessionLog.FINEST, "compare : " + dialogOutputId + " to " + oldDO);

          if (((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) || !(dialogOutputId.equals(oldDO))) {
          //if ((dialogOutputId.longValue() == 0) || !(dialogOutputId.equals(oldDO))) {
            sessionLog.log(SessionLog.FINEST, "Problem in startDialogOutput");
            sessionLog.log(SessionLog.FINEST, "DialogOutputId after problem : " + dialogOutputId);

            return newDialogOutput();
          }
        }

        sessionLog.log(SessionLog.FINEST, "DialogOutputId ok  : " + dialogOutputId);

        return true;
      }
      else { //DO null => close session

        //closeSession();
        return false;
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("newDialogOutput", ex);

      return false;
    }
  }

  private Long startEmptyDO() {
    try {
      //calling pre-procedures for empty DO
      //trace de Hung
      //System.out.println("Hung - Commence RobotSession.startEmptyDO()");
      Long preProcId = dialogManager.getDOPreProcedureId();
      //System.out.println("Hung - startEmptyDO.preProcId="+preProcId.toString());

      //if ((preProcId != null) && !invokeProcedure(preProcId)) {
      //ajout de Hung
      if ((preProcId != null) && (preProcId.longValue() !=0) && !invokeProcedure(preProcId)) {
      //
        //trace de Hung
        //System.out.println("Hung - RobotSession.startEmptyDO() n'est pas bon");
        //
        dialogOutputId = dialogManager.getNextPreKoDialogOutputId();
        sessionLog.log(SessionLog.FINE,
          "\t\t +++++PREPROC LOCAL KO: " + preProcId.longValue() + " go to  " + dialogOutputId);

        return dialogOutputId;
      }
      else {
        Long procID = dialogManager.getDOPostProcedureId();
        //trace de Hung
        //System.out.println("Hung - RobotSession.startEmptyDO() est bon");
        //System.out.println("Hung - RobotSession.startEmptyDO(), procID= "+procID);
        //System.out.println("Hung - RobotSession.startEmptyDO(), invokeProcedure(procID)= "+invokeProcedure(procID));
        //
        //if ((procID != null) && !invokeProcedure(procID)) {
        //ajout de Hung
        if ((procID != null) && (procID.longValue()!=0) && !invokeProcedure(procID)) {
        //
          dialogOutputId = dialogManager.getNextPostKoDialogOutputId();
          //System.out.println("Hung - RobotSession.startEmptyDO() a effectue dialogManager.getNextPostKoDialogOutputId()");
          //System.out.println("Hung - dialogOutputId= "+dialogOutputId.toString());
          return dialogOutputId;
        }
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      //trace de Hung
      //System.out.println("Hung - RobotSession.startEmptyDO() pose des probleme");
      //
      logException("startEmptyDO", ex);
    }

    return getDONextDialogOutput();
  }

  protected StringBuffer startDialogOutput(StringBuffer httpResponse) {
    try {
      sessionLog.log(SessionLog.FINE, "\t\t +++++ START DO" + dialogOutputId);

      boolean isInputAllowed = dialogManager.isInputAllowed();

      //calling pre-procedures
      Long preProcId = dialogManager.getDOPreProcedureId();

      //if (preProcId != null) {
      if ((preProcId != null)&&(preProcId.longValue()!=0)) {
        if (!invokeProcedure(preProcId)) {
          dialogOutputId = dialogManager.getNextPreKoDialogOutputId();
          sessionLog.log(SessionLog.FINE, "\t\t +++++PREPROC KO: " + preProcId.longValue() + " go to  " +
            dialogOutputId);

          return httpResponse;
        }
      }

      httpResponse = continueDialogOutput(httpResponse);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("startDialogOutput", ex);
    }

    return httpResponse;
  }

  /*protected void closeSession() {
    try {
      sessionLog.log(SessionLog.INFO, "******* close dialog ");

      //vxml = RobotVoiceXMLWriter.addBlockHeader(vxml);
      //vxml = RobotVoiceXMLWriter.addAudio(vxml, "http://jupiter/robot/prompts/SAGEM/20000.wav");
      //vxml = RobotVoiceXMLWriter.addBlockFooter(vxml);
    }
     catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }*/
  public Long initNextDialogOutput(String input) {
    try {
      if (serviceDialogId.equals(Constants.INIT_SERVICE_ID) || dialogOutputId.equals(Constants.INIT_SERVICE_ID)) {
        try {
          serviceDialogId = sessionManager.getServiceDialogId();
          dialogOutputId = dialogManager.getDialogOutputId();
          sessionLog.log(SessionLog.FINE, "check input 1st time, next DO : " + dialogOutputId);

          return dialogOutputId;
        }
        catch (RemoteException ex) {
          sessionLog.log(SessionLog.SEVERE, ex);
          logException("initNextDialogOutput - init service", ex);
        }
      }
      else if (input != null) {
        getDINextDialogOutput(input);
        sessionLog.log(SessionLog.FINE, "check input, next DO: " + dialogOutputId);

        return dialogOutputId;
      }
      else {
        sessionLog.log(SessionLog.FINE, "\tDid  " + serviceDialogId);
        sessionLog.log(SessionLog.FINEST, "\tDOid " + dialogOutputId);

        //get current DIs
        sessionLog.log(SessionLog.FINE, "input null, DO : " + dialogOutputId);

        if ((currentDialogInputs == null) || (currentDialogInputs.size() == 0)) {
          Long postProcId = dialogManager.getDOPostProcedureId();

          //if (postProcId != null) {
          if ((postProcId != null)&&(postProcId.longValue()!=0)) {
            if (invokeProcedure(postProcId)) {
              dialogOutputId = dialogManager.getDONextDialog();
              sessionLog.log(SessionLog.FINE, "check input null, next DO after PostProc OK: " + dialogOutputId);
            }
            else {
              dialogOutputId = dialogManager.getNextPostKoDialogOutputId();
              sessionLog.log(SessionLog.FINE, "check input null, next DO after PostProc KO : " + dialogOutputId);
            }

            return dialogOutputId;
          }
          else {
            sessionLog.log(SessionLog.FINE, "check input null, next DO no PostProc: " + dialogOutputId);

            return getDONextDialogOutput();
          }
        }
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("initNextDialogOutput", ex);
    }

    dialogOutputId = getDONextDialogOutput();
    sessionLog.log(SessionLog.INFO, "Problem getting next DO : " + dialogOutputId);

    return dialogOutputId;
  }

  protected Long getDONextDialogOutput() {
    try {
      dialogOutputId = dialogManager.getDONextDialog();
      //trace de Hung
      //System.out.println("Hung - AutomatSession.getDONextDialogOutput() est bon.");
      //System.out.println("Hung - AutomatSession.getDONextDialogOutput() donne dialogOutputId= "+dialogOutputId);
      sessionLog.log(SessionLog.FINE, "\tdialogOutputId " + dialogOutputId);

      //if (dialogOutputId == null) {
      if ((dialogOutputId == null) || (dialogOutputId.longValue() == 0)) {
        //trace de Hung
        //System.out.println("Hung - AutomatSession.getDONextDialogOutput si dialoOutoutId==null.");
        dialogOutputId = getNextDOFromVariable(dialogManager.getDONextDialogVariable());
        //System.out.println("Hung - getNextDOFromVariable(dialogManager.getDONextDialogVariable() donne dialogOutputId= "+dialogOutputId);
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      //trace de Hung
      //System.out.println("Hung - AutomatSession.getDONextDialogOutput() ne marche pas.");
      //
    }

    if ((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) {
    //if (dialogOutputId.longValue() == 0) {
      dialogOutputId = Constants.LAST_DO_ID;
    }

    return dialogOutputId;
  }

  private Long getNextDOFromVariable(String var) {
    Long nextDo = null;

    //try {
    if (var != null) {
      sessionLog.log(SessionLog.FINE, "\tNEXT DO VAR " + var);
      sessionLog.log(SessionLog.FINE, "\t\t" + getVariable(var));
      nextDo = new Long(getVariable(var));

      return nextDo;
    }

    /*}
     catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }*/
    return nextDo;
  }

  protected Long getDINextDialogOutput(String input) {
    try {
      boolean found = false;

      if ((currentDialogInputs.size() > 0) &&
          !((DialogInputInfos) currentDialogInputs.get(0)).equals(Constants.DTMF_TEXT)) {
        input = formatInput(input);
      }

      logPushedKeys(input);

      for (int i = 0; (i < currentDialogInputs.size()) && !found; i++) {
        DialogInputInfos di = (DialogInputInfos) currentDialogInputs.get(i);
        String inputType = di.getInputType();
        long min = di.getMin();
        long max = di.getMax();
        found = compareInput2DI(inputType, min, max, input);

        if (found) {
          Long currentDI = di.getDialogInputId();

          sessionLog.log(SessionLog.INFO, "matching DI: " + currentDI + "   " + input);
          dialogManager.setCurrentDI(currentDI);
          saveInput(di.getAnswerLabel(), input);
          sessionManager.validatePushedKey();
          saveAffectParam();
          //System.out.println("Hung - apres saveAffectParam()");
          //calling post-procedures
          Long procID = dialogManager.getDIPostProcedureId();
          //System.out.println("Hung - procID de dialogManager.getDIPostProcedureId(): "+procID);

          //if (procID != null) {
          if ((procID != null)&&(procID.longValue()!=0)) {
            if (invokeProcedure(procID)) {
              dialogOutputId = dialogManager.getDINextDialogOutpuId();

              if ((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) {
              //if (dialogOutputId.longValue() == 0) {
                dialogOutputId = getNextDOFromVariable(dialogManager.getDINextDialogVariable());
              }
            }
            else {
              dialogOutputId = dialogManager.getNextPostKoDialogOutputId();
            }
          }
          else {
            procID = dialogManager.getDOPostProcedureId();
            //System.out.println("Hung - procID de dialogManager.getDOPostProcedureId(): "+procID);

            //if (procID != null) {
            if ((procID != null)&&(procID.longValue()!=0)) {
              if (invokeProcedure(procID)) {
                dialogOutputId = dialogManager.getDINextDialogOutpuId();

                if ((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) {
                //if (dialogOutputId.longValue() == 0) {
                  dialogOutputId = getNextDOFromVariable(dialogManager.getDINextDialogVariable());
                }
              }
              else {
                dialogOutputId = dialogManager.getNextPostKoDialogOutputId();
              }
            }
            else {
              dialogOutputId = dialogManager.getDINextDialogOutpuId();
              //System.out.println("Hung - dialogOutputId de dialogManager.getDINextDialogOutpuId(): "+dialogOutputId);

              if ((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) {
              //if (dialogOutputId.longValue() == 0) {
                //System.out.println("Hung - dialogOutputId avant getNextDOFromVariable: "+dialogOutputId);
                dialogOutputId = getNextDOFromVariable(dialogManager.getDINextDialogVariable());
                //System.out.println("Hung - dialogOutputId apres getNextDOFromVariable: "+dialogOutputId);
              }
            }
          }
        }
        else {
          sessionLog.log(SessionLog.INFO, "DI " + di.getDialogInputId() + " don't match: " + input);
        }
      }

      if (!found) {
        sessionLog.log(SessionLog.INFO, "No matchin DI for : " + input);
      }
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("getDINextDialogOutput", ex);
    }

    if ((dialogOutputId == null)||(dialogOutputId.longValue() == 0)) {
    //if (dialogOutputId.longValue() == 0) {
      getDONextDialogOutput();
    }

    //System.out.println("Hung - dialogOutputId de Robot.getDINextDialogOutput: "+dialogOutputId);
    return dialogOutputId;
  }

  public boolean isRecording() {
    boolean recording = false;

    for (int i = 0; (i < currentDialogInputs.size()) && !recording; i++) {
      DialogInputInfos di = ((DialogInputInfos) currentDialogInputs.get(i));
      String inputType = di.getInputType();

      if (inputType.indexOf(Constants.RECORDING) >= 0) {
        recording = true;
        confirmRecording = di.getConfirmRecording();
      }
    }

    return recording;
  }

  public boolean isDictophone() {
    boolean dictophone = false;

    for (int i = 0; (i < currentDialogInputs.size()) && !dictophone; i++) {
      DialogInputInfos di = ((DialogInputInfos) currentDialogInputs.get(i));
      String inputType = di.getInputType();

      if (inputType.indexOf(Constants.DICTOPHONE) >= 0) {
        dictophone = true;
        confirmRecording = di.getConfirmRecording();
      }
    }

    return dictophone;
  }

  public boolean isDtmfText() {
    boolean dtmf_text = false;

    for (int i = 0; (i < currentDialogInputs.size()) && !dtmf_text; i++) {
      DialogInputInfos di = ((DialogInputInfos) currentDialogInputs.get(i));
      String inputType = di.getInputType();

      if (inputType.indexOf(Constants.DTMF_TEXT) >= 0) {
        dtmf_text = true;
        confirmRecording = di.getConfirmRecording();
      }
    }

    return dtmf_text;
  }

  public boolean isDtmfList() {
    boolean dtmf_list = false;

    for (int i = 0; (i < currentDialogInputs.size()) && !dtmf_list; i++) {
      DialogInputInfos di = ((DialogInputInfos) currentDialogInputs.get(i));
      String inputType = di.getInputType();

      if (inputType.indexOf(Constants.DTMF_LIST) >= 0) {
        dtmf_list = true;
        confirmRecording = di.getConfirmRecording();
      }
    }

    return dtmf_list;
  }

  private void saveInput(String label, String input) {
    if (!input.equals("#")) {
      if (label != null) {
        if ((input.indexOf(Constants.RECORDING) >= 0) || (input.indexOf(Constants.DICTOPHONE) >= 0)) {
          sessionLog.log(SessionLog.FINE,
            "\tSave recording log id  " + sessionParams.get(Constants.RECORDING_LOG_ID) + " to " + label);
          sessionParams.put(label, sessionParams.get(Constants.RECORDING_LOG_ID));
        }

        else {
          //String value = dialogManager.getAnswerValue();
          // if (value == null) {
          if ((input.lastIndexOf("#") == (input.length() - 1)) || (input.lastIndexOf("*") == (input.length() - 1))) {
            input = input.substring(0, input.length() - 1);
          }

          sessionLog.log(SessionLog.FINE, "\tSave " + input + " to " + label);
          sessionParams.put(label, input);

          /*}
          else {
            sessionLog.log(SessionLog.FINE, "\tSave " + value + " to " + label);
            sessionParams.put(label, value);
          }*/
        }
      }
    }
    else {
      //try {
      if (isDtmfText()) {
        sessionParams.put(label, input);
      }
      else {
        sessionLog.log(SessionLog.INFO, "\t\tDO NOT SAVE TO : " + label);
      }

      //sessionLog.log(SessionLog.FINEST, "\t\t               : " + sessionParams.get(label));

      /*}
       catch (Exception ex) {
        sessionLog.log(SessionLog.INFO, "Nothing to save ");
      }*/
    }
  }

  public void saveAffectParam() {
    try {
      Long affectParamId = dialogManager.getAffectParameterId();
      //System.out.println("Hung - nous somme dans RobotSession.saveAffectParam() avec affectParamId= "+
      //      affectParamId);
      //if (affectParamId != null) {
      if ((affectParamId != null)&&(affectParamId.longValue()!=0)) {
        ParameterInfos paramInfos = procedureManager.getParamaterInfos(affectParamId);

        if (paramInfos != null) {
          if ((paramInfos.getParameterLabel() != null) && (paramInfos.getParameterLabel() != null)) {
            sessionLog.log(SessionLog.FINE,
              "\tAffect parameter " + paramInfos.getParameterLabel() + " to " + paramInfos.getParameterValue());
            sessionParams.put(paramInfos.getParameterLabel(), paramInfos.getParameterValue());
          }
        }
      }
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("saveAffectParam", ex);
    }
  }

  public String getVariable(String name) {
    if ((name == null) || (sessionParams.get(name) == null)) {
      return null;
    }
    else {
      return (String) sessionParams.get(name);
    }
  }

  public void setVariable(String name, String value) {
    sessionParams.put(name, value);
  }

  public String getOriginGroupCode() {
    return originGroupCode;
  }

  public void setOriginGroupCode(String ogc) {
    originGroupCode = ogc;
  }

  public String getOriginLanguageCode() {
    return originLanguageCode;
  }

// Mettre a jour originLanguageCode
  public void resetLanguageCode (Long messageId)
  {
    Message_pl message = new Message_pl();
    message= message.findByMessageNumber(messageId);
    if (!this.originLanguageCode.equalsIgnoreCase(message.getLanguageCode()))
      this.setOriginLanguageCode(message.getLanguageCode());
  }
//
  public void setOriginLanguageCode(String olc) {
    originLanguageCode = olc;

    /*try {
      this.messageDescriptor.setLanguage(olc);
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }*/
  }

  public boolean invokeProcedure(Long procedureId) {
    try {
      //ParameterInfos[] paramInfos = this.procedureManager.getProcedureParameters(procedureId);
      ParameterInfos[] paramInfos = (ParameterInfos[])this.procedureManager.getProcedureParameters(procedureId);
      String procName = this.procedureManager.getProcedureName(procedureId);

      Long[] ids = new Long[paramInfos.length];
      Class[] classes = new Class[paramInfos.length];
      String[] labels = new String[paramInfos.length];
      String[] values = new String[paramInfos.length];
      sessionLog.log(SessionLog.INFO, "Procedure : " + procName);

      StringBuffer procedureLogCall = new StringBuffer(procName);
      procedureLogCall.append("( ");
      //System.out.println("Hung - procedureLogCall init: "+procedureLogCall.toString());

      for (int i = 0; i < paramInfos.length; i++) {
        //System.out.println("Hung - procedureLogCall est en cours construit par i: "+i);
        //System.out.println("Hung - procedureLogCall est en cours construit en: "+paramInfos.length+" fois");

        //*
        //try{//hung
        ids[i] = (Long) paramInfos[i].getParameterId();
        //System.out.println("Hung - procedureLogCall est en cours: "+ids[i]);

        classes[i] = paramInfos[i].getParameterClass();
        //System.out.println("Hung - procedureLogCall est en cours: "+classes[i].toString());
        labels[i] = paramInfos[i].getParameterLabel();
        //System.out.println("Hung - procedureLogCall est en cours: "+labels[i]);
        if ((paramInfos[i].getParameterValue() != null)) {
          values[i] = paramInfos[i].getParameterValue();
        }
        else {
          values[i] = (String) this.sessionParams.get(labels[i]);
        }
        //}//hung

        //catch(Exception ef)//hung
        //{//hung
          //System.out.println("Hung - procedureLogCall ne mache pas");
          //System.out.println("Hung - "+ ef.getMessage().toString());//hung
        //}//hung*/

        procedureLogCall.append(labels[i]);
        procedureLogCall.append(" = ");
        procedureLogCall.append(values[i]);
        procedureLogCall.append(" , ");
      }

      procedureLogCall.append(" )");
      sessionLog.log(SessionLog.INFO, "Procedure called : " + procedureLogCall);

      if ((values == null) ||
          ((values.length == 0) && (this.procedureManager.getProcedureType(procedureId).indexOf("PLSQL") >= 0))) {
        values = new String[] { "bidon" };
      }

      Hashtable retour = new Hashtable();

      if ((this.procedureManager.getProcedureType(procedureId).indexOf("PLSQL") >= 0) &&
          ((procName.indexOf(Constants.SET_PARAM_STACK_PROC_NAME) < 0) ||
          (procName.indexOf(Constants.IS_EQUAL_PROC_NAME) < 0))) {
        retour = (Hashtable) procedureCaller.invokeActivitiesProcedure(procName, values);
      }
      else {
        if (procName.indexOf(Constants.SET_PARAM_STACK_PROC_NAME) > 0) {
          for (int i = 0; i < values.length; i++) {
            ParameterInfos pinfos = procedureManager.getParamaterInfos(ids[i]);
            labels[i] = pinfos.getParameterLabel();
            values[i] = pinfos.getParameterValue();
            sessionLog.log(SessionLog.FINE, ":: SetParamStack : " + ids[i] + " : " + labels[i] + " = " + values[i]);
          }

          retour = ajp.setParamStack(labels, values);
        }

        else if (procName.indexOf(Constants.IS_EQUAL_PROC_NAME) > 0) {
          for (int i = 0; i < values.length; i++) {
            ParameterInfos pinfos = procedureManager.getParamaterInfos(ids[i]);
            labels[i] = pinfos.getParameterLabel();
            values[i] = pinfos.getParameterValue();
            sessionLog.log(SessionLog.FINE, ":: IsEqual : " + ids[i] + " : " + labels[i] + " = " + values[i]);
          }

          retour = ajp.isEqual(labels, values);
        }
        else if (procName.indexOf(Constants.IS_MODE_TEXT_PROC_NAME) > 0) {
          sessionLog.log(SessionLog.FINE, ":: IS_MODE_TEXT_PROC_NAME ");
          retour = ajp.isModeText(protocol != Constants.VXML);
          sessionLog.log(SessionLog.FINE, ":: IS_MODE_TEXT_PROC_NAME " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.IS_MODE_AUDIO_PROC_NAME) > 0) {
          sessionLog.log(SessionLog.FINE, "**********");
          sessionLog.log(SessionLog.FINE, "**********");
          sessionLog.log(SessionLog.FINE, "**********");
          sessionLog.log(SessionLog.FINE, "**********");
          sessionLog.log(SessionLog.FINE, ":: IS_MODE_AUDIO_PROC_NAME ");
          retour = ajp.isModeText(protocol == Constants.VXML);
          sessionLog.log(SessionLog.FINE, ":: IS_MODE_AUDIO_PROC_NAME " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.GET_LIST) > 0) {
          sessionLog.log(SessionLog.FINE, ":: GET_LIST ");
          retour = ajp.getList(labels, values);
          sessionLog.log(SessionLog.FINE, ":: GET_LIST " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.SELECT_LIST) > 0) {
          sessionLog.log(SessionLog.FINE, ":: SELECT_LIST ");
          retour = ajp.selectList(labels, values);
          sessionLog.log(SessionLog.FINE, ":: SELECT_LIST " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.DO_COMMIT) > 0) {
          sessionLog.log(SessionLog.FINE, ":: DO_COMMIT ");
          retour = ajp.doCommit();
          sessionLog.log(SessionLog.FINE, ":: DO_COMMIT " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.DO_ROLLBACK) > 0) {
          sessionLog.log(SessionLog.FINE, ":: DO_ROLLBACK ");
          retour = ajp.doRollback();
          sessionLog.log(SessionLog.FINE, ":: DO_ROLLBACK " + retour.get(Constants.CODE_RETOUR));
        }
        else if (procName.indexOf(Constants.SET_LANGUAGE_CODE) > 0) {
          sessionLog.log(SessionLog.FINE, ":: SET_LANGUAGE_CODE ");

          //for (int i = 0; i < labels.length; i++) {
          //if (labels[i].equals(Constants.LANGUAGE_CODE)) {
          retour = ajp.setLanguageCode(values[0]);
          sessionLog.log(SessionLog.FINE, ":: SET_LANGUAGE_CODE " + retour.get(Constants.CODE_RETOUR));

          //}
          //}
        }
        else {
          String packageName = procName.substring(0, procName.lastIndexOf("."));
          ajp.setOraclePackage(packageName);
          sessionLog.log(SessionLog.FINE, packageName);
          procName = procName.substring(procName.lastIndexOf(".") + 1, procName.length());
          sessionLog.log(SessionLog.FINE, procName);

          Method m = ajp.getClass().getMethod(procName, classes);
          retour = (Hashtable) m.invoke(ajp, (Object) values);
        }
      }

      //set variables
      Enumeration keys = retour.keys();
      StringBuffer procedureLogReturn = new StringBuffer("");
      int codeRetour = -10;

      boolean ok = false;

      while (keys.hasMoreElements()) {
        String key = (String) keys.nextElement();
        this.sessionParams.put(key, retour.get(key));
        procedureLogReturn.append(key);
        procedureLogReturn.append(" = ");
        procedureLogReturn.append(this.sessionParams.get(key));
        //for transfer
        if (key.equalsIgnoreCase("CODE"))
        {
          Constants.CODE=this.sessionParams.get(key).toString();
        }
        if (key.equalsIgnoreCase("NUMBER_TO_CALL"))
        {
          Constants.NUMBER_TO_CALL=this.sessionParams.get(key).toString();
        }
        if (key.equalsIgnoreCase("CONNECT_TIME_OUT"))
        {
          Constants.CONNECT_TIME_OUT=this.sessionParams.get(key).toString();
        }
        if (key.equalsIgnoreCase("MAX_TIME"))
        {
          Constants.MAX_TIME=this.sessionParams.get(key).toString();
        }        
        //end for transfer
        procedureLogReturn.append(" , ");

        if (key.equals(Constants.CODE_RETOUR)) {
          try {
            codeRetour = Integer.parseInt((String) this.sessionParams.get(key));

            if (codeRetour >= 0) {
              ok = true;
            }
          }
          catch (NumberFormatException nfex) {
            nfex.printStackTrace();
            notifyException(procedureLogCall.toString(), procedureLogReturn.toString());
            ok = false;
          }
        }

        //sessionLog.log(SessionLog.INFO, "\t\t" + key + " : " + this.sessionParams.get(key));
      }

      sessionLog.log(SessionLog.INFO, "\t\tProcedure returned : " + procedureLogReturn);
      logProcedures(codeRetour, procedureLogCall.toString(), procedureLogReturn.toString());
      //trace de Hung
      //System.out.println("Hung - fini RobotSession.logProcedures()");
      //

      return ok;
    }
    catch (Exception ex) {
      //trace de Hung
      //System.out.println("Hung - non-fini RobotSession.logProcedures()");
      //
      notifyException("invokeProcedureError", ex.getMessage());
      sessionLog.log(SessionLog.SEVERE, "invokeProcedure ERROR");
      sessionLog.log(SessionLog.SEVERE, ex);
    }

    return false;
  }

  private void notifyException(String procedureCall, String message) {
    try {
      StringBuffer description = new StringBuffer();
      description.append("Called : ").append(calledNumber).append("\n");
      description.append("Caller : ").append(callerNumber).append("\n");
      description.append("UserId : ").append(sessionManager.getUserPersonId()).append("\n");
      description.append("Description : \n\t").append(procedureCall).append("\n\t").append(message);

      Timestamp now = new Timestamp(System.currentTimeMillis());
      sessionManager.createBug(now, description.toString(), "DAS", "N", originGroupCode);

      boolean prod = true;

      if (prod) {
//        ProcedureCallerBeanRemote pcHome = getProcedureCallerHome();
        ProcedureCallerBeanRemote pc = getProcedureCallerHome();
        pc.init(sessionId);
        pc.sendMail(exceptionMailFrom, exceptionMailTo, exceptionMailSubject, description.toString());

        description = new StringBuffer();

        String lastName = getVariable("LASTNAME");
        String firstName = getVariable("FIRSTNAME");

        if ((lastName == null) && (firstName == null)) {
          description.append("UserId").append(sessionManager.getUserPersonId()).append("\n");
        }
        else {
          description.append(firstName).append(" ").append(lastName).append("\n");
        }

        description.append("Tel ").append(callerNumber).append("\n");
        description.append("Date ").append(now.toString()).append("\n");
        description.append(message);
        pc.sendMail(exceptionSmsFrom, exceptionSmsTo, exceptionSmsSubject, description.toString().substring(0, 150));
        pc.doCommit();
        pc.closeConnection();
      }
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  public boolean compareInput2InputType(String input, String inputType, long min, long max) {
    if (inputType.indexOf(Constants.DTMF) == 0) {
      inputType = inputType.substring(Constants.DTMF.length(), inputType.length());

      //sessionLog.log(SessionLog.DEBUG, compare DTMF : " + input + " to : " + inputType);
      if (input.equals(inputType)) {
        return true;
      }
      else {
        return false;
      }
    }

    else if ((inputType.indexOf(Constants.DTMFMASK) == 0) && !(input.equals("#") || input.equals("*"))) {
      inputType = inputType.substring(Constants.DTMFMASK.length(), inputType.length());

      //them vao cua Hung
      String inputTermChar = "";
      String termChar = input.substring(input.length() - 1, input.length());
      if(termChar.equals("#") || termChar.equals("*")){//them vao
        //inputTermChar = input.substring(input.length() - 1, input.length());//chinh thuc
        inputTermChar = termChar;
        input = input.substring(0, input.length() - 1);//chinh thuc
      }//them vao
      //else{
        //String inputTermChar = "";
      //}
      //ket thuc them vao
      
      String inputTypeTermChar = "";
      sessionLog.log(SessionLog.FINEST,
        "it : " + inputType + " i: " + input + " ittc: " + inputTypeTermChar + " itc: " + inputTermChar);

      if (inputType.length() > 6) {
        inputTypeTermChar = inputType.substring(inputType.length() - 1, inputType.length());
        inputType.substring(6, inputType.length());
      }

      int opt = Integer.parseInt(inputType.substring(1, 3));
      int oblig = Integer.parseInt(inputType.substring(4, 6));

      if ((oblig <= input.length()) && (input.length() <= (oblig + opt)) && (min <= Long.parseLong(input)) &&
          (Long.parseLong(input) <= max)) {
        //if ((inputTypeTermChar.length() == 0) && inputTermChar.equals("#")) {//tam thoi déactivé, 6/9/2007
        if (inputTypeTermChar.length() == 0) {// thay the ligne tren, 6/9/2007
          return true;
        }
        else if (inputTypeTermChar.equals("*") && inputTermChar.equals("*")) {
          return true;
        }
        //them vao de # tuong tu nhu *, 6/9/2007
        else if (inputTypeTermChar.equals("#") && inputTermChar.equals("#")) {
          return true;
        }        
        //ket thuc 6/9/2007
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return input.equalsIgnoreCase(inputType);
    }
  }

  public void initializeDialogInputs() {
    currentDialogInputs = new ArrayList();

    try {
      currentDialogInputs = dialogManager.getDialogInputs();
      sessionLog.log(SessionLog.FINE, "\tDIs found: " + currentDialogInputs.size());

      for (int i = 0; i < currentDialogInputs.size(); i++) {
        DialogInputInfos di = (DialogInputInfos) currentDialogInputs.get(i);
        String variableFilter = di.getVariableFilter();

        if (variableFilter == null) {
          sessionLog.log(SessionLog.FINEST,
            "\t DI " + di.getDialogInputId() + " - " + di.getInputType() + " added w/o variable: " + variableFilter);
        }
        else {
          String vfValue = (String) sessionParams.get(variableFilter);

          if ((vfValue != null) && !vfValue.equals("1")) {
            currentDialogInputs.remove(i);
            sessionLog.log(SessionLog.FINEST,
              "\t DI " + di.getDialogInputId() + " - " + di.getInputType() + " removed w/ variable: " + variableFilter);
          }
          else {
            sessionLog.log(SessionLog.FINEST,
              "\t DI " + di.getDialogInputId() + " - " + di.getInputType() + " added w/ variable: " + variableFilter);
          }
        }
      }
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("initializeDialogInputs", ex);
    }
  }

  /*public Long addRecording(byte[] bytes, Double duration, String input, Timestamp ts) {
    return addRecording(bytes, duration, input, ts, originGroupCode);
  }*/

  //ajout de Hung
  public Long addRecording(byte[] bytes, Double duration, String input, Timestamp ts) {
    return addRecording(bytes, duration, input, ts, originGroupCode);
  }
  //

  //public Long addRecording(byte[] bytes, Double duration, String input, Timestamp ts, String groupCode, String concatane) {

  //ajout de Hung
  public Long addRecording(byte[] bytes, Double duration, String input, Timestamp ts, String groupCode) {
  //
    try {
      //Long recordingLogId = sessionManager.addRecording(bytes, duration, groupCode);

      //ajout de Hung
      Long recordingLogId = sessionManager.addRecording(bytes, duration, groupCode, dialogOutputId);
      //
      sessionLog.log(SessionLog.FINEST, "Blob saved : " + recordingLogId);

      setVariable(Constants.RECORDING_LOG_ID, recordingLogId.toString());

      if (pushedKeysLogLevel == 0) {
        sessionLog.log(SessionLog.FINEST, "Log recording pushed key " + input);
        sessionManager.addRecordingPushedKey(input, ts, serviceDialogId, dialogOutputId, recordingLogId);
      }

      return recordingLogId;
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.FINE, "no session/no record id");
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("addRecording - data", ex);

      return null;
    }
  }

  /*public Long addRecording(String translation, Double duration, String input, Timestamp ts) {
    return addRecording(translation, duration, input, ts, originGroupCode);
  }*/
  //ajout de Hung
  public Long addRecording(String translation, Double duration, String input, Timestamp ts) {
    return addRecording(translation, duration, input, ts, originGroupCode);
  }
  //

  //public Long addRecording(String translation, Double duration, String input, Timestamp ts, String groupCode) {
  //ajout de Hung
  public Long addRecording(String translation, Double duration, String input, Timestamp ts, String groupCode) {
  //
    try {
      //Long recordingLogId = sessionManager.addRecording(translation, duration, groupCode);
      //ajout de Hung
      Long recordingLogId = sessionManager.addRecording(translation, duration, groupCode, dialogOutputId);
      //
      sessionLog.log(SessionLog.FINEST, "Blob saved : " + recordingLogId);

      setVariable(Constants.RECORDING_LOG_ID, recordingLogId.toString());

      if (pushedKeysLogLevel == 0) {
        sessionLog.log(SessionLog.FINEST, "Log recording pushed key " + input);
        sessionManager.addRecordingPushedKey(input, ts, serviceDialogId, dialogOutputId, recordingLogId);
      }

      return recordingLogId;
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.FINE, "no session/no record id");
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("addRecording - text", ex);

      return null;
    }
  }

  public void setRecordingBlobData(Long logId, byte[] bytes, Double duration, String input, Timestamp ts) {
    try {
      sessionManager.setRecordingBlobData(logId, bytes);
      sessionLog.log(SessionLog.FINEST, "Blob saved : " + logId);

      setVariable(Constants.RECORDING_LOG_ID, logId.toString());

      if (pushedKeysLogLevel == 0) {
        sessionLog.log(SessionLog.FINEST, "Log recording pushed key " + input);
        sessionManager.addRecordingPushedKey(input, ts, serviceDialogId, dialogOutputId, logId);
      }
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.FINE, "no session/no record id");
      sessionLog.log(SessionLog.SEVERE, ex);
      logException("setRecordingBlobData", ex);
    }
  }

  public byte[] getRecordingBlobData(Long logId) {
    try {
      return sessionManager.getRecordingBlobData(logId);
    }
    catch (RemoteException e) {
      sessionLog.log(SessionLog.SEVERE, e);

      return null;
    }
  }

  public int getCurrentDIsNumber() {
    return currentDialogInputs.size();
  }

  public String getGroupCode(Long groupId) throws RemoteException {
    return messageDescriptor.getGroupCode(groupId);
  }

  private void logPushedKeys(String input) {
    try {
      if (pushedKeysLogLevel == 0) {
        if ((input.indexOf(Constants.RECORDING) < 0) && (input.indexOf(Constants.DICTOPHONE) < 0)) {
          sessionLog.log(SessionLog.FINEST, "Log pushed key " + input);
          sessionManager.addPushedKey(input, serviceDialogId, dialogOutputId);
        }
      }
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }

  private void logProcedures(int status, String logCall, String logReturn) {
    try {
      switch (pushedKeysLogLevel) {
      case 0:
        sessionManager.addProceduresLog(logCall, logReturn);

        break;

      case 5:

        if (status < -1) {
          sessionManager.addProceduresLog(logCall, logReturn);
        }

        break;
      }
    }
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }

  private void logException(String procedureCall, Exception ex) {
    String exceptionMessage = ex.getMessage().substring(0, 200);
    logException(procedureCall, exceptionMessage);
  }

  private void logException(String procedureCall, String exceptionMessage) {
    sessionLog.log(SessionLog.FINE, "exception : " + procedureCall + " - " + exceptionMessage);

    try {
      switch (proceduresLogLevel) {
      case 0:
        sessionManager.addProceduresLog(procedureCall, exceptionMessage);

        break;

      case 5:
        sessionManager.addProceduresLog(procedureCall, exceptionMessage);

        break;
      }
    }
    catch (RemoteException rex) {
      sessionLog.log(SessionLog.SEVERE, rex);
    }
  }

  public void closeConnection() {
    try {
      //for transfer
      String para[] ={Constants.NUMBER_TO_CALL, Constants.CODE};      
      if(!(Constants.CODE.equals("00"))){
        procedureCaller.invokeActivitiesProcedure("CARD.FUNCTION_CARD.count_minute", para );
      }
      //for transfer
      sessionManager.closeCall();
      procedureCaller.doRollback();
      procedureCaller.closeConnection();

      sessionManager.remove();
      sessionLog.log(SessionLog.INFO, "sessionManager removed ");
      dialogManager.remove();
      sessionLog.log(SessionLog.INFO, "dialogManager removed");
      messageDescriptor.remove();
      sessionLog.log(SessionLog.INFO, "messageDescriptor removed");
      procedureManager.remove();
      sessionLog.log(SessionLog.INFO, "procedureManager removed");
      procedureCaller.remove();
      sessionLog.log(SessionLog.INFO, "procedureCaller removed");
    }
    //catch (Exception ex) {
    catch (RemoteException ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }

  public Long getDialogOutputId() {
    return dialogOutputId;
  }

  public void setDialogOutputId(Long doid) {
    dialogOutputId = doid;

    try {
      dialogManager.setDialogOutput(dialogOutputId);
      initializeDialogInputs();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  public SessionManagerBeanRemote getSessionManagerHome() throws NamingException {
    return (SessionManagerBeanRemote) ctx.lookup("sessionManager");
  }

  public MessagesDescriptorBeanRemote getMessagesDescriptorHome()
    throws NamingException {
    return (MessagesDescriptorBeanRemote) ctx.lookup("messagesDescriptor");
  }

  public DialogManagerBeanRemote getDialogManagerHome() throws NamingException {
    return (DialogManagerBeanRemote) ctx.lookup("dialogManager");
  }

  public ProcedureManagerBeanRemote getProcedureManagerHome()
    throws NamingException {
    return (ProcedureManagerBeanRemote) ctx.lookup("procedureManager");
  }

  public ProcedureCallerBeanRemote getProcedureCallerHome() throws NamingException {
    return (ProcedureCallerBeanRemote) ctx.lookup("procedureCaller");
  }

  protected abstract StringBuffer continueDialogOutput(StringBuffer httpResponse);

  protected abstract String formatInput(String input);

  protected abstract boolean compareInput2DI(String inputType, long min, long max, String input);

  protected abstract StringBuffer addPrompts(Long firstMessageNumber, String dialogInputMessageCode, int typeMess);

  /*protected abstract StringBuffer addGrammar(StringBuffer httpResponse, List dialogInputs);

  protected abstract StringBuffer addPrompts(StringBuffer httpResponse, Long firstMessageNumber);

  protected abstract StringBuffer addErrorPrompts(Long firstMessageNumber);

  protected abstract StringBuffer addHelpPrompts(Long firstMessageNumber);

  protected abstract StringBuffer addDONoInput(StringBuffer httpResponse);

  protected abstract StringBuffer addCatch(StringBuffer httpResponse);*/
}
