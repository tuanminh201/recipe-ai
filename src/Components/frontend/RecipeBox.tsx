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
}

export default function RecipeBox({ recipe, loading }: Props) {
    return (
        <div className="recipe-box">
            {loading && <p className="text-black">Đang tạo công thức món ăn từ AI...</p>}

            {!loading && recipe && (
                <>
                    <h4 className="fw-bold mb-2 text-black">{recipe.name}</h4>
                    <p><strong>Nguyên liệu:</strong> {recipe.ingredients.join(', ')}</p>
                    <p><strong>Phương pháp:</strong> {recipe.method} ({recipe.style})</p>
                    <p><strong>Lượng calo:</strong> {recipe.calories} kcal</p>
                </>
            )}

            {!loading && !recipe && <p className="text-muted">Không có công thức để hiển thị.</p>}
        </div>
    );
}
