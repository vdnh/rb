package com.ettp.robot.common;

import com.ettp.robot.common.RobotSession;
import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;

import java.io.File;

import java.sql.Timestamp;

import java.util.Hashtable;
import java.util.List;


public class JavaProcedures {
  RobotSession robotSession;
  String packageName;

  //Hashtable audios = null;
  List audios = null;

  //Iterator audioIterator;
  int audiosIndex = 0;

  public JavaProcedures(RobotSession robotSession) {
    this.robotSession = robotSession;
  }

  public void setOraclePackage(String packageName) {
    this.packageName = packageName;
  }

  public Hashtable checkLogin(String login, String password, String calledNumber) {
    try {
      Hashtable retour = (Hashtable) robotSession.procedureCaller.invokeActivitiesProcedure(packageName +
          ".CHECKLOGIN", new String[] { login, password, calledNumber });

      /*  --  FIRSTNAME='Dan',
          --  LASTNAME='STEFAN',
          --  USER_PERSON_ID='100',
          --  ORIGIN_GROUP_ID='4',
          --  LANGUAGE_CODE='FR'
       */
      if (new Long(((String) retour.get(Constants.CODE_RETOUR))).longValue() >= 0) {
        robotSession.sessionManager.setUserInfos(new Long(((String) retour.get("USER_PERSON_ID"))), calledNumber,
          (String) retour.get("LANGUAGE_CODE"));
        robotSession.setOriginLanguageCode((String) retour.get("LANGUAGE_CODE"));
      }

      return retour;
    }
    catch (Exception ex) {
      try {
        Hashtable retour = (Hashtable) robotSession.procedureCaller.invokeActivitiesProcedure(Constants.DEFAULT_PACKAGE +
            ".CHECKLOGIN", new String[] { login, password, calledNumber });

        /*  --  FIRSTNAME='Dan',
            --  LASTNAME='STEFAN',
            --  USER_PERSON_ID='100',
            --  ORIGIN_GROUP_ID='4',
            --  LANGUAGE_CODE='FR'
         */
        if (new Long(((String) retour.get(Constants.CODE_RETOUR))).longValue() >= 0) {
          robotSession.sessionManager.setUserInfos(new Long(((String) retour.get("USER_PERSON_ID"))), calledNumber,
            (String) retour.get("LANGUAGE_CODE"));
          robotSession.setOriginLanguageCode((String) retour.get("LANGUAGE_CODE"));
        }

        return retour;
      }
      catch (Exception ex2) {
        robotSession.sessionLog.log(SessionLog.SEVERE, ex);
        robotSession.sessionLog.log(SessionLog.SEVERE, ex2);

        return null;
      }
    }
  }

  public Hashtable getUserPersonData(String callerNumber, String calledNumber) {
    try {
      Hashtable retour = (Hashtable) robotSession.procedureCaller.invokeActivitiesProcedure(packageName +
          ".getUserPersonData", new String[] { callerNumber, calledNumber });

      /*  --  FIRSTNAME='Dan',
          --  LASTNAME='STEFAN',
          --  USER_PERSON_ID='100',
          --  ORIGIN_GROUP_ID='4',
          --  LANGUAGE_CODE='FR'
       */
      if (new Long(((String) retour.get(Constants.CODE_RETOUR))).longValue() >= 0) {
        robotSession.sessionManager.setUserInfos(new Long(((String) retour.get("USER_PERSON_ID"))), calledNumber,
          (String) retour.get("LANGUAGE_CODE"));
        robotSession.setOriginLanguageCode((String) retour.get("LANGUAGE_CODE"));
      }

      return retour;
    }
    catch (Exception ex) {
      try {
        Hashtable retour = (Hashtable) robotSession.procedureCaller.invokeActivitiesProcedure(Constants.DEFAULT_PACKAGE +
            ".getUserPersonData", new String[] { callerNumber, calledNumber });

        /*  --  FIRSTNAME='Dan',
            --  LASTNAME='STEFAN',
            --  USER_PERSON_ID='100',
            --  ORIGIN_GROUP_ID='4',
            --  LANGUAGE_CODE='FR'
         */
        if (new Long(((String) retour.get(Constants.CODE_RETOUR))).longValue() >= 0) {
          robotSession.sessionManager.setUserInfos(new Long(((String) retour.get("USER_PERSON_ID"))), calledNumber,
            (String) retour.get("LANGUAGE_CODE"));
          robotSession.setOriginLanguageCode((String) retour.get("LANGUAGE_CODE"));
        }

        return retour;
      }
      catch (Exception ex2) {
        robotSession.sessionLog.log(SessionLog.SEVERE, ex);
        robotSession.sessionLog.log(SessionLog.SEVERE, ex2);

        return null;
      }
    }
  }

