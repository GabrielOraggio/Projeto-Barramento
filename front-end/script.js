// Referências aos elementos
const books = {};
let selectedRating = 0;

// Adiciona event listeners aos formulários
document.getElementById('book-form').addEventListener('submit', addBook);
document.getElementById('rating-form').addEventListener('submit', addRating);

// Adicionar Livro
function addBook(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    if (title && author) {
        books[title] = { author, rating: 0 };
        updateBookList();
        clearForm('book-form');
    }
}

// Avaliar Livro
function addRating(e) {
    e.preventDefault();

    const title = document.getElementById('book-title').value;

    if (books[title]) {
        books[title].rating = selectedRating; // Atualiza a avaliação do livro
        updateBookList();
        clearForm('rating-form');
        resetStars();
    } else {
        alert('Livro não encontrado. Por favor, cadastre o livro primeiro.');
    }
}

// Atualizar Lista de Livros
function updateBookList() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    for (const title in books) {
        const book = books[title];
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <strong>Título:</strong> ${title}<br>
            <strong>Autor:</strong> ${book.author}<br>
            <strong>Avaliação:</strong> ${'⭐'.repeat(book.rating)}
        `;
        bookList.appendChild(bookItem);
    }
}

// Limpa o formulário
function clearForm(formId) {
    document.getElementById(formId).reset();
}

// Funções de Estrelas
const stars = document.querySelectorAll('.star-rating .star');

// Adiciona event listeners para as estrelas
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value'); // Atualiza a avaliação selecionada
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        highlightStars(star.getAttribute('data-value'));
    });

    star.addEventListener('mouseleave', resetStars);
});

// Atualiza a visualização das estrelas
function updateStars() {
    stars.forEach(star => {
        // Adiciona a classe 'selected' às estrelas até o valor selecionado
        star.classList.toggle('selected', star.getAttribute('data-value') <= selectedRating);
    });
    document.getElementById('selected-rating').textContent = selectedRating; // Atualiza a exibição da avaliação
}

// Destaca as estrelas ao passar o mouse
function highlightStars(rating) {
    stars.forEach(star => {
        star.classList.toggle('hover', star.getAttribute('data-value') <= rating);
    });
}

// Reseta as estrelas para o estado atual
function resetStars() {
    stars.forEach(star => {
        star.classList.remove('hover');
    });
    updateStars(); // Atualiza para refletir a avaliação selecionada
}
