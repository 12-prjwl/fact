// // src/services/celebrityService.ts
// import axios from "axios";
// import { Celebrity } from "../types/celebrity.ts";

// const fetchCelebrities = async (): Promise<Celebrity[]> => {
//   try {
//     const response = await axios.get("path/to/celebrities.json");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching celebrities:", error);
//     throw error;
//   }
// };

// export { fetchCelebrities };
// src/services/celebrityService.ts

//-=------------------
// import axios from "axios";
// import { Celebrity } from "../types/celebrity";

// interface SearchResults {
//   celebrities: Celebrity[];
//   total: number;
// }

// const fetchCelebrities = async (): Promise<Celebrity[]> => {
//   try {
//     const response = await axios.get<SearchResults>(
//       "D:/Placement/Tasks/Fact-Wise/fact-wise/public/celebrities.json"
//     );
//     return response.data.celebrities;
//   } catch (error) {
//     console.error("Error fetching celebrities:", error);
//     throw error;
//   }
// };

// export { fetchCelebrities };
// src/services/celebrityService.ts
import axios from "axios";
import { Celebrity } from "../types/celebrity";

// Function to fetch the celebrities data from the JSON file
const fetchCelebrities = async (): Promise<Celebrity[]> => {
  try {
    // Access the JSON file using a relative path
    const response = await axios.get<Celebrity[]>("/celebrities.json");
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    throw error;
  }
};

export { fetchCelebrities };
