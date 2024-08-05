import { start } from "./loader";

document.addEventListener('DOMContentLoaded', async function() {
    console.log(start);

    // Animación de fade-in para los elementos de la página
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        element.style.opacity = '0';
        let delay = 100;
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease-in';
            element.style.opacity = '1';
        }, delay);
        delay += 100;
    });

    // Añadir interactividad a los elementos del proyecto
    const projectId = document.getElementById('projectId');
    const projectName = document.getElementById('projectName');
    const projectDate = document.getElementById('projectDate');

    if (projectId && projectName && projectDate) {
        [projectId, projectName, projectDate].forEach(element => {
            element.addEventListener('mouseover', function() {
                this.style.color = '#3498db';
                this.style.transition = 'color 0.3s ease';
            });

            element.addEventListener('mouseout', function() {
                this.style.color = '';
            });
        });
    }

    // Función para cargar rendimientro hidrico
    const getRendimientroHidrico = async (id) => {          
        try {
            // Realizar una solicitud al servidor para obtener los datos de la gráfica
            
            const response = await fetch(`/api/rendimientoHidrico/${id}`, {
                headers: new Headers({
                    "content-type": "application/json"
                })
            }); 

            if(response.ok){                
                response.json().then(function (data){
                    console.log(data);                 
                    
                    for(let i = 0; i < data.rhah.columns.length; i++) {
                        data.rhah.columns[i] =  data.rhah.columns[i].substring(0, 3);
                    }
    
                    for(let i = 0; i < data.rhas.columns.length; i++) {
                        data.rhas.columns[i] =  data.rhas.columns[i].substring(0, 3);
                    }
                    
                    for(var i=0; i<data.rham.data.length; i++){
                        const space = document.getElementById('space');
    
                        const myButton = document.createElement("button");
                        myButton.setAttribute("class", "accordion");
                        myButton.classList.add('active');
                        myButton.textContent =  (i+1) + "." + " " +data.rham.index[i].replaceAll("_", " ");                    
                        space.appendChild(myButton);                    
    
                        const spaceDiv = document.createElement("div");
                        spaceDiv.setAttribute("id", "spaceDiv_"+i);
                        spaceDiv.setAttribute("class", "panel");
                        spaceDiv.style.display = "flex";         
                        spaceDiv.style.gap = "32px";
                        spaceDiv.style.flexWrap = "wrap";                                             
                        space.appendChild(spaceDiv);
    
                        const area = document.getElementById("spaceDiv_"+i);                   
    
                        const divWidth = '330px';
                        const divHeight = '320px';
    
                        const myDiv1 = document.createElement("div");                                       
                        myDiv1.style.width = divWidth;
                        myDiv1.style.height = divHeight;                    
                        myDiv1.setAttribute("class", "myMarginLR"); 
                        myDiv1.style.display = "flex";                       
                        area.appendChild(myDiv1); 
                        const myDiv1Child1 = document.createElement("div");
                        myDiv1Child1.style.width = "13%";                   
                        myDiv1Child1.innerHTML = "<p class='verticalP'>Rendimiento l/s/km<sup>2</sup></p>";
                        const myDiv1Child2 = document.createElement("div");  
                        myDiv1Child2.style.width = "87%";                    
                        myDiv1.appendChild(myDiv1Child1);
                        myDiv1.appendChild(myDiv1Child2);                   
    
                        const myDiv2 = document.createElement("div");                    
                        myDiv2.style.width = divWidth;
                        myDiv2.style.height = divHeight;
                        myDiv2.setAttribute("class", "myMarginLR"); 
                        myDiv2.style.display = "flex";                    
                        area.appendChild(myDiv2);
                        const myDiv2Child1 = document.createElement("div");
                        myDiv2Child1.style.width = "13%";                   
                        myDiv2Child1.innerHTML = "<p class='verticalP'>Rendimiento l/s/km<sup>2</sup></p>";
                        const myDiv2Child2 = document.createElement("div");  
                        myDiv2Child2.style.width = "87%";                    
                        myDiv2.appendChild(myDiv2Child1);
                        myDiv2.appendChild(myDiv2Child2); 
    
                        const myDiv3 = document.createElement("div");                    
                        myDiv3.style.width = divWidth;
                        myDiv3.style.height = divHeight;
                        myDiv3.setAttribute("class", "myMarginLR"); 
                        myDiv3.style.display = "flex";                    
                        area.appendChild(myDiv3);
                        const myDiv3Child1 = document.createElement("div");
                        myDiv3Child1.style.width = "13%";                   
                        myDiv3Child1.innerHTML = "<p class='verticalP'>Rendimiento l/s/km<sup>2</sup></p>";
                        const myDiv3Child2 = document.createElement("div");  
                        myDiv3Child2.style.width = "87%";                    
                        myDiv3.appendChild(myDiv3Child1);
                        myDiv3.appendChild(myDiv3Child2); 
    
                        const canvas1 = document.createElement("canvas");
                        canvas1.setAttribute("id", "rham_"+i);           
                        canvas1.style.width = "300px"                                    
                        myDiv1Child2.appendChild(canvas1)
                        var categorias = data.rham.columns; 
                        var valores = data.rham.data[i]; 
                        var promedio = valores.reduce((acc, curr) => acc + curr, 0) / valores.length;
                        renderBar(categorias, valores, promedio, "rham_"+i, 'Rendimiento Hídrico Mensual Año Medio');
    
                        const canvas2 = document.createElement("canvas");
                        canvas2.setAttribute("id", "rhah_"+i);                    
                        myDiv2Child2.appendChild(canvas2)
                        categorias = data.rhah.columns;
                        valores = data.rhah.data[i]; 
                        promedio = valores.reduce((acc, curr) => acc + curr, 0) / valores.length;
                        renderBar(categorias, valores, promedio, "rhah_"+i, 'Rendimiento Hídrico Mensual Año Humedo');
    
                        const canvas3 = document.createElement("canvas");
                        canvas3.setAttribute("id", "rhas_"+i);                    
                        myDiv3Child2.appendChild(canvas3)
                        categorias = data.rhas.columns; 
                        valores = data.rhas.data[i]; 
                        promedio = valores.reduce((acc, curr) => acc + curr, 0) / valores.length;
                        renderBar(categorias, valores, promedio, "rhas_"+i, 'Rendimiento Hídrico Mensual Año Seco');
                    }   
                    
                    var acc = document.getElementsByClassName("accordion");
                    for (var i = 0; i < acc.length; i++) {
                        acc[i].addEventListener("click", function() {
                            this.classList.toggle("active");                      
                            var panel = this.nextElementSibling;                        
                            if (panel.style.display === "flex") {
                                panel.style.display = "none";
                            } else {
                                panel.style.display = "flex";
                                panel.style.gap = "32px";
                                panel.style.flexWrap = "wrap";                           
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar los datos de la gráfica:', error);
        }

        /*fetch('/api/rendimientoHidrico', {
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(function (response){
            console.log(response);
            response.json().then(function (data){
                console.log(data);
            });
        });*/
    };

    const renderBar = async (categorias, valores, promedio, id, titulo) => {
        const backgroundColors = valores.map(value => getBackgroundColor(value));        
        //const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));
        const ctx = document.getElementById(id).getContext('2d');
        const waterLevelChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias,
                datasets: [{
                    label: titulo,
                    data: valores,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors,
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,                                             
                    },
                    x: {
                        ticks: {                            
                            minRotation: 90,
                        }
                    },                    
                },         
                plugins: {
                    annotation: {
                        annotations: [{
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y',
                            value: promedio,
                            borderColor: '#ABB2B9',
                            borderWidth: 2,
                            label: {
                                content: `RH Anual: ${promedio.toFixed(2)}`,
                                display: true,
                                //enabled: true,
                                position: 'start',                                
                                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                                font: {
                                    size: 12
                                }
                            }
                        }]
                    }
                }, 
                legend: {
                    display: true
                }     
            }        
        });
    }

    const getBackgroundColor = (value) => {
        if (value <= 3) {
            return 'rgba(255, 0, 0)'; 
        } else if (value<=6 && value>3) {
            return 'rgba(255, 80, 0)'; 
        } else if (value<=10 && value>6) {
            return 'rgba(255, 120, 0)'; 
        }else if (value<=15 && value>10) {
            return 'rgba(255, 180, 0)'; 
        }else if (value<=20 && value>15) {
            return 'rgba(255, 205, 0)'; 
        }else if (value<=30 && value>20) {
            return 'rgba(255, 255, 0)'; 
        }else if (value<=40 && value>30) {
            return 'rgba(255, 255, 150)'; 
        }else if (value<=50 && value>40) {
            return 'rgba(160, 255, 115)'; 
        }else if (value<=70 && value>50) {
            return 'rgba(75, 230, 0)'; 
        }else if (value<=100 && value>70) {
            return 'rgba(0, 135, 50)'; 
        }else if (value<=150 && value>100) {
            return 'rgba(115, 180, 255)'; 
        }else if (value<=200 && value>150) {
            return 'rgba(0, 90, 230)'; 
        }else {
            return 'rgba(0, 40, 115)'; 
        }
    };

    getRendimientroHidrico(projectId.textContent);
    
});