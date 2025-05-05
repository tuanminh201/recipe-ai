import React from 'react';
import './css/RecipeBox.css';

interface Recipe {
    name: string;
    ingredients: string[];
    method: string;
    style: string;
    calories: number;
}

interface Props {
    recipe: Recipe | null;
    loading: boolean;
    onRegenerate: () => void;
    onPrev: () => void;
    onNext: () => void;
    index: number;
    total: number;
}

export default function RecipeBox({
                                      recipe,
                                      loading,
                                      onRegenerate,
                                      onPrev,
                                      onNext,
                                      index,
                                      total,
                                  }: Props) {
    const methodSteps = recipe?.method
        ? recipe.method.split(/\d+\.\s|(?<=\.)\s+/).filter((step) => step.trim() !== '')
        : [];

    return (
        <div className="recipe-box">
            {loading && <p className="text-black">Generating recipe with AI...</p>}

            {!loading && recipe && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="fw-bold text-black mb-0">{recipe.name}</h4>
                        <span className="text-muted small">Recipe {index} of {total}</span>
                    </div>

                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>

                    <p className="mt-3"><strong>Method:</strong></p>
                    <ol>
                        {methodSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    <p className="mt-3"><strong>Calories:</strong> {recipe.calories} kcal</p>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button className="btn btn-outline-secondary" onClick={onPrev}>⬅️ Previous</button>
                        <button className="btn btn-outline-primary" onClick={onRegenerate}>🔄 Generate Another</button>
                        <button className="btn btn-outline-secondary" onClick={onNext}>Next ➡️</button>
                    </div>
                </>
            )}

            {!loading && !recipe && (
                <p className="text-muted">No recipe to display.</p>
            )}
        </div>
    );
}
