const originalProjects = [
  { id: 'p1', title: 'Campus, through our lens', category: 'Creative', color: 'peach', symbol: '◉', tagline: 'A different perspective on the place we share.', description: 'Help create a student photo journal of the everyday places and people that make campus feel like home. We’ll explore together, share techniques, and put on a small exhibition.', tags: ['Photography', 'Storytelling', 'Design'], needs: 'Photographers, curious explorers & visual storytellers', owner: 'Sofia Rivera', initials: 'SR', time: '2–3 hours / week', duration: '4 weeks', place: 'Campus art spaces', learn: 'Practice visual storytelling, curate a collection, and learn from other student photographers.' },
  { id: 'p2', title: 'The greener route', category: 'Community', color: 'sage', symbol: '↗', tagline: 'Small discoveries. A lighter footprint.', description: 'Map the best walking routes, quiet green spaces, and refill spots around campus. We’re building a friendly guide that helps students explore more and waste less.', tags: ['Hiking', 'Sustainability', 'Maps'], needs: 'Walkers, researchers & people who care about the outdoors', owner: 'Maya Chen', initials: 'MC', time: '1–2 hours / week', duration: '6 weeks', place: 'Around campus', learn: 'Learn community research and turn observations into a useful campus resource.' },
  { id: 'p3', title: 'Coffee & a little code', category: 'Technology', color: 'lavender', symbol: '⌘', tagline: 'Build something small. Learn something big.', description: 'A low-pressure team building a café study-spot finder. Bring a favorite coffee spot or an idea. We’ll work together on research, design, and a simple working prototype.', tags: ['Coffee', 'Design', 'Coding'], needs: 'Developers, designers & first-time builders', owner: 'Jordan Williams', initials: 'JW', time: '2 hours / week', duration: '4 weeks', place: 'Campus café', learn: 'Try user research, interface design, or React with a supportive student team.' },
];
const additionalProjects = [
  {
    "id": "p4",
    "title": "Buckeye budget buddy",
    "tags": [
      "Finance",
      "Investing",
      "Financial Literacy",
      "Data Analytics"
    ],
    "category": "Finance",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Create a simple budgeting guide and calculator for students. Compare everyday costs, practice research, and explain financial ideas in plain language.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Sam Taylor",
    "initials": "ST",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Practice financial research and make a student-friendly resource."
  },
  {
    "id": "p5",
    "title": "Study tools, built together",
    "tags": [
      "Programming",
      "Artificial Intelligence",
      "Machine Learning",
      "Product Development"
    ],
    "category": "Technology",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Prototype a small study-planning tool. Bring an idea, try some coding or user research, and learn how a student team turns feedback into a first version.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Avery Patel",
    "initials": "AP",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Try software prototyping and build a useful tool with other students."
  },
  {
    "id": "p6",
    "title": "A more accessible campus",
    "tags": [
      "Assistive Technology",
      "3D Printing",
      "Mechanical Design",
      "Accessibility",
      "Robotics"
    ],
    "category": "Engineering",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Explore a small accessibility challenge through interviews, sketches, and a physical prototype. Looking for different perspectives and people who enjoy learning by making.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Noor Hassan",
    "initials": "NH",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Explore assistive design, prototyping, and accessibility research."
  },
  {
    "id": "p7",
    "title": "Community kitchen notebook",
    "tags": [
      "Cooking",
      "Food",
      "Volunteering",
      "Community",
      "Education"
    ],
    "category": "Community",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Collect easy student recipes and stories for a shared campus cookbook. Help photograph dishes, write recipes, or organize a low-pressure recipe swap.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Morgan Lee",
    "initials": "ML",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Learn community interviewing and turn shared knowledge into a useful guide."
  },
  {
    "id": "p8",
    "title": "Campus sound sessions",
    "tags": [
      "Music",
      "Performance",
      "Art",
      "Creative Writing"
    ],
    "category": "Creative",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Build a small collection of student music and spoken-word recordings. Bring a song, a story, recording skills, or simply a willingness to help.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Riley Evans",
    "initials": "RE",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Practice creative collaboration, recording, and event planning."
  },
  {
    "id": "p9",
    "title": "Fresh identities for student ideas",
    "tags": [
      "Marketing",
      "Branding",
      "Graphic Design",
      "Photography",
      "Entrepreneurship"
    ],
    "category": "Creative",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Create a starter visual identity for a student project. Explore its audience, sketch ideas, take photos, and share what you learn about communicating a new idea.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Alex Brooks",
    "initials": "AB",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Practice brand research and visual storytelling with a student team."
  },
  {
    "id": "p10",
    "title": "A tiny campus game",
    "tags": [
      "Video Games",
      "Game Design",
      "Programming",
      "Digital Art",
      "Prototyping"
    ],
    "category": "Technology",
    "color": "sage",
    "symbol": "⌘",
    "tagline": "A student idea with room for your perspective.",
    "description": "Make a small game inspired by campus life. Join as a coder, artist, designer, or playtester and help turn a playful idea into a first demo.",
    "needs": "Curious students and first-time collaborators welcome",
    "owner": "Drew Santos",
    "initials": "DS",
    "time": "1–2 hours / week",
    "duration": "4 weeks",
    "place": "Student union lounge",
    "learn": "Try game design, coding, and playtesting in a small student team."
  }
];
export const demoProjects = [...originalProjects, ...additionalProjects].map(project => ({ ...project, demo: true }));
