let tache_finish = document.querySelector(".textCaseSpan1");
let tache_encours = document.querySelector(".textCaseSpan2");
let tache_urgente = document.querySelector(".textCaseSpan3");

//------------------------
let search_input = document.querySelector("#search");
let filtre = document.querySelector("#filtre");

//-------------------------
let add_input = document.querySelector("#taskInput");
let addTaskButton = document.querySelector("#addTaskButton");
let prioprite = document.querySelector("#choiseCat");
let date = document.querySelector(".date");

//------------------------------
//localStorage.clear();

const rawTasks = localStorage.getItem('tasks');
const list_tasks = (rawTasks && rawTasks !== "undefined") ? JSON.parse(rawTasks) : null;

if (!list_tasks) {
    localStorage.setItem('tasks', JSON.stringify([]))
}



//--------------------------
let task_name = document.querySelector(".name-task");
let btn_edit = document.querySelector(".btn-edit");
let btn_delete = document.querySelector(".btn-delete");


let idEdit = null;


//----------------------------------------------------------
// fonction me permettant de rechercher une tache et un index d une tache
function findIndex(id, tasks) {
    for (let index in tasks) {
        if (tasks[index].id === id) {
            return index;
        }
    }
    return -1;
}

function findTask(id, tasks) {
    for (let task of tasks) {
        if (task.id === id) {
            return task;
        }
    }
    return null;
}

//---------------------------------------------------------------

function rechercherNbreCategorie(categorie) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let count = 0;
    tasks.forEach(task => {
        if (task.priority === categorie) {
            count++;

        }

    })
    return count;


}

function rechercherNbreTacheEndCours(statut) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let count = 0;
    tasks.forEach(task => {
        if (task.statut === statut) {
            count++;

        }

    })
    return count;


}


addTaskButton.addEventListener("click", function () {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (idEdit == null) {
        let taskName = add_input.value.trim();
        let taskPriority = prioprite.value;
        let taskDate = date.value;
        if (taskName !== "") {
            const idTask = crypto.randomUUID();
            let newTask = { id: idTask, name: taskName, priority: taskPriority, date: taskDate, statut: "en cours" };
            tasks.push(newTask);


        } else {
            alert("Libelle de la tache est requis!")
        }
    }
    else {
        let taskName = add_input.value.trim();
        let taskPriority = prioprite.value;
        let taskDate = date.value;
        if (taskName !== "") {
            let editTask = { id: idEdit, name: taskName, priority: taskPriority, date: taskDate, statut: "en cours" };
            let indexEdit = findIndex(idEdit, tasks);
            tasks[indexEdit] = editTask;

        } else {
            alert("Libelle de la tache est requis!")
        }
        addTaskButton.textContent = "Ajouter";
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    add_input.value = "";
    date.value = "";
    afficher_tasks();

})



///------------------------------------------------------

function afficher_tasks() {
    let allTask = document.querySelector(".allTask");
    allTask.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    console.log(tasks)

    let motCle = search_input.value.toLowerCase();
    let typeFiltre = filtre.value;

    tasks.forEach(task => {
        let correspondRecherche = task.name.toLowerCase().includes(motCle);
        let correspondFiltre = false;

        if (typeFiltre === "all") correspondFiltre = true;
        else if (typeFiltre === "completed") correspondFiltre = (task.statut === "termine");
        else if (typeFiltre === "in-progress") correspondFiltre = (task.statut === "encours");
        else if (typeFiltre === "urgent") correspondFiltre = (task.priority === "urgente");

        let couleur = "";
        if (task.priority =="basse"){
            couleur = "green";
        }else if(task.priority == "moyenne"){
            couleur = "rgb(190, 190, 109)";
        }else{
            couleur = "red";
        }

        if (correspondRecherche && correspondFiltre) {
            let divTask = document.createElement("div");
            divTask.innerHTML = `
                 <div class="task">
                    <div>
                        <p class="name-task">${task.name}</p>
                        <small><small class="etat" style="background-color: ${couleur};">${task.priority} </small>&nbsp ${task.statut}</small>
                    </div>
                    <div class="option">
                        <p>${task.date}</p>
                        <button class="btn-edit" onClick="finishTask('${task.id}')"><i class="fa-solid fa-check"></i></button>
                        <button class="btn-edit" onClick="editTask('${task.id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="btn-delete" onClick="deleteTask('${task.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            allTask.append(divTask);
        }
    });

    tache_urgente.textContent = rechercherNbreCategorie("urgente");
    tache_encours.textContent = rechercherNbreTacheEndCours("en cours");
    tache_finish.textContent = rechercherNbreTacheEndCours("terminé");
}

search_input.addEventListener("input", afficher_tasks);
filtre.addEventListener("change", afficher_tasks);

afficher_tasks();







function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let index = findIndex(id, tasks);
    //console.log(index);
    tasks.splice(index, 1);
    //console.log(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    afficher_tasks();

}

function editTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let taskEdit = findTask(id, tasks);
    //console.log(id);
    idEdit = id;
    add_input.value = taskEdit.name;
    prioprite.value = taskEdit.priority;
    date.value = taskEdit.date;
    addTaskButton.textContent = "Sauvegarder";

}

function finishTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let index = findIndex(id, tasks);
    tasks[index].statut = "terminé";
    localStorage.setItem('tasks', JSON.stringify(tasks));
    afficher_tasks();


}

