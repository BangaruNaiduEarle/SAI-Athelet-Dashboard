export async function submitAthleteData(formData) {
  // const WEB_APP_URL = "https://sheetdb.io/api/v1/3mg0d4jpi5l8m?sheet=Data Sheet";
  
  const WEB_APP_URL  = "https://sheetdb.io/api/v1/1rhvmzb6t6d8j?sheet=Data Sheet"

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
}

export async function getAthleteData() {
  // const WEB_APP_URL = "https://sheetdb.io/api/v1/3mg0d4jpi5l8m?sheet=Data Sheet"; 
    const WEB_APP_URL  = "https://sheetdb.io/api/v1/1rhvmzb6t6d8j?sheet=Data Sheet"


  try {
    const response = await fetch(WEB_APP_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
     
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Athelte DAta:", result)
    return result;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
}

export async function getAtData() {
  // const WEB_APP_URL = "https://sheetdb.io/api/v1/3mg0d4jpi5l8m?sheet=Sheet1"; 
    const WEB_APP_URL  = "https://sheetdb.io/api/v1/1rhvmzb6t6d8j?sheet=Sheet1"


  try {
    const response = await fetch(WEB_APP_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
     
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("At DAta:", result)
    return result;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
}


export function getDriveImageUrl(link) {
  if (!link) return "";

  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = link.match(regex);

  if (match && match[1]) {
    const fileId = match[1];
    // Try Googleusercontent direct link
    console.log(`https://lh3.googleusercontent.com/d/${fileId}=w500-h500`)
    return `https://lh3.googleusercontent.com/d/${fileId}=w500-h500`;
  }

  return link;
}


