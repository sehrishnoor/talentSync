const { Skill, User, UserSkill } = require('../models');
const bcrypt = require('bcryptjs');

const skills = [
  { name: 'JavaScript', category: 'technical' },
  { name: 'TypeScript', category: 'technical' },
  { name: 'Python', category: 'technical' },
  { name: 'Java', category: 'technical' },
  { name: 'C++', category: 'technical' },
  { name: 'Go', category: 'technical' },
  { name: 'Rust', category: 'technical' },
  { name: 'React', category: 'technical' },
  { name: 'Vue.js', category: 'technical' },
  { name: 'Angular', category: 'technical' },
  { name: 'Node.js', category: 'technical' },
  { name: 'Express.js', category: 'technical' },
  { name: 'Django', category: 'technical' },
  { name: 'FastAPI', category: 'technical' },
  { name: 'Spring Boot', category: 'technical' },
  { name: 'MySQL', category: 'technical' },
  { name: 'PostgreSQL', category: 'technical' },
  { name: 'MongoDB', category: 'technical' },
  { name: 'Redis', category: 'technical' },
  { name: 'Docker', category: 'technical' },
  { name: 'Kubernetes', category: 'technical' },
  { name: 'AWS', category: 'technical' },
  { name: 'Git', category: 'technical' },
  { name: 'GraphQL', category: 'technical' },
  { name: 'REST APIs', category: 'technical' },
  { name: 'Machine Learning', category: 'technical' },
  { name: 'Deep Learning', category: 'technical' },
  { name: 'Data Analysis', category: 'technical' },
  { name: 'Figma', category: 'design' },
  { name: 'UI/UX Design', category: 'design' },
  { name: 'Adobe XD', category: 'design' },
  { name: 'Photoshop', category: 'design' },
  { name: 'Illustrator', category: 'design' },
  { name: 'Motion Design', category: 'design' },
  { name: '3D Modeling', category: 'design' },
  { name: 'Communication', category: 'soft' },
  { name: 'Leadership', category: 'soft' },
  { name: 'Problem Solving', category: 'soft' },
  { name: 'Team Collaboration', category: 'soft' },
  { name: 'Critical Thinking', category: 'soft' },
  { name: 'Time Management', category: 'soft' },
  { name: 'Agile', category: 'management' },
  { name: 'Scrum', category: 'management' },
  { name: 'Project Management', category: 'management' },
  { name: 'Product Management', category: 'management' },
  { name: 'Business Analysis', category: 'management' },
  { name: 'DevOps', category: 'technical' },
  { name: 'Cybersecurity', category: 'technical' },
  { name: 'Blockchain', category: 'technical' },
  { name: 'Flutter', category: 'technical' },
  { name: 'React Native', category: 'technical' },
];

const states = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
  'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'
];

const seedDatabase = async () => {
  try {
    console.log('Seeding skills...');
    for (const sk of skills) {
      await Skill.findOrCreate({ where: { name: sk.name }, defaults: sk });
    }

    console.log('Seeding admin user...');
    const hash = await bcrypt.hash('Admin@123', 12);
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@talentsync.com' },
      defaults: { name: 'TalentSync Admin', email: 'admin@talentsync.com', password_hash: hash, role: 'admin', state: 'Islamabad Capital Territory', bio: 'System Administrator', is_available: false },
    });

    console.log('Seeding demo users...');
    const demoUsers = [
      { name: 'Ammar Ahmed', email: 'ammar@demo.com', state: 'Punjab', bio: 'Full-stack developer passionate about building impactful products.', skillNames: ['React', 'Node.js', 'MySQL', 'Docker'] },
      { name: 'Fatima Ali', email: 'fatima@demo.com', state: 'Sindh', bio: 'UI/UX designer with a love for creating intuitive interfaces.', skillNames: ['Figma', 'UI/UX Design', 'Adobe XD', 'React'] },
      { name: 'Bilal Khan', email: 'bilal@demo.com', state: 'Islamabad Capital Territory', bio: 'Machine learning engineer exploring AI-driven solutions.', skillNames: ['Python', 'Machine Learning', 'Deep Learning', 'Data Analysis'] },
      { name: 'Zainab Qazi', email: 'zainab@demo.com', state: 'Khyber Pakhtunkhwa', bio: 'Backend developer specialized in scalable microservices.', skillNames: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes'] },
      { name: 'Hamza Baloch', email: 'hamza@demo.com', state: 'Balochistan', bio: 'Mobile developer building cross-platform applications.', skillNames: ['Flutter', 'React Native', 'JavaScript', 'Firebase'] },
    ];

    const allSkills = await Skill.findAll();
    const skillMap = {};
    allSkills.forEach(s => { skillMap[s.name] = s.id; });

    for (const u of demoUsers) {
      const ph = await bcrypt.hash('Demo@123', 12);
      const [user] = await User.findOrCreate({
        where: { email: u.email },
        defaults: { name: u.name, email: u.email, password_hash: ph, state: u.state, bio: u.bio, avg_rating: (3.5 + Math.random() * 1.5).toFixed(1), total_ratings: Math.floor(Math.random() * 20) + 5, is_available: true },
      });
      for (let i = 0; i < u.skillNames.length; i++) {
        const sid = skillMap[u.skillNames[i]];
        if (sid) {
          await UserSkill.findOrCreate({ where: { user_id: user.id, skill_id: sid }, defaults: { proficiency: Math.floor(Math.random() * 3) + 3, years_experience: Math.floor(Math.random() * 4) + 1 } });
        }
      }
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedDatabase;
