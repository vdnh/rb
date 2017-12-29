package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;

import java.util.ArrayList;
import java.util.List;


public class RobotNumbers {
  public static List amountToVoice(Long amount, String languageCode) {
    if (languageCode.equals(Constants.FRENCH)) {
      return numberToVoiceFR(amount.toString());
    }
    else if (languageCode.equals(Constants.GERMAN)) {
      return numberToVoiceDE(amount.toString());
    }
    else if (languageCode.equals(Constants.DUTCH)) {
      return numberToVoiceDE(amount.toString());
    }
    else {
      //return numberToVoiceEN(amount.toString());
      return numberToVoiceFR_1000_ttsed(amount.toString());
    }
  }

  public static List amountToVoice(long amount, String languageCode) {
    if (languageCode.equals(Constants.FRENCH)) {
      return numberToVoiceFR(Long.toString(amount));
    }
    else if (languageCode.equals(Constants.GERMAN)) {
      return numberToVoiceDE(Long.toString(amount));
    }
    else {
      //return numberToVoiceEN(Long.toString(amount));
      return numberToVoiceFR_1000_ttsed(Long.toString(amount));
    }
  }

  private static List numberToVoiceFR(String amount) {
    List messages = new ArrayList();

    try {
      amount = (new Long(amount)).toString();

      String thousands;
      String units;

      if (amount.length() < 10) {
        switch (amount.length()) {
        case 0:
          break;

        case 1:
          messages.add("000" + amount.substring(0, 1));

          break;

        case 2:
          messages.add("00" + amount.substring(0, 2));

          break;

        case 3:

          if (!amount.substring(0, 1).equals("1")) {
            messages.add("000" + amount.substring(0, 1));
          }

          messages.add("0100");

          if (!amount.substring(1, 3).equals("00")) {
            messages.add("00" + amount.substring(1, 3));
          }

          break;

        case 4:

          if (!amount.substring(0, 1).equals("1")) {
            messages.add("000" + amount.substring(0, 1));
          }

          messages.add("1000");

          units = amount.substring(1, 4);

          if (!units.equals("000")) {
            //messages.add("0" + units);
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;

        case 5:
          messages.add("00" + amount.substring(0, 2));
          messages.add("1000");

          units = amount.substring(2, 5);

          if (!units.equals("000")) {
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;

        case 6:

          if (!amount.substring(0, 1).equals("1")) {
            messages.add("000" + amount.substring(0, 1));
          }

          messages.add("0100");
          messages.add("00" + amount.substring(1, 3));
          messages.add("1000");

          units = amount.substring(3, 6);

          if (!units.equals("000")) {
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;

        case 7:
          messages.add("000" + amount.substring(0, 1));
          messages.add("1000000");

          thousands = amount.substring(1, 4);

          if (!thousands.equals("000")) {
            if (!thousands.substring(0, 1).equals("0")) {
              if (!thousands.substring(0, 1).equals("1")) {
                messages.add("000" + thousands.substring(0, 1));
              }

              messages.add("0100");
            }

            messages.add("00" + thousands.substring(1, 3));
            messages.add("1000");
          }

          units = amount.substring(4, 7);

          if (!units.equals("000")) {
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;

        case 8:
          messages.add("00" + amount.substring(0, 2));
          messages.add("1000000");

          thousands = amount.substring(2, 5);

          if (!thousands.equals("000")) {
            if (!thousands.substring(0, 1).equals("0")) {
              if (!thousands.substring(0, 1).equals("1")) {
                messages.add("000" + thousands.substring(0, 1));
              }

              messages.add("0100");
            }

            messages.add("00" + thousands.substring(1, 3));
            messages.add("1000");
          }

          units = amount.substring(5, 8);

          if (!units.equals("000")) {
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;

        case 9:

          if (!amount.substring(0, 1).equals("1")) {
            messages.add("000" + amount.substring(0, 1));
          }

          messages.add("0100");
          messages.add("00" + amount.substring(1, 3));
          messages.add("1000000");

          thousands = amount.substring(3, 6);

          if (!thousands.equals("000")) {
            if (!thousands.substring(0, 1).equals("0")) {
              if (!thousands.substring(0, 1).equals("1")) {
                messages.add("000" + thousands.substring(0, 1));
              }

              messages.add("0100");
            }

            messages.add("00" + thousands.substring(1, 3));
            messages.add("1000");
          }

          units = amount.substring(6, 9);

          if (!units.equals("000")) {
            if (!units.substring(0, 1).equals("0")) {
              if (!units.substring(0, 1).equals("1")) {
                messages.add("000" + units.substring(0, 1));
              }

              messages.add("0100");
            }

            if (!units.substring(1, 3).equals("00")) {
              messages.add("00" + units.substring(1, 3));
            }
          }

          break;
        }
      }
      else {
        messages = digitsToVoice(amount, null);
      }
    }
    catch (NumberFormatException nfex) {
      //sessionLog.log(SessionLog.SEVERE, nfex);
      messages.add("0000");
    }

    return messages;
  }

  private static List numberToVoiceFR_1000_ttsed(String amount) {
    List messages = new ArrayList();

    try {
      amount = (new Long(amount)).toString();

      String thousands;
      String units;

      if (amount.length() < 10) {
        switch (amount.length()) {
        case 0:
          break;

        case 1:
          messages.add("000" + amount.substring(0, 1));

          break;

        case 2:
          messages.add("00" + amount.substring(0, 2));

          break;

        case 3:
          messages.add("0" + amount.substring(0, 3));

          break;

        case 4:

          if (!amount.substring(0, 1).equals("1")) {
            messages.add("000" + amount.substring(0, 1));
          }

          messages.add("1000");

          units = amount.substring(1, 4);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;

        case 5:
          messages.add("00" + amount.substring(0, 2));
          messages.add("1000");

          units = amount.substring(2, 5);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;

        case 6:
          messages.add("0" + amount.substring(0, 3));
          messages.add("1000");

          units = amount.substring(3, 6);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;

        case 7:
          messages.add("000" + amount.substring(0, 1));
          messages.add("1000000");

          thousands = amount.substring(1, 4);

          if (!thousands.equals("000")) {
            if (!thousands.equals("001")) {
              messages.add("0" + thousands);
            }

            messages.add("1000");
          }

          units = amount.substring(4, 7);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;

        case 8:
          messages.add("00" + amount.substring(0, 2));
          messages.add("1000000");

          thousands = amount.substring(2, 5);

          if (!thousands.equals("000")) {
            messages.add("0" + thousands);
            messages.add("1000");
          }

          units = amount.substring(5, 8);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;

        case 9:
          messages.add("0" + amount.substring(0, 3));
          messages.add("1000000");

          thousands = amount.substring(3, 6);

          if (!thousands.equals("000")) {
            messages.add("0" + thousands);
            messages.add("1000");
          }

          units = amount.substring(6, 9);

          if (!units.equals("000")) {
            messages.add("0" + units);
          }

          break;
        }
      }
      else {
        messages = digitsToVoice(amount, null);
      }
    }
    catch (NumberFormatException nfex) {
      //sessionLog.log(SessionLog.SEVERE, nfex);
      messages.add("0000");
    }

    return messages;
  }

  private static List numberToVoiceFR_recorded(String amount) {
    List messages = new ArrayList();

    if (amount.length() < 8) {
      int[] power = new int[amount.length()];

      for (int i = 0; i < power.length; i++) {
        power[power.length - (i + 1)] = i;
      }

      /*for (int i = 0; i < power.length; i++) {
        Log.log(Log.FINEST, "powers : " + power[i]);
      }*/
      int i = 0;

      //int j = 0;
      boolean thousand = false;
      boolean dec = false;
      boolean speak = true;
      String prefix = null;

      for (i = 0; i < power.length; i++) {
        speak = true;
        prefix = " ";

        if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0) || dec || (power.length == 1)) {
          if (power[i] == 6) {
            prefix = new String("600");
          }
          else if ((power[i] == 5) || (power[i] == 2)) {
            prefix = new String("200");

            if (power[i] == 5) {
              thousand = true;
            }
          }
          else if ((power[i] == 4) || (power[i] == 1)) {
            if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0) ||
                (String.valueOf(amount.charAt(i)).compareToIgnoreCase("7") == 0) ||
                (String.valueOf(amount.charAt(i)).compareToIgnoreCase("9") == 0)) {
              dec = true;
            }

            if (String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") != 0) {
              prefix = new String("100");
            }
            else {
              speak = false;
            }

            if (power[i] == 4) {
              thousand = true;
            }
          }
          else if ((power[i] == 3) || (power[i] == 0)) {
            if (dec) {
              prefix = new String("001");
              dec = false;
            }
            else {
              if (messages.size() > 0) {
                String previous = (String) messages.get(messages.size() - 1);

                if ((previous.indexOf("100") >= 0) && String.valueOf(amount.charAt(i)).equals("1")) {
                  messages.add("and");
                }
              }

              prefix = new String("000");
            }

            if (power[i] == 3) {
              thousand = true;
            }
          }

          if (speak) {
            String sufix = null;

            if (dec) {
              int precDec = Integer.parseInt(String.valueOf(amount.charAt(i))) - 1;
              sufix = String.valueOf(precDec);
            }
            else {
              sufix = String.valueOf(amount.charAt(i));
            }

            String voix = prefix.concat(sufix);

            messages.add(voix);
          }
        }

        if ((power[i] == 3) && thousand) {
          if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0) && (i == 0)) {
            messages.remove(messages.size() - 1);
          }

          messages.add("3001");
        }
      }

      /*for (i = 0; i < messages.size(); i++) {
        Log.log(Log.FINEST, "\tNumber messages" + messages.get(i));
      }*/
    }
    else {
      messages = digitsToVoice(amount, null);
    }

