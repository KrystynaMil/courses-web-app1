export const init = async () => {
  const res = await fetch('/api/courses');
  const data = await res.json();
  console.log(data);
  listOfCourses(data);
};

// List of courses, array 

const listOfCourses = (arr) => {
  const courseList = [...arr.courses]
    .map(course => {
      console.log(course);
      const loadCourses = document.createElement('div');
      loadCourses.classList.add('service');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('name');
      loadCourses.appendChild(nameDiv);

      const container = document.createElement('div');
      nameDiv.appendChild(container);

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('icon');
      iconDiv.innerHTML = `<i class="fas fa-laptop-code"></i>`;
      container.appendChild(iconDiv)

      const nameHeader = document.createElement('h2');
      nameHeader.innerHTML = course.name;
      container.appendChild(nameHeader);

        const detailsHeader = document.createElement('h3');
        detailsHeader.classList.add('details-header');
        detailsHeader.innerHTML = 'Details: ';
        const details = document.createElement('p');
        details.classList.add('detailsInfo', 'display');
        details.setAttribute('data-id', course.id);
        details.innerHTML = course.details;
        details.style.color = 'red';
        nameDiv.appendChild(detailsHeader);
        nameDiv.appendChild(details);
    
      
      const placeDiv = document.createElement('div');
      nameDiv.appendChild(placeDiv);
      
   
if(course.place === '' || course.place === undefined || course.place === null) {
        const place = document.createElement('p');
        place.innerHTML = ``;
        placeDiv.appendChild(place);
      }else{
        const place = document.createElement('p');
        place.innerHTML = `${course.place}`;
       
        placeDiv.appendChild(place);
      }
       
      
      const iconsDiv = document.createElement('div');
      iconsDiv.classList.add('icons');
      loadCourses.appendChild(iconsDiv);

      const infoButton = document.createElement('div');
      infoButton.classList.add('icon');
      infoButton.innerHTML = `<i class="fas fa-info-circle"></i>`;
      iconsDiv.appendChild(infoButton);
      infoButton.onclick = () => handlers.getAllCourses(course);
     

      const editButton = document.createElement('div');
      editButton.classList.add('icon');
      editButton.innerHTML = `<i class="fas fa-edit"></i>`;
      iconsDiv.appendChild(editButton);
      editButton.onclick = () => handlers.modifyHandler(course);

      const deleteButton = document.createElement('div');
      deleteButton.classList.add('icon');
      deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      iconsDiv.appendChild(deleteButton );
      deleteButton.onclick = () => deleteCourse(course);

      const li = document.createElement('li');
      li.appendChild(loadCourses);
  
      return li;
    }).reduce((all, next) => {
      all.appendChild(next);
      return all;
    },
    document.createElement('ul'));

  const coursesList = document.getElementById('courses-list');
  coursesList.innerHTML = '';
  coursesList.appendChild(courseList);
};
//
document.getElementById('save-button')
  .addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.querySelector('#course-name');
    const details = document.querySelector('#course-details');
   
   
    const place = document.querySelector('#course-place');
    if (name.value.length === 0 || details.value.length === 0){
      document.querySelector('.error').style.display= 'inline-block';
    }  else {
      document.querySelector('.error').style.display= 'none';
      const courseToSave = {
        name: name.value,
        place: place.value,
        details: details.value
      }

      if(document.getElementById("save-button").innerHTML==="Save changes")
      {
        courseToSave.id=document.getElementById("course-name").getAttribute("dataID")
        handlers.modifyCourse(courseToSave);
      } else
        {
          saveCourse(courseToSave)
        };
     
      name.value = '';
      details.value = '';
      place.value = '';
    }
  });

  document.querySelector('details').addEventListener('toggle', (e)=>{
    if(document.querySelector('details').open === true){
      window.scroll({
        top: 500,
        left: 0,
        behavior: 'smooth'
      });
    }
  });



  //
  
  const saveCourse = (course) => {
    fetch('api/courses/', {
      method: 'POST',
      body: JSON.stringify(course),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(courseData => {
        console.log(courseData);
        document.querySelector('.save').style.display= 'inline-block';
        setTimeout(function(){ document.querySelector('.save').style.display= 'none'; }, 3000);
        return fetch('api/courses');
      })
      .then(response => response.json())
      .then(data => listOfCourses(data))
      .catch(err => {
        alert('unable to save your changes');
        console.error(err);
      });
  };
  
  
  const handlers = {
  modifyHandler: (course)=>{
      
    document.getElementById("course-name").value=course.name
    document.getElementById("course-name").setAttribute('dataId', course.id);
    if(course.place!==undefined) {document.getElementById("course-place").value=course.place}
    document.getElementById("course-details").value=course.details
    document.getElementById("save-button").innerHTML="Save changes"
    window.scrollTo({top: 0, behavior: 'smooth'});
  },
  
  modifyCourse: async (course) => {
    try {
      //reset save button
      document.getElementById("save-button").innerHTML="Save new course"
      //fetch method:put
      const resPut = await fetch("/api/courses/" + course.id, {
        method: "PUT",
        body: JSON.stringify({
          name: course.name,        
          
          place: course.place,
          details: course.details
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const resNew = await fetch("/api/courses");
      const dataNew = await resNew.json();
      listOfCourses(dataNew);
      //message to user
      document.querySelector('.modify').style.display= 'inline-block';
      setTimeout(function(){ document.querySelector('.modify').style.display= 'none'; }, 3000);
  
    } catch (error) {
      console.log(error);
    }
  },
  // GET All courses
  getAllCourses:async (course) =>{  
  try {
    const res = await fetch("/api/courses/" + course.id);
    const data = await res.json();
    document.querySelector(`[data-id="${data.id}"]`).classList.toggle('display');
  } catch (error) {
    console.log(error);
  }
}
  }
  
  const deleteCourse = async (course) => {
  const id = course.id;
  const res = await fetch(`/api/courses/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
  if (!res.ok) {
    alert(`Something went wrong:`);
    console.log("Error from put: ", res);
  } else {
    const resNew = await fetch("/api/courses");
      const dataNew = await resNew.json();
      listOfCourses(dataNew);
  }
  
  };   