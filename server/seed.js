const mongoose = require('mongoose');
const Job = require('./models/Job');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement-portal')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedJobs = [
    {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'Full-time',
        description: 'We are looking for a skilled software engineer with React and Node.js experience.',
        requirements: ['React', 'Node.js', 'MongoDB'],
        salaryRange: '$80,000 - $120,000'
    },
    {
        title: 'Product Manager',
        company: 'Innovate Ltd',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Lead our product team to build the next generation of tools.',
        requirements: ['3+ years PM experience', 'Agile', 'Jira'],
        salaryRange: '$100,000 - $140,000'
    },
    {
        title: 'Data Scientist Intern',
        company: 'DataFlow',
        location: 'San Francisco, CA',
        type: 'Internship',
        description: 'Join our data team for a summer internship.',
        requirements: ['Python', 'SQL', 'Machine Learning'],
        salaryRange: '$40/hr'
    }
];

const seedDB = async () => {
    await Job.deleteMany({});
    await Job.insertMany(seedJobs);
    console.log('Database seeded!');
    mongoose.connection.close();
};

seedDB();
