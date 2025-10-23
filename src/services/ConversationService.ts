const API_BASE_URL = "https://umentor.duckdns.org/api";

export interface Conversation {
  id: number;
  title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  content: string;
  type: 'user' | 'bot';
  created_at?: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
}

export interface UpdateConversationRequest {
  title: string;
}

class ConversationService {
  private readonly STORAGE_KEY = 'chatbot_conversations';
  private readonly MESSAGES_KEY_PREFIX = 'chatbot_messages_';

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private getStoredConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveConversations(conversations: Conversation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
  }

  private getStoredMessages(conversationId: number): Message[] {
    try {
      const stored = localStorage.getItem(`${this.MESSAGES_KEY_PREFIX}${conversationId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveMessages(conversationId: number, messages: Message[]): void {
    localStorage.setItem(`${this.MESSAGES_KEY_PREFIX}${conversationId}`, JSON.stringify(messages));
  }

  // Public method to save a conversation and its messages (called when user sends/receives messages)
  saveConversation(conversation: Conversation, messages: Message[]): void {
    const conversations = this.getStoredConversations();
    const existingIndex = conversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex >= 0) {
      conversations[existingIndex] = { ...conversation, updated_at: new Date().toISOString() };
    } else {
      conversations.unshift(conversation);
    }
    
    this.saveConversations(conversations);
    this.saveMessages(conversation.id, messages);
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/conversations`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Conversations endpoint not found, using localStorage fallback');
          return this.getStoredConversations();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🔍 getConversations raw response:', result);
      // Backend may return { success: true, data: [...] } or plain array
      const raw = result?.data ?? result;

      if (!Array.isArray(raw)) {
        // If backend returns an object with items under another key, try common variations
        const maybeList = raw?.conversations || raw?.items || [];
        if (Array.isArray(maybeList)) {
          return maybeList.map((c: any) => ({
            id: Number(c.id),
            title: c.title || c.name,
            created_at: c.created_at || c.createdAt || c.created || undefined,
            updated_at: c.updated_at || c.updatedAt || c.updated || undefined,
          }));
        }
        return [];
      }

      return raw.map((c: any) => ({
        id: Number(c.id),
        title: c.title || c.name,
        created_at: c.created_at || c.createdAt || c.created || undefined,
        updated_at: c.updated_at || c.updatedAt || c.updated || undefined,
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // If the endpoint doesn't exist, return localStorage data instead of throwing
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('Failed to fetch'))) {
        console.warn('⚠️ Conversations API not available, using localStorage fallback');
        return this.getStoredConversations();
      }
      throw error;
    }
  }

  async getConversationMessages(
    conversationId: number, 
    page: number = 1, 
    limit: number = 20
  ): Promise<MessagesResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chatbot/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Conversation messages endpoint not found');
          return { messages: [], total: 0 };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🔍 getConversationMessages raw response:', result);

      // Backend may return { success: true, data: [...] } or { messages: [...], total }
      let raw = result?.data ?? result;

      // If raw contains wrapper with messages key
      if (raw && raw.messages) {
        const msgs = raw.messages;
        const mapped: Message[] = msgs.map((msg: any) => ({
          id: Number(msg.id),
          content: msg.content ?? msg.message ?? msg.text ?? '',
          type: (msg.type === 'bot' || msg.is_bot || msg.isBot) ? 'bot' : 'user',
          created_at: msg.timestamp || msg.created_at || msg.createdAt || undefined,
        }));
        return {
          messages: mapped,
          total: typeof raw.total === 'number' ? raw.total : mapped.length,
        };
      }

      // If raw itself is an array of messages
      const msgsArray = Array.isArray(raw) ? raw : (result?.messages || []);
      const mapped: Message[] = (msgsArray as any[]).map((msg: any) => ({
        id: Number(msg.id),
        content: msg.content ?? msg.message ?? msg.text ?? '',
        type: (msg.type === 'bot' || msg.is_bot || msg.isBot) ? 'bot' : 'user',
        created_at: msg.timestamp || msg.created_at || msg.createdAt || undefined,
      }));

      return {
        messages: mapped,
        total: mapped.length,
      };
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      // If the endpoint doesn't exist, return empty messages instead of throwing
      if (error instanceof Error && error.message.includes('404')) {
        console.warn('⚠️ Conversation messages API not implemented yet');
        return { messages: [], total: 0 };
      }
      throw error;
    }
  }

  async updateConversationTitle(
    conversationId: number, 
    title: string
  ): Promise<Conversation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chatbot/conversations/${conversationId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Update conversation title endpoint not found');
          // Return a mock updated conversation
          return {
            id: conversationId,
            title: title,
            created_at: undefined,
            updated_at: new Date().toISOString(),
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🔍 updateConversationTitle raw response:', result);
      const data = result?.data ?? result;
      return {
        id: Number(data.id ?? conversationId),
        title: data.title ?? data.name ?? title,
        created_at: data.created_at ?? data.createdAt ?? undefined,
        updated_at: data.updated_at ?? data.updatedAt ?? undefined,
      };
    } catch (error) {
      console.error('Error updating conversation title:', error);
      // If the endpoint doesn't exist, still update locally
      if (error instanceof Error && error.message.includes('404')) {
        console.warn('⚠️ Update conversation title API not implemented yet');
        return {
          id: conversationId,
          title: title,
          created_at: undefined,
          updated_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async deleteConversation(conversationId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chatbot/conversations/${conversationId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Delete conversation endpoint not found, deleting from localStorage');
          this.deleteConversationFromStorage(conversationId);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If API call successful, also remove from localStorage
      this.deleteConversationFromStorage(conversationId);
      console.log('✅ Conversation deleted successfully');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // If the endpoint doesn't exist, still delete from localStorage
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('Failed to fetch'))) {
        console.warn('⚠️ Delete conversation API not available, deleting from localStorage only');
        this.deleteConversationFromStorage(conversationId);
        return;
      }
      throw error;
    }
  }

  private deleteConversationFromStorage(conversationId: number): void {
    // Remove conversation from list
    const conversations = this.getStoredConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    this.saveConversations(filtered);

    // Remove messages for this conversation
    localStorage.removeItem(`${this.MESSAGES_KEY_PREFIX}${conversationId}`);
    
    console.log(`🗑️ Conversation ${conversationId} deleted from localStorage`);
  }
}

export default new ConversationService();