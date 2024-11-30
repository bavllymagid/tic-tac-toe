package com.bvm.tik_tak_toe.exceptions;

import com.bvm.tik_tak_toe.exceptions.body.Commence;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GameExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<Commence> handleInvalidMoveException(Exception e) {
        Commence commence = new Commence(e.getMessage(),
                System.currentTimeMillis(),
                HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(commence);
    }
}