  public Hashtable setLanguageCode(String languageCode) {
    robotSession.sessionLog.log(SessionLog.INFO, "set language code to : " + languageCode);
    robotSession.setOriginLanguageCode(languageCode);

    Hashtable ret = new Hashtable();
    ret.put(Constants.CODE_RETOUR, "0");

    return ret;
  }

  public Hashtable setParamStack(String[] paramLabels, String[] paramValues) {
    for (int i = 0; i < paramLabels.length; i++) {
      String value = "";

      if (paramValues[i] != null) {
        value = paramValues[i].toString();
      }

      if (paramLabels[i] != null) {
        robotSession.setVariable(paramLabels[i], value);
      }
    }

    Hashtable ret = new Hashtable();
    ret.put(Constants.CODE_RETOUR, "0");

    return ret;
  }

  public Hashtable isEqual(String[] paramLabels, String[] paramValues) {
    boolean ok = true;

    for (int i = 0; (i < paramLabels.length) && ok; i++) {
      try {
        String stackValue = robotSession.getVariable(paramLabels[i]);

        ok = stackValue.equals(paramValues[i]);
      }
      catch (Exception ex) {
        robotSession.sessionLog.log(SessionLog.SEVERE, ex);
        ok = false;
      }
    }

    Hashtable ret = new Hashtable();

    if (ok) {
      ret.put(Constants.CODE_RETOUR, "0");
    }
    else {
      ret.put(Constants.CODE_RETOUR, "-1");
    }

    return ret;
  }

  public Hashtable isModeText(boolean text) {
    Hashtable ret = new Hashtable();

    if (text) {
      ret.put(Constants.CODE_RETOUR, "0");
    }
    else {
      ret.put(Constants.CODE_RETOUR, "-1");
    }

    return ret;
  }

  public Hashtable isModeAudio(boolean audio) {
    Hashtable ret = new Hashtable();

    if (audio) {
      ret.put(Constants.CODE_RETOUR, "0");
    }
    else {
      ret.put(Constants.CODE_RETOUR, "-1");
    }

    return ret;
  }

  public Hashtable getList(String[] paramLabels, String[] paramValues) {
    Hashtable ret = new Hashtable();
    ret.put(Constants.CODE_RETOUR, "0");

    return ret;
  }

  public Hashtable selectList(String[] paramLabels, String[] paramValues) {
    Hashtable ret = new Hashtable();
    ret.put(Constants.CODE_RETOUR, "0");

    return ret;
  }

