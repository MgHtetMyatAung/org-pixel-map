import {
  AvatarAppearance,
  BUILDING_OFFSET_X,
  BUILDING_OFFSET_Y,
  DailyActivityKind,
  Direction,
  FurnitureItem,
  PresenceStatus,
  TileKind,
} from './types';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function shadeHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const nr = clamp(r * factor);
  const ng = clamp(g * factor);
  const nb = clamp(b * factor);
  return `rgb(${nr},${ng},${nb})`;
}

export function drawFloorTile(
  ctx: CanvasRenderingContext2D,
  kind: TileKind,
  tx: number,
  ty: number,
  px: number,
  py: number
) {
  const s = 16;
  switch (kind) {
    case 'floor_parquet': {
      ctx.fillStyle = '#9C6B43';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#8B5E39';
      ctx.fillRect(px, py + 7, s, 1);
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + ((ty % 2) * 8), py, 1, 7);
      ctx.fillRect(px + (((ty + 1) % 2) * 8), py + 8, 1, 7);
      ctx.fillStyle = '#AC794F';
      ctx.fillRect(px + 2, py + 2, 4, 1);
      ctx.fillRect(px + 10, py + 10, 4, 1);
      break;
    }
    case 'floor_lab': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#CBD5E1' : '#C2CEDC';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 1, py + 1, 2, 1);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 2, py + 2, 1, 1);
      ctx.fillRect(px + 13, py + 13, 1, 1);
      break;
    }
    case 'floor_birch': {
      ctx.fillStyle = '#EAD8B8';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#D9C29C';
      ctx.fillRect(px, py + 4, s, 1);
      ctx.fillRect(px, py + 12, s, 1);
      ctx.fillRect(px + ((ty % 2) * 7 + 3), py, 1, 4);
      ctx.fillRect(px + (((ty + 1) % 2) * 6 + 5), py + 5, 1, 7);
      ctx.fillStyle = '#F5E7CE';
      ctx.fillRect(px + 3, py + 7, 5, 1);
      break;
    }
    case 'floor_sage': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#BFD8C8' : '#B5D1BF';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#9EBFA9';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      ctx.fillStyle = '#CFE4D6';
      ctx.fillRect(px + 2, py + 3, 2, 1);
      ctx.fillRect(px + 10, py + 11, 2, 1);
      break;
    }
    case 'floor_terracotta': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#E4B898' : '#DDA986';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#C48D69';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      ctx.fillStyle = '#F0CAAE';
      ctx.fillRect(px + 1, py + 1, 4, 1);
      break;
    }
    case 'floor_checker': {
      const even = (tx + ty) % 2 === 0;
      ctx.fillStyle = even ? '#F5EBDC' : '#D8B78E';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = even ? '#EADBC6' : '#C7A276';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      break;
    }
    case 'floor_hall': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#D8D6CF' : '#CFCBC2';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#B8B3A8';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      ctx.fillStyle = '#E5E3DD';
      ctx.fillRect(px + 1, py + 1, 3, 1);
      break;
    }
    case 'doorway': {
      ctx.fillStyle = '#C69D6B';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#A67C4E';
      ctx.fillRect(px, py + 3, s, 1);
      ctx.fillRect(px, py + 12, s, 1);
      ctx.fillStyle = '#DFBA88';
      ctx.fillRect(px + 2, py + 6, 12, 4);
      break;
    }
    case 'entrance_mat': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 1, py + 1, 14, 1);
      ctx.fillRect(px + 1, py + 14, 14, 1);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 2, py + 3, 12, 10);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(px + 4, py + 7, 8, 2);
      break;
    }
    case 'wall_top': {
      ctx.fillStyle = '#252B3B';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#363F54';
      ctx.fillRect(px, py + 1, s, 2);
      ctx.fillStyle = '#181C28';
      ctx.fillRect(px, py + 14, s, 2);
      break;
    }
    case 'wall_face': {
      ctx.fillStyle = '#47526A';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#5A6782';
      ctx.fillRect(px, py + 1, s, 10);
      ctx.fillStyle = '#31394D';
      ctx.fillRect(px, py + 11, s, 5); // baseboard
      ctx.fillStyle = '#232938';
      ctx.fillRect(px, py + 15, s, 1);
      break;
    }
    case 'wall_window': {
      ctx.fillStyle = '#47526A';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#31394D';
      ctx.fillRect(px, py + 11, s, 5);
      // Window frame
      ctx.fillStyle = '#1E2432';
      ctx.fillRect(px + 1, py + 1, 14, 10);
      ctx.fillStyle = '#7DD3FC';
      ctx.fillRect(px + 2, py + 2, 12, 8);
      // Sky highlight
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(px + 3, py + 3, 4, 6);
      ctx.fillRect(px + 9, py + 3, 4, 3);
      // Crossbar
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 7, py + 2, 2, 8);
      ctx.fillRect(px + 2, py + 5, 12, 1);
      break;
    }
    case 'grass': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#4D8B4C' : '#468245';
      ctx.fillRect(px, py, s, s);
      // Subtle pixel grass tufts
      if ((tx * 7 + ty * 13) % 5 === 0) {
        ctx.fillStyle = '#5FA35B';
        ctx.fillRect(px + 3, py + 5, 1, 2);
        ctx.fillRect(px + 5, py + 4, 1, 3);
        ctx.fillStyle = '#3B6F3A';
        ctx.fillRect(px + 11, py + 11, 2, 1);
      } else if ((tx * 11 + ty * 5) % 7 === 0) {
        ctx.fillStyle = '#74B86E';
        ctx.fillRect(px + 10, py + 4, 2, 1);
        ctx.fillRect(px + 4, py + 12, 1, 1);
      }
      break;
    }
    case 'sidewalk': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#CBD5E1' : '#C2CCD9';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(px, py + 15, s, 1);
      ctx.fillRect(px + 15, py, 1, s);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 1, py + 1, 4, 1);
      break;
    }
    case 'curb': {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 1, py + 1, s - 2, s - 3);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px, py + 14, s, 2);
      ctx.fillRect(px + 15, py, 1, s);
      break;
    }
    case 'asphalt': {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#272E3B' : '#242A36';
      ctx.fillRect(px, py, s, s);
      if ((tx * 13 + ty * 7) % 6 === 0) {
        ctx.fillStyle = '#343D4F';
        ctx.fillRect(px + 4, py + 6, 1, 1);
        ctx.fillRect(px + 11, py + 12, 1, 1);
      }
      break;
    }
    case 'road_lane': {
      const bx = tx - BUILDING_OFFSET_X;
      const by = ty - BUILDING_OFFSET_Y;
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#242A36' : '#212732';
      ctx.fillRect(px, py, s, s);
      // Dashed yellow centerline along bx=95/96 seam
      if (bx === 95 && ((by % 2) + 2) % 2 === 0) {
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(px + 14, py + 2, 2, 11);
      }
      // Faint lane edge speckle
      if ((tx + ty * 3) % 5 === 0) {
        ctx.fillStyle = '#333C4E';
        ctx.fillRect(px + 6, py + 8, 1, 1);
      }
      break;
    }
    case 'crosswalk': {
      ctx.fillStyle = '#242A36';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 1, py + 2, 14, 4);
      ctx.fillRect(px + 1, py + 10, 14, 4);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 1, py + 5, 14, 1);
      ctx.fillRect(px + 1, py + 13, 14, 1);
      break;
    }
    case 'parking_bay_l':
    case 'parking_bay_r':
    case 'parking_ev':
    case 'parking_vip':
    case 'parking_ada': {
      const bx = tx - BUILDING_OFFSET_X;
      const by = ty - BUILDING_OFFSET_Y;
      const isAda = kind === 'parking_ada';
      const isEv = kind === 'parking_ev';
      const isVip = kind === 'parking_vip';
      ctx.fillStyle = isAda
        ? '#1E3A5F'
        : isEv
        ? '#1B3332'
        : '#272E3B';
      ctx.fillRect(px, py, s, s);

      const lineColor = isVip
        ? '#F59E0B'
        : isEv
        ? '#10B981'
        : isAda
        ? '#60A5FA'
        : '#CBD5E1';

      // Top/bottom stall dividers aligned to 3-tile high bays (by % 3 === 1 top, by % 3 === 0 bottom)
      if (by % 3 === 1) {
        ctx.fillStyle = lineColor;
        ctx.fillRect(px, py, s, 1);
      }
      if (by % 3 === 0) {
        ctx.fillStyle = lineColor;
        ctx.fillRect(px, py + 15, s, 1);
      }

      // Concrete wheel stop on curb end of bay
      if ((kind === 'parking_bay_l' || isEv || isVip || isAda) && bx === 89) {
        if (by % 3 === 2) {
          ctx.fillStyle = isVip ? '#F59E0B' : '#94A3B8';
          ctx.fillRect(px + 4, py + 1, 3, 14);
        }
      }
      if ((kind === 'parking_bay_r' || (isEv && bx === 102)) && bx === 102) {
        if (by % 3 === 2) {
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(px + 9, py + 1, 3, 14);
        }
      }

      // Crisp pixel EV / ADA / VIP floor markings on middle tiles
      if (isEv && bx === 100 && by % 3 === 2) {
        ctx.fillStyle = '#34D399';
        ctx.fillRect(px + 4, py + 4, 8, 8);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(px + 7, py + 5, 2, 3);
        ctx.fillRect(px + 6, py + 7, 4, 1);
        ctx.fillRect(px + 7, py + 8, 2, 3);
      }
      if (isAda && bx === 91 && by % 3 === 2) {
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(px + 3, py + 3, 10, 10);
        ctx.fillStyle = '#EFF6FF';
        ctx.fillRect(px + 7, py + 4, 2, 2);
        ctx.fillRect(px + 6, py + 6, 3, 3);
        ctx.fillRect(px + 5, py + 9, 5, 2);
      }
      break;
    }
    default: {
      ctx.fillStyle = '#14171F';
      ctx.fillRect(px, py, s, s);
    }
  }
}

