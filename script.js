document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#data-table tbody");
    const searchInput = document.querySelector("#search");
    const btnToday = document.querySelector("#btnToday");
    const btnTomorrow = document.querySelector("#btnTomorrow");

    // 🔹 Reemplaza con tu clave de API y el ID de la hoja de Google Sheets
    const API_KEY = "TU_CLAVE_DE_API_AQUI";
    const SHEET_ID = "1ogbq09mEZw8njgkFLxkdETp-CZjqHFfgKm46sHzApuQ";

    // 🔹 Nombres de las hojas
    const SHEET_TODAY = "Hoja1";   // Operación actual
    const SHEET_TOMORROW = "Hoja2"; // Operación del día siguiente

    let activeSheet = SHEET_TODAY; // Por defecto, cargamos la hoja de hoy

    const fetchData = async () => {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${activeSheet}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.values) {
                renderTable(data.values);
            } else {
                console.error("No se encontraron datos en la hoja.");
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    function renderTable(data) {
        tableBody.innerHTML = "";
        
        data.slice(1).forEach((row) => {
            const rowHTML = `<tr>
                <td>${row[0] || ""}</td> <!-- N.S -->
                <td>${row[1] || ""}</td> <!-- ID -->
                <td>${row[2] || ""}</td> <!-- SERVICIO -->
                <td>${row[3] || ""}</td> <!-- HR -->
                <td>${row[4] || ""}</td> <!-- ORIGEN -->
                <td>${row[5] || ""}</td> <!-- DESCRIPCIÓN -->
                <td>${row[6] || ""}</td> <!-- PAX -->
                <td>${row[7] || ""}</td> <!-- DESTINO -->
                <td>${row[8] || ""}</td> <!-- DRIVER -->
                <td>${row[9] || ""}</td> <!-- UNIDAD -->
                <td>${row[10] || ""}</td> <!-- COMENTARIOS -->
            </tr>`;
            tableBody.innerHTML += rowHTML;
        });
    }

    // 🔍 Búsqueda en tiempo real
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    });

    // 📅 Cambiar entre "Hoy" y "Mañana"
    btnToday.addEventListener("click", function () {
        activeSheet = SHEET_TODAY;
        btnToday.classList.add("active");
        btnTomorrow.classList.remove("active");
        fetchData();
    });

    btnTomorrow.addEventListener("click", function () {
        activeSheet = SHEET_TOMORROW;
        btnTomorrow.classList.add("active");
        btnToday.classList.remove("active");
        fetchData();
    });

    // 🔄 Cargar datos cada 30 segundos
    fetchData();
    setInterval(fetchData, 30000);
});
