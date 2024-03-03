import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {supabase} from "@/utils/supabase.ts";
import {AuthError, AuthTokenResponsePassword, User} from "@supabase/supabase-js";

const AuthContext = createContext<{
	user: User | null;
	auth: boolean;
	login: ({email, password}: { email: string, password: string }) => Promise<AuthTokenResponsePassword>;
	logout: () => Promise<{error: AuthError | null}>;
} | null>(null)

export const useAuth = () => useContext(AuthContext)

const login = async ({email, password}: { email: string, password: string }) => {
	return supabase.auth.signInWithPassword({email, password});
}

const logout = async () => {
	console.log('logging out')
	return supabase.auth.signOut();
}

const AuthProvider = ({children}: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [auth, setAuth] = useState(false)

	useEffect(() => {
		const {data} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				if (session) {
					setUser(session.user);
				}
				setAuth(true);
			} else if (event === "SIGNED_OUT") {
				setAuth(false);
				setUser(null);
			}
		});
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{user, auth, login, logout}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider;