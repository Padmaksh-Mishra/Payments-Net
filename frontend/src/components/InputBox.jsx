export function InputBox({label, placeholder, onChange}) {
    return <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}

// InputBox.js
// export const InputBox = ({ label, placeholder, type = "text" }) => {
//     return (
//         <div className="mb-4 w-full">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 placeholder={placeholder}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
//             />
//         </div>
//     );
// };
