document.addEventListener('DOMContentLoaded', function () {
window.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const freezingDegreeInput = document.getElementById('freezingDegree');
    const transportTempInput = document.getElementById('temperatureMode');
    const transportDurationInput = document.getElementById('transportTime');
    const coefficientInput = document.getElementById('coefficient');
    const productWeightInput = document.getElementById('productWeight');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const clearTableButton = document.getElementById('clearTableButton');

    let myMap;
    let seaMap;
    let airMap;

    function saveProductData() {
        const productData = {
            productName: productNameInput.value,
            freezingDegree: freezingDegreeInput.value,
            transportTemp: transportTempInput.value,
            weight: productWeightInput.value,
            transportDuration: transportDurationInput.value,
            coefficient: coefficientInput.value,
        };

        let data = localStorage.getItem('productData');
        let productDataArray = data ? JSON.parse(data) : [];
        productDataArray.push(productData);
        localStorage.setItem('productData', JSON.stringify(productDataArray));
        productForm.reset();
        displayProductData();
    }

    function displayProductData() {
        productTable.innerHTML = "";
        const data = localStorage.getItem('productData');

        if (data) {
            JSON.parse(data).forEach((productData, index) => {
                let row = productTable.insertRow();
                row.insertCell().innerHTML = index + 1;
                row.insertCell().innerHTML = productData.productName;
                row.insertCell().innerHTML = productData.freezingDegree;
                row.insertCell().innerHTML = productData.transportTemp;
                row.insertCell().innerHTML = productData.weight;
                row.insertCell().innerHTML = productData.transportDuration;
                row.insertCell().innerHTML = productData.coefficient;


            });
        } else {
            let row = productTable.insertRow();
            let cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'Данные о продукте не найдены.';
        }
    }

    productForm.addEventListener('submit', e => {
        e.preventDefault();
        saveProductData();
    });

    clearTableButton.addEventListener('click', () => {
        localStorage.removeItem('productData');
        displayProductData();
    });

    displayProductData();

    // === Работа с картой и маршрутами ===
    const startPointInput = document.getElementById('startPoint');
    const endPointInput = document.getElementById('endPoint');
    const calculateRouteButton = document.getElementById('calculateRoute');
    const distanceSpan = document.getElementById('distance');
    const durationSpan = document.getElementById('duration');

    ymaps.ready(() => {
        myMap = new ymaps.Map("map", {
            center: [55.751244, 37.618423],
            zoom: 4
        });

        seaMap = new ymaps.Map("seaMap", {
            center: [50, 60],
            zoom: 3
        });
        seaMap.setType('yandex#hybrid');
        airMap = new ymaps.Map("airMap", {
            center: [55.7558, 37.6173],
            zoom: 4
        });
        airMap.setType('yandex#hybrid');
    });

    function calculateRoute() {
        const start = startPointInput.value;
        const end = endPointInput.value;

        ymaps.route([start, end]).then(route => {
            myMap.geoObjects.removeAll();
            myMap.geoObjects.add(route);

            const distance = route.getPaths().get(0).getLength();
            const duration = route.getPaths().get(0).getJamsTime();

            distanceSpan.textContent = (distance / 1000).toFixed(2) + ' км';
            durationSpan.textContent = (duration / 60).toFixed(2) + ' мин';
        });
    }

    calculateRouteButton.addEventListener('click', calculateRoute);
        const drawAirRouteBtn = document.getElementById('drawAirRoute');
        const airStartInput = document.getElementById('airStartPoint');
        const airEndInput = document.getElementById('airEndPoint');

        if (drawAirRouteBtn) {
        drawAirRouteBtn.addEventListener('click', () => {
            const start = airStartInput.value;
            const end = airEndInput.value;

            ymaps.geocode(start).then(res1 => {
                const coord1 = res1.geoObjects.get(0).geometry.getCoordinates();

                ymaps.geocode(end).then(res2 => {
                    const coord2 = res2.geoObjects.get(0).geometry.getCoordinates();

                    const line = new ymaps.Polyline([coord1, coord2], {}, {
                        strokeColor: "#00AAFF",
                        strokeWidth: 4,
                        strokeOpacity: 0.8,
                        geodesic: true
                    });

                    airMap.geoObjects.removeAll();
                    airMap.geoObjects.add(line);
                    airMap.setBounds(line.geometry.getBounds(), { checkZoomRange: true });
                    const distance = ymaps.coordSystem.geo.getDistance(coord1, coord2);
                    document.getElementById('airDistance').textContent = (distance / 1000).toFixed(2) + ' км';
                });
            });
        });
    }

    const drawSeaRouteBtn = document.getElementById('drawSeaRoute');
    const seaMapLegend = document.getElementById('seaMapLegend');

    if (drawSeaRouteBtn) {
        drawSeaRouteBtn.addEventListener('click', () => {
            const routeCoords = [
                [43.1155, 131.8855],  // Владивосток
                [52.247376, 160.363915],  // Тихий океан
                [66.032873, -168.505188],  // Берингов пролив
                [71.6267, 128.8744],  // Тикси
                [64.5393, 40.5175],   // Архангельск
                [59.9386, 30.3141]    // Санкт-Петербург
];
            const suezRouteCoords = [
                [43.1155, 131.8855],   // Владивосток
                [35.838950, 131.299989],   // Японское море
                [15.249226, 111.814008],   // Южно-Китайское море
                [10.8231, 106.6297],   // Сайгон
                [7.8731, 80.7718],     // Шри-Ланка
                [12.992458, 51.920789],     // Индийский океан
                [12.8797, 45.0360],    // Аденский залив
                [30.0444, 31.2357],    // Каир
                [39.0764, 25.2317],    // Эгейское море
                [38.9637, 35.2433],    // Турция (восточное Средиземноморье)
                [44.6167, 33.5254],    // Севастополь
                [44.6167, 39.7203]     // Новороссийск
];

            const suezRoute = new ymaps.Polyline(suezRouteCoords, {}, {
                strokeColor: "#00FF00",
                strokeWidth: 4,
                strokeOpacity: 0.8,
                geodesic: true
            });

            const seaRoute = new ymaps.Polyline(routeCoords, {}, {
                strokeColor: "#FF0000",
                strokeWidth: 4,
                strokeOpacity: 0.8,
                geodesic: true
            });

            seaMap.geoObjects.removeAll();
            seaMap.geoObjects.add(seaRoute);
            seaMap.geoObjects.add(suezRoute);

const allCoords = seaRoute.geometry.getCoordinates().concat(suezRoute.geometry.getCoordinates());
const bounds = ymaps.geoQuery(ymaps.geometry.LineString(allCoords)).getBounds();

seaMap.setBounds(bounds, { checkZoomRange: true });
setTimeout(() => {
    seaMapLegend.innerHTML = `
      <p><span style="display:inline-block;width:20px;height:10px;background:#FF0000;"></span> Северный морской путь</p>
      <p><span style="display:inline-block;width:20px;height:10px;background:#00FF00;"></span> Путь через Суэцкий канал</p>
    `;
}, 200);
        });
    }
});
});
