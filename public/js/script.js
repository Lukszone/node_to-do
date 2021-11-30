const tasks = "lista_tareas";
document.addEventListener("DOMContentLoaded", () => {
  let tareas = [];
  const ul = document.querySelector("#contenedorTareas"),
    btn = document.querySelector("#btnAgregarTarea"),
    input = document.querySelector("#inputNuevaTarea");

  btn.onclick = () => {
    const tarea = input.value;
    if (!tarea) {
      return;
    }

    fetch("/tarea_nueva", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tarea: tarea,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "saved") {
          tareas.push({
            tarea: tarea,
            terminada: false,
          });
          input.value = "";
          refrescarTareas();
        } else {
          console.log("error");
        }
      });
  };



 
  
 
 
 
  // const obtenerTareas = () => {
  //   const posibleLista = JSON.parse(localStorage.getItem(tareas));
  //   if (posibleLista) {
  //     return posibleLista;
  //   } else {
  //     return [];
  //   }
  // };

  const refrescarTareas = () => {
    ul.innerHTML = "";
    for (const [indice, tarea] of tareas.entries()) {
      const btnEliminar = document.createElement("a");
      btnEliminar.classList.add("btn-info");
      btnEliminar.innerHTML = "&times;";
      btnEliminar.href = "";
      btnEliminar.onclick = (e) => {
        e.preventDefault();
        tareas.splice(indice, 1);
        refrescarTareas();
      };

      const btnActualizar = document.createElement("a");
      btnActualizar.classList.add("btn-danger");
      btnActualizar.innerHTML = "Editar";
      btnActualizar.href = `/tarea/:id/actualizar`;
      btnActualizar.onclick = (e) => {
        e.target("/actualizar");
      };

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("form-check-input");
      checkbox.onchange = function () {
        if (this.checked) {
          tareas[indice].terminada = true;
        } else {
          tareas[indice].terminada = false;
        }
        guardarTareas(tareas);
        refrescarTareas();
      };

      const span = document.createElement("span");
      span.textContent = tarea.tarea;

      const li = document.createElement("li");
      li.classList.add("mb-2");

      if (tarea.terminada) {
        checkbox.checked = true;
        span.classList.add("tachado");
      }
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(btnEliminar);
      li.appendChild(btnActualizar);
      ul.appendChild(li);
    }
  };

  refrescarTareas();
});
