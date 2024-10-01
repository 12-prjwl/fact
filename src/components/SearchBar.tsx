// import React from "react";
// import { FaSearch } from "react-icons/fa";

// interface SearchBarProps {
//   searchTerm: string;
//   handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   searchTerm,
//   handleSearchChange,
// }) => {
//   return (
//     <div className="mb-4 relative">
//       <input
//         type="text"
//         placeholder="Search User"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         className="w-full p-2 pl-12 px-4 border border-gray-800 rounded-xl  focus:outline-none focus:border-black"
//       />
//       <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//         <FaSearch className="text-gray-400 hover:text-gray-700" size={15} />
//       </span>
//     </div>
//   );
// };

// export default SearchBar;
import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-4 relative">
      <input
        type="text"
        placeholder="Search User"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-2 pl-12 px-4 border border-gray-800 rounded-xl focus:outline-none focus:border-black"
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <FaSearch className="text-gray-400 hover:text-gray-700" size={15} />
      </span>
    </div>
  );
};

export default SearchBar;
