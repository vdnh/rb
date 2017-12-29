package com.ettp.robot.common;

import com.ettp.robot.common.tools.GeneralLog;
//import com.ettp.robot.common.tools.SessionLog;

//import java.io.File;
//import java.io.FileInputStream;

import java.net.InetAddress;

import java.util.Properties;


public class Constants {
  //adresses
  public static String HOST = "";
  private static final String port = "8888";
  //public static String ROOT_URL = "http://" + HOST + ":" + port + "/robot/";
  // echanger robot par robot
  public static String ROOT_URL = "http://" + HOST + ":" + port + "/robot/";
  //public static String ROOT_URL = "http://" + HOST + ":" + port + "/nguoimay/";
  //fin
  public static String ROBOT_VXML_URL = ROOT_URL + "servlet/RobotVxml";
  public static String DICTOPHONE_URL = ROOT_URL + "sCALervlet/Dictophone";
  public static String DTMF_TEXT_URL = ROOT_URL + "servlet/DtmfText";
  public static String DTMF_TEXT_VALID_URL = ROOT_URL + "servlet/DtmfTextValidate";
  public static String TMP_WAV_URL = ROOT_URL + "servlet/FileDownloader?sessionid=";

  //public static String ROBOT_RECORDING_URL = ROOT_URL + "servlet/Recorder";
  public static String BLOB_URL = ROOT_URL + "servlet/BlobDownloader?logid=";
  //ajout de Hung pour Blob direct
  public static String BLOB_URL_DIRECT = ROOT_URL + "servlet/BlobDownloaderDirect?blobid=";
  //
  //ajout de Hung pour Blob_Common
  public static String BLOB_URL_COMMON = ROOT_URL + "servlet/BlobDownloaderCommon?blobCode=";
  //

  //TODO super moche !!!!!
  public static final String DTMF_TEXT_PROMPTS_URL = "file:../../prompts/common/dtmf_text/";
  public static final String DICTOPHONE_PROMPTS_URL = "file:../../prompts/common/dictophone/";
  public static final String DTMF_TEXT_VOXPILOT_PROMPTS_URL = "http://jupiter.ettp.com/voxpilot/common/dtmf_text/";
  public static final String DICTOPHONE_VOXPILOT_PROMPTS_URL = "http://jupiter.ettp.com/voxpilot/common/dictophone/";
  public static final String LETTER_ROOT = "letter_";
  public static final String TTS_URL = "http://jupiter/robot/ttsdaemon/";
  public static final String TTSDAEMON_URL = "http://simulateur@jupiter/cgi-bin/robot/ttsdaemon.pl";
  public static final String TOP_HOME_MASK = "192.168.";
  public static final String TOP_COMPLETEL_MASK = "192.168.";
  public static int ROBOT_MIDDLE_LOG_LEVEL = 0;

  //voxpilot
  public static String ROBOT_VOXPILOT_URL = ROOT_URL + "servlet/RobotVoxpilot";
  public static String DICTOPHONE_URL_VOXPILOT = ROOT_URL + "servlet/DictophoneVoxpilot";
  public static String DTMF_TEXT_URL_VOXPILOT = ROOT_URL + "servlet/DtmfTextVoxpilot";
  public static String DTMF_TEXT_VALID_URL_VOXPILOT = ROOT_URL + "servlet/DtmfTextValidateVoxpilot";

  //public static final String PROMPTS_URL_VOXPILOT = "http://jupiter.ettp.com/voxpilot/";
  //parametres robots
  public static final String SESSION_ID = "SESSION_ID";
  //public static final String SESSION_ID = "Call-ID";
  public static final String CALLER_ID = "CALLER_NUMBER";
  public static final String CALLED_ID = "CALLED_NUMBER";
  public static final String DIALOG_ID = "serviceDialogId";
  public static final String DIALOG_OUTPUT_ID = "dialogOutputId";
  public static final String REFERENCE_NUMBER = "0437270715";
  //ajout de Hung
  public static final String CALL_LOG_ID = "CALL_LOG_ID";
  //

  //DTMF masks
  public static final String DTMFMASK = "DTMFMASK-";
  public static final String DTMF = "DTMF-";
  public static final String DTMF_LIST = "DTMF_LIST";
  public static final String RECORDING = "RECORDING";
  public static final String DICTOPHONE = "DICTOPHONE";
  public static final String DTMF_TEXT = "DTMF_TEXT";
  public static final String TIME_OUT = "TIME_OUT";
  public static final String REPROMPT = "reprompt";
  public static final String INPUT = "input";

  //constantes session
  public static boolean MULTILINGUAL = false;
  public static final String LANGUAGE_CODE = "language";
  public static final String FRENCH = "FR";
  public static final String FRENCH_NUANCE = "fr-FR";
  public static final String ENGLISH = "EN";
  public static final String ENGLISH_NUANCE = "en-US";
  public static final String GERMAN = "DE";
  public static final String DUTCH = "NL";
  public static final String MESSAGE_LEVEL = "message_level";
  public static final String VARIABLE = "VARIABLE";
  public static final String VARIABLE_GROUP_ID = "VARIABLE_GROUP_ID";
  public static final String VARIABLE_LANGUAGE = "VARIABLE_LANGUAGE";
  public static final String DEFAULT_PACKAGE = "ettp.ettp_robot_interface";
  //public static final String CALL_LOG_ID = "CALL_LOG_ID";

