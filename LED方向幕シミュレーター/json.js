function getCategory(categoryId) {
    return jsonData?.categories?.find(c => c.id === categoryId);
}

function getItem(categoryId, itemId) {
    const category = getCategory(categoryId);
    if (!category) return null;

    return category.items.find(i => i.id === itemId);
}