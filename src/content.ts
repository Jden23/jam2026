/**
 * content.ts
 * ALL game text, story scripts, verified real-world facts, card names,
 * tips, and Singapore youth helplines are centralized in this file for easy editing.
 * No facts are invented.
 */

export interface Helpline {
  name: string;
  tagline: string;
  phone: string;
  contactDetail: string;
  availableHours: string;
  website: string;
  description: string;
  isFree: boolean;
}

export interface WellnessFact {
  id: string;
  title: string;
  category: 'Brain Science' | 'Study Method' | 'Mental Health' | 'Habits';
  summary: string;
  fact: string;
  source: string;
}

export interface WellnessCard {
  id: string;
  name: string;
  icon: string;
  bonus: string;
  quote: string;
}

export interface DialogueLine {
  speaker: string;
  avatar: 'rin' | 'kai' | 'buddy' | 'teacher' | 'narrator';
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
  tagline: "Chapter 1: Exam Week",
  audience: "Singapore Teens (Ages 13–18)",
  characterName: "Rin",
  characterDescription: "A round, blocky student wearing their trusty school uniform and backpack.",
  companionName: "Kai",
  aiCompanionName: "Buddy AI",
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

export const QUICK_TIPS = [
  "Keep moving! Strafing in gentle circles makes it much easier to dodge incoming stress motes.",
  "Your Dash gives you momentary invulnerability to phase through projectiles safely.",
  "Dash has a 1-second cooldown. Watch the glowing recharge ring around Rin before dashing again.",
  "Active recall and spaced revision beat all-night cramming every single time.",
  "Losing a fight is just practice! In Buddy Up, defeat never changes your story progress.",
  "Take 20 seconds to look 20 feet away every 20 minutes to reset your focus and eye strain.",
  "If exam stress feels too heavy, chatting with someone who understands makes a world of difference.",
];

/**
 * 100% Real Singapore Youth Mental Health & Support Helplines
 * (Samaritans of Singapore, CHAT, YouthLine, Tinkle Friend, TOUCHline, Care Corner, Mindline)
 */
export const SINGAPORE_HELPLINES: Helpline[] = [
  {
    name: "SOS (Samaritans of Singapore)",
    tagline: "24-Hour Confidential Suicide Prevention & Crisis Support",
    phone: "1767",
    contactDetail: "Call 1767 (24/7) or WhatsApp 9151 1767 (24/7)",
    availableHours: "24 hours daily",
    website: "https://www.sos.org.sg",
    description: "Trained counsellors providing a non-judgmental safe space for anyone facing overwhelming distress, emotional pain, or crisis.",
    isFree: true,
  },
  {
    name: "CHAT (Centre of Excellence for Youth Mental Health)",
    tagline: "Youth Mental Health Assessment & Triage for Ages 16–30",
    phone: "6493 6500",
    contactDetail: "Tel: 6493 6500 / 6493 6501 or Web Chat at mentalhealth.sg",
    availableHours: "Tuesdays to Saturdays, 12:00 PM – 9:00 PM",
    website: "https://www.chat.mentalhealth.sg",
    description: "Initiative by the Institute of Mental Health (IMH) offering free, confidential, in-person and digital mental health assessments for youth.",
    isFree: true,
  },
  {
    name: "YouthLine Singapore",
    tagline: "Dedicated Listening Ear & Counselling for Youths",
    phone: "1771",
    contactDetail: "Call 1771 or WhatsApp +65 8533 1333",
    availableHours: "Every day, 9:00 AM – 12:00 Midnight",
    website: "https://youthline.sg",
    description: "Free and confidential helpline and text-based counselling tailored for youths navigating academic stress, family, relationships, or anxiety.",
    isFree: true,
  },
  {
    name: "Tinkle Friend (Singapore Children's Society)",
    tagline: "Helpline & Chat for Lower Secondary & Primary Students",
    phone: "1800 2744 788",
    contactDetail: "Helpline: 1800 2744 788 or Online Chat at tinklefriend.sg",
    availableHours: "Mon–Fri 2:30 PM – 5:00 PM (Helpline) & 2:30 PM – 7:00 PM (Chat)",
    website: "https://www.tinklefriend.sg",
    description: "A supportive, comforting presence for younger teens and students when feeling lonely, anxious, or distressed after school.",
    isFree: true,
  },
  {
    name: "TOUCHline (TOUCH Community Services)",
    tagline: "Youth Counselling & Cyber-Wellness Helpline",
    phone: "1800 377 2252",
    contactDetail: "Call 1800 377 2252",
    availableHours: "Mondays to Fridays, 9:00 AM – 6:00 PM",
    website: "https://www.touch.org.sg",
    description: "Experienced youth workers providing guidance for academic pressure, gaming habits, emotional struggles, and peer challenges.",
    isFree: true,
  },
  {
    name: "Mindline.sg",
    tagline: "Singapore National Youth Digital Wellness Platform",
    phone: "Online",
    contactDetail: "Visit mindline.sg / mindline.sg/youth",
    availableHours: "24/7 Digital Self-Care & Chat Tools",
    website: "https://www.mindline.sg",
    description: "Interactive tools by MOH Office for Healthcare Transformation (MOHT), featuring clinically validated self-assessments, stress tools, and resources.",
    isFree: true,
  },
];

/**
 * Real, evidence-based cognitive science and mental health facts for students.
 */
export const WELLNESS_FACTS: WellnessFact[] = [
  {
    id: "sleep-memory",
    title: "Sleep Consolidates Memory",
    category: "Brain Science",
    summary: "Sleeping 7–9 hours cements what you studied into long-term memory.",
    fact: "During Slow-Wave and REM sleep, the hippocampus replays study memories and transfers them to the neocortex. Research shows an all-nighter can slash information retention by up to 40% compared to sleeping well.",
    source: "Harvard Medical School Division of Sleep Medicine & Nature Neuroscience",
  },
  {
    id: "spaced-repetition",
    title: "The Spacing Effect beats Cramming",
    category: "Study Method",
    summary: "Revisiting topics across several days permanently strengthens recall.",
    fact: "According to Ebbinghaus's forgetting curve, humans forget roughly 70% of newly learned facts within 48 hours unless revisited. Reviewing notes at spaced intervals (1 day, 3 days, 1 week) builds durable recall with less total study hours.",
    source: "Journal of Experimental Psychology & Cognitive Science Society",
  },
  {
    id: "box-breathing",
    title: "Box Breathing Calms the Vagus Nerve",
    category: "Mental Health",
    summary: "4 seconds in, 4 seconds hold, 4 seconds out, 4 seconds hold.",
    fact: "Equal-count rhythmic breathing directly stimulates the vagus nerve and activates the parasympathetic nervous system, lowering heart rate and rapidly reducing acute pre-exam cortisol surges.",
    source: "National Institutes of Health (NIH) & Stanford Medicine",
  },
  {
    id: "active-recall",
    title: "Testing Yourself Outperforms Rereading",
    category: "Study Method",
    summary: "Flashcards and practice questions trigger stronger neural pathways.",
    fact: "Passive rereading and highlighting create an 'illusion of competence'. Active retrieval practice forces the brain to reconstruct memory traces, dramatically boosting exam-day recall under time pressure.",
    source: "Psychological Science in the Public Interest (Dunlosky et al.)",
  },
  {
    id: "20-20-20-rule",
    title: "The 20-20-20 Eye & Mind Break",
    category: "Habits",
    summary: "Every 20 mins, look 20 feet away for 20 seconds.",
    fact: "Staring continuously at study tablets or textbooks fatigues the ciliary muscles in your eyes and raises cognitive fatigue. Looking into the distance relaxes the optic system and resets attention spans.",
    source: "American Academy of Ophthalmology (AAO)",
  },
];

/**
 * Collectible Coping Strategy Cards
 */
export const WELLNESS_CARDS: WellnessCard[] = [
  {
    id: "card-pomodoro",
    name: "Pomodoro Focus Guard",
    icon: "timer",
    bonus: "+15% Focus Shield",
    quote: "25 minutes of deep attention, followed by a true 5-minute breather.",
  },
  {
    id: "card-breathe",
    name: "Box Breathing Bubble",
    icon: "wind",
    bonus: "Dash Cooldown -0.2s",
    quote: "Breathe in 4, hold 4, breathe out 4, hold 4. You are centered.",
  },
  {
    id: "card-sleep",
    name: "Sleep Sanctuary",
    icon: "moon",
    bonus: "+25 Maximum Health",
    quote: "Sleep is when your brain files away everything you studied.",
  },
  {
    id: "card-buddy",
    name: "Peer Buddy Spark",
    icon: "heart",
    bonus: "+20% Attack Energy",
    quote: "You never have to shoulder academic pressure alone.",
  },
];

/**
 * The 7 Levels of Chapter 1 "Exam Week"
 */
export const LEVELS_DATA: LevelConfig[] = [
  {
    id: 1,
    title: "Rooftop Practice",
    subtitle: "Tutorial & Controls Calibration",
    location: "Block B Rooftop Garden",
    type: "Fight",
    icon: "swords",
    badge: "Level 1 • Tutorial",
    summary: "Calibrate your movement, dash, and focus shots against 3 rooftop training dummies.",
    targetCount: 3,
    estimatedTime: "30s",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "Exam week starts in three days... My mind has been racing all morning.", mood: "worried" },
      { speaker: "Kai", avatar: "kai", text: "Hey Rin! Up here on the rooftop, the breeze is nice. Let's do a quick physical warm-up before revision.", mood: "happy" },
      { speaker: "Rin", avatar: "rin", text: "Good idea. Let me stretch my legs and calibrate my focus.", mood: "determined" },
    ],
  },
  {
    id: 2,
    title: "Canteen Whispers",
    subtitle: "Recess Real Talk",
    location: "School Canteen Tables",
    type: "Story",
    icon: "book-open",
    badge: "Level 2 • Story",
    summary: "Sit down with Kai over chicken rice and milo peng to talk about the weight of expectations.",
    estimatedTime: "2 mins",
    dialogue: [
      { speaker: "Kai", avatar: "kai", text: "Everyone in the canteen is clutching 10-year series papers like shields. It feels so tense.", mood: "worried" },
      { speaker: "Rin", avatar: "rin", text: "My parents kept asking if I'm hitting straight A's for prelims. It feels like every hour I rest is wasted.", mood: "worried" },
      { speaker: "Kai", avatar: "kai", text: "I felt that way too until our school counsellor shared something important: rest is part of preparation, not the opposite of it.", mood: "calm" },
      { speaker: "Rin", avatar: "rin", text: "Really? But if I rest, aren't other people getting ahead?", mood: "neutral" },
      { speaker: "Kai", avatar: "kai", text: "Brain science says no! Sleep consolidates memories into long-term recall. If you don't sleep, 40% of what you crammed disappears.", mood: "happy" },
      { speaker: "Rin", avatar: "rin", text: "That makes a lot of sense. So taking breaks isn't being lazy—it's respecting how our brains actually work.", mood: "determined" },
    ],
  },
  {
    id: 3,
    title: "Classroom Chaos",
    subtitle: "Clearing Doubt Sprites",
    location: "Classroom 3-Courage",
    type: "Fight",
    icon: "swords",
    badge: "Level 3 • Fight",
    summary: "Swarms of Doubt Sprites and Procrastination Motes are filling the classroom! Dodge and clear them.",
    targetCount: 12,
    estimatedTime: "1 min",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "The classroom feels so heavy right now. Look at all those swirling Doubt Sprites!", mood: "worried" },
      { speaker: "Kai", avatar: "kai", text: "Those are just thoughts, Rin! They look scary, but a clear focus and a quick dash will clear them out.", mood: "determined" },
    ],
  },
  {
    id: 4,
    title: "Study Buddy AI",
    subtitle: "Interactive Wellness Mentor",
    location: "Courtyard Study Pod",
    type: "AI Chat",
    icon: "message-circle",
    badge: "Level 4 • AI Chat",
    summary: "Check in with your empathetic AI study buddy for bite-sized advice, stress validation, and revision tips.",
    estimatedTime: "Interactive",
    dialogue: [
      { speaker: "Buddy AI", avatar: "buddy", text: "Hello Rin! I'm your digital study companion. How are you feeling about your upcoming papers?", mood: "happy" },
    ],
  },
  {
    id: 5,
    title: "Library Showdown",
    subtitle: "Confronting the Burnout Beast",
    location: "Level 4 Central Library",
    type: "Fight",
    icon: "swords",
    badge: "Level 5 • Fight",
    summary: "A towering 'Burnout Beast' made of overdue notes and panic clouds has appeared. Dash through shockwaves to triumph!",
    targetCount: 1,
    estimatedTime: "1.5 mins",
    dialogue: [
      { speaker: "Rin", avatar: "rin", text: "Whoa... That huge shadowy figure hovering over the study cubicles... That's the Burnout Beast!", mood: "worried" },
      { speaker: "Kai", avatar: "kai", text: "Remember our strategy! Dash right through its panic waves when they ripple out. Keep your distance and chip away calmly!", mood: "determined" },
    ],
  },
  {
    id: 6,
    title: "Evening Reflections",
    subtitle: "Sunset at the Bus Stop",
    location: "School Gate & Bus Stop 142",
    type: "Story",
    icon: "book-open",
    badge: "Level 6 • Story",
    summary: "Watching the twilight sky, Kai and Rin realize an essential truth about grades and self-worth.",
    estimatedTime: "2 mins",
    dialogue: [
      { speaker: "Kai", avatar: "kai", text: "Look at that orange sunset over the skyline. It's so quiet now.", mood: "calm" },
      { speaker: "Rin", avatar: "rin", text: "After that fight in the library, I realized... The panic wasn't the exam. It was my fear of letting people down.", mood: "neutral" },
      { speaker: "Kai", avatar: "kai", text: "That's huge, Rin. An exam is just a snapshot of what you know on one specific morning. It doesn't measure your kindness, your creativity, or your future.", mood: "happy" },
      { speaker: "Rin", avatar: "rin", text: "Whatever score comes out on the report slip, I'm proud of the effort I put in. And I have good friends beside me.", mood: "determined" },
      { speaker: "Kai", avatar: "kai", text: "And if anyone ever feels like they can't carry the weight alone, there are always real people ready to listen—like SOS (1767) or CHAT.", mood: "calm" },
    ],
  },
  {
    id: 7,
    title: "Exam Day & Beyond",
    subtitle: "Chapter 1 Finale & Resources",
    location: "Main Examination Hall",
    type: "Ending",
    icon: "trophy",
    badge: "Level 7 • Ending",
    summary: "You walk into the exam hall with calm clarity. You are prepared, supported, and ready.",
    estimatedTime: "Complete",
    endingSummary: {
      headline: "You Completed Chapter 1: Exam Week!",
      takeaways: [
        "Your worth is never defined by a letter on an exam slip.",
        "Sleep and scheduled rest consolidate your memories—they are active study tools.",
        "Reaching out for peer or professional support is a strength, never a weakness.",
        "Whenever exam stress feels heavy, Singapore helplines like SOS (1767) and YouthLine (1771) are always here.",
      ],
    },
  },
];

