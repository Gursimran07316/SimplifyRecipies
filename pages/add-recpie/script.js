import recipesDb from '../../script/database/recipes-db.js';
// Varaibles
const recipeForm = document.getElementById('recipe-form');
const alertTrigger = document.getElementById('submitBtn')
const notificationIcon=document.getElementById("allow-notification")
const recipeName = document.getElementById('recipeName');
const chefName = document.getElementById('chefName');
const ingredients = document.getElementById('ingredients');
const steps = document.getElementById('steps');
const recipeImage = document.getElementById('recipeImage');

// Notification Api
if('Notification' in window && 'serviceWorker' in navigator){
    switch (Notification.permission){
        case 'default':
            notificationIcon.style.display = "block"
            notificationIcon.innerHTML='<i class="fa-regular fa-bell"></i>'
            break
        case 'granted':
            notificationIcon.style.display = "none"
            break
        case 'denied':
            notificationIcon.style.display = "block"
            notificationIcon.innerHTML='<i class="fa-regular fa-bell-slash"></i>'
            break
    }
    notificationIcon.addEventListener('click', () => {
        console.log("permission: ", Notification.permission)
        requestUserPermission()
    })
  } else {
    notificationNotAllowed()
  }
  
  function notificationNotAllowed(){
    console.log("Notification not allowed")
    notificationIcon.style.display = "block"
            notificationIcon.innerHTML='<i class="fa-regular fa-bell-slash"></i>'
  }
  function requestUserPermission(){
    Notification.requestPermission()
        .then((permission) => {
            console.log("user choice: ", permission)
            if(permission === 'granted'){
              notificationIcon.style.display = "none"
            } else {
                notificationNotAllowed()
            }
        })
  }

//   Page Visibility Api
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==="hidden"){
        if (recipeName.value.trim() != '' || chefName.value.trim() != '' || ingredients.value.trim()!= '' || recipeImage.value.trim() != ''|| steps.value.trim() != ''){
        if (Notification.permission === 'granted') {
        const option = {
            body: "Your recipe data may not be saved. Please complete the form before leaving",
            icon: "../../icons/icon.png"
        }
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Attention', option);
        });
    }
}
    }
  })
// Alert logic
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}
// Getting message from service worker
navigator.serviceWorker.addEventListener("message",(e)=>{


        recipesDb.add(e.data.payload.recipeName, e.data.payload.chefName, e.data.payload.ingredients, e.data.payload.image,e.data.payload.image)
        .then(() => {
           
                console.log("adding databaseee");
                    if (Notification.permission === 'granted') {
                    const option = {
                        body: "Data is synchronized successfully",
                       icon:'../../icons/icon.png'
                    }
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification('Wohoo', option);
                    });
                }
        })
        .catch(err => {
            console.log(err);
        });
  

    
  })
recipesDb.open().then(() => {
    if (alertTrigger) {
        alertTrigger.addEventListener('click', (e) => {
          handleFormSubmission(e)
        })
      }
      recipeForm.addEventListener('submit', function (e) {
        handleFormSubmission(e)
    })

}).catch(err => {
    console.log("fail to open", err);
})




// Handling submission
const handleFormSubmission = (e) => {
    e.preventDefault();

  
    if (recipeName.value.trim() === '' || chefName.value.trim() === '' || ingredients.value.trim() === '' || recipeImage.value.trim() === ''|| steps.value.trim() === '') {
        appendAlert('Please fill all the values', 'danger');
    } else {
        recipesDb.add(recipeName.value, chefName.value, ingredients.value, recipeImage.value,steps.value)
            .then(() => {
               
                        
                        recipeName.value = '';
                        chefName.value = '';
                        ingredients.value = '';
                        recipeImage.value = '';
                        steps.value='',
                        appendAlert('Recipe successfully added', 'success');
                  
            })
            .catch(err => {
                console.log(err);
            });
    }
};
