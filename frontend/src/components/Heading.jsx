// export function Heading({label}) {
//     return <div className="font-bold text-4xl pt-6">
//       {label}
//     </div>
// }

export const Heading = ({ label }) => {
    return (
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {label}
        </h1>
    );
};

