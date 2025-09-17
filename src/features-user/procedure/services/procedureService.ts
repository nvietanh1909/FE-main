const BASE_URL = import.meta.env.VITE_API_URL;
import { getToken } from '@/services/AuthService.ts';

export async function fetchProcedures(token?: string) {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/procedures`, {
      headers: {
        'accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching procedures:', error);
    throw error;
  }
}

export async function fetchProcedureDetail(id: string) {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    const res = await fetch(`${BASE_URL}/procedures/${id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching procedure detail:', error);
    throw error;
  }
}