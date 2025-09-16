# ⚖️ Calculadora de Peso

Esta herramienta permite calcular la diferencia entre el **peso pagado** y el **peso real** de un producto, aplicando las reglas de cobro definidas por **Tiendamia** para cada país y modalidad de envío.

El cálculo considera dos escenarios distintos:

---

## 🔹 1. Cuando el peso real es MAYOR al pagado
En este caso, el cliente debe **abonar la diferencia**, pero se aplican **tarifas especiales de depósito**, más bajas que las tarifas comerciales normales.  
Estas tarifas son negociadas para reducir el impacto en el costo final del cliente.

Ejemplo de tarifas del depósito (USD por kg):  
- Ecuador → 9.44  
- Costa Rica → 7.95  
- Perú → 10.15  
- Argentina (Correo Privado) → 12.80  
- Argentina (Correo Argentino) → 17.56  
- Uruguay Franquicia → 8.32  
- Uruguay Importación → 9.53  
- Uruguay China → 8.32  

---

## 🔹 2. Cuando el peso real es MENOR al pagado
En este caso, el cliente recibe un **saldo a favor** calculado con las **tarifas comerciales normales** (rate + peso mínimo).

Ejemplo de tarifas comerciales (USD por kg y peso mínimo en kg):  
- Perú → 21.99, min 0.310  
- Costa Rica → 10.00, min 0.325  
- Ecuador → 15.99, min 0.325  
- Argentina (Correo Privado) → 24.00, min 0.325  
- Argentina (Correo Argentino) → 24.00, min 0.325  
- Uruguay Franquicia → 21.99, min 0.355  
- Uruguay Importación → 18.49, min 0.355  
- Uruguay China → 21.99, min 0.355  

---

## 🔹 3. Regla de peso mínimo
Cada país tiene definido un **peso mínimo facturable**.  
Si el peso real de un producto es inferior a ese valor, se cobra como si tuviera el **peso mínimo** correspondiente.

Ejemplo:  
- Si un producto en Costa Rica pesa **0.222 kg**, se cobra como **0.325 kg**.

---

## 🛠️ Funcionamiento de la calculadora
1. El usuario selecciona país y modalidad.  
2. Ingresa el **peso pagado** y el **peso real**.  
3. El sistema compara ambos:  
   - Si el peso real es mayor → aplica tarifa de depósito.  
   - Si el peso real es menor → aplica tarifa comercial.  
   - Si son iguales → no hay diferencia.  
4. El resultado muestra:  
   - ⚖️ Diferencia de peso (en kg).  
   - 💰 Monto a pagar o ✅ saldo a favor.  

---

## 🔹 Archivos principales
- `index.html` → Interfaz de usuario y formulario.  
- `style.css` → Estilos y diseño visual.  
- `peso.js` → Lógica del cálculo (tarifas, validaciones y resultados).  

Todos los archivos están comentados en el código para facilitar su explicación en **Visual Studio Code (VSC)**.

---

## 📌 Notas importantes
- El formato monetario siempre se muestra como `X.XX USD`.  
- No se muestran desgloses adicionales, solo el resultado final.  
- El sistema no aplica umbrales: se asume que los pesos ya fueron verificados antes de usar la calculadora.  
