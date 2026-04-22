import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js";
import ModelsContext from "./contexts/ModelsContext.jsx";
import UserContext from "./contexts/UserContext.jsx";
import LikeContext from "./contexts/LikeContext.jsx";
import FavoriteContext from "./contexts/FavoriteContext.jsx";
import LanguageContext from "./contexts/LanguageContext.jsx";
import FollowContext from "./contexts/FollowContext.jsx";
import ContactContext from "./contexts/ContactContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<UserContext>
				<LanguageContext>
					<ModelsContext>
						<LikeContext>
							<FavoriteContext>
								<FollowContext>
									<ContactContext>
										<App />
									</ContactContext>
								</FollowContext>
							</FavoriteContext>
						</LikeContext>
					</ModelsContext>
				</LanguageContext>
			</UserContext>
		</BrowserRouter>
	</StrictMode>
);
