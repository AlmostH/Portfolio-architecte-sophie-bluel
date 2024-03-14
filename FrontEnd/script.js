async function getWorks() {
    let response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
(async () => {  
console.log(await getWorks());
})()


  