

/******* Recuperer les travaux sur l'API*******/

async function getWorks() {
   try { 
    let response = await fetch("http://localhost:5678/api/works");
    return await response.json();
   }  catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
    return null;
}
  }


/********** Afficher les travaux******/

const gallery = document.getElementsByClassName("gallery")[0];

async function showWorks(){
    const galleryWorks = await getWorks();
    if(galleryWorks) {
      galleryWorks.forEach((work) => {
          createWork(work);
      });
    }
}
showWorks();

function createWork(work){
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    figure.dataset.category = work.categoryId;
    figure.dataset.id = work.id;
    image.src = work.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent= work.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

 /****Recuperer les categories ******/

async function getCategories(){
  try {
    let response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories: ",error);
    return null;
  }
}
/******************* Afficher les categories boutons filtres *********/

const filters = document.getElementsByClassName("filters")[0];

async function showCategories(){
    const categories = await getCategories();
      if(categories) {
        categories.forEach((categorie) => {
          const btn = document.createElement("button");
          btn.textContent = categorie.name;
          btn.id = categorie.id;
          btn.className = "filterbutton";
          filters.appendChild(btn);
    });
  }
}

showCategories();



     /*********Filtrer au clic boutons filtres ***********/

async function filterCategory() {
    const filters = await getWorks();
    const buttons = document.querySelectorAll(".filters button")

    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          btnId = e.target.id;
          gallery.innerHTML = "";
   
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
        });
      });
}
filterCategory()

/***************** Affichage quand connecté *****************************/

const logintext = document.getElementById("logintext");
const editionbanner = document.getElementById("editionbanner");
const modifyProject = document.getElementById("modifyProject");
const body = document.getElementsByTagName("html")[0];

function onload() {
  let token = localStorage.getItem("token")
  if(token) {
    logintext.innerHTML = "<a href='' onclick=logout() >logout</a>";
    editionbanner.style.display = "flex";  
    modifyProject.style.display = "flex";
    filters.style.display = "none";
    body.style.marginTop = "59px";

  }
}

function logout() {
  localStorage.removeItem("token");
}



/******************* Modale *******************************/

let modal = null;
let galleryedit = document.getElementById("galleryedit");
                                                                         
function openModal() {
  const target = document.getElementById("modaledit");
  target.style.display = "flex"; 
  modal = target;
  showWorksedit();
}

function closeModal() {
  modal.style.display = "none"; 
  modal = null;
}

/* fermer la modale si on clique en dehors*/
window.onclick = function(event) {
  if(event.target == modal) { 
    closeModal();
  }        
}

async function showWorksedit(){
  const galleryWorks = await getWorks();
  galleryedit.innerHTML="";
  galleryWorks.forEach((work) => {
      createWorkedit(work);
  });
}

function createWorkedit(work){
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const trash = document.createElement("img");
  const divimag = document.createElement("div");
  const urltrash = document.createElement("a");
  figure.dataset.id = work.id;
  image.src = work.imageUrl;
  image.className = "editimg";
  trash.className = "trashimg";
  divimag.className = "trashwrapper";
  urltrash.href = "#";
  urltrash.setAttribute("onclick","deleteWork("+work.id+")");
  trash.src = "./assets/icons/trash-can-solid.png";
  figure.appendChild(image);
  figure.appendChild(divimag);
  divimag.appendChild(urltrash);
  urltrash.appendChild(trash);
  galleryedit.appendChild(figure);
}

/*********************************** Suppression de projet ********************************************/
async function deleteWork(id) {
      await fetch("http://localhost:5678/api/works/"+id, {
      method: "DELETE",
      headers: {
        Authorization: 'Bearer '+localStorage.getItem("token")
      }
    }).then(response => {
      if (response.ok) {
        const figures = document.querySelectorAll('[data-id="'+id+'"]')
        figures.forEach((figure) => { 
          figure.remove();
        })
      } else {
        console.error("La suppression a échoué.");
      }
      }
    )
}

/********************************************* * Modale 2************************************/


