

## 🔍 How It Works

### 1. Text Extraction
- Extracts raw text from uploaded .docx file
- Preserves all content for analysis

### 2. Keyword Analysis
- Splits text into individual words
- Removes common stopwords
- Compares with job requirements
- Calculates match percentage

### 3. Skills Detection
- Scans for 100+ common skills and technologies
- Identifies programming languages, frameworks, tools
- Matches against job requirements
- Lists found and missing skills

### 4. Experience Matching
- Detects years of experience mentions
- Compares with required experience
- Flags if below requirements

### 5. Score Calculation
```javascript
Overall Score = (Keyword Score × 0.4) + (Skills Score × 0.6)
```

## 📝 Supported Skills

The analyzer recognizes:
- **Programming Languages**: JavaScript, Python, Java, C++, C#, PHP, Ruby, Swift, Kotlin, TypeScript, Go, Rust, Scala, R, SQL, etc.
- **Web Technologies**: React, Angular, Vue, Node.js, Express, Django, Flask, HTML, CSS, etc.
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis, Oracle, SQL Server, etc.
- **Cloud & DevOps**: AWS, Azure, GCP, Docker, Kubernetes, Jenkins, Terraform, etc.
- **Tools**: Git, Linux, Agile, Scrum, JIRA, REST API, GraphQL, etc.
- **Soft Skills**: Leadership, Communication, Teamwork, Problem-solving, etc.


## 🐛 Troubleshooting

### "No resume file uploaded"
- Ensure file is .docx format (not .doc)
- Check file size is reasonable (<10MB)

### "Failed to extract text"
- File may be corrupted
- Try saving as new .docx file
- Ensure it's a Word document, not PDF

### Low Score Despite Good Match
- Add more specific keywords from job description
- List skills explicitly (e.g., "React.js" not just "frontend")
- Include industry terminology

### Skills Not Detected
- Use standard skill names
- List skills in dedicated "Skills" section
- Avoid abbreviations
