import {
  BUILDING_OFFSET_X,
  BUILDING_OFFSET_Y,
  BulletinPost,
  Employee,
  InteractiveProp,
  PlayerProfile,
  RoomDefinition,
} from './types';

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  name: 'Alex Mercer',
  title: 'Visiting Explorer',
  appearance: {
    skinColor: '#F2C19E',
    hairStyle: 'short',
    hairColor: '#3B2820',
    shirtColor: '#F59E0B',
    pantsColor: '#2B3A55',
    accessory: 'none',
  },
};

// Exact spatial alignment matching the company floorplan & legend:
// Top row: [T (Toilet Female)|M (Meeting)]  [P (Admin)]  [F (Marketing)]  [J (Sales)]  [C (Connect)]  [i (IG Team)]  [D (Digital Team)]
// Mid row:                                 [H (HR)|M (Meeting)|M (Meeting)]  [M (Meeting)]  [M (Meeting)]  [E (Entrance)]
// Bot row: [T (Toilet Male)|Z (CEO)]       [A (AO Team)]  [O (Odoo Team)]   [S (Support)]  [X (HR Product)] [R (Kitchen Room)]
const RAW_ROOMS: RoomDefinition[] = [
  // Middle Right — E: Entrance
  {
    id: 'entrance',
    code: 'E',
    name: 'E · Entrance',
    shortName: 'E · Entrance',
    floorTheme: 'checker',
    accentColor: '#F59E0B',
    description:
      'Main east-side building entrance, visitor check-in desk, and foyer.',
    mission:
      'Welcome guests and teammates into the office promenade.',
    bounds: { x: 77, y: 19, w: 5, h: 11 },
    spawnPoint: { x: 78, y: 24 },
  },
  // Bottom Right — R: Kitchen Room
  {
    id: 'room-r',
    code: 'R',
    name: 'R · Kitchen Room',
    shortName: 'R · Kitchen',
    floorTheme: 'checker',
    accentColor: '#FB923C',
    description:
      'Company kitchen & pantry with espresso bar, refrigerator, dining tables, and snack counter.',
    mission:
      'Keep the whole office fueled with fresh coffee, cold drinks, and breaktime chats.',
    bounds: { x: 73, y: 34, w: 9, h: 13 },
    spawnPoint: { x: 76, y: 37 },
  },
  // Top Right — D: Digital Team
  {
    id: 'room-d',
    code: 'D',
    name: 'D · Digital Team',
    shortName: 'D · Digital',
    floorTheme: 'birch',
    accentColor: '#EC4899',
    description:
      'Flagship Digital Team studio building web apps, digital products, and UI systems.',
    mission:
      'Design and ship modern digital experiences, web platforms, and creative tooling.',
    bounds: { x: 65, y: 0, w: 17, h: 15 },
    spawnPoint: { x: 73, y: 12 },
  },
  // Top Left Pair — T (Female Toilet) & M (Meeting Room)
  {
    id: 'room-t-female',
    code: 'T',
    name: 'T · Toilet (Female)',
    shortName: 'T · Female WC',
    floorTheme: 'lab',
    accentColor: '#38BDF8',
    description:
      'North-west women’s restroom with tiled stalls, washbasins, and mirror.',
    mission:
      'Clean, well-lit facilities conveniently placed off the upper corridor.',
    bounds: { x: 0, y: 0, w: 8, h: 15 },
    spawnPoint: { x: 3, y: 12 },
  },
  {
    id: 'room-m-top',
    code: 'M',
    name: 'M · Meeting Room 1',
    shortName: 'M · Meeting 1',
    floorTheme: 'parquet',
    accentColor: '#D97706',
    description:
      'North-west conference room beside the upper promenade for team syncs.',
    mission:
      'Host cross-team reviews, planning sessions, and client briefings.',
    bounds: { x: 7, y: 0, w: 8, h: 15 },
    spawnPoint: { x: 10, y: 12 },
  },
  // Top Row — P: Admin, F: Marketing, J: Sales, C: Connect, i: IG Team
  {
    id: 'room-p',
    code: 'P',
    name: 'P · Admin Team',
    shortName: 'P · Admin',
    floorTheme: 'sage',
    accentColor: '#10B981',
    description:
      'Office administration, operations paperwork, procurement, and scheduling.',
    mission:
      'Keep company operations, facilities, and internal administration running smoothly.',
    bounds: { x: 18, y: 0, w: 6, h: 15 },
    spawnPoint: { x: 20, y: 12 },
  },
  {
    id: 'room-f',
    code: 'F',
    name: 'F · Marketing Team',
    shortName: 'F · Marketing',
    floorTheme: 'birch',
    accentColor: '#F43F5E',
    description:
      'Brand campaigns, social creative, product launches, and content strategy.',
    mission:
      'Grow brand awareness and craft compelling stories around our products.',
    bounds: { x: 27, y: 0, w: 6, h: 15 },
    spawnPoint: { x: 29, y: 12 },
  },
  {
    id: 'room-j',
    code: 'J',
    name: 'J · Sales Team',
    shortName: 'J · Sales',
    floorTheme: 'parquet',
    accentColor: '#8B5CF6',
    description:
      'Client outreach, enterprise proposals, demos, and revenue partnerships.',
    mission:
      'Connect prospective clients with tailored solutions across Odoo and Digital.',
    bounds: { x: 36, y: 0, w: 6, h: 15 },
    spawnPoint: { x: 38, y: 12 },
  },
  {
    id: 'room-c',
    code: 'C',
    name: 'C · Connect Team',
    shortName: 'C · Connect',
    floorTheme: 'sage',
    accentColor: '#14B8A6',
    description:
      'API integrations, partner connectors, and unified messaging infrastructure.',
    mission:
      'Bridge customer systems, third-party APIs, and internal service pipelines.',
    bounds: { x: 46, y: 0, w: 6, h: 15 },
    spawnPoint: { x: 48, y: 12 },
  },
  {
    id: 'room-i',
    code: 'i',
    name: 'i · IG Team',
    shortName: 'i · IG Team',
    floorTheme: 'lab',
    accentColor: '#0EA5E9',
    description:
      'IG Team engineering pod adjacent to the Digital Team studio.',
    mission:
      'Build and maintain IG platform services, automation, and core integrations.',
    bounds: { x: 55, y: 0, w: 7, h: 15 },
    spawnPoint: { x: 57, y: 12 },
  },

  // Middle Row — H: HR Room, M: Meeting Rooms 2..5
  {
    id: 'room-h',
    code: 'H',
    name: 'H · HR Room',
    shortName: 'H · HR Room',
    floorTheme: 'terracotta',
    accentColor: '#A855F7',
    description:
      'Human Resources room for hiring, onboarding, people ops, and employee care.',
    mission:
      'Support every teammate from recruitment through career growth.',
    bounds: { x: 18, y: 18, w: 7, h: 13 },
    spawnPoint: { x: 20, y: 21 },
  },
  {
    id: 'room-m-mid1',
    code: 'M',
    name: 'M · Meeting Room 2',
    shortName: 'M · Meeting 2',
    floorTheme: 'sage',
    accentColor: '#14B8A6',
    description:
      'Central collaboration room beside HR for interviews and sprint standups.',
    mission:
      'Host daily standups, hiring panels, and cross-functional huddles.',
    bounds: { x: 24, y: 18, w: 9, h: 13 },
    spawnPoint: { x: 28, y: 21 },
  },
  {
    id: 'room-m-mid2',
    code: 'M',
    name: 'M · Meeting Room 3',
    shortName: 'M · Meeting 3',
    floorTheme: 'birch',
    accentColor: '#EC4899',
    description:
      'Central design & product review room with whiteboard and round table.',
    mission:
      'Review architecture diagrams, sprints, and customer feedback.',
    bounds: { x: 32, y: 18, w: 9, h: 13 },
    spawnPoint: { x: 36, y: 21 },
  },
  {
    id: 'room-m-mid3',
    code: 'M',
    name: 'M · Meeting Room 4',
    shortName: 'M · Meeting 4',
    floorTheme: 'parquet',
    accentColor: '#F59E0B',
    description:
      'Mid-corridor conference suite for client demos and partner calls.',
    mission:
      'Deliver live product walkthroughs and partner alignment sessions.',
    bounds: { x: 48, y: 18, w: 9, h: 13 },
    spawnPoint: { x: 52, y: 21 },
  },
  {
    id: 'room-m-mid4',
    code: 'M',
    name: 'M · Meeting Room 5',
    shortName: 'M · Meeting 5',
    floorTheme: 'checker',
    accentColor: '#3B82F6',
    description:
      'Entrance-adjacent briefing room for quick visitor syncs and meetings.',
    mission:
      'Welcome visiting clients right off the main entrance foyer.',
    bounds: { x: 64, y: 18, w: 9, h: 13 },
    spawnPoint: { x: 68, y: 21 },
  },

  // Bottom Row — T (Male Toilet), Z (CEO Room), A (AO Team), O (Odoo Team), S (Support Team), X (HR Product Team)
  {
    id: 'room-t-male',
    code: 'T',
    name: 'T · Toilet (Male)',
    shortName: 'T · Male WC',
    floorTheme: 'lab',
    accentColor: '#38BDF8',
    description:
      'South-west men’s restroom with tiled stalls, washbasins, and mirror.',
    mission:
      'Clean, well-lit facilities conveniently placed off the lower corridor.',
    bounds: { x: 0, y: 34, w: 8, h: 13 },
    spawnPoint: { x: 3, y: 37 },
  },
  {
    id: 'room-z',
    code: 'Z',
    name: 'Z · CEO Room',
    shortName: 'Z · CEO Room',
    floorTheme: 'parquet',
    accentColor: '#D97706',
    description:
      'Executive CEO suite featuring oak desk, heritage trophy case, and strategy library.',
    mission:
      'Steer company vision, leadership alignment, and long-term growth.',
    bounds: { x: 7, y: 34, w: 8, h: 13 },
    spawnPoint: { x: 10, y: 37 },
  },
  {
    id: 'room-a',
    code: 'A',
    name: 'A · AO Team',
    shortName: 'A · AO Team',
    floorTheme: 'lab',
    accentColor: '#6366F1',
    description:
      'AO Team engineering and application operations room.',
    mission:
      'Deliver reliable automation, app operations, and technical delivery.',
    bounds: { x: 18, y: 34, w: 7, h: 13 },
    spawnPoint: { x: 20, y: 37 },
  },
  {
    id: 'room-o',
    code: 'O',
    name: 'O · Odoo Team',
    shortName: 'O · Odoo Team',
    floorTheme: 'lab',
    accentColor: '#8B5CF6',
    description:
      'Spacious Odoo ERP engineering & implementation hub along the lower corridor.',
    mission:
      'Customize, deploy, and scale Odoo ERP modules for business workflows.',
    bounds: { x: 28, y: 34, w: 13, h: 13 },
    spawnPoint: { x: 34, y: 37 },
  },
  {
    id: 'room-s',
    code: 'S',
    name: 'S · Support Team',
    shortName: 'S · Support',
    floorTheme: 'sage',
    accentColor: '#10B981',
    description:
      'Dedicated customer support and technical helpdesk wing.',
    mission:
      'Resolve client tickets quickly and keep customer uptime spotless.',
    bounds: { x: 44, y: 34, w: 7, h: 13 },
    spawnPoint: { x: 46, y: 37 },
  },
  {
    id: 'room-x',
    code: 'X',
    name: 'X · HR Product Team',
    shortName: 'X · HR Product',
    floorTheme: 'terracotta',
    accentColor: '#F97316',
    description:
      'HR Product Team building internal & commercial HR software tools.',
    mission:
      'Design and ship modern HR, payroll, and people-analytics software.',
    bounds: { x: 54, y: 34, w: 8, h: 13 },
    spawnPoint: { x: 57, y: 37 },
  },
];

