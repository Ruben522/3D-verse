import React from "react";
import { Outlet } from "react-router-dom";
import LikeContext from "../contexts/LikeContext";
import FavoriteContext from "../contexts/FavoriteContext";
import FollowContext from "../contexts/FollowContext";

const SocialLayout = () => {
    return (
        <LikeContext>
            <FavoriteContext>
                <FollowContext>
                    <Outlet />
                </FollowContext>
            </FavoriteContext>
        </LikeContext>
    );
};

export default SocialLayout;