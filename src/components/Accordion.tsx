import React, { useEffect, useState } from "react";
import { fetchCelebrities } from "../services/celebrityService";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { Celebrity } from "../types/celebrity";
import SearchBar from "./SearchBar";
import { FaEdit, FaTrashAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";
import DeleteDialog from "./Delete";
import placeholderImage from "../assets/placeholder2.jpg";
import { useCelebrityContext } from "../context/CelebrityContext";

const Accordion: React.FC = () => {
  // const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState<Celebrity[]>(
    []
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentData, setCurrentData] = useState<Celebrity | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { celebrities, setCelebrities, updateCelebrity, deleteCelebrity } =
    useCelebrityContext();
  useEffect(() => {
    const getCelebrities = async () => {
      try {
        const data = await fetchCelebrities();
        setCelebrities(data); // Set data in the global context
        setFilteredCelebrities(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    };
    getCelebrities();
  }, [setCelebrities]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const filteredList = celebrities.filter(
      (celebrity) =>
        `${celebrity.first.toLowerCase()} ${celebrity.last.toLowerCase()}`.includes(
          value.toLowerCase()
        ) ||
        celebrity.first.toLowerCase().includes(value.toLowerCase()) ||
        celebrity.last.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCelebrities(filteredList);
    setActiveIndex(null);
  };

  const toggleAccordion = (index: number) => {
    if (editIndex !== null) return; // Prevent toggling if in edit mode
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleEditClick = (index: number) => {
    const selectedCelebrity = filteredCelebrities[index];
    if (calculateAge(selectedCelebrity.dob) >= 18) {
      setEditIndex(index);
      setCurrentData(selectedCelebrity);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteCelebrity(deleteId);

      setFilteredCelebrities((prev) =>
        prev.filter((celebrity) => celebrity.id !== deleteId)
      );

      // Reset the deletion state
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };
  const cancelDelete = () => {
    setDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentData((prevData) => ({ ...prevData!, [name]: value }));

    if (currentData![name as keyof Celebrity] !== value) {
      setIsFormChanged(true);
    } else {
      setIsFormChanged(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentData?.country || /\d/.test(currentData.country)) {
      newErrors.country = "Country cannot contain numbers and cannot be empty.";
    }
    if (!currentData?.gender) {
      newErrors.gender = "Gender cannot be empty.";
    }
    if (!currentData?.description) {
      newErrors.description = "Description cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Update in the context (global state)
      updateCelebrity(currentData!);

      // Update the local filtered celebrities state so UI reflects the change
      setFilteredCelebrities((prev) =>
        prev.map((celebrity) =>
          celebrity.id === currentData?.id ? { ...currentData } : celebrity
        )
      );

      // Reset edit mode
      setEditIndex(null);
      setIsFormChanged(false);
    }
  };
  const handleCancelEdit = () => {
    setEditIndex(null);
    setIsFormChanged(false);
    setCurrentData(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} onSearch={handleSearchChange} />

      {/* Display Accordion Items */}
      {filteredCelebrities.length > 0 ? (
        filteredCelebrities.map((celebrity, index) => (
          <div
            key={celebrity.id}
            className="border mb-2 rounded-lg border-gray-500"
          >
            {/* Accordion Header */}
            <div
              className="flex justify-between p-4 cursor-pointer rounded-lg hover:bg-gray-200"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={placeholderImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <h2 className="text-lg font-semibold">
                  {celebrity.first} {celebrity.last}
                </h2>
              </div>
              <span className="mt-3">
                {activeIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </span>
            </div>

            {/* Accordion Content */}
            {activeIndex === index && (
              <div className="p-4 bg-white ">
                {editIndex === index ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="bg-white">
                        <label className="text-gray-400">Age</label>
                        {/* <p className="sm:w-[150px] border p-2 rounded-xl mx-1 m-2 sm:m-1 border-gray-400"> */}
                        <input
                          name="age"
                          value={calculateAge(celebrity.dob)}
                          disabled
                          className="sm:w-[150px] max-w-full border p-2 mx-1 m-2 sm:m-1  rounded-xl border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400">Gender</label>
                        <select
                          name="gender"
                          value={currentData?.gender || ""}
                          onChange={handleInputChange}
                          className="sm:w-[150px] w-full border p-2 mx-1 m-2 sm:m-1 rounded-xl border-gray-400"
                        >
                          <option value="Male">male</option>
                          <option value="Female">female</option>
                          <option value="Rather Not To Say">
                            rather not to say
                          </option>
                        </select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-400">Country</label>
                        <input
                          name="country"
                          value={currentData?.country || ""}
                          onChange={handleInputChange}
                          className="sm:w-[150px] w-full border p-2 mx-1 m-2 sm:m-1 rounded-xl border-gray-400"
                        />
                        {errors.country && (
                          <p className="text-red-500 text-sm">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className=" ">
                      <label className="text-gray-400 sm:mt-1 ">
                        Description
                      </label>
                      <textarea
                        // type="text"
                        name="description"
                        value={currentData?.description || ""}
                        onChange={handleInputChange}
                        className="w-full border mx-1 p-2 rounded-xl  border-gray-400 min-h-[100px] overflow-y-auto resize-y"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <CrossIcon
                        onClick={handleCancelEdit}
                        className="w-6 h-6 text-red-500 cursor-pointer"
                      />
                      <CheckIcon
                        className={`w-6 h-6 text-green-600 ${
                          isFormChanged
                            ? "cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={isFormChanged ? handleSave : undefined}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label className="text-gray-400 ">Age</label>
                        <p className="sm:w-[150px] border p-2 rounded-xl mx-1 m-2 sm:m-1 border-gray-400">
                          {calculateAge(celebrity.dob)}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-400">Gender</label>
                        <p className="sm:w-[150px] border p-2 rounded-xl mx-1 m-2 sm:m-1 border-gray-400">
                          {celebrity.gender}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400">Country</label>
                        <p className="sm:w-[150px] border p-2 rounded-xl mx-1 m-2 sm:m-1 border-gray-400">
                          {celebrity.country}
                        </p>
                      </div>
                    </div>
                    {/* <div className="flex flex-col space-y-1">
                        <label className="text-gray-400">Description</label>
                        <p className="w-[150px] border p-2 rounded-xl mx-1 border-gray-400">
                        {celebrity.description}
                        </p>
                      </div> */}
                    <div className="-mt-5 ">
                      <label className="text-gray-400">Description</label>{" "}
                      <p className=" border p-2 rounded-xl  mx-1 border-gray-400">
                        {celebrity.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                      <FaEdit
                        onClick={() => handleEditClick(index)}
                        className="text-blue-500 cursor-pointer"
                      />
                      <FaTrashAlt
                        onClick={() => handleDeleteClick(celebrity.id)}
                        className="text-red-500 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <DeleteDialog
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="Are you sure?"
        />
      )}
    </div>
  );
};

export default Accordion;
