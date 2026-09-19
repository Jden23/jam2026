/**
 * content.ts
 * Centralized game text, story scripts, level configurations, and combat tips.
 * Theme: Drug prevention for teens (vapes, peer pressure, myths).
 * NOTE: As instructed, no unverified facts, statistics, or phone numbers are added.
 */

export interface DialogueLine {
  speaker: string;
  avatar: 'rin' | 'jay' | 'narrator';
  text: string;
  mood?: 'neutral' | 'worried' | 'happy' | 'determined' | 'calm';
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  type: 'Fight' | 'Story' | 'AI Chat' | 'Ending';
  icon: 'swords' | 'book-open' | 'message-circle' | 'trophy';
  badge: string;
  summary: string;
  targetCount?: number;
  estimatedTime: string;
  dialogue?: DialogueLine[];
  endingSummary?: {
    headline: string;
    takeaways: string[];
  };
}

export const APP_INFO = {
  title: "Buddy Up",
  tagline: "Chapter 1: Standing Your Ground",
  audience: "Singapore Teens (Ages 13–18)",
  characterName: "Rin",
  characterDescription: "A round, blocky student wearing their school uniform and backpack.",
  companionName: "Jay",
};

export const CONTROLS_TEXT = {
  keyboard: {
    move: "WASD / Arrow Keys to move Rin",
    aim: "Move mouse cursor to aim focus blast",
    shoot: "Left Click to shoot focus orbs",
    dash: "Spacebar to dash (1.0s cooldown)",
  },
  touch: {
    move: "Use virtual joystick on the left",
    aimShoot: "Tap the big 'Attack' button to fire at the nearest target or touch direction",
    dash: "Tap the 'Dash' button to leap forward",
  },
  tutorialHints: {
    move: "Move around with WASD or Joystick",
    dash: "Press Space or tap Dash to dodge forward",
    shoot: "Click or tap Attack to fire focus orbs",
    allDone: "Controls mastered! Aim at all 3 practice targets on the rooftop.",
  },
};

/**
 * Combat-only tips (all study tips removed as instructed)
 */
export const QUICK_TIPS = [
  "Keep moving! Strafing in gentle circles makes it much easier to dodge incoming projectiles.",
  "Your Dash gives you momentary invulnerability to phase through obstacles safely.",
  "Dash has a 1-second cooldown. Watch the recharge ring before dashing again.",
  "Losing a fight is just practice! In Buddy Up, defeat never changes your story progress.",
  "Stay at mid-range to give yourself plenty of time to react to incoming attacks.",
  "When swarmed, focus on clearing the closest enemies first to create breathing room.",
];

/**
 * The 7 Levels:
 * 1 Fight (tutorial), 2 Story, 3 Fight, 4 Story, 5 Fight, 6 AI Chat, 7 Ending
 */
