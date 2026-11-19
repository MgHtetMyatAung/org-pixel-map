'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Car,
  Coffee,
  Compass,
  LocateFixed,
  MapPin,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  EMPLOYEES,
  INTERACTIVE_PROPS,
  ROOMS,
} from '@/lib/companyData';
import {
  drawActivityBadge,
  drawFloorTile,
  drawFurniture,
  drawPixelCharacter,
  drawPlayerCoffeeCup,
  drawPresenceIndicator,
} from '@/lib/pixelSprites';
import { soundEngine } from '@/lib/sound';
import {
  DailyActivityKind,
  Direction,
  Employee,
  InteractiveProp,
  PlayerProfile,
  PresenceStatus,
} from '@/lib/types';
import {
  BUILDING_HEIGHT,
  BUILDING_OFFSET_X,
  BUILDING_OFFSET_Y,
  BUILDING_WIDTH,
  findPathBFS,
  FURNITURE,
  getDepartmentLabelAtTile,
  getRoomAtTile,
  isTileWalkable,
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  WORLD_GRID,
} from '@/lib/worldMap';
import PixelPortrait from './PixelPortrait';

interface OfficeWorldProps {
  playerProfile: PlayerProfile;
  targetEmployeeId: string | null;
  onClearTargetEmployee: () => void;
  onOpenOrgChartForEmployee: (employeeId: string) => void;
}

type NpcRoutineState =
  | 'at_desk'
  | 'walking_to_activity'
  | 'doing_activity'
  | 'returning_to_desk';

interface ActivitySpot {
  id: string;
  kind: DailyActivityKind;
  x: number;
  y: number;
  facing: Direction;
  label: string;
  rooms?: string[];
  groups?: Employee['orgGroup'][];
}

interface NpcRuntime {
  employee: Employee;
  x: number;
  y: number;
  facing: Direction;
  state: NpcRoutineState;
  presence: PresenceStatus;
  activityKind: DailyActivityKind;
  activityLabel: string;
  activityFacing: Direction;
  activitySpotId: string | null;
  targetTile: { x: number; y: number } | null;
  path: { x: number; y: number }[];
  timer: number;
  stepTimer: number;
  stepPhase: number;
  typingTimer: number;
  isTyping: boolean;
}

interface NpcLiveInfo {
  activity: string;
  kind: DailyActivityKind;
  presence: PresenceStatus;
  roomId: string;
}

const CHAIR_TILES = new Set(
  FURNITURE.filter((f) => f.kind === 'chair').map((f) => `${f.x},${f.y}`)
);

const ENTRANCE_START = {
  x: 78 + BUILDING_OFFSET_X,
  y: 24 + BUILDING_OFFSET_Y,
};
const PARKING_SPOT = {
  x: 94 + BUILDING_OFFSET_X,
  y: 24 + BUILDING_OFFSET_Y,
};

const RAW_ACTIVITY_SPOTS: ActivitySpot[] = [
  // Kitchen Room (R)
  {
    id: 'kit-esp-1',
    kind: 'kitchen',
    x: 76,
    y: 39,
    facing: 'up',
    label: 'Brewing espresso in Kitchen R',
  },
  {
    id: 'kit-esp-2',
    kind: 'kitchen',
    x: 77,
    y: 39,
    facing: 'up',
    label: 'Making an oat latte in Kitchen R',
  },
  {
    id: 'kit-fridge',
    kind: 'kitchen',
    x: 75,
    y: 37,
    facing: 'left',
    label: 'Grabbing a cold drink from Kitchen fridge',
  },
  {
    id: 'kit-cooler',
    kind: 'kitchen',
    x: 79,
    y: 36,
    facing: 'right',
    label: 'Refilling water in Kitchen R',
  },
  {
    id: 'kit-tbl-1',
    kind: 'kitchen',
    x: 74,
    y: 42,
    facing: 'right',
    label: 'Taking a snack break in Kitchen R',
  },
  {
    id: 'kit-tbl-2',
    kind: 'kitchen',
    x: 77,
    y: 42,
    facing: 'left',
    label: 'Chatting over coffee in Kitchen R',
  },
  {
    id: 'kit-arcade',
    kind: 'errand',
    x: 78,
    y: 40,
    facing: 'right',
    label: 'Playing a quick round at Kitchen Arcade',
  },

  // Meeting Rooms (M1..M5)
  {
    id: 'm1-a',
    kind: 'meeting',
    x: 8,
    y: 6,
    facing: 'right',
    label: 'In a quick sync in Meeting Room 1',
  },
  {
    id: 'm1-b',
    kind: 'meeting',
    x: 12,
    y: 6,
    facing: 'left',
    label: 'Planning cadence in Meeting Room 1',
  },
  {
    id: 'm2-a',
    kind: 'meeting',
    x: 26,
    y: 23,
    facing: 'right',
    label: 'In a huddle in Meeting Room 2',
  },
  {
    id: 'm2-b',
    kind: 'meeting',
    x: 30,
    y: 23,
    facing: 'left',
    label: 'Syncing with teammates in Meeting Room 2',
  },
  {
    id: 'm3-a',
    kind: 'meeting',
    x: 34,
    y: 23,
    facing: 'right',
    label: 'Reviewing work in Meeting Room 3',
  },
  {
    id: 'm3-b',
    kind: 'meeting',
    x: 37,
    y: 23,
    facing: 'left',
    label: 'Design & product sync in Meeting Room 3',
  },
  {
    id: 'm4-a',
    kind: 'meeting',
    x: 50,
    y: 23,
    facing: 'right',
    label: 'Client prep call in Meeting Room 4',
  },
  {
    id: 'm4-b',
    kind: 'meeting',
    x: 54,
    y: 23,
    facing: 'left',
    label: 'Technical review in Meeting Room 4',
  },
  {
    id: 'm5-a',
    kind: 'meeting',
    x: 66,
    y: 23,
    facing: 'right',
    label: 'Quick briefing in Meeting Room 5',
  },
  {
    id: 'm5-b',
    kind: 'meeting',
    x: 69,
    y: 23,
    facing: 'left',
    label: 'Standup sync in Meeting Room 5',
  },

  // Team Boards, Server Racks, Easel, Bookshelves, Lounge
  {
    id: 'wb-digital',
    kind: 'whiteboard',
    x: 73,
    y: 2,
    facing: 'up',
    label: 'Reviewing Digital sprint whiteboard',
    rooms: ['room-d', 'room-i'],
  },
  {
    id: 'easel-digital',
    kind: 'whiteboard',
    x: 77,
    y: 11,
    facing: 'right',
    label: 'Inspecting Digital UI easel',
    rooms: ['room-d', 'room-f'],
  },
  {
    id: 'srv-ig',
    kind: 'whiteboard',
    x: 57,
    y: 3,
    facing: 'left',
    label: 'Checking IG server cluster LEDs',
    rooms: ['room-i', 'room-d', 'room-c'],
  },
  {
    id: 'wb-odoo',
    kind: 'whiteboard',
    x: 31,
    y: 36,
    facing: 'up',
    label: 'Reviewing Odoo sprint board',
    rooms: ['room-o', 'room-a', 'room-s'],
  },
  {
    id: 'tbl-odoo-1',
    kind: 'meeting',
    x: 32,
    y: 41,
    facing: 'right',
    label: 'Quick ERP huddle at Odoo table',
    rooms: ['room-o', 'room-c', 'room-s'],
  },
  {
    id: 'wb-mkt',
    kind: 'whiteboard',
    x: 29,
    y: 2,
    facing: 'up',
    label: 'Updating Marketing campaign board',
    rooms: ['room-f', 'room-j'],
  },
  {
    id: 'books-sales',
    kind: 'whiteboard',
    x: 37,
    y: 3,
    facing: 'right',
    label: 'Grabbing playbooks from Sales shelf',
    rooms: ['room-j', 'room-f'],
  },
  {
    id: 'books-admin',
    kind: 'whiteboard',
    x: 19,
    y: 3,
    facing: 'up',
    label: 'Checking Admin binders & schedules',
    rooms: ['room-p', 'room-h'],
  },
  {
    id: 'sofa-hrp',
    kind: 'stretch',
    x: 55,
    y: 41,
    facing: 'down',
    label: 'Reading specs by HR Product lounge',
    rooms: ['room-x', 'room-h', 'room-s'],
  },
  {
    id: 'ceo-trophy',
    kind: 'whiteboard',
    x: 9,
    y: 37,
    facing: 'up',
    label: 'Checking CEO Heritage Trophy Case',
    rooms: ['room-z'],
  },
  {
    id: 'ent-log',
    kind: 'errand',
    x: 78,
    y: 23,
    facing: 'right',
    label: 'Checking Entrance E visitor log',
  },
  {
    id: 'ext-plaza-check',
    kind: 'errand',
    x: 84,
    y: 24,
    facing: 'right',
    label: 'Checking delivery outside Entrance E',
  },

  // Restrooms (T)
  {
    id: 'wc-female',
    kind: 'restroom',
    x: 4,
    y: 3,
    facing: 'up',
    label: 'Freshening up in Restroom T',
  },
  {
    id: 'wc-male',
    kind: 'restroom',
    x: 4,
    y: 37,
    facing: 'up',
    label: 'Washing hands in Restroom T',
  },
];

