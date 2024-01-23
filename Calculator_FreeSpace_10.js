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
        radioButtonsBuildingConfig: $("[name='Building-config']")
    };

    // Функція розрахунку ціни
    var calculate = function () {
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

// Збереження даних в Firebase Realtime Database
function saveDataToFirebase(data) {
    $.ajax({
      type: 'POST',
      url: 'gs://freeform-79b97.appspot.com', // Замініть на URL вашого сервера
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.error('Error saving data to Firebase:', error);
      }
    });
  }
  

        // Записуємо до UI елементу
        uiStorage.repaireRevenueConfig.html("$" + (Math.round(re)));
        uiStorage.repaireDateConfig.html(Math.round(repaireDateConfig) + "міс");

        // Зберігаємо дані в localStorage
        localStorage.setItem('areaValueConfig', uiStorage.areaInputConfig.val());
        localStorage.setItem('repaireRevenueConfig', Math.round(re));
        localStorage.setItem('repaireDateConfig', Math.round(repaireDateConfig));
    };

    // Встановлюємо початкові значення для UI елементів
    var storedAreaValue = localStorage.getItem('areaValueConfig');
    uiStorage.areaOutputConfig.html(storedAreaValue || defaults.areaValueConfig);
    uiStorage.areaInputConfig.val(storedAreaValue || defaults.areaValueConfig);
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
        value: storedAreaValue || defaults.areaValueConfig,
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

    // Збереження даних при виході зі сторінки
    $(window).on('beforeunload', function () {
        localStorage.setItem('areaValueConfig', uiStorage.areaInputConfig.val());
    });

    // Відновлення даних при поверненні на сторінку
    $(window).on('load', function () {
        var storedAreaValue = localStorage.getItem('areaValueConfig');
        if (storedAreaValue) {
            uiStorage.areaInputConfig.val(storedAreaValue);
            $("#area-slider-config").slider("value", storedAreaValue);
            uiStorage.areaOutputConfig.html(storedAreaValue);
            calculate();
        }
    });

    calculate(); // Запуск розрахунку при завантаженні сторінки



    // Збереження даних в Firebase
const firebaseData = {
    areaValueConfig: uiStorage.areaInputConfig.val(),
    repaireRevenueConfig: Math.round(re),
    repaireDateConfig: Math.round(repaireDateConfig)
  };
  
  saveDataToFirebase(firebaseData);
});
