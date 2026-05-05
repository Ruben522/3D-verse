import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js";
//import ModelsContext from "./contexts/ModelsContext.jsx";
import ModelsMeiliContext from "./contexts/ModelsMeiliContext.jsx";
import UserContext from "./contexts/UserContext.jsx";
import LikeContext from "./contexts/LikeContext.jsx";
import FavoriteContext from "./contexts/FavoriteContext.jsx";
import LanguageContext from "./contexts/LanguageContext.jsx";
import FollowContext from "./contexts/FollowContext.jsx";
import ContactContext from "./contexts/ContactContext.jsx";
import MessageContext from "./contexts/MessageContext.jsx";
import ThemeContext from "./contexts/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeContext>
				<MessageContext>
					<UserContext>
						<LanguageContext>
							<ModelsMeiliContext>
								<LikeContext>
									<FavoriteContext>
										<FollowContext>
											<ContactContext>
												<App />
											</ContactContext>
										</FollowContext>
									</FavoriteContext>
								</LikeContext>
							</ModelsMeiliContext>
						</LanguageContext>
					</UserContext>
				</MessageContext>
			</ThemeContext>
		</BrowserRouter>
	</StrictMode>
);
