// import { Link } from "react-router-dom"

// export function BottomWarning({label, buttonText, to}) {
//     return <div className="py-2 text-sm flex justify-center">
//       <div>
//         {label}
//       </div>
//       <Link className="pointer underline pl-1 cursor-pointer" to={to}>
//         {buttonText}
//       </Link>
//     </div>
// }
  
// BottomWarning.js
import { Link } from "react-router-dom";

export const BottomWarning = ({ label, buttonText, to }) => {
    return (
        <div className="text-sm text-gray-600 mt-4">
            {label}{" "}
            <Link to={to} className="text-blue-500 hover:underline">
                {buttonText}
            </Link>
        </div>
    );
};
