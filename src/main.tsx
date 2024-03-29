import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from "./App.tsx";
import './ui/globals.css'
import AuthProvider from "@/context/AuthProvider.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<App/>
			<Toaster />
		</AuthProvider>
	</React.StrictMode>,
)
