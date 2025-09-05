// Auth removed. Minimal no-op store to keep imports from breaking.
export function useAuthStore() {
  return {
    token: "",
    get isAuthed() {
      return false;
    },
    setToken() {},
    authHeaders() {
      return {};
    },
  };
}