const ACTIVITY_SPOTS: ActivitySpot[] = RAW_ACTIVITY_SPOTS.map((spot) => ({
  ...spot,
  x: spot.x + BUILDING_OFFSET_X,
  y: spot.y + BUILDING_OFFSET_Y,
}));

function getDefaultDeskLabel(emp: Employee): string {
  if (emp.departmentId === 'entrance') return 'Welcoming guests at Entrance E';
  if (emp.departmentId === 'room-r') return 'Prepping espresso bar in Kitchen R';
  if (emp.departmentId === 'room-m-top') return 'Coordinating schedules in Meeting 1';
  if (emp.orgGroup === 'Tech & Product') return 'Coding & building at workstation';
  if (emp.orgGroup === 'Growth & Sales') return 'Working on campaigns & pipeline';
  if (emp.orgGroup === 'People & Admin') return 'Managing people & office ops';
  return 'Working at workstation';
}

function derivePresenceStatus(
  state: NpcRoutineState,
  kind: DailyActivityKind,
  spotId: string | null
): PresenceStatus {
  if (state === 'at_desk') return 'online';
  if (state === 'returning_to_desk') {
    if (
      kind === 'kitchen' ||
      kind === 'restroom' ||
      kind === 'stretch' ||
      spotId === 'kit-arcade'
    ) {
      return 'offline';
    }
    return 'online';
  }
  if (kind === 'meeting') return 'in-a-meeting';
  if (
    kind === 'kitchen' ||
    kind === 'restroom' ||
    kind === 'stretch' ||
    spotId === 'kit-arcade'
  ) {
    return 'offline';
  }
  return 'online';
}

function formatPresenceLabel(presence: PresenceStatus): string {
  if (presence === 'in-a-meeting') return 'In a Meeting';
  if (presence === 'offline') return 'Offline';
  return 'Online';
}

type DialogueTab = 'greeting' | 'workingOn' | 'teamSummary' | 'officeSecret';

