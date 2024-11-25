package com.bvm.tik_tak_toe.controllers;

import com.bvm.tik_tak_toe.dto.Session;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {
    @MessageMapping("/game")
    @SendTo("/topic/game")
    public Session processMove(Session session) {
        return new Session(session.getGame(), session.getBoard());
    }

    @MessageMapping("/game/create")
    @SendTo("/topic/game")
    public Session createGame(Session session) {
        return new Session(session.getGame(), session.getBoard());
    }

    @MessageMapping("/game/join")
    @SendTo("/topic/game")
    public Session joinGame(Session session) {
        return new Session(session.getGame(), session.getBoard());
    }
}
