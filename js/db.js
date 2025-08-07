window.db = null;

window.initDB = function () {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bazarAngelitoDB', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      // Crea los almacenes de objetos si no existen
      if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'cedula' });
      if (!db.objectStoreNames.contains('clients')) db.createObjectStore('clients', { keyPath: 'cedula' });
      if (!db.objectStoreNames.contains('suppliers')) db.createObjectStore('suppliers', { keyPath: 'cedula' });
      if (!db.objectStoreNames.contains('products')) db.createObjectStore('products', { keyPath: 'codigo' });
      if (!db.objectStoreNames.contains('categories')) db.createObjectStore('categories', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('compras')) db.createObjectStore('compras', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('detalleCompras')) db.createObjectStore('detalleCompras', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('ventas')) db.createObjectStore('ventas', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('detalleVentas')) db.createObjectStore('detalleVentas', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('roles')) db.createObjectStore('roles', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('permisos')) db.createObjectStore('permisos', { keyPath: 'rolId' });
      if (!db.objectStoreNames.contains('business')) db.createObjectStore('business', { keyPath: 'id' });
    };
    request.onsuccess = function (event) {
      window.db = event.target.result;
      resolve();
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
};

window.initDB = function () {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bazarAngelitoDB', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'cedula' });
      if (!db.objectStoreNames.contains('roles')) db.createObjectStore('roles', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('permisos')) db.createObjectStore('permisos', { keyPath: 'rolId' });
      // ...otros stores...
    };
    request.onsuccess = function (event) {
      window.db = event.target.result;

      // Crear usuario admin y permisos si no existen
      const tx = window.db.transaction(['users', 'roles', 'permisos'], 'readwrite');
      const usersStore = tx.objectStore('users');
      const rolesStore = tx.objectStore('roles');
      const permisosStore = tx.objectStore('permisos');

      // Usuario admin
      usersStore.get('9999999999').onsuccess = function (e) {
        if (!e.target.result) {
          usersStore.add({
            cedula: '9999999999',
            nombreCompleto: 'Administrador',
            correoElectronico: 'admin@admin.com',
            telefono: '',
            rol: 'admin',
            estado: true,
            fechaRegistro: new Date().toISOString(),
            usuario: 'admin',
            clave: 'admin'
          });
        }
      };

      // Rol admin
      rolesStore.get('admin').onsuccess = function (e) {
        if (!e.target.result) {
          rolesStore.add({ id: 'admin', nombre: 'Administrador' });
        }
      };

      // Permisos admin (todos los módulos)
      permisosStore.get('admin').onsuccess = function (e) {
        if (!e.target.result) {
          permisosStore.add({
            rolId: 'admin',
            permisos: [
              'usuarios', 'clientes', 'proveedores', 'productos', 'categorias',
              'ventas', 'compras', 'reportes', 'roles', 'permisos', 'configuracion', 'dashboard'
            ]
          });
        }
      };

      resolve();
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
};