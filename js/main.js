//Categoria
// Esperamos al DOM cargado
document.addEventListener('DOMContentLoaded', () => {
  verificarAccesoModulo('categorias');
  initDB().then(() => {
    iniciarModuloCategorias();
  });
});

function iniciarModuloCategorias() {
  // Variables
  const categoriaIdInput = document.getElementById('categoriaId');
  const categoriaNombreInput = document.getElementById('categoriaNombre');
  const categoriaDescripcionInput = document.getElementById('categoriaDescripcion');

  const categoryForm = document.getElementById('categoryForm');
  const categoryFormTitle = document.getElementById('categoryFormTitle');
  const openCategoryModalBtn = document.getElementById('openCategoryModal');
  const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
  const cancelCategoryEditButton = document.getElementById('cancelCategoryEditButton');
  const categoryModal = document.getElementById('categoryModal');

  const categoriesTableBody = document.getElementById('categoriesTableBody');
  const categorySearchInput = document.getElementById('categorySearchInput');
  const noCategoriesMessage = document.getElementById('noCategoriesMessage');

  let editingCategoryId = null;
  const CATEGORY_STORE_NAME = 'categories';

  // CRUD con IndexedDB
  async function addCategory(category) {
    const tx = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CATEGORY_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.add(category);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function updateCategory(category) {
    const tx = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CATEGORY_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.put(category);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteCategory(id) {
    const tx = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CATEGORY_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllCategories() {
    const tx = db.transaction([CATEGORY_STORE_NAME], 'readonly');
    const store = tx.objectStore(CATEGORY_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Mostrar categorías
  async function displayCategories(filter = '') {
    categoriesTableBody.innerHTML = '';
    const categories = await getAllCategories();
    let filtered = categories;

    if (filter) {
      const lower = filter.toLowerCase();
      filtered = categories.filter(c =>
        c.id.toLowerCase().includes(lower) ||
        c.nombre.toLowerCase().includes(lower)
      );
    }

    if (filtered.length === 0) {
      noCategoriesMessage?.classList.remove('hidden');
    } else {
      noCategoriesMessage?.classList.add('hidden');
      filtered.forEach(category => {
        const row = categoriesTableBody.insertRow();
        row.innerHTML = `
          <td>${category.id}</td>
          <td>${category.nombre}</td>
          <td>${category.descripcion || ''}</td>
          <td>
            <button class="edit-category-btn text-blue-600 mr-3" data-id="${category.id}">Editar</button>
            <button class="delete-category-btn text-red-600" data-id="${category.id}">Eliminar</button>
          </td>
        `;
      });

      document.querySelectorAll('.edit-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const category = categories.find(c => c.id === id);
          if (category) populateCategoryFormForEdit(category);
        });
      });

      document.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (confirm('¿Eliminar esta categoría?')) {
            await deleteCategory(id);
            displayCategories(categorySearchInput.value);
            displayMessage('Categoría eliminada correctamente', 'success');
          }
        });
      });
    }
  }

  function clearCategoryForm() {
    categoryForm.reset();
    editingCategoryId = null;
    categoryFormTitle.textContent = 'Crear Nueva Categoría';
    cancelCategoryEditButton.classList.add('hidden');
    categoriaIdInput.removeAttribute('readonly');
  }

  function populateCategoryFormForEdit(category) {
    categoryModal.classList.remove('hidden');
    categoriaIdInput.value = category.id;
    categoriaIdInput.setAttribute('readonly', true);
    categoriaNombreInput.value = category.nombre;
    categoriaDescripcionInput.value = category.descripcion || '';
    editingCategoryId = category.id;
    categoryFormTitle.textContent = 'Editar Categoría';
    cancelCategoryEditButton.classList.remove('hidden');
    categoryForm.scrollIntoView({ behavior: 'smooth' });
  }

  // Eventos
  openCategoryModalBtn.addEventListener('click', () => {
    categoryModal.classList.remove('hidden');
    clearCategoryForm();
  });

  closeCategoryModalBtn.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
    clearCategoryForm();
  });

  cancelCategoryEditButton.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
    clearCategoryForm();
  });

  categorySearchInput?.addEventListener('input', () => {
    displayCategories(categorySearchInput.value);
  });

  categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = {
      id: categoriaIdInput.value,
      nombre: categoriaNombreInput.value,
      descripcion: categoriaDescripcionInput.value
    };

    try {
      if (editingCategoryId) {
        await updateCategory(category);
        displayMessage('Categoría actualizada correctamente', 'success');
      } else {
        await addCategory(category);
        displayMessage('Categoría guardada correctamente', 'success');
      }
      clearCategoryForm();
      categoryModal.classList.add('hidden');
      displayCategories();
    } catch (err) {
      displayMessage('Error al guardar categoría: ' + err.message, 'error');
    }
  });

  displayCategories();
}

