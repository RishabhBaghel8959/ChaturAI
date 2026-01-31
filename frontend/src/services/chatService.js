// frontend/src/services/chatService.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Get authorization headers with token
 * @returns {Object} - Headers with Authorization
 */
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

/**
 * Send message to AI with optional file attachments
 * @param {string} question - User question/message
 * @param {Array} files - Array of file objects with file property
 * @returns {Promise} - AI response
 */
export const sendMessage = async (question, files = []) => {
  try {
    const formData = new FormData();
    formData.append('question', question);
    
    // Add files to form data
    files.forEach((file) => {
      if (file.file) {
        formData.append('files', file.file);
      }
    });

    const response = await fetch(`${API_BASE}/api/chat/query`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get response');
    }

    return await response.json();
  } catch (error) {
    console.error('Send message error:', error);
    throw new Error(error.message || 'Chat error');
  }
};

/**
 * Get all chat conversations for current user
 * @returns {Promise} - Array of chat objects
 */
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/chats`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat history error:', error);
    return [];
  }
};

/**
 * Get single chat by ID
 * @param {string} chatId - Chat ID
 * @returns {Promise} - Chat object with messages
 */
export const getChatById = async (chatId) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat error:', error);
    throw error;
  }
};

/**
 * Create new chat conversation
 * @param {string} title - Chat title
 * @returns {Promise} - New chat object
 */
export const createChat = async (title = 'New Chat') => {
  try {
    const response = await fetch(`${API_BASE}/api/chats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title })
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Create chat error:', error);
    throw error;
  }
};

/**
 * Update chat messages
 * @param {string} chatId - Chat ID
 * @param {Array} messages - Array of message objects
 * @returns {Promise} - Updated chat object
 */
export const saveChatHistory = async (chatId, messages) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ 
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Save chat history error:', error);
    throw error;
  }
};

/**
 * Update chat title
 * @param {string} chatId - Chat ID
 * @param {string} title - New title
 * @returns {Promise} - Updated chat object
 */
export const updateChatTitle = async (chatId, title) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}/title`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ title })
    });

    if (!response.ok) {
      throw new Error('Failed to update chat title');
    }

    return await response.json();
  } catch (error) {
    console.error('Update chat title error:', error);
    throw error;
  }
};

/**
 * Delete chat conversation
 * @param {string} chatId - Chat ID to delete
 * @returns {Promise} - Success message
 */
export const deleteChat = async (chatId) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete chat error:', error);
    throw error;
  }
};

/**
 * Delete multiple chats
 * @param {Array} chatIds - Array of chat IDs to delete
 * @returns {Promise} - Success message
 */
export const deleteMultipleChats = async (chatIds) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/batch-delete`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ chat_ids: chatIds })
    });

    if (!response.ok) {
      throw new Error('Failed to delete chats');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete multiple chats error:', error);
    throw error;
  }
};

/**
 * Export chat as JSON
 * @param {string} chatId - Chat ID to export
 * @returns {Promise} - Chat data as JSON
 */
export const exportChat = async (chatId) => {
  try {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}/export`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to export chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Export chat error:', error);
    throw error;
  }
};

/**
 * Search chats by query
 * @param {string} query - Search query
 * @returns {Promise} - Array of matching chats
 */
export const searchChats = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/chats/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to search chats');
    }

    return await response.json();
  } catch (error) {
    console.error('Search chats error:', error);
    return [];
  }
};

/**
 * Share chat (if backend supports)
 * @param {string} chatId - Chat ID to share
 * @param {Array} emails - Email addresses to share with
 * @returns {Promise} - Share confirmation
 */
export const shareChat = async (chatId, emails) => {
  try {
    const response = await fetch(`${API_BASE}/chats/${chatId}/share`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ emails })
    });

    if (!response.ok) {
      throw new Error('Failed to share chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Share chat error:', error);
    throw error;
  }
};

/**
 * Get chat statistics
 * @returns {Promise} - User's chat statistics
 */
export const getChatStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/chats/stats`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Get stats error:', error);
    return null;
  }
};

/**
 * Stream message (for real-time responses)
 * @param {string} question - User question
 * @param {Array} files - File attachments
 * @returns {Promise} - Readable stream of response
 */
export const streamMessage = async (question, files = []) => {
  try {
    const formData = new FormData();
    formData.append('question', question);
    
    files.forEach((file) => {
      if (file.file) {
        formData.append('files', file.file);
      }
    });

    const response = await fetch(`${API_BASE}/chat/query/stream`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to stream message');
    }

    return response;
  } catch (error) {
    console.error('Stream message error:', error);
    throw error;
  }
};

/**
 * Get chat settings
 * @returns {Promise} - User chat preferences
 */
export const getChatSettings = async () => {
  try {
    const response = await fetch(`${API_BASE}/chat/settings`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Get settings error:', error);
    return null;
  }
};

/**
 * Update chat settings
 * @param {Object} settings - Settings object
 * @returns {Promise} - Updated settings
 */
export const updateChatSettings = async (settings) => {
  try {
    const response = await fetch(`${API_BASE}/chat/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Update settings error:', error);
    throw error;
  }
};