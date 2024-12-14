package com.bvm.tic_tac_toe.exceptions.exception;

public class NoSuchGameFoundException extends RuntimeException {
    public NoSuchGameFoundException(String message) {
        super(message);
    }
}