//Cliente
document.addEventListener('DOMContentLoaded', async () => {
  await initDB(); 
  await verificarAccesoModulo('clientes');

  // Variables
  const clienteCedulaInput = document.getElementById('clienteCedula');
  const clienteNombreInput = document.getElementById('clienteNombre');
  const clienteTelefonoInput = document.getElementById('clienteTelefono');
  const clienteDireccionInput = document.getElementById('clienteDireccion');
  const clienteCorreoInput = document.getElementById('clienteCorreo');
  const clienteEstadoInput = document.getElementById('clienteEstado');
  const clienteFechaRegistroInput = document.getElementById('clienteFechaRegistro');

  const clientForm = document.getElementById('clientForm');
  const clientFormTitle = document.getElementById('clientFormTitle');
  const openClientModalBtn = document.getElementById('openClientModal');
  const closeClientModalBtn = document.getElementById('closeClientModal');
  const cancelClientEditButton = document.getElementById('cancelClientEditButton');
  const clientModal = document.getElementById('clientModal');

  const clientsTableBody = document.getElementById('clientsTableBody');
  const clientSearchInput = document.getElementById('clientSearchInput');
  const noClientsMessage = document.getElementById('noClientsMessage');

  let editingClientCedula = null;
  const CLIENT_STORE_NAME = 'clients';

  // CRUD
  async function addClient(client) {
    const tx = db.transaction([CLIENT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CLIENT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.add(client);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function updateClient(client) {
    const tx = db.transaction([CLIENT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CLIENT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.put(client);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteClient(cedula) {
    const tx = db.transaction([CLIENT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(CLIENT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.delete(cedula);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllClients() {
    const tx = db.transaction([CLIENT_STORE_NAME], 'readonly');
    const store = tx.objectStore(CLIENT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Mostrar clientes en tabla
  async function displayClients(filter = '') {
    clientsTableBody.innerHTML = '';
    const clients = await getAllClients();
    let filtered = clients;

    if (filter) {
      const lower = filter.toLowerCase();
      filtered = clients.filter(c =>
        c.cedula.toLowerCase().includes(lower) ||
        c.nombre.toLowerCase().includes(lower) ||
        (c.correo || '').toLowerCase().includes(lower)
      );
    }

    if (filtered.length === 0) {
      noClientsMessage.classList.remove('hidden');
    } else {
      noClientsMessage.classList.add('hidden');
      filtered.forEach(client => {
        const row = clientsTableBody.insertRow();
        row.innerHTML = `
          <td>${client.cedula}</td>
          <td>${client.nombre}</td>
          <td>${client.correo || ''}</td>
          <td>${client.telefono || ''}</td>
          <td>${client.direccion || ''}</td>
          <td>${client.estado ? 'Activo' : 'Inactivo'}</td>
          <td>${client.fechaRegistro ? new Date(client.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
          <td>
            <button class="edit-client-btn text-blue-600 mr-3" data-cedula="${client.cedula}">Editar</button>
            <button class="delete-client-btn text-red-600" data-cedula="${client.cedula}">Eliminar</button>
          </td>
        `;
      });

      document.querySelectorAll('.edit-client-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const cedula = btn.getAttribute('data-cedula');
          const client = clients.find(c => c.cedula === cedula);
          if (client) populateClientFormForEdit(client);
        });
      });

      document.querySelectorAll('.delete-client-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const cedula = btn.getAttribute('data-cedula');
          if (confirm('¿Eliminar este cliente?')) {
            await deleteClient(cedula);
            displayClients(clientSearchInput.value);
            displayMessage('Cliente eliminado correctamente', 'success');
          }
        });
      });
    }
  }

  function clearClientForm() {
    clientForm.reset();
    editingClientCedula = null;
    clientFormTitle.textContent = 'Crear Nuevo Cliente';
    cancelClientEditButton.classList.add('hidden');
    clienteCedulaInput.removeAttribute('readonly');
  }

  function populateClientFormForEdit(client) {
    clientModal.classList.remove('hidden');
    clienteCedulaInput.value = client.cedula;
    clienteCedulaInput.setAttribute('readonly', true);
    clienteNombreInput.value = client.nombre;
    clienteTelefonoInput.value = client.telefono || '';
    clienteDireccionInput.value = client.direccion || '';
    clienteCorreoInput.value = client.correo || '';
    clienteEstadoInput.value = client.estado ? 'true' : 'false';
    clienteFechaRegistroInput.value = client.fechaRegistro ? client.fechaRegistro.split('T')[0] : '';
    editingClientCedula = client.cedula;
    clientFormTitle.textContent = 'Editar Cliente';
    cancelClientEditButton.classList.remove('hidden');
    clientForm.scrollIntoView({ behavior: 'smooth' });
  }

  // Eventos
  openClientModalBtn.addEventListener('click', () => {
    clientModal.classList.remove('hidden');
    clearClientForm();
  });

  closeClientModalBtn.addEventListener('click', () => {
    clientModal.classList.add('hidden');
    clearClientForm();
  });

  cancelClientEditButton.addEventListener('click', () => {
    clientModal.classList.add('hidden');
    clearClientForm();
  });

  clientSearchInput.addEventListener('input', () => {
    displayClients(clientSearchInput.value);
  });

  clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const client = {
      cedula: clienteCedulaInput.value,
      nombre: clienteNombreInput.value,
      telefono: clienteTelefonoInput.value,
      direccion: clienteDireccionInput.value,
      correo: clienteCorreoInput.value,
      estado: clienteEstadoInput.value === 'true',
      fechaRegistro: clienteFechaRegistroInput.value || new Date().toISOString()
    };

    try {
      if (editingClientCedula) {
        await updateClient(client);
        displayMessage('Cliente actualizado correctamente', 'success');
      } else {
        await addClient(client);
        displayMessage('Cliente guardado correctamente', 'success');
      }
      clearClientForm();
      clientModal.classList.add('hidden');
      displayClients();
    } catch (err) {
      displayMessage('Error al guardar cliente: ' + err.message, 'error');
    }
  });

  // Cargar clientes al inicio
  displayClients();

  // Fallback de displayMessage por si no está definido
  if (typeof displayMessage !== 'function') {
    window.displayMessage = function (message, type = 'info') {
      const div = document.createElement('div');
      div.textContent = message;
      div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      }`;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    };
  }
});

//compras
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('compras');

  // Elementos del DOM
  const compraProveedorSelect = document.getElementById('compraProveedor');
  const compraFechaInput = document.getElementById('compraFecha');
  const compraProductoInput = document.getElementById('compraProducto');
  const compraCantidadInput = document.getElementById('compraCantidad');
  const compraAgregarBtn = document.getElementById('compraAgregarBtn');
  const compraItemsBody = document.getElementById('compraItemsBody');
  const compraTotalSpan = document.getElementById('compraTotal');
  const registrarCompraBtn = document.getElementById('registrarCompraBtn');

  const COMPRA_STORE_NAME = 'compras';
  const COMPRA_DETALLE_STORE_NAME = 'detalleCompras';
  let carritoCompra = [];

  // Obtener productos
  async function getAllProducts() {
    const tx = db.transaction(['products'], 'readonly');
    const store = tx.objectStore('products');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Obtener proveedores
  async function getAllSuppliers() {
    const tx = db.transaction(['suppliers'], 'readonly');
    const store = tx.objectStore('suppliers');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Agregar producto al carrito
  async function agregarProductoCompra() {
    const codigo = compraProductoInput.value;
    const cantidad = parseInt(compraCantidadInput.value);

    if (!codigo || cantidad <= 0) {
      displayMessage('Selecciona un producto y cantidad válida', 'error');
      return;
    }

    const productos = await getAllProducts();
    const producto = productos.find(p => p.codigo === codigo);
    if (!producto) {
      displayMessage('Producto no encontrado', 'error');
      return;
    }

    const itemExistente = carritoCompra.find(item => item.codigo === codigo);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carritoCompra.push({ ...producto, cantidad });
    }

    actualizarTablaCompra();
    compraCantidadInput.value = '';
    compraProductoInput.value = '';
  }

  // Mostrar tabla carrito
  function actualizarTablaCompra() {
    compraItemsBody.innerHTML = '';
    let total = 0;

    carritoCompra.forEach(item => {
      const subtotal = item.cantidad * item.precioCompra;
      total += subtotal;

      const row = compraItemsBody.insertRow();
      row.innerHTML = `
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precioCompra.toFixed(2)}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="remove-item-btn text-red-500" data-codigo="${item.codigo}">Eliminar</button></td>
      `;
    });

    compraTotalSpan.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.getAttribute('data-codigo');
        carritoCompra = carritoCompra.filter(item => item.codigo !== codigo);
        actualizarTablaCompra();
      });
    });
  }

  // Registrar la compra
  async function registrarCompra() {
    if (!carritoCompra.length) {
      displayMessage('No hay productos en la compra', 'error');
      return;
    }

    const proveedorId = compraProveedorSelect.value;
    const fecha = compraFechaInput.value || new Date().toISOString();

    const compraId = crypto.randomUUID();
    const compra = {
      id: compraId,
      proveedorId,
      fecha,
      total: carritoCompra.reduce((sum, item) => sum + (item.precioCompra * item.cantidad), 0)
    };

    const detalle = carritoCompra.map(item => ({
      idCompra: compraId,
      codigoProducto: item.codigo,
      cantidad: item.cantidad,
      precioUnitario: item.precioCompra
    }));

    try {
      const tx = db.transaction([COMPRA_STORE_NAME, COMPRA_DETALLE_STORE_NAME], 'readwrite');
      const compraStore = tx.objectStore(COMPRA_STORE_NAME);
      const detalleStore = tx.objectStore(COMPRA_DETALLE_STORE_NAME);

      compraStore.add(compra);
      detalle.forEach(item => detalleStore.add(item));

      displayMessage('Compra registrada exitosamente', 'success');
      limpiarFormularioCompra();
    } catch (err) {
      displayMessage('Error al registrar compra: ' + err.message, 'error');
    }
  }

  // Llenar selects de productos y proveedores
  async function llenarSelectsCompra() {
    const productos = await getAllProducts();
    const proveedores = await getAllSuppliers();

    compraProductoInput.innerHTML = '';
    productos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.codigo;
      opt.textContent = `${p.nombre} - $${p.precioCompra.toFixed(2)}`;
      compraProductoInput.appendChild(opt);
    });

    compraProveedorSelect.innerHTML = '';
    proveedores.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.cedula;
      opt.textContent = `${p.razonSocial} (${p.cedula})`;
      compraProveedorSelect.appendChild(opt);
    });
  }

  // Limpiar formulario
  function limpiarFormularioCompra() {
    compraFechaInput.value = '';
    compraProductoInput.value = '';
    compraCantidadInput.value = '';
    carritoCompra = [];
    actualizarTablaCompra();
    llenarSelectsCompra();
  }

  // Listeners
  compraAgregarBtn.addEventListener('click', agregarProductoCompra);
  registrarCompraBtn.addEventListener('click', registrarCompra);

  // Inicializar interfaz
  await llenarSelectsCompra();
  actualizarTablaCompra();
});

//negocio

const businessForm = document.getElementById('businessForm');
const businessNameInput = document.getElementById('businessName');
const businessRUCInput = document.getElementById('businessRUC');
const businessDireccionInput = document.getElementById('businessDireccion');
const businessTelefonoInput = document.getElementById('businessTelefono');
const businessCorreoInput = document.getElementById('businessCorreo');
const businessCiudadInput = document.getElementById('businessCiudad');
const businessMensajePieInput = document.getElementById('businessMensajePie');
const businessLogoPreview = document.getElementById('businessLogoPreview');

const defaultBusinessData = {
  nombre: 'Bazar Angelito',
  ruc: '1205312547001',
  direccion: 'Mucho Lote 1 Etapa 7 Mz. 2472',
  telefono: '0959792068',
  correo: 'bazarangelito22@gmail.com',
  ciudad: 'Guayaquil',
  mensajePie: '¡Gracias por su compra! Vuelva pronto.',
  logo: 'img/logo.png'
};

async function getBusiness() {
  const transaction = db.transaction(['business'], 'readonly');
  const store = transaction.objectStore('business');
  return new Promise((resolve, reject) => {
    const request = store.get(1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function preloadBusinessForm() {
  let business = await getBusiness();
  if (!business) business = defaultBusinessData;

  businessNameInput.value = business.nombre || '';
  businessRUCInput.value = business.ruc || '';
  businessDireccionInput.value = business.direccion || '';
  businessTelefonoInput.value = business.telefono || '';
  businessCorreoInput.value = business.correo || '';
  businessCiudadInput.value = business.ciudad || '';
  businessMensajePieInput.value = business.mensajePie || '';
  businessLogoPreview.src = business.logo || defaultBusinessData.logo;
}

// El bloque DOMContentLoaded se queda igual
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('configuracion');
  await preloadBusinessForm();

  (() => {
    const businessLogoInput = document.getElementById('businessLogo');

    businessForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      let logoBase64 = null;
      if (businessLogoInput.files.length > 0) {
        const file = businessLogoInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert('Solo se permiten imágenes JPG o PNG.');
          return;
        }
        logoBase64 = await toBase64(file);
      }

      const business = {
        id: 1,
        nombre: businessNameInput.value,
        ruc: businessRUCInput.value,
        direccion: businessDireccionInput.value,
        telefono: businessTelefonoInput.value,
        correo: businessCorreoInput.value,
        ciudad: businessCiudadInput.value,
        mensajePie: businessMensajePieInput.value,
        logo: logoBase64
      };

      await saveBusiness(business);
      alert('Datos del negocio guardados correctamente.');
    });

    businessLogoInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          businessLogoPreview.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }

    async function saveBusiness(business) {
      const transaction = db.transaction(['business'], 'readwrite');
      const store = transaction.objectStore('business');
      return new Promise((resolve, reject) => {
        const request = store.put(business);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
      });
    }
  })();
});


//permisos
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('roles');

  const permisosRolSelect = document.getElementById('permisosRol');
  const permisosFormulario = document.getElementById('permisosFormulario');
  const guardarPermisosBtn = document.getElementById('guardarPermisosBtn');

  const PERMISOS_STORE_NAME = 'permisos';
  const ROLES_STORE_NAME = 'roles';

  const PERMISOS_DISPONIBLES = [
    'usuarios', 'clientes', 'proveedores',
    'productos', 'categorias', 'ventas',
    'compras', 'reportes', 'configuracion'
  ];

  // Obtener todos los roles
  async function getAllRoles() {
    const tx = db.transaction([ROLES_STORE_NAME], 'readonly');
    const store = tx.objectStore(ROLES_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Obtener permisos por rol
  async function getPermisosPorRol(rolId) {
    const tx = db.transaction([PERMISOS_STORE_NAME], 'readonly');
    const store = tx.objectStore(PERMISOS_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.get(Number(rolId));
      request.onsuccess = () => resolve(request.result?.permisos || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Guardar permisos por rol
  async function guardarPermisos(rolId, permisos) {
    const tx = db.transaction([PERMISOS_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PERMISOS_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.put({ rolId: Number(rolId), permisos });
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Mostrar todos los roles en el select
  async function llenarSelectRoles() {
    const roles = await getAllRoles();
    permisosRolSelect.innerHTML = '<option value="">Seleccione un rol</option>';
    roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.nombre;
      permisosRolSelect.appendChild(opt);
    });
  }

  // Mostrar checkboxes de permisos
  function mostrarOpcionesPermisos(permisosAsignados = []) {
    permisosFormulario.innerHTML = '';
    PERMISOS_DISPONIBLES.forEach(p => {
      const label = document.createElement('label');
      label.className = 'block my-1';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'permisos';
      checkbox.value = p;
      checkbox.classList.add('mr-2');

      if (permisosAsignados.includes(p)) {
        checkbox.checked = true;
      }

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${p.charAt(0).toUpperCase() + p.slice(1)}`));
      permisosFormulario.appendChild(label);
    });

    guardarPermisosBtn.disabled = false;
  }

  // Cargar permisos cuando se selecciona un rol
  permisosRolSelect.addEventListener('change', async () => {
    const rolId = permisosRolSelect.value;
    if (!rolId) {
      permisosFormulario.innerHTML = '';
      guardarPermisosBtn.disabled = true;
      return;
    }

    const permisos = await getPermisosPorRol(rolId);
    mostrarOpcionesPermisos(permisos);
  });

  // Guardar permisos
  guardarPermisosBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const rolId = permisosRolSelect.value;
    const permisosSeleccionados = Array.from(document.querySelectorAll('input[name="permisos"]:checked'))
      .map(cb => cb.value);

    try {
      await guardarPermisos(rolId, permisosSeleccionados);
      displayMessage('Permisos guardados correctamente', 'success');
    } catch (err) {
      displayMessage('Error al guardar permisos: ' + err.message, 'error');
    }
  });

  // Inicializar select de roles
  llenarSelectRoles();

  // Fallback para displayMessage si no existe
  if (typeof displayMessage !== 'function') {
    window.displayMessage = function (message, type = 'info') {
      const div = document.createElement('div');
      div.textContent = message;
      div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      }`;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    };
  }
});

//productos
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('productos');

  // Variables
  const productoCodigoInput = document.getElementById('productoCodigo');
  const productoNombreInput = document.getElementById('productoNombre');
  const productoDescripcionInput = document.getElementById('productoDescripcion');
  const productoCategoriaInput = document.getElementById('productoCategoria');
  const productoStockInput = document.getElementById('productoStock');
  const productoPrecioCompraInput = document.getElementById('productoPrecioCompra');
  const productoPrecioVentaInput = document.getElementById('productoPrecioVenta');
  const productoEstadoInput = document.getElementById('productoEstado');
  const productoFechaRegistroInput = document.getElementById('productoFechaRegistro');

  const productForm = document.getElementById('productForm');
  const productFormTitle = document.getElementById('productFormTitle');
  const saveProductButton = document.getElementById('saveProductButton');
  const cancelProductEditButton = document.getElementById('cancelProductEditButton');
  const openProductModalBtn = document.getElementById('openProductModal');
  const closeProductModalBtn = document.getElementById('closeProductModal');
  const productModal = document.getElementById('productModal');

  const productsTableBody = document.getElementById('productsTableBody');
  const productSearchInput = document.getElementById('productSearchInput');
  const noProductsMessage = document.getElementById('noProductsMessage');

  let editingProductCodigo = null;
  const PRODUCT_STORE_NAME = 'products';

  async function addProduct(product) {
    const tx = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PRODUCT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.add(product);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function updateProduct(product) {
    const tx = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PRODUCT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteProduct(codigo) {
    const tx = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PRODUCT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.delete(codigo);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllProducts() {
    const tx = db.transaction([PRODUCT_STORE_NAME], 'readonly');
    const store = tx.objectStore(PRODUCT_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function displayProducts(filter = '') {
    const products = await getAllProducts();
    productsTableBody.innerHTML = '';

    let filtered = products;
    if (filter) {
      const lower = filter.toLowerCase();
      filtered = products.filter(p =>
        p.codigo.toLowerCase().includes(lower) ||
        p.nombre.toLowerCase().includes(lower) ||
        (p.descripcion || '').toLowerCase().includes(lower)
      );
    }

    if (filtered.length === 0) {
      noProductsMessage.classList.remove('hidden');
    } else {
      noProductsMessage.classList.add('hidden');
      filtered.forEach(product => {
        const row = productsTableBody.insertRow();
        row.innerHTML = `
          <td>${product.codigo}</td>
          <td>${product.nombre}</td>
          <td>${product.descripcion || ''}</td>
          <td>${product.idCategoria || ''}</td>
          <td>${product.stock}</td>
          <td>${product.precioCompra.toFixed(2)}</td>
          <td>${product.precioVenta.toFixed(2)}</td>
          <td>${product.estado ? 'Activo' : 'Inactivo'}</td>
          <td>${product.fechaRegistro ? new Date(product.fechaRegistro).toLocaleDateString() : ''}</td>
          <td>
            <button class="edit-product-btn" data-codigo="${product.codigo}">Editar</button>
            <button class="delete-product-btn" data-codigo="${product.codigo}">Eliminar</button>
          </td>
        `;
      });

      document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const codigo = btn.getAttribute('data-codigo');
          const product = products.find(p => p.codigo === codigo);
          if (product) populateProductFormForEdit(product);
        });
      });

      document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const codigo = btn.getAttribute('data-codigo');
          if (confirm('¿Eliminar este producto?')) {
            await deleteProduct(codigo);
            await displayProducts(productSearchInput.value);
            displayMessage('Producto eliminado', 'success');
          }
        });
      });
    }
  }

  function clearProductForm() {
    productForm.reset();
    productoCodigoInput.removeAttribute('readonly');
    editingProductCodigo = null;
    productFormTitle.textContent = 'Crear Nuevo Producto';
    cancelProductEditButton.classList.add('hidden');
  }

  function populateProductFormForEdit(product) {
    productModal.classList.remove('hidden');
    productoCodigoInput.value = product.codigo;
    productoCodigoInput.setAttribute('readonly', true);
    productoNombreInput.value = product.nombre;
    productoDescripcionInput.value = product.descripcion;
    productoCategoriaInput.value = product.idCategoria;
    productoStockInput.value = product.stock;
    productoPrecioCompraInput.value = product.precioCompra;
    productoPrecioVentaInput.value = product.precioVenta;
    productoEstadoInput.value = product.estado ? 'true' : 'false';
    productoFechaRegistroInput.value = product.fechaRegistro ? product.fechaRegistro.split('T')[0] : '';
    editingProductCodigo = product.codigo;
    productFormTitle.textContent = 'Editar Producto';
    cancelProductEditButton.classList.remove('hidden');
  }

  openProductModalBtn?.addEventListener('click', () => {
    productModal.classList.remove('hidden');
    clearProductForm();
  });

  closeProductModalBtn?.addEventListener('click', () => {
    productModal.classList.add('hidden');
    clearProductForm();
  });

  cancelProductEditButton?.addEventListener('click', () => {
    productModal.classList.add('hidden');
    clearProductForm();
  });

  productSearchInput?.addEventListener('input', () => {
    displayProducts(productSearchInput.value);
  });

  productForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const product = {
      codigo: productoCodigoInput.value,
      nombre: productoNombreInput.value,
      descripcion: productoDescripcionInput.value,
      idCategoria: productoCategoriaInput.value,
      stock: parseInt(productoStockInput.value),
      precioCompra: parseFloat(productoPrecioCompraInput.value),
      precioVenta: parseFloat(productoPrecioVentaInput.value),
      estado: productoEstadoInput.value === 'true',
      fechaRegistro: productoFechaRegistroInput.value || new Date().toISOString()
    };

    try {
      if (editingProductCodigo) {
        await updateProduct(product);
        displayMessage('Producto actualizado correctamente', 'success');
      } else {
        await addProduct(product);
        displayMessage('Producto guardado correctamente', 'success');
      }
      productModal.classList.add('hidden');
      clearProductForm();
      displayProducts();
    } catch (err) {
      displayMessage('Error al guardar producto: ' + err.message, 'error');
    }
  });

  await displayProducts();
});


//proveedores
document.addEventListener('DOMContentLoaded', async () => {
  await window.initDB();
  await window.verificarAccesoModulo('proveedores');

  (() => {
    // Variables
    const proveedorCedulaInput = document.getElementById('proveedorCedula');
    const proveedorRazonSocialInput = document.getElementById('proveedorRazonSocial');
    const proveedorCorreoInput = document.getElementById('proveedorCorreo');
    const proveedorTelefonoInput = document.getElementById('proveedorTelefono');
    const proveedorFechaRegistroInput = document.getElementById('proveedorFechaRegistro');
    const proveedorEstadoInput = document.getElementById('proveedorEstado');

    const supplierForm = document.getElementById('supplierForm');
    const supplierFormTitle = document.getElementById('supplierFormTitle');
    const openSupplierModalBtn = document.getElementById('openSupplierModal');
    const closeSupplierModalBtn = document.getElementById('closeSupplierModal');
    const cancelSupplierEditButton = document.getElementById('cancelSupplierEditButton');
    const supplierModal = document.getElementById('supplierModal');

    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const supplierSearchInput = document.getElementById('supplierSearchInput');
    const noSuppliersMessage = document.getElementById('noSuppliersMessage');

    let editingSupplierCedula = null;
    const SUPPLIER_STORE_NAME = 'suppliers';

    // CRUD
    async function addSupplier(supplier) {
      const tx = window.db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
      const store = tx.objectStore(SUPPLIER_STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.add(supplier);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
      });
    }

    async function updateSupplier(supplier) {
      const tx = window.db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
      const store = tx.objectStore(SUPPLIER_STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.put(supplier);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
      });
    }

    async function deleteSupplier(cedula) {
      const tx = window.db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
      const store = tx.objectStore(SUPPLIER_STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.delete(cedula);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
      });
    }

    async function getAllSuppliers() {
      const tx = window.db.transaction([SUPPLIER_STORE_NAME], 'readonly');
      const store = tx.objectStore(SUPPLIER_STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
      });
    }

    // Mostrar proveedores en la tabla
    async function displaySuppliers(filter = '') {
      if (!suppliersTableBody) return;
      suppliersTableBody.innerHTML = '';
      const suppliers = await getAllSuppliers();
      let filtered = suppliers;

      if (filter) {
        const lower = filter.toLowerCase();
        filtered = suppliers.filter(s =>
          s.cedula.toLowerCase().includes(lower) ||
          s.razonSocial.toLowerCase().includes(lower) ||
          (s.correo || '').toLowerCase().includes(lower)
        );
      }

      if (filtered.length === 0) {
        noSuppliersMessage?.classList.remove('hidden');
      } else {
        noSuppliersMessage?.classList.add('hidden');
        filtered.forEach(supplier => {
          const row = suppliersTableBody.insertRow();
          row.innerHTML = `
            <td>${supplier.cedula}</td>
            <td>${supplier.razonSocial}</td>
            <td>${supplier.correo || ''}</td>
            <td>${supplier.telefono || ''}</td>
            <td>${supplier.estado ? 'Activo' : 'Inactivo'}</td>
            <td>${supplier.fechaRegistro ? new Date(supplier.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
            <td>
              <button class="edit-supplier-btn text-blue-600 mr-3" data-cedula="${supplier.cedula}">Editar</button>
              <button class="delete-supplier-btn text-red-600" data-cedula="${supplier.cedula}">Eliminar</button>
            </td>
          `;
        });

        document.querySelectorAll('.edit-supplier-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const cedula = btn.getAttribute('data-cedula');
            const supplier = suppliers.find(s => s.cedula === cedula);
            if (supplier) populateSupplierFormForEdit(supplier);
          });
        });

        document.querySelectorAll('.delete-supplier-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const cedula = btn.getAttribute('data-cedula');
            if (confirm('¿Eliminar este proveedor?')) {
              await deleteSupplier(cedula);
              displaySuppliers(supplierSearchInput.value);
              window.displayMessage('Proveedor eliminado correctamente', 'success');
            }
          });
        });
      }
    }

    function clearSupplierForm() {
      supplierForm.reset();
      editingSupplierCedula = null;
      supplierFormTitle.textContent = 'Crear Nuevo Proveedor';
      cancelSupplierEditButton.classList.add('hidden');
      proveedorCedulaInput.removeAttribute('readonly');
    }

    function populateSupplierFormForEdit(supplier) {
      supplierModal.classList.remove('hidden');
      proveedorCedulaInput.value = supplier.cedula;
      proveedorCedulaInput.setAttribute('readonly', true);
      proveedorRazonSocialInput.value = supplier.razonSocial;
      proveedorCorreoInput.value = supplier.correo || '';
      proveedorTelefonoInput.value = supplier.telefono || '';
      proveedorEstadoInput.value = supplier.estado ? 'true' : 'false';
      proveedorFechaRegistroInput.value = supplier.fechaRegistro ? supplier.fechaRegistro.split('T')[0] : '';
      editingSupplierCedula = supplier.cedula;
      supplierFormTitle.textContent = 'Editar Proveedor';
      cancelSupplierEditButton.classList.remove('hidden');
      supplierForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Eventos
    openSupplierModalBtn.addEventListener('click', () => {
      supplierModal.classList.remove('hidden');
      clearSupplierForm();
    });

    closeSupplierModalBtn.addEventListener('click', () => {
      supplierModal.classList.add('hidden');
      clearSupplierForm();
    });

    cancelSupplierEditButton.addEventListener('click', () => {
      supplierModal.classList.add('hidden');
      clearSupplierForm();
    });

    supplierSearchInput?.addEventListener('input', () => {
      displaySuppliers(supplierSearchInput.value);
    });

    supplierForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const supplier = {
        cedula: proveedorCedulaInput.value,
        razonSocial: proveedorRazonSocialInput.value,
        correo: proveedorCorreoInput.value,
        telefono: proveedorTelefonoInput.value,
        fechaRegistro: proveedorFechaRegistroInput.value || new Date().toISOString(),
        estado: proveedorEstadoInput.value === 'true'
      };

      try {
        if (editingSupplierCedula) {
          await updateSupplier(supplier);
          window.displayMessage('Proveedor actualizado correctamente', 'success');
        } else {
          await addSupplier(supplier);
          window.displayMessage('Proveedor guardado correctamente', 'success');
        }
        clearSupplierForm();
        supplierModal.classList.add('hidden');
        displaySuppliers();
      } catch (err) {
        window.displayMessage('Error al guardar proveedor: ' + err.message, 'error');
      }
    });

    displaySuppliers();

    // Mensaje global fallback (si no está definida aún)
    if (typeof window.displayMessage !== 'function') {
      window.displayMessage = function (message, type = 'info') {
        const div = document.createElement('div');
        div.textContent = message;
        div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
          type === 'success' ? 'bg-green-500' :
          type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
      };
    }
  })();
});

//reportes
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('reportes');

  (() => {
    // Elementos del DOM
    const reporteTipoSelect = document.getElementById('reporteTipo');
    const reporteFechaInicioInput = document.getElementById('reporteFechaInicio');
    const reporteFechaFinInput = document.getElementById('reporteFechaFin');
    const generarReporteBtn = document.getElementById('generarReporteBtn');
    const reporteTablaBody = document.getElementById('reporteTablaBody');
    const reporteTitulo = document.getElementById('reporteTitulo');

    // Obtener todas las ventas
    async function getVentas() {
      const tx = db.transaction(['ventas'], 'readonly');
      const store = tx.objectStore('ventas');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      });
    }

    // Obtener todos los detalles de ventas
    async function getDetalleVentas() {
      const tx = db.transaction(['detalleVentas'], 'readonly');
      const store = tx.objectStore('detalleVentas');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      });
    }

    // Obtener todas las compras
    async function getCompras() {
      const tx = db.transaction(['compras'], 'readonly');
      const store = tx.objectStore('compras');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      });
    }

    // Obtener productos
    async function getProductos() {
      const tx = db.transaction(['products'], 'readonly');
      const store = tx.objectStore('products');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      });
    }

    // Filtrar por fecha
    function filtrarPorFecha(lista, fechaInicio, fechaFin) {
      return lista.filter(item => {
        const fecha = new Date(item.fecha);
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
    }

    // Generar reporte
    async function generarReporte() {
      const tipo = reporteTipoSelect.value;
      const fechaInicio = new Date(reporteFechaInicioInput.value);
      const fechaFin = new Date(reporteFechaFinInput.value);

      reporteTablaBody.innerHTML = '';

      if (fechaInicio > fechaFin) {
        displayMessage('La fecha de inicio no puede ser mayor que la fecha final', 'error');
        return;
      }

      if (tipo === 'ventas') {
        const ventas = await getVentas();
        const filtradas = filtrarPorFecha(ventas, fechaInicio, fechaFin);
        reporteTitulo.textContent = `Ventas desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFin.toLocaleDateString()}`;

        filtradas.forEach(venta => {
          const row = reporteTablaBody.insertRow();
          row.innerHTML = `
            <td>${venta.id}</td>
            <td>${venta.clienteId}</td>
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>$${venta.total.toFixed(2)}</td>
          `;
        });

      } else if (tipo === 'compras') {
        const compras = await getCompras();
        const filtradas = filtrarPorFecha(compras, fechaInicio, fechaFin);
        reporteTitulo.textContent = `Compras desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFin.toLocaleDateString()}`;

        filtradas.forEach(compra => {
          const row = reporteTablaBody.insertRow();
          row.innerHTML = `
            <td>${compra.id}</td>
            <td>${compra.proveedorId}</td>
            <td>${new Date(compra.fecha).toLocaleDateString()}</td>
            <td>$${compra.total.toFixed(2)}</td>
          `;
        });

      } else if (tipo === 'productos-mas-vendidos') {
        const detalles = await getDetalleVentas();
        const ventas = await getVentas();
        const productos = await getProductos();

        const ventasFiltradas = filtrarPorFecha(ventas, fechaInicio, fechaFin);
        const idsFiltrados = ventasFiltradas.map(v => v.id);
        const detallesFiltrados = detalles.filter(d => idsFiltrados.includes(d.idVenta));

        const contador = {};
        detallesFiltrados.forEach(d => {
          if (!contador[d.codigoProducto]) contador[d.codigoProducto] = 0;
          contador[d.codigoProducto] += d.cantidad;
        });

        const resultado = Object.entries(contador)
          .map(([codigo, cantidad]) => {
            const producto = productos.find(p => p.codigo === codigo);
            return {
              codigo,
              nombre: producto?.nombre || 'Producto desconocido',
              cantidad
            };
          })
          .sort((a, b) => b.cantidad - a.cantidad);

        reporteTitulo.textContent = `Productos más vendidos desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFin.toLocaleDateString()}`;

        resultado.forEach(p => {
          const row = reporteTablaBody.insertRow();
          row.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
          `;
        });
      }
    }

    // Evento de generación de reporte
    generarReporteBtn.addEventListener('click', generarReporte);

    // displayMessage fallback
    if (typeof displayMessage !== 'function') {
      window.displayMessage = function (message, type = 'info') {
        const div = document.createElement('div');
        div.textContent = message;
        div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
          type === 'success' ? 'bg-green-500' :
          type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
      };
    }
  })();
});

