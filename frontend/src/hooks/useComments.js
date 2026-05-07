import { useContext } from "react";
import { commentsContext } from "../contexts/CommentsContext";

const useComments = () => {
    const context = useContext(commentsContext);
    if (context === undefined) {
        throw new Error("useComments debe usarse dentro de un CommentsContext");
    }
    return context;
};

export default useComments;