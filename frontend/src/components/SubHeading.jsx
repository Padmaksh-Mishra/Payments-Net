// export function SubHeading({label}) {
//     return <div className="text-slate-500 text-md pt-1 px-4 pb-4">
//       {label}
//     </div>
// }

// SubHeading.js
export const SubHeading = ({ label }) => {
    return (
        <h2 className="text-sm font-medium text-gray-600 mb-6">
            {label}
        </h2>
    );
};
