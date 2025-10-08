const BASE_URL = import.meta.env.VITE_API_URL;
import { getToken } from '@/services/AuthService.ts';

export async function fetchProcedures(token?: string) {
  try {
    const authToken = token || getToken();
    const res = await fetch(`${BASE_URL}/dashboard/procedures`, {
      headers: {
        accept: 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : ''
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}

/**
 * fetchProcedureDetail:
 * - Tìm procedure theo id (nếu id truyền là loại 'trong-nuoc'/'nuoc-ngoai' sẽ fallback)
 * - Lấy các node con trong subItems có label 'code' (thường là a và b)
 * - Từ children của a/b: tách ra budgets (giữ group nếu có children) và docs
 * - Trả về format ProcedureData mà ProcedurePage dùng.
 */
export async function fetchProcedureDetail(id: string) {
  try {
    const token = getToken();
    if (!token) {
      console.error('🔒 fetchProcedureDetail: No token found');
      throw new Error('Unauthorized: User is not authenticated');
    }

    console.log('🔍 fetchProcedureDetail: Starting with ID:', id);

    const all = await fetchProcedures(token);
    if (!all?.success || !Array.isArray(all.data)) throw new Error('Invalid API response structure');

    // Tìm procedure theo id (nếu id là query type như 'trong-nuoc' thì tìm first match)
    let proc = all.data.find((p: any) => p.id === id);
    if (!proc) {
      // hỗ trợ id dạng 'trong-nuoc' | 'nuoc-ngoai' hoặc numeric '1'/'2'
      if (id.includes('trong-nuoc') || id === '1') {
        proc = all.data.find((p: any) => (p.parent || '').toLowerCase().includes('công tác phí trong nước'));
      } else if (id.includes('nuoc-ngoai') || id === '2') {
        proc = all.data.find((p: any) => (p.parent || '').toLowerCase().includes('công tác phí nước ngoài'));
      }
    }

    if (!proc) throw new Error(`No procedure found for id: ${id}`);

    // Lấy tất cả node 'code' (thường a, b)
    const codeNodes = (proc.subItems || []).filter((s: any) => s.label === 'code' && Array.isArray(s.children));

    // helpers
    const makeBudgetItem = (item: any) => ({
      id: item.id || `budget-${Date.now()}`,
      name: item.title || '',
      description: item.title || '',
      type: 'budget'
    });

    const makeDocItem = (item: any) => ({
      id: item.id || `doc-${Date.now()}`,
      title: item.title || '',
      path: null,
      name: item.title || '',
      type: 'document'
    });

    const budgets: any[] = [];
    const docs: any[] = [];

    // Duyệt qua các codeNodes, lấy children
    for (const codeNode of codeNodes) {
      for (const child of codeNode.children || []) {
        if (child.label === 'budgets') {
          // Nếu child có nested children => giữ như group
          if (child.children && child.children.length > 0) {
            budgets.push({
              id: child.id || `group-${Date.now()}`,
              name: child.title,
              isGroup: true,
              children: child.children.map((c: any) => makeBudgetItem(c))
            });
          } else {
            budgets.push(makeBudgetItem(child));
          }
        } else if (child.label === 'docs') {
          docs.push(makeDocItem(child));
        } else if (child.label === 'note') {
          // notes sẽ được tách sau nếu cần
        } else {
          // fallback: nếu không có label, phân thủ công theo title ngắn/dài
          // treat as doc by default
          docs.push(makeDocItem(child));
        }
      }
    }

    // Loại bỏ duplicate theo title (trường hợp a và b trùng)
    const uniqueByName = (arr: any[]) => {
      const seen = new Set();
      return arr.filter((it: any) => {
        const key = (it.name || it.title || '').toString().trim().toLowerCase();
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    const uniqueBudgets = uniqueByName(budgets.map((b: any) => {
      // group giữ nguyên
      if (b.isGroup) return b;
      return b;
    }));

    const uniqueDocs = uniqueByName(docs);

    // Build ProcedureData (ProcedurePage mong đợi)
    const procedureData = {
      id: proc.id || `generated-${Date.now()}`,
      title: proc.title || 'Quy trình',
      description: proc.description || `Quy trình ${proc.title || ''}`,
      type: (proc.parent || '').toLowerCase().includes('nước ngoài') ? 'international' : 'domestic',
      // thanhphandutoans có thể chứa items hoặc group { isGroup: true, children: [...] }
      thanhphandutoans: uniqueBudgets,
      hosochungtus: uniqueDocs,
      ghichus: ((proc.subItems || [])
        .flatMap((s: any) => (s.children || []))
        .filter((c: any) => c.label === 'note')
        .map((n: any, idx: number) => ({ id: n.id || `note-${idx}`, text: n.title, type: 'info' }))
      )
    };

    return { success: true, data: procedureData };
  } catch (error) {
    console.error('❌ fetchProcedureDetail error:', error);
    // Đảm bảo return structure nhất quán
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}