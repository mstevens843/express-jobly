import React, { useState } from "react";
import SnackOrBoozeApi from "../Api";
import { useNavigate } from "react-router-dom";

function AddItemForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    recipe: "",
    serve: "",
    type: "snacks"
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await SnackOrBoozeApi.addItem(formData, formData.type);
      setIsSubmitted(true);
      // Redirect the user based on the type
      navigate(`/${formData.type}`);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (isSubmitted) {
    return <p>Item successfully added! Redirecting...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <label htmlFor="description">Description:</label>
      <input
        name="description"
        id="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <label htmlFor="recipe">Recipe:</label>
      <input
        name="recipe"
        id="recipe"
        value={formData.recipe}
        onChange={handleChange}
        required
      />

      <label htmlFor="serve">Serve:</label>
      <input
        name="serve"
        id="serve"
        value={formData.serve}
        onChange={handleChange}
        required
      />

      <label htmlFor="type">Type:</label>
      <select
        name="type"
        id="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="snacks">Snacks</option>
        <option value="drinks">Drinks</option>
      </select>

      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItemForm;
