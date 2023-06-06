import React, { useLayoutEffect } from "react";
import { useCallback, useRef } from "react";

const GraphAnimation = () => {
  const graphScore = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  const score = useRef([...graphScore]);
  const tempScore = useRef([...graphScore]);

  const graphRef = useRef<HTMLCanvasElement>(null);

  const hexagonAnimation = useCallback(() => {
    const scoreCurrent = score.current;
    const tempCurrent = tempScore.current;

    for (let i = 0; i < scoreCurrent.length; i += 1) {
      for (let j = 0; j < scoreCurrent[i].length; j += 1) {
        let scoreVal = scoreCurrent[i][j];
        const tempVal = tempCurrent[i][j];

        if (Math.abs(scoreVal - tempVal) >= 0.0001) {
          scoreVal += (tempVal - scoreVal) * 0.05;
        } else {
          tempCurrent[i] = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
        }
        scoreCurrent[i][j] = scoreVal;
      }
    }
  }, []);

  const playCanvas = () => {
    const canvasElement = graphRef.current;
    const context = canvasElement?.getContext("2d");

    if (canvasElement == null || context == null) return;

    // 초기화 변수
    const hexagonRadius = 400;
    const hexagonSide = 6;
    const hexagonAngle = (360 / hexagonSide) * (Math.PI / 180);

    const texts: Array<{
      text: string;
      align: CanvasTextAlign;
      line: CanvasTextBaseline;
    }> = [
      {
        text: "인내",
        align: "center",
        line: "middle",
      },
      {
        text: "행운",
        align: "start",
        line: "bottom",
      },
      {
        text: "건강",
        align: "start",
        line: "top",
      },
      {
        text: "지능",
        align: "center",
        line: "middle",
      },
      {
        text: "힘",
        align: "end",
        line: "top",
      },
      {
        text: "민첩",
        align: "end",
        line: "bottom",
      },
    ];

    // 캔버스 그리기
    const drawCanvas = () => {
      canvasElement.width = 1920;
      canvasElement.height = 1080;
      const hexagonPosX = canvasElement.width / 2;
      const hexagonPosY = canvasElement.height / 2;

      hexagonAnimation();

      // 선 그리기
      for (let i = 0; i < hexagonSide; i += 1) {
        context.beginPath();
        context.moveTo(hexagonPosX, hexagonPosY);

        context.lineTo(
          hexagonPosX + hexagonRadius * Math.sin(hexagonAngle * i),
          hexagonPosY + hexagonRadius * Math.cos(hexagonAngle * i)
        );
        context.strokeStyle = `#eaeaea`;
        context.lineWidth = 1;
        context.stroke();
        context.closePath();

        if (matchMedia("(min-width: 40em)").matches) {
          context.font = "2rem roboto";
        } else if (matchMedia("(min-width: 90em)").matches) {
          context.font = "1.875rem roboto";
        } else {
          context.font = "2.25rem roboto";
        }

        context.fillStyle = `#dbdbdb`;
        context.textAlign = texts[i].align;
        context.textBaseline = texts[i].line;
        context.fillText(
          texts[i].text,
          hexagonPosX + (hexagonRadius + 50) * Math.sin(hexagonAngle * i),
          hexagonPosY + (hexagonRadius + 50) * Math.cos(hexagonAngle * i)
        );
      }

      // 윤곽 그리기
      for (let i = 1; i <= 4; i += 1) {
        context.beginPath();
        context.arc(hexagonPosX, hexagonPosY, (hexagonRadius / 4) * i, 0, 2 * Math.PI);
        context.strokeStyle = `#eaeaea4c`;
        context.lineWidth = 1;
        context.stroke();
        context.closePath();
      }

      // 그리기 전 좌표 계산
      for (let k = 0; k < score.current.length; k += 1) {
        const hexagonPoints = Array.from({
          length: hexagonSide,
        }).map((_, i) => ({
          x: hexagonPosX + hexagonRadius * score.current[k][i] * Math.sin(hexagonAngle * i),
          y: hexagonPosY + hexagonRadius * score.current[k][i] * Math.cos(hexagonAngle * i),
        }));

        // 파란색 육각형 그리기
        context.beginPath();
        context.moveTo(hexagonPoints[0].x, hexagonPoints[0].y);
        for (const hexagonPoint of hexagonPoints.slice(1)) {
          context.lineTo(hexagonPoint.x, hexagonPoint.y);
        }
        context.lineTo(hexagonPoints[0].x, hexagonPoints[0].y);
        context.fillStyle = k === 0 ? `#722aee66` : `#33c4c966`;
        context.fill();
        context.strokeStyle = k === 0 ? `#722aeecb` : `#33c4c9cb`;
        context.lineWidth = 4;
        context.stroke();
        context.closePath();
      }

      requestAnimationFrame(drawCanvas);
    };
    drawCanvas();
  };

  useLayoutEffect(() => {
    playCanvas();
  }, []);

  return (
    <>
      <section style={{ backgroundColor: "black", overflow: "hidden" }}>
        <canvas width={"100%"} height={"100%"} ref={graphRef} />
      </section>
    </>
  );
};

export default GraphAnimation;
