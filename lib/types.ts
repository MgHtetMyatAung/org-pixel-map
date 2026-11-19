export const BUILDING_OFFSET_X = 6;
export const BUILDING_OFFSET_Y = 5;
export const BUILDING_WIDTH = 82;
export const BUILDING_HEIGHT = 47;

export type Direction = 'down' | 'up' | 'left' | 'right';

export type HairStyle =
  | 'short'
  | 'bob'
  | 'spiky'
  | 'ponytail'
  | 'curly'
  | 'cap'
  | 'parted';

export type AccessoryType = 'none' | 'glasses' | 'headset' | 'scarf' | 'badge';

export interface AvatarAppearance {
  skinColor: string;
  hairStyle: HairStyle;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  accessory: AccessoryType;
}

export type DepartmentId = string;

export type WorkStatus =
  | 'Deep Focus'
  | 'In Sync'
  | 'Coffee Break'
  | 'Reviewing Work'
  | 'Available';

export type DailyActivityKind =
  | 'desk'
  | 'kitchen'
  | 'meeting'
  | 'whiteboard'
  | 'stretch'
  | 'restroom'
  | 'errand';

export type PresenceStatus = 'online' | 'in-a-meeting' | 'offline';

export interface DialogueNode {
  greeting: string;
  workingOn: string;
  teamSummary: string;
  officeSecret: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: DepartmentId;
  orgGroup:
    | 'Executive'
    | 'Tech & Product'
    | 'Growth & Sales'
    | 'People & Admin'
    | 'Support & Ops';
  managerId: string | null;
  level: number; // 0 = CEO, 1 = Dept Head, 2 = Lead/IC
  status: WorkStatus;
  currentProject: string;
  skills: string[];
  locationLabel: string;
  spawnTile: { x: number; y: number };
  patrolTiles?: { x: number; y: number }[];
  facing: Direction;
  appearance: AvatarAppearance;
  dialogue: DialogueNode;
}

export interface RoomDefinition {
  id: DepartmentId;
  code: string; // Exact letter from floorplan diagram
  name: string;
  shortName: string;
  floorTheme:
    | 'parquet'
    | 'lab'
    | 'birch'
    | 'sage'
    | 'terracotta'
    | 'checker';
  accentColor: string;
  description: string;
  mission: string;
  bounds: { x: number; y: number; w: number; h: number };
  spawnPoint: { x: number; y: number };
}

export type InteractivePropType =
  | 'espresso'
  | 'servers'
  | 'kanban'
  | 'arcade'
  | 'bulletin'
  | 'trophy'
  | 'moodboard'
  | 'reception';

export interface InteractiveProp {
  id: string;
  type: InteractivePropType;
  title: string;
  subtitle: string;
  roomId: DepartmentId;
  tile: { x: number; y: number };
  details: string[];
  actionLabel: string;
  actionResult: string;
}

export interface BulletinPost {
  id: string;
  title: string;
  author: string;
  department: string;
  date: string;
  summary: string;
}

export type TileKind =
  | 'void'
  | 'wall_top'
  | 'wall_face'
  | 'wall_window'
  | 'floor_parquet'
  | 'floor_lab'
  | 'floor_birch'
  | 'floor_sage'
  | 'floor_terracotta'
  | 'floor_checker'
  | 'floor_hall'
  | 'doorway'
  | 'entrance_mat'
  | 'grass'
  | 'sidewalk'
  | 'asphalt'
  | 'road_lane'
  | 'crosswalk'
  | 'curb'
  | 'parking_bay_l'
  | 'parking_bay_r'
  | 'parking_ev'
  | 'parking_vip'
  | 'parking_ada';

export type FurnitureKind =
  | 'desk_exec'
  | 'desk_dev'
  | 'desk_design'
  | 'desk_simple'
  | 'chair'
  | 'table_round'
  | 'table_conf'
  | 'server_rack'
  | 'plant_tall'
  | 'plant_small'
  | 'bookshelf'
  | 'sofa'
  | 'espresso_bar'
  | 'arcade_cab'
  | 'whiteboard'
  | 'bulletin_board'
  | 'trophy_case'
  | 'easel'
  | 'water_cooler'
  | 'rug_exec'
  | 'rug_lounge'
  | 'toilet_stall'
  | 'sink_counter'
  | 'fridge'
  | 'desk_long'
  | 'car_sedan'
  | 'car_suv'
  | 'car_van'
  | 'ev_charger'
  | 'bike_rack'
  | 'tree_oak'
  | 'street_lamp'
  | 'bench'
  | 'parking_gate'
  | 'hq_sign'
  | 'flower_bed';

export interface FurnitureItem {
  id: string;
  kind: FurnitureKind;
  x: number; // tile x
  y: number; // tile y
  w: number; // width in tiles
  h: number; // height in tiles
  solid: boolean;
  label?: string;
  color?: string;
  facing?: Direction;
}

export interface PlayerProfile {
  name: string;
  title: string;
  appearance: AvatarAppearance;
}

export type AppView = 'world' | 'org' | 'directory' | 'bulletin' | 'avatar';
