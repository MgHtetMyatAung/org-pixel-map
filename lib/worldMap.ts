import { ROOMS } from './companyData';
import {
  BUILDING_HEIGHT,
  BUILDING_OFFSET_X,
  BUILDING_OFFSET_Y,
  BUILDING_WIDTH,
  FurnitureItem,
  RoomDefinition,
  TileKind,
} from './types';

export { BUILDING_HEIGHT, BUILDING_OFFSET_X, BUILDING_OFFSET_Y, BUILDING_WIDTH };
export const MAP_WIDTH = 116;
export const MAP_HEIGHT = 57;
export const TILE_SIZE = 16;

const RAW_FURNITURE: FurnitureItem[] = [
  // E · Entrance (x: 77..80, y: 20..28)
  { id: 'ent-kiosk', kind: 'desk_simple', x: 79, y: 20, w: 2, h: 1, solid: true },
  { id: 'ent-ch1', kind: 'chair', x: 79, y: 21, w: 1, h: 1, solid: false },
  { id: 'ent-p1', kind: 'plant_tall', x: 78, y: 27, w: 1, h: 1, solid: true },

  // R · Kitchen Room (x: 74..80, y: 36..45)
  { id: 'kit-fridge', kind: 'fridge', x: 74, y: 36, w: 1, h: 2, solid: true },
  { id: 'kit-esp', kind: 'espresso_bar', x: 76, y: 38, w: 3, h: 1, solid: true },
  { id: 'kit-arc', kind: 'arcade_cab', x: 79, y: 39, w: 1, h: 2, solid: true },
  { id: 'kit-table', kind: 'table_round', x: 75, y: 42, w: 2, h: 2, solid: true },
  { id: 'kit-cooler', kind: 'water_cooler', x: 80, y: 36, w: 1, h: 1, solid: true },
  { id: 'kit-p1', kind: 'plant_small', x: 74, y: 44, w: 1, h: 1, solid: true },

  // D · Digital Team (x: 66..80, y: 2..13) — 26 seats across 2 long studio desks
  { id: 'd-wb', kind: 'whiteboard', x: 72, y: 1, w: 3, h: 1, solid: false },
  { id: 'd-long-1', kind: 'desk_long', x: 67, y: 4, w: 13, h: 1, solid: true },
  { id: 'd-long-2', kind: 'desk_long', x: 67, y: 9, w: 13, h: 1, solid: true },
  // Long Desk 1 North Chairs (y=3, 7 seats)
  { id: 'd-ch-1', kind: 'chair', x: 67, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-2', kind: 'chair', x: 69, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-3', kind: 'chair', x: 71, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-4', kind: 'chair', x: 73, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-5', kind: 'chair', x: 75, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-6', kind: 'chair', x: 77, y: 3, w: 1, h: 1, solid: false },
  { id: 'd-ch-7', kind: 'chair', x: 79, y: 3, w: 1, h: 1, solid: false },
  // Long Desk 1 South Chairs (y=5, 7 seats)
  { id: 'd-ch-8', kind: 'chair', x: 67, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-9', kind: 'chair', x: 69, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-10', kind: 'chair', x: 71, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-11', kind: 'chair', x: 73, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-12', kind: 'chair', x: 75, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-13', kind: 'chair', x: 77, y: 5, w: 1, h: 1, solid: false },
  { id: 'd-ch-14', kind: 'chair', x: 79, y: 5, w: 1, h: 1, solid: false },
  // Long Desk 2 North Chairs (y=8, 7 seats)
  { id: 'd-ch-15', kind: 'chair', x: 67, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-16', kind: 'chair', x: 69, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-17', kind: 'chair', x: 71, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-18', kind: 'chair', x: 73, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-19', kind: 'chair', x: 75, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-20', kind: 'chair', x: 77, y: 8, w: 1, h: 1, solid: false },
  { id: 'd-ch-21', kind: 'chair', x: 79, y: 8, w: 1, h: 1, solid: false },
  // Long Desk 2 South Chairs (y=10, 5 seats)
  { id: 'd-ch-22', kind: 'chair', x: 67, y: 10, w: 1, h: 1, solid: false },
  { id: 'd-ch-23', kind: 'chair', x: 69, y: 10, w: 1, h: 1, solid: false },
  { id: 'd-ch-24', kind: 'chair', x: 71, y: 10, w: 1, h: 1, solid: false },
  { id: 'd-ch-25', kind: 'chair', x: 73, y: 10, w: 1, h: 1, solid: false },
  { id: 'd-ch-26', kind: 'chair', x: 75, y: 10, w: 1, h: 1, solid: false },
  // Studio Easel & Corner Plants
  { id: 'd-easel', kind: 'easel', x: 78, y: 10, w: 1, h: 2, solid: true },
  { id: 'd-p1', kind: 'plant_tall', x: 66, y: 2, w: 1, h: 1, solid: true },
  { id: 'd-p2', kind: 'plant_tall', x: 80, y: 2, w: 1, h: 1, solid: true },
  { id: 'd-p3', kind: 'plant_small', x: 66, y: 12, w: 1, h: 1, solid: true },
  { id: 'd-p4', kind: 'plant_small', x: 80, y: 12, w: 1, h: 1, solid: true },

  // T (Top-Left) · Toilet Female (x: 1..6, y: 2..13)
  { id: 'tm-stall1', kind: 'toilet_stall', x: 1, y: 2, w: 1, h: 2, solid: true },
  { id: 'tm-stall2', kind: 'toilet_stall', x: 2, y: 2, w: 1, h: 2, solid: true },
  { id: 'tm-sink', kind: 'sink_counter', x: 4, y: 2, w: 2, h: 1, solid: true },
  { id: 'tm-p1', kind: 'plant_small', x: 1, y: 12, w: 1, h: 1, solid: true },

  // M (Top-Left) · Meeting Room 1 (x: 8..13, y: 2..13)
  { id: 'mt-wb', kind: 'whiteboard', x: 9, y: 2, w: 3, h: 1, solid: true },
  { id: 'mt-conf', kind: 'table_conf', x: 9, y: 6, w: 3, h: 2, solid: true },
  { id: 'mt-p1', kind: 'plant_small', x: 13, y: 2, w: 1, h: 1, solid: true },

  // P · Admin Team (x: 19..22, y: 2..13) — 3 workstations
  { id: 'p-books', kind: 'bookshelf', x: 19, y: 2, w: 2, h: 1, solid: true },
  { id: 'p-desk1', kind: 'desk_simple', x: 20, y: 4, w: 2, h: 1, solid: true },
  { id: 'p-ch1', kind: 'chair', x: 20, y: 5, w: 1, h: 1, solid: false },
  { id: 'p-desk2', kind: 'desk_simple', x: 20, y: 7, w: 2, h: 1, solid: true },
  { id: 'p-ch2', kind: 'chair', x: 20, y: 8, w: 1, h: 1, solid: false },
  { id: 'p-desk3', kind: 'desk_simple', x: 20, y: 10, w: 2, h: 1, solid: true },
  { id: 'p-ch3', kind: 'chair', x: 20, y: 11, w: 1, h: 1, solid: false },

  // F · Marketing Team (x: 28..31, y: 2..13) — 3 workstations
  { id: 'f-wb', kind: 'whiteboard', x: 28, y: 1, w: 3, h: 1, solid: false },
  { id: 'f-desk1', kind: 'desk_design', x: 29, y: 4, w: 2, h: 1, solid: true },
  { id: 'f-ch1', kind: 'chair', x: 29, y: 5, w: 1, h: 1, solid: false },
  { id: 'f-desk2', kind: 'desk_design', x: 29, y: 7, w: 2, h: 1, solid: true },
  { id: 'f-ch2', kind: 'chair', x: 29, y: 8, w: 1, h: 1, solid: false },
  { id: 'f-desk3', kind: 'desk_design', x: 29, y: 10, w: 2, h: 1, solid: true },
  { id: 'f-ch3', kind: 'chair', x: 29, y: 11, w: 1, h: 1, solid: false },

  // J · Sales Team (x: 37..40, y: 2..13) — 3 workstations
  { id: 'j-books', kind: 'bookshelf', x: 38, y: 2, w: 2, h: 1, solid: true },
  { id: 'j-desk1', kind: 'desk_simple', x: 38, y: 4, w: 2, h: 1, solid: true },
  { id: 'j-ch1', kind: 'chair', x: 38, y: 5, w: 1, h: 1, solid: false },
  { id: 'j-desk2', kind: 'desk_simple', x: 38, y: 7, w: 2, h: 1, solid: true },
  { id: 'j-ch2', kind: 'chair', x: 38, y: 8, w: 1, h: 1, solid: false },
  { id: 'j-desk3', kind: 'desk_simple', x: 38, y: 10, w: 2, h: 1, solid: true },
  { id: 'j-ch3', kind: 'chair', x: 38, y: 11, w: 1, h: 1, solid: false },

  // C · Connect Team (x: 47..50, y: 2..13) — 3 workstations
  { id: 'c-p1', kind: 'plant_tall', x: 47, y: 2, w: 1, h: 1, solid: true },
  { id: 'c-desk1', kind: 'desk_dev', x: 48, y: 4, w: 2, h: 1, solid: true },
  { id: 'c-ch1', kind: 'chair', x: 48, y: 5, w: 1, h: 1, solid: false },
  { id: 'c-desk2', kind: 'desk_dev', x: 48, y: 7, w: 2, h: 1, solid: true },
  { id: 'c-ch2', kind: 'chair', x: 48, y: 8, w: 1, h: 1, solid: false },
  { id: 'c-desk3', kind: 'desk_dev', x: 48, y: 10, w: 2, h: 1, solid: true },
  { id: 'c-ch3', kind: 'chair', x: 48, y: 11, w: 1, h: 1, solid: false },

  // i · IG Team (x: 56..60, y: 2..13) — 3 workstations
  { id: 'i-srv', kind: 'server_rack', x: 56, y: 2, w: 1, h: 2, solid: true },
  { id: 'i-desk1', kind: 'desk_dev', x: 58, y: 4, w: 2, h: 1, solid: true },
  { id: 'i-ch1', kind: 'chair', x: 58, y: 5, w: 1, h: 1, solid: false },
  { id: 'i-desk2', kind: 'desk_dev', x: 58, y: 7, w: 2, h: 1, solid: true },
  { id: 'i-ch2', kind: 'chair', x: 58, y: 8, w: 1, h: 1, solid: false },
  { id: 'i-desk3', kind: 'desk_dev', x: 58, y: 10, w: 2, h: 1, solid: true },
  { id: 'i-ch3', kind: 'chair', x: 58, y: 11, w: 1, h: 1, solid: false },

  // H · HR Room (x: 19..23, y: 20..29) — 3 workstations
  { id: 'h-p1', kind: 'plant_small', x: 23, y: 20, w: 1, h: 1, solid: true },
  { id: 'h-desk1', kind: 'desk_simple', x: 21, y: 21, w: 2, h: 1, solid: true },
  { id: 'h-ch1', kind: 'chair', x: 21, y: 22, w: 1, h: 1, solid: false },
  { id: 'h-desk2', kind: 'desk_simple', x: 21, y: 24, w: 2, h: 1, solid: true },
  { id: 'h-ch2', kind: 'chair', x: 21, y: 25, w: 1, h: 1, solid: false },
  { id: 'h-desk3', kind: 'desk_simple', x: 21, y: 27, w: 2, h: 1, solid: true },
  { id: 'h-ch3', kind: 'chair', x: 21, y: 28, w: 1, h: 1, solid: false },

  // M · Meeting Room 2 (x: 25..31, y: 20..29)
  { id: 'mm1-conf', kind: 'table_conf', x: 27, y: 23, w: 3, h: 2, solid: true },
  { id: 'mm1-p1', kind: 'plant_small', x: 25, y: 20, w: 1, h: 1, solid: true },

  // M · Meeting Room 3 (x: 33..39, y: 20..29)
  { id: 'mm2-wb', kind: 'whiteboard', x: 35, y: 20, w: 3, h: 1, solid: true },
  { id: 'mm2-round', kind: 'table_round', x: 35, y: 23, w: 2, h: 2, solid: true },

  // M · Meeting Room 4 (x: 49..55, y: 20..29)
  { id: 'mm3-conf', kind: 'table_conf', x: 51, y: 23, w: 3, h: 2, solid: true },
  { id: 'mm3-p1', kind: 'plant_tall', x: 49, y: 20, w: 1, h: 1, solid: true },
  { id: 'mm3-p2', kind: 'plant_tall', x: 55, y: 20, w: 1, h: 1, solid: true },

  // M · Meeting Room 5 (x: 65..71, y: 20..29)
  { id: 'mm4-wb', kind: 'whiteboard', x: 67, y: 20, w: 3, h: 1, solid: true },
  { id: 'mm4-round', kind: 'table_round', x: 67, y: 23, w: 2, h: 2, solid: true },
  { id: 'mm4-p1', kind: 'plant_small', x: 65, y: 20, w: 1, h: 1, solid: true },

  // T (Bottom-Left) · Toilet Male (x: 1..6, y: 36..45)
  { id: 'tf-stall1', kind: 'toilet_stall', x: 1, y: 36, w: 1, h: 2, solid: true },
  { id: 'tf-stall2', kind: 'toilet_stall', x: 2, y: 36, w: 1, h: 2, solid: true },
  { id: 'tf-sink', kind: 'sink_counter', x: 4, y: 36, w: 2, h: 1, solid: true },
  { id: 'tf-p1', kind: 'plant_small', x: 1, y: 44, w: 1, h: 1, solid: true },

  // Z · CEO Room (x: 8..13, y: 36..45)
  { id: 'z-rug', kind: 'rug_exec', x: 8, y: 38, w: 5, h: 5, solid: false },
  { id: 'z-trophy', kind: 'trophy_case', x: 8, y: 36, w: 2, h: 1, solid: true },
  { id: 'z-books', kind: 'bookshelf', x: 12, y: 36, w: 2, h: 1, solid: true },
  { id: 'z-desk', kind: 'desk_exec', x: 9, y: 38, w: 3, h: 1, solid: true },
  { id: 'z-ch1', kind: 'chair', x: 10, y: 39, w: 1, h: 1, solid: false },
  { id: 'z-p1', kind: 'plant_tall', x: 8, y: 44, w: 1, h: 1, solid: true },
  { id: 'z-p2', kind: 'plant_tall', x: 13, y: 44, w: 1, h: 1, solid: true },

  // A · AO Team (x: 19..23, y: 36..45) — 3 workstations
  { id: 'a-p1', kind: 'plant_small', x: 19, y: 36, w: 1, h: 1, solid: true },
  { id: 'a-desk1', kind: 'desk_dev', x: 21, y: 37, w: 2, h: 1, solid: true },
  { id: 'a-ch1', kind: 'chair', x: 21, y: 38, w: 1, h: 1, solid: false },
  { id: 'a-desk2', kind: 'desk_dev', x: 21, y: 40, w: 2, h: 1, solid: true },
  { id: 'a-ch2', kind: 'chair', x: 21, y: 41, w: 1, h: 1, solid: false },
  { id: 'a-desk3', kind: 'desk_dev', x: 21, y: 43, w: 2, h: 1, solid: true },
  { id: 'a-ch3', kind: 'chair', x: 21, y: 44, w: 1, h: 1, solid: false },

  // O · Odoo Team (x: 29..39, y: 36..45) — 4 workstations
  { id: 'o-bull', kind: 'whiteboard', x: 30, y: 35, w: 3, h: 1, solid: false },
  { id: 'o-srv', kind: 'server_rack', x: 38, y: 36, w: 1, h: 2, solid: true },
  { id: 'o-desk1', kind: 'desk_dev', x: 30, y: 38, w: 2, h: 1, solid: true },
  { id: 'o-ch1', kind: 'chair', x: 30, y: 39, w: 1, h: 1, solid: false },
  { id: 'o-desk2', kind: 'desk_dev', x: 36, y: 38, w: 2, h: 1, solid: true },
  { id: 'o-ch2', kind: 'chair', x: 36, y: 39, w: 1, h: 1, solid: false },
  { id: 'o-desk3', kind: 'desk_dev', x: 30, y: 42, w: 2, h: 1, solid: true },
  { id: 'o-ch3', kind: 'chair', x: 30, y: 43, w: 1, h: 1, solid: false },
  { id: 'o-desk4', kind: 'desk_dev', x: 36, y: 42, w: 2, h: 1, solid: true },
  { id: 'o-ch4', kind: 'chair', x: 36, y: 43, w: 1, h: 1, solid: false },
  { id: 'o-round', kind: 'table_round', x: 33, y: 41, w: 2, h: 2, solid: true },
  { id: 'o-p1', kind: 'plant_tall', x: 29, y: 44, w: 1, h: 1, solid: true },
  { id: 'o-p2', kind: 'plant_small', x: 39, y: 44, w: 1, h: 1, solid: true },

  // S · Support Team (x: 45..49, y: 36..45) — 3 workstations
  { id: 's-p1', kind: 'plant_small', x: 45, y: 36, w: 1, h: 1, solid: true },
  { id: 's-desk1', kind: 'desk_dev', x: 47, y: 37, w: 2, h: 1, solid: true },
  { id: 's-ch1', kind: 'chair', x: 47, y: 38, w: 1, h: 1, solid: false },
  { id: 's-desk2', kind: 'desk_dev', x: 47, y: 40, w: 2, h: 1, solid: true },
  { id: 's-ch2', kind: 'chair', x: 47, y: 41, w: 1, h: 1, solid: false },
  { id: 's-desk3', kind: 'desk_dev', x: 47, y: 43, w: 2, h: 1, solid: true },
  { id: 's-ch3', kind: 'chair', x: 47, y: 44, w: 1, h: 1, solid: false },

  // X · HR Product Team (x: 55..60, y: 36..45) — 3 workstations
  { id: 'x-p1', kind: 'plant_tall', x: 55, y: 36, w: 1, h: 1, solid: true },
  { id: 'x-sofa', kind: 'sofa', x: 55, y: 42, w: 2, h: 1, solid: true },
  { id: 'x-desk1', kind: 'desk_design', x: 58, y: 37, w: 2, h: 1, solid: true },
  { id: 'x-ch1', kind: 'chair', x: 58, y: 38, w: 1, h: 1, solid: false },
  { id: 'x-desk2', kind: 'desk_design', x: 58, y: 40, w: 2, h: 1, solid: true },
  { id: 'x-ch2', kind: 'chair', x: 58, y: 41, w: 1, h: 1, solid: false },
  { id: 'x-desk3', kind: 'desk_design', x: 58, y: 43, w: 2, h: 1, solid: true },
  { id: 'x-ch3', kind: 'chair', x: 58, y: 44, w: 1, h: 1, solid: false },

  // =========================================================================
  // OUTSIDE · ENTRANCE PLAZA & CAR PARKING LOT (x: 82..107, y: 0..46)
  // =========================================================================

  // Entrance E Plaza & Sidewalk Amenities
  { id: 'ext-hq-sign', kind: 'hq_sign', x: 85, y: 20, w: 2, h: 1, solid: true },
  { id: 'ext-bike-rack', kind: 'bike_rack', x: 83, y: 17, w: 2, h: 1, solid: true },
  { id: 'ext-bench-n', kind: 'bench', x: 83, y: 21, w: 2, h: 1, solid: true },
  { id: 'ext-bench-s', kind: 'bench', x: 83, y: 27, w: 2, h: 1, solid: true },
  { id: 'ext-lamp-1', kind: 'street_lamp', x: 86, y: 19, w: 1, h: 2, solid: true },
  { id: 'ext-lamp-2', kind: 'street_lamp', x: 86, y: 27, w: 1, h: 2, solid: true },
  { id: 'ext-lamp-3', kind: 'street_lamp', x: 99, y: 20, w: 1, h: 2, solid: true },
  { id: 'ext-lamp-4', kind: 'street_lamp', x: 99, y: 26, w: 1, h: 2, solid: true },

  // North Entrance Security Gatehouse & Barrier
  { id: 'ext-gate-n', kind: 'parking_gate', x: 90, y: 2, w: 3, h: 1, solid: true },

  // Left Parking Column — North Block (x: 89..92, y: 4..18)
  {
    id: 'car-n1',
    kind: 'car_sedan',
    x: 90,
    y: 4,
    w: 3,
    h: 2,
    solid: true,
    color: '#94A3B8',
    facing: 'right',
    label: 'Silver Sedan',
  },
  // Bay N2 (y: 7..9) intentionally open Visitor spot
  {
    id: 'car-n3',
    kind: 'car_sedan',
    x: 90,
    y: 10,
    w: 3,
    h: 2,
    solid: true,
    color: '#E11D48',
    facing: 'right',
    label: 'Crimson Compact',
  },
  {
    id: 'car-n4',
    kind: 'car_suv',
    x: 90,
    y: 13,
    w: 3,
    h: 2,
    solid: true,
    color: '#1D4ED8',
    facing: 'right',
    label: 'Cobalt SUV',
  },
  { id: 'ev-post-l', kind: 'ev_charger', x: 89, y: 17, w: 1, h: 1, solid: true },
  {
    id: 'car-n5-ev',
    kind: 'car_sedan',
    x: 90,
    y: 16,
    w: 3,
    h: 2,
    solid: true,
    color: '#10B981',
    facing: 'right',
    label: 'Emerald EV Sedan',
  },

  // Left Parking Column — South Block (x: 89..92, y: 28..42)
  {
    id: 'car-s1-vip',
    kind: 'car_sedan',
    x: 90,
    y: 28,
    w: 3,
    h: 2,
    solid: true,
    color: '#F59E0B',
    facing: 'right',
    label: 'CEO Executive Coupe',
  },
  // Bay S2 (y: 31..33) open Accessible Parking Bay
  {
    id: 'car-s3',
    kind: 'car_sedan',
    x: 90,
    y: 34,
    w: 3,
    h: 2,
    solid: true,
    color: '#14B8A6',
    facing: 'right',
    label: 'Teal Hatchback',
  },
  // Bay S4 (y: 37..39) open Employee spot
  {
    id: 'car-s5',
    kind: 'car_suv',
    x: 90,
    y: 40,
    w: 3,
    h: 2,
    solid: true,
    color: '#D97706',
    facing: 'right',
    label: 'Amber SUV',
  },

  // Right Parking Column — North Block (x: 99..102, y: 4..18)
  {
    id: 'car-en1',
    kind: 'car_sedan',
    x: 99,
    y: 4,
    w: 3,
    h: 2,
    solid: true,
    color: '#0EA5E9',
    facing: 'left',
    label: 'Sky Blue Sedan',
  },
  {
    id: 'car-en2',
    kind: 'car_suv',
    x: 99,
    y: 7,
    w: 3,
    h: 2,
    solid: true,
    color: '#475569',
    facing: 'left',
    label: 'Graphite SUV',
  },
  // Bay EN3 (y: 10..12) open spot
  {
    id: 'car-en4',
    kind: 'car_sedan',
    x: 99,
    y: 13,
    w: 3,
    h: 2,
    solid: true,
    color: '#8B5CF6',
    facing: 'left',
    label: 'Violet Coupe',
  },
  { id: 'ev-post-r', kind: 'ev_charger', x: 102, y: 17, w: 1, h: 1, solid: true },
  // Bay EN5 (y: 16..18) open EV charging bay

  // Right Parking Column — South Block (x: 99..102, y: 28..42)
  {
    id: 'car-es1-van',
    kind: 'car_van',
    x: 99,
    y: 28,
    w: 3,
    h: 2,
    solid: true,
    color: '#F8FAFC',
    facing: 'left',
    label: 'PixelHQ Company Van',
  },
  // Bay ES2 (y: 31..33) open spot
  {
    id: 'car-es3',
    kind: 'car_sedan',
    x: 99,
    y: 34,
    w: 3,
    h: 2,
    solid: true,
    color: '#F43F5E',
    facing: 'left',
    label: 'Coral Sedan',
  },
  {
    id: 'car-es4',
    kind: 'car_suv',
    x: 99,
    y: 37,
    w: 3,
    h: 2,
    solid: true,
    color: '#334155',
    facing: 'left',
    label: 'Slate SUV',
  },

  // Landscaped Perimeter Shade Trees & Sidewalk Shrubs
  { id: 'tree-nw', kind: 'tree_oak', x: 83, y: 3, w: 2, h: 2, solid: true },
  { id: 'tree-w-mid1', kind: 'tree_oak', x: 83, y: 10, w: 2, h: 2, solid: true },
  { id: 'tree-w-mid2', kind: 'tree_oak', x: 83, y: 33, w: 2, h: 2, solid: true },
  { id: 'tree-sw', kind: 'tree_oak', x: 83, y: 41, w: 2, h: 2, solid: true },
  { id: 'tree-e1', kind: 'tree_oak', x: 104, y: 3, w: 2, h: 2, solid: true },
  { id: 'tree-e2', kind: 'tree_oak', x: 104, y: 12, w: 2, h: 2, solid: true },
  { id: 'tree-e3', kind: 'tree_oak', x: 104, y: 23, w: 2, h: 2, solid: true },
  { id: 'tree-e4', kind: 'tree_oak', x: 104, y: 32, w: 2, h: 2, solid: true },
  { id: 'tree-e5', kind: 'tree_oak', x: 104, y: 41, w: 2, h: 2, solid: true },
];

const PERIMETER_LAWN_FURNITURE: FurnitureItem[] = [
  // North Green Lawn (y: 0..4)
  { id: 'lawn-n-t1', kind: 'tree_oak', x: 2, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-f1', kind: 'flower_bed', x: 9, y: 3, w: 2, h: 1, solid: true },
  { id: 'lawn-n-t2', kind: 'tree_oak', x: 16, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-f2', kind: 'flower_bed', x: 24, y: 3, w: 2, h: 1, solid: true },
  { id: 'lawn-n-t3', kind: 'tree_oak', x: 32, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-f3', kind: 'flower_bed', x: 42, y: 3, w: 2, h: 1, solid: true },
  { id: 'lawn-n-t4', kind: 'tree_oak', x: 51, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-f4', kind: 'flower_bed', x: 61, y: 3, w: 2, h: 1, solid: true },
  { id: 'lawn-n-t5', kind: 'tree_oak', x: 70, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-f5', kind: 'flower_bed', x: 79, y: 3, w: 2, h: 1, solid: true },
  { id: 'lawn-n-t6', kind: 'tree_oak', x: 87, y: 1, w: 2, h: 2, solid: true },
  { id: 'lawn-n-t7', kind: 'tree_oak', x: 111, y: 1, w: 2, h: 2, solid: true },

  // West Green Lawn (x: 0..5)
  { id: 'lawn-w-t1', kind: 'tree_oak', x: 1, y: 8, w: 2, h: 2, solid: true },
  { id: 'lawn-w-f1', kind: 'flower_bed', x: 4, y: 15, w: 2, h: 1, solid: true },
  { id: 'lawn-w-t2', kind: 'tree_oak', x: 1, y: 20, w: 2, h: 2, solid: true },
  { id: 'lawn-w-b1', kind: 'bench', x: 2, y: 27, w: 2, h: 1, solid: true },
  { id: 'lawn-w-t3', kind: 'tree_oak', x: 1, y: 33, w: 2, h: 2, solid: true },
  { id: 'lawn-w-f2', kind: 'flower_bed', x: 4, y: 40, w: 2, h: 1, solid: true },
  { id: 'lawn-w-t4', kind: 'tree_oak', x: 1, y: 46, w: 2, h: 2, solid: true },

  // South Green Lawn (y: 52..56)
  { id: 'lawn-s-t1', kind: 'tree_oak', x: 3, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-f1', kind: 'flower_bed', x: 12, y: 52, w: 2, h: 1, solid: true },
  { id: 'lawn-s-t2', kind: 'tree_oak', x: 19, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-b1', kind: 'bench', x: 25, y: 54, w: 2, h: 1, solid: true },
  { id: 'lawn-s-f2', kind: 'flower_bed', x: 30, y: 52, w: 2, h: 1, solid: true },
  { id: 'lawn-s-t3', kind: 'tree_oak', x: 37, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-f3', kind: 'flower_bed', x: 47, y: 52, w: 2, h: 1, solid: true },
  { id: 'lawn-s-t4', kind: 'tree_oak', x: 55, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-b2', kind: 'bench', x: 61, y: 54, w: 2, h: 1, solid: true },
  { id: 'lawn-s-t5', kind: 'tree_oak', x: 73, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-f4', kind: 'flower_bed', x: 83, y: 52, w: 2, h: 1, solid: true },
  { id: 'lawn-s-t6', kind: 'tree_oak', x: 90, y: 54, w: 2, h: 2, solid: true },
  { id: 'lawn-s-t7', kind: 'tree_oak', x: 111, y: 53, w: 2, h: 2, solid: true },
];

export const FURNITURE: FurnitureItem[] = [
  ...RAW_FURNITURE.map((item) => ({
    ...item,
    x: item.x + BUILDING_OFFSET_X,
    y: item.y + BUILDING_OFFSET_Y,
  })),
  ...PERIMETER_LAWN_FURNITURE,
];

export interface WorldGrid {
  tiles: TileKind[][];
  solid: boolean[][];
}

function createEmptyGrid(): WorldGrid {
  const tiles: TileKind[][] = [];
  const solid: boolean[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    // Base canvas is lush green lawn surrounding the entire company building
    tiles.push(new Array<TileKind>(MAP_WIDTH).fill('grass'));
    solid.push(new Array<boolean>(MAP_WIDTH).fill(false));
  }
  return { tiles, solid };
}

function setTile(
  grid: WorldGrid,
  x: number,
  y: number,
  kind: TileKind,
  isSolid: boolean
) {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return;
  grid.tiles[y][x] = kind;
  grid.solid[y][x] = isSolid;
}

function fillFloor(
  grid: WorldGrid,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  kind: TileKind
) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      setTile(grid, x, y, kind, false);
    }
  }
}

function setBuildingTile(
  grid: WorldGrid,
  x: number,
  y: number,
  kind: TileKind,
  isSolid: boolean
) {
  setTile(grid, x + BUILDING_OFFSET_X, y + BUILDING_OFFSET_Y, kind, isSolid);
}

function fillBuildingFloor(
  grid: WorldGrid,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  kind: TileKind
) {
  fillFloor(
    grid,
    x1 + BUILDING_OFFSET_X,
    y1 + BUILDING_OFFSET_Y,
    x2 + BUILDING_OFFSET_X,
    y2 + BUILDING_OFFSET_Y,
    kind
  );
}

function drawRoomBox(
  grid: WorldGrid,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  floorKind: TileKind
) {
  fillBuildingFloor(grid, x1 + 1, y1 + 2, x2 - 1, y2 - 1, floorKind);
  for (let x = x1; x <= x2; x++) {
    setBuildingTile(grid, x, y1, 'wall_top', true);
    setBuildingTile(grid, x, y1 + 1, 'wall_face', true);
    setBuildingTile(grid, x, y2, 'wall_top', true);
  }
  for (let y = y1; y <= y2; y++) {
    setBuildingTile(grid, x1, y, 'wall_top', true);
    setBuildingTile(grid, x2, y, 'wall_top', true);
  }
}

function openTopDoor(grid: WorldGrid, yTop: number, xs: number[]) {
  for (const x of xs) {
    setBuildingTile(grid, x, yTop, 'doorway', false);
    setBuildingTile(grid, x, yTop + 1, 'doorway', false);
  }
}

function openBottomDoor(grid: WorldGrid, yBot: number, xs: number[]) {
  for (const x of xs) {
    setBuildingTile(grid, x, yBot, 'doorway', false);
  }
}

function openSideDoor(grid: WorldGrid, xWall: number, ys: number[]) {
  for (const y of ys) {
    setBuildingTile(grid, xWall, y, 'doorway', false);
  }
}

export function buildWorldGrid(): WorldGrid {
  const grid = createEmptyGrid();

  // Interior company corridor flooring inside building footprint
  fillBuildingFloor(grid, 0, 0, BUILDING_WIDTH - 1, BUILDING_HEIGHT - 1, 'floor_hall');

  // Outer building perimeter walls (0..BUILDING_WIDTH-1, 0..BUILDING_HEIGHT-1)
  for (let x = 0; x < BUILDING_WIDTH; x++) {
    setBuildingTile(grid, x, 0, 'wall_top', true);
    setBuildingTile(grid, x, BUILDING_HEIGHT - 1, 'wall_top', true);
  }
  for (let y = 0; y < BUILDING_HEIGHT; y++) {
    setBuildingTile(grid, 0, y, 'wall_top', true);
    setBuildingTile(grid, BUILDING_WIDTH - 1, y, 'wall_top', true);
  }

  // TOP ROW ROOMS (y: 0..14)
  drawRoomBox(grid, 0, 0, 7, 14, 'floor_lab'); // T (Toilet Female)
  drawRoomBox(grid, 7, 0, 14, 14, 'floor_parquet'); // M (Meeting 1)
  drawRoomBox(grid, 18, 0, 23, 14, 'floor_sage'); // P (Admin)
  drawRoomBox(grid, 27, 0, 32, 14, 'floor_birch'); // F (Marketing)
  drawRoomBox(grid, 36, 0, 41, 14, 'floor_parquet'); // J (Sales)
  drawRoomBox(grid, 46, 0, 51, 14, 'floor_sage'); // C (Connect)
  drawRoomBox(grid, 55, 0, 61, 14, 'floor_lab'); // i (IG Team)
  drawRoomBox(grid, 65, 0, 81, 14, 'floor_birch'); // D (Digital Team)

  // Top-row doorways onto Upper Promenade (y = 15..17)
  openBottomDoor(grid, 14, [3, 4]); // T
  openBottomDoor(grid, 14, [10, 11]); // M
  openBottomDoor(grid, 14, [20, 21]); // P
  openBottomDoor(grid, 14, [29, 30]); // F
  openBottomDoor(grid, 14, [38, 39]); // J
  openBottomDoor(grid, 14, [48, 49]); // C
  openBottomDoor(grid, 14, [57, 58]); // i
  openBottomDoor(grid, 14, [72, 73, 74]); // D

  // MIDDLE ROW ROOMS (y: 18..30)
  drawRoomBox(grid, 18, 18, 24, 30, 'floor_terracotta'); // H (HR Room)
  drawRoomBox(grid, 24, 18, 32, 30, 'floor_sage'); // M2
  drawRoomBox(grid, 32, 18, 40, 30, 'floor_birch'); // M3
  drawRoomBox(grid, 48, 18, 56, 30, 'floor_parquet'); // M4
  drawRoomBox(grid, 64, 18, 72, 30, 'floor_checker'); // M5

  // Middle-row doors
  openTopDoor(grid, 18, [20, 21]); // H
  openBottomDoor(grid, 30, [20, 21]);
  openTopDoor(grid, 18, [27, 28, 29]); // M2
  openBottomDoor(grid, 30, [27, 28, 29]);
  openTopDoor(grid, 18, [35, 36, 37]); // M3
  openBottomDoor(grid, 30, [35, 36, 37]);
  openTopDoor(grid, 18, [51, 52, 53]); // M4
  openBottomDoor(grid, 30, [51, 52, 53]);
  openTopDoor(grid, 18, [67, 68, 69]); // M5
  openBottomDoor(grid, 30, [67, 68, 69]);

  // E · Entrance Vestibule on Middle-Right (x: 77..81, y: 18..30)
  drawRoomBox(grid, 77, 18, 81, 30, 'floor_checker');
  fillBuildingFloor(grid, 78, 22, 80, 26, 'entrance_mat');
  openSideDoor(grid, 77, [22, 23, 24, 25, 26]);
  // East double glass exit doors (y=23..25) out to Courtyard & Car Parking Lot
  setBuildingTile(grid, 81, 22, 'wall_window', true);
  setBuildingTile(grid, 81, 26, 'wall_window', true);
  openSideDoor(grid, 81, [23, 24, 25]);

  // BOTTOM ROW ROOMS (y: 34..46)
  drawRoomBox(grid, 0, 34, 7, 46, 'floor_lab'); // T (Toilet Male)
  drawRoomBox(grid, 7, 34, 14, 46, 'floor_parquet'); // Z (CEO Room)
  drawRoomBox(grid, 18, 34, 24, 46, 'floor_lab'); // A (AO Team)
  drawRoomBox(grid, 28, 34, 40, 46, 'floor_lab'); // O (Odoo Team)
  drawRoomBox(grid, 44, 34, 50, 46, 'floor_sage'); // S (Support Team)
  drawRoomBox(grid, 54, 34, 61, 46, 'floor_terracotta'); // X (HR Product Team)
  drawRoomBox(grid, 73, 34, 81, 46, 'floor_checker'); // R (Kitchen Room)

  // Bottom-row doorways onto Lower Promenade (y = 31..33)
  openTopDoor(grid, 34, [3, 4]); // T
  openTopDoor(grid, 34, [10, 11]); // Z
  openTopDoor(grid, 34, [20, 21]); // A
  openTopDoor(grid, 34, [33, 34, 35]); // O
  openTopDoor(grid, 34, [46, 47]); // S
  openTopDoor(grid, 34, [57, 58]); // X
  openTopDoor(grid, 34, [76, 77, 78]); // R top
  openSideDoor(grid, 73, [39, 40, 41]); // R side

  // =========================================================================
  // EXTERIOR COURTYARD & CAR PARKING LOT (building-relative x: 82..103)
  // =========================================================================

  // Building East Sidewalk & Entrance Plaza
  fillBuildingFloor(grid, 82, 1, 86, BUILDING_HEIGHT - 2, 'sidewalk');
  fillBuildingFloor(grid, 82, 21, 87, 27, 'sidewalk');

  // Stone curbs framing the asphalt lot
  fillBuildingFloor(grid, 87, 2, 87, 20, 'curb');
  fillBuildingFloor(grid, 87, 28, 87, 44, 'curb');
  fillBuildingFloor(grid, 103, 2, 103, 21, 'curb');
  fillBuildingFloor(grid, 103, 27, 103, 44, 'curb');

  // Main Asphalt Parking Pad + Full North/South Driveways through the Lawn
  fillBuildingFloor(grid, 88, 2, 102, 44, 'asphalt');
  fillFloor(
    grid,
    BUILDING_OFFSET_X + 93,
    0,
    BUILDING_OFFSET_X + 98,
    MAP_HEIGHT - 1,
    'road_lane'
  );

  // Pedestrian Crosswalk Promenade connecting Entrance E across the lot
  fillBuildingFloor(grid, 87, 22, 92, 26, 'sidewalk');
  fillBuildingFloor(grid, 93, 23, 98, 25, 'crosswalk');
  fillBuildingFloor(grid, 99, 22, 103, 26, 'sidewalk');

  // Left Column Parking Stalls (bx: 89..92)
  fillBuildingFloor(grid, 89, 4, 92, 15, 'parking_bay_l');
  fillBuildingFloor(grid, 89, 16, 92, 18, 'parking_ev');
  fillBuildingFloor(grid, 89, 28, 92, 30, 'parking_vip');
  fillBuildingFloor(grid, 89, 31, 92, 33, 'parking_ada');
  fillBuildingFloor(grid, 89, 34, 92, 42, 'parking_bay_l');

  // Right Column Parking Stalls (bx: 99..102)
  fillBuildingFloor(grid, 99, 4, 102, 15, 'parking_bay_r');
  fillBuildingFloor(grid, 99, 16, 102, 18, 'parking_ev');
  fillBuildingFloor(grid, 99, 28, 102, 42, 'parking_bay_r');

  // Sunlit Windows along north walls (avoiding Toilet walls for privacy!)
  const northWinXs = [12, 21, 29, 38, 49, 58, 70, 71, 76, 77];
  for (const wx of northWinXs) {
    setBuildingTile(grid, wx, 1, 'wall_window', true);
  }
  const bottomNorthWinXs = [12, 22, 38, 48, 59, 75, 79];
  for (const wx of bottomNorthWinXs) {
    setBuildingTile(grid, wx, 35, 'wall_window', true);
  }

  // Apply solid furniture collision
  for (const item of FURNITURE) {
    if (!item.solid) continue;
    for (let dy = 0; dy < item.h; dy++) {
      for (let dx = 0; dx < item.w; dx++) {
        const tx = item.x + dx;
        const ty = item.y + dy;
        if (tx >= 0 && ty >= 0 && tx < MAP_WIDTH && ty < MAP_HEIGHT) {
          grid.solid[ty][tx] = true;
        }
      }
    }
  }

  return grid;
}

export const WORLD_GRID = buildWorldGrid();

export function isTileWalkable(x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  return !WORLD_GRID.solid[y][x];
}

export function getRoomAtTile(x: number, y: number): RoomDefinition | null {
  for (const room of ROOMS) {
    const b = room.bounds;
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
      return room;
    }
  }
  return null;
}

export function getDepartmentLabelAtTile(x: number, y: number): {
  name: string;
  id: string;
  accentColor: string;
} {
  const bx = x - BUILDING_OFFSET_X;
  const by = y - BUILDING_OFFSET_Y;

  if (bx < 0 || bx >= BUILDING_WIDTH || by < 0 || by >= BUILDING_HEIGHT) {
    if (bx >= 88 && bx <= 103 && by >= 2 && by <= 44) {
      return {
        name: 'Outside · Car Parking Lot',
        id: 'parking-lot',
        accentColor: '#38BDF8',
      };
    }
    if (bx >= BUILDING_WIDTH && bx <= 87 && by >= 1 && by <= 45) {
      return {
        name: 'Outside · HQ Courtyard',
        id: 'courtyard',
        accentColor: '#22C55E',
      };
    }
    return {
      name: 'Outside · Green Lawn',
      id: 'lawn',
      accentColor: '#4ADE80',
    };
  }

  const room = getRoomAtTile(x, y);
  if (room) {
    return { name: room.name, id: room.id, accentColor: room.accentColor };
  }
  return {
    name: 'Main Promenade & Foyer',
    id: 'corridor',
    accentColor: '#94A3B8',
  };
}

export function findPathBFS(
  start: { x: number; y: number },
  goal: { x: number; y: number },
  blockedTiles?: Set<string>
): { x: number; y: number }[] {
  const sx = Math.round(start.x);
  const sy = Math.round(start.y);
  let gx = Math.round(goal.x);
  let gy = Math.round(goal.y);

  if (!isTileWalkable(gx, gy) || blockedTiles?.has(`${gx},${gy}`)) {
    const candidates = [
      { x: gx, y: gy + 1 },
      { x: gx, y: gy - 1 },
      { x: gx - 1, y: gy },
      { x: gx + 1, y: gy },
      { x: gx + 1, y: gy + 1 },
      { x: gx - 1, y: gy + 1 },
      { x: gx + 1, y: gy - 1 },
      { x: gx - 1, y: gy - 1 },
    ];
    const open = candidates.find(
      (c) => isTileWalkable(c.x, c.y) && !blockedTiles?.has(`${c.x},${c.y}`)
    );
    if (!open) return [];
    gx = open.x;
    gy = open.y;
  }

  if (sx === gx && sy === gy) return [];

  const queue: { x: number; y: number }[] = [{ x: sx, y: sy }];
  const cameFrom = new Map<string, string | null>();
  cameFrom.set(`${sx},${sy}`, null);

  const dirs = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  let found = false;
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.x === gx && cur.y === gy) {
      found = true;
      break;
    }
    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;
      const key = `${nx},${ny}`;
      if (cameFrom.has(key)) continue;
      if (!isTileWalkable(nx, ny)) continue;
      if (blockedTiles?.has(key) && !(nx === gx && ny === gy)) continue;
      cameFrom.set(key, `${cur.x},${cur.y}`);
      queue.push({ x: nx, y: ny });
    }
  }

  if (!found) return [];

  const path: { x: number; y: number }[] = [];
  let curKey: string | null = `${gx},${gy}`;
  while (curKey && curKey !== `${sx},${sy}`) {
    const [px, py] = curKey.split(',').map(Number);
    path.push({ x: px, y: py });
    curKey = cameFrom.get(curKey) ?? null;
  }
  path.reverse();
  return path;
}