  //JAVA.editMessage(WAV_NAME/WAV_FILE='10002.wav',MESSAGE_TEXT='message à enregistrer',VARIABLE_GROUP_ID='4',VARIABLE_LANGUAGE='FR')
  public Hashtable editMessage(String originGroupId, String languageCode, String wavName) {
    Hashtable retour = new Hashtable();

    try {
      /*  --  MESSAGE_ID='10000',
          --  WAV_FILE='10002.wav',
          --  MESSAGE_TEXT='message à enregistrer',
       */
      try {
        String[] infos = robotSession.messageDescriptor.getAudio(new Long(originGroupId), languageCode,
            wavName + ".wav");

        if (infos != null) {
          String fileName = infos[0];
          String text = infos[1];

          retour.put(Constants.CODE_RETOUR, "5");

          if (fileName.lastIndexOf(".") >= 0) {
            fileName = fileName.substring(0, fileName.lastIndexOf("."));
          }

          //retour.put("MESSAGE_ID", "10001");
          retour.put(Constants.WAV_FILE, fileName);
          retour.put("MESSAGE_TEXT", text);
          retour.put(Constants.VARIABLE_GROUP_ID, originGroupId);
          retour.put(Constants.VARIABLE_LANGUAGE, languageCode);
          audiosIndex++;
        }
        else {
          retour.put(Constants.CODE_RETOUR, "-1");
          audios = null;
        }
      }
      catch (Exception ex) {
        retour.put(Constants.CODE_RETOUR, "-1");
        audios = null;
      }
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }

  public Hashtable getNextNewMessage(String originGroupId, String languageCode) {
    Hashtable retour = new Hashtable();

    try {
      /*  --  MESSAGE_ID='10000',
          --  WAV_FILE='10002.wav',
          --  MESSAGE_TEXT='message à enregistrer',
       */
      if (audios == null) {
        robotSession.sessionLog.log(SessionLog.INFO, "getNextNewMessage : " + originGroupId + "  " + languageCode);
        audios = robotSession.messageDescriptor.getAudiosList(new Long(originGroupId), languageCode);
      }

      try {
        String[] infos = (String[]) audios.get(audiosIndex);

        if (infos != null) {
          String fileName = infos[0];
          String text = infos[1];

          retour.put(Constants.CODE_RETOUR, "5");

          if (fileName.lastIndexOf(".") >= 0) {
            fileName = fileName.substring(0, fileName.lastIndexOf("."));
          }

          //retour.put("MESSAGE_ID", "10001");
          retour.put(Constants.WAV_FILE, fileName);
          retour.put("MESSAGE_TEXT", text);
          retour.put(Constants.VARIABLE_GROUP_ID, originGroupId);
          retour.put(Constants.VARIABLE_LANGUAGE, languageCode);
          audiosIndex++;
        }
        else {
          retour.put(Constants.CODE_RETOUR, "-1");
          audios = null;
        }
      }
      catch (Exception ex) {
        retour.put(Constants.CODE_RETOUR, "-1");
        audios = null;
      }
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }

  public Hashtable deleteRecord(String varLanguageCode, String varGroupId) {
    Hashtable retour = new Hashtable();

    try {
      String wavFile = robotSession.getVariable(Constants.WAV_FILE);
      File wf = new File(Constants.RECORD_DIR + File.separator + varGroupId + File.separator + varLanguageCode +
          File.separator + wavFile + ".wav");
      wf.delete();
      retour.put(Constants.CODE_RETOUR, "0");
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }

  public Hashtable registerRecord(String wavFile, String messageText, String varLanguageCode, String varGroupId,
    String interlocuteur) {
    Hashtable retour = new Hashtable();

    try {
      Timestamp ts = new Timestamp(System.currentTimeMillis() + 1000);
      robotSession.messageDescriptor.setDateCreationWav(messageText, varLanguageCode, new Long(varGroupId), ts,
        interlocuteur);

      String group = robotSession.messageDescriptor.getGroupCode(new Long(varGroupId));
      String command = "C:\\cygwin\\bin\\scp " + Constants.RECORD_DIR + File.separator + group + File.separator +
        varLanguageCode + File.separator + wavFile +
        ".wav nuance@kraken.ettp.com:/export/spare/Nuance_8.5/vws/prompts/" + group + "/" + varLanguageCode +
        "/" + wavFile + ".wav";
      robotSession.sessionLog.log(SessionLog.INFO, "Exec" + command);

      Runtime r = Runtime.getRuntime();
      Process p = r.exec(command);
      retour.put(Constants.CODE_RETOUR, "0");
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }

  public Hashtable doCommit() {
    Hashtable retour = new Hashtable();

    try {
      robotSession.procedureCaller.doCommit();
      retour.put(Constants.CODE_RETOUR, "0");
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }

  public Hashtable doRollback() {
    Hashtable retour = new Hashtable();

    try {
      robotSession.procedureCaller.doRollback();
      retour.put(Constants.CODE_RETOUR, "0");
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      retour.put(Constants.CODE_RETOUR, "-1");
    }

    return retour;
  }
}
