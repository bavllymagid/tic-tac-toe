package com.bvm.tik_tak_toe.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Game {
    private String gameId;
    private Player firstPlayer;
    private Player secondPlayer;
    private int winner;
    private Player nextPlayer;
}
