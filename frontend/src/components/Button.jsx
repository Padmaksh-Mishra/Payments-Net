// export function Button({label, onClick}) {
//     return <button onClick={onClick} type="button" class="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{label}</button>
// }
  
// Button.js
export const Button = ({ label, onClick }) => {
    return (
        <button 
            className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            onClick={onClick}
        >
            {label}
        </button>
    );
};
