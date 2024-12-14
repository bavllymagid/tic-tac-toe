package com.bvm.tic_tac_toe.exceptions.body;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Commence {
    private String message;
    private Long timestamp;
    private int status;
}
