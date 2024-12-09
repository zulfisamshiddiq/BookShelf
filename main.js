let books = [];

const STORAGE_KEY = "BOOKSHELF_APP";

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${
        book.isComplete ? "Belum selesai" : "Selesai"
      } dibaca</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookElement
    .querySelector("[data-testid='bookItemIsCompleteButton']")
    .addEventListener("click", () => {
      book.isComplete = !book.isComplete;
      saveData();
      renderBooks();
    });

  bookElement
    .querySelector("[data-testid='bookItemDeleteButton']")
    .addEventListener("click", () => {
      books = books.filter((b) => b.id !== book.id);
      saveData();
      renderBooks();
    });

  bookElement
    .querySelector("[data-testid='bookItemEditButton']")
    .addEventListener("click", () => {
      const newTitle = prompt("Edit Judul", book.title);
      /*REVIEWER: Coba untuk implementasikan edit tidak menggunakan alert bawaan browser, tapi langsung pada element HTML*/
      const newAuthor = prompt("Edit Penulis", book.author);
      const newYear = prompt("Edit Tahun", book.year);

      if (newTitle) book.title = newTitle;
      if (newAuthor) book.author = newAuthor;
      if (newYear) book.year = parseInt(newYear, 10);

      saveData();
      renderBooks();
    });

  return bookElement;
}

function renderBooks(sortBy = null) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  let sortedBooks = [...books];

  if (sortBy === "title") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "year") {
    sortedBooks.sort((a, b) => a.year - b.year);
  }

  sortedBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function validateForm(title, author, year) {
  if (!title || !author || isNaN(year) || year <= 0) {
    alert("Semua kolom harus diisi dengan benar!");
    return false;
  }
  return true;
}

document.getElementById("bookForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value, 10);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (!validateForm(title, author, year)) return;

  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData();
  renderBooks();

  event.target.reset();
});

document.getElementById("searchBook").addEventListener("submit", (event) => {
  event.preventDefault();

  const query = document.getElementById("searchBookTitle").value.toLowerCase();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

document.getElementById("filterByYear").addEventListener("input", (event) => {
  const selectedYear = event.target.value;

  const filteredBooks = books.filter((book) => {
    if (!selectedYear) return true;
    return book.year == selectedYear;
  });

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

document.getElementById("sortBy").addEventListener("change", (event) => {
  const sortBy = event.target.value;
  renderBooks(sortBy);
});

window.addEventListener("load", () => {
  loadData();
  renderBooks();
});
