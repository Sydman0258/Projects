require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  }
});

// Extract text from DOCX
async function extractTextFromDocx(filePath) {
  try {
    console.log('Extracting text from:', filePath);
    const result = await mammoth.extractRawText({ path: filePath });
    console.log('Extracted text length:', result.value.length);
    return result.value;
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from resume: ' + error.message);
  }
}

// Extract keywords from text
function extractKeywords(text) {
  // Convert to lowercase and remove special characters
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s\+\#]/g, ' ');
  
  // Split into words
  const words = cleaned.split(/\s+/).filter(word => word.length > 2);
  
  // Common stopwords to filter out
  const stopwords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
    'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old',
    'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too',
    'use', 'with', 'have', 'will', 'this', 'that', 'from', 'they', 'been', 'than', 'then',
    'them', 'what', 'when', 'your', 'into', 'time', 'work', 'year', 'more', 'over', 'also'
  ]);
  
  // Filter and get unique words
  const keywords = [...new Set(words.filter(word => !stopwords.has(word)))];
  
  return keywords;
}

// Extract skills/technologies (common programming/tech terms)
function extractSkills(text) {
  const skillPatterns = [
    // Programming languages
    'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'php', 'ruby', 'swift', 'kotlin',
    'typescript', 'go', 'rust', 'scala', 'perl', 'r\\b', 'matlab', 'sql',
    
    // Web technologies
    'html', 'css', 'react', 'angular', 'vue', 'node\\.?js', 'express', 'django',
    'flask', 'spring', 'laravel', 'jquery', 'bootstrap', 'tailwind', 'sass', 'webpack',
    
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sql\\s?server', 'dynamodb',
    'cassandra', 'elasticsearch', 'firebase',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'google\\s?cloud', 'docker', 'kubernetes', 'jenkins',
    'terraform', 'ansible', 'gitlab', 'github', 'bitbucket', 'ci\\/cd',
    
    // Frameworks & Tools
    'git', 'linux', 'unix', 'agile', 'scrum', 'jira', 'rest', 'api', 'graphql',
    'microservices', 'webpack', 'babel', 'jest', 'junit', 'selenium',
    
    // Soft skills & concepts
    'leadership', 'management', 'communication', 'teamwork', 'problem\\s?solving',
    'analytical', 'creative', 'detail\\s?oriented', 'time\\s?management',
    
    // Other tech
    'machine\\s?learning', 'artificial\\s?intelligence', 'data\\s?science',
    'blockchain', 'iot', 'cybersecurity', 'networking', 'mobile', 'android', 'ios'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  for (const pattern of skillPatterns) {
    const regex = new RegExp('\\b' + pattern + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      // Normalize the skill name
      const skillName = matches[0].toLowerCase().replace(/\s+/g, ' ').trim();
      if (!foundSkills.includes(skillName)) {
        foundSkills.push(skillName);
      }
    }
  }
  
  return foundSkills;
}

// Calculate match score
function calculateMatchScore(resumeText, requirementsText) {
  const resumeLower = resumeText.toLowerCase();
  const requirementsLower = requirementsText.toLowerCase();
  
  // Extract all keywords
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const requirementKeywords = extractKeywords(requirementsText);
  
  // Extract skills
  const resumeSkills = new Set(extractSkills(resumeText));
  const requirementSkills = extractSkills(requirementsText);
  
  // Calculate keyword matches
  let keywordMatches = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  
  for (const keyword of requirementKeywords) {
    if (resumeKeywords.has(keyword)) {
      keywordMatches++;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }
  
  // Calculate skill matches
  let skillMatches = 0;
  const matchedSkills = [];
  const missingSkills = [];
  
  for (const skill of requirementSkills) {
    if (resumeSkills.has(skill)) {
      skillMatches++;
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  // Calculate scores
  const keywordScore = requirementKeywords.length > 0 
    ? Math.round((keywordMatches / requirementKeywords.length) * 100) 
    : 0;
    
  const skillScore = requirementSkills.length > 0
    ? Math.round((skillMatches / requirementSkills.length) * 100)
    : 0;
  
  // Overall score (weighted: 40% keywords, 60% skills)
  const overallScore = Math.round((keywordScore * 0.4) + (skillScore * 0.6));
  
  // Experience level detection
  const experienceMatch = detectExperience(resumeText, requirementsText);
  
  return {
    overallScore,
    keywordScore,
    skillScore,
    keywordMatches: {
      total: requirementKeywords.length,
      matched: keywordMatches,
      matchedList: matchedKeywords.slice(0, 20), // Top 20
      missingList: missingKeywords.slice(0, 10)  // Top 10 missing
    },
    skillMatches: {
      total: requirementSkills.length,
      matched: skillMatches,
      matchedList: matchedSkills,
      missingList: missingSkills
    },
    experienceMatch,
    recommendation: getRecommendation(overallScore)
  };
}

// Detect experience level
function detectExperience(resumeText, requirementsText) {
  const resumeLower = resumeText.toLowerCase();
  const requirementsLower = requirementsText.toLowerCase();
  
  // Extract years from requirements
  const reqYearsMatch = requirementsLower.match(/(\d+)\+?\s*(years?|yrs?)/i);
  const requiredYears = reqYearsMatch ? parseInt(reqYearsMatch[1]) : 0;
  
  // Extract years from resume (look for experience mentions)
  const resumeYearsMatches = resumeLower.match(/(\d+)\+?\s*(years?|yrs?)/gi) || [];
  const resumeYears = resumeYearsMatches.map(match => {
    const num = match.match(/\d+/);
    return num ? parseInt(num[0]) : 0;
  });
  
  const maxResumeYears = resumeYears.length > 0 ? Math.max(...resumeYears) : 0;
  
  return {
    required: requiredYears,
    found: maxResumeYears,
    meets: maxResumeYears >= requiredYears
  };
}

// Get recommendation based on score
function getRecommendation(score) {
  if (score >= 80) {
    return {
      level: 'Excellent Match',
      message: 'Your resume is a strong match for this position. You should definitely apply!',
      color: '#22c55e'
    };
  } else if (score >= 60) {
    return {
      level: 'Good Match',
      message: 'Your resume shows good alignment. Consider emphasizing relevant skills more.',
      color: '#3b82f6'
    };
  } else if (score >= 40) {
    return {
      level: 'Moderate Match',
      message: 'Your resume has some relevant experience. Add more matching keywords and skills.',
      color: '#f59e0b'
    };
  } else {
    return {
      level: 'Low Match',
      message: 'Your resume needs significant updates to match this position better.',
      color: '#ef4444'
    };
  }
}

// API Routes
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  console.log('\n=== New analyze request ===');
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    if (!req.body.requirements) {
      return res.status(400).json({ error: 'Job requirements are required' });
    }

    console.log('File uploaded:', req.file.originalname);
    console.log('File size:', req.file.size, 'bytes');

    const { requirements } = req.body;
    const resumePath = req.file.path;

    // Extract text from uploaded resume
    const resumeText = await extractTextFromDocx(resumePath);

    // Calculate match score
    const analysis = calculateMatchScore(resumeText, requirements);

    // Clean up uploaded file
    fs.unlinkSync(resumePath);

    console.log('Analysis complete. Overall score:', analysis.overallScore);
    console.log('=== Request completed successfully ===\n');

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process resume',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Resume Match Analyzer API is running'
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📊 Resume Match Analyzer - No API key needed!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});
