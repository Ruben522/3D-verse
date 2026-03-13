import React from "react";

const Error = (error) => {
	return <div className="text-red-500">Error: {error.message}</div>;
};

export default Error;
