document.addEventListener('DOMContentLoaded', () => {
  // Tarifas y mínimos por clave (las claves coinciden con los value del select)
  const tarifas = {
    "peru": { rate: 21.99, min: 0.310 },
    "costa_rica": { rate: 10.00, min: 0.325 },
    "ecuador": { rate: 15.99, min: 0.325 },
    "argentina_privado": { rate: 24.00, min: 0.325 },
    "argentina_arg": { rate: 24.00, min: 0.325 },
    "uruguay_franquicia": { rate: 21.99, min: 0.355 },
    "uruguay_avion": { rate: 18.49, min: 0.355 },
    "uruguay_barco": { rate: 6.00, min: 0.355 }
  };

  const paisEl = document.getElementById('pais');
  const pesoPagEl = document.getElementById('pesoPagado');
  const pesoRealEl = document.getElementById('pesoReal');
  const btnCalcular = document.getElementById('calcular');
  const btnLimpiar = document.getElementById('limpiar');
  const resultadoEl = document.getElementById('resultado');
  const warnEl = document.getElementById('warn');

  // helper: aceptar "," o "." y permitir hasta 4 decimales
  function parsePesoInput(text) {
    if (text === null || text === undefined) return null;
    const s = String(text).trim().replace(',', '.');
    const regex = /^\d+(\.\d{1,4})?$/;
    return regex.test(s) ? parseFloat(s) : null;
  }

  function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  // sustituir comas por puntos en el input mientras escribe (UX)
  [pesoPagEl, pesoRealEl].forEach(inp => {
    inp.addEventListener('input', (e) => {
      const before = e.target.value;
      const after = before.replace(',', '.');
      if (before !== after) e.target.value = after;
    });
  });

  btnCalcular.addEventListener('click', () => {
    // limpiar mensajes previos
    resultadoEl.style.display = 'none';
    warnEl.style.display = 'none';
    resultadoEl.innerHTML = '';
    warnEl.innerHTML = '';

    const pais = paisEl.value;
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

    const pesoPagado = parsePesoInput(pesoPagEl.value);
    const pesoRealRaw = parsePesoInput(pesoRealEl.value);

    if (pesoPagado === null || pesoRealRaw === null) {
      warnEl.textContent = '⚠️ Ingrese números válidos (máx 4 decimales, use . o ,).';
      warnEl.style.display = 'block';
      return;
    }

    const { rate, min } = tarifas[pais];

    // aplicar peso mínimo solo al cálculo del costo real (según tu regla)
    // y también ajustar el peso pagado al mínimo si se cobró menos del mínimo
    const pesoReal = Math.max(pesoRealRaw, min);
    const pesoPagadoAjustado = Math.max(pesoPagado, min);

    // cálculos exactos
    const costoPagadoExacto = pesoPagadoAjustado * rate;
    const costoRealExacto = pesoReal * rate;

    // diferencia de kilos: (pesoReal - pesoPagado) con 4 decimales (muéstralo como la diferencia real)
    const diferenciaKg = (pesoReal - pesoPagado).toFixed(4);

    // diferencia dinero: calcular exacto y redondear a 2 decimales (redondeo normal)
    const diferenciaDineroExacta = costoRealExacto - costoPagadoExacto;
    const diferenciaDinero = round2(diferenciaDineroExacta);

    // mensaje
    let mensaje = `⚖️ Diferencia de peso: ${diferenciaKg} kg<br/>`;
    if (diferenciaDinero > 0) {
      mensaje += `💰 Cliente debe pagar ${diferenciaDinero.toFixed(2)} USD`;
    } else if (diferenciaDinero < 0) {
      mensaje += `✅ Saldo a favor de ${Math.abs(diferenciaDinero).toFixed(2)} USD`;
    } else {
      mensaje += `👌 No hay diferencia de cobro.`;
    }

    resultadoEl.innerHTML = mensaje;
    resultadoEl.style.display = 'block';
  });

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
