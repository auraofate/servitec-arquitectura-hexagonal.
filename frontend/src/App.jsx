import { useEffect, useMemo, useState } from 'react';

const API = '/api/requests';
const EMPTY_FORM = { customer: '', phone: '', device: '', problem: '' };

export default function App() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  async function loadRequests() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error('No se pudo cargar la información.');
      setRequests(await response.json());
      setError('');
    } catch {
      setError('No hay conexión con el servidor. Comprueba que el proyecto esté iniciado.');
    }
  }

  useEffect(() => { loadRequests(); }, []);

  const totals = useMemo(() => ({
    all: requests.length,
    pending: requests.filter(item => item.status === 'Pendiente').length,
    repair: requests.filter(item => item.status === 'En reparación').length,
    delivered: requests.filter(item => item.status === 'Entregado').length
  }), [requests]);

  function handleChange(event) {
    setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar.');
      setForm(EMPTY_FORM);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeStatus(id, status) {
    const response = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (response.ok) await loadRequests();
  }

  async function removeRequest(id) {
    if (!window.confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
    const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (response.ok) await loadRequests();
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo">S</div>
          <div><h1>ServiTec</h1><p>Centro de servicio técnico</p></div>
        </div>
        <span className="online">● Sistema de gestión</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">PANEL DE CONTROL</p>
          <h2>Solicitudes de reparación</h2>
          <p>Administra los equipos que ingresan al servicio técnico.</p>
        </div>
        <span className="date">GESTIÓN DE SERVICIOS</span>
      </section>

      <section className="stats">
        <article><span>Total solicitudes</span><strong>{totals.all}</strong><small>Registros guardados</small></article>
        <article><span>Pendientes</span><strong>{totals.pending}</strong><small>Esperando atención</small></article>
        <article><span>En reparación</span><strong>{totals.repair}</strong><small>En proceso técnico</small></article>
        <article><span>Entregados</span><strong>{totals.delivered}</strong><small>Trabajo completado</small></article>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="content">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div><p className="eyebrow">NUEVO REGISTRO</p><h3>Registrar reparación</h3></div>
            <span className="plus">+</span>
          </div>
          <label>Nombre del cliente
            <input name="customer" value={form.customer} onChange={handleChange} placeholder="Ej. Juan Pérez" required />
          </label>
          <label>Teléfono
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. 3001234567" required />
          </label>
          <label>Equipo
            <input name="device" value={form.device} onChange={handleChange} placeholder="Ej. iPhone 12" required />
          </label>
          <label>Problema reportado
            <textarea name="problem" value={form.problem} onChange={handleChange} placeholder="Describe la falla del equipo..." rows="3" required />
          </label>
          <button className="primary" type="submit">Guardar solicitud <span>→</span></button>
        </form>

        <section className="panel table-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">CONTROL DE INGRESOS</p><h3>Solicitudes registradas</h3></div>
            <button className="refresh" onClick={loadRequests}>↻ Actualizar</button>
          </div>
          {requests.length === 0 ? (
            <div className="empty"><div>▤</div><strong>Aún no hay solicitudes</strong><p>Registra la primera reparación usando el formulario.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>CLIENTE / EQUIPO</th><th>PROBLEMA</th><th>ESTADO</th><th>ACCIÓN</th></tr></thead>
                <tbody>
                  {requests.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.customer}</strong><small>{item.phone} · {item.device}</small></td>
                      <td>{item.problem}</td>
                      <td>
                        <select className={`status ${item.status === 'Entregado' ? 'done' : item.status === 'En reparación' ? 'working' : ''}`}
                          value={item.status} onChange={event => changeStatus(item.id, event.target.value)}>
                          <option>Pendiente</option><option>En reparación</option><option>Entregado</option>
                        </select>
                      </td>
                      <td><button className="delete" onClick={() => removeRequest(item.id)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
      <footer>ServiTec · React + Node.js + Express · Arquitectura Hexagonal</footer>
    </main>
  );
}