const RAW_EMPLOYEES: Employee[] = [
  // Level 0: CEO (Room Z)
  {
    id: 'emp-claire',
    name: 'Claire Vance',
    role: 'Chief Executive Officer',
    departmentId: 'room-z',
    orgGroup: 'Executive',
    managerId: null,
    level: 0,
    status: 'In Sync',
    currentProject: '2027 Company Vision & Quarterly OKRs',
    skills: ['Company Strategy', 'Leadership', 'Partnerships'],
    locationLabel: 'Z · CEO Room',
    spawnTile: { x: 10, y: 39 },
    facing: 'up',
    appearance: {
      skinColor: '#F4C7A5',
      hairStyle: 'bob',
      hairColor: '#2D1E1A',
      shirtColor: '#1E293B',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to headquarters! You stepped in from Entrance E on the east—feel free to visit every team from Digital (D) to Odoo (O).',
      workingOn:
        'Reviewing Q4 goals across Digital, Odoo, HR Product, IG, Connect, and our Growth teams.',
      teamSummary:
        'I work directly with our five division leads overseeing Tech & Product, Growth & Sales, People & Admin, and Support & Ops.',
      officeSecret:
        'Check out the Heritage Trophy Case right beside my desk in CEO Room Z!',
    },
  },

  // Level 1: Division Heads (5 Direct Reports to CEO)
  {
    id: 'emp-devon',
    name: 'Devon Brooks',
    role: 'Head of Digital & Engineering',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-claire',
    level: 1,
    status: 'Reviewing Work',
    currentProject: 'Digital Platform & Odoo Sync',
    skills: ['Architecture', 'TypeScript', 'ERP Systems'],
    locationLabel: 'D · Long Desk 1 · Seat 01',
    spawnTile: { x: 67, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#C68642',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#2563EB',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to Digital Team (D)! All 26 of us collaborate across these two long studio desks.',
      workingOn:
        'Coordinating API bridges between our Digital apps, Odoo ERP, and IG services.',
      teamSummary:
        'I report to Claire in CEO Room Z and lead all 26 Digital Team members plus Odoo (O), IG (i), Connect (C), and AO (A).',
      officeSecret:
        'Every single member in Digital (D) owns their own workstation seat along Long Desk 1 or Long Desk 2.',
    },
  },
  {
    id: 'emp-maya',
    name: 'Maya Patel',
    role: 'Head of Growth (Marketing & Sales)',
    departmentId: 'room-f',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-claire',
    level: 1,
    status: 'In Sync',
    currentProject: 'Q1 Brand & Sales Pipeline',
    skills: ['Growth Strategy', 'Marketing', 'B2B Sales'],
    locationLabel: 'F · Marketing Team',
    spawnTile: { x: 29, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#A86B3E',
      hairStyle: 'ponytail',
      hairColor: '#18181B',
      shirtColor: '#E11D48',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Welcome to Marketing Team (F)! Right next door is Sales Team (J).',
      workingOn:
        'Aligning new product launch campaigns with our Sales Team (J) pipeline.',
      teamSummary:
        'I report to Claire and lead Marketing (F), Sales (J), and Brand Creative.',
      officeSecret:
        'Check the campaign whiteboard right behind me—every launch milestone is tracked there.',
    },
  },
  {
    id: 'emp-priya',
    name: 'Priya Nair',
    role: 'Head of People & Admin',
    departmentId: 'room-h',
    orgGroup: 'People & Admin',
    managerId: 'emp-claire',
    level: 1,
    status: 'Available',
    currentProject: 'HR Ops & HR Product Alignment',
    skills: ['People Ops', 'HR Strategy', 'Administration'],
    locationLabel: 'H · HR Room',
    spawnTile: { x: 21, y: 22 },
    facing: 'up',
    appearance: {
      skinColor: '#9C6137',
      hairStyle: 'curly',
      hairColor: '#18181B',
      shirtColor: '#7C3AED',
      pantsColor: '#1E293B',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Welcome to HR Room (H)! Right next door are our central Meeting Rooms (M).',
      workingOn:
        'Partnering with our HR Product Team (X) and Admin Team (P) to streamline onboarding.',
      teamSummary:
        'I report to Claire and lead HR Room (H), HR Product Team (X), and Admin Team (P).',
      officeSecret:
        'Need coffee or a snack? Head east down the lower corridor to Kitchen Room (R)!',
    },
  },
  {
    id: 'emp-marcus',
    name: 'Marcus Sterling',
    role: 'Head of Support & Facilities',
    departmentId: 'room-s',
    orgGroup: 'Support & Ops',
    managerId: 'emp-claire',
    level: 1,
    status: 'Deep Focus',
    currentProject: 'SLA Excellence & Workplace Care',
    skills: ['Customer Support', 'Service Ops', 'Facilities'],
    locationLabel: 'S · Support Team',
    spawnTile: { x: 47, y: 38 },
    facing: 'up',
    appearance: {
      skinColor: '#8D5524',
      hairStyle: 'short',
      hairColor: '#1A1A1A',
      shirtColor: '#059669',
      pantsColor: '#1E293B',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Hey there! Welcome to Support Team (S)—right between Odoo Team (O) and HR Product (X).',
      workingOn:
        'Keeping response times under 15 minutes and managing Entrance (E) and Kitchen (R) hospitality.',
      teamSummary:
        'I report to Claire and oversee Support Team (S), Kitchen Room (R), and Entrance (E).',
      officeSecret:
        'The espresso bar in Kitchen Room (R) has freshly roasted beans every Monday morning.',
    },
  },
  {
    id: 'emp-sora',
    name: 'Sora Takahashi',
    role: 'Program & Meeting Coordinator',
    departmentId: 'room-m-top',
    orgGroup: 'Executive',
    managerId: 'emp-claire',
    level: 1,
    status: 'Reviewing Work',
    currentProject: 'Cross-Team Meeting Cadence',
    skills: ['Program Management', 'Operations', 'Facilitation'],
    locationLabel: 'M · Meeting Room 1',
    spawnTile: { x: 10, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#F8D4B4',
      hairStyle: 'ponytail',
      hairColor: '#1F1B24',
      shirtColor: '#B45309',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Welcome to Meeting Room 1 (M)! We have five dedicated Meeting Rooms (M) across HQ.',
      workingOn:
        'Coordinating weekly syncs across Digital, Odoo, Sales, and HR teams.',
      teamSummary:
        'I report to Claire and keep every Meeting Room (M) organized and ready for teams.',
      officeSecret:
        'Restrooms (T) are located on both the top-left and bottom-left corners of the floor.',
    },
  },

  // Level 2 & 3: Digital Team (26 Members across Long Desk 1 & Long Desk 2)
  // Long Desk 1 North (y=3, facing down): Seats 01..07
  // Note: Seat 01 is Devon Brooks above at (67, 3)
  {
    id: 'emp-aria',
    name: 'Aria Chen',
    role: 'Digital Design Lead',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'In Sync',
    currentProject: 'Digital Design System v3',
    skills: ['UI/UX Design', 'Design Systems', 'Pixel Art'],
    locationLabel: 'D · Long Desk 1 · Seat 02',
    spawnTile: { x: 69, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#F3C9A8',
      hairStyle: 'bob',
      hairColor: '#1E1B4B',
      shirtColor: '#DB2777',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to Digital Team (D)! Seat 02 on Long Desk 1 is my home base.',
      workingOn:
        'Refining our company-wide design tokens and leading our 7 Digital designers.',
      teamSummary:
        'I report to Devon right beside me at Seat 01 and lead the Digital Design squad.',
      officeSecret:
        'Check out Kai’s pixel easel in the southeast corner of our room!',
    },
  },
  {
    id: 'emp-mateo',
    name: 'Mateo Silva',
    role: 'Digital Frontend Lead',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Interactive Web & Canvas Apps',
    skills: ['TypeScript', 'React', 'HTML5 Canvas'],
    locationLabel: 'D · Long Desk 1 · Seat 03',
    spawnTile: { x: 71, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#D99B66',
      hairStyle: 'curly',
      hairColor: '#2C1D14',
      shirtColor: '#4F46E5',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey from Seat 03 on Long Desk 1! Building smooth interactive interfaces here in Digital Team (D).',
      workingOn:
        'Shipping zero-lag pathfinding and crisp pixel rendering across the workspace.',
      teamSummary:
        'I report to Devon and mentor our 8 Digital Frontend & Mobile engineers.',
      officeSecret:
        'Click any tile on the floor or any room on the minimap to walk there automatically.',
    },
  },
  {
    id: 'emp-tariq',
    name: 'Tariq Hassan',
    role: 'Digital Backend & Cloud Lead',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Digital Microservices & AI Pipelines',
    skills: ['Node.js', 'Go', 'PostgreSQL'],
    locationLabel: 'D · Long Desk 1 · Seat 04',
    spawnTile: { x: 73, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#A86B3E',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#0284C7',
      pantsColor: '#0F172A',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hi from Seat 04! Keeping our Digital APIs fast and resilient.',
      workingOn:
        'Scaling GraphQL endpoints and mentoring our 7 Backend & Cloud engineers.',
      teamSummary:
        'I report to Devon and partner closely with Mateo and Aria along Long Desk 1.',
      officeSecret:
        'Our two long desks sit face-to-face so pairing takes two seconds.',
    },
  },
  {
    id: 'emp-kai',
    name: 'Kai Morales',
    role: 'Lead Pixel Illustrator',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Brand Icons & Pixel Sprites',
    skills: ['Illustration', 'Pixel Art', 'Motion'],
    locationLabel: 'D · Long Desk 1 · Seat 05',
    spawnTile: { x: 75, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#D69968',
      hairStyle: 'cap',
      hairColor: '#27272A',
      shirtColor: '#E11D48',
      pantsColor: '#334155',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey from Seat 05! Every character and long desk is rendered pixel by pixel.',
      workingOn:
        'Creating custom sprites for Digital (D), Kitchen (R), and CEO Room (Z).',
      teamSummary:
        'Part of Aria’s Digital Design squad right here along Long Desk 1.',
      officeSecret:
        'Click "Edit Avatar" in the top bar anytime to customize your own character.',
    },
  },
  {
    id: 'emp-chloe',
    name: 'Chloe Mercer',
    role: 'Senior UI Designer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Enterprise Client Portal UI',
    skills: ['UI Design', 'Figma', 'Prototyping'],
    locationLabel: 'D · Long Desk 1 · Seat 06',
    spawnTile: { x: 77, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#B45309',
      shirtColor: '#EC4899',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome! Checking in from Seat 06 on Long Desk 1.',
      workingOn:
        'Polishing responsive dashboard components for our Digital client portal.',
      teamSummary:
        'I report to Aria Chen in the Digital Design squad.',
      officeSecret:
        'You can walk right between our seats along the studio aisles.',
    },
  },
  {
    id: 'emp-ethan',
    name: 'Ethan Nakamura',
    role: 'Senior React Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Next.js App Router Architecture',
    skills: ['React', 'Next.js', 'Performance'],
    locationLabel: 'D · Long Desk 1 · Seat 07',
    spawnTile: { x: 79, y: 3 },
    facing: 'down',
    appearance: {
      skinColor: '#F4C7A5',
      hairStyle: 'spiky',
      hairColor: '#18181B',
      shirtColor: '#2563EB',
      pantsColor: '#0F172A',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hi from Seat 07 at the east end of Long Desk 1!',
      workingOn:
        'Optimizing server components and client bundle splitting.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'The corner window right beside my seat has the best morning light in HQ.',
    },
  },
  // Long Desk 1 South (y=5, facing up): Seats 08..14
  {
    id: 'emp-mei',
    name: 'Mei Lin',
    role: 'Product Designer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'In Sync',
    currentProject: 'Mobile App Onboarding Flow',
    skills: ['UX Design', 'Wireframing', 'User Flows'],
    locationLabel: 'D · Long Desk 1 · Seat 08',
    spawnTile: { x: 67, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#F5CFA8',
      hairStyle: 'bob',
      hairColor: '#1C1917',
      shirtColor: '#F43F5E',
      pantsColor: '#1E293B',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Hello from Seat 08 on the south side of Long Desk 1!',
      workingOn:
        'Designing streamlined mobile onboarding screens for our client apps.',
      teamSummary:
        'Working with Aria’s Digital Design squad.',
      officeSecret:
        'Devon sits directly across the monitor rail from me for quick design checks.',
    },
  },
  {
    id: 'emp-lucas',
    name: 'Lucas Moreau',
    role: 'TypeScript Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Shared State & SDK Core',
    skills: ['TypeScript', 'State Machines', 'Testing'],
    locationLabel: 'D · Long Desk 1 · Seat 09',
    spawnTile: { x: 69, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'parted',
      hairColor: '#5C3A21',
      shirtColor: '#4F46E5',
      pantsColor: '#334155',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hey! Sitting at Seat 09 along Long Desk 1.',
      workingOn:
        'Writing strict TypeScript SDK packages shared across all Digital apps.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'Try zooming out to 1x in the top-right corner to see our whole studio at once!',
    },
  },
  {
    id: 'emp-amara',
    name: 'Amara Diallo',
    role: 'Design Systems Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Accessible UI Component Library',
    skills: ['Accessibility', 'CSS', 'Design Tokens'],
    locationLabel: 'D · Long Desk 1 · Seat 10',
    spawnTile: { x: 71, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#6F4324',
      hairStyle: 'curly',
      hairColor: '#171717',
      shirtColor: '#DB2777',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hi there from Seat 10! Keeping our components accessible and consistent.',
      workingOn:
        'Auditing keyboard focus states and contrast ratios across Digital products.',
      teamSummary:
        'Bridging Aria’s Design squad and Mateo’s Frontend engineers.',
      officeSecret:
        'Our studio whiteboard on the north wall updates every sprint.',
    },
  },
  {
    id: 'emp-noah-d',
    name: 'Noah Lindholm',
    role: 'Full-Stack Developer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'E-Commerce Checkout Engine',
    skills: ['Next.js', 'PostgreSQL', 'Stripe'],
    locationLabel: 'D · Long Desk 1 · Seat 11',
    spawnTile: { x: 73, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'short',
      hairColor: '#D97706',
      shirtColor: '#0EA5E9',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey! Checking in from Seat 11 on Long Desk 1.',
      workingOn:
        'Building multi-currency checkout flows with instant webhook verification.',
      teamSummary:
        'Reporting to Tariq in the Digital Backend & Full-Stack squad.',
      officeSecret:
        'Kitchen Room (R) espresso keeps this whole row running after 2 PM.',
    },
  },
  {
    id: 'emp-sofia',
    name: 'Sofia Alvarez',
    role: 'Motion & Interaction Designer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Available',
    currentProject: 'Micro-Interaction Transitions',
    skills: ['Motion Design', 'SVG', 'CSS Animation'],
    locationLabel: 'D · Long Desk 1 · Seat 12',
    spawnTile: { x: 75, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#DF9F71',
      hairStyle: 'ponytail',
      hairColor: '#2D1E1A',
      shirtColor: '#9333EA',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hi from Seat 12! Making transitions feel snappy and effortless.',
      workingOn:
        'Designing lightweight 200ms motion curves for our web interfaces.',
      teamSummary:
        'Part of Aria’s Digital Design squad.',
      officeSecret:
        'Notice the animated steam over the espresso counter in Kitchen Room (R)!',
    },
  },
  {
    id: 'emp-kenji',
    name: 'Kenji Sato',
    role: 'Mobile App Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'iOS & Android Companion App',
    skills: ['React Native', 'Swift', 'Kotlin'],
    locationLabel: 'D · Long Desk 1 · Seat 13',
    spawnTile: { x: 77, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#F4C7A5',
      hairStyle: 'parted',
      hairColor: '#18181B',
      shirtColor: '#3B82F6',
      pantsColor: '#0F172A',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hey there from Seat 13 on Long Desk 1!',
      workingOn:
        'Polishing offline sync for our cross-platform mobile releases.',
      teamSummary:
        'Working under Mateo in the Digital Frontend & Mobile squad.',
      officeSecret:
        'IG Team (i) right next door shares our mobile push notification pipeline.',
    },
  },
  {
    id: 'emp-zara',
    name: 'Zara Khan',
    role: 'Cloud API Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'In Sync',
    currentProject: 'Edge Caching & Rate Limiting',
    skills: ['Cloudflare', 'REST APIs', 'Redis'],
    locationLabel: 'D · Long Desk 1 · Seat 14',
    spawnTile: { x: 79, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#C68642',
      hairStyle: 'bob',
      hairColor: '#18181B',
      shirtColor: '#0D9488',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to Seat 14! Finishing up edge cache tuning right now.',
      workingOn:
        'Cutting API p95 latency in half across our global regions.',
      teamSummary:
        'Reporting to Tariq in the Digital Backend & Cloud squad.',
      officeSecret:
        'This double-row long desk setup lets all 14 of us collaborate in one glance.',
    },
  },
  // Long Desk 2 North (y=8, facing down): Seats 15..21
  {
    id: 'emp-liam',
    name: "Liam O'Connor",
    role: 'Frontend Developer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Interactive Data Tables',
    skills: ['React', 'Tailwind CSS', 'TypeScript'],
    locationLabel: 'D · Long Desk 2 · Seat 15',
    spawnTile: { x: 67, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'curly',
      hairColor: '#9A3412',
      shirtColor: '#2563EB',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Top of the morning from Seat 15 on Long Desk 2!',
      workingOn:
        'Building sortable virtualized grids for enterprise reporting.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'Long Desk 2 has 12 of us right across the studio aisle from Long Desk 1.',
    },
  },
  {
    id: 'emp-nadia',
    name: 'Nadia Petrov',
    role: 'Backend Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Webhook Event Processor',
    skills: ['Go', 'Kafka', 'Docker'],
    locationLabel: 'D · Long Desk 2 · Seat 16',
    spawnTile: { x: 69, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#F9D8BD',
      hairStyle: 'ponytail',
      hairColor: '#451A03',
      shirtColor: '#0284C7',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hi from Seat 16 on Long Desk 2!',
      workingOn:
        'Hardening retry queues for high-throughput client webhooks.',
      teamSummary:
        'Part of Tariq’s Digital Backend squad.',
      officeSecret:
        'Connect Team (C) consumes the event stream we publish right here.',
    },
  },
  {
    id: 'emp-daniel',
    name: 'Daniel Cho',
    role: 'Visual Brand Designer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Available',
    currentProject: '2027 Brand Identity Kit',
    skills: ['Branding', 'Typography', 'Layout'],
    locationLabel: 'D · Long Desk 2 · Seat 17',
    spawnTile: { x: 71, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#F5CFA8',
      hairStyle: 'parted',
      hairColor: '#18181B',
      shirtColor: '#E11D48',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey from Seat 17! Polishing our typographic hierarchy and icons.',
      workingOn:
        'Updating brand guidelines for Marketing (F) and Sales (J).',
      teamSummary:
        'Part of Aria’s Digital Design squad.',
      officeSecret:
        'Every team wing uses a distinct floor material so you always know where you are.',
    },
  },
  {
    id: 'emp-yuki',
    name: 'Yuki Tanaka',
    role: 'Canvas & Graphics Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Tilemap Lighting & Camera',
    skills: ['HTML5 Canvas', 'WebGL', 'Shaders'],
    locationLabel: 'D · Long Desk 2 · Seat 18',
    spawnTile: { x: 73, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#F8D4B4',
      hairStyle: 'bob',
      hairColor: '#1F1B24',
      shirtColor: '#4F46E5',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hi! Sitting at Seat 18 tuning our 60fps canvas renderer.',
      workingOn:
        'Keeping sprite depth sorting and camera pan silky smooth.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'Y-sorting runs every animation frame so avatars naturally step behind and in front of desks.',
    },
  },
  {
    id: 'emp-omar',
    name: 'Omar Farooq',
    role: 'Platform Reliability Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'CI/CD Build Acceleration',
    skills: ['Kubernetes', 'GitHub Actions', 'Terraform'],
    locationLabel: 'D · Long Desk 2 · Seat 19',
    spawnTile: { x: 75, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#B87A4B',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#0F766E',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hello from Seat 19 on Long Desk 2!',
      workingOn:
        'Trimming our Digital Team build times down under 45 seconds.',
      teamSummary:
        'Part of Tariq’s Digital Backend & Cloud squad.',
      officeSecret:
        'I regularly sync with Nina over in IG Team (i) on shared infrastructure.',
    },
  },
  {
    id: 'emp-freya',
    name: 'Freya Holm',
    role: 'Digital Illustrator',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Isometric & Pixel Asset Pack',
    skills: ['Illustration', 'Color Theory', 'Storyboarding'],
    locationLabel: 'D · Long Desk 2 · Seat 20',
    spawnTile: { x: 77, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#EAB308',
      shirtColor: '#EC4899',
      pantsColor: '#334155',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Hi from Seat 20! Sketching new office plants and furniture sprites.',
      workingOn:
        'Illustrating seasonal banners for our marketing and product pages.',
      teamSummary:
        'Part of Aria’s Digital Design squad.',
      officeSecret:
        'The easel just south of my seat holds our studio color swatches.',
    },
  },
  {
    id: 'emp-isaac',
    name: 'Isaac Mensah',
    role: 'Next.js Web Developer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'In Sync',
    currentProject: 'SEO & Landing Architecture',
    skills: ['Next.js', 'SSR', 'Core Web Vitals'],
    locationLabel: 'D · Long Desk 2 · Seat 21',
    spawnTile: { x: 79, y: 8 },
    facing: 'down',
    appearance: {
      skinColor: '#6F4324',
      hairStyle: 'short',
      hairColor: '#171717',
      shirtColor: '#3B82F6',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to Seat 21 at the east end of Long Desk 2!',
      workingOn:
        'Improving Core Web Vitals and server rendering across client sites.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'Walk straight south out of Digital (D) and you’ll see Meeting Room 5 (M) and Entrance (E).',
    },
  },
  // Long Desk 2 South (y=10, facing up): Seats 22..26
  {
    id: 'emp-clara',
    name: 'Clara Rossi',
    role: 'UX Designer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-aria',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Customer Journey Mapping',
    skills: ['UX Flows', 'Wireframing', 'Usability'],
    locationLabel: 'D · Long Desk 2 · Seat 22',
    spawnTile: { x: 67, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'curly',
      hairColor: '#3B2820',
      shirtColor: '#DB2777',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Ciao from Seat 22 on the south side of Long Desk 2!',
      workingOn:
        'Mapping smoother multi-step forms for our web clients.',
      teamSummary:
        'Part of Aria’s Digital Design squad.',
      officeSecret:
        'Toby in HR Product (X) shares UX research notes with us every Thursday.',
    },
  },
  {
    id: 'emp-arjun',
    name: 'Arjun Mehta',
    role: 'Database & Query Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'PostgreSQL Indexing & Sharding',
    skills: ['PostgreSQL', 'SQL Tuning', 'Data Modeling'],
    locationLabel: 'D · Long Desk 2 · Seat 23',
    spawnTile: { x: 69, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#A86B3E',
      hairStyle: 'parted',
      hairColor: '#18181B',
      shirtColor: '#0284C7',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hi from Seat 23! Keeping our SQL queries sub-10ms.',
      workingOn:
        'Designing clean relational schemas and zero-downtime migrations.',
      teamSummary:
        'Part of Tariq’s Digital Backend squad.',
      officeSecret:
        'AO Team (A) and Odoo Team (O) downstairs run on our shared database standards.',
    },
  },
  {
    id: 'emp-ruby',
    name: 'Ruby Sterling',
    role: 'Frontend QA Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-mateo',
    level: 3,
    status: 'Available',
    currentProject: 'E2E Browser Test Suite',
    skills: ['Playwright', 'Visual Regression', 'QA'],
    locationLabel: 'D · Long Desk 2 · Seat 24',
    spawnTile: { x: 71, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#F4C7A5',
      hairStyle: 'spiky',
      hairColor: '#DC2626',
      shirtColor: '#4F46E5',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hey from Seat 24! Catching UI edge cases before they ever hit production.',
      workingOn:
        'Running automated Playwright suites across every screen size.',
      teamSummary:
        'Part of Mateo’s Digital Frontend squad.',
      officeSecret:
        'Right behind our seats is the main doorway leading down to the promenade!',
    },
  },
  {
    id: 'emp-victor',
    name: 'Victor Hugo',
    role: 'DevTools & CLI Engineer',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Internal Developer CLI',
    skills: ['Rust', 'Node.js', 'Tooling'],
    locationLabel: 'D · Long Desk 2 · Seat 25',
    spawnTile: { x: 73, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#D99B66',
      hairStyle: 'cap',
      hairColor: '#1F2937',
      shirtColor: '#0D9488',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey there from Seat 25 on Long Desk 2!',
      workingOn:
        'Building local dev scaffolding tools that spin up services in one command.',
      teamSummary:
        'Part of Tariq’s Digital Backend squad.',
      officeSecret:
        'All 26 of us in Digital (D) fit comfortably here with wide walking aisles.',
    },
  },
  {
    id: 'emp-anya',
    name: 'Anya Volkov',
    role: 'Digital Product Analyst',
    departmentId: 'room-d',
    orgGroup: 'Tech & Product',
    managerId: 'emp-tariq',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Feature Telemetry & Funnels',
    skills: ['Product Analytics', 'SQL', 'A/B Testing'],
    locationLabel: 'D · Long Desk 2 · Seat 26',
    spawnTile: { x: 75, y: 10 },
    facing: 'up',
    appearance: {
      skinColor: '#F9D8BD',
      hairStyle: 'bob',
      hairColor: '#A16207',
      shirtColor: '#7C3AED',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hello from Seat 26! Wrapping up our 26-seat Digital Team studio row.',
      workingOn:
        'Tracking feature adoption metrics across every Digital product launch.',
      teamSummary:
        'Part of Tariq’s Digital Backend & Data squad.',
      officeSecret:
        'Right beside my seat is Kai’s sprite easel—walk over and press E to inspect it!',
    },
  },
  {
    id: 'emp-lin',
    name: 'Lin Wei',
    role: 'Odoo Team Lead',
    departmentId: 'room-o',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Odoo 18 Custom ERP Modules',
    skills: ['Odoo', 'Python', 'PostgreSQL'],
    locationLabel: 'O · Odoo Team',
    spawnTile: { x: 30, y: 39 },
    facing: 'up',
    appearance: {
      skinColor: '#F5CFA8',
      hairStyle: 'parted',
      hairColor: '#1C1917',
      shirtColor: '#7C3AED',
      pantsColor: '#334155',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Welcome to Odoo Team (O)! Our 4-person ERP engineering pod handles deployments and custom modules.',
      workingOn:
        'Building automated inventory, accounting, and CRM workflows in Odoo.',
      teamSummary:
        'I lead Leo, Ravi, and Sienna here in Odoo Team (O), reporting to Devon.',
      officeSecret:
        'Check the Sprint Board on our north wall in Odoo Team (O) for active client sprints.',
    },
  },
  {
    id: 'emp-leo',
    name: 'Leo Okafor',
    role: 'Odoo Functional & QA Specialist',
    departmentId: 'room-o',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Available',
    currentProject: 'Odoo Payroll & HR Sync',
    skills: ['Odoo ERP', 'QA Automation', 'Workflows'],
    locationLabel: 'O · Odoo Team',
    spawnTile: { x: 36, y: 39 },
    facing: 'up',
    appearance: {
      skinColor: '#6F4324',
      hairStyle: 'spiky',
      hairColor: '#171717',
      shirtColor: '#6D28D9',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hey! Right here in Odoo Team (O) testing end-to-end ERP migrations.',
      workingOn:
        'Integrating Odoo HR modules with our HR Product Team (X) across the hall.',
      teamSummary:
        'Collaborating with Lin, Ravi, and Sienna in Odoo Team (O).',
      officeSecret:
        'I hold the high score of 48,200 on the arcade cabinet inside Kitchen Room (R)!',
    },
  },
  {
    id: 'emp-ravi',
    name: 'Ravi Kapoor',
    role: 'Odoo Python Engineer',
    departmentId: 'room-o',
    orgGroup: 'Tech & Product',
    managerId: 'emp-lin',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Odoo Accounting & Tax Engine',
    skills: ['Python', 'Odoo ORM', 'PostgreSQL'],
    locationLabel: 'O · Odoo Team',
    spawnTile: { x: 30, y: 43 },
    facing: 'up',
    appearance: {
      skinColor: '#B87A4B',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#8B5CF6',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hi! Welcome to Odoo Team (O)—tuning custom ORM queries and accounting reports.',
      workingOn:
        'Optimizing batch invoice generation for enterprise Odoo rollouts.',
      teamSummary:
        'Part of Lin’s Odoo Team (O) alongside Leo and Sienna.',
      officeSecret:
        'I usually sneak over to Kitchen Room (R) around mid-afternoon for an iced latte.',
    },
  },
  {
    id: 'emp-sienna',
    name: 'Sienna Becker',
    role: 'Odoo Integration Specialist',
    departmentId: 'room-o',
    orgGroup: 'Tech & Product',
    managerId: 'emp-lin',
    level: 3,
    status: 'In Sync',
    currentProject: 'Warehouse Barcode & Connect Sync',
    skills: ['Odoo Logistics', 'XML-RPC', 'REST APIs'],
    locationLabel: 'O · Odoo Team',
    spawnTile: { x: 36, y: 43 },
    facing: 'up',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#7C2D12',
      shirtColor: '#6366F1',
      pantsColor: '#334155',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey there! Linking Odoo warehouse scanners with Connect Team (C) APIs.',
      workingOn:
        'Testing real-time stock sync hooks across multi-warehouse deployments.',
      teamSummary:
        'Reporting to Lin Wei right here in Odoo Team (O).',
      officeSecret:
        'Meeting Room 3 (M) across the corridor is our favorite spot for client ERP demos.',
    },
  },
  {
    id: 'emp-nina',
    name: 'Nina Lindqvist',
    role: 'IG Team Lead',
    departmentId: 'room-i',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Available',
    currentProject: 'IG Core Platform Services',
    skills: ['Cloud Infra', 'IG Systems', 'Kubernetes'],
    locationLabel: 'i · IG Team',
    spawnTile: { x: 58, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#D97706',
      shirtColor: '#0284C7',
      pantsColor: '#0F172A',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Welcome to IG Team (i)! Tomas, Yuna, and I run IG services right beside Digital Team (D).',
      workingOn:
        'Scaling IG Team microservices and monitoring cluster diagnostics.',
      teamSummary:
        'I lead our 3-person IG Team (i) pod under Devon.',
      officeSecret:
        'You can inspect our live server rack right here in IG Team (i) by pressing E!',
    },
  },
  {
    id: 'emp-tomas',
    name: 'Tomas Novak',
    role: 'IG Platform Engineer',
    departmentId: 'room-i',
    orgGroup: 'Tech & Product',
    managerId: 'emp-nina',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'IG Telemetry & Failover Mesh',
    skills: ['Go', 'Kubernetes', 'Prometheus'],
    locationLabel: 'i · IG Team',
    spawnTile: { x: 58, y: 8 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'parted',
      hairColor: '#5C3A21',
      shirtColor: '#0EA5E9',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hey from IG Team (i)! Keeping every IG cluster node green and responsive.',
      workingOn:
        'Automating zero-downtime failover across our IG edge regions.',
      teamSummary:
        'Working with Nina and Yuna right here in IG Team (i).',
      officeSecret:
        'Whenever that server rack LED turns amber, I check diagnostics immediately.',
    },
  },
  {
    id: 'emp-yuna',
    name: 'Yuna Choi',
    role: 'IG Automation Engineer',
    departmentId: 'room-i',
    orgGroup: 'Tech & Product',
    managerId: 'emp-nina',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'IG Release Pipelines',
    skills: ['TypeScript', 'Terraform', 'CI/CD'],
    locationLabel: 'i · IG Team',
    spawnTile: { x: 58, y: 11 },
    facing: 'up',
    appearance: {
      skinColor: '#F5CFA8',
      hairStyle: 'bob',
      hairColor: '#18181B',
      shirtColor: '#0369A1',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hi! Welcome to IG Team (i)—streamlining deployment automation.',
      workingOn:
        'Building one-click staging environments for IG and Digital engineers.',
      teamSummary:
        'Reporting to Nina in the 3-member IG Team (i).',
      officeSecret:
        'Digital Team (D) next door always shares snack runs from Kitchen Room (R) with us.',
    },
  },
  {
    id: 'emp-sam',
    name: 'Sam Rivera',
    role: 'Connect Team Lead',
    departmentId: 'room-c',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Connect API Gateway & Webhooks',
    skills: ['APIs', 'Integrations', 'Node.js'],
    locationLabel: 'C · Connect Team',
    spawnTile: { x: 48, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#E0AC80',
      hairStyle: 'parted',
      hairColor: '#3F271E',
      shirtColor: '#0D9488',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Welcome to Connect Team (C)! Nadim, Grace, and I link partner platforms with internal tools.',
      workingOn:
        'Shipping real-time webhook connectors between Connect, Odoo, and IG.',
      teamSummary:
        'Leading our 3-member Connect Team (C) under Devon.',
      officeSecret:
        'Meeting Room 4 (M) right across the corridor is our go-to spot for API design syncs.',
    },
  },
  {
    id: 'emp-nadim',
    name: 'Nadim Haddad',
    role: 'API Gateway Engineer',
    departmentId: 'room-c',
    orgGroup: 'Tech & Product',
    managerId: 'emp-sam',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'OAuth Token Vault & Rate Guards',
    skills: ['Node.js', 'OAuth 2.0', 'Redis'],
    locationLabel: 'C · Connect Team',
    spawnTile: { x: 48, y: 8 },
    facing: 'up',
    appearance: {
      skinColor: '#C68B59',
      hairStyle: 'curly',
      hairColor: '#18181B',
      shirtColor: '#14B8A6',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hello from Connect Team (C)! Securing our external API gateway.',
      workingOn:
        'Adding per-partner token rotation and low-latency rate limiting.',
      teamSummary:
        'Part of Sam’s Connect Team (C) alongside Grace.',
      officeSecret:
        'Sales Team (J) next door often pops in to ask about custom client connectors.',
    },
  },
  {
    id: 'emp-grace',
    name: 'Grace Osei',
    role: 'Partner Integrations Engineer',
    departmentId: 'room-c',
    orgGroup: 'Tech & Product',
    managerId: 'emp-sam',
    level: 3,
    status: 'Available',
    currentProject: 'CRM & ERP Webhook Bridges',
    skills: ['Webhooks', 'TypeScript', 'GraphQL'],
    locationLabel: 'C · Connect Team',
    spawnTile: { x: 48, y: 11 },
    facing: 'up',
    appearance: {
      skinColor: '#6F4324',
      hairStyle: 'ponytail',
      hairColor: '#171717',
      shirtColor: '#0F766E',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Welcome to Connect Team (C)! Keeping partner data flowing cleanly.',
      workingOn:
        'Onboarding two new enterprise webhook schemas for Odoo and Digital.',
      teamSummary:
        'Reporting to Sam Rivera right here in Connect Team (C).',
      officeSecret:
        'I grab a quick stretch walk down the upper promenade every hour.',
    },
  },
  {
    id: 'emp-zoe',
    name: 'Zoe Kim',
    role: 'AO Team Lead',
    departmentId: 'room-a',
    orgGroup: 'Tech & Product',
    managerId: 'emp-devon',
    level: 2,
    status: 'Reviewing Work',
    currentProject: 'AO Automation & Ops Tooling',
    skills: ['App Ops', 'Automation', 'Analytics'],
    locationLabel: 'A · AO Team',
    spawnTile: { x: 21, y: 38 },
    facing: 'up',
    appearance: {
      skinColor: '#F5D0AD',
      hairStyle: 'bob',
      hairColor: '#171717',
      shirtColor: '#4F46E5',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to AO Team (A)! Diego, Hannah, and I run application operations right between CEO Room (Z) and Odoo (O).',
      workingOn:
        'Automating internal app deployments and operational dashboards.',
      teamSummary:
        'I lead our 3-person AO Team (A), reporting to Devon in Digital.',
      officeSecret:
        'Click any lettered room on the bottom-left minimap to jump straight between teams.',
    },
  },
  {
    id: 'emp-diego',
    name: 'Diego Santos',
    role: 'AO Systems Engineer',
    departmentId: 'room-a',
    orgGroup: 'Tech & Product',
    managerId: 'emp-zoe',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'AO Runbook Automation',
    skills: ['Python', 'Linux', 'Observability'],
    locationLabel: 'A · AO Team',
    spawnTile: { x: 21, y: 41 },
    facing: 'up',
    appearance: {
      skinColor: '#D69968',
      hairStyle: 'spiky',
      hairColor: '#27272A',
      shirtColor: '#4338CA',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hey from AO Team (A)! Making sure every internal service stays healthy.',
      workingOn:
        'Converting manual ops checklists into self-healing scripts.',
      teamSummary:
        'Working under Zoe alongside Hannah in AO Team (A).',
      officeSecret:
        'HR Room (H) is straight up across the lower corridor when we coordinate onboarding access.',
    },
  },
  {
    id: 'emp-hannah',
    name: 'Hannah Brooks',
    role: 'AO Release Specialist',
    departmentId: 'room-a',
    orgGroup: 'Tech & Product',
    managerId: 'emp-zoe',
    level: 3,
    status: 'In Sync',
    currentProject: 'Weekly Release Cadence & Audits',
    skills: ['Release Ops', 'QA', 'Dashboards'],
    locationLabel: 'A · AO Team',
    spawnTile: { x: 21, y: 44 },
    facing: 'up',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#B45309',
      shirtColor: '#6366F1',
      pantsColor: '#334155',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hi there from AO Team (A)! Coordinating release windows across teams.',
      workingOn:
        'Verifying pre-release checks with Odoo (O) and Digital (D) leads.',
      teamSummary:
        'Part of Zoe’s 3-member AO Team (A).',
      officeSecret:
        'Claire next door in CEO Room (Z) occasionally drops in to say hello during morning coffee.',
    },
  },

  // Level 2: Support Team (S — Marcus + Elise + Brennan)
  {
    id: 'emp-elise',
    name: 'Elise Fontaine',
    role: 'Senior Support Engineer',
    departmentId: 'room-s',
    orgGroup: 'Support & Ops',
    managerId: 'emp-marcus',
    level: 2,
    status: 'In Sync',
    currentProject: 'Tier-2 Escalations & Client SLA',
    skills: ['Troubleshooting', 'SQL', 'Client Care'],
    locationLabel: 'S · Support Team',
    spawnTile: { x: 47, y: 41 },
    facing: 'up',
    appearance: {
      skinColor: '#F9D8BD',
      hairStyle: 'bob',
      hairColor: '#5C3A21',
      shirtColor: '#10B981',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Welcome to Support Team (S)! Helping enterprise teams resolve edge cases fast.',
      workingOn:
        'Investigating live webhook logs with Connect (C) and Odoo (O).',
      teamSummary:
        'Reporting to Marcus alongside Brennan right here in Support Team (S).',
      officeSecret:
        'Kitchen Room (R) is just a quick stroll east whenever the ticket queue clears!',
    },
  },
  {
    id: 'emp-brennan',
    name: 'Brennan Cole',
    role: 'Technical Helpdesk Specialist',
    departmentId: 'room-s',
    orgGroup: 'Support & Ops',
    managerId: 'emp-marcus',
    level: 2,
    status: 'Available',
    currentProject: 'Customer Knowledge Base & Live Desk',
    skills: ['Helpdesk', 'Documentation', 'Onboarding'],
    locationLabel: 'S · Support Team',
    spawnTile: { x: 47, y: 44 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'cap',
      hairColor: '#1F2937',
      shirtColor: '#047857',
      pantsColor: '#334155',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hey! Keeping our customer helpdesk snappy here in Support Team (S).',
      workingOn:
        'Publishing step-by-step video guides for new HR Product and Odoo clients.',
      teamSummary:
        'Part of Marcus’s 3-member Support Team (S).',
      officeSecret:
        'Marcus and I sometimes challenge Leo to beat his arcade score in Kitchen Room (R).',
    },
  },

  // Level 2: Growth & Sales (Marketing F — 3 members, Sales J — 3 members)
  {
    id: 'emp-camille',
    name: 'Camille Laurent',
    role: 'Marketing Content Strategist',
    departmentId: 'room-f',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-maya',
    level: 2,
    status: 'In Sync',
    currentProject: 'Product Launch Editorial',
    skills: ['Brand Copy', 'Campaigns', 'Social'],
    locationLabel: 'F · Marketing Team',
    spawnTile: { x: 29, y: 8 },
    facing: 'up',
    appearance: {
      skinColor: '#F7D2B3',
      hairStyle: 'bob',
      hairColor: '#7C2D12',
      shirtColor: '#E11D48',
      pantsColor: '#1E293B',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Bonjour from Marketing Team (F)! Maya, Enzo, and I craft every product launch story.',
      workingOn:
        'Preparing case studies for our Odoo Team (O) and Digital Team (D) launches.',
      teamSummary:
        'I report to Maya right here in Marketing Team (F) and often meet in Meeting Room 3 (M).',
      officeSecret:
        'All five Meeting Rooms (M) open to both the upper and lower hallways for easy access.',
    },
  },
  {
    id: 'emp-enzo',
    name: 'Enzo Moretti',
    role: 'Growth & Campaign Designer',
    departmentId: 'room-f',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-maya',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Social Creative & Launch Visuals',
    skills: ['Campaign Design', 'Motion', 'Ad Creative'],
    locationLabel: 'F · Marketing Team',
    spawnTile: { x: 29, y: 11 },
    facing: 'up',
    appearance: {
      skinColor: '#DF9F71',
      hairStyle: 'curly',
      hairColor: '#18181B',
      shirtColor: '#FB7185',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Ciao! Designing launch graphics here in Marketing Team (F).',
      workingOn:
        'Syncing visual campaign assets with Daniel and Aria over in Digital Team (D).',
      teamSummary:
        'Part of Maya’s 3-person Marketing Team (F) alongside Camille.',
      officeSecret:
        'Check our Campaign Board on the north wall of Marketing Team (F) with E!',
    },
  },
  {
    id: 'emp-noah',
    name: 'Noah Bennett',
    role: 'Sales Team Lead',
    departmentId: 'room-j',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-maya',
    level: 2,
    status: 'In Sync',
    currentProject: 'Enterprise Client Deals',
    skills: ['B2B Sales', 'Demos', 'Account Management'],
    locationLabel: 'J · Sales Team',
    spawnTile: { x: 38, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#E5B890',
      hairStyle: 'short',
      hairColor: '#3B2820',
      shirtColor: '#7C3AED',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hi there! Welcome to Sales Team (J), where Rachel, Malik, and I drive client partnerships.',
      workingOn:
        'Running client demos for Odoo ERP and HR Product suites.',
      teamSummary:
        'I lead our 3-member Sales Team (J) under Maya, partnering with Marketing (F).',
      officeSecret:
        'When clients visit through Entrance (E), we usually host them in Meeting Room 5 (M).',
    },
  },
  {
    id: 'emp-rachel',
    name: 'Rachel Adams',
    role: 'Enterprise Account Executive',
    departmentId: 'room-j',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-noah',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Mid-Market & Enterprise Proposals',
    skills: ['Enterprise Sales', 'Negotiation', 'Partnerships'],
    locationLabel: 'J · Sales Team',
    spawnTile: { x: 38, y: 8 },
    facing: 'up',
    appearance: {
      skinColor: '#F4C7A5',
      hairStyle: 'ponytail',
      hairColor: '#78350F',
      shirtColor: '#8B5CF6',
      pantsColor: '#0F172A',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to Sales Team (J)! Wrapping up two enterprise proposals today.',
      workingOn:
        'Partnering with Odoo (O) and Digital (D) leads on custom scope estimates.',
      teamSummary:
        'Reporting to Noah Bennett alongside Malik in Sales Team (J).',
      officeSecret:
        'Meeting Room 4 (M) right across the hall is ideal for back-to-back client calls.',
    },
  },
  {
    id: 'emp-malik',
    name: 'Malik Vance',
    role: 'Solutions & Demo Specialist',
    departmentId: 'room-j',
    orgGroup: 'Growth & Sales',
    managerId: 'emp-noah',
    level: 3,
    status: 'Available',
    currentProject: 'Interactive Product Sandboxes',
    skills: ['Solution Engineering', 'Demos', 'ERP'],
    locationLabel: 'J · Sales Team',
    spawnTile: { x: 38, y: 11 },
    facing: 'up',
    appearance: {
      skinColor: '#8D5524',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#6D28D9',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hey! Building tailored client demo sandboxes here in Sales Team (J).',
      workingOn:
        'Prepping live walkthroughs of HR Product (X) and Connect (C) workflows.',
      teamSummary:
        'Part of Noah’s 3-member Sales Team (J).',
      officeSecret:
        'If you see me in Entrance (E), I’m probably greeting a prospective client!',
    },
  },

  // Level 2 & 3: People & Admin (HR H — 3 members, HR Product X — 3 members, Admin P — 3 members)
  {
    id: 'emp-farah',
    name: 'Farah Nabil',
    role: 'Talent Acquisition Partner',
    departmentId: 'room-h',
    orgGroup: 'People & Admin',
    managerId: 'emp-priya',
    level: 2,
    status: 'In Sync',
    currentProject: 'Engineering & Design Hiring Loops',
    skills: ['Recruiting', 'Interviews', 'Candidate Care'],
    locationLabel: 'H · HR Room',
    spawnTile: { x: 21, y: 25 },
    facing: 'up',
    appearance: {
      skinColor: '#C68B59',
      hairStyle: 'bob',
      hairColor: '#1C1917',
      shirtColor: '#9333EA',
      pantsColor: '#1E293B',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hi! Welcome to HR Room (H)—coordinating interviews across Digital and Odoo.',
      workingOn:
        'Scheduling final panel interviews in Meeting Room 2 (M) right next door.',
      teamSummary:
        'Part of Priya’s 3-member HR Room (H) team alongside Jonah.',
      officeSecret:
        'Meeting Room 2 (M) is our favorite interview room since it’s steps away.',
    },
  },
  {
    id: 'emp-jonah',
    name: 'Jonah Reed',
    role: 'People Operations Specialist',
    departmentId: 'room-h',
    orgGroup: 'People & Admin',
    managerId: 'emp-priya',
    level: 2,
    status: 'Available',
    currentProject: 'Onboarding & Teammate Experience',
    skills: ['People Ops', 'Benefits', 'Culture'],
    locationLabel: 'H · HR Room',
    spawnTile: { x: 21, y: 28 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'parted',
      hairColor: '#9A3412',
      shirtColor: '#A855F7',
      pantsColor: '#334155',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Welcome to HR Room (H)! Making sure every new teammate feels at home.',
      workingOn:
        'Testing our new onboarding checklist with HR Product Team (X).',
      teamSummary:
        'Working with Priya and Farah right here in HR Room (H).',
      officeSecret:
        'HR Room (H) has doors to both the north and south walkways for quick access.',
    },
  },
  {
    id: 'emp-hana',
    name: 'Hana Al-Mansoor',
    role: 'HR Product Team Lead',
    departmentId: 'room-x',
    orgGroup: 'People & Admin',
    managerId: 'emp-priya',
    level: 2,
    status: 'Reviewing Work',
    currentProject: 'HR Product Payroll & Attendance App',
    skills: ['HR Tech', 'Product Design', 'UX'],
    locationLabel: 'X · HR Product Team',
    spawnTile: { x: 58, y: 38 },
    facing: 'up',
    appearance: {
      skinColor: '#C68B59',
      hairStyle: 'ponytail',
      hairColor: '#1C1917',
      shirtColor: '#EA580C',
      pantsColor: '#1E293B',
      accessory: 'scarf',
    },
    dialogue: {
      greeting:
        'Welcome to HR Product Team (X)! Toby, Kiran, and I build dedicated HR software products.',
      workingOn:
        'Shipping self-service leave, payroll, and onboarding workflows.',
      teamSummary:
        'I lead our 3-member HR Product Team (X), reporting to Priya in HR Room (H).',
      officeSecret:
        'Kitchen Room (R) is just a quick walk east past the south foyer!',
    },
  },
  {
    id: 'emp-toby',
    name: 'Toby Gallagher',
    role: 'HR Product UX Researcher',
    departmentId: 'room-x',
    orgGroup: 'People & Admin',
    managerId: 'emp-hana',
    level: 3,
    status: 'Available',
    currentProject: 'Employee Experience Usability',
    skills: ['User Research', 'Prototyping', 'HR Workflows'],
    locationLabel: 'X · HR Product Team',
    spawnTile: { x: 58, y: 41 },
    facing: 'up',
    appearance: {
      skinColor: '#F7D2B3',
      hairStyle: 'curly',
      hairColor: '#9A3412',
      shirtColor: '#F97316',
      pantsColor: '#292524',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Pull up a chair in HR Product Team (X)! Always testing how HR tools feel day to day.',
      workingOn:
        'Interviewing HR teams to simplify onboarding checklists and performance reviews.',
      teamSummary:
        'Working with Hana and Kiran in HR Product (X).',
      officeSecret:
        'Our HR Room (H) and HR Product (X) test every feature internally before shipping.',
    },
  },
  {
    id: 'emp-kiran',
    name: 'Kiran Rao',
    role: 'HR Product Full-Stack Engineer',
    departmentId: 'room-x',
    orgGroup: 'People & Admin',
    managerId: 'emp-hana',
    level: 3,
    status: 'Deep Focus',
    currentProject: 'Payroll Calculation & Leave API',
    skills: ['TypeScript', 'Next.js', 'PostgreSQL'],
    locationLabel: 'X · HR Product Team',
    spawnTile: { x: 58, y: 44 },
    facing: 'up',
    appearance: {
      skinColor: '#A86B3E',
      hairStyle: 'short',
      hairColor: '#18181B',
      shirtColor: '#C2410C',
      pantsColor: '#1E293B',
      accessory: 'headset',
    },
    dialogue: {
      greeting:
        'Hey from HR Product Team (X)! Shipping clean payroll and attendance APIs.',
      workingOn:
        'Building automated shift and holiday calendars for multi-region teams.',
      teamSummary:
        'Part of Hana’s 3-member HR Product Team (X) alongside Toby.',
      officeSecret:
        'That teal sofa behind me is the coziest spot in the south wing for reading PRs.',
    },
  },
  {
    id: 'emp-elena',
    name: 'Elena Rostova',
    role: 'Admin Team Lead',
    departmentId: 'room-p',
    orgGroup: 'People & Admin',
    managerId: 'emp-priya',
    level: 2,
    status: 'Deep Focus',
    currentProject: 'Office Admin & Vendor Operations',
    skills: ['Administration', 'Procurement', 'Scheduling'],
    locationLabel: 'P · Admin Team',
    spawnTile: { x: 20, y: 5 },
    facing: 'up',
    appearance: {
      skinColor: '#F9D8BD',
      hairStyle: 'parted',
      hairColor: '#A16207',
      shirtColor: '#059669',
      pantsColor: '#1E293B',
      accessory: 'glasses',
    },
    dialogue: {
      greeting:
        'Hello from Admin Team (P)! Oliver, Sara, and I keep office logistics spotless.',
      workingOn:
        'Coordinating facility upgrades and onboarding kits for new hires.',
      teamSummary:
        'I lead our 3-member Admin Team (P) under Priya in HR Room (H).',
      officeSecret:
        'Need a meeting room booked? All five M rooms are coordinated from right here.',
    },
  },
  {
    id: 'emp-oliver',
    name: 'Oliver Grant',
    role: 'Facilities & Procurement Coordinator',
    departmentId: 'room-p',
    orgGroup: 'People & Admin',
    managerId: 'emp-elena',
    level: 3,
    status: 'Available',
    currentProject: 'Workstation Hardware & Studio Desks',
    skills: ['Procurement', 'Facilities', 'Inventory'],
    locationLabel: 'P · Admin Team',
    spawnTile: { x: 20, y: 8 },
    facing: 'up',
    appearance: {
      skinColor: '#F2C19E',
      hairStyle: 'short',
      hairColor: '#451A03',
      shirtColor: '#10B981',
      pantsColor: '#334155',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Hey from Admin Team (P)! Keeping monitors, chairs, and office gear stocked.',
      workingOn:
        'Checking supply requests across Digital (D), Odoo (O), and Kitchen (R).',
      teamSummary:
        'Reporting to Elena alongside Sara in Admin Team (P).',
      officeSecret:
        'We just finished installing the 26-seat long studio desks over in Digital Team (D)!',
    },
  },
  {
    id: 'emp-sara',
    name: 'Sara Lind',
    role: 'Office Operations Associate',
    departmentId: 'room-p',
    orgGroup: 'People & Admin',
    managerId: 'emp-elena',
    level: 3,
    status: 'Reviewing Work',
    currentProject: 'Vendor Invoices & Travel Desk',
    skills: ['Operations', 'Scheduling', 'Vendor Care'],
    locationLabel: 'P · Admin Team',
    spawnTile: { x: 20, y: 11 },
    facing: 'up',
    appearance: {
      skinColor: '#FBE0C8',
      hairStyle: 'ponytail',
      hairColor: '#EAB308',
      shirtColor: '#047857',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Hi there from Admin Team (P)! Managing room calendars and vendor shipments.',
      workingOn:
        'Confirming courier deliveries with Mina over at Entrance (E).',
      teamSummary:
        'Part of Elena’s 3-member Admin Team (P).',
      officeSecret:
        'You’ll often see me walking down to Entrance (E) or Kitchen (R) during supply checks.',
    },
  },

  // Level 2: Support & Ops (Entrance E, Kitchen R)
  {
    id: 'emp-mina',
    name: 'Mina Park',
    role: 'Front Desk & Guest Welcome',
    departmentId: 'entrance',
    orgGroup: 'Support & Ops',
    managerId: 'emp-marcus',
    level: 2,
    status: 'Available',
    currentProject: 'Visitor Check-In & HQ Tours',
    skills: ['Reception', 'Hospitality', 'Coordination'],
    locationLabel: 'E · Entrance',
    spawnTile: { x: 79, y: 21 },
    facing: 'up',
    appearance: {
      skinColor: '#F5D2B2',
      hairStyle: 'ponytail',
      hairColor: '#451A03',
      shirtColor: '#D97706',
      pantsColor: '#292524',
      accessory: 'badge',
    },
    dialogue: {
      greeting:
        'Welcome to Entrance (E)! Head south to Kitchen Room (R), west to Meeting Rooms (M), or north to Digital Team (D).',
      workingOn:
        'Checking in guests and helping new visitors find any team across HQ.',
      teamSummary:
        'I report to Marcus in Support & Ops and keep Entrance (E) warm and welcoming.',
      officeSecret:
        'Use the check-in kiosk right beside me, or click any letter on the floorplan minimap to jump straight there!',
    },
  },
  {
    id: 'emp-owen',
    name: 'Owen Alvarez',
    role: 'Kitchen & Pantry Coordinator',
    departmentId: 'room-r',
    orgGroup: 'Support & Ops',
    managerId: 'emp-marcus',
    level: 2,
    status: 'Available',
    currentProject: 'Espresso Bar & Friday Lunch',
    skills: ['Pantry Ops', 'Coffee Craft', 'Events'],
    locationLabel: 'R · Kitchen Room',
    spawnTile: { x: 76, y: 40 },
    facing: 'up',
    appearance: {
      skinColor: '#D99B66',
      hairStyle: 'short',
      hairColor: '#2C1D14',
      shirtColor: '#EA580C',
      pantsColor: '#1E293B',
      accessory: 'none',
    },
    dialogue: {
      greeting:
        'Welcome to Kitchen Room (R)! Teammates from every department stop by here for coffee and snacks.',
      workingOn:
        'Keeping the espresso machine dialed in and prepping snacks for Friday demo hour.',
      teamSummary:
        'Part of Marcus’s Support & Ops group right below Entrance (E).',
      officeSecret:
        'Press E near the espresso bar or arcade cabinet right here in Kitchen Room (R)!',
    },
  },
];