//usuarios
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  verificarAccesoModulo('usuarios');


  // Variables
  const cedulaInput = document.getElementById('cedula');
  const nombreCompletoInput = document.getElementById('nombreCompleto');
  const correoElectronicoInput = document.getElementById('correoElectronico');
  const telefonoInput = document.getElementById('telefono');
  const rolSelect = document.getElementById('rol');
  const userEstadoInput = document.getElementById('usuarioEstado');
  const userFechaRegistroInput = document.getElementById('usuarioFechaRegistro');

  const saveUserButton = document.getElementById('saveUserButton');
  const userFormTitle = document.getElementById('userFormTitle');
  const openUserModalBtn = document.getElementById('openUserModal');
  const userModal = document.getElementById('userModal');
  const closeUserModalBtn = document.getElementById('closeUserModal');
  const cancelEditButton = document.getElementById('cancelEditButton');
  const userForm = document.getElementById('userForm');
  const usersTableBody = document.getElementById('usersTableBody');
  const userSearchInput = document.getElementById('userSearchInput');
  const noUsersMessage = document.getElementById('noUsersMessage');

  let editingCedula = null;

  const USER_STORE_NAME = 'users';

  // Funciones principales
  async function addUser(user) {
    const tx = db.transaction([USER_STORE_NAME], 'readwrite');
    const store = tx.objectStore(USER_STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.add(user);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function updateUser(user) {
    const tx = db.transaction([USER_STORE_NAME], 'readwrite');
    const store = tx.objectStore(USER_STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.put(user);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteUser(cedula) {
    const tx = db.transaction([USER_STORE_NAME], 'readwrite');
    const store = tx.objectStore(USER_STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(cedula);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllUsers() {
    const tx = db.transaction([USER_STORE_NAME], 'readonly');
    const store = tx.objectStore(USER_STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function displayUsers(filter = '') {
    usersTableBody.innerHTML = '';
    const users = await getAllUsers();
    const filtered = filter
      ? users.filter(u =>
          u.cedula.toLowerCase().includes(filter.toLowerCase()) ||
          u.nombreCompleto.toLowerCase().includes(filter.toLowerCase()) ||
          u.correoElectronico.toLowerCase().includes(filter.toLowerCase())
        )
      : users;

    if (filtered.length === 0) {
      noUsersMessage.classList.remove('hidden');
    } else {
      noUsersMessage.classList.add('hidden');
      filtered.forEach(user => {
        const row = usersTableBody.insertRow();
        row.innerHTML = `
          <td class="px-6 py-4">${user.cedula}</td>
          <td class="px-6 py-4">${user.nombreCompleto}</td>
          <td class="px-6 py-4">${user.correoElectronico}</td>
          <td class="px-6 py-4">${user.estado ? 'Activo' : 'Inactivo'}</td>
          <td class="px-6 py-4">${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
          <td class="px-6 py-4 text-right">
            <button class="edit-user-btn text-blue-600 mr-3" data-cedula="${user.cedula}">Editar</button>
            <button class="delete-user-btn text-red-600" data-cedula="${user.cedula}">Eliminar</button>
          </td>`;
      });
    }

    document.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cedula = btn.dataset.cedula;
        const user = users.find(u => u.cedula === cedula);
        if (user) populateUserFormForEdit(user);
      });
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cedula = btn.dataset.cedula;
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
          await deleteUser(cedula);
          displayUsers(userSearchInput.value);
          displayMessage('Usuario eliminado correctamente', 'success');
        }
      });
    });
  }

  function clearUserForm() {
    userForm.reset();
    editingCedula = null;
    userFormTitle.textContent = 'Crear Nuevo Usuario';
    saveUserButton.textContent = 'Guardar Usuario';
    cancelEditButton.classList.add('hidden');
    cedulaInput.removeAttribute('readonly');
  }

  function populateUserFormForEdit(user) {
    userModal.classList.remove('hidden');
    cedulaInput.value = user.cedula;
    cedulaInput.setAttribute('readonly', true);
    nombreCompletoInput.value = user.nombreCompleto;
    correoElectronicoInput.value = user.correoElectronico;
    telefonoInput.value = user.telefono;
    rolSelect.value = user.rol;
    userEstadoInput.value = user.estado ? 'true' : 'false';
    userFechaRegistroInput.value = user.fechaRegistro?.split('T')[0] || '';
    editingCedula = user.cedula;
    userFormTitle.textContent = 'Editar Usuario';
    saveUserButton.textContent = 'Actualizar Usuario';
    cancelEditButton.classList.remove('hidden');
    userForm.scrollIntoView({ behavior: 'smooth' });
  }

  if (openUserModalBtn) {
    openUserModalBtn.addEventListener('click', () => {
      userModal.classList.remove('hidden');
      clearUserForm();
    });
  }

  if (closeUserModalBtn) {
    closeUserModalBtn.addEventListener('click', () => {
      userModal.classList.add('hidden');
      userForm.reset();
      if (cancelEditButton) cancelEditButton.classList.add('hidden');
    });
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      userModal.classList.add('hidden');
      userForm.reset();
      cancelEditButton.classList.add('hidden');
    });
  }

  if (userSearchInput) {
    userSearchInput.addEventListener('input', () => {
      displayUsers(userSearchInput.value);
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = {
        cedula: cedulaInput.value,
        nombreCompleto: nombreCompletoInput.value,
        correoElectronico: correoElectronicoInput.value,
        telefono: telefonoInput.value,
        rol: rolSelect.value,
        estado: userEstadoInput.value === 'true',
        fechaRegistro: userFechaRegistroInput.value || new Date().toISOString()
      };

      try {
        if (editingCedula) {
          await updateUser(user);
          displayMessage('Usuario actualizado correctamente', 'success');
        } else {
          await addUser(user);
          displayMessage('Usuario creado correctamente', 'success');
        }
        clearUserForm();
        userModal.classList.add('hidden');
        displayUsers();
      } catch (error) {
        displayMessage('Error: ' + error.message, 'error');
      }
    });
  }

  // Llama a displayUsers al final, cuando todo está definido
  displayUsers();
});


