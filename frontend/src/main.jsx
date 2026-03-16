import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ModelsContext from "./contexts/ModelsContext.jsx";
import UserContext from "./contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<UserContext>
				<ModelsContext>
					<App />
				</ModelsContext>
			</UserContext>
		</BrowserRouter>
	</StrictMode>
);
