$(document).ready(function () {
    // Початкові значення
    var defaults = {
        areaValueConfig: 50,
        areaPricePerItem: 1,
        revenue: 0,
        minimulFt: 45,
    };

    // Посилання на елементи на сторінці
    var uiStorage = {
        areaOutputConfig: $("#area-output-config"),
        areaInputConfig: $("#area-input-config"),
        hallway: $("#hallway"),
        kitchen: $("#kitchen"),
        livingroom: $("#livingroom"),
        bedroom: $("#bedroom"),
        childroom: $("#childroom"),
        cabinet: $("#cabinet"),
        bathroom: $("#bathroom"),
        toilet: $("#toilet"),
        repaireRevenueConfig: $("#repaireRevenueConfig"),
        repaireDateConfig: $("#repaireDateConfig"),
        radioButtonsBuildingConfig: $("[name='Building-config']"),
        userNameInput: $("#user-name-input"), // Додано поле вводу для імені користувача
    };

    // Ініціалізація Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
    const firebaseConfig = {
        apiKey: "AIzaSyBcPldxM8xDO6DUSOBDJnQhUbGpAhXZpWo",
        authDomain: "freeform-79b97.firebaseapp.com",
        projectId: "freeform-79b97",
        storageBucket: "freeform-79b97.appspot.com",
        messagingSenderId: "418550667441",
        appId: "1:418550667441:web:37f5dc6d5c3bc8bed42a90",
        measurementId: "G-Y9J6KHCWE9"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    
    // Ініціалізація бази даних Firebase
    const database = firebase.database();

    // Функція розрахунку ціни
    var calculate = function () {
        // Отримання імені користувача
        var userName = uiStorage.userNameInput.val();

        // Коефіцієнт, на який множимо значення слайдера площі
        var areaBuildingConfigMultiplier = 0.0;

        var areapriceconfig = parseInt(uiStorage.areaInputConfig.val()) || defaults.areaValueConfig;

        // Визначаємо значення обраного радіокнопки Building
        var selectedRadioButtonsBuildingConfigValue = $("[name='Building-config']:checked").val();
        if (selectedRadioButtonsBuildingConfigValue === "new building config") {
            areaBuildingConfigMultiplier = 1;
        } else if (selectedRadioButtonsBuildingConfigValue === "old building config") {
            areaBuildingConfigMultiplier = 1.08;
        }
        // Розрахунок ціни
        areapriceconfig = Math.min(Math.max(areapriceconfig, 30), 500);
        var re = (
            defaults.revenue +
            areapriceconfig *
            500
        ) * areaBuildingConfigMultiplier;

        // Розрахунок терміну 
        var repaireDateConfig = (Math.min(6, (defaults.revenue +
            areapriceconfig *
            0.040)));

        // Записуємо до UI елементу
        uiStorage.repaireRevenueConfig.html("$" + (Math.round(re)));
        uiStorage.repaireDateConfig.html(Math.round(repaireDateConfig) + "міс");

        // Записуємо в базу даних Firebase
        if (userName) {
            saveDataToFirebase(userName, areapriceconfig, re);
        }
        console.log
    };

    // Встановлюємо початкові значення для UI елементів
    uiStorage.areaOutputConfig.html(defaults.areaValueConfig);
    uiStorage.areaInputConfig.val(defaults.areaValueConfig);
    uiStorage.radioButtonsBuildingConfig.filter("[value='new building config']").prop("checked", true);

    uiStorage.areaInputConfig.on('input', function () {
        var newValue = parseInt(uiStorage.areaInputConfig.val());
        if (!isNaN(newValue)) {
            $("#area-slider-config").slider("value", newValue);  // Змінюємо значення слайдера
            uiStorage.areaOutputConfig.html(newValue);  // Змінюємо вивід значення
            calculate();
        }
    });

    // Підписуємось на подію зміни/вибору радіокнопки
    uiStorage.radioButtonsBuildingConfig.on('change', function () {
        calculate();
    });

    // Ініціалізація слайдера area
    $("#area-slider-config").slider({
        value: defaults.areaValueConfig,
        min: 30,
        max: 500,
        slide: function (event, ui) {
            uiStorage.areaInputConfig.val(ui.value); // Оновлюємо значення areaInput при руху слайдера
            uiStorage.areaOutputConfig.html(ui.value);
            setProgress(this, (ui.value - 30) / 470); // Оновлюємо заливку слайдера
            calculate();
            console.log
        }
    });

    // Додайте подію на зміну в полі введення імені користувача
    uiStorage.userNameInput.on('input', function () {
        calculate(); // Перераховуємо при зміні імені користувача
    });

    // Функція для запису даних в базу даних Firebase
    function saveDataToFirebase(userName, areapriceconfig, repaireRevenueConfig) {
        // Створюємо посилання на базу даних
        var databaseRef = database.ref("users/" + userName);

        // Записуємо дані в базу даних
        databaseRef.set({
            areapriceconfig: areapriceconfig,
            repaireRevenueConfig: repaireRevenueConfig
        }, function(error) {
            if (error) {
                console.error('Failed to save data to Firebase:', error);
            } else {
                console.log('Data saved successfully');
            }
            console.log
        });
    }

    calculate(); // Запуск розрахунку при завантаженні сторінки
});