  //constantes procedures
  public static final String CODE_RETOUR = "STATUS";
  public static final String MESSAGE_LIST = "MESSAGE_LIST";
  public static final String ITEM_LIST = "ITEM_LIST";
  public static final String STRING_LIST = "STRING_LIST";
  public static final String SET_PARAM_STACK_PROC_NAME = "setParamStack";
  public static final String IS_EQUAL_PROC_NAME = "isEqual";
  public static final String IS_MODE_TEXT_PROC_NAME = "isModeText";
  public static final String IS_MODE_AUDIO_PROC_NAME = "isModeAudio";
  public static final String GET_LIST = "getList";
  public static final String SELECT_LIST = "selectList";
  public static final String DO_COMMIT = "doCommit";
  public static final String DO_ROLLBACK = "doRollback";
  public static final String SET_LANGUAGE_CODE = "setLanguageCode";

  //constantes pour les recordings
  public static final String WAV_FILE = "WAV_FILE";
  public static final String RECORDING_LOG_ID = "RECORDING_LOG_ID";
  public static final String RECORD_DIR = "recordings";
  public static final String RECORDING_DURATION = "RECORDING_DURATION";
  public static final String RECORDING_VARIABLE_NAME = "recorded_message";
  public static final String CHARSET = "ISO-8859-1";

  //IDs dialogue speciaux
  public static final Long INIT_SERVICE_ID = new Long(-1);
  //public static final Long EXIT_EVENT_SERVICE_ID = new Long(-10);
  public static  Long EXIT_EVENT_SERVICE_ID = new Long(-10);
  public static final Long LAST_DO_ID = new Long(10000);

  //types de messages variables
  public static final String NUMBER = "NUMBER";
  public static final String TEL = "TEL";
  public static final String DIGITS = "DIGIT";
  public static final String STRING = "STRING";
  public static final String MESSAGE = "MESSAGE";
  public static final String BLOB = "BLOB";
  public static final String EUROS = "EURO";
  public static final String SPELL = "SPELL";

  //date
  public static final String MMRR = "MMRR";
  public static final String HHMM = "HHMM";
  public static final String DDMM = "DDMM";

  //grammar constants
  public static final int DTMF_INPUT = 0;
  public static final int VOCAL_INPUT = 1;
  public static final int MIXTE_INPUT = 2;

  //protocols
  public static final int VXML = 0;
  public static final int GPRS = 1;
  public static final int HTML = 2;
  public static final int CYCLOPE = 3;

  //type recherche message
  public static final int MESSAGE_NUMBER_MESS = 0;
  public static final int DIALOG_OUTPUT_MESS = 1;
  public static final int DIALOG_OUTPUT_HELP_MESS = 2;
  public static final int DIALOG_INPUT_MESS = 3;

  //dialog type
  public static final int MESSAGE_NUMBER_MESS_TYPE = 0;
  public static final int DIALOG_OUTPUT_MESS_TYPE = 1;
  
  //for transfer
  public static  String CODE = "00";
  public static  String NUMBER_TO_CALL="0437270715";
  public static  String CONNECT_TIME_OUT="55";
  public static  String MAX_TIME="10";
  // end for transfer
  
  //public static final String VARIABLES = "VARIABLES";
  public static void init(GeneralLog generalLog) {
    try {
      HOST = InetAddress.getLocalHost().getHostAddress();
      //ROOT_URL = "http://" + HOST + ":" + port + "/robot/";
      //echanger robot par robot
      ROOT_URL = "http://" + HOST + ":" + port + "/robot/";
      //ROOT_URL = "http://" + HOST + ":" + port + "/nguoimay/";
      //fin
      ROBOT_VXML_URL = ROOT_URL + "servlet/RobotVxml";
      DICTOPHONE_URL = ROOT_URL + "servlet/Dictophone";
      DTMF_TEXT_URL = ROOT_URL + "servlet/DtmfText";
      DTMF_TEXT_VALID_URL = ROOT_URL + "servlet/DtmfTextValidate";

      //voxpilot
      ROBOT_VOXPILOT_URL = ROOT_URL + "servlet/RobotVoxpilot";
      DICTOPHONE_URL_VOXPILOT = ROOT_URL + "servlet/DictophoneVoxpilot";
      DTMF_TEXT_URL_VOXPILOT = ROOT_URL + "servlet/DtmfTextVoxpilot";
      DTMF_TEXT_VALID_URL_VOXPILOT = ROOT_URL + "servlet/DtmfTextValidateVoxpilot";

      TMP_WAV_URL = ROOT_URL + "servlet/FileDownloader?sessionid=";

      //ROBOT_RECORDING_URL = ROOT_URL + "servlet/Recorder";
      //ROBOT_RECORDING_URL = ROBOT_VXML_URL;
      BLOB_URL = ROOT_URL + "servlet/BlobDownloader?logid=";
      //ajout de Hung pour Blob direct
      BLOB_URL_DIRECT = ROOT_URL + "servlet/BlobDownloaderDirect?blobid=";
      //ajout de Hung pour Blob_Common
      BLOB_URL_COMMON = ROOT_URL + "servlet/BlobDownloaderCommon?blobCode=";
      //

      //Enlever, parc qu'on n'en a pas besoin
      /*
      try {
        Properties props = new Properties();
        props.load(new FileInputStream(System.getProperty("user.dir") + File.separator + "config" + File.separator +
            "robot.properties"));
        MULTILINGUAL = props.get("MULTILINGUAL").equals("TRUE");
        GeneralLog.setLevel(Integer.parseInt(props.getProperty("ROBOT_LOG_LEVEL")));
        SessionLog.setLevel(Integer.parseInt(props.getProperty("ROBOT_LOG_LEVEL")));
        ROBOT_MIDDLE_LOG_LEVEL = Integer.parseInt(props.getProperty("ROBOT_MIDDLE_LOG_LEVEL"));
      }
      catch (Exception ex) {
        generalLog.log(GeneralLog.SEVERE, ex);
      }
      //*/
    }
    catch (Exception ex) {
      generalLog.log(GeneralLog.SEVERE, ex);
    }
  }
}
