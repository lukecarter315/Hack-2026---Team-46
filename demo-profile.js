import { CAMPUS_TIMEZONE } from './scheduling.js';

export const jonathanDemoProfile = {
  name: 'Jonathan Vuppu',
  major: 'Mechanical Engineering',
  year: 'Second year',
  email: 'demo@example.edu',
  demo: true,
  networkingOpen: true,
  bio: 'I’m a second-year Mechanical Engineering student at Ohio State. I enjoy hands-on design, CAD, and building things with a team. I’m looking to meet other STEM students, join engineering clubs, and get involved in projects where I can learn new skills and put classroom ideas into practice.',
  professionalInterests: ['Mechanical Design', 'CAD', '3D Printing', 'Robotics', 'Manufacturing & machining', 'Chassis & suspension design', 'CAD workshops', 'Design competitions', 'Off-road vehicle design', 'CAD & simulation', 'Engineering', 'Prototyping'],
  casualInterests: ['Garage hangouts & car culture', 'Competition travel', 'Coffee'],
  additionalInterests: [],
  ethnicity: '',
  communityInterests: [],
  timeZone: CAMPUS_TIMEZONE,
  availability: [
    { id: 'jon-mon', day: 1, start: '15:00', end: '18:00' },
    { id: 'jon-wed', day: 3, start: '14:00', end: '17:00' },
    { id: 'jon-fri', day: 5, start: '13:00', end: '16:00' },
    { id: 'jon-sat', day: 6, start: '10:00', end: '14:00' },
  ],
};

export function createDemoProfile() { return structuredClone(jonathanDemoProfile); }
