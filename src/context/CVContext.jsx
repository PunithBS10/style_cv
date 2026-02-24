import { createContext, useContext, useState, useCallback } from 'react';

const CVContext = createContext(null);

const emptyCV = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    summary: '',
    photoUrl: '',
  },
  "experience": [
    {
      "id": crypto.randomUUID(),
      "jobTitle": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""]
    }
  ],
  "projects": [
    {
      "id": crypto.randomUUID(),
      "name": "",
      "technologies": "",
      "startDate": "",
      "endDate": "",
      "bullets": [""]
    }
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: '',
      institution: '',
      graduationDate: '',
      gpa: '',
    },
  ],
  skills: {
    programmingLanguages: '',
    languages: '',
    frameworks: '',
    devops: '',
    databases: '',
    other: '',
  },
  certifications: [''],
  hobbies: [''],
};

export function CVProvider({ children }) {
  const [cvData, setCvData] = useState(emptyCV);
  const [tailoredData, setTailoredData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0=home, 1=input, 2=template, 3=preview

  const updatePersonalInfo = useCallback((field, value) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const updateExperience = useCallback((index, field, value) => {
    setCvData((prev) => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  }, []);

  const addExperience = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: crypto.randomUUID(),
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          bullets: [''],
        },
      ],
    }));
  }, []);

  const removeExperience = useCallback((index) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  const updateExperienceBullet = useCallback((expIndex, bulletIndex, value) => {
    setCvData((prev) => {
      const exp = [...prev.experience];
      const bullets = [...exp[expIndex].bullets];
      bullets[bulletIndex] = value;
      exp[expIndex] = { ...exp[expIndex], bullets };
      return { ...prev, experience: exp };
    });
  }, []);

  const addExperienceBullet = useCallback((expIndex) => {
    setCvData((prev) => {
      const exp = [...prev.experience];
      exp[expIndex] = { ...exp[expIndex], bullets: [...exp[expIndex].bullets, ''] };
      return { ...prev, experience: exp };
    });
  }, []);

  const removeExperienceBullet = useCallback((expIndex, bulletIndex) => {
    setCvData((prev) => {
      const exp = [...prev.experience];
      exp[expIndex] = {
        ...exp[expIndex],
        bullets: exp[expIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, experience: exp };
    });
  }, []);

  const updateProject = useCallback((index, field, value) => {
    setCvData((prev) => {
      const proj = [...prev.projects];
      proj[index] = { ...proj[index], [field]: value };
      return { ...prev, projects: proj };
    });
  }, []);

  const addProject = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: crypto.randomUUID(),
          name: '',
          technologies: '',
          startDate: '',
          endDate: '',
          bullets: [''],
        },
      ],
    }));
  }, []);

  const removeProject = useCallback((index) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }, []);

  const updateProjectBullet = useCallback((projIndex, bulletIndex, value) => {
    setCvData((prev) => {
      const proj = [...prev.projects];
      const bullets = [...proj[projIndex].bullets];
      bullets[bulletIndex] = value;
      proj[projIndex] = { ...proj[projIndex], bullets };
      return { ...prev, projects: proj };
    });
  }, []);

  const addProjectBullet = useCallback((projIndex) => {
    setCvData((prev) => {
      const proj = [...prev.projects];
      proj[projIndex] = { ...proj[projIndex], bullets: [...proj[projIndex].bullets, ''] };
      return { ...prev, projects: proj };
    });
  }, []);

  const removeProjectBullet = useCallback((projIndex, bulletIndex) => {
    setCvData((prev) => {
      const proj = [...prev.projects];
      proj[projIndex] = {
        ...proj[projIndex],
        bullets: proj[projIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, projects: proj };
    });
  }, []);

  const updateEducation = useCallback((index, field, value) => {
    setCvData((prev) => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  }, []);

  const addEducation = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: crypto.randomUUID(), degree: '', institution: '', graduationDate: '', gpa: '' },
      ],
    }));
  }, []);

  const removeEducation = useCallback((index) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSkills = useCallback((field, value) => {
    setCvData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [field]: value },
    }));
  }, []);

  const updateCertifications = useCallback((index, value) => {
    setCvData((prev) => {
      const certs = [...prev.certifications];
      certs[index] = value;
      return { ...prev, certifications: certs };
    });
  }, []);

  const addCertification = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ''],
    }));
  }, []);

  const removeCertification = useCallback((index) => {
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }, []);

  const updateHobbies = useCallback((index, value) => {
    setCvData((prev) => {
      const hobbies = [...prev.hobbies];
      hobbies[index] = value;
      return { ...prev, hobbies };
    });
  }, []);

  const addHobby = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      hobbies: [...prev.hobbies, ''],
    }));
  }, []);

  const removeHobby = useCallback((index) => {
    setCvData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setCvData(emptyCV);
    setTailoredData(null);
    setJobDescription('');
    setSelectedTemplate('modern');
    setCurrentStep(0);
  }, []);

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCvData,
        tailoredData,
        setTailoredData,
        jobDescription,
        setJobDescription,
        selectedTemplate,
        setSelectedTemplate,
        isProcessing,
        setIsProcessing,
        processingStatus,
        setProcessingStatus,
        currentStep,
        setCurrentStep,
        updatePersonalInfo,
        updateExperience,
        addExperience,
        removeExperience,
        updateExperienceBullet,
        addExperienceBullet,
        removeExperienceBullet,
        updateProject,
        addProject,
        removeProject,
        updateProjectBullet,
        addProjectBullet,
        removeProjectBullet,
        updateEducation,
        addEducation,
        removeEducation,
        updateSkills,
        updateCertifications,
        addCertification,
        removeCertification,
        updateHobbies,
        addHobby,
        removeHobby,
        resetAll,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within CVProvider');
  return context;
}
