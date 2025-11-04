// Humorous comment generator based on HTTP status codes
// This simulates AI-powered analysis with predefined witty responses

interface HumorResponse {
  comment: string
  emoji: string
}

const humorDatabase: Record<number, HumorResponse[]> = {
  200: [
    { comment: "Looks like this API had a good breakfast today", emoji: "☕" },
    { comment: "Smooth as butter. The platypus approves", emoji: "✨" },
    { comment: "200 OK - The only relationship status that matters", emoji: "💚" },
    { comment: "This API is showing off. We love to see it", emoji: "🎯" },
    { comment: "Perfect response. Did you bribe the server?", emoji: "🏆" },
  ],
  201: [
    { comment: "Created! Something new was born. Congratulations!", emoji: "🎉" },
    { comment: "201 - The API just became a parent", emoji: "👶" },
    { comment: "Resource created successfully. The platypus is proud", emoji: "🌟" },
  ],
  204: [
    { comment: "No content, but that's okay. Sometimes silence is golden", emoji: "🤐" },
    { comment: "204 - The strong, silent type", emoji: "🗿" },
    { comment: "Empty response. Minimalism at its finest", emoji: "🎨" },
  ],
  400: [
    { comment: "Bad request. Did you type that with your elbows?", emoji: "🤦" },
    { comment: "The API is confused. So are we", emoji: "😵" },
    { comment: "400 - Translation: 'What are you even asking for?'", emoji: "❓" },
    { comment: "This request needs therapy", emoji: "🛋️" },
  ],
  401: [
    { comment: "Unauthorized. Did you forget your hall pass?", emoji: "🚫" },
    { comment: "The bouncer says no. Try showing some credentials", emoji: "💂" },
    { comment: "401 - You shall not pass!", emoji: "🧙" },
  ],
  403: [
    { comment: "Forbidden. This API has trust issues", emoji: "🔒" },
    { comment: "403 - Even with credentials, you're not invited", emoji: "⛔" },
    { comment: "Access denied. The API is playing hard to get", emoji: "🚷" },
  ],
  404: [
    { comment: "Not found. Did you look under the couch?", emoji: "🔍" },
    { comment: "404 - This endpoint is on vacation", emoji: "🏝️" },
    { comment: "Oops... searching for something that never existed?", emoji: "👻" },
    { comment: "The API ghosted you. Classic 404 move", emoji: "💔" },
  ],
  429: [
    { comment: "Too many requests. The API needs a break", emoji: "😤" },
    { comment: "Slow down there, speed racer", emoji: "🏎️" },
    { comment: "429 - You're being too clingy", emoji: "🚦" },
  ],
  500: [
    { comment: "Internal server error. It's not you, it's them", emoji: "💥" },
    { comment: "500 - The server just had an existential crisis", emoji: "😱" },
    { comment: "Something broke! But hey, at least you found a bug", emoji: "🐛" },
    { comment: "The API is having a bad day. We've all been there", emoji: "☠️" },
  ],
  502: [
    { comment: "Bad gateway. The middleman messed up", emoji: "🚧" },
    { comment: "502 - Lost in translation between servers", emoji: "📡" },
  ],
  503: [
    { comment: "Service unavailable. The API is taking a nap", emoji: "😴" },
    { comment: "503 - Currently out to lunch", emoji: "🍔" },
    { comment: "The server is on strike. Union rules", emoji: "⚠️" },
  ],
  504: [
    { comment: "Gateway timeout. The API is stuck in traffic", emoji: "🐌" },
    { comment: "504 - Still waiting... and waiting... and...", emoji: "⏰" },
  ],
}

export function generateHumorousComment(statusCode: number, responseTime: number): HumorResponse {
  // Get status code category (200, 400, 500, etc.)
  const category = Math.floor(statusCode / 100) * 100

  // Add response time commentary
  let timeComment = ""
  if (responseTime < 100) {
    timeComment = " Lightning fast! ⚡"
  } else if (responseTime > 3000) {
    timeComment = " Took its sweet time though... 🐢"
  }

  // Get humorous comment for status code
  const comments = humorDatabase[statusCode] ||
    humorDatabase[category] || [
      { comment: `Status ${statusCode} - The platypus has never seen this before`, emoji: "🤔" },
    ]

  const selected = comments[Math.floor(Math.random() * comments.length)]

  return {
    comment: selected.comment + timeComment,
    emoji: selected.emoji,
  }
}

export function getBugSeverityComment(severity: string): string {
  const comments = {
    critical: "The API exploded into a thousand JSONs. No workaround (unless you want to cry)",
    high: "This is bad. Like, 'wake up the on-call engineer' bad",
    medium: "Annoying but survivable. Like a mosquito at 3 AM",
    low: "Barely a bug. More like a feature with commitment issues",
  }
  return comments[severity as keyof typeof comments] || "The platypus is confused about this severity"
}
