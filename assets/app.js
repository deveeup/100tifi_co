const $body = document.querySelector("body");
const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";

const getCharacter = async url => {
  $modal = document.querySelector("#modal");
  let response = await fetch(url);
  let data = await response.json();
  let { name, gender, image, location, origin, status, species } = data;
  let characterModal = `<div class="modal-info">
      <img src="${image}" alt=""/>
      <div class="modal-info-details">
        <h2>${name}</h2>
        <div class="modal-info-details-text">
          <img src="./assets/images/sex.svg" alt="Rick And Morty - Sex character"/>
          <p>${gender}</p>
        </div>
        <div class="modal-info-details-text">
          <img src="./assets/images/dimensions.svg" alt="Rick And Morty - Dimensions character"/>
          <p>${location.name}</p>
        </div>
        <div class="modal-info-details-text">
          <img src="./assets/images/earth.svg" alt="Rick And Morty - Earth"/>
          <p>${origin.name}</p>
        </div>
        <div class="modal-info-details-text">
          <img src="./assets/images/team.svg" alt="Rick And Morty - Team"/>
          <p>${species}</p>
        </div>
        <div class="modal-info-details-text">
          <img src="./assets/images/status.svg" alt="Rick And Morty - Status"/>
          <p>${status}</p>
        </div>
        <button class="modal-info-details-closed">x</button>
      </div>
    </div>`;
  let newModal = document.createElement("div");
  newModal.setAttribute("id", "modal");
  newModal.setAttribute("class", "modal");
  newModal.innerHTML = characterModal;
  $body.appendChild(newModal);
  let nodeList = document.querySelectorAll(".modal-info-details-closed");
  [...nodeList].forEach($button =>
    $button.addEventListener("click", () => {
      let modal = document.getElementById("modal");
      modal.parentNode.removeChild(modal);
    })
  );
};

const getData = async api => {
  let response = await fetch(api);
  let data = await response.json();
  let characters = data.results;
  let nextPage = data.info.next;
  if (nextPage) {
    const saveLocalStorage = () => {
      try {
        localStorage.setItem("next_fetch", nextPage);
        return true;
      } catch {
        console.log("Error saving info in LocalStorage /:");
        return false;
      }
    };
    saveLocalStorage();
    let template = characters
      .map(character => {
        let specie = character.species;
        let gender = character.gender;
        switch (specie) {
          case "Human":
            specie = "human.svg";
            break;
          case "Alien":
            specie = "alien.svg";
            break;
          default:
            specie = "mistery.svg";
        }
        switch (gender) {
          case "Male":
            gender = "male.svg";
            break;
          case "Female":
            gender = "female.svg";
            break;
          default:
            gender = "unknown.svg";
        }
        return `
          <article class="items-card">
            <div class="items-card-imageContainer">
              <img src="${character.image}" alg="${character.name}" />
            </div>
            <div class="items-card-info">
              <h2>${character.name}</h2>
              <div class="items-card-info-icons">
                <div class="items-card-info-icons-item">
                  <img src="./assets/images/earth.svg" class="items-card-info-icons-item-icon"  alt="${character.location.name}"/>
                  <h5>${character.location.name}</h5>
                </div>
                <div class="items-card-info-icons-item">
                  <img src="./assets/images/${specie}" class="items-card-info-icons-item-icon"  alt="${character.species}"/>
                  <h4>${character.species}</h4>
                </div>
                <div class="items-card-info-icons-item">
                  <img src="./assets/images/${gender}" class="items-card-info-icons-item-icon"  alt="${character.gender}"/>
                  <h4>${character.gender}</h4>
                </div>
              </div>
              <button class="items-card-info-button" data-url="${character.url}">View more</button>
            </div>
          </article>`;
      })
      .join("");
    let newItem = document.createElement("section");
    newItem.classList.add("items");
    newItem.innerHTML = template;
    $app.appendChild(newItem);

    let nodeList = document.querySelectorAll(".items-card-info-button");
    [...nodeList].forEach($button =>
      $button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        let characterUrl = event.target.dataset.url;
        await getCharacter(characterUrl);
      })
    );
  } else {
    let finishContent = `
      <h5>☹️The characters are over</h5>
      <p>
        View code in
        <a href="https://github.com/deveeup/escuelajs-reto-05" target="_blank">here</a>
      </p>
    `;
    let finishBox = document.createElement("div");
    finishBox.setAttribute("class", "finishBox");
    finishBox.innerHTML = finishContent;
    $body.appendChild(finishBox);
  }
};

const loadData = async fetchApi => {
  if (fetchApi) {
    localStorage.removeItem("next_fetch");
    getData(fetchApi);
  }
};

loadData(API);

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      const nextPage = localStorage.getItem("next_fetch");
      loadData(nextPage);
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);
