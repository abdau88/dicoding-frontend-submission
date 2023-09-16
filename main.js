// Load formulir
document
  .getElementById("inputBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("inputBookTitle").value;
    var author = document.getElementById("inputBookAuthor").value;
    var year = parseInt(document.getElementById("inputBookYear").value);
    var isComplete = document.getElementById("inputBookIsComplete").checked;

    var book = {
      id: +new Date().getTime(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    // Cek tipe data properti
    var tipeData =
      (typeof book.id === "string" || typeof book.id === "number") &&
      typeof book.title === "string" &&
      typeof book.author === "string" &&
      typeof book.year === "number" &&
      typeof book.isComplete === "boolean";

    if (tipeData) {
      var bookJSON = JSON.stringify(book);

      var currentIndex = localStorage.getItem("currentIndex") || 0;
      localStorage.setItem("bookData" + currentIndex, bookJSON);

      currentIndex++;
      localStorage.setItem("currentIndex", currentIndex);

      document.getElementById("inputBook").reset();
      if (isComplete) {
        displayComplete(book);
      } else {
        displayinComplete(book);
      }
      alert("Buku berhasil ditambahkan!");
    } else {
      alert("Data buku tidak sesuai tipe yang diharapkan.");
    }
  });

// Load data dari localStorage
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  if (key.startsWith("bookData")) {
    var retrievedBookJSON = localStorage.getItem(key);
    var retrievedBook = JSON.parse(retrievedBookJSON);

    if (retrievedBook.isComplete == true) {
      displayComplete(retrievedBook);
    } else {
      displayinComplete(retrievedBook);
    }
  }
}

//Pencarian
document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var searchTitle = document.getElementById("searchBookTitle").value;

    bookSearching(searchTitle);
  });

// Fungsi untuk menampilkan data buku selesai dibaca
function displayComplete(book) {
  document.getElementById("completeBookshelfList").insertAdjacentHTML(
    "afterbegin",
    ` <article class="book_item" data-key="${key}">
    <h3>${book.title}</h3>
    <p>Id Buku: ${book.id}</p>
    <p>Penulis: ${book.author}</p>
    <p>Tahun: ${book.year}</p>
    
    <div class="action">
    <button class="green" onclick="incomplete('${key}')">Belum Selesai Dibaca</button>
      <button class="red" onclick="removeBook('${key}')">Hapus buku</button>
    </div>
    </article>`
  );
}

// Fungsi untuk menampilkan data buku belum selesai dibaca
function displayinComplete(book) {
  document.getElementById("incompleteBookshelfList").insertAdjacentHTML(
    "afterbegin",
    ` <article class="book_item" data-key="${key}">
    <h3>${book.title}</h3>
    <p>Id Buku: ${book.id}</p>
    <p>Penulis: ${book.author}</p>
    <p>Tahun: ${book.year}</p>
    
    <div class="action">
    <button class="green" onclick="complete('${key}')"> Selesai Dibaca</button>
      <button class="red" onclick="removeBook('${key}')">Hapus buku</button>
    </div>
    </article>`
  );
}

// Fungsi untuk menghapus data buku dari localStorage berdasarkan kunci
function removeBook(key) {
  if (confirm("Apakah anda yakin ingin menghapus buku ini?")) {
    localStorage.removeItem(key);
    var bookElement = document.querySelector(`[data-key="${key}"]`);
    if (bookElement) {
      bookElement.remove();
    }
  } else {
    alert("Buku batal dihapus");
  }
}

// Fungsi untuk menandai buku belum selesai dibaca
function incomplete(key) {
  var bookElement = document.querySelector(`[data-key="${key}"]`);
  if (bookElement) {
    bookElement.setAttribute("data-iscomplete", "false");

    document.getElementById("incompleteBookshelfList").appendChild(bookElement);

    var button = bookElement.querySelector(".green");
    button.textContent = "Selesai Dibaca";
    button.setAttribute("onclick", `complete('${key}')`);

    updateBookStatus(key, false);
  }
}

// Fungsi untuk menandai buku selesai dibaca
function complete(key) {
  var bookElement = document.querySelector(`[data-key="${key}"]`);
  if (bookElement) {
    bookElement.setAttribute("data-iscomplete", "true");

    document.getElementById("completeBookshelfList").appendChild(bookElement);

    // Ubah tombol aksi menjadi "Belum Selesai Dibaca"
    var button = bookElement.querySelector(".green");
    button.textContent = "Belum Selesai Dibaca";
    button.setAttribute("onclick", `incomplete('${key}')`);

    updateBookStatus(key, true);
  }
}

// Fungsi untuk memperbarui status buku di localStorage
function updateBookStatus(key, isComplete) {
  var bookJSON = localStorage.getItem(key);
  if (bookJSON) {
    var book = JSON.parse(bookJSON);
    book.isComplete = isComplete;
    localStorage.setItem(key, JSON.stringify(book));
  }
}

// Fungsi pencarian buku
function bookSearching(title) {
  var allBooks = document.querySelectorAll(".book_item");

  allBooks.forEach(function (book) {
    var bookTitle = book.querySelector("h3").textContent;

    if (bookTitle.toLowerCase().includes(title.toLowerCase())) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}
