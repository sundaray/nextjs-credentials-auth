import { useEffect, useState } from "react";

interface User {
  userId: string;
  name: string;
  email: string;
  picture: string;
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const { user } = await response.json();
        setUser(user);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Failed to fetch session: ", error.message);
          setError(error);
        } else {
          console.log("Unknown error type occurred:", error);
          setError(Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { user, loading, error };
}
