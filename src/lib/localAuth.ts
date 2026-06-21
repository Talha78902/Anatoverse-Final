type Progress = { organs: string[]; systems: string[] };

export type LocalAuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  progress: Progress;
};

export type LocalActivityRecord = {
  id: string;
  type: string;
  targetId: string | null;
  targetName: string | null;
  createdAt: string;
  meta?: Record<string, unknown>;
};

type StoredAccount = {
  user: LocalAuthUser;
  password: string;
};

type StoredSession = {
  token: string;
  email: string;
  createdAt: string;
};

const ACCOUNTS_KEY = 'anatoverseLocalAccounts';
const SESSIONS_KEY = 'anatoverseLocalSessions';
const ACTIVITIES_KEY = 'anatoverseLocalActivities';

const makeId = (prefix: string) => `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readAccounts = () => readJson<StoredAccount[]>(ACCOUNTS_KEY, []);
const writeAccounts = (accounts: StoredAccount[]) => writeJson(ACCOUNTS_KEY, accounts);
const readSessions = () => readJson<StoredSession[]>(SESSIONS_KEY, []);
const writeSessions = (sessions: StoredSession[]) => writeJson(SESSIONS_KEY, sessions);
const readActivities = () => readJson<LocalActivityRecord[]>(ACTIVITIES_KEY, []);
const writeActivities = (activities: LocalActivityRecord[]) => writeJson(ACTIVITIES_KEY, activities);

const findAccountByToken = (token: string) => {
  const session = readSessions().find((item) => item.token === token);
  if (!session) return null;
  return readAccounts().find((account) => account.user.email === session.email) || null;
};

export const localAuthMe = (token: string): { user: LocalAuthUser } => {
  const account = findAccountByToken(token);
  if (!account) throw new Error('Session expired. Please login again.');
  return { user: account.user };
};

export const localRegister = (payload: { name?: string; email?: string; password?: string }): { token: string; user: LocalAuthUser } => {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');

  if (!name || !email || !password) throw new Error('Name, email, and password are required.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');

  const accounts = readAccounts();
  if (accounts.some((account) => account.user.email === email)) {
    throw new Error('An account with this email already exists. Please login.');
  }

  const user: LocalAuthUser = {
    id: makeId('local_usr'),
    name,
    email,
    createdAt: new Date().toISOString(),
    progress: { organs: [], systems: [] },
  };
  const token = makeId('local_sess');
  accounts.push({ user, password });
  writeAccounts(accounts);
  writeSessions([...readSessions(), { token, email, createdAt: new Date().toISOString() }]);
  return { token, user };
};

export const localLogin = (payload: { email?: string; password?: string }): { token: string; user: LocalAuthUser } => {
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');
  if (!email || !password) throw new Error('Email and password are required.');

  const account = readAccounts().find((item) => item.user.email === email);
  if (!account || account.password !== password) {
    throw new Error('Invalid email or password. Use Sign up first if this is a new account.');
  }

  const token = makeId('local_sess');
  writeSessions([...readSessions(), { token, email, createdAt: new Date().toISOString() }]);
  return { token, user: account.user };
};

export const localLogout = (token: string) => {
  writeSessions(readSessions().filter((session) => session.token !== token));
};

export const localGetActivities = (token: string): { activities: LocalActivityRecord[] } => {
  const account = findAccountByToken(token);
  if (!account) throw new Error('Session expired. Please login again.');
  const activities = readActivities()
    .filter((activity) => activity.meta?.userId === account.user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50);
  return { activities };
};

export const localLogActivity = (
  token: string,
  payload: { type: string; targetId?: string; targetName?: string; meta?: Record<string, unknown> }
): { activity: LocalActivityRecord; progress: Progress } => {
  const accounts = readAccounts();
  const account = findAccountByToken(token);
  if (!account) throw new Error('Session expired. Please login again.');

  const activity: LocalActivityRecord = {
    id: makeId('local_act'),
    type: payload.type,
    targetId: payload.targetId || null,
    targetName: payload.targetName || null,
    meta: { ...(payload.meta || {}), userId: account.user.id, storage: 'browser-local' },
    createdAt: new Date().toISOString(),
  };

  const progress = account.user.progress || { organs: [], systems: [] };
  if ((payload.type === 'view_organ' || payload.type === 'open_study_page' || payload.type === 'open_advanced_viewer') && payload.targetId && payload.meta?.entityType === 'organ') {
    if (!progress.organs.includes(payload.targetId)) progress.organs.push(payload.targetId);
  }
  if ((payload.type === 'view_system' || payload.type === 'open_system_study' || payload.type === 'open_advanced_viewer') && payload.targetId && payload.meta?.entityType === 'system') {
    if (!progress.systems.includes(payload.targetId)) progress.systems.push(payload.targetId);
  }

  const updatedAccounts = accounts.map((item) => (
    item.user.email === account.user.email ? { ...item, user: { ...item.user, progress } } : item
  ));
  writeAccounts(updatedAccounts);
  writeActivities([activity, ...readActivities()]);

  return { activity, progress };
};
