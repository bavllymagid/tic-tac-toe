package com.bvm.tik_tak_toe.exceptions.exception;

public class NoSuchGameFoundException extends RuntimeException {
    public NoSuchGameFoundException(String message) {
        super(message);
    }
}
