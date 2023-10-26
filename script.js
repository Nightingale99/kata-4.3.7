let searchField = document.querySelector('#page-main__git-search');
let searchResults = document.querySelector('.search-results');
let searchAutocomplit = document.querySelector('.page-main__autocomplit');
let marker = 1;
let timeoutId = 0;

function debounce(event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        searchAutocomplit.textContent = '';
        marker = 0;
        const inputValue = event.target.value;
        fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (elem of data.items) {
                searchFunc(elem.name, elem.owner.login, elem.stargazers_count);
            }
    })
    }, 500);
  }

const searchFunc = function(name, owner, stars) {
    let searchList = {};
    if (marker === 0){
        searchList = {};
    }
    marker = 1;
    searchList[`${name}`] = [owner, stars];
    let searchElement = document.createElement('li');
    searchElement.textContent = name;

    searchAutocomplit.appendChild(searchElement);

    searchElement.addEventListener('click', (event) => {
        searchField.value = '';
        searchAutocomplit.textContent = '';
        let newSearchResult =  document.createElement('div');
        newSearchResult.classList.add('search-result');

        let nameField = document.createElement('p');
        nameField.textContent = `Name = ${event.target.textContent}`;
        newSearchResult.appendChild(nameField);

        let ownerField = document.createElement('p');
        ownerField.textContent = `Owner = ${searchList[event.target.textContent][0]}`;
        newSearchResult.appendChild(ownerField);

        let starsField = document.createElement('p');
        starsField.textContent = `Stars = ${searchList[event.target.textContent][1]}`;
        newSearchResult.appendChild(starsField);

        let delButton = document.createElement('button');
        delButton.classList.add('delete-button');
        delButton.id = `delete-button-${Math.floor(Math.random() * 9999)}`
        newSearchResult.appendChild(delButton);

        delButton.addEventListener('click', () => {
            delButton.parentNode.parentNode.removeChild(delButton.parentNode);
        });

        searchResults.appendChild(newSearchResult);
    });

    
    
    
}

searchField.addEventListener('input', function(event) {
    debounce(event)
  });