const modale2 = document.getElementById("modale2");
const addWorkButton = document.querySelector(".js-modal-add");

addWorkButton.addEventListener("click", async function () {
  modale2.style.display = "flex";
  modal.style.display ="none";
  const categories = document.getElementById("categoryId");
  const listecat = await getCategories();
  categories.innerHTML="";
  listecat.forEach((categorie) => {
     const cat = document.createElement("option");
     cat.text = categorie.name;
     cat.value = categorie.id;
     categories.appendChild(cat);
  })
})
/* fermeture de la modale d'ajout de projet au clic sur la croix */
function closeModal2() {
  modale2.style.display = "none"; 
  modal.style.display = "none";
  resetform();
}
/* revenir à la modale précédente au clic sur la flèche*/
function previousModal(){
  modale2.style.display = "none"; 
  modal.style.display = "flex";
  resetform();
  
}
/********* Le formulaire se vide si on ferme ou on revient sur la précédente modale *************************/

function resetform(){
  let formadd = document.getElementById("addProjectForm");
  document.getElementById("addPhotoBtnid").style.display = "block";
  document.getElementById("addPhotoSubtitle").style.display = "block";
  document.querySelector("#inputfilepreview").src = "./assets/icons/picture.png";
  document.querySelector("#inputfilepreview").className = ""
  document.querySelector("#inputuploadfile + span.error").textContent = "";
  document.querySelector("#titleupload + span.error").textContent = "";
  formadd.reset();
}

/******************************Ajouter un projet via le formulaire/***************************/

const addProject = document.querySelector("#validateAddbutton");
addProject.addEventListener("click", addProjectForm);

function addProjectForm(e){
  e.preventDefault();
  const title = document.getElementById("titleupload");
  const categoryId = document.getElementById("categoryId");
  const fileInput = document.getElementById("inputuploadfile")
  if ((!title.validity.valid) || (!fileInput.validity.valid)){
    showError();
    return false;
  }
  const formData = new FormData();
  formData.append("title",title.value);
  formData.append("category", categoryId.value);
  formData.append("image", fileInput.files[0]);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: 'Bearer '+localStorage.getItem('token')
    },
    accept: "application/json",
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur de requête réseau");
      }
      return response.json();  
    })
    .then(data => {
      alert("Projet ajouté avec succès !");
      createWork(data);
      createWorkedit(data);
      previousModal();
    })
    .catch(error => {
      console.error(error);
      alert("Erreur lors de l'ajout du projet.");
    });

}
/* Messages d'erreur si formulaire incorrect*/

function showError() {
  const title = document.getElementById("titleupload");
  const image = document.getElementById("inputuploadfile");
  if (title.validity.valueMissing) {
    const titleError = document.querySelector("#titleupload + span.error");
    titleError.textContent = "Entrez un titre";
  }
  if (image.validity.valueMissing){
    const imageError = document.querySelector("#inputuploadfile + span.error");
    imageError.textContent = "Inserez une image";
  }

}

/* efface le message d'erreur si on rentre un titre*/
document.querySelector("#titleupload").addEventListener("input",  function () {
  document.querySelector("#titleupload + span.error").textContent = "";
})

/* importation du fichier*/
function importData() {
  const input = document.getElementById("inputuploadfile");
  input.onchange = _ => {
            let files =   Array.from(input.files);
            console.log(files);
            previewPhoto(files);
        };
  input.click();

}


/************** affichage de la photo en prévisualisation ****************/

function previewPhoto(input) {
  if (input[0]) {
    document.getElementById("addPhotoBtnid").style.display = "none";
    document.getElementById("addPhotoSubtitle").style.display = "none";
    var reader = new FileReader();
    reader.onload = function (e) {
      const img=document.querySelector("#inputfilepreview");
      img.className = "uploadpreview";
      img.src =  e.target.result;
      document.getElementById("titleupload").value=input[0].name;
      document.querySelector("#inputuploadfile + span.error").textContent = "";
    };
    reader.readAsDataURL(input[0]);
  }
}


 