export function drawFurniture(
  ctx: CanvasRenderingContext2D,
  item: FurnitureItem,
  tick: number
) {
  const px = item.x * 16;
  const py = item.y * 16;
  const pw = item.w * 16;
  const ph = item.h * 16;

  switch (item.kind) {
    case 'rug_exec': {
      ctx.fillStyle = '#7F1D1D';
      ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(px + 4, py + 4, pw - 8, ph - 8);
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(px + 10, py + 10, pw - 20, 1);
      ctx.fillRect(px + 10, py + ph - 11, pw - 20, 1);
      break;
    }
    case 'rug_lounge': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 5, py + 5, pw - 10, ph - 10);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 8, py + 8, pw - 16, ph - 16);
      break;
    }
    case 'desk_exec':
    case 'desk_simple':
    case 'desk_dev':
    case 'desk_design': {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 2, py + ph - 1, pw - 2, 3);
      // Desk body
      const topColor =
        item.kind === 'desk_exec'
          ? '#7C3F1D'
          : item.kind === 'desk_design'
          ? '#D4A373'
          : '#A87449';
      const frontColor =
        item.kind === 'desk_exec'
          ? '#5C2D14'
          : item.kind === 'desk_design'
          ? '#B5835A'
          : '#845732';

      ctx.fillStyle = '#1E1B18';
      ctx.fillRect(px + 1, py + 2, pw - 2, ph - 2);
      ctx.fillStyle = topColor;
      ctx.fillRect(px + 2, py + 3, pw - 4, ph - 6);
      ctx.fillStyle = frontColor;
      ctx.fillRect(px + 2, py + ph - 4, pw - 4, 3);

      // Desk items
      if (item.kind === 'desk_dev') {
        // Dual monitors with subtle glow flicker
        const glow = Math.floor(tick / 35) % 2 === 0 ? '#38BDF8' : '#7DD3FC';
        for (const ox of [4, 17]) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(px + ox, py + 1, 10, 8);
          ctx.fillStyle = glow;
          ctx.fillRect(px + ox + 1, py + 2, 8, 5);
          ctx.fillStyle = '#475569';
          ctx.fillRect(px + ox + 4, py + 9, 2, 2);
        }
        // Little coffee mug
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(px + 28, py + 6, 2, 3);
        // Golden rubber ducky on Desk 2!
        if (item.id === 'eng-desk-mat') {
          ctx.fillStyle = '#FACC15';
          ctx.fillRect(px + 14, py + 6, 2, 2);
          ctx.fillStyle = '#EA580C';
          ctx.fillRect(px + 16, py + 7, 1, 1);
        }
      } else if (item.kind === 'desk_design') {
        // Drawing tablet + stylus
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(px + 5, py + 3, 12, 8);
        ctx.fillStyle = '#F472B6';
        ctx.fillRect(px + 6, py + 4, 4, 3);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(px + 10, py + 4, 6, 3);
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(px + 6, py + 7, 10, 3);
        // Palette cup
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(px + 22, py + 5, 4, 4);
        ctx.fillStyle = '#EC4899';
        ctx.fillRect(px + 23, py + 4, 1, 2);
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(px + 25, py + 4, 1, 2);
      } else if (item.kind === 'desk_exec') {
        // Laptop + brass lamp + papers
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(px + 19, py + 3, 10, 7);
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(px + 20, py + 4, 8, 5);
        // Brass lamp
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(px + 6, py + 2, 5, 4);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(px + 7, py + 6, 3, 2);
        // Papers
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(px + 34, py + 5, 6, 5);
      } else {
        // Simple laptop desk
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(px + 10, py + 3, 10, 7);
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(px + 11, py + 4, 8, 5);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(px + 23, py + 6, 4, 4);
      }
      break;
    }
    case 'chair': {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 4, py + 3, 8, 9);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 5, py + 4, 6, 6);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 5, py + 4, 6, 2);
      break;
    }
    case 'table_round': {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 4, py + ph - 3, pw - 8, 4);
      ctx.fillStyle = '#291D16';
      ctx.fillRect(px + 4, py + 4, pw - 8, ph - 8);
      ctx.fillStyle = '#B07D4F';
      ctx.fillRect(px + 5, py + 5, pw - 10, ph - 11);
      ctx.fillStyle = '#C99667';
      ctx.fillRect(px + 7, py + 7, pw - 14, ph - 16);
      // Coffee cups on table
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(px + 10, py + 11, 3, 3);
      ctx.fillRect(px + 18, py + 15, 3, 3);
      break;
    }
    case 'table_conf': {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 3, py + ph - 2, pw - 6, 4);
      ctx.fillStyle = '#3B2314';
      ctx.fillRect(px + 2, py + 3, pw - 4, ph - 6);
      ctx.fillStyle = '#854D27';
      ctx.fillRect(px + 3, py + 4, pw - 6, ph - 9);
      ctx.fillStyle = '#9C5E35';
      ctx.fillRect(px + 5, py + 6, pw - 10, ph - 14);
      // Center notepad
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(px + 20, py + 11, 8, 6);
      break;
    }
    case 'server_rack': {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px + 2, py + ph - 1, 12, 3);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 2, py + 1, 12, ph - 2);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 3, py + 2, 10, ph - 4);
      // Rack slots + blinking LEDs
      for (let sy = 4; sy < ph - 5; sy += 5) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + 4, py + sy, 8, 3);
        const blink = (Math.floor(tick / 15) + sy + item.x) % 3 === 0;
        ctx.fillStyle = blink ? '#10B981' : '#3B82F6';
        ctx.fillRect(px + 5, py + sy + 1, 2, 1);
        ctx.fillStyle = (Math.floor(tick / 25) + sy) % 4 === 0 ? '#F59E0B' : '#0EA5E9';
        ctx.fillRect(px + 9, py + sy + 1, 2, 1);
      }
      break;
    }
    case 'plant_tall': {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 4, py + 13, 8, 3);
      // Pot
      ctx.fillStyle = '#7C2D12';
      ctx.fillRect(px + 5, py + 10, 6, 5);
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(px + 4, py + 9, 8, 2);
      // Lush leaves
      ctx.fillStyle = '#14532D';
      ctx.fillRect(px + 3, py + 3, 10, 7);
      ctx.fillStyle = '#16A34A';
      ctx.fillRect(px + 2, py + 4, 5, 4);
      ctx.fillRect(px + 9, py + 3, 5, 5);
      ctx.fillRect(px + 5, py + 1, 6, 6);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(px + 6, py + 2, 3, 2);
      ctx.fillRect(px + 3, py + 5, 2, 2);
      break;
    }
    case 'plant_small': {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(px + 4, py + 13, 8, 2);
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(px + 5, py + 10, 6, 4);
      ctx.fillStyle = '#15803D';
      ctx.fillRect(px + 4, py + 6, 8, 5);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(px + 5, py + 5, 6, 3);
      break;
    }
    case 'bookshelf': {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 1, py + ph - 1, pw - 2, 3);
      ctx.fillStyle = '#451A03';
      ctx.fillRect(px + 1, py + 1, pw - 2, ph - 2);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
      // Shelves & colorful books
      ctx.fillStyle = '#291202';
      ctx.fillRect(px + 2, py + 7, pw - 4, 2);
      ctx.fillRect(px + 2, py + 12, pw - 4, 2);
      const bookColors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#EC4899'];
      for (let bx = 3; bx < pw - 5; bx += 3) {
        ctx.fillStyle = bookColors[(bx + item.x) % bookColors.length];
        ctx.fillRect(px + bx, py + 3, 2, 4);
        ctx.fillStyle = bookColors[(bx + 2) % bookColors.length];
        ctx.fillRect(px + bx, py + 9, 2, 3);
      }
      break;
    }
    case 'sofa': {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 2, py + ph - 1, pw - 4, 3);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 1, py + 2, pw - 2, ph - 3);
      // Cushions
      ctx.fillStyle = '#0F766E';
      ctx.fillRect(px + 2, py + 3, pw - 4, 4); // backrest
      ctx.fillStyle = '#14B8A6';
      ctx.fillRect(px + 4, py + 7, pw - 8, 6); // seat
      ctx.fillStyle = '#0D9488';
      ctx.fillRect(px + 2, py + 5, 3, 9); // left arm
      ctx.fillRect(px + pw - 5, py + 5, 3, 9); // right arm
      break;
    }
    case 'espresso_bar': {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 1, py + ph - 1, pw - 2, 3);
      // Wooden café counter
      ctx.fillStyle = '#451A03';
      ctx.fillRect(px + 1, py + 2, pw - 2, ph - 2);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(px + 2, py + 3, pw - 4, 6);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(px + 2, py + 9, pw - 4, 5);
      // Espresso machine
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 6, py + 1, 12, 7);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 8, py + 4, 8, 3);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(px + 15, py + 2, 2, 1);
      // Animated steam pixels
      const steamOffset = Math.floor(tick / 18) % 3;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillRect(px + 10, py - 1 - steamOffset, 1, 2);
      ctx.fillRect(px + 13, py - 2 - ((steamOffset + 1) % 3), 1, 2);
      // Pastry dome
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(px + 28, py + 2, 10, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 30, py + 4, 6, 3);
      break;
    }
    case 'arcade_cab': {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px + 2, py + ph - 1, 12, 3);
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(px + 2, py + 1, 12, ph - 2);
      // Marquee
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(px + 3, py + 2, 10, 4);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(px + 5, py + 3, 6, 2);
      // Animated game screen
      ctx.fillStyle = '#020617';
      ctx.fillRect(px + 3, py + 7, 10, 10);
      const pixelX = 4 + (Math.floor(tick / 12) % 6);
      ctx.fillStyle = '#22D3EE';
      ctx.fillRect(px + pixelX, py + 10, 2, 2);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(px + 5, py + 14, 5, 1);
      // Joystick + buttons
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 3, py + 18, 10, 4);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(px + 5, py + 19, 2, 2);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(px + 9, py + 19, 2, 2);
      break;
    }
    case 'whiteboard': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 1, py + 1, pw - 2, ph - 3);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(px + 2, py + 2, pw - 4, ph - 5);
      // Sticky notes & diagram lines
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(px + 4, py + 4, 5, 4);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(px + 11, py + 4, 5, 4);
      ctx.fillStyle = '#34D399';
      ctx.fillRect(px + 18, py + 4, 5, 4);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(px + 26, py + 4, 5, 4);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 5, py + 10, pw - 12, 1);
      break;
    }
    case 'bulletin_board': {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(px + 1, py + 1, pw - 2, ph - 2);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
      // Pinned flyers
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(px + 4, py + 4, 7, 6);
      ctx.fillStyle = '#DBEAFE';
      ctx.fillRect(px + 13, py + 3, 6, 7);
      ctx.fillStyle = '#FCE7F3';
      ctx.fillRect(px + 21, py + 5, 7, 6);
      // Red pushpins
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(px + 7, py + 4, 1, 1);
      ctx.fillRect(px + 16, py + 3, 1, 1);
      ctx.fillRect(px + 24, py + 5, 1, 1);
      break;
    }
    case 'trophy_case': {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(px + 1, py + 1, pw - 2, ph - 2);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 3, py + 3, pw - 6, ph - 5);
      // Gold trophies
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(px + 6, py + 5, 4, 5);
      ctx.fillRect(px + 14, py + 4, 5, 6);
      ctx.fillRect(px + 22, py + 6, 4, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(px + 15, py + 5, 2, 2);
      break;
    }
    case 'easel': {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(px + 6, py + 3, 4, ph - 4);
      ctx.fillRect(px + 3, py + ph - 6, 2, 5);
      ctx.fillRect(px + 11, py + ph - 6, 2, 5);
      // Canvas
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(px + 2, py + 4, 12, 14);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(px + 4, py + 6, 4, 4);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(px + 8, py + 7, 4, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 5, py + 11, 5, 4);
      break;
    }
    case 'water_cooler': {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 4, py + 7, 8, 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(px + 5, py + 2, 6, 5);
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(px + 6, py + 3, 2, 3);
      break;
    }
    case 'toilet_stall': {
      // Partition walls
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 1, py + 1, 14, ph - 2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 2, py + 2, 12, ph - 5);
      // Porcelain tank & bowl
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(px + 5, py + 4, 6, 4);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 5, py + 8, 6, 6);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 6, py + 9, 4, 4);
      // Stall door
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 2, py + ph - 5, 12, 3);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 11, py + ph - 4, 2, 1);
      break;
    }
    case 'sink_counter': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 1, py + 2, pw - 2, ph - 3);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(px + 2, py + 3, pw - 4, ph - 6);
      // Basin & faucet
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(px + 5, py + 5, 6, 5);
      ctx.fillRect(px + pw - 11, py + 5, 6, 5);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(px + 7, py + 3, 2, 2);
      ctx.fillRect(px + pw - 9, py + 3, 2, 2);
      break;
    }
    case 'fridge': {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px + 2, py + ph - 1, 12, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 2, py + 1, 12, ph - 2);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(px + 3, py + 2, 10, ph - 4);
      // Freezer seam & handles
      ctx.fillStyle = '#64748B';
      ctx.fillRect(px + 3, py + 10, 10, 1);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 11, py + 5, 1, 4);
      ctx.fillRect(px + 11, py + 13, 1, 6);
      break;
    }
    case 'desk_long': {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 1, py + ph - 1, pw - 2, 3);
      // Continuous long studio bench
      ctx.fillStyle = '#291D16';
      ctx.fillRect(px + 1, py + 2, pw - 2, ph - 2);
      ctx.fillStyle = '#D4A373';
      ctx.fillRect(px + 2, py + 3, pw - 4, ph - 6);
      ctx.fillStyle = '#B5835A';
      ctx.fillRect(px + 2, py + ph - 4, pw - 4, 3);
      // Center cable/divider rail
      ctx.fillStyle = '#8C5E3C';
      ctx.fillRect(px + 3, py + 8, pw - 6, 1);

      // Draw crisp dual-facing monitor bays every 2 tiles (matching seats at dx=0,2,4,...)
      const glow = Math.floor(tick / 40) % 2 === 0 ? '#38BDF8' : '#7DD3FC';
      for (let tx = 0; tx < item.w; tx += 2) {
        const bx = px + tx * 16 + 3;
        // North-facing screen (for seat above)
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(bx, py + 3, 10, 4);
        ctx.fillStyle = glow;
        ctx.fillRect(bx + 1, py + 4, 8, 2);
        // South-facing screen (for seat below)
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(bx, py + 9, 10, 4);
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(bx + 1, py + 10, 8, 2);
        // Coffee mug / notebook accent
        if (tx % 4 === 0) {
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(bx + 12, py + 5, 2, 2);
        } else {
          ctx.fillStyle = '#FACC15';
          ctx.fillRect(bx + 12, py + 9, 2, 2);
        }
      }
      break;
    }
    case 'car_sedan':
    case 'car_suv':
    case 'car_van': {
      const body =
        item.color ||
        (item.kind === 'car_van'
          ? '#F8FAFC'
          : item.kind === 'car_suv'
          ? '#334155'
          : '#3B82F6');
      const bodyDark = shadeHex(body, 0.72);
      const bodyLight = shadeHex(body, 1.15);
      const facingRight = item.facing !== 'left';

      // Asphalt drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(px + 2, py + ph - 3, pw - 4, 5);

      // Four tires peeking out
      ctx.fillStyle = '#090D16';
      ctx.fillRect(px + 7, py + 2, 8, 3);
      ctx.fillRect(px + pw - 15, py + 2, 8, 3);
      ctx.fillRect(px + 7, py + ph - 5, 8, 3);
      ctx.fillRect(px + pw - 15, py + ph - 5, 8, 3);

      // Chassis outline
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 2, py + 4, pw - 4, ph - 8);

      // Main painted body
      ctx.fillStyle = body;
      ctx.fillRect(px + 3, py + 5, pw - 6, ph - 10);
      ctx.fillStyle = bodyDark;
      ctx.fillRect(px + 3, py + ph - 8, pw - 6, 3);
      ctx.fillStyle = bodyLight;
      ctx.fillRect(px + 4, py + 6, pw - 8, 2);

      if (item.kind === 'car_van') {
        // PixelHQ Delivery / Shuttle Van
        const frontX = facingRight ? px + pw - 13 : px + 4;
        const roofX = facingRight ? px + 5 : px + 14;
        // Windshield
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(frontX, py + 7, 8, ph - 14);
        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(frontX + 1, py + 8, 3, ph - 17);
        // Long cargo roof + accent stripe
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(roofX, py + 7, pw - 21, ph - 14);
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(roofX + 2, py + 11, pw - 25, 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(roofX + 2, py + 13, pw - 25, 2);
        // Roof AC unit
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(roofX + 8, py + 10, 6, 6);
      } else if (item.kind === 'car_suv') {
        const cabinX = facingRight ? px + 8 : px + 14;
        const winFrontX = facingRight ? px + pw - 17 : px + 11;
        const winBackX = facingRight ? px + 6 : px + pw - 11;
        // Windshield + rear glass
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(winFrontX, py + 7, 6, ph - 14);
        ctx.fillRect(winBackX, py + 8, 4, ph - 16);
        ctx.fillStyle = '#7DD3FC';
        ctx.fillRect(winFrontX + 1, py + 8, 3, ph - 17);
        // SUV roof + roof rack rails
        ctx.fillStyle = bodyLight;
        ctx.fillRect(cabinX, py + 7, pw - 22, ph - 14);
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(cabinX + 2, py + 8, pw - 26, 1);
        ctx.fillRect(cabinX + 2, py + ph - 9, pw - 26, 1);
      } else {
        // Sleek Sedan / Coupe
        const cabinX = facingRight ? px + 13 : px + 15;
        const winFrontX = facingRight ? px + pw - 17 : px + 11;
        const winBackX = facingRight ? px + 9 : px + pw - 14;
        // Side mirrors
        ctx.fillStyle = bodyDark;
        const mirrorX = facingRight ? px + pw - 17 : px + 14;
        ctx.fillRect(mirrorX, py + 3, 3, 2);
        ctx.fillRect(mirrorX, py + ph - 5, 3, 2);
        // Windshield + rear glass
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(winFrontX, py + 7, 6, ph - 14);
        ctx.fillRect(winBackX, py + 8, 5, ph - 16);
        ctx.fillStyle = '#7DD3FC';
        ctx.fillRect(winFrontX + 1, py + 8, 3, ph - 17);
        // Roof panel
        ctx.fillStyle = bodyLight;
        ctx.fillRect(cabinX, py + 8, 16, ph - 16);
      }

      // Headlights & Taillights
      const headX = facingRight ? px + pw - 4 : px + 2;
      const tailX = facingRight ? px + 2 : px + pw - 4;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(headX, py + 6, 2, 4);
      ctx.fillRect(headX, py + ph - 10, 2, 4);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(tailX, py + 6, 2, 4);
      ctx.fillRect(tailX, py + ph - 10, 2, 4);
      break;
    }
    case 'ev_charger': {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(px + 3, py + 13, 10, 3);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 4, py + 2, 8, 12);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 5, py + 3, 6, 10);
      // Glowing emerald EV indicator
      const evPulse = Math.floor(tick / 20) % 2 === 0;
      ctx.fillStyle = evPulse ? '#10B981' : '#34D399';
      ctx.fillRect(px + 6, py + 4, 4, 3);
      // Charging cable loop
      ctx.fillStyle = '#020617';
      ctx.fillRect(px + 12, py + 6, 2, 5);
      ctx.fillRect(px + 10, py + 10, 3, 2);
      break;
    }
    case 'bike_rack': {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 2, py + 13, pw - 4, 2);
      // Steel U-loops
      ctx.fillStyle = '#94A3B8';
      for (const bx of [4, 12, 20, 26]) {
        ctx.fillRect(px + bx, py + 5, 2, 9);
        ctx.fillRect(px + bx, py + 4, 4, 2);
      }
      // Two parked bicycles
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 5, py + 8, 4, 5);
      ctx.fillRect(px + 21, py + 8, 4, 5);
      ctx.fillStyle = '#F43F5E';
      ctx.fillRect(px + 6, py + 6, 3, 4);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(px + 22, py + 6, 3, 4);
      break;
    }
    case 'tree_oak': {
      // Ground shadow
      ctx.fillStyle = 'rgba(10, 20, 12, 0.34)';
      ctx.fillRect(px + 4, py + ph - 6, pw - 8, 6);
      // Trunk
      ctx.fillStyle = '#451A03';
      ctx.fillRect(px + 13, py + 18, 6, 11);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(px + 14, py + 18, 4, 10);
      // Layered lush foliage canopy
      ctx.fillStyle = '#14532D';
      ctx.fillRect(px + 4, py + 6, pw - 8, 16);
      ctx.fillRect(px + 2, py + 9, pw - 4, 10);
      ctx.fillStyle = '#15803D';
      ctx.fillRect(px + 5, py + 4, pw - 10, 15);
      ctx.fillRect(px + 3, py + 8, pw - 6, 9);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(px + 7, py + 5, pw - 14, 9);
      ctx.fillRect(px + 5, py + 9, 8, 6);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(px + 9, py + 6, 6, 4);
      ctx.fillRect(px + 18, py + 8, 4, 3);
      break;
    }
    case 'street_lamp': {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(px + 4, py + ph - 3, 8, 3);
      // Iron post
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 7, py + 8, 2, ph - 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 6, py + ph - 5, 4, 3);
      // Lamp head + warm glow
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 4, py + 2, 8, 6);
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(px + 5, py + 3, 6, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(px + 6, py + 4, 4, 2);
      break;
    }
    case 'bench': {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(px + 2, py + 13, pw - 4, 2);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 3, py + 5, 2, 9);
      ctx.fillRect(px + pw - 5, py + 5, 2, 9);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(px + 4, py + 5, pw - 8, 3);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(px + 4, py + 9, pw - 8, 3);
      break;
    }
    case 'parking_gate': {
      // Compact security booth (left 16px) + striped barrier arm
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px + 1, py + 13, 14, 3);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 1, py + 2, 14, 12);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 2, py + 2, 12, 3);
      ctx.fillStyle = '#7DD3FC';
      ctx.fillRect(px + 4, py + 6, 8, 5);
      // Striped barrier arm extending across lane entry (raised/semi-open look or edge)
      for (let bx = 15; bx < pw - 2; bx += 6) {
        ctx.fillStyle = (bx / 6) % 2 === 0 ? '#EF4444' : '#F8FAFC';
        ctx.fillRect(px + bx, py + 7, 4, 2);
      }
      break;
    }
    case 'hq_sign': {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(px + 2, py + 13, pw - 4, 3);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + 2, py + 2, pw - 4, 12);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 3, py + 3, pw - 6, 1);
      ctx.fillRect(px + 3, py + 12, pw - 6, 1);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 4, py + 5, pw - 8, 6);
      // Mini "HQ" pixel letters
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(px + 7, py + 6, 1, 4);
      ctx.fillRect(px + 10, py + 6, 1, 4);
      ctx.fillRect(px + 8, py + 8, 2, 1);
      ctx.fillRect(px + 14, py + 6, 4, 1);
      ctx.fillRect(px + 14, py + 9, 4, 1);
      ctx.fillRect(px + 14, py + 6, 1, 4);
      ctx.fillRect(px + 17, py + 6, 1, 4);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(px + 22, py + 7, 3, 2);
      break;
    }
    case 'flower_bed': {
      ctx.fillStyle = 'rgba(10, 20, 12, 0.24)';
      ctx.fillRect(px + 1, py + ph - 2, pw - 2, 2);
      // Timber planter border
      ctx.fillStyle = '#5C3A21';
      ctx.fillRect(px + 1, py + 4, pw - 2, ph - 5);
      ctx.fillStyle = '#15803D';
      ctx.fillRect(px + 2, py + 3, pw - 4, ph - 6);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(px + 3, py + 4, pw - 6, ph - 8);
      // Colorful blossoms
      const petals = ['#F43F5E', '#FACC15', '#F472B6', '#38BDF8'];
      for (let fx = 4; fx < pw - 5; fx += 6) {
        ctx.fillStyle = petals[(fx + item.x) % petals.length];
        ctx.fillRect(px + fx, py + 5, 2, 2);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(px + fx + 1, py + 6, 1, 1);
      }
      break;
    }
  }
}

