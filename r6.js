import { operatorsR6 } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  if (!operatorsR6 || operatorsR6.length === 0) {
    console.error("Данные операторов недоступны!");
    return;
  }

  // ===== DOM ЭЛЕМЕНТЫ =====
  // Кнопки фильтрации по ролям
  const attackerBtn = document.getElementById("attacker");
  const defenderBtn = document.getElementById("defender");

  // Фильтрация по специализации
  const moreFilterBtn = document.getElementById("more-filter");
  const specialtyBtns = document.querySelectorAll(".specialty-btn");
  const clearFilterBtn = document.querySelector(".specialty-btn.clear");

  // ===== СОСТОЯНИЯ =====
  let currentRoleFilter = "all";
  let currentSpecialtyFilter = "all";
  let isFiltersExpanded = false;

  // Родительские элементы кнопок (сами кнопки целиком)
  const attackerBtnParent = attackerBtn ? attackerBtn.parentElement : null;
  const defenderBtnParent = defenderBtn ? defenderBtn.parentElement : null;

  // ===== НАЧАЛЬНОЕ ОТОБРАЖЕНИЕ =====
  displayOperators(operatorsR6);

  // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
  // Настройка фильтров по ролям
  setupRoleFilters();

  // Настройка фильтров по специализации
  setupSpecialtyFilters();

  // Настройка кнопки "Больше/Меньше фильтров"
  setupFilterToggle();

  // ===== ФУНКЦИИ ФИЛЬТРАЦИИ =====
  function applyFilters() {
    let filteredOperators = [...operatorsR6]; // Копия массива операторов для фильтрации

    // Фильтр по роли
    if (currentRoleFilter !== "all") {
      filteredOperators = filteredOperators.filter(
        (operator) =>
          operator.role &&
          operator.role.toLowerCase() === currentRoleFilter.toLowerCase()
      );
    }

    //Фильтр по специализации
    if (currentSpecialtyFilter !== "all") {
      filteredOperators = filteredOperators.filter((operator) => {
        if (!operator.specialty) return false;
        const operatorSpecialties = operator.specialty
          .toLowerCase()
          .split(",")
          .map((s) => s.trim());
        return operatorSpecialties.includes(currentSpecialtyFilter);
      });
    }
    displayOperators(filteredOperators);
  }

  // ===== ФУНКЦИИ ОТОБРАЖЕНИЯ =====
  function displayOperators(operators) {
    const container = document.getElementById("characters-container");
    container.innerHTML = "";

    if (operators.length === 0) {
      container.innerHTML =
        "<p>Нет операторов, соответствующих выбранным фильтрам.</p>";
      return;
    }

    operators.forEach((operator) => {
      const operatorCard = document.createElement("div");
      operatorCard.className = "operator-card";

      if (operator.role) {
        operatorCard.setAttribute("data-role", operator.role.toLowerCase());
      }

      operatorCard.innerHTML = `
        <img src="${operator.portrait}" alt="${operator.name}" class="operator-image">
        <div class="operator-info">
          <h3 class="operator-name">${operator.name}</h3>
        </div>
      `;

      container.appendChild(operatorCard);
    });
  }

  // ===== ФУНКЦИИ НАСТРОЙКИ =====
  function setupRoleFilters() {
    // Обработчик для кнопки "Атакующие"
    if (attackerBtnParent) {
      attackerBtnParent.addEventListener("click", function () {
        toggleRoleFilter(attackerBtnParent, defenderBtnParent, "attacker");
      });
    }

    // Обработчик для кнопки "Защитники"
    if (defenderBtnParent) {
      defenderBtnParent.addEventListener("click", function () {
        toggleRoleFilter(defenderBtnParent, attackerBtnParent, "defender");
      });
    }

    // Обработчик для кнопки сброса фильтров
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener("click", function () {
        // Сбрасываем активные классы с кнопок ролей
        if (attackerBtnParent) attackerBtnParent.classList.remove("active");
        if (defenderBtnParent) defenderBtnParent.classList.remove("active");

        // Сброс обоих фильтров
        currentRoleFilter = "all";
        currentSpecialtyFilter = "all";

        // Сброс активных состояний кнопок специализации
        specialtyBtns.forEach((b) => b.classList.remove("specialty-active"));

        // Применяем фильтры (показываем всех)
        applyFilters();
      });
    }
  }

  // Функция переключения фильтра ролей
  function toggleRoleFilter(activeBtn, inactiveBtn, role) {
    if (activeBtn.classList.contains("active")) {
      // Если кнопка уже активна, деактивируем
      activeBtn.classList.remove("active");
      currentRoleFilter = "all";
    } else {
      // Иначе активируем эту кнопку и деактивируем другую
      activeBtn.classList.add("active");
      if (inactiveBtn) inactiveBtn.classList.remove("active");
      currentRoleFilter = role;
    }
    applyFilters();
  }

  function setupSpecialtyFilters() {
    //Обработчики для кнопок специализации
    specialtyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const specialty = this.getAttribute("data-specialty");

        // Сброс активного класса со всех кнопок специализации
        specialtyBtns.forEach((b) => b.classList.remove("specialty-active"));

        // Если нажата кнопка "очистить все", сброс фильтра специализации
        if (this.classList.contains("clear")) {
          currentSpecialtyFilter = "all";
          // Временный эффект активации для кнопки очистки
          this.classList.add("specialty-active");
          setTimeout(() => this.classList.remove("specialty-active"), 300);
        } else {
          // Устанавливаем новый фильтр и делаем кнопку активной
          currentSpecialtyFilter = specialty.toLowerCase();
          this.classList.add("specialty-active");
        }
        applyFilters();
      });
    });
  }

  function setupFilterToggle() {
    // Обработчик для кнопки "Больше фильтров"
    if (moreFilterBtn) {
      moreFilterBtn.addEventListener("click", function () {
        if (!isFiltersExpanded) {
          specialtyBtns.forEach(function (btn) {
            btn.style.display = "flex";
            setTimeout(() => {
              btn.classList.add("visible");
            }, 10);
          });
          isFiltersExpanded = true;
          moreFilterBtn.innerText = "Less filters";
        } else {
          specialtyBtns.forEach(function (btn) {
            btn.classList.remove("visible");
            setTimeout(() => {
              btn.style.display = "none";
            }, 300);
          });
          isFiltersExpanded = false;
          moreFilterBtn.innerText = "More filters";
        }
      });
    }
  }
});
