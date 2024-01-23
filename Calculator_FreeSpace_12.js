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
    const firebaseConfig = {
        apiKey: "AIzaSyBcPldxM8xDO6DUSOBDJnQhUbGpAhXZpWo",
        authDomain: "freeform-79b97.firebaseapp.com",
        projectId: "freeform-79b97",
        storageBucket: "freeform-79b97.appspot.com",
        messagingSenderId: "418550667441",
        appId: "1:418550667441:web:37f5dc6d5c3bc8bed42a90",
        measurementId: "G-Y9J6KHCWE9"
    };
    firebase.initializeApp(firebaseConfig);
    
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
    };

    // Встановлюємо початкові значення для UI елементів
    uiStorage.areaOutputConfig.html(defaults.areaValueConfig);
    uiStorage.areaInputConfig.val(defaults.areaValueConfig);
    $("input[name='Building-config'][value='new building config']").attr("checked", true);

    uiStorage.areaInputConfig.change(function () {
        var newValue = parseInt(uiStorage.areaInputConfig.val());
        if (!isNaN(newValue)) {
            $("#area-slider-config").slider("value", newValue);  // Змінюємо значення слайдера
            uiStorage.areaOutputConfig.html(newValue);  // Змінюємо вивід значення
            calculate();
        }
    });

    // Підписуємось на подію зміни/вибору радіокнопки
    uiStorage.radioButtonsBuildingConfig.change(function () {
        calculate();
    });

    var setProgress = function (obj, relation) {
        var percent = relation * 100;
        $(obj).css({ background: "linear-gradient(to right, #c0c0c0 0%, #000000 " + percent + "%, #c0c0c0 " + percent + "%, #c0c0c0 100%)" });
    };

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
        }
    });

    // Додайте подію на зміну в areaInput
    uiStorage.areaInputConfig.on('input', function () {
        var newValue = parseInt(uiStorage.areaInputConfig.val());
        if (!isNaN(newValue) && newValue >= 30 && newValue <= 500) {
            // Встановлюємо виправлене значення
            $("#area-slider-config").slider("value", newValue);
            uiStorage.areaOutputConfig.html(newValue);
            setProgress($("#area-slider-config")[0], (newValue - 30) / 470);
            calculate();
        }
    });

    // Додайте подію на зміну в полі введення імені користувача
    uiStorage.userNameInput.on('input', function () {
        calculate(); // Перераховуємо при зміні імені користувача
    });

    // Функція для запису даних в базу даних Firebase
    function saveDataToFirebase(userName, areaPrice, repaireRevenue) {
        // Створюємо посилання на базу даних
        var databaseRef = database.ref("users/" + userName);

        // Записуємо дані в базу даних
        databaseRef.set({
            areaPrice: areaPrice,
            repaireRevenue: repaireRevenue
        });
    }

    calculate(); // Запуск розрахунку при завантаженні сторінки
});
