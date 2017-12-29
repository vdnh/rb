package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;

import com.ettp.ejb.robot.dialogManager.DialogInputInfos;

import java.util.List;


public class VxmlGrammar {
  //grammaire bidon pour pouvoir interompre un prompt sans input
  //static String grammarHeader = "";
  static String grammarFooter = "";
  static StringBuffer rootRules = new StringBuffer("");
  static StringBuffer digitRules = new StringBuffer("");
  static String rootGrammarHeader = "<rule id=\"root\" scope=\"public\">\n<one-of>\n";
  static String rootGrammarFooter = "</one-of>\n</rule>\n";
  static String mode = "dtmf";
  static String xmlLang = "xml:lang=\"" + Constants.FRENCH_NUANCE + "\"";

  private static void init(String language) {
    grammarFooter = "</grammar>\n";
    rootRules = new StringBuffer("");
    digitRules = new StringBuffer("");
    mode = "dtmf";

    if (language.equals(Constants.ENGLISH)) {
      xmlLang = "xml:lang=\"" + Constants.ENGLISH_NUANCE + "\"";
    }
  }

  public static String getGrammar(SessionLog sessionLog, List dialogInputs, String[] items, String language) {
    init(language);

    for (int i = 0; i < dialogInputs.size(); i++) {
      String inputType = ((DialogInputInfos) dialogInputs.get(i)).getInputType();

      if (inputType.indexOf(Constants.DTMFMASK) == 0) {
        int[] minMax = parseDtmfMask(inputType);
        addDigitsGrammar(i);

        if (inputType.charAt(inputType.length() - 1) == '*') {
          //addDigitRootRule(minMax[0], minMax[1], i, "dtmf-star");
          addDigitRootRule(minMax[0], minMax[1], i, "*");
        }
        //them vao de xu ly # giong nhu *, 6/9/2007
        if (inputType.charAt(inputType.length() - 1) == '#') {
          //addDigitRootRule(minMax[0], minMax[1], i, "dtmf-star");
          addDigitRootRule(minMax[0], minMax[1], i, "#");
        }
        // ket thuc 6/9/2007
        else {
          //addDigitRootRule(minMax[0], minMax[1], i, "dtmf-pound");
        //addDigitRootRule(minMax[0], minMax[1], i, "#"); //tam thoi déactivé, 6/9/2007
          addDigitRootRule(minMax[0], minMax[1], i, " ");//thay the cho ligne tren
        }
      }
      else if (inputType.indexOf(Constants.DTMF) == 0) {
        addSimpleRootRule(inputType);
      }
      else if (inputType.indexOf(Constants.DTMF_LIST) == 0) {
        if (items != null) {
          for (int j = 0; j < items.length; j++) {
            addSimpleRootRule(Constants.DTMF + items[j]);
          }
        }
      }
      else if (!inputType.equals(Constants.TIME_OUT)) {
        sessionLog.log(SessionLog.FINEST, "\tEntering voice mode because : " + inputType);
        mode = "voice";
        addSimpleVocalRootRule(inputType);
      }
    }

    //header
    //StringBuffer grammar = new StringBuffer(
    //    "<grammar type=\"application/grammar+xml\" root=\"root\" version=\"1.0\" mode=\"");
    StringBuffer grammar = new StringBuffer("<grammar root=\"root\" mode=\"");
    grammar.append(mode);
    grammar.append("\" ");

    if (Constants.MULTILINGUAL) {
      grammar.append(xmlLang);
    }

    grammar.append(">\n");

    /*<grammar xmlns="http://www.w3.org/2001/06/grammar"
    xmlns:nuance="http://voicexml.nuance.com/grammar"
    xml:lang="en" version="1.0" mode="voice"
    tag-format="Nuance" root="dial">*/
    //grammar.append("\" version=\"1.0\">");
    //end header
    grammar.append(digitRules);
    grammar.append(rootGrammarHeader);
    grammar.append(rootRules);
    grammar.append(rootGrammarFooter);
    grammar.append(grammarFooter);

    return grammar.toString();
  }

