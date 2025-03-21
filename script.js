document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const tableBody = document.querySelector("#data-table tbody");
    const searchInput = document.querySelector("#search");
    const btnToday = document.querySelector("#btnToday");
    const btnTomorrow = document.querySelector("#btnTomorrow");
    const loadingSpinner = document.querySelector("#loading-spinner");
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    // Configuración de API
    const API_KEY = "TU_CLAVE_DE_API_AQUI";
    const SHEET_ID = "1ogbq09mEZw8njgkFLxkdETp-CZjqHFfgKm46sHzApuQ";
    const SHEET_TODAY = "Hoja1";
    const SHEET_TOMORROW = "Hoja2";
    
    let activeSheet = SHEET_TODAY;
    let isMobile = window.innerWidth <= 1024;

    // Menú móvil
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });

    // Cerrar menú al hacer click en un botón (mobile)
    const closeMobileMenu = () => {
        if (isMobile) {
            sidebar.classList.remove("active");
            menuToggle.classList.remove("active");
        }
    };

    // Detectar cambio de tamaño de ventana
    window.addEventListener("resize", () => {
        isMobile = window.innerWidth <= 1024;
        if (!isMobile) sidebar.classList.remove("active");
    });

    // Cargar datos
    const fetchData = async () => {
        loadingSpinner.style.display = "block";
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${activeSheet}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.values) {
                renderTable(data.values);
                addTableAnimations();
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            showErrorNotification("Error al cargar los datos");
        } finally {
            loadingSpinner.style.display = "none";
        }
    };

    // Renderizar tabla con animaciones
    function renderTable(data) {
        tableBody.innerHTML = "";
        
        data.slice(1).forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row[0] || ""}</td>
                <td>${row[1] || ""}</td>
                <td>${row[2] || ""}</td>
                <td>${row[3] || ""}</td>
                <td>${row[4] || ""}</td>
                <td>${row[5] || ""}</td>
                <td>${row[6] || ""}</td>
                <td>${row[7] || ""}</td>
                <td>${row[8] || ""}</td>
                <td>${row[9] || ""}</td>
                <td>${row[10] || ""}</td>
            `;
            tr.style.animationDelay = `${index * 0.05}s`;
            tableBody.appendChild(tr);
        });
    }

    // Animaciones para las filas
    function addTableAnimations() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            row.classList.add("fade-in");
            row.addEventListener("animationend", () => {
                row.style.opacity = 1;
            });
        });
    }

    // Notificación de error estilizada
    function showErrorNotification(message) {
        const notification = document.createElement("div");
        notification.className = "error-notification";
        notification.innerHTML = `
            <span class="notification-icon">⚠️</span>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add("show");
            setTimeout(() => {
                notification.classList.remove("show");
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }, 100);
    }

    // Event Listeners
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    });

    btnToday.addEventListener("click", function () {
        activeSheet = SHEET_TODAY;
        this.classList.add("active");
        btnTomorrow.classList.remove("active");
        closeMobileMenu();
        fetchData();
    });

    btnTomorrow.addEventListener("click", function () {
        activeSheet = SHEET_TOMORROW;
        this.classList.add("active");
        btnToday.classList.remove("active");
        closeMobileMenu();
        fetchData();
    });

    // Inicialización
    fetchData();
    setInterval(fetchData, 30000);

    // Efecto de hover para botones
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-2px)";
        });
        
        button.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
        });
    });
});