const RAW_INTERACTIVE_PROPS: InteractiveProp[] = [
  {
    id: 'prop-reception',
    type: 'reception',
    title: 'Entrance E Check-In Kiosk',
    subtitle: 'E · Main Entrance',
    roomId: 'entrance',
    tile: { x: 79, y: 20 },
    details: [
      'Visitor Pass Issued: All Office Wings Unlocked',
      'North Wing: Digital (D), IG (i), Connect (C), Sales (J), Marketing (F), Admin (P)',
      'South Wing: Kitchen (R), HR Product (X), Support (S), Odoo (O), AO (A), CEO (Z)',
    ],
    actionLabel: 'Print Visitor Pass',
    actionResult:
      'Visitor pass activated! Enjoy exploring every team across HQ.',
  },
  {
    id: 'prop-espresso',
    type: 'espresso',
    title: 'Kitchen Espresso Bar',
    subtitle: 'R · Kitchen Room',
    roomId: 'room-r',
    tile: { x: 76, y: 38 },
    details: [
      'House Blend: 16-Bit Velvet Roast',
      'Today’s Special: Iced Oat Latte · Freshly Dialed',
      'Pantry Fridge stocked with sparkling water & snacks',
    ],
    actionLabel: 'Brew Espresso',
    actionResult:
      'Pssshhh! Fresh double espresso brewed (+15 Focus Energy).',
  },
  {
    id: 'prop-arcade',
    type: 'arcade',
    title: 'Kitchen Breakroom Arcade',
    subtitle: 'R · Kitchen Room',
    roomId: 'room-r',
    tile: { x: 79, y: 40 },
    details: [
      '1st: LEO (Odoo Team O) — 48,200 pts',
      '2nd: MARCUS (Support S) — 44,950 pts',
      '3rd: KAI (Digital D) — 41,100 pts',
    ],
    actionLabel: 'Insert Token',
    actionResult:
      'BLEEP BLOOP! You scored 34,800 pts during your coffee break!',
  },
  {
    id: 'prop-bulletin',
    type: 'bulletin',
    title: 'Odoo Team Sprint Board',
    subtitle: 'O · Odoo Team',
    roomId: 'room-o',
    tile: { x: 31, y: 36 },
    details: [
      'Active: Odoo 18 Inventory & Accounting Migration',
      'In QA: Automated HR Payroll Connector',
      'Shipped: Multi-Warehouse Sync Pipeline',
    ],
    actionLabel: 'Inspect Sprint',
    actionResult:
      'Odoo Team sprint is 100% on track ahead of Friday’s company review.',
  },
  {
    id: 'prop-servers',
    type: 'servers',
    title: 'IG Core Server Cluster',
    subtitle: 'i · IG Team',
    roomId: 'room-i',
    tile: { x: 56, y: 3 },
    details: [
      'Nodes: IG-Core-01, IG-Edge-02, IG-Sync-03 (All Healthy)',
      'Response Latency: 6.4 ms',
      'Uptime Streak: 184 days',
    ],
    actionLabel: 'Run Diagnostics',
    actionResult:
      'All IG Team server blades green! Packet queue is spotless.',
  },
  {
    id: 'prop-kanban',
    type: 'kanban',
    title: 'Marketing Campaign Board',
    subtitle: 'F · Marketing Team',
    roomId: 'room-f',
    tile: { x: 29, y: 2 },
    details: [
      'Launch: PixelHQ Virtual Office Showcase',
      'In Review: Odoo & Digital Client Case Studies',
      'Live: Q4 Social & Brand Refresh',
    ],
    actionLabel: 'View Campaign',
    actionResult:
      'Campaign metrics are trending up across all partner channels.',
  },
  {
    id: 'prop-trophy',
    type: 'trophy',
    title: 'CEO Heritage Trophy Case',
    subtitle: 'Z · CEO Room',
    roomId: 'room-z',
    tile: { x: 9, y: 36 },
    details: [
      '2025 Best Digital & ERP Delivery Partner',
      'Founding Company Charter & First Release Plaque',
      '100-Enterprise Client Milestone Award',
    ],
    actionLabel: 'Inspect Awards',
    actionResult:
      'An engraved plaque reads: "Built together across Digital, Odoo, IG, Connect, AO, HR & Support."',
  },
  {
    id: 'prop-moodboard',
    type: 'moodboard',
    title: 'Digital Team Sprite & UI Easel',
    subtitle: 'D · Digital Team',
    roomId: 'room-d',
    tile: { x: 78, y: 11 },
    details: [
      '26 Digital Team members seated across Long Desk 1 & Long Desk 2',
      'Craft: Crisp integer-scaled 16-bit pixel art',
      'Current: New seasonal office props & UI tokens',
    ],
    actionLabel: 'Admire Canvas',
    actionResult:
      'Clean pixel clusters and warm highlights—Kai’s artwork looks sharp.',
  },
  {
    id: 'prop-parking-sign',
    type: 'reception',
    title: 'PixelHQ Plaza & Parking Directory',
    subtitle: 'Outside · Car Parking Lot',
    roomId: 'parking-lot',
    tile: { x: 85, y: 20 },
    details: [
      'West Bays: Visitor Spot (N2), EV Bay, CEO Priority & Accessible Bay',
      'East Bays: Employee Parking, Open EV Charger & Company Fleet Van',
      'Sidewalk Plaza: Covered Bicycle Rack & Shaded Benches',
    ],
    actionLabel: 'Issue Visitor Pass',
    actionResult:
      'Visitor parking bay N2 reserved! Gate barrier opens automatically on arrival.',
  },
  {
    id: 'prop-ev-station',
    type: 'servers',
    title: 'Dual EV Charging Station',
    subtitle: 'Outside · Car Parking Lot',
    roomId: 'parking-lot',
    tile: { x: 89, y: 17 },
    details: [
      'Bay West EV: Occupied (88% charged · 22 kW AC)',
      'Bay East EV: Available for employee or visitor charging',
      'Powered by rooftop solar array & clean grid tariff',
    ],
    actionLabel: 'Check Charger Status',
    actionResult:
      'Both EV chargers are online — East EV bay is open and ready!',
  },
  {
    id: 'prop-company-van',
    type: 'kanban',
    title: 'PixelHQ Company Fleet Van',
    subtitle: 'Outside · Car Parking Lot',
    roomId: 'parking-lot',
    tile: { x: 99, y: 29 },
    details: [
      'Route: Client Hardware Drop-off & Tech Summit Shuttle',
      'Next Departure: 4:30 PM from South Driveway',
      'Driver On Call: Admin & Ops Team (Room P)',
    ],
    actionLabel: 'Check Shuttle Log',
    actionResult:
      'Company shuttle van is fueled, inspected, and ready for the afternoon run.',
  },
];

