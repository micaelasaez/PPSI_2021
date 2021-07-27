const baseURL = 'http://localhost:4200';

export const TheBarNetServerUrl = { 
    login: baseURL + '/login',
    verifyToken: baseURL + '/login/verify',
    users: baseURL + '/usuarios',
    usersType: baseURL + '/usuarios/type/',
    products: baseURL + '/productos',
    productPhoto: baseURL + '/productos/upload/',
    pedido: baseURL + '/pedidos',
    addPedProd: baseURL + '/pedidos/pedprod/',
    productoPedido: baseURL + '/pedidos/prod',
    pedidosUsuario: baseURL + '/pedidos/user/',
    categoryPhoto: baseURL + '/categorias/upload/',
    ofertas: baseURL + '/ofertas/',
    combos: baseURL + '/combos/',
    sucursal: baseURL + '/sucursal',
    promoBancos: baseURL + '/promobancos',
    bancos: baseURL + '/bancos',
    preciosEnvios: baseURL + '/precioenvios',
    envios: baseURL + '/envios',
    enviosEntrega: baseURL + '/envios/entrega',
    tarjetas: baseURL + '/tarjetas',
    categorias: baseURL +'/categorias'
};