  public static String getGrammar(SessionLog sessionLog, String[] items, String language) {
    init(language);

    for (int i = 0; i < items.length; i++) {
      addSimpleRootRule(Constants.DTMF + items[i]);
    }

    //header
    StringBuffer grammar = new StringBuffer(
        "<grammar type=\"application/grammar+xml\" root=\"root\" version=\"1.0\" mode=\"");
    grammar.append(mode);
    grammar.append("\" ");

    if (Constants.MULTILINGUAL) {
      grammar.append(xmlLang);
    }

    grammar.append(">\n");
    grammar.append(digitRules);
    grammar.append(rootGrammarHeader);
    grammar.append(rootRules);
    grammar.append(rootGrammarFooter);
    grammar.append(grammarFooter);

    return grammar.toString();
  }

  private static void addSimpleRootRule(String mask) {
    mask = mask.substring(Constants.DTMF.length(), mask.length());
    rootRules.append("<item> ");

    for (int i = 0; i < mask.length(); i++) {
      //rootRules.append(mask.charAt(i));
      if (mask.charAt(i) == '#') {
        rootRules.append("#");

        //rootRules.append("dtmf-pound");
      }
      else if (mask.charAt(i) == '*') {
        rootRules.append("*");

        //rootRules.append("dtmf-star");
      }
      else {
        rootRules.append("dtmf-" + mask.charAt(i));
      }

      rootRules.append(" ");
    }

    rootRules.append("</item>\n");
  }

  private static void addSimpleVocalRootRule(String mask) {
    rootRules.append("<item> ");
    rootRules.append(mask);
    rootRules.append(" </item>\n");
  }

  private static void addDigitRootRule(int min, int max, int id, String termDtmf) {
   ///* 
    rootRules.append("<item>\n");
    rootRules.append("<item repeat=\"");
    rootRules.append(min);
    rootRules.append("-");
    rootRules.append(max);
    
    //rootRules.append("\">");//<ruleref uri=\"#digit");//bo sau khi phuc hoi
    rootRules.append("\"><ruleref uri=\"#digit");
    rootRules.append(id);
    //rootRules.append("</item>\n");//bo sau khi phuc hoi
    rootRules.append("\"/></item>\n");
    rootRules.append(termDtmf);
    rootRules.append("\n");

    //rootRules.append("#\n");
    rootRules.append("</item>\n");
    //**/
  }

  private static int[] parseDtmfMask(String mask) {
    mask = mask.substring(Constants.DTMFMASK.length(), mask.length());

    int[] minMax = new int[2];
    int opt = Integer.parseInt(mask.substring(1, 3));
    int oblig = Integer.parseInt(mask.substring(4, 6));
    minMax[0] = oblig;
    minMax[1] = oblig + opt;

    return minMax;
  }

  private static void addDigitsGrammar(int id) {
    StringBuffer grammar = new StringBuffer("<rule id=\"digit");
    grammar.append(id);
    grammar.append("\">\n");
    grammar.append("<one-of>\n");

    /*grammar.append("<item> 0 </item>\n");
    grammar.append("<item> 1 </item>\n");
    grammar.append("<item> 2 </item>\n");
    grammar.append("<item> 3 </item>\n");
    grammar.append("<item> 4 </item>\n");
    grammar.append("<item> 5 </item>\n");
    grammar.append("<item> 6 </item>\n");
    grammar.append("<item> 7 </item>\n");
    grammar.append("<item> 8 </item>\n");
    grammar.append("<item> 9 </item>\n");*/
    grammar.append("<item> dtmf-0 </item>\n");
    grammar.append("<item> dtmf-1 </item>\n");
    grammar.append("<item> dtmf-2 </item>\n");
    grammar.append("<item> dtmf-3 </item>\n");
    grammar.append("<item> dtmf-4 </item>\n");
    grammar.append("<item> dtmf-5 </item>\n");
    grammar.append("<item> dtmf-6 </item>\n");
    grammar.append("<item> dtmf-7 </item>\n");
    grammar.append("<item> dtmf-8 </item>\n");
    grammar.append("<item> dtmf-9 </item>\n");
    grammar.append("</one-of>\n");
    grammar.append("</rule>\n");
    digitRules.append(grammar);
  }
}
