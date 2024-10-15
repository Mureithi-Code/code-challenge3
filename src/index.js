// Your code here


document.addEventListener("DOMContentLoaded", () => {
    const filmsUrl = "http://localhost:3000/films";
    const buyTicketButton = document.getElementById("buy-ticket");
    let currentFilm = null; // Store the current film object

    // Function to fetch and display all films
    fetch(filmsUrl)
        .then(r => {
            if (!r.ok) {
                throw new Error("Network response was not ok");
            }
            return r.json();
        })
        .then(films => {
            const filmsList = document.getElementById("films");
            filmsList.innerHTML = ""; // Clear existing content

            films.forEach(film => {
                const li = document.createElement("li");
                li.className = "filmItem";
                li.textContent = film.title;
                li.dataset.id = film.id; // Store the film ID

                // Create a delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "ui red button";
                deleteButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    deleteFilm(film.id, li);
                });

                li.appendChild(deleteButton);
                filmsList.appendChild(li);

                // Add click event to load film details
                li.addEventListener("click", () => {
                    loadFilmDetails(film.id);
                });
            });

            // Load details for the first film if available
            if (films.length > 0) {
                loadFilmDetails(films[0].id);
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });

    // Function to delete a film
    const deleteFilm = (id, li) => {
        const filmUrl = `${filmsUrl}/${id}`;
        fetch(filmUrl, { method: "DELETE" })
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                li.remove();
                // Clear film details if the deleted film was selected
                if (currentFilm && currentFilm.id === id) {
                    clearFilmDetails();
                }
            })
            .catch(error => {
                console.error('There was a problem with the delete operation:', error);
            });
    };

    // Function to load and display selected film details
    const loadFilmDetails = (id) => {
        const filmUrl = `${filmsUrl}/${id}`;
        fetch(filmUrl)
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                return r.json();
            })
            .then(data => {
                currentFilm = data; // Store the current film data
                updateFilmDetails(data);
                updateBuyTicketButton(data.capacity - data.tickets_sold);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    // Function to update the film details in the DOM
    const updateFilmDetails = (data) => {
        // Update the poster
        const poster = document.getElementById("poster");
        poster.src = data.poster;
        poster.alt = data.title;

        // Update other film details
        document.getElementById("title").textContent = data.title;
        document.getElementById("runtime").textContent = `${data.runtime} minutes`;
        document.getElementById("film-info").textContent = data.description;
        document.getElementById("showtime").textContent = data.showtime;
        const remainingTickets = data.capacity - data.tickets_sold;
        document.getElementById("ticket-num").textContent = `${remainingTickets} remaining tickets`;

        // Update the Buy Ticket button state
        updateBuyTicketButton(remainingTickets);

        // Handle Buy Ticket button click
        buyTicketButton.onclick = (event) => {
            event.preventDefault();
            if (data.tickets_sold < data.capacity) {
                data.tickets_sold += 1;
                updateRender(data.id, { tickets_sold: data.tickets_sold });
            } else {
                alert("Tickets sold out");
            }
        };
    };

    // Function to update the Buy Ticket button state
    const updateBuyTicketButton = (remainingTickets) => {
        if (remainingTickets > 0) {
            buyTicketButton.disabled = false;
            buyTicketButton.textContent = "Buy Ticket"; // Reset button text
            buyTicketButton.style.color = "";
            // Remove sold-out class if exists
            const selectedFilmItem = document.querySelector(`li[data-id="${currentFilm.id}"]`);
            if (selectedFilmItem) {
                selectedFilmItem.classList.remove("sold-out");
            }
        } else {
            buyTicketButton.disabled = true;
            buyTicketButton.textContent = "Sold Out"; // Change button text to "Sold Out"
            buyTicketButton.style.color = "red";
            // Add sold-out class
            const selectedFilmItem = document.querySelector(`li[data-id="${currentFilm.id}"]`);
            if (selectedFilmItem) {
                selectedFilmItem.classList.add("sold-out");
                selectedFilmItem.style.color = "red";
                selectedFilmItem.style.fontWeight = "bold"
            }
        }
    };

    // Function to update the film data on the server
    const updateRender = (id, movieObj) => {
        const filmUrl = `${filmsUrl}/${id}`;
        fetch(filmUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieObj)
        })
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                return r.json();
            })
            .then(updatedFilm => {
                // Update the film details in the UI
                updateFilmDetails(updatedFilm);
            })
            .catch(error => {
                console.error('There was a problem with the update operation:', error);
            });
    };

    // Function to clear film details from the UI
    const clearFilmDetails = () => {
        document.getElementById("poster").src = '';
        document.getElementById("title").textContent = '';
        document.getElementById("runtime").textContent = '';
        document.getElementById("film-info").textContent = '';
        document.getElementById("showtime").textContent = '';
        document.getElementById("ticket-num").textContent = '';
        buyTicketButton.disabled = true; // Disable the button
        buyTicketButton.textContent = "Buy Ticket"; // Reset button text
    };
});
