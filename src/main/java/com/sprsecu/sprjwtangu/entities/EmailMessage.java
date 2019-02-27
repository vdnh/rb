package com.sprsecu.sprjwtangu.entities;

import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
//@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class EmailMessage {
    private String titre;
    private String content;
}
