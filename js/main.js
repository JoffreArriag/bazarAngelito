
        document.addEventListener('DOMContentLoaded', () => {
            const loginView = document.getElementById('loginView');
            const dashboardView = document.getElementById('dashboardView');
            const loginForm = document.getElementById('loginForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const errorMessage = document.getElementById('errorMessage');
            const logoutButton = document.getElementById('logoutButton');
            const menuToggles = document.querySelectorAll('.menu-toggle');
            const navLinks = document.querySelectorAll('.nav-link');
            const contentSections = document.querySelectorAll('.content-section');

            // Elementos del formulario de usuario
            const cedulaInput = document.getElementById('cedula');
            const nombreCompletoInput = document.getElementById('nombreCompleto');
            const correoElectronicoInput = document.getElementById('correoElectronico');
            const telefonoInput = document.getElementById('telefono');
            const rolSelect = document.getElementById('rol');
            const saveUserButton = document.getElementById('saveUserButton');
            const userFormTitle = document.getElementById('userFormTitle');
            const openUserModalBtn = document.getElementById('openUserModal');
            const userModal = document.getElementById('userModal');
            const closeUserModalBtn = document.getElementById('closeUserModal');
            const cancelEditButton = document.getElementById('cancelEditButton');
            const userForm = document.getElementById('userForm');
            const userEstadoInput = document.getElementById('usuarioEstado');
            const userFechaRegistroInput = document.getElementById('usuarioFechaRegistro');

            // Abrir el modal al hacer clic en "Crear Usuario"
            openUserModalBtn.addEventListener('click', () => {
                userModal.classList.remove('hidden');
                userForm.reset();
                cancelEditButton.classList.add('hidden');
                document.getElementById('userFormTitle').textContent = 'Crear Nuevo Usuario';
            });

            // Cerrar el modal al hacer clic en la X
            closeUserModalBtn.addEventListener('click', () => {
                userModal.classList.add('hidden');
                userForm.reset();
                cancelEditButton.classList.add('hidden');
            });

            // Opcional: cerrar el modal al guardar o cancelar edición
            userForm.addEventListener('submit', () => {
                userModal.classList.add('hidden');
            });
            cancelEditButton.addEventListener('click', () => {
                userModal.classList.add('hidden');
                userForm.reset();
                cancelEditButton.classList.add('hidden');
            });

            // Elementos de la tabla de usuarios
            const usersTableBody = document.getElementById('usersTableBody');
            const userSearchInput = document.getElementById('userSearchInput');
            const noUsersMessage = document.getElementById('noUsersMessage');

            let editingCedula = null; // Para saber si estamos editando un usuario

            //Elementos de la tabla de negocios
            const businessForm = document.getElementById('businessForm');
            const businessNameInput = document.getElementById('businessName');
            const businessRUCInput = document.getElementById('businessRUC');
            const businessDireccionInput = document.getElementById('businessDireccion');
            const businessTelefonoInput = document.getElementById('businessTelefono');
            const businessCorreoInput = document.getElementById('businessCorreo');
            const businessCiudadInput = document.getElementById('businessCiudad');
            const businessMensajePieInput = document.getElementById('businessMensajePie');
            const businessLogoInput = document.getElementById('businessLogo');
            const businessLogoPreview = document.getElementById('businessLogoPreview');

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

            // Función para convertir archivo a base64
            function toBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
            }

            // --- Funciones de UI para Proveedores ---
            const productForm = document.getElementById('productForm');
            const productoCodigoInput = document.getElementById('productoCodigo');
            const productoNombreInput = document.getElementById('productoNombre');
            const productoDescripcionInput = document.getElementById('productoDescripcion');
            const productoCategoriaInput = document.getElementById('productoCategoria');
            const productoStockInput = document.getElementById('productoStock');
            const productoPrecioCompraInput = document.getElementById('productoPrecioCompra');
            const productoPrecioVentaInput = document.getElementById('productoPrecioVenta');
            const productoEstadoInput = document.getElementById('productoEstado');
            const productoFechaRegistroInput = document.getElementById('productoFechaRegistro');
            const saveProductButton = document.getElementById('saveProductButton');
            const cancelProductEditButton = document.getElementById('cancelProductEditButton');
            const productModal = document.getElementById('productModal');
            const openProductModalBtn = document.getElementById('openProductModal');
            const closeProductModalBtn = document.getElementById('closeProductModal');
            const productsTableBody = document.getElementById('productsTableBody');
            const noProductsMessage = document.getElementById('noProductsMessage');
            const downloadProductsExcelBtn = document.getElementById('downloadProductsExcel');

            let editingProductCodigo = null;

            // Abrir modal
            openProductModalBtn.addEventListener('click', () => {
                productModal.classList.remove('hidden');
                productForm.reset();
                cancelProductEditButton.classList.add('hidden');
                document.getElementById('productFormTitle').textContent = 'Crear Nuevo Producto';
            });

            // Cerrar modal
            closeProductModalBtn.addEventListener('click', () => {
                productModal.classList.add('hidden');
                productForm.reset();
                cancelProductEditButton.classList.add('hidden');
            });

            // Cerrar modal al guardar/cancelar
            productForm.addEventListener('submit', () => {
                productModal.classList.add('hidden');
            });
            cancelProductEditButton.addEventListener('click', () => {
                productModal.classList.add('hidden');
                productForm.reset();
                cancelProductEditButton.classList.add('hidden');
            });

            // Guardar producto
            productForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedOption = productoCategoriaInput.options[productoCategoriaInput.selectedIndex];
            const product = {
                codigo: productoCodigoInput.value,
                nombre: productoNombreInput.value,
                descripcion: productoDescripcionInput.value,
                idCategoria: productoCategoriaInput.value,
                categoriaNombre: selectedOption.textContent, 
                stock: parseInt(productoStockInput.value, 10),
                precioCompra: parseFloat(productoPrecioCompraInput.value),
                precioVenta: parseFloat(productoPrecioVentaInput.value),
                estado: productoEstadoInput.value === "true",
                fechaRegistro: productoFechaRegistroInput.value || new Date().toISOString()
            };

                try {
                    if (editingProductCodigo) {
                        await updateProduct(product);
                        alert('Producto actualizado con éxito.');
                    } else {
                        await addProduct(product);
                        alert('Producto creado con éxito.');
                    }
                    clearProductForm();
                    displayProducts();
                } catch (error) {
                    if (error.name === 'ConstraintError') {
                        alert('Error: Ya existe un producto con ese código.');
                    } else {
                        alert('Error al guardar el producto: ' + error.message);
                    }
                }
            });

            // Elementos del formulario de cliente
            const clienteCedulaInput = document.getElementById('clienteCedula');
            const clienteNombreInput = document.getElementById('clienteNombre');
            const clienteTelefonoInput = document.getElementById('clienteTelefono');
            const clienteDireccionInput = document.getElementById('clienteDireccion');
            const clienteCorreoInput = document.getElementById('clienteCorreo');
            const saveClientButton = document.getElementById('saveClientButton');
            const clientFormTitle = document.getElementById('clientFormTitle');
            const openClientModalBtn = document.getElementById('openClientModal');
            const clientModal = document.getElementById('clientModal');
            const closeClientModalBtn = document.getElementById('closeClientModal');
            const cancelClientEditButton = document.getElementById('cancelClientEditButton');
            const clientForm = document.getElementById('clientForm');

            // Abrir el modal al hacer clic en "Crear Cliente"
            openClientModalBtn.addEventListener('click', () => {
                clientModal.classList.remove('hidden');
                clientForm.reset();
                cancelClientEditButton.classList.add('hidden');
                clientFormTitle.textContent = 'Crear Nuevo Cliente';
            });

            // Cerrar el modal al hacer clic en la X
            closeClientModalBtn.addEventListener('click', () => {
                clientModal.classList.add('hidden');
                clientForm.reset();
                cancelClientEditButton.classList.add('hidden');
            });

            // Opcional: cerrar el modal al guardar o cancelar edición
            clientForm.addEventListener('submit', () => {
                clientModal.classList.add('hidden');
            });
            cancelClientEditButton.addEventListener('click', () => {
                clientModal.classList.add('hidden');
                clientForm.reset();
                cancelClientEditButton.classList.add('hidden');
            });

            // Elementos del formulario de proveedor
            const proveedorCedulaInput = document.getElementById('proveedorCedula');
            const proveedorRazonSocialInput = document.getElementById('proveedorRazonSocial');
            const proveedorCorreoInput = document.getElementById('proveedorCorreo');
            const proveedorTelefonoInput = document.getElementById('proveedorTelefono');
            const proveedorFechaRegistroInput = document.getElementById('proveedorFechaRegistro');
            const saveSupplierButton = document.getElementById('saveSupplierButton');
            const supplierFormTitle = document.getElementById('supplierFormTitle');
            const openSupplierModalBtn = document.getElementById('openSupplierModal');
            const supplierModal = document.getElementById('supplierModal');
            const closeSupplierModalBtn = document.getElementById('closeSupplierModal');
            const cancelSupplierEditButton = document.getElementById('cancelSupplierEditButton');
            const supplierForm = document.getElementById('supplierForm');

            let editingSupplierCedula = null;

            // Abrir el modal al hacer clic en "Crear Proveedor"
            openSupplierModalBtn.addEventListener('click', () => {
                supplierModal.classList.remove('hidden');
                supplierForm.reset();
                cancelSupplierEditButton.classList.add('hidden');
                supplierFormTitle.textContent = 'Crear Nuevo Proveedor';
            });

            // Cerrar el modal al hacer clic en la X
            closeSupplierModalBtn.addEventListener('click', () => {
                supplierModal.classList.add('hidden');
                supplierForm.reset();
                cancelSupplierEditButton.classList.add('hidden');
            });

            // Opcional: cerrar el modal al guardar o cancelar edición
            supplierForm.addEventListener('submit', () => {
                supplierModal.classList.add('hidden');
            });
            cancelSupplierEditButton.addEventListener('click', () => {
                supplierModal.classList.add('hidden');
                supplierForm.reset();
                cancelSupplierEditButton.classList.add('hidden');
            });
            // Elementos de la tabla de clientes
            const clientsTableBody = document.getElementById('clientsTableBody');
            const clientSearchInput = document.getElementById('clientSearchInput');
            const noClientsMessage = document.getElementById('noClientsMessage');

            let editingClientCedula = null; // Para saber si estamos editando un cliente
            
            // Elementos del formulario de categoría
            const categoryForm = document.getElementById('categoryForm');
            const categoryNameInput = document.getElementById('categoryName');
            const saveCategoryButton = document.getElementById('saveCategoryButton');
            const cancelCategoryEditButton = document.getElementById('cancelCategoryEditButton');
            const categoryFormTitle = document.getElementById('categoryFormTitle');
            const openCategoryModalBtn = document.getElementById('openCategoryModal');
            const categoryModal = document.getElementById('categoryModal');
            const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
            const categoryEstadoInput = document.getElementById('categoriaEstado');
            const categoryFechaRegistroInput = document.getElementById('categoriaFechaRegistro');
            const categoryDescriptionInput = document.getElementById('categoryDescription');

            // Abrir el modal al hacer clic en "Crear Categoría"
            openCategoryModalBtn.addEventListener('click', () => {
                categoryModal.classList.remove('hidden');
                clearCategoryForm();
            });

            // Cerrar el modal al hacer clic en la X
            closeCategoryModalBtn.addEventListener('click', () => {
                categoryModal.classList.add('hidden');
                clearCategoryForm();
            });

            // Opcional: cerrar el modal al guardar o cancelar edición
            categoryForm.addEventListener('submit', () => {
                categoryModal.classList.add('hidden');
            });
            cancelCategoryEditButton.addEventListener('click', () => {
                categoryModal.classList.add('hidden');
            });

            // Elementos de la tabla de categorías
            const categoriesTableBody = document.getElementById('categoriesTableBody');
            const categorySearchInput = document.getElementById('categorySearchInput');
            const noCategoriesMessage = document.getElementById('noCategoriesMessage');

            let editingCategoryId = null; 

            // --- Credenciales  ---
            const VALID_USERNAME = 'admin';
            const VALID_PASSWORD = 'password123';
            // ---------------------------------------------------------------------------------

            // --- IndexedDB Setup ---
            const DB_NAME = 'BazarAngelitoDB';
            const DB_VERSION = 3; 
            const USER_STORE_NAME = 'users';
            const CATEGORY_STORE_NAME = 'categories';
            const CLIENT_STORE_NAME = 'clients';
            const SUPPLIER_STORE_NAME = 'suppliers';
            const PRODUCT_STORE_NAME = 'products';
            const BUSINESS_STORE_NAME = 'business';
            let db;

            // Abre la base de datos IndexedDB
            function openDatabase() {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(DB_NAME, DB_VERSION);

                    request.onupgradeneeded = (event) => {
                        db = event.target.result;
                        // Crea el almacén de objetos 'users' si no existe
                        if (!db.objectStoreNames.contains(USER_STORE_NAME)) {
                            const userStore = db.createObjectStore(USER_STORE_NAME, { keyPath: 'cedula' });
                            userStore.createIndex('nombreCompleto', 'nombreCompleto', { unique: false });
                            userStore.createIndex('correoElectronico', 'correoElectronico', { unique: true });
                        }

                        // Crea el almacén de objetos 'categories' si no existe
                        if (!db.objectStoreNames.contains(CATEGORY_STORE_NAME)) {
                            const categoryStore = db.createObjectStore(CATEGORY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                            categoryStore.createIndex('nombre', 'nombre', { unique: true });
                        }

                        // Crea el almacén de objetos 'clientes' si no existe
                        if (!db.objectStoreNames.contains(CLIENT_STORE_NAME)) {
                            db.createObjectStore(CLIENT_STORE_NAME, { keyPath: 'cedula' });
                        }

                        // Crea el almacén de objetos 'proveedores' si no existe
                        if (!db.objectStoreNames.contains(SUPPLIER_STORE_NAME)) {
                            db.createObjectStore(SUPPLIER_STORE_NAME, { keyPath: 'cedula' });
                        }

                        // Crea el almacén de objetos 'products' si no existe
                        if (!db.objectStoreNames.contains(PRODUCT_STORE_NAME)) {
                            db.createObjectStore(PRODUCT_STORE_NAME, { keyPath: 'codigo' });
                        }

                        // Crea el almacén de objetos 'business' si no existe
                        if (!db.objectStoreNames.contains(BUSINESS_STORE_NAME)) {
                            db.createObjectStore(BUSINESS_STORE_NAME, { keyPath: 'id' });
                        }
                    };

                    request.onsuccess = (event) => {
                        db = event.target.result;
                        console.log('IndexedDB abierta con éxito');
                        resolve(db);
                    };

                    request.onerror = (event) => {
                        console.error('Error al abrir IndexedDB:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            // --- Funciones CRUD para Negocio ---
            async function saveBusiness(business) {
                const transaction = db.transaction([BUSINESS_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(BUSINESS_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(business);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function getBusiness() {
                const transaction = db.transaction([BUSINESS_STORE_NAME], 'readonly');
                const store = transaction.objectStore(BUSINESS_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.get(1); // Solo un registro
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            // --- Funciones CRUD para Proveedores ---
            async function addSupplier(supplier) {
                const transaction = db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(SUPPLIER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.add(supplier);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function updateSupplier(supplier) {
                const transaction = db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(SUPPLIER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(supplier);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function deleteSupplier(cedula) {
                const transaction = db.transaction([SUPPLIER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(SUPPLIER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.delete(cedula);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function getAllSuppliers() {
                const transaction = db.transaction([SUPPLIER_STORE_NAME], 'readonly');
                const store = transaction.objectStore(SUPPLIER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            // --- Funciones CRUD para Usuarios ---
            async function addUser(user) {
                const transaction = db.transaction([USER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(USER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.add(user);
                    request.onsuccess = () => {
                        console.log('Usuario añadido:', user);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al añadir usuario:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function updateUser(user) {
                const transaction = db.transaction([USER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(USER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(user);
                    request.onsuccess = () => {
                        console.log('Usuario actualizado:', user);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al actualizar usuario:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function deleteUser(cedula) {
                const transaction = db.transaction([USER_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(USER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.delete(cedula);
                    request.onsuccess = () => {
                        console.log('Usuario eliminado:', cedula);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al eliminar usuario:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function getAllUsers() {
                const transaction = db.transaction([USER_STORE_NAME], 'readonly');
                const store = transaction.objectStore(USER_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => {
                        resolve(request.result);
                    };
                    request.onerror = (event) => {
                        console.error('Error al obtener usuarios:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            // --- Funciones de CRUD de productos ---
            async function addProduct(product) {
                const transaction = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(PRODUCT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.add(product);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function updateProduct(product) {
                const transaction = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(PRODUCT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(product);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function deleteProduct(codigo) {
                const transaction = db.transaction([PRODUCT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(PRODUCT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.delete(codigo);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function getAllProducts() {
                const transaction = db.transaction([PRODUCT_STORE_NAME], 'readonly');
                const store = transaction.objectStore(PRODUCT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            }
            // --- Funciones CRUD para Categorías ---
            async function addCategory(category) {
                const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CATEGORY_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.add(category);
                    request.onsuccess = () => {
                        console.log('Categoría añadida:', category);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al añadir categoría:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function updateCategory(category) {
                const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CATEGORY_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(category);
                    request.onsuccess = () => {
                        console.log('Categoría actualizada:', category);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al actualizar categoría:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function deleteCategory(id) {
                const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CATEGORY_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.delete(id);
                    request.onsuccess = () => {
                        console.log('Categoría eliminada:', id);
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.error('Error al eliminar categoría:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            async function getAllCategories() {
                const transaction = db.transaction([CATEGORY_STORE_NAME], 'readonly');
                const store = transaction.objectStore(CATEGORY_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => {
                        resolve(request.result);
                    };
                    request.onerror = (event) => {
                        console.error('Error al obtener categorías:', event.target.error);
                        reject(event.target.error);
                    };
                });
            }

            // --- Funciones CRUD para Clientes ---
            async function addClient(client) {
                const transaction = db.transaction([CLIENT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CLIENT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.add(client);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function updateClient(client) {
                const transaction = db.transaction([CLIENT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CLIENT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.put(client);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function deleteClient(cedula) {
                const transaction = db.transaction([CLIENT_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(CLIENT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.delete(cedula);
                    request.onsuccess = () => resolve();
                    request.onerror = (event) => reject(event.target.error);
                });
            }

            async function getAllClients() {
                const transaction = db.transaction([CLIENT_STORE_NAME], 'readonly');
                const store = transaction.objectStore(CLIENT_STORE_NAME);
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            }


            // Muestra la vista de login o dashboard
            function showView(viewId) {
                if (viewId === 'login') {
                    loginView.classList.remove('hidden');
                    dashboardView.classList.add('hidden');
                } else {
                    loginView.classList.add('hidden');
                    dashboardView.classList.remove('hidden');
                    showContentSection('homeSection');
                }
            }

            // Muestra la sección de contenido específica y oculta las demás
            function showContentSection(sectionId) {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                if (sectionId === 'usersSection') {
                    displayUsers();
                } else if (sectionId === 'categorySection') {
                    displayCategories();
                }
            }

            // Limpia el formulario de usuario
            function clearUserForm() {
                userForm.reset();
                editingCedula = null;
                userFormTitle.textContent = 'Crear Nuevo Usuario';
                saveUserButton.textContent = 'Guardar Usuario';
                cancelEditButton.classList.add('hidden');
                cedulaInput.removeAttribute('readonly'); 
            }

            // Rellena el formulario con los datos de un usuario para edición
            function populateUserFormForEdit(user) {
                userModal.classList.remove('hidden'); 
                cedulaInput.value = user.cedula;
                cedulaInput.setAttribute('readonly', 'true');
                nombreCompletoInput.value = user.nombreCompleto;
                correoElectronicoInput.value = user.correoElectronico;
                telefonoInput.value = user.telefono;
                rolSelect.value = user.rol;
                userEstadoInput.value = user.estado ? "true" : "false";
                userFechaRegistroInput.value = user.fechaRegistro ? user.fechaRegistro.split('T')[0] : "";
                editingCedula = user.cedula; 
                userFormTitle.textContent = 'Editar Usuario';
                saveUserButton.textContent = 'Actualizar Usuario';
                cancelEditButton.classList.remove('hidden');
                userForm.scrollIntoView({ behavior: 'smooth' });
            }

            // Muestra los usuarios en la tabla
            async function displayUsers(filter = '') {
            usersTableBody.innerHTML = '';
            const users = await getAllUsers();
            let filteredUsers = users;

            if (filter) {
                const lowerCaseFilter = filter.toLowerCase();
                filteredUsers = users.filter(user =>
                    user.cedula.toLowerCase().includes(lowerCaseFilter) ||
                    user.nombreCompleto.toLowerCase().includes(lowerCaseFilter) ||
                    user.correo.toLowerCase().includes(lowerCaseFilter)
                );
            }

            if (filteredUsers.length === 0) {
                noUsersMessage.classList.remove('hidden');
            } else {
                noUsersMessage.classList.add('hidden');
                filteredUsers.forEach(user => {
                    const row = usersTableBody.insertRow();
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.cedula}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.nombreCompleto}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.correo || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.estado ? 'Activo' : 'Inactivo'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button data-cedula="${user.cedula}" class="edit-user-btn text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                            <button data-cedula="${user.cedula}" class="delete-user-btn text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    `;
                });
            }
        }

            // Limpia el formulario de categoría
            function clearCategoryForm() {
                categoryForm.reset();
                editingCategoryId = null;
                categoryFormTitle.textContent = 'Crear Nueva Categoría';
                saveCategoryButton.textContent = 'Guardar Categoría';
                cancelCategoryEditButton.classList.add('hidden');
            }

            // Rellena el formulario con los datos de una categoría para edición
            function populateCategoryFormForEdit(category) {
                categoryModal.classList.remove('hidden');
                categoryNameInput.value = category.nombre;
                categoryDescriptionInput.value = category.descripcion || '';
                categoryEstadoInput.value = category.estado ? "true" : "false";
                categoryFechaRegistroInput.value = category.fechaRegistro ? category.fechaRegistro.split('T')[0] : "";
                editingCategoryId = category.id; 
                categoryFormTitle.textContent = 'Editar Categoría';
                saveCategoryButton.textContent = 'Actualizar Categoría';
                cancelCategoryEditButton.classList.remove('hidden');
                categoryForm.scrollIntoView({ behavior: 'smooth' });
            }

            // Muestra las categorías en la tabla
            async function displayCategories(filter = '') {
            categoriesTableBody.innerHTML = '';
            const categories = await getAllCategories();
            let filteredCategories = categories;

            if (filter) {
                const lowerCaseFilter = filter.toLowerCase();
                filteredCategories = categories.filter(category =>
                    category.descripcion.toLowerCase().includes(lowerCaseFilter)
                );
            }

            if (filteredCategories.length === 0) {
                noCategoriesMessage.classList.remove('hidden');
            } else {
                noCategoriesMessage.classList.add('hidden');
                filteredCategories.forEach(category => {
                    const row = categoriesTableBody.insertRow();
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${category.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.nombre}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.descripcion || ''}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.estado ? 'Activo' : 'Inactivo'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.fechaRegistro ? new Date(category.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button data-id="${category.id}" class="edit-category-btn text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                            <button data-id="${category.id}" class="delete-category-btn text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    `;
                });
            }
        }
            
            // --- Funciones de UI para Productos ---
            function clearProductForm() {
                productForm.reset();
                editingProductCodigo = null;
                document.getElementById('productFormTitle').textContent = 'Crear Nuevo Producto';
                saveProductButton.textContent = 'Guardar Producto';
                cancelProductEditButton.classList.add('hidden');
                productoCodigoInput.removeAttribute('readonly');
            }

            // Editar producto
            function populateProductFormForEdit(product) {
                productModal.classList.remove('hidden');
                productoCodigoInput.value = product.codigo;
                productoCodigoInput.setAttribute('readonly', 'true');
                productoNombreInput.value = product.nombre;
                productoDescripcionInput.value = product.descripcion;
                productoCategoriaInput.value = product.idCategoria;
                productoStockInput.value = product.stock;
                productoPrecioCompraInput.value = product.precioCompra;
                productoPrecioVentaInput.value = product.precioVenta;
                productoEstadoInput.value = product.estado ? "true" : "false";
                productoFechaRegistroInput.value = product.fechaRegistro ? product.fechaRegistro.split('T')[0] : "";
                editingProductCodigo = product.codigo;
                document.getElementById('productFormTitle').textContent = 'Editar Producto';
                saveProductButton.textContent = 'Actualizar Producto';
                cancelProductEditButton.classList.remove('hidden');
                productForm.scrollIntoView({ behavior: 'smooth' });
            }

            // Mostrar productos en la tabla
            async function displayProducts(filter = '') {
                productsTableBody.innerHTML = '';
                const products = await getAllProducts();
                let filteredProducts = products;

                if (filter) {
                    const lowerCaseFilter = filter.toLowerCase();
                    filteredProducts = products.filter(product =>
                        product.codigo.toLowerCase().includes(lowerCaseFilter) ||
                        product.nombre.toLowerCase().includes(lowerCaseFilter) ||
                        product.descripcion.toLowerCase().includes(lowerCaseFilter)
                    );
                }

                if (filteredProducts.length === 0) {
                    noProductsMessage.classList.remove('hidden');
                } else {
                    noProductsMessage.classList.add('hidden');
                    filteredProducts.forEach(product => {
                        const row = productsTableBody.insertRow();
                        row.innerHTML = `
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.codigo}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.nombre}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.descripcion || 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.categoriaNombre || 'Sin categoría'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.precioCompra}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.precioVenta}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.estado ? 'Activo' : 'Inactivo'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.fechaRegistro ? new Date(product.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button data-codigo="${product.codigo}" class="edit-product-btn text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                <button data-codigo="${product.codigo}" class="delete-product-btn text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        `;
                    });
                }
            }
            // --- Funciones de UI para Clientes ---
            function clearClientForm() {
                clientForm.reset();
                editingClientCedula = null;
                clientFormTitle.textContent = 'Crear Nuevo Cliente';
                saveClientButton.textContent = 'Guardar Cliente';
                cancelClientEditButton.classList.add('hidden');
                clienteCedulaInput.removeAttribute('readonly');
            }

            function populateClientFormForEdit(client) {
                clientModal.classList.remove('hidden'); 
                clienteCedulaInput.value = client.cedula;
                clienteCedulaInput.setAttribute('readonly', 'true');
                clienteNombreInput.value = client.nombre;
                clienteTelefonoInput.value = client.telefono;
                clienteDireccionInput.value = client.direccion;
                clienteCorreoInput.value = client.correo;
                clienteEstadoInput.value = client.estado ? "true" : "false";
                clienteFechaRegistroInput.value = client.fechaRegistro ? client.fechaRegistro.split('T')[0] : "";
                editingClientCedula = client.cedula;
                clientFormTitle.textContent = 'Editar Cliente';
                saveClientButton.textContent = 'Actualizar Cliente';
                cancelClientEditButton.classList.remove('hidden');
                clientForm.scrollIntoView({ behavior: 'smooth' });
            }

            async function displayClients(filter = '') {
            clientsTableBody.innerHTML = '';
            const clients = await getAllClients();
            let filteredClients = clients;

            if (filter) {
                const lowerCaseFilter = filter.toLowerCase();
                filteredClients = clients.filter(client =>
                    client.cedula.toLowerCase().includes(lowerCaseFilter) ||
                    client.nombre.toLowerCase().includes(lowerCaseFilter) ||
                    client.correo.toLowerCase().includes(lowerCaseFilter)
                );
            }

            if (filteredClients.length === 0) {
                noClientsMessage.classList.remove('hidden');
            } else {
                noClientsMessage.classList.add('hidden');
                filteredClients.forEach(client => {
                    const row = clientsTableBody.insertRow();
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${client.cedula}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.nombre}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.correo || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.telefono || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.direccion || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.estado ? 'Activo' : 'Inactivo'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.fechaRegistro ? new Date(client.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button data-cedula="${client.cedula}" class="edit-client-btn text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                            <button data-cedula="${client.cedula}" class="delete-client-btn text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    `;
                });
            }
        }
            // --- Funciones de UI para Proveedores ---
            function clearSupplierForm() {
                supplierForm.reset();
                editingSupplierCedula = null;
                supplierFormTitle.textContent = 'Crear Nuevo Proveedor';
                saveSupplierButton.textContent = 'Guardar Proveedor';
                cancelSupplierEditButton.classList.add('hidden');
                proveedorCedulaInput.removeAttribute('readonly');
            }

            function populateSupplierFormForEdit(supplier) {
                supplierModal.classList.remove('hidden'); 
                proveedorCedulaInput.value = supplier.cedula;
                proveedorCedulaInput.setAttribute('readonly', 'true');
                proveedorRazonSocialInput.value = supplier.razonSocial;
                proveedorCorreoInput.value = supplier.correo;
                proveedorTelefonoInput.value = supplier.telefono;
                proveedorFechaRegistroInput.value = supplier.fechaRegistro;
                editingSupplierCedula = supplier.cedula;
                supplierFormTitle.textContent = 'Editar Proveedor';
                saveSupplierButton.textContent = 'Actualizar Proveedor';
                cancelSupplierEditButton.classList.remove('hidden');
                supplierForm.scrollIntoView({ behavior: 'smooth' });
            }

            async function displaySuppliers(filter = '') {
            suppliersTableBody.innerHTML = '';
            const suppliers = await getAllSuppliers();
            let filteredSuppliers = suppliers;

            if (filter) {
                const lowerCaseFilter = filter.toLowerCase();
                filteredSuppliers = suppliers.filter(supplier =>
                    supplier.cedula.toLowerCase().includes(lowerCaseFilter) ||
                    supplier.razonSocial.toLowerCase().includes(lowerCaseFilter) ||
                    supplier.correo.toLowerCase().includes(lowerCaseFilter)
                );
            }

            if (filteredSuppliers.length === 0) {
                noSuppliersMessage.classList.remove('hidden');
            } else {
                noSuppliersMessage.classList.add('hidden');
                filteredSuppliers.forEach(supplier => {
                    const row = suppliersTableBody.insertRow();
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${supplier.cedula}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.razonSocial}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.correo || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.telefono || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.estado ? 'Activo' : 'Inactivo'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.fechaRegistro ? new Date(supplier.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button data-cedula="${supplier.cedula}" class="edit-supplier-btn text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                            <button data-cedula="${supplier.cedula}" class="delete-supplier-btn text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    `;
                });
            }
        }


            // --- Event Listeners ---

            // Lógica para el formulario de login
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const enteredUsername = usernameInput.value;
                const enteredPassword = passwordInput.value;

                console.log('Usuario ingresado:', enteredUsername);
                console.log('Contraseña ingresada:', enteredPassword);

                if (enteredUsername === VALID_USERNAME && enteredPassword === VALID_PASSWORD) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    errorMessage.classList.add('hidden');
                    showView('dashboard');
                    await openDatabase(); 
                    alert('¡Bienvenido! Inicio de sesión exitoso.');
                } else {
                    errorMessage.classList.remove('hidden');
                    console.error('Usuario o contraseña incorrectos.');
                }
            });

            // Lógica para el botón de cerrar sesión
            logoutButton.addEventListener('click', () => {
                sessionStorage.removeItem('isLoggedIn');
                showView('login');
                alert('Sesión cerrada. ¡Hasta pronto!');
            });

            // Lógica para los menús desplegables del dashboard
            menuToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const submenu = toggle.nextElementSibling;
                    const icon = toggle.querySelector('i.fa-chevron-down');

                    if (submenu.classList.contains('active')) {
                        submenu.classList.remove('active');
                        icon.classList.remove('rotate-180');
                    } else {
                        document.querySelectorAll('.submenu.active').forEach(openSubmenu => {
                            openSubmenu.classList.remove('active');
                            openSubmenu.previousElementSibling.querySelector('i.fa-chevron-down').classList.remove('rotate-180');
                        });
                        submenu.classList.add('active');
                        icon.classList.add('rotate-180');
                    }
                });
            });

            // Lógica para la navegación entre secciones del dashboard
            navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const targetId = link.dataset.target;
                    showContentSection(targetId);
                });
            });

            // Lógica para el formulario de usuario (Crear/Editar)
            userForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const user = {
                    cedula: cedulaInput.value,
                    nombreCompleto: nombreCompletoInput.value,
                    correoElectronico: correoElectronicoInput.value,
                    telefono: telefonoInput.value,
                    rol: rolSelect.value,
                    estado: userEstadoInput.value === "true",
                    fechaRegistro: userFechaRegistroInput.value || new Date().toISOString()
                };

                try {
                    if (editingCedula) {
                        await updateUser(user);
                        alert('Usuario actualizado con éxito.');
                    } else {
                        await addUser(user);
                        alert('Usuario creado con éxito.');
                    }
                    clearUserForm();
                    displayUsers(); 
                } catch (error) {
                    if (error.name === 'ConstraintError') {
                        alert('Error: Ya existe un usuario con esa cédula o correo electrónico.');
                    } else {
                        alert('Error al guardar el usuario: ' + error.message);
                    }
                }
            });

            // Lógica para el botón de cancelar edición de usuario
            cancelEditButton.addEventListener('click', () => {
                clearUserForm();
            });

            // Lógica para los botones de Editar y Eliminar en la tabla de usuarios (delegación de eventos)
            usersTableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-user-btn')) {
                    const cedulaToEdit = event.target.dataset.cedula;
                    const users = await getAllUsers();
                    const userToEdit = users.find(user => user.cedula === cedulaToEdit);
                    if (userToEdit) {
                        populateUserFormForEdit(userToEdit);
                    }
                } else if (event.target.classList.contains('delete-user-btn')) {
                    const cedulaToDelete = event.target.dataset.cedula;
                    if (await confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                        try {
                            await deleteUser(cedulaToDelete);
                            alert('Usuario eliminado con éxito.');
                            displayUsers(); 
                            clearUserForm();
                        } catch (error) {
                            alert('Error al eliminar usuario: ' + error.message);
                        }
                    }
                }
            });
            

            // Lógica para el buscador de usuarios
            userSearchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value;
                displayUsers(searchTerm);
            });

            // Lógica para el formulario de categoría 
            categoryForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const category = {
                    nombre: categoryNameInput.value.trim(),
                    descripcion: categoryDescriptionInput.value.trim(),
                    estado: categoryEstadoInput.value === "true",
                    fechaRegistro: categoryFechaRegistroInput.value || new Date().toISOString()
                };

                if (!category.nombre) {
                    alert('El nombre de la categoría no puede estar vacío.');
                    return;
                }

                try {
                    if (editingCategoryId !== null) {
                        category.id = editingCategoryId;
                        await updateCategory(category);
                        alert('Categoría actualizada con éxito.');
                    } else {
                        await addCategory(category);
                        alert('Categoría creada con éxito.');
                    }
                    clearCategoryForm();
                    displayCategories(); 
                } catch (error) {
                    if (error.name === 'ConstraintError') {
                        alert('Error: Ya existe una categoría con ese nombre.');
                    } else {
                        alert('Error al guardar la categoría: ' + error.message);
                    }
                }
            });

            // Lógica para el botón de cancelar edición de categoría
            cancelCategoryEditButton.addEventListener('click', () => {
                clearCategoryForm();
            });

            // Lógica para los botones de Editar y Eliminar en la tabla de categorías (delegación de eventos)
            categoriesTableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-category-btn')) {
                    const idToEdit = parseInt(event.target.dataset.id); 
                    const categories = await getAllCategories();
                    const categoryToEdit = categories.find(cat => cat.id === idToEdit);
                    if (categoryToEdit) {
                        populateCategoryFormForEdit(categoryToEdit);
                    }
                } else if (event.target.classList.contains('delete-category-btn')) {
                    const idToDelete = parseInt(event.target.dataset.id); 
                    if (await confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
                        try {
                            await deleteCategory(idToDelete);
                            alert('Categoría eliminada con éxito.');
                            displayCategories(); 
                            clearCategoryForm(); 
                        } catch (error) {
                            alert('Error al eliminar categoría: ' + error.message);
                        }
                    }
                }
            });

            // Lógica para el buscador de categorías
            categorySearchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value;
                displayCategories(searchTerm);
            });

            // Delegación de eventos para editar/eliminar
            productsTableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-product-btn')) {
                    const codigoToEdit = event.target.dataset.codigo;
                    const products = await getAllProducts();
                    const productToEdit = products.find(product => product.codigo === codigoToEdit);
                    if (productToEdit) {
                        populateProductFormForEdit(productToEdit);
                    }
                } else if (event.target.classList.contains('delete-product-btn')) {
                    const codigoToDelete = event.target.dataset.codigo;
                    if (await confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                        try {
                            await deleteProduct(codigoToDelete);
                            alert('Producto eliminado con éxito.');
                            displayProducts();
                            clearProductForm();
                        } catch (error) {
                            alert('Error al eliminar producto: ' + error.message);
                        }
                    }
                }
            });

            // Descargar productos en Excel
            downloadProductsExcelBtn.addEventListener('click', async () => {
                const products = await getAllProducts();

                const excelData = products.map(prod => ({
                    Código: prod.codigo,
                    Nombre: prod.nombre,
                    Descripción: prod.descripcion,
                    Categoría: prod.categoriaNombre || prod.idCategoria,
                    Stock: prod.stock,
                    'Precio Compra': prod.precioCompra,
                    'Precio Venta': prod.precioVenta,
                    Estado: prod.estado ? 'Activo' : 'Inactivo',
                    'Fecha Registro': prod.fechaRegistro ? new Date(prod.fechaRegistro).toLocaleDateString() : ''
                }));

                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

                XLSX.writeFile(workbook, "productos.xlsx");
            });

            // Llenar el select de categorías en el formulario de producto
            async function fillCategorySelect() {
                const categories = await getAllCategories();
                productoCategoriaInput.innerHTML = '';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.nombre; 
                    option.dataset.nombre = cat.nombre; 
                    productoCategoriaInput.appendChild(option);
                });
            }

            // Llama a fillCategorySelect cada vez que abras el modal de producto
            openProductModalBtn.addEventListener('click', () => {
                fillCategorySelect();
                productModal.classList.remove('hidden');
                productForm.reset();
                cancelProductEditButton.classList.add('hidden');
                document.getElementById('productFormTitle').textContent = 'Crear Nuevo Producto';
            });

            // --- Event Listeners para Clientes ---
            clientForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const client = {
                    cedula: clienteCedulaInput.value,
                    nombre: clienteNombreInput.value,
                    telefono: clienteTelefonoInput.value,
                    direccion: clienteDireccionInput.value,
                    correo: clienteCorreoInput.value,
                    estado: clienteEstadoInput.value === "true",
                    fechaRegistro: clienteFechaRegistroInput.value || new Date().toISOString()
                };

                try {
                    if (editingClientCedula) {
                        await updateClient(client);
                        alert('Cliente actualizado con éxito.');
                    } else {
                        await addClient(client);
                        alert('Cliente creado con éxito.');
                    }
                    clearClientForm();
                    displayClients();
                } catch (error) {
                    if (error.name === 'ConstraintError') {
                        alert('Error: Ya existe un cliente con esa cédula.');
                    } else {
                        alert('Error al guardar el cliente: ' + error.message);
                    }
                }
            });

            cancelClientEditButton.addEventListener('click', () => {
                clearClientForm();
            });

            clientsTableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-client-btn')) {
                    const cedulaToEdit = event.target.dataset.cedula;
                    const clients = await getAllClients();
                    const clientToEdit = clients.find(client => client.cedula === cedulaToEdit);
                    if (clientToEdit) {
                        populateClientFormForEdit(clientToEdit);
                    }
                } else if (event.target.classList.contains('delete-client-btn')) {
                    const cedulaToDelete = event.target.dataset.cedula;
                    if (await confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
                        try {
                            await deleteClient(cedulaToDelete);
                            alert('Cliente eliminado con éxito.');
                            displayClients();
                            clearClientForm();
                        } catch (error) {
                            alert('Error al eliminar cliente: ' + error.message);
                        }
                    }
                }
            });

            clientSearchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value;
                displayClients(searchTerm);
            });

            // --- Event Listeners para Proveedores ---
            supplierForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const supplier = {
                    cedula: proveedorCedulaInput.value,
                    razonSocial: proveedorRazonSocialInput.value,
                    correo: proveedorCorreoInput.value,
                    telefono: proveedorTelefonoInput.value,
                    fechaRegistro: proveedorFechaRegistroInput.value,
                    estado: proveedorEstadoInput.value === "true",
                    fechaRegistro: proveedorFechaRegistroInput.value || new Date().toISOString()
                };

                try {
                    if (editingSupplierCedula) {
                        await updateSupplier(supplier);
                        alert('Proveedor actualizado con éxito.');
                    } else {
                        await addSupplier(supplier);
                        alert('Proveedor creado con éxito.');
                    }
                    clearSupplierForm();
                    displaySuppliers();
                } catch (error) {
                    if (error.name === 'ConstraintError') {
                        alert('Error: Ya existe un proveedor con esa cédula.');
                    } else {
                        alert('Error al guardar el proveedor: ' + error.message);
                    }
                }
            });

            cancelSupplierEditButton.addEventListener('click', () => {
                clearSupplierForm();
            });

            suppliersTableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-supplier-btn')) {
                    const cedulaToEdit = event.target.dataset.cedula;
                    const suppliers = await getAllSuppliers();
                    const supplierToEdit = suppliers.find(supplier => supplier.cedula === cedulaToEdit);
                    if (supplierToEdit) {
                        populateSupplierFormForEdit(supplierToEdit);
                    }
                } else if (event.target.classList.contains('delete-supplier-btn')) {
                    const cedulaToDelete = event.target.dataset.cedula;
                    if (await confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
                        try {
                            await deleteSupplier(cedulaToDelete);
                            alert('Proveedor eliminado con éxito.');
                            displaySuppliers();
                            clearSupplierForm();
                        } catch (error) {
                            alert('Error al eliminar proveedor: ' + error.message);
                        }
                    }
                }
            });

            supplierSearchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value;
                displaySuppliers(searchTerm);
            });
            
            
            // --- Inicialización ---
            // Verificar si el usuario ya está "logueado" (simulación con sessionStorage)
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                showView('dashboard');
                openDatabase().then(async () => {
                    const logoImg = document.getElementById('dashboardLogo');
                    const business = await getBusiness();
                    if (business && business.logo && logoImg) {
                        logoImg.src = business.logo;
                    }
                });
            } else {
                showView('login');
            }

            // Función para mostrar mensajes personalizados en lugar de alert()
            function alert(message) {
                const existingModal = document.getElementById('customAlertModal');
                if (existingModal) existingModal.remove();

                const modalHtml = `
                    <div id="customAlertModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
                            <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
                            <button id="closeAlertButton" class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Aceptar
                            </button>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);

                document.getElementById('closeAlertButton').addEventListener('click', () => {
                    document.getElementById('customAlertModal').remove();
                });
            }

            // Función para mostrar un modal de confirmación personalizado
            function confirm(message) {
                return new Promise((resolve) => {
                    const existingModal = document.getElementById('customConfirmModal');
                    if (existingModal) existingModal.remove();

                    const modalHtml = `
                        <div id="customConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
                                <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
                                <div class="flex justify-center space-x-4">
                                    <button id="confirmYesButton" class="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Sí
                                    </button>
                                    <button id="confirmNoButton" class="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    document.getElementById('confirmYesButton').addEventListener('click', () => {
                        document.getElementById('customConfirmModal').remove();
                        resolve(true);
                    });

                    document.getElementById('confirmNoButton').addEventListener('click', () => {
                        document.getElementById('customConfirmModal').remove();
                                                resolve(false);
                    });
                });
            }

            // Para mostrar los clientes al activar la sección
            function showContentSection(sectionId) {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                if (sectionId === 'usersSection') {
                    displayUsers();
                } else if (sectionId === 'categorySection') {
                    displayCategories();
                } else if (sectionId === 'clientSection') {
                    displayClients();
                }
            }

            // Para mostrar los negocios al activar la sección
            function showContentSection(sectionId) {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                const sectionElement = document.getElementById(sectionId);
                if (sectionElement) {
                    sectionElement.classList.add('active');

                    if (sectionId === 'usersSection') {
                        displayUsers();
                    } else if (sectionId === 'categorySection') {
                        displayCategories();
                    } else if (sectionId === 'clientSection') {
                        displayClients();
                    } else if (sectionId === 'supplierSection') {
                        displaySuppliers();
                    }
                } else {
                    console.warn(`No existe el elemento con id: ${sectionId}`);
                }
            }

            // Para mostrar los proveedores al activar la sección
            function showContentSection(sectionId) {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                if (sectionId === 'usersSection') {
                    displayUsers();
                } else if (sectionId === 'categorySection') {
                    displayCategories();
                } else if (sectionId === 'clientSection') {
                    displayClients();
                } else if (sectionId === 'supplierSection') {
                    displaySuppliers();
                }
            }
        });