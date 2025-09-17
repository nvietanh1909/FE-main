// Service fetch procedures for sidebar
export async function fetchProcedures(token?: string) {
  const res = await fetch('https://umentor.duckdns.org/api/dashboard/procedures', {
    headers: {
      'accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  const data = await res.json();
  return data;
}