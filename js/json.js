function getCategory(categoryId) {
    return jsonData?.categories?.find(c => c.id === categoryId);
}

function getItem(categoryId, itemId) {
    const category = getCategory(categoryId);
    if (!category) return null;

    if (category.items) {
        return category.items.find(i => i.id === itemId);
    }

    if (category.groups) {
        for (const group of category.groups) {
            const item = group.items.find(i => i.id === itemId);
            if (item) return item;
        }
    }

    return null;
}