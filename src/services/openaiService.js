import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let openaiClient = null;

function getClient() {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
    }
    return openaiClient;
}

export async function parseUploadedCV(fileText) {
    const client = getClient();

    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `You are a CV/resume parser. Extract structured information from the provided resume text and return it as JSON. Return ONLY valid JSON with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": "",
    "github": "",
    "summary": ""
  },
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "graduationDate": "",
      "gpa": ""
    }
  ],
  "skills": {
    "languages": "",
    "frameworks": "",
    "devops": "",
    "databases": "",
    "other": ""
  },
  "certifications": [""],
  "hobbies": [""]
}

Fill in as many fields as possible from the resume text. If a field is not found, leave it as empty string. For arrays, include at least one empty string if no items found. For experience bullets, extract the key accomplishments/responsibilities as separate items.`,
            },
            {
                role: 'user',
                content: `Parse this resume:\n\n${fileText}`,
            },
        ],
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    // Add IDs to experience and education
    if (parsed.experience) {
        parsed.experience = parsed.experience.map((exp) => ({
            ...exp,
            id: crypto.randomUUID(),
        }));
    }
    if (parsed.education) {
        parsed.education = parsed.education.map((edu) => ({
            ...edu,
            id: crypto.randomUUID(),
        }));
    }

    return parsed;
}

export async function tailorCVForJob(cvData, jobDescription) {
    const client = getClient();

    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `You are an expert CV/resume writer and career coach. Your job is to optimize a candidate's CV for a specific job description.

You must:
1. Rewrite the professional summary to directly target the job
2. Rewrite experience bullet points to emphasize relevant skills and achievements matching the job description
3. Use strong action verbs and quantify achievements where possible
4. Prioritize relevant experience and skills
5. Keep the information truthful — only enhance and rephrase, never fabricate

Return the optimized CV as JSON with the EXACT same structure as input. Keep all fields, just improve the text content. Do NOT change names, dates, company names, or degree names — only improve descriptions, summaries, and bullet points.

Return ONLY valid JSON matching this structure:
{
  "personalInfo": { "fullName": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "github": "", "summary": "" },
  "experience": [{ "id": "", "jobTitle": "", "company": "", "startDate": "", "endDate": "", "current": false, "bullets": [""] }],
  "education": [{ "id": "", "degree": "", "institution": "", "graduationDate": "", "gpa": "" }],
  "skills": { "languages": "", "frameworks": "", "devops": "", "databases": "", "other": "" },
  "certifications": [""],
  "hobbies": [""]
}`,
            },
            {
                role: 'user',
                content: `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE CV DATA:\n${JSON.stringify(cvData, null, 2)}`,
            },
        ],
    });

    return JSON.parse(response.choices[0].message.content);
}

export async function extractTextFromPDF(file) {
    const pdfjsLib = await import('pdfjs-dist');
    const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + '\n';
    }

    return text;
}

export async function extractTextFromDOCX(file) {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
