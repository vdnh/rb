package com.ettp.robot.common.tools;

import java.io.*;

import java.text.*;

import java.util.Date;
import java.util.Locale;
import java.util.logging.Formatter;
import java.util.logging.LogRecord;


public class LogFormatter extends Formatter {
  private final static String format = "{0,date} {0,time}";
  Date dat = new Date();
  private MessageFormat formatter;
  private Object[] args = new Object[1];

  // Line separator string.  This is the value of the line.separator
  // property at the moment that the SimpleFormatter was created.
  @SuppressWarnings("FieldMayBeFinal")
  private String lineSeparator = (String) java.security.AccessController.doPrivileged(new sun.security.action.GetPropertyAction(
        "line.separator"));

  /**
   * Format the given LogRecord.
   * @param record the log record to be formatted.
   * @return a formatted log record
   */
  @Override
  public synchronized String format(LogRecord record) {
    StringBuffer sb = new StringBuffer();

    // Minimize memory allocations here.
    dat.setTime(record.getMillis());
    args[0] = dat;

    StringBuffer text = new StringBuffer();

    if (formatter == null) {
      formatter = new MessageFormat(format, Locale.FRANCE);
    }

    formatter.format(args, text, null);
    sb.append(text);
    sb.append(" ");

    String message = formatMessage(record);
    sb.append(record.getLevel().getLocalizedName());
    sb.append(" ");

    if (record.getSourceClassName() != null) {
      sb.append(record.getSourceClassName());
    }
    else {
      sb.append(record.getLoggerName());
    }

    if (record.getSourceMethodName() != null) {
      sb.append(" ");
      sb.append(record.getSourceMethodName());
    }

    sb.append(" ");

    //sb.append(lineSeparator);
    //	String message = formatMessage(record);
    //	sb.append(record.getLevel().getLocalizedName());
    //	sb.append(": ");
    sb.append(message);
    sb.append(lineSeparator);

    if (record.getThrown() != null) {
      try {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        record.getThrown().printStackTrace(pw);
        pw.close();
        sb.append(sw.toString());
      }
      catch (Exception ex) {
      }
    }

    return sb.toString();
  }
}