export const LEVELS_DATA: LevelConfig[] = [
  {
    id: 1,
    title: "Rooftop Practice",
    subtitle: "Tutorial & Controls Calibration",
    location: "Block B Rooftop",
    type: "Fight",
    icon: "swords",
    badge: "Level 1 • Tutorial",
    summary: "Calibrate your movement, dash, and focus shots against 3 rooftop training dummies.",
    targetCount: 3,
    estimatedTime: "30s",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "Quiet up here on the rooftop. Good place to clear my head.", mood: "neutral" },
      { speaker: "Jay", avatar: "jay", text: "Hey Rin! Good to catch you here. Let's do a quick physical warm-up before heading down.", mood: "happy" },
      { speaker: "Rin", avatar: "rin", text: "Let's do it. Stretch my legs and test out my focus shots.", mood: "determined" },
    ],
  },
  {
    id: 2,
    title: "Behind the Bleachers",
    subtitle: "The Offer & The Myths",
    location: "School Field Bleachers",
    type: "Story",
    icon: "book-open",
    badge: "Level 2 • Story",
    summary: "Jay tells Rin about being offered a vape after school, and the pressure to fit in.",
    estimatedTime: "2 mins",
    dialogue: [
      { speaker: "Jay", avatar: "jay", text: "Hey Rin... something weird happened yesterday near the stairwell.", mood: "worried" },
      { speaker: "Rin", avatar: "rin", text: "What happened? You looked distracted all morning.", mood: "neutral" },
      { speaker: "Jay", avatar: "jay", text: "A couple of seniors had one of those fruit-flavoured vape pods. They passed it to me and said 'try lah, it's just harmless flavour and water vapour'.", mood: "worried" },
      { speaker: "Rin", avatar: "rin", text: "That myth again. People keep saying it's harmless water vapour, but it's not. It's full of chemicals and nicotine designed to hook you.", mood: "determined" },
      { speaker: "Jay", avatar: "jay", text: "I know... but when everyone is standing in a circle staring at you, it felt so awkward to say no. Like you're being uncool.", mood: "worried" },
      { speaker: "Rin", avatar: "rin", text: "It's never uncool to protect your lungs and health, Jay. Let's stand our ground together.", mood: "determined" },
    ],
  },
  {
    id: 3,
    title: "Vapour Mist Sprites",
    subtitle: "Clearing the Pressure",
    location: "Back Gate Pathway",
    type: "Fight",
    icon: "swords",
    badge: "Level 3 • Fight",
    summary: "Cloudy Vapour Sprites and Peer Pressure motes are swarming the walkway! Dodge and clear them.",
    targetCount: 8,
    estimatedTime: "1 min",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "Look at the walkway—thick clouds of lingering vapour and pressure motes!", mood: "worried" },
      { speaker: "Jay", avatar: "jay", text: "Don't let them box you in, Rin! Dash through the clouds and clear the air!", mood: "determined" },
    ],
  },
  {
    id: 4,
    title: "The Walk Home",
    subtitle: "Real Friends & Respect",
    location: "Park Connector",
    type: "Story",
    icon: "book-open",
    badge: "Level 4 • Story",
    summary: "Rin and Jay talk through practical ways to say no without feeling awkward.",
    estimatedTime: "2 mins",
    dialogue: [
      { speaker: "Jay", avatar: "jay", text: "Walking out here in the fresh air feels so much better than being stuck in that haze.", mood: "calm" },
      { speaker: "Rin", avatar: "rin", text: "I was thinking about what happened. If someone offers again, what are you going to say?", mood: "neutral" },
      { speaker: "Jay", avatar: "jay", text: "I think keeping it simple works best. Just: 'No thanks, not my thing', or 'I'm good, I like my lungs for sports'.", mood: "happy" },
      { speaker: "Rin", avatar: "rin", text: "Exactly. You don't need a huge speech. If they are real friends, they will respect a simple 'no' without pushing.", mood: "determined" },
      { speaker: "Jay", avatar: "jay", text: "Yeah. If they keep pushing, they care more about their own habit than about you.", mood: "calm" },
      { speaker: "Rin", avatar: "rin", text: "Spot on. Having each other's backs makes it a lot easier to stay true to yourself.", mood: "happy" },
    ],
  },
  {
    id: 5,
    title: "The Pressure Cloud",
    subtitle: "Courtyard Showdown",
    location: "Covered Courtyard",
    type: "Fight",
    icon: "swords",
    badge: "Level 5 • Fight",
    summary: "A towering Smoke Golem representing heavy peer pressure blocks the way. Dash through the shockwaves to disperse it!",
    targetCount: 1,
    estimatedTime: "1.5 mins",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "That massive shadow looming in the courtyard... it's the cloud of peer pressure!", mood: "worried" },
      { speaker: "Jay", avatar: "jay", text: "Keep your distance and watch out for the expanding smoke rings! Dash right through them when they expand!", mood: "determined" },
    ],
  },
  {
    id: 6,
    title: "Safe Space Chat",
    subtitle: "Peer Pressure & Myths Q&A",
    location: "Courtyard Bench",
    type: "AI Chat",
    icon: "message-circle",
    badge: "Level 6 • AI Chat",
    summary: "An open, non-judgmental space to talk through peer pressure situations, practice saying no, and discuss myths about vapes or drugs.",
    estimatedTime: "Interactive",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "Sometimes it's helpful to talk things through and practice what to say when put on the spot.", mood: "neutral" },
    ],
  },
  {
    id: 7,
    title: "Standing Tall",
    subtitle: "Chapter 1 Finale",
    location: "School Plaza",
    type: "Ending",
    icon: "trophy",
    badge: "Level 7 • Ending",
    summary: "Rin and Jay stand confident, knowing that real strength is choosing what is right for yourself.",
    estimatedTime: "Complete",
    endingSummary: {
      headline: "You Completed Chapter 1: Standing Your Ground!",
      takeaways: [
        "Real friends respect your boundaries and your choices.",
        "You never have to inhale or try anything just to fit into a group.",
        "Common myths like 'it's just water vapour' hide real risks and addictive substances.",
        "Standing your ground takes real courage—and you have that courage inside you.",
      ],
    },
  },
];

/**
 * Suggested conversation starters for the Peer Pressure & Drug Prevention Chat
 */
export const AI_CHAT_PROMPTS = [
  "How do I say no when older students push me to try a vape?",
  "What is the myth about vapes being 'just water vapour'?",
  "What should I do if my close friend starts vaping?",
  "How can I handle feeling left out when everyone else is doing it?",
];