export function drawPixelCharacter(
  ctx: CanvasRenderingContext2D,
  appearance: AvatarAppearance,
  centerX: number,
  footY: number,
  direction: Direction,
  stepPhase: number, // 0 = idle, 1..3 = walking cycle
  isSitting: boolean = false
) {
  const x = Math.round(centerX - 8);
  const bob = !isSitting && stepPhase > 0 ? (stepPhase % 2 === 1 ? -1 : 0) : 0;
  const y = Math.round(footY - 20 + bob);

  const outline = '#12151C';
  const skinShadow = shadeHex(appearance.skinColor, 0.84);
  const shirtShadow = shadeHex(appearance.shirtColor, 0.78);
  const pantsShadow = shadeHex(appearance.pantsColor, 0.78);
  const hairShadow = shadeHex(appearance.hairColor, 0.78);

  // Drop shadow on floor
  ctx.fillStyle = 'rgba(10, 12, 18, 0.34)';
  ctx.fillRect(x + 3, Math.round(footY - 2), 10, 3);

  // Legs / Shoes
  const leftLegOffset = !isSitting ? (stepPhase === 1 ? -1 : stepPhase === 3 ? 1 : 0) : 0;
  const rightLegOffset = !isSitting ? (stepPhase === 1 ? 1 : stepPhase === 3 ? -1 : 0) : 0;

  if (!isSitting) {
    // Pants
    ctx.fillStyle = outline;
    ctx.fillRect(x + 4, y + 14, 8, 5);
    ctx.fillStyle = appearance.pantsColor;
    ctx.fillRect(x + 5, y + 14 + leftLegOffset, 3, 4);
    ctx.fillRect(x + 8, y + 14 + rightLegOffset, 3, 4);
    ctx.fillStyle = pantsShadow;
    ctx.fillRect(x + 5, y + 17 + leftLegOffset, 3, 1);
    ctx.fillRect(x + 8, y + 17 + rightLegOffset, 3, 1);
    // Shoes
    ctx.fillStyle = '#1E1B18';
    ctx.fillRect(x + 5, y + 18 + leftLegOffset, 3, 2);
    ctx.fillRect(x + 8, y + 18 + rightLegOffset, 3, 2);
  }

  // Torso / Shirt
  ctx.fillStyle = outline;
  ctx.fillRect(x + 3, y + 9, 10, 6);
  ctx.fillStyle = appearance.shirtColor;
  ctx.fillRect(x + 4, y + 9, 8, 5);
  ctx.fillStyle = shirtShadow;
  ctx.fillRect(x + 4, y + 13, 8, 1);

  // Arms (gentle typing motion when seated with stepPhase > 0)
  const armSwing = isSitting
    ? stepPhase === 1
      ? -1
      : stepPhase === 3
      ? 1
      : 0
    : stepPhase === 1
    ? 1
    : stepPhase === 3
    ? -1
    : 0;
  ctx.fillStyle = appearance.shirtColor;
  ctx.fillRect(x + 2, y + 9 + (isSitting ? 0 : armSwing), 2, 4);
  ctx.fillRect(x + 12, y + 9 - (isSitting ? 0 : armSwing), 2, 4);
  ctx.fillStyle = appearance.skinColor;
  ctx.fillRect(x + 2, y + 13 + armSwing, 2, 1);
  ctx.fillRect(x + 12, y + 13 - armSwing, 2, 1);

  // Accessory on torso (scarf or badge)
  if (appearance.accessory === 'scarf') {
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(x + 4, y + 9, 8, 2);
    if (direction !== 'up') {
      ctx.fillRect(x + 9, y + 11, 2, 3);
    }
  } else if (appearance.accessory === 'badge' && direction !== 'up') {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(x + 9, y + 11, 2, 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x + 9, y + 10, 2, 1);
  }

  // Head base
  ctx.fillStyle = outline;
  ctx.fillRect(x + 3, y + 1, 10, 9);
  ctx.fillStyle = appearance.skinColor;
  ctx.fillRect(x + 4, y + 2, 8, 7);
  ctx.fillStyle = skinShadow;
  ctx.fillRect(x + 4, y + 8, 8, 1);

  // Facial features (unless facing up)
  if (direction === 'down') {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(x + 5, y + 5, 2, 2);
    ctx.fillRect(x + 9, y + 5, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 5, y + 5, 1, 1);
    ctx.fillRect(x + 9, y + 5, 1, 1);
  } else if (direction === 'left') {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(x + 5, y + 5, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 5, y + 5, 1, 1);
  } else if (direction === 'right') {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(x + 9, y + 5, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 10, y + 5, 1, 1);
  }

  // Glasses
  if (appearance.accessory === 'glasses' && direction !== 'up') {
    ctx.fillStyle = '#0F172A';
    if (direction === 'down') {
      ctx.fillRect(x + 4, y + 5, 3, 1);
      ctx.fillRect(x + 7, y + 5, 2, 1);
      ctx.fillRect(x + 9, y + 5, 3, 1);
    } else if (direction === 'left') {
      ctx.fillRect(x + 4, y + 5, 4, 1);
    } else {
      ctx.fillRect(x + 8, y + 5, 4, 1);
    }
  }

  // Hair styles
  ctx.fillStyle = appearance.hairColor;
  if (appearance.hairStyle === 'cap') {
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(x + 3, y + 0, 10, 4);
    ctx.fillStyle = '#991B1B';
    if (direction === 'left') ctx.fillRect(x + 1, y + 3, 4, 1);
    else if (direction === 'right') ctx.fillRect(x + 11, y + 3, 4, 1);
    else ctx.fillRect(x + 3, y + 3, 10, 1);
  } else {
    // Top crown hair
    ctx.fillRect(x + 3, y + 1, 10, 3);
    ctx.fillStyle = hairShadow;
    ctx.fillRect(x + 3, y + 1, 10, 1);
    ctx.fillStyle = appearance.hairColor;

    if (direction === 'up') {
      ctx.fillRect(x + 3, y + 2, 10, 6);
    } else {
      if (appearance.hairStyle === 'bob') {
        ctx.fillRect(x + 3, y + 3, 2, 5);
        ctx.fillRect(x + 11, y + 3, 2, 5);
      } else if (appearance.hairStyle === 'spiky') {
        ctx.fillRect(x + 4, y + 0, 2, 2);
        ctx.fillRect(x + 7, y - 1, 2, 3);
        ctx.fillRect(x + 10, y + 0, 2, 2);
      } else if (appearance.hairStyle === 'curly') {
        ctx.fillRect(x + 2, y + 1, 2, 5);
        ctx.fillRect(x + 12, y + 1, 2, 5);
        ctx.fillRect(x + 4, y + 0, 8, 2);
      } else if (appearance.hairStyle === 'ponytail') {
        ctx.fillRect(x + 3, y + 3, 2, 3);
        ctx.fillRect(x + 11, y + 3, 2, 3);
        if (direction === 'left') ctx.fillRect(x + 12, y + 3, 2, 5);
        else if (direction === 'right') ctx.fillRect(x + 2, y + 3, 2, 5);
      } else if (appearance.hairStyle === 'parted') {
        ctx.fillRect(x + 3, y + 3, 3, 2);
        ctx.fillRect(x + 10, y + 3, 3, 2);
      } else {
        // short
        ctx.fillRect(x + 3, y + 3, 1, 2);
        ctx.fillRect(x + 12, y + 3, 1, 2);
      }
    }
  }

  // Headset accessory
  if (appearance.accessory === 'headset') {
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(x + 2, y + 3, 2, 4);
    ctx.fillRect(x + 12, y + 3, 2, 4);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 4, y + 0, 8, 1);
  }
}

