export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

type StoredUser = RegisterPayload;

interface SessionData {
  user: {
    fullName: string;
    email: string;
  };
  token: string;
}

const USERS_KEY = 'sja_auth_users';
const SESSION_KEY = 'sja_auth_session';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const persistSession = (session: SessionData) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const loadSession = (): SessionData | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
};

const generateToken = () => {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `token_${randomPart}`;
};

export const authService = {
  async register(payload: RegisterPayload) {
    await wait(400);
    const users = getUsers();
    const duplicated = users.some((user) => user.email === payload.email);
    if (duplicated) {
      throw new Error('This email is already registered. Please log in instead.');
    }
    users.push(payload);
    saveUsers(users);

    const session = {
      user: { fullName: payload.fullName, email: payload.email },
      token: generateToken(),
    };
    persistSession(session);
    return session;
  },

  async login(payload: LoginPayload) {
    await wait(400);
    const users = getUsers();
    const matched = users.find(
      (user) => user.email === payload.email && user.password === payload.password,
    );
    if (!matched) {
      throw new Error('Incorrect email or password.');
    }
    const session = {
      user: { fullName: matched.fullName, email: matched.email },
      token: generateToken(),
    };
    persistSession(session);
    return session;
  },

  logout() {
    clearSession();
  },

  loadSession() {
    return loadSession();
  },
};
