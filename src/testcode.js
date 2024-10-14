// Your code here


document.addEventListener("DOMContentLoaded", () => {
    const filmsUrl = "http://localhost:3000/films";
    const buyTicketButton = document.getElementById("buy-ticket");
    
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
            filmsList.innerHTML = ""; // Clear any existing content


            films.forEach(film => {
                const li = document.createElement("li");
                li.className = "filmItem";
                li.textContent = film.title;
                li.dataset.id = film.id; // Store the film ID

                //Create a delete button
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

            //Load datails for the 1st film
            if (films.length > 0) {
                loadFilmDetails(films[0].id);
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });


    const filmItem = document.querySelector('.filmItem')
    

    //Function to delete a film
    const deleteFilm = (id, li) => {
        const filmUrl = `${filmsUrl}/${id}`;
        fetch(filmUrl, { method: "DELETE" })
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                li.remove();
            })
            .catch(error => {
                console.error('There was a problem with the delete operation:', error);
            });
    };


    // Function to load and display selected film details

    const loadFilmDetails = (id) => {
        const filmUrl = `${filmsUrl}/${id}`;
        console.log(filmUrl,'yyyyyuuyyyyyyyyyyyyyyyyyyy')
        fetch(filmUrl)
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                return r.json(); // Corrected from Response to r
            })
            .then(data => {
                // Update the poster
                const poster = document.getElementById("poster");
                poster.src = data.poster;
                poster.alt = data.title;
                filmId = data.id;

                // Update the title
                const title = document.getElementById("title");
                title.textContent = data.title;

                // Update the runtime
                const runtime = document.getElementById("runtime");
                runtime.textContent = `${data.runtime} minutes`;

                // Update the description
                const filmInfo = document.getElementById("film-info");
                filmInfo.textContent = data.description;

                // Update the showtime
                const showtime = document.getElementById("showtime");
                showtime.textContent = data.showtime;
                const remainingTickets = data.capacity - data.tickets_sold;
                const ticketNum = document.getElementById("ticket-num");
                if (data.tickets_sold >= data.capacity) {
                    alert("tickets soldout")
                } else {
                    buyTicketButton.addEventListener("click", (event) => {
                        event.preventDefault()
                        console.log(data.capacity, data.tickets_sold)
                        data.tickets_sold += 1


                        let movieObj = {
                            tickets_sold: data.tickets_sold
                        }
                        // console.log(movieObj)
                        updateRender(data.id, movieObj);
                    })

                    // Calculate remaining tickets


                    
                    ticketNum.setAttribute("data-sold", data.tickets_sold);
                    ticketNum.textContent = `${remainingTickets} remaining tickets`;

                    //Update the Buy Ticket button state
                    updateBuyTicketButton(remainingTickets);
                    //Store the current film id for the button
                }




            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    //Function to update the Buy Ticket button state
    function updateBuyTicketButton(remainingTickets) {
        if (remainingTickets > 0) {
            buyTicketButton.disabled = false;
        } else {
            buyTicketButton.disabled = true;
        }
    };





    //Event listener for the But Ticket button


    // Initial fetch of all films


    function updateRender(id, movieObj) {
        const filmUrl = `${filmsUrl}/${id}`;
        fetch(`${filmUrl}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieObj)
        })
            .then(r => {
                console.log(r)
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                return r.json();
            })
            .then(updatedFilm => {
                console.log(updatedFilm)

            });

    }
});







// document.addEventListener("DOMContentLoaded", () => {
//     const filmsUrl = "http://localhost:3000/films";

//     //Function to fetch and display all films
// const fetchFilms = () => {
//     fetch(filmsUrl)
//     .then(r => {
//         if (!r.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return r.json();
//     })
//     .then(films => {
//         const filmsList = document.getElementById("films");
//         filmsList.innerHTML = ""; //Clear any existing content

//         films.forEach(film => {
//             const li = document.createElement("li");
//             li.className = "film item";
//             li.textContent = film.title;
//             li.dataset.id = film.id; //Store the film ID

//             //Add click event to load film details
//             li.addEventListener("click", () => {
//                 loadFilmDetails(film.id);
//             });

//             filmsList.appendChild(li);
//         });
//     })
//     .catch(error => {
//         console.error("There was a problem with the fetch operation:", error);
//     });
// };


// //Initial fetch of all films
// fetchFilms();


//     fetch(filmUrl)
//     .then(r => {
//         if (!r.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return r.json();
//     })
//     .then(data => {
//         //Update the poster
//         const poster = document.getElementById("poster");
//         poster.src = data.poster;
//         poster.alt = data.title;

//         //Update the title
//         const title = document.getElementById("title");
//         title.textContent = data.title;

//         //Update the runtime
//         const runtime = document.getElementById("runtime");
//         runtime.textContent = `${data.runtime} minutes`;

//         //Update the description
//         const filmInfo = document.getElementById("film-info");
//         filmInfo.textContent = data.description;

//         //Update the showtime
//         const showtime = document.getElementById("showtime");
//         showtime.textContent = data.showtime;

//         //Calculate remaining tickets
//         const ticketsSold = data.tickets_sold;
//         const capacity = data.capacity;
//         const remainingTickets = capacity - ticketsSold;

//         const ticketNum = document.getElementById("ticket-num");
//         ticketNum.setAttribute("data-sold", ticketsSold);
//         ticketNum.textContent = `${remainingTickets} remaining tickets`;
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });
// });