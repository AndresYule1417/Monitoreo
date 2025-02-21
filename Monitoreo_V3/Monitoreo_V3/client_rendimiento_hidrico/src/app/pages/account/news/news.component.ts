import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit, AfterViewInit {

  @ViewChild("newscontainer") newsContainer!: ElementRef;
  
  rssFeedUrl = 'https://news.google.com/rss/search?q=hidrología+forestal+medio+ambiente+Colombia&hl=es-419&gl=CO&ceid=CO:es-419'; // URL del feed RSS actualizado
  proxyUrl = 'https://api.allorigins.win/get?url=';

  constructor(){}

  ngAfterViewInit(): void {
    //console.log(this.newsContainer.nativeElement);        
  }
  
  //funcion que se ejecuta despues del constructor y llama a la funcion updateNews
  ngOnInit(): void {
    //const newsContainer = document.getElementById('news-container');
    this.updateNews();   
    /*setInterval((result: any) => {
      console.log("noticias");
      this.updateNews();
    }, 18000);*/
  }  

  //funcion que lee una direccion para sacar sus componenetes html y renderizarlos en la pagina web
  async updateNews(){
    try{
      const response = await fetch(`${this.proxyUrl}${encodeURIComponent(this.rssFeedUrl)}`);
      const data = await response.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, 'application/xml');
      const items = xml.querySelectorAll('item');      
  
      this.newsContainer.nativeElement.innerHTML = "";
  
      items.forEach((item:any) => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const description = item.querySelector('description').textContent;
        const enclosure = item.querySelector('enclosure');
        const imageUrl = enclosure ? enclosure.getAttribute('url') : 'default-image.jpg';        
  
        const newsItem = document.createElement('div');        
        newsItem.style.backgroundColor = "#fff";
        newsItem.style.borderRadius = "10px";
        newsItem.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
        newsItem.style.padding = "20px";
        newsItem.style.transition = "all 0.3s ease"; 
        
        newsItem.addEventListener('mouseover', () => {
          newsItem.style.transform = "translateY(-5px)"
          newsItem.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";    
        });

        newsItem.addEventListener('mouseout', () => {
          newsItem.style.transform = "translateY(0px)"
          newsItem.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";   
        });
  
        newsItem.innerHTML = `
                                <a onmouseover="this.style.backgroundColor='#2980b9';" onmouseout="this.style.backgroundColor='#3498db';"  style='display:inline-block; background-color:#3498db; color:white; padding:8px 15px; border-radius:5px; text-decoration:none; transition:background-color 0.3s ease;' href="${link}" target="_blank">
                                    <!--<img src="${imageUrl}" alt="${title}">-->
                                    <h3 style='font-size:1.2rem; margin-bottom:10px'>${title}</h3>
                                    <!--<p style='font-size:0.9rem; color:#666; margin-bottom:15px;'>${description}</p>-->
                                </a>
                              `;
        this.newsContainer.nativeElement.appendChild(newsItem);
      });
    }catch(error){
      this.newsContainer.nativeElement.innerHTML = '<p>Error fetching news. Please check your network connection.</p>';
    }
  }
}