//ventas
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('ventas');

  const ventaClienteSelect = document.getElementById('clientDoc');
  const ventaFechaInput = document.getElementById('ventaFecha');
  const ventaProductoInput = document.getElementById('saleProductCode');
  const ventaCantidadInput = document.getElementById('ventaCantidad');
  const ventaAgregarBtn = document.getElementById('addSaleProductBtn');
  const ventaItemsBody = document.getElementById('salesTableBody');
  const ventaTotalSpan = document.getElementById('totalSaleAmount');
  const registrarVentaBtn = document.getElementById('saveSaleBtn');

  const VENTA_STORE_NAME = 'ventas';
  const VENTA_DETALLE_STORE_NAME = 'detalleVentas';

  let carrito = [];

  async function getAllProducts() {
    const tx = db.transaction(['products'], 'readonly');
    const store = tx.objectStore('products');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllClients() {
    const tx = db.transaction(['clients'], 'readonly');
    const store = tx.objectStore('clients');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function agregarProductoAlCarrito() {
    const codigo = ventaProductoInput.value;
    const cantidad = parseInt(ventaCantidadInput.value);

    if (!codigo || cantidad <= 0) {
      displayMessage('Selecciona un producto y una cantidad válida', 'error');
      return;
    }

    const productos = await getAllProducts();
    const producto = productos.find(p => p.codigo === codigo);

    if (!producto) {
      displayMessage('Producto no encontrado', 'error');
      return;
    }

    const itemExistente = carrito.find(item => item.codigo === codigo);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    actualizarTablaCarrito();
    ventaCantidadInput.value = '';
    ventaProductoInput.value = '';
  }

  function actualizarTablaCarrito() {
    ventaItemsBody.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.cantidad * item.precioVenta;
      total += subtotal;

      const row = ventaItemsBody.insertRow();
      row.innerHTML = `
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precioVenta.toFixed(2)}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="remove-item-btn text-red-500" data-codigo="${item.codigo}">Eliminar</button></td>
      `;
    });

    ventaTotalSpan.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.getAttribute('data-codigo');
        carrito = carrito.filter(item => item.codigo !== codigo);
        actualizarTablaCarrito();
      });
    });
  }

  async function registrarVenta() {
    if (!carrito.length) {
      displayMessage('No hay productos en la venta', 'error');
      return;
    }

    const clienteId = ventaClienteSelect.value;
    const fecha = ventaFechaInput.value || new Date().toISOString();
    const ventaId = crypto.randomUUID();

    const venta = {
      id: ventaId,
      clienteId,
      fecha,
      total: carrito.reduce((sum, item) => sum + (item.precioVenta * item.cantidad), 0)
    };

    const detalle = carrito.map(item => ({
      idVenta: ventaId,
      codigoProducto: item.codigo,
      cantidad: item.cantidad,
      precioUnitario: item.precioVenta
    }));

    try {
      const tx = db.transaction([VENTA_STORE_NAME, VENTA_DETALLE_STORE_NAME], 'readwrite');
      const ventaStore = tx.objectStore(VENTA_STORE_NAME);
      const detalleStore = tx.objectStore(VENTA_DETALLE_STORE_NAME);

      ventaStore.add(venta);
      detalle.forEach(item => detalleStore.add(item));

      await tx.complete;
      displayMessage('Venta registrada exitosamente', 'success');
      limpiarFormularioVenta();
    } catch (err) {
      displayMessage('Error al registrar venta: ' + err.message, 'error');
    }
  }

  async function llenarSelectsVenta() {
    const productos = await getAllProducts();
    const clientes = await getAllClients();

    ventaProductoInput.innerHTML = '';
    productos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.codigo;
      opt.textContent = `${p.nombre} - $${p.precioVenta.toFixed(2)}`;
      ventaProductoInput.appendChild(opt);
    });

    ventaClienteSelect.innerHTML = '';
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.cedula;
      opt.textContent = `${c.nombre} (${c.cedula})`;
      ventaClienteSelect.appendChild(opt);
    });
  }

  function limpiarFormularioVenta() {
    ventaFechaInput.value = '';
    ventaProductoInput.value = '';
    ventaCantidadInput.value = '';
    carrito = [];
    actualizarTablaCarrito();
    llenarSelectsVenta();
  }

  ventaAgregarBtn.addEventListener('click', agregarProductoAlCarrito);
  registrarVentaBtn.addEventListener('click', registrarVenta);

  llenarSelectsVenta();
  actualizarTablaCarrito();

  // Fallback para displayMessage
  if (typeof displayMessage !== 'function') {
    window.displayMessage = function (message, type = 'info') {
      const div = document.createElement('div');
      div.textContent = message;
      div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      }`;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    };
  }
});

//login
document.addEventListener('DOMContentLoaded', async () => {
  await window.initDB?.();

  const loginForm = document.getElementById('loginForm');
  const usuarioInput = document.getElementById('loginUsuario');
  const claveInput = document.getElementById('loginClave');

  const USUARIO_STORE_NAME = 'users';

  async function getUserByUsername(username) {
    const tx = db.transaction([USUARIO_STORE_NAME], 'readonly');
    const store = tx.objectStore(USUARIO_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const usuarios = request.result || [];
        const user = usuarios.find(u => u.usuario === username);
        resolve(user || null);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function validarLogin(e) {
    e.preventDefault();

    const usuario = usuarioInput.value.trim();
    const clave = claveInput.value.trim();

    if (!usuario || !clave) {
      window.displayMessage?.('Ingrese usuario y contraseña', 'error');
      return;
    }

    try {
      const user = await getUserByUsername(usuario);
      if (!user || user.clave !== clave) {
        window.displayMessage?.('Usuario o contraseña incorrectos', 'error');
        return;
      }

      // Guardar sesión
      localStorage.setItem('usuarioActivo', JSON.stringify({
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }));

      window.displayMessage?.(`Bienvenido ${user.usuario}`, 'success');

      setTimeout(() => {
        if (typeof showView === 'function') {
          showView('dashboard');
        } else {
          console.warn('showView no está disponible');
        }
      }, 1000);

    } catch (err) {
      window.displayMessage?.('Error al iniciar sesión: ' + err.message, 'error');
    }
  }

  loginForm.addEventListener('submit', validarLogin);

  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (typeof showView === 'function') {
    showView(isLoggedIn ? 'dashboard' : 'login');
  }
});


//dashboard
document.addEventListener('DOMContentLoaded', async () => {
  await window.initDB?.();
  await window.verificarAccesoModulo?.('dashboard');

  (function () {
    const totalProductosSpan = document.getElementById('totalProductos');
    const totalClientesSpan = document.getElementById('totalClientes');
    const totalVentasSpan = document.getElementById('totalVentas');
    const totalComprasSpan = document.getElementById('totalCompras');
    const ultimaVentaSpan = document.getElementById('ultimaVenta');
    const ultimaCompraSpan = document.getElementById('ultimaCompra');

    async function contar(storeName) {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    }

    async function obtenerTodo(storeName) {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (e) => reject(e.target.error);
      });
    }

    async function calcularDashboard() {
      try {
        const [totalProductos, totalClientes, ventas, compras] = await Promise.all([
          contar('products'),
          contar('clients'),
          obtenerTodo('ventas'),
          obtenerTodo('compras')
        ]);

        const montoVentas = ventas.reduce((sum, v) => sum + v.total, 0);
        const montoCompras = compras.reduce((sum, c) => sum + c.total, 0);

        totalProductosSpan.textContent = totalProductos;
        totalClientesSpan.textContent = totalClientes;
        totalVentasSpan.textContent = `$${montoVentas.toFixed(2)}`;
        totalComprasSpan.textContent = `$${montoCompras.toFixed(2)}`;

        if (ventas.length > 0) {
          const ultima = ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
          ultimaVentaSpan.textContent = new Date(ultima.fecha).toLocaleDateString();
        }

        if (compras.length > 0) {
          const ultima = compras.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
          ultimaCompraSpan.textContent = new Date(ultima.fecha).toLocaleDateString();
        }

      } catch (err) {
        console.error('Error cargando dashboard:', err);
        window.displayMessage?.('Error al cargar el resumen del sistema', 'error');
      }
    }

    document.addEventListener('DOMContentLoaded', calcularDashboard);

    // Fallback por si displayMessage no existe
    if (typeof window.displayMessage !== 'function') {
      window.displayMessage = function (message, type = 'info') {
        const div = document.createElement('div');
        div.textContent = message;
        div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
          type === 'success' ? 'bg-green-500' :
          type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
      };
    }
  })();
});

//roles
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await verificarAccesoModulo('roles');

  // Variables DOM
  const rolIdInput = document.getElementById('rolId');
  const rolNombreInput = document.getElementById('rolNombre');

  const roleForm = document.getElementById('roleForm');
  const roleFormTitle = document.getElementById('roleFormTitle');
  const openRoleModalBtn = document.getElementById('openRoleModal');
  const closeRoleModalBtn = document.getElementById('closeRoleModal');
  const cancelRoleEditButton = document.getElementById('cancelRoleEditButton');
  const roleModal = document.getElementById('roleModal');

  const rolesTableBody = document.getElementById('rolesTableBody');
  const roleSearchInput = document.getElementById('roleSearchInput');
  const noRolesMessage = document.getElementById('noRolesMessage');

  let editingRoleId = null;
  const ROLE_STORE_NAME = 'roles';

  // Funciones de IndexedDB
  async function addRole(role) {
    const tx = db.transaction([ROLE_STORE_NAME], 'readwrite');
    const store = tx.objectStore(ROLE_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.add(role);
      request.onsuccess = () => resolve();
      request.onerror = e => reject(e.target.error);
    });
  }

  async function updateRole(role) {
    const tx = db.transaction([ROLE_STORE_NAME], 'readwrite');
    const store = tx.objectStore(ROLE_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.put(role);
      request.onsuccess = () => resolve();
      request.onerror = e => reject(e.target.error);
    });
  }

  async function deleteRole(id) {
    const tx = db.transaction([ROLE_STORE_NAME], 'readwrite');
    const store = tx.objectStore(ROLE_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = e => reject(e.target.error);
    });
  }

  async function getAllRoles() {
    const tx = db.transaction([ROLE_STORE_NAME], 'readonly');
    const store = tx.objectStore(ROLE_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  // Mostrar roles
  async function displayRoles(filter = '') {
    rolesTableBody.innerHTML = '';
    const roles = await getAllRoles();
    let filtered = roles;

    if (filter) {
      const lower = filter.toLowerCase();
      filtered = roles.filter(r =>
        r.id.toLowerCase().includes(lower) ||
        r.nombre.toLowerCase().includes(lower)
      );
    }

    if (filtered.length === 0) {
      noRolesMessage?.classList.remove('hidden');
    } else {
      noRolesMessage?.classList.add('hidden');
      filtered.forEach(role => {
        const row = rolesTableBody.insertRow();
        row.innerHTML = `
          <td>${role.id}</td>
          <td>${role.nombre}</td>
          <td>
            <button class="edit-role-btn text-blue-600 mr-3" data-id="${role.id}">Editar</button>
            <button class="delete-role-btn text-red-600" data-id="${role.id}">Eliminar</button>
          </td>
        `;
      });

      document.querySelectorAll('.edit-role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const role = roles.find(r => r.id === id);
          if (role) populateRoleFormForEdit(role);
        });
      });

      document.querySelectorAll('.delete-role-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (confirm('¿Eliminar este rol?')) {
            await deleteRole(id);
            displayRoles(roleSearchInput.value);
            displayMessage('Rol eliminado correctamente', 'success');
          }
        });
      });
    }
  }

  function clearRoleForm() {
    roleForm.reset();
    editingRoleId = null;
    roleFormTitle.textContent = 'Crear Nuevo Rol';
    cancelRoleEditButton.classList.add('hidden');
    rolIdInput.removeAttribute('readonly');
  }

  function populateRoleFormForEdit(role) {
    roleModal.classList.remove('hidden');
    rolIdInput.value = role.id;
    rolIdInput.setAttribute('readonly', true);
    rolNombreInput.value = role.nombre;
    editingRoleId = role.id;
    roleFormTitle.textContent = 'Editar Rol';
    cancelRoleEditButton.classList.remove('hidden');
    roleForm.scrollIntoView({ behavior: 'smooth' });
  }

  // Eventos
  openRoleModalBtn?.addEventListener('click', () => {
    roleModal.classList.remove('hidden');
    clearRoleForm();
  });

  closeRoleModalBtn?.addEventListener('click', () => {
    roleModal.classList.add('hidden');
    clearRoleForm();
  });

  cancelRoleEditButton?.addEventListener('click', () => {
    roleModal.classList.add('hidden');
    clearRoleForm();
  });

  roleSearchInput?.addEventListener('input', () => {
    displayRoles(roleSearchInput.value);
  });

  roleForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const role = {
      id: rolIdInput.value,
      nombre: rolNombreInput.value
    };

    try {
      if (editingRoleId) {
        await updateRole(role);
        displayMessage('Rol actualizado correctamente', 'success');
      } else {
        await addRole(role);
        displayMessage('Rol creado correctamente', 'success');
      }
      clearRoleForm();
      roleModal.classList.add('hidden');
      displayRoles();
    } catch (err) {
      displayMessage('Error al guardar rol: ' + err.message, 'error');
    }
  });

  // Cargar roles al inicio
  displayRoles();

  // Función auxiliar en caso de que displayMessage no exista
  if (typeof displayMessage !== 'function') {
    window.displayMessage = function (message, type = 'info') {
      const div = document.createElement('div');
      div.textContent = message;
      div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      }`;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    };
  }
});

