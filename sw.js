<script>
const API_URL = 'https://script.google.com/macros/s/AKfycbyE8V3TH6SFsFZ1bbL6tgMY6haBoR3K3atMrKnzx0Ii8JApyKssjss5Th_0KY_ifSrN6w/exec';   // e.g. https://script.google.com/macros/s/XXXX/exec
const API_KEY = 'fredricknyirendafrendaelse@248';             // same as backend

async function backend(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ key: API_KEY, action, payload })
  });
  return res.json();
}

// Pull latest snapshots (all tabs) and cache locally
async function syncPull(){
  const r = await backend('syncPull');
  if (r.ok){
    const d = r.data || {};
    localStorage.setItem('state.items', JSON.stringify(d.items || []));
    localStorage.setItem('state.sales', JSON.stringify(d.sales || []));
    localStorage.setItem('state.grn', JSON.stringify(d.grn || []));
    localStorage.setItem('state.suppliers', JSON.stringify(d.suppliers || []));
    localStorage.setItem('state.users', JSON.stringify(d.users || []));
    localStorage.setItem('state.settings', JSON.stringify(d.settings || []));
    // TODO: re-render your UI here
  } else {
    console.error('syncPull failed:', r.error);
  }
}

// Upsert / save many items at once (by sku)
async function saveItems(items){
  const r = await backend('upsertItems', items);
  if (!r.ok) console.error('upsertItems failed:', r.error);
}

// Record a sale (append one row per line item)
async function recordSale(lineItems){
  const r = await backend('recordSale', lineItems);
  if (!r.ok) console.error('recordSale failed:', r.error);
}

// Receive GRN (append)
async function receiveGRN(rows){
  const r = await backend('receiveGRN', rows);
  if (!r.ok) console.error('receiveGRN failed:', r.error);
}

// Suppliers upsert (by name)
async function saveSuppliers(suppliers){
  const r = await backend('upsertSuppliers', suppliers);
  if (!r.ok) console.error('upsertSuppliers failed:', r.error);
}

// Auto-pull on load and every 8s for near-realtime
window.addEventListener('load', syncPull);
setInterval(syncPull, 8000);
</script>
