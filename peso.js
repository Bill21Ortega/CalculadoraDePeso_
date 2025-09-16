// Espera a que todo el DOM esté cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', () => {
  /**
   * 📌 Tarifas comerciales por país y modalidad.
   * Estas son las tarifas que se usan para calcular el reembolso
   * (cuando el peso real es MENOR al pagado).
   * 
   * rate = precio por kilo (USD)
   * min  = peso mínimo facturable (kg)
   */
  const tarifas = {
    "peru": { rate: 21.99, min: 0.310 },
    "costa_rica": { rate: 10.00, min: 0.325 },
    "ecuador": { rate: 15.99, min: 0.325 },
    "argentina_privado": { rate: 24.00, min: 0.325 },
    "argentina_arg": { rate: 24.00, min: 0.325 },
    "uruguay_franquicia": { rate: 21.99, min: 0.355 },
    "uruguay_importacion": { rate: 18.49, min: 0.355 }, // antes uruguay_avion
    "uruguay_china": { rate: 21.99, min: 0.355 }        // reemplaza uruguay_barco
  };

  /**
   * 📌 Tarifas especiales del depósito.
   * Estas son las tarifas reducidas que se usan cuando el peso real
   * es MAYOR al pagado → cliente debe abonar diferencia.
   */
  const deposito = {
    "ecuador": 9.44,
    "costa_rica": 7.95,
    "peru": 10.15,
    "argentina_privado": 12.8,
    "argentina_arg": 17.56,
    "uruguay_franquicia": 8.32,
    "uruguay_importacion": 9.53,
    "uruguay_china": 8.32
  };

  // Referencias a elementos del DOM
  const paisEl = document.getElementById('pais');
  const pesoPagEl = document.getElementById('pesoPagado');
  const pesoRealEl = document.getElementById('pesoReal');
  const btnCalcular = document.getElementById('calcular');
  const btnLimpiar = document.getElementById('limpiar');
  const resultadoEl = document.getElementById('resultado');
  const warnEl = document.getElementById('warn');

  /**
   * 📌 Función auxiliar: convierte el texto del input a número válido
   * - Acepta coma o punto como separador decimal.
   * - Permite hasta 4 decimales.
   */
  function parsePesoInput(text) {
    if (text === null || text === undefined) return null;
    const s = String(text).trim().replace(',', '.');
    const regex = /^\d+(\.\d{1,4})?$/;
    return regex.test(s) ? parseFloat(s) : null;
  }

  /**
   * 📌 Redondeo a 2 decimales para montos en dinero.
   */
  function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  /**
   * 📌 UX: mientras el usuario escribe, cambia "," por "." automáticamente
   * para evitar errores de formato.
   */
  [pesoPagEl, pesoRealEl].forEach(inp => {
    inp.addEventListener('input', (e) => {
      const before = e.target.value;
      const after = before.replace(',', '.');
      if (before !== after) e.target.value = after;
    });
  });

  /**
   * 📌 Evento principal: botón "Calcular"
   */
  btnCalcular.addEventListener('click', () => {
    // Limpiar mensajes previos
    resultadoEl.style.display = 'none';
    warnEl.style.display = 'none';
    resultadoEl.innerHTML = '';
    warnEl.innerHTML = '';

    const pais = paisEl.value;

    // Validar país
    if (!pais) {
      warnEl.textContent = '⚠️ Selecciona país y modalidad.';
      warnEl.style.display = 'block';
      return;
    }
    if (!tarifas[pais]) {
      warnEl.textContent = '⚠️ País/Modalidad no soportado.';
      warnEl.style.display = 'block';
      return;
    }

    // Validar pesos ingresados
    const pesoPagado = parsePesoInput(pesoPagEl.value);
    const pesoRealRaw = parsePesoInput(pesoRealEl.value);
    if (pesoPagado === null || pesoRealRaw === null) {
      warnEl.textContent = '⚠️ Ingrese números válidos (máx 4 decimales, use . o ,).';
      warnEl.style.display = 'block';
      return;
    }

    const { rate, min } = tarifas[pais];

    // Aplicar peso mínimo al peso real
    const pesoReal = Math.max(pesoRealRaw, min);

    // Diferencia de kilos
    const diferenciaKg = (pesoReal - pesoPagado).toFixed(4);

    let mensaje = `⚖️ Diferencia de peso: ${diferenciaKg} kg<br/>`;

    // Si el peso real es mayor → cliente debe pagar (usar tarifa del depósito)
    if (pesoReal > pesoPagado) {
      const tarifaDeposito = deposito[pais];
      const monto = round2((pesoReal - pesoPagado) * tarifaDeposito);
      mensaje += `💰 Cliente debe pagar ${monto.toFixed(2)} USD`;
    }
    // Si el peso real es menor → saldo a favor (usar tarifa original)
    else if (pesoReal < pesoPagado) {
      const monto = round2((pesoPagado - pesoReal) * rate);
      mensaje += `✅ Saldo a favor de ${monto.toFixed(2)} USD`;
    }
    // Si son iguales → no hay diferencia
    else {
      mensaje += `👌 No hay diferencia de cobro.`;
    }

    // Mostrar resultado
    resultadoEl.innerHTML = mensaje;
    resultadoEl.style.display = 'block';
  });

  /**
   * 📌 Evento para botón "Limpiar"
   * Restaura todos los campos y mensajes.
   */
  btnLimpiar.addEventListener('click', () => {
    pesoPagEl.value = '';
    pesoRealEl.value = '';
    paisEl.selectedIndex = 0;
    resultadoEl.innerHTML = '';
    resultadoEl.style.display = 'none';
    warnEl.innerHTML = '';
    warnEl.style.display = 'none';
  });
});
