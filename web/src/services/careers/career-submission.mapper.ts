/** Live Strapi `submissions-job-openings` request shape (verified via Postman). */
export type StrapiCareerJobSubmissionPayload = {
  jobID: string;
  jobTitle: string;
  location: string;
  department: string;
  experience: string;
  workflowStatus: "new";
  personalDetails: {
    Name: string;
    PhoneNo: string;
    EmailId: string;
    DOB: string;
    Gender: string;
  };
  educationDetails: {
    Degree: string;
    AreaOfStudy: string;
    Year: string;
  };
  workExperience: {
    RelvWorkExp: string;
    CurrCompName: string;
    CurrJobTitle: string;
    CurrCtc: number;
    ExpecCtc: number;
    NoticePerd: number;
  };
  skillsAndLanguages: {
    Skills: Array<{ SkillName: string }>;
    Languages: Array<{ SkillName: string }>;
  };
  addInfo: {
    relation: boolean;
    EmpName: string;
    EmpJobTitle: string;
  };
};

export type CareerJobSubmissionFormPayload = {
  jobID: string;
  jobTitle: string;
  location: string;
  department: string;
  experience: string;
  personalDetails: {
    fullName: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  };
  educationDetails: {
    highestDegree: string;
    areaOfStudy: string;
    yearOfCompletion: string;
  };
  workExperience: {
    relevantExperience: string;
    currentCompany: string;
    currentJobTitle: string;
    currentCtc: string;
    expectedCtc: string;
    noticePeriod: string;
  };
  skillsAndLanguages: {
    skills: string[];
    languages: string[];
  };
  addInfo: {
    hasCompanyRelation: boolean | null;
    employeeName: string;
    employeeJobTitle: string;
  };
};

export function parseCtcLpa(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  const match = trimmed.match(/\d+/);
  if (match) {
    return Number.parseInt(match[0], 10);
  }

  const numeric = Number.parseInt(trimmed, 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function isValidCtcLpa(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  return /\d/.test(trimmed) && parseCtcLpa(trimmed) >= 0;
}

function parseNoticePeriodDays(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  if (/^immediate$/i.test(trimmed)) {
    return 0;
  }

  const match = trimmed.match(/\d+/);
  if (match) {
    return Number.parseInt(match[0], 10);
  }

  const numeric = Number.parseInt(trimmed, 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function mapCareerJobSubmissionToStrapi(
  payload: CareerJobSubmissionFormPayload,
): StrapiCareerJobSubmissionPayload {
  const { personalDetails, educationDetails, workExperience, skillsAndLanguages, addInfo } =
    payload;

  return {
    jobID: payload.jobID,
    jobTitle: payload.jobTitle,
    location: payload.location,
    department: payload.department,
    experience: payload.experience,
    workflowStatus: "new",
    personalDetails: {
      Name: personalDetails.fullName,
      PhoneNo: personalDetails.phone,
      EmailId: personalDetails.email,
      DOB: personalDetails.dateOfBirth,
      Gender: personalDetails.gender,
    },
    educationDetails: {
      Degree: educationDetails.highestDegree,
      AreaOfStudy: educationDetails.areaOfStudy,
      Year: educationDetails.yearOfCompletion,
    },
    workExperience: {
      RelvWorkExp: workExperience.relevantExperience,
      CurrCompName: workExperience.currentCompany,
      CurrJobTitle: workExperience.currentJobTitle,
      CurrCtc: parseCtcLpa(workExperience.currentCtc),
      ExpecCtc: parseCtcLpa(workExperience.expectedCtc),
      NoticePerd: parseNoticePeriodDays(workExperience.noticePeriod),
    },
    skillsAndLanguages: {
      Skills: skillsAndLanguages.skills.map((skill) => ({ SkillName: skill })),
      Languages: skillsAndLanguages.languages.map((language) => ({ SkillName: language })),
    },
    addInfo: {
      relation: addInfo.hasCompanyRelation === true,
      EmpName: addInfo.employeeName,
      EmpJobTitle: addInfo.employeeJobTitle,
    },
  };
}