//utils
// Función global para formatear número como moneda
window.formatCurrency = function (amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Función global para calcular subtotal
window.calculateSubtotal = function (quantity, unitPrice) {
  return quantity * unitPrice;
};
// Mostrar mensaje flotante
window.displayMessage = function (message, type = 'info') {
  const div = document.createElement('div');
  div.textContent = message;
  div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
};
// Función global para mostrar mensaje flotante
window.displayMessage = function (message, type = 'info') {
  const div = document.createElement('div');
  div.textContent = message;
  div.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
};
// --- seguridad.js adaptado para entorno global sin módulos ---

window.tienePermiso = async function (modulo) {
  const sesion = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!sesion) return false;

  const tx = db.transaction(['permisos'], 'readonly');
  const store = tx.objectStore('permisos');

  return new Promise((resolve, reject) => {
    const req = store.get(sesion.rol);
    req.onsuccess = () => {
      const permisos = req.result?.permisos || [];
      resolve(permisos.includes(modulo));
    };
    req.onerror = (e) => reject(e.target.error);
  });
};

window.showView = function (viewId) {
  const loginView = document.getElementById('loginView');
  const homeSection = document.getElementById('homeSection');

  if (viewId === 'login') {
    loginView?.classList.remove('hidden');
    homeSection?.classList.add('hidden');
  } else {
    loginView?.classList.add('hidden');
    homeSection?.classList.remove('hidden');
    if (typeof showContentSection === 'function') {
      showContentSection('homeSection');
    }
  }
};

