import { susheelDemoPerson } from './network-invites.js';
import { clubDemoConnections } from './club-connections.js';
const originalStudents = [
  { id: 1, name: 'Pratish Agarwal', initials: 'PA', major: 'Environmental Science', year: 'First year', color: 'peach', headline: 'Always taking the scenic route.', bio: 'New to campus, collecting coffee spots and looking for people who turn a quick walk into a little adventure. Currently learning film photography.', interests: ['Hiking', 'Photography', 'Coffee', 'Sustainability'], shared: ['Hiking', 'Photography', 'Coffee'], looking: 'A weekend adventure buddy & a familiar face on campus', activity: 'Let’s grab coffee and take a photo walk.', emoji: '🌿', mutual: true },
  { id: 2, name: 'Jeremy Perrin', initials: 'JP', major: 'Computer Science', year: 'Second year', color: 'lavender', headline: 'Good ideas start with “what if?”', bio: 'Building little things, making playlists, and finding the best study corners. Looking for friends who like creating things as much as getting outside.', interests: ['Design', 'Hiking', 'Music', 'Side projects'], shared: ['Hiking'], looking: 'People to build with, study with, and hang out with', activity: 'A coffee break between classes?', emoji: '🎧', mutual: false },
  { id: 3, name: 'Sofia Rivera', initials: 'SR', major: 'Visual Communication Design', year: 'First year', color: 'rose', headline: 'A sketchbook and somewhere new to go.', bio: 'Here for art, spontaneous plans, and meeting people outside my major. Usually taking photos of buildings or trying a new café.', interests: ['Photography', 'Art', 'Coffee', 'Cooking'], shared: ['Photography', 'Coffee'], looking: 'Creative friends and someone to explore campus with', activity: 'Explore the campus art spaces together.', emoji: '🎨', mutual: true },
  { id: 4, name: 'Eli Thompson', initials: 'ET', major: 'Mechanical Engineering', year: 'Third year', color: 'sage', headline: 'Outside is my favorite place to recharge.', bio: 'A casual climber, a very enthusiastic home cook, and a believer that everyone needs a break from the library. Happy to help newer students find their feet.', interests: ['Hiking', 'Climbing', 'Cooking', 'Sustainability'], shared: ['Hiking'], looking: 'A climbing partner and new friends across majors', activity: 'An easy walk and a good conversation.', emoji: '⛰️', mutual: true },
];
const additionalStudents = [
  {
    "id": 5,
    "name": "Avery Patel",
    "initials": "AP",
    "major": "Computer Science",
    "year": "First year",
    "color": "lavender",
    "headline": "A small build and a good coffee go a long way.",
    "bio": "Learning to turn ideas into useful tools. Looking for fellow students to build a little project, swap coding tips, and find a favorite study spot.",
    "interests": [
      "Programming",
      "Artificial Intelligence",
      "Data Science",
      "Coffee",
      "Side projects"
    ],
    "looking": "A coding buddy and new friends outside my classes",
    "activity": "Let’s grab coffee and swap project ideas.",
    "emoji": "💻",
    "mutual": true
  },
  {
    "id": 6,
    "name": "Sam Taylor",
    "initials": "ST",
    "major": "Finance",
    "year": "Second year",
    "color": "sage",
    "headline": "Curious about how ideas become businesses.",
    "bio": "Into investing, student entrepreneurship, and making finance less intimidating. Happy to practice cases, talk about a startup idea, or take a break over coffee.",
    "interests": [
      "Investing",
      "Financial Modeling",
      "Business Strategy",
      "Entrepreneurship",
      "Coffee"
    ],
    "looking": "People to learn finance and build ideas with",
    "activity": "Want to meet at the café and trade ideas?",
    "emoji": "📊",
    "mutual": true
  },
  {
    "id": 7,
    "name": "Noor Hassan",
    "initials": "NH",
    "major": "Biomedical Engineering",
    "year": "First year",
    "color": "peach",
    "headline": "Good design should make someone’s day easier.",
    "bio": "Interested in medical devices, accessibility, and hands-on projects. Looking for curious teammates who care about making useful things and helping others.",
    "interests": [
      "Medical Devices",
      "Assistive Technology",
      "3D Printing",
      "Research",
      "Volunteering"
    ],
    "looking": "Project teammates and friends who care about accessibility",
    "activity": "Let’s meet in the student union and talk about what we want to learn.",
    "emoji": "🛠️",
    "mutual": true
  },
  {
    "id": 8,
    "name": "Alex Brooks",
    "initials": "AB",
    "major": "Marketing",
    "year": "Second year",
    "color": "rose",
    "headline": "Every idea has a story worth telling.",
    "bio": "Usually sketching a campaign idea or helping friends give their project a visual identity. I’d love to meet people into branding, photography, and student businesses.",
    "interests": [
      "Marketing",
      "Branding",
      "Graphic Design",
      "Photography",
      "Entrepreneurship"
    ],
    "looking": "Creative collaborators and students trying out a business idea",
    "activity": "Want to bring a sketchbook and meet for coffee?",
    "emoji": "📷",
    "mutual": true
  },
  {
    "id": 9,
    "name": "Casey Morgan",
    "initials": "CM",
    "major": "Mechanical Engineering",
    "year": "First year",
    "color": "sage",
    "headline": "I learn best by making a first version.",
    "bio": "Into robotics, fabrication, and figuring out how things work. Looking for a friendly build team and people who are happy to learn as they go.",
    "interests": [
      "Robotics",
      "CAD",
      "Fabrication",
      "Mechanical Design",
      "Gaming"
    ],
    "looking": "A project team, maker friends, and a study partner",
    "activity": "Let’s meet at the student union and compare project ideas.",
    "emoji": "⚙️",
    "mutual": true
  },
  {
    "id": 10,
    "name": "Riley Evans",
    "initials": "RE",
    "major": "Music",
    "year": "Second year",
    "color": "lavender",
    "headline": "A playlist, a sketchbook, and a new conversation.",
    "bio": "Looking for people to make music and art with. I like low-pressure creative sessions, swapping favorite songs, and finding a reason to get off my screen.",
    "interests": [
      "Music",
      "Performance",
      "Creative Writing",
      "Art",
      "Coffee"
    ],
    "looking": "Creative friends and casual music collaborators",
    "activity": "Want to meet for coffee and swap a favorite song?",
    "emoji": "🎵",
    "mutual": true
  },
  {
    "id": 11,
    "name": "Morgan Lee",
    "initials": "ML",
    "major": "Education",
    "year": "First year",
    "color": "peach",
    "headline": "The best learning usually happens together.",
    "bio": "Interested in tutoring, outreach, and community projects. Looking for friends who like sharing what they know and trying something new on campus.",
    "interests": [
      "Education",
      "Mentorship",
      "STEM Outreach",
      "Volunteering",
      "Cooking"
    ],
    "looking": "Community-minded friends and a project that helps others",
    "activity": "Let’s take a study break at the student union.",
    "emoji": "📚",
    "mutual": true
  },
  {
    "id": 12,
    "name": "Drew Santos",
    "initials": "DS",
    "major": "Computer Science",
    "year": "Second year",
    "color": "sage",
    "headline": "Games are better when someone new joins in.",
    "bio": "Into game design, esports, and casual board-game nights. Looking for people to play with, brainstorm a small game, or just hang out between classes.",
    "interests": [
      "Game Design",
      "Video Games",
      "Programming",
      "Board games",
      "Esports"
    ],
    "looking": "Gaming friends and beginner game-building teammates",
    "activity": "Want to meet in the lounge and talk games?",
    "emoji": "🎮",
    "mutual": true
  }
];
export const demoStudents = [...originalStudents, ...additionalStudents, ...clubDemoConnections, susheelDemoPerson];
