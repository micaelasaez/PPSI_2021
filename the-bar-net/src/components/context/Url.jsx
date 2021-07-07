const baseURL = 'http://localhost:4200';

export const TheBarNetServerUrl = { 
    login: baseURL + '/login',
    verifyToken: baseURL + '/login/verify',
    users: baseURL + '/usuarios',
    usersType: baseURL + '/usuarios/type/',
    products: baseURL + '/productos',
    productPhoto: baseURL + '/productos/upload/',
    pedido: baseURL + '/pedidos',
    pedidosUsuario: baseURL + '/pedidos/user/',
    category: baseURL + '/categorias/',
    ofertas: baseURL + '/ofertas/',
    combos: baseURL + '/combos/'
};