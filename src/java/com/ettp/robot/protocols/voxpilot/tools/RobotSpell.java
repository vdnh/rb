package com.ettp.robot.protocols.voxpilot.tools;

import com.ettp.robot.common.Constants;

import java.util.ArrayList;
import java.util.List;


public class RobotSpell {
  public static List spellVariable(String variable, String languageCode) {
    List letters = new ArrayList();
    char[] chars = variable.toLowerCase().toCharArray();

    for (int i = 0; i < chars.length; i++) {
      if (chars[i] == '-') {
        letters.add("tiret");
      }
      else if (chars[i] == ' ') {
        letters.add("espace");
      }
      else {
        letters.add(Constants.LETTER_ROOT + chars[i]);
      }
    }

    return letters;
  }
}
