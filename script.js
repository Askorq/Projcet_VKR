window.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const freezingDegreeInput = document.getElementById('freezingDegree');
    const transportTempInput = document.getElementById('transportTemp');
    const transportDurationInput = document.getElementById('transportDuration');
    const coefficientInput = document.getElementById('coefficient');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const clearTableButton = document.getElementById('clearTableButton');

    function saveProductData() {
        const productData = {
            productName: productNameInput.value,
            freezingDegree: freezingDegreeInput.value,
            transportTemp: transportTempInput.value,
            transportDuration: transportDurationInput.value,
            coefficient: coefficientInput.value
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

    // === Работа с картой и маршрутом ===

    const startPointInput = document.getElementById('startPoint');
    const endPointInput = document.getElementById('endPoint');
    const calculateRouteButton = document.getElementById('calculateRoute');
    const distanceSpan = document.getElementById('distance');
    const durationSpan = document.getElementById('duration');

    let myMap;

    ymaps.ready(() => {
        myMap = new ymaps.Map("map", {
            center: [55.751244, 37.618423],
            zoom: 10
        });
    });

    function calculateRoute() {
        const start = startPointInput.value;
        const end = endPointInput.value;

        ymaps.route([start, end], { mapStateAutoApply: true }).then(route => {
            myMap.geoObjects.removeAll();
            myMap.geoObjects.add(route);

            const distance = route.getPaths().get(0).getLength();
            const duration = route.getPaths().get(0).getJamsTime();

            distanceSpan.textContent = (distance / 1000).toFixed(2) + ' км';
            durationSpan.textContent = (duration / 60).toFixed(2) + ' мин';
        }).catch(err => {
            console.error(err);
            distanceSpan.textContent = 'Ошибка';
            durationSpan.textContent = 'Ошибка';
        });
    }

    calculateRouteButton.addEventListener('click', calculateRoute);
});
