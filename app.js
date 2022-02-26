

const input = document.querySelector('input');
const form = document.querySelector('form')
const results = document.querySelector('.results');


input.addEventListener("keypress", function () {
    results.innerHTML = '';
});

async function getFilms() {
    let url = 'https://ghibliapi.herokuapp.com/films/'
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log("we have an error!!")
        console.log(error);
    }
}


const autoCompleteJS = new autoComplete({

    placeHolder: "Search for Films...",
    data: {
        src: async () => {
            try {
                // Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", "Loading...");

                let res = await fetch('https://ghibliapi.herokuapp.com/films/');
                const data = await res.json();

                // Post Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", autoCompleteJS.placeHolder);

                return data;
            } catch (error) {
                return error;
            }
        },
        keys: ["title"],
        cache: true

    },
    resultItem: {
        highlight: {
            render: true
        }
    },
    resultsList: {
        noResults: true,
        maxResults: 15,
        tabSelect: true
    }
})


autoCompleteJS.input.addEventListener("selection", function (event) {
    const feedback = event.detail;
    autoCompleteJS.input.blur();
    // Prepare User's Selected Value
    const selection = feedback.selection.value[feedback.selection.key];
    // Replace Input value with the selected value
    autoCompleteJS.input.value = selection;
    // Console log autoComplete data feedback
    console.log(feedback);
});




async function renderFilms() {
    let films = await getFilms();
    let html = '';
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let searchTerm = form.elements[0].value;
        console.log(searchTerm)
        form.elements[0].value = '';
        films.forEach(film => {
            if (searchTerm.toLowerCase() === film.title.toLowerCase()) {
                let htmlSegment =
                    `<div class="card my-4 mx-4">
                    <img src="${film.image}" card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${film.title} /  ${film.release_date}  </h5>
                            <h6 class="card-subtitle mb-2 text-muted">Original Title: ${film.original_title} </h6>
                            <h6 class="card-subtitle mb-2 text-muted">Directed by: ${film.director} </h6>
                            <p class="card-text"> ${film.description} </p>
                            
                        </div>
                    </div>`;

                html += htmlSegment;
                let results = document.querySelector('.results');
                results.innerHTML = html;

            }
        })
        html = '';
    });
}

renderFilms();

