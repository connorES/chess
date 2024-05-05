import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white-200">
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex">
            {row.map((square, colIndex) => {
              const squareRep = (String.fromCharCode(97 + (colIndex % 8)) +
                "" +
                (8 - rowIndex)) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRep);
                    } else {
                      // setTo(square?.square ?? null);
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            move: {
                              from,
                              to: squareRep,
                            },
                          },
                        })
                      );

                      setFrom(null);

                      chess.move({
                        from,
                        to: squareRep,
                      });
                      setBoard(chess.board());
                    }
                  }}
                  key={colIndex}
                  className={`w-16 h-16 ${
                    (rowIndex + colIndex) % 2 == 0 ? "bg-green-500" : "bg-slate-600"
                  }`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        <img
                          className="w-8 h-10"
                          src={`/${
                            square.color === "b"
                              ? square.type
                              : `${square.type.toUpperCase()} copy`
                          }.png`}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
