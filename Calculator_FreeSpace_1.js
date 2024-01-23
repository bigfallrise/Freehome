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
        // Коефіцієнт, на який множимо всю суму
        var hallway = uiStorage.hallway.is(":checked") ? 1 : 0.0;

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
            priceareaconfig
            * 500
        ) * areaBuildingConfigMultiplier


        // Розрахунок терміну 
        var repaireDateConfig = (Math.min(6, (defaults.revenue +
            priceareaconfig
            * 0.040)));


        // Записуємо до UI елементу
        uiStorage.repaireRevenueConfig.html("$" + (Math.round(repaireRevenueConfig)));
        uiStorage.repaireDateConfig.html(Math.round((repaireDateConfig)) + "міс");
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
    uiStorage.radioButtonsBuilding.change(function () {
        calculate();
    });
    uiStorage.hallway.change(function () {
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

    calculate(); // Запуск розрахунку при завантаженні сторінки
});
