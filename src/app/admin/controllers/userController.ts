import { User, UserFilter } from "../models/types";

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      console.warn("API endpoint not available, falling back to mock data");
      return getMockUsers();
    }
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    console.warn("API error, falling back to mock data");
    return getMockUsers();
  }
};

// Fetch a single user by ID
export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      console.warn(`API endpoint not available for user ${id}, falling back to mock data`);
      const mockUser = getMockUsers().find(user => user.id === id);
      if (!mockUser) throw new Error("User not found");
      return mockUser;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Filter users based on criteria
export const filterUsers = async (filters: UserFilter): Promise<User[]> => {
  try {
    // Build query params
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    
    if (filters.role) {
      params.append('role', filters.role);
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    
    if (filters.ragSystemType) {
      params.append('ragType', filters.ragSystemType);
    }
    
    if (filters.ragSystemStatus) {
      params.append('ragStatus', filters.ragSystemStatus);
    }
    
    const response = await fetch(`/api/users/filter?${params.toString()}`);
    if (!response.ok) {
      console.warn("API filter endpoint not available, filtering mock data locally");
      return filterMockUsers(filters);
    }
    
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error filtering users:", error);
    console.warn("API filter error, filtering mock data locally");
    return filterMockUsers(filters);
  }
};

// Update user status
export const updateUserStatus = async (id: string, status: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      console.warn(`API status update endpoint not available for user ${id}, updating mock data locally`);
      const mockUsers = getMockUsers();
      const userIndex = mockUsers.findIndex(user => user.id === id);
      
      if (userIndex === -1) throw new Error("User not found");
      
      const updatedUser = {
        ...mockUsers[userIndex],
        status: status as 'active' | 'inactive' | 'suspended'
      };
      
      return updatedUser;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating user ${id} status:`, error);
    throw error;
  }
};

// Filter mock users locally
const filterMockUsers = (filters: UserFilter): User[] => {
  const mockUsers = getMockUsers();
  let filteredUsers = [...mockUsers];
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }
  
  if (filters.role) {
    filteredUsers = filteredUsers.filter(user => user.role === filters.role);
  }
  
  if (filters.status) {
    filteredUsers = filteredUsers.filter(user => user.status === filters.status);
  }
  
  if (filters.ragSystemType) {
    filteredUsers = filteredUsers.filter(user => 
      user.ragSystems.some(rag => rag.type === filters.ragSystemType)
    );
  }
  
  if (filters.ragSystemStatus) {
    filteredUsers = filteredUsers.filter(user => 
      user.ragSystems.some(rag => rag.status === filters.ragSystemStatus)
    );
  }
  
  return filteredUsers;
};

// Get mock user data for testing
export const getMockUsers = (): User[] => {
  return [
    {
      id: "1",
      name: "محمد احمدی",
      email: "mohammad@example.com",
      apiKey: "sk_live_51KmZ93Edfgdh32dfdgKhdf842DfgTyjfgTqW",
      phone: "09121234567",
      role: "admin",
      status: "active",
      createdAt: "2023-01-15T08:30:00Z",
      updatedAt: "2023-06-12T14:45:00Z",
      lastLogin: "2023-06-30T09:15:30Z",
      ragSystems: [
        {
          id: "rag1",
          name: "سیستم دانش فنی",
          type: "technical",
          status: "active",
          createdAt: "2023-02-10T10:00:00Z",
          updatedAt: "2023-05-15T16:30:00Z",
          modelType: "GPT-4",
          embeddingModel: "text-embedding-ada-002",
          storageSize: 512,
          documentCount: 250
        }
      ]
    },
    {
      id: "2",
      name: "سارا محمدی",
      email: "sara@example.com",
      apiKey: "sk_live_51JnZ71Hgfdh39uyYdfgPqfdgfdgfdsfWoJfgQoVZ1",
      phone: "09351234567",
      role: "manager",
      status: "active",
      createdAt: "2023-02-20T11:20:00Z",
      updatedAt: "2023-06-15T13:10:00Z",
      lastLogin: "2023-06-29T14:25:10Z",
      ragSystems: [
        {
          id: "rag2",
          name: "سیستم مدیریت دانش",
          type: "management",
          status: "active",
          createdAt: "2023-03-05T09:30:00Z",
          updatedAt: "2023-06-10T11:45:00Z",
          modelType: "GPT-3.5",
          embeddingModel: "text-embedding-ada-002",
          storageSize: 256,
          documentCount: 120
        },
        {
          id: "rag3",
          name: "سیستم پاسخگویی مشتری",
          type: "customer-service",
          status: "pending",
          createdAt: "2023-05-18T15:40:00Z",
          updatedAt: "2023-06-20T10:15:00Z",
          modelType: "Claude",
          embeddingModel: "text-embedding-ada-002",
          storageSize: 128,
          documentCount: 75
        }
      ]
    },
    {
      id: "3",
      name: "علی رضایی",
      email: "ali@example.com",
      apiKey: "sk_live_51HzX46Ffgfg42KfdgfdgdHkJjdgfdh94RfdgF4Ydfg",
      phone: "09331234567",
      role: "user",
      status: "inactive",
      createdAt: "2023-03-10T13:45:00Z",
      updatedAt: "2023-05-28T09:20:00Z",
      lastLogin: "2023-05-28T09:10:25Z",
      ragSystems: []
    },
    {
      id: "4",
      name: "مریم حسینی",
      email: "maryam@example.com",
      apiKey: "sk_live_51NkZ36Gfdgfd35dHfdgfdgXfgdfrHjfdgfdgg3VRdfg",
      phone: "09361234567",
      role: "user",
      status: "suspended",
      createdAt: "2023-04-05T10:15:00Z",
      updatedAt: "2023-06-22T16:30:00Z",
      lastLogin: "2023-06-21T11:45:50Z",
      ragSystems: [
        {
          id: "rag4",
          name: "سیستم آموزشی",
          type: "educational",
          status: "inactive",
          createdAt: "2023-04-12T14:20:00Z",
          updatedAt: "2023-06-18T13:10:00Z",
          modelType: "Llama-2",
          embeddingModel: "text-embedding-ada-002",
          storageSize: 384,
          documentCount: 180
        }
      ]
    },
    {
      id: "5",
      name: "حسین کریمی",
      email: "hossein@example.com",
      apiKey: "sk_live_51LzX64Jfgfdg61Kdfdgfdg94JfdgdfhgKLfdgdfgGj10",
      phone: "09381234567",
      role: "manager",
      status: "active",
      createdAt: "2023-05-15T09:00:00Z",
      updatedAt: "2023-06-25T11:30:00Z",
      lastLogin: "2023-06-28T10:05:15Z",
      ragSystems: [
        {
          id: "rag5",
          name: "سیستم تحلیل داده",
          type: "data-analysis",
          status: "active",
          createdAt: "2023-05-20T13:15:00Z",
          updatedAt: "2023-06-24T15:40:00Z",
          modelType: "GPT-4",
          embeddingModel: "text-embedding-ada-002",
          storageSize: 768,
          documentCount: 350
        }
      ]
    }
  ];
}; 