import recipesDb from '../../script/database/recipes-db.js';

const notificationIcon = document.getElementById("allow-notification")
const recipesListAll = document.getElementById('recipe-list-all');

// Notification api
if ('Notification' in window && 'serviceWorker' in navigator) {
  switch (Notification.permission) {
    case 'default':
      notificationIcon.style.display = "block"
      notificationIcon.innerHTML = '<i class="fa-regular fa-bell"></i>'
      break
    case 'granted':
      notificationIcon.style.display = "none"
      break
    case 'denied':
      notificationIcon.style.display = "block"
      notificationIcon.innerHTML = '<i class="fa-regular fa-bell-slash"></i>'
      break
  }
  notificationIcon.addEventListener('click', () => {
    console.log("permission: ", Notification.permission)
    requestUserPermission()
  })
} else {
  notificationNotAllowed()
}

function notificationNotAllowed() {
  console.log("Notification not allowed")
  notificationIcon.style.display = "block"
  notificationIcon.innerHTML = '<i class="fa-regular fa-bell-slash"></i>'
}
function requestUserPermission() {
  Notification.requestPermission()
    .then((permission) => {
      console.log("user choice: ", permission)
      if (permission === 'granted') {
        notificationIcon.style.display = "none"
      } else {
        notificationNotAllowed()
      }
    })
}


// Getting data
recipesDb.open().then(() => {
  recipesDb.getAll().then(data => {

    displayAllItems(data)



  }).catch(err => {
    console.log(err);
  })


}).catch(err => {
  console.log("fail to open", err);
})

// ADDING TO UI
function displayAllItems(data) {
  if (data.length == 0) {
    recipesListAll.innerHTML = "No data to show"
  } else {
    recipesListAll.innerHTML = ""
    data.forEach((el, index) => {

      const { recipeName, chefName, image, id } = el
      recipesListAll.innerHTML += `<div  key=${id} class="card col-12 ml-4 col-md-4">
          <img src=${image} class="card-img-top img-fluid equal-height-img">
          <div class="card-body">
            <h5 class="card-title">${recipeName}</h5>
            <p class="card-text">${chefName}</p>
            <button class="btn btn-primary" id="item-info">Show Info</button>
          </div>
        `
    }
    );

    document.querySelectorAll("#item-info").forEach(btn => {
      btn.addEventListener('click', (e) => {


        const id = e.target.parentElement.parentElement.getAttribute('key')
        recipesDb.get(id).then(data => {


          const { recipeName, chefName, ingredients, image, steps } = data
          var itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
          document.getElementById('itemModal').innerHTML = `
                  <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">${recipeName}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
            <p>  Chef - ${chefName} </p>
             <p> Ingredients- ${ingredients} </p>
             <p> Steps- ${steps} </p>
              <hr class="border border-primary border-3 opacity-75">
              <img src=${image} alt="Image Alt Text" class="img-fluid">
                
                
              </div>
              <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
        </div>
            </div>
          </div>
                  `
          itemModal.show()

        }).catch(err => {
          console.log(err);
        })
      })
    });
  }
}