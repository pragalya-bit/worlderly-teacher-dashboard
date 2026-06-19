// Dummy data for the Worlderly Coach (teacher) dashboard demo.
// Mirrors the student app's world: live 1:1 / group classes, the "trek" journey
// of weeks + checkpoints, mentors like Ms. Lavanya. All values are simulated.

export const COACH = {
  name: 'Lavanya Raj',
  title: 'Math & Science Mentor',
  initial: 'L',
  subjects: ['Mathematics', 'Science'],
  rating: 4.9,
  email: 'lavanya@worlderly.com',
  phone: '+91 98••• •••12',
  dob: '14 Mar 1996',
  experience: '6 years',
  experienceDetail: 'Math & Science coaching · CBSE / IGCSE',
  resume: 'Lavanya_Raj_Resume.pdf',
  idProof: 'Aadhaar_XXXX_1234.pdf',
}

// Today is the fixed demo date used across Worlderly mockups.
export const TODAY = { label: 'Monday, 16 June 2026', short: '16 Jun' }

export const STATS = [
  { id: 'students', icon: 'fa-solid fa-user-astronaut', label: 'Active Students', value: '24', delta: '+3 this week', accent: 'orange' },
  { id: 'today', icon: 'fa-solid fa-video', label: 'Classes Today', value: '5', delta: '2 done · 3 to go', accent: 'sky' },
  { id: 'hours', icon: 'fa-solid fa-clock', label: 'Hours This Week', value: '18.5', delta: 'of 22 planned', accent: 'purple' },
  { id: 'rating', icon: 'fa-solid fa-star', label: 'Avg. Rating', value: '4.9', delta: 'from 132 reviews', accent: 'amber' },
]

// Today's teaching schedule. status: 'done' | 'live' | 'upcoming'
export const TODAY_CLASSES = [
  {
    id: 'c1', time: '2:00 PM', duration: '45 min', subject: 'Math',
    topic: 'Linear Equations · Word Problems', type: '1:1',
    student: 'Jhanvi M.', grade: 'Grade 5', week: 'Week 4', status: 'done',
  },
  {
    id: 'c2', time: '3:00 PM', duration: '45 min', subject: 'Science',
    topic: 'States of Matter', type: 'Group',
    student: 'Orion Group · 4 kids', grade: 'Grade 5', week: 'Week 2', status: 'done',
  },
  {
    id: 'c3', time: '4:30 PM', duration: '45 min', subject: 'Math',
    topic: 'Balancing Equations', type: '1:1',
    student: 'Aarav S.', grade: 'Grade 6', week: 'Week 3', status: 'live',
  },
  {
    id: 'c4', time: '5:30 PM', duration: '45 min', subject: 'Science',
    topic: 'The Solar System', type: 'Group',
    student: 'Galaxy Group · 5 kids', grade: 'Grade 4', week: 'Week 1', status: 'upcoming',
  },
  {
    id: 'c5', time: '7:00 PM', duration: '45 min', subject: 'Math',
    topic: 'Review & Mastery', type: '1:1',
    student: 'Meera K.', grade: 'Grade 5', week: 'Week 5', status: 'upcoming',
  },
]

// Weekly calendar grid — count of classes per day for the strip.
export const WEEK_STRIP = [
  { day: 'Mon', date: 16, classes: 5, today: true },
  { day: 'Tue', date: 17, classes: 4 },
  { day: 'Wed', date: 18, classes: 6 },
  { day: 'Thu', date: 19, classes: 3 },
  { day: 'Fri', date: 20, classes: 5 },
  { day: 'Sat', date: 21, classes: 7 },
  { day: 'Sun', date: 22, classes: 0 },
]