export function drawActivityBadge(
  ctx: CanvasRenderingContext2D,
  kind: DailyActivityKind,
  centerX: number,
  footY: number,
  tick: number
) {
  if (kind === 'desk') return;
  const bx = Math.round(centerX + 7);
  const by = Math.round(footY - 22 + Math.sin(tick * 0.08) * 0.6);

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(bx, by, 7, 6);
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(bx + 1, by + 1, 5, 4);

  if (kind === 'kitchen') {
    // Tiny coffee cup + brown brew
    ctx.fillStyle = '#78350F';
    ctx.fillRect(bx + 2, by + 2, 3, 2);
  } else if (kind === 'meeting') {
    // Tiny chat dots
    const activeDot = Math.floor(tick / 16) % 3;
    ctx.fillStyle = activeDot === 0 ? '#F59E0B' : '#475569';
    ctx.fillRect(bx + 2, by + 2, 1, 2);
    ctx.fillStyle = activeDot === 1 ? '#F59E0B' : '#475569';
    ctx.fillRect(bx + 4, by + 2, 1, 2);
  } else if (kind === 'whiteboard' || kind === 'errand') {
    // Tiny chart / note line
    ctx.fillStyle = '#0EA5E9';
    ctx.fillRect(bx + 2, by + 2, 3, 1);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(bx + 2, by + 3, 2, 1);
  } else {
    // Stretch / break
    ctx.fillStyle = '#10B981';
    ctx.fillRect(bx + 2, by + 2, 3, 2);
  }
}