export default function OfficeWorld({
  playerProfile,
  targetEmployeeId,
  onClearTargetEmployee,
  onOpenOrgChartForEmployee,
}: OfficeWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState<number>(3);
  const [muted, setMuted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isFreePan, setIsFreePan] = useState<boolean>(false);
  const [isDraggingMap, setIsDraggingMap] = useState<boolean>(false);
  const [playerEnergy, setPlayerEnergy] = useState<number>(75);
  const [coffeeBoostLeft, setCoffeeBoostLeft] = useState<number>(0);
  const [currentRoomInfo, setCurrentRoomInfo] = useState(() =>
    getDepartmentLabelAtTile(ENTRANCE_START.x, ENTRANCE_START.y)
  );
  const [nearbyTarget, setNearbyTarget] = useState<
    | { kind: 'employee'; data: Employee }
    | { kind: 'prop'; data: InteractiveProp }
    | null
  >(null);

  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [dialogueTab, setDialogueTab] = useState<DialogueTab>('greeting');
  const [activeProp, setActiveProp] = useState<InteractiveProp | null>(null);
  const [propActionMsg, setPropActionMsg] = useState<string | null>(null);
  const [liveNpcInfo, setLiveNpcInfo] = useState<Record<string, NpcLiveInfo>>(() => {
    const initial: Record<string, NpcLiveInfo> = {};
    for (const emp of EMPLOYEES) {
      initial[emp.id] = {
        activity: getDefaultDeskLabel(emp),
        kind: 'desk',
        presence: 'online',
        roomId: emp.departmentId,
      };
    }
    return initial;
  });

  // Mutable simulation state inside refs for crisp 60fps loop without React re-renders
  const keysRef = useRef<Set<string>>(new Set());
  const energyRef = useRef<number>(75);
  const coffeeTimerRef = useRef<number>(0);
  const energyToastRef = useRef<{ text: string; ttl: number } | null>(null);
  const playerRef = useRef({
    x: ENTRANCE_START.x,
    y: ENTRANCE_START.y,
    facing: 'left' as Direction,
    stepTimer: 0,
    stepPhase: 0,
    path: [] as { x: number; y: number }[],
    pendingInteract: null as
      | { kind: 'employee'; data: Employee }
      | { kind: 'prop'; data: InteractiveProp }
      | null,
  });
  const cameraRef = useRef({
    x: ENTRANCE_START.x * TILE_SIZE,
    y: ENTRANCE_START.y * TILE_SIZE,
  });
  const cameraModeRef = useRef<'follow' | 'pan'>('follow');
  const dragStateRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    wasDragged: false,
  });
  const suppressClickRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const clickMarkerRef = useRef<{ x: number; y: number; ttl: number } | null>(
    null
  );
  const npcsRef = useRef<NpcRuntime[]>(
    EMPLOYEES.map((emp, idx) => ({
      employee: emp,
      x: emp.spawnTile.x,
      y: emp.spawnTile.y,
      facing: emp.facing,
      state: 'at_desk',
      presence: 'online',
      activityKind: 'desk',
      activityLabel: getDefaultDeskLabel(emp),
      activityFacing: emp.facing,
      activitySpotId: null,
      targetTile: null,
      path: [],
      // Stagger initial break timers so Online, In a Meeting & Offline appear right away
      timer: idx < 10 ? 0.15 + idx * 0.25 : 1.0 + ((idx * 1.7) % 22),
      stepTimer: 0,
      stepPhase: 0,
      typingTimer: 0.25 + (idx % 5) * 0.12,
      isTyping: idx % 4 !== 0,
    }))
  );
  const activeEmployeeIdRef = useRef<string | null>(null);
  const activeDialogOpenRef = useRef(false);
  useEffect(() => {
    activeDialogOpenRef.current = Boolean(activeEmployee || activeProp);
    activeEmployeeIdRef.current = activeEmployee?.id ?? null;
  }, [activeEmployee, activeProp]);

  const openEmployeeDialogue = useCallback((emp: Employee) => {
    setActiveProp(null);
    setPropActionMsg(null);
    setActiveEmployee(emp);
    setDialogueTab('greeting');
    soundEngine.playTalkOpen();

    // Face the player and pause briefly while chatting
    const npc = npcsRef.current.find((n) => n.employee.id === emp.id);
    if (npc) {
      const dx = playerRef.current.x - npc.x;
      const dy = playerRef.current.y - npc.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        npc.facing = dx > 0 ? 'right' : 'left';
      } else {
        npc.facing = dy > 0 ? 'down' : 'up';
      }
      npc.stepPhase = 0;
      if (npc.state === 'at_desk' || npc.state === 'doing_activity') {
        npc.timer = Math.max(npc.timer, 5);
      }
    }
  }, []);

  const openPropModal = useCallback((prop: InteractiveProp) => {
    setActiveEmployee(null);
    setActiveProp(prop);
    setPropActionMsg(null);
    soundEngine.playTalkOpen();
  }, []);

  const walkToTarget = useCallback(
    (
      goalTile: { x: number; y: number },
      pendingInteract:
        | { kind: 'employee'; data: Employee }
        | { kind: 'prop'; data: InteractiveProp }
        | null = null
    ) => {
      const blocked = new Set<string>();
      for (const npc of npcsRef.current) {
        blocked.add(`${Math.round(npc.x)},${Math.round(npc.y)}`);
      }
      const path = findPathBFS(
        { x: playerRef.current.x, y: playerRef.current.y },
        goalTile,
        blocked
      );
      if (path.length > 0) {
        playerRef.current.path = path;
        playerRef.current.pendingInteract = pendingInteract;
        clickMarkerRef.current = {
          x: path[path.length - 1].x,
          y: path[path.length - 1].y,
          ttl: 0.75,
        };
      } else if (pendingInteract) {
        // Already adjacent
        if (pendingInteract.kind === 'employee') {
          openEmployeeDialogue(pendingInteract.data);
        } else {
          openPropModal(pendingInteract.data);
        }
      }
    },
    [openEmployeeDialogue, openPropModal]
  );

  const recenterOnPlayer = useCallback(() => {
    cameraModeRef.current = 'follow';
    setIsFreePan(false);
  }, []);

  const teleportToTile = useCallback(
    (x: number, y: number, facing: Direction = 'down') => {
      playerRef.current.x = x;
      playerRef.current.y = y;
      playerRef.current.path = [];
      playerRef.current.pendingInteract = null;
      playerRef.current.facing = facing;
      cameraModeRef.current = 'follow';
      setIsFreePan(false);
      setActiveEmployee(null);
      setActiveProp(null);
      setCurrentRoomInfo(getDepartmentLabelAtTile(x, y));
      soundEngine.playRoomChime();
    },
    []
  );

  const triggerKitchenCoffeeBoost = useCallback(() => {
    const prev = energyRef.current;
    const next = Math.min(100, Math.round(prev + 25));
    const gained = Math.max(0, next - Math.round(prev));
    energyRef.current = next;
    coffeeTimerRef.current = 12;
    energyToastRef.current = {
      text: gained > 0 ? `+${gained} ENERGY` : 'COFFEE REFILL',
      ttl: 1.8,
    };
    setPlayerEnergy(next);
    setCoffeeBoostLeft(12);
    soundEngine.playActionSuccess();
  }, []);

  const teleportToRoom = useCallback(
    (roomId: string) => {
      const room = ROOMS.find((r) => r.id === roomId);
      if (!room) return;
      teleportToTile(
        room.spawnPoint.x,
        room.spawnPoint.y,
        room.id === 'entrance' ? 'left' : 'up'
      );
      if (room.id === 'room-r') {
        triggerKitchenCoffeeBoost();
      }
    },
    [teleportToTile, triggerKitchenCoffeeBoost]
  );

  // Handle cross-view jump ("Visit Desk" from Org Chart or Directory)
  useEffect(() => {
    if (!targetEmployeeId) return;
    const npc = npcsRef.current.find(
      (n) => n.employee.id === targetEmployeeId
    );
    if (npc) {
      const liveRoom =
        getRoomAtTile(Math.round(npc.x), Math.round(npc.y)) ||
        ROOMS.find((r) => r.id === npc.employee.departmentId);
      if (liveRoom) {
        playerRef.current.x = liveRoom.spawnPoint.x;
        playerRef.current.y = liveRoom.spawnPoint.y;
        playerRef.current.path = [];
        setCurrentRoomInfo(
          getDepartmentLabelAtTile(liveRoom.spawnPoint.x, liveRoom.spawnPoint.y)
        );
      }
      walkToTarget(
        { x: Math.round(npc.x), y: Math.round(npc.y) },
        { kind: 'employee', data: npc.employee }
      );
    }
    onClearTargetEmployee();
  }, [targetEmployeeId, onClearTargetEmployee, walkToTarget]);

  const handleInteract = useCallback(() => {
    if (activeEmployee || activeProp) {
      setActiveEmployee(null);
      setActiveProp(null);
      return;
    }
    if (!nearbyTarget) return;
    if (nearbyTarget.kind === 'employee') {
      openEmployeeDialogue(nearbyTarget.data);
    } else {
      openPropModal(nearbyTarget.data);
    }
  }, [
    activeEmployee,
    activeProp,
    nearbyTarget,
    openEmployeeDialogue,
    openPropModal,
  ]);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        setActiveEmployee(null);
        setActiveProp(null);
        return;
      }
      if (key === 'e' || key === ' ') {
        e.preventDefault();
        handleInteract();
        return;
      }
      if (
        ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(
          key
        )
      ) {
        e.preventDefault();
        keysRef.current.add(key);
        // Cancel auto-path and resume camera follow if player takes manual control
        playerRef.current.path = [];
        playerRef.current.pendingInteract = null;
        if (cameraModeRef.current !== 'follow') {
          cameraModeRef.current = 'follow';
          setIsFreePan(false);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleInteract]);

  // Canvas resize observer
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [sidebarOpen]);

  // Main 60FPS Simulation + Render Loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let frameTick = 0;
    let soundCooldown = 0;
    let lastRoomId = '';
    let lastNearbyKey = '';

    let liveSyncTimer = 0;

    const pickDailyActivityForNpc = (npc: NpcRuntime) => {
      const emp = npc.employee;
      const reservedSpots = new Set<string>();
      for (const other of npcsRef.current) {
        if (other.employee.id !== emp.id && other.activitySpotId) {
          reservedSpots.add(other.activitySpotId);
        }
      }

      // Build candidate spots: room/team favorites + general office spots + local stretch
      const roomObj = ROOMS.find((r) => r.id === emp.departmentId);
      const candidates = ACTIVITY_SPOTS.filter((spot) => {
        if (reservedSpots.has(spot.id)) return false;
        if (!isTileWalkable(spot.x, spot.y)) return false;
        if (spot.rooms && !spot.rooms.includes(emp.departmentId)) {
          return Math.random() < 0.15;
        }
        return true;
      });

      // Add a local stretch spot in their own room (or promenade) as fallback/variety
      const localSpots: ActivitySpot[] = [];
      if (roomObj) {
        const stretchX = roomObj.spawnPoint.x;
        const stretchY = roomObj.spawnPoint.y;
        if (
          isTileWalkable(stretchX, stretchY) &&
          (stretchX !== emp.spawnTile.x || stretchY !== emp.spawnTile.y)
        ) {
          localSpots.push({
            id: `stretch-${emp.id}`,
            kind: 'stretch',
            x: stretchX,
            y: stretchY,
            facing: 'down',
            label: `Taking a stretch break in ${roomObj.shortName}`,
          });
        }
      }

      const pool =
        candidates.length > 0 && Math.random() < 0.82
          ? candidates
          : localSpots.length > 0
          ? localSpots
          : candidates;

      if (pool.length === 0) {
        npc.timer = 8 + Math.random() * 6;
        return;
      }

      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const path = findPathBFS(
        { x: Math.round(npc.x), y: Math.round(npc.y) },
        { x: chosen.x, y: chosen.y }
      );
      if (path.length === 0) {
        npc.timer = 6 + Math.random() * 5;
        return;
      }

      npc.state = 'walking_to_activity';
      npc.activityKind = chosen.kind;
      npc.activityLabel = chosen.label;
      npc.activityFacing = chosen.facing;
      npc.activitySpotId = chosen.id;
      npc.presence = derivePresenceStatus(
        'walking_to_activity',
        chosen.kind,
        chosen.id
      );
      npc.targetTile = { x: chosen.x, y: chosen.y };
      npc.path = path;
      npc.stepTimer = 0;
      npc.stepPhase = 1;
    };

    const canWalkPixel = (nx: number, ny: number): boolean => {
      const checks = [
        { x: Math.round(nx - 0.25), y: Math.round(ny - 0.2) },
        { x: Math.round(nx + 0.25), y: Math.round(ny - 0.2) },
        { x: Math.round(nx - 0.25), y: Math.round(ny + 0.2) },
        { x: Math.round(nx + 0.25), y: Math.round(ny + 0.2) },
      ];
      for (const c of checks) {
        if (!isTileWalkable(c.x, c.y)) return false;
      }
      for (const npc of npcsRef.current) {
        const dist = Math.hypot(nx - npc.x, ny - npc.y);
        if (dist < 0.65) return false;
      }
      return true;
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      frameTick++;
      soundCooldown = Math.max(0, soundCooldown - dt);

      const player = playerRef.current;

      // 1. Player Movement (manual or BFS path)
      let moveX = 0;
      let moveY = 0;
      const keys = keysRef.current;

      if (!activeDialogOpenRef.current) {
        if (keys.has('w') || keys.has('arrowup')) moveY -= 1;
        if (keys.has('s') || keys.has('arrowdown')) moveY += 1;
        if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
        if (keys.has('d') || keys.has('arrowright')) moveX += 1;
      }

      let isMoving = false;
      const speed = 5.4; // tiles per second

      if (moveX !== 0 || moveY !== 0) {
        isMoving = true;
        const len = Math.hypot(moveX, moveY);
        const vx = (moveX / len) * speed * dt;
        const vy = (moveY / len) * speed * dt;

        if (Math.abs(moveX) >= Math.abs(moveY)) {
          player.facing = moveX > 0 ? 'right' : 'left';
        } else {
          player.facing = moveY > 0 ? 'down' : 'up';
        }

        if (canWalkPixel(player.x + vx, player.y)) player.x += vx;
        if (canWalkPixel(player.x, player.y + vy)) player.y += vy;
      } else if (player.path.length > 0 && !activeDialogOpenRef.current) {
        const target = player.path[0];
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 0.08) {
          player.x = target.x;
          player.y = target.y;
          player.path.shift();
          if (player.path.length === 0 && player.pendingInteract) {
            const pend = player.pendingInteract;
            if (pend.kind === 'employee') {
              const liveNpc = npcsRef.current.find(
                (n) => n.employee.id === pend.data.id
              );
              if (
                liveNpc &&
                Math.hypot(player.x - liveNpc.x, player.y - liveNpc.y) > 2.3
              ) {
                // Re-route if the teammate walked away while player was approaching
                const nextPath = findPathBFS(
                  { x: Math.round(player.x), y: Math.round(player.y) },
                  { x: Math.round(liveNpc.x), y: Math.round(liveNpc.y) },
                  new Set([`${Math.round(liveNpc.x)},${Math.round(liveNpc.y)}`])
                );
                if (nextPath.length > 0) {
                  player.path = nextPath;
                } else {
                  player.pendingInteract = null;
                  openEmployeeDialogue(pend.data);
                }
              } else {
                player.pendingInteract = null;
                openEmployeeDialogue(pend.data);
              }
            } else {
              player.pendingInteract = null;
              openPropModal(pend.data);
            }
          }
        } else {
          isMoving = true;
          const step = Math.min(dist, speed * dt);
          player.x += (dx / dist) * step;
          player.y += (dy / dist) * step;
          if (Math.abs(dx) > Math.abs(dy)) {
            player.facing = dx > 0 ? 'right' : 'left';
          } else {
            player.facing = dy > 0 ? 'down' : 'up';
          }
        }
      }

      if (isMoving) {
        player.stepTimer += dt;
        if (player.stepTimer > 0.14) {
          player.stepTimer = 0;
          player.stepPhase = (player.stepPhase % 3) + 1;
          if (soundCooldown <= 0) {
            soundEngine.playStep();
            soundCooldown = 0.28;
          }
        }
        if (coffeeTimerRef.current <= 0) {
          energyRef.current = Math.max(25, energyRef.current - dt * 1.1);
        }
      } else {
        player.stepPhase = 0;
      }

      if (coffeeTimerRef.current > 0) {
        coffeeTimerRef.current = Math.max(0, coffeeTimerRef.current - dt);
      }
      if (energyToastRef.current) {
        energyToastRef.current.ttl -= dt;
        if (energyToastRef.current.ttl <= 0) {
          energyToastRef.current = null;
        }
      }

      // 2. Unified Daily Activities Simulation for All Employees
      let activeTravelers = 0;
      for (const n of npcsRef.current) {
        if (n.state !== 'at_desk') activeTravelers++;
      }
      const maxAwayFromDesk = Math.max(10, Math.round(npcsRef.current.length * 0.26));

      for (const npc of npcsRef.current) {
        const isBeingTalkedTo = activeEmployeeIdRef.current === npc.employee.id;
        if (isBeingTalkedTo) {
          npc.stepPhase = 0;
          continue;
        }

        if (npc.state === 'at_desk') {
          npc.timer -= dt;
          npc.typingTimer -= dt;
          if (npc.typingTimer <= 0) {
            npc.typingTimer = 0.22 + Math.random() * 0.25;
            if (Math.random() < 0.14) npc.isTyping = !npc.isTyping;
            npc.stepPhase = npc.isTyping ? ((npc.stepPhase % 3) + 1) : 0;
          }
          if (npc.timer <= 0) {
            if (activeTravelers < maxAwayFromDesk) {
              pickDailyActivityForNpc(npc);
              if (npc.state !== 'at_desk') {
                activeTravelers++;
              }
            } else {
              npc.timer = 3 + Math.random() * 5;
            }
          }
        } else if (npc.state === 'doing_activity') {
          npc.timer -= dt;
          npc.stepPhase = 0;
          if (npc.timer <= 0) {
            // Walk back to assigned desk/station
            const backPath = findPathBFS(
              { x: Math.round(npc.x), y: Math.round(npc.y) },
              { x: npc.employee.spawnTile.x, y: npc.employee.spawnTile.y }
            );
            const prevKind = npc.activityKind;
            const prevSpot = npc.activitySpotId;
            npc.state = 'returning_to_desk';
            npc.presence = derivePresenceStatus(
              'returning_to_desk',
              prevKind,
              prevSpot
            );
            npc.activityLabel = `Heading back to ${
              ROOMS.find((r) => r.id === npc.employee.departmentId)?.shortName || 'desk'
            }`;
            npc.activitySpotId = null;
            npc.targetTile = { ...npc.employee.spawnTile };
            npc.path = backPath;
            if (backPath.length === 0) {
              npc.x = npc.employee.spawnTile.x;
              npc.y = npc.employee.spawnTile.y;
              npc.facing = npc.employee.facing;
              npc.state = 'at_desk';
              npc.presence = 'online';
              npc.activityKind = 'desk';
              npc.activityLabel = getDefaultDeskLabel(npc.employee);
              npc.timer = 14 + Math.random() * 16;
            }
          }
        } else if (
          npc.state === 'walking_to_activity' ||
          npc.state === 'returning_to_desk'
        ) {
          if (npc.path.length === 0) {
            if (npc.state === 'walking_to_activity') {
              npc.state = 'doing_activity';
              npc.presence = derivePresenceStatus(
                'doing_activity',
                npc.activityKind,
                npc.activitySpotId
              );
              npc.facing = npc.activityFacing;
              npc.stepPhase = 0;
              npc.timer = 5.5 + Math.random() * 6.5;
            } else {
              npc.x = npc.employee.spawnTile.x;
              npc.y = npc.employee.spawnTile.y;
              npc.facing = npc.employee.facing;
              npc.state = 'at_desk';
              npc.presence = 'online';
              npc.activityKind = 'desk';
              npc.activityLabel = getDefaultDeskLabel(npc.employee);
              npc.activitySpotId = null;
              npc.targetTile = null;
              npc.stepPhase = 0;
              npc.timer = 14 + Math.random() * 18;
            }
            continue;
          }

          const target = npc.path[0];
          const dx = target.x - npc.x;
          const dy = target.y - npc.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.08) {
            npc.x = target.x;
            npc.y = target.y;
            npc.path.shift();
          } else {
            const npcSpeed = 2.4 * dt;
            npc.x += (dx / dist) * Math.min(dist, npcSpeed);
            npc.y += (dy / dist) * Math.min(dist, npcSpeed);
            if (Math.abs(dx) > Math.abs(dy)) {
              npc.facing = dx > 0 ? 'right' : 'left';
            } else {
              npc.facing = dy > 0 ? 'down' : 'up';
            }
            npc.stepTimer += dt;
            if (npc.stepTimer > 0.16) {
              npc.stepTimer = 0;
              npc.stepPhase = (npc.stepPhase % 3) + 1;
            }
          }
        }
      }

      // Sync lightweight live activity snapshot + player energy ~2x/sec for Sidebar & HUD
      liveSyncTimer += dt;
      if (liveSyncTimer >= 0.55) {
        liveSyncTimer = 0;
        const roundedEnergy = Math.round(energyRef.current);
        const boostSec = Math.ceil(coffeeTimerRef.current);
        setPlayerEnergy((prev) => (prev !== roundedEnergy ? roundedEnergy : prev));
        setCoffeeBoostLeft((prev) => (prev !== boostSec ? boostSec : prev));

        setLiveNpcInfo((prev) => {
          let changed = false;
          const next: Record<string, NpcLiveInfo> = {};
          for (const npc of npcsRef.current) {
            const r = getRoomAtTile(Math.round(npc.x), Math.round(npc.y));
            const roomId = r ? r.id : 'corridor';
            const prevEntry = prev[npc.employee.id];
            if (
              !prevEntry ||
              prevEntry.activity !== npc.activityLabel ||
              prevEntry.kind !== npc.activityKind ||
              prevEntry.presence !== npc.presence ||
              prevEntry.roomId !== roomId
            ) {
              changed = true;
            }
            next[npc.employee.id] = {
              activity: npc.activityLabel,
              kind: npc.activityKind,
              presence: npc.presence,
              roomId,
            };
          }
          return changed ? next : prev;
        });
      }

      // 3. Check current room + nearby interactable
      const roomInfo = getDepartmentLabelAtTile(
        Math.round(player.x),
        Math.round(player.y)
      );
      if (roomInfo.id !== lastRoomId) {
        lastRoomId = roomInfo.id;
        setCurrentRoomInfo(roomInfo);
      }

      let closest:
        | { kind: 'employee'; data: Employee; d: number }
        | { kind: 'prop'; data: InteractiveProp; d: number }
        | null = null;

      for (const npc of npcsRef.current) {
        const d = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (d < 1.75 && (!closest || d < closest.d)) {
          closest = { kind: 'employee', data: npc.employee, d };
        }
      }
      for (const prop of INTERACTIVE_PROPS) {
        const d = Math.hypot(player.x - prop.tile.x, player.y - prop.tile.y);
        if (d < 1.85 && (!closest || d < closest.d)) {
          closest = { kind: 'prop', data: prop, d };
        }
      }

      const nextKey = closest
        ? `${closest.kind}:${closest.data.id}`
        : '';
      if (nextKey !== lastNearbyKey) {
        lastNearbyKey = nextKey;
        setNearbyTarget(
          closest
            ? closest.kind === 'employee'
              ? { kind: 'employee', data: closest.data }
              : { kind: 'prop', data: closest.data }
            : null
        );
      }

      if (clickMarkerRef.current) {
        clickMarkerRef.current.ttl -= dt;
        if (clickMarkerRef.current.ttl <= 0) clickMarkerRef.current = null;
      }

      // 4. Smooth Camera Follow or Mouse Free-Pan
      const canvas = canvasRef.current;
      let camLeft = 0;
      let camTop = 0;
      let viewWorldW = 0;
      let viewWorldH = 0;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const worldPxW = MAP_WIDTH * TILE_SIZE;
          const worldPxH = MAP_HEIGHT * TILE_SIZE;
          viewWorldW = canvas.width / zoom;
          viewWorldH = canvas.height / zoom;

          if (cameraModeRef.current === 'follow') {
            const targetCamX = (player.x + 0.5) * TILE_SIZE;
            const targetCamY = (player.y + 0.5) * TILE_SIZE;
            cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.14;
            cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.14;
          }

          if (viewWorldW < worldPxW) {
            cameraRef.current.x = Math.max(
              viewWorldW / 2,
              Math.min(worldPxW - viewWorldW / 2, cameraRef.current.x)
            );
            camLeft = cameraRef.current.x - viewWorldW / 2;
          } else {
            cameraRef.current.x = worldPxW / 2;
            camLeft = (worldPxW - viewWorldW) / 2;
          }
          if (viewWorldH < worldPxH) {
            cameraRef.current.y = Math.max(
              viewWorldH / 2,
              Math.min(worldPxH - viewWorldH / 2, cameraRef.current.y)
            );
            camTop = cameraRef.current.y - viewWorldH / 2;
          } else {
            cameraRef.current.y = worldPxH / 2;
            camTop = (worldPxH - viewWorldH) / 2;
          }

          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = '#14171F';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          ctx.scale(zoom, zoom);
          ctx.translate(-Math.round(camLeft), -Math.round(camTop));

          // Draw Tiles (only visible bounds for crisp performance)
          const startCol = Math.max(0, Math.floor(camLeft / TILE_SIZE) - 1);
          const endCol = Math.min(
            MAP_WIDTH - 1,
            Math.ceil((camLeft + viewWorldW) / TILE_SIZE) + 1
          );
          const startRow = Math.max(0, Math.floor(camTop / TILE_SIZE) - 1);
          const endRow = Math.min(
            MAP_HEIGHT - 1,
            Math.ceil((camTop + viewWorldH) / TILE_SIZE) + 1
          );

          for (let ty = startRow; ty <= endRow; ty++) {
            for (let tx = startCol; tx <= endCol; tx++) {
              drawFloorTile(
                ctx,
                WORLD_GRID.tiles[ty][tx],
                tx,
                ty,
                tx * TILE_SIZE,
                ty * TILE_SIZE
              );
            }
          }

          // Room floor banners (letter code + short name inside each room)
          ctx.font = 'bold 6px monospace';
          ctx.textAlign = 'center';
          for (const room of ROOMS) {
            const labelX = (room.bounds.x + room.bounds.w / 2) * TILE_SIZE;
            const labelY = (room.bounds.y + room.bounds.h - 1.3) * TILE_SIZE;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
            ctx.fillText(room.shortName.toUpperCase(), labelX, labelY);
          }

          // Exterior Courtyard & Car Parking Lot Labels
          ctx.font = 'bold 6px monospace';
          ctx.fillStyle = 'rgba(248, 250, 252, 0.72)';
          ctx.fillText(
            'P · CAR PARKING LOT',
            (BUILDING_OFFSET_X + 96) * TILE_SIZE,
            (BUILDING_OFFSET_Y + 2.2) * TILE_SIZE
          );
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          ctx.fillText(
            'EV',
            (BUILDING_OFFSET_X + 91) * TILE_SIZE,
            (BUILDING_OFFSET_Y + 19.6) * TILE_SIZE
          );
          ctx.fillText(
            'EV',
            (BUILDING_OFFSET_X + 101) * TILE_SIZE,
            (BUILDING_OFFSET_Y + 19.6) * TILE_SIZE
          );
          ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
          ctx.fillText(
            'CEO VIP',
            (BUILDING_OFFSET_X + 91) * TILE_SIZE,
            (BUILDING_OFFSET_Y + 27.7) * TILE_SIZE
          );

          // Floor rugs (under everything)
          for (const item of FURNITURE) {
            if (item.kind === 'rug_exec' || item.kind === 'rug_lounge') {
              drawFurniture(ctx, item, frameTick);
            }
          }

          // Click-to-move destination pulse
          if (clickMarkerRef.current) {
            const mx = clickMarkerRef.current.x * TILE_SIZE;
            const my = clickMarkerRef.current.y * TILE_SIZE;
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 1;
            ctx.strokeRect(mx + 2, my + 2, 12, 12);
          }

          // Y-Sorted Entities (Furniture + NPCs + Player)
          type Renderable = { y: number; draw: () => void };
          const renderables: Renderable[] = [];

          for (const item of FURNITURE) {
            if (item.kind === 'rug_exec' || item.kind === 'rug_lounge') continue;
            const sortY =
              item.kind === 'chair' || !item.solid
                ? (item.y + 0.45) * TILE_SIZE
                : (item.y + item.h) * TILE_SIZE;
            renderables.push({
              y: sortY,
              draw: () => drawFurniture(ctx, item, frameTick),
            });
          }

          for (const npc of npcsRef.current) {
            const isTarget =
              closest?.kind === 'employee' &&
              closest.data.id === npc.employee.id;
            const isSeatedNow =
              npc.state === 'at_desk' &&
              CHAIR_TILES.has(
                `${npc.employee.spawnTile.x},${npc.employee.spawnTile.y}`
              );
            renderables.push({
              y: (npc.y + 0.85) * TILE_SIZE,
              draw: () => {
                const cx = (npc.x + 0.5) * TILE_SIZE;
                const fy = (npc.y + 0.88) * TILE_SIZE;
                drawPixelCharacter(
                  ctx,
                  npc.employee.appearance,
                  cx,
                  fy,
                  npc.facing,
                  npc.stepPhase,
                  isSeatedNow
                );

                // Dynamic presence indicator (Online / In a Meeting / Offline) above every sprite
                drawPresenceIndicator(
                  ctx,
                  npc.presence,
                  cx,
                  fy,
                  frameTick
                );

                // Subtle activity badge when doing away-from-desk activities
                if (npc.state === 'doing_activity') {
                  drawActivityBadge(
                    ctx,
                    npc.activityKind,
                    cx,
                    fy,
                    frameTick
                  );
                }

                // Subtle pixel name label
                ctx.font = 'bold 5px sans-serif';
                ctx.textAlign = 'center';
                const firstName = npc.employee.name.split(' ')[0];
                const tw = ctx.measureText(firstName).width + 5;
                ctx.fillStyle = isTarget
                  ? 'rgba(245, 158, 11, 0.95)'
                  : 'rgba(15, 23, 42, 0.72)';
                ctx.fillRect(
                  Math.round(cx - tw / 2),
                  Math.round(fy + 1),
                  Math.round(tw),
                  7
                );
                ctx.fillStyle = isTarget ? '#111827' : '#F8FAFC';
                ctx.fillText(firstName, Math.round(cx), Math.round(fy + 6));

                // Interactive [E] prompt bubble cleanly above presence indicator
                if (isTarget) {
                  const bobY = Math.sin(frameTick * 0.14) * 1.2;
                  ctx.fillStyle = '#0F172A';
                  ctx.fillRect(Math.round(cx - 6), Math.round(fy - 37 + bobY), 12, 8);
                  ctx.fillStyle = '#F59E0B';
                  ctx.fillRect(Math.round(cx - 5), Math.round(fy - 36 + bobY), 10, 6);
                  ctx.fillStyle = '#111827';
                  ctx.font = 'bold 5px monospace';
                  ctx.fillText('E', Math.round(cx), Math.round(fy - 31 + bobY));
                }
              },
            });
          }

          // Player renderable
          renderables.push({
            y: (player.y + 0.85) * TILE_SIZE,
            draw: () => {
              const cx = (player.x + 0.5) * TILE_SIZE;
              const fy = (player.y + 0.88) * TILE_SIZE;
              drawPixelCharacter(
                ctx,
                playerProfile.appearance,
                cx,
                fy,
                player.facing,
                player.stepPhase,
                false
              );
              if (coffeeTimerRef.current > 0) {
                drawPlayerCoffeeCup(
                  ctx,
                  cx,
                  fy,
                  player.facing,
                  player.stepPhase,
                  frameTick
                );
              }
              if (energyToastRef.current) {
                const rise = (1.8 - energyToastRef.current.ttl) * 4;
                const toastY = Math.round(fy - 28 - rise);
                ctx.font = 'bold 5px monospace';
                ctx.textAlign = 'center';
                const txt = energyToastRef.current.text;
                const bw = ctx.measureText(txt).width + 6;
                ctx.fillStyle = '#0F172A';
                ctx.fillRect(Math.round(cx - bw / 2), toastY - 6, Math.round(bw), 8);
                ctx.fillStyle = '#F59E0B';
                ctx.fillText(txt, Math.round(cx), toastY);
              }
              // Player tag
              ctx.font = 'bold 5px sans-serif';
              ctx.textAlign = 'center';
              const tag = playerProfile.name.split(' ')[0] + ' (You)';
              const tw = ctx.measureText(tag).width + 6;
              ctx.fillStyle = 'rgba(16, 185, 129, 0.92)';
              ctx.fillRect(
                Math.round(cx - tw / 2),
                Math.round(fy + 1),
                Math.round(tw),
                7
              );
              ctx.fillStyle = '#052E16';
              ctx.fillText(tag, Math.round(cx), Math.round(fy + 6));
            },
          });

          renderables.sort((a, b) => a.y - b.y);
          for (const r of renderables) r.draw();

          // Prompt bubble above nearby interactive prop
          if (closest?.kind === 'prop') {
            const px = (closest.data.tile.x + 0.5) * TILE_SIZE;
            const py = closest.data.tile.y * TILE_SIZE;
            const bobY = Math.sin(frameTick * 0.14) * 1.2;
            ctx.fillStyle = '#0F172A';
            ctx.fillRect(Math.round(px - 6), Math.round(py - 11 + bobY), 12, 8);
            ctx.fillStyle = '#10B981';
            ctx.fillRect(Math.round(px - 5), Math.round(py - 10 + bobY), 10, 6);
            ctx.fillStyle = '#052E16';
            ctx.font = 'bold 5px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('E', Math.round(px), Math.round(py - 5 + bobY));
          }

          ctx.restore();
        }
      }

      // 5. Render Minimap matching the full HQ, Green Lawn & Car Parking Lot
      const mini = minimapRef.current;
      if (mini && frameTick % 2 === 0) {
        const mctx = mini.getContext('2d');
        if (mctx) {
          const scale = 3;
          mctx.imageSmoothingEnabled = false;

          // Surrounding Green Lawn across full campus
          mctx.fillStyle = '#2B4C33';
          mctx.fillRect(0, 0, MAP_WIDTH * scale, MAP_HEIGHT * scale);

          // Building corridor footprint
          mctx.fillStyle = '#252B3B';
          mctx.fillRect(
            BUILDING_OFFSET_X * scale,
            BUILDING_OFFSET_Y * scale,
            BUILDING_WIDTH * scale,
            BUILDING_HEIGHT * scale
          );

          // East Sidewalk Plaza
          mctx.fillStyle = '#64748B';
          mctx.fillRect(
            (BUILDING_OFFSET_X + 82) * scale,
            (BUILDING_OFFSET_Y + 1) * scale,
            5 * scale,
            (BUILDING_HEIGHT - 2) * scale
          );

          // Asphalt Car Parking Lot + Full N/S Drive Lane
          mctx.fillStyle = '#1E2532';
          mctx.fillRect(
            (BUILDING_OFFSET_X + 88) * scale,
            (BUILDING_OFFSET_Y + 2) * scale,
            15 * scale,
            42 * scale
          );
          mctx.fillRect(
            (BUILDING_OFFSET_X + 93) * scale,
            0,
            6 * scale,
            MAP_HEIGHT * scale
          );
          mctx.strokeStyle = '#38BDF8';
          mctx.lineWidth = 1;
          mctx.strokeRect(
            (BUILDING_OFFSET_X + 88) * scale + 0.5,
            (BUILDING_OFFSET_Y + 2) * scale + 0.5,
            15 * scale - 1,
            42 * scale - 1
          );

          // Parked Car Markers on Minimap
          for (const item of FURNITURE) {
            if (
              item.kind === 'car_sedan' ||
              item.kind === 'car_suv' ||
              item.kind === 'car_van'
            ) {
              mctx.fillStyle = item.color || '#94A3B8';
              mctx.fillRect(
                item.x * scale,
                item.y * scale,
                item.w * scale,
                item.h * scale
              );
            }
          }

          // Room blocks + exact letter codes
          mctx.font = 'bold 9px monospace';
          mctx.textAlign = 'center';
          mctx.textBaseline = 'middle';
          for (const room of ROOMS) {
            const rx = room.bounds.x * scale;
            const ry = room.bounds.y * scale;
            const rw = room.bounds.w * scale;
            const rh = room.bounds.h * scale;
            mctx.fillStyle = room.accentColor + '38';
            mctx.fillRect(rx + 1, ry + 1, rw - 2, rh - 2);
            mctx.strokeStyle = room.accentColor;
            mctx.lineWidth = 1;
            mctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
            mctx.fillStyle = '#E2E8F0';
            mctx.fillText(room.code, rx + rw / 2, ry + rh / 2);
          }

          // Parking Lot Label on Minimap
          mctx.fillStyle = '#7DD3FC';
          mctx.fillText(
            'PARKING',
            (BUILDING_OFFSET_X + 95.5) * scale,
            (BUILDING_OFFSET_Y + 24) * scale
          );

          // NPCs
          mctx.fillStyle = '#94A3B8';
          for (const npc of npcsRef.current) {
            mctx.fillRect(
              Math.round(npc.x * scale),
              Math.round(npc.y * scale),
              2,
              2
            );
          }

          // Player dot
          mctx.fillStyle = '#F59E0B';
          mctx.fillRect(
            Math.round(player.x * scale) - 2,
            Math.round(player.y * scale) - 2,
            5,
            5
          );

          // Live camera viewport frame on minimap
          if (viewWorldW > 0 && viewWorldH > 0) {
            const vx = Math.max(0, (camLeft / TILE_SIZE) * scale);
            const vy = Math.max(0, (camTop / TILE_SIZE) * scale);
            const vw = Math.min(
              MAP_WIDTH * scale - vx,
              (viewWorldW / TILE_SIZE) * scale
            );
            const vh = Math.min(
              MAP_HEIGHT * scale - vy,
              (viewWorldH / TILE_SIZE) * scale
            );
            mctx.strokeStyle =
              cameraModeRef.current === 'pan' ? '#FACC15' : '#38BDF8';
            mctx.lineWidth = 1.5;
            mctx.strokeRect(
              Math.round(vx) + 0.5,
              Math.round(vy) + 0.5,
              Math.max(4, Math.round(vw) - 1),
              Math.max(4, Math.round(vh) - 1)
            );
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [zoom, playerProfile, openEmployeeDialogue, openPropModal]);

  // Press & Drag Mouse Camera Panning Handlers
  const handleCanvasPointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) {
      return;
    }
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      wasDragged: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }
  };

  const handleCanvasPointerMove = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;

    const totalMoved = Math.hypot(
      e.clientX - drag.startX,
      e.clientY - drag.startY
    );
    if (!drag.wasDragged && totalMoved > 4) {
      drag.wasDragged = true;
      setIsDraggingMap(true);
      if (cameraModeRef.current !== 'pan') {
        cameraModeRef.current = 'pan';
        setIsFreePan(true);
      }
    }

    if (drag.wasDragged) {
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;

      const canvas = canvasRef.current;
      const worldPxW = MAP_WIDTH * TILE_SIZE;
      const worldPxH = MAP_HEIGHT * TILE_SIZE;
      const viewWorldW = canvas ? canvas.width / zoom : worldPxW;
      const viewWorldH = canvas ? canvas.height / zoom : worldPxH;

      let nextX = cameraRef.current.x - dx / zoom;
      let nextY = cameraRef.current.y - dy / zoom;

      if (viewWorldW < worldPxW) {
        nextX = Math.max(
          viewWorldW / 2,
          Math.min(worldPxW - viewWorldW / 2, nextX)
        );
      } else {
        nextX = worldPxW / 2;
      }
      if (viewWorldH < worldPxH) {
        nextY = Math.max(
          viewWorldH / 2,
          Math.min(worldPxH - viewWorldH / 2, nextY)
        );
      } else {
        nextY = worldPxH / 2;
      }

      cameraRef.current.x = nextX;
      cameraRef.current.y = nextY;
    }
  };

  const finishCanvasDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    if (drag.wasDragged) {
      suppressClickRef.current = true;
    }
    drag.active = false;
    setIsDraggingMap(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    wheelAccumRef.current += e.deltaY;
    if (Math.abs(wheelAccumRef.current) >= 70) {
      const dir = wheelAccumRef.current < 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      setZoom((z) => Math.max(1, Math.min(4, z + dir)));
    }
  };

  // Canvas Click -> Pathfind & Interact (skipped if user just dragged the map)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const worldPxW = MAP_WIDTH * TILE_SIZE;
    const worldPxH = MAP_HEIGHT * TILE_SIZE;
    const viewWorldW = canvas.width / zoom;
    const viewWorldH = canvas.height / zoom;

    let camLeft = cameraRef.current.x - viewWorldW / 2;
    let camTop = cameraRef.current.y - viewWorldH / 2;
    if (viewWorldW < worldPxW) {
      camLeft = Math.max(0, Math.min(worldPxW - viewWorldW, camLeft));
    } else {
      camLeft = (worldPxW - viewWorldW) / 2;
    }
    if (viewWorldH < worldPxH) {
      camTop = Math.max(0, Math.min(worldPxH - viewWorldH, camTop));
    } else {
      camTop = (worldPxH - viewWorldH) / 2;
    }

    const tileX = Math.floor((camLeft + cx / zoom) / TILE_SIZE);
    const tileY = Math.floor((camTop + cy / zoom) / TILE_SIZE);

    if (tileX < 0 || tileY < 0 || tileX >= MAP_WIDTH || tileY >= MAP_HEIGHT) {
      return;
    }

    // Resume following avatar when walking to a clicked destination
    recenterOnPlayer();
    setActiveEmployee(null);
    setActiveProp(null);

    // Clicking on 'Kitchen Room' (R) spawns temporary coffee cup sprite & boosts energy
    const clickedRoom = getRoomAtTile(tileX, tileY);
    if (clickedRoom?.id === 'room-r') {
      triggerKitchenCoffeeBoost();
    }

    // Check if clicked near an employee
    const clickedNpc = npcsRef.current.find(
      (n) => Math.hypot(n.x - tileX, n.y - tileY) < 1.25
    );
    if (clickedNpc) {
      walkToTarget(
        { x: Math.round(clickedNpc.x), y: Math.round(clickedNpc.y) },
        { kind: 'employee', data: clickedNpc.employee }
      );
      return;
    }

    // Check if clicked near an interactive prop
    const clickedProp = INTERACTIVE_PROPS.find(
      (p) => Math.hypot(p.tile.x - tileX, p.tile.y - tileY) < 1.4
    );
    if (clickedProp) {
      walkToTarget(clickedProp.tile, { kind: 'prop', data: clickedProp });
      return;
    }

    walkToTarget({ x: tileX, y: tileY }, null);
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mini = minimapRef.current;
    if (!mini) return;
    const rect = mini.getBoundingClientRect();
    const tx = Math.floor(((e.clientX - rect.left) / rect.width) * MAP_WIDTH);
    const ty = Math.floor(((e.clientY - rect.top) / rect.height) * MAP_HEIGHT);

    if (
      tx >= BUILDING_OFFSET_X + BUILDING_WIDTH &&
      ty >= BUILDING_OFFSET_Y &&
      ty < BUILDING_OFFSET_Y + BUILDING_HEIGHT
    ) {
      teleportToTile(PARKING_SPOT.x, PARKING_SPOT.y, 'right');
      return;
    }

    const room = ROOMS.find(
      (r) =>
        tx >= r.bounds.x &&
        tx < r.bounds.x + r.bounds.w &&
        ty >= r.bounds.y &&
        ty < r.bounds.y + r.bounds.h
    );
    if (room) {
      teleportToRoom(room.id);
      return;
    }

    if (isTileWalkable(tx, ty)) {
      teleportToTile(tx, ty, 'down');
    }
  };

  const roomEmployees = useMemo(() => {
    if (currentRoomInfo.id === 'corridor') return [];
    const home = EMPLOYEES.filter(
      (e) => e.departmentId === currentRoomInfo.id
    );
    const visiting = EMPLOYEES.filter(
      (e) =>
        e.departmentId !== currentRoomInfo.id &&
        liveNpcInfo[e.id]?.roomId === currentRoomInfo.id
    );
    return [...home, ...visiting];
  }, [currentRoomInfo.id, liveNpcInfo]);

  const currentRoomObj = useMemo(
    () => ROOMS.find((r) => r.id === currentRoomInfo.id) || null,
    [currentRoomInfo.id]
  );

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const handleNudgeMove = (dx: number, dy: number) => {
    const targetX = Math.round(playerRef.current.x + dx);
    const targetY = Math.round(playerRef.current.y + dy);
    walkToTarget({ x: targetX, y: targetY }, null);
  };

  const managerObj = useMemo(() => {
    if (!activeEmployee?.managerId) return null;
    return EMPLOYEES.find((e) => e.id === activeEmployee.managerId) || null;
  }, [activeEmployee]);

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#14171F]">
      {/* Primary Interactive Canvas Stage */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={finishCanvasDrag}
          onPointerCancel={finishCanvasDrag}
          onWheel={handleCanvasWheel}
          onClick={handleCanvasClick}
          className={`block h-full w-full select-none touch-none pixelated ${
            isDraggingMap ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        />

        {/* Top-Left Room Location & Energy Plate */}
        <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-1 border-2 border-[#343C4F] bg-[#181C26]/95 px-4 py-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span>Current Zone</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {currentRoomInfo.id === 'parking-lot'
                ? '16 Bays · EV & VIP'
                : currentRoomInfo.id === 'courtyard'
                ? 'East Entrance Plaza'
                : currentRoomInfo.id === 'lawn'
                ? 'Perimeter Grounds'
                : currentRoomInfo.id === 'corridor'
                ? 'Connecting All 21 Wings'
                : `${roomEmployees.length} teammates`}
            </span>
          </div>
          <div className="font-pixel text-sm tracking-wide text-slate-100">
            {currentRoomInfo.name}
          </div>

          {/* Player Energy Indicator */}
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            {coffeeBoostLeft > 0 ? (
              <Coffee className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span className="font-medium text-slate-300">Energy</span>
            <div className="h-2 w-24 border border-[#343C4F] bg-[#0F131B]">
              <div
                className={`h-full transition-all duration-300 ${
                  coffeeBoostLeft > 0
                    ? 'bg-amber-400'
                    : playerEnergy >= 50
                    ? 'bg-emerald-400'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${playerEnergy}%` }}
              />
            </div>
            <span className="font-mono tabular-nums text-slate-200">
              {playerEnergy}%
            </span>
            {coffeeBoostLeft > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="font-mono tabular-nums text-amber-300">
                  Coffee {coffeeBoostLeft}s
                </span>
              </>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 border border-slate-950 bg-emerald-500" />
              <span>Online</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2.5 border border-slate-950 bg-amber-500" />
              <span>In a Meeting</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 border border-slate-500 bg-slate-800" />
              <span>Offline</span>
            </span>
          </div>
        </div>

        {/* Top-Right World Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isFreePan && (
            <button
              type="button"
              onClick={recenterOnPlayer}
              title="Center camera back on your avatar"
              className="flex h-10 items-center gap-2 border-2 border-amber-400 bg-amber-500 px-3 text-xs font-semibold text-slate-950 shadow-lg transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              <span>Follow Avatar</span>
            </button>
          )}

          <div className="flex items-center border-2 border-[#343C4F] bg-[#181C26]/95 p-1 shadow-lg">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 1))}
              title="Zoom out"
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center text-slate-300 transition-colors hover:bg-[#262C3B] hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-xs tabular-nums text-slate-300">
              {zoom}x
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(4, z + 1))}
              title="Zoom in"
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center text-slate-300 transition-colors hover:bg-[#262C3B] hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            title={muted ? 'Unmute retro sound' : 'Mute retro sound'}
            aria-label={muted ? 'Unmute retro sound' : 'Mute retro sound'}
            className="flex h-10 w-10 items-center justify-center border-2 border-[#343C4F] bg-[#181C26]/95 text-slate-300 shadow-lg transition-colors hover:border-amber-500/60 hover:text-white"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => teleportToRoom('entrance')}
            title="Return to Entrance E"
            className="flex h-10 items-center gap-2 border-2 border-[#343C4F] bg-[#181C26]/95 px-3 text-xs font-medium text-slate-200 shadow-lg transition-colors hover:border-amber-500/60 hover:text-white whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Entrance E</span>
          </button>

          <button
            type="button"
            onClick={() => teleportToTile(PARKING_SPOT.x, PARKING_SPOT.y, 'right')}
            title="Visit Outside Car Parking Lot"
            className="flex h-10 items-center gap-2 border-2 border-[#343C4F] bg-[#181C26]/95 px-3 text-xs font-medium text-slate-200 shadow-lg transition-colors hover:border-sky-400/70 hover:text-white whitespace-nowrap shrink-0"
          >
            <Car className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Parking</span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? 'Hide room panel' : 'Show room panel'}
            aria-label={sidebarOpen ? 'Hide room panel' : 'Show room panel'}
            className="flex h-10 w-10 items-center justify-center border-2 border-[#343C4F] bg-[#181C26]/95 text-slate-300 shadow-lg transition-colors hover:border-amber-500/60 hover:text-white"
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Bottom-Left Interactive Minimap */}
        <div className="hidden sm:block absolute bottom-4 left-4 border-2 border-[#343C4F] bg-[#181C26]/95 p-2 shadow-xl">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium text-slate-200">HQ &amp; Campus</span>
            <span>Click to jump</span>
          </div>
          <canvas
            ref={minimapRef}
            width={MAP_WIDTH * 3}
            height={MAP_HEIGHT * 3}
            onClick={handleMinimapClick}
            className="block h-[114px] w-[232px] cursor-pointer pixelated border border-[#2A3142]"
          />
        </div>

        {/* Bottom-Right Compact Touch / Mouse D-Pad */}
        {!activeEmployee && !activeProp && (
          <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
            {nearbyTarget && (
              <button
                type="button"
                onClick={handleInteract}
                className="flex items-center gap-2 border-2 border-amber-400 bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg transition-transform active:scale-95 whitespace-nowrap shrink-0"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>
                  {nearbyTarget.kind === 'employee'
                    ? `Talk to ${nearbyTarget.data.name.split(' ')[0]} [E]`
                    : `Inspect ${nearbyTarget.data.title} [E]`}
                </span>
              </button>
            )}

            <div className="grid grid-cols-3 gap-1 border-2 border-[#343C4F] bg-[#181C26]/90 p-1.5 shadow-lg md:hidden">
              <div />
              <button
                type="button"
                aria-label="Move up"
                onClick={() => handleNudgeMove(0, -2)}
                className="flex h-9 w-9 items-center justify-center bg-[#262C3B] text-xs font-bold text-slate-200 active:bg-amber-500 active:text-slate-950"
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                aria-label="Move left"
                onClick={() => handleNudgeMove(-2, 0)}
                className="flex h-9 w-9 items-center justify-center bg-[#262C3B] text-xs font-bold text-slate-200 active:bg-amber-500 active:text-slate-950"
              >
                ◀
              </button>
              <button
                type="button"
                aria-label="Move down"
                onClick={() => handleNudgeMove(0, 2)}
                className="flex h-9 w-9 items-center justify-center bg-[#262C3B] text-xs font-bold text-slate-200 active:bg-amber-500 active:text-slate-950"
              >
                ▼
              </button>
              <button
                type="button"
                aria-label="Move right"
                onClick={() => handleNudgeMove(2, 0)}
                className="flex h-9 w-9 items-center justify-center bg-[#262C3B] text-xs font-bold text-slate-200 active:bg-amber-500 active:text-slate-950"
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {/* Bottom-Center Movement & Pan Hint */}
        {!activeEmployee && !activeProp && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 border border-[#343C4F] bg-[#181C26]/90 px-4 py-2 text-xs text-slate-300 shadow-lg lg:flex whitespace-nowrap">
            <span>Press &amp; drag mouse to pan map</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>Click tile or WASD to walk</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>E to interact</span>
          </div>
        )}

        {/* RPG Employee Dialogue Modal */}
        {activeEmployee && (
          <div className="absolute inset-x-4 bottom-4 mx-auto max-w-2xl border-2 border-amber-400/80 bg-[#161A24]/98 p-5 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <PixelPortrait
                appearance={activeEmployee.appearance}
                size={72}
                direction="down"
                className="border-2 border-[#3E4860]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-pixel text-base text-amber-300">
                      {activeEmployee.name}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-200">
                        {activeEmployee.role}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          liveNpcInfo[activeEmployee.id]?.presence ===
                          'in-a-meeting'
                            ? 'font-medium text-amber-400'
                            : liveNpcInfo[activeEmployee.id]?.presence ===
                              'offline'
                            ? 'text-slate-400'
                            : 'font-medium text-emerald-400'
                        }
                      >
                        {formatPresenceLabel(
                          liveNpcInfo[activeEmployee.id]?.presence || 'online'
                        )}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">
                        {liveNpcInfo[activeEmployee.id]?.activity ||
                          activeEmployee.status}
                      </span>
                      {managerObj && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Reports to {managerObj.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenOrgChartForEmployee(activeEmployee.id)}
                      className="border border-[#3E4860] bg-[#222838] px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-amber-400 hover:text-white whitespace-nowrap shrink-0"
                    >
                      View in Org Chart
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEmployee(null)}
                      className="border border-[#3E4860] bg-[#222838] px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap shrink-0"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Dialogue Speech Box */}
                <div className="mt-3 border border-[#2D3548] bg-[#1E2433] p-3.5 text-sm leading-relaxed text-slate-100">
                  “{activeEmployee.dialogue[dialogueTab]}”
                </div>

                {/* RPG Dialogue Topic Choices */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playBlip();
                      setDialogueTab('workingOn');
                    }}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      dialogueTab === 'workingOn'
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-[#343C4F] bg-[#212736] text-slate-200 hover:border-amber-400/60'
                    }`}
                  >
                    What are you working on?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playBlip();
                      setDialogueTab('teamSummary');
                    }}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      dialogueTab === 'teamSummary'
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-[#343C4F] bg-[#212736] text-slate-200 hover:border-amber-400/60'
                    }`}
                  >
                    Tell me about your team
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playBlip();
                      setDialogueTab('officeSecret');
                    }}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      dialogueTab === 'officeSecret'
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-[#343C4F] bg-[#212736] text-slate-200 hover:border-amber-400/60'
                    }`}
                  >
                    Any office secrets?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RPG Interactive Prop Modal */}
        {activeProp && (
          <div className="absolute inset-x-4 bottom-4 mx-auto max-w-xl border-2 border-emerald-400/80 bg-[#161A24]/98 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-emerald-400">
                  {activeProp.subtitle}
                </div>
                <h3 className="mt-0.5 font-pixel text-base text-slate-100">
                  {activeProp.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProp(null)}
                className="border border-[#3E4860] bg-[#222838] px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap shrink-0"
              >
                Close
              </button>
            </div>

            <ul className="mt-3 space-y-1.5 border border-[#2D3548] bg-[#1E2433] p-3.5 text-sm text-slate-200">
              {activeProp.details.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {propActionMsg && (
              <div className="mt-3 border border-emerald-500/40 bg-emerald-950/50 px-3.5 py-2.5 text-xs font-medium text-emerald-200">
                {propActionMsg}
              </div>
            )}

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeProp.id === 'prop-espresso') {
                    triggerKitchenCoffeeBoost();
                  } else {
                    soundEngine.playActionSuccess();
                  }
                  setPropActionMsg(activeProp.actionResult);
                }}
                className="flex items-center gap-2 bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{activeProp.actionLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Right Inspector Sidebar */}
      {sidebarOpen && (
        <aside className="hidden md:flex w-80 shrink-0 flex-col border-l-2 border-[#2A3142] bg-[#181C26]">
          {/* Current Room Section */}
          <div className="border-b border-[#2A3142] p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Zone</span>
              <span className="tabular-nums">
                {currentRoomObj
                  ? `${roomEmployees.length} members`
                  : currentRoomInfo.id === 'parking-lot'
                  ? 'Outdoor Lot'
                  : currentRoomInfo.id === 'courtyard'
                  ? 'Outdoor Plaza'
                  : currentRoomInfo.id === 'lawn'
                  ? 'Green Lawn'
                  : 'Main Hallway'}
              </span>
            </div>
            <h2 className="mt-1 font-pixel text-sm text-slate-100">
              {currentRoomInfo.name}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {currentRoomObj
                ? currentRoomObj.mission
                : currentRoomInfo.id === 'parking-lot'
                ? 'Company car parking outside Entrance E with EV chargers, VIP & accessible bays, and the PixelHQ shuttle van.'
                : currentRoomInfo.id === 'courtyard'
                ? 'Walk east across the crosswalk into the Car Parking Lot, stroll north/south onto the green lawn, or step west into Entrance E.'
                : currentRoomInfo.id === 'lawn'
                ? 'A lush green lawn surrounds the entire company building with oak trees, flower beds, and park benches.'
                : 'Walk north, south, east, or west through any wooden doorway to enter a department room—or step outside Entrance E to the parking lot & green lawn.'}
            </p>
          </div>

          {/* Room Occupants / Walk-To List */}
          <div className="flex-1 overflow-y-auto p-5">
            {currentRoomObj ? (
              <div>
                <h3 className="text-xs font-semibold tracking-wide text-slate-300">
                  Teammates in this room
                </h3>
                <div className="mt-3 space-y-2.5">
                  {roomEmployees.map((emp) => {
                    const info = liveNpcInfo[emp.id];
                    const presence = info?.presence || 'online';
                    const isVisitor = emp.departmentId !== currentRoomInfo.id;
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          const npc = npcsRef.current.find(
                            (n) => n.employee.id === emp.id
                          );
                          if (npc) {
                            walkToTarget(
                              { x: Math.round(npc.x), y: Math.round(npc.y) },
                              { kind: 'employee', data: emp }
                            );
                          }
                        }}
                        className="flex w-full items-center gap-3 border border-[#2D3548] bg-[#1E2432] p-2.5 text-left transition-colors hover:border-amber-400/70 hover:bg-[#242B3B]"
                      >
                        <PixelPortrait
                          appearance={emp.appearance}
                          size={40}
                          direction="down"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-slate-100">
                            {emp.name}
                            {isVisitor && (
                              <span className="ml-1.5 text-[10px] font-normal text-emerald-400">
                                · Visiting
                              </span>
                            )}
                          </div>
                          <div className="truncate text-[11px] text-slate-400">
                            {emp.role}
                          </div>
                          <div className="mt-0.5 truncate text-[11px]">
                            <span
                              className={
                                presence === 'in-a-meeting'
                                  ? 'font-medium text-amber-400'
                                  : presence === 'offline'
                                  ? 'text-slate-400'
                                  : 'font-medium text-emerald-400'
                              }
                            >
                              {formatPresenceLabel(presence)}
                            </span>
                            <span aria-hidden="true" className="text-slate-500">
                              {' '}
                              ·{' '}
                            </span>
                            <span className="text-slate-300">
                              {info?.activity || emp.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-[#2D3548] bg-[#1E2432] p-4 text-xs leading-relaxed text-slate-300">
                {currentRoomInfo.id === 'parking-lot' ||
                currentRoomInfo.id === 'courtyard' ||
                currentRoomInfo.id === 'lawn'
                  ? 'Stroll around the green lawn surrounding HQ, inspect EV chargers or the shuttle van with E, or walk west into Entrance E.'
                  : 'You are in the main corridor. Pick any wing below to jump right into a department (click Kitchen R for a coffee energy boost!), or step outside Entrance E.'}
              </div>
            )}

            {/* Quick-Jump Wings */}
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span>Jump to Department</span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    teleportToTile(PARKING_SPOT.x, PARKING_SPOT.y, 'right')
                  }
                  className={`flex items-center justify-between border px-3 py-2 text-left text-xs transition-colors ${
                    currentRoomInfo.id === 'parking-lot' ||
                    currentRoomInfo.id === 'courtyard' ||
                    currentRoomInfo.id === 'lawn'
                      ? 'border-sky-400/80 bg-sky-500/10 text-sky-200'
                      : 'border-[#2D3548] bg-[#1E2432] text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate font-medium">
                    <Car className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                    <span>Outside · Parking &amp; Lawn</span>
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-[11px] text-sky-400">
                    EXT
                  </span>
                </button>
                {ROOMS.map((room) => {
                  const count = EMPLOYEES.filter(
                    (e) => e.departmentId === room.id
                  ).length;
                  const active = currentRoomInfo.id === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => teleportToRoom(room.id)}
                      className={`flex items-center justify-between border px-3 py-2 text-left text-xs transition-colors ${
                        active
                          ? 'border-amber-400/80 bg-amber-500/10 text-amber-200'
                          : 'border-[#2D3548] bg-[#1E2432] text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span className="truncate font-medium">{room.name}</span>
                      <span className="ml-2 shrink-0 font-mono text-[11px] tabular-nums text-slate-400">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