/**
 * Suggested conversation starters and offline fallback responses for the AI Study Buddy
 */
export const AI_CHAT_PROMPTS = [
  "How can I stop overthinking the night before an exam?",
  "What is the best way to revise when I feel overwhelmed?",
  "Can you teach me the Box Breathing technique?",
  "How do I deal with parental pressure about my grades?",
  "What are some real Singapore youth helplines if I need someone to talk to?",
];

export const AI_CHAT_FALLBACKS: Record<string, string> = {
  default: "Hey there! I hear you. Exam week in Singapore can feel really intense, but you're doing better than you think. Remember to take steady sips of water, pause for 5 minutes every half hour, and remember: your effort matters, but a test paper doesn't define your entire worth!",
  overthinking: "It's completely normal for thoughts to race before a paper! Try the 4-7-8 or Box Breathing trick: inhale for 4 seconds, hold for 4 seconds, exhale slowly for 4 seconds. Write down your top 3 worries on paper to get them out of your head, then close your books. Your brain needs sleep tonight to lock in what you've revised!",
  overwhelmed: "When revision feels like an insurmountable mountain, shrink the goal. Pick just ONE sub-topic for 20 minutes (like two math problems or one physics concept). Put away your phone, set a timer, and tackle just that. Action breaks anxiety!",
  breathing: "Let's do Box Breathing together: Inhale slowly through your nose for 4 counts... Hold your breath gently for 4 counts... Exhale smoothly through your mouth for 4 counts... Hold empty for 4 counts. Doing this for just 2 minutes lowers your heart rate and resets your nervous system.",
  pressure: "Parental expectations often come from love and anxiety about your future, but hearing it constantly can feel suffocating. Try communicating when things are calm: 'Mum/Dad, I'm working hard and revising, but when grades are brought up constantly it makes me anxious. Having your encouragement helps me focus much better.'",
  helplines: "If you or a friend ever need a safe, confidential listening ear in Singapore: You can call SOS at 1767 (or WhatsApp 9151 1767, 24/7), call YouthLine at 1771, or reach CHAT at 6493 6500 for youth mental health support. You are never alone!",
};
