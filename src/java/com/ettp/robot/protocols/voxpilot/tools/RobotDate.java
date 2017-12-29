package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;

import java.util.ArrayList;
import java.util.List;


public class RobotDate {
  public static List dateToVoice(String variable, String format, String languageCode) {
    if (format.indexOf(Constants.MMRR) >= 0) {
      return mmrrToVoice(variable, format, languageCode);
    }

    if (format.indexOf(Constants.DDMM) >= 0) {
      return ddmmToVoice(variable, format, languageCode);
    }

    if (format.indexOf(Constants.HHMM) >= 0) {
      return hhmmToVoice(variable, format, languageCode);
    }

    return RobotNumbers.digitsToVoice(variable, null);
  }

  public static List ddmmToVoice(String variable, String format, String languageCode) {
    long day = Long.parseLong(variable.substring(0, 2));
    List date = RobotNumbers.amountToVoice(day, languageCode);
    date.add("m" + variable.substring(2, 4));

    return date;
  }

  public static List mmrrToVoice(String variable, String format, String languageCode) {
    long year = 2000 + Long.parseLong(variable.substring(2, variable.length()));
    List date = RobotNumbers.amountToVoice(year, languageCode);
    date.add(0, "m" + variable.substring(0, 2));

    return date;
  }

  public static List hhmmToVoice(String variable, String format, String languageCode) {
    if (languageCode.equals("FR")) {
      String hour = variable.substring(0, 2);
      String minutes = variable.substring(2, variable.length());
      List date = new ArrayList();
      date.add("h" + hour);

      if (!minutes.equals("00")) {
        date.add("00" + minutes);
      }

      return date;
    }

    else if (languageCode.equals("FR_recorded")) {
      long hour = Long.parseLong(variable.substring(0, 2));
      long minutes = Long.parseLong(variable.substring(2, variable.length()));
      List date = RobotNumbers.amountToVoice(hour, languageCode);
      date.add("hour");

      if (minutes > 0) {
        List tmp = RobotNumbers.amountToVoice(minutes, languageCode);

        for (int i = 0; i < tmp.size(); i++) {
          date.add(tmp.get(i));
        }
      }

      return date;
    }
    else {
      long hour = Long.parseLong(variable.substring(0, 2));
      long minutes = Long.parseLong(variable.substring(2, variable.length()));
      List date = RobotNumbers.amountToVoice(hour, languageCode);

      if (minutes > 0) {
        List tmp = RobotNumbers.amountToVoice(minutes, languageCode);

        for (int i = 0; i < tmp.size(); i++) {
          date.add(tmp.get(i));
        }
      }

      return date;
    }
  }
}