// Student roster with their trek progress (week + checkpoints + last quiz).
// status: 'on-track' | 'ahead' | 'needs-help'
// `pending` = number of new assignments/updates the student has sent that the
// mentor hasn't opened yet (drives the badge on their profile in Student's Corner).
export const STUDENTS = [
  { id: 's1', name: 'Jhanvi Mehta', grade: 'Grade 5', subject: 'Math', initial: 'J', color: 'bg-orange-500',
    week: 4, totalWeeks: 5, progress: 78, lastQuiz: 92, streak: 12, status: 'on-track', next: 'Tomorrow · 2:00 PM', pending: 2 },
  { id: 's2', name: 'Aarav Sharma', grade: 'Grade 6', subject: 'Math', initial: 'A', color: 'bg-sky-500',
    week: 3, totalWeeks: 5, progress: 55, lastQuiz: 74, streak: 5, status: 'on-track', next: 'Today · 4:30 PM', pending: 1 },
  { id: 's3', name: 'Meera Krishnan', grade: 'Grade 5', subject: 'Math', initial: 'M', color: 'bg-purple-500',
    week: 5, totalWeeks: 5, progress: 94, lastQuiz: 98, streak: 21, status: 'ahead', next: 'Today · 7:00 PM', pending: 0 },
  { id: 's4', name: 'Rohan Iyer', grade: 'Grade 4', subject: 'Science', initial: 'R', color: 'bg-emerald-500',
    week: 2, totalWeeks: 5, progress: 38, lastQuiz: 58, streak: 2, status: 'needs-help', next: 'Wed · 5:00 PM', pending: 3 },
  { id: 's5', name: 'Saanvi Patel', grade: 'Grade 5', subject: 'Science', initial: 'S', color: 'bg-pink-500',
    week: 3, totalWeeks: 5, progress: 61, lastQuiz: 81, streak: 8, status: 'on-track', next: 'Thu · 3:00 PM', pending: 1 },
  { id: 's6', name: 'Vihaan Gupta', grade: 'Grade 6', subject: 'Math', initial: 'V', color: 'bg-amber-500',
    week: 1, totalWeeks: 5, progress: 16, lastQuiz: 49, streak: 1, status: 'needs-help', next: 'Fri · 6:00 PM', pending: 0 },
  { id: 's7', name: 'Ananya Rao', grade: 'Grade 4', subject: 'Science', initial: 'A', color: 'bg-indigo-500',
    week: 4, totalWeeks: 5, progress: 82, lastQuiz: 88, streak: 15, status: 'on-track', next: 'Sat · 11:00 AM', pending: 0 },
  { id: 's8', name: 'Kabir Nair', grade: 'Grade 5', subject: 'Math', initial: 'K', color: 'bg-rose-500',
    week: 5, totalWeeks: 5, progress: 90, lastQuiz: 95, streak: 18, status: 'ahead', next: 'Sat · 1:00 PM', pending: 0 },
]

// Checkpoint submissions waiting on the coach to review/grade.
// kind: 'Assignment' | 'Worksheet' | 'Quiz'
export const SUBMISSIONS = [
  { id: 'sub1', student: 'Jhanvi Mehta', initial: 'J', color: 'bg-orange-500', kind: 'Assignment',
    topic: 'Linear Equations · Word Problems', subject: 'Math', submitted: '2 hours ago', status: 'pending' },
  { id: 'sub2', student: 'Aarav Sharma', initial: 'A', color: 'bg-sky-500', kind: 'Quiz',
    topic: 'Balancing Equations', subject: 'Math', submitted: '5 hours ago', score: 74, status: 'pending' },
  { id: 'sub3', student: 'Rohan Iyer', initial: 'R', color: 'bg-emerald-500', kind: 'Worksheet',
    topic: 'States of Matter', subject: 'Science', submitted: 'Yesterday', status: 'pending' },
  { id: 'sub4', student: 'Saanvi Patel', initial: 'S', color: 'bg-pink-500', kind: 'Assignment',
    topic: 'The Water Cycle', subject: 'Science', submitted: 'Yesterday', status: 'pending' },
  { id: 'sub5', student: 'Meera Krishnan', initial: 'M', color: 'bg-purple-500', kind: 'Quiz',
    topic: 'Review & Mastery', subject: 'Math', submitted: '2 days ago', score: 98, status: 'graded' },
  { id: 'sub6', student: 'Kabir Nair', initial: 'K', color: 'bg-rose-500', kind: 'Worksheet',
    topic: 'Word Problems', subject: 'Math', submitted: '2 days ago', status: 'graded' },
]

// Lesson plans prepared by Worlderly subject-matter experts (coach just teaches).
export const LESSON_PLANS = [
  { id: 'lp1', subject: 'Math', week: 'Week 4', title: 'Word Problems', slides: 18, mins: 45, updated: 'Updated 3 days ago', icon: 'fa-solid fa-square-root-variable' },
  { id: 'lp2', subject: 'Science', week: 'Week 2', title: 'States of Matter', slides: 22, mins: 45, updated: 'Updated 1 week ago', icon: 'fa-solid fa-flask' },
  { id: 'lp3', subject: 'Math', week: 'Week 3', title: 'Balancing Equations', slides: 16, mins: 45, updated: 'Updated 2 days ago', icon: 'fa-solid fa-scale-balanced' },
  { id: 'lp4', subject: 'Science', week: 'Week 1', title: 'The Solar System', slides: 24, mins: 45, updated: 'New this week', icon: 'fa-solid fa-earth-americas' },
]

