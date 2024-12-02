package com.bvm.tik_tak_toe.configuration.handlers;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class GameWebSocketHandler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        session.sendMessage(new TextMessage("Hello, " + message.getPayload() + "!"));
        System.out.println("Message received: " + message.getPayload());
    }
}
