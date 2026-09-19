/**
 * GameBoard.tsx
 * Canvas game engine handling 60fps loop, inputs (Keyboard & Touch),
 * Level 1 Tutorial with 3 dynamic hints, Practice Targets,
 * Level 3 / Level 5 fights, Health Bar + Numeric Readout, and Try Again modal.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayerState,
  PracticeTarget,
  EnemyEntity,
  Projectile,
  Particle,
  FloatingText,
  TutorialActionsCompleted,
  GameSettings,
} from '../types';
import {
  drawRin,
  drawPracticeTarget,
  drawEnemy,
  drawProjectile,
  drawParticles,
  drawFloatingTexts,
  drawBackground,
} from '../canvasRenderer';
import { sound } from '../audio';
import { CONTROLS_TEXT, QUICK_TIPS, LevelConfig } from '../content';
import { RotateCcw, ArrowLeft, Volume2, VolumeX, Shield, Heart, Zap, Play, CheckCircle2 } from 'lucide-react';

interface GameBoardProps {
  level: LevelConfig;
  settings: GameSettings;
  onLevelComplete: (levelId: number) => void;
  onExitToMap: () => void;
  onToggleSound: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  settings,
  onLevelComplete,
  onExitToMap,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tutorial Hints (Level 1): Disappear once the player performs each action
  const [tutorialHints, setTutorialHints] = useState<TutorialActionsCompleted>({
    move: false,
    dash: false,
    shoot: false,
  });

  // Touch control visibility: auto-show on touch devices OR user toggle
  const [touchActive, setTouchActive] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  });

  // Joystick state on left
  const joystickRef = useRef<{
    active: boolean;
    touchId: number | null;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    vectorX: number;
    vectorY: number;
  }>({
    active: false,
    touchId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    vectorX: 0,
    vectorY: 0,
  });

  // Game loop & state refs
  const isGameOverRef = useRef<boolean>(false);
  const isVictoryRef = useRef<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<string>('');

  // Player state
  const playerRef = useRef<PlayerState>({
    x: 400,
    y: 320,
    vx: 0,
    vy: 0,
    radius: 20,
    hp: 100,
    maxHp: 100,
    speed: 4.8,
    dashCooldownTimer: 0,
    dashDurationTimer: 0,
    dashCooldownMax: 1.0,
    isDashing: false,
    aimAngle: 0,
    facingDirection: 1,
    shootCooldownTimer: 0,
    shootCooldownMax: 0.18,
    trail: [],
  });

  // Entities
  const practiceTargetsRef = useRef<PracticeTarget[]>([]);
  const enemiesRef = useRef<EnemyEntity[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);

  // Input states
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 400, y: 300 });
  const isMouseDownRef = useRef<boolean>(false);

  // HUD values for React UI layer
  const [hudHp, setHudHp] = useState<number>(100);
  const [hudMaxHp, setHudMaxHp] = useState<number>(100);
  const [hudDashTimer, setHudDashTimer] = useState<number>(0);
  const [targetsRemaining, setTargetsRemaining] = useState<number>(level.targetCount || 3);

  // Screen shake
  const shakeIntensityRef = useRef<number>(0);

  /**
   * Spawns entities according to level ID
   */
  const initLevel = useCallback(() => {
    isGameOverRef.current = false;
    isVictoryRef.current = false;
    setIsGameOver(false);
    setIsVictory(false);
    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];

    // Reset player
    playerRef.current = {
      x: 380,
      y: 320,
      vx: 0,
      vy: 0,
      radius: 20,
      hp: 100,
      maxHp: 100,
      speed: 4.8,
      dashCooldownTimer: 0,
      dashDurationTimer: 0,
      dashCooldownMax: 1.0,
      isDashing: false,
      aimAngle: 0,
      facingDirection: 1,
      shootCooldownTimer: 0,
      shootCooldownMax: 0.18,
      trail: [],
    };
    setHudHp(100);
    setHudMaxHp(100);
    setHudDashTimer(0);

    if (level.id === 1) {
      // Level 1: Rooftop practice - 3 Practice Targets
      practiceTargetsRef.current = [
        {
          id: 'target-1',
          name: 'Target Alpha',
          x: 240,
          y: 180,
          baseX: 240,
          baseY: 180,
          radius: 22,
          hp: 30,
          maxHp: 30,
          hitFlash: 0,
          wobbleAngle: 0,
          wobbleSpeed: 4,
          isDead: false,
        },
        {
          id: 'target-2',
          name: 'Target Beta',
          x: 520,
          y: 160,
          baseX: 520,
          baseY: 160,
          radius: 22,
          hp: 30,
          maxHp: 30,
          hitFlash: 0,
          wobbleAngle: 1.5,
          wobbleSpeed: 5,
          isDead: false,
        },
        {
          id: 'target-3',
          name: 'Target Gamma',
          x: 620,
          y: 340,
          baseX: 620,
          baseY: 340,
          radius: 22,
          hp: 30,
          maxHp: 30,
          hitFlash: 0,
          wobbleAngle: 3,
          wobbleSpeed: 4.5,
          isDead: false,
        },
      ];
      enemiesRef.current = [];
      setTargetsRemaining(3);
    } else if (level.id === 3) {
      // Level 3: Classroom Chaos (12 enemies: doubt sprites & procrastination motes)
      practiceTargetsRef.current = [];
      enemiesRef.current = [];
      for (let i = 0; i < 8; i++) {
        enemiesRef.current.push({
          id: `sprite-${i}`,
          name: 'Doubt Sprite',
          type: 'doubt-sprite',
          x: 180 + Math.random() * 480,
          y: 120 + Math.random() * 240,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 18,
          hp: 25,
          maxHp: 25,
          speed: 1.8,
          shootTimer: 2 + Math.random() * 3,
          shootInterval: 3.5,
          hitFlash: 0,
          wobblePhase: Math.random() * Math.PI * 2,
          stateTimer: 0,
        });
      }
      setTargetsRemaining(8);
    } else if (level.id === 5) {
      // Level 5: Library Showdown (Boss: Burnout Beast)
      practiceTargetsRef.current = [];
      enemiesRef.current = [
        {
          id: 'burnout-boss',
          name: 'Burnout Beast',
          type: 'burnout-boss',
          x: 400,
          y: 200,
          vx: 0,
          vy: 0,
          radius: 46,
          hp: 320,
          maxHp: 320,
          speed: 1.4,
          shootTimer: 1.8,
          shootInterval: 2.2,
          hitFlash: 0,
          wobblePhase: 0,
          stateTimer: 0,
          attackTelegraph: {
            x: 400,
            y: 200,
            radius: 0,
            maxRadius: 110,
            timer: 0,
            maxTimer: 1.2,
          },
        },
      ];
      setTargetsRemaining(1);
    }
  }, [level.id, level.targetCount]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Dash Action (Triggered via Space key or touch Dash button)
  const triggerDash = useCallback(() => {
    const p = playerRef.current;
    if (p.dashCooldownTimer <= 0 && !p.isDashing && !isGameOverRef.current) {
      p.isDashing = true;
      p.dashCooldownTimer = p.dashCooldownMax;
      p.dashDurationTimer = 0.18; // active burst

      // If moving, dash in movement direction; otherwise in facing direction
      const speedMag = Math.hypot(p.vx, p.vy);
      let dashDirX = Math.cos(p.aimAngle);
      let dashDirY = Math.sin(p.aimAngle);
      if (speedMag > 0.1) {
        dashDirX = p.vx / speedMag;
        dashDirY = p.vy / speedMag;
      }
      p.vx = dashDirX * 13;
      p.vy = dashDirY * 13;

      sound.playDash();

      // Clear dash hint in tutorial
      setTutorialHints((prev) => (prev.dash ? prev : { ...prev, dash: true }));

      // Spawn burst particles
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        particlesRef.current.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * (2 + Math.random() * 3),
          vy: Math.sin(angle) * (2 + Math.random() * 3),
          radius: 3 + Math.random() * 2,
          color: '#38bdf8',
          alpha: 0.9,
          life: 0.25,
          maxLife: 0.25,
          shape: 'circle',
        });
      }
    }
  }, []);

  // Shoot Action (Triggered via Mouse Click or Touch Attack button)
  const triggerShoot = useCallback((customAngle?: number) => {
    const p = playerRef.current;
    if (p.shootCooldownTimer <= 0 && !isGameOverRef.current) {
      p.shootCooldownTimer = p.shootCooldownMax;

      const angle = customAngle !== undefined ? customAngle : p.aimAngle;
      const speed = 11;

      projectilesRef.current.push({
        id: `proj-${Date.now()}-${Math.random()}`,
        x: p.x + Math.cos(angle) * 22,
        y: p.y + Math.sin(angle) * 22,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 6,
        isPlayer: true,
        damage: 10,
        life: 1.4,
        maxLife: 1.4,
        color: '#38bdf8',
        trail: [],
      });

      sound.playShoot();

      // Clear shoot hint in tutorial
      setTutorialHints((prev) => (prev.shoot ? prev : { ...prev, shoot: true }));

      // Muzzle flash particles
      for (let i = 0; i < 4; i++) {
        particlesRef.current.push({
          x: p.x + Math.cos(angle) * 24,
          y: p.y + Math.sin(angle) * 24,
          vx: Math.cos(angle + (Math.random() - 0.5)) * 3,
          vy: Math.sin(angle + (Math.random() - 0.5)) * 3,
          radius: 2.5,
          color: '#e0f2fe',
          alpha: 1,
          life: 0.15,
          maxLife: 0.15,
          shape: 'sparkle',
        });
      }
    }
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      keysRef.current[e.key.toLowerCase()] = true;

      // Check if moving to clear 'move' hint
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        setTutorialHints((prev) => (prev.move ? prev : { ...prev, move: true }));
      }

      // Dash via Spacebar
      if (e.code === 'Space') {
        e.preventDefault();
        triggerDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerDash]);

  // Mouse aim & click handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    mousePosRef.current = { x: mx, y: my };

    const p = playerRef.current;
    p.aimAngle = Math.atan2(my - p.y, mx - p.x);
  };

  const handleMouseDown = () => {
    isMouseDownRef.current = true;
    triggerShoot();
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  // Touch Virtual Joystick Handlers (Left Side of Screen)
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = touch.clientX - rect.left;
    const startY = touch.clientY - rect.top;

    joystickRef.current = {
      active: true,
      touchId: touch.identifier,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      vectorX: 0,
      vectorY: 0,
    };
    setTutorialHints((prev) => (prev.move ? prev : { ...prev, move: true }));
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const j = joystickRef.current;
    if (!j.active) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === j.touchId) {
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        const dx = currentX - j.startX;
        const dy = currentY - j.startY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 45;

        if (dist > 0) {
          const clampedDist = Math.min(dist, maxDist);
          j.vectorX = (dx / dist) * (clampedDist / maxDist);
          j.vectorY = (dy / dist) * (clampedDist / maxDist);
          j.currentX = j.startX + (dx / dist) * clampedDist;
          j.currentY = j.startY + (dy / dist) * clampedDist;
        }
        setTutorialHints((prev) => (prev.move ? prev : { ...prev, move: true }));
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const j = joystickRef.current;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === j.touchId) {
        j.active = false;
        j.touchId = null;
        j.vectorX = 0;
        j.vectorY = 0;
        j.currentX = j.startX;
        j.currentY = j.startY;
        break;
      }
    }
  };

  // Smart Touch Aim & Attack Handler (Right Side)
  const handleTouchAttack = () => {
    // Aim at the nearest alive enemy/target if available, else current facing
    const p = playerRef.current;
    let targetAngle = p.aimAngle;
    let closestDist = Infinity;

    // Check targets
    practiceTargetsRef.current.forEach((t) => {
      if (!t.isDead) {
        const dist = Math.hypot(t.x - p.x, t.y - p.y);
        if (dist < closestDist) {
          closestDist = dist;
          targetAngle = Math.atan2(t.y - p.y, t.x - p.x);
        }
      }
    });

    // Check enemies
    enemiesRef.current.forEach((en) => {
      const dist = Math.hypot(en.x - p.x, en.y - p.y);
      if (dist < closestDist) {
        closestDist = dist;
        targetAngle = Math.atan2(en.y - p.y, en.x - p.x);
      }
    });

    p.aimAngle = targetAngle;
    triggerShoot(targetAngle);
  };

  // MAIN 60 FPS GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // max delta 50ms
      lastTime = currentTime;
      const timeSec = currentTime / 1000;

      const p = playerRef.current;

      if (!isGameOverRef.current && !isVictoryRef.current) {
        // 1. UPDATE PLAYER INPUTS & MOVEMENT
        let moveX = 0;
        let moveY = 0;

        // Keyboard
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveY -= 1;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveY += 1;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveX -= 1;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveX += 1;

        // Touch Joystick blend
        if (joystickRef.current.active) {
          moveX = joystickRef.current.vectorX;
          moveY = joystickRef.current.vectorY;
        } else {
          // Normalize keyboard
          const mag = Math.hypot(moveX, moveY);
          if (mag > 0) {
            moveX /= mag;
            moveY /= mag;
          }
        }

        // Automatic continuous shooting if mouse held down
        if (isMouseDownRef.current) {
          triggerShoot();
        }

        // Handle active Dash
        if (p.isDashing) {
          p.dashDurationTimer -= dt;
          if (p.dashDurationTimer <= 0) {
            p.isDashing = false;
            p.vx = 0;
            p.vy = 0;
          }
        } else {
          // Regular smooth acceleration
          p.vx = moveX * p.speed;
          p.vy = moveY * p.speed;
        }

        // Update Position & Bounds
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(p.radius + 15, Math.min(canvas.width - p.radius - 15, p.x));
        p.y = Math.max(p.radius + 60, Math.min(canvas.height - p.radius - 20, p.y));

        // Dash cooldown timer
        if (p.dashCooldownTimer > 0) {
          p.dashCooldownTimer = Math.max(0, p.dashCooldownTimer - dt);
        }
        if (p.shootCooldownTimer > 0) {
          p.shootCooldownTimer = Math.max(0, p.shootCooldownTimer - dt);
        }

        // Dash trail update
        if (p.isDashing) {
          p.trail.push({ x: p.x, y: p.y, alpha: 0.9 });
        }
        p.trail.forEach((t) => (t.alpha -= dt * 4));
        p.trail = p.trail.filter((t) => t.alpha > 0.05);

        // Update React HUD timers
        setHudDashTimer(p.dashCooldownTimer);

        // 2. UPDATE PRACTICE TARGETS (Level 1)
        let targetsAlive = 0;
        practiceTargetsRef.current.forEach((t) => {
          if (!t.isDead) {
            targetsAlive++;
            if (t.hitFlash > 0) t.hitFlash -= dt * 6;
          }
        });

        // 3. UPDATE ENEMIES (Level 3 & Level 5)
        enemiesRef.current.forEach((en) => {
          if (en.hitFlash > 0) en.hitFlash -= dt * 6;

          // Simple AI: drift towards player gently
          const toPlayerX = p.x - en.x;
          const toPlayerY = p.y - en.y;
          const dist = Math.hypot(toPlayerX, toPlayerY);

          if (en.type === 'burnout-boss') {
            // Boss attack patterns & telegraphs
            en.shootTimer -= dt;
            if (en.attackTelegraph) {
              en.attackTelegraph.timer += dt;
              if (en.attackTelegraph.timer >= en.attackTelegraph.maxTimer) {
                // Slam shockwave
                en.attackTelegraph.timer = 0;
                shakeIntensityRef.current = 6;
                // Emit ring of projectiles
                for (let i = 0; i < 8; i++) {
                  const angle = (i * Math.PI) / 4 + Math.random() * 0.2;
                  projectilesRef.current.push({
                    id: `boss-proj-${Math.random()}`,
                    x: en.x,
                    y: en.y,
                    vx: Math.cos(angle) * 3.5,
                    vy: Math.sin(angle) * 3.5,
                    radius: 7,
                    isPlayer: false,
                    damage: 15,
                    life: 4,
                    maxLife: 4,
                    color: '#f43f5e',
                    trail: [],
                  });
                }
              }
            }
          } else {
            // Regular sprite movement
            if (dist > 80) {
              en.x += (toPlayerX / dist) * en.speed;
              en.y += (toPlayerY / dist) * en.speed;
            }

            // Sprite shooting
            en.shootTimer -= dt;
            if (en.shootTimer <= 0) {
              en.shootTimer = en.shootInterval + Math.random();
              const shootAngle = Math.atan2(toPlayerY, toPlayerX);
              projectilesRef.current.push({
                id: `enemy-proj-${Math.random()}`,
                x: en.x,
                y: en.y,
                vx: Math.cos(shootAngle) * 3,
                vy: Math.sin(shootAngle) * 3,
                radius: 5,
                isPlayer: false,
                damage: 10,
                life: 3.5,
                maxLife: 3.5,
                color: '#ec4899',
                trail: [],
              });
            }
          }
        });

        // 4. UPDATE PROJECTILES & COLLISION DETECTION
        projectilesRef.current.forEach((proj) => {
          proj.x += proj.vx;
          proj.y += proj.vy;
          proj.life -= dt;

          if (proj.isPlayer) {
            // Check collision with Practice Targets (Level 1)
            practiceTargetsRef.current.forEach((target) => {
              if (!target.isDead) {
                const dist = Math.hypot(target.x - proj.x, target.y - proj.y);
                if (dist < target.radius + proj.radius) {
                  proj.life = 0;
                  target.hp = Math.max(0, target.hp - proj.damage);
                  target.hitFlash = 1;
                  sound.playHit();

                  // Floating damage text
                  floatingTextsRef.current.push({
                    id: `dmg-${Math.random()}`,
                    text: `-${proj.damage}`,
                    x: target.x + (Math.random() - 0.5) * 20,
                    y: target.y - 20,
                    vy: -1.2,
                    color: '#38bdf8',
                    alpha: 1,
                    scale: 1,
                    life: 0.8,
                  });

                  if (target.hp <= 0) {
                    target.isDead = true;
                    sound.playTargetDestroyed();

                    // Star confetti explosion on target destruction
                    for (let i = 0; i < 20; i++) {
                      const angle = Math.random() * Math.PI * 2;
                      const spd = 2 + Math.random() * 5;
                      particlesRef.current.push({
                        x: target.x,
                        y: target.y,
                        vx: Math.cos(angle) * spd,
                        vy: Math.sin(angle) * spd,
                        radius: 4 + Math.random() * 3,
                        color: ['#10b981', '#fef08a', '#38bdf8', '#f472b6'][i % 4],
                        alpha: 1,
                        life: 0.8,
                        maxLife: 0.8,
                        shape: i % 2 === 0 ? 'star' : 'confetti',
                        rotation: Math.random() * Math.PI * 2,
                        vRot: (Math.random() - 0.5) * 8,
                      });
                    }
                  }
                }
              }
            });

            // Check collision with Enemies (Level 3 & 5)
            enemiesRef.current.forEach((en) => {
              if (en.hp > 0) {
                const dist = Math.hypot(en.x - proj.x, en.y - proj.y);
                if (dist < en.radius + proj.radius) {
                  proj.life = 0;
                  en.hp = Math.max(0, en.hp - proj.damage);
                  en.hitFlash = 1;
                  sound.playHit();

                  floatingTextsRef.current.push({
                    id: `dmg-${Math.random()}`,
                    text: `-${proj.damage}`,
                    x: en.x,
                    y: en.y - 15,
                    vy: -1.2,
                    color: '#38bdf8',
                    alpha: 1,
                    scale: 1,
                    life: 0.8,
                  });

                  if (en.hp <= 0) {
                    sound.playTargetDestroyed();
                    for (let i = 0; i < 15; i++) {
                      const angle = Math.random() * Math.PI * 2;
                      particlesRef.current.push({
                        x: en.x,
                        y: en.y,
                        vx: Math.cos(angle) * (2 + Math.random() * 4),
                        vy: Math.sin(angle) * (2 + Math.random() * 4),
                        radius: 4,
                        color: '#c084fc',
                        alpha: 1,
                        life: 0.6,
                        maxLife: 0.6,
                        shape: 'circle',
                      });
                    }
                  }
                }
              }
            });
          } else {
            // Enemy projectile colliding with Player
            if (!p.isDashing) {
              const dist = Math.hypot(p.x - proj.x, p.y - proj.y);
              if (dist < p.radius + proj.radius) {
                proj.life = 0;
                p.hp = Math.max(0, p.hp - proj.damage);
                setHudHp(p.hp);
                sound.playPlayerHurt();
                shakeIntensityRef.current = 5;

                floatingTextsRef.current.push({
                  id: `dmg-p-${Math.random()}`,
                  text: `-${proj.damage}`,
                  x: p.x,
                  y: p.y - 25,
                  vy: -1.5,
                  color: '#ef4444',
                  alpha: 1,
                  scale: 1.2,
                  life: 0.8,
                });

                // Check Player Defeat
                if (p.hp <= 0) {
                  isGameOverRef.current = true;
                  setIsGameOver(true);
                  sound.playDefeat();
                  // Select helpful tip
                  const randomTip = QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)];
                  setCurrentTip(randomTip);
                }
              }
            }
          }
        });

        // Filter dead projectiles & dead enemies
        projectilesRef.current = projectilesRef.current.filter((pr) => pr.life > 0);
        enemiesRef.current = enemiesRef.current.filter((en) => en.hp > 0);

        // Update Remaining Count & Check Victory
        if (level.id === 1) {
          setTargetsRemaining(targetsAlive);
          if (targetsAlive === 0 && !isVictoryRef.current) {
            isVictoryRef.current = true;
            setIsVictory(true);
            sound.playLevelComplete();
          }
        } else {
          setTargetsRemaining(enemiesRef.current.length);
          if (enemiesRef.current.length === 0 && !isVictoryRef.current) {
            isVictoryRef.current = true;
            setIsVictory(true);
            sound.playLevelComplete();
          }
        }

        // 5. UPDATE PARTICLES & FLOATING TEXTS
        particlesRef.current.forEach((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= dt;
          pt.alpha = pt.life / pt.maxLife;
          if (pt.rotation !== undefined && pt.vRot !== undefined) {
            pt.rotation += pt.vRot * dt;
          }
        });
        particlesRef.current = particlesRef.current.filter((pt) => pt.life > 0);

        floatingTextsRef.current.forEach((ft) => {
          ft.y += ft.vy;
          ft.life -= dt;
          ft.alpha = ft.life / 0.8;
        });
        floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life > 0);
      }

      // 6. RENDER FRAME TO CANVAS
      ctx.save();

      // Screen shake offset
      if (shakeIntensityRef.current > 0.1 && settings.screenShake) {
        const sx = (Math.random() - 0.5) * shakeIntensityRef.current * 2;
        const sy = (Math.random() - 0.5) * shakeIntensityRef.current * 2;
        ctx.translate(sx, sy);
        shakeIntensityRef.current *= 0.88;
      } else {
        shakeIntensityRef.current = 0;
      }

      // Clear & Draw Backdrop
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx, canvas.width, canvas.height, level.id, timeSec);

      // Draw Entities
      practiceTargetsRef.current.forEach((t) => drawPracticeTarget(ctx, t, timeSec));
      enemiesRef.current.forEach((en) => drawEnemy(ctx, en, timeSec));
      projectilesRef.current.forEach((pr) => drawProjectile(ctx, pr));
      drawParticles(ctx, particlesRef.current);
      drawRin(ctx, playerRef.current, timeSec);
      drawFloatingTexts(ctx, floatingTextsRef.current);

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [level.id, settings.screenShake, triggerShoot]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Top Combat Navigation & HUD Overlay */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md rounded-t-2xl z-20">
        <button
          id="btn-return-map"
          onClick={onExitToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Map</span>
        </button>

        {/* Health Bar AND Exact Number Readout (Never rely solely on color!) */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">HP:</span>
          </div>
          <div className="w-36 sm:w-48 h-4 bg-slate-800/90 rounded-full overflow-hidden relative border border-slate-700">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                hudHp > 50 ? 'bg-emerald-500' : hudHp > 25 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(0, (hudHp / hudMaxHp) * 100)}%` }}
            />
            {/* Clear numerical display centered in bar */}
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {hudHp} / {hudMaxHp} ({Math.round((hudHp / hudMaxHp) * 100)}%)
            </span>
          </div>
        </div>

        {/* Dash Status indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <Zap className="w-4 h-4 text-sky-400" />
          <span className="text-slate-400">Dash:</span>
          {hudDashTimer <= 0 ? (
            <span className="text-sky-400">Ready (Space)</span>
          ) : (
            <span className="text-slate-400">{hudDashTimer.toFixed(1)}s</span>
          )}
        </div>

        {/* Controls toggles */}
        <div className="flex items-center gap-2">
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            aria-label={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            id="btn-touch-controls-toggle"
            onClick={() => setTouchActive((v) => !v)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              touchActive ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Touch: {touchActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* LEVEL 1 TUTORIAL HINTS BANNER (3 hints that disappear once done) */}
      {level.id === 1 && (!tutorialHints.move || !tutorialHints.dash || !tutorialHints.shoot) && (
        <div className="w-full bg-sky-950/90 border-b border-sky-800/80 py-2.5 px-4 text-center z-10 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <span className="font-bold text-sky-300">Tutorial Goals:</span>

          {/* Hint 1: Move */}
          {!tutorialHints.move && (
            <div className="flex items-center gap-1.5 bg-sky-900/80 text-sky-100 px-3 py-1 rounded-full border border-sky-600 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              <span>1. Move ({CONTROLS_TEXT.tutorialHints.move.split(' ')[0]}: WASD / Joystick)</span>
            </div>
          )}

          {/* Hint 2: Dash */}
          {!tutorialHints.dash && (
            <div className="flex items-center gap-1.5 bg-sky-900/80 text-sky-100 px-3 py-1 rounded-full border border-sky-600 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              <span>2. Dash (Space / Dash button)</span>
            </div>
          )}

          {/* Hint 3: Shoot */}
          {!tutorialHints.shoot && (
            <div className="flex items-center gap-1.5 bg-sky-900/80 text-sky-100 px-3 py-1 rounded-full border border-sky-600 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              <span>3. Shoot (Click / Attack button)</span>
            </div>
          )}
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] bg-[#0c0f1d] border-x border-b border-slate-800 rounded-b-2xl overflow-hidden shadow-2xl">
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full block cursor-crosshair touch-none"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />

        {/* Remaining Targets counter overlay */}
        <div className="absolute top-3 left-4 bg-slate-900/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold text-slate-200 pointer-events-none">
          {level.id === 1 ? 'Practice Targets Remaining:' : 'Enemies Remaining:'}{' '}
          <span className="text-sky-400 font-extrabold text-sm ml-1">{targetsRemaining}</span>
        </div>

        {/* ON-SCREEN TOUCH CONTROLS (Auto-show on touch devices or toggled on) */}
        {touchActive && !isGameOver && !isVictory && (
          <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end pointer-events-none">
            {/* Virtual Joystick on Left */}
            <div
              id="touch-joystick-pad"
              className="relative w-32 h-32 rounded-full bg-slate-900/60 border-2 border-sky-500/40 backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center shadow-lg"
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
            >
              {/* Thumbstick Knob */}
              <div
                className="w-14 h-14 rounded-full bg-sky-500/80 border-2 border-white shadow-md transition-transform"
                style={{
                  transform: `translate(${joystickRef.current.vectorX * 28}px, ${joystickRef.current.vectorY * 28}px)`,
                }}
              />
              <span className="absolute -bottom-6 text-[11px] font-bold text-slate-400">MOVE</span>
            </div>

            {/* Big Attack and Dash Buttons on Right */}
            <div className="flex items-center gap-4 pointer-events-auto">
              {/* Dash Button */}
              <button
                id="btn-touch-dash"
                onClick={triggerDash}
                disabled={hudDashTimer > 0}
                className={`w-18 h-18 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-xl transition-transform active:scale-90 cursor-pointer ${
                  hudDashTimer <= 0
                    ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white border-2 border-sky-300'
                    : 'bg-slate-800 text-slate-500 border-2 border-slate-700'
                }`}
              >
                <Zap className="w-5 h-5 mb-0.5" />
                <span>{hudDashTimer <= 0 ? 'DASH' : `${hudDashTimer.toFixed(1)}s`}</span>
              </button>

              {/* Big Attack Button */}
              <button
                id="btn-touch-attack"
                onClick={handleTouchAttack}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black text-sm border-2 border-white shadow-2xl flex flex-col items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <Shield className="w-6 h-6 mb-0.5" />
                <span>ATTACK</span>
              </button>
            </div>
          </div>
        )}

        {/* TRY AGAIN DEFEAT MODAL (Per prompt: show "Try again" with a quick tip. Losing a fight NEVER changes the story) */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-30 animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 text-center shadow-2xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <Heart className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-black text-white mb-1 font-['Fredoka',sans-serif]">
                Take a Breather, Rin!
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                Health reached 0, but losing a fight is just practice—it <strong>never</strong> alters your story progress.
              </p>

              {/* Quick Tip Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6 text-left">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  💡 Study & Combat Tip:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentTip || QUICK_TIPS[0]}
                </p>
              </div>

              {/* Retry & Return Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  id="btn-try-again"
                  onClick={initLevel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  id="btn-return-map-modal"
                  onClick={onExitToMap}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Return to Map
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VICTORY MODAL */}
        {isVictory && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-30 animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-6 text-center shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="text-2xl font-black text-white mb-1 font-['Fredoka',sans-serif]">
                Level Complete!
              </h2>
              <p className="text-sm text-slate-300 mb-5">
                {level.id === 1
                  ? "Outstanding! You've calibrated your controls on the rooftop and cleared all 3 targets."
                  : `You cleared all doubts and maintained your focus in ${level.title}!`}
              </p>

              <button
                id="btn-continue-next-level"
                onClick={() => onLevelComplete(level.id)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Journey</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick desktop controls legend */}
      <div className="w-full mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex gap-4">
          <span>
            <strong className="text-slate-200">Move:</strong> WASD / Arrows
          </span>
          <span>
            <strong className="text-slate-200">Aim & Shoot:</strong> Mouse & Click
          </span>
          <span>
            <strong className="text-slate-200">Dash:</strong> Spacebar (1s CD)
          </span>
        </div>
        <span className="text-slate-400">Buddy Up • Singapore Teens Edition</span>
      </div>
    </div>
  );
};