// Messages with students & parents.
export const CONVERSATIONS = [
  { id: 'm1', name: 'Mrs. Mehta', role: 'Parent of Jhanvi', initial: 'M', color: 'bg-orange-500',
    preview: 'Thank you! Jhanvi loved today’s class 🎉', time: '2:40 PM', unread: 2 },
  { id: 'm2', name: 'Aarav Sharma', role: 'Grade 6 · Math', initial: 'A', color: 'bg-sky-500',
    preview: 'Coach, I’m stuck on question 4 of the worksheet…', time: '1:15 PM', unread: 1 },
  { id: 'm3', name: 'Worlderly Team', role: 'Curriculum', initial: 'W', color: 'bg-purple-500',
    preview: 'New Week 1 Science lesson plan is live!', time: '11:02 AM', unread: 0 },
  { id: 'm4', name: 'Mr. Iyer', role: 'Parent of Rohan', initial: 'I', color: 'bg-emerald-500',
    preview: 'Can we reschedule Wednesday’s session?', time: 'Yesterday', unread: 0 },
  { id: 'm5', name: 'Meera Krishnan', role: 'Grade 5 · Math', initial: 'M', color: 'bg-rose-500',
    preview: 'I finished all the bonus questions! 🚀', time: 'Yesterday', unread: 0 },
]

export const ACTIVE_THREAD = {
  name: 'Aarav Sharma',
  role: 'Grade 6 · Math · Week 3',
  initial: 'A',
  color: 'bg-sky-500',
  messages: [
    { id: 1, from: 'them', text: 'Coach, I’m stuck on question 4 of the worksheet…', time: '1:10 PM' },
    { id: 2, from: 'me', text: 'No worries Aarav! Remember to move the constants to one side first. Want to walk through it together at 4:30?', time: '1:12 PM' },
    { id: 3, from: 'them', text: 'Yes please! That would help a lot 🙏', time: '1:15 PM' },
  ],
}

// Monthly earnings — Worlderly pays per completed class.
export const EARNINGS = {
  month: 'June 2026',
  total: 48200,
  currency: '₹',
  classesCompleted: 76,
  perClass: 600,
  bonus: 2600,
  projected: 62000,
  paidOn: '30 June 2026',
  history: [
    { month: 'Jan', amount: 38400 },
    { month: 'Feb', amount: 41200 },
    { month: 'Mar', amount: 44800 },
    { month: 'Apr', amount: 46100 },
    { month: 'May', amount: 51300 },
    { month: 'Jun', amount: 48200 },
  ],
}

// ── Schedule (Google-Calendar-style grid) ──
// times are decimal hours (14.5 = 2:30 PM). type: '1:1' | 'Group' | 'Trial'
export const CAL_HOURS = { start: 9, end: 19 } // 9 AM → 7 PM
export const WORK_HOURS = { start: 9, end: 18.5 }
export const CAL_DAYS = [
  { day: 'MON', date: 16, today: true, events: [
    { id: 'e1', start: 10, end: 10.75, title: 'States of Matter', who: 'Orion Group', board: 'CBSE', type: 'Group', subject: 'Science' },
    { id: 'e2', start: 11, end: 11.75, title: 'Algebra Basics', who: 'Riya (new)', board: 'IGCSE', type: 'Trial', subject: 'Math' },
    { id: 'e3', start: 14, end: 14.75, title: 'Linear Equations', who: 'Jhanvi M.', board: 'CBSE', type: '1:1', subject: 'Math' },
    { id: 'e4', start: 16.5, end: 17.25, title: 'Balancing Equations', who: 'Aarav S.', board: 'ICSE', type: '1:1', subject: 'Math' },
  ] },
  { day: 'TUE', date: 17, events: [
    { id: 'e5', start: 13, end: 13.75, title: 'Word Problems', who: 'Kabir N.', board: 'CBSE', type: '1:1', subject: 'Math' },
    { id: 'e6', start: 15, end: 15.75, title: 'Forces & Motion', who: 'Dev (new)', board: 'CBSE', type: 'Trial', subject: 'Science' },
    { id: 'e7', start: 17, end: 17.75, title: 'Fractions', who: 'Vihaan G.', board: 'IGCSE', type: '1:1', subject: 'Math' },
  ] },
  { day: 'WED', date: 18, events: [
    { id: 'e8', start: 10, end: 10.75, title: 'Geometry', who: 'Comet Group', board: 'CBSE', type: 'Group', subject: 'Math' },
    { id: 'e9', start: 13.5, end: 14.25, title: 'Equations', who: 'Aarav S.', board: 'ICSE', type: '1:1', subject: 'Math' },
    { id: 'e10', start: 17, end: 17.75, title: 'Decimals', who: 'Meera K.', board: 'CBSE', type: '1:1', subject: 'Math' },
  ] },
  { day: 'THU', date: 19, events: [
    { id: 'e11', start: 14, end: 14.75, title: 'Algebra', who: 'Jhanvi M.', board: 'CBSE', type: '1:1', subject: 'Math' },
    { id: 'e12', start: 16, end: 16.75, title: 'Plant Life', who: 'Sara (new)', board: 'IGCSE', type: 'Trial', subject: 'Science' },
  ] },
  { day: 'FRI', date: 20, events: [
    { id: 'e13', start: 13, end: 13.75, title: 'Review & Mastery', who: 'Meera K.', board: 'CBSE', type: '1:1', subject: 'Math' },
    { id: 'e14', start: 15, end: 15.75, title: 'The Solar System', who: 'Galaxy Group', board: 'CBSE', type: 'Group', subject: 'Science' },
    { id: 'e15', start: 18, end: 18.75, title: 'Geometry', who: 'Aarav S.', board: 'ICSE', type: '1:1', subject: 'Math' },
  ] },
  { day: 'SAT', date: 21, events: [
    { id: 'e16', start: 11, end: 11.75, title: 'Plant Life', who: 'Ananya R.', board: 'CBSE', type: '1:1', subject: 'Science' },
    { id: 'e17', start: 13, end: 13.75, title: 'Word Problems', who: 'Aanya (new)', board: 'IGCSE', type: 'Trial', subject: 'Math' },
    { id: 'e18', start: 15, end: 15.75, title: 'Mastery Quiz', who: 'Comet Group', board: 'CBSE', type: 'Group', subject: 'Math' },
  ] },
]

