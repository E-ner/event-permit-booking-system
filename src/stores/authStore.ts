import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
  id: string;
  username: string;
  role: 'ORGANIZER' | 'AUTHORITY' | 'VENUE_MANAGER';
}

class AuthStore {
  private token: string | null = null;

  /* ---------- Token Helpers ---------- */
  private isExpired(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  /* ---------- Set Token ---------- */
  setToken(token: string) {
    if (this.isExpired(token)) {
      this.clear();
      return;
    }

    this.token = token;
    sessionStorage.setItem('token', token);
  }

  /* ---------- Get Token ---------- */
  getToken(): string | null {
    if (!this.token) {
      const stored = sessionStorage.getItem('token');
      if (!stored || this.isExpired(stored)) {
        this.clear();
        return null;
      }
      this.token = stored;
    }
    return this.token;
  }

  /* ---------- Decode Token ---------- */
  getUser() {
    const token = this.getToken();
    if (!token) return null;

    const decoded: DecodedToken = jwtDecode(token);
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
  }

  /* ---------- Logout ---------- */
  logout() {
    this.clear();
    window.location.href = '/login';
  }

  /* ---------- Clear ---------- */
  clear() {
    this.token = null;
    sessionStorage.removeItem('token');
  }
}

export const authStore = new AuthStore();
