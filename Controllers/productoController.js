const { response } = require("express");
const ResponseApi = require("../Models/response");

const {
  Listar,
  ListarPorCategoria,
  CreateProduct,
  UpdateProduct,
  UpdateProductU,
  ListarPag,
  BuscarPag,
  getByID,
  DeleteProduct
  
} = require("../Helpers/AuxDBProductos");
const { ClienteGet } = require("./clientesController");

const ProductosGet = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const listar = await Listar();
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetPorCategoria = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { categoria } = req.params;
    const listar = await ListarPorCategoria(categoria);

    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetID = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id } = req.params;
    const listar = await getByID(id);
    console.log(listar)

    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(listar);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetPag = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { pag } = req.params;

    if (pag - 1 < 0) {
      responseApi.status = 400;
      responseApi.msg = "Página debe ser mayor a 0";
      responseApi.data = null;
      return res.status(400).json(responseApi);
    }

    let pagina = pag - 1;
    const listar = await ListarPag(pagina);
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};


const ProductosGetBuscar = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { pag } = req.params;
    const { text} = req.body;
console.log(text)
    if (pag - 1 < 0) {
      responseApi.status = 400;
      responseApi.msg = "Página debe ser mayor a 0";
      responseApi.data = null;
      return res.status(400).json(responseApi);
    }

    let pagina = pag - 1;
    const listar = await BuscarPag(pagina, text);
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosPostU = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    console.log(req.body);
    const { nombre, img, precio, peso, stock, codigo, categoria } = req.body;
    const create = await CreateProduct(nombre, img, precio, peso, stock, codigo, categoria);
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise los datos";
      return res.status(500).json(responseApi);
    }
    responseApi.status = 200;
    responseApi.msg = "Producto Guardado";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosPost = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    console.log(req.body);
    const { Nombre, ImgUrl, Precio, Peso, Stock, Codigo, ID_CAT} = req.body;
    const create = await CreateProduct(Nombre, ImgUrl, Precio, Peso, Stock, Codigo, ID_CAT);
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise los datos";
      return res.status(500).json(responseApi);
    }
    responseApi.status = 200;
    responseApi.msg = "Producto Guardado";
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosPut = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id, nombre, img, precio, peso, stock, estado, codigo, categoria } = req.body;

    const create = await UpdateProduct(
      id,
      nombre,
      img,
      precio,
      peso,
      stock,
      estado,
      codigo,
      categoria 
    );
    console.log(create)
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise los datos";
      return res.status(500).json(responseApi);
    }
    responseApi.status = 200;
    responseApi.msg = "Producto Update";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosPutU = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id } = req.params;
    const {peso} = req.body;
    
    const update = await UpdateProductU(id, peso);

    if (update > 0) {
      responseApi.status = 500;
      responseApi.msg = "Error interno del servidor";
      return res.status(200).json(responseApi);
    } else {
      responseApi.status = 200;
      responseApi.msg = "Producto actualizado correctamente";
      console.log("peso update:",peso)
      return res.status(500).json(responseApi);
    }
  }  catch (error) {
    return res.status(500).json({
      status: "Bad Response"
    });
  }
}

const productoDelete = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id } = req.params; // Obtener el ID del producto a eliminar
    const product = await getByID(id); // Obtener información del producto antes de eliminarlo (opcional)
    
    if (!product) {
      responseApi.status = 404;
      responseApi.msg = "Producto no encontrado";
      return res.status(404).json(responseApi);
    }

    const deleted = await DeleteProduct(id); // Eliminar el producto

    if (deleted > 0) {
      responseApi.status = 200;
      responseApi.msg = "Producto eliminado correctamente";
      return res.status(200).json(responseApi);
    } else {
      responseApi.status = 500;
      responseApi.msg = "Error al eliminar el producto";
      return res.status(500).json(responseApi);
    }
  }  catch (error) {
    return res.status(500).json({
      status: "Bad Response",
      msg: error.originalError.info,
    });
  }
}

module.exports = {
  ProductosGet,
  ProductosGetPorCategoria,
  ProductosPost,
  ProductosPostU,
  ProductosPut,
  ProductosPutU,
  productoDelete,
  ProductosGetID,
  ProductosGetPag,
  ProductosGetBuscar
};
