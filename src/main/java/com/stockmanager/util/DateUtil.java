package com.stockmanager.util;

import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class DateUtil {

    public Date parseDate(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            String formattedDate = dateFormat.format(date);
            return dateFormat.parse(formattedDate);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
