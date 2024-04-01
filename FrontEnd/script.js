

/* Recuperer les travaux sur l'API*/

async function getWorks() {
    let response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
/*(async () => {  
console.log(await getWorks());
})()*/

/* Afficher les travaux*/

const gallery = document.getElementsByClassName("gallery")[0];

async function showWorks(){
    const galleryWorks = await getWorks();
    //console.log(galleryWorks);
    galleryWorks.forEach((work) => {
        createWork(work);
    });
}
showWorks();

function createWork(work){
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    figure.dataset.category = work.category.id;
    image.src = work.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent= work.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

 //Recuperer les categories 

async function getCategories(){
    let response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}
/* Afficher les categories*/
const filters = document.getElementsByClassName("filters")[0];

async function showCategories(){
    const categories = await getCategories();
    //console.log(categories);
    categories.forEach((categorie) => {
        const btn = document.createElement("button");
        btn.textContent = categorie.name;
       btn.id = categorie.id;
       btn.className = "filterbutton";
       filters.appendChild(btn);
});
}

showCategories();


function setColor(btn){
    let property = document.getElementById(btn);
    if (property.style.color === "white"){
        property.style.backgroundColor = "#FFFFFF"
        property.style.color = "#1D6154";      
    } else {
        property.style.backgroundColor = "#1D6154";
        property.style.color = "white";
    }

}


async function filterCategory() {
    const filters = await getWorks();
    console.log(filters);
    const buttons = document.querySelectorAll(".filters button")
    console.log(buttons)
    buttons.forEach((button) => {
        // Supression de la classe de style sur le bouton
        button.addEventListener("click", (e) => {
          btnId = e.target.id;
          // ajout de la classe de style "appuyée" sur le bouton
          gallery.innerHTML = "";
          console.log(btnId)
          if (btnId !== "0") {
            const filtersTriCategory = filters.filter((work) => {
              return work.category.id == btnId;
            });
            filtersTriCategory.forEach((work) => {
                createWork(work);
            });
          } else {
            showWorks();
          }
          console.log(btnId);
        });
      });
}
filterCategory()

function onload() {
  const logintext = document.getElementById("logintext");
  const editionbanner = document.getElementById("editionbanner");
  const modifyProject = document.getElementById("modifyProject");
  let token = localStorage.getItem("token")
  if(token) {
    logintext.innerHTML = "<a href='' onclick=logout() >logout</a>";
    editionbanner.style.display = "block";  
    modifyProject.style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("token");
}


function modifyModal() {
  alert("test");  

}