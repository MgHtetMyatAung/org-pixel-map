'use client';

import React, { useEffect, useRef } from 'react';
import { drawPixelCharacter } from '@/lib/pixelSprites';
import { AvatarAppearance, Direction } from '@/lib/types';

interface PixelPortraitProps {
  appearance: AvatarAppearance;
  size?: number;
  direction?: Direction;
  animateWalk?: boolean;
  bgColor?: string;
  className?: string;
}

export default function PixelPortrait({
  appearance,
  size = 48,
  direction = 'down',
  animateWalk = false,
  bgColor = '#1E2430',
  className = '',
}: PixelPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let timer: number | undefined;

    const render = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 24, 24);
      const stepPhase = animateWalk ? (frame % 4) : 0;
      drawPixelCharacter(ctx, appearance, 12, 22, direction, stepPhase, false);
    };

    render();

    if (animateWalk) {
      timer = window.setInterval(() => {
        frame = (frame + 1) % 4;
        render();
      }, 220);
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [appearance, direction, animateWalk, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      width={24}
      height={24}
      style={{ width: size, height: size }}
      className={`pixelated shrink-0 border border-[#343C4F] bg-[#1E2430] ${className}`}
    />
  );
}