// Per-student activity feed shown when a profile is tapped in Student's Corner.
// type: 'submitted' | 'quiz' | 'class' | 'streak'
export const STUDENT_UPDATES = {
  s1: [
    { type: 'submitted', title: 'Submitted Assignment', detail: 'Linear Equations · Word Problems', time: '2h ago' },
    { type: 'quiz', title: 'Attended Quiz', detail: 'Balancing Equations', score: 90, time: 'Yesterday' },
    { type: 'class', title: 'Completed Class', detail: 'Word Problems', time: '2 days ago' },
  ],
  s2: [
    { type: 'submitted', title: 'Submitted Worksheet', detail: 'Balancing Equations', time: '5h ago' },
    { type: 'class', title: 'Completed Class', detail: 'Equations', time: 'Yesterday' },
  ],
  s3: [
    { type: 'quiz', title: 'Attended Quiz', detail: 'Review & Mastery', score: 98, time: '1 day ago' },
    { type: 'class', title: 'Completed Class', detail: 'Mastery', time: '2 days ago' },
  ],
  s4: [
    { type: 'submitted', title: 'Submitted Worksheet', detail: 'States of Matter', time: '1 day ago' },
    { type: 'quiz', title: 'Attended Quiz', detail: 'States of Matter', score: 58, time: '2 days ago' },
    { type: 'class', title: 'Completed Class', detail: 'States of Matter', time: '3 days ago' },
  ],
  s5: [
    { type: 'submitted', title: 'Submitted Assignment', detail: 'The Water Cycle', time: '1 day ago' },
    { type: 'quiz', title: 'Attended Quiz', detail: 'The Water Cycle', score: 81, time: '3 days ago' },
  ],
  s6: [{ type: 'class', title: 'Completed Class', detail: 'Fractions', time: '2 days ago' }],
  s7: [
    { type: 'quiz', title: 'Attended Quiz', detail: 'The Solar System', score: 88, time: '1 day ago' },
    { type: 'class', title: 'Completed Class', detail: 'Plant Life', time: '4 days ago' },
  ],
  s8: [
    { type: 'quiz', title: 'Attended Quiz', detail: 'Word Problems', score: 95, time: '2 days ago' },
    { type: 'class', title: 'Completed Class', detail: 'Mastery Quiz', time: '3 days ago' },
  ],
}

