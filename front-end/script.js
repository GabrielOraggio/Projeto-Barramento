const books = {};
let selectedRating = 0;

// Elementos
const bookSelector = document.getElementById('book-selector');
const bookList = document.getElementById('book-list');
const ratingStars = document.querySelectorAll('.star-rating .star');

// Adiciona event listeners
document.getElementById('book-form').addEventListener('submit', addBook);
document.getElementById('rating-form').addEventListener('submit', saveRating);

// Função para adicionar um livro
function addBook(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    if (title && author) {
        books[title] = { author, rating: 0 };
        updateBookList();
        updateBookSelector();
        document.getElementById('book-form').reset();
    }
}

// Função para salvar a avaliação
function saveRating(e) {
    e.preventDefault();
    const selectedBook = bookSelector.value;

    if (selectedBook && books[selectedBook]) {
        books[selectedBook].rating = selectedRating;
        updateBookList();
        resetStars();
        alert(`Avaliação do livro "${selectedBook}" atualizada para ${selectedRating} estrelas.`);
    }
}

// Atualiza a lista de livros cadastrados
function updateBookList() {
    bookList.innerHTML = '';
    for (const title in books) {
        const { author, rating } = books[title];
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <strong>Título:</strong> ${title}<br>
            <strong>Autor:</strong> ${author}<br>
            <strong>Avaliação:</strong> ${'⭐'.repeat(rating)} (${rating}/5)
        `;
        bookList.appendChild(bookItem);
    }
}

// Atualiza o seletor de livros na seção de avaliação
function updateBookSelector() {
    bookSelector.innerHTML = '<option value="" disabled selected>Escolha um livro</option>';
    for (const title in books) {
        const option = document.createElement('option');
        option.value = title;
        option.textContent = title;
        bookSelector.appendChild(option);
    }
}

// Controle de estrelas
ratingStars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = Number(star.getAttribute('data-value'));
        updateStars(); // Atualiza as estrelas selecionadas
    });

    star.addEventListener('mouseover', () => {
        highlightStars(star.getAttribute('data-value')); // Destaca as estrelas ao passar o mouse
    });

    star.addEventListener('mouseleave', resetStars); // Reseta as estrelas quando o mouse sai
});

// Atualiza visualmente as estrelas
function updateStars() {
    ratingStars.forEach(star => {
        const starValue = Number(star.getAttribute('data-value'));

        // Verifica se a estrela deve ser destacada (até o valor de selectedRating)
        if (starValue <= selectedRating) {
            star.classList.add('selected'); // Aplica a classe 'selected' às estrelas até selectedRating
        } else {
            star.classList.remove('selected'); // Remove a classe 'selected' das demais
        }
    });

    // Atualiza o texto da avaliação
    document.getElementById('selected-rating').textContent = selectedRating;
}

// Destaca as estrelas ao passar o mouse
function highlightStars(rating) {
    ratingStars.forEach(star => {
        const starValue = Number(star.getAttribute('data-value'));
        if (starValue <= rating) {
            star.classList.add('hover'); // Destaca até o valor do hover
        } else {
            star.classList.remove('hover');
        }
    });
}

// Reseta as estrelas para o estado atual
function resetStars() {
    ratingStars.forEach(star => {
        star.classList.remove('hover'); // Remove o efeito hover
    });
    updateStars(); // Atualiza as estrelas para refletir a seleção final
}