export const ROOMS: RoomDefinition[] = RAW_ROOMS.map((room) => ({
  ...room,
  bounds: {
    ...room.bounds,
    x: room.bounds.x + BUILDING_OFFSET_X,
    y: room.bounds.y + BUILDING_OFFSET_Y,
  },
  spawnPoint: {
    x: room.spawnPoint.x + BUILDING_OFFSET_X,
    y: room.spawnPoint.y + BUILDING_OFFSET_Y,
  },
}));

export const EMPLOYEES: Employee[] = RAW_EMPLOYEES.map((emp) => ({
  ...emp,
  spawnTile: {
    x: emp.spawnTile.x + BUILDING_OFFSET_X,
    y: emp.spawnTile.y + BUILDING_OFFSET_Y,
  },
}));

export const INTERACTIVE_PROPS: InteractiveProp[] = RAW_INTERACTIVE_PROPS.map(
  (prop) => ({
    ...prop,
    tile: {
      x: prop.tile.x + BUILDING_OFFSET_X,
      y: prop.tile.y + BUILDING_OFFSET_Y,
    },
  })
);

export const BULLETIN_POSTS: BulletinPost[] = [
  {
    id: 'post-1',
    title: 'Full Company Floorplan Live: Entrance E to Digital D & Odoo O',
    author: 'Claire Vance',
    department: 'Z · CEO Room',
    date: 'Nov 18, 2026',
    summary:
      'Every team wing now matches our exact office layout: Digital (D), Odoo (O), IG (i), Connect (C), AO (A), Support (S), HR (H), HR Product (X), Admin (P), Marketing (F), Sales (J), Kitchen (R), Toilets (T), and Meeting Rooms (M).',
  },
  {
    id: 'post-2',
    title: 'Friday Coffee & Demo Hour in Kitchen Room (R)',
    author: 'Owen Alvarez',
    department: 'R · Kitchen Room',
    date: 'Nov 17, 2026',
    summary:
      'Swing by Kitchen Room (R) south of Entrance (E) this Friday at 4:00 PM for fresh espresso, snacks, and quick demos from Digital and Odoo.',
  },
  {
    id: 'post-3',
    title: 'Interactive Org Chart Linked to Every Room',
    author: 'Priya Nair',
    department: 'H · HR Room',
    date: 'Nov 15, 2026',
    summary:
      'Browse the full reporting tree in the Org Chart tab and click Walk to Desk on any teammate to stroll straight to their room.',
  },
  {
    id: 'post-4',
    title: 'Odoo 18 & Connect API Connectors Shipped',
    author: 'Lin Wei',
    department: 'O · Odoo Team',
    date: 'Nov 14, 2026',
    summary:
      'Odoo Team (O) and Connect Team (C) finished this cycle’s inventory and webhook integrations ahead of schedule.',
  },
];