// ── Strategy & Roadmap (matches the LEC/PTM strategy report PDF) ──
export const PERFORMANCE_LEVELS = [
  { id: 'great', label: 'Great performance', dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { id: 'mid', label: 'Mid performance', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-300' },
  { id: 'weak', label: 'Weak performance', dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-300' },
]

export const STRATEGY_PHASES = [
  { id: 'immediate', name: 'Immediate Focus', icon: 'fa-solid fa-bolt', accent: 'text-rose-500', bar: 'bg-rose-400',
    placeholder: 'Build broad foundational fluency — drill core reflexes (arithmetic, fractions, algebra).' },
  { id: 'core', name: 'Ongoing Core Units', icon: 'fa-solid fa-layer-group', accent: 'text-sky-500', bar: 'bg-sky-400',
    placeholder: 'Visual & contextual delivery — introduce topics with real-world scenarios first.' },
  { id: 'midterm', name: 'Mid-Term Focus', icon: 'fa-solid fa-bullseye', accent: 'text-violet-500', bar: 'bg-violet-400',
    placeholder: 'Decode IB question frameworks — dissect word problems, structure answers to criteria.' },
  { id: 'examprep', name: 'Exam Prep Phase', icon: 'fa-solid fa-graduation-cap', accent: 'text-amber-500', bar: 'bg-amber-400',
    placeholder: 'Timed criterion rigor — authentic board questions under timed conditions.' },
]

export function defaultPerformance(s) {
  return s.lastQuiz >= 85 ? 'great' : s.lastQuiz >= 60 ? 'mid' : 'weak'
}

// ── Report card (matches student app "My Portfolio") ──
export const FEEDBACK_TAGS = [
  'Focused', 'Great participation', 'Improving', 'Needs practice',
  'Creative thinker', 'Confident', 'Hardworking', 'Asks good questions',
]

export const REPORT_BADGES = [
  { icon: 'fa-solid fa-bolt', label: 'Quick Solver', grad: 'from-amber-400 to-orange-500' },
  { icon: 'fa-solid fa-brain', label: 'Math Master', grad: 'from-blue-500 to-indigo-500' },
  { icon: 'fa-solid fa-trophy', label: 'Quiz Champ', grad: 'from-fuchsia-500 to-pink-500' },
  { icon: 'fa-solid fa-fire', label: 'Streak Star', grad: 'from-rose-500 to-orange-500' },
]

// 4 questions sent to the student each class; answers reflect in the report card.
export const CLASS_QUESTIONS = [
  'Did you understand today’s topic?',
  'What was the most interesting part?',
  'Rate your confidence (1–5)',
  'Any doubts for the next class?',
]

// Past class sessions for the report-card calendar. Each has 4 answered
// questions and (maybe) voice recordings. `rec:false` => teacher hasn't
// uploaded a voice note for that class yet → reminder.
export function classSessionsFor(s) {
  const base = [
    { day: 9, date: '9 Jun', topic: 'Variables', rec: true },
    { day: 11, date: '11 Jun', topic: 'Simple Equations', rec: true },
    { day: 13, date: '13 Jun', topic: 'Balancing', rec: s.id !== 's4' },
    { day: 16, date: '16 Jun', topic: 'Word Problems', rec: false },
  ]
  const conf = String(Math.max(1, Math.min(5, Math.round(s.lastQuiz / 20))))
  return base.map((c, i) => ({
    ...c,
    answers: [
      'Yes, I understood it well 🎯',
      s.subject === 'Science' ? `The ${c.topic.toLowerCase()} demo was cool!` : `Liked the ${c.topic.toLowerCase()} examples`,
      conf,
      i === base.length - 1 && s.status === 'needs-help' ? 'Need a little more practice 🙏' : 'No doubts — ready!',
    ],
    recordings: c.rec ? [{ id: `${s.id}-${c.day}`, label: `After Class · ${c.topic}`, dur: '0:38', date: c.date }] : [],
  }))
}

// Detailed work for a past class: assignment & worksheet (teacher questions +
// student answers + marks) and a quiz with automated corrections.
export function classWorkFor(topic, scorePct) {
  const assignment = [
    { q: `Solve for x:  2x + 5 = 17`, a: 'x = 6', marks: 5, total: 5 },
    { q: `Simplify:  3(a + 4) − 2a`, a: 'a + 12', marks: 4, total: 5 },
  ]
  const worksheet = [
    { q: `Find x:  x ÷ 3 = 9`, a: 'x = 27', marks: 5, total: 5 },
    { q: `Is 7 a solution of  x + 5 = 12 ?`, a: 'Yes', marks: 3, total: 5 },
  ]
  const base = [
    { q: '2x = 10,  x = ?', correctAns: '5' },
    { q: 'x + 3 = 8,  x = ?', correctAns: '5' },
    { q: '4x = 12,  x = ?', correctAns: '3' },
    { q: '10 − x = 6,  x = ?', correctAns: '4' },
  ]
  const correctCount = Math.max(0, Math.min(base.length, Math.round((scorePct / 100) * base.length)))
  const items = base.map((it, i) => {
    const ok = i < correctCount
    return { q: it.q, correctAns: it.correctAns, studentAns: ok ? it.correctAns : String(Number(it.correctAns) + 1), ok }
  })
  return {
    assignment,
    worksheet,
    quiz: { score: Math.round((correctCount / base.length) * 100), correct: correctCount, total: base.length, items },
  }
}

export function classAnswersFor(s) {
  return [
    'Yes! The examples made it click. 🎯',
    s.subject === 'Science' ? 'The experiment demo was so cool!' : 'Solving the word problems was fun.',
    String(Math.max(1, Math.min(5, Math.round(s.lastQuiz / 20)))),
    s.status === 'needs-help' ? 'Can we revise this once more next class?' : 'No doubts — ready for the next one!',
  ]
}

// Quiz/assignment results for the report card, built from recent activity.
export function reportRecordsFor(s) {
  const grads = ['from-purple-500 to-fuchsia-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500']
  const recs = [{ title: 'Latest Quiz', score: `${s.lastQuiz}%` }]
  ;(STUDENT_UPDATES[s.id] || [])
    .filter((u) => u.type === 'quiz' && u.score != null)
    .forEach((u) => recs.push({ title: u.detail, score: `${u.score}%` }))
  if (recs.length < 3) recs.push({ title: 'Class Assignment', score: 'Submitted' })
  return recs.slice(0, 3).map((r, i) => ({ ...r, grad: grads[i % grads.length] }))
}

// When each student is free for classes (weekday 0=Sun..6=Sat + times).
// Drives the "student's available slots" picker when assigning a class.
export const STUDENT_AVAIL_SLOTS = {
  s1: { days: [1, 3, 5], times: ['4:00 PM', '5:00 PM'] },
  s2: { days: [2, 4], times: ['4:30 PM'] },
  s3: { days: [1, 3], times: ['7:00 PM'] },
  s4: { days: [3, 6], times: ['5:00 PM'] },
  s5: { days: [4, 6], times: ['3:00 PM'] },
  s6: { days: [5], times: ['6:00 PM'] },
  s7: { days: [2, 6], times: ['11:00 AM'] },
  s8: { days: [6], times: ['1:00 PM', '2:00 PM'] },
}

const _MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const _WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Upcoming available class slots for a student over the next ~4 weeks
// (from the fixed demo date 16 Jun 2026) so the mentor can plan a month ahead.
export function upcomingSlotsFor(studentId, max = 12) {
  const cfg = STUDENT_AVAIL_SLOTS[studentId] || { days: [1, 3, 5], times: ['4:00 PM'] }
  const base = new Date(2026, 5, 16) // 16 Jun 2026
  const out = []
  for (let d = 0; d < 28 && out.length < max; d++) {
    const dt = new Date(base)
    dt.setDate(base.getDate() + d)
    if (cfg.days.includes(dt.getDay())) {
      cfg.times.forEach((t) => {
        if (out.length < max) out.push({ date: `${_WD[dt.getDay()]}, ${dt.getDate()} ${_MONTHS[dt.getMonth()]}`, time: t })
      })
    }
  }
  return out
}

// Task types the mentor can assign to build a student's journey after a class.
export const TASK_TYPES = [
  { id: 'assignment', label: 'Assignment', icon: 'fa-solid fa-pen-to-square' },
  { id: 'worksheet', label: 'Worksheet', icon: 'fa-solid fa-file-lines' },
  { id: 'quiz', label: 'Quiz', icon: 'fa-solid fa-circle-question' },
  { id: 'classnotes', label: 'Class Notes', icon: 'fa-solid fa-note-sticky' },
  { id: 'reading', label: 'Reading Task', icon: 'fa-solid fa-book' },
]

// ── Worlderly Library (was Lesson Plans) ──
export const LIBRARY = {
  Mathematics: {
    name: 'Mathematics',
    icon: 'fa-solid fa-square-root-variable',
    tint: 'sky',
    materials: [
      {
        id: 'algebra-9', title: 'Algebra Chapter 9', grade: 'Grade 7', board: 'CBSE',
        subject: 'Mathematics', type: 'PDF', size: '2.4 MB', date: '2 Aug', publishedBy: 'Krishna', comments: 1,
        items: [
          { id: 'i1', name: 'Algebra - Lesson Plan 1', kind: 'lessonplan', type: 'PDF', size: '2.4 MB', date: '2 Aug', comments: 1 },
          { id: 'i2', name: 'Algebra - Lesson Plan 2', kind: 'lessonplan', type: 'PDF', size: '1.9 MB', date: '2 Aug', comments: 0 },
          { id: 'i3', name: 'Algebra - Class Notes', kind: 'classnotes', type: 'PDF', size: '1.1 MB', date: '2 Aug', comments: 0 },
          { id: 'i4', name: 'Algebra - Worksheet', kind: 'worksheet', type: 'PDF', size: '0.8 MB', date: '2 Aug', comments: 0 },
          { id: 'i5', name: 'Algebra - Assignment', kind: 'assignment', type: 'PDF', size: '0.5 MB', date: '2 Aug', comments: 0 },
          { id: 'i6', name: 'Algebra - Quiz', kind: 'quiz', type: 'Quiz', size: '10 Qs', date: '2 Aug', comments: 0 },
        ],
        notes: [
          { from: 'Mr. Arjun', role: 'Lead Educator', text: 'In slide 5, the formula is wrong. The correct formula is (a² - b²) = (a+b)(a-b)' },
          { from: 'Mrs. Radha', role: 'SME', text: 'Class notes added for the practice section.' },
        ],
      },
      {
        id: 'fractions-6', title: 'Fractions Chapter 4', grade: 'Grade 6', board: 'CBSE',
        subject: 'Mathematics', type: 'PDF', size: '1.7 MB', date: '28 Jul', publishedBy: 'Krishna', comments: 0,
        items: [
          { id: 'i7', name: 'Fractions - Lesson Plan', kind: 'lessonplan', type: 'PDF', size: '1.7 MB', date: '28 Jul', comments: 0 },
          { id: 'i8', name: 'Fractions - Worksheet', kind: 'worksheet', type: 'PDF', size: '0.6 MB', date: '28 Jul', comments: 0 },
          { id: 'i9', name: 'Fractions - Quiz', kind: 'quiz', type: 'Quiz', size: '8 Qs', date: '28 Jul', comments: 0 },
        ],
        notes: [],
      },
    ],
  },
  Science: {
    name: 'Science',
    icon: 'fa-solid fa-flask',
    tint: 'emerald',
    materials: [
      {
        id: 'matter-5', title: 'States of Matter Chapter 2', grade: 'Grade 5', board: 'CBSE',
        subject: 'Science', type: 'PDF', size: '3.1 MB', date: '30 Jul', publishedBy: 'Krishna', comments: 0,
        items: [
          { id: 'i10', name: 'States of Matter - Lesson Plan', kind: 'lessonplan', type: 'PDF', size: '3.1 MB', date: '30 Jul', comments: 0 },
          { id: 'i11', name: 'States of Matter - Class Notes', kind: 'classnotes', type: 'PDF', size: '1.0 MB', date: '30 Jul', comments: 0 },
          { id: 'i12', name: 'States of Matter - Worksheet', kind: 'worksheet', type: 'PDF', size: '0.9 MB', date: '30 Jul', comments: 0 },
          { id: 'i13', name: 'States of Matter - Quiz', kind: 'quiz', type: 'Quiz', size: '12 Qs', date: '30 Jul', comments: 0 },
        ],
        notes: [],
      },
    ],
  },
}

export const LIBRARY_STUDENTS = ['Aryan', 'Vinay', 'Kabir', 'Hupil', 'Jhanvi']

// Only these item kinds can be pushed to a student's library. Lesson plans
// stay mentor-only.
export const PUSHABLE_KINDS = ['classnotes', 'worksheet', 'assignment', 'quiz']
export const KIND_LABEL = {
  lessonplan: 'Lesson Plan',
  classnotes: 'Class Notes',
  worksheet: 'Worksheet',
  assignment: 'Assignment',
  quiz: 'Quiz',
}

// ── Messages — only these four chats are visible ──
export const MESSAGE_GROUPS = [
  {
    id: 'g-lec', name: 'LEC', members: ['LEC', 'Teacher'], initial: 'L', color: 'bg-sky-500',
    preview: 'Please review the updated Week 4 plan.', time: '3:10 PM', unread: 1,
    messages: [
      { id: 1, from: 'LEC', me: false, text: 'Hi Lavanya, I’ve updated the Week 4 Math plan.', time: '3:05 PM' },
      { id: 2, from: 'LEC', me: false, text: 'Please review the updated Week 4 plan.', time: '3:10 PM' },
    ],
  },
  {
    id: 'g-sme', name: 'SME', members: ['LEC', 'Teacher', 'SME'], initial: 'S', color: 'bg-purple-500',
    preview: 'Corrected the formula on slide 5 🙏', time: '1:48 PM', unread: 0,
    messages: [
      { id: 1, from: 'Teacher', me: true, text: 'Slide 5 formula seems off — should be (a²-b²)=(a+b)(a-b).', time: '1:40 PM' },
      { id: 2, from: 'SME', me: false, text: 'Good catch! Corrected the formula on slide 5 🙏', time: '1:48 PM' },
    ],
  },
  {
    id: 'g-jhanvi', name: 'Jhanvi · Math · CBSE · Worlderly', members: ['Parent', 'Student', 'LEC', 'Teacher'],
    initial: 'J', color: 'bg-orange-500', preview: 'Thank you! Jhanvi loved today’s class 🎉', time: '2:40 PM', unread: 2,
    messages: [
      { id: 1, from: 'Student', me: false, text: 'Coach, I finished the word problems! 🎯', time: '2:20 PM' },
      { id: 2, from: 'Teacher', me: true, text: 'Wonderful work Jhanvi! 🌟', time: '2:32 PM' },
      { id: 3, from: 'Parent', me: false, text: 'Thank you! Jhanvi loved today’s class 🎉', time: '2:40 PM' },
    ],
  },
  {
    id: 'g-announce', name: 'Worlderly Teacher Announcements', members: ['All teachers'], announcement: true,
    initial: 'W', color: 'bg-indigo-500', preview: 'New Week 1 Science plan is live!', time: '11:02 AM', unread: 0,
    messages: [
      { id: 1, from: 'Worlderly', me: false, text: '📣 New Week 1 Science lesson plan is live in the Library!', time: '11:02 AM' },
      { id: 2, from: 'Worlderly', me: false, text: 'Reminder: submit June availability by the 20th.', time: 'Yesterday' },
    ],
  },
]

// Quick reaction emojis with hover descriptions.
export const QUICK_EMOJIS = [
  { e: '🌟', desc: 'Outstanding work' },
  { e: '👏', desc: 'Great effort' },
  { e: '👍', desc: 'Correct answer' },
  { e: '💡', desc: 'Hint or suggestion' },
  { e: '🎯', desc: 'Goal achieved' },
  { e: '🚀', desc: 'Keep improving' },
]

// ── Availability page (Calendly-inspired) ──
// status: 'available' (green) | 'booked' (red) | 'leave' (grey, blurred)
// Each day holds the time slots the mentor offers; they can add/remove them.
export const TIME_OPTIONS = [
  '9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM',
  '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM', '7-8 PM',
]

export const AVAILABILITY = [
  { day: 'MON', slots: [
    { time: '4-5 PM', status: 'booked' },
    { time: '5-6 PM', status: 'available' },
  ] },
  { day: 'TUE', slots: [
    { time: '4-5 PM', status: 'leave' },
    { time: '5-6 PM', status: 'leave' },
  ] },
  { day: 'WED', slots: [
    { time: '4-5 PM', status: 'available' },
    { time: '5-6 PM', status: 'available' },
  ] },
  { day: 'THU', slots: [
    { time: '4-5 PM', status: 'available' },
    { time: '5-6 PM', status: 'booked' },
  ] },
  { day: 'FRI', slots: [
    { time: '4-5 PM', status: 'available' },
    { time: '5-6 PM', status: 'booked' },
  ] },
  { day: 'SAT', slots: [
    { time: '10-11 AM', status: 'available' },
    { time: '11-12 PM', status: 'booked' },
  ] },
]

export const LEAVE_HISTORY = [
  { id: 'lh1', type: 'Casual Leave', dates: '2026-04-01 to 2026-04-02', reason: 'Personal travel', status: 'Pending', submitted: '2026-03-20' },
  { id: 'lh2', type: 'Casual Leave', dates: '2026-03-15', reason: 'Family event', status: 'Approved', submitted: '2026-03-05' },
  { id: 'lh3', type: 'Sick Leave', dates: '2026-02-20 to 2026-02-21', reason: 'Flu recovery', status: 'Approved', submitted: '2026-02-20' },
]

export const ACCENT = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-100', solid: 'bg-orange-500' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100', solid: 'bg-sky-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100', solid: 'bg-purple-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100', solid: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100', solid: 'bg-emerald-500' },
}

// ── Teacher Training (board mastery courses) ──
// Same modules across boards so every teacher delivers classes the same way
// (structure, gestures, tone). Completing modules raises the training % and is
// reported to the SME.
const trainingModules = (board) => [
  { id: 'm1', title: 'Welcome & the Worlderly Way', dur: '6:12', desc: 'Our teaching philosophy and what makes a Worlderly class feel magical.' },
  { id: 'm2', title: `${board} Curriculum Deep-Dive`, dur: '12:40', desc: `How the ${board} syllabus is structured and what examiners look for.` },
  { id: 'm3', title: 'The Worlderly Lesson Structure', dur: '9:05', desc: 'Hook → concept → practice → checkpoint — the flow every class follows.' },
  { id: 'm4', title: 'Gestures, Tone & On-Camera Presence', dur: '8:24', desc: 'Body language, voice and gestures that keep young learners engaged.' },
  { id: 'm5', title: 'Assessment & Feedback Standards', dur: '7:30', desc: 'Grading worksheets, quizzes and giving consistent, kind feedback.' },
  { id: 'm6', title: 'Live Class Simulation & Certification', dur: '14:18', desc: 'Teach a mock class and get certified for this board.' },
]

// `logo` points to a board logo you drop in public/boards/ (falls back to `icon`).
export const TRAINING = [
  { id: 'ib', name: 'IB Mastery', board: 'International Baccalaureate', icon: 'fa-solid fa-earth-americas', logo: '/boards/ib.png', tint: 'indigo', modules: trainingModules('IB') },
  { id: 'cbse', name: 'CBSE Mastery', board: 'Central Board (India)', icon: 'fa-solid fa-book-open', logo: '/boards/cbse.png', tint: 'orange', modules: trainingModules('CBSE') },
  { id: 'igcse', name: 'IGCSE Mastery', board: 'Cambridge IGCSE', icon: 'fa-solid fa-globe', logo: '/boards/igcse.png', tint: 'sky', modules: trainingModules('IGCSE') },
  { id: 'icse', name: 'ICSE Mastery', board: 'Indian Certificate (ICSE)', icon: 'fa-solid fa-graduation-cap', logo: '/boards/icse.png', tint: 'emerald', modules: trainingModules('ICSE') },
  { id: 'moe', name: 'MOE Mastery', board: 'Singapore MOE', icon: 'fa-solid fa-flag', logo: '/boards/moe.png', tint: 'rose', modules: trainingModules('MOE') },
]

export const TRAINING_TINT = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', solid: 'bg-indigo-500', bar: 'bg-indigo-500', grad: 'from-indigo-500 to-violet-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', solid: 'bg-orange-500', bar: 'bg-orange-500', grad: 'from-orange-500 to-amber-500' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', solid: 'bg-sky-500', bar: 'bg-sky-500', grad: 'from-sky-500 to-cyan-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', solid: 'bg-emerald-500', bar: 'bg-emerald-500', grad: 'from-emerald-500 to-teal-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', solid: 'bg-rose-500', bar: 'bg-rose-500', grad: 'from-rose-500 to-pink-500' },
}
