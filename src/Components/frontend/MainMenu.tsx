import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/MainMenu.css';
import RecipeBox from './RecipeBox';
import { generateRecipePrompt } from "../backend/api/generateRecipe";

export default function MainMenu() {
    const [ingredients, setIngredients] = useState<{ name: string; amount: string }[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [mealType, setMealType] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [complexity, setComplexity] = useState('');
    const [recipeList, setRecipeList] = useState<any[]>([]);
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
    const [showRecipeBox, setShowRecipeBox] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddIngredient = () => {
        if (newName.trim() && newAmount.trim()) {
            setIngredients([...ingredients, { name: newName.trim(), amount: newAmount.trim() }]);
            setNewName('');
            setNewAmount('');
            setShowModal(false);
        }
    };

    const handleDeleteIngredient = (index: number) => {
        const updated = [...ingredients];
        updated.splice(index, 1);
        setIngredients(updated);
    };

    const handleCreateRecipe = async () => {
        if (!cuisine || !mealType || !cookingTime || !complexity || ingredients.length === 0) {
            alert('Please fill in all fields and add at least one ingredient.');
            return;
        }

        setShowRecipeBox(true);
        setLoading(true);

        try {
            const ingredientList = ingredients.map(i => `${i.name} (${i.amount})`).join(', ');

            const prompt = `
        From the following list of available ingredients: ${ingredientList}, 
        create a single recipe suggestion (you may use only a subset of ingredients as appropriate). 
        Style: ${cuisine}, Meal Type: ${mealType}, Estimated Time: ${cookingTime}, Difficulty: ${complexity}.

        Return the response strictly in the following JSON format only:
        {
          "name": "...",
          "ingredients": ["...", "..."],
          "method": "...",
          "style": "...",
          "calories": 123
        }

        DO NOT include extra commentary. Do not explain. Just return valid JSON only.
      `;

            const aiText = await generateRecipePrompt(prompt);
            const match = aiText.match(/\{[\s\S]*\}/);
            const result = match ? JSON.parse(match[0]) : null;

            if (result) {
                setRecipeList(prev => [...prev, result]);
                setCurrentRecipeIndex(recipeList.length);
            }
        } catch (error) {
            console.error("Gemini error:", error);
            alert("Failed to generate recipe from AI.");
        }

        setLoading(false);
    };

    const regenerateRecipe = async () => {
        setLoading(true);
        try {
            const ingredientList = ingredients.map(i => `${i.name} (${i.amount})`).join(', ');
            const prompt = `
        From the following ingredients: ${ingredientList}, generate a completely new recipe suggestion. 
        Do not reuse the exact same structure or ingredient combination. 
        Style: ${cuisine}, Meal Type: ${mealType}, Time: ${cookingTime}, Difficulty: ${complexity}.
        Use a different subset of ingredients than previous.
        Return JSON:
        {
          "name": "...",
          "ingredients": ["..."],
          "method": "...",
          "style": "...",
          "calories": 123
        }`;

            const aiText = await generateRecipePrompt(prompt);
            const match = aiText.match(/\{[\s\S]*\}/);
            const result = match ? JSON.parse(match[0]) : null;

            if (result) {
                setRecipeList(prev => [...prev, result]);
                setCurrentRecipeIndex(recipeList.length);
            }
        } catch (err) {
            console.error("Gemini error:", err);
            alert("Failed to generate new recipe.");
        }
        setLoading(false);
    };

    return (
        <div className="mainmenu-layout d-flex">
            <div className={`mainmenu-box transition ${showRecipeBox ? 'shift-left' : ''}`}>
                <h1 className="h5 fw-bold mb-4">What's in your fridge?</h1>

                {ingredients.length > 0 && (
                    <div className="mb-3">
                        <div className="border rounded small-ingredients-box p-2">
                            {ingredients.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                                    <div>
                                        <span>{item.name}</span> &nbsp; <span className="text-muted">{item.amount}</span>
                                    </div>
                                    <span className="delete-x text-muted" onClick={() => handleDeleteIngredient(index)} role="button">
                    &times;
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="d-grid mb-4">
                    <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                        + Add Ingredient
                    </button>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-6">
                        <label className="form-label">Cuisine Preference</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Vietnamese"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Meal Type</label>
                        <select className="form-select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                            <option value="">Select...</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                    </div>
                    <div className="col-6">
                        <label className="form-label">Cooking Time</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., 30 mins"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Complexity</label>
                        <select className="form-select" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                            <option value="">Select...</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div className="d-grid">
                    <button className="btn btn-dark" onClick={handleCreateRecipe}>
                        Create Recipe
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Ingredient</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label d-flex justify-content-between">
                                        <span>Name</span>
                                        <span className="text-muted small">e.g. Carrots</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label d-flex justify-content-between">
                                        <span>Amount</span>
                                        <span className="text-muted small">e.g. 500 g</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleAddIngredient}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRecipeBox && (
                <RecipeBox
                    recipe={recipeList[currentRecipeIndex]}
                    loading={loading}
                    onRegenerate={regenerateRecipe}
                    onPrev={() => setCurrentRecipeIndex(prev => Math.max(prev - 1, 0))}
                    onNext={() => setCurrentRecipeIndex(prev => Math.min(prev + 1, recipeList.length - 1))}
                    index={currentRecipeIndex + 1}
                    total={recipeList.length}
                />
            )}
        </div>
    );
}
