package com.bvm.tik_tak_toe.dto;

import com.bvm.tik_tak_toe.model.Board;
import com.bvm.tik_tak_toe.model.Game;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Session {
    private Game game;
    private Board board;
}
