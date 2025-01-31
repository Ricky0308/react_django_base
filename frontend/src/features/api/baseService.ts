export const baseService = {
  headers: {
    'Content-Type': 'application/json',
  },
  
  handleResponse: async (response: Response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }
}; 