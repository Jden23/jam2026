/**
 * canvasRenderer.ts
 * Pure code rendering for Buddy Up.
 * No external images or copyrighted assets.
 * Renders cute, rounded, colourful characters (Maya, Practice Targets, Doubt Sprites, Boss),
 * projectiles, particle effects, telegraphs, and Singapore school rooftop/interior backdrops.
 */

import { PlayerState, PracticeTarget, EnemyEntity, Projectile, Particle, FloatingText } from './types';

// Helper to draw rounded rectangles
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fill = true,
  stroke = false
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Draw Maya: student hero with school uniform, backpack, blinking gaze, and dash trail.
 */
export function drawMaya(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  time: number
) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Dash ghost / afterimage trail
  if (player.isDashing || player.trail.length > 0) {
    player.trail.forEach((t) => {
      ctx.save();
      ctx.translate(t.x - player.x, t.y - player.y);
      ctx.fillStyle = `rgba(56, 189, 248, ${t.alpha * 0.35})`;
      drawRoundRect(ctx, -18, -22, 36, 44, 12, true, false);
      ctx.restore();
    });
  }

  // Active dash speed aura
  if (player.isDashing) {
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 8, 0, Math.PI * 2);
    ctx.stroke();

    // Speed streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + time * 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (player.radius + 4), Math.sin(angle) * (player.radius + 4));
      ctx.lineTo(Math.cos(angle) * (player.radius + 14), Math.sin(angle) * (player.radius + 14));
      ctx.stroke();
    }
    ctx.restore();
  }

  // Soft drop shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle run bounce
  const speedMag = Math.hypot(player.vx, player.vy);
  const isMoving = speedMag > 0.5;
  const bounceY = isMoving ? Math.sin(time * 14) * 3 : Math.sin(time * 3) * 1;
  const tilt = isMoving ? (player.vx * 0.04) : 0;

  ctx.rotate(tilt);
  ctx.translate(0, bounceY);

  const facingRight = Math.cos(player.aimAngle) >= 0;

  // 1. Backpack (behind body, shifts with facing)
  ctx.save();
  ctx.fillStyle = '#f97316'; // vibrant orange school backpack
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 2;
  const bagX = facingRight ? -22 : 8;
  drawRoundRect(ctx, bagX, -14, 14, 24, 6, true, true);

  // Backpack pocket & pin
  ctx.fillStyle = '#fb923c';
  drawRoundRect(ctx, bagX + 2, -6, 10, 12, 3, true, false);
  // Cute star pin on bag
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(bagX + 7, -1, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Round blocky torso (School Blazer & Uniform)
  ctx.save();
  ctx.fillStyle = '#1e3a8a'; // deep navy student blazer
  ctx.strokeStyle = '#172554';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, -16, -10, 32, 28, 9, true, true);

  // White collared shirt V-neck
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-7, -10);
  ctx.lineTo(7, -10);
  ctx.lineTo(0, -2);
  ctx.closePath();
  ctx.fill();

  // Red school tie
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-2.5, -9);
  ctx.lineTo(2.5, -9);
  ctx.lineTo(3.5, 4);
  ctx.lineTo(0, 8);
  ctx.lineTo(-3.5, 4);
  ctx.closePath();
  ctx.fill();

  // School crest badge (gold square pin)
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-12, -4, 4, 4);
  ctx.restore();

  // 3. Cute Round Blocky Head
  ctx.save();
  // Warm skin tone
  ctx.fillStyle = '#fed7aa';
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, -17, -32, 34, 24, 10, true, true);

  // Hair: stylish round dark bangs
  ctx.fillStyle = '#1e1b4b'; // dark indigo hair
  ctx.beginPath();
  ctx.roundRect(-18, -35, 36, 15, [10, 10, 4, 4]);
  ctx.fill();

  // Cute hair fringe tufts
  ctx.beginPath();
  ctx.moveTo(-12, -20);
  ctx.lineTo(-7, -16);
  ctx.lineTo(-3, -20);
  ctx.lineTo(3, -15);
  ctx.lineTo(8, -20);
  ctx.lineTo(14, -18);
  ctx.lineTo(16, -24);
  ctx.lineTo(-16, -24);
  ctx.closePath();
  ctx.fill();

  // Little cowlick tuft on top
  ctx.beginPath();
  ctx.moveTo(facingRight ? 2 : -2, -35);
  ctx.quadraticCurveTo(facingRight ? 8 : -8, -43, facingRight ? 12 : -12, -40);
  ctx.quadraticCurveTo(facingRight ? 6 : -6, -37, facingRight ? 2 : -2, -35);
  ctx.fill();

  // Blushing cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-10, -18, 3, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(10, -18, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (look towards aim angle)
  const eyeLookX = Math.cos(player.aimAngle) * 2.5;
  const eyeLookY = Math.sin(player.aimAngle) * 1.5;
  const blink = Math.sin(time * 1.5) > 0.98;

  if (blink) {
    // Closed happy blink curves
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-8, -21, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(8, -21, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  } else {
    // Eye sockets
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-8 + eyeLookX, -22 + eyeLookY, 3.5, 4.5, 0, 0, Math.PI * 2);
    ctx.ellipse(8 + eyeLookX, -22 + eyeLookY, 3.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights (sparkle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7 + eyeLookX, -24 + eyeLookY, 1.3, 0, Math.PI * 2);
    ctx.arc(9 + eyeLookX, -24 + eyeLookY, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Determined mouth
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (player.isDashing || speedMag > 2) {
    // Excited open mouth
    ctx.fillStyle = '#f43f5e';
    ctx.arc(0, -15, 3.5, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  } else {
    // Gentle smile
    ctx.arc(0, -16, 3, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();

  // 4. Little moving shoes
  ctx.save();
  ctx.fillStyle = '#0f172a';
  const legOffset1 = isMoving ? Math.sin(time * 14) * 6 : 0;
  const legOffset2 = isMoving ? -Math.sin(time * 14) * 6 : 0;
  drawRoundRect(ctx, -12, 16 + legOffset1, 9, 7, 3, true, false);
  drawRoundRect(ctx, 3, 16 + legOffset2, 9, 7, 3, true, false);
  ctx.restore();

  ctx.restore(); // restore player translate

  // 5. Overhead Health Bar + Number (explicitly numeric, not relying on colour alone)
  drawOverheadHp(ctx, player.x, player.y - 48, player.hp, player.maxHp, 46, 7);

  // 6. Overhead Dash Cooldown Ring
  drawDashIndicator(ctx, player.x, player.y - 58, player.dashCooldownTimer, player.dashCooldownMax);
}

// Backwards compatibility alias
export const drawRin = drawMaya;

/**
 * Draws health bar AND exact numeric readout.
 */
function drawOverheadHp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  width: number,
  height: number
) {
  ctx.save();
  const pct = Math.max(0, Math.min(1, hp / maxHp));

  // Dark background capsule with border
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, x - width / 2 - 2, y - 2, width + 4, height + 4, 4, true, true);

  // Health fill
  const fillColor = pct > 0.5 ? '#10b981' : pct > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.fillStyle = fillColor;
  if (pct > 0) {
    drawRoundRect(ctx, x - width / 2, y, width * pct, height, 3, true, false);
  }

  // Clear text readout (Number + Bar)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(hp)}/${maxHp}`, x, y + height / 2);

  ctx.restore();
}

/**
 * Draws dash cooldown ring above player
 */
function drawDashIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timer: number,
  maxTimer: number
) {
  ctx.save();
  const radius = 6;
  const isReady = timer <= 0;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fill();

  if (isReady) {
    // Ready glow
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Small wing / dash icon in center
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Recharging arc
    const progress = 1 - timer / maxTimer;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Practice Target (Level 1 Tutorial):
 * Cute round holographic training dummy with bobbing spring, smiling target face, and hit wobbles.
 */
export function drawPracticeTarget(
  ctx: CanvasRenderingContext2D,
  target: PracticeTarget,
  time: number
) {
  if (target.isDead) return;

  ctx.save();
  ctx.translate(target.x, target.y);

  // Hit wobble & flash
  const wobble = Math.sin(time * target.wobbleSpeed + target.wobbleAngle) * (target.hitFlash > 0 ? 0.25 : 0.08);
  ctx.rotate(wobble);

  // Ground base / spring stand
  ctx.save();
  ctx.fillStyle = '#334155';
  drawRoundRect(ctx, -14, 20, 28, 8, 4, true, false);

  // Zig-zag spring
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(-6, 14);
  ctx.lineTo(6, 8);
  ctx.lineTo(-6, 2);
  ctx.lineTo(0, -4);
  ctx.stroke();
  ctx.restore();

  // Target Disc (Pastel teal & coral concentric rings)
  ctx.save();
  ctx.translate(0, -10);

  // Flash white on hit
  if (target.hitFlash > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, target.radius + 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer ring
  ctx.fillStyle = '#065f46'; // forest teal rim
  ctx.beginPath();
  ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
  ctx.fill();

  // Middle ring
  ctx.fillStyle = '#10b981'; // vibrant emerald
  ctx.beginPath();
  ctx.arc(0, 0, target.radius * 0.75, 0, Math.PI * 2);
  ctx.fill();

  // Inner center
  ctx.fillStyle = '#fef08a'; // bright sunny yellow
  ctx.beginPath();
  ctx.arc(0, 0, target.radius * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Cute friendly face on target
  ctx.fillStyle = '#0f172a';
  // Happy arch eyes
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-6, -2, 2.5, 0.8 * Math.PI, 2.2 * Math.PI, true);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(6, -2, 2.5, 0.8 * Math.PI, 2.2 * Math.PI, true);
  ctx.stroke();

  // Cheerful open smile
  ctx.beginPath();
  ctx.arc(0, 3, 3, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Target Label badge (e.g. Target 1 / 2 / 3)
  ctx.fillStyle = '#0284c7';
  drawRoundRect(ctx, -18, -target.radius - 12, 36, 12, 4, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(target.name, 0, -target.radius - 6);

  ctx.restore();
  ctx.restore();

  // Target HP bar + numeric indicator
  drawOverheadHp(ctx, target.x, target.y - target.radius - 26, target.hp, target.maxHp, 42, 6);

  // Myth bubble above target
  if (target.mythItem) {
    drawMythBubble(ctx, target.x, target.y - target.radius - 32, target.mythItem.myth);
  }
}

/**
 * Draws a cute speech bubble above an entity displaying its Myth
 */
function drawMythBubble(ctx: CanvasRenderingContext2D, x: number, y: number, mythText: string) {
  ctx.save();
  ctx.font = 'bold 9px Nunito, sans-serif';
  const text = mythText.length > 26 ? mythText.slice(0, 24) + '…' : mythText;
  const metrics = ctx.measureText(text);
  const pillW = Math.max(metrics.width + 16, 60);
  const pillH = 16;
  const pillX = x - pillW / 2;
  const pillY = y - pillH;

  // Bubble background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, pillX, pillY, pillW, pillH, 8, true, true);

  // Pointer arrow
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(x - 3, pillY + pillH);
  ctx.lineTo(x + 3, pillY + pillH);
  ctx.lineTo(x, pillY + pillH + 3);
  ctx.fill();

  // Text
  ctx.fillStyle = '#fecdd3';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, pillY + pillH / 2);
  ctx.restore();
}

/**
 * Draw Enemy: Doubt Sprites (Level 3) & Burnout Beast (Level 5 Boss)
 */
export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: EnemyEntity,
  time: number
) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  // Hit flash
  const isFlashing = enemy.hitFlash > 0;

  if (enemy.type === 'doubt-sprite') {
    // Cute lavender/purple floating blob with tiny wings
    const bob = Math.sin(time * 4 + enemy.wobblePhase) * 4;
    ctx.translate(0, bob);

    // Wings
    const wingFlap = Math.sin(time * 16) * 0.4;
    ctx.fillStyle = 'rgba(216, 180, 254, 0.75)'; // soft lavender
    // Left wing
    ctx.save();
    ctx.translate(-14, -6);
    ctx.rotate(-0.3 + wingFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Right wing
    ctx.save();
    ctx.translate(14, -6);
    ctx.rotate(0.3 - wingFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = isFlashing ? '#ffffff' : '#7c3aed';
    ctx.strokeStyle = '#5b21b6';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, -16, -16, 32, 32, 14, true, true);

    // Antenna with glowing tip
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(4, -26, 0, -28);
    ctx.stroke();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(0, -28, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Cute puzzled eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6, -4, 4.5, 0, Math.PI * 2);
    ctx.arc(6, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-5, -4, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -4, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Small 'o' mouth
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.arc(0, 4, 2.2, 0, Math.PI * 2);
    ctx.fill();

  } else if (enemy.type === 'procrastination-mote') {
    // Fluffy peach cloud with sleepy eyes
    const float = Math.sin(time * 3 + enemy.wobblePhase) * 3;
    ctx.translate(0, float);

    ctx.fillStyle = isFlashing ? '#ffffff' : '#f97316';
    // Overlapping cloud puffs
    ctx.beginPath();
    ctx.arc(-10, 0, 12, 0, Math.PI * 2);
    ctx.arc(10, 0, 12, 0, Math.PI * 2);
    ctx.arc(0, -6, 14, 0, Math.PI * 2);
    ctx.arc(0, 6, 11, 0, Math.PI * 2);
    ctx.fill();

    // Sleepy eyes (-_-)
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, -2);
    ctx.lineTo(-4, -2);
    ctx.moveTo(4, -2);
    ctx.lineTo(9, -2);
    ctx.stroke();

  } else if (enemy.type === 'burnout-boss') {
    // The Burnout Beast (Level 5 Boss)
    // Large blocky shadow titan with glowing stationery horns
    const breathe = Math.sin(time * 2.5) * 4;

    // Boss floor attack telegraph
    if (enemy.attackTelegraph && enemy.attackTelegraph.timer > 0) {
      const prog = 1 - enemy.attackTelegraph.timer / enemy.attackTelegraph.maxTimer;
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, enemy.attackTelegraph.maxRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(0, 0, enemy.attackTelegraph.maxRadius * prog, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Shadow Aura
    ctx.fillStyle = 'rgba(88, 28, 135, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius + 14 + breathe, 0, Math.PI * 2);
    ctx.fill();

    // Golem Body (Dark indigo blocky silhouette)
    ctx.fillStyle = isFlashing ? '#ffffff' : '#1e1b4b';
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 4;
    drawRoundRect(ctx, -38, -42, 76, 84, 20, true, true);

    // Glowing Neon Core (Teal hourglass / exam timer)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(12, -8);
    ctx.lineTo(-12, 16);
    ctx.lineTo(12, 16);
    ctx.closePath();
    ctx.fill();

    // Stationery Horns (Pencil & Highlighter as horns)
    // Left horn: HB Pencil
    ctx.save();
    ctx.translate(-26, -42);
    ctx.rotate(-0.35);
    ctx.fillStyle = '#f59e0b'; // pencil yellow
    ctx.fillRect(-5, -28, 10, 28);
    ctx.fillStyle = '#fed7aa'; // wood tip
    ctx.beginPath();
    ctx.moveTo(-5, -28);
    ctx.lineTo(5, -28);
    ctx.lineTo(0, -38);
    ctx.fill();
    ctx.fillStyle = '#1e293b'; // graphite point
    ctx.beginPath();
    ctx.moveTo(-2, -34);
    ctx.lineTo(2, -34);
    ctx.lineTo(0, -38);
    ctx.fill();
    ctx.restore();

    // Right horn: Neon Green Highlighter
    ctx.save();
    ctx.translate(26, -42);
    ctx.rotate(0.35);
    ctx.fillStyle = '#84cc16'; // lime green
    ctx.fillRect(-6, -26, 12, 26);
    ctx.fillStyle = '#a3e635'; // chisel tip
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.lineTo(4, -34);
    ctx.lineTo(6, -26);
    ctx.fill();
    ctx.restore();

    // Big glowing Boss Eyes (Teal/Cyan)
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(-16, -20, 8, 0, Math.PI * 2);
    ctx.arc(16, -20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-15, -20, 4, 0, Math.PI * 2);
    ctx.arc(15, -20, 4, 0, Math.PI * 2);
    ctx.fill();

    // Determined frown
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(14, 2);
    ctx.stroke();
  }

  ctx.restore();

  // Overhead HP bar + numeric indicator
  drawOverheadHp(ctx, enemy.x, enemy.y - enemy.radius - 14, enemy.hp, enemy.maxHp, enemy.type === 'burnout-boss' ? 70 : 36, enemy.type === 'burnout-boss' ? 8 : 5);

  // Myth bubble above enemy
  if (enemy.mythItem) {
    drawMythBubble(ctx, enemy.x, enemy.y - enemy.radius - (enemy.type === 'burnout-boss' ? 24 : 18), enemy.mythItem.myth);
  }
}

/**
 * Draw Projectiles: Focus Orbs (player) and Stress Sparks (enemies)
 */
export function drawProjectile(ctx: CanvasRenderingContext2D, proj: Projectile) {
  ctx.save();
  ctx.translate(proj.x, proj.y);

  if (proj.isPlayer) {
    // Player focus orb: glowing star or paper airplane
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
    ctx.fill();

    // White core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Enemy stress motes: glowing crimson diamond
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, -proj.radius);
    ctx.lineTo(proj.radius, 0);
    ctx.lineTo(0, proj.radius);
    ctx.lineTo(-proj.radius, 0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Particles: stars, sparkles, dust, confetti
 */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);

    if (p.shape === 'star') {
      ctx.rotate(p.rotation || 0);
      drawStar(ctx, 0, 0, 5, p.radius, p.radius * 0.4);
    } else if (p.shape === 'confetti') {
      ctx.rotate(p.rotation || 0);
      ctx.fillRect(-p.radius, -p.radius * 0.5, p.radius * 2, p.radius);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw Floating Damage / Notification Texts
 */
export function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
  texts.forEach((t) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, t.alpha);
    ctx.font = `bold ${Math.round(13 * t.scale)}px Fredoka, Nunito, sans-serif`;
    ctx.textAlign = 'center';

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillText(t.text, t.x + 1, t.y + 1);

    // Main text
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  });
}

/**
 * Draw Dark Background with School Rooftop / Skyline details
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  levelId: number,
  time: number
) {
  // 1. Dark Gradient Base
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0b0f19'); // deep twilight
  grad.addColorStop(1, '#13192b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Distant Singapore Skyline Silhouette (Level 1 Rooftop)
  if (levelId === 1) {
    ctx.save();
    // Soft twilight stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 16; i++) {
      const sx = ((i * 137) % width);
      const sy = ((i * 59) % (height * 0.35));
      const twinkle = (Math.sin(time * 2 + i) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2 * twinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    // Skyline silhouettes in background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.35);
    // HDB and city buildings
    ctx.lineTo(40, height * 0.35);
    ctx.lineTo(40, height * 0.22);
    ctx.lineTo(80, height * 0.22);
    ctx.lineTo(80, height * 0.35);

    ctx.lineTo(120, height * 0.35);
    ctx.lineTo(120, height * 0.18);
    ctx.lineTo(170, height * 0.18);
    ctx.lineTo(170, height * 0.35);

    // Supertree / curved conservatory dome silhouette
    ctx.lineTo(240, height * 0.35);
    ctx.quadraticCurveTo(280, height * 0.15, 320, height * 0.35);

    ctx.lineTo(width * 0.6, height * 0.35);
    ctx.lineTo(width * 0.6, height * 0.20);
    ctx.lineTo(width * 0.6 + 50, height * 0.20);
    ctx.lineTo(width * 0.6 + 50, height * 0.35);

    ctx.lineTo(width, height * 0.35);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Warm city light dots
    ctx.fillStyle = 'rgba(253, 224, 71, 0.6)';
    ctx.fillRect(50, height * 0.24, 6, 4);
    ctx.fillRect(64, height * 0.26, 6, 4);
    ctx.fillRect(135, height * 0.21, 5, 4);
    ctx.fillRect(150, height * 0.25, 5, 4);
    ctx.restore();
  }

  // 3. Floor Grid & Tiles
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // School Rooftop Astro-Turf & Border Trim (Level 1)
  if (levelId === 1) {
    // Green astro-turf patch in center
    ctx.fillStyle = 'rgba(16, 185, 129, 0.07)';
    drawRoundRect(ctx, width * 0.15, height * 0.25, width * 0.7, height * 0.55, 24, true, false);

    // Decorative plant pots in corners
    ctx.fillStyle = '#334155';
    drawRoundRect(ctx, 30, 40, 24, 20, 4, true, false);
    drawRoundRect(ctx, width - 54, 40, 24, 20, 4, true, false);
    // Green foliage
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(42, 36, 12, 0, Math.PI * 2);
    ctx.arc(width - 42, 36, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
