import { getAthleteData } from "./utils";

const STORAGE_KEY = 'athlete-management-data';

export const getAthletes = async () => {
  try {
    // const data = localStorage.getItem(STORAGE_KEY);
    const data = await getAthleteData();
    return data;
  } catch (error) {
    console.error('Error loading athletes:', error);
    return [];
  }
};

export const saveAthlete = (formData) => {
  const athletes = getAthletes();
  
  const newAthlete = {
    id: generateId(),
    srNo: athletes.length + 1,
    kiuid: formData.kiuid,
    name: formData.name,
    athletePhoto: formData.athletePhoto,
    weight: formData.weight,
    dob: formData.dob,
    dobb: formData.dobb,
    dateOfJoiningNCOE: formData.dateOfJoiningNCOE,
    age: formData.age,
    ncoeKia: formData.ncoeKia,
    achievementsBeforeJoining: formData.achievementsBeforeJoining,
    performanceAfterJoining: formData.performanceAfterJoining,
    totalPoints: formData.totalPoints,
    shortTermTarget: formData.shortTermTarget,
    longTermTarget: formData.longTermTarget,
    dateOfIssuedWarning: formData.dateOfIssuedWarning,
    remarksOfMappedCoach: formData.remarksOfMappedCoach,
    nameAndSignatureOfCoach: formData.nameAndSignatureOfCoach,
    sc: formData.sc,
    physiotherapist: formData.physiotherapist,
    psychology: formData.psychology,
    physiology: formData.physiology,
    anthropometry: formData.anthropometry,
    nutrition: formData.nutrition,
    biomechanics: formData.biomechanics,
    createdAt: new Date().toISOString()
  };
  
  athletes.push(newAthlete);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
  
  return newAthlete;
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Mock Google Sheets integration
export const mockGoogleSheetsAPI = {
  appendRow: async (athlete) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would make an API call to Google Sheets
    console.log('Mock Google Sheets API - Appending row:', {
      srNo: athlete.srNo,
      kiuid: athlete.kiuid,
      name: athlete.name,
      athletePhoto: athlete.athletePhoto,
      weight: athlete.weight,
      dob: athlete.dob,
      dobb: athlete.dobb,
      dateOfJoiningNCOE: athlete.dateOfJoiningNCOE,
      age: athlete.age,
      ncoeKia: athlete.ncoeKia,
      achievementsBeforeJoining: athlete.achievementsBeforeJoining,
      performanceAfterJoining: athlete.performanceAfterJoining,
      totalPoints: athlete.totalPoints,
      shortTermTarget: athlete.shortTermTarget,
      longTermTarget: athlete.longTermTarget,
      dateOfIssuedWarning: athlete.dateOfIssuedWarning,
      remarksOfMappedCoach: athlete.remarksOfMappedCoach,
      nameAndSignatureOfCoach: athlete.nameAndSignatureOfCoach,
      sc: athlete.sc,
      physiotherapist: athlete.physiotherapist,
      psychology: athlete.psychology,
      physiology: athlete.physiology,
      anthropometry: athlete.anthropometry,
      nutrition: athlete.nutrition,
      biomechanics: athlete.biomechanics,
      createdAt: athlete.createdAt
    });
    
    return true;
  }
};