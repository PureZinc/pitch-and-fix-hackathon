document.addEventListener("DOMContentLoaded", function () {
    renderCategories();
});

function renderCategories() {
    const categoryGrid = document.querySelector('.category-grid');

    const categoryCard = (category) => `
        <div class="category-card">
            <img src="${category.mage}" alt="${category.name} Category">
            <h3>${category.name}</h3>
            <a href="${category.link}" class="category-link">View All</a>
        </div>
    `;

    categoryGrid.innerHTML = categories.map(category => categoryCard(category)).join('');
}
