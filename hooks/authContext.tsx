"use client";

import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { redirect } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => void;
  revalidateSession: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: () => {},
  revalidateSession: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  // const router = useRouter();

  // const { setUser: setZUser, setChartProfiles, reset } = useUserProfileStore();

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) throw error;
      setSession(session);
      setUser(session?.user ?? null);

      // if (session?.user) {
      //   await loadUserProfile(session.user.id);
      // }

      setLoading(false);
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // if (session?.user && event === "SIGNED_IN") {
        //   await loadUserProfile(session.user.id);
        // }
        //
        // if (event === "SIGNED_OUT") {
        //   reset();
        //   redirect("/");
        // }

        setLoading(false);
      },
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Load profile + chart data
  // const loadUserProfile = async (userId: string) => {
  //   try {
  //     const { data: profile, error: pErr } = await supabaseClient
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();
  //
  //     if (pErr) throw pErr;
  //
  //     const { data: charts, error: cErr } = await supabaseClient
  //       .from("chart_profiles")
  //       .select("*")
  //       .eq("user_id", userId);
  //
  //     if (cErr) throw cErr;
  //
  //     setZUser({
  //       id: profile.id,
  //       email: profile.email,
  //       full_name: profile.full_name,
  //       settings: profile.settings,
  //     });
  //
  //     if (charts && charts.length > 0) {
  //       setChartProfiles(charts);
  //     } else {
  //       // 👇 redirect to profile creation if no chart data
  //       redirect("/profile/setup");
  //     }
  //   } catch (err) {
  //     console.error("Profile load error:", err);
  //     redirect("/profile/setup");
  //   }
  // };

  const revalidateSession = async () => {
    console.log("Revalidating session...");
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Error revalidating session:", error);
      setLoading(false);

      return;
    }
    console.log("Revalidated session:", session);
    setSession(session);
    setUser(session?.user ?? null);

    // if (session?.user) {
    //   await loadUserProfile(session.user.id);
    // }

    setLoading(false);
  };

  const value: AuthContextType = {
    session,
    user,
    // role,
    signOut: async () => {
      await supabaseClient.auth.signOut();
      setSession(null);
      setUser(null);
      // reset();
      redirect("/");
    },
    revalidateSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
