import { query } from "../db.js";

const getAlbumes = async (_, res) => {
    // Completar con la consulta que devuelve todos los albumes
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        [
            {
                "id": 1,
                "nombre": "Nombre del album",
                "nombre_artista": "Nombre del artista"
            },
            {
                "id": 2,
                "nombre": "Nombre del album",
                "nombre_artista": "Nombre del artista"
            },
            ...
        ]
    */
   try {
        const result = await query(`
            SELECT
            albumes.id
            albumes.nombre
            artistas.nombre AS nombre_artista
            FROM albumes
            JOIN artistas ON albumes.artista = artista.id `,
            [req.params.id]);
            res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los albumes", error);
        res.status(500).json({ error: "Error al obtener los albumes" });
     }   
};

const getAlbum = async (req, res) => {
    // Completar con la consulta que devuelve un album por id
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        {
            "id": 1,
            "nombre": "Nombre del album",
            "nombre_artista": "Nombre del artista"
        }
    */
   try {
        const result = await query(`
            SELECT
            abumes.id
            albumes.nombre
            artistas.nombre AS nombre_artista
            FROM albumes
            JOIN artistas ON albumes.artista = artista.id
            WHERE albumes.id = $1`,
             [req.params.id]);
             res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener el album:", error);
        res.status(500).json({ error: "Error al obtener el album" });
    }
}; 


const createAlbum = async (req, res) => {
    // Completar con la consulta que crea un album
    // Recordar que los parámetros de una consulta POST se encuentran en req.body
    // Deberían recbir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre del album",
            "artista": "Id del artista"
        }
    */
       try {
    const {nombre , artista} = req.body;
        await query(`
            INSERT INTO albumes
            (nombre, artista)
            VALUES($1,$2)`,
             [nombre, artista]);
              res.status(201).json({ nombre , artista});
    } catch (error) {
        console.error("Error al crear un album:", error);
        res.status(500).json({ error:"Error al crear un album" });
    }
};
const updateAlbum = async (req, res) => {
    // Completar con la consulta que actualiza un album
    // Recordar que en este caso tienen parámetros en req.params (el id) y en req.body (los demás datos)
    // Deberían recbir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre del album",
            "artista": "Id del artista"
        }
    */
    try {
        const { nombre, artista } = req.body;
        await query(`
            UPADATE album
            SET (nombre, artista) = ($1,$2) WHERE id = $3`,[
            nombre,artista
            ]); 
        res.json({ nombre, artista});
} catch (error) {
        console.error("Error al actualizar el album:", error);
        res.status(500).json({ error: "Error al el album" });
    }
};
const deleteAlbum = async (req, res) => {
    // Completar con la consulta que elimina un album
    // Recordar que los parámetros de una consulta DELETE se encuentran en req.params
 try{
        const canciones = await query(`
            SELECT * 
            FROM canciones 
            WHERE id = $1`,
            [req.params.id]);
            if (canciones.rows.length > 0) {
            return res.status(400).json({ error: "El album tiene canciones asociadas" });
        }
        await query(`
            DELETE 
            FROM albumes
            WHERE id =$1`,
           [req.params.id]);
           res.sendStatus(204);
    } catch (error) {
        console.error("Error al eliminar un album:", error);
        res.status(500).json({ error: "Error al eliminar un album" });
    }
};

const getCancionesByAlbum = async (req, res) => {
    // Completar con la consulta que devuelve las canciones de un album
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la misma forma que getCanciones
    SELECT

};

const albumes = {
    getAlbumes,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getCancionesByAlbum,
};

export default albumes;