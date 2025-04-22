const { Router } = require("express");
const { rolesPermitidos } = require("../Middlewares/validarRol");
const { check } = require("express-validator");
const { validarJWT, validarJWTClient } = require("../Middlewares/validarJWT");
const {
  ProductosGet,
  ProductosGetPorCategoria,
  ProductosPost,
  ProductosPostU,
  ProductosPut,
  ProductosPutU,
  ProductosGetPag,
  ProductosGetBuscar,
  ProductosGetID,
  productoDelete

} = require("../Controllers/productoController");
const { validarCampos } = require("../Middlewares/validarCampos");
const router = Router();
router.get("/", validarJWT, rolesPermitidos("Admin", "User"), ProductosGet);
router.get("/mov", validarJWTClient, rolesPermitidos("Client", "User"), ProductosGet);

router.get(
  "/mov/Pag/:pag",
  check("pag", "Pag obligatorio un entero mayor que cero").isInt(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  ProductosGetPag
);

router.get(
  "/mov/Buscar/:pag",
  check("pag", "Pag obligatorio un entero mayor que cero").isInt(),
  check("text", "Ingrese el texto a buscar").notEmpty(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  ProductosGetBuscar
);

router.get("/categoria/:categoria", ProductosGetPorCategoria);
router.get("/Buscador/:id", ProductosGetID);
router.post("/", validarJWT, rolesPermitidos("Admin", "User", "Client"), ProductosPostU);
router.post("/", validarJWTClient, rolesPermitidos("Client"), ProductosPostU);
router.post("/mov", validarJWT, rolesPermitidos("Admin", "User","Client"), ProductosPost);
router.post("/new", ProductosPost);
router.put("/", validarJWT, rolesPermitidos("Admin", "User", "Client"), ProductosPut);
router.put("/mov/:id", ProductosPutU);

router.delete(
    "/del/:id",
    check("id", "ID de producto debe ser un entero").isInt(),
    validarCampos,
    validarJWTClient,
    rolesPermitidos("Client"),
    productoDelete
)

module.exports = router;
