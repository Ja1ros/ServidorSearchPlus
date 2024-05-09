const sql = require("mssql");
var config = require("../DataBase/dbconfig");

const Listar = async () => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .query("Select * from producto  ");
  pool.close();
  return user.recordset;
};

const ListarPorCategoria = async (categoria) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("categoria", sql.Int, categoria)
    .query("Select * from producto where ID_CAT = @categoria and estado > 0 ");
  pool.close();
  return user.recordset;
};

const getByID = async (id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input('id', sql.Int, id)
    .query("Select * from producto where ID = @id");
  pool.close();
  return user.recordset[0];
};

const ListarPag = async (pag) => {
  let pool = await sql.connect(config);
  let user = await pool.request().input("Pag", sql.Int, pag).query(` 
          select * FROM [dbBusqueda].[dbo].[Producto]
          where estado > 0
          order by ID
          offset @Pag*10 ROWS
          FETCH NEXT 10 ROWS only
  `);
  pool.close();
  return user.recordset;
};

const BuscarPag = async (pag, text) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("Pag", sql.Int, pag)
    .input("texto", sql.VarChar, text).query(` 
              select * FROM [dbBusqueda].[dbo].[Producto]
              where estado > 0
              and  ( Nombre like '%'+@texto+'%'  or ImgUrl like '%'+@texto+'%' or Precio like '%'+@texto+'%' or Stock like '%'+@texto+'%')
              order by ID
              offset @Pag*10 ROWS
              FETCH NEXT 10 ROWS only
  `);
  pool.close();
  return user.recordset;
};

const CreateProduct = async (nombre, img, precio, peso, stock, codigo, categoria) => {
  let pool = await sql.connect(config);
   console.log(nombre,img,precio,peso,stock,codigo,categoria)
  let user = await pool
    .request()
    .input("nombre", sql.NVarChar, nombre)
    .input("img", sql.NVarChar, img)
    .input("precio", sql.Decimal(12,2), precio)
    .input("peso", sql.Decimal(12,4), peso)
    .input("stock", sql.Int, stock)
    .input("codigo", sql.NVarChar, codigo)
    .input("categoria", sql.Int, categoria).query(`INSERT INTO [dbo].[Producto]
                        ([Nombre]
                        ,[ImgUrl]
                        ,[Precio]
                        ,[Peso]
                        ,[Stock]
                        ,[Estado]
                        ,[Codigo]
                        ,[ID_CAT])
                    VALUES
                        (@nombre
                        ,@img
                        ,@precio
                        ,@peso
                        ,@stock
                        ,1
                        ,@codigo
                        ,@categoria)`);
  pool.close();
  return user.rowsAffected;
};

const UpdateProduct = async (id, nombre, img, precio, peso, stock, estado, codigo, categoria) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombre", sql.NVarChar, nombre)
    .input("img", sql.NVarChar, img)
    .input("precio", sql.Decimal(12,2), precio)
    .input("peso", sql.Decimal(12,4), peso)
    .input("estado", sql.Int, estado)
    .input("stock", sql.Int, stock)
    .input("codigo", sql.NVarChar, codigo)
    .input("categoria", sql.Int, categoria).query(`UPDATE [dbo].[Producto]
      SET [Nombre] =@nombre
         ,[ImgUrl] = @img
         ,[Precio] = @precio
         ,[Peso] = @peso
         ,[Stock] = @stock
         ,[Estado] = @estado
         ,[Codigo] = @codigo
         ,[ID_CAT] = @categoria
    WHERE id = @id`);
  pool.close();
  return user.rowsAffected;
};


const UpdateProductU = async (id, peso) => {
  try {
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input("id", sql.Int, id)
      .input("peso", sql.Decimal(12,4), peso)
      .query(`
        UPDATE [dbo].[Producto]
        SET 
            [Peso] = @peso
        WHERE id = @id
      `);
    pool.close();

  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};


const DeleteProduct = async (id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM [dbo].[Producto] WHERE id = @id");
  pool.close();
  return user.rowsAffected;
}; 

module.exports = {
  Listar,
  ListarPorCategoria,
  CreateProduct,
  UpdateProduct,
  UpdateProductU,
  ListarPag,
  BuscarPag,
  getByID,
  DeleteProduct
};
