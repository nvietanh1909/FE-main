import React from "react";

const Skeleton = ({style = {}, lines = 3}) => {
    return (
        <div>
        {Array.from({length: lines}).map((_, index) => (
            <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
    )
}

export default Skeleton;