export function drawPresenceIndicator(
  ctx: CanvasRenderingContext2D,
  status: PresenceStatus,
  centerX: number,
  footY: number,
  tick: number
) {
  const cy = Math.round(footY - 28);

  if (status === 'in-a-meeting') {
    // Crisp 9x6 amber meeting badge with alternating speech dots
    const bx = Math.round(centerX - 4);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bx, cy, 9, 6);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(bx + 1, cy + 1, 7, 4);
    const pulse = Math.floor(tick / 18) % 2;
    ctx.fillStyle = '#111827';
    ctx.fillRect(bx + 2, cy + 2, 1, 2);
    ctx.fillRect(bx + 4, cy + 2, 1, 2);
    ctx.fillStyle = pulse === 0 ? '#FEF3C7' : '#111827';
    ctx.fillRect(bx + 6, cy + 2, 1, 2);
  } else if (status === 'offline') {
    // Crisp 6x6 muted slate hollow badge (away/offline)
    const bx = Math.round(centerX - 3);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bx, cy, 6, 6);
    ctx.fillStyle = '#64748B';
    ctx.fillRect(bx + 1, cy + 1, 4, 4);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(bx + 2, cy + 2, 2, 2);
  } else {
    // Crisp 6x6 emerald green online indicator with specular pixel
    const bx = Math.round(centerX - 3);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bx, cy, 6, 6);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(bx + 1, cy + 1, 4, 4);
    ctx.fillStyle = '#6EE7B7';
    ctx.fillRect(bx + 2, cy + 2, 1, 1);
  }
}

