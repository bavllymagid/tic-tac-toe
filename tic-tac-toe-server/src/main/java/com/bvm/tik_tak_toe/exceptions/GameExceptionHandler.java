package com.bvm.tik_tak_toe.exceptions;

import com.bvm.tik_tak_toe.exceptions.body.Commence;
import com.bvm.tik_tak_toe.exceptions.exception.NoSuchGameFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GameExceptionHandler {
    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public ResponseEntity<Commence> handleInvalidMoveException(Exception e) {
        Commence commence = new Commence(e.getMessage(),
                System.currentTimeMillis(),
                HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(commence);
    }

    @ExceptionHandler
    public ResponseEntity<Commence> handleNoSuchGameFoundException(NoSuchGameFoundException e) {
        Commence commence = new Commence(e.getMessage(),
                System.currentTimeMillis(),
                HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(commence);
    }
}
