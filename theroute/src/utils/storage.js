export const getAccessTokenFromStorage = () => {
    const token = localStorage.getItem('accessToken'); // Replace with your key
    try {
      return JSON.parse(token);
    } catch (error) {
      console.error('Failed to parse access token from storage:', error);
      return null; // or an appropriate fallback value
    }
  };
  
  export const setAccessTokenInStorage = (token) => {
    localStorage.setItem('accessToken', JSON.stringify(token)); // Store token as string
  };
  