// --- Función global para verificar acceso a un módulo ---
window.verificarAccesoModulo = async function (modulo) {
  await window.initDB?.();
  const tiene = await window.tienePermiso?.(modulo);
  if (!tiene) {
    window.displayMessage?.('Acceso denegado', 'error');
    throw new Error('Acceso denegado');
  }
};
// --- Alerta personalizada global ---
window.customAlert = function (message) {
  const existingModal = document.getElementById('customAlertModal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div id="customAlertModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
        <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
        <button id="closeAlertButton" class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
          Aceptar
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('closeAlertButton').addEventListener('click', () => {
    document.getElementById('customAlertModal')?.remove();
  });
};

// --- Confirmación personalizada global ---
window.customConfirm = function (message) {
  return new Promise((resolve) => {
    const existingModal = document.getElementById('customConfirmModal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
      <div id="customConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
          <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
          <div class="flex justify-center space-x-4">
            <button id="confirmYesButton" class="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700">Sí</button>
            <button id="confirmNoButton" class="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400">No</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('confirmYesButton').addEventListener('click', () => {
      document.getElementById('customConfirmModal')?.remove();
      resolve(true);
    });

    document.getElementById('confirmNoButton').addEventListener('click', () => {
      document.getElementById('customConfirmModal')?.remove();
      resolve(false);
    });
  });
};
window.isNotEmpty = function (value) {
  return value.trim() !== '';
};