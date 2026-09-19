import { MythFactItem } from './content';

export type LevelType = 'Fight' | 'Story' | 'AI Chat' | 'Ending';

export interface GameSettings {
  soundEnabled: boolean;
  screenShake: boolean;
  showTouchControls: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  dashCooldownTimer: number; // 0 to 1.0s
  dashDurationTimer: number; // active dash time
  dashCooldownMax: number; // 1.0s
  isDashing: boolean;
  aimAngle: number; // in radians
  facingDirection: 1 | -1;
  shootCooldownTimer: number;
  shootCooldownMax: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

export interface PracticeTarget {
  id: string;
  name: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  hp: number;
  maxHp: number;
  hitFlash: number;
  wobbleAngle: number;
  wobbleSpeed: number;
  isDead: boolean;
  mythItem?: MythFactItem;
}

export interface EnemyEntity {
  id: string;
  name: string;
  type: 'doubt-sprite' | 'procrastination-mote' | 'burnout-boss' | 'vapour-sprite' | 'pressure-mote' | 'smoke-golem';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  shootTimer: number;
  shootInterval: number;
  hitFlash: number;
  wobblePhase: number;
  stateTimer: number;
  mythItem?: MythFactItem;
  attackTelegraph?: {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    timer: number;
    maxTimer: number;
  };
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isPlayer: boolean;
  damage: number;
  life: number;
  maxLife: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'star' | 'circle' | 'sparkle' | 'confetti';
  rotation?: number;
  vRot?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  scale: number;
  life: number;
}

export interface TutorialActionsCompleted {
  move: boolean;
  dash: boolean;
  shoot: boolean;
}

export interface GameProgress {
  completedLevelIds: number[];
  unlockedLevelId: number;
  defeatedBoss: boolean;
  tutorialCompleted: boolean;
  discoveredCards: string[];
}
