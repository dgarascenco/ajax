const KEY = "d7f679c2aba9fb4640da0a4a903c29f9"

let city, update_data

window.onload = function(){
    let city = JSON.parse(localStorage.getItem("city_state"))    
    let time = JSON.parse(localStorage.getItem("time_state"))
    let current_time = new Date().getTime()
    let data = null

    if (city === null) 
        localStorage.setItem( "city_state", JSON.stringify("Chisinau") )
        
    if ( time!= null && current_time < (time + 10000) ) 
        data = JSON.parse(localStorage.getItem("data_state"))
        
    ////////////  запускает функцию обновление данных каждые 30 сек
    loadWeatherData(city, data)
    update_data = setInterval(loadWeatherData, 30000, city)
}

///////////устанавливает город
function setCity(){
    clearInterval(update_data);
    let city = document.getElementById("city").value

    localStorage.setItem("city_state", JSON.stringify(city))  

    loadWeatherData(city)
    update_data = setInterval(loadWeatherData, 30000, city)
}

//////////выводит данные о погоде из API
function renderData(data, time){
    let html = document.createElement('div')  
    let h = document.createElement('h1') 
        h.innerText = "City: " + data.city 
    let h1 = document.createElement('h2')
        h1.innerText = "temperature: " + data.temperature + "C"
    let h2 = document.createElement('h2')
        h2.innerText = data.description
    let p = document.createElement('p')
        p.innerText = "Wind speed: " + data.wind + "m/s\n(последнее обновление: " + showTime(time) + ")" 
    let img = document.createElement('img')
        img.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`
           
    html.appendChild(h)
    html.appendChild(img)
    html.appendChild(h1)
    html.appendChild(h2)
    html.appendChild(p)

    document.querySelector('.weather').innerText = ""
    document.querySelector('.weather').appendChild(html)
}

//////////возвращает время в формате h:m:s
function showTime(time){
    let d = time  / (1000 * 60 * 60 * 24)
    let h = (d - Math.floor(d)) * 24
    let m = (h - Math.floor(h)) * 60
    let s = (m - Math.floor(m)) * 60

    return Math.floor(h) + ":" + Math.floor(m) + ":" + Math.floor(s)
}

/////////Загружает данные о погоде 
function loadWeatherData(city, data = null){    
    let current_time = new Date().getTime()      
    ///////////// если прошло больше 10 секунд с момента последнего обновления, то обновить с внешнего источника
    if (data == null){
        console.log("%cUPDATE from api.openweathermap.org: " + showTime(current_time), "color: green")
        let CURRENT_WEATHER_URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=207d4226b0e1a60410e9b56f63f8b03e&units=metric`
        let xhr = new XMLHttpRequest()
            xhr.open("GET", CURRENT_WEATHER_URL)
            xhr.onload = function (){

                            let data = JSON.parse(xhr.responseText)

                            if (data.cod == "404") 
                            document.querySelector('.weather').innerText = data.message
                            // alert (data.message)                            
                            else{  
                                let content_data = { 
                                    city: data.name,                       
                                    temperature: data.main.temp,
                                    wind: data.wind.speed,
                                    description: data.weather[0].description,
                                    icon: data.weather[0].icon                                    
                                }                           

                                let time = new Date().getTime()
                                localStorage.setItem("time_state", JSON.stringify(time))
                                localStorage.setItem("data_state", JSON.stringify(content_data))
                                renderData(content_data, time)
                            }
                        }
            xhr.send()
    }///////////// если прошло меньше 10 секунд с момента последнего обновления, то обновить из localStorage
    else{
        console.log("%cUPDATE from localStorage: " + showTime(current_time), "color: blue")
        renderData(data, current_time)
    }      
}

///////////очищает все данные
function resetData(){
    document.querySelector('.weather').innerText = ""
    localStorage.clear()
    clearInterval(update_data);
}
