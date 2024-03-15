

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
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent= work.title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
showWorks();

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
       filters.appendChild(btn);
});
}

showCategories();

