import type { UserProfile } from './types';

export const currentUser: UserProfile = {
    id: 'user-current',
    name: 'Alex Doe',
    avatarUrl: 'https://picsum.photos/seed/10/200/200',
    bio: 'Full-stack developer with a passion for creating beautiful and functional web applications. Interested in AI, serverless technologies, and building cool side projects. Looking for a team to join for the next big hackathon!',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS'],
    interests: ['AI/ML', 'Developer Tools', 'Fintech', 'Music'],
    projectPreferences: 'I am looking for a project that involves cutting-edge technology, preferably in the AI or developer tools space. I enjoy working in a fast-paced environment and am open to both front-end and back-end roles. I would love to build something that has a real-world impact.'
};

export const teammates: (UserProfile & { matchScore: number })[] = [
  {
    id: 'user-1',
    name: 'Samira Khan',
    avatarUrl: 'https://picsum.photos/seed/1/200/200',
    bio: 'UX/UI designer focused on creating intuitive and user-centered designs. I love turning complex problems into simple and elegant solutions. My toolkit includes Figma, Adobe XD, and a strong understanding of design systems.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Systems'],
    interests: ['Social Impact', 'Education Tech', 'Mobile Apps'],
    projectPreferences: 'Passionate about creating a mobile app for social good. I want to work on a project that can help people. I am a strong visual designer and can quickly create prototypes.',
    matchScore: 92,
  },
  {
    id: 'user-2',
    name: 'Ben Carter',
    avatarUrl: 'https://picsum.photos/seed/2/200/200',
    bio: 'Data scientist and Python enthusiast. I enjoy finding stories in data and building predictive models. Experienced with Scikit-learn, Pandas, and TensorFlow. Looking to apply my skills in a competitive buildathon environment.',
    skills: ['Python', 'Data Science', 'Machine Learning', 'TensorFlow', 'Pandas'],
    interests: ['AI/ML', 'Big Data', 'Health Tech'],
    projectPreferences: 'I want to work on a data-intensive project. My ideal team would have a mix of data scientists and software engineers to build a robust AI-powered application. Open to any interesting problem domain.',
    matchScore: 88,
  },
  {
    id: 'user-3',
    name: 'Chloe Garcia',
    avatarUrl: 'https://picsum.photos/seed/3/200/200',
    bio: 'Product manager with experience in agile methodologies and leading cross-functional teams. I am passionate about building products that users love. Great at defining product vision, and roadmap planning.',
    skills: ['Product Management', 'Agile', 'JIRA', 'Roadmap Planning', 'User Stories'],
    interests: ['SaaS', 'E-commerce', 'Productivity Tools'],
    projectPreferences: 'Looking for a skilled team of developers and designers to build a SaaS product. I can help define the MVP, manage the project, and ensure we stay on track to deliver a winning product.',
    matchScore: 85,
  },
   {
    id: 'user-4',
    name: 'Leo Martinez',
    avatarUrl: 'https://picsum.photos/seed/4/200/200',
    bio: 'Mobile developer specializing in native iOS and Android development. Proficient in Swift, Kotlin, and React Native. I love building smooth and performant mobile experiences.',
    skills: ['Swift', 'Kotlin', 'iOS', 'Android', 'React Native'],
    interests: ['Mobile Gaming', 'Social Media', 'IoT'],
    projectPreferences: 'Interested in a mobile-first project. I can handle the entire mobile development lifecycle, from development to deployment on the app stores. Looking for a team with strong design and backend skills.',
    matchScore: 78,
  },
];