    return messages;
  }

  private static List numberToVoiceEN(String amount) {
    List messages = new ArrayList();

    if (amount.length() < 8) {
      int[] power = new int[amount.length()];

      for (int i = 0; i < power.length; i++) {
        power[power.length - (i + 1)] = i;
      }

      boolean dec = false;
      boolean thousand = false;

      for (int i = 0; i < power.length; i++) {
        if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0) || dec || thousand || (power.length == 1)) {
          switch (power[i]) {
          case 6:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("6001");

            break;

          case 5:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("2001");
            thousand = true;

            break;

          case 4:

            if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0)) {
              dec = true;
            }
            else {
              messages.add("100" + String.valueOf(amount.charAt(i)));
            }

            thousand = true;

            break;

          case 3:

            if (dec) {
              messages.add("001" + String.valueOf(amount.charAt(i)));
              dec = false;
            }
            else {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add("000" + String.valueOf(amount.charAt(i)));
              }
            }

            messages.add("3001");
            thousand = false;

            break;

          case 2:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("2001");

            break;

          case 1:

            if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0)) {
              dec = true;
            }
            else {
              messages.add("100" + String.valueOf(amount.charAt(i)));
            }

            break;

          case 0:

            if (dec) {
              messages.add("001" + String.valueOf(amount.charAt(i)));
              dec = false;
            }
            else {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add("000" + String.valueOf(amount.charAt(i)));
              }
              else if (power.length == 1) {
                messages.add("0000");
              }
            }

            break;
          }
        }
      }

      /*for (int j = 0; j < messages.size(); j++) {
        Log.log(Log.FINEST, messages.get(j).toString());
      }*/
    }
    else {
      messages = digitsToVoice(amount, null);
    }

    return messages;
  }

  private static List numberToVoiceDE(String amount) {
    List messages = new ArrayList();

    if (amount.length() < 8) {
      int[] power = new int[amount.length()];

      for (int i = 0; i < power.length; i++) {
        power[power.length - (i + 1)] = i;
      }

      boolean dec = false;
      boolean decUnd = false;
      boolean thousand = false;

      for (int i = 0; i < power.length; i++) {
        if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0) || dec || thousand || decUnd ||
            (power.length == 1)) {
          switch (power[i]) {
          case 6:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("6001");

            break;

          case 5:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("2001");
            thousand = true;

            break;

          case 4:

            if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0)) {
              dec = true;
            }
            else {
              messages.add("100" + String.valueOf(amount.charAt(i)));
              decUnd = true;
            }

            thousand = true;

            break;

          case 3:

            if (dec) {
              messages.add("001" + String.valueOf(amount.charAt(i)));
              dec = false;
            }
            else if (decUnd) {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add(messages.size() - 1, "000" + String.valueOf(amount.charAt(i)));
                messages.add(messages.size() - 1, "and");
              }

              decUnd = false;
            }
            else {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add("000" + String.valueOf(amount.charAt(i)));
              }
            }

            messages.add("3001");
            thousand = false;

            break;

          case 2:
            messages.add("000" + String.valueOf(amount.charAt(i)));
            messages.add("2001");

            break;

          case 1:

            if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("1") == 0)) {
              dec = true;
            }
            else {
              messages.add("100" + String.valueOf(amount.charAt(i)));
              decUnd = true;
            }

            break;

          case 0:

            if (dec) {
              messages.add("001" + String.valueOf(amount.charAt(i)));
              dec = false;
            }
            else if (decUnd) {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add(messages.size() - 1, "000" + String.valueOf(amount.charAt(i)));
                messages.add(messages.size() - 1, "and");
              }

              decUnd = false;
            }
            else {
              if ((String.valueOf(amount.charAt(i)).compareToIgnoreCase("0") != 0)) {
                messages.add("000" + String.valueOf(amount.charAt(i)));
              }
              else if (power.length == 1) {
                messages.add("0000");
              }
            }

            break;
          }
        }
      }

      /*for (int j = 0; j < messages.size(); j++) {
        Log.log(Log.FINEST, messages.get(j).toString());
      }*/
    }
    else {
      messages = digitsToVoice(amount, null);
    }

    return messages;
  }

  public static List digitsToVoice(String amount, String format) {
    List messages = new ArrayList();

    if (format == null) {
      for (int i = 0; i < amount.length(); i++) {
        messages.add("000" + amount.charAt(i));
      }
    }
    else {
      if (amount.length() > 0) {
        int size = 0;

        for (int i = 0; i < format.length(); i++) {
          size += Integer.parseInt(format.substring(i, i + 1));
        }

        int zerosToAdd = size - amount.length();

        for (int i = 0; i < zerosToAdd; i++) {
          amount = "0" + amount;
        }

        int processed = 0;

        for (int i = 0; i < format.length(); i++) {
          int mask = Integer.parseInt(format.substring(i, i + 1));
          String group = amount.substring(processed, processed + mask);

          boolean lastZero = false;

          for (int j = 0; (j < mask) && !lastZero; j++) {
            if (group.charAt(0) == '0') {
              messages.add("0000");
              group = group.substring(1, group.length());
            }
            else {
              lastZero = true;
            }
          }

          if (group.length() > 0) {
            List nums = numberToVoiceFR(group);

            for (int j = 0; j < nums.size(); j++) {
              messages.add(nums.get(j));
            }
          }

          processed += mask;
        }
      }
    }

    return messages;
  }

  public static List eurosToVoice(String amount, String languageCode) {
    List messages = new ArrayList();
    List eurosMes = new ArrayList();

    //try {
    long euros = 0;

    /* enlever en temps provisoire - hung
    if (amount.length() > 2) {
      euros = Long.parseLong(amount.substring(0, amount.length() - 2));
      System.out.println("Euros : " + euros);
    }
    //*/
    //remplace par
    euros = Long.parseLong(amount);
    // fin

    eurosMes = amountToVoice(euros, languageCode);

    int begin = amount.length() - 2;

    if (begin < 0) {
      begin = 0;
    }

    long cents = 0;// enlever en temps provisoire - hung  Long.parseLong(amount.substring(begin, amount.length()));
    System.out.println("Cents : " + cents);

    List centsMes = new ArrayList();

    if (cents > 0) {
      centsMes = amountToVoice(cents, languageCode);
    }

    for (int i = 0; i < eurosMes.size(); i++) {
      messages.add(eurosMes.get(i));
    }

    if (eurosMes.size() > 0) {
      messages.add("euro");
    }

    for (int i = 0; i < centsMes.size(); i++) {
      messages.add(centsMes.get(i));
    }

    if ((centsMes.size() > 0) && (eurosMes.size() == 0)) {
      messages.add("cents");
    }

    /*}
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }*/
    return messages;
  }

  public static List telToVoice(String amount) {
    List messages = new ArrayList();

    if (amount.charAt(0) == '0') {
      amount = amount.substring(1, amount.length());
    }

    if (amount.length() == 9) {
      messages.add("0000");
      messages.add("000" + amount.charAt(0));

      for (int i = 1; i < amount.length(); i += 2) {
        if (amount.charAt(i) == '0') {
          messages.add("0000");
          messages.add("000" + amount.substring(i + 1, i + 2));
        }
        else {
          messages.add("00" + amount.substring(i, i + 2));
        }
      }
    }
    else {
      int pair = 0;

      if ((amount.length() % 2) == 1) {
        pair = 1;
      }

      for (int i = 0; i < (amount.length() - pair); i += 2) {
        if (amount.charAt(i) == '0') {
          messages.add("0000");
          messages.add("000" + amount.substring(i + 1, i + 2));
        }
        else {
          messages.add("00" + amount.substring(i, i + 2));
        }
      }

      if (pair == 1) {
        messages.add("000" + amount.charAt(amount.length() - 1));
      }
    }

    return messages;
  }
}
