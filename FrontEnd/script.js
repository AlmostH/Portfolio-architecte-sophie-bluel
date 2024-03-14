

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