export function drawPlayerCoffeeCup(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  footY: number,
  direction: Direction,
  stepPhase: number,
  tick: number
) {
  const bob = stepPhase > 0 && stepPhase % 2 === 1 ? -1 : 0;
  const handOffsetX =
    direction === 'left' ? -8 : direction === 'right' ? 4 : 4;
  const cupX = Math.round(centerX + handOffsetX);
  const cupY = Math.round(footY - 12 + bob);

  // Outer outline
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(cupX, cupY, 6, 6);
  // Ceramic cup body
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(cupX + 1, cupY + 1, 4, 4);
  // Warm amber coffee sleeve
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(cupX + 1, cupY + 2, 4, 2);
  // Hot espresso top
  ctx.fillStyle = '#78350F';
  ctx.fillRect(cupX + 1, cupY + 1, 4, 1);
  // Handle
  ctx.fillStyle = '#E2E8F0';
  if (direction === 'left') {
    ctx.fillRect(cupX - 1, cupY + 2, 1, 2);
  } else {
    ctx.fillRect(cupX + 5, cupY + 2, 1, 2);
  }

  // Animated rising pixel steam puffs
  const steamFrame = Math.floor(tick / 14) % 3;
  ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.fillRect(cupX + 2, cupY - 2 - steamFrame, 1, 2);
  ctx.fillRect(cupX + 4, cupY - 1 - ((steamFrame + 1) % 3